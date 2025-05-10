import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
  console.log("Transaction creation API called");
  
  try {
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

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

    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    // For development/testing - if no token, create a test transaction
    let agentId = "test-agent-id";
    let brokerId = "test-broker-id";
    
    if (!token) {
      console.log("No authentication token found - using test IDs");
      
      // In production, you would return an error here
      // For development, we'll continue with test IDs
      /*
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
      */
    } else {
      // Verify the token and get the agent's ID
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        console.log("Token decoded:", decoded);
        
        // Find the agent in the database
        const agent = await User.findById(decoded.id);
        console.log("Agent found:", agent ? "Yes" : "No");
        
        if (!agent) {
          console.log("Agent not found in database");
          // For development, continue with test IDs instead of returning error
          /*
          return NextResponse.json(
            { message: "Agent not found" },
            { status: 404 }
          );
          */
        } else if (agent.role !== "Agent") {
          console.log(`User role is ${agent.role}, not Agent`);
          // For development, continue with test IDs instead of returning error
          /*
          return NextResponse.json(
            { message: "Only agents can create transactions" },
            { status: 403 }
          );
          */
        } else {
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
        // For development, continue with test IDs instead of returning error
        /*
        return NextResponse.json(
          { message: "Invalid authentication token" },
          { status: 401 }
        );
        */
      }
    }

    // Generate a transaction ID
    const transactionId = "TR-" + Math.floor(10000 + Math.random() * 90000);
    console.log("Generated transaction ID:", transactionId);

    // Create new transaction
    const transaction = new TransactionModel({
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
    });

    console.log("Prepared transaction object:", JSON.stringify(transaction));

    // Save transaction to database
    try {
      const savedTransaction = await transaction.save();
      console.log("Transaction saved successfully:", savedTransaction.transactionId);
      
      return NextResponse.json(
        {
          message: "Transaction created successfully",
          transaction: {
            transactionId: savedTransaction.transactionId,
            status: savedTransaction.status,
            createdAt: savedTransaction.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (saveError) {
      console.error("Error saving transaction:", saveError);
      return NextResponse.json(
        { 
          message: "Failed to save transaction to database", 
          error: String(saveError) 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Failed to create transaction", error: String(error) },
      { status: 500 }
    );
  }
}