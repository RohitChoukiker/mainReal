import mongoose from "mongoose";

// Use environment variable for MongoDB URI
// WARNING: Never hardcode credentials in production code
const MONGO_URI = process.env.MONGODB_URI || 
  (process.env.NODE_ENV === 'production' 
    ? '' // In production, this should fail if MONGODB_URI is not set
    : "mongodb+srv://rohitchoukiker:sz9ngkji2s@cluster0.onuxs.mongodb.net/realus?retryWrites=true&w=majority");

// Initialize mongoose models
import "@/models/transactionModel";

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
    
    // Check if MONGO_URI is empty in production
    if (!MONGO_URI && process.env.NODE_ENV === 'production') {
      throw new Error("MONGODB_URI environment variable is required in production");
    }
    
    // Set connection options with correct types for mongoose 7+
    const options = {
      dbName: "realus",
      connectTimeoutMS: 10000, 
      socketTimeoutMS: 45000,  
      serverSelectionTimeoutMS: 10000, 
      heartbeatFrequencyMS: 30000, 
      retryWrites: true,
      // Remove the 'w' option as it's causing type issues
      // The write concern can be set in the connection string instead
    };
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, options);
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Error:", error);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, we should throw the error to prevent the app from running without a database
      throw error;
    } else {
      // For development, we'll handle this gracefully
      console.log("Using mock data due to database connection failure");
      
      // Set mongoose connection state to disconnected to prevent further connection attempts
      if (mongoose.connection.readyState !== 0) {
        try {
          await mongoose.disconnect();
          console.log("Mongoose disconnected after connection error");
        } catch (disconnectError) {
          console.error("Error disconnecting mongoose:", disconnectError);
        }
      }
    }
  } finally {
    // Reset connecting flag
    isConnecting = false;
  }
};

export default dbConnect;
