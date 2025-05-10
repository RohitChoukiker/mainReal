"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, FileText, MessageSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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
}

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
  assignedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TasksAssigned() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        
        // Fetch tasks from API
        const response = await fetch('/api/agent/tasks')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Process tasks data
        if (data && data.tasks && Array.isArray(data.tasks)) {
          // Convert API tasks to the format expected by the UI
          const formattedTasks: Task[] = data.tasks.map((apiTask: ApiTask) => {
            return {
              id: apiTask._id,
              title: apiTask.title,
              transactionId: apiTask.transactionId,
              property: apiTask.propertyAddress || "Address not available",
              assignedBy: apiTask.assignedBy || "TC Manager",
              dueDate: new Date(apiTask.dueDate).toLocaleDateString(),
              status: apiTask.status,
              priority: apiTask.priority,
              description: apiTask.description,
              aiReminder: apiTask.aiReminder
            }
          })
          
          setTasks(formattedTasks)
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
            }
          ])
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
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
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTasks()
  }, [])

  const pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress")
  const overdueTasks = tasks.filter((task) => task.status === "overdue")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Overdue</span>
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Update task status in UI immediately for better UX
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
      
      // In a real implementation, you would update the task status in the database
      // For now, we'll just log it
      console.log(`Task ${taskId} marked as completed`)
      
      // TODO: Implement API call to update task status
      // const response = await fetch(`/api/agent/tasks/${taskId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status: 'completed' })
      // })
      
      // if (!response.ok) {
      //   throw new Error(`Failed to update task: ${response.status}`)
      // }
    } catch (error) {
      console.error("Error updating task:", error)
      // Revert the UI change if the API call fails
      // setTasks(originalTasks)
    }
  }

  const renderTaskTable = (taskList: Task[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Assigned By</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList.length > 0 ? (
            taskList.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.property}</div>
                    </div>
                    {task.aiReminder && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      >
                        AI Reminder
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{task.transactionId}</TableCell>
                <TableCell className="hidden md:table-cell">{task.assignedBy}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Button>
                    {task.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-500"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Mark as completed</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tasks Assigned</h1>
      
      {isLoading && (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>View and manage tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3 mb-4 mx-4 mt-2">
                <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
                <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">{renderTaskTable(pendingTasks)}</TabsContent>

              <TabsContent value="overdue">{renderTaskTable(overdueTasks)}</TabsContent>

              <TabsContent value="completed">{renderTaskTable(completedTasks)}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
              <CardDescription>Summary of your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Pending Tasks</div>
                  <div className="text-2xl font-bold">{pendingTasks.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Overdue Tasks</div>
                  <div className="text-2xl font-bold">{overdueTasks.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Completed Tasks</div>
                  <div className="text-2xl font-bold">{completedTasks.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Distribution of tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span>High Priority</span>
                  </div>
                  <span className="font-medium">{tasks.filter((t) => t.priority === "high").length}</span>
                </div>
                <Progress
                  value={(tasks.filter((t) => t.priority === "high").length / tasks.length) * 100}
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Medium Priority</span>
                  </div>
                  <span className="font-medium">{tasks.filter((t) => t.priority === "medium").length}</span>
                </div>
                <Progress
                  value={(tasks.filter((t) => t.priority === "medium").length / tasks.length) * 100}
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Low Priority</span>
                  </div>
                  <span className="font-medium">{tasks.filter((t) => t.priority === "low").length}</span>
                </div>
                <Progress
                  value={(tasks.filter((t) => t.priority === "low").length / tasks.length) * 100}
                  className="h-2 bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by Transaction</CardTitle>
          <CardDescription>View tasks grouped by transaction</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="hidden md:table-cell">Total Tasks</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(new Set(tasks.map((t) => t.transactionId))).map((transactionId) => {
                  const transactionTasks = tasks.filter((t) => t.transactionId === transactionId)
                  const property = transactionTasks[0].property
                  const totalTasks = transactionTasks.length
                  const pendingCount = transactionTasks.filter((t) => t.status !== "completed").length
                  const completedCount = transactionTasks.filter((t) => t.status === "completed").length
                  const progressPercentage = (completedCount / totalTasks) * 100

                  return (
                    <TableRow key={transactionId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{transactionId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{property}</TableCell>
                      <TableCell className="hidden md:table-cell">{totalTasks}</TableCell>
                      <TableCell>{pendingCount}</TableCell>
                      <TableCell>{completedCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
                          </div>
                          <span className="text-xs font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

