// This file has been modified to remove the messaging feature
// The useSocket hook now returns dummy values

export function useSocket() {
  // Return dummy values for compatibility
  return {
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    error: null,
    connect: () => null,
    disconnect: () => {},
    joinTask: () => {},
    leaveTask: () => {}
  };
}