"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle, MapPin, Building, Calendar, User, FileText, Tag } from "lucide-react"

interface Task {
  id: string
  title: string
  transactionId: string
  property: string
  assignedBy: string
  dueDate: string
  status: "pending" | "completed" | "overdue" | "in_progress"
  priority: "low" | "medium" | "high"
  description?: string
  aiReminder?: boolean
}

interface TaskDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export function TaskDetailDialog({
  isOpen,
  onClose,
  task
}: TaskDetailDialogProps) {
  if (!task) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Overdue</span>
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Status</div>
              <div>{getStatusBadge(task.status)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Priority</div>
              <div>{getPriorityBadge(task.priority)}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>Transaction ID</span>
            </div>
            <div className="font-medium">{task.transactionId}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Property</span>
            </div>
            <div className="font-medium">{task.property}</div>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Assigned By</span>
              </div>
              <div className="font-medium">{task.assignedBy}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Due Date</span>
              </div>
              <div className="font-medium">{task.dueDate}</div>
            </div>
          </div>
          
          {task.description && (
            <div className="space-y-1 pt-2 border-t">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
              <div className="text-sm">{task.description}</div>
            </div>
          )}
          
          {task.aiReminder && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-start gap-2">
              <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-700">AI Reminder Enabled</div>
                <div className="text-sm text-blue-600">
                  You will receive AI-generated reminders about this task.
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}