import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User, { Role } from '../../../models/userModel';

// This is a direct endpoint to list agents without authentication
// USE THIS ONLY FOR TESTING
export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for direct agent list');
        
        // Get the broker ID from the query parameters
        const brokerId = req.nextUrl.searchParams.get('brokerId');
        
        if (!brokerId) {
            console.log('No broker ID provided');
            return NextResponse.json({ message: 'Broker ID is required' }, { status: 400 });
        }
        
        // Find the broker by ID
        const broker = await User.findOne({ brokerId, role: Role.Broker });
        
        if (!broker) {
            console.log('Broker not found with ID:', brokerId);
            return NextResponse.json({ message: 'Broker not found' }, { status: 404 });
        }
        
        console.log('Broker found:', {
            id: broker._id.toString(),
            name: broker.name,
            role: broker.role
        });
        
        // Find all agents and TCs that belong to this broker
        const agents = await User.find({ 
            role: { $in: [Role.Agent, Role.Tc] },
            brokerId: brokerId
        });
        
        console.log(`Found ${agents.length} total agents/TCs for broker ${brokerId}`);
        
        // Separate pending and approved agents
        const pendingAgents = agents.filter(agent => !agent.isApproved);
        const approvedAgents = agents.filter(agent => agent.isApproved);
        
        console.log(`Pending agents: ${pendingAgents.length}, Approved agents: ${approvedAgents.length}`);
        
        // Format the response data
        const formattedPendingAgents = pendingAgents.map(agent => ({
            id: agent._id.toString(),
            name: agent.name,
            email: agent.email,
            phone: agent.mobile || 'N/A',
            role: agent.role,
            status: 'pending',
            appliedDate: agent.createdAt
        }));
        
        const formattedApprovedAgents = approvedAgents.map(agent => ({
            id: agent._id.toString(),
            name: agent.name,
            email: agent.email,
            phone: agent.mobile || 'N/A',
            role: agent.role,
            status: 'active',
            approvedDate: agent.updatedAt
        }));
        
        return NextResponse.json({ 
            pendingAgents: formattedPendingAgents,
            approvedAgents: formattedApprovedAgents
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ 
            message: 'Server error fetching agents', 
            error: error.message 
        }, { status: 500 });
    }
}