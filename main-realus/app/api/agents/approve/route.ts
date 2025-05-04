import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for agent approval');
        
        // Parse the request body
        const body = await req.json();
        console.log('Request body:', body);
        
        const { agentId, approved } = body;
        
        if (!agentId) {
            console.log('No agent ID provided');
            return NextResponse.json({ message: 'Agent ID is required' }, { status: 400 });
        }
        
        // Validate the agent ID format
        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            console.log('Invalid agent ID format:', agentId);
            return NextResponse.json({ message: 'Invalid agent ID format' }, { status: 400 });
        }
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            console.log('No token provided');
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
            console.log('Decoded token for agent approval:', decoded);
        } catch (error) {
            console.error('Token verification error:', error);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Find the broker by ID
        const broker = await User.findById(decoded.id);
        
        if (!broker) {
            console.log('Broker not found with ID:', decoded.id);
            return NextResponse.json({ message: 'Broker not found' }, { status: 404 });
        }
        
        if (broker.role !== Role.Broker) {
            console.log('User is not a broker:', broker.role);
            return NextResponse.json({ message: 'Only brokers can approve agents' }, { status: 403 });
        }
        
        console.log('Broker found:', {
            id: broker._id.toString(),
            name: broker.name,
            role: broker.role
        });
        
        // Find the agent by ID
        const agent = await User.findById(agentId);
        
        if (!agent) {
            console.log('Agent not found with ID:', agentId);
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }
        
        console.log('Agent found:', {
            id: agent._id.toString(),
            name: agent.name,
            role: agent.role,
            isApproved: agent.isApproved
        });
        
        // Update the agent's approval status directly using updateOne
        const result = await User.updateOne(
            { _id: agentId },
            { $set: { isApproved: approved } }
        );
        
        console.log('Update result:', result);
        
        if (result.modifiedCount === 0) {
            console.log('Failed to update agent with ID:', agentId);
            return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
        }
        
        // Get the updated agent
        const updatedAgent = await User.findById(agentId);
        
        console.log('Agent updated successfully:', {
            id: updatedAgent._id.toString(),
            name: updatedAgent.name,
            isApproved: updatedAgent.isApproved
        });
        
        return NextResponse.json({ 
            message: approved ? 'Agent approved successfully' : 'Agent rejected successfully',
            agent: {
                id: updatedAgent._id,
                name: updatedAgent.name,
                email: updatedAgent.email,
                isApproved: updatedAgent.isApproved
            }
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error in agent approval:', error);
        return NextResponse.json({ 
            message: 'Server error processing agent approval', 
            error: error.message 
        }, { status: 500 });
    }
}