"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [cacheHitRate, setCacheHitRate] = useState<number>(0)

  useEffect(() => {
    // Collect Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.entryType === "paint" && entry.name === "first-contentful-paint") {
          setMetrics((prev) => ({ ...prev!, fcp: entry.startTime }))
        }

        if (entry.entryType === "largest-contentful-paint") {
          setMetrics((prev) => ({ ...prev!, lcp: entry.startTime }))
        }

        if (entry.entryType === "first-input") {
          setMetrics((prev) => ({ ...prev!, fid: (entry as any).processingStart - entry.startTime }))
        }

        if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
          setMetrics((prev) => ({ ...prev!, cls: (prev?.cls || 0) + (entry as any).value }))
        }
      })
    })

    observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "first-input", "layout-shift"] })

    // Calculate cache hit rate
    const calculateCacheHitRate = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]

      const cachedResources = resources.filter(
        (resource) => resource.transferSize === 0 || resource.transferSize < resource.encodedBodySize,
      )

      const hitRate = (cachedResources.length / resources.length) * 100
      setCacheHitRate(hitRate)
    }

    setTimeout(calculateCacheHitRate, 2000)

    return () => observer.disconnect()
  }, [])

  const getScoreColor = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    }

    const threshold = thresholds[metric]
    if (!threshold) return "secondary"

    if (value <= threshold.good) return "default"
    if (value <= threshold.poor) return "secondary"
    return "destructive"
  }

  if (!metrics) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">First Contentful Paint</p>
            <Badge variant={getScoreColor("fcp", metrics.fcp)}>{Math.round(metrics.fcp)}ms</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Largest Contentful Paint</p>
            <Badge variant={getScoreColor("lcp", metrics.lcp)}>{Math.round(metrics.lcp)}ms</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">First Input Delay</p>
            <Badge variant={getScoreColor("fid", metrics.fid)}>{Math.round(metrics.fid)}ms</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Cumulative Layout Shift</p>
            <Badge variant={getScoreColor("cls", metrics.cls)}>{metrics.cls.toFixed(3)}</Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Cache Hit Rate</p>
            <Badge variant={cacheHitRate > 70 ? "default" : "secondary"}>{Math.round(cacheHitRate)}%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
