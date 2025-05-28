import type { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }

    const current = rateLimitStore.get(ip)

    if (!current || current.resetTime < now) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return { success: true, remaining: config.maxRequests - 1 }
    }

    if (current.count >= config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
      }
    }

    current.count++
    return {
      success: true,
      remaining: config.maxRequests - current.count,
    }
  }
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
})
