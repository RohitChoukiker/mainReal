import { NextRequest } from 'next/server';
import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "123123123 "; // Make sure this matches your app's secret

interface LoggedInUser {
  id: string;
  role: string;
  isApproved?: boolean;
  [key: string]: any;
}

/**
 * Extracts the logged-in user's details from a Next.js API request (Edge or Node).
 * Returns null if not authenticated or token invalid.
 */
export function getLoggedInUser(req: NextRequest | NextApiRequest): LoggedInUser | null {
  try {
    // For Edge API routes (NextRequest)
    let token: string | undefined;
    if ('cookies' in req && typeof req.cookies.get === 'function') {
      token = req.cookies.get('token')?.value;
    } else if ('headers' in req && typeof req.headers.get === 'function') {
      // Edge runtime, fallback
      const cookieHeader = req.headers.get('cookie') || '';
      token = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('token='))?.split('=')[1];
    } else if ('cookies' in req) {
      // Node.js API routes (NextApiRequest)
      // req.cookies can be an object
      // @ts-ignore
      token = req.cookies['token'];
    }
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as LoggedInUser;
    return decoded;
  } catch (error) {
    console.error('Error extracting logged-in user:', error);
    return null;
  }
} 