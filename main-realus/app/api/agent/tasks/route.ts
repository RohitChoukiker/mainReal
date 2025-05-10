import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Task from "@/models/taskModel";
import catchAsync from "@/utils/catchAsync";

// GET handler to fetch tasks assigned to the current agent
export const GET = catchAsync(async (req: NextRequest) => {
  await dbConnect();
  
  // In a real implementation, you would get the agent ID from the session
  // For now, we'll return mock data
  
  // Mock data for demonstration
  const mockTasks = [
    {
      _id: "task-1",
      title: "Schedule home inspection",
      transactionId: "TR-7829",
      propertyAddress: "123 Main St, Austin, TX",
      agentId: "agent-123",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      status: "pending",
      priority: "high",
      description: "Contact the inspector and schedule a home inspection as soon as possible.",
      aiReminder: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "task-2",
      title: "Collect HOA documents",
      transactionId: "TR-7829",
      propertyAddress: "123 Main St, Austin, TX",
      agentId: "agent-123",
      dueDate: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
      status: "in_progress",
      priority: "medium",
      description: "Obtain all HOA documents including bylaws, financials, and meeting minutes.",
      aiReminder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    },
    {
      _id: "task-3",
      title: "Submit financing application",
      transactionId: "TR-6543",
      propertyAddress: "456 Oak Ave, Dallas, TX",
      agentId: "agent-123",
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      status: "overdue",
      priority: "high",
      description: "Complete and submit the mortgage application with all required documentation.",
      aiReminder: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "task-4",
      title: "Review title report",
      transactionId: "TR-9021",
      propertyAddress: "789 Pine Rd, Houston, TX",
      agentId: "agent-123",
      dueDate: new Date(Date.now() + 86400000 * 8).toISOString(), // 8 days from now
      status: "pending",
      priority: "medium",
      description: "Review the preliminary title report and note any issues or concerns.",
      aiReminder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "task-5",
      title: "Verify property disclosure",
      transactionId: "TR-5432",
      propertyAddress: "321 Elm St, San Antonio, TX",
      agentId: "agent-123",
      dueDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      status: "completed",
      priority: "high",
      description: "Verify that all property disclosures are complete and accurate.",
      aiReminder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ];

  // In a real implementation, you would query the database
  // const agentId = "get from session";
  // const tasks = await Task.find({ agentId }).sort({ status: 1, dueDate: 1 });

  return NextResponse.json({ tasks: mockTasks });
});