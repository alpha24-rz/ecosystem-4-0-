import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid NFT ID" }, { status: 400 })
    }

    const nft = await db.collection("nfts").findOne({ _id: new ObjectId(id) })

    if (!nft) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    return NextResponse.json(nft)
  } catch (error) {
    console.error("Error fetching NFT:", error)
    return NextResponse.json({ error: "Failed to fetch NFT" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid NFT ID" }, { status: 400 })
    }

    const data = await request.json()

    // Prevent updating certain fields
    delete data._id
    delete data.createdAt

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("nfts").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    const updatedNft = await db.collection("nfts").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "NFT updated successfully",
      nft: updatedNft,
    })
  } catch (error) {
    console.error("Error updating NFT:", error)
    return NextResponse.json({ error: "Failed to update NFT" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid NFT ID" }, { status: 400 })
    }

    const result = await db.collection("nfts").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "NFT deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting NFT:", error)
    return NextResponse.json({ error: "Failed to delete NFT" }, { status: 500 })
  }
}
