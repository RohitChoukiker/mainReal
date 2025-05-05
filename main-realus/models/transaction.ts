import mongoose, { Schema, Document, Model } from "mongoose";

// Transaction Interface
export interface Transaction extends Document {
  transactionId: string;
  agentId: string;
  brokerId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  transactionType: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  closingDate: Date;
  status: string;
  notes?: string;
}

// Schema Definition
const TransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    agentId: { type: String, required: true },
    brokerId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    transactionType: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    price: { type: Number, required: true },
    closingDate: { type: Date, required: true },
    status: { type: String, default: "New" },
    notes: { type: String },
  },
  { timestamps: true }
);

// Final Export
const TransactionModel: Model<Transaction> =
  mongoose.models.Transaction || mongoose.model<Transaction>("Transaction", TransactionSchema);

export default TransactionModel;