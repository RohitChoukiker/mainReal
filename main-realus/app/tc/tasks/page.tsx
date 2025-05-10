"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, PlusCircle, Calendar, MessageSquare, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

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
  id: string
  property: string
  client: string
  agent: {
    name: string
    avatar: string
  }
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled" | "New" | "new"
  createdDate: string
  closingDate: string
  price?: string
  documents: {
    total: number
    verified: number
  }
  tasks: {
    total: number
    completed: number
  }
  riskLevel?: "low" | "medium" | "high"
  completionPercentage: number
}

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
  transaction?: Transaction // Add transaction information to task
}

export default function TaskManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiTasks, setApiTasks] = useState<ApiTask[]>([])
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Fetch real tasks and transactions from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching tasks and transactions from API...')
        setIsLoading(true)
        
        // Fetch tasks
        const tasksResponse = await fetch('/api/tc/tasks')
        
        if (!tasksResponse.ok) {
          console.error('Tasks API response not OK:', tasksResponse.status, tasksResponse.statusText)
          throw new Error(`Failed to fetch tasks: ${tasksResponse.status} ${tasksResponse.statusText}`)
        }
        
        let tasksData
        try {
          tasksData = await tasksResponse.json()
          console.log('Fetched tasks:', tasksData)
        } catch (parseError) {
          console.error('Error parsing tasks JSON response:', parseError)
          throw new Error('Failed to parse tasks API response')
        }
        
        // Fetch transactions
        const transactionsResponse = await fetch('/api/tc/transactions')
        
        if (!transactionsResponse.ok) {
          console.error('Transactions API response not OK:', transactionsResponse.status, transactionsResponse.statusText)
          throw new Error(`Failed to fetch transactions: ${transactionsResponse.status} ${transactionsResponse.statusText}`)
        }
        
        let transactionsData
        try {
          transactionsData = await transactionsResponse.json()
          console.log('Fetched transactions:', transactionsData)
        } catch (parseError) {
          console.error('Error parsing transactions JSON response:', parseError)
          throw new Error('Failed to parse transactions API response')
        }
        
        // Process transactions data
        if (transactionsData && transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
          console.log(`Successfully loaded ${transactionsData.transactions.length} transactions`)
          setApiTransactions(transactionsData.transactions)
          
          // Convert API transactions to the format expected by the UI
          const formattedTransactions: Transaction[] = transactionsData.transactions.map((t: ApiTransaction) => {
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
                documents: {
                  total: 8,
                  verified: Math.floor(Math.random() * 9),
                },
                tasks: {
                  total: 12,
                  completed: Math.floor(Math.random() * 13),
                },
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
                documents: {
                  total: 0,
                  verified: 0,
                },
                tasks: {
                  total: 0,
                  completed: 0,
                },
                completionPercentage: 0,
              };
            }
          });
          
          setTransactions(formattedTransactions || []);
        } else {
          console.warn('API returned no transactions or invalid format:', transactionsData)
          setApiTransactions([])
          setTransactions([])
        }
        
        // Process tasks data
        if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
          console.log(`Successfully loaded ${tasksData.tasks.length} tasks`)
          setApiTasks(tasksData.tasks)
          
          // Create a map of transactions by ID for quick lookup
          const transactionMap = new Map<string, Transaction>();
          if (transactionsData && transactionsData.transactions) {
            formattedTransactions.forEach(transaction => {
              transactionMap.set(transaction.id, transaction);
            });
          }
          
          // Convert API tasks to the format expected by the UI and associate with transactions
          const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
            // Find the associated transaction
            const associatedTransaction = transactionMap.get(apiTask.transactionId);
            
            return {
              id: apiTask._id,
              title: apiTask.title,
              transactionId: apiTask.transactionId,
              property: apiTask.propertyAddress || "Address not available",
              agent: {
                name: apiTask.agentId || "Unknown Agent",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              dueDate: new Date(apiTask.dueDate).toLocaleDateString(),
              status: apiTask.status,
              priority: apiTask.priority,
              description: apiTask.description,
              aiReminder: apiTask.aiReminder,
              transaction: associatedTransaction // Link the transaction to the task
            };
          });
          
          setTasks(formattedTasks)
        } else {
          console.warn('API returned no tasks or invalid format:', tasksData)
          setApiTasks([])
          // Set some demo tasks if no tasks are found
          setTasks([
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
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data. Please try again later.')
        setApiTasks([])
        setApiTransactions([])
        // Set some demo tasks if there's an error
        setTasks([
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
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
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

  // Function to render transaction status badge
  const getTransactionStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            In Progress
          </Badge>
        )
      case "at_risk":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            At Risk
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
          </Badge>
        )
      case "new":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            New
          </Badge>
        )
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>
    }
  }

  const renderTaskTable = (taskList: Task[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading tasks...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : taskList.length > 0 ? (
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
                <TableCell className="hidden md:table-cell">
                  <div>
                    <div className="font-medium">{task.transactionId}</div>
                    {task.transaction && (
                      <div className="mt-1">
                        {getTransactionStatusBadge(task.transaction.status)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {task.transaction ? task.transaction.client : "Unknown Client"}
                </TableCell>
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
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
                      {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <SelectItem key={transaction.id} value={transaction.id}>
                            {transaction.id} - {transaction.property}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="TR-7829">TR-7829 - 123 Main St</SelectItem>
                          <SelectItem value="TR-6543">TR-6543 - 456 Oak Ave</SelectItem>
                          <SelectItem value="TR-9021">TR-9021 - 789 Pine Rd</SelectItem>
                        </>
                      )}
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
                      {transactions.length > 0 ? (
                        // Get unique agents from transactions
                        [...new Set(transactions.map(t => t.agent.name))].map((agentName) => (
                          <SelectItem key={agentName} value={agentName}>
                            {agentName}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="michael">Michael Brown</SelectItem>
                        </>
                      )}
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

