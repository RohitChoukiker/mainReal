"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, Lock } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full">
            <Lock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please log in with the appropriate credentials.
          </p>
        </div>

        <div className="w-full max-w-xs mx-auto border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}