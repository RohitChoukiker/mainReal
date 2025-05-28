"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertTriangle, X, Clock, RefreshCw, Loader2, AlertCircle, Eye, Download } from "lucide-react"
import { DocumentViewer } from "@/components/document-viewer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  fileUrl?: string
  fileName?: string
}

interface Transaction {
  _id: string
  transactionId: string
  clientName: string
  propertyAddress: string
  city: string
  state: string
  zipCode: string
}

export default function UploadDocuments() {
  const searchParams = useSearchParams()
  const transactionIdParam = searchParams.get("transactionId")
  
  const [selectedTransaction, setSelectedTransaction] = useState<string>(transactionIdParam || "")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  const [documents, setDocuments] = useState<Document[]>([])
  
  // Document viewer state
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<{url: string; name: string; fileName?: string} | null>(null)
  
  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/agent/transactions/list')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transactions')
        }
        
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch transactions')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])
  
  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const url = selectedTransaction 
          ? `/api/agent/documents/list?transactionId=${selectedTransaction}`
          : '/api/agent/documents/list'
          
        const response = await fetch(url)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch documents')
        }
        
        // Add property field to each document
        const docsWithProperty = data.documents.map((doc: any) => {
          const transaction = transactions.find(t => t.transactionId === doc.transactionId)
          return {
            ...doc,
            property: transaction ? `${transaction.propertyAddress}, ${transaction.city}` : 'Unknown property'
          }
        })
        
        setDocuments(docsWithProperty || [])
      } catch (error) {
        console.error('Error fetching documents:', error)
        // Don't show error for documents, just log it
      }
    }
    
    if (!isLoading && transactions.length > 0) {
      fetchDocuments()
    }
  }, [isLoading, transactions, selectedTransaction])

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

  // Handle document viewing
  const handleViewDocument = (doc: Document) => {
    console.log(`Viewing document: ${doc.name} (${doc.id})`);
    
    if (doc.fileUrl) {
      console.log('Opening document in viewer:', doc.fileUrl);
      
      // Open the document in our document viewer
      setCurrentDocument({
        url: doc.fileUrl,
        name: doc.name,
        fileName: doc.fileName
      });
      setViewerOpen(true);
    } else {
      alert("Document URL not available");
    }
  }
  
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
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      
      // Check file size (limit to 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the 10MB limit")
        return
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        setError("File type not supported. Please upload PDF, DOCX, JPG, or PNG files.")
        return
      }
      
      setSelectedFile(file)
      setFileName(file.name)
      setError(null) // Clear any previous errors
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      
      // Check file size (limit to 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the 10MB limit")
        return
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        setError("File type not supported. Please upload PDF, DOCX, JPG, or PNG files.")
        return
      }
      
      setSelectedFile(file)
      setFileName(file.name)
      setError(null) // Clear any previous errors
    }
  }
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }
    
    if (!documentType) {
      setError("Please select a document type")
      return
    }
    
    if (!selectedTransaction) {
      setError("Please select a transaction")
      return
    }
    
    try {
      setIsUploading(true)
      setError(null)
      
      // Create form data for the file upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("documentType", documentType)
      formData.append("transactionId", selectedTransaction)
      
      // Upload the file to the server
      console.log("Uploading file:", selectedFile.name);
      console.log("Transaction ID:", selectedTransaction);
      console.log("Document Type:", documentType);
      
      const response = await fetch("/api/agent/documents/upload", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error("Upload error response:", data);
        throw new Error(data.message || data.error || "Failed to upload document")
      }
      
      console.log("Upload successful:", data);
      
      // Add the new document to the list with property information
      const transaction = transactions.find(t => t.transactionId === selectedTransaction)
      const property = transaction ? `${transaction.propertyAddress}, ${transaction.city}` : "Unknown property"
      
      const newDocument: Document = {
        ...data.document,
        property,
      }
      
      setDocuments([newDocument, ...documents])
      
      // Reset form
      setSelectedFile(null)
      setFileName("")
      setDocumentType("")
      setUploadSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error("Error uploading document:", error)
      setError(error instanceof Error ? error.message : "Failed to upload document")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {uploadSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription>Document uploaded successfully!</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Transaction</CardTitle>
              <CardDescription>Choose a transaction to upload documents for</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading transactions...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction">Transaction</Label>
                    <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                      <SelectTrigger id="transaction">
                        <SelectValue placeholder="Select a transaction" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactions.map((transaction) => (
                          <SelectItem key={transaction._id} value={transaction.transactionId}>
                            {transaction.transactionId} - {transaction.propertyAddress}, {transaction.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
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
                  <h3 className="text-lg font-medium mb-1">
                    {fileName ? `Selected: ${fileName}` : "Drag files here or click to browse"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Support for PDF, DOCX, JPG, PNG (max 10MB)</p>
                  <Button>Select File</Button>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Document Type</div>
                <Select value={documentType} onValueChange={setDocumentType}>
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
              
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !documentType || !selectedTransaction}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                {selectedTransaction 
                  ? `Documents for transaction ${selectedTransaction}` 
                  : "Documents you have uploaded for your transactions"}
              </CardDescription>
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
                      documents
                        .filter(doc => !selectedTransaction || doc.transactionId === selectedTransaction)
                        .map((doc) => (
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
                                  <div className="text-xs text-muted-foreground hidden md:block">
                                    {doc.property}
                                    {doc.fileName && <span className="ml-1">({doc.fileName})</span>}
                                  </div>
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
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {doc.fileUrl && (
                                  <>
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
                                  </>
                                )}
                                <span className="ml-2">{doc.fileSize}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No documents uploaded yet
                        </TableCell>
                      </TableRow>
                    )}
                    {documents.length > 0 && 
                     documents.filter(doc => !selectedTransaction || doc.transactionId === selectedTransaction).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No documents for this transaction
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
              <CardDescription>
                {selectedTransaction 
                  ? `Documents needed for transaction ${selectedTransaction}` 
                  : "Documents needed for transaction completion"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedTransaction ? (
                <div className="text-center py-4 text-muted-foreground">
                  Please select a transaction to see required documents
                </div>
              ) : (
                <div className="space-y-2">
                  {requiredDocuments.map((doc, index) => {
                    const uploaded = documents.find((d) => d.name === doc && d.transactionId === selectedTransaction)
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
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
  );
}

