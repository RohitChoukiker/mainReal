"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown } from "lucide-react"

const agents = [
  { id: 1, name: "John Doe", email: "john@email.com", status: "Active", transactions: 25, rating: 4.8, complaints: 1 },
  { id: 2, name: "Sarah Lee", email: "sarah@email.com", status: "Pending", transactions: 0, rating: 0, complaints: 0 },
  // Add more sample data here
]

export function AgentsTable() {
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredAgents = agents.filter(
    (agent) =>
      (agent.name.toLowerCase().includes(filter.toLowerCase()) ||
        agent.email.toLowerCase().includes(filter.toLowerCase())) &&
      (statusFilter === "All" || agent.status === statusFilter),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search agents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status: {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Rejected")}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Complaints</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>{agent.name}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.status}</TableCell>
              <TableCell>{agent.transactions}</TableCell>
              <TableCell>{agent.rating}/5</TableCell>
              <TableCell>{agent.complaints}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Approve/Reject</DropdownMenuItem>
                    <DropdownMenuItem>Assign Transaction</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

