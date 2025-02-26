"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialData = [
  { month: "Jan", earnings: 10000 },
  { month: "Feb", earnings: 12000 },
  { month: "Mar", earnings: 11000 },
  { month: "Apr", earnings: 13000 },
  { month: "May", earnings: 14000 },
  { month: "Jun", earnings: 12500 },
]

export function EarningsGrowth() {
  const [data, setData] = useState(initialData)

  const updateData = () => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        earnings: item.earnings + Math.floor(Math.random() * 2000) - 1000,
      })),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Growth</CardTitle>
        <CardDescription>Monthly earnings over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Bar dataKey="earnings" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
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

