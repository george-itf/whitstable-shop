import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware disabled for now - auth checks handled in pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
