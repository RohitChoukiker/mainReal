 "use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/context/auth-context";

// Define the transaction stats type
export interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  atRisk: number;
}

export function useTransactionSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userId, role, isAuthenticated } = useAuthContext();

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !userId || !role) return;

    // Create socket connection
    const socketInstance = io({
      path: "/api/socket",
      autoConnect: true,
    });

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      
      // Join role-specific room
      socketInstance.emit("join_room", { role });
      
      // Join user-specific room
      socketInstance.emit("join_room", { userId });
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, userId, role]);

  // Function to subscribe to transaction updates
  const subscribeToTransactionUpdates = (
    callback: (stats: TransactionStats) => void
  ) => {
    if (!socket) return () => {};

    const handleTransactionUpdate = (data: { stats: TransactionStats }) => {
      console.log("Received transaction update:", data);
      
      // Make sure we have valid stats data
      if (data && data.stats) {
        // Ensure all required properties exist
        const validatedStats: TransactionStats = {
          total: data.stats.total || 0,
          completed: data.stats.completed || 0,
          pending: data.stats.pending || 0,
          atRisk: data.stats.atRisk || 0
        };
        
        // Call the callback with validated stats
        callback(validatedStats);
      }
    };

    // Listen for transaction updates
    socket.on("transaction_stats_updated", handleTransactionUpdate);
    
    // Also listen for individual transaction events that might affect stats
    socket.on("transaction_created", () => {
      // Request updated stats when a transaction is created
      socket.emit("request_transaction_stats");
    });
    
    socket.on("transaction_updated", () => {
      // Request updated stats when a transaction is updated
      socket.emit("request_transaction_stats");
    });

    // Return cleanup function
    return () => {
      socket.off("transaction_stats_updated", handleTransactionUpdate);
      socket.off("transaction_created");
      socket.off("transaction_updated");
    };
  };

  return {
    socket,
    isConnected,
    subscribeToTransactionUpdates,
  };
}