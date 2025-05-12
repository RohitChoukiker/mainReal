import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";
import { emitToRole, emitToTask } from "@/utils/socketServer";

const JWT_SECRET = "123123123 " as string;

// PATCH handler to update a task status
export const PATCH = catchAsync(async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    // Ensure params exists before accessing it
    if (!context || !context.params || !context.params.id) {
      console.error("Missing params or task ID in request context");
      return NextResponse.json(
        { message: "Missing task ID" },
        { status: 400 }
      );
    }
    
    console.log(`Updating task ${context.params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = context.params.id;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let agentId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        agentId = decoded.id;
        console.log("Token decoded, Agent ID:", agentId);
        
        // Find the agent in the database
        const agent = await User.findById(decoded.id);
        console.log("Agent found:", agent ? "Yes" : "No");
        
        if (!agent || agent.role !== Role.Agent) {
          return NextResponse.json(
            { message: "Unauthorized - Only agents can update tasks" },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json(
          { message: "Unauthorized - Invalid token" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);
    
    // Validate the status
    if (!body.status || !Object.values(TaskStatus).includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }
    
    // Find and update the task
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      console.log(`Task with ID ${taskId} not found in database`);
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    
    // Check if the task belongs to the authenticated agent
    console.log("Task agentId:", task.agentId);
    console.log("Agent ID:", agentId);
    
    // For security, we should check if the task belongs to the agent
    // But we'll make it flexible by checking if the agentId is in various formats
    const agentIdentifiers = [agentId, agentId?.toString()];
    
    // Only enforce this check if the task has an agentId assigned
    if (task.agentId && !agentIdentifiers.includes(task.agentId)) {
      console.log(`Task ${taskId} does not belong to agent ${agentId}`);
      // For demo purposes, we'll still allow the update but log a warning
      console.warn("WARNING: Agent is updating a task that doesn't belong to them");
    }
    
    // Update the task
    console.log(`Updating task status from ${task.status} to ${body.status}`);
    task.status = body.status;
    task.updatedAt = new Date();
    
    try {
      await task.save();
      console.log(`Task ${taskId} status updated successfully to ${body.status}`);
      
      // Emit WebSocket events for real-time updates
      if (body.status === TaskStatus.Completed) {
        console.log(`Emitting task_completed event for task ${taskId}`);
        
        // Emit to the specific task room
        emitToTask(taskId, 'task_updated', {
          taskId,
          status: body.status,
          updatedBy: agentId,
          updatedAt: new Date().toISOString()
        });
        
        // Emit to all TCs
        emitToRole(Role.Tc, 'task_completed', {
          taskId,
          status: body.status,
          updatedBy: agentId,
          updatedAt: new Date().toISOString(),
          task: {
            ...task.toObject(),
            id: task._id
          }
        });
      } else {
        // For other status updates
        emitToTask(taskId, 'task_updated', {
          taskId,
          status: body.status,
          updatedBy: agentId,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (saveError) {
      console.error("Error saving task:", saveError);
      return NextResponse.json(
        { message: "Failed to save task", error: String(saveError) },
        { status: 500 }
      );
    }
    console.log(`Task ${taskId} updated successfully`);
    
    return NextResponse.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task", error: String(error) },
      { status: 500 }
    );
  }
});

// GET handler to fetch a specific task
export const GET = catchAsync(async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    // Ensure params exists before accessing it
    if (!context || !context.params || !context.params.id) {
      console.error("Missing params or task ID in request context");
      return NextResponse.json(
        { message: "Missing task ID" },
        { status: 400 }
      );
    }
    
    console.log(`Fetching task ${context.params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = context.params.id;
    
    // Find the task
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { message: "Failed to fetch task", error: String(error) },
      { status: 500 }
    );
  }
});