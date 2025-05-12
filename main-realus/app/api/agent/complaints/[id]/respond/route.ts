import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ComplaintSchema } from "@/models/complaintModel";

let ComplaintModel: mongoose.Model<any>;

// Connect to MongoDB
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/realus";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
  
  // Initialize models if they don't exist
  if (!ComplaintModel) {
    ComplaintModel = mongoose.model("Complaint", ComplaintSchema);
  }
}

// POST handler to respond to a complaint
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await dbConnect();
    
    const complaintId = params.id;
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.response) {
      return NextResponse.json(
        { message: "Response text is required" },
        { status: 400 }
      );
    }
    
    // Find the complaint by ID
    const complaint = await ComplaintModel.findOne({ id: complaintId });
    
    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }
    
    // Update the complaint with the response
    complaint.response = body.response;
    
    // Update status if provided
    if (body.status) {
      complaint.status = body.status;
    }
    
    // Save the updated complaint
    await complaint.save();
    
    return NextResponse.json({
      complaint,
      success: true,
      message: "Response submitted successfully",
    });
  } catch (error) {
    console.error("Error responding to complaint:", error);
    return NextResponse.json(
      { message: "Failed to respond to complaint", error: String(error) },
      { status: 500 }
    );
  }
}