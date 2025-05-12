import mongoose, { Schema, Document } from 'mongoose';

export enum ComplaintStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Resolved = 'resolved',
  Closed = 'closed'
}

export enum ComplaintPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical'
}

export interface IComplaint extends Document {
  id: string;
  title: string;
  description: string;
  transactionId?: string;
  propertyAddress?: string;
  submittedBy: string; // User ID
  submitterName: string; // User name
  submitterRole: string; // User role
  assignedTo?: string; // User ID
  status: ComplaintStatus;
  priority: ComplaintPriority;
  response?: string;
  responseBy?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ComplaintSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    transactionId: { type: String },
    propertyAddress: { type: String },
    submittedBy: { type: String, required: true },
    submitterName: { type: String, required: true },
    submitterRole: { type: String, required: true },
    assignedTo: { type: String },
    status: { 
      type: String, 
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.Open,
      index: true
    },
    priority: { 
      type: String, 
      enum: Object.values(ComplaintPriority),
      default: ComplaintPriority.Medium 
    },
    response: { type: String },
    responseBy: { type: String },
    responseDate: { type: Date }
  },
  { timestamps: true }
);

// Create and export the model
export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);