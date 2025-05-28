"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckSquare, Clock, AlertTriangle, CheckCircle, PlusCircle, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [apiTasks, setApiTasks] = useState<ApiTask[]>([])
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [authError, setAuthError] = useState<string | null>(null)
  
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
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const response = await fetch("/api/user/status", {
          credentials: 'include' // Include cookies for authentication
        })
        
        if (!response.ok) {
          console.error("Authentication check failed:", response.status)
          setAuthError("Authentication failed. Please log in again.")
          router.push("/landing")
          return
        }
        
        const data = await response.json()
        console.log("Auth status:", data)
        
        if (data.role !== "Tc") {
          console.error("User is not a TC, role:", data.role)
          setAuthError("You must be a Transaction Coordinator to access this page")
          router.push("/unauthorized")
          return
        }
        
        if (!data.isApproved) {
          console.error("TC is not approved")
          setAuthError("Your account is pending approval")
          router.push("/unauthorized")
          return
        }
        
        console.log("Authentication successful")
      } catch (error) {
        console.error("Error checking authentication:", error)
        setAuthError("Error checking authentication status")
        router.push("/landing")
      }
    }
    
    checkAuth()
  }, [router])

  // Set up polling for task updates
  useEffect(() => {
    // Function to fetch tasks
    const fetchTasks = async () => {
      try {
        console.log('Polling for task updates...')
        
        // Fetch tasks from API
        const tasksResponse = await fetch('/api/tc/tasks', {
          credentials: 'include', // Include cookies for authentication
          cache: 'no-store' // Disable caching to ensure fresh data
        })
        
        if (!tasksResponse.ok) {
          console.error('Tasks API response not OK:', tasksResponse.status, tasksResponse.statusText)
          
          // Handle authentication errors
          if (tasksResponse.status === 401 || tasksResponse.status === 403) {
            console.error('Authentication error when fetching tasks')
            setAuthError("Authentication failed. Please log in again.")
            router.push("/landing")
            return
          }
          
          toast.error(`Error loading tasks: Server returned ${tasksResponse.status}: ${tasksResponse.statusText}`)
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
        setAuthError(null) // Clear any previous auth errors
        
        // Fetch tasks
        const tasksResponse = await fetch('/api/tc/tasks', {
          credentials: 'include', // Include cookies for authentication
          cache: 'no-store' // Disable caching to ensure fresh data
        })
        
        if (!tasksResponse.ok) {
          console.error('Tasks API response not OK:', tasksResponse.status, tasksResponse.statusText)
          
          // Handle authentication errors
          if (tasksResponse.status === 401 || tasksResponse.status === 403) {
            console.error('Authentication error when fetching tasks')
            setAuthError("Authentication failed. Please log in again.")
            router.push("/landing")
            return
          }
          
          toast.error(`Error loading tasks: Server returned ${tasksResponse.status}: ${tasksResponse.statusText}`)
        }
        
        // Fetch transactions
        const transactionsResponse = await fetch('/api/tc/transactions', {
          credentials: 'include', // Include cookies for authentication
          cache: 'no-store' // Disable caching to ensure fresh data
        })
        
        if (!transactionsResponse.ok) {
          console.error('Transactions API response not OK:', transactionsResponse.status, transactionsResponse.statusText)
          toast.error(`Error loading transactions: Server returned ${transactionsResponse.status}: ${transactionsResponse.statusText}`)
        }
        
        // Fetch agents
        const agentsResponse = await fetch('/api/tc/agents', {
          credentials: 'include', // Include cookies for authentication
          cache: 'no-store' // Disable caching to ensure fresh data
        })
        
        if (!agentsResponse.ok) {
          console.error('Agents API response not OK:', agentsResponse.status, agentsResponse.statusText)
          toast.error(`Error loading agents: Server returned ${agentsResponse.status}: ${agentsResponse.statusText}`)
        }
        
        // Process responses
        const tasksData = tasksResponse.ok ? await tasksResponse.json() : { tasks: [] }
        const transactionsData = transactionsResponse.ok ? await transactionsResponse.json() : { transactions: [] }
        const agentsData = agentsResponse.ok ? await agentsResponse.json() : { agents: [] }
        
        console.log('API data:', { tasks: tasksData, transactions: transactionsData, agents: agentsData })
        
        // Update state with API data
        if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
          setApiTasks(tasksData.tasks)
        }
        
        if (transactionsData && transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
          setApiTransactions(transactionsData.transactions)
          
          // Convert API transactions to the format expected by the UI
          const formattedTransactions: Transaction[] = transactionsData.transactions.map((apiTransaction: ApiTransaction) => {
            return {
              id: apiTransaction.transactionId,
              property: apiTransaction.propertyAddress,
              client: apiTransaction.clientName,
              agent: {
                id: apiTransaction.agentId,
                name: "Agent Name", // This would ideally come from the API
                avatar: "/placeholder.svg?height=40&width=40",
              },
              agentId: apiTransaction.agentId, // Store raw agent ID for filtering
              status: apiTransaction.status as any,
              createdDate: new Date(apiTransaction.createdAt).toLocaleDateString(),
              closingDate: new Date(apiTransaction.closingDate).toLocaleDateString(),
              price: `$${apiTransaction.price.toLocaleString()}`,
              documents: {
                total: 10, // Placeholder values
                verified: 7,
              },
              tasks: {
                total: 5, // Placeholder values
                completed: 3,
              },
              completionPercentage: 60, // Placeholder value
            }
          })
          
          setTransactions(formattedTransactions)
        }
        
        if (agentsData && agentsData.agents && Array.isArray(agentsData.agents)) {
          // Convert API agents to the format expected by the UI
          const formattedAgents: Agent[] = agentsData.agents.map((apiAgent: any) => {
            return {
              id: apiAgent.id || apiAgent._id,
              name: apiAgent.name,
              email: apiAgent.email || "agent@example.com",
              phone: apiAgent.phone || "555-123-4567",
            }
          })
          
          setAgents(formattedAgents)
        }
        
        // If we have tasks data, convert it to the format expected by the UI
        if (tasksData && tasksData.tasks && Array.isArray(tasksData.tasks)) {
          // Create a map of transactions by ID for quick lookup
          const transactionMap = new Map<string, Transaction>()
          if (transactionsData && transactionsData.transactions) {
            transactionsData.transactions.forEach((apiTransaction: ApiTransaction) => {
              const transaction: Transaction = {
                id: apiTransaction.transactionId,
                property: apiTransaction.propertyAddress,
                client: apiTransaction.clientName,
                agent: {
                  id: apiTransaction.agentId,
                  name: "Agent Name", // This would ideally come from the API
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                agentId: apiTransaction.agentId,
                status: apiTransaction.status as any,
                createdDate: new Date(apiTransaction.createdAt).toLocaleDateString(),
                closingDate: new Date(apiTransaction.closingDate).toLocaleDateString(),
                price: `$${apiTransaction.price.toLocaleString()}`,
                documents: {
                  total: 10,
                  verified: 7,
                },
                tasks: {
                  total: 5,
                  completed: 3,
                },
                completionPercentage: 60,
              }
              transactionMap.set(transaction.id, transaction)
            })
          }
          
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
          
          setTasks(formattedTasks)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error("Error loading data: Failed to load tasks and transactions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [router])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewTask(prev => ({
      ...prev,
      [id.replace('task-', '')]: value
    }))
  }

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    // If changing the agent, reset the transaction selection
    if (field === "agentId") {
      console.log("Agent selected:", value);
      console.log("Available transactions before filter:", transactions);
      
      // Reset transaction ID when agent changes
      setNewTask(prev => ({
        ...prev,
        [field]: value,
        transactionId: "" // Reset transaction when agent changes
      }));
      
      // Force a re-render by logging the filtered transactions
      setTimeout(() => {
        const filteredTransactions = transactions.filter(t => 
          t.agentId === value || t.agent.id === value
        );
        console.log("Available transactions for this agent:", filteredTransactions);
      }, 100);
    } else {
      setNewTask(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    setNewTask(prev => ({
      ...prev,
      [id.replace('task-', '')]: checked
    }))
  }

  // Get transactions for a specific agent
  const getAgentTransactions = () => {
    if (!newTask.agentId) return [];
    
    // Log for debugging
    console.log("Getting transactions for agent:", newTask.agentId);
    console.log("Total available transactions:", transactions.length);
    
    // First try exact match on agentId or agent.id
    let filteredTransactions = transactions.filter(t => 
      t.agentId === newTask.agentId || t.agent.id === newTask.agentId
    );
    
    // If no transactions found, try case-insensitive match
    if (filteredTransactions.length === 0) {
      const agentIdLower = newTask.agentId.toLowerCase();
      filteredTransactions = transactions.filter(t => 
        (t.agentId && t.agentId.toLowerCase() === agentIdLower) || 
        (t.agent.id && t.agent.id.toLowerCase() === agentIdLower)
      );
    }
    
    console.log("Filtered transactions for this agent:", filteredTransactions);
    return filteredTransactions;
  }

  // Handle form submission
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newTask.title || !newTask.transactionId || !newTask.agentId || !newTask.dueDate || !newTask.priority) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log("Creating new task:", newTask)
      
      // Get property address from transaction
      let propertyAddress = ""
      const selectedTransaction = transactions.find(t => t.id === newTask.transactionId)
      
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
          id: data.task.agentId || "unknown-agent",
          name: data.task.agentName || data.task.agentId || "Unknown Agent",
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

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status !== "completed")
  const completedTasks = tasks.filter(task => task.status === "completed")

  // Render task table
  const renderTaskTable = (taskList: Task[]) => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskList.length > 0 ? (
              taskList.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.agent.avatar} alt={task.agent.name} />
                        <AvatarFallback>{task.agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>{task.agent.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{task.transactionId}</div>
                      <div className="text-sm text-muted-foreground">{task.property}</div>
                      {task.transaction && (
                        <div className="mt-1">{getTransactionStatusBadge(task.transaction.status)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading task management...</p>
        </div>
      </div>
    )
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle>Authentication Error</CardTitle>
            </div>
            <CardDescription>
              {authError}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"}
            >
              Go to Home
            </Button>
            <Button 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

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
                            <SelectItem value="no-transactions" disabled>No transactions for this agent</SelectItem>
                          )
                        )
                      ) : (
                        <SelectItem value="select-agent-first" disabled>Please select an agent first</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={(e) => handleSelectChange("dueDate", e.target.value)}
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
                <Label htmlFor="task-description">Description (Optional)</Label>
                <Textarea 
                  id="task-description" 
                  placeholder="Enter task description" 
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="aiReminder"
                  checked={newTask.aiReminder}
                  onChange={(e) => handleSelectChange("aiReminder", e.target.checked.toString())}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="aiReminder" className="text-sm font-normal">
                  Enable AI reminders for this task
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning Task...
                  </>
                ) : (
                  "Assign Task"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>
              {lastRefreshed ? (
                <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
              ) : (
                "Task statistics and overview"
              )}
            </CardDescription>
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