import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';
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
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (!broker) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        if (broker.role !== Role.Broker) {
            return NextResponse.json({ message: 'Only brokers can access this endpoint' }, { status: 403 });
        }
        
        // Return the broker's information
        return NextResponse.json({ 
            id: broker._id,
            name: broker.name,
            email: broker.email,
            brokerId: broker.brokerId,
            role: broker.role
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching broker info:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}