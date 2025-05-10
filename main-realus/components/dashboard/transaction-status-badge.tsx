import type React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const transactionStatusVariants = cva("", {
  variants: {
    variant: {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      at_risk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      delayed: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      new: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
  },
  defaultVariants: {
    variant: "pending",
  },
})

export interface TransactionStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transactionStatusVariants> {
  status: string
}

export function TransactionStatusBadge({ status, variant, className, ...props }: TransactionStatusBadgeProps) {
  // Normalize status to lowercase for consistent handling
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
  
  // Map status string to variant if not explicitly provided
  const mappedVariant = variant || (normalizedStatus.replace(/\s+/g, "_") as any)

  // Map status to display text
  const displayText = status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <Badge
      variant="outline"
      className={cn(transactionStatusVariants({ variant: mappedVariant }), className)}
      {...props}
    >
      {displayText}
    </Badge>
  )
}

