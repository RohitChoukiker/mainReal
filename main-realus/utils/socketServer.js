const { Server: SocketIOServer } = require('socket.io');
const { parse } = require('cookie');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "123123123 ";

// Global variable to store the Socket.IO server instance
let io = null;

// Map to store connected users
const connectedUsers = new Map();

function initSocketServer(server) {
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
    socket.on('authenticate', async (token) => {
      try {
        console.log('Authentication attempt with token:', token ? 'Token provided' : 'No token');
        
        // For development/testing, accept a mock token
        if (process.env.NODE_ENV === 'development' && token === 'mock-token-for-development') {
          const mockUserId = 'mock-user-id';
          const mockRole = 'agent';
          
          console.log(`Development mode: Mock user authenticated: ${mockUserId}, role: ${mockRole}`);
          
          // Store user information
          connectedUsers.set(mockUserId, {
            userId: mockUserId,
            role: mockRole,
            socketId: socket.id
          });
          
          // Join rooms based on role
          socket.join(`role:${mockRole}`);
          socket.join(`user:${mockUserId}`);
          
          // Notify client of successful authentication
          socket.emit('authenticated', { userId: mockUserId, role: mockRole });
          
          console.log(`Current connected users: ${connectedUsers.size}`);
          return;
        }
        
        // Regular token verification
        if (!token) {
          throw new Error('No token provided');
        }
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
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
        socket.emit('auth_error', { message: 'Authentication failed: ' + error.message });
      }
    });
    
    // Handle joining a task room
    socket.on('join_task', (taskId) => {
      console.log(`Socket ${socket.id} joining task room: ${taskId}`);
      socket.join(`task:${taskId}`);
      socket.emit('joined_task', { taskId });
    });
    
    // Handle leaving a task room
    socket.on('leave_task', (taskId) => {
      console.log(`Socket ${socket.id} leaving task room: ${taskId}`);
      socket.leave(`task:${taskId}`);
    });
    
    // Handle test messages
    socket.on('test_message', (data) => {
      console.log(`Test message received: ${data.message}`);
      if (data.room) {
        // Broadcast to the room (excluding sender)
        socket.to(`task:${data.room}`).emit('test_message', data);
        console.log(`Broadcasted to room: task:${data.room}`);
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

function getSocketServer() {
  return io;
}

function getConnectedUsers() {
  return connectedUsers;
}

// Function to emit a message to a specific task room
function emitToTask(taskId, event, data) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to task:${taskId}`);
  io.to(`task:${taskId}`).emit(event, data);
}

// Function to emit a message to a specific user
function emitToUser(userId, event, data) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to user:${userId}`);
  io.to(`user:${userId}`).emit(event, data);
}

// Function to emit a message to all users with a specific role
function emitToRole(role, event, data) {
  if (!io) {
    console.warn('Socket.IO server not initialized');
    return;
  }
  
  console.log(`Emitting ${event} to role:${role}`);
  io.to(`role:${role}`).emit(event, data);
}

// Helper function to get user ID from request cookies
function getUserFromRequest(req) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      userId: decoded.id,
      role: decoded.role
    };
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

module.exports = {
  initSocketServer,
  getSocketServer,
  getConnectedUsers,
  emitToTask,
  emitToUser,
  emitToRole,
  getUserFromRequest
};