"use client";

import { useState } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Transaction {
  id: string;
  status: "In Progress" | "Pending Approval" | "Closed";
  assignedTC: string;
  documents: string[];
  tasks: { name: string; status: "Completed" | "Pending" | "In Progress" }[];
  complaints: { issue: string; status: "Open" | "Resolved" }[];
}

const transactions: Transaction[] = [
  {
    id: "TXN-1001",
    status: "In Progress",
    assignedTC: "John Doe",
    documents: ["Agreement.pdf", "Payment_Receipt.pdf"],
    tasks: [
      { name: "Verify ownership documents", status: "Completed" },
      { name: "Schedule site visit", status: "Pending" },
    ],
    complaints: [{ issue: "Delay in legal approval", status: "Open" }],
  },
  {
    id: "TXN-1002",
    status: "Pending Approval",
    assignedTC: "Alice Smith",
    documents: ["Ownership_Certificate.pdf"],
    tasks: [{ name: "Finalize legal approval", status: "In Progress" }],
    complaints: [],
  },
];

const getStatusBadge = (status: Transaction["status"]) => {
  const badgeStyles = {
    "In Progress": "bg-yellow-200 text-yellow-800",
    "Pending Approval": "bg-red-200 text-red-800",
    "Closed": "bg-green-200 text-green-800",
  };
  return <span className={`px-2 py-1 rounded ${badgeStyles[status]}`}>{status}</span>;
};

export default function MyTransactions() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Transactions</h2>
      <Table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Assigned TC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.id}</td>
              <td>{getStatusBadge(txn.status)}</td>
              <td>{txn.assignedTC}</td>
              <td>
                <Button onClick={() => setSelectedTransaction(txn)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details - {selectedTransaction.id}</DialogTitle>
            </DialogHeader>
            <div>
              <h3 className="font-semibold">Documents:</h3>
              <ul className="list-disc ml-4">
                {selectedTransaction.documents.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
              <h3 className="font-semibold mt-2">Tasks:</h3>
              <ul className="list-disc ml-4">
                {selectedTransaction.tasks.map((task, idx) => (
                  <li key={idx} className={task.status === "Completed" ? "text-green-600" : ""}>
                    {task.name} ({task.status})
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold mt-2">Complaints:</h3>
              <ul className="list-disc ml-4">
                {selectedTransaction.complaints.length > 0 ? (
                  selectedTransaction.complaints.map((comp, idx) => (
                    <li key={idx} className={comp.status === "Open" ? "text-red-600" : "text-green-600"}>
                      {comp.issue} ({comp.status})
                    </li>
                  ))
                ) : (
                  <p>No complaints</p>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}