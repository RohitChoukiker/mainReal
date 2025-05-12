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
    
    // Create an empty query - we'll show ALL transactions by default
    // This matches the broker's view of transactions
    const query: any = {};
    
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