"use client"

import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCcw, CheckSquare, Clock, AlertTriangle, CheckCircle, PlusCircle } from "lucide-react"
import Link from "next/link"

interface ApiTask {
  _id: string;
  title: string;
  transactionId: string;
  propertyAddress?: string;
  agentId?: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue" | "in_progress";
  priority: "low" | "medium" | "high";
  description?: string;
  aiReminder: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiTransaction {
  transactionId: string;
  propertyAddress: string;
  city: string;
  state: string;
  clientName: string;
  agentId: string;
  status: string;
  createdAt: string;
  closingDate: string;
  price: number;
}

interface Transaction {
  id: string;
  property: string;
  client: string;
  agent: {
    name: string;
    avatar: string;
  };
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled" | "New" | "new";
  createdDate: string;
  closingDate: string;
  price?: string;
  completionPercentage: number;
}

interface Task {
  id: string;
  title: string;
  transactionId: string;
  property: string;
  agent: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue" | "in_progress";
  priority: "low" | "medium" | "high";
  description?: string;
  aiReminder?: boolean;
  timestamp: number;
  transaction?: Transaction; // Add transaction information
}

export default function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskAlert, setNewTaskAlert] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const socketRef = useRef<Socket | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  
  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      console.log('Initializing socket connection for TC task panel...')
      socketRef.current = io({
        path: '/api/socket',
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })
      
      // Socket connection event handlers
      socketRef.current.on('connect', () => {
        console.log('Socket connected for TC task panel:', socketRef.current?.id)
        setSocketConnected(true)
        
        // Get token from cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        
        // Authenticate with the socket server
        if (cookies.token) {
          socketRef.current?.emit('authenticate', cookies.token)
        }
      })
      
      socketRef.current.on('authenticated', (data) => {
        console.log('Socket authenticated for TC task panel:', data)
      })
      
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error for TC task panel:', error)
      })
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected for TC task panel:', reason)
        setSocketConnected(false)
      })
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection for TC task panel')
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  // Function to fetch tasks and transactions from the API
  const fetchTasks = async () => {
    try {
      // Set loading state
      setLoading(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
      
      // Clear error
      setError(null)
      
      // Fetch tasks from API with credentials to include cookies
      const tasksResponse = await fetch("/api/tc/tasks", {
        credentials: 'include' // Include cookies for authentication
      })
      
      if (!tasksResponse.ok) {
        throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`)
      }
      
      const tasksData = await tasksResponse.json()
      console.log("Tasks data received:", tasksData)
      
      // Fetch transactions from API with credentials
      const transactionsResponse = await fetch("/api/tc/transactions", {
        credentials: 'include' // Include cookies for authentication
      })
      
      if (!transactionsResponse.ok) {
        throw new Error(`Failed to fetch transactions: ${transactionsResponse.status}`)
      }
      
      const transactionsData = await transactionsResponse.json()
      console.log("Transactions data received:", transactionsData)
      
      // Process transactions data
      let formattedTransactions: Transaction[] = [];
      if (transactionsData && transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
        // Convert API transactions to the format expected by the UI
        formattedTransactions = transactionsData.transactions.map((t: ApiTransaction) => {
          try {
            // Safely format dates with fallbacks
            let createdDate = "N/A";
            let closingDate = "N/A";
            
            try {
              if (t.createdAt) {
                createdDate = new Date(t.createdAt).toLocaleDateString();
              }
            } catch (e) {
              console.error("Error formatting createdAt date:", e);
            }
            
            try {
              if (t.closingDate) {
                closingDate = new Date(t.closingDate).toLocaleDateString();
              }
            } catch (e) {
              console.error("Error formatting closingDate date:", e);
            }
            
            // Format price with fallback
            let formattedPrice = "$0";
            try {
              if (t.price) {
                formattedPrice = `$${t.price.toLocaleString()}`;
              }
            } catch (e) {
              console.error("Error formatting price:", e);
            }
            
            // Calculate completion percentage (random for now)
            const completionPercentage = Math.floor(Math.random() * 100);
            
            return {
              id: t.transactionId || `TR-${Math.floor(Math.random() * 10000)}`,
              property: t.propertyAddress ? 
                `${t.propertyAddress}${t.city ? `, ${t.city}` : ''}${t.state ? `, ${t.state}` : ''}` : 
                "Address not available",
              client: t.clientName || "Unknown Client",
              agent: {
                name: t.agentId || "Unknown Agent",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: (t.status || "pending") as any,
              createdDate,
              closingDate,
              price: formattedPrice,
              completionPercentage,
            };
          } catch (error) {
            console.error("Error converting transaction:", error, t);
            // Return a fallback transaction object if conversion fails
            return {
              id: `TR-${Math.floor(Math.random() * 10000)}`,
              property: "Error loading property details",
              client: "Unknown",
              agent: {
                name: "Unknown Agent",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: "pending" as any,
              createdDate: "N/A",
              closingDate: "N/A",
              price: "$0",
              completionPercentage: 0,
            };
          }
        });
        
        setTransactions(formattedTransactions || []);
      }
      
      // Process tasks data
      if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
        // Create a map of transactions by ID for quick lookup
        const transactionMap = new Map<string, Transaction>();
        formattedTransactions.forEach(transaction => {
          transactionMap.set(transaction.id, transaction);
        });
        
        // Convert API tasks to the format expected by the UI
        const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
          // Find the associated transaction
          const associatedTransaction = transactionMap.get(apiTask.transactionId);
          
          return {
            id: apiTask._id,
            title: apiTask.title,
            transactionId: apiTask.transactionId,
            property: apiTask.propertyAddress || "Address not available",
            agent: apiTask.agentId || "Unknown Agent",
            dueDate: new Date(apiTask.dueDate).toLocaleDateString(),
            status: apiTask.status,
            priority: apiTask.priority,
            description: apiTask.description,
            aiReminder: apiTask.aiReminder,
            timestamp: new Date(apiTask.updatedAt).getTime(),
            transaction: associatedTransaction // Link the transaction to the task
          };
        });
        
        // Sort tasks by status priority (overdue > pending > in_progress > completed)
        formattedTasks.sort((a, b) => {
          // First sort by status priority (overdue > pending > in_progress > completed)
          const statusPriority: Record<string, number> = {
            "overdue": 0,
            "pending": 1,
            "in_progress": 2,
            "completed": 3
          }
          
          // Get priority values with fallbacks for unknown statuses
          const aPriority = statusPriority[a.status] ?? 99
          const bPriority = statusPriority[b.status] ?? 99
          
          const statusDiff = aPriority - bPriority
          if (statusDiff !== 0) return statusDiff
          
          // Then sort by due date (earlier dates first)
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        
        // Only show the first 5 tasks in the sidebar
        const topTasks = formattedTasks.slice(0, 5)
        
        setTasks(topTasks)
        
        // Check if there are any new tasks (updated in the last 30 seconds)
        const hasNewTasks = formattedTasks.some(
          task => Date.now() - task.timestamp < 30000
        )
        setNewTaskAlert(hasNewTasks)
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks on component mount and set up refresh interval
  useEffect(() => {
    fetchTasks()
    
    // Set up interval to refresh tasks every 30 seconds
    const intervalId = setInterval(() => {
      fetchTasks()
    }, 30000)
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])
  
  // Listen for task updates via WebSocket
  useEffect(() => {
    if (!socketRef.current) return
    
    // Listen for task completed events
    const handleTaskCompleted = (data: any) => {
      console.log('Task completed event received in TC panel:', data)
      
      // Update the tasks list
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === data.taskId) {
            return {
              ...task,
              status: 'completed',
              timestamp: Date.now() // Mark as recently updated
            }
          }
          return task
        })
      })
      
      // Set new task alert
      setNewTaskAlert(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
    }
    
    // Listen for task updated events
    const handleTaskUpdated = (data: any) => {
      console.log('Task updated event received in TC panel:', data)
      
      // Update the tasks list
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === data.taskId) {
            return {
              ...task,
              status: data.status,
              timestamp: Date.now() // Mark as recently updated
            }
          }
          return task
        })
      })
      
      // Set new task alert
      setNewTaskAlert(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
    }
    
    // Register event handlers
    socketRef.current.on('task_completed', handleTaskCompleted)
    socketRef.current.on('task_updated', handleTaskUpdated)
    
    // Cleanup function
    return () => {
      socketRef.current?.off('task_completed', handleTaskCompleted)
      socketRef.current?.off('task_updated', handleTaskUpdated)
    }
  }, [socketRef.current, socketConnected])

  const getStatusBadge = (status: string) => {
    // Normalize status to lowercase for case-insensitive comparison
    const normalizedStatus = status?.toLowerCase() || "pending";
    
    switch (normalizedStatus) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="h-2 w-2" />
            <span>Pending</span>
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Clock className="h-2 w-2" />
            <span>In Progress</span>
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <AlertTriangle className="h-2 w-2" />
            <span>Overdue</span>
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1 text-xs">
            <CheckCircle className="h-2 w-2" />
            <span>Completed</span>
          </Badge>
        )
      default:
        return <Badge variant="outline" className="text-xs">{status || "Unknown"}</Badge>
    }
  }

  const handleManualRefresh = () => {
    fetchTasks()
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-sm font-medium flex items-center">
              Task Management
              {newTaskAlert && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/tc/tasks#assign-task" className="flex-1 sm:flex-none">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs w-full sm:w-auto"
                onClick={() => {
                  setTimeout(() => {
                    const assignTaskElement = document.getElementById('assign-task');
                    if (assignTaskElement) {
                      assignTaskElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Assign New Task
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleManualRefresh}
              disabled={loading}
            >
              <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="px-4 pb-4 space-y-4 overflow-x-auto whitespace-nowrap">
            {loading && tasks.length === 0 ? (
              <div className="flex justify-center items-center h-[100px] text-muted-foreground">
                Loading tasks...
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-[100px] text-muted-foreground">
                <p className="text-destructive mb-2">Error loading tasks</p>
                <Button variant="outline" size="sm" onClick={handleManualRefresh}>
                  Try Again
                </Button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[100px] text-muted-foreground">
                <p>No tasks available</p>
                <Button variant="outline" size="sm" onClick={handleManualRefresh} className="mt-2">
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-md border ${
                      task.status === "completed" 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                        : Date.now() - task.timestamp < 30000 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                          : 'border-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <CheckSquare className={`h-3 w-3 ${task.status === "completed" ? "text-green-500" : "text-muted-foreground"}`} />
                          <p className="text-sm font-medium">{task.title}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <p className="text-xs text-muted-foreground">Transaction: {task.transactionId}</p>
                          {task.transaction && (
                            <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                              {task.transaction.status}
                            </Badge>
                          )}
                        </div>
                        {task.transaction && (
                          <p className="text-xs text-muted-foreground">Client: {task.transaction.client}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Assign to: {task.agent}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(task.status)}
                        <p className="text-xs text-muted-foreground">
                          Due: {task.dueDate}
                        </p>
                      </div>
                    </div>
                    {Date.now() - task.timestamp < 30000 && (
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-green-600 dark:text-green-400">New task</span>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-center mt-4">
                  <Link href="/tc/tasks" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Tasks
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}