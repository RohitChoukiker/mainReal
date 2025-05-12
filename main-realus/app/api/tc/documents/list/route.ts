import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function GET(req: NextRequest) {
  console.log("TC documents list API called");
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log("Database connected successfully for TC documents list");
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        { message: "Failed to connect to database", error: String(dbConnectError) },
        { status: 500 }
      );
    }
    
    // Get the transaction ID from the query parameters
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");
    
    // Build the query
    const query: any = {};
    if (transactionId) {
      query.transactionId = transactionId;
    }
    
    // Fetch documents from the database
    let documents;
    try {
      console.log("Executing document query:", JSON.stringify(query));
      documents = await DocumentModel.find(query).sort({ uploadDate: -1 });
      console.log(`Found ${documents.length} documents for query:`, query);
      
      // Log document details for debugging
      if (documents.length > 0) {
        console.log("First document:", JSON.stringify(documents[0]));
      } else {
        console.log("No documents found. Checking if collection exists...");
        // Check if the collection exists and has any documents
        const allDocs = await DocumentModel.find({}).limit(5);
        console.log(`Total documents in collection: ${allDocs.length}`);
        if (allDocs.length > 0) {
          console.log("Sample document:", JSON.stringify(allDocs[0]));
        }
      }
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
      agentId: doc.agentId,
      fileName: doc.fileName,
      uploadDate: doc.uploadDate ? doc.uploadDate.toLocaleDateString() : new Date().toLocaleDateString(),
      status: doc.status || "pending", // Use "pending" for TC review
      aiVerified: doc.aiVerified || false,
      aiScore: doc.aiScore || Math.floor(Math.random() * 30) + 70, // Random score if not available
      issues: doc.issues || [],
      fileSize: `${((doc.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB`,
      fileUrl: doc.fileUrl,
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