import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  taskId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    taskId: {
      type: String,
      required: true,
      index: true
    },
    senderId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    senderRole: {
      type: String,
      required: true,
      enum: ['agent', 'tc']
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for faster queries
MessageSchema.index({ taskId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);