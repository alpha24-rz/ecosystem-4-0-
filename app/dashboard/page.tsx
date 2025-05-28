"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, User, Award, TreePine, Loader2 } from "lucide-react"
import { useAuthContext } from "@/components/auth/auth-provider"

export default function DashboardPage() {
  const { user, userData, loading, logout } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user) {
    return null // This will redirect in the useEffect
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900/20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.displayName || "Eco Warrior"}!</h1>
          <p className="text-muted-foreground mt-2">Track your environmental impact and manage your NFT rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Contributions</CardTitle>
              <CardDescription>Your environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <TreePine className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Projects Joined</span>
                </div>
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My NFTs</CardTitle>
              <CardDescription>Your earned rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">NFTs Earned</span>
                </div>
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Profile</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Member Since</span>
                </div>
                <span className="text-sm">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Today"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest contributions and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Join a project to start making an impact and earning NFT rewards for your environmental
                    contributions.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/projects">Browse Projects</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="text-sm text-muted-foreground">{userData?.role || "User"}</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
