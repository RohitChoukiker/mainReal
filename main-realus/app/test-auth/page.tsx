"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import LogoutButton from "@/components/auth/logout-button";

export default function TestAuthPage() {
  const { isAuthenticated, user, role, isLoading } = useAuth();
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  if (!clientSide) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
            <span>Checking authentication...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            
            {isAuthenticated && user && (
              <>
                <div>
                  <span className="font-medium">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {user.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {role}
                </div>
                <div>
                  <span className="font-medium">Approved:</span> {user.isApproved ? 'Yes' : 'No'}
                </div>
                {user.brokerId && (
                  <div>
                    <span className="font-medium">Broker ID:</span> {user.brokerId}
                  </div>
                )}
              </>
            )}
            
            <div className="pt-4">
              {isAuthenticated ? (
                <LogoutButton variant="destructive" />
              ) : (
                <button 
                  onClick={() => window.location.href = '/landing'}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Test Links</h2>
        <div className="space-y-2">
          <div>
            <a href="/agent/dashboard" className="text-primary hover:underline">Agent Dashboard</a>
            <span className="text-gray-500 ml-2">(Requires Agent role)</span>
          </div>
          <div>
            <a href="/broker/dashboard" className="text-primary hover:underline">Broker Dashboard</a>
            <span className="text-gray-500 ml-2">(Requires Broker role)</span>
          </div>
          <div>
            <a href="/tc/dashboard" className="text-primary hover:underline">TC Dashboard</a>
            <span className="text-gray-500 ml-2">(Requires TC role)</span>
          </div>
          <div>
            <a href="/landing" className="text-primary hover:underline">Landing Page</a>
            <span className="text-gray-500 ml-2">(Public)</span>
          </div>
        </div>
      </div>
    </div>
  );
}