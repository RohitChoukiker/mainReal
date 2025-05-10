import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transaction";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const body = await req.json();

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
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token and get the agent's ID
    let agentId;
    let brokerId;
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      
      // Find the agent in the database
      const agent = await User.findById(decoded.id);
      
      if (!agent || agent.role !== "Agent") {
        return NextResponse.json(
          { message: "Only agents can create transactions" },
          { status: 403 }
        );
      }
      
      agentId = agent._id.toString();
      brokerId = agent.brokerId; // Get the broker ID from the agent's record
      
      console.log("Agent ID:", agentId);
      console.log("Broker ID:", brokerId);
      
      if (!brokerId) {
        // If the agent doesn't have a broker ID, try to find a broker
        try {
          const broker = await User.findOne({ role: "Broker" });
          if (broker) {
            brokerId = broker.brokerId || broker._id.toString();
            
            // Update the agent with this broker ID for future transactions
            await User.findByIdAndUpdate(agent._id, { brokerId: brokerId });
            console.log("Updated agent with broker ID:", brokerId);
          } else {
            // Fallback to a test broker ID if no broker is found
            brokerId = "test-broker-id";
          }
          console.log("Using broker ID:", brokerId);
        } catch (error) {
          console.error("Error finding broker:", error);
          // Fallback to a test broker ID if there's an error
          brokerId = "test-broker-id";
        }
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Generate a transaction ID
    const transactionId = "TR-" + Math.floor(10000 + Math.random() * 90000);

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

    console.log("Saving transaction:", transaction);

    // Save transaction to database
    const savedTransaction = await transaction.save();
    
    console.log("Transaction saved:", savedTransaction);

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
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Failed to create transaction", error: String(error) },
      { status: 500 }
    );
  }
}