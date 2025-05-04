"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovalStatusProps {
  isApproved: boolean | undefined;
  onLogout: () => void;
}

export default function ApprovalStatus({ isApproved, onLogout }: ApprovalStatusProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const router = useRouter();

  useEffect(() => {
    console.log('ApprovalStatus component - isApproved:', isApproved);
    
    // Check approval status
    if (isApproved === true) {
      setStatus("approved");
    } else if (isApproved === false) {
      setStatus("pending");
    }

    // Poll for status updates every 10 seconds if pending
    let interval: NodeJS.Timeout;
    if (status === "pending") {
      interval = setInterval(checkApprovalStatus, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isApproved, status]);

  const checkApprovalStatus = async () => {
    try {
      console.log('Checking approval status...');
      const response = await fetch("/api/user/status");
      
      if (response.ok) {
        const data = await response.json();
        console.log('Approval status response:', data);
        
        if (data.isApproved) {
          console.log('User is approved, updating status and reloading');
          setStatus("approved");
          // Refresh the page to load the dashboard
          window.location.reload();
        } else if (data.isRejected) {
          console.log('User is rejected');
          setStatus("rejected");
        } else {
          console.log('User is still pending');
        }
      } else {
        console.error('Error response from status API:', response.status);
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Account Status</CardTitle>
          <CardDescription>
            {status === "pending" && "Your account is pending approval from your broker."}
            {status === "approved" && "Your account has been approved!"}
            {status === "rejected" && "Your account approval was rejected."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {status === "pending" && (
              <div className="flex flex-col items-center text-amber-500">
                <Clock className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Pending Approval</p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Your broker will review your account soon. You'll be notified once your account is approved.
                </p>
              </div>
            )}
            {status === "approved" && (
              <div className="flex flex-col items-center text-green-500">
                <CheckCircle className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Account Approved</p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Your account has been approved by your broker. You can now access all features.
                </p>
              </div>
            )}
            {status === "rejected" && (
              <div className="flex flex-col items-center text-red-500">
                <XCircle className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Account Rejected</p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Your broker has rejected your account application. Please contact your broker for more information.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            {status === "approved" && (
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            )}
            {status === "rejected" && (
              <Button variant="outline" onClick={() => router.push("/contact")}>
                Contact Support
              </Button>
            )}
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}