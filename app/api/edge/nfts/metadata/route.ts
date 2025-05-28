import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "NFT ID required" }, { status: 400 })
    }

    // Lightweight NFT metadata that can be cached
    const metadata = {
      id,
      name: `Environmental NFT #${id}`,
      description: "A unique environmental conservation NFT",
      image: `/api/nfts/${id}/image`,
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Environmental Impact", value: "High" },
        { trait_type: "Carbon Offset", value: "1.5 tons" },
      ],
      external_url: `${request.nextUrl.origin}/nfts/${id}`,
    }

    const response = NextResponse.json(metadata)

    // Cache NFT metadata for 24 hours
    response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400")
    response.headers.set("CDN-Cache-Control", "max-age=86400")

    return response
  } catch (error) {
    console.error("NFT metadata error:", error)
    return NextResponse.json({ error: "Metadata unavailable" }, { status: 500 })
  }
}
