"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Smartphone, LogOut } from "lucide-react"
import { useEnhancedAuth } from "@/components/auth/enhanced-auth-provider"

export default function EnhancedAdminAuthPage() {
  const router = useRouter()
  const { user, userData, adminSignIn, logout, setup2FA, verify2FA, disable2FA, getLoginHistory, isAdmin, loading } =
    useEnhancedAuth()

  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginHistory, setLoginHistory] = useState<any[]>([])

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [twoFactorSetup, setTwoFactorSetup] = useState({
    secret: "",
    qrCode: "",
    backupCodes: [],
    verificationCode: "",
  })

  useEffect(() => {
    if (user && userData && isAdmin()) {
      router.push("/admin")
    }
  }, [user, userData, isAdmin, router])

  useEffect(() => {
    if (user && userData) {
      loadLoginHistory()
    }
  }, [user, userData])

  const loadLoginHistory = async () => {
    try {
      const history = await getLoginHistory()
      setLoginHistory(history.slice(0, 10)) // Show last 10 attempts
    } catch (error) {
      console.error("Error loading login history:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await adminSignIn(loginForm.email, loginForm.password)

      if (result.success) {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => router.push("/admin"), 1500)
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetup2FA = async () => {
    setIsSubmitting(true)
    try {
      const setup = await setup2FA()
      setTwoFactorSetup({
        ...setup,
        verificationCode: "",
      })
      setActiveTab("2fa-setup")
      setSuccess("2FA setup initiated. Please scan the QR code with your authenticator app.")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify2FA = async () => {
    setIsSubmitting(true)
    try {
      const isValid = await verify2FA(twoFactorSetup.verificationCode)
      if (isValid) {
        setSuccess("Two-factor authentication enabled successfully!")
        setActiveTab("security")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDisable2FA = async () => {
    setIsSubmitting(true)
    try {
      await disable2FA()
      setSuccess("Two-factor authentication disabled.")
      setActiveTab("security")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // If user is already logged in and is admin, show security dashboard
  if (user && userData && isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-6 w-6" />
                Security Dashboard
              </CardTitle>
              <CardDescription className="text-gray-300">Manage your admin account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="history">Login History</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="security" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-gray-400 text-sm">{userData.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={userData.twoFactorEnabled ? "default" : "secondary"}>
                          {userData.twoFactorEnabled ? "Active" : "Inactive"}
                        </Badge>
                        {userData.twoFactorEnabled ? (
                          <Button variant="outline" onClick={handleDisable2FA} disabled={isSubmitting}>
                            Disable
                          </Button>
                        ) : (
                          <Button onClick={handleSetup2FA} disabled={isSubmitting}>
                            <Smartphone className="mr-2 h-4 w-4" />
                            Enable 2FA
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">Account Role</h3>
                        <p className="text-gray-400 text-sm">{userData.role}</p>
                      </div>
                      <Badge variant="default">{userData.role}</Badge>
                    </div>

                    <Button variant="destructive" onClick={logout} className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-2">
                    {loginHistory.map((attempt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-white/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {attempt.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <div>
                            <p className="text-white text-sm">
                              {attempt.success ? "Successful login" : "Failed login attempt"}
                            </p>
                            <p className="text-gray-400 text-xs">{new Date(attempt.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{attempt.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sessions" className="space-y-4">
                  <div className="p-4 border border-white/20 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Current Session</h3>
                    <p className="text-gray-400 text-sm">Active since login</p>
                    <Button variant="outline" className="mt-2" onClick={logout}>
                      End Session
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Login form for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
              <CardDescription className="text-gray-300">Sign in to access the admin panel</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
