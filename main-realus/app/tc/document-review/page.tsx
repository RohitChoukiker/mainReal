"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, CheckCircle, XCircle, AlertTriangle, Eye, Download, MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ApiTransaction {
  transactionId: string;
  propertyAddress: string;
  city: string;
  state: string;
  clientName: string;
  agentId: string;
  status: string;
  createdAt: string;
  closingDate: string;
  price: number;
  documents?: Array<{
    name: string;
    url: string;
    uploadedAt: string;
    required: boolean;
    approved: boolean;
  }>;
}

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
  const [isLoading, setIsLoading] = useState(true)
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  // Fetch real transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('Fetching transactions from API...')
        setIsLoading(true)
        const response = await fetch('/api/tc/transactions')
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText)
          throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
        }
        
        let data
        try {
          data = await response.json()
          console.log('Fetched transactions:', data)
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError)
          throw new Error('Failed to parse API response')
        }
        
        if (data && data.transactions && Array.isArray(data.transactions)) {
          console.log(`Successfully loaded ${data.transactions.length} transactions`)
          setApiTransactions(data.transactions)
          
          // Generate documents from transactions
          const generatedDocs: Document[] = []
          
          // Process each transaction to extract documents
          data.transactions.forEach((transaction: ApiTransaction) => {
            // Format property address
            const property = transaction.propertyAddress ? 
              `${transaction.propertyAddress}${transaction.city ? `, ${transaction.city}` : ''}${transaction.state ? `, ${transaction.state}` : ''}` : 
              "Address not available"
            
            // If the transaction has documents, add them
            if (transaction.documents && transaction.documents.length > 0) {
              transaction.documents.forEach((doc, index) => {
                generatedDocs.push({
                  id: `doc-${transaction.transactionId}-${index}`,
                  name: doc.name || `Document ${index + 1}`,
                  transactionId: transaction.transactionId,
                  property,
                  agent: {
                    name: transaction.agentId || "Unknown Agent",
                    avatar: "/placeholder.svg?height=40&width=40",
                  },
                  uploadDate: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Unknown date",
                  status: doc.approved ? "approved" : "pending",
                  aiVerified: Math.random() > 0.3, // Random AI verification for demo
                  aiScore: Math.floor(Math.random() * 100), // Random AI score for demo
                })
              })
            } else {
              // If no documents, generate some random ones for demo purposes
              const docTypes = [
                "Purchase Agreement", 
                "Property Disclosure", 
                "Inspection Report", 
                "Title Report", 
                "Financing Pre-Approval", 
                "HOA Documents"
              ]
              
              // Generate 1-3 random documents per transaction
              const numDocs = Math.floor(Math.random() * 3) + 1
              for (let i = 0; i < numDocs; i++) {
                const docType = docTypes[Math.floor(Math.random() * docTypes.length)]
                const aiVerified = Math.random() > 0.3
                const aiScore = aiVerified ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 70)
                const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? "approved" : "rejected") : "pending"
                
                generatedDocs.push({
                  id: `doc-${transaction.transactionId}-${i}`,
                  name: docType,
                  transactionId: transaction.transactionId,
                  property,
                  agent: {
                    name: transaction.agentId || "Unknown Agent",
                    avatar: "/placeholder.svg?height=40&width=40",
                  },
                  uploadDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                  status: status as "pending" | "approved" | "rejected",
                  aiVerified,
                  aiScore,
                  issues: !aiVerified ? [
                    "Missing signature",
                    "Incomplete information",
                    "Outdated document"
                  ].slice(0, Math.floor(Math.random() * 3) + 1) : undefined
                })
              }
            }
          })
          
          setDocuments(generatedDocs)
        } else {
          console.warn('API returned no transactions or invalid format:', data)
          setApiTransactions([])
          // Set some demo documents if no transactions are found
          setDocuments([
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
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast.error('Failed to load transactions. Please try again later.')
        setApiTransactions([])
        // Set some demo documents if there's an error
        setDocuments([
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
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])

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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading documents...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : docs.length > 0 ? (
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading document statistics...</p>
            </div>
          ) : (
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
          )}
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

