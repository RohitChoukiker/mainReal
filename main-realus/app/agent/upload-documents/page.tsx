"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertTriangle, X, Clock, RefreshCw } from "lucide-react"

interface Document {
  id: string
  name: string
  transactionId: string
  property: string
  uploadDate: string
  status: "verifying" | "verified" | "rejected" | "pending"
  aiVerified: boolean
  aiScore?: number
  issues?: string[]
  fileSize?: string
}

export default function UploadDocuments() {
  const [selectedTransaction, setSelectedTransaction] = useState<string>("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "Purchase Agreement",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      uploadDate: "Apr 12, 2025",
      status: "verified",
      aiVerified: true,
      aiScore: 95,
      fileSize: "2.4 MB",
    },
    {
      id: "doc-2",
      name: "Property Disclosure",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      uploadDate: "Apr 12, 2025",
      status: "verifying",
      aiVerified: false,
      fileSize: "1.8 MB",
    },
    {
      id: "doc-3",
      name: "Inspection Report",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      uploadDate: "Apr 11, 2025",
      status: "rejected",
      aiVerified: false,
      aiScore: 45,
      issues: ["Missing signature on page 3", "Incomplete section on property condition"],
      fileSize: "3.2 MB",
    },
    {
      id: "doc-4",
      name: "Title Report",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      uploadDate: "Apr 10, 2025",
      status: "pending",
      aiVerified: false,
      fileSize: "1.5 MB",
    },
  ])

  // Sample transactions for the dropdown
  const transactions = [
    { id: "TR-7829", property: "123 Main St, Austin, TX" },
    { id: "TR-6543", property: "456 Oak Ave, Dallas, TX" },
    { id: "TR-9021", property: "789 Pine Rd, Houston, TX" },
  ]

  // Required documents based on transaction type
  const requiredDocuments = [
    "Purchase Agreement",
    "Property Disclosure",
    "Inspection Report",
    "Financing Pre-Approval",
    "Title Report",
    "Insurance Binder",
    "HOA Documents",
    "Lead-Based Paint Disclosure",
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified</span>
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        )
      case "verifying":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Verifying</span>
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    // In a real app, you would handle file uploads here
    console.log("File dropped")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Transaction</CardTitle>
              <CardDescription>Choose a transaction to upload documents for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction">Transaction</Label>
                  <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                    <SelectTrigger id="transaction">
                      <SelectValue placeholder="Select a transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactions.map((transaction) => (
                        <SelectItem key={transaction.id} value={transaction.id}>
                          {transaction.id} - {transaction.property}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>Drag and drop your document or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Drag files here or click to browse</h3>
                  <p className="text-sm text-muted-foreground mb-4">Support for PDF, DOCX, JPG, PNG (max 10MB)</p>
                  <Button>Select File</Button>
                  <input id="file-upload" type="file" className="hidden" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Document Type</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requiredDocuments.map((doc) => (
                      <SelectItem key={doc} value={doc}>
                        {doc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Documents you have uploaded for your transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction</TableHead>
                      <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-xs text-muted-foreground hidden md:block">{doc.property}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{doc.transactionId}</TableCell>
                          <TableCell className="hidden md:table-cell">{doc.uploadDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(doc.status)}
                              {doc.issues && doc.issues.length > 0 && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{doc.fileSize}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No documents uploaded yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Document Verification</CardTitle>
              <CardDescription>Our AI automatically verifies your documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-muted/50">
                <div className="mr-3 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Authenticity Check</div>
                  <div className="text-xs text-muted-foreground">Verifies document is genuine</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-muted/50">
                <div className="mr-3 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Signature Detection</div>
                  <div className="text-xs text-muted-foreground">Checks for required signatures</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-muted/50">
                <div className="mr-3 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Expiration Check</div>
                  <div className="text-xs text-muted-foreground">Validates document expiry dates</div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-muted/50">
                <div className="mr-3 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium">Completeness Check</div>
                  <div className="text-xs text-muted-foreground">Ensures all required fields are filled</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Documents needed for transaction completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {requiredDocuments.map((doc, index) => {
                  const uploaded = documents.find((d) => d.name === doc)
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{doc}</span>
                      </div>
                      {uploaded ? getStatusBadge(uploaded.status) : <Badge variant="outline">Not Uploaded</Badge>}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

