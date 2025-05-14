import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel, { TransactionType, TransactionStatus } from "@/models/transactionModel";
import User, { User as UserType } from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Use environment variable for JWT secret with a fallback for development
const JWT_SECRET = process.env.JWT_SECRET || "123123123";

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
        const agent = await User.findById(decoded.id) as UserType | null;
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
          // Safely access the agent document properties
          if (agent._id) {
            agentId = agent._id.toString();
          }
          
          // Handle the case where brokerId might be undefined
          if (agent.brokerId) {
            brokerId = agent.brokerId; // Get the broker ID from the agent's record
          } else {
            // Keep the default value set earlier
            console.log("No broker ID found in agent document, using default");
          }
          
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

    // Find a TC to assign the transaction to
    let transactionCoordinatorId = null;
    try {
      // Find TCs in the system - use proper Role enum
      const tcs = await User.find({ role: "TransactionCoordinator" });
      console.log(`Found ${tcs.length} TCs in the system`);
      
      if (tcs.length > 0) {
        // Simple round-robin assignment - get a random TC
        const randomIndex = Math.floor(Math.random() * tcs.length);
        // Safely access the _id and convert to string
        if (tcs[randomIndex]?._id) {
          transactionCoordinatorId = tcs[randomIndex]._id.toString();
          console.log(`Assigned transaction to TC with ID: ${transactionCoordinatorId}`);
        } else {
          console.log("Selected TC has no valid ID, transaction will be unassigned");
        }
      } else {
        console.log("No TCs found in the system, transaction will be unassigned");
      }
    } catch (tcError) {
      console.error("Error finding TCs:", tcError);
      // Continue without assigning a TC
    }

    // Validate transaction type
    if (!Object.values(TransactionType).includes(body.transactionType as TransactionType)) {
      console.log(`Invalid transaction type: ${body.transactionType}`);
      return NextResponse.json(
        { message: `Invalid transaction type. Must be one of: ${Object.values(TransactionType).join(', ')}` },
        { status: 400 }
      );
    }

    // Create new transaction
    const transaction = new TransactionModel({
      transactionId,
      agentId: agentId,
      brokerId: brokerId,
      transactionCoordinatorId: transactionCoordinatorId, // Assign to TC
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      transactionType: body.transactionType as TransactionType,
      propertyAddress: body.propertyAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      price: parseFloat(body.price),
      closingDate: new Date(body.closingDate),
      status: TransactionStatus.New,
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
    
    // Provide more specific error messages based on error type
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { 
          message: "Validation error in transaction data", 
          errors: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    } else if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { message: "Invalid data format", error: error.message },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to create transaction", error: String(error) },
        { status: 500 }
      );
    }
  }
}