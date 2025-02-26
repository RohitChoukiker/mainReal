import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTransactions() {
  const transactions = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      amount: "$250.00",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      amount: "$350.00",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      amount: "$450.00",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      amount: "$550.00",
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie@example.com",
      amount: "$650.00",
    },
  ]

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${transaction.id}.png`} alt="Avatar" />
            <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.email}</p>
          </div>
          <div className="ml-auto font-medium">{transaction.amount}</div>
        </div>
      ))}
    </div>
  )
}

