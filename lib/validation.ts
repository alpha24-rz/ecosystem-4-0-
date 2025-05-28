import { z } from "zod"

// User validation schemas
export const userSchema = z.object({
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["user", "admin"]).default("user"),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
})

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(["reforestation", "cleanup", "conservation", "education"]),
  location: z.string().min(2).max(100),
  targetAmount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// NFT validation schemas
export const nftSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  image: z.string().url(),
  category: z.enum(["tree", "cleanup", "wildlife", "energy"]),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
})

// Article validation schemas
export const articleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  author: z.string().min(2).max(100),
  category: z.enum(["news", "education", "research", "community"]),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().default(false),
})
