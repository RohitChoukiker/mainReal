import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { isTransactionReadyForClosure, updateTransactionStatusIfReady } from "@/utils/transactionUtils";
import TransactionModel from "@/models/transactionModel";
import { emitToRole } from "@/utils/socketServer";
import { Role } from "@/models/userModel";

/**
 * API endpoint to check if a transaction is ready for closure and update its status if needed
 * GET /api/tc/transactions/check-closure-status?transactionId=TR-12345
 */
export async function GET(request: NextRequest) {
  try {
    console.log("Checking transaction closure status...");
    await dbConnect();
    
    // Get transaction ID from query parameters
    const url = new URL(request.url);
    const transactionId = url.searchParams.get("transactionId");
    
    if (!transactionId) {
      console.log("No transaction ID provided");
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`Checking closure status for transaction: ${transactionId}`);
    
    // Check if transaction exists
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      console.log(`Transaction ${transactionId} not found`);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    
    // Check if transaction is ready for closure
    const isReady = await isTransactionReadyForClosure(transactionId);
    console.log(`Transaction ${transactionId} ready for closure: ${isReady}`);
    
    if (isReady) {
      // Update transaction status if it's ready for closure
      const result = await updateTransactionStatusIfReady(transactionId);
      
      if (result.success) {
        console.log(`Transaction ${transactionId} status updated to Ready For Closure`);
        
        // Emit to all TCs that a transaction is ready for closure
        emitToRole(Role.Tc, 'transaction_ready_for_closure', {
          transactionId: transactionId,
          updatedAt: new Date().toISOString(),
          message: "Transaction is now ready for closure"
        });
        
        return NextResponse.json({
          message: "Transaction is ready for closure and status has been updated",
          isReadyForClosure: true,
          statusUpdated: true,
          transaction: {
            id: transactionId,
            status: result.transaction.status
          }
        });
      } else {
        console.log(`Transaction ${transactionId} status update result: ${result.message}`);
        
        return NextResponse.json({
          message: result.message,
          isReadyForClosure: true,
          statusUpdated: false,
          transaction: {
            id: transactionId,
            status: transaction.status
          }
        });
      }
    } else {
      return NextResponse.json({
        message: "Transaction is not ready for closure",
        isReadyForClosure: false,
        transaction: {
          id: transactionId,
          status: transaction.status
        }
      });
    }
  } catch (error) {
    console.error("Error checking transaction closure status:", error);
    return NextResponse.json(
      { error: "Failed to check transaction closure status", message: String(error) },
      { status: 500 }
    );
  }
}