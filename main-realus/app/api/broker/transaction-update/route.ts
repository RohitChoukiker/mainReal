import { NextRequest, NextResponse } from "next/server";
import { emitTransactionUpdated, emitTransactionStatsUpdate } from "@/utils/socketEmitter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if user has broker role
    const userRole = session.user.role;
    if (userRole !== Role.Broker && userRole !== Role.Admin) {
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
    emitTransactionUpdated(transaction, brokerId || session.user.id);
    
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