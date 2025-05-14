import { NextRequest, NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import User, { Role } from "@/models/userModel";
import dbConnect from "@/utils/dbConnect";
import { setSocketServer } from "@/utils/socketEmitter";

// Global socket.io instance
let io: SocketIOServer | null = null;

// JWT secret for token verification
const JWT_SECRET = "123123123 " as string;

// Initialize socket.io server
const initSocketServer = () => {
  if (io) return io;
  
  console.log("Initializing socket.io server...");
  
  // Create HTTP server
  const httpServer = createServer();
  
  // Create socket.io server
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/api/socket"
  });
  
  // Socket.io connection event
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    
    // Authenticate socket connection
    socket.on("authenticate", async (token) => {
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        
        // Connect to database
        await dbConnect();
        
        // Find user in database
        const user = await User.findById(decoded.id);
        
        if (!user) {
          console.log("User not found in database");
          socket.emit("authentication_error", { message: "User not found" });
          return;
        }
        
        // Store user data in socket
        socket.data.user = {
          id: user._id,
          name: user.name,
          role: user.role
        };
        
        console.log(`Socket authenticated: ${socket.id} (${user.name}, ${user.role})`);
        
        // Join room based on user role
        socket.join(user.role);
        
        // Emit authenticated event
        socket.emit("authenticated", { 
          message: "Socket authenticated successfully",
          user: {
            id: user._id,
            name: user.name,
            role: user.role
          }
        });
      } catch (error) {
        console.error("Socket authentication error:", error);
        socket.emit("authentication_error", { message: "Authentication failed" });
      }
    });
    
    // Disconnect event
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
  
  // Start HTTP server
  httpServer.listen(3001, () => {
    console.log("Socket.io server listening on port 3001");
  });
  
  // Set the socket server in our utility
  setSocketServer(io);
  
  return io;
};

// Get socket.io server instance
const getSocketServer = () => {
  if (!io) {
    return initSocketServer();
  }
  return io;
};

// API route handler
export async function GET(req: NextRequest) {
  try {
    // Initialize socket.io server if not already initialized
    const io = getSocketServer();
    
    return NextResponse.json({
      message: "Socket.io server is running",
      status: "ok"
    });
  } catch (error) {
    console.error("Error in socket.io API route:", error);
    return NextResponse.json(
      { message: "Failed to initialize socket.io server", error: String(error) },
      { status: 500 }
    );
  }
}