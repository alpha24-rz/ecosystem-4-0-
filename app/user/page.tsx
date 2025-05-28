"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TreePine,
  Award,
  Calendar,
  MapPin,
  Users,
  Target,
  TrendingUp,
  Star,
  Leaf,
  Waves,
  Recycle,
  Loader2,
  Edit,
} from "lucide-react"
import { useAuthContext } from "@/components/auth/auth-provider"

interface UserContribution {
  id: string
  type: "tree_planting" | "beach_cleanup" | "recycling" | "energy_saving"
  amount: number
  project: string
  date: string
  location: string
}

interface UserNFT {
  id: string
  name: string
  description: string
  image: string
  project: string
  dateEarned: string
  rarity: "common" | "rare" | "epic" | "legendary"
  attributes: { trait_type: string; value: string }[]
}

interface UserProject {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "upcoming"
  progress: number
  userContribution: number
  totalGoal: number
  endDate: string
  location: string
}

interface UserAchievement {
  id: string
  name: string
  description: string
  icon: string
  dateEarned: string
  progress: number
  maxProgress: number
}

export default function UserPage() {
  const { user, userData, loading } = useAuthContext()
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    totalContributions: 0,
    nftsEarned: 0,
    projectsJoined: 0,
    impactScore: 0,
  })

  // Mock data - in real app, fetch from database
  const [contributions] = useState<UserContribution[]>([
    {
      id: "1",
      type: "tree_planting",
      amount: 25,
      project: "California Reforestation",
      date: "2024-01-15",
      location: "California, USA",
    },
    {
      id: "2",
      type: "beach_cleanup",
      amount: 50,
      project: "Pacific Coast Cleanup",
      date: "2024-01-10",
      location: "Pacific Coast",
    },
    {
      id: "3",
      type: "recycling",
      amount: 100,
      project: "Urban Recycling Initiative",
      date: "2024-01-05",
      location: "New York, USA",
    },
  ])

  const [nfts] = useState<UserNFT[]>([
    {
      id: "1",
      name: "Tree Guardian",
      description: "Awarded for planting 25+ trees",
      image: "/placeholder.svg?height=200&width=200",
      project: "California Reforestation",
      dateEarned: "2024-01-15",
      rarity: "rare",
      attributes: [
        { trait_type: "Trees Planted", value: "25" },
        { trait_type: "Location", value: "California" },
      ],
    },
    {
      id: "2",
      name: "Ocean Protector",
      description: "Awarded for beach cleanup participation",
      image: "/placeholder.svg?height=200&width=200",
      project: "Pacific Coast Cleanup",
      dateEarned: "2024-01-10",
      rarity: "epic",
      attributes: [
        { trait_type: "Waste Collected", value: "50kg" },
        { trait_type: "Location", value: "Pacific Coast" },
      ],
    },
  ])

  const [projects] = useState<UserProject[]>([
    {
      id: "1",
      name: "California Reforestation Initiative",
      description: "Help restore California's forests by planting native trees",
      status: "active",
      progress: 68,
      userContribution: 25,
      totalGoal: 1000,
      endDate: "2024-03-15",
      location: "California, USA",
    },
    {
      id: "2",
      name: "Urban Green Spaces",
      description: "Create green spaces in urban areas",
      status: "upcoming",
      progress: 0,
      userContribution: 0,
      totalGoal: 500,
      endDate: "2024-04-01",
      location: "New York, USA",
    },
  ])

  const [achievements] = useState<UserAchievement[]>([
    {
      id: "1",
      name: "Tree Planting Champion",
      description: "Plant 50 trees",
      icon: "🌳",
      dateEarned: "",
      progress: 25,
      maxProgress: 50,
    },
    {
      id: "2",
      name: "Ocean Guardian",
      description: "Participate in 5 beach cleanups",
      icon: "🌊",
      dateEarned: "2024-01-10",
      progress: 5,
      maxProgress: 5,
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userData) {
      // Calculate user stats from contributions
      setUserStats({
        totalContributions: contributions.reduce((sum, c) => sum + c.amount, 0),
        nftsEarned: nfts.length,
        projectsJoined: projects.length,
        impactScore: Math.floor(Math.random() * 1000) + 500, // Mock calculation
      })
    }
  }, [userData, contributions, nfts, projects])

  const getContributionIcon = (type: string) => {
    switch (type) {
      case "tree_planting":
        return <TreePine className="h-4 w-4 text-green-600" />
      case "beach_cleanup":
        return <Waves className="h-4 w-4 text-blue-600" />
      case "recycling":
        return <Recycle className="h-4 w-4 text-purple-600" />
      default:
        return <Leaf className="h-4 w-4 text-green-600" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback className="bg-green-600 text-white text-lg">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.displayName || "Eco Warrior"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Star className="h-3 w-3 mr-1" />
                    Impact Score: {userStats.impactScore}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contributions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalContributions}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">NFTs Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.nftsEarned}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects Joined</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.projectsJoined}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impact Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.impactScore}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="contributions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Environmental Contributions</CardTitle>
                <CardDescription>Track your positive impact on the environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {getContributionIcon(contribution.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{contribution.project}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{contribution.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(contribution.date).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          +{contribution.amount}{" "}
                          {contribution.type === "tree_planting"
                            ? "trees"
                            : contribution.type === "beach_cleanup"
                              ? "kg waste"
                              : "items"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your NFT Collection</CardTitle>
                <CardDescription>NFTs earned for your environmental contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nfts.map((nft) => (
                    <Card key={nft.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}>{nft.rarity}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{nft.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{nft.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Project:</span>
                            <span className="font-medium">{nft.project}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Earned:</span>
                            <span className="font-medium">{new Date(nft.dateEarned).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Environmental projects you're participating in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{project.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Ends: {new Date(project.endDate).toLocaleDateString()}</span>
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={
                              project.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : project.status === "completed"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Project Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Your contribution: {project.userContribution}</span>
                            <span>Goal: {project.totalGoal}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges and milestones you've unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={achievement.dateEarned ? "border-green-200" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{achievement.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-2"
                              />
                              {achievement.dateEarned && (
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
