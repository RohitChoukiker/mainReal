"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye } from "lucide-react"

export default function AgentApprovals() {
  // Sample data for demonstration
  const pendingAgents = [
    {
      id: "1",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(512) 555-1234",
      licenseNumber: "TX-12345",
      experience: "5 years",
      status: "pending",
      appliedDate: "Apr 10, 2025",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "(214) 555-5678",
      licenseNumber: "TX-67890",
      experience: "3 years",
      status: "pending",
      appliedDate: "Apr 12, 2025",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const approvedAgents = [
    {
      id: "3",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(713) 555-9012",
      licenseNumber: "TX-23456",
      experience: "8 years",
      status: "active",
      approvedDate: "Mar 15, 2025",
      transactions: 24,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(817) 555-3456",
      licenseNumber: "TX-34567",
      experience: "6 years",
      status: "active",
      approvedDate: "Feb 28, 2025",
      transactions: 18,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(210) 555-7890",
      licenseNumber: "TX-45678",
      experience: "4 years",
      status: "active",
      approvedDate: "Mar 5, 2025",
      transactions: 15,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "active":
        return <Badge variant="success">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Agent Approvals</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pending Approvals</CardTitle>
          <CardDescription>New agent registrations awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="hidden md:table-cell">License</TableHead>
                  <TableHead className="hidden md:table-cell">Experience</TableHead>
                  <TableHead className="hidden md:table-cell">Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{agent.licenseNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.experience}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.appliedDate}</TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        <Button variant="outline" size="icon" className="text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Approved Agents</CardTitle>
          <CardDescription>Currently active agents in your brokerage</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="hidden md:table-cell">License</TableHead>
                  <TableHead className="hidden md:table-cell">Experience</TableHead>
                  <TableHead className="hidden md:table-cell">Approved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{agent.licenseNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.experience}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.approvedDate}</TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell className="text-right font-medium">{agent.transactions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

