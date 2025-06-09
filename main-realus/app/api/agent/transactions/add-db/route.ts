import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel, { TransactionType, TransactionStatus } from "@/models/transactionModel";
import User, { User as UserType } from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Use environment variable for JWT secret with a fallback for development
const JWT_SECRET = process.env.JWT_SECRET || "123123123 "; // Make sure this matches the JWT_SECRET in login/route.ts

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
    let agentId: any = "test-agent-id"; // Using any type to accommodate both string and ObjectId
    let brokerId = "test-broker-id";
    let agentName = "Unknown Agent"; // Initialize agentName variable
    
    if (!token) {
      console.log("No authentication token found - using test IDs");
      
      // For development, create a valid ObjectId for testing
      if (process.env.NODE_ENV !== 'production') {
        agentId = new mongoose.Types.ObjectId();
        agentName = "Test Agent"; // Set a test agent name
        console.log("Created test ObjectId for agent:", agentId);
        console.log("Using test agent name:", agentName);
      } else {
        // In production, require authentication
        return NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        );
      }
    } else {
      // Verify the token and get the agent's ID
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        console.log("Token decoded:", decoded);
        
        if (!decoded || !decoded.id) {
          console.log("Invalid token payload:", decoded);
          return NextResponse.json(
            { message: "Invalid token format" },
            { status: 401 }
          );
        }
        
        // Find the agent in the database
        const agent = await User.findById(decoded.id) as UserType | null;
        console.log("Agent found:", agent ? "Yes" : "No");
        
        if (!agent) {
          console.log("Agent not found in database");
          return NextResponse.json(
            { message: "Agent not found" },
            { status: 404 }
          );
        } else if (agent.role !== "Agent") {
          console.log(`User role is ${agent.role}, not Agent`);
          return NextResponse.json(
            { message: "Only agents can create transactions" },
            { status: 403 }
          );
        } else {
          // Valid agent found - use the agent's MongoDB ObjectId directly
          if (agent._id) {
            agentId = agent._id;
            console.log("Using agent's MongoDB ObjectId:", agentId);
            
            // Store the agent's name to use in the transaction
            agentName = agent.name || "Unknown Agent";
            console.log("Using agent's name:", agentName);
          } else {
            return NextResponse.json(
              { message: "Agent ID is missing" },
              { status: 500 }
            );
          }
          
          // Always use the broker ID that was set during signup
          if (agent.brokerId) {
            brokerId = agent.brokerId;
            console.log("Using broker ID from agent's signup:", brokerId);
          } else {
            return NextResponse.json(
              { message: "Broker ID is missing. Please contact your administrator." },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        
        // For development, create a valid ObjectId for testing
        if (process.env.NODE_ENV !== 'production') {
          console.log("Token verification failed, using test ObjectId for development");
          agentId = new mongoose.Types.ObjectId();
          agentName = "Test Agent (Token Error)"; // Set a test agent name
          console.log("Created test ObjectId for agent:", agentId);
          console.log("Using test agent name:", agentName);
        } else {
          return NextResponse.json(
            { message: "Invalid authentication token" },
            { status: 401 }
          );
        }
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
        // Safely access the _id and use it directly as ObjectId
        if (tcs[randomIndex]?._id) {
          transactionCoordinatorId = tcs[randomIndex]._id;
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

    // Agent name is already set in the token verification section
    console.log("Using agent name for transaction:", agentName);
    
    // Create new transaction
    const transaction = new TransactionModel({
      transactionId,
      agentId: agentId,
      agentName: agentName, // Store the agent name directly in the transaction
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
      
      // Send email notification about new transaction
      try {
        // Import sendTransactionStatusEmail function
        const { sendTransactionStatusEmail } = await import('@/utils/automationUtils');
        
        // Send notification to client
        await sendTransactionStatusEmail(
          savedTransaction.transactionId,
          savedTransaction.status,
          savedTransaction.clientEmail,
          savedTransaction.clientName
        );
        
        console.log(`Transaction creation notification sent to ${savedTransaction.clientEmail}`);
      } catch (emailError) {
        console.error("Error sending transaction notification email:", emailError);
        // Don't block the response if email fails
      }
      
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