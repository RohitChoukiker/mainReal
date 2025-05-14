import { Server as SocketIOServer } from "socket.io";
import { Role } from "@/models/userModel";

// Global variable to store the Socket.IO server instance
let io: SocketIOServer | null = null;

// Function to get or set the socket server instance
export const getSocketServer = () => {
  return io;
};

export const setSocketServer = (socketServer: SocketIOServer) => {
  io = socketServer;
  return io;
};

// Emit task created event to all TC users
export const emitTaskCreated = (task: any) => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log(`Emitting task_created event for task: ${task._id}`);
    
    // Emit to TC room
    io.to(Role.Tc).emit("task_created", {
      task,
      timestamp: new Date()
    });
    
    // Emit to specific agent if agentId is available
    if (task.agentId) {
      console.log(`Emitting task_assigned event to agent: ${task.agentId}`);
      io.to(`agent:${task.agentId}`).emit("task_assigned", {
        task,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error("Error emitting task_created event:", error);
  }
};

// Emit task updated event to all TC users
export const emitTaskUpdated = (task: any) => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log(`Emitting task_updated event for task: ${task._id}`);
    
    // Emit to TC room
    io.to(Role.Tc).emit("task_updated", {
      task,
      timestamp: new Date()
    });
    
    // Emit to specific agent if agentId is available
    if (task.agentId) {
      console.log(`Emitting task_updated event to agent: ${task.agentId}`);
      io.to(`agent:${task.agentId}`).emit("task_updated", {
        task,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error("Error emitting task_updated event:", error);
  }
};

// Emit task completed event to all TC users
export const emitTaskCompleted = (task: any) => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log(`Emitting task_completed event for task: ${task._id}`);
    
    // Emit to TC room
    io.to(Role.Tc).emit("task_completed", {
      task,
      taskId: task._id,
      timestamp: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error emitting task_completed event:", error);
  }
};