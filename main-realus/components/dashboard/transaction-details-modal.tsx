"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload, CheckCircle, AlertCircle, Clock, X } from "lucide-react"

interface Document {
  id: string
  name: string
  status: "pending" | "approved" | "rejected" | "missing"
  uploadedAt?: string
  url?: string
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: any | null
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction
}: TransactionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  
  // Use useEffect to log when the component renders or props change
  useEffect(() => {
    console.log("TransactionDetailsModal rendered with isOpen:", isOpen);
    console.log("Transaction data:", transaction);
  }, [isOpen, transaction]);

  // Format transaction status for display
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string, label: string }> = {
      "New": { variant: "outline", label: "New" },
      "InProgress": { variant: "secondary", label: "In Progress" },
      "PendingDocuments": { variant: "warning", label: "Pending Documents" },
      "UnderReview": { variant: "secondary", label: "Under Review" },
      "Approved": { variant: "success", label: "Approved" },
      "Closed": { variant: "success", label: "Closed" },
      "Cancelled": { variant: "destructive", label: "Cancelled" },
      // Map for the dashboard status values
      "pending": { variant: "outline", label: "Pending" },
      "in_progress": { variant: "secondary", label: "In Progress" },
      "completed": { variant: "success", label: "Completed" },
      "at_risk": { variant: "destructive", label: "At Risk" }
    }
    
    const statusInfo = statusMap[status] || { variant: "outline", label: status }
    
    return (
      <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
    )
  }

  // Empty documents array - will be populated from API in the future
  const documents: Document[] = []

  // Get document status icon
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "missing":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            ID: {transaction?.id || transaction?.transactionId || "N/A"}
          </DialogDescription>
        </DialogHeader>
          
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Transaction Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Property Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium">Address:</dt>
                        <dd>{transaction?.property || transaction?.propertyAddress || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">City:</dt>
                        <dd>{transaction?.city || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">State:</dt>
                        <dd>{transaction?.state || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Zip Code:</dt>
                        <dd>{transaction?.zipCode || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Price:</dt>
                        <dd>${transaction?.price?.toLocaleString() || "N/A"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium">Name:</dt>
                        <dd>{transaction?.client || transaction?.clientName || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Email:</dt>
                        <dd>{transaction?.clientEmail || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Phone:</dt>
                        <dd>{transaction?.clientPhone || "N/A"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-medium">Transaction Type:</dt>
                      <dd>{transaction?.transactionType || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Status:</dt>
                      <dd>{transaction?.status ? getStatusBadge(transaction.status) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Agent:</dt>
                      <dd>{transaction?.agentName || transaction?.agent || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Due Date:</dt>
                      <dd>{transaction?.dueDate || transaction?.closingDate || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Created:</dt>
                      <dd>{transaction?.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "N/A"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              {transaction?.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{transaction.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transaction Documents</CardTitle>
                  <CardDescription>
                    View and manage documents for this transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                    
                    <div className="border rounded-md divide-y">
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <div key={doc.id} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.uploadedAt 
                                    ? `Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()}`
                                    : "Not uploaded yet"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {getDocumentStatusIcon(doc.status)}
                                <span className="text-xs capitalize">{doc.status}</span>
                              </div>
                              {doc.url && (
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No documents available for this transaction</p>
                          <p className="text-xs mt-1">Upload documents using the button above</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
      </DialogContent>
    </Dialog>
  )
}