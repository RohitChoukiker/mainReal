"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const initialData = [
  { name: "Approved", value: 80 },
  { name: "Rejected", value: 20 },
]

export function TransactionSuccess() {
  const [data, setData] = useState(initialData)

  const updateData = () => {
    const newApproved = Math.floor(Math.random() * 40) + 60 // Random number between 60 and 100
    setData([
      { name: "Approved", value: newApproved },
      { name: "Rejected", value: 100 - newApproved },
    ])
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center">
        <button
          onClick={updateData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Update Data
        </button>
      </div>
    </div>
  )
}

