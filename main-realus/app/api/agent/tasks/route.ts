import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

const JWT_SECRET = "123123123 " as string;

// GET handler to fetch tasks assigned to the current agent
export const GET = catchAsync(async (req: NextRequest) => {
  try {
    console.log("Agent tasks API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let agentId;
    let query: any = {};
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        agentId = decoded.id;
        console.log("Token decoded, Agent ID:", agentId);
        
        // Find the agent in the database
        const agent = await User.findById(decoded.id);
        console.log("Agent found:", agent ? "Yes" : "No");
        
        if (agent && agent.role === Role.Agent) {
          // Filter tasks by agent ID
          query.agentId = agent.name || agent.email || decoded.id;
          console.log("Filtering tasks for agent:", query.agentId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    console.log("Final query:", JSON.stringify(query));
    
    let total = 0;
    let tasks = [];
    
    try {
      // Get total count for pagination
      total = await TaskModel.countDocuments(query);
      console.log(`Total task count: ${total}`);
      
      // Get tasks
      tasks = await TaskModel.find(query)
        .sort({ status: 1, dueDate: 1 }) // Sort by status and due date
        .skip(skip)
        .limit(limit);
      
      console.log(`Found ${tasks.length} tasks in database`);
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // Return empty array instead of failing
      tasks = [];
      console.log("Using empty tasks array due to database error");
    }
    
    // If we don't have any tasks from the database, generate some demo tasks
    if (tasks.length === 0) {
      console.log("No tasks found in database, generating demo tasks");
      
      // Mock data for demonstration
      tasks = [
        {
          _id: "task-1",
          title: "Schedule home inspection",
          transactionId: "TR-7829",
          propertyAddress: "123 Main St, Austin, TX",
          agentId: "agent-123",
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          status: "pending",
          priority: "high",
          description: "Contact the inspector and schedule a home inspection as soon as possible.",
          aiReminder: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedBy: "TC Manager"
        },
        {
          _id: "task-2",
          title: "Collect HOA documents",
          transactionId: "TR-7829",
          propertyAddress: "123 Main St, Austin, TX",
          agentId: "agent-123",
          dueDate: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
          status: "in_progress",
          priority: "medium",
          description: "Obtain all HOA documents including bylaws, financials, and meeting minutes.",
          aiReminder: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
          assignedBy: "TC Manager"
        },
        {
          _id: "task-3",
          title: "Submit financing application",
          transactionId: "TR-6543",
          propertyAddress: "456 Oak Ave, Dallas, TX",
          agentId: "agent-123",
          dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          status: "overdue",
          priority: "high",
          description: "Complete and submit the mortgage application with all required documentation.",
          aiReminder: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedBy: "TC Manager"
        }
      ];
      
      total = tasks.length;
      
      // Apply pagination
      tasks = tasks.slice(skip, skip + limit);
    }
    
    // Check for overdue tasks and update their status
    tasks = tasks.map(task => {
      const taskObj = task.toObject ? task.toObject() : task;
      
      // Check if the task is overdue
      if (taskObj.status !== TaskStatus.Completed && 
          new Date(taskObj.dueDate) < new Date() && 
          taskObj.status !== TaskStatus.Overdue) {
        taskObj.status = TaskStatus.Overdue;
      }
      
      return taskObj;
    });
    
    console.log(`Returning ${tasks.length} tasks (total: ${total})`);
    
    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      agentId, // Include the agent ID in the response for debugging
    });
  } catch (error) {
    console.error("Error fetching agent tasks:", error);
    return NextResponse.json(
      { message: "Failed to fetch tasks", error: String(error) },
      { status: 500 }
    );
  }
});