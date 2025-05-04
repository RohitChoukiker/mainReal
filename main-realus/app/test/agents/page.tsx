"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAgents() {
  const [brokerId, setBrokerId] = useState('')
  const [agents, setAgents] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    if (!brokerId) {
      setError('Please enter a broker ID')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/direct-agents?brokerId=${brokerId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch agents')
      }
      
      setAgents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Agent Listing</h1>
      
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Enter Broker ID"
          value={brokerId}
          onChange={(e) => setBrokerId(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={fetchAgents} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Agents'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {agents && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Agents</CardTitle>
              <CardDescription>
                Agents waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agents.pendingAgents.length === 0 ? (
                <p>No pending agents found</p>
              ) : (
                <ul className="space-y-2">
                  {agents.pendingAgents.map((agent: any) => (
                    <li key={agent.id} className="border p-3 rounded">
                      <div><strong>Name:</strong> {agent.name}</div>
                      <div><strong>Email:</strong> {agent.email}</div>
                      <div><strong>Role:</strong> {agent.role}</div>
                      <div><strong>Applied:</strong> {new Date(agent.appliedDate).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Approved Agents</CardTitle>
              <CardDescription>
                Agents already approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agents.approvedAgents.length === 0 ? (
                <p>No approved agents found</p>
              ) : (
                <ul className="space-y-2">
                  {agents.approvedAgents.map((agent: any) => (
                    <li key={agent.id} className="border p-3 rounded">
                      <div><strong>Name:</strong> {agent.name}</div>
                      <div><strong>Email:</strong> {agent.email}</div>
                      <div><strong>Role:</strong> {agent.role}</div>
                      <div><strong>Approved:</strong> {new Date(agent.approvedDate).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}