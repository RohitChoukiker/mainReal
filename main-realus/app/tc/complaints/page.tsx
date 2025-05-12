"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, MessageSquare, Eye, Clock, ArrowUpCircle, Loader2, RefreshCw, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface Complaint {
  id: string
  title: string
  transactionId: string
  property: string
  agent: {
    name: string
    avatar: string
  }
  submittedDate: string
  status: "new" | "in_progress" | "resolved" | "escalated"
  priority: "low" | "medium" | "high"
  description: string
  category: string
}

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Fetch complaints data
  useEffect(() => {
    fetchComplaints()
  }, [])
  
  // Function to fetch complaints
  const fetchComplaints = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching complaints data for TC...")
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/tc/complaints?_=${timestamp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received complaints data:", data)
        
        if (data.complaints && data.complaints.length > 0) {
          setComplaints(data.complaints)
        } else {
          console.log("No complaints found")
          setComplaints([])
        }
      } else {
        console.error("Error response from API:", response.status)
        toast({
          title: "Error",
          description: "Failed to fetch complaints data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
      toast({
        title: "Error",
        description: "Failed to fetch complaints data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Apply search filter
  const filteredComplaints = searchQuery
    ? complaints.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.transactionId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : complaints
    
  const newComplaints = filteredComplaints.filter((comp) => comp.status === "new")
  const inProgressComplaints = filteredComplaints.filter((comp) => comp.status === "in_progress")
  const escalatedComplaints = filteredComplaints.filter((comp) => comp.status === "escalated")
  const resolvedComplaints = filteredComplaints.filter((comp) => comp.status === "resolved")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>New</span>
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <ArrowUpCircle className="h-3 w-3" />
            <span>Escalated</span>
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Resolved</span>
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

  const renderComplaintTable = (complaintList: Complaint[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading complaints...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : complaintList.length > 0 ? (
            complaintList.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{complaint.title}</div>
                      <div className="text-xs text-muted-foreground">{complaint.property}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.transactionId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={complaint.agent.avatar} alt={complaint.agent.name} />
                      <AvatarFallback>{complaint.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{complaint.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.submittedDate}</TableCell>
                <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Respond</span>
                    </Button>
                    {complaint.status !== "resolved" && (
                      <Button variant="ghost" size="icon" className="text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Mark as resolved</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No complaints found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Complaint Categories</CardTitle>
                <CardDescription>Distribution of complaints by category</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search complaints..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchComplaints} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Documentation</span>
                  </div>
                  <span className="font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Communication</span>
                  </div>
                  <span className="font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Third-party</span>
                  </div>
                  <span className="font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                    <span>Scheduling</span>
                  </div>
                  <span className="font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Overview</CardTitle>
            <CardDescription>Current status of all complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">New Complaints</div>
                  <div className="text-2xl font-bold">{newComplaints.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">In Progress</div>
                  <div className="text-2xl font-bold">{inProgressComplaints.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <ArrowUpCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Escalated</div>
                  <div className="text-2xl font-bold">{escalatedComplaints.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Resolved</div>
                  <div className="text-2xl font-bold">{resolvedComplaints.length}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
          <TabsTrigger value="new">New ({newComplaints.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressComplaints.length})</TabsTrigger>
          <TabsTrigger value="escalated">Escalated ({escalatedComplaints.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderComplaintTable(complaints)}</TabsContent>

        <TabsContent value="new">{renderComplaintTable(newComplaints)}</TabsContent>

        <TabsContent value="in_progress">{renderComplaintTable(inProgressComplaints)}</TabsContent>

        <TabsContent value="escalated">{renderComplaintTable(escalatedComplaints)}</TabsContent>

        <TabsContent value="resolved">{renderComplaintTable(resolvedComplaints)}</TabsContent>
      </Tabs>
    </div>
  )
}

