import TaskModel, { TaskStatus } from "@/models/taskModel";
import DocumentModel from "@/models/document";
import ComplaintModel, { ComplaintStatus } from "@/models/complaintModel";
import TransactionModel, { TransactionStatus } from "@/models/transactionModel";
import dbConnect from "@/utils/dbConnect";

/**
 * Checks if a transaction is ready for closure by verifying:
 * 1. All tasks are completed
 * 2. All documents are verified (manually approved or AI-verified)
 * 3. All complaints are resolved or closed
 * 
 * @param transactionId The ID of the transaction to check
 * @returns A boolean indicating if the transaction is ready for closure
 */
export async function isTransactionReadyForClosure(transactionId: string): Promise<boolean> {
  try {
    // Connect to database
    await dbConnect();
    console.log(`Checking if transaction ${transactionId} is ready for closure...`);
    
    // Check if all tasks are completed
    const tasks = await TaskModel.find({ transactionId });
    console.log(`Found ${tasks.length} tasks for transaction ${transactionId}`);
    const allTasksCompleted = tasks.length > 0 && tasks.every(
      task => task.status === TaskStatus.Completed
    );
    console.log(`All tasks completed: ${allTasksCompleted}`);
    
    // Check if all documents are verified
    const documents = await DocumentModel.find({ transactionId });
    console.log(`Found ${documents.length} documents for transaction ${transactionId}`);
    const allDocumentsVerified = documents.length > 0 && documents.every(
      doc => doc.status === "approved" || doc.aiVerified
    );
    console.log(`All documents verified: ${allDocumentsVerified}`);
    
    // Check if all complaints are resolved
    const complaints = await ComplaintModel.find({ transactionId });
    console.log(`Found ${complaints.length} complaints for transaction ${transactionId}`);
    const allComplaintsResolved = complaints.length === 0 || complaints.every(
      complaint => complaint.status === ComplaintStatus.Resolved || complaint.status === ComplaintStatus.Closed
    );
    console.log(`All complaints resolved: ${allComplaintsResolved}`);
    
    // Transaction is ready for closure if all conditions are met
    const isReady = allTasksCompleted && allDocumentsVerified && allComplaintsResolved;
    console.log(`Transaction ${transactionId} ready for closure: ${isReady}`);
    return isReady;
  } catch (error) {
    console.error("Error checking if transaction is ready for closure:", error);
    return false;
  }
}

/**
 * Updates a transaction's status to "ReadyForClosure" if all conditions are met
 * 
 * @param transactionId The ID of the transaction to update
 * @returns An object with success status and updated transaction (if successful)
 */
export async function updateTransactionStatusIfReady(transactionId: string): Promise<{
  success: boolean;
  transaction?: any;
  message: string;
}> {
  try {
    // Connect to database
    await dbConnect();
    console.log(`Checking if transaction ${transactionId} can be updated to Ready for Closure...`);
    
    // Check if transaction is ready for closure
    const isReadyForClosure = await isTransactionReadyForClosure(transactionId);
    
    if (!isReadyForClosure) {
      console.log(`Transaction ${transactionId} is not ready for closure yet`);
      return {
        success: false,
        message: "Transaction is not ready for closure yet"
      };
    }
    
    // Find the transaction
    console.log(`Finding transaction with ID: ${transactionId}`);
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      console.log(`Transaction ${transactionId} not found in database`);
      return {
        success: false,
        message: "Transaction not found"
      };
    }
    
    console.log(`Found transaction ${transactionId}, current status: ${transaction.status}`);
    
    // If already in ReadyForClosure status, no need to update
    if (transaction.status === TransactionStatus.ReadyForClosure) {
      console.log(`Transaction ${transactionId} is already marked as ready for closure`);
      return {
        success: true,
        transaction,
        message: "Transaction is already marked as ready for closure"
      };
    }
    
    // Update the transaction status
    console.log(`Updating transaction ${transactionId} status to ReadyForClosure`);
    transaction.status = TransactionStatus.ReadyForClosure;
    await transaction.save();
    console.log(`Transaction ${transactionId} status updated successfully`);
    
    return {
      success: true,
      transaction,
      message: "Transaction status updated to Ready For Closure"
    };
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return {
      success: false,
      message: `Error updating transaction status: ${error}`
    };
  }
}