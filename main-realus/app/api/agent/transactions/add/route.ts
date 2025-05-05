import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel, { TransactionType, TransactionStatus } from "@/models/transactionModel";
import UserModel, { Role } from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // For development purposes, we'll skip authentication
    // In production, you would implement proper authentication here
    
    // Parse request body
    const body = await req.json();
    
    // For testing, we'll create a dummy agent ID and broker ID
    const agentId = "test-agent-id";
    const brokerId = "test-broker-id";

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

    // Validate transaction type
    if (!Object.values(TransactionType).includes(body.transactionType)) {
      return NextResponse.json(
        { message: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Create new transaction
    const transaction = new TransactionModel({
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
      price: body.price,
      closingDate: new Date(body.closingDate),
      status: TransactionStatus.New,
      notes: body.notes || "",
      // Generate a transaction ID manually
      transactionId: "TR-" + Math.floor(10000 + Math.random() * 90000),
    });

    // Save transaction to database
    await transaction.save();

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
      { message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}