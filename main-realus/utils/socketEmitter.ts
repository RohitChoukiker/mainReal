import { Server as SocketIOServer } from "socket.io";
import { Role } from "@/models/userModel";
import { TransactionStatus } from "@/models/transactionModel";

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

// Transaction stats interface
interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  atRisk: number;
}

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

// Emit transaction created event to broker
export const emitTransactionCreated = (transaction: any, brokerId: string) => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log(`Emitting transaction_created event for transaction: ${transaction.transactionId}`);
    
    // Emit to broker room
    io.to(Role.Broker).emit("transaction_created", {
      transaction,
      timestamp: new Date()
    });
    
    // Emit to specific broker if brokerId is available
    if (brokerId) {
      console.log(`Emitting transaction_created event to broker: ${brokerId}`);
      io.to(`broker:${brokerId}`).emit("transaction_created", {
        transaction,
        timestamp: new Date()
      });
    }
    
    // Update transaction stats for all brokers
    emitTransactionStatsUpdate();
  } catch (error) {
    console.error("Error emitting transaction_created event:", error);
  }
};

// Emit transaction updated event to broker
export const emitTransactionUpdated = (transaction: any, brokerId: string) => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log(`Emitting transaction_updated event for transaction: ${transaction.transactionId}`);
    
    // Emit to broker room
    io.to(Role.Broker).emit("transaction_updated", {
      transaction,
      timestamp: new Date()
    });
    
    // Emit to specific broker if brokerId is available
    if (brokerId) {
      console.log(`Emitting transaction_updated event to broker: ${brokerId}`);
      io.to(`broker:${brokerId}`).emit("transaction_updated", {
        transaction,
        timestamp: new Date()
      });
    }
    
    // Update transaction stats for all brokers
    emitTransactionStatsUpdate();
  } catch (error) {
    console.error("Error emitting transaction_updated event:", error);
  }
};

// Emit transaction stats update to all brokers
export const emitTransactionStatsUpdate = async () => {
  try {
    const io = getSocketServer();
    if (!io) {
      console.error("Socket.io server not initialized");
      return;
    }
    
    console.log("Emitting transaction stats update");
    
    // In a real implementation, you would fetch the latest stats from the database
    // For now, we'll simulate this with a fetch to the API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/broker/transactions`);
      
      if (response.ok) {
        const data = await response.json();
        const transactions = data.transactions || [];
        
        // Calculate transaction statistics
        const stats: TransactionStats = {
          total: transactions.length,
          completed: transactions.filter((t: any) => 
            t.status === TransactionStatus.Closed || 
            t.status === TransactionStatus.Approved
          ).length,
          pending: transactions.filter((t: any) => 
            t.status === TransactionStatus.New || 
            t.status === TransactionStatus.InProgress
          ).length,
          atRisk: transactions.filter((t: any) => 
            t.status === TransactionStatus.PendingDocuments || 
            t.status === TransactionStatus.UnderReview
          ).length
        };
        
        // Emit to broker room
        io.to(Role.Broker).emit("transaction_stats_updated", {
          stats,
          timestamp: new Date()
        });
      }
    } catch (fetchError) {
      console.error("Error fetching transaction stats:", fetchError);
    }
  } catch (error) {
    console.error("Error emitting transaction stats update:", error);
  }
};