"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, PlusCircle, Calendar, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Task {
  id: string
  title: string
  transactionId: string
  property: string
  agent: {
    name: string
    avatar: string
  }
  dueDate: string
  status: "pending" | "completed" | "overdue" | "in_progress"
  priority: "low" | "medium" | "high"
  description?: string
  aiReminder?: boolean
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Schedule home inspection",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
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
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      dueDate: "Apr 18, 2025",
      status: "in_progress",
      priority: "medium",
      description: "Obtain all HOA documents including bylaws, financials, and meeting minutes.",
    },
    {
      id: "task-3",
      title: "Submit financing application",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      dueDate: "Apr 10, 2025",
      status: "overdue",
      priority: "high",
      description: "Complete and submit the mortgage application with all required documentation.",
      aiReminder: true,
    },
    {
      id: "task-4",
      title: "Review title report",
      transactionId: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      dueDate: "Apr 20, 2025",
      status: "pending",
      priority: "medium",
      description: "Review the preliminary title report and note any issues or concerns.",
    },
    {
      id: "task-5",
      title: "Coordinate final walkthrough",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      dueDate: "Apr 25, 2025",
      status: "pending",
      priority: "low",
      description: "Schedule and coordinate the final walkthrough with the buyer and seller.",
    },
    {
      id: "task-6",
      title: "Verify property disclosure",
      transactionId: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      dueDate: "Apr 5, 2025",
      status: "completed",
      priority: "high",
      description: "Verify that all property disclosures are complete and accurate.",
    },
  ])

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

  const renderTaskTable = (taskList: Task[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
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
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.agent.avatar} alt={task.agent.name} />
                      <AvatarFallback>{task.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{task.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Reschedule</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Button>
                    {task.status !== "completed" && (
                      <Button variant="ghost" size="icon" className="text-green-500">
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
      <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assign New Task</CardTitle>
            <CardDescription>Create and assign a new task to an agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction">Transaction</Label>
                  <Select>
                    <SelectTrigger id="transaction">
                      <SelectValue placeholder="Select transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TR-7829">TR-7829 - 123 Main St</SelectItem>
                      <SelectItem value="TR-6543">TR-6543 - 456 Oak Ave</SelectItem>
                      <SelectItem value="TR-9021">TR-9021 - 789 Pine Rd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Assign To</Label>
                  <Select>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="michael">Michael Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter task description" rows={3} />
              </div>

              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Assign Task</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Current status of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

              <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-5 w-5" />
                  <span className="font-medium">AI Task Reminders</span>
                </div>
                <p className="text-sm">
                  AI will automatically send reminders to agents for high-priority tasks as the due date approaches.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderTaskTable(pendingTasks)}</TabsContent>

        <TabsContent value="overdue">{renderTaskTable(overdueTasks)}</TabsContent>

        <TabsContent value="completed">{renderTaskTable(completedTasks)}</TabsContent>
      </Tabs>
    </div>
  )
}

