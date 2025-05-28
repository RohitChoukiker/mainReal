import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define role-based route access
const roleBasedRoutes = {
  'Agent': ['/agent'],
  'Broker': ['/broker'],
  'Tc': ['/tc'],
};

// Define public routes that don't need authentication
const publicRoutes = [
  '/',
  '/landing',
  '/api/login',
  '/api/signup',
  '/api/forgot-password',
  '/api/reset-password',
];

// Define API routes that need token verification but not role checking
const protectedApiRoutes = [
  '/api/user',
  '/api/profile',
  '/api/user/status',
  '/api/agent/transactions',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is a public route or an asset (like images, css, etc.)
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
  const isAsset = path.includes('/_next') || 
                  path.includes('/images') || 
                  path.includes('/fonts') ||
                  path.includes('/favicon.ico');
  
  // If it's a public route or an asset, allow access
  if (isPublicRoute || isAsset) {
    return NextResponse.next();
  }
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If no token is present, redirect to landing page
  if (!token) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }
  
  try {
    // Verify the token
    const secret = new TextEncoder().encode("123123123 "); // Make sure this matches the JWT_SECRET in login/route.ts and user/status/route.ts
    const { payload } = await jwtVerify(token, secret);
    
    // Check if token has role information
    if (!payload.role) {
      console.error('Token missing role information');
      return NextResponse.redirect(new URL('/landing', request.url));
    }
    
    // For protected API routes, just verify the token without role checking
    const isProtectedApiRoute = protectedApiRoutes.some(route => path.startsWith(route));
    if (isProtectedApiRoute) {
      return NextResponse.next();
    }
    
    // Check role-based access for application routes
    const userRole = payload.role as string;
    const allowedPaths = roleBasedRoutes[userRole] || [];
    
    // Check if the user has access to the requested path
    const hasAccess = allowedPaths.some(allowedPath => path.startsWith(allowedPath));
    
    if (!hasAccess) {
      console.error(`User with role ${userRole} attempted to access unauthorized path: ${path}`);
      
      // Redirect to the appropriate dashboard based on role
      if (userRole === 'Agent') {
        return NextResponse.redirect(new URL('/agent/dashboard', request.url));
      } else if (userRole === 'Broker') {
        return NextResponse.redirect(new URL('/broker/dashboard', request.url));
      } else if (userRole === 'Tc') {
        return NextResponse.redirect(new URL('/tc/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/landing', request.url));
      }
    }
    
    // User has the correct role for the path, allow access
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to landing page
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/landing', request.url));
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};