import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for agent list');
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            console.log('No token provided for agent list');
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
            console.log('Decoded token for agent list:', decoded);
        } catch (error) {
            console.error('Token verification error:', error);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (!broker) {
            console.log('Broker not found with ID:', decoded.id);
            return NextResponse.json({ message: 'Broker not found' }, { status: 404 });
        }
        
        if (broker.role !== Role.Broker) {
            console.log('User is not a broker:', broker.role);
            return NextResponse.json({ message: 'Only brokers can view their agents' }, { status: 403 });
        }
        
        console.log('Broker found for agent list:', {
            id: broker._id.toString(),
            name: broker.name,
            role: broker.role
        });
        
        // Find all agents and TCs that belong to this broker
        const agents = await User.find({ 
            role: { $in: [Role.Agent, Role.Tc] },
            brokerId: broker.brokerId // Filter by the broker's ID
        });
        
        console.log(`Found ${agents.length} total agents/TCs for broker ${broker.brokerId}`);
        
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