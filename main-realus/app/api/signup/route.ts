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

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const newUser = new User({ 
            name, email, password, confirmPassword, mobile, 
            companyName, teamName, address, companyPhone, 
            city, state, pinCode, timeZone, brokerId, 
            role: validRole // Use the validated role
        });

        await newUser.save();

        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error:error}, { status: 500 });
    }
}
