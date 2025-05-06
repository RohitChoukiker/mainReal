import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transaction";
import User, { Role } from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;
    
    let brokerId;
    let userId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        userId = decoded.id;
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (broker && broker.role === Role.Broker) {
          brokerId = broker.brokerId;
          console.log("Found broker with ID:", brokerId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // If we couldn't get the brokerId from the session, use the query parameter
    if (!brokerId) {
      brokerId = url.searchParams.get("brokerId");
      
      // If still no brokerId, try to get it from the database using a default broker
      if (!brokerId && userId) {
        try {
          // Try to find any broker in the system
          const anyBroker = await User.findOne({ role: Role.Broker });
          if (anyBroker) {
            brokerId = anyBroker.brokerId;
            console.log("Using broker ID from database:", brokerId);
          }
        } catch (err) {
          console.error("Error finding default broker:", err);
        }
      }
      
      // If we still don't have a broker ID, return an error
      if (!brokerId) {
        console.log("No broker ID found, cannot proceed");
        return NextResponse.json(
          { message: "No broker ID found. Please log in as a broker." },
          { status: 400 }
        );
      }
    }
    
    console.log("Final brokerId for transaction query:", brokerId);
    
    // Query transactions for this broker
    const query = { brokerId };
    
    // Get total count for pagination
    const total = await TransactionModel.countDocuments(query);
    
    // Get transactions
    const transactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Found ${transactions.length} transactions for broker ${brokerId}`);
    
    // We'll only use real data from the database
    console.log("Using only real transaction data from the database");
    
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
}