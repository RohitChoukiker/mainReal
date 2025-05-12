import mongoose, { Schema, Document } from 'mongoose';

export interface IClosureRequest extends Document {
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedDate: Date;
  notes?: string;
  brokerNotes?: string;
  transaction?: any; // Reference to the transaction
}

const ClosureRequestSchema: Schema = new Schema(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    submittedDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String
    },
    brokerNotes: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for populating transaction
ClosureRequestSchema.virtual('transaction', {
  ref: 'Transaction',
  localField: 'transactionId',
  foreignField: '_id',
  justOne: true
});

// Check if model already exists to prevent overwrite during hot reloading
const ClosureRequestModel = mongoose.models.ClosureRequest || 
  mongoose.model<IClosureRequest>('ClosureRequest', ClosureRequestSchema);

export default ClosureRequestModel;