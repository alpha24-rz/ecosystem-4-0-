import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import slugify from "slugify"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    const data = await request.json()
    const currentArticle = await db.collection("articles").findOne({ _id: new ObjectId(id) })

    if (!currentArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Prevent updating certain fields
    delete data._id
    delete data.createdAt

    // Update slug if title changed
    let slug = currentArticle.slug
    if (data.title && data.title !== currentArticle.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true })

      // Check if slug already exists
      slug = baseSlug
      let counter = 1
      let slugExists = await db.collection("articles").findOne({
        slug,
        _id: { $ne: new ObjectId(id) },
      })

      while (slugExists) {
        slug = `${baseSlug}-${counter}`
        counter++
        slugExists = await db.collection("articles").findOne({
          slug,
          _id: { $ne: new ObjectId(id) },
        })
      }
    }

    // Update publishedAt if publishing for the first time
    let publishedAt = currentArticle.publishedAt
    if (data.published === true && !currentArticle.published) {
      publishedAt = new Date()
    }

    const updateData = {
      ...data,
      slug,
      publishedAt,
      updatedAt: new Date(),
    }

    const result = await db.collection("articles").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    const updatedArticle = await db.collection("articles").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Article updated successfully",
      article: updatedArticle,
    })
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const id = params.id

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 })
    }

    const result = await db.collection("articles").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Article deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
