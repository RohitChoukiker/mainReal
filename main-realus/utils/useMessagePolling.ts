import { useState, useEffect, useRef } from 'react';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/tasks/${taskId}/messages?t=${timestamp}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Convert unknown error to Error object
      const errorObject = error instanceof Error ? error : new Error(String(error));
      setError(errorObject);
      
      if (onError) {
        onError(errorObject);
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    try {
      const response = await fetch(`/api/tasks/${taskId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      // Fetch the latest messages
      await fetchMessages(false);
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      // Convert unknown error to Error object
      const errorObject = error instanceof Error ? error : new Error(String(error));
      setError(errorObject);
      
      if (onError) {
        onError(errorObject);
      }
      
      return false;
    }
  };

  // Start polling when taskId changes
  useEffect(() => {
    if (taskId) {
      // Initial fetch
      fetchMessages();
      
      // Set up polling
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(false); // Don't show loading state for polling
      }, pollingInterval);
    }
    
    // Clean up polling when component unmounts or taskId changes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [taskId, pollingInterval]);

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage
  };
}