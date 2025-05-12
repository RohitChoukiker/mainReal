import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import TransactionModel from "@/models/transactionModel";
import ClosureRequestModel from "@/models/closureRequestModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123123123 " as string;

export async function GET(request: NextRequest) {
  try {
    console.log("Broker closure requests API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let brokerId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (broker && broker.role === "broker") {
          // Use the broker's ID
          brokerId = broker._id.toString();
          console.log("Found broker with ID:", brokerId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // If we couldn't get the brokerId from the token, use a fallback
    if (!brokerId) {
      // Get from query params if available
      const url = new URL(request.url);
      brokerId = url.searchParams.get("brokerId");
      
      // If still no brokerId, use a fallback
      if (!brokerId) {
        brokerId = "test-broker-id";
        console.log("Using fallback broker ID:", brokerId);
      }
    }
    
    console.log("Final brokerId for closure requests query:", brokerId);
    
    // Try to fetch closure requests from the database
    let closureRequests = [];
    try {
      // In a real implementation, we would filter by brokerId
      // For now, we'll get all closure requests
      closureRequests = await ClosureRequestModel.find()
        .populate({
          path: 'transaction',
          populate: [
            { path: 'agent' },
            { path: 'tc' },
            { path: 'documents' }
          ]
        })
        .sort({ submittedDate: -1 });
      
      console.log(`Found ${closureRequests.length} closure requests in database`);
    } catch (error) {
      console.error("Error fetching closure requests from database:", error);
    }
    
    // If no closure requests found in database, return empty array
    if (closureRequests.length === 0) {
      console.log("No closure requests found in database, returning empty array");
      closureRequests = [];
    }
    
    // Format the response
    const formattedRequests = closureRequests.map(request => {
      const totalDocuments = request.transaction.documents ? request.transaction.documents.length : 0;
      const verifiedDocuments = request.transaction.documents ? 
        request.transaction.documents.filter(doc => doc.status === "verified").length : 0;
      
      // Format dates
      const closingDate = request.transaction.closingDate instanceof Date ? 
        request.transaction.closingDate.toISOString().split('T')[0] : 
        request.transaction.closingDate;
        
      const submittedDate = request.submittedDate instanceof Date ? 
        request.submittedDate.toISOString().split('T')[0] : 
        request.submittedDate;

      return {
        id: request.id,
        transactionId: request.transactionId,
        property: request.transaction.property.address,
        client: request.transaction.client.name,
        agent: {
          name: request.transaction.agent.name,
          avatar: request.transaction.agent.avatar || "/placeholder.svg?height=40&width=40"
        },
        tc: {
          name: request.transaction.tc.name,
          avatar: request.transaction.tc.avatar || "/placeholder.svg?height=40&width=40"
        },
        closingDate: closingDate,
        status: request.status,
        submittedDate: submittedDate,
        notes: request.notes,
        documents: {
          total: totalDocuments,
          verified: verifiedDocuments
        }
      };
    });

    return NextResponse.json({ closureRequests: formattedRequests });
  } catch (error) {
    console.error("Error fetching closure requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch closure requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Broker update closure request API called");
    
    // Connect to database
    await dbConnect();
    console.log("Database connected");
    
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;
    console.log("Token from cookies:", token ? "Found" : "Not found");
    
    let brokerId;
    
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        
        // Find the broker in the database
        const broker = await User.findById(decoded.id);
        
        if (broker && broker.role === "broker") {
          // Use the broker's ID
          brokerId = broker._id.toString();
          console.log("Found broker with ID:", brokerId);
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);
    
    const { requestId, status, notes } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }
    
    console.log(`Updating closure request ${requestId} to status ${status}`);
    
    // Try to update the closure request in the database
    let updatedRequest;
    try {
      // Find the closure request
      const closureRequest = await ClosureRequestModel.findById(requestId);
      
      if (!closureRequest) {
        console.log(`Closure request ${requestId} not found in database`);
        return NextResponse.json(
          { error: "Closure request not found" },
          { status: 404 }
        );
      } else {
        // Update the closure request
        closureRequest.status = status;
        closureRequest.brokerNotes = notes || "";
        await closureRequest.save();
        
        updatedRequest = closureRequest;
        console.log(`Closure request ${requestId} updated in database`);
      }
      
      // Update the transaction status if needed
      if (status === "approved" || status === "rejected") {
        const transactionStatus = status === "approved" ? "approved_for_closure" : "closure_rejected";
        
        try {
          const transaction = await TransactionModel.findById(updatedRequest.transactionId);
          
          if (transaction) {
            transaction.status = transactionStatus;
            transaction.brokerNotes = notes || "";
            await transaction.save();
            console.log(`Transaction ${updatedRequest.transactionId} status updated to ${transactionStatus}`);
          } else {
            console.log(`Transaction ${updatedRequest.transactionId} not found in database`);
          }
        } catch (error) {
          console.error(`Error updating transaction ${updatedRequest.transactionId}:`, error);
        }
      }
      
      // If completed, update the transaction status to closed
      if (status === "completed") {
        try {
          const transaction = await TransactionModel.findById(updatedRequest.transactionId);
          
          if (transaction) {
            transaction.status = "closed";
            transaction.brokerNotes = notes || "";
            transaction.closedDate = new Date();
            await transaction.save();
            console.log(`Transaction ${updatedRequest.transactionId} marked as closed`);
          } else {
            console.log(`Transaction ${updatedRequest.transactionId} not found in database`);
          }
        } catch (error) {
          console.error(`Error closing transaction ${updatedRequest.transactionId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error updating closure request in database:", error);
      return NextResponse.json(
        { error: "Failed to update closure request in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      request: updatedRequest 
    });
  } catch (error) {
    console.error("Error updating closure request:", error);
    return NextResponse.json(
      { error: "Failed to update closure request" },
      { status: 500 }
    );
  }
}