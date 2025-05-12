import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DocumentModel from "@/models/document";

export async function POST(req: NextRequest) {
  console.log("TC documents update API called");
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log("Database connected successfully for document update");
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        { message: "Failed to connect to database", error: String(dbConnectError) },
        { status: 500 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { documentId, status, comments, _id } = body;
    
    console.log("Request body:", body);
    
    if (!documentId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Update the document in the database
    try {
      console.log(`Updating document with ID: ${documentId} to status: ${status}`);
      
      // Try to find the document by documentId
      let document = await DocumentModel.findOne({ documentId });
      
      // If not found and _id is provided, try to find by _id
      if (!document && _id) {
        try {
          document = await DocumentModel.findById(_id);
          console.log("Found document by _id instead of documentId");
        } catch (err) {
          console.log("Error finding document by _id:", err);
        }
      }
      
      // If still not found and documentId looks like a MongoDB _id, try that
      if (!document && documentId && documentId.length === 24) {
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
      
      console.log("Found document:", JSON.stringify(document));
      
      document.status = status;
      if (comments) {
        document.issues = Array.isArray(document.issues) ? [...document.issues, comments] : [comments];
      }
      
      await document.save();
      console.log(`Document ${documentId} updated with status: ${status}`);
      
      return NextResponse.json({
        message: "Document updated successfully",
        document: {
          id: document.documentId,
          status: document.status,
          issues: document.issues
        }
      });
    } catch (updateError) {
      console.error("Error updating document:", updateError);
      return NextResponse.json(
        { message: "Failed to update document", error: String(updateError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { message: "Failed to update document", error: String(error) },
      { status: 500 }
    );
  }
}