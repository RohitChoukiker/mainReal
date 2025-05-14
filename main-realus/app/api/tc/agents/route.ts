import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User, { Role } from '@/models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

export async function GET(req: NextRequest) {
  try {
    console.log('TC agents API called');
    
    // Connect to database
    await dbConnect();
    console.log('Database connected');
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let tcId;
    let brokerId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        tcId = decoded.id;
        console.log("Token decoded, TC ID:", tcId);
        
        // Find the TC in the database
        const tc = await User.findById(decoded.id);
        console.log("TC found:", tc ? "Yes" : "No");
        
        if (tc) {
          brokerId = tc.brokerId;
          
          if (tc.role !== Role.Tc) {
            console.log("User is not a TC, role:", tc.role);
            // For development, we'll allow non-TC users to fetch agents
            // In production, you would want to uncomment the following block
            /*
            return NextResponse.json(
              { message: "Unauthorized: User is not a Transaction Coordinator" },
              { status: 403 }
            );
            */
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // We need a valid brokerId to fetch agents
    if (!brokerId) {
      console.log("No broker ID found for TC");
      // Return empty array if no brokerId is found
      return NextResponse.json({
        agents: []
      });
    }
    
    // Find all agents that belong to this broker
    const agents = await User.find({ 
      role: Role.Agent,
      brokerId: brokerId,
      isApproved: true // Only get approved agents
    });
    
    console.log(`Found ${agents.length} agents for broker ${brokerId}`);
    
    // Format the response data
    const formattedAgents = agents.map(agent => ({
      id: agent.id.toString(),
      name: agent.name,
      email: agent.email,
      phone: agent.mobile || 'N/A'
    }));
    
    // Return the actual agents from database, even if empty
    console.log(`Returning ${formattedAgents.length} agents from database`);
    
    return NextResponse.json({
      agents: formattedAgents
    });
    
  } catch (error) {
    console.error("Error fetching TC agents:", error);
    return NextResponse.json(
      { message: "Failed to fetch agents", error: String(error) },
      { status: 500 }
    );
  }
}