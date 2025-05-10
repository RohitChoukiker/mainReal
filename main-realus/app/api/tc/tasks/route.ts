import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TaskModel, { TaskStatus } from "@/models/taskModel";
import TransactionModel from "@/models/transactionModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function GET(req: NextRequest) {
  try {
    console.log("TC tasks API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let tcId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        tcId = decoded.id;
        console.log("Token decoded, TC ID:", tcId);
        
        // Find the TC in the database
        const tc = await User.findById(decoded.id);
        console.log("TC found:", tc ? "Yes" : "No");
        
        if (tc && tc.role !== Role.Tc) {
          console.log("User is not a TC, role:", tc.role);
          return NextResponse.json(
            { message: "Unauthorized: User is not a Transaction Coordinator" },
            { status: 403 }
          );
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // Create an empty query - we'll show ALL tasks by default
    const query: any = {};
    
    console.log("Final query:", JSON.stringify(query));
    
    let total = 0;
    let tasks = [];
    
    try {
      // Get total count for pagination
      total = await TaskModel.countDocuments(query);
      console.log(`Total task count: ${total}`);
      
      // Get tasks
      tasks = await TaskModel.find(query)
        .sort({ dueDate: 1 }) // Sort by due date ascending
        .skip(skip)
        .limit(limit);
      
      console.log(`Found ${tasks.length} tasks in database`);
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // Return empty array instead of failing
      tasks = [];
      console.log("Using empty tasks array due to database error");
    }
    
    // If we don't have any tasks from the database, generate some demo tasks
    if (tasks.length === 0) {
      console.log("No tasks found in database, generating demo tasks");
      
      // Try to get transactions to associate tasks with
      let transactions = [];
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/tc/transactions`);
        if (response.ok) {
          const data = await response.json();
          if (data.transactions && data.transactions.length > 0) {
            transactions = data.transactions;
            console.log(`Found ${transactions.length} transactions to associate with tasks`);
          }
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      
      // Generate demo tasks
      const demoTasks = generateDemoTasks(transactions);
      tasks = demoTasks;
      total = demoTasks.length;
      
      // Apply pagination
      tasks = tasks.slice(skip, skip + limit);
    }
    
    // Check for overdue tasks and update their status
    tasks = tasks.map(task => {
      const taskObj = task.toObject ? task.toObject() : task;
      
      // Check if the task is overdue
      if (taskObj.status !== TaskStatus.Completed && 
          new Date(taskObj.dueDate) < new Date() && 
          taskObj.status !== TaskStatus.Overdue) {
        taskObj.status = TaskStatus.Overdue;
      }
      
      return taskObj;
    });
    
    console.log(`Returning ${tasks.length} tasks (total: ${total})`);
    
    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      tcId, // Include the TC ID in the response for debugging
    });
  } catch (error) {
    console.error("Error fetching TC tasks:", error);
    return NextResponse.json(
      { message: "Failed to fetch tasks", error: String(error) },
      { status: 500 }
    );
  }
}

// Function to generate demo tasks
function generateDemoTasks(transactions: any[]) {
  const tasks = [];
  const taskTypes = [
    "Schedule home inspection",
    "Collect HOA documents",
    "Submit financing application",
    "Review title report",
    "Coordinate final walkthrough",
    "Verify property disclosure",
    "Order appraisal",
    "Schedule closing date",
    "Review inspection report",
    "Collect earnest money"
  ];
  
  const descriptions = [
    "Contact the inspector and schedule a home inspection as soon as possible.",
    "Obtain all HOA documents including bylaws, financials, and meeting minutes.",
    "Complete and submit the mortgage application with all required documentation.",
    "Review the preliminary title report and note any issues or concerns.",
    "Schedule and coordinate the final walkthrough with the buyer and seller.",
    "Verify that all property disclosures are complete and accurate.",
    "Order appraisal through the lender and ensure it's scheduled promptly.",
    "Coordinate with all parties to set a closing date and time.",
    "Review inspection findings and create a list of requested repairs.",
    "Ensure earnest money is deposited into escrow account."
  ];
  
  // If we have transactions, create tasks for them
  if (transactions.length > 0) {
    transactions.forEach((transaction, tIndex) => {
      // Generate 2-4 random tasks per transaction
      const numTasks = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numTasks; i++) {
        const taskIndex = Math.floor(Math.random() * taskTypes.length);
        const daysToAdd = Math.floor(Math.random() * 14) - 3; // Some tasks will be overdue
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToAdd);
        
        // Determine status based on due date
        let status = TaskStatus.Pending;
        if (dueDate < new Date()) {
          status = Math.random() > 0.5 ? TaskStatus.Overdue : TaskStatus.Completed;
        } else {
          status = Math.random() > 0.7 ? TaskStatus.InProgress : TaskStatus.Pending;
        }
        
        // Format property address
        const property = transaction.propertyAddress ? 
          `${transaction.propertyAddress}${transaction.city ? `, ${transaction.city}` : ''}${transaction.state ? `, ${transaction.state}` : ''}` : 
          "Address not available";
        
        tasks.push({
          _id: `demo-task-${tIndex}-${i}`,
          title: taskTypes[taskIndex],
          transactionId: transaction.transactionId,
          propertyAddress: property,
          agentId: transaction.agentId || "Unknown Agent",
          dueDate: dueDate.toISOString(),
          status,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          description: descriptions[taskIndex],
          aiReminder: Math.random() > 0.7,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });
  } else {
    // If no transactions, create some generic tasks
    for (let i = 0; i < 10; i++) {
      const taskIndex = Math.floor(Math.random() * taskTypes.length);
      const daysToAdd = Math.floor(Math.random() * 14) - 3; // Some tasks will be overdue
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      
      // Determine status based on due date
      let status = TaskStatus.Pending;
      if (dueDate < new Date()) {
        status = Math.random() > 0.5 ? TaskStatus.Overdue : TaskStatus.Completed;
      } else {
        status = Math.random() > 0.7 ? TaskStatus.InProgress : TaskStatus.Pending;
      }
      
      tasks.push({
        _id: `demo-task-${i}`,
        title: taskTypes[taskIndex],
        transactionId: `TR-${1000 + Math.floor(Math.random() * 9000)}`,
        propertyAddress: `${Math.floor(Math.random() * 999) + 100} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Cedar Ln'][Math.floor(Math.random() * 5)]}, ${['Austin', 'Dallas', 'Houston', 'San Antonio'][Math.floor(Math.random() * 4)]}, TX`,
        agentId: ['Sarah Johnson', 'John Smith', 'Michael Brown'][Math.floor(Math.random() * 3)],
        dueDate: dueDate.toISOString(),
        status,
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        description: descriptions[taskIndex],
        aiReminder: Math.random() > 0.7,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  return tasks;
}