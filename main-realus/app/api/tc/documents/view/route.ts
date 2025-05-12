import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log("Database connected successfully for document view");
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
    
    console.log(`Fetching document with ID: ${documentId} for viewing`);
    
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
      
      console.log("Found document for viewing:", document.documentId);
      
      // Check if the document has a fileUrl
      if (!document.fileUrl) {
        console.error(`Document has no fileUrl: ${documentId}`);
        return NextResponse.json(
          { message: "Document URL not available" },
          { status: 404 }
        );
      }
      
      // For demo purposes, we'll create a PDF viewer URL
      // In a real application, this would be a URL to a secure document viewer
      // or a signed URL to access the document from cloud storage
      
      // For now, we'll use Google Docs Viewer as a simple PDF viewer
      const viewUrl = document.fileUrl.startsWith('http') 
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(document.fileUrl)}&embedded=true` 
        : document.fileUrl;
      
      return NextResponse.json({
        message: "Document view URL generated successfully",
        viewUrl,
        documentId: document.documentId,
        documentName: document.documentType,
        fileName: document.fileName
      });
    } catch (fetchError) {
      console.error("Error fetching document:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch document", error: String(fetchError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in document view API:", error);
    return NextResponse.json(
      { message: "Failed to generate document view URL", error: String(error) },
      { status: 500 }
    );
  }
}