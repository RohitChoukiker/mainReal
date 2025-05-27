import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function GET(req: NextRequest) {
  try {
    console.log("TC transactions API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
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
    
    // Create a query to show transactions assigned to this TC
    // If no TC ID is available, show all transactions (for development/testing)
    const query: any = {};
    
    if (tcId) {
      // Filter by transactions assigned to this TC
      // Either directly assigned or unassigned (transactionCoordinatorId is null or undefined)
      query.$or = [
        { transactionCoordinatorId: tcId },
        { transactionCoordinatorId: { $exists: false } },
        { transactionCoordinatorId: null }
      ];
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
          // Log the agent ID for debugging
          console.log(`Looking up agent with ID: ${transactions[i].agentId}, type: ${typeof transactions[i].agentId}`);
          
          // Check if the transaction already has an agent name
          if (transactions[i].agentName) {
            console.log(`Transaction already has agent name: ${transactions[i].agentName}`);
            // Make sure it's accessible in the expected format
            (transactions[i] as any).agentName = transactions[i].agentName;
          } else {
            // Try to find the agent by ID
            let agent = null;
            
            try {
              // First try direct lookup by ID
              agent = await User.findById(transactions[i].agentId);
            } catch (idError) {
              console.log(`Error finding agent by direct ID: ${idError}`);
              // If that fails, try a more general query
              try {
                agent = await User.findOne({ _id: transactions[i].agentId });
              } catch (queryError) {
                console.log(`Error finding agent by query: ${queryError}`);
              }
            }
            
            if (agent) {
              // Add agent name to transaction
              (transactions[i] as any).agentName = agent.name || "Unknown Agent";
              console.log(`Added agent name "${(transactions[i] as any).agentName}" to transaction ${transactions[i].transactionId || String(transactions[i]._id)}`);
            } else {
              // If agent not found, set a default name
              (transactions[i] as any).agentName = "Unknown Agent";
              console.log(`Agent not found for transaction ${transactions[i].transactionId || String(transactions[i]._id)}, using default name`);
            }
          }
          
          // IMPORTANT: Make sure agentName is set as a direct property for the frontend
          // This ensures it's accessible in the expected format
          transactions[i] = {
            ...transactions[i].toObject(),
            agentName: (transactions[i] as any).agentName || "Unknown Agent"
          };
          
          console.log(`Final agent name for transaction ${transactions[i].transactionId}: ${transactions[i].agentName}`);
          
        } catch (error) {
          console.error(`Error finding agent for transaction ${transactions[i].transactionId || String(transactions[i]._id)}:`, error);
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
                // Log the agent ID for debugging
                console.log(`Looking up agent for in-memory transaction with ID: ${transactions[i].agentId}, type: ${typeof transactions[i].agentId}`);
                
                // Check if the transaction already has an agent name
                if (transactions[i].agentName) {
                  console.log(`In-memory transaction already has agent name: ${transactions[i].agentName}`);
                  // Make sure it's accessible in the expected format
                  (transactions[i] as any).agentName = transactions[i].agentName;
                } else {
                  // Try to find the agent by ID
                  let agent = null;
                  
                  try {
                    // First try direct lookup by ID
                    agent = await User.findById(transactions[i].agentId);
                  } catch (idError) {
                    console.log(`Error finding agent by direct ID: ${idError}`);
                    // If that fails, try a more general query
                    try {
                      agent = await User.findOne({ _id: transactions[i].agentId });
                    } catch (queryError) {
                      console.log(`Error finding agent by query: ${queryError}`);
                    }
                  }
                  
                  if (agent) {
                    // Add agent name to transaction
                    (transactions[i] as any).agentName = agent.name || "Unknown Agent";
                    console.log(`Added agent name "${(transactions[i] as any).agentName}" to in-memory transaction ${i}`);
                  } else {
                    // If agent not found, set a default name
                    (transactions[i] as any).agentName = "Unknown Agent";
                    console.log(`Agent not found for in-memory transaction ${i}, using default name`);
                  }
                }
                
                // IMPORTANT: Make sure agentName is set as a direct property for the frontend
                // This ensures it's accessible in the expected format
                transactions[i] = {
                  ...transactions[i],
                  agentName: (transactions[i] as any).agentName || "Unknown Agent"
                };
                
                console.log(`Final agent name for in-memory transaction ${i}: ${transactions[i].agentName}`);
                
              } catch (error) {
                console.error(`Error finding agent for in-memory transaction ${i}:`, error);
                // Set a default name in case of error
                (transactions[i] as any).agentName = "Unknown Agent";
              }
            }
            
            // Apply pagination
            total = transactions.length;
            transactions = transactions.slice(skip, skip + limit);
          }
        }
      } catch (memoryError) {
        console.error("Error fetching from in-memory API:", memoryError);
      }
    }
    
    // If we still don't have any transactions, create some demo ones
    if (transactions.length === 0) {
      console.log("No transactions found in database or in-memory API");
      transactions = [];
      total = 0;
    }
    
    // We're using data from both the database and in-memory storage if needed
    console.log(`Returning ${transactions.length} transactions (total: ${total})`);
    
    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      tcId, // Include the TC ID in the response for debugging
    });
  } catch (error) {
    console.error("Error fetching TC transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: String(error) },
      { status: 500 }
    );
  }
}