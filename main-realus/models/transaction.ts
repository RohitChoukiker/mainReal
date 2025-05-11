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
// Check if the model exists first to avoid errors
let TransactionModel: Model<Transaction>;

try {
  // Try to get the existing model
  TransactionModel = mongoose.model<Transaction>("Transaction");
  console.log("Using existing Transaction model from transaction.ts");
} catch (error) {
  // Model doesn't exist yet, create it
  TransactionModel = mongoose.model<Transaction>("Transaction", TransactionSchema);
  console.log("Created new Transaction model from transaction.ts");
}

export default TransactionModel;