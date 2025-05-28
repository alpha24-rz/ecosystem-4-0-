export interface Article {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  image?: string
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
