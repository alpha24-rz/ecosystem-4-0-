import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { NFT } from "@/lib/models/nft"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const searchParams = request.nextUrl.searchParams
    const query: any = {}

    // Add filters
    if (searchParams.has("status")) {
      query.status = searchParams.get("status")
    }

    if (searchParams.has("rarity")) {
      query.rarity = searchParams.get("rarity")
    }

    if (searchParams.has("search")) {
      const searchTerm = searchParams.get("search")
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tokenId: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const nfts = await db.collection("nfts").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    const total = await db.collection("nfts").countDocuments(query)

    return NextResponse.json({
      nfts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.image || !data.category || !data.rarity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const nft: NFT = {
      ...data,
      status: data.status || "pending",
      mintDate: data.mintDate || new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("nfts").insertOne(nft)

    return NextResponse.json(
      {
        message: "NFT created successfully",
        nft: { ...nft, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating NFT:", error)
    return NextResponse.json({ error: "Failed to create NFT" }, { status: 500 })
  }
}
