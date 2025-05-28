import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Article } from "@/lib/models/article"
import slugify from "slugify"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const searchParams = request.nextUrl.searchParams
    const query: any = {}

    // Add filters
    if (searchParams.has("published")) {
      query.published = searchParams.get("published") === "true"
    }

    if (searchParams.has("category")) {
      query.category = searchParams.get("category")
    }

    if (searchParams.has("search")) {
      const searchTerm = searchParams.get("search")
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { author: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const articles = await db
      .collection("articles")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("articles").countDocuments(query)

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("ecosystem40")

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.content || !data.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate slug from title
    const baseSlug = slugify(data.title, { lower: true, strict: true })

    // Check if slug already exists
    let slug = baseSlug
    let counter = 1
    let slugExists = await db.collection("articles").findOne({ slug })

    while (slugExists) {
      slug = `${baseSlug}-${counter}`
      counter++
      slugExists = await db.collection("articles").findOne({ slug })
    }

    const article: Article = {
      ...data,
      slug,
      excerpt: data.excerpt || data.content.substring(0, 150) + "...",
      tags: data.tags || [],
      published: data.published || false,
      publishedAt: data.published ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("articles").insertOne(article)

    return NextResponse.json(
      {
        message: "Article created successfully",
        article: { ...article, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
