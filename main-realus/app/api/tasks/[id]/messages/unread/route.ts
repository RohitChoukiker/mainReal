import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import MessageModel from "@/models/messageModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

const JWT_SECRET = "123123123 " as string;

// GET handler to fetch unread message count for a specific task
export const GET = catchAsync(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log(`Fetching unread message count for task ${params.id}`);
    
    // Connect to database
    await dbConnect();
    
    // Get the task ID from the URL
    const taskId = params.id;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    
    let userId, userRole;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        userId = decoded.id;
        userRole = decoded.role;
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
    
    // Get the role from query parameters (this is the role of messages we want to count)
    const url = new URL(req.url);
    const role = url.searchParams.get("role") || (userRole === Role.Agent ? 'agent' : 'tc');
    
    // The other role is the one sending messages to this user
    const otherRole = role === 'agent' ? 'tc' : 'agent';
    
    // Count unread messages
    const unreadCount = await MessageModel.countDocuments({
      taskId,
      senderRole: otherRole, // Messages from the other role
      read: false
    });
    
    console.log(`Found ${unreadCount} unread messages for task ${taskId}`);
    
    return NextResponse.json({
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { message: "Failed to fetch unread count", error: String(error) },
      { status: 500 }
    );
  }
});