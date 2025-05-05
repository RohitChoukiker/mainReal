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

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // For development purposes, we'll skip authentication
    // In production, you would implement proper authentication here
    
    // For testing, we'll create a dummy agent ID
    const agentId = "test-agent-id";

    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // For testing, we'll just query all transactions
    // In production, you would filter based on user role
    let query: any = {};
    
    // For agent role, we'll filter by agent ID
    query.agentId = agentId;

    // Add status filter if provided
    if (status && Object.values(TransactionStatus).includes(status as TransactionStatus)) {
      query.status = status;
    }

    // Get total count for pagination
    const total = await TransactionModel.countDocuments(query);

    // Get transactions
    const transactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}