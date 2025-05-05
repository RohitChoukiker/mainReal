import { NextRequest, NextResponse } from "next/server";

// In-memory storage for transactions (for testing only)
const transactions: any[] = [];

export async function POST(req: NextRequest) {
  try {
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

    // Generate a transaction ID
    const transactionId = "TR-" + Math.floor(10000 + Math.random() * 90000);

    // Create new transaction object
    const transaction = {
      transactionId,
      agentId: "test-agent-id",
      brokerId: "test-broker-id",
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      transactionType: body.transactionType,
      propertyAddress: body.propertyAddress,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      price: body.price,
      closingDate: body.closingDate,
      status: "New",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    // Store transaction in memory
    transactions.push(transaction);

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
  return NextResponse.json({ transactions });
}