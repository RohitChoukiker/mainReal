// This file has been modified to remove the messaging feature
// The useRealTimeMessages hook now returns dummy values

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

interface UseRealTimeMessagesOptions {
  taskId: string;
  onError?: (error: Error) => void;
  onNewMessage?: (message: Message) => void;
}

export function useRealTimeMessages({
  taskId,
  onError,
  onNewMessage
}: UseRealTimeMessagesOptions) {
  // Return dummy values for compatibility
  return {
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: async () => false,
    fetchMessages: async () => {}
  };
}