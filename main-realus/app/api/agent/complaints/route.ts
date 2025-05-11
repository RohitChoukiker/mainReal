import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

// Define a simple schema for complaints if it doesn't exist
let ComplaintModel;

try {
  // Try to get the existing model
  ComplaintModel = mongoose.model("Complaint");
} catch (error) {
  // Model doesn't exist yet, create it
  const ComplaintSchema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      transactionId: { type: String, required: true },
      property: { type: String, required: true },
      submittedDate: { type: String, required: true },
      status: { 
        type: String, 
        enum: ["new", "in_progress", "resolved", "escalated"],
        default: "new"
      },
      priority: { 
        type: String, 
        enum: ["low", "medium", "high"],
        required: true
      },
      description: { type: String, required: true },
      category: { type: String, required: true },
      response: { type: String },
      agentId: { type: String, required: true },
    },
    { timestamps: true }
  );

  ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
}

// GET handler to fetch complaints
export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId") || "agent-123"; // Default for testing
    
    // Query the database for complaints
    let complaints = [];
    
    try {
      // Try to get complaints from the database
      complaints = await ComplaintModel.find({ agentId }).sort({ submittedDate: -1 });
      console.log(`Found ${complaints.length} complaints in database for agent ${agentId}`);
    } catch (dbError) {
      console.error("Error querying complaints from database:", dbError);
      // Return empty array instead of sample data
      complaints = [];
    }
    
    return NextResponse.json({
      complaints,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { message: "Failed to fetch complaints", error: String(error) },
      { status: 500 }
    );
  }
}

// POST handler to create a new complaint
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ["title", "transactionId", "property", "priority", "description", "category", "agentId"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate a unique ID for the complaint
    const complaintId = "comp-" + Math.floor(1000 + Math.random() * 9000);
    
    // Format the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Create a new complaint object
    const newComplaint = {
      id: complaintId,
      title: body.title,
      transactionId: body.transactionId,
      property: body.property,
      submittedDate: formattedDate,
      status: "new",
      priority: body.priority,
      description: body.description,
      category: body.category,
      agentId: body.agentId,
    };
    
    // Save the complaint to the database
    try {
      const savedComplaint = await ComplaintModel.create(newComplaint);
      console.log("Complaint saved to database:", savedComplaint);
      
      return NextResponse.json({
        complaint: savedComplaint,
        success: true,
        message: "Complaint submitted successfully",
      });
    } catch (dbError) {
      console.error("Error saving complaint to database:", dbError);
      return NextResponse.json(
        { message: "Failed to save complaint to database", error: String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json(
      { message: "Failed to create complaint", error: String(error) },
      { status: 500 }
    );
  }
}