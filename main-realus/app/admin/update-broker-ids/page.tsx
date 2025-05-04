"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function UpdateBrokerIdsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const updateBrokerIds = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await fetch("/api/admin/update-broker-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update broker IDs");
      }
      
      setResult(data);
    } catch (err: any) {
      console.error("Error updating broker IDs:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Update Broker IDs</CardTitle>
          <CardDescription>
            This tool will generate broker IDs for all brokers who don't have one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button 
              onClick={updateBrokerIds} 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Broker IDs"
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
              {result.updatedBrokers && result.updatedBrokers.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Updated Brokers:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {result.updatedBrokers.map((broker: any) => (
                      <li key={broker.id}>
                        {broker.name} ({broker.email}): {broker.brokerId}
                      </li>
                    ))}
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