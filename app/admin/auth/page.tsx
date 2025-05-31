"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function AdminAuthPage() {
  const router = useRouter()
  const { user, userData, adminSignIn, isAdmin } = useAuthContext()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if user is already authenticated as admin
  useEffect(() => {
    if (user && userData && isAdmin()) {
      router.push("/admin")
    } else if (user && userData && !isAdmin()) {
      router.push("/")
    }
  }, [user, userData, isAdmin, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No admin account found with this email address."
      case "auth/wrong-password":
        return "Incorrect password. Please try again."
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      case "auth/network-request-failed":
        return "Network error. Please check your connection."
      default:
        return "Access denied. Admin privileges required."
    }
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const result = await adminSignIn(formData.email, formData.password)

      if (result.error) {
        setError(getFirebaseErrorMessage(result.error))
      } else {
        setSuccess("Admin login successful! Redirecting...")
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      }
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
              <CardDescription className="text-gray-300">Secure login for Ecosystem 4.0 administrators</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500 text-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/50 border-green-500 text-green-100">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your admin email"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-400">
                <Link href="/admin/forgot-password" className="text-purple-400 hover:underline">
                  Forgot your admin password?
                </Link>
              </div>

              <div className="border-t border-white/20 pt-4">
                <Link href="/auth" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  ← Back to User Login
                </Link>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-200">
                  <strong>Security Notice:</strong> This is a restricted area. All access attempts are logged and
                  monitored.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ecosystem 4.0 Branding */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <Leaf className="h-5 w-5" />
            <span className="font-medium">Ecosystem 4.0</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
