import React, { ReactNode } from "react";
import { Inter } from "next/font/google";
import {Sidebar} from "@/components/agent/AgentSider";
import AgentHeader from "@/components/agent/AgentHeader";
import AgentFooter from "@/components/agent/AgentFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Agent Dashboard",
  description: "Real Estate Transaction System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Agent Dashboard</title>
        <meta name="description" content="Real Estate Transaction System" />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
         
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AgentHeader />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">{children}</div>
            </main>

            <AgentFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
