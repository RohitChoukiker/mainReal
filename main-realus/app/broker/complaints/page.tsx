"use client"

import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, MessageSquare, Eye, Clock, ArrowUpCircle, Download, Search } from "lucide-react"
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
  }
  submittedDate: string
  status: "new" | "in_progress" | "resolved" | "escalated"
  priority: "low" | "medium" | "high"
  description: string
  category: string
  assignedTo?: string
}

export default function BrokerComplaints() {
  const [searchQuery, setSearchQuery] = useState("")

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "comp-1",
      title: "Missing document notification",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
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
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      submittedDate: "Apr 8, 2025",
      status: "in_progress",
      priority: "high",
      description: "The property square footage in the listing is incorrect and needs to be updated.",
      category: "Documentation",
      assignedTo: "Michael Brown (TC)",
    },
    {
      id: "comp-3",
      title: "Delayed response from lender",
      transactionId: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      submittedDate: "Apr 5, 2025",
      status: "escalated",
      priority: "high",
      description: "The lender has not responded to multiple requests for pre-approval letter.",
      category: "Third-party",
      assignedTo: "You",
    },
    {
      id: "comp-4",
      title: "Inspection scheduling conflict",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      submittedDate: "Apr 3, 2025",
      status: "resolved",
      priority: "low",
      description: "There was a scheduling conflict with the home inspector.",
      category: "Scheduling",
      assignedTo: "Sarah Johnson (TC)",
    },
    {
      id: "comp-5",
      title: "Disclosure form issues",
      transactionId: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      submittedDate: "Mar 30, 2025",
      status: "resolved",
      priority: "medium",
      description: "The seller's disclosure form had several incomplete sections.",
      category: "Documentation",
      assignedTo: "Michael Brown (TC)",
    },
    {
      id: "comp-6",
      title: "Commission dispute",
      transactionId: "TR-2345",
      property: "234 Birch Ave, Dallas, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      submittedDate: "Apr 12, 2025",
      status: "escalated",
      priority: "high",
      description: "There is a dispute regarding the commission split on this transaction.",
      category: "Financial",
      assignedTo: "You",
    },
  ])

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

  const renderComplaintTable = (complaintList: Complaint[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Assigned To</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaint.status)}
                    {complaint.priority === "high" && <AlertCircle className="h-3 w-3 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.assignedTo || "-"}</TableCell>
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
            </div>
          </CardHeader>
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

