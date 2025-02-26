"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentsOverview } from "@/components/broker/payments-overview"

const initialPayouts = [
  { id: 1, agent: "John Doe", amount: 5000, status: "Pending" },
  { id: 2, agent: "Sarah Lee", amount: 3000, status: "Approved" },
  { id: 3, agent: "Mike Johnson", amount: 4500, status: "Pending" },
  { id: 4, agent: "Emily Brown", amount: 3500, status: "Rejected" },
  { id: 5, agent: "David Wilson", amount: 4000, status: "Approved" },
]

export default function PaymentsPage() {
  const [payouts, setPayouts] = useState(initialPayouts)

  const handleAction = (id: number, action: "approve" | "reject") => {
    setPayouts(
      payouts.map((payout) =>
        payout.id === id ? { ...payout, status: action === "approve" ? "Approved" : "Rejected" } : payout,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payments</h1>
      <PaymentsOverview />
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <PayoutTable payouts={payouts.filter((p) => p.status === "Pending")} onAction={handleAction} />
            </TabsContent>
            <TabsContent value="approved">
              <PayoutTable payouts={payouts.filter((p) => p.status === "Approved")} onAction={handleAction} />
            </TabsContent>
            <TabsContent value="rejected">
              <PayoutTable payouts={payouts.filter((p) => p.status === "Rejected")} onAction={handleAction} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PayoutTable({
  payouts,
  onAction,
}: { payouts: typeof initialPayouts; onAction: (id: number, action: "approve" | "reject") => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>{payout.agent}</TableCell>
            <TableCell>${payout.amount}</TableCell>
            <TableCell>{payout.status}</TableCell>
            <TableCell>
              {payout.status === "Pending" && (
                <>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => onAction(payout.id, "approve")}>
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onAction(payout.id, "reject")}>
                    Reject
                  </Button>
                </>
              )}
              {payout.status !== "Pending" && (
                <Button variant="outline" size="sm">
                  View
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

