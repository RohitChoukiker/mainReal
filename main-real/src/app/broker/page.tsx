"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertCircle, DollarSign, TrendingUp } from "lucide-react"
import { TransactionTrends } from "@/components/broker/transaction-trends"
import { EarningsGrowth } from "@/components/broker/earnings-growth"
import { AgentPerformance } from "@/components/broker/agent-performance"
import { useDashboard } from "@/components/broker/dashboard-provider"

export default function Dashboard() {
  const { addNotification } = useDashboard()
  const [stats, setStats] = useState({
    totalTransactions: 125,
    pendingApprovals: 8,
    complaintsCount: 3,
    totalRevenue: 150000,
    monthlyEarnings: 12500,
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
        pendingApprovals: Math.max(0, prev.pendingApprovals + Math.floor(Math.random() * 3) - 1),
        complaintsCount: Math.max(0, prev.complaintsCount + Math.floor(Math.random() * 2) - 1),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
        monthlyEarnings: prev.monthlyEarnings + Math.floor(Math.random() * 100),
      }))
    }, 1000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (action: string) => {
    addNotification({
      id: Date.now(),
      message: `Quick action: ${action}`,
      time: "Just now",
      read: false,
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">-2 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints Count</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complaintsCount}</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Transaction Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionTrends />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Earnings Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <EarningsGrowth />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentPerformance />
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4">
        <Button onClick={() => handleQuickAction("Approve Agents")}>
          <Users className="mr-2 h-4 w-4" /> Approve Agents
        </Button>
        <Button onClick={() => handleQuickAction("View Transactions")}>
          <FileText className="mr-2 h-4 w-4" /> View Transactions
        </Button>
        <Button onClick={() => handleQuickAction("Handle Complaints")}>
          <AlertCircle className="mr-2 h-4 w-4" /> Handle Complaints
        </Button>
      </div>
    </div>
  )
}

