import mongoose, { Schema, Document, Model } from "mongoose";

// Document Interface
export interface DocumentModel extends Document {
  documentId: string;
  transactionId: string;
  agentId: string;
  agentName?: string; // Added agent name field
  documentType: string;
  name?: string; // Added name field for consistency with TC document review
  fileName: string;
  fileSize: number;
  fileUrl: string;
  status: string;
  uploadDate: Date;
  aiVerified: boolean;
  aiScore?: number;
  issues?: string[];
}

// Schema Definition
const DocumentSchema: Schema = new Schema(
  {
    documentId: { type: String, required: true, unique: true }, // Now required since we're setting it explicitly
    transactionId: { type: String, required: true },
    agentId: { type: String, required: true },
    agentName: { type: String }, // Added agent name field
    documentType: { type: String, required: true },
    name: { type: String }, // Added name field for consistency with TC document review
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    status: { type: String, default: "verifying" },
    uploadDate: { type: Date, default: Date.now },
    aiVerified: { type: Boolean, default: false },
    aiScore: { type: Number },
    issues: [{ type: String }],
  },
  { timestamps: true }
);

// We're now generating the document ID explicitly in the API
// so we don't need the pre-save hook anymore

// Final Export
const DocumentModel: Model<DocumentModel> =
  mongoose.models.Document || mongoose.model<DocumentModel>("Document", DocumentSchema);

export default DocumentModel;