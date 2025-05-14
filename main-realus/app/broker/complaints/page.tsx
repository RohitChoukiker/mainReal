"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, MessageSquare, Eye, Clock, ArrowUpCircle, Download, Search, Loader2, RefreshCw, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Complaint {
  id: string
  title: string
  transactionId: string
  property: string
  agent: {
    name: string
    avatar: string
    id: string // MongoDB ID of the agent
  }
  submittedDate: string
  status: "new" | "in_progress" | "resolved" | "escalated"
  priority: "low" | "medium" | "high"
  description: string
  category: string
  assignedTo?: string
  response?: string
}

export default function BrokerComplaints() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  
  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  const [assignToOptions] = useState([
    { value: "broker-1", label: "You (Broker)" },
    { value: "tc-1", label: "Sarah Johnson (TC)" },
    { value: "tc-2", label: "Michael Brown (TC)" },
    { value: "tc-3", label: "Jennifer Lee (TC)" },
  ])
  const [selectedAssignee, setSelectedAssignee] = useState("")
  
  // Fetch complaints data
  useEffect(() => {
    fetchComplaints()
  }, [])
  
  // Function to fetch complaints
  const fetchComplaints = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching complaints data for broker...")
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/broker/complaints?_=${timestamp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received complaints data:", data)
        
        if (data.complaints && data.complaints.length > 0) {
          // Log the first complaint to check agent data
          console.log("First complaint agent data:", data.complaints[0].agent)
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

  const newComplaints = complaints.filter((comp) => comp.status === "new")
  const inProgressComplaints = complaints.filter((comp) => comp.status === "in_progress")
  const escalatedComplaints = complaints.filter((comp) => comp.status === "escalated")
  const resolvedComplaints = complaints.filter((comp) => comp.status === "resolved")

  // Apply search filter
  const filteredComplaints = searchQuery
    ? complaints.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.agent.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.transactionId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : complaints

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
  
  // Handle view complaint details
  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsViewModalOpen(true)
  }
  
  // Handle open response modal
  const handleOpenResponseModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setResponseText(complaint.response || "")
    setSelectedAssignee("") // Reset the selected assignee
    setIsResponseModalOpen(true)
  }
  
  // Handle open resolve modal
  const handleOpenResolveModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsResolveModalOpen(true)
  }
  
  // Handle submit response
  const handleSubmitResponse = async () => {
    if (!selectedComplaint) return
    
    try {
      setIsSubmittingResponse(true)
      
      // Prepare the response data
      const responseData = {
        id: selectedComplaint.id,
        response: responseText,
        status: "in_progress", // Update status to in_progress when a response is added
        assignedTo: selectedAssignee || undefined
      }
      
      console.log("Submitting response data:", responseData)
      
      // Submit the response
      const response = await fetch(`/api/broker/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseData)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response submitted successfully:", data)
        
        // Update the complaint in the state
        setComplaints(complaints.map(c => 
          c.id === selectedComplaint.id 
            ? { 
                ...c, 
                response: responseText, 
                status: "in_progress",
                assignedTo: selectedAssignee ? assignToOptions.find(opt => opt.value === selectedAssignee)?.label : c.assignedTo
              } 
            : c
        ))
        
        // Close the modal
        setIsResponseModalOpen(false)
        
        // Reset the response text and selected assignee
        setResponseText("")
        setSelectedAssignee("")
        
        // Show success message
        toast({
          title: "Success",
          description: "Your response has been submitted successfully",
          variant: "default"
        })
        
        // Refresh complaints data
        fetchComplaints()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit response")
      }
    } catch (error) {
      console.error("Error submitting response:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit response",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingResponse(false)
    }
  }
  
  // Handle resolve complaint
  const handleResolveComplaint = async () => {
    if (!selectedComplaint) return
    
    try {
      setIsSubmittingResponse(true)
      
      // Prepare the resolve data
      const resolveData = {
        id: selectedComplaint.id,
        status: "resolved"
      }
      
      // Submit the resolve request
      const response = await fetch(`/api/broker/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resolveData)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Complaint resolved successfully:", data)
        
        // Update the complaint in the state
        setComplaints(complaints.map(c => 
          c.id === selectedComplaint.id 
            ? { ...c, status: "resolved" } 
            : c
        ))
        
        // Close the modal
        setIsResolveModalOpen(false)
        
        // Show success message
        toast({
          title: "Success",
          description: "The complaint has been resolved successfully",
          variant: "default"
        })
        
        // Refresh complaints data
        fetchComplaints()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to resolve complaint")
      }
    } catch (error) {
      console.error("Error resolving complaint:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resolve complaint",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  const renderComplaintTable = (complaintList: Complaint[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="md:table-cell">Agent</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
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
                <TableCell className="md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={complaint.agent.avatar} alt={complaint.agent.name} />
                      <AvatarFallback>{complaint.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-primary">{complaint.agent.name || "Unknown Agent"}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.submittedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaint.status)}
                    {complaint.priority === "high" && <AlertCircle className="h-3 w-3 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.assignedTo || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewComplaint(complaint)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenResponseModal(complaint)}
                      title="Add/View response"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Respond</span>
                    </Button>
                    {complaint.status !== "resolved" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-green-500"
                        onClick={() => handleOpenResolveModal(complaint)}
                        title="Mark as resolved"
                      >
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
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>Review and manage complaints from agents</CardDescription>
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
          
          {/* View Complaint Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Complaint Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this complaint
                </DialogDescription>
              </DialogHeader>
              
              {selectedComplaint && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4">
                      <h3 className="font-semibold text-lg">{selectedComplaint.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.property}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Status</h4>
                      <div>{getStatusBadge(selectedComplaint.status)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Priority</h4>
                      <div>{getPriorityBadge(selectedComplaint.priority)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Category</h4>
                      <p className="text-sm">{selectedComplaint.category}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Submitted</h4>
                      <p className="text-sm">{selectedComplaint.submittedDate}</p>
                    </div>
                    
                    <div className="col-span-4 space-y-1">
                      <h4 className="text-sm font-medium">Transaction ID</h4>
                      <p className="text-sm">{selectedComplaint.transactionId}</p>
                    </div>
                    
                    <div className="col-span-4 space-y-1">
                      <h4 className="text-sm font-medium">Agent</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedComplaint.agent.avatar} alt={selectedComplaint.agent.name} />
                          <AvatarFallback>{selectedComplaint.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{selectedComplaint.agent.name}</span>
                          <span className="text-xs text-muted-foreground">ID: {selectedComplaint.agent.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-4 space-y-1">
                      <h4 className="text-sm font-medium">Assigned To</h4>
                      <p className="text-sm">{selectedComplaint.assignedTo || "Not assigned"}</p>
                    </div>
                    
                    <div className="col-span-4 space-y-1">
                      <h4 className="text-sm font-medium">Description</h4>
                      <div className="rounded-md bg-muted p-3">
                        <p className="text-sm whitespace-pre-wrap">{selectedComplaint.description}</p>
                      </div>
                    </div>
                    
                    {selectedComplaint.response && (
                      <div className="col-span-4 space-y-1">
                        <h4 className="text-sm font-medium">Response</h4>
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm whitespace-pre-wrap">{selectedComplaint.response}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsViewModalOpen(false)
                    if (selectedComplaint) {
                      handleOpenResponseModal(selectedComplaint)
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {selectedComplaint?.response ? "Update Response" : "Add Response"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Response Modal */}
          <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedComplaint?.response ? "Update Response" : "Add Response"}
                </DialogTitle>
                <DialogDescription>
                  {selectedComplaint?.response 
                    ? "Update your response to this complaint" 
                    : "Provide a response to this complaint"}
                </DialogDescription>
              </DialogHeader>
              
              {selectedComplaint && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{selectedComplaint.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.property}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea 
                      id="response" 
                      value={responseText} 
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Enter your response here..."
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assignTo">Assign To</Label>
                    <Select 
                      value={selectedAssignee} 
                      onValueChange={setSelectedAssignee}
                    >
                      <SelectTrigger id="assignTo">
                        <SelectValue placeholder="Select who to assign this complaint to" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignToOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to keep current assignment: {selectedComplaint.assignedTo || "Not assigned"}
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsResponseModalOpen(false)}
                  disabled={isSubmittingResponse}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim() || isSubmittingResponse}
                >
                  {isSubmittingResponse ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Resolve Modal */}
          <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Resolve Complaint</DialogTitle>
                <DialogDescription>
                  Are you sure you want to mark this complaint as resolved?
                </DialogDescription>
              </DialogHeader>
              
              {selectedComplaint && (
                <div className="py-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{selectedComplaint.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.property}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium">Current status:</span>
                      {getStatusBadge(selectedComplaint.status)}
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsResolveModalOpen(false)}
                  disabled={isSubmittingResponse}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleResolveComplaint}
                  disabled={isSubmittingResponse}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmittingResponse ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5 mb-4 mx-4 mt-2">
                <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
                <TabsTrigger value="new">New ({newComplaints.length})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({inProgressComplaints.length})</TabsTrigger>
                <TabsTrigger value="escalated">Escalated ({escalatedComplaints.length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderComplaintTable(filteredComplaints)}</TabsContent>

              <TabsContent value="new">
                {renderComplaintTable(filteredComplaints.filter((c) => c.status === "new"))}
              </TabsContent>

              <TabsContent value="in_progress">
                {renderComplaintTable(filteredComplaints.filter((c) => c.status === "in_progress"))}
              </TabsContent>

              <TabsContent value="escalated">
                {renderComplaintTable(filteredComplaints.filter((c) => c.status === "escalated"))}
              </TabsContent>

              <TabsContent value="resolved">
                {renderComplaintTable(filteredComplaints.filter((c) => c.status === "resolved"))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Overview</CardTitle>
              <CardDescription>Summary of all complaints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Total Complaints</div>
                  <div className="text-2xl font-bold">{complaints.length}</div>
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

              <div className="mt-4">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Complaint</CardTitle>
              <CardDescription>Assign a complaint to a transaction coordinator</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Complaint</Label>
                  <Select>
                    <SelectTrigger id="complaint">
                      <SelectValue placeholder="Select complaint" />
                    </SelectTrigger>
                    <SelectContent>
                      {newComplaints.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson (TC)</SelectItem>
                      <SelectItem value="michael">Michael Brown (TC)</SelectItem>
                      <SelectItem value="self">Handle Myself</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any notes for the assignee" rows={3} />
                </div>

                <Button className="w-full">Assign Complaint</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Categories</CardTitle>
          <CardDescription>Distribution of complaints by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Documentation</span>
                  </div>
                  <span className="font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2 bg-muted" />
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
                  <span className="font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2 bg-muted" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                    <span>Scheduling</span>
                  </div>
                  <span className="font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Financial</span>
                  </div>
                  <span className="font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-500 mr-2"></div>
                    <span>Other</span>
                  </div>
                  <span className="font-medium">5%</span>
                </div>
                <Progress value={5} className="h-2 bg-muted" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

