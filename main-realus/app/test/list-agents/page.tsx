"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  brokerId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TestListAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/test/list-agents");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch agents");
      }
      
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (err: any) {
      console.error("Error fetching agents:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Test Agent List</CardTitle>
          <CardDescription>
            This is a test tool to view all agents and their approval status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              onClick={fetchAgents} 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh List"
              )}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading agents...</span>
            </div>
          ) : agents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No agents found.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Broker ID</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.role}</TableCell>
                      <TableCell>
                        {agent.isApproved ? (
                          <Badge variant="success">Approved</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>{agent.brokerId || 'N/A'}</TableCell>
                      <TableCell>{formatDate(agent.createdAt)}</TableCell>
                      <TableCell>{formatDate(agent.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}