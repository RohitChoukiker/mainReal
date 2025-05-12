"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileCheck, Eye, CheckCircle, XCircle, Calendar, Clock, AlertTriangle, Download, Loader2, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface ClosureRequest {
  id: string
  transactionId: string
  property: string
  client: string
  agent: {
    name: string
    avatar: string
  }
  tc: {
    name: string
    avatar: string
  }
  closingDate: string
  status: "pending" | "approved" | "rejected" | "completed"
  submittedDate: string
  notes?: string
  documents: {
    total: number
    verified: number
  }
}

export default function ClosureRequests() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [closureRequests, setClosureRequests] = useState<ClosureRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [brokerNotes, setBrokerNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch closure requests data
  useEffect(() => {
    fetchClosureRequests()
  }, [])
  
  // Function to fetch closure requests
  const fetchClosureRequests = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching closure requests data...")
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/broker/closure-requests?_=${timestamp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received closure requests data:", data)
        
        if (data.closureRequests && data.closureRequests.length > 0) {
          setClosureRequests(data.closureRequests)
        } else {
          console.log("No closure requests found")
          setClosureRequests([])
        }
      } else {
        console.error("Error response from API:", response.status)
        toast({
          title: "Error",
          description: "Failed to fetch closure requests data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching closure requests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch closure requests data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pendingRequests = closureRequests.filter((req) => req.status === "pending")
  const approvedRequests = closureRequests.filter((req) => req.status === "approved")
  const completedRequests = closureRequests.filter((req) => req.status === "completed")
  const rejectedRequests = closureRequests.filter((req) => req.status === "rejected")

  const handleApprove = async (requestId: string) => {
    try {
      setIsSubmitting(true)
      console.log("Approving closure request:", requestId)
      
      const response = await fetch('/api/broker/closure-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          status: 'approved',
          notes: brokerNotes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        
        // Update the request in the local state
        setClosureRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId 
              ? { ...req, status: 'approved' } 
              : req
          )
        )
        
        toast({
          title: "Request Approved",
          description: "The closure request has been approved.",
        })
        
        // Clear notes
        setBrokerNotes("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(`Failed to approve request: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      setIsSubmitting(true)
      console.log("Rejecting closure request:", requestId)
      
      if (!brokerNotes.trim()) {
        toast({
          title: "Notes Required",
          description: "Please provide notes explaining the rejection reason.",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }
      
      const response = await fetch('/api/broker/closure-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          status: 'rejected',
          notes: brokerNotes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        
        // Update the request in the local state
        setClosureRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId 
              ? { ...req, status: 'rejected' } 
              : req
          )
        )
        
        toast({
          title: "Request Rejected",
          description: "The closure request has been rejected.",
        })
        
        // Clear notes
        setBrokerNotes("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(`Failed to reject request: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleMarkAsCompleted = async (requestId: string) => {
    try {
      setIsSubmitting(true)
      console.log("Marking closure request as completed:", requestId)
      
      const response = await fetch('/api/broker/closure-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          status: 'completed',
          notes: brokerNotes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        
        // Update the request in the local state
        setClosureRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId 
              ? { ...req, status: 'completed' } 
              : req
          )
        )
        
        toast({
          title: "Transaction Closed",
          description: "The transaction has been marked as closed.",
        })
        
        // Clear notes
        setBrokerNotes("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(`Failed to complete transaction: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error completing transaction:', error)
      toast({
        title: "Error",
        description: "Failed to complete transaction. Please try again.",
        variant: "destructive"
      })
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
      case "approved":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
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

  const renderClosureTable = (requestList: ClosureRequest[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead className="hidden md:table-cell">Property</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead className="hidden md:table-cell">TC</TableHead>
            <TableHead>Closing Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestList.length > 0 ? (
            requestList.map((request) => (
              <TableRow key={request.id} className={selectedRequest === request.id ? "bg-muted/50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{request.id}</div>
                      <div className="text-xs text-muted-foreground">{request.transactionId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{request.property}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={request.agent.avatar} alt={request.agent.name} />
                      <AvatarFallback>{request.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{request.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={request.tc.avatar} alt={request.tc.name} />
                      <AvatarFallback>{request.tc.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{request.tc.name}</span>
                  </div>
                </TableCell>
                <TableCell>{request.closingDate}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No closure requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  const selectedRequestData = selectedRequest ? closureRequests.find((req) => req.id === selectedRequest) : null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Closure Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Closure Summary</CardTitle>
            <CardDescription>Overview of closure requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Pending</div>
                <div className="text-xl font-bold">{pendingRequests.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Approved</div>
                <div className="text-xl font-bold">{approvedRequests.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Completed</div>
                <div className="text-xl font-bold">{completedRequests.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Rejected</div>
                <div className="text-xl font-bold">{rejectedRequests.length}</div>
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

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Closure Request List</CardTitle>
            <CardDescription>Review and approve transaction closure requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-4 mb-4 mx-4 mt-2">
                <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">{renderClosureTable(pendingRequests)}</TabsContent>

              <TabsContent value="approved">{renderClosureTable(approvedRequests)}</TabsContent>

              <TabsContent value="completed">{renderClosureTable(completedRequests)}</TabsContent>

              <TabsContent value="rejected">{renderClosureTable(rejectedRequests)}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedRequestData && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Closure Request Details</CardTitle>
                <CardDescription>
                  {selectedRequestData.id} - {selectedRequestData.transactionId}
                </CardDescription>
              </div>
              <div className="mt-2 md:mt-0">{getStatusBadge(selectedRequestData.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Property</h3>
                  <p className="font-medium">{selectedRequestData.property}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                  <p className="font-medium">{selectedRequestData.client}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Closing Date</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{selectedRequestData.closingDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Agent</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedRequestData.agent.avatar} alt={selectedRequestData.agent.name} />
                      <AvatarFallback>{selectedRequestData.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedRequestData.agent.name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction Coordinator</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedRequestData.tc.avatar} alt={selectedRequestData.tc.name} />
                      <AvatarFallback>{selectedRequestData.tc.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedRequestData.tc.name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted Date</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{selectedRequestData.submittedDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Verification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Verified Documents</span>
                      <span className="font-medium">
                        {selectedRequestData.documents.verified}/{selectedRequestData.documents.total}
                      </span>
                    </div>
                    <Progress
                      value={(selectedRequestData.documents.verified / selectedRequestData.documents.total) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Closing Timeline</h3>
                  <div className="p-2 rounded-lg bg-muted/50">
                    {new Date(selectedRequestData.closingDate) < new Date() ? (
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Closing date has passed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">On schedule for closing</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes from Transaction Coordinator</h3>
              <div className="p-3 rounded-lg border">
                <p className="text-sm">{selectedRequestData.notes || "No notes provided"}</p>
              </div>
            </div>

            {selectedRequestData.status === "pending" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broker-notes">Your Notes</Label>
                  <Textarea
                    id="broker-notes"
                    placeholder="Add your notes or feedback about this closure request"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleReject(selectedRequestData.id)}
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Request</span>
                  </Button>
                  <Button className="flex items-center gap-2" onClick={() => handleApprove(selectedRequestData.id)}>
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve Closure</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

