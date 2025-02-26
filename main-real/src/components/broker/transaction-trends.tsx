"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialData = [
  { month: "Jan", approved: 65, rejected: 15 },
  { month: "Feb", approved: 70, rejected: 18 },
  { month: "Mar", approved: 75, rejected: 20 },
  { month: "Apr", approved: 72, rejected: 17 },
  { month: "May", approved: 78, rejected: 19 },
  { month: "Jun", approved: 80, rejected: 20 },
]

export function TransactionTrends() {
  const [data, setData] = useState(initialData)

  const updateData = () => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        approved: item.approved + Math.floor(Math.random() * 10) - 5,
        rejected: item.rejected + Math.floor(Math.random() * 5) - 2,
      })),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Trends</CardTitle>
        <CardDescription>Approved vs Rejected over 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Line type="monotone" dataKey="approved" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="rejected" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center">
          <button
            onClick={updateData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Update Data
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

