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
    
    // For development purposes, we're using a hardcoded agent ID
    // In a production environment, you would get this from the authenticated user session
    const agentId = "dev-agent-id";
    
    // Get the transaction ID from the query parameters
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");
    
    // Build the query
    const query: any = { agentId };
    if (transactionId) {
      query.transactionId = transactionId;
    }
    
    // Fetch documents from the database
    let documents;
    try {
      documents = await DocumentModel.find(query).sort({ uploadDate: -1 });
      console.log(`Found ${documents.length} documents for query:`, query);
    } catch (fetchError) {
      console.error("Error fetching documents:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch documents", error: String(fetchError) },
        { status: 500 }
      );
    }
    
    // Format the documents for the frontend
    const formattedDocuments = documents.map(doc => ({
      id: doc.documentId,
      name: doc.documentType,
      transactionId: doc.transactionId,
      fileName: doc.fileName,
      uploadDate: doc.uploadDate ? doc.uploadDate.toLocaleDateString() : new Date().toLocaleDateString(),
      status: doc.status || "verifying",
      aiVerified: doc.aiVerified || false,
      aiScore: doc.aiScore,
      issues: doc.issues || [],
      fileSize: `${((doc.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB`,
      // Always provide a valid fileUrl
      fileUrl: doc.fileUrl || "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    }));
    
    // Return the documents
    return NextResponse.json({
      documents: formattedDocuments
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Failed to fetch documents", error: String(error) },
      { status: 500 }
    );
  }
}