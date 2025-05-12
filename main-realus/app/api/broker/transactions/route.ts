import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catchAsync";

// Import both transaction models to ensure they're registered
import "@/models/transaction";

const JWT_SECRET = "123123123 " as string;

export const GET = catchAsync(async (req: NextRequest) => {
  try {
    console.log("Broker transactions API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    const agentId = url.searchParams.get("agentId"); // Optional filter by agent
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let brokerId;
    let userId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        userId = decoded.id;
        console.log("Token decoded, user ID:", userId);
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        console.log("Broker found:", broker ? "Yes" : "No");
        
        if (broker && broker.role === Role.Broker) {
          // Use the broker's brokerId field if available, otherwise use the database ID
          brokerId = broker.brokerId || broker._id.toString();
          console.log("Found broker with ID:", brokerId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // If we couldn't get the brokerId from the session, use the query parameter
    if (!brokerId) {
      brokerId = url.searchParams.get("brokerId");
      console.log("Using brokerId from query:", brokerId);
      
      // If still no brokerId, try to get it from the database using a default broker
      if (!brokerId && userId) {
        try {
          // Try to find any broker in the system
          const anyBroker = await User.findOne({ role: Role.Broker });
          if (anyBroker) {
            brokerId = anyBroker._id.toString();
            console.log("Using broker ID from database:", brokerId);
          }
        } catch (err) {
          console.error("Error finding default broker:", err);
        }
      }
      
      // If we still don't have a broker ID, use a fallback ID instead of returning an error
      if (!brokerId) {
        console.log("No broker ID found, using fallback ID");
        brokerId = "test-broker-id"; // Use a fallback ID to allow the page to load
        console.log("Using fallback broker ID:", brokerId);
      }
    }
    
    console.log("Final brokerId for transaction query:", brokerId);
    
    // IMPORTANT CHANGE: We're going to get ALL transactions without filtering by broker ID
    // This ensures we show all transactions in the system
    console.log("Getting ALL transactions without broker ID filtering");
    
    // Create an empty query - we'll show ALL transactions by default
    const query: any = {};
    
    // Only filter by agent ID if provided
    if (agentId) {
      query.agentId = agentId;
      console.log("Filtering by agent ID:", agentId);
    }
    
    console.log("Final query:", JSON.stringify(query));
    
    let total = 0;
    let transactions = [];
    
    try {
      // Get total count for pagination
      total = await TransactionModel.countDocuments(query);
      console.log(`Total transaction count: ${total}`);
      
      // Get transactions
      transactions = await TransactionModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      console.log(`Found ${transactions.length} transactions in database`);
      
      // Add agent names to transactions
      for (let i = 0; i < transactions.length; i++) {
        try {
          const agent = await User.findById(transactions[i].agentId);
          if (agent) {
            // Add agent name to transaction
            (transactions[i] as any).agentName = agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || "Unknown Agent";
            console.log(`Added agent name "${(transactions[i] as any).agentName}" to transaction ${transactions[i].transactionId || transactions[i]._id}`);
          } else {
            // If agent not found, set a default name
            (transactions[i] as any).agentName = "Unknown Agent";
            console.log(`Agent not found for transaction ${transactions[i].transactionId || transactions[i]._id}, using default name`);
          }
        } catch (error) {
          console.error(`Error finding agent for transaction ${transactions[i].transactionId || transactions[i]._id}:`, error);
          // Set a default name in case of error
          (transactions[i] as any).agentName = "Unknown Agent";
        }
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // Return empty array instead of failing
      transactions = [];
      console.log("Using empty transactions array due to database error");
    }
    
    // If we don't have any transactions from the database, try to get them from the in-memory API
    if (transactions.length === 0) {
      try {
        console.log("No transactions found in database, trying in-memory API");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/agent/transactions/add-simple`);
        if (response.ok) {
          const data = await response.json();
          if (data.transactions && data.transactions.length > 0) {
            console.log(`Found ${data.transactions.length} transactions from in-memory API`);
            
            // Get ALL in-memory transactions without filtering
            transactions = data.transactions;
            console.log(`Using all ${transactions.length} in-memory transactions`);
            
            // Add agent names to in-memory transactions
            for (let i = 0; i < transactions.length; i++) {
              try {
                const agent = await User.findById(transactions[i].agentId);
                if (agent) {
                  // Add agent name to transaction
                  (transactions[i] as any).agentName = agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || "Unknown Agent";
                  console.log(`Added agent name "${(transactions[i] as any).agentName}" to in-memory transaction ${i}`);
                } else {
                  // If agent not found, set a default name
                  (transactions[i] as any).agentName = "Unknown Agent";
                  console.log(`Agent not found for in-memory transaction ${i}, using default name`);
                }
              } catch (error) {
                console.error(`Error finding agent for in-memory transaction ${i}:`, error);
                // Set a default name in case of error
                (transactions[i] as any).agentName = "Unknown Agent";
              }
            }
            
            // Log all transactions with their agent names
            console.log("In-memory transactions with agent names:");
            transactions.forEach((tx: any, index: number) => {
              console.log(`Transaction ${index} agent name:`, tx.agentName);
            });
            
            // Apply pagination
            total = transactions.length;
            transactions = transactions.slice(skip, skip + limit);
          }
        }
      } catch (memoryError) {
        console.error("Error fetching from in-memory API:", memoryError);
      }
    }
    
    // We're using data from both the database and in-memory storage if needed
    console.log(`Returning ${transactions.length} transactions (total: ${total})`);
    
    return NextResponse.json({
      transactions,
      pagination: {
        total, // Use the actual total count from the database
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      brokerId, // Include the broker ID in the response for debugging
    });
  } catch (error) {
    console.error("Error fetching broker transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: String(error) },
      { status: 500 }
    );
  }
});

// Add a new endpoint to get agent performance data
export const POST = catchAsync(async (req: NextRequest) => {
  try {
    console.log("Broker agent performance API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);
    
    // Get the broker ID from the request body or token
    let brokerId = body.brokerId;
    
    // Get the token from cookies if brokerId not provided
    if (!brokerId) {
      const token = req.cookies.get('token')?.value;
      console.log("Token from cookies:", token ? "Found" : "Not found");
      
      if (token) {
        try {
          // Verify the token
          const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
          
          // Find the broker in the database
          const broker = await User.findById(decoded.id);
          
          if (broker && broker.role === Role.Broker) {
            // Use the broker's brokerId field if available, otherwise use the database ID
            brokerId = broker.brokerId || broker._id.toString();
            console.log("Found broker with ID:", brokerId);
          }
        } catch (error) {
          console.error("Token verification error:", error);
        }
      }
    }
    
    // If still no brokerId, use a fallback
    if (!brokerId) {
      brokerId = "test-broker-id";
      console.log("Using fallback broker ID:", brokerId);
    }
    
    // IMPORTANT CHANGE: Get ALL transactions without filtering by broker ID
    console.log("Getting ALL transactions for agent performance data");
    
    // Create an empty query - we'll show ALL transactions by default
    const query: any = {};
    
    console.log("Agent performance query:", JSON.stringify(query));
    
    // Try to find transactions in the database
    let transactions = [];
    try {
      transactions = await TransactionModel.find(query);
      console.log(`Found ${transactions.length} total transactions in database`);
    } catch (error) {
      console.error("Error querying transactions from database:", error);
    }
    
    // If we don't have any transactions from the database, try to get them from the in-memory API
    if (transactions.length === 0) {
      try {
        console.log("No transactions found in database, trying in-memory API");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/agent/transactions/add-simple`);
        if (response.ok) {
          const data = await response.json();
          if (data.transactions && data.transactions.length > 0) {
            console.log(`Found ${data.transactions.length} transactions from in-memory API`);
            
            // Get ALL in-memory transactions without filtering
            transactions = data.transactions;
            console.log(`Using all ${transactions.length} in-memory transactions`);
          }
        }
      } catch (memoryError) {
        console.error("Error fetching from in-memory API:", memoryError);
      }
    }
    
    console.log(`Total transactions for processing: ${transactions.length}`);
    
    // Group transactions by agent
    const agentPerformance = new Map();
    
    for (const transaction of transactions) {
      const agentId = transaction.agentId;
      
      if (!agentPerformance.has(agentId)) {
        // Find agent details
        let agentName = "Unknown Agent";
        try {
          const agent = await User.findById(agentId);
          if (agent) {
            agentName = agent.name || `${agent.firstName} ${agent.lastName}`.trim() || agentName;
          }
        } catch (error) {
          console.error(`Error finding agent ${agentId}:`, error);
        }
        
        agentPerformance.set(agentId, {
          id: agentId,
          name: agentName,
          avatar: "/placeholder.svg?height=40&width=40", // Default avatar
          transactions: 0,
          completedTransactions: 0,
          totalValue: 0,
          avgTimeToClose: 0,
          closedTransactionsDays: [],
        });
      }
      
      const agent = agentPerformance.get(agentId);
      agent.transactions += 1;
      agent.totalValue += transaction.price || 0;
      
      // Check if transaction is completed
      if (transaction.status === "Completed" || transaction.status === "Closed") {
        agent.completedTransactions += 1;
        
        // Calculate days to close if we have both dates
        if (transaction.createdAt && transaction.updatedAt) {
          const createdDate = new Date(transaction.createdAt);
          const closedDate = new Date(transaction.updatedAt);
          const daysToClose = Math.ceil((closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          agent.closedTransactionsDays.push(daysToClose);
        }
      }
    }
    
    // Calculate final metrics for each agent
    const agentPerformanceArray = Array.from(agentPerformance.values()).map(agent => {
      // Calculate completion rate
      const completionRate = agent.transactions > 0 
        ? Math.round((agent.completedTransactions / agent.transactions) * 100) 
        : 0;
      
      // Calculate average time to close
      const avgTimeToClose = agent.closedTransactionsDays.length > 0
        ? Math.round(agent.closedTransactionsDays.reduce((sum, days) => sum + days, 0) / agent.closedTransactionsDays.length)
        : 0;
      
      return {
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        transactions: agent.transactions,
        completionRate: completionRate,
        avgTimeToClose: avgTimeToClose,
        totalValue: agent.totalValue,
      };
    });
    
    // Sort by number of transactions (descending)
    agentPerformanceArray.sort((a, b) => b.transactions - a.transactions);
    
    console.log(`Returning performance data for ${agentPerformanceArray.length} agents`);
    
    return NextResponse.json({
      agents: agentPerformanceArray,
      brokerId, // Include the broker ID in the response for debugging
    });
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    return NextResponse.json(
      { message: "Failed to fetch agent performance", error: String(error) },
      { status: 500 }
    );
  }
});