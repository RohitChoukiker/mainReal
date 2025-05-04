"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  appliedDate?: string
  approvedDate?: string
}

export default function AgentApprovals() {
  const [pendingAgents, setPendingAgents] = useState<Agent[]>([])
  const [approvedAgents, setApprovedAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      
      // First try to get the broker ID from localStorage
      const userData = localStorage.getItem('user')
      let brokerId = ''
      
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          brokerId = parsedData.brokerId
          console.log('Found broker ID in localStorage:', brokerId)
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e)
        }
      }
      
      // If we don't have a broker ID from localStorage, try to get all brokers
      // and use the first one for testing purposes
      if (!brokerId) {
        console.log('No broker ID found in localStorage, fetching all brokers')
        const brokersResponse = await fetch('/api/debug-broker')
        if (brokersResponse.ok) {
          const brokersData = await brokersResponse.json()
          if (brokersData.brokers && brokersData.brokers.length > 0) {
            brokerId = brokersData.brokers[0].brokerId
            console.log('Using first broker ID from list:', brokerId)
          }
        }
      }
      
      // If we have a broker ID, use the direct-agents endpoint
      let response
      if (brokerId) {
        console.log('Using direct-agents endpoint with broker ID:', brokerId)
        response = await fetch(`/api/direct-agents?brokerId=${brokerId}`)
      } else {
        // Fall back to the authenticated endpoint
        console.log('No broker ID found, using authenticated endpoint')
        response = await fetch('/api/agents/list')
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      
      const data = await response.json()
      console.log('Agents data:', data)
      
      // Ensure we have the correct data structure for pending agents
      const formattedPendingAgents = (data.pendingAgents || []).map(agent => ({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone || 'N/A',
        role: agent.role,
        status: 'pending',
        appliedDate: agent.appliedDate
      }))
      
      // Ensure we have the correct data structure for approved agents
      const formattedApprovedAgents = (data.approvedAgents || []).map(agent => ({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone || 'N/A',
        role: agent.role,
        status: 'active',
        approvedDate: agent.approvedDate
      }))
      
      setPendingAgents(formattedPendingAgents)
      setApprovedAgents(formattedApprovedAgents)
      
      console.log('Pending agents:', formattedPendingAgents)
      console.log('Approved agents:', formattedApprovedAgents)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast.error('Failed to load agents. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReject = async (agentId: string, approved: boolean) => {
    try {
      setProcessingId(agentId)
      console.log(`Attempting to ${approved ? 'approve' : 'reject'} agent with ID:`, agentId)
      
      // Use the direct approval endpoint which now supports both approve and reject
      const response = await fetch('/api/direct-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId, approved }),
      })
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        console.error('Error response:', data)
        throw new Error(data.message || 'Failed to update agent status')
      }
      
      // Update the local state
      if (approved) {
        // Move agent from pending to approved
        const agentToMove = pendingAgents.find(agent => agent.id === agentId)
        if (agentToMove) {
          setPendingAgents(pendingAgents.filter(agent => agent.id !== agentId))
          setApprovedAgents([...approvedAgents, {
            ...agentToMove,
            status: 'active',
            approvedDate: new Date().toISOString()
          }])
        }
        toast.success('Agent approved successfully')
      } else {
        // Remove agent from pending list
        setPendingAgents(pendingAgents.filter(agent => agent.id !== agentId))
        toast.success('Agent rejected successfully')
      }
      
      // Refresh the agent list to ensure we have the latest data
      setTimeout(() => {
        fetchAgents()
      }, 1000)
    } catch (error: any) {
      console.error('Error updating agent status:', error)
      toast.error(error.message || 'Failed to update agent status')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "active":
        return <Badge variant="success">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading agents...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Agent Approvals</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pending Approvals</CardTitle>
          <CardDescription>New agent registrations awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {pendingAgents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No pending agent approvals at this time.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{agent.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{agent.role}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(agent.appliedDate)}</TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {processingId === agent.id ? (
                            <Button variant="outline" size="icon" disabled>
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </Button>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-green-500"
                                onClick={() => handleApproveReject(agent.id, true)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => handleApproveReject(agent.id, false)}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Approved Agents</CardTitle>
          <CardDescription>Currently active agents in your brokerage</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {approvedAgents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No approved agents in your brokerage yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Approved</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{agent.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{agent.role}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(agent.approvedDate)}</TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

