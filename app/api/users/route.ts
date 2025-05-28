import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const searchParams = request.nextUrl.searchParams
    const query: any = {}

    // Add filters
    if (searchParams.has("role")) {
      query.role = searchParams.get("role")
    }

    if (searchParams.has("status")) {
      query.status = searchParams.get("status")
    }

    if (searchParams.has("search")) {
      const searchTerm = searchParams.get("search")
      query.$or = [
        { displayName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const users = await db.collection("users").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    const total = await db.collection("users").countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
