import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

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
        
        // Find the user in the database to get the latest status
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        // Normalize the role for frontend consistency
        let normalizedRole = user.role;
        if (user.role === "TransactionCoordinator") {
            normalizedRole = "Tc";
        }
        
        // Return the user's approval status with normalized role
        return NextResponse.json({ 
            isApproved: user.isApproved,
            role: normalizedRole
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}