import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreePine, Waves, Sprout, Users, MapPin, Calendar, Search } from "lucide-react"
import Image from "next/image"

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "California Reforestation Initiative",
      description:
        "Massive tree planting project across California's wildfire-affected areas to restore natural habitats and combat climate change.",
      category: "Tree Planting",
      location: "California, USA",
      progress: 68,
      target: 10000,
      current: 6800,
      image: "/placeholder.svg?height=200&width=300",
      participants: 1250,
      nftReward: "Forest Guardian NFT",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      difficulty: "Beginner",
      impact: "High",
      icon: TreePine,
    },
    {
      id: 2,
      title: "Pacific Coast Cleanup",
      description:
        "Beach and ocean cleanup initiative along the Pacific coastline to protect marine life and preserve coastal ecosystems.",
      category: "Ocean Cleanup",
      location: "Pacific Coast",
      progress: 45,
      target: 500,
      current: 225,
      image: "/placeholder.svg?height=200&width=300",
      participants: 890,
      nftReward: "Ocean Protector NFT",
      startDate: "2024-03-01",
      endDate: "2024-11-30",
      difficulty: "Intermediate",
      impact: "High",
      icon: Waves,
    },
    {
      id: 3,
      title: "Urban Green Spaces",
      description:
        "Creating sustainable green spaces in urban environments to improve air quality and community well-being.",
      category: "Urban Gardening",
      location: "New York, USA",
      progress: 82,
      target: 50,
      current: 41,
      image: "/placeholder.svg?height=200&width=300",
      participants: 567,
      nftReward: "City Guardian NFT",
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      difficulty: "Beginner",
      impact: "Medium",
      icon: Sprout,
    },
    {
      id: 4,
      title: "Amazon Rainforest Protection",
      description: "Supporting indigenous communities in protecting and preserving the Amazon rainforest ecosystem.",
      category: "Forest Conservation",
      location: "Amazon Basin",
      progress: 34,
      target: 1000,
      current: 340,
      image: "/placeholder.svg?height=200&width=300",
      participants: 2100,
      nftReward: "Rainforest Keeper NFT",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      difficulty: "Advanced",
      impact: "Critical",
      icon: TreePine,
    },
    {
      id: 5,
      title: "Coral Reef Restoration",
      description: "Restoring damaged coral reefs through innovative techniques and community engagement programs.",
      category: "Marine Conservation",
      location: "Great Barrier Reef",
      progress: 56,
      target: 200,
      current: 112,
      image: "/placeholder.svg?height=200&width=300",
      participants: 445,
      nftReward: "Coral Guardian NFT",
      startDate: "2024-04-01",
      endDate: "2024-10-31",
      difficulty: "Advanced",
      impact: "Critical",
      icon: Waves,
    },
    {
      id: 6,
      title: "Community Solar Gardens",
      description: "Building community-owned solar installations to promote renewable energy adoption.",
      category: "Renewable Energy",
      location: "Colorado, USA",
      progress: 91,
      target: 25,
      current: 23,
      image: "/placeholder.svg?height=200&width=300",
      participants: 312,
      nftReward: "Solar Pioneer NFT",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      difficulty: "Intermediate",
      impact: "High",
      icon: Sprout,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Environmental Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join ongoing conservation initiatives worldwide and earn NFT rewards for your contributions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search projects..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tree-planting">Tree Planting</SelectItem>
                <SelectItem value="ocean-cleanup">Ocean Cleanup</SelectItem>
                <SelectItem value="urban-gardening">Urban Gardening</SelectItem>
                <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Impact Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-600 text-white">{project.category}</Badge>
                  <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
                </div>
                <Badge className={`absolute top-4 right-4 ${getImpactColor(project.impact)}`}>
                  {project.impact} Impact
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </div>
                  <project.icon className="h-6 w-6 text-green-600 ml-2 flex-shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{project.current.toLocaleString()} completed</span>
                    <span>{project.target.toLocaleString()} target</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {project.participants} participants
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {project.nftReward}
                  </Badge>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Join Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  )
}
