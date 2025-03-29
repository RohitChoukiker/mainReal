import { NextResponse } from 'next/server';

export function catchAsync<T extends (req: Request) => Promise<Response>>(fn: T) {
  return async function (req: Request): Promise<Response> {
    try {
      return await fn(req);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
