"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const initialData = [
  { name: "John", deals: 25 },
  { name: "Sarah", deals: 20 }
]

export function AgentPerformance() {
  const [data, setData] = useState(initialData)

  const updateData = () => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        deals: item.deals + Math.floor(Math.random() * 5) - 2,
      })),
    )
  }

  const sortData = () => {
    setData((prevData) => [...prevData].sort((a, b) => b.deals - a.deals))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>Number of deals closed by top agents</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="deals" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={updateData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Update Data
          </button>
          <button
            onClick={sortData}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Sort by Performance
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

