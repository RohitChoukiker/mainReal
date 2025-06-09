import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { sendReminderForPendingDocuments } from "@/utils/automationUtils";

// This endpoint will be called by a cron job to send reminders
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check for authorization (in a real implementation, this would use a secure API key)
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const apiKey = authHeader.split(" ")[1];
    // In a real implementation, validate the API key against a stored value
    const validApiKey = process.env.AUTOMATION_API_KEY || "test-automation-key";
    
    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { message: "Invalid API key" },
        { status: 401 }
      );
    }
    
    // Send reminders for pending documents
    console.log("Starting to send reminders for pending documents");
    const reminderCount = await sendReminderForPendingDocuments();
    
    return NextResponse.json({
      message: "Reminders sent successfully",
      count: reminderCount
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { message: "Failed to send reminders", error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to manually trigger reminders (for testing)
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { message: "This endpoint is only available in development mode" },
        { status: 403 }
      );
    }
    
    // Send reminders for pending documents
    console.log("Manually triggering reminders for pending documents");
    const reminderCount = await sendReminderForPendingDocuments();
    
    return NextResponse.json({
      message: "Reminders sent successfully",
      count: reminderCount
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { message: "Failed to send reminders", error: String(error) },
      { status: 500 }
    );
  }
}