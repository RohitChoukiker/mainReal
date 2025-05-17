"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function NewTransaction() {
  const [transactionId, setTransactionId] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    transactionType: "",
    propertyAddress: "",
    city: "",
    country: "India", // Default country set to India
    state: "",
    zipCode: "",
    price: "",
    closingDate: "",
    notes: ""
  })

  // Country and state data
  const countries = [
    { value: "India", label: "India" },
    { value: "USA", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" }
  ]

  const statesByCountry = {
    India: [
      { value: "AP", label: "Andhra Pradesh" },
      { value: "AR", label: "Arunachal Pradesh" },
      { value: "AS", label: "Assam" },
      { value: "BR", label: "Bihar" },
      { value: "CG", label: "Chhattisgarh" },
      { value: "GA", label: "Goa" },
      { value: "GJ", label: "Gujarat" },
      { value: "HR", label: "Haryana" },
      { value: "HP", label: "Himachal Pradesh" },
      { value: "JH", label: "Jharkhand" },
      { value: "KA", label: "Karnataka" },
      { value: "KL", label: "Kerala" },
      { value: "MP", label: "Madhya Pradesh" },
      { value: "MH", label: "Maharashtra" },
      { value: "MN", label: "Manipur" },
      { value: "ML", label: "Meghalaya" },
      { value: "MZ", label: "Mizoram" },
      { value: "NL", label: "Nagaland" },
      { value: "OD", label: "Odisha" },
      { value: "PB", label: "Punjab" },
      { value: "RJ", label: "Rajasthan" },
      { value: "SK", label: "Sikkim" },
      { value: "TN", label: "Tamil Nadu" },
      { value: "TG", label: "Telangana" },
      { value: "TR", label: "Tripura" },
      { value: "UP", label: "Uttar Pradesh" },
      { value: "UK", label: "Uttarakhand" },
      { value: "WB", label: "West Bengal" },
      { value: "AN", label: "Andaman and Nicobar Islands" },
      { value: "CH", label: "Chandigarh" },
      { value: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
      { value: "DL", label: "Delhi" },
      { value: "JK", label: "Jammu and Kashmir" },
      { value: "LA", label: "Ladakh" },
      { value: "LD", label: "Lakshadweep" },
      { value: "PY", label: "Puducherry" }
    ],
    USA: [
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PA", label: "Pennsylvania" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" }
    ],
    UK: [
      { value: "EN", label: "England" },
      { value: "SC", label: "Scotland" },
      { value: "WA", label: "Wales" },
      { value: "NI", label: "Northern Ireland" }
    ],
    Canada: [
      { value: "AB", label: "Alberta" },
      { value: "BC", label: "British Columbia" },
      { value: "MB", label: "Manitoba" },
      { value: "NB", label: "New Brunswick" },
      { value: "NL", label: "Newfoundland and Labrador" },
      { value: "NS", label: "Nova Scotia" },
      { value: "ON", label: "Ontario" },
      { value: "PE", label: "Prince Edward Island" },
      { value: "QC", label: "Quebec" },
      { value: "SK", label: "Saskatchewan" },
      { value: "NT", label: "Northwest Territories" },
      { value: "NU", label: "Nunavut" },
      { value: "YT", label: "Yukon" }
    ],
    Australia: [
      { value: "ACT", label: "Australian Capital Territory" },
      { value: "NSW", label: "New South Wales" },
      { value: "NT", label: "Northern Territory" },
      { value: "QLD", label: "Queensland" },
      { value: "SA", label: "South Australia" },
      { value: "TAS", label: "Tasmania" },
      { value: "VIC", label: "Victoria" },
      { value: "WA", label: "Western Australia" }
    ]
  }

  // Get available states based on selected country
  const [availableStates, setAvailableStates] = useState(statesByCountry.India)

  // Update available states when country changes
  useEffect(() => {
    if (formData.country && statesByCountry[formData.country]) {
      setAvailableStates(statesByCountry[formData.country])
      // Reset state when country changes
      setFormData(prev => ({ ...prev, state: "" }))
    }
  }, [formData.country])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id.replace('client-', '')]: value
    }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.transactionType) {
        toast.error('Please select a transaction type');
        setIsLoading(false);
        return;
      }

      if (!formData.propertyAddress || !formData.city || !formData.country || !formData.state || !formData.zipCode) {
        toast.error('Please complete all property address fields');
        setIsLoading(false);
        return;
      }

      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
        toast.error('Please complete all client information fields');
        setIsLoading(false);
        return;
      }

      if (!formData.price) {
        toast.error('Please enter a valid price');
        setIsLoading(false);
        return;
      }

      if (!formData.closingDate) {
        toast.error('Please select a closing date');
        setIsLoading(false);
        return;
      }

      // Prepare data for API
      const apiData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        transactionType: formData.transactionType,
        propertyAddress: formData.propertyAddress,
        city: formData.city,
        country: formData.country,
        state: formData.state,
        zipCode: formData.zipCode,
        price: parseFloat(formData.price),
        closingDate: formData.closingDate,
        notes: formData.notes
      }

      console.log('Submitting transaction data:', apiData);

      // Call API to create transaction
      toast.info('Creating transaction...');
      
      const response = await fetch('/api/agent/transactions/add-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      console.log('API response status:', response.status);
      
      const data = await response.json()
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transaction')
      }

      // Set transaction ID from response
      setTransactionId(data.transaction.transactionId)
      setIsSubmitted(true)
      toast.success('Transaction created successfully!')
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create transaction')
    } finally {
      setIsLoading(false)
    }
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
                <a href={`/agent/upload-documents?transactionId=${transactionId}`}>Upload Documents</a>
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
                  <Select 
                    required
                    onValueChange={(value) => handleSelectChange(value, 'transactionType')}
                    value={formData.transactionType}
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Lease">Lease</SelectItem>
                      <SelectItem value="Refinance">Refinance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input 
                    id="propertyAddress" 
                    placeholder="Enter full property address" 
                    required 
                    value={formData.propertyAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    required 
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      required
                      onValueChange={(value) => handleSelectChange(value, 'country')}
                      value={formData.country}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      required
                      onValueChange={(value) => handleSelectChange(value, 'state')}
                      value={formData.state}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode" 
                      required 
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="$" 
                      required 
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingDate">Estimated Closing Date</Label>
                  <Input 
                    id="closingDate" 
                    type="date" 
                    required 
                    value={formData.closingDate}
                    onChange={handleChange}
                  />
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
                    <Input 
                      id="client-name" 
                      required 
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <Input 
                        id="client-email" 
                        type="email" 
                        required 
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Phone</Label>
                      <Input 
                        id="client-phone" 
                        type="tel" 
                        required 
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special requirements or notes about the client" 
                      value={formData.notes}
                      onChange={handleChange}
                    />
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
            <Button variant="outline" type="button" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Transaction'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

