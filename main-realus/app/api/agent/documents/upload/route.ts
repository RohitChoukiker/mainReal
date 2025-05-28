import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";
import { uploadToCloudinary } from "@/utils/cloudinary";

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
    
    // For development purposes, we're using a hardcoded agent ID and name
    // In a production environment, you would get this from the authenticated user session
    const agentId = "dev-agent-id";
    const agentName = "John Developer"; // Added agent name
    
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
    
    // Upload file to Cloudinary
    console.log("Uploading file to Cloudinary...");
    
    let fileUrl;
    try {
      // Convert file to buffer for Cloudinary upload
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Create a folder structure based on transaction ID
      const folderPath = `documents/${transactionId}`;
      
      // Create a unique public ID for the file
      const publicId = `${documentType.replace(/\s+/g, '_')}_${Date.now()}`;
      
      // Add metadata for better organization and searchability
      const metadata = {
        transactionId,
        agentId,
        documentType,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        tags: [transactionId, documentType, 'agent-upload']
      };
      
      // Upload to Cloudinary using our utility function
      const cloudinaryUploadResult = await uploadToCloudinary(buffer, folderPath, publicId, metadata);
      
      // Extract the secure URL from the Cloudinary response
      fileUrl = cloudinaryUploadResult.secure_url;
      console.log("File uploaded to Cloudinary:", fileUrl);
    } catch (cloudinaryError) {
      console.error("Error uploading to Cloudinary:", cloudinaryError);
      return NextResponse.json(
        { message: "Failed to upload document to cloud storage", error: String(cloudinaryError) },
        { status: 500 }
      );
    }
    
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
        agentName, // Added agent name
        documentType: documentType, // Document type (e.g., "Purchase Agreement")
        name: documentType, // Set name same as documentType for consistency
        fileName: file.name,
        fileSize: file.size,
        fileUrl, // Use the Cloudinary URL
        status: "verifying", // Initial status is verifying
        aiVerified: false,
        uploadDate: new Date(),
      });
      
      // Save the document to the database
      await document.save();
      console.log("Document saved to database:", document.documentId);
    } catch (dbError) {
      console.error("Database error:", dbError);
      const errorMessage = dbError instanceof Error 
        ? dbError.message 
        : 'Unknown database error';
      throw new Error(`Database operation failed: ${errorMessage}`);
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
        agentId: document.agentId,
        agentName: document.agentName,
        documentType: document.documentType,
        aiVerified: document.aiVerified,
        cloudinary: {
          stored: true,
          provider: "cloudinary"
        }
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