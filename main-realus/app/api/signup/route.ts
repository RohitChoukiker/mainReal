import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User, { Role } from '../../../models/userModel';

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method is not allowed' }, { status: 405 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        
        const { 
            name, email, password, confirmPassword, mobile, 
            companyName, teamName, address, companyPhone, 
            city, state, pinCode, timeZone, role 
        } = body;
        
        // Use let for brokerId since we might need to modify it later
        let brokerId = body.brokerId;
        
        console.log("Received role:", role);
        
        // Convert the role string to the correct enum value
        let validRole;
        if (role === "Agent") {
            validRole = Role.Agent;
        } else if (role === "Broker") {
            validRole = Role.Broker;
        } else if (role === "TransactionCoordinator") {
            validRole = Role.Tc;
        } else {
            console.log("Invalid role received:", role);
            return NextResponse.json({ 
                message: `Invalid role: ${role}. Valid roles are: Agent, Broker, TransactionCoordinator` 
            }, { status: 400 });
        }
        
        console.log("Converted to valid role:", validRole);

        
        if (!name || !email || !password || !confirmPassword || !mobile || !role) {
            return NextResponse.json({ message: 'Required fields are missing' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
        }
        
        
        if (validRole !== Role.Broker && !brokerId) {
            return NextResponse.json({ message: 'Broker ID is required for agents and transaction coordinators' }, { status: 400 });
        }
       
        if (validRole !== Role.Broker && brokerId) {
            console.log(`Using provided broker ID: ${brokerId} without validation`);

        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        
        // For brokers, ensure they have a broker ID
        if (validRole === Role.Broker) {
            if (!brokerId) {
                
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let generatedId = "";
                for (let i = 0; i < 11; i++) {
                    generatedId += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                brokerId = generatedId;
                console.log('Generated broker ID for broker:', brokerId);
            }
            
      
            const existingBroker = await User.findOne({ brokerId });
            if (existingBroker) {
                return NextResponse.json({ message: 'This broker ID is already in use. Please generate a new one.' }, { status: 400 });
            }
        }

        
        const isApproved = validRole === Role.Broker;

        const newUser = new User({ 
            name, email, password, confirmPassword, mobile, 
            companyName, teamName, address, companyPhone, 
            city, state, pinCode, timeZone, brokerId, 
            role: validRole, 
            isApproved 
        });

        await newUser.save();

        return NextResponse.json({ 
            message: 'User created successfully', 
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                brokerId: newUser.brokerId,
                isApproved: newUser.isApproved
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
