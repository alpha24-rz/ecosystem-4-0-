"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
  })

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "paint":
            if (entry.name === "first-contentful-paint") {
              setMetrics((prev) => ({ ...prev, fcp: entry.startTime }))
            }
            break
          case "largest-contentful-paint":
            setMetrics((prev) => ({ ...prev, lcp: entry.startTime }))
            break
          case "first-input":
            setMetrics((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }))
            break
          case "layout-shift":
            if (!(entry as any).hadRecentInput) {
              setMetrics((prev) => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }))
            }
            break
        }
      }
    })

    try {
      observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "first-input", "layout-shift"] })
    } catch (error) {
      console.warn("Performance observer not supported:", error)
    }

    return () => observer.disconnect()
  }, [])

  // Don't render anything - this is just for monitoring
  return null
}
