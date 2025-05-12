import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";
import { emitTaskUpdated, emitTaskCompleted } from "@/utils/socketEmitter";

const JWT_SECRET = "123123123 " as string;

// Function to check if transaction is ready for closure
async function checkTransactionReadyForClosure(transactionId: string) {
  try {
    // Call the transaction status update API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/tc/transactions/update-status?transactionId=${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to check transaction status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log("Transaction status check result:", data);
    
    return data;
  } catch (error) {
    console.error("Error checking transaction status:", error);
  }
}

export const PUT = catchAsync(async (req: NextRequest) => {
  try {
    console.log("TC update task API called");
    
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
    if (!body.taskId) {
      return NextResponse.json(
        { message: "Bad request: Missing task ID" },
        { status: 400 }
      );
    }
    
    // Find the task
    const task = await TaskModel.findById(body.taskId);
    
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    
    // Update task fields
    if (body.status) {
      task.status = body.status;
    }
    
    if (body.priority) {
      task.priority = body.priority;
    }
    
    if (body.title) {
      task.title = body.title;
    }
    
    if (body.description !== undefined) {
      task.description = body.description;
    }
    
    if (body.dueDate) {
      task.dueDate = new Date(body.dueDate);
    }
    
    if (body.aiReminder !== undefined) {
      task.aiReminder = body.aiReminder;
    }
    
    // Save the updated task
    await task.save();
    
    // Emit task updated event
    emitTaskUpdated(task);
    
    // If task is marked as completed, emit task completed event
    if (task.status === TaskStatus.Completed) {
      emitTaskCompleted(task);
      
      // Check if transaction is ready for closure
      const transactionId = task.transactionId;
      if (transactionId) {
        const transactionStatus = await checkTransactionReadyForClosure(transactionId);
        console.log("Transaction status after task completion:", transactionStatus);
      }
    }
    
    return NextResponse.json({
      message: "Task updated successfully",
      task: task
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task", error: String(error) },
      { status: 500 }
    );
  }
});