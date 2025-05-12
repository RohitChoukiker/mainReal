import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel, { TransactionStatus } from "@/models/transactionModel";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import DocumentModel from "@/models/document";
import ComplaintModel, { ComplaintStatus } from "@/models/complaintModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

const JWT_SECRET = "123123123 " as string;

// Function to check if a transaction is ready for closure
async function isTransactionReadyForClosure(transactionId: string) {
  try {
    // Check if all tasks are completed
    const tasks = await TaskModel.find({ transactionId });
    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === TaskStatus.Completed);
    
    // Check if all documents are verified
    const documents = await DocumentModel.find({ transactionId });
    const allDocumentsVerified = documents.length > 0 && documents.every(doc => doc.status === "approved" || doc.aiVerified);
    
    // Check if all complaints are resolved
    const complaints = await ComplaintModel.find({ transactionId });
    const allComplaintsResolved = complaints.length === 0 || complaints.every(
      complaint => complaint.status === ComplaintStatus.Resolved || complaint.status === ComplaintStatus.Closed
    );
    
    // Transaction is ready for closure if all conditions are met
    return allTasksCompleted && allDocumentsVerified && allComplaintsResolved;
  } catch (error) {
    console.error("Error checking if transaction is ready for closure:", error);
    return false;
  }
}

// Endpoint to check and update transaction status
export const GET = catchAsync(async (req: NextRequest) => {
  try {
    console.log("TC check transaction status API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    // Check if token exists
    if (!token) {
      console.log("No token found, returning 401");
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    
    let tcId;
    let userRole;
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      tcId = decoded.id;
      userRole = decoded.role;
      console.log("Token decoded, User ID:", tcId, "Role:", userRole);
      
      // Check if user is a TC
      if (userRole !== Role.Tc) {
        console.log("User is not a TC, role:", userRole);
        return NextResponse.json(
          { message: "Unauthorized: User is not a Transaction Coordinator" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    // Get transaction ID from query parameters
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");
    
    if (!transactionId) {
      return NextResponse.json(
        { message: "Bad request: Missing transaction ID" },
        { status: 400 }
      );
    }
    
    // Find the transaction
    const transaction = await TransactionModel.findOne({ transactionId });
    
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    
    // Check if transaction is ready for closure
    const isReadyForClosure = await isTransactionReadyForClosure(transactionId);
    
    // If ready for closure and not already in that status, update it
    if (isReadyForClosure && transaction.status !== TransactionStatus.ReadyForClosure) {
      transaction.status = TransactionStatus.ReadyForClosure;
      await transaction.save();
      
      return NextResponse.json({
        message: "Transaction status updated to Ready For Closure",
        transaction: {
          transactionId: transaction.transactionId,
          status: transaction.status,
          updatedAt: transaction.updatedAt
        }
      });
    }
    
    // Return current status
    return NextResponse.json({
      message: "Transaction status checked",
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        isReadyForClosure
      }
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return NextResponse.json(
      { message: "Failed to check transaction status", error: String(error) },
      { status: 500 }
    );
  }
});

// Endpoint to manually update transaction status
export const PUT = catchAsync(async (req: NextRequest) => {
  try {
    console.log("TC update transaction status API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    // Check if token exists
    if (!token) {
      console.log("No token found, returning 401");
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    
    let tcId;
    let userRole;
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      tcId = decoded.id;
      userRole = decoded.role;
      console.log("Token decoded, User ID:", tcId, "Role:", userRole);
      
      // Check if user is a TC
      if (userRole !== Role.Tc) {
        console.log("User is not a TC, role:", userRole);
        return NextResponse.json(
          { message: "Unauthorized: User is not a Transaction Coordinator" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);
    
    // Validate required fields
    if (!body.transactionId) {
      return NextResponse.json(
        { message: "Bad request: Missing transaction ID" },
        { status: 400 }
      );
    }
    
    // Find the transaction
    const transaction = await TransactionModel.findOne({ transactionId: body.transactionId });
    
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    
    // If status is provided, update it
    if (body.status) {
      // Validate status is a valid enum value
      if (!Object.values(TransactionStatus).includes(body.status)) {
        return NextResponse.json(
          { message: "Bad request: Invalid status value" },
          { status: 400 }
        );
      }
      
      transaction.status = body.status;
    } else {
      // If no status provided, check if ready for closure
      const isReadyForClosure = await isTransactionReadyForClosure(body.transactionId);
      
      if (isReadyForClosure) {
        transaction.status = TransactionStatus.ReadyForClosure;
      }
    }
    
    // Save the updated transaction
    await transaction.save();
    
    return NextResponse.json({
      message: "Transaction status updated successfully",
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        updatedAt: transaction.updatedAt
      }
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json(
      { message: "Failed to update transaction status", error: String(error) },
      { status: 500 }
    );
  }
});