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
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const data = await request.json()

    // Prevent updating certain fields
    delete data._id
    delete data.createdAt

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("projects").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updatedProject = await db.collection("projects").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
