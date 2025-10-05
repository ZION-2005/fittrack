import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/workouts', '/logs', '/profile', '/feed'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is not authenticated and trying to access protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Only redirect from login/register if we have a valid token
  // We can't verify the token in middleware, so we'll let the client-side handle this
  // This prevents issues with invalid/expired tokens
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
