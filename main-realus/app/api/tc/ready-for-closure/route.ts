import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import ClosureRequestModel from "@/models/closureRequestModel";
import { TransactionStatus } from "@/models/transactionModel";
import { sendEmail } from "@/lib/email";
import { isTransactionReadyForClosure } from "@/utils/transactionUtils";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching assigned transactions...");
    await dbConnect();
    
    // Get all assigned transactions that are not closed or cancelled
    const transactions = await TransactionModel.find({
      status: { 
        $nin: [
          TransactionStatus.Closed, 
          TransactionStatus.Cancelled
        ] 
      }
    });
    
    console.log(`Found ${transactions.length} assigned transactions`);
    
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
        completionPercentage: calculateCompletionPercentage(transaction),
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
    console.error("Error fetching assigned transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions", message: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to calculate completion percentage
function calculateCompletionPercentage(transaction: any): number {
  const totalItems = (transaction.documents?.length || 0) + (transaction.tasks?.length || 0);
  if (totalItems === 0) return 0;
  
  const completedItems = 
    (transaction.documents?.filter(doc => doc.approved).length || 0) + 
    (transaction.tasks?.filter(task => task.completed).length || 0);
  
  return Math.round((completedItems / totalItems) * 100);
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
      console.log("Transaction details:", {
        id: transaction._id,
        brokerId: transaction.brokerId,
        status: transaction.status
      });
      
      try {
        // First check if a closure request already exists
        const existingRequest = await ClosureRequestModel.findOne({
          transactionId: transaction._id
        });

        if (existingRequest) {
          console.log(`Closure request already exists for transaction ${transactionId}`);
          // Update existing request
          existingRequest.status = 'pending';
          existingRequest.notes = notes || "";
          await existingRequest.save();
          console.log(`Updated existing closure request for transaction ${transactionId}`);
        } else {
          // Create new closure request
          const closureRequest = new ClosureRequestModel({
            transactionId: transaction._id,
            status: 'pending',
            notes: notes || "",
            submittedDate: new Date()
          });
          await closureRequest.save();
          console.log(`Created new closure request for transaction ${transactionId}:`, {
            requestId: closureRequest._id,
            transactionId: closureRequest.transactionId,
            status: closureRequest.status
          });
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
      } catch (closureError) {
        console.error(`Error handling closure request: ${closureError}`);
        return NextResponse.json(
          { error: "Failed to create closure request", message: String(closureError) },
          { status: 500 }
        );
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