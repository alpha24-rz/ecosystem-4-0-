"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Leaf, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function AuthPage() {
  const router = useRouter()
  const { user, signUp, signIn, signInWithGoogle, signInWithTwitter } = useAuthContext()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Check if email is admin email
  const checkIfAdminEmail = (email: string) => {
    const adminEmails = ["alfakiddrock7@gmail.com", "admin@ecosystem40.com", "superadmin@ecosystem40.com"]
    return adminEmails.includes(email.toLowerCase())
  }

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")

    // Check if admin email for visual feedback
    if (name === "email") {
      setIsAdminLogin(checkIfAdminEmail(value))
    }
  }

  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address."
      case "auth/wrong-password":
        return "Incorrect password. Please try again."
      case "auth/email-already-in-use":
        return "An account with this email already exists."
      case "auth/weak-password":
        return "Password should be at least 6 characters long."
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      case "auth/network-request-failed":
        return "Network error. Please check your connection."
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled. Please try again."
      case "auth/cancelled-popup-request":
        return "Only one popup request is allowed at a time."
      default:
        return "An error occurred. Please try again."
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

    if (!isLogin) {
      if (!formData.name.trim()) {
        setError("Please enter your full name")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (!formData.acceptTerms) {
        setError("Please accept the Terms of Service and Privacy Policy")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      let result

      if (isLogin) {
        result = await signIn(formData.email, formData.password)

        if (result.user && !result.error) {
          // Check user role and redirect accordingly
          const { checkAdminStatus } = await import("@/lib/admin-utils")
          const adminStatus = await checkAdminStatus(result.user.uid)

          if (adminStatus.isAdmin) {
            setSuccess("Admin login successful! Redirecting to admin panel...")
            setTimeout(() => {
              router.push("/admin")
            }, 1500)
          } else {
            setSuccess("Login successful! Redirecting...")
            setTimeout(() => {
              router.push("/dashboard")
            }, 1500)
          }
        }
      } else {
        result = await signUp(formData.email, formData.password, formData.name.trim())

        if (result.user && !result.error) {
          // Check if this is an admin email and upgrade if needed
          if (checkIfAdminEmail(formData.email)) {
            const { createAdminUser } = await import("@/lib/admin-utils")
            await createAdminUser(result.user.uid, formData.email, formData.name.trim(), "admin", "system")
            setSuccess("Admin account created successfully! Redirecting to admin panel...")
            setTimeout(() => {
              router.push("/admin")
            }, 1500)
          } else {
            setSuccess("Account created successfully! Redirecting...")
            setTimeout(() => {
              router.push("/dashboard")
            }, 1500)
          }
        }
      }

      if (result.error) {
        setError(getFirebaseErrorMessage(result.error))
      }
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithGoogle()
      if (result.error) {
        setError(getFirebaseErrorMessage(result.error))
      } else {
        // Check user role and redirect accordingly
        const { checkAdminStatus } = await import("@/lib/admin-utils")
        const adminStatus = await checkAdminStatus(result.user!.uid)

        if (adminStatus.isAdmin) {
          setSuccess("Admin Google sign-in successful! Redirecting to admin panel...")
          setTimeout(() => {
            router.push("/admin")
          }, 1500)
        } else {
          setSuccess("Google sign-in successful! Redirecting...")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
      }
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleTwitterSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithTwitter()
      if (result.error) {
        setError(getFirebaseErrorMessage(result.error))
      } else {
        // Check user role and redirect accordingly
        const { checkAdminStatus } = await import("@/lib/admin-utils")
        const adminStatus = await checkAdminStatus(result.user!.uid)

        if (adminStatus.isAdmin) {
          setSuccess("Admin Twitter sign-in successful! Redirecting to admin panel...")
          setTimeout(() => {
            router.push("/admin")
          }, 1500)
        } else {
          setSuccess("Twitter sign-in successful! Redirecting...")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
      }
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    })
    setIsAdminLogin(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Card - Image */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 z-10" />
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Environmental conservation - tree planting and nature restoration"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl">Ecosystem 4.0</span>
                  </div>
                  <h2 className="text-2xl font-bold">Join the Environmental Revolution</h2>
                  <p className="text-white/90 max-w-md">
                    Make a real impact on our planet while earning NFT rewards for your environmental contributions.
                    Every action counts in building a sustainable future.
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified Impact</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>NFT Rewards</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Global Community</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Form */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="w-full max-w-md mx-auto space-y-6">
                {/* Mobile Logo */}
                <div className="text-center lg:hidden mb-8">
                  <Link href="/" className="inline-flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Ecosystem 4.0
                    </span>
                  </Link>
                </div>

                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <h1 className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                    {isAdminLogin && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {isLogin
                      ? isAdminLogin
                        ? "Sign in to access the admin panel"
                        : "Sign in to continue your environmental journey"
                      : isAdminLogin
                        ? "Create your admin account"
                        : "Join thousands making a difference for our planet"}
                  </p>
                </div>

                {/* Admin Notice */}
                {isAdminLogin && (
                  <Alert className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-purple-800 dark:text-purple-200">
                      Admin access detected. You will be redirected to the admin panel after login.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error/Success Messages */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div
                    className={`transition-all duration-300 ease-in-out ${isLogin ? "opacity-100 max-h-96" : "opacity-100 max-h-96"}`}
                  >
                    {/* Name Field - Only for Sign Up */}
                    {!isLogin && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={formData.name}
                            onChange={handleInputChange}
                            required={!isLogin}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${isAdminLogin ? "border-purple-300 focus:border-purple-500" : ""}`}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                        {isAdminLogin && (
                          <div className="absolute right-3 top-3">
                            <Shield className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={isLogin ? "Enter your password" : "Create a password"}
                          className={`pl-10 pr-10 ${isAdminLogin ? "border-purple-300 focus:border-purple-500" : ""}`}
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>

                      {/* Password Strength Indicator - Only for Sign Up */}
                      {!isLogin && formData.password && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                  i < passwordStrength
                                    ? strengthColors[passwordStrength - 1]
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field - Only for Sign Up */}
                    {!isLogin && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className={`pl-10 ${isAdminLogin ? "border-purple-300 focus:border-purple-500" : ""}`}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required={!isLogin}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    )}

                    {/* Remember Me / Terms */}
                    <div className="flex items-center justify-between">
                      {isLogin ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" disabled={loading} />
                            <Label htmlFor="remember" className="text-sm">
                              Remember me
                            </Label>
                          </div>
                          <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                            Forgot password?
                          </Link>
                        </>
                      ) : (
                        <div className="flex items-start space-x-2 animate-in slide-in-from-top-2 duration-300">
                          <Checkbox
                            id="terms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                            }
                            required
                            disabled={loading}
                          />
                          <Label htmlFor="terms" className="text-sm leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-green-600 hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-green-600 hover:underline">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className={`w-full transition-all duration-300 transform hover:scale-[1.02] ${
                        isAdminLogin
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>
                            {isLogin
                              ? isAdminLogin
                                ? "Signing in to admin..."
                                : "Signing in..."
                              : isAdminLogin
                                ? "Creating admin account..."
                                : "Creating account..."}
                          </span>
                        </div>
                      ) : isLogin ? (
                        isAdminLogin ? (
                          "Sign In to Admin Panel"
                        ) : (
                          "Sign In"
                        )
                      ) : isAdminLogin ? (
                        "Create Admin Account"
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Switch Mode */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-green-600 hover:underline font-medium transition-colors duration-200"
                      disabled={loading}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      type="button"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={handleTwitterSignIn}
                      disabled={loading}
                      type="button"
                    >
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                      Twitter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
