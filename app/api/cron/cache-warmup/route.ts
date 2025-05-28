import { NextResponse } from "next/server"

export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    // Warm up critical pages and API endpoints
    const urlsToWarm = ["/", "/projects", "/nfts", "/learn", "/api/edge/config", "/api/projects", "/api/nfts"]

    const warmupPromises = urlsToWarm.map(async (url) => {
      try {
        const response = await fetch(`${baseUrl}${url}`, {
          headers: { "User-Agent": "Vercel-Cache-Warmup" },
        })
        return { url, status: response.status, success: response.ok }
      } catch (error) {
        return { url, status: 0, success: false, error: error.message }
      }
    })

    const results = await Promise.all(warmupPromises)

    console.log("Cache warmup completed:", results)

    return NextResponse.json({
      success: true,
      warmedUrls: results.length,
      results,
    })
  } catch (error) {
    console.error("Cache warmup failed:", error)
    return NextResponse.json({ error: "Cache warmup failed" }, { status: 500 })
  }
}
