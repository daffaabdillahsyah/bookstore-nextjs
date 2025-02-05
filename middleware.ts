import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/books/new')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect checkout and user routes
  if (request.nextUrl.pathname.startsWith('/checkout') ||
      request.nextUrl.pathname.startsWith('/user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/checkout/:path*', 
    '/user/:path*',
    '/books/new'
  ],
}; 