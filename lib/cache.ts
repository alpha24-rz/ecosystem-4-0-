interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class ClientCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlMs = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get with stale-while-revalidate pattern
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs = 300000): Promise<T> {
    const cached = this.get<T>(key)
    if (cached) return cached

    try {
      const data = await fetcher()
      this.set(key, data, ttlMs)
      return data
    } catch (error) {
      // Return stale data if available
      const stale = this.cache.get(key)
      if (stale) return stale.data
      throw error
    }
  }
}

export const cache = new ClientCache()

// Utility functions for common cache patterns
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  project: (id: string) => `project:${id}`,
  nft: (id: string) => `nft:${id}`,
  projects: (page: number, limit: number) => `projects:${page}:${limit}`,
  nfts: (page: number, limit: number) => `nfts:${page}:${limit}`,
}
