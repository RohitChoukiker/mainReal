"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, FileText, User, Home, Calendar, DollarSign, Tag, MessageSquare } from "lucide-react"

interface Transaction {
  _id: string
  transactionId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  propertyAddress: string
  city: string
  state: string
  zipCode: string
  transactionType: string
  price: number
  closingDate: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
}

export default function TransactionDetails() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/agent/transactions/${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transaction details')
        }

        setTransaction(data.transaction)
        
        // Fetch documents for this transaction
        if (data.transaction?.transactionId) {
          const docResponse = await fetch(`/api/agent/documents/list?transactionId=${data.transaction.transactionId}`)
          const docData = await docResponse.json()
          
          if (docResponse.ok) {
            setDocuments(docData.documents || [])
          }
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch transaction details')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTransaction()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p className="mt-2">{error || 'Transaction not found'}</p>
        <Button 
          className="mt-4" 
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{transaction.transactionId}</CardTitle>
                  <CardDescription className="mt-1">
                    Created on {formatDate(transaction.createdAt)}
                  </CardDescription>
                </div>
                <Badge className="text-sm py-1">
                  {transaction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  Property Information
                </h3>
                <Separator className="my-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-base">{transaction.propertyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base">{transaction.city}, {transaction.state} {transaction.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction Type</p>
                    <p className="text-base">{transaction.transactionType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-base">${transaction.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Closing Date</p>
                    <p className="text-base">{formatDate(transaction.closingDate)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Client Information
                </h3>
                <Separator className="my-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-base">{transaction.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{transaction.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base">{transaction.clientPhone}</p>
                  </div>
                </div>
              </div>

              {transaction.notes && (
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    Notes
                  </h3>
                  <Separator className="my-3" />
                  <p className="text-base whitespace-pre-wrap">{transaction.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <a href={`/agent/upload-documents?transactionId=${transaction.transactionId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Documents
                </a>
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Documents</CardTitle>
              <CardDescription>
                Documents for this transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <ul className="space-y-2">
                  {documents.map((doc, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.fileUrl ? (
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 dark:text-blue-400"
                          >
                            {doc.name}
                          </a>
                        ) : (
                          <span>{doc.name}</span>
                        )}
                      </div>
                      <Badge 
                        variant={
                          doc.status === "verified" ? "success" : 
                          doc.status === "rejected" ? "destructive" : 
                          doc.status === "verifying" ? "default" : 
                          "outline"
                        }
                      >
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No documents uploaded yet</p>
                  <p className="text-sm mt-1">Upload documents to complete this transaction</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <a href={`/agent/upload-documents?transactionId=${transaction.transactionId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Documents
                </a>
              </Button>
              {documents.length > 0 && (
                <Button variant="ghost" className="w-full" size="sm" asChild>
                  <a href={`/agent/upload-documents?transactionId=${transaction.transactionId}`}>
                    View All Documents
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}