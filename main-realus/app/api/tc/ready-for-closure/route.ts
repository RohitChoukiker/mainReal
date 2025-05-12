import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import TransactionModel from "@/models/transactionModel";
import ClosureRequestModel from "@/models/closureRequestModel";
import { TransactionStatus } from "@/models/transactionModel";
import { sendEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get transactions that are ready for closure
    const transactions = await TransactionModel.find({
      status: TransactionStatus.ReadyForClosure
    }).populate('agent').populate('tc');
    
    // Format the response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.transactionId,
      property: transaction.propertyAddress,
      client: transaction.clientName,
      agent: {
        name: transaction.agent.name,
        avatar: transaction.agent.avatar || "/placeholder.svg?height=40&width=40"
      },
      closingDate: transaction.closingDate,
      status: transaction.status,
      documents: {
        total: transaction.documents?.length || 0,
        verified: transaction.documents?.filter(doc => doc.approved).length || 0
      },
      tasks: {
        total: transaction.tasks?.length || 0,
        completed: transaction.tasks?.filter(task => task.completed).length || 0
      }
    }));

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching ready for closure transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { transactionId, status, notes } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Transaction ID and status are required" },
        { status: 400 }
      );
    }

    // Find the transaction
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction status
    transaction.status = status;
    await transaction.save();

    // Create closure request if forwarding to broker
    if (status === TransactionStatus.ForwardedToBroker) {
      const closureRequest = new ClosureRequestModel({
        transactionId: transaction._id,
        status: 'pending',
        notes: notes || ""
      });
      await closureRequest.save();

      // Send email notification to broker
      const emailData = {
        to: transaction.broker.email,
        subject: "New Closure Request",
        template: 'new-closure-request',
        data: {
          transactionId: transaction.transactionId,
          property: transaction.propertyAddress,
          closingDate: transaction.closingDate,
          notes: notes || ""
        }
      };
      await sendEmail(emailData);
    }

    return NextResponse.json({ 
      message: "Transaction status updated successfully",
      transaction: {
        id: transaction.transactionId,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json(
      { error: "Failed to update transaction status" },
      { status: 500 }
    );
  }
} 