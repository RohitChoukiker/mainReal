"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NewTransaction() {
  const [transactionId, setTransactionId] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // AI suggested documents based on transaction type
  const suggestedDocuments = [
    { name: "Purchase Agreement", required: true },
    { name: "Property Disclosure", required: true },
    { name: "Inspection Report", required: true },
    { name: "Financing Pre-Approval", required: true },
    { name: "Title Report", required: true },
    { name: "Insurance Binder", required: false },
    { name: "HOA Documents", required: false },
    { name: "Lead-Based Paint Disclosure", required: false },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random transaction ID
    const randomId = "TR-" + Math.floor(10000 + Math.random() * 90000)
    setTransactionId(randomId)
    setIsSubmitted(true)

    // In a real app, you would submit the form data to your backend here
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Transaction</h1>

      {isSubmitted ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-xl">Transaction Created Successfully</CardTitle>
            <CardDescription>Your new transaction has been created with the following ID</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold mb-6">{transactionId}</div>
            <p className="text-muted-foreground mb-6">
              You can now proceed to upload the required documents for this transaction.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="/agent/upload-documents">Upload Documents</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/agent/transactions">View My Transactions</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>Enter the basic information about this transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select required>
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property-address">Property Address</Label>
                  <Input id="property-address" placeholder="Enter full property address" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select required>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="$" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closing-date">Estimated Closing Date</Label>
                  <Input id="closing-date" type="date" required />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Enter the client details for this transaction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input id="client-name" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <Input id="client-email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Phone</Label>
                      <Input id="client-phone" type="tel" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-notes">Additional Notes</Label>
                    <Textarea id="client-notes" placeholder="Any special requirements or notes about the client" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Suggested Required Documents</CardTitle>
                  <CardDescription>Based on the transaction type, these documents will be required</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{doc.name}</span>
                        </div>
                        {doc.required ? (
                          <Badge variant="default">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>You will be prompted to upload these after creation</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">Create Transaction</Button>
          </div>
        </form>
      )}
    </div>
  )
}

