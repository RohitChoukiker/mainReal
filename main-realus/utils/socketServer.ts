import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest } from 'next';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

export type SocketUser = {
  userId: string;
  role: string;
  socketId: string;
};

// Global variable to store the Socket.IO server instance
let io: SocketIOServer | null = null;

// Map to store connected users
const connectedUsers = new Map<string, SocketUser>();

export function initSocketServer(server: NetServer) {
  if (io) return io;

  console.log('Initializing Socket.IO server');
  
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    
    // Handle authentication
    socket.on('authenticate', async (token: string) => {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        const userId = decoded.id;
        const role = decoded.role;
        
        console.log(`User authenticated: ${userId}, role: ${role}`);
        
        // Store user information
        connectedUsers.set(userId, {
          userId,
          role,
          socketId: socket.id
        });
        
        // Join rooms based on role
        socket.join(`role:${role}`);
        socket.join(`user:${userId}`);
        
        // Notify client of successful authentication
        socket.emit('authenticated', { userId, role });
        
        console.log(`Current connected users: ${connectedUsers.size}`);
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('auth_error', { message: 'Authentication failed' });
      }
    });
    
    // Handle joining a task room
    socket.on('join_task', (taskId: string) => {
      console.log(`Socket ${socket.id} joining task room: ${taskId}`);
      socket.join(`task:${taskId}`);
      socket.emit('joined_task', { taskId });
    });
    
    // Handle leaving a task room
    socket.on('leave_task', (taskId: string) => {
      console.log(`Socket ${socket.id} leaving task room: ${taskId}`);
      socket.leave(`task:${taskId}`);
    });
    
    // Handle joining a room (generic)
    socket.on('join_room', (data: { role?: string, userId?: string, transactionId?: string }) => {
      if (data.role) {
        console.log(`Socket ${socket.id} joining role room: ${data.role}`);
        socket.join(data.role);
      }
      
      if (data.userId) {
        console.log(`Socket ${socket.id} joining user room: ${data.userId}`);
        socket.join(`user:${data.userId}`);
      }
      
      if (data.transactionId) {
        console.log(`Socket ${socket.id} joining transaction room: ${data.transactionId}`);
        socket.join(`transaction:${data.transactionId}`);
      }
      
      socket.emit('joined_rooms', data);
    });
    
    // Handle subscribing to transaction updates
    socket.on('subscribe_to_transactions', () => {
      console.log(`Socket ${socket.id} subscribing to transaction updates`);
      // Find user role from connected users
      let userRole = '';
      for (const [userId, user] of connectedUsers.entries()) {
        if (user.socketId === socket.id) {
          userRole = user.role;
          break;
        }
      }
      
      if (userRole) {
        socket.join(`transaction_updates:${userRole}`);
        socket.emit('subscribed_to_transactions', { success: true });
      } else {
        socket.emit('subscription_error', { message: 'User not authenticated' });
      }
    });
    
    // Handle request for transaction stats
    socket.on('request_transaction_stats', async () => {
      console.log(`Socket ${socket.id} requesting transaction stats`);
      
      // Find user role from connected users
      let userRole = '';
      let userId = '';
      for (const [id, user] of connectedUsers.entries()) {
        if (user.socketId === socket.id) {
          userRole = user.role;
          userId = id;
          break;
        }
      }
      
      if (userRole === 'Broker') {
        try {
          // Import the emitTransactionStatsUpdate function
          const { emitTransactionStatsUpdate } = await import('./socketEmitter');
          
          // Trigger a stats update
          await emitTransactionStatsUpdate();
          
          console.log(`Transaction stats update triggered for broker: ${userId}`);
        } catch (error) {
          console.error('Error triggering transaction stats update:', error);
        }
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Find and remove the disconnected user
      for (const [userId, user] of connectedUsers.entries()) {
        if (user.socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} removed from connected users`);
          break;
        }
      }
      
      console.log(`Remaining connected users: ${connectedUsers.size}`);
    });
  });

  console.log('Socket.IO server initialized');
  return io;
}

export function getSocketServer() {
  return io;
}

export function getConnectedUsers() {
  return connectedUsers;
}

// Function to emit a message to a specific task room
export function emitToTask(taskId: string, event: string, data: any) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to task:${taskId}`);
  io.to(`task:${taskId}`).emit(event, data);
}

// Function to emit a message to a specific user
export function emitToUser(userId: string, event: string, data: any) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to user:${userId}`);
  io.to(`user:${userId}`).emit(event, data);
}

// Function to emit a message to all users with a specific role
export function emitToRole(role: string, event: string, data: any) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to role:${role}`);
  io.to(`role:${role}`).emit(event, data);
}

// Function to emit transaction updates
export function emitTransactionUpdate(transactionId: string, event: string, data: any) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} for transaction:${transactionId}`);
  io.to(`transaction:${transactionId}`).emit(event, data);
}

// Function to emit transaction stats updates to brokers
export function emitTransactionStatsUpdate(stats: any) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log('Emitting transaction_stats_updated to brokers');
  io.to('Broker').emit('transaction_stats_updated', {
    stats,
    timestamp: new Date()
  });
}

// Helper function to get user ID from request cookies
export function getUserFromRequest(req: NextApiRequest): { userId: string, role: string } | null {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
    return {
      userId: decoded.id,
      role: decoded.role
    };
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

// These functions are already exported individually above
// No need to re-export them here