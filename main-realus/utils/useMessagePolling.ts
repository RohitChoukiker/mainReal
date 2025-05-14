// This file has been modified to remove the messaging feature
// The useMessagePolling hook now returns dummy values for compatibility

import { useState } from 'react';

interface Message {
  _id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface UseMessagePollingOptions {
  taskId: string;
  pollingInterval?: number;
  onError?: (error: Error) => void;
}

export function useMessagePolling({ 
  taskId, 
  pollingInterval = 3000,
  onError
}: UseMessagePollingOptions) {
  // Return dummy values for compatibility
  return {
    messages: [],
    isLoading: false,
    error: null,
    fetchMessages: async () => {},
    sendMessage: async () => false
  };
}