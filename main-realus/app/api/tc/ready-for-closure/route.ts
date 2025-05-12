import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import ClosureRequestModel from "@/models/closureRequestModel";
import { TransactionStatus } from "@/models/transactionModel";
import { sendEmail } from "@/lib/email";
import { isTransactionReadyForClosure } from "@/utils/transactionUtils";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching ready for closure transactions...");
    await dbConnect();
    
    // Get transactions that are ready for closure
    const transactions = await TransactionModel.find({
      status: TransactionStatus.ReadyForClosure
    });
    
    console.log(`Found ${transactions.length} transactions with ReadyForClosure status`);
    
    // If no transactions found with ReadyForClosure status, check all transactions
    if (transactions.length === 0) {
      console.log("No transactions found with ReadyForClosure status, checking all transactions...");
      
      // Get all transactions that are not already closed or cancelled
      const allTransactions = await TransactionModel.find({
        status: { 
          $nin: [
            TransactionStatus.Closed, 
            TransactionStatus.Cancelled,
            TransactionStatus.ReadyForClosure,
            TransactionStatus.ForwardedToBroker
          ] 
        }
      });
      
      console.log(`Found ${allTransactions.length} active transactions to check`);
      
      // Check each transaction if it's ready for closure
      for (const transaction of allTransactions) {
        const isReady = await isTransactionReadyForClosure(transaction.transactionId);
        
        if (isReady) {
          console.log(`Transaction ${transaction.transactionId} is ready for closure, updating status...`);
          transaction.status = TransactionStatus.ReadyForClosure;
          await transaction.save();
          transactions.push(transaction);
        }
      }
      
      console.log(`Updated ${transactions.length} transactions to ReadyForClosure status`);
    }
    
    // Format the response
    const formattedTransactions = transactions.map(transaction => {
      // Get agent info (handle case where populate might not work)
      let agentName = "Unknown Agent";
      let agentAvatar = "/placeholder.svg?height=40&width=40";
      
      if (transaction.agent) {
        if (typeof transaction.agent === 'object') {
          agentName = transaction.agent.name || "Agent";
          agentAvatar = transaction.agent.avatar || "/placeholder.svg?height=40&width=40";
        } else {
          agentName = `Agent ${transaction.agentId}`;
        }
      }
      
      return {
        id: transaction.transactionId,
        property: transaction.propertyAddress,
        client: transaction.clientName,
        agent: {
          name: agentName,
          avatar: agentAvatar
        },
        closingDate: transaction.closingDate,
        status: transaction.status,
        completionPercentage: 100, // Since it's ready for closure, it's 100% complete
        documents: {
          total: transaction.documents?.length || 0,
          verified: transaction.documents?.filter(doc => doc.approved).length || 0
        },
        tasks: {
          total: transaction.tasks?.length || 0,
          completed: transaction.tasks?.filter(task => task.completed).length || 0
        }
      };
    });

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching ready for closure transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Updating transaction status for ready for closure...");
    await dbConnect();
    
    const body = await request.json();
    const { transactionId, status, notes } = body;
    console.log("Request body:", body);

    if (!transactionId || !status) {
      console.log("Missing required fields in request");
      return NextResponse.json(
        { error: "Transaction ID and status are required" },
        { status: 400 }
      );
    }

    // Find the transaction
    console.log(`Finding transaction with ID: ${transactionId}`);
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      console.log(`Transaction ${transactionId} not found in database`);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    console.log(`Found transaction ${transactionId}, current status: ${transaction.status}`);
    console.log(`Updating transaction status to: ${status}`);

    // Update transaction status
    transaction.status = status;
    await transaction.save();
    console.log(`Transaction ${transactionId} status updated to ${status}`);

    // Create closure request if forwarding to broker
    if (status === TransactionStatus.ForwardedToBroker) {
      console.log(`Creating closure request for transaction ${transactionId}`);
      
      try {
        const closureRequest = new ClosureRequestModel({
          transactionId: transaction._id,
          status: 'pending',
          notes: notes || ""
        });
        await closureRequest.save();
        console.log(`Closure request created for transaction ${transactionId}`);
      } catch (closureError) {
        console.error(`Error creating closure request: ${closureError}`);
        // Continue even if closure request creation fails
      }

      // Send email notification to broker if broker email is available
      try {
        if (transaction.broker && transaction.broker.email) {
          console.log(`Sending email notification to broker: ${transaction.broker.email}`);
          
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
          console.log(`Email notification sent to broker: ${transaction.broker.email}`);
        } else {
          console.log("Broker email not available, skipping email notification");
        }
      } catch (emailError) {
        console.error(`Error sending email notification: ${emailError}`);
        // Continue even if email sending fails
      }
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
      { error: "Failed to update transaction status", message: String(error) },
      { status: 500 }
    );
  }
} 