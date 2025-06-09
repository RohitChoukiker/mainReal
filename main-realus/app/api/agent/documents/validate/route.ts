import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";
import { validateDocument } from "@/utils/automationUtils";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse the request body
    const body = await req.json();
    const { documentId } = body;
    
    if (!documentId) {
      return NextResponse.json(
        { message: "Document ID is required" },
        { status: 400 }
      );
    }
    
    // Find the document in the database
    const document = await DocumentModel.findOne({ documentId });
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // Validate the document using AI OCR
    console.log(`Starting AI validation for document: ${documentId}`);
    const validationResult = await validateDocument(documentId);
    
    // Send email notification with validation results
    if (document.agentId) {
      await sendEmail({
        to: "agent@example.com", // In a real implementation, get the agent's email
        subject: "Document Validation Results",
        template: "document-validation-results",
        data: {
          recipientName: document.agentName || "Agent",
          documentId: document.documentId,
          documentName: document.name,
          transactionId: document.transactionId,
          aiScore: validationResult.aiScore,
          issues: validationResult.issues,
          status: validationResult.status,
          validationDate: new Date().toISOString()
        }
      });
    }
    
    return NextResponse.json({
      message: "Document validation completed",
      validation: validationResult
    });
  } catch (error) {
    console.error("Error validating document:", error);
    return NextResponse.json(
      { message: "Failed to validate document", error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check validation status
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get document ID from URL
    const url = new URL(req.url);
    const documentId = url.searchParams.get("documentId");
    
    if (!documentId) {
      return NextResponse.json(
        { message: "Document ID is required" },
        { status: 400 }
      );
    }
    
    // Find the document in the database
    const document = await DocumentModel.findOne({ documentId });
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // Return validation status
    return NextResponse.json({
      documentId: document.documentId,
      name: document.name,
      fileName: document.fileName,
      status: document.status,
      aiVerified: document.aiVerified,
      aiScore: document.aiScore,
      issues: document.issues || [],
      uploadDate: document.uploadDate
    });
  } catch (error) {
    console.error("Error checking document validation status:", error);
    return NextResponse.json(
      { message: "Failed to check validation status", error: String(error) },
      { status: 500 }
    );
  }
}