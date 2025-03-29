import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/userModel';
import { signupSchema } from '../../../validators/userValidator';

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method is not allowed' }, { status: 405 });
    }

    try {
        await dbConnect(); 

        const body = await req.json();

        
        const validation = signupSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Validation failed', errors: validation.error.errors }, { status: 400 });
        }

       
        const newUser = new User(body);
        await newUser.save();

        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error: error }, { status: 500 });
    }
}
