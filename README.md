real-estate-transaction-system/
├── .env
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── middleware.ts            # For authentication and route protection
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── agent/               # Agent dashboard & features
│   │   ├── layout.tsx       # Agent dashboard layout
│   │   ├── page.tsx         # Agent dashboard overview
│   │   ├── transactions/    # Transaction management
│   │   │   ├── page.tsx     # List all transactions
│   │   │   ├── [id]/        # Single transaction view
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── tasks/           # Task management
│   │   │   ├── page.tsx     # View all tasks
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── documents/       # Document management
│   │   │   ├── page.tsx     # All documents
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── messages/        # Communication
│   │   │   ├── page.tsx     # Message inbox
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── reports/         # Performance reports
│   │       └── page.tsx
│   │
│   ├── coordinator/         # Transaction Coordinator routes
│   │   ├── layout.tsx       # TC dashboard layout
│   │   ├── page.tsx         # TC dashboard overview
│   │   ├── transactions/    # Assigned transactions
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tasks/           # Task management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── documents/       # Document management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── deadlines/       # Compliance deadlines
│   │   │   └── page.tsx
│   │   └── messages/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   ├── brokerage/           # Brokerage Admin routes
│   │   ├── layout.tsx       # Brokerage dashboard layout
│   │   ├── page.tsx         # Brokerage overview dashboard
│   │   ├── transactions/    # Transaction monitoring
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── agents/          # Agent management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tasks/           # Task assignment
│   │   │   ├── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── compliance/      # Compliance monitoring
│   │   │   └── page.tsx
│   │   └── reports/         # Analytics & reports
│   │       └── page.tsx
│   │
│   └── api/                 # API routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── transactions/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── tasks/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── documents/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── messages/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── agents/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── reports/
│           └── route.ts
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── card.tsx
│   ├── auth/                # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/           # Dashboard components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── notification-panel.tsx
│   ├── agent/               # Agent-specific components
│   │   ├── transaction-list.tsx
│   │   ├── task-panel.tsx
│   │   └── document-uploader.tsx
│   ├── coordinator/         # TC-specific components
│   │   ├── task-manager.tsx
│   │   └── compliance-tracker.tsx
│   └── brokerage/           # Brokerage-specific components
│       ├── agent-management.tsx
│       └── performance-chart.tsx
│
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database connection
│   ├── types.ts             # TypeScript type definitions
│   ├── utils.ts             # Utility functions
│   └── hooks/
│       ├── useAuth.ts
│       ├── useTransaction.ts
│       └── useTasks.ts
│
├── public/
│   ├── logo.svg
│   └── images/
│       └── dashboard-bg.jpg
│
└── data/
    └── schemas/
        ├── agent.ts
        ├── transaction.ts
        └── task.ts
