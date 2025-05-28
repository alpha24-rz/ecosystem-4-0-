import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const country = request.geo?.country || "Unknown"
    const region = request.geo?.region || "Unknown"
    const city = request.geo?.city || "Unknown"

    // Enhanced analytics data with geo information
    const analyticsEvent = {
      ...data,
      geo: { country, region, city },
      timestamp: Date.now(),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    }

    // In production, you'd send this to your analytics service
    console.log("Analytics event:", analyticsEvent)

    const response = NextResponse.json({ success: true })

    // Don't cache analytics endpoints
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")

    return response
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Analytics unavailable" }, { status: 500 })
  }
}
