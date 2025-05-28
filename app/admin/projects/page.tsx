"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Users,
  MapPin,
  Calendar,
  TreePine,
  Waves,
  Sprout,
} from "lucide-react"
import Image from "next/image"

export default function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const projects = [
    {
      id: "1",
      name: "California Reforestation Initiative",
      description: "Massive tree planting project across California's wildfire-affected areas",
      category: "Tree Planting",
      location: "California, USA",
      status: "active",
      progress: 68,
      target: 10000,
      current: 6800,
      participants: 1250,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      budget: "$125,000",
      spent: "$85,000",
      manager: "John Smith",
      image: "/placeholder.svg?height=200&width=300",
      icon: TreePine,
    },
    {
      id: "2",
      name: "Pacific Coast Cleanup",
      description: "Beach and ocean cleanup initiative along the Pacific coastline",
      category: "Ocean Cleanup",
      location: "Pacific Coast",
      status: "active",
      progress: 45,
      target: 500,
      current: 225,
      participants: 890,
      startDate: "2024-03-01",
      endDate: "2024-11-30",
      budget: "$75,000",
      spent: "$33,750",
      manager: "Sarah Johnson",
      image: "/placeholder.svg?height=200&width=300",
      icon: Waves,
    },
    {
      id: "3",
      name: "Urban Green Spaces",
      description: "Creating sustainable green spaces in urban environments",
      category: "Urban Gardening",
      location: "New York, USA",
      status: "completing",
      progress: 82,
      target: 50,
      current: 41,
      participants: 567,
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      budget: "$45,000",
      spent: "$36,900",
      manager: "Mike Davis",
      image: "/placeholder.svg?height=200&width=300",
      icon: Sprout,
    },
    {
      id: "4",
      name: "Amazon Rainforest Protection",
      description: "Supporting indigenous communities in protecting the Amazon rainforest",
      category: "Forest Conservation",
      location: "Amazon Basin",
      status: "paused",
      progress: 34,
      target: 1000,
      current: 340,
      participants: 2100,
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      budget: "$250,000",
      spent: "$85,000",
      manager: "Maria Garcia",
      image: "/placeholder.svg?height=200&width=300",
      icon: TreePine,
    },
  ]

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const handleSelectAll = () => {
    setSelectedProjects(selectedProjects.length === projects.length ? [] : projects.map((project) => project.id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "completing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tree Planting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Ocean Cleanup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Urban Gardening":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "Forest Conservation":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage environmental conservation projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new environmental conservation project to the platform</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" placeholder="Enter project name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tree-planting">Tree Planting</SelectItem>
                        <SelectItem value="ocean-cleanup">Ocean Cleanup</SelectItem>
                        <SelectItem value="urban-gardening">Urban Gardening</SelectItem>
                        <SelectItem value="forest-conservation">Forest Conservation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter project description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Enter location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Goal</Label>
                    <Input id="target" type="number" placeholder="Enter target number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" placeholder="Enter budget amount" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Project Manager</Label>
                    <Input id="manager" placeholder="Enter manager name" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">66.7% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,707</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$495K</div>
            <p className="text-xs text-muted-foreground">$240K spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage environmental conservation projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects by name, location, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completing">Completing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tree-planting">Tree Planting</SelectItem>
                <SelectItem value="ocean-cleanup">Ocean Cleanup</SelectItem>
                <SelectItem value="urban-gardening">Urban Gardening</SelectItem>
                <SelectItem value="forest-conservation">Forest Conservation</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedProjects.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <span className="text-sm font-medium">
                {selectedProjects.length} project{selectedProjects.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Activate
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image src={project.image || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCategoryColor(project.category)}>{project.category}</Badge>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleSelectProject(project.id)}
                      className="bg-white"
                    />
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
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
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
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

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {project.participants} participants
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{project.spent}</div>
                      <div className="text-xs text-gray-500">of {project.budget}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Manager: {project.manager}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {project.status === "active" ? (
                          <DropdownMenuItem className="text-orange-600">
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Project
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Play className="mr-2 h-4 w-4" />
                            Activate Project
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
