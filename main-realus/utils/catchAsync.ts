import { NextRequest, NextResponse } from 'next/server';

export default function catchAsync<T extends (req: NextRequest) => Promise<Response>>(fn: T) {
  return async function (req: NextRequest): Promise<Response> {
    try {
      return await fn(req);
    } catch (error: any) {
      console.error("Caught error in catchAsync:", error);
      
      // Create a more detailed error response
      const errorMessage = error.message || 'Internal Server Error';
      const errorStack = process.env.NODE_ENV === 'development' ? error.stack : undefined;
      const errorCode = error.code || 'UNKNOWN_ERROR';
      
      // Log detailed error information
      console.error(`API Error: ${errorMessage}`);
      console.error(`Error Code: ${errorCode}`);
      if (errorStack) {
        console.error(`Stack Trace: ${errorStack}`);
      }
      
      return NextResponse.json(
        { 
          message: errorMessage,
          code: errorCode,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  };
}
