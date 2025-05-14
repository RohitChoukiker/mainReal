import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the Complaint interface
interface IComplaint extends Document {
  id: string;
  title: string;
  transactionId: string;
  property: string;
  submittedDate: string;
  status: "new" | "in_progress" | "resolved" | "escalated";
  priority: "low" | "medium" | "high";
  description: string;
  category: string;
  response?: string;
  agentId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define a simple schema for complaints if it doesn't exist
let ComplaintModel: Model<IComplaint>;

try {
  // Try to get the existing model
  ComplaintModel = mongoose.model<IComplaint>("Complaint");
} catch (error) {
  // Model doesn't exist yet, create it
  const ComplaintSchema = new Schema<IComplaint>(
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
      assignedTo: { type: String },
    },
    { timestamps: true }
  );

  ComplaintModel = mongoose.model<IComplaint>("Complaint", ComplaintSchema);
}

// GET handler to fetch complaints for TC
export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const tcId = url.searchParams.get("tcId") || "tc-123"; // Default for testing
    
    // Build query
    let query: mongoose.FilterQuery<IComplaint> = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status as IComplaint['status'];
    }
    
    // Filter by assigned TC or unassigned complaints
    query.$or = [
      { assignedTo: tcId },
      { assignedTo: { $exists: false } },
      { assignedTo: null }
    ];
    
    // Query the database for complaints
    const complaints = await ComplaintModel.find(query).sort({ createdAt: -1 });
    console.log(`Found ${complaints.length} complaints for TC in database`);
    
    // Format complaints for TC view
    const formattedComplaints = complaints.map(complaint => {
      // Get agent name from agentId (in a real app, you would query the agent database)
      // For now, we'll use a placeholder
      const agentName = "Agent " + complaint.agentId.substring(complaint.agentId.length - 3);
      
      return {
        id: complaint.id,
        title: complaint.title,
        transactionId: complaint.transactionId,
        property: complaint.property,
        agent: {
          name: agentName,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        submittedDate: complaint.submittedDate,
        status: complaint.status,
        priority: complaint.priority,
        description: complaint.description,
        category: complaint.category,
        response: complaint.response,
      };
    });
    
    return NextResponse.json({
      complaints: formattedComplaints,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching complaints for TC:", error);
    return NextResponse.json(
      { message: "Failed to fetch complaints", error: String(error) },
      { status: 500 }
    );
  }
}

// POST handler to update a complaint (respond, resolve, etc.)
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { message: "Complaint ID is required" },
        { status: 400 }
      );
    }
    
    // Find the complaint by ID
    const complaint = await ComplaintModel.findOne({ id: body.id });
    
    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }
    
    // Update fields if provided
    if (body.status) {
      complaint.status = body.status;
    }
    
    if (body.response) {
      complaint.response = body.response;
    }
    
    // Save the updated complaint
    await complaint.save();
    
    return NextResponse.json({
      complaint,
      success: true,
      message: "Complaint updated successfully",
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    return NextResponse.json(
      { message: "Failed to update complaint", error: String(error) },
      { status: 500 }
    );
  }
}