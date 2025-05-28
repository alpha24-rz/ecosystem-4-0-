import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    const response = NextResponse.next()

    // Add security headers
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    // Cache static assets aggressively
    if (path.startsWith("/_next/static/") || path.includes(".")) {
      response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
    }

    // Cache API responses with shorter TTL
    if (path.startsWith("/api/")) {
      // Don't cache auth-related endpoints
      if (path.includes("/auth") || path.includes("/users")) {
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
      } else {
        // Cache other API responses for 5 minutes
        response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300")
      }
    }

    // Cache pages with ISR
    if (!path.startsWith("/api/") && !path.startsWith("/_next/")) {
      response.headers.set("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400")
    }

    // Define protected routes
    const protectedRoutes = ["/dashboard", "/admin", "/user"]
    const adminRoutes = ["/admin"]

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
    const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

    // Add geolocation data for analytics
    const country = request.geo?.country || "Unknown"
    const region = request.geo?.region || "Unknown"
    response.headers.set("X-User-Country", country)
    response.headers.set("X-User-Region", region)

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
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
