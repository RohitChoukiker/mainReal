import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://rohitchoukiker:sz9ngkji2s@cluster0.onuxs.mongodb.net/realus-100";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "realus",
    });
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Error:", error);
    // Don't exit the process, throw the error so it can be handled by the caller
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default dbConnect;
