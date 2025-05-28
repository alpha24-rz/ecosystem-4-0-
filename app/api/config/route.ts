import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export async function GET() {
  try {
    // This endpoint can use the CUSTOM_KEY for various purposes
    // For example: API authentication, feature flags, etc.

    const config = {
      environment: env.nodeEnv,
      features: {
        // Use CUSTOM_KEY to enable/disable features
        advancedAnalytics: env.customKey === "advanced_features_enabled",
        betaFeatures: env.customKey === "beta_access_granted",
        // Add more feature flags based on your CUSTOM_KEY value
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
