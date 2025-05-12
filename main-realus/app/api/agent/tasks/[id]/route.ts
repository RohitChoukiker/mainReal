import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

const JWT_SECRET = "123123123 " as string;

// PATCH handler to update a task status
export const PATCH = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log(`Updating task ${params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = params.id;
    
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
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    
    // Check if the task belongs to the authenticated agent
    if (task.agentId && task.agentId !== agentId) {
      return NextResponse.json(
        { message: "Unauthorized - You can only update your own tasks" },
        { status: 403 }
      );
    }
    
    // Update the task
    task.status = body.status;
    task.updatedAt = new Date();
    
    await task.save();
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
export const GET = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log(`Fetching task ${params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = params.id;
    
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