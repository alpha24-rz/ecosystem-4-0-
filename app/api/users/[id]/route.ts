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
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const data = await request.json()

    // Prevent updating certain fields
    delete data._id
    delete data.uid
    delete data.email // Email should be updated through Firebase Auth
    delete data.createdAt

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
