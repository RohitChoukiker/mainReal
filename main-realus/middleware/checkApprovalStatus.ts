import { NextRequest, NextResponse } from 'next/server';
import { Role } from '../models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 " as string;

// This function checks if a user is approved and redirects accordingly
export async function checkApprovalStatus(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return null; // No token, let the page handle it
  }
  
  try {
    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: string;
      role: string;
      isApproved?: boolean;
    };
    
    // If user is a broker, they're automatically approved
    if (decoded.role === Role.Broker) {
      return { isApproved: true, role: decoded.role };
    }
    
    // For agents and TCs, check approval status
    return { 
      isApproved: decoded.isApproved || false,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}