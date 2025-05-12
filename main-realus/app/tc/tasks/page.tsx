"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, PlusCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
// Message dialog removed

interface ApiTask {
  _id: string;
  title: string;
  transactionId: string;
  propertyAddress?: string;
  agentId?: string;
  agentName?: string; // Added agent name field
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
    id: string
    name: string
    avatar: string
  }
  agentId?: string // Raw agent ID for filtering
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
    id: string
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

// Define an interface for agents
interface Agent {
  id: string
  name: string
  email: string
  phone: string
}

export default function TaskManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiTasks, setApiTasks] = useState<ApiTask[]>([])
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  
  // Task state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
  // Form state
  const [newTask, setNewTask] = useState({
    title: "",
    transactionId: "",
    agentId: "",
    dueDate: "",
    priority: "",
    description: "",
    aiReminder: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoRefreshActive, setAutoRefreshActive] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  // Set up polling for task updates
  useEffect(() => {
    // Function to fetch tasks
    const fetchTasks = async () => {
      try {
        console.log('Polling for task updates...')
        
        // Fetch tasks from API
        const tasksResponse = await fetch('/api/tc/tasks', {
          credentials: 'include' // Include cookies for authentication
        })
        
        if (!tasksResponse.ok) {
          console.error('Tasks API response not OK:', tasksResponse.status, tasksResponse.statusText)
          return
        }
        
        const tasksData = await tasksResponse.json()
        console.log('Fetched tasks:', tasksData)
        
        if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
          setApiTasks(tasksData.tasks)
          
          // Create a map of transactions by ID for quick lookup
          const transactionMap = new Map<string, Transaction>()
          transactions.forEach(transaction => {
            transactionMap.set(transaction.id, transaction)
          })
          
          // Convert API tasks to the format expected by the UI
          const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
            // Find the associated transaction
            const associatedTransaction = transactionMap.get(apiTask.transactionId)
            
            return {
              id: apiTask._id,
              title: apiTask.title,
              transactionId: apiTask.transactionId,
              property: apiTask.propertyAddress || "Address not available",
              agent: {
                id: apiTask.agentId || "unknown-agent",
                name: apiTask.agentName || apiTask.agentId || "Unknown Agent",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              dueDate: new Date(apiTask.dueDate).toLocaleDateString(),
              status: apiTask.status,
              priority: apiTask.priority,
              description: apiTask.description,
              aiReminder: apiTask.aiReminder,
              transaction: associatedTransaction
            }
          })
          
          // Check if there are any new tasks
          const currentTaskIds = new Set(tasks.map(task => task.id))
          const newTasks = formattedTasks.filter(task => !currentTaskIds.has(task.id))
          
          if (newTasks.length > 0) {
            console.log('Found new tasks:', newTasks)
            toast.success(`${newTasks.length} new task(s) available`, {
              duration: 3000
            })
          }
          
          // Update tasks state
          setTasks(formattedTasks)
          setAutoRefreshActive(true) // Use this state for "Auto-refresh active" indicator
          setLastRefreshed(new Date()) // Update last refreshed timestamp
        }
      } catch (error) {
        console.error('Error polling for tasks:', error)
        setAutoRefreshActive(false) // Use this state for "Auto-refresh inactive" indicator
      }
    }
    
    // Initial fetch
    fetchTasks()
    
    // Set up polling interval (every 10 seconds)
    const pollingInterval = setInterval(fetchTasks, 10000)
    
    // Cleanup function
    return () => {
      clearInterval(pollingInterval)
    }
  }, [transactions])

  // Fetch real tasks, transactions, and agents from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching tasks, transactions, and agents from API...')
        setIsLoading(true)
        
        // Fetch tasks
        const tasksResponse = await fetch('/api/tc/tasks', {
          credentials: 'include' // Include cookies for authentication
        })
        
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
        const transactionsResponse = await fetch('/api/tc/transactions', {
          credentials: 'include' // Include cookies for authentication
        })
        
        // Fetch agents
        const agentsResponse = await fetch('/api/tc/agents', {
          credentials: 'include' // Include cookies for authentication
        })
        
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
        
        // Process agents response
        if (!agentsResponse.ok) {
          console.error('Agents API response not OK:', agentsResponse.status, agentsResponse.statusText)
          console.warn('Will use fallback agents data')
        } else {
          try {
            const agentsData = await agentsResponse.json()
            console.log('Fetched agents:', agentsData)
            
            if (agentsData && agentsData.agents && Array.isArray(agentsData.agents)) {
              console.log(`Successfully loaded ${agentsData.agents.length} agents`)
              setAgents(agentsData.agents)
            } else {
              console.warn('API returned no agents or invalid format:', agentsData)
              setAgents([]) // Empty array if no agents found
            }
          } catch (parseError) {
            console.error('Error parsing agents JSON response:', parseError)
            setAgents([]) // Empty array if error parsing agents
          }
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
                  id: t.agentId || "unknown-agent", // Store the agent ID
                  name: t.agentId || "Unknown Agent",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                agentId: t.agentId, // Also store the raw agentId for filtering
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
                  id: "unknown-agent",
                  name: "Unknown Agent",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                agentId: "unknown-agent",
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
        let formattedTasks: Task[] = [];
        
        if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks) && tasksData.tasks.length > 0) {
          console.log(`Successfully loaded ${tasksData.tasks.length} tasks`)
          setApiTasks(tasksData.tasks)
          
          // Create a map of transactions by ID for quick lookup
          const transactionMap = new Map<string, Transaction>();
          if (transactionsData && transactionsData.transactions) {
            // Use the transactions array that was already processed and stored in state
            transactions.forEach(transaction => {
              transactionMap.set(transaction.id, transaction);
            });
          }
          
          // Convert API tasks to the format expected by the UI and associate with transactions
          formattedTasks = tasksData.tasks.map((apiTask: ApiTask) => {
            // Find the associated transaction
            const associatedTransaction = transactionMap.get(apiTask.transactionId);
            
            return {
              id: apiTask._id,
              title: apiTask.title,
              transactionId: apiTask.transactionId,
              property: apiTask.propertyAddress || "Address not available",
              agent: {
                id: apiTask.agentId || "unknown-agent",
                name: apiTask.agentName || apiTask.agentId || "Unknown Agent",
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
        } else {
          console.warn('API returned no tasks or invalid format')
          setApiTasks([])
          setTasks([])
        }
        
        // Always set the tasks from the API
        setTasks(formattedTasks)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data.')
        setApiTasks([])
        setApiTransactions([])
        setTasks([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress" || task.status === "overdue")
  const completedTasks = tasks.filter((task) => task.status === "completed")
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setNewTask({
      ...newTask,
      [id === 'task-title' ? 'title' : id === 'due-date' ? 'dueDate' : id]: value
    })
  }
  
  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    if (id === "agentId") {
      // When agent changes, reset the transaction selection
      setNewTask({
        ...newTask,
        [id]: value,
        transactionId: "" // Reset transaction when agent changes
      })
    } else {
      setNewTask({
        ...newTask,
        [id]: value
      })
    }
  }
  
  // Get transactions for the selected agent
  const getAgentTransactions = () => {
    if (!newTask.agentId) return []
    
    // Filter transactions by the selected agent
    return transactions.filter(transaction => {
      // Check if the transaction has an agent property
      if (transaction.agent) {
        // Check if the agent ID or name matches
        return transaction.agent.id === newTask.agentId || 
               transaction.agent.name === newTask.agentId
      } 
      // For API transactions that might have agentId directly
      else if (transaction.agentId) {
        return transaction.agentId === newTask.agentId
      }
      
      return false
    })
  }
  
  // Handle form submission
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", newTask)
    
    // Validate form
    if (!newTask.title || !newTask.transactionId || !newTask.agentId || !newTask.dueDate || !newTask.priority) {
      toast.error("Please fill in all required fields")
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Get property address from selected transaction
      const selectedTransaction = transactions.find(t => t.id === newTask.transactionId)
      let propertyAddress = ""
      
      // Handle fallback transactions
      if (selectedTransaction) {
        propertyAddress = selectedTransaction.property
      } else if (newTask.transactionId === "TR-7829") {
        propertyAddress = "123 Main St, San Francisco, CA"
      } else if (newTask.transactionId === "TR-6543") {
        propertyAddress = "456 Oak Ave, Los Angeles, CA"
      } else if (newTask.transactionId === "TR-9021") {
        propertyAddress = "789 Pine Rd, San Diego, CA"
      }
      
      // Get the selected agent's name
      const selectedAgent = agents.find(a => a.id === newTask.agentId)
      const agentName = selectedAgent ? selectedAgent.name : newTask.agentId
      
      // Prepare task data
      const taskData = {
        title: newTask.title,
        transactionId: newTask.transactionId,
        agentId: newTask.agentId, // This is the agent's ID from the database
        agentName: agentName, // Include the agent's name for display purposes
        propertyAddress,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        description: newTask.description,
        aiReminder: newTask.aiReminder || false,
        assignedBy: "TC Manager", // Add who assigned this task
        status: "pending" // Ensure the initial status is pending
      }
      
      console.log("Task assigned to agent:", newTask.agentId)
      
      console.log("Sending task data to API:", taskData)
      
      // Send POST request to create task
      const response = await fetch('/api/tc/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData),
        credentials: 'include' // Include cookies for authentication
      })
      
      console.log("API response status:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error response:", errorData)
        throw new Error(`Failed to create task: ${response.status} - ${errorData.message || ''}`)
      }
      
      const data = await response.json()
      console.log("API success response:", data)
      
      // Show success message
      toast.success("Task assigned successfully!")
      
      // Reset form
      setNewTask({
        title: "",
        transactionId: "",
        agentId: "",
        dueDate: "",
        priority: "",
        description: "",
        aiReminder: false
      })
      
      // Trigger an immediate refresh of the task list
      const refreshTasks = async () => {
        try {
          const tasksResponse = await fetch('/api/tc/tasks', {
            credentials: 'include'
          })
          
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json()
            
            if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
              setApiTasks(tasksData.tasks)
              
              // Create a map of transactions by ID for quick lookup
              const transactionMap = new Map<string, Transaction>()
              transactions.forEach(transaction => {
                transactionMap.set(transaction.id, transaction)
              })
              
              // Convert API tasks to the format expected by the UI
              const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
                // Find the associated transaction
                const associatedTransaction = transactionMap.get(apiTask.transactionId)
                
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
                  transaction: associatedTransaction
                }
              })
              
              setTasks(formattedTasks)
              setLastRefreshed(new Date()) // Update last refreshed timestamp
              toast.info("Task list refreshed", { duration: 2000 })
            }
          }
        } catch (error) {
          console.error("Error refreshing tasks:", error)
        }
      }
      
      // Refresh tasks after a short delay
      setTimeout(refreshTasks, 500)
      
      // Add the newly created task to the current tasks list
      // This ensures we see the new task immediately without waiting for a refresh
      const newCreatedTask: Task = {
        id: data.task._id || `new-task-${Date.now()}`,
        title: data.task.title,
        transactionId: data.task.transactionId,
        property: data.task.propertyAddress || "Address not available",
        agent: {
          name: data.task.agentId || "Unknown Agent",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        dueDate: new Date(data.task.dueDate).toLocaleDateString(),
        status: data.task.status || "pending",
        priority: data.task.priority || "medium",
        description: data.task.description,
        aiReminder: data.task.aiReminder,
        transaction: transactions.find(t => t.id === data.task.transactionId)
      };
      
      // Add the new task to the existing tasks
      setTasks(prevTasks => [newCreatedTask, ...prevTasks]);
      
      // Also refresh the full task list from the API
      const fetchData = async () => {
        try {
          console.log("Refreshing tasks list")
          const tasksResponse = await fetch('/api/tc/tasks', {
            credentials: 'include' // Include cookies for authentication
          })
          
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json()
            console.log("Refreshed tasks data:", tasksData)
            
            if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks) && tasksData.tasks.length > 0) {
              setApiTasks(tasksData.tasks)
              
              // Create a map of transactions by ID for quick lookup
              const transactionMap = new Map<string, Transaction>()
              transactions.forEach(transaction => {
                transactionMap.set(transaction.id, transaction)
              })
              
              // Convert API tasks to the format expected by the UI
              const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
                // Find the associated transaction
                const associatedTransaction = transactionMap.get(apiTask.transactionId)
                
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
                  transaction: associatedTransaction
                }
              })
              
              setTasks(formattedTasks)
            }
          }
        } catch (error) {
          console.error("Error refreshing tasks:", error)
          // If refresh fails, at least we've already added the new task to the UI
        }
      }
      
      // Refresh after a short delay to allow the database to update
      setTimeout(fetchData, 500)
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to assign task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="flex justify-between items-center p-2 text-xs text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={() => {
            toast.info("Refreshing task list...", { duration: 1000 })
            // Trigger an immediate refresh of the task list
            const refreshTasks = async () => {
              try {
                const tasksResponse = await fetch('/api/tc/tasks', {
                  credentials: 'include'
                })
                
                if (tasksResponse.ok) {
                  const tasksData = await tasksResponse.json()
                  
                  if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
                    setApiTasks(tasksData.tasks)
                    
                    // Create a map of transactions by ID for quick lookup
                    const transactionMap = new Map<string, Transaction>()
                    transactions.forEach(transaction => {
                      transactionMap.set(transaction.id, transaction)
                    })
                    
                    // Convert API tasks to the format expected by the UI
                    const formattedTasks: Task[] = tasksData.tasks.map((apiTask: ApiTask) => {
                      // Find the associated transaction
                      const associatedTransaction = transactionMap.get(apiTask.transactionId)
                      
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
                        transaction: associatedTransaction
                      }
                    })
                    
                    setTasks(formattedTasks)
                    setLastRefreshed(new Date())
                    toast.success("Task list refreshed", { duration: 2000 })
                  }
                }
              } catch (error) {
                console.error("Error refreshing tasks:", error)
                toast.error("Failed to refresh tasks", { duration: 2000 })
              }
            }
            
            refreshTasks()
          }}
        >
          <Clock className="h-3 w-3" />
          <span>Refresh Now</span>
        </Button>
        
        {lastRefreshed ? (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Updating...</span>
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
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
              <TableRow 
                key={task.id} 
                className={task.status === "completed" ? "bg-green-50 dark:bg-green-900/20" : ""}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {task.status === "completed" ? (
                      <CheckSquare className="h-5 w-5 text-green-500" />
                    ) : (
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    )}
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
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
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
      {/* Message Dialog removed */}
      
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        {autoRefreshActive ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Auto-refresh Active
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Auto-refresh Inactive
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2" id="assign-task">
          <CardHeader>
            <CardTitle>Assign New Task</CardTitle>
            <CardDescription>Create and assign a new task to an agent. Tasks will appear in the list automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmitTask}>
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input 
                  id="task-title" 
                  placeholder="Enter task title" 
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentId">Assign To</Label>
                  <Select 
                    value={newTask.agentId} 
                    onValueChange={(value) => handleSelectChange("agentId", value)}
                  >
                    <SelectTrigger id="agentId">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.length > 0 ? (
                        agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback data if no agents are available
                        <>
                          <SelectItem value="agent-1">Sarah Johnson</SelectItem>
                          <SelectItem value="agent-2">John Smith</SelectItem>
                          <SelectItem value="agent-3">Michael Brown</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction</Label>
                  <Select 
                    value={newTask.transactionId} 
                    onValueChange={(value) => handleSelectChange("transactionId", value)}
                    disabled={!newTask.agentId} // Disable until agent is selected
                  >
                    <SelectTrigger id="transactionId">
                      <SelectValue placeholder={newTask.agentId ? "Select transaction" : "Select agent first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {newTask.agentId ? (
                        getAgentTransactions().length > 0 ? (
                          getAgentTransactions().map((transaction) => (
                            <SelectItem key={transaction.id} value={transaction.id}>
                              {transaction.id} - {transaction.property}
                            </SelectItem>
                          ))
                        ) : (
                          // Fallback data for the selected agent
                          newTask.agentId === "agent-1" ? (
                            <SelectItem value="TR-7829">TR-7829 - 123 Main St</SelectItem>
                          ) : newTask.agentId === "agent-2" ? (
                            <SelectItem value="TR-6543">TR-6543 - 456 Oak Ave</SelectItem>
                          ) : newTask.agentId === "agent-3" ? (
                            <SelectItem value="TR-9021">TR-9021 - 789 Pine Rd</SelectItem>
                          ) : (
                            <SelectItem value="" disabled>No transactions for this agent</SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem value="" disabled>Please select an agent first</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
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
                <Textarea 
                  id="description" 
                  placeholder="Enter task description" 
                  rows={3} 
                  value={newTask.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? "Assigning..." : "Assign Task"}</span>
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
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderTaskTable(pendingTasks)}</TabsContent>

        <TabsContent value="completed">{renderTaskTable(completedTasks)}</TabsContent>
      </Tabs>

      {/* Floating Assign New Task Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => {
            const assignTaskElement = document.getElementById('assign-task');
            if (assignTaskElement) {
              assignTaskElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Assign New Task
        </Button>
      </div>
    </div>
  )
}

