"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "./auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { user, userData, loading, isAdmin, isSuperAdmin } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requireSuperAdmin && !isSuperAdmin()) {
        router.push("/")
        return
      }

      if (requireAdmin && !isAdmin()) {
        router.push("/")
        return
      }
    }
  }, [user, userData, loading, requireAdmin, requireSuperAdmin, isAdmin, isSuperAdmin, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    return null
  }

  if (requireAdmin && !isAdmin()) {
    return null
  }

  return <>{children}</>
}
