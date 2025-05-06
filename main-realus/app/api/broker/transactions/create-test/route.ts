import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transaction";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    
    let brokerId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (broker && broker.role === Role.Broker) {
          brokerId = broker.brokerId;
          console.log("Found broker with ID:", brokerId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // If we couldn't get the brokerId from the session, use the query parameter
    if (!brokerId) {
      brokerId = url.searchParams.get("brokerId");
      
      // If still no brokerId, try to get it from the database using a default broker
      if (!brokerId) {
        try {
          // Try to find any broker in the system
          const anyBroker = await User.findOne({ role: Role.Broker });
          if (anyBroker) {
            brokerId = anyBroker.brokerId;
            console.log("Using default broker ID:", brokerId);
          }
        } catch (err) {
          console.error("Error finding default broker:", err);
        }
      }
    }
    
    if (!brokerId) {
      return NextResponse.json(
        { message: "No broker ID found" },
        { status: 400 }
      );
    }
    
    console.log("Creating test transaction for broker:", brokerId);
    
    // Create a transaction ID based on timestamp and broker ID
    const timestamp = Date.now();
    const transactionId = `TR-${brokerId.substring(0, 4)}-${timestamp.toString().substring(timestamp.toString().length - 6)}`;
    
    // Find agents for this broker
    const agents = await User.find({ 
      brokerId: brokerId,
      role: Role.Agent
    }).select('_id');
    
    let agentId;
    
    if (agents.length > 0) {
      // Use a random agent from the broker's agents
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      agentId = randomAgent._id;
      console.log("Using agent ID:", agentId);
    } else {
      // Create a fake agent ID
      agentId = `agent-${Math.floor(Math.random() * 100)}`;
      console.log("No agents found, using fake agent ID:", agentId);
    }
    
    // Create a test transaction
    const sampleTransaction = new TransactionModel({
      transactionId,
      agentId,
      brokerId,
      clientName: "Test Client",
      clientEmail: "test@example.com",
      clientPhone: "123-456-7890",
      transactionType: "Purchase",
      propertyAddress: "123 Test Street",
      city: "Test City",
      state: "TX",
      zipCode: "12345",
      price: 350000 + Math.floor(Math.random() * 100000),
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: ["New", "In Progress", "At Risk", "Completed"][Math.floor(Math.random() * 4)],
      notes: "This is a test transaction created for demonstration",
    });
    
    await sampleTransaction.save();
    console.log("Created sample transaction:", sampleTransaction);
    
    return NextResponse.json({
      success: true,
      message: "Test transaction created successfully",
      transaction: sampleTransaction,
    });
  } catch (error) {
    console.error("Error creating test transaction:", error);
    return NextResponse.json(
      { message: "Failed to create test transaction", error: String(error) },
      { status: 500 }
    );
  }
}