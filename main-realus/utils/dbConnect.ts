import mongoose from "mongoose";

const MONGO_URI= process.env.MONGO_URI as string;

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
    process.exit(1);
  }
};

export default dbConnect;
