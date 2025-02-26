"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const initialData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 17000 },
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 21000 },
]

export function PaymentsOverview() {
  const [data, setData] = useState(initialData)

  const updateData = () => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        revenue: item.revenue + Math.floor(Math.random() * 3000) - 1500,
      })),
    )
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = totalRevenue / data.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        <ResponsiveContainer width="100%" height={300}>
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
            <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
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

