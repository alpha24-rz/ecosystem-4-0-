import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /admin)
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/admin"]
  const adminRoutes = ["/admin"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // For now, we'll handle client-side authentication
  // In a production app, you might want to verify the Firebase token here
  if (isProtectedRoute) {
    // Let the client-side handle the authentication check
    return NextResponse.next()
  }

  return NextResponse.next()
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
