"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, CheckCircle, XCircle, AlertTriangle, Eye, Download, MessageSquare } from "lucide-react"

interface Document {
  id: string
  name: string
  transactionId: string
  property: string
  agent: {
    name: string
    avatar: string
  }
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  aiVerified: boolean
  aiScore: number
  issues?: string[]
}

export default function DocumentReview() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "Purchase Agreement",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 12, 2025",
      status: "pending",
      aiVerified: true,
      aiScore: 95,
    },
    {
      id: "doc-2",
      name: "Property Disclosure",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 12, 2025",
      status: "pending",
      aiVerified: true,
      aiScore: 98,
    },
    {
      id: "doc-3",
      name: "Inspection Report",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 11, 2025",
      status: "pending",
      aiVerified: false,
      aiScore: 65,
      issues: ["Missing signature on page 3", "Incomplete section on property condition"],
    },
    {
      id: "doc-4",
      name: "Title Report",
      transactionId: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 10, 2025",
      status: "pending",
      aiVerified: false,
      aiScore: 45,
      issues: ["Document appears to be outdated", "Missing key property information"],
    },
    {
      id: "doc-5",
      name: "Financing Pre-Approval",
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 9, 2025",
      status: "approved",
      aiVerified: true,
      aiScore: 100,
    },
    {
      id: "doc-6",
      name: "HOA Documents",
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      uploadDate: "Apr 8, 2025",
      status: "rejected",
      aiVerified: false,
      aiScore: 30,
      issues: ["Incorrect HOA information", "Missing HOA contact details", "Outdated fee schedule"],
    },
  ])

  const pendingDocuments = documents.filter((doc) => doc.status === "pending")
  const approvedDocuments = documents.filter((doc) => doc.status === "approved")
  const rejectedDocuments = documents.filter((doc) => doc.status === "rejected")

  const handleApprove = (docId: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "approved" } : doc)))
  }

  const handleReject = (docId: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "rejected" } : doc)))
  }

  const getStatusBadge = (status: string, aiVerified: boolean, aiScore: number) => {
    if (status === "approved") {
      return <Badge variant="success">Approved</Badge>
    }
    if (status === "rejected") {
      return <Badge variant="destructive">Rejected</Badge>
    }

    // For pending documents, show AI verification status
    if (aiVerified) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          AI Verified
        </Badge>
      )
    }

    if (aiScore < 70) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          AI Flagged
        </Badge>
      )
    }

    return <Badge variant="outline">Pending Review</Badge>
  }

  const renderDocumentTable = (docs: Document[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead className="hidden md:table-cell">Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead className="hidden md:table-cell">Uploaded</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.length > 0 ? (
            docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.property}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{doc.transactionId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={doc.agent.avatar} alt={doc.agent.name} />
                      <AvatarFallback>{doc.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{doc.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{doc.uploadDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status, doc.aiVerified, doc.aiScore)}
                    {doc.issues && doc.issues.length > 0 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View document</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    {doc.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500"
                          onClick={() => handleApprove(doc.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleReject(doc.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                    {doc.status === "rejected" && (
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No documents found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Document Review</h1>

      <Card>
        <CardHeader>
          <CardTitle>AI Verification Summary</CardTitle>
          <CardDescription>AI-powered document verification results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 rounded-lg bg-muted/50">
              <div className="mr-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Verified Documents</div>
                <div className="text-2xl font-bold">{documents.filter((d) => d.aiVerified).length}</div>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-muted/50">
              <div className="mr-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Flagged Documents</div>
                <div className="text-2xl font-bold">{documents.filter((d) => !d.aiVerified).length}</div>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-muted/50">
              <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Pending Review</div>
                <div className="text-2xl font-bold">{pendingDocuments.length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pending">Pending Review ({pendingDocuments.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedDocuments.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderDocumentTable(pendingDocuments)}</TabsContent>

        <TabsContent value="approved">{renderDocumentTable(approvedDocuments)}</TabsContent>

        <TabsContent value="rejected">{renderDocumentTable(rejectedDocuments)}</TabsContent>
      </Tabs>
    </div>
  )
}

