import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const country = request.geo?.country || "Unknown"
    const region = request.geo?.region || "Unknown"

    const config = {
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      geo: {
        country,
        region,
      },
      features: {
        authentication: true,
        nftMinting: true,
        projectManagement: true,
        analytics: true,
      },
      status: "operational",
    }

    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
