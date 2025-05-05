import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log("Database connected successfully");
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        { message: "Failed to connect to database", error: String(dbConnectError) },
        { status: 500 }
      );
    }
    
    // For development purposes, we're using a hardcoded agent ID
    // In a production environment, you would get this from the authenticated user session
    const agentId = "dev-agent-id";
    
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const transactionId = formData.get("transactionId") as string;
    
    if (!file || !documentType || !transactionId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds the 10MB limit" },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    console.log("File type:", file.type);
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "File type not supported. Please upload PDF, DOCX, JPG, or PNG files." },
        { status: 400 }
      );
    }
    
    // For development purposes, we'll create a simulated file URL
    // In a production environment, you would upload the file to a storage service
    console.log("Creating simulated file URL for development...");
    
    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueId = Math.floor(Math.random() * 10000);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    
    // Create a simulated file URL
    const fileUrl = `https://example-storage.com/${transactionId}/${documentType.replace(/\s+/g, '_')}_${timestamp}_${uniqueId}_${safeFileName}`;
    console.log("Simulated file URL:", fileUrl);
    
    // Create a new document in the database
    console.log("Creating document in database...");
    let document;
    
    try {
      // Generate a document ID
      const documentId = "DOC-" + Math.floor(10000 + Math.random() * 90000);
      
      document = new DocumentModel({
        documentId, // Explicitly set the document ID
        transactionId,
        agentId,
        documentType,
        fileName: file.name,
        fileSize: file.size,
        fileUrl,
        status: "verifying", // Initial status is verifying
        aiVerified: false,
        uploadDate: new Date(),
      });
      
      // Save the document to the database
      await document.save();
      console.log("Document saved to database:", document.documentId);
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database operation failed: ${dbError.message}`);
    }
    
    // Return success response
    return NextResponse.json({
      message: "Document uploaded successfully",
      document: {
        id: document.documentId,
        name: documentType,
        fileName: file.name,
        transactionId,
        status: "verifying",
        uploadDate: document.uploadDate,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileUrl,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { message: "Failed to upload document", error: String(error) },
      { status: 500 }
    );
  }
}