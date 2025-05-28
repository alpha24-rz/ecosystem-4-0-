import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, Users, TreePine, Award, DollarSign, Download, Filter } from "lucide-react"

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "User Growth",
      value: "15,247",
      change: "+12.5%",
      trend: "up",
      period: "vs last month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Project Completion Rate",
      value: "68.2%",
      change: "+5.3%",
      trend: "up",
      period: "vs last month",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "NFT Minting Rate",
      value: "94.1%",
      change: "-1.2%",
      trend: "down",
      period: "vs last month",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Revenue Growth",
      value: "$127.5K",
      change: "+18.7%",
      trend: "up",
      period: "vs last month",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  const projectPerformance = [
    {
      name: "California Reforestation Initiative",
      category: "Tree Planting",
      participants: 1250,
      progress: 68,
      nftsIssued: 850,
      revenue: "$45,000",
      status: "active",
    },
    {
      name: "Pacific Coast Cleanup",
      category: "Ocean Cleanup",
      participants: 890,
      progress: 45,
      nftsIssued: 400,
      revenue: "$28,500",
      status: "active",
    },
    {
      name: "Urban Green Spaces",
      category: "Urban Gardening",
      participants: 567,
      progress: 82,
      nftsIssued: 465,
      revenue: "$22,800",
      status: "completing",
    },
    {
      name: "Amazon Rainforest Protection",
      category: "Forest Conservation",
      participants: 2100,
      progress: 34,
      nftsIssued: 714,
      revenue: "$31,200",
      status: "active",
    },
  ]

  const topContributors = [
    {
      name: "David Kim",
      email: "david@example.com",
      contributions: 45,
      nfts: 12,
      projects: 4,
      impact: "Critical",
    },
    {
      name: "Sarah Chen",
      email: "sarah@example.com",
      contributions: 38,
      nfts: 9,
      projects: 3,
      impact: "High",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      contributions: 32,
      nfts: 8,
      projects: 3,
      impact: "High",
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      contributions: 28,
      nfts: 7,
      projects: 2,
      impact: "Medium",
    },
    {
      name: "John Doe",
      email: "john@example.com",
      contributions: 25,
      nfts: 6,
      projects: 2,
      impact: "Medium",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "completing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track platform performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
                <span className="ml-1">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Project Performance</CardTitle>
            <CardDescription>Track the success of environmental projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectPerformance.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.category}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Participants</div>
                    <div className="font-semibold">{project.participants.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">NFTs Issued</div>
                    <div className="font-semibold">{project.nftsIssued.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Revenue</span>
                  <span className="font-semibold text-green-600">{project.revenue}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Most active users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{contributor.name}</div>
                      <div className="text-sm text-gray-500">{contributor.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <div className="font-semibold">{contributor.contributions}</div>
                        <div className="text-gray-500">Contributions</div>
                      </div>
                      <div>
                        <div className="font-semibold">{contributor.nfts}</div>
                        <div className="text-gray-500">NFTs</div>
                      </div>
                    </div>
                    <Badge className={`mt-2 ${getImpactColor(contributor.impact)}`}>{contributor.impact} Impact</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Trends</CardTitle>
            <CardDescription>Daily active users and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would be implemented here</p>
                <p className="text-sm text-gray-400">Using libraries like Recharts or Chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NFT Distribution</CardTitle>
            <CardDescription>NFTs issued by category and rarity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Pie chart visualization would be implemented here</p>
                <p className="text-sm text-gray-400">Showing NFT distribution by rarity and category</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Trees Planted</span>
              <span className="font-semibold">125,000+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Beach Areas Cleaned</span>
              <span className="font-semibold">2,500 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">CO2 Offset</span>
              <span className="font-semibold">50,000 tons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Wildlife Protected</span>
              <span className="font-semibold">15,000 acres</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">System Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Response Time</span>
              <span className="font-semibold">120ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
              <span className="font-semibold text-green-600">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">User Satisfaction</span>
              <span className="font-semibold">4.8/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Monthly Revenue</span>
              <span className="font-semibold">$127,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Project Funding</span>
              <span className="font-semibold">$495,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">NFT Sales</span>
              <span className="font-semibold">$85,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Growth Rate</span>
              <span className="font-semibold text-green-600">+18.7%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
