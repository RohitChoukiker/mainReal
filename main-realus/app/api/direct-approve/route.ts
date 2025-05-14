import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User, { User as UserType } from '../../../models/userModel';
import mongoose from 'mongoose';

// This is a direct endpoint to approve or reject an agent without any authentication
// USE THIS ONLY FOR TESTING
export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for direct agent approval/rejection');
        
        // Parse the request body
        const body = await req.json();
        console.log('Request body:', body);
        
        const { agentId, approved = true } = body;
        
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
        const agent = await User.findById(agentId) as UserType;
        
        if (!agent) {
            console.log('Agent not found with ID:', agentId);
            return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
        }
        
        console.log('Agent found:', {
            id: agent.id.toString(),
            name: agent.name,
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
        const updatedAgent = await User.findById(agentId) as UserType;
        
        if (!updatedAgent) {
            console.log('Failed to retrieve updated agent with ID:', agentId);
            return NextResponse.json({ message: 'Failed to retrieve updated agent' }, { status: 500 });
        }
        
        console.log('Agent updated successfully:', {
            name: updatedAgent.name,
            isApproved: updatedAgent.isApproved
        });
        
        return NextResponse.json({ 
            message: approved ? 'Agent approved successfully' : 'Agent rejected successfully',
            agent: {
                id: updatedAgent.id.toString(),
                name: updatedAgent.name,
                email: updatedAgent.email,
                isApproved: updatedAgent.isApproved
            }
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error in direct agent approval/rejection:', error);
        return NextResponse.json({ 
            message: 'Server error processing agent status update', 
            error: error.message 
        }, { status: 500 });
    }
}