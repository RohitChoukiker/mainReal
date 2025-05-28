import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log("Database connected successfully for document download");
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        { message: "Failed to connect to database", error: String(dbConnectError) },
        { status: 500 }
      );
    }
    
    // Get the document ID from the query parameters
    const url = new URL(req.url);
    const documentId = url.searchParams.get("documentId");
    
    if (!documentId) {
      return NextResponse.json(
        { message: "Missing document ID" },
        { status: 400 }
      );
    }
    
    console.log(`Fetching document with ID: ${documentId} for download`);
    
    // Find the document in the database
    try {
      // Try to find the document by documentId
      let document = await DocumentModel.findOne({ documentId });
      
      // If not found and documentId looks like a MongoDB _id, try that
      if (!document && documentId.length === 24) {
        try {
          document = await DocumentModel.findById(documentId);
          console.log("Found document by using documentId as _id");
        } catch (err) {
          console.log("Error finding document by using documentId as _id:", err);
        }
      }
      
      if (!document) {
        console.error(`Document not found with ID: ${documentId}`);
        return NextResponse.json(
          { message: "Document not found" },
          { status: 404 }
        );
      }
      
      console.log("Found document for download:", document.documentId);
      
      // Check if the document has a fileUrl
      if (!document.fileUrl) {
        console.error(`Document has no fileUrl: ${documentId}`);
        return NextResponse.json(
          { message: "Document URL not available" },
          { status: 404 }
        );
      }
      
      // In a real application, this would be a signed URL to download the document from cloud storage
      // For demo purposes, we'll just return the fileUrl
      const downloadUrl = document.fileUrl;
      
      return NextResponse.json({
        message: "Document download URL generated successfully",
        downloadUrl,
        documentId: document.documentId,
        documentName: document.name || document.documentType,
        fileName: document.fileName,
        fileType: document.fileName.split('.').pop() || 'pdf',
        fileSize: document.fileSize,
        uploadDate: document.uploadDate
      });
    } catch (fetchError) {
      console.error("Error fetching document:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch document", error: String(fetchError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in document download API:", error);
    return NextResponse.json(
      { message: "Failed to generate document download URL", error: String(error) },
      { status: 500 }
    );
  }
}