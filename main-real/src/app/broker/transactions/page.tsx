"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown } from "lucide-react"

const initialTransactions = [
  {
    id: "T123",
    property: "123 Maple St",
    status: "Completed",
    agent: "John Doe",
    documents: "Uploaded",
    payment: "Paid",
  },
  {
    id: "T124",
    property: "456 Oak Ave",
    status: "Pending",
    agent: "Sarah Lee",
    documents: "Pending",
    payment: "Unpaid",
  },
  {
    id: "T125",
    property: "789 Pine Rd",
    status: "In Progress",
    agent: "Mike Johnson",
    documents: "Partial",
    payment: "Partial",
  },
  {
    id: "T126",
    property: "321 Elm St",
    status: "Completed",
    agent: "Emily Brown",
    documents: "Uploaded",
    payment: "Paid",
  },
  {
    id: "T127",
    property: "654 Birch Ln",
    status: "Pending",
    agent: "David Wilson",
    documents: "Pending",
    payment: "Unpaid",
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.id.toLowerCase().includes(filter.toLowerCase()) ||
        transaction.property.toLowerCase().includes(filter.toLowerCase()) ||
        transaction.agent.toLowerCase().includes(filter.toLowerCase())) &&
      (statusFilter === "All" || transaction.status === statusFilter),
  )

  const handleSort = (key: keyof (typeof transactions)[0]) => {
    setTransactions([...transactions].sort((a, b) => a[key].localeCompare(b[key])))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search transactions..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                  Transaction ID
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("property")}>
                  Property
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("agent")}>
                  Agent
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("documents")}>
                  Documents
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("payment")}>
                  Payment
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.property}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>{transaction.agent}</TableCell>
                  <TableCell>{transaction.documents}</TableCell>
                  <TableCell>{transaction.payment}</TableCell>
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
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

