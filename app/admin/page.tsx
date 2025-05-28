import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users,
  TreePine,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "15,247",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Projects",
      value: "42",
      change: "+3",
      trend: "up",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "NFTs Issued",
      value: "8,750",
      change: "+245",
      trend: "up",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Revenue",
      value: "$127,500",
      change: "-2.1%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  const recentProjects = [
    {
      id: 1,
      name: "California Reforestation Initiative",
      location: "California, USA",
      progress: 68,
      participants: 1250,
      status: "active",
      lastUpdate: "2 hours ago",
    },
    {
      id: 2,
      name: "Pacific Coast Cleanup",
      location: "Pacific Coast",
      progress: 45,
      participants: 890,
      status: "active",
      lastUpdate: "5 hours ago",
    },
    {
      id: 3,
      name: "Urban Green Spaces",
      location: "New York, USA",
      progress: 82,
      participants: 567,
      status: "completing",
      lastUpdate: "1 day ago",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2024-01-15",
      contributions: 15,
      nfts: 3,
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@example.com",
      joinDate: "2024-01-14",
      contributions: 8,
      nfts: 2,
      status: "active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      joinDate: "2024-01-13",
      contributions: 22,
      nfts: 5,
      status: "active",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "New user registration",
      user: "Emma Wilson",
      timestamp: "5 minutes ago",
      type: "user",
    },
    {
      id: 2,
      action: "NFT minted",
      user: "David Kim",
      timestamp: "12 minutes ago",
      type: "nft",
    },
    {
      id: 3,
      action: "Project milestone reached",
      user: "California Reforestation",
      timestamp: "1 hour ago",
      type: "project",
    },
    {
      id: 4,
      action: "User contribution verified",
      user: "Lisa Brown",
      timestamp: "2 hours ago",
      type: "contribution",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest environmental conservation projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge
                      variant={project.status === "active" ? "default" : "secondary"}
                      className={
                        project.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : ""
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{project.participants} participants</span>
                    <span>{project.progress}% complete</span>
                  </div>
                  <Progress value={project.progress} className="mt-2 h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.user}</p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Users
            <Button variant="outline" size="sm">
              Manage Users
            </Button>
          </CardTitle>
          <CardDescription>Newly registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">User</th>
                  <th className="text-left py-2">Join Date</th>
                  <th className="text-left py-2">Contributions</th>
                  <th className="text-left py-2">NFTs</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3">{user.contributions}</td>
                    <td className="py-3">{user.nfts}</td>
                    <td className="py-3">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
