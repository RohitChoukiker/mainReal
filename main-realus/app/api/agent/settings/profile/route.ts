import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

// GET endpoint to fetch profile information
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Find the user in the database
        const user = await User.findById(decoded.id).select('-password -confirmPassword');
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        // Return the user's profile information
        return NextResponse.json({ 
            success: true,
            data: user
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching profile information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT endpoint to update profile information
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Get the request body
        const body = await req.json();
        
        // Fields that can be updated
        const allowedFields = [
            'name', 
            'mobile', 
            'address', 
            'city', 
            'state', 
            'pinCode', 
            'timeZone',
            'companyName',
            'teamName',
            'companyPhone'
        ];
        
        // Create an object with only the allowed fields
        const updateData: Record<string, any> = {};
        for (const field of allowedFields) {
            if (field in body) {
                updateData[field] = body[field];
            }
        }
        
        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -confirmPassword');
        
        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        // Return the updated user information
        return NextResponse.json({ 
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error updating profile information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}