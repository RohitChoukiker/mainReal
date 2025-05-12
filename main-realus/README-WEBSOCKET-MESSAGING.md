# Real-Time Messaging System Implementation

This document describes the implementation of a real-time messaging system between agents and transaction coordinators (TC) using WebSockets.

## Overview

The messaging system allows agents and TCs to communicate in real-time about specific tasks. Key features include:

- Real-time message delivery using WebSockets
- Read receipts
- Unread message counts with notifications
- Fallback to polling when WebSockets are not available

## Components

### Server-Side

1. **Socket Server (`utils/socketServer.ts`)**
   - Manages WebSocket connections
   - Handles authentication
   - Manages rooms for tasks and users
   - Provides functions to emit events to specific rooms

2. **API Routes**
   - `/api/tasks/[id]/messages` - For sending and receiving messages
   - `/api/tasks/[id]/messages/unread` - For checking unread message counts
   - Both routes now emit WebSocket events when data changes

3. **Custom Server (`server.js`)**
   - Initializes both Next.js and Socket.IO on the same HTTP server

### Client-Side

1. **Socket Hook (`utils/useSocket.ts`)**
   - Manages WebSocket connection
   - Handles authentication
   - Provides functions to join/leave task rooms

2. **Real-Time Messages Hook (`utils/useRealTimeMessages.ts`)**
   - Replaces the polling-based hook
   - Listens for WebSocket events
   - Falls back to API calls when needed

3. **UI Components**
   - `TaskMessageDialog` - Updated to use WebSockets
   - `UnreadMessageBadge` - Updated to use WebSockets

## WebSocket Events

- `new_message` - Sent when a new message is created
- `message_read` - Sent when a message is marked as read
- `unread_count_update` - Sent when the unread count changes

## Socket.IO Rooms

- `task:{taskId}` - Room for all users interested in a specific task
- `user:{userId}` - Room for a specific user
- `role:{role}` - Room for all users with a specific role (agent or tc)

## How It Works

1. When a user opens a task message dialog:
   - The client connects to the WebSocket server
   - The client authenticates using the JWT token
   - The client joins the task room

2. When a user sends a message:
   - The message is sent to the API
   - The API saves the message to the database
   - The API emits a WebSocket event to all clients in the task room

3. When a user receives a message:
   - The WebSocket client receives the event
   - The UI updates to show the new message
   - A notification is shown if the message is from the other role

4. When a user reads messages:
   - The API marks messages as read in the database
   - The API emits a WebSocket event to update read receipts
   - The unread count is updated for all clients

## Usage

To use the messaging system:

1. Make sure the custom server is running (`npm run dev` or `npm start`)
2. Use the `TaskMessageDialog` component to display and send messages
3. Use the `UnreadMessageBadge` component to show unread message counts

## Fallback Mechanism

If WebSockets are not available or fail to connect:
- The system falls back to polling for messages
- The polling interval is configurable
- The UI will still work, just without real-time updates