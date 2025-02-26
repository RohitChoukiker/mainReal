"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentPerformance } from "@/components/broker/agent-performance"
import { TransactionSuccess } from "@/components/broker/transaction-success"
import { FinancialSummary } from "@/components/broker/financial-summary"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const handleExport = () => {
    // Simulated export functionality
    alert("Exporting report...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export Report</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentPerformance />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Success</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionSuccess />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialSummary period={selectedPeriod} />
        </CardContent>
      </Card>
    </div>
  )
}

