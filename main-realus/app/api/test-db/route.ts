import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    return NextResponse.json({ message: "Database connection successful" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { message: "Database connection failed", error: String(error) },
      { status: 500 }
    );
  }
}