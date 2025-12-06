// src/lib/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables");
}

export interface DecodedUser {
  _id: string;
  name: string;
  email: string;
  role: "Broker" | "Agent" | "TC";
  brokerId: string;
  iat: number;
  exp: number;
}

export const getUserFromToken = (token: string): DecodedUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as DecodedUser;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
