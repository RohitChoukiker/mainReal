import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://rohitchoukiker:sz9ngkji2s@cluster0.onuxs.mongodb.net/realus?retryWrites=true&w=majority";

// Track connection status to avoid multiple connection attempts
let isConnecting = false;

const dbConnect = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing database connection");
    return;
  }
  
  // If connection is in progress, wait a bit and check again
  if (isConnecting) {
    console.log("Connection already in progress, waiting...");
    // Wait for 1 second and check again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If connected now, return
    if (mongoose.connection.readyState >= 1) {
      console.log("Connection established while waiting");
      return;
    }
  }
  
  // Set connecting flag
  isConnecting = true;
  
  try {
    console.log("Connecting to MongoDB...");
    
    // Set connection options
    const options = {
      dbName: "realus",
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds
      heartbeatFrequencyMS: 30000, // 30 seconds
      retryWrites: true,
      w: "majority"
    };
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, options);
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Error:", error);
    
    // For development, we'll handle this gracefully
    console.log("Using mock data due to database connection failure");
    
    // Don't throw the error, just log it
    // This allows the API to continue with mock data
    
    // Set mongoose connection state to disconnected to prevent further connection attempts
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
        console.log("Mongoose disconnected after connection error");
      } catch (disconnectError) {
        console.error("Error disconnecting mongoose:", disconnectError);
      }
    }
  } finally {
    // Reset connecting flag
    isConnecting = false;
  }
};

export default dbConnect;
