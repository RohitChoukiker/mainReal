import type React from "react"

import { Inter } from "next/font/google"
import { Sidebar } from "@/components/broker/sidebar"
import { Header } from "@/components/broker/header"
import { DashboardProvider } from "@/components/broker/dashboard-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Broker Dashboard",
  description: "Real Estate Transaction System"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardProvider>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-6 py-8">{children}</div>
              </main>
            </div>
          </div>
        </DashboardProvider>
      </body>
    </html>
  )
}



