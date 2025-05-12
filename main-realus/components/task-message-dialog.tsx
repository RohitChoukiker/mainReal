"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useMessagePolling } from "@/utils/useMessagePolling"

interface Message {
  _id: string
  taskId: string
  senderId: string
  senderName: string
  senderRole: string
  message: string
  createdAt: string
  read: boolean
}

interface TaskMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
  transactionId: string
  currentUserRole: 'agent' | 'tc'
}

export function TaskMessageDialog({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  transactionId,
  currentUserRole
}: TaskMessageDialogProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Use our custom hook for message polling
  const { 
    messages, 
    isLoading, 
    sendMessage: sendMessageToApi 
  } = useMessagePolling({
    taskId,
    pollingInterval: 3000,
    onError: (error) => {
      toast.error("Failed to load messages", {
        description: error.message
      })
    }
  })

  // Focus input field when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    setIsSending(true)
    
    try {
      const success = await sendMessageToApi(newMessage)
      
      if (success) {
        // Clear the input field
        setNewMessage("")
        
        // Focus the input field again
        inputRef.current?.focus()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message", {
        description: error.message
      })
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {}
  messages.forEach(message => {
    const date = formatDate(message.createdAt)
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Transaction</DialogTitle>
            <Badge variant="outline" className="font-mono">{transactionId}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Task: {taskTitle}</p>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4 max-h-[50vh]">
            {Object.keys(groupedMessages).length > 0 ? (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-4">
                  <div className="text-center mb-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map((message) => (
                    <div 
                      key={message._id} 
                      className={`flex items-start gap-2 mb-4 ${
                        message.senderRole === currentUserRole 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      {message.senderRole !== currentUserRole && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={message.senderRole === 'tc' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                            {message.senderName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[80%] ${
                        message.senderRole === currentUserRole 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      } rounded-lg px-3 py-2`}>
                        {message.senderRole !== currentUserRole && (
                          <div className="text-xs font-medium mb-1">
                            {message.senderName}
                          </div>
                        )}
                        <div className="text-sm break-words">{message.message}</div>
                        <div className="text-xs opacity-70 text-right mt-1">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                      
                      {message.senderRole === currentUserRole && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={message.senderRole === 'tc' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                            {message.senderName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        )}
        
        <DialogFooter className="flex sm:justify-between items-end">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}