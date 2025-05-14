import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User, { Role } from '../../../models/userModel';

// This is a debug endpoint to check broker information
export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await dbConnect();
        console.log('Connected to database for broker debug');
        
        // Get the broker ID from the query parameters
        const brokerId = req.nextUrl.searchParams.get('brokerId');
        
        if (!brokerId) {
            // If no broker ID is provided, return all brokers
            const brokers = await User.find({ role: Role.Broker });
            
            return NextResponse.json({ 
                message: 'All brokers',
                brokers: brokers.map(broker => ({
                    id: String(broker._id),
                    name: broker.name,
                    email: broker.email,
                    brokerId: broker.brokerId
                }))
            }, { status: 200 });
        }
        
        // Find the broker by ID
        const broker = await User.findOne({ brokerId, role: Role.Broker });
        
        if (!broker) {
            console.log('Broker not found with ID:', brokerId);
            return NextResponse.json({ message: 'Broker not found' }, { status: 404 });
        }
        
        // Find all agents and TCs that belong to this broker
        const agents = await User.find({ 
            role: { $in: [Role.Agent, Role.Tc] },
            brokerId: brokerId
        });
        
        // Separate pending and approved agents
        const pendingAgents = agents.filter(agent => !agent.isApproved);
        const approvedAgents = agents.filter(agent => agent.isApproved);
        
        return NextResponse.json({ 
            broker: {
                id: String(broker._id),
                name: broker.name,
                email: broker.email,
                brokerId: broker.brokerId
            },
            pendingAgentsCount: pendingAgents.length,
            approvedAgentsCount: approvedAgents.length,
            pendingAgents: pendingAgents.map(agent => ({
                id: String(agent._id),
                name: agent.name,
                email: agent.email,
                role: agent.role,
                createdAt: agent.createdAt
            })),
            approvedAgents: approvedAgents.map(agent => ({
                id: String(agent._id),
                name: agent.name,
                email: agent.email,
                role: agent.role,
                createdAt: agent.createdAt
            }))
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error in broker debug:', error);
        return NextResponse.json({ 
            message: 'Server error', 
            error: error.message 
        }, { status: 500 });
    }
}