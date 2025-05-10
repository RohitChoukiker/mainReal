import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Overdue = 'overdue'
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export interface ITask extends Document {
  title: string;
  transactionId: string;
  propertyAddress?: string;
  agentId?: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  aiReminder: boolean;
  assignedBy?: string; // Who assigned this task
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    transactionId: { type: String, required: true },
    propertyAddress: { type: String },
    agentId: { type: String },
    dueDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: Object.values(TaskStatus),
      default: TaskStatus.Pending 
    },
    priority: { 
      type: String, 
      enum: Object.values(TaskPriority),
      default: TaskPriority.Medium 
    },
    description: { type: String },
    aiReminder: { type: Boolean, default: false },
    assignedBy: { type: String, default: "TC Manager" }
  },
  { timestamps: true }
);

// Create and export the model
export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);