import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Enum for Roles
export enum Role {
  Agent = "Agent",
  Broker = "Broker",
  TransactionCoordinator = "TransactionCoordinator",
}

// User Interface
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  companyName: string;
  teamName: string;
  address: string;
  companyPhone: string;
  city: string;
  state: string;
  pinCode: string;
  timeZone: string;
  role: Role;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema with TypeScript
const UserSchema: Schema<User> = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required :true},
    mobile: { type: String, required: true },
    companyName: { type: String, required: false },
    teamName: { type: String, required: false },
    address: { type: String, required: false },
    companyPhone: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    pinCode: { type: String, required: false },
    timeZone: { type: String, required: false },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save Hook for Password Hashing
UserSchema.pre("save", async function (this: User, next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare Password Method
UserSchema.methods.comparePassword = async function (
  this: User,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Model Export with TypeScript
const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;