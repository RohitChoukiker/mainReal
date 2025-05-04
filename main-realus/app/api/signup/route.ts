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
            city, state, pinCode, timeZone, brokerId, role 
        } = body;
        
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
        
        // Check if broker ID is required but not provided
        if (validRole !== Role.Broker && !brokerId) {
            return NextResponse.json({ message: 'Broker ID is required for agents and transaction coordinators' }, { status: 400 });
        }
        
        // If user is an agent or TC, verify that the broker ID exists
        if (validRole !== Role.Broker && brokerId) {
            const broker = await User.findOne({ brokerId: brokerId, role: Role.Broker });
            if (!broker) {
                console.log(`No broker found with ID: ${brokerId}`);
                return NextResponse.json({ message: 'Invalid broker ID. Please enter a valid broker ID.' }, { status: 400 });
            }
            console.log(`Found broker with ID ${brokerId}: ${broker.name}`);
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }
        
        // For brokers, ensure they have a broker ID
        if (validRole === Role.Broker) {
            if (!brokerId) {
                // Generate a broker ID if not provided
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let generatedId = "";
                for (let i = 0; i < 11; i++) {
                    generatedId += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                brokerId = generatedId;
                console.log('Generated broker ID for broker:', brokerId);
            }
            
            // Check if broker ID is unique
            const existingBroker = await User.findOne({ brokerId });
            if (existingBroker) {
                return NextResponse.json({ message: 'This broker ID is already in use. Please generate a new one.' }, { status: 400 });
            }
        }

        // Set approval status based on role
        // Brokers are auto-approved, agents and TCs need approval
        const isApproved = validRole === Role.Broker;

        const newUser = new User({ 
            name, email, password, confirmPassword, mobile, 
            companyName, teamName, address, companyPhone, 
            city, state, pinCode, timeZone, brokerId, 
            role: validRole, // Use the validated role
            isApproved // Set approval status
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
