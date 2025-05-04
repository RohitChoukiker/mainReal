"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function BrokerIdCard() {
  const [brokerId, setBrokerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokerInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/broker/info");
        
        if (!response.ok) {
          throw new Error("Failed to fetch broker information");
        }
        
        const data = await response.json();
        setBrokerId(data.brokerId);
      } catch (error) {
        console.error("Error fetching broker info:", error);
        toast.error("Failed to load broker information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrokerInfo();
  }, []);

  const copyToClipboard = () => {
    if (brokerId) {
      navigator.clipboard.writeText(brokerId);
      toast.success("Broker ID copied to clipboard");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Broker ID</CardTitle>
        <CardDescription>
          Share this ID with agents and transaction coordinators to join your brokerage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : brokerId ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <code className="font-mono text-lg">{brokerId}</code>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is your unique broker identifier. Agents and transaction coordinators will need this ID to register under your brokerage.
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-red-500">
            <p>No Broker ID found. Please contact support.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}