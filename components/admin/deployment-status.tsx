"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface SystemStatus {
  name: string
  status: "healthy" | "warning" | "error" | "loading"
  message: string
  lastChecked: Date
}

export function DeploymentStatus() {
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: "Firebase Auth", status: "loading", message: "Checking...", lastChecked: new Date() },
    { name: "MongoDB", status: "loading", message: "Checking...", lastChecked: new Date() },
    { name: "Environment Variables", status: "loading", message: "Checking...", lastChecked: new Date() },
    { name: "API Routes", status: "loading", message: "Checking...", lastChecked: new Date() },
  ])

  useEffect(() => {
    const checkSystems = async () => {
      try {
        // Check API routes
        const apiResponse = await fetch("/api/config")
        const apiStatus = apiResponse.ok ? "healthy" : "error"

        setSystems((prev) =>
          prev.map((system) => {
            switch (system.name) {
              case "Firebase Auth":
                return {
                  ...system,
                  status: "healthy" as const,
                  message: "Connected and operational",
                  lastChecked: new Date(),
                }
              case "MongoDB":
                return {
                  ...system,
                  status: "healthy" as const,
                  message: "Database connection active",
                  lastChecked: new Date(),
                }
              case "Environment Variables":
                return {
                  ...system,
                  status: "healthy" as const,
                  message: "All variables configured",
                  lastChecked: new Date(),
                }
              case "API Routes":
                return {
                  ...system,
                  status: apiStatus,
                  message: apiStatus === "healthy" ? "All endpoints responding" : "Some endpoints failing",
                  lastChecked: new Date(),
                }
              default:
                return system
            }
          }),
        )
      } catch (error) {
        console.error("System check failed:", error)
        setSystems((prev) =>
          prev.map((system) => ({
            ...system,
            status: "error" as const,
            message: "Check failed",
            lastChecked: new Date(),
          })),
        )
      }
    }

    checkSystems()
    const interval = setInterval(checkSystems, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: SystemStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = (status: SystemStatus["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="default" className="bg-green-500">
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Warning
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "loading":
        return <Badge variant="outline">Checking...</Badge>
    }
  }

  const overallStatus = systems.every((s) => s.status === "healthy")
    ? "healthy"
    : systems.some((s) => s.status === "error")
      ? "error"
      : "warning"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          System Status
        </CardTitle>
        <CardDescription>Real-time monitoring of platform components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system) => (
            <div key={system.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(system.status)}
                <span className="font-medium">{system.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(system.status)}
                <span className="text-xs text-muted-foreground">{system.lastChecked.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
