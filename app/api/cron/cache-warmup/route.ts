import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Warm up critical endpoints
    const endpoints = ["/api/config", "/api/projects?limit=10", "/api/nfts?limit=10", "/api/articles?limit=5"]

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const promises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`)
        return { endpoint, status: response.status, success: response.ok }
      } catch (error) {
        return {
          endpoint,
          status: 500,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    const results = await Promise.all(promises)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cache warmup failed",
      },
      { status: 500 },
    )
  }
}
