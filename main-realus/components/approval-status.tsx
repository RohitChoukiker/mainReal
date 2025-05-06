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
      
      // Get user role from the URL path
      const path = window.location.pathname;
      let role = '';
      
      if (path.startsWith('/agent')) {
        role = 'Agent';
      } else if (path.startsWith('/broker')) {
        role = 'Broker';
      } else if (path.startsWith('/tc')) {
        role = 'Tc';
      }
      
      // Store user data in localStorage
      if (role) {
        const userData = {
          role: role,
          isApproved: true
        };
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } else if (isApproved === false) {
      setStatus("pending");
    }
  }, [isApproved]);
  
  // Separate useEffect for polling to avoid dependency cycle
  useEffect(() => {
    // Poll for status updates every 10 seconds if pending
    let interval: NodeJS.Timeout | undefined;
    
    if (status === "pending") {
      // Clear any existing interval first to prevent multiple intervals
      if (interval) clearInterval(interval);
      
      // Set new interval
      interval = setInterval(() => {
        // Use a function reference to avoid closure issues
        checkApprovalStatus();
      }, 10000);
    }

    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const checkApprovalStatus = async () => {
    try {
      console.log('Checking approval status...');
      const response = await fetch("/api/user/status");
      
      if (response.ok) {
        const data = await response.json();
        console.log('Approval status response:', data);
        
        // Store user data in localStorage for later use
        if (data.role) {
          const userData = {
            role: data.role,
            isApproved: data.isApproved
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Use a safe way to update state to avoid race conditions
        if (data.isApproved) {
          console.log('User is approved, updating status');
          // Use functional update to ensure we're working with the latest state
          setStatus(() => "approved");
        } else if (data.isRejected) {
          console.log('User is rejected');
          setStatus(() => "rejected");
        } else {
          console.log('User is still pending');
          // No need to update state if still pending
        }
      } else {
        console.error('Error response from status API:', response.status);
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
    }
  };

  // Function to determine the correct dashboard URL based on user role
  const getDashboardUrl = () => {
    // Get the role from localStorage or sessionStorage if available
    const userDataStr = localStorage.getItem('userData');
    let role = '';
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        role = userData.role;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Return the appropriate dashboard URL based on role
    switch (role) {
      case 'Agent':
        return '/agent/dashboard';
      case 'Broker':
        return '/broker/dashboard';
      case 'Tc':
        return '/tc/dashboard';
      default:
        // Default to agent dashboard if role can't be determined
        return '/agent/dashboard';
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
              <Button onClick={() => {
                const dashboardUrl = getDashboardUrl();
                console.log("Redirecting to dashboard:", dashboardUrl);
                router.push(dashboardUrl);
              }}>
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