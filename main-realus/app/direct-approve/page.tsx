"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function DirectApprovePage() {
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const approveAgent = async () => {
    if (!agentId) {
      setError("Please enter an agent ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await fetch("/api/direct-approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to approve agent");
      }
      
      setResult(data);
    } catch (err: any) {
      console.error("Error approving agent:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Direct Agent Approval</CardTitle>
          <CardDescription>
            This is a direct tool to approve an agent by ID without any authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agentId">Agent ID</Label>
            <Input
              id="agentId"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter the agent ID"
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={approveAgent} 
              disabled={loading || !agentId}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Agent"
              )}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-semibold">{result.message}</p>
              {result.agent && (
                <div className="mt-4">
                  <p className="font-semibold">Agent Details:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>ID: {result.agent.id}</li>
                    <li>Name: {result.agent.name}</li>
                    <li>Email: {result.agent.email}</li>
                    <li>Approved: {result.agent.isApproved ? "Yes" : "No"}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}