import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Check connection status
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    
    // Get database name
    const dbName = mongoose.connection.name;
    
    // Get collections
    const collections = await mongoose.connection.db.collections();
    const collectionNames = collections.map(c => c.collectionName);
    
    return NextResponse.json({
      status: "success",
      connection: {
        state: connectionState,
        stateDescription: stateMap[connectionState],
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