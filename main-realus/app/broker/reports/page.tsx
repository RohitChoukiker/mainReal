"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, Calendar, Filter, BarChart3, LineChartIcon, Share2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for charts
const monthlyTransactions = [
  { name: "Jan", transactions: 12, volume: 4.2 },
  { name: "Feb", transactions: 15, volume: 5.8 },
  { name: "Mar", transactions: 18, volume: 6.3 },
  { name: "Apr", transactions: 16, volume: 5.9 },
  { name: "May", transactions: 21, volume: 7.2 },
  { name: "Jun", transactions: 24, volume: 8.5 },
  { name: "Jul", transactions: 22, volume: 7.8 },
  { name: "Aug", transactions: 25, volume: 9.1 },
  { name: "Sep", transactions: 23, volume: 8.4 },
  { name: "Oct", transactions: 20, volume: 7.5 },
  { name: "Nov", transactions: 18, volume: 6.7 },
  { name: "Dec", transactions: 16, volume: 5.9 },
]

const transactionStatusData = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "In Progress", value: 30, color: "#3b82f6" },
  { name: "Pending", value: 15, color: "#f59e0b" },
  { name: "At Risk", value: 10, color: "#ef4444" },
]

const agentPerformanceData = [
  { name: "John Smith", transactions: 24, volume: 8.2, avgTime: 21 },
  { name: "Sarah Johnson", transactions: 18, volume: 6.5, avgTime: 19 },
  { name: "Michael Brown", transactions: 15, volume: 5.8, avgTime: 24 },
  { name: "Emily Davis", transactions: 12, volume: 4.2, avgTime: 22 },
  { name: "David Wilson", transactions: 10, volume: 3.5, avgTime: 25 },
]

const propertyTypeData = [
  { name: "Single Family", value: 55, color: "#3b82f6" },
  { name: "Condo", value: 20, color: "#10b981" },
  { name: "Townhouse", value: 15, color: "#f59e0b" },
  { name: "Multi-Family", value: 10, color: "#8b5cf6" },
]

const timelineData = [
  { month: "Jan", avgDays: 28 },
  { month: "Feb", avgDays: 26 },
  { month: "Mar", avgDays: 24 },
  { month: "Apr", avgDays: 25 },
  { month: "May", avgDays: 22 },
  { month: "Jun", avgDays: 21 },
  { month: "Jul", avgDays: 20 },
  { month: "Aug", avgDays: 19 },
  { month: "Sep", avgDays: 21 },
  { month: "Oct", avgDays: 22 },
  { month: "Nov", avgDays: 23 },
  { month: "Dec", avgDays: 24 },
]

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("year")
  const [chartType, setChartType] = useState("bar")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-40">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full md:w-40">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Agents" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="john">John Smith</SelectItem>
              <SelectItem value="sarah">Sarah Johnson</SelectItem>
              <SelectItem value="michael">Michael Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Key metrics for the selected period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
              <div className="text-3xl font-bold">235</div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
              <div className="text-3xl font-bold">$82.3M</div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Avg. Transaction Value</div>
              <div className="text-3xl font-bold">$350K</div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Avg. Days to Close</div>
              <div className="text-3xl font-bold">22</div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download Full Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Monthly transaction count and volume</CardDescription>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                  className="flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Bar</span>
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className="flex items-center gap-1"
                >
                  <LineChartIcon className="h-4 w-4" />
                  <span>Line</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={monthlyTransactions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="transactions" name="Transactions" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="volume" name="Volume ($M)" fill="#82ca9d" />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyTransactions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="transactions"
                      name="Transactions"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="volume" name="Volume ($M)" stroke="#82ca9d" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Distribution of transactions by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
            <CardDescription>Distribution of transactions by property type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Comparison of agent performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Volume ($M)</TableHead>
                  <TableHead>Avg. Value ($K)</TableHead>
                  <TableHead>Avg. Days to Close</TableHead>
                  <TableHead>Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentPerformanceData.map((agent, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agent.transactions}</TableCell>
                    <TableCell>${agent.volume.toFixed(1)}M</TableCell>
                    <TableCell>${((agent.volume * 1000) / agent.transactions).toFixed(0)}K</TableCell>
                    <TableCell>{agent.avgTime} days</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${95 - index * 5}%` }}></div>
                        </div>
                        <span className="text-xs font-medium">{95 - index * 5}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Timeline</CardTitle>
          <CardDescription>Average days to close by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  name="Avg. Days to Close"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

