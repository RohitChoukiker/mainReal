import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function GET(req: NextRequest) {
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
    
    // Create a test document
    try {
      // Generate a document ID
      const documentId = "DOC-" + Math.floor(10000 + Math.random() * 90000);
      
      const document = new DocumentModel({
        documentId,
        transactionId: "TR-12345",
        agentId: "dev-agent-id",
        documentType: "Test Document",
        fileName: "test-document.pdf",
        fileSize: 1024 * 1024, // 1MB
        fileUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
        status: "pending",
        aiVerified: false,
        uploadDate: new Date(),
      });
      
      // Save the document to the database
      await document.save();
      console.log("Test document saved to database:", document.documentId);
      
      return NextResponse.json({
        message: "Test document created successfully",
        document: {
          id: document.documentId,
          name: document.documentType,
          transactionId: document.transactionId,
          agentId: document.agentId,
          fileName: document.fileName,
          uploadDate: document.uploadDate,
          status: document.status,
          aiVerified: document.aiVerified,
          fileSize: `${(document.fileSize / (1024 * 1024)).toFixed(1)} MB`,
          fileUrl: document.fileUrl,
        }
      });
    } catch (createError) {
      console.error("Error creating test document:", createError);
      return NextResponse.json(
        { message: "Failed to create test document", error: String(createError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in seed route:", error);
    return NextResponse.json(
      { message: "Failed to seed database", error: String(error) },
      { status: 500 }
    );
  }
}