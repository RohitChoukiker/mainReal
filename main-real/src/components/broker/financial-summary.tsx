"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Period = "monthly" | "quarterly" | "yearly"

const generateRandomData = (period: Period) => {
  const data = []
  const currentYear = new Date().getFullYear()
  const periods = period === "monthly" ? 12 : period === "quarterly" ? 4 : 3

  for (let i = 0; i < periods; i++) {
    const revenue = Math.floor(Math.random() * 50000) + 50000
    const expenses = Math.floor(Math.random() * 30000) + 20000
    const profit = revenue - expenses

    data.push({
      period:
        period === "monthly"
          ? `${currentYear}-${String(i + 1).padStart(2, "0")}`
          : period === "quarterly"
            ? `Q${i + 1} ${currentYear}`
            : `${currentYear - 2 + i}`,
      revenue,
      expenses,
      profit,
    })
  }

  return data
}

export function FinancialSummary({ period }: { period: Period }) {
  const [data, setData] = useState(generateRandomData(period))

  useEffect(() => {
    setData(generateRandomData(period))
  }, [period])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Expenses</TableHead>
          <TableHead>Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.period}>
            <TableCell>{row.period}</TableCell>
            <TableCell>${row.revenue.toLocaleString()}</TableCell>
            <TableCell>${row.expenses.toLocaleString()}</TableCell>
            <TableCell>${row.profit.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

