import { NextRequest, NextResponse } from "next/server";
import { emitTransactionUpdated, emitTransactionStatsUpdate } from "@/utils/socketEmitter";
import { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    // Check if user has broker role
    if (decoded.role !== Role.Broker && decoded.role !== Role.Admin) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { transaction, brokerId } = body;
    
    if (!transaction || !transaction.transactionId) {
      return NextResponse.json(
        { error: "Bad request: Missing transaction data" },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would update the transaction in the database here
    // For now, we'll just emit the socket event
    
    // Emit transaction updated event
    emitTransactionUpdated(transaction, brokerId || decoded.id);
    
    // Emit transaction stats update
    await emitTransactionStatsUpdate();
    
    return NextResponse.json(
      { success: true, message: "Transaction update broadcasted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in transaction update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Trigger a manual refresh of transaction stats
  try {
    await emitTransactionStatsUpdate();
    return NextResponse.json(
      { success: true, message: "Transaction stats update triggered" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error triggering transaction stats update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}