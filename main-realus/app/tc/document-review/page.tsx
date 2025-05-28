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
import { DocumentViewer } from "@/components/document-viewer"

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
  _id?: string // MongoDB _id as a backup
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
  fileUrl?: string // URL to the document file
  fileName?: string // Original file name
}

export default function DocumentReview() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  
  // Document viewer state
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<{url: string; name: string; fileName?: string} | null>(null)

  // Fetch transactions and documents from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for document review...')
        setIsLoading(true)
        
        // Fetch transactions
        console.log('Fetching transactions from API...')
        const transactionsResponse = await fetch('/api/tc/transactions')
        
        if (!transactionsResponse.ok) {
          console.error('Transactions API response not OK:', transactionsResponse.status, transactionsResponse.statusText)
          throw new Error(`Failed to fetch transactions: ${transactionsResponse.status} ${transactionsResponse.statusText}`)
        }
        
        let transactionsData
        try {
          transactionsData = await transactionsResponse.json()
          console.log('Fetched transactions:', transactionsData)
        } catch (parseError) {
          console.error('Error parsing transactions JSON response:', parseError)
          throw new Error('Failed to parse transactions API response')
        }
        
        if (transactionsData && transactionsData.transactions && Array.isArray(transactionsData.transactions)) {
          console.log(`Successfully loaded ${transactionsData.transactions.length} transactions`)
          setApiTransactions(transactionsData.transactions)
        }
        
        // Fetch agents
        console.log('Fetching agents from API...')
        let agentsData = null;
        try {
          const agentsResponse = await fetch('/api/tc/agents')
          
          if (!agentsResponse.ok) {
            console.error('Agents API response not OK:', agentsResponse.status, agentsResponse.statusText)
            throw new Error(`Failed to fetch agents: ${agentsResponse.status} ${agentsResponse.statusText}`)
          }
          
          try {
            agentsData = await agentsResponse.json()
            console.log('Fetched agents:', agentsData)
          } catch (parseError) {
            console.error('Error parsing agents JSON response:', parseError)
            throw new Error('Failed to parse agents API response')
          }
        } catch (fetchError) {
          console.error('Error fetching agents:', fetchError)
          // Continue with the rest of the function
        }
        
        // Create a map of agents for quick lookup
        const agentMap = new Map<string, any>();
        if (agentsData && agentsData.agents && Array.isArray(agentsData.agents)) {
          agentsData.agents.forEach((agent: any) => {
            agentMap.set(agent.id, agent);
          });
        }
        
        // Fetch documents
        console.log('Fetching documents from API...')
        let documentsData = null;
        try {
          const documentsResponse = await fetch('/api/tc/documents/list')
          
          if (!documentsResponse.ok) {
            console.error('Documents API response not OK:', documentsResponse.status, documentsResponse.statusText)
            const errorText = await documentsResponse.text();
            console.error('Error response body:', errorText);
            throw new Error(`Failed to fetch documents: ${documentsResponse.status} ${documentsResponse.statusText}`)
          }
          
          try {
            documentsData = await documentsResponse.json()
            console.log('Fetched documents:', documentsData)
          } catch (parseError) {
            console.error('Error parsing documents JSON response:', parseError)
            throw new Error('Failed to parse documents API response')
          }
        } catch (fetchError) {
          console.error('Error fetching documents:', fetchError)
          toast.error('Failed to load documents. Please try again later.')
          // Continue with the rest of the function, we'll use demo data
        }
        
        if (documentsData && documentsData.documents && Array.isArray(documentsData.documents)) {
          console.log(`Successfully loaded ${documentsData.documents.length} documents`)
          
          // Create a map of transactions for quick lookup
          const transactionMap = new Map<string, ApiTransaction>();
          if (transactionsData && transactionsData.transactions) {
            transactionsData.transactions.forEach((transaction: ApiTransaction) => {
              transactionMap.set(transaction.transactionId, transaction);
            });
          }
          
          // Process documents and add property information
          const processedDocs: Document[] = documentsData.documents.map((doc: any) => {
            console.log("Processing document:", doc);
            
            // Find the associated transaction
            const transaction = transactionMap.get(doc.transactionId);
            console.log("Found transaction:", transaction);
            
            // Find the associated agent from the agents API (as a backup)
            const agent = agentMap.get(doc.agentId);
            console.log("Found agent:", agent);
            
            // Format property address
            const property = transaction ? 
              `${transaction.propertyAddress}${transaction.city ? `, ${transaction.city}` : ''}${transaction.state ? `, ${transaction.state}` : ''}` : 
              "Address not available";
            
            // Default status to pending if not provided
            const status = doc.status === "verifying" ? "pending" : (doc.status || "pending");
            
            // Log the document ID for debugging
            console.log(`Using document ID: ${doc.id}`);
            
            // Use the agent name directly from the document data
            console.log("Agent name from document:", doc.agentName);
            const agentName = doc.agentName || (agent ? agent.name : "Unknown Agent");
            
            // Log the fileUrl for debugging
            console.log(`Document ${doc.id} fileUrl:`, doc.fileUrl);
            
            const processedDoc = {
              id: doc.id, // This is the documentId from the database
              _id: doc._id, // This is the MongoDB _id (backup)
              name: doc.name,
              transactionId: doc.transactionId,
              property,
              agent: {
                name: agentName,
                avatar: "/placeholder.svg?height=40&width=40",
              },
              uploadDate: doc.uploadDate,
              status: status as "pending" | "approved" | "rejected",
              aiVerified: doc.aiVerified || false,
              aiScore: doc.aiScore || 80,
              issues: doc.issues || [],
              fileUrl: doc.fileUrl, // URL to the document file
              fileName: doc.fileName // Original file name
            };
            
            // Log the processed document for debugging
            console.log(`Processed document ${processedDoc.id}:`, {
              ...processedDoc,
              fileUrl: processedDoc.fileUrl,
              fileName: processedDoc.fileName
            });
            
            return processedDoc;
          });
          
          setDocuments(processedDocs);
        } else {
          console.warn('API returned no documents or invalid format:', documentsData)
          // Set some demo documents if no documents are found
          setDocuments([
            {
              id: "doc-1",
              name: "Purchase Agreement",
              transactionId: "TR-7829",
              property: "123 Main St, Austin, TX",
              agent: {
                name: "John Developer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              uploadDate: "Apr 12, 2025",
              status: "pending",
              aiVerified: true,
              aiScore: 95,
              fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
              fileName: "purchase-agreement.pdf"
            },
            {
              id: "doc-2",
              name: "Property Disclosure",
              transactionId: "TR-7829",
              property: "123 Main St, Austin, TX",
              agent: {
                name: "John Developer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              uploadDate: "Apr 12, 2025",
              status: "pending",
              aiVerified: true,
              aiScore: 98,
              fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
              fileName: "property-disclosure.pdf"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load documents. Please try again later.')
        setApiTransactions([])
        // Set some demo documents if there's an error
        setDocuments([
          {
            id: "doc-1",
            name: "Purchase Agreement",
            transactionId: "TR-7829",
            property: "123 Main St, Austin, TX",
            agent: {
              name: "John Developer",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            uploadDate: "Apr 12, 2025",
            status: "pending",
            aiVerified: true,
            aiScore: 95,
            fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
            fileName: "purchase-agreement.pdf"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const pendingDocuments = documents.filter((doc) => doc.status === "pending")
  const approvedDocuments = documents.filter((doc) => doc.status === "approved")
  const rejectedDocuments = documents.filter((doc) => doc.status === "rejected")

  const handleApprove = async (docId: string) => {
    try {
      console.log(`Approving document with ID: ${docId}`);
      
      // Find the document in our state
      const docToUpdate = documents.find(doc => doc.id === docId);
      if (!docToUpdate) {
        console.error(`Document with ID ${docId} not found in state`);
        toast.error('Document not found');
        return;
      }
      
      // Update UI optimistically
      setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "approved" } : doc)))
      
      // Send update to server
      const response = await fetch('/api/tc/documents/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: docId,
          status: 'approved',
          _id: docToUpdate._id // Include MongoDB _id as a backup
        }),
      });
      
      const responseData = await response.json();
      console.log('Document approval response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to approve document');
      }
      
      toast.success('Document approved successfully');
      
      // Refresh the documents list after successful update
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document. Please try again.');
      
      // Revert UI change on error
      setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "pending" } : doc)))
    }
  }

  const handleReject = async (docId: string) => {
    try {
      console.log(`Rejecting document with ID: ${docId}`);
      
      // Find the document in our state
      const docToUpdate = documents.find(doc => doc.id === docId);
      if (!docToUpdate) {
        console.error(`Document with ID ${docId} not found in state`);
        toast.error('Document not found');
        return;
      }
      
      // Update UI optimistically
      setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "rejected" } : doc)))
      
      // Send update to server
      const response = await fetch('/api/tc/documents/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: docId,
          status: 'rejected',
          comments: 'Document rejected by TC. Please resubmit with corrections.',
          _id: docToUpdate._id // Include MongoDB _id as a backup
        }),
      });
      
      const responseData = await response.json();
      console.log('Document rejection response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to reject document');
      }
      
      toast.success('Document rejected successfully');
      
      // Refresh the documents list after successful update
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document. Please try again.');
      
      // Revert UI change on error
      setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, status: "pending" } : doc)))
    }
  }
  
  // Handler for viewing a document
  const handleViewDocument = async (doc: Document) => {
    console.log(`Viewing document: ${doc.name} (${doc.id})`);
    
    try {
      // Show loading toast
      toast.loading('Loading document...');
      
      // If the document already has a fileUrl, use it directly with our document viewer
      if (doc.fileUrl) {
        console.log('Opening document in viewer:', doc.fileUrl);
        
        // Dismiss loading toast
        toast.dismiss();
        
        // Open the document in our document viewer
        setCurrentDocument({
          url: doc.fileUrl,
          name: doc.name,
          fileName: doc.fileName
        });
        setViewerOpen(true);
        
        return;
      }
      
      // Otherwise, fetch the document URL from the API
      const response = await fetch(`/api/tc/documents/view?documentId=${doc.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to view document');
      }
      
      const data = await response.json();
      console.log('Document view response:', data);
      
      if (!data.viewUrl) {
        throw new Error('Document URL not available');
      }
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Open the document in our document viewer
      setCurrentDocument({
        url: data.viewUrl,
        name: data.documentName || doc.name,
        fileName: data.fileName || doc.fileName
      });
      setViewerOpen(true);
      
      console.log('Opening document in viewer:', data.viewUrl);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to view document. Please try again.');
      toast.dismiss();
    }
  }
  
  // Handler for downloading a document
  const handleDownloadDocument = async (doc: Document) => {
    console.log(`Downloading document: ${doc.name} (${doc.id})`);
    
    try {
      // Show loading toast
      toast.loading('Preparing download...');
      
      // If the document already has a fileUrl, use it directly
      if (doc.fileUrl) {
        console.log('Using direct fileUrl for download:', doc.fileUrl);
        
        // Dismiss loading toast
        toast.dismiss();
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.fileName || `${doc.name}.pdf`; // Use fileName if available, otherwise create a name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Document download started');
        return;
      }
      
      // Otherwise, fetch the document URL from the API
      const response = await fetch(`/api/tc/documents/download?documentId=${doc.id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download document');
      }
      
      const data = await response.json();
      console.log('Document download response:', data);
      
      if (!data.downloadUrl) {
        throw new Error('Document URL not available');
      }
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = doc.fileName || `${doc.name}.pdf`; // Use fileName if available, otherwise create a name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Document download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document. Please try again.');
    }
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
                      <div className="font-medium">
                        <a 
                          href={doc.fileUrl || "#"} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600 dark:text-blue-400"
                          onClick={(e) => {
                            if (!doc.fileUrl) {
                              e.preventDefault();
                              alert("Document URL not available");
                            }
                          }}
                        >
                          {doc.name}
                        </a>
                      </div>
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
                    {/* Direct link for viewing document */}
                    <a 
                      href={doc.fileUrl || "#"} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => {
                        if (!doc.fileUrl) {
                          e.preventDefault();
                          alert("Document URL not available");
                        }
                      }}
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View document</span>
                    </a>
                    
                    {/* Direct link for downloading document */}
                    <a 
                      href={doc.fileUrl || "#"} 
                      download={doc.fileName || `${doc.name}.pdf`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => {
                        if (!doc.fileUrl) {
                          e.preventDefault();
                          alert("Document URL not available");
                        }
                      }}
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </a>
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
      
      {/* Document Viewer */}
      {currentDocument && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          documentUrl={currentDocument.url}
          documentName={currentDocument.name}
          fileName={currentDocument.fileName}
        />
      )}
    </div>
  )
}

