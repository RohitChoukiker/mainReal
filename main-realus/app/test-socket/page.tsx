"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SocketStatus } from "@/components/socket-status"
import { useSocket } from "@/utils/useSocket"

export default function TestSocketPage() {
  const { socket, isConnected, isAuthenticated } = useSocket()
  const [messages, setMessages] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  
  useEffect(() => {
    if (!socket || !isConnected || !isAuthenticated) return
    
    // Listen for test messages
    const handleTestMessage = (data: any) => {
      setMessages(prev => [...prev, `Received: ${data.message}`])
    }
    
    socket.on('test_message', handleTestMessage)
    
    // Join test room
    socket.emit('join_task', 'test-room')
    
    return () => {
      socket.off('test_message', handleTestMessage)
      socket.emit('leave_task', 'test-room')
    }
  }, [socket, isConnected, isAuthenticated])
  
  const sendMessage = () => {
    if (!socket || !isConnected || !isAuthenticated || !inputValue.trim()) return
    
    // Send message to server
    socket.emit('test_message', { 
      message: inputValue,
      room: 'test-room'
    })
    
    // Add to local messages
    setMessages(prev => [...prev, `Sent: ${inputValue}`])
    
    // Clear input
    setInputValue("")
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>WebSocket Test</CardTitle>
          <CardDescription>
            Test the WebSocket connection by sending and receiving messages
          </CardDescription>
          <SocketStatus />
        </CardHeader>
        
        <CardContent>
          <div className="h-[300px] overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 h-full flex items-center justify-center">
                No messages yet. Start by sending a message.
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-md ${msg.startsWith('Sent') ? 'bg-blue-100 ml-8' : 'bg-gray-200 mr-8'}`}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex w-full gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={!isConnected || !isAuthenticated}
            />
            <Button 
              onClick={sendMessage}
              disabled={!isConnected || !isAuthenticated || !inputValue.trim()}
            >
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}