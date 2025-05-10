import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // For testing, we'll just query all transactions
    const query = {};
    
    // Get total count for pagination
    const total = await TransactionModel.countDocuments(query);
    
    // Get transactions from database
    let transactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Found ${transactions.length} transactions in database`);
    
    // If we don't have any transactions from the database, try to get them from the in-memory API
    if (transactions.length === 0) {
      try {
        console.log("No transactions found in database, trying in-memory API");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/agent/transactions/add-simple`);
        if (response.ok) {
          const data = await response.json();
          if (data.transactions && data.transactions.length > 0) {
            console.log(`Found ${data.transactions.length} transactions from in-memory API`);
            
            // Use all in-memory transactions
            const allTransactions = data.transactions;
            
            // Apply pagination
            const inMemoryTotal = allTransactions.length;
            const paginatedTransactions = allTransactions.slice(skip, skip + limit);
            
            console.log(`Using ${paginatedTransactions.length} in-memory transactions`);
            
            return NextResponse.json({
              transactions: paginatedTransactions,
              pagination: {
                total: inMemoryTotal,
                page,
                limit,
                pages: Math.ceil(inMemoryTotal / limit),
              },
            });
          }
        }
      } catch (memoryError) {
        console.error("Error fetching from in-memory API:", memoryError);
      }
    }
    
    // Return database transactions if we have them
    console.log(`Returning ${transactions.length} transactions from database`);
    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: String(error) },
      { status: 500 }
    );
  }
}