import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import MessageModel from "@/models/messageModel";
import TaskModel from "@/models/taskModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

const JWT_SECRET = "123123123 " as string;

// GET handler to fetch messages for a specific task
export const GET = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log(`Fetching messages for task ${params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = params.id;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let userId, userRole;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        userId = decoded.id;
        userRole = decoded.role;
        console.log("Token decoded, User ID:", userId, "Role:", userRole);
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
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const before = url.searchParams.get("before");
    
    // Build query
    const query: any = { taskId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    // Fetch messages
    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    console.log(`Found ${messages.length} messages for task ${taskId}`);
    
    // Mark messages as read if they were sent to the current user
    const otherRole = userRole === Role.Agent ? 'tc' : 'agent';
    await MessageModel.updateMany(
      { 
        taskId,
        senderRole: otherRole,
        read: false
      },
      { read: true }
    );
    
    return NextResponse.json({
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages", error: String(error) },
      { status: 500 }
    );
  }
});

// POST handler to send a message for a specific task
export const POST = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log(`Sending message for task ${params.id}`);
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the task ID from the URL
    const taskId = params.id;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let userId, userRole, userName;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        userId = decoded.id;
        userRole = decoded.role;
        console.log("Token decoded, User ID:", userId, "Role:", userRole);
        
        // Find the user in the database
        const user = await User.findById(decoded.id);
        if (user) {
          userName = user.name || user.email || 'Unknown User';
        } else {
          userName = userRole === Role.Agent ? 'Agent' : 'TC Manager';
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
    
    // Check if the task exists
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);
    
    // Validate the message
    if (!body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return NextResponse.json(
        { message: "Invalid message content" },
        { status: 400 }
      );
    }
    
    // Create the message
    const newMessage = new MessageModel({
      taskId,
      senderId: userId,
      senderName: userName,
      senderRole: userRole === Role.Agent ? 'agent' : 'tc',
      message: body.message.trim(),
      read: false
    });
    
    // Save the message
    const savedMessage = await newMessage.save();
    console.log(`Message saved with ID: ${savedMessage._id}`);
    
    return NextResponse.json({
      message: "Message sent successfully",
      data: savedMessage
    }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Failed to send message", error: String(error) },
      { status: 500 }
    );
  }
});