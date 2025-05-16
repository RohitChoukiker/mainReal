# Route Protection Implementation

This document outlines the route protection system implemented in the Realus application.

## Overview

The route protection system consists of several layers:

1. **Server-side Middleware**: Intercepts requests and verifies authentication before allowing access to protected routes
2. **Client-side Authentication Context**: Manages authentication state across the application
3. **Protected Route Components**: Wraps components to ensure they're only accessible to authenticated users
4. **Role-based Access Control**: Ensures users can only access routes appropriate for their role

## Components

### 1. Server-side Middleware (`middleware.ts`)

- Intercepts all requests to the application
- Checks for authentication token in cookies
- Verifies token validity using jose library
- Implements role-based access control
- Redirects unauthorized users to the landing page

### 2. Authentication Utilities (`utils/auth.ts`)

- Provides helper functions for authentication operations
- Manages token and user data in localStorage
- Handles token validation and expiration
- Provides role checking functionality

### 3. Protected Route Component (`components/auth/protected-route.tsx`)

- Client-side component that wraps protected pages
- Checks authentication status before rendering children
- Redirects unauthenticated users to the landing page
- Supports role-based access control

### 4. Authentication HOC (`components/auth/with-auth.tsx`)

- Higher-order component for easy route protection
- Wraps any component with authentication protection
- Supports role-based access restrictions

### 5. Authentication Context (`context/auth-context.tsx`)

- Provides global authentication state
- Manages user data and authentication status
- Provides login and logout functionality
- Supports role checking

### 6. Authentication Hook (`hooks/use-auth.ts`)

- Custom hook for accessing authentication state
- Provides user data and authentication status
- Includes helper functions for authentication operations

### 7. Logout API (`app/api/logout/route.ts`)

- Handles server-side logout operations
- Clears authentication cookies

### 8. Logout Button (`components/auth/logout-button.tsx`)

- UI component for triggering logout
- Calls logout API and clears client-side auth data

## Usage Examples

### Protecting a Page

```tsx
// Using the withAuth HOC
import { withAuth } from "@/components/auth/with-auth";

function AgentDashboard() {
  // Component code...
}

// Only allow users with the "Agent" role to access this page
export default withAuth(AgentDashboard, ["Agent"]);
```

### Using Authentication in Components

```tsx
import { useAuth } from "@/hooks/use-auth";

function ProfileComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in to view your profile</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Adding Logout Button

```tsx
import LogoutButton from "@/components/auth/logout-button";

function Header() {
  return (
    <header>
      <nav>
        {/* Other navigation items */}
        <LogoutButton />
      </nav>
    </header>
  );
}
```

## Security Considerations

1. **Token Storage**: Tokens are stored in HTTP-only cookies for server-side validation and in localStorage for client-side validation
2. **Token Verification**: Tokens are verified on both server and client sides
3. **Role-based Access**: Users can only access routes appropriate for their role
4. **Token Expiration**: Tokens expire after a set period (7 days)
5. **Secure Logout**: Logout clears tokens from both cookies and localStorage

## Future Improvements

1. **Refresh Tokens**: Implement refresh tokens for longer sessions without compromising security
2. **Permission-based Access**: Extend role-based access to more granular permissions
3. **Two-factor Authentication**: Add support for 2FA for enhanced security
4. **Session Management**: Add ability to view and manage active sessions