import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "NFT ID is required" }, { status: 400 })
    }

    // Mock NFT metadata - in production, fetch from database
    const metadata = {
      id,
      name: `Environmental NFT #${id}`,
      description: "A unique environmental conservation NFT",
      image: `/placeholder.svg?height=400&width=400`,
      attributes: [
        { trait_type: "Category", value: "Tree Planting" },
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Impact", value: "High" },
      ],
      external_url: `https://ecosystem40.com/nfts/${id}`,
    }

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch NFT metadata" }, { status: 500 })
  }
}
