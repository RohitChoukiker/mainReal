"use client"

import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AgentPerformanceWidget } from "@/components/dashboard/agent-performance-widget"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { LiveNotificationsPanel } from "@/components/dashboard/live-notifications-panel"
import { TransactionListTable } from "@/components/dashboard/transaction-list-table"
import { FileText, UserPlus, AlertCircle, CheckCircle } from "lucide-react"

export default function BrokerDashboard() {
  // Sample data for demonstration
  const agentPerformanceData = [
    {
      id: "1",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 24,
      completionRate: 95,
      avgTimeToClose: 18,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 18,
      completionRate: 92,
      avgTimeToClose: 21,
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 15,
      completionRate: 88,
      avgTimeToClose: 25,
    },
  ]

  const aiInsightsData = [
    {
      id: "1",
      type: "trend",
      content: "Transaction volume has increased by 15% compared to last month.",
    },
    {
      id: "2",
      type: "warning",
      content: "3 transactions are at high risk of delay due to missing documentation.",
    },
    {
      id: "3",
      type: "delay",
      content: "Average closing time has increased to 23 days, up from 19 days last quarter.",
    },
    {
      id: "4",
      type: "tip",
      content: "Consider reassigning Agent Brown's workload to improve completion rates.",
    },
  ]

  const quickActionsData = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      label: "Approve Agents",
      href: "/broker/agents",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: "View Transactions",
      href: "/broker/transactions",
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      label: "Handle Complaints",
      href: "/broker/complaints",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      label: "Review Closures",
      href: "/broker/closure-requests",
    },
  ]

  const notificationsData = [
    {
      id: "1",
      title: "New Agent Registration",
      message: "Emily Davis has registered as a new agent and is awaiting approval.",
      time: "10 min ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Transaction at Risk",
      message: "Transaction #TR-7829 is flagged as high risk due to delayed document submission.",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Closure Request",
      message: "Transaction #TR-6543 is ready for final review and closure approval.",
      time: "3 hours ago",
      read: true,
      type: "success",
    },
  ]

  const transactionsData = [
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      agent: "Sarah Johnson",
      status: "at_risk",
      dueDate: "Apr 15, 2025",
      riskLevel: "high",
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      agent: "John Smith",
      status: "in_progress",
      dueDate: "Apr 22, 2025",
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      agent: "Michael Brown",
      status: "pending",
      dueDate: "May 3, 2025",
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      agent: "John Smith",
      status: "completed",
      dueDate: "Apr 5, 2025",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Broker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TransactionOverviewCard title="Transactions" total={42} completed={18} pending={20} atRisk={4} />
        <LiveNotificationsPanel notifications={notificationsData} />
        <QuickActionsPanel actions={quickActionsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionListTable
            transactions={transactionsData}
            onViewDetails={(id) => console.log(`View details for transaction ${id}`)}
          />
        </div>
        <div className="space-y-6">
          <AgentPerformanceWidget agents={agentPerformanceData} />
          <AIInsightsCard insights={aiInsightsData} />
        </div>
      </div>
    </div>
  )
}

