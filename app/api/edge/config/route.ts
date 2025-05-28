import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // Get user's location for personalized config
    const country = request.geo?.country || "US"
    const region = request.geo?.region || "Unknown"

    // Lightweight config that can be cached at edge
    const config = {
      environment: "production",
      region,
      country,
      features: {
        advancedAnalytics: true,
        betaFeatures: country === "US", // Enable beta features for US users
        realTimeNotifications: true,
      },
      cdn: {
        imageOptimization: true,
        staticAssetCaching: true,
      },
      timestamp: new Date().toISOString(),
    }

    const response = NextResponse.json(config)

    // Cache at edge for 1 hour
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600")
    response.headers.set("CDN-Cache-Control", "max-age=3600")

    return response
  } catch (error) {
    console.error("Edge config error:", error)
    return NextResponse.json({ error: "Configuration unavailable" }, { status: 500 })
  }
}
