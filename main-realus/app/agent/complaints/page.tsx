"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, MessageSquare, Eye, Clock, ArrowUpCircle, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function AgentComplaints() {
  const [isCreatingComplaint, setIsCreatingComplaint] = useState(false)

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "comp-1",
      title: "Missing document notification",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      submittedDate: "Apr 10, 2025",
      status: "new",
      priority: "medium",
      description: "I was not notified about missing documents until the day before the deadline.",
      category: "Communication",
    },
    {
      id: "comp-2",
      title: "Incorrect property information",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      submittedDate: "Apr 8, 2025",
      status: "in_progress",
      priority: "high",
      description: "The property square footage in the listing is incorrect and needs to be updated.",
      category: "Documentation",
      response: "We are reviewing the property information and will update it shortly.",
    },
    {
      id: "comp-3",
      title: "Delayed response from lender",
      transactionId: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      submittedDate: "Apr 5, 2025",
      status: "escalated",
      priority: "high",
      description: "The lender has not responded to multiple requests for pre-approval letter.",
      category: "Third-party",
      response: "We have escalated this issue to the broker who will contact the lender directly.",
    },
    {
      id: "comp-4",
      title: "Inspection scheduling conflict",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      submittedDate: "Apr 3, 2025",
      status: "resolved",
      priority: "low",
      description: "There was a scheduling conflict with the home inspector.",
      category: "Scheduling",
      response: "The inspection has been rescheduled for April 15th at 10:00 AM.",
    },
  ])

  const activeComplaints = complaints.filter((comp) => comp.status !== "resolved")
  const resolvedComplaints = complaints.filter((comp) => comp.status === "resolved")

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
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaintList.length > 0 ? (
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
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button variant="ghost" size="icon">
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
              <Button onClick={() => setIsCreatingComplaint(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>New Complaint</span>
              </Button>
            </div>
          </CardHeader>
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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-title">Title</Label>
                    <Input id="complaint-title" placeholder="Brief title of your complaint" />
                  </div>

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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="communication">Communication</SelectItem>
                          <SelectItem value="third-party">Third-party</SelectItem>
                          <SelectItem value="scheduling">Scheduling</SelectItem>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Detailed description of your complaint" rows={5} />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => setIsCreatingComplaint(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Complaint</Button>
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

