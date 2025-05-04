import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';
import mongoose from 'mongoose';

// This is a test endpoint to directly approve an agent by ID
export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for test agent approval');
        
        // Parse the request body
        const body = await req.json();
        console.log('Request body:', body);
        
        const { agentId } = body;
        
        if (!agentId) {
            console.log('No agent ID provided');
            return NextResponse.json({ message: 'Agent ID is required' }, { status: 400 });
        }
        
        // Validate the agent ID format
        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            console.log('Invalid agent ID format:', agentId);
            return NextResponse.json({ message: 'Invalid agent ID format' }, { status: 400 });
        }
        
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
        
        // Update the agent's approval status directly
        agent.isApproved = true;
        await agent.save();
        
        console.log('Agent approved successfully:', {
            id: agent._id.toString(),
            name: agent.name,
            isApproved: agent.isApproved
        });
        
        return NextResponse.json({ 
            message: 'Agent approved successfully',
            agent: {
                id: agent._id.toString(),
                name: agent.name,
                email: agent.email,
                isApproved: agent.isApproved
            }
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error in test agent approval:', error);
        return NextResponse.json({ 
            message: 'Server error processing agent approval', 
            error: error.message 
        }, { status: 500 });
    }
}