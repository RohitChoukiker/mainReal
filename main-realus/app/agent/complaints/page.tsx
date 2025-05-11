"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, MessageSquare, Eye, Clock, ArrowUpCircle, PlusCircle, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface Complaint {
  id: string
  title: string
  transactionId: string
  property: string
  submittedDate: string
  status: "new" | "in_progress" | "resolved" | "escalated"
  priority: "low" | "medium" | "high"
  description: string
  category: string
  response?: string
}

interface Transaction {
  id: string
  property: string
  transactionId: string
}

export default function AgentComplaints() {
  const [isCreatingComplaint, setIsCreatingComplaint] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  
  // Form state
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    transactionId: "",
    priority: "",
    category: "",
    description: ""
  })

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching complaints data...")
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/agent/complaints?_=${timestamp}`)
        
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
          // Don't use fallback data, just set empty array
          setComplaints([])
        }
      } catch (error) {
        console.error("Error fetching complaints:", error)
        // Don't use fallback data, just set empty array
        setComplaints([])
      } finally {
        setIsLoading(false)
      }
    }
    
    const fetchTransactions = async () => {
      try {
        console.log("Fetching transactions data...")
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/agent/transactions/list?_=${timestamp}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log("Received transactions data:", data)
          
          if (data.transactions && data.transactions.length > 0) {
            // Format transactions for the dropdown
            const formattedTransactions = data.transactions.map((transaction: any) => ({
              id: transaction.transactionId || transaction.id,
              transactionId: transaction.transactionId || transaction.id,
              property: transaction.propertyAddress + 
                (transaction.city ? `, ${transaction.city}` : '') + 
                (transaction.state ? `, ${transaction.state}` : '')
            }))
            
            setTransactions(formattedTransactions)
          } else {
            console.log("No transactions found")
            // Don't use fallback data, just set empty array
            setTransactions([])
          }
        } else {
          console.error("Error response from API:", response.status)
          // Don't use fallback data, just set empty array
          setTransactions([])
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
        // Don't use fallback data, just set empty array
        setTransactions([])
      }
    }
    
    fetchComplaints()
    fetchTransactions()
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchComplaints()
    }, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  const activeComplaints = complaints.filter((comp) => comp.status !== "resolved")
  const resolvedComplaints = complaints.filter((comp) => comp.status === "resolved")
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setComplaintForm({
      ...complaintForm,
      [id.replace('complaint-', '')]: value
    })
  }
  
  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setComplaintForm({
      ...complaintForm,
      [field]: value
    })
  }
  
  // Handle form submission
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!complaintForm.title || !complaintForm.transactionId || !complaintForm.priority || 
        !complaintForm.category || !complaintForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Find the selected transaction to get the property
      const selectedTransaction = transactions.find(t => t.transactionId === complaintForm.transactionId)
      if (!selectedTransaction) {
        // If no transactions are available, show an error
        if (transactions.length === 0) {
          throw new Error("No transactions available. Please try again later.")
        } else {
          throw new Error("Selected transaction not found")
        }
      }
      
      // Prepare the complaint data
      const complaintData = {
        title: complaintForm.title,
        transactionId: complaintForm.transactionId,
        property: selectedTransaction.property,
        priority: complaintForm.priority,
        description: complaintForm.description,
        category: complaintForm.category,
        agentId: "agent-123" // In a real app, this would be the logged-in agent's ID
      }
      
      // Submit the complaint
      const response = await fetch('/api/agent/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(complaintData)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Complaint submitted successfully:", data)
        
        // Add the new complaint to the state
        setComplaints([data.complaint, ...complaints])
        
        // Reset the form
        setComplaintForm({
          title: "",
          transactionId: "",
          priority: "",
          category: "",
          description: ""
        })
        
        // Close the form
        setIsCreatingComplaint(false)
        
        // Show success message
        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully",
          variant: "default"
        })
        
        // Refresh complaints data
        refreshComplaints()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit complaint")
      }
    } catch (error) {
      console.error("Error submitting complaint:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit complaint",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
    setIsResponseModalOpen(true)
  }
  
  // Handle submit response
  const handleSubmitResponse = async () => {
    if (!selectedComplaint) return
    
    try {
      setIsSubmittingResponse(true)
      
      // Prepare the response data
      const responseData = {
        complaintId: selectedComplaint.id,
        response: responseText,
        status: "in_progress" // Update status to in_progress when a response is added
      }
      
      // Submit the response
      const response = await fetch(`/api/agent/complaints/${selectedComplaint.id}/respond`, {
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
            ? { ...c, response: responseText, status: "in_progress" } 
            : c
        ))
        
        // Close the modal
        setIsResponseModalOpen(false)
        
        // Reset the response text
        setResponseText("")
        
        // Show success message
        toast({
          title: "Success",
          description: "Your response has been submitted successfully",
          variant: "default"
        })
        
        // Refresh complaints data
        refreshComplaints()
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

  // Function to manually refresh complaints
  const refreshComplaints = async () => {
    try {
      setIsLoading(true)
      console.log("Manually refreshing complaints data...")
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/agent/complaints?_=${timestamp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received refreshed complaints data:", data)
        
        if (data.complaints && data.complaints.length > 0) {
          setComplaints(data.complaints)
          toast({
            title: "Refreshed",
            description: "Complaints data has been updated",
            variant: "default"
          })
        } else {
          console.log("No complaints found")
          setComplaints([])
        }
      } else {
        console.error("Error response from API:", response.status)
        toast({
          title: "Error",
          description: "Failed to refresh complaints data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error refreshing complaints:", error)
      toast({
        title: "Error",
        description: "Failed to refresh complaints data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderComplaintTable = (complaintList: Complaint[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell className="hidden md:table-cell">{complaint.submittedDate}</TableCell>
                <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
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
                      <span className="sr-only">Message</span>
                    </Button>
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
      <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>My Complaints</CardTitle>
                <CardDescription>View and manage your submitted complaints</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={refreshComplaints} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span>Refresh</span>
                </Button>
                <Button onClick={() => setIsCreatingComplaint(true)} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Complaint</span>
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
          <CardContent className="p-0">
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-2 mb-4 mx-4 mt-2">
                <TabsTrigger value="active">Active ({activeComplaints.length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active">{renderComplaintTable(activeComplaints)}</TabsContent>

              <TabsContent value="resolved">{renderComplaintTable(resolvedComplaints)}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isCreatingComplaint ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>Fill out the form to submit a new complaint</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmitComplaint}>
                  <div className="space-y-2">
                    <Label htmlFor="complaint-title">Title</Label>
                    <Input 
                      id="complaint-title" 
                      placeholder="Brief title of your complaint" 
                      value={complaintForm.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction">Transaction</Label>
                    <Select 
                      value={complaintForm.transactionId} 
                      onValueChange={(value) => handleSelectChange(value, 'transactionId')}
                      disabled={transactions.length === 0}
                    >
                      <SelectTrigger id="transaction">
                        <SelectValue placeholder={transactions.length > 0 ? "Select transaction" : "No transactions available"} />
                      </SelectTrigger>
                      <SelectContent>
                        {transactions.length > 0 ? (
                          transactions.map((transaction) => (
                            <SelectItem key={transaction.id} value={transaction.transactionId}>
                              {transaction.transactionId} - {transaction.property}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-transactions" disabled>
                            No transactions available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {transactions.length === 0 && (
                      <p className="text-xs text-destructive mt-1">
                        No transactions available. Please try again later.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={complaintForm.category} 
                        onValueChange={(value) => handleSelectChange(value, 'category')}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Documentation">Documentation</SelectItem>
                          <SelectItem value="Communication">Communication</SelectItem>
                          <SelectItem value="Third-party">Third-party</SelectItem>
                          <SelectItem value="Scheduling">Scheduling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={complaintForm.priority} 
                        onValueChange={(value) => handleSelectChange(value, 'priority')}
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
                    <Label htmlFor="complaint-description">Description</Label>
                    <Textarea 
                      id="complaint-description" 
                      placeholder="Detailed description of your complaint" 
                      rows={5} 
                      value={complaintForm.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => setIsCreatingComplaint(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || transactions.length === 0}
                      title={transactions.length === 0 ? "No transactions available" : ""}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Complaint"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Complaint Status</CardTitle>
                <CardDescription>Overview of your complaints</CardDescription>
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
                  <div className="mr-4 h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">In Progress</div>
                    <div className="text-2xl font-bold">
                      {complaints.filter((c) => c.status === "in_progress").length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-muted/50">
                  <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Resolved</div>
                    <div className="text-2xl font-bold">{complaints.filter((c) => c.status === "resolved").length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Responses</CardTitle>
              <CardDescription>Latest updates on your complaints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {complaints
                .filter((c) => c.response)
                .slice(0, 3)
                .map((complaint) => (
                  <div key={complaint.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium">{complaint.title}</h4>
                      <span className="text-xs text-muted-foreground">{complaint.submittedDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{complaint.transactionId}</p>
                    <div className="p-2 rounded bg-muted/50 text-sm">{complaint.response}</div>
                  </div>
                ))}

              {complaints.filter((c) => c.response).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No responses yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

