import { AgentsTable } from "@/components/broker/agents-table"

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agents</h1>
      <AgentsTable />
    </div>
  )
}

