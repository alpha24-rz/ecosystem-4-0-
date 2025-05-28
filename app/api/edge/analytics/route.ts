import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const country = request.geo?.country || "Unknown"
    const region = request.geo?.region || "Unknown"

    // In production, send to analytics service
    const analyticsData = {
      ...body,
      timestamp: new Date().toISOString(),
      geo: { country, region },
      userAgent: request.headers.get("user-agent"),
    }

    // Mock analytics processing
    console.log("Analytics data:", analyticsData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process analytics" }, { status: 500 })
  }
}
