import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Check connection status
    const connectionState = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    
    // Get database name
    const dbName = mongoose.connection.name;
    
    // Get collections
    let collectionNames: string[] = [];
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      collectionNames = collections.map(c => c.collectionName);
    } else {
      console.warn("Database connection not fully established yet");
    }
    
    return NextResponse.json({
      status: "success",
      connection: {
        state: connectionState,
        stateDescription: stateMap[connectionState as number] || "unknown",
        database: dbName,
        collections: collectionNames,
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database connection test failed", 
        error: String(error) 
      },
      { status: 500 }
    );
  }
}