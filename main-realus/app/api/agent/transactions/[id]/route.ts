import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";

export async function GET(
  req: NextRequest
) {
  try {
    // Connect to database
    await dbConnect();
    
    // Extract the transaction ID from the URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const transactionId = pathParts[pathParts.length - 1]; // Get the ID from the URL path
    
    // Find transaction by ID
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { message: "Failed to fetch transaction", error: String(error) },
      { status: 500 }
    );
  }
}