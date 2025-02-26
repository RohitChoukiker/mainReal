free vs perminum

real-estate-transaction-system/
├── .env
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── middleware.ts            # Add role & subscription checks (free/premium)
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          # Root layout - Add subscription status in UI
│   ├── page.tsx            # Landing page - Free tier CTA + Premium upgrade option
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx  # Free tier by default on signup
│   │   └── forgot-password/page.tsx
│   ├── agent/
│   │   ├── layout.tsx      # Show free/premium indicators in sidebar
│   │   ├── page.tsx        # Dashboard: Free - basic stats | Premium - detailed analytics
│   │   ├── transactions/
│   │   │   ├── page.tsx    # Free: View 1-2 transactions | Premium: Unlimited
│   │   │   ├── [id]/page.tsx  # Free: Read-only | Premium: Edit access
│   │   │   └── create/page.tsx  # Premium only
│   │   ├── tasks/
│   │   │   ├── page.tsx    # Free: View tasks | Premium: Add/Edit tasks
│   │   │   └── [id]/page.tsx  # Free: View | Premium: Edit
│   │   ├── documents/
│   │   │   ├── page.tsx    # Free: View only | Premium: Upload/Edit
│   │   │   └── [id]/page.tsx  # Free: View | Premium: Edit
│   │   ├── messages/
│   │   │   ├── page.tsx    # Free: Read messages | Premium: Send replies
│   │   │   └── [id]/page.tsx  # Same as above
│   │   └── reports/page.tsx  # Free: Basic summary | Premium: Detailed reports
│   ├── coordinator/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Free: Basic overview | Premium: Full tools
│   │   ├── transactions/
│   │   │   ├── page.tsx    # Free: View assigned | Premium: Manage
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx    # Free: View | Premium: Manage
│   │   │   └── [id]/page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx    # Free: View | Premium: Upload/Edit
│   │   │   └── [id]/page.tsx
│   │   ├── deadlines/page.tsx  # Premium only
│   │   └── messages/
│   │       ├── page.tsx    # Free: Read | Premium: Reply
│   │       └── [id]/page.tsx
│   ├── brokerage/
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Free: Basic overview | Premium: Full control
│   │   ├── transactions/
│   │   │   ├── page.tsx    # Free: View | Premium: Monitor/Edit
│   │   │   └── [id]/page.tsx
│   │   ├── agents/
│   │   │   ├── page.tsx    # Free: List agents | Premium: Manage agents
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx    # Free: View | Premium: Assign
│   │   │   └── create/page.tsx  # Premium only
│   │   ├── compliance/page.tsx  # Premium only
│   │   └── reports/page.tsx  # Free: Basic | Premium: Advanced analytics
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── transactions/
│       │   ├── route.ts     # Add free/premium logic
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
│       ├── reports/route.ts
│       └── subscription/     # NEW: For managing plans
│           ├── plans/route.ts  # Fetch available plans
│           └── upgrade/route.ts  # Upgrade to premium
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   └── upgrade-banner.tsx  # NEW: Prompt free users to upgrade
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx     # Add free/premium navigation
│   │   ├── header.tsx      # Show subscription status
│   │   └── notification-panel.tsx
│   ├── agent/
│   │   ├── transaction-list.tsx
│   │   ├── task-panel.tsx
│   │   └── document-uploader.tsx  # Premium only
│   ├── coordinator/
│   │   ├── task-manager.tsx
│   │   └── compliance-tracker.tsx  # Premium only
│   └── brokerage/
│       ├── agent-management.tsx
│       └── performance-chart.tsx  # Premium: Full data
│   └── subscription/         # NEW: Subscription-related components
│       ├── plan-selector.tsx  # Choose free/premium plan
│       └── payment-form.tsx   # Payment UI for premium
├── lib/
│   ├── auth.ts             # Add subscription status check
│   ├── db.ts
│   ├── types.ts            # Add subscription-related types
│   ├── utils.ts
│   ├── subscription.ts     # NEW: Subscription logic
│   └── hooks/
│       ├── useAuth.ts
│       ├── useTransaction.ts
│       ├── useTasks.ts
│       └── useSubscription.ts  # NEW: Hook for subscription status
├── public/
│   ├── logo.svg
│   └── images/
│       └── dashboard-bg.jpg
└── data/
    └── schemas/
        ├── agent.ts
        ├── transaction.ts
        ├── task.ts
        └── subscription.ts     # NEW: Schema for subscription plans



        messaging


        real-estate-transaction-system/
├── .env
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── middleware.ts            # Add messaging access control (role + subscription)
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          # Add messaging notifications in UI
│   ├── page.tsx            # Landing page - Mention messaging in premium CTA
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── agent/
│   │   ├── layout.tsx      # Messaging link in sidebar
│   │   ├── page.tsx        # Dashboard: Free - Basic inbox | Premium - Full messaging
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── messages/
│   │   │   ├── page.tsx    # Free: Read messages | Premium: Send to coordinator/brokerage
│   │   │   ├── [id]/page.tsx  # View convo | Premium: Reply + attachments
│   │   │   └── compose/page.tsx  # NEW: Premium only - Start new message
│   │   └── reports/page.tsx
│   ├── coordinator/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── deadlines/page.tsx
│   │   └── messages/
│   │       ├── page.tsx    # Free: Read | Premium: Send to agent/brokerage
│   │       ├── [id]/page.tsx  # View convo | Premium: Reply + attachments
│   │       └── compose/page.tsx  # NEW: Premium only - Start new message
│   ├── brokerage/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── agents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   ├── compliance/page.tsx
│   │   └── reports/page.tsx
│   │   └── messages/
│   │       ├── page.tsx    # Free: Read | Premium: Send to agent/coordinator
│   │       ├── [id]/page.tsx  # View convo | Premium: Reply + attachments
│   │       └── compose/page.tsx  # NEW: Premium only - Start new message
│   └── api/
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
│       │   ├── route.ts    # Fetch messages (filter by role + subscription)
│       │   ├── [id]/route.ts  # Get convo by ID
│       │   ├── compose/route.ts  # NEW: Send message (premium only)
│       │   └── attachment/route.ts  # NEW: Upload attachment (premium only)
│       ├── agents/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── reports/route.ts
│       └── subscription/
│           ├── plans/route.ts
│           └── upgrade/route.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   └── upgrade-banner.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx     # Add messaging link
│   │   ├── header.tsx      # Show unread message count
│   │   └── notification-panel.tsx  # Show message notifications
│   ├── agent/
│   │   ├── transaction-list.tsx
│   │   ├── task-panel.tsx
│   │   └── document-uploader.tsx
│   ├── coordinator/
│   │   ├── task-manager.tsx
│   │   └── compliance-tracker.tsx
│   ├── brokerage/
│   │   ├── agent-management.tsx
│   │   └── performance-chart.tsx
│   ├── subscription/
│   │   ├── plan-selector.tsx
│   │   └── payment-form.tsx
│   └── messages/            # NEW: Messaging components
│       ├── message-list.tsx  # List all messages
│       ├── message-thread.tsx  # Show convo thread
│       ├── compose-form.tsx  # Compose new message
│       └── attachment-uploader.tsx  # Premium: Upload files
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── types.ts            # Add Message, Conversation types
│   ├── utils.ts
│   ├── subscription.ts
│   ├── messages.ts         # NEW: Messaging logic (send, fetch, etc.)
│   └── hooks/
│       ├── useAuth.ts
│       ├── useTransaction.ts
│       ├── useTasks.ts
│       ├── useSubscription.ts
│       └── useMessages.ts   # NEW: Hook for messaging data
├── public/
│   ├── logo.svg
│   └── images/
│       └── dashboard-bg.jpg
└── data/
    └── schemas/
        ├── agent.ts
        ├── transaction.ts
        ├── task.ts
        ├── subscription.ts
        └── message.ts          # NEW: Schema for messages (sender, recipient, content)