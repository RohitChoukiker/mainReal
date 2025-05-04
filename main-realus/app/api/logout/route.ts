import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Create a response that clears the token cookie
        const response = NextResponse.json({ 
            message: 'Logged out successfully' 
        }, { status: 200 });
        
        // Clear the token cookie
        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set expiration to the past to delete the cookie
            path: '/',
        });
        
        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json({ 
            message: 'Error during logout', 
            error: error.message 
        }, { status: 500 });
    }
}