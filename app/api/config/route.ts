import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.info("Config API endpoint accessed")

    const config = {
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
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
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  } catch (error) {
    logger.error("Config API error", { error: error instanceof Error ? error.message : "Unknown error" })
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
