"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  transactionId: string
  property: string
  assignedBy: string
  dueDate: string
  status: "pending" | "completed" | "overdue" | "in_progress"
  priority: "low" | "medium" | "high"
  description?: string
  aiReminder?: boolean
  timestamp?: number
}

export default function AgentTaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskAlert, setNewTaskAlert] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      // Set loading state
      setLoading(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
      
      // Clear error
      setError(null)
      
      // Fetch tasks from API (replace with actual API endpoint)
      const tasksResponse = await fetch("/api/agent/tasks")
      
      if (!tasksResponse.ok) {
        throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`)
      }
      
      const tasksData = await tasksResponse.json()
      
      // Process tasks data
      if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
        // Convert API tasks to the format expected by the UI
        const formattedTasks: Task[] = tasksData.tasks.map((apiTask: any) => {
          return {
            id: apiTask._id || apiTask.id,
            title: apiTask.title,
            transactionId: apiTask.transactionId,
            property: apiTask.propertyAddress || apiTask.property || "Address not available",
            assignedBy: apiTask.assignedBy || "TC Manager",
            dueDate: new Date(apiTask.dueDate).toLocaleDateString(),
            status: apiTask.status,
            priority: apiTask.priority,
            description: apiTask.description,
            aiReminder: apiTask.aiReminder,
            timestamp: apiTask.updatedAt ? new Date(apiTask.updatedAt).getTime() : Date.now()
          };
        });
        
        // Sort tasks by status priority (overdue > pending > in_progress > completed)
        formattedTasks.sort((a, b) => {
          // First sort by status priority (overdue > pending > in_progress > completed)
          const statusPriority = {
            "overdue": 0,
            "pending": 1,
            "in_progress": 2,
            "completed": 3
          } as Record<string, number>
          
          const statusDiff = statusPriority[a.status] - statusPriority[b.status]
          if (statusDiff !== 0) return statusDiff
          
          // Then sort by due date (earlier dates first)
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        
        // Only show the first 5 tasks in the sidebar
        const topTasks = formattedTasks.slice(0, 5)
        
        setTasks(topTasks)
        
        // Check if there are any new tasks (updated in the last 30 seconds)
        const hasNewTasks = formattedTasks.some(
          task => task.timestamp && Date.now() - task.timestamp < 30000
        )
        setNewTaskAlert(hasNewTasks)
      } else {
        // If no tasks are found, use demo data
        setTasks([
          {
            id: "task-1",
            title: "Schedule home inspection",
            transactionId: "TR-7829",
            property: "123 Main St, Austin, TX",
            assignedBy: "Sarah Johnson (TC)",
            dueDate: "Apr 15, 2025",
            status: "pending",
            priority: "high",
            description: "Contact the inspector and schedule a home inspection as soon as possible.",
            aiReminder: true,
            timestamp: Date.now()
          },
          {
            id: "task-2",
            title: "Collect HOA documents",
            transactionId: "TR-7829",
            property: "123 Main St, Austin, TX",
            assignedBy: "Sarah Johnson (TC)",
            dueDate: "Apr 18, 2025",
            status: "in_progress",
            priority: "medium",
            description: "Obtain all HOA documents including bylaws, financials, and meeting minutes.",
            timestamp: Date.now() - 60000
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks")
      // Set demo data on error
      setTasks([
        {
          id: "task-1",
          title: "Schedule home inspection",
          transactionId: "TR-7829",
          property: "123 Main St, Austin, TX",
          assignedBy: "Sarah Johnson (TC)",
          dueDate: "Apr 15, 2025",
          status: "pending",
          priority: "high",
          description: "Contact the inspector and schedule a home inspection as soon as possible.",
          aiReminder: true,
          timestamp: Date.now()
        }
      ])
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

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  const handleManualRefresh = () => {
    fetchTasks()
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-medium flex items-center">
              Tasks Assigned
              {newTaskAlert && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
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
          <div className="px-4 pb-4 space-y-4">
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
              // Display tasks
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-md border ${
                      task.timestamp && Date.now() - task.timestamp < 30000 ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-border'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm font-medium">{task.title}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-xs text-muted-foreground">Transaction: {task.transactionId}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Assigned by: {task.assignedBy}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(task.status)}
                        <p className="text-xs text-muted-foreground">
                          Due: {task.dueDate}
                        </p>
                      </div>
                    </div>
                    {task.timestamp && Date.now() - task.timestamp < 30000 && (
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-green-600 dark:text-green-400">New task</span>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-center mt-4">
                  <Link href="/agent/tasks">
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