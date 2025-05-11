import mongoose, { Schema, Document, Model } from "mongoose";

// Transaction Type Enum
export enum TransactionType {
  Purchase = "Purchase",
  Sale = "Sale",
  Lease = "Lease",
  Refinance = "Refinance",
}

// Transaction Status Enum
export enum TransactionStatus {
  New = "New",
  InProgress = "InProgress",
  PendingDocuments = "PendingDocuments",
  UnderReview = "UnderReview",
  Approved = "Approved",
  Closed = "Closed",
  Cancelled = "Cancelled",
}

// Transaction Interface
export interface Transaction extends Document {
  transactionId: string;
  agentId: string;
  brokerId: string;
  transactionCoordinatorId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  transactionType: TransactionType;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  closingDate: Date;
  status: TransactionStatus;
  notes?: string;
  documents?: Array<{
    name: string;
    url: string;
    uploadedAt: Date;
    required: boolean;
    approved: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema Definition
const TransactionSchema: Schema<Transaction> = new Schema<Transaction>(
  {
    transactionId: { type: String, required: true, unique: true },
    agentId: { type: String, required: true },
    brokerId: { type: String, required: true, index: true }, // Add index for faster queries
    transactionCoordinatorId: { type: String },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    propertyAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    price: { type: Number, required: true },
    closingDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.New,
    },
    notes: { type: String },
    documents: {
      type: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        required: { type: Boolean, default: true },
        approved: { type: Boolean, default: false },
      }],
      default: [],
    },
  },
  { timestamps: true }
);

// We'll skip the pre-save hook since we're manually setting the transaction ID
// This avoids potential issues with the hook not being called correctly
// TransactionSchema.pre("save", async function (this: Transaction, next) {
//   if (!this.transactionId) {
//     // Generate a random transaction ID if not provided
//     this.transactionId = "TR-" + Math.floor(10000 + Math.random() * 90000);
//   }
//   next();
// });

// Final Export
// Check if the model exists first to avoid errors
let TransactionModel: Model<Transaction>;

try {
  // Try to get the existing model
  TransactionModel = mongoose.model<Transaction>("Transaction");
  console.log("Using existing Transaction model");
} catch (error) {
  // Model doesn't exist yet, create it
  TransactionModel = mongoose.model<Transaction>("Transaction", TransactionSchema);
  console.log("Created new Transaction model");
}

export default TransactionModel;