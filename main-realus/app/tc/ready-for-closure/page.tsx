"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Eye, ArrowUpCircle, FileCheck, Calendar, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Transaction {
  id: string
  property: string
  client: string
  agent: {
    name: string
    avatar: string
  }
  closingDate: string
  status: "ready_for_closure" | "forwarded_to_broker" | "closed"
  completionPercentage: number
  documents: {
    total: number
    verified: number
  }
  tasks: {
    total: number
    completed: number
  }
}

export default function ReadyForClosure() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<string>("")
  const [closingNotes, setClosingNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false)
  const [selectedTransactionForForward, setSelectedTransactionForForward] = useState<Transaction | null>(null)

  // Fetch transactions data
  useEffect(() => {
    fetchTransactions()
  }, [])

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching ready for closure transactions...")
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/tc/ready-for-closure?_=${timestamp}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received transactions data:", data)
        
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions)
        } else {
          console.log("No transactions found")
          setTransactions([])
        }
      } else {
        console.error("Error response from API:", response.status)
        toast({
          title: "Error",
          description: "Failed to fetch transactions data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch transactions data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const readyTransactions = transactions.filter((t) => t.status === "ready_for_closure")
  const forwardedTransactions = transactions.filter((t) => t.status === "forwarded_to_broker")
  const closedTransactions = transactions.filter((t) => t.status === "closed")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready_for_closure":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Ready for Closure</span>
          </Badge>
        )
      case "forwarded_to_broker":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <ArrowUpCircle className="h-3 w-3" />
            <span>Forwarded to Broker</span>
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Closed</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Open forward dialog
  const openForwardDialog = (transaction: Transaction) => {
    setSelectedTransactionForForward(transaction)
    setClosingNotes("")
    setForwardDialogOpen(true)
  }

  // Handle forward to broker from table
  const handleForwardToBroker = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId)
    if (transaction) {
      openForwardDialog(transaction)
    }
  }

  // Handle submit forward to broker
  const handleSubmitForward = async () => {
    if (!selectedTransactionForForward) {
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Forwarding transaction to broker:", selectedTransactionForForward.id)
      
      const response = await fetch('/api/tc/ready-for-closure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: selectedTransactionForForward.id,
          status: 'forwarded_to_broker',
          notes: closingNotes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        
        // Update the transaction in the local state
        setTransactions(prevTransactions => 
          prevTransactions.map(t => 
            t.id === selectedTransactionForForward.id 
              ? { ...t, status: 'forwarded_to_broker' } 
              : t
          )
        )
        
        toast({
          title: "Transaction Forwarded",
          description: "The transaction has been forwarded to the broker for closure approval.",
        })
        
        // Close the dialog
        setForwardDialogOpen(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", errorData)
        throw new Error(`Failed to forward transaction: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('Error forwarding transaction:', error)
      toast({
        title: "Error",
        description: "Failed to forward transaction. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Ready for Closure</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transactions Ready for Closure</CardTitle>
                <CardDescription>
                  Transactions that have completed all requirements and are ready to be forwarded to the broker for final
                  approval
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={fetchTransactions} 
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
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead className="hidden md:table-cell">Client</TableHead>
                    <TableHead className="hidden md:table-cell">Agent</TableHead>
                    <TableHead className="hidden md:table-cell">Closing Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Loading transactions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : readyTransactions.length > 0 ? (
                    readyTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{transaction.id}</div>
                              <div className="text-xs text-muted-foreground">{transaction.property}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{transaction.client}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={transaction.agent.avatar} alt={transaction.agent.name} />
                              <AvatarFallback>{transaction.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{transaction.agent.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handleForwardToBroker(transaction.id)}>
                              Forward to Broker
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No transactions ready for closure
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Closure Status</CardTitle>
            <CardDescription>Overview of transaction closures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Ready for Closure</div>
                  <div className="text-2xl font-bold">{readyTransactions.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <ArrowUpCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Forwarded to Broker</div>
                  <div className="text-2xl font-bold">{forwardedTransactions.length}</div>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-muted/50">
                <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Closed Transactions</div>
                  <div className="text-2xl font-bold">{closedTransactions.length}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Upcoming Closings</span>
                </div>
                <p className="text-sm mb-2">
                  You have {readyTransactions.length} transactions ready for closure in the next 7 days.
                </p>
                <div className="text-xs flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Forward to broker at least 48 hours before closing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forward Transaction to Broker</CardTitle>
          <CardDescription>Select a transaction and add closing notes before forwarding to the broker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transaction">Transaction</Label>
              <select
                id="transaction"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value)}
              >
                <option value="">Select a transaction</option>
                {readyTransactions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.property}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Closing Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any important notes for the broker regarding this transaction closure"
                rows={4}
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Completion Checklist</div>
              <div className="space-y-2 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All required documents verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All tasks completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Final walkthrough scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Closing disclosure reviewed</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                className="flex items-center gap-2"
                disabled={!selectedTransaction || isSubmitting}
                onClick={() => {
                  const transaction = transactions.find(t => t.id === selectedTransaction)
                  if (transaction) {
                    openForwardDialog(transaction)
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="h-4 w-4" />
                    <span>Forward to Broker</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Forward to Broker Dialog */}
      <Dialog open={forwardDialogOpen} onOpenChange={(open) => {
        if (!isSubmitting) setForwardDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Forward Transaction to Broker</DialogTitle>
            <DialogDescription>
              {selectedTransactionForForward?.property}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-medium">Transaction:</div>
              <div className="col-span-3">{selectedTransactionForForward?.id}</div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-medium">Client:</div>
              <div className="col-span-3">{selectedTransactionForForward?.client}</div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-medium">Agent:</div>
              <div className="col-span-3">{selectedTransactionForForward?.agent.name}</div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="font-medium">Closing Date:</div>
              <div className="col-span-3">{selectedTransactionForForward?.closingDate}</div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="forward-notes" className="font-medium">
                Closing Notes for Broker:
              </label>
              <Textarea
                id="forward-notes"
                placeholder="Add any important notes for the broker regarding this transaction closure"
                rows={5}
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setForwardDialogOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitForward}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forwarding...
                </>
              ) : (
                "Forward to Broker"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Recently Forwarded Transactions</CardTitle>
          <CardDescription>Transactions that have been forwarded to the broker for final approval</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden md:table-cell">Agent</TableHead>
                  <TableHead className="hidden md:table-cell">Closing Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forwardedTransactions.length > 0 ? (
                  forwardedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{transaction.id}</div>
                            <div className="text-xs text-muted-foreground">{transaction.property}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{transaction.client}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={transaction.agent.avatar} alt={transaction.agent.name} />
                            <AvatarFallback>{transaction.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{transaction.agent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No transactions forwarded to broker
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

