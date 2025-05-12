"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface TaskMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  taskTitle: string
  transactionId: string
  currentUserRole: 'agent' | 'tc'
}

export function TaskMessageDialog({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  transactionId,
  currentUserRole
}: TaskMessageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Messaging Feature Removed</h2>
          <p className="text-gray-600 mb-4">
            The messaging feature has been removed from this application.
          </p>
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm font-medium">Task:</span>
            <Badge variant="outline">{taskTitle}</Badge>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="text-sm font-medium">Transaction ID:</span>
            <Badge variant="outline" className="font-mono">{transactionId}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}