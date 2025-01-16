import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// List of protected routes
const protectedRoutes = ['/input'];

export function middleware(req) {
  // Check if the current route is protected
  const { pathname } = req.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    // Get the token from cookies
    const token = req.cookies.get('authToken')?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next(); // Allow access
    } catch (error) {
      console.error('Token verification failed:', error);
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/input'], // Apply middleware to specific routes
};
