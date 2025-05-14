import { NextRequest, NextResponse } from "next/server";

// Socket functionality has been removed
// This API route now returns a static response

// API route handler
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Socket.io functionality has been disabled",
    status: "disabled"
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: "Socket.io functionality has been disabled",
    status: "disabled"
  });
}