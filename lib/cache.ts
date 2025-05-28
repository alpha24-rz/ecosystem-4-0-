"use client"

import React from "react"

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class ClientCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlSeconds = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  // Cache with stale-while-revalidate pattern
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300): Promise<T> {
    const cached = this.get<T>(key)

    if (cached) {
      return cached
    }

    const data = await fetcher()
    this.set(key, data, ttlSeconds)
    return data
  }
}

export const clientCache = new ClientCache()

// React hook for cached data fetching
export function useCachedFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    clientCache
      .getOrFetch(key, fetcher, ttlSeconds)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [key, ttlSeconds])

  return { data, loading, error }
}
