import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";
import UserModel, { Role } from "@/models/userModel";

// In-memory storage for transactions (for testing only)
const transactions: any[] = [];

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
  try {
    console.log("Simple transaction creation API called");
    
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    // Initialize agent and broker IDs
    let agentId = "test-agent-id";
    let brokerId = "test-broker-id";
    
    // If token exists, verify it and get the agent's ID and broker's ID
    if (token) {
      try {
        // Connect to database to look up user info
        await dbConnect();
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        console.log("Token decoded:", decoded);
        
        // Find the agent in the database
        const agent = await UserModel.findById(decoded.id);
        console.log("Agent found:", agent ? "Yes" : "No");
        
        if (agent && agent.role === Role.Agent) {
          // Valid agent found
          agentId = agent._id.toString();
          brokerId = agent.brokerId; // Get the broker ID from the agent's record
          
          console.log("Agent ID:", agentId);
          console.log("Broker ID from agent record:", brokerId);
          
          // Use the broker ID directly from the agent's record
          // No need to search for a broker or update the agent
          if (!brokerId) {
            console.log("No broker ID found for agent, using fallback");
            brokerId = "test-broker-id"; // Fallback if no broker ID is found
          } else {
            console.log("Using broker ID from agent record:", brokerId);
            // We'll use the broker ID exactly as stored in the agent's record
            // This is as per the requirement to use the broker ID as entered during signup
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }

    // Validate required fields
    const requiredFields = [
      "clientName",
      "clientEmail",
      "clientPhone",
      "transactionType",
      "propertyAddress",
      "city",
      "state",
      "zipCode",
      "price",
      "closingDate",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate a transaction ID
    const transactionId = "TR-" + Math.floor(10000 + Math.random() * 90000);
    console.log("Generated transaction ID:", transactionId);

    // Create new transaction object
    const transaction = {
      transactionId,
      agentId: agentId,
      brokerId: brokerId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      transactionType: body.transactionType,
      propertyAddress: body.propertyAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      price: parseFloat(body.price),
      closingDate: new Date(body.closingDate),
      status: "New",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    console.log("Created transaction object:", JSON.stringify(transaction));

    // Store transaction in memory
    transactions.push(transaction);
    console.log("Transaction stored in memory, total count:", transactions.length);

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction: {
          transactionId: transaction.transactionId,
          status: transaction.status,
          createdAt: transaction.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Failed to create transaction", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  console.log("Simple transactions GET API called");
  console.log("In-memory transactions count:", transactions.length);
  
  // Get query parameters
  const url = new URL(req.url);
  const brokerId = url.searchParams.get("brokerId");
  const agentId = url.searchParams.get("agentId");
  
  // Filter transactions if broker ID is provided
  let filteredTransactions = transactions;
  
  if (brokerId) {
    console.log("Filtering by broker ID:", brokerId);
    filteredTransactions = transactions.filter(t => 
      t.brokerId === brokerId || t.brokerId === "test-broker-id"
    );
  }
  
  // Further filter by agent ID if provided
  if (agentId) {
    console.log("Filtering by agent ID:", agentId);
    filteredTransactions = filteredTransactions.filter(t => t.agentId === agentId);
  }
  
  console.log("Returning filtered transactions count:", filteredTransactions.length);
  
  return NextResponse.json({ 
    transactions: filteredTransactions,
    pagination: {
      total: filteredTransactions.length,
      page: 1,
      limit: 100,
      pages: 1
    }
  });
}