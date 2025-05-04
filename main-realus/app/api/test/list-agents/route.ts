import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';

// This is a test endpoint to list all agents and their approval status
export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for test agent list');
        
        // Find all agents and TCs
        const agents = await User.find({ 
            role: { $in: [Role.Agent, Role.Tc] }
        });
        
        console.log(`Found ${agents.length} total agents/TCs`);
        
        // Format the response data
        const formattedAgents = agents.map(agent => ({
            id: agent._id.toString(),
            name: agent.name,
            email: agent.email,
            role: agent.role,
            isApproved: agent.isApproved,
            brokerId: agent.brokerId,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt
        }));
        
        return NextResponse.json({ 
            agents: formattedAgents
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching test agent list:', error);
        return NextResponse.json({ 
            message: 'Server error fetching agents', 
            error: error.message 
        }, { status: 500 });
    }
}