import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/userModel';

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
            city, state, pinCode, timeZone, brokerId,role 
        } = body;

        
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
            city, state, pinCode, timeZone,brokerId, role 
        });

        await newUser.save();

        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error:error}, { status: 500 });
    }
}
