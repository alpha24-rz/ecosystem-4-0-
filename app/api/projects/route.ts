import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Project } from "@/lib/models/project"

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

    if (searchParams.has("category")) {
      query.category = searchParams.get("category")
    }

    if (searchParams.has("search")) {
      const searchTerm = searchParams.get("search")
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const projects = await db
      .collection("projects")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("projects").countDocuments(query)

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.category || !data.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project: Project = {
      ...data,
      status: data.status || "active",
      progress: data.progress || 0,
      participants: data.participants || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("projects").insertOne(project)

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: { ...project, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
