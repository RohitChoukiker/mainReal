import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { detectPotentialDelays } from "@/utils/automationUtils";

// This endpoint will be called by a cron job to detect potential delays
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
    
    // Detect potential delays
    console.log("Starting predictive analytics for delay detection");
    const potentialDelays = await detectPotentialDelays();
    
    return NextResponse.json({
      message: "Predictive analytics completed",
      potentialDelays,
      count: potentialDelays.length
    });
  } catch (error) {
    console.error("Error running predictive analytics:", error);
    return NextResponse.json(
      { message: "Failed to run predictive analytics", error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to manually trigger predictive analytics (for testing)
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
    
    // Detect potential delays
    console.log("Manually triggering predictive analytics for delay detection");
    const potentialDelays = await detectPotentialDelays();
    
    return NextResponse.json({
      message: "Predictive analytics completed",
      potentialDelays,
      count: potentialDelays.length
    });
  } catch (error) {
    console.error("Error running predictive analytics:", error);
    return NextResponse.json(
      { message: "Failed to run predictive analytics", error: String(error) },
      { status: 500 }
    );
  }
}