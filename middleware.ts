import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/profile", "/admin"]

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization")
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]
    const [user, pwd] = atob(authValue).split(":")

    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  if (protectedRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/api/auth", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
}
