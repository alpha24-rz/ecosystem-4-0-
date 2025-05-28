import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TreePine, Award, BookOpen, Video, FileText, Users, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function LearnPage() {
  const courses = [
    {
      id: 1,
      title: "Introduction to Environmental Conservation",
      description:
        "Learn the basics of environmental conservation and how blockchain technology is revolutionizing the field.",
      image: "/placeholder.svg?height=200&width=300",
      category: "Beginner",
      duration: "2 hours",
      lessons: 8,
      students: 1250,
      rating: 4.8,
      topics: ["Climate Change", "Biodiversity", "Sustainability", "Blockchain Basics"],
    },
    {
      id: 2,
      title: "NFTs and Environmental Impact",
      description: "Understand how NFTs can be used to track and reward environmental contributions.",
      image: "/placeholder.svg?height=200&width=300",
      category: "Intermediate",
      duration: "3 hours",
      lessons: 12,
      students: 890,
      rating: 4.9,
      topics: ["NFT Technology", "Smart Contracts", "Environmental Tracking", "Rewards Systems"],
    },
    {
      id: 3,
      title: "Tree Planting Best Practices",
      description: "Master the art and science of effective tree planting for maximum environmental impact.",
      image: "/placeholder.svg?height=200&width=300",
      category: "Practical",
      duration: "4 hours",
      lessons: 15,
      students: 2100,
      rating: 4.7,
      topics: ["Species Selection", "Soil Preparation", "Planting Techniques", "Maintenance"],
    },
    {
      id: 4,
      title: "Ocean Conservation Strategies",
      description: "Explore effective methods for protecting marine ecosystems and reducing ocean pollution.",
      image: "/placeholder.svg?height=200&width=300",
      category: "Advanced",
      duration: "5 hours",
      lessons: 18,
      students: 567,
      rating: 4.9,
      topics: ["Marine Biology", "Pollution Control", "Cleanup Techniques", "Policy Advocacy"],
    },
  ]

  const articles = [
    {
      id: 1,
      title: "The Science Behind Carbon Offsetting",
      excerpt: "Understanding how carbon offset projects work and their real environmental impact.",
      author: "Dr. Sarah Chen",
      readTime: "8 min read",
      category: "Science",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 2,
      title: "Blockchain Transparency in Environmental Projects",
      excerpt: "How blockchain technology ensures accountability in conservation efforts.",
      author: "Michael Rodriguez",
      readTime: "6 min read",
      category: "Technology",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: 3,
      title: "Community-Led Conservation Success Stories",
      excerpt: "Real examples of how local communities are making a global impact.",
      author: "Emma Thompson",
      readTime: "10 min read",
      category: "Case Studies",
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  const webinars = [
    {
      id: 1,
      title: "Future of Environmental NFTs",
      date: "March 15, 2024",
      time: "2:00 PM EST",
      speaker: "Dr. James Wilson",
      attendees: 450,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Building Sustainable Communities",
      date: "March 22, 2024",
      time: "3:00 PM EST",
      speaker: "Maria Garcia",
      attendees: 320,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Measuring Environmental Impact",
      date: "March 8, 2024",
      time: "1:00 PM EST",
      speaker: "Prof. David Kim",
      attendees: 680,
      status: "recorded",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "Practical":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Learn & Grow</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expand your knowledge about environmental conservation, blockchain technology, and sustainable practices
          </p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-8">
            {/* Featured Course */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-white/20 text-white mb-4">Featured Course</Badge>
                  <h2 className="text-3xl font-bold mb-4">Environmental Impact Measurement</h2>
                  <p className="text-green-100 mb-6">
                    Learn how to accurately measure and track the environmental impact of conservation projects using
                    cutting-edge technology and methodologies.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">6 hours</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span className="text-sm">20 lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">1,500+ students</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="lg">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="relative h-64 md:h-80">
                  <Image
                    src="/placeholder.svg?height=320&width=400"
                    alt="Featured Course"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className={`absolute top-4 left-4 ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {course.lessons} lessons
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students.toLocaleString()} students
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{course.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {course.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-green-600 text-white">{article.category}</Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>By {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webinars" className="space-y-8">
            <div className="space-y-6">
              {webinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold">{webinar.title}</h3>
                          <Badge variant={webinar.status === "upcoming" ? "default" : "secondary"}>
                            {webinar.status === "upcoming" ? "Upcoming" : "Recorded"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {webinar.date} at {webinar.time}
                          </span>
                          <span>Speaker: {webinar.speaker}</span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {webinar.attendees} attendees
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          {webinar.status === "upcoming" ? "Register" : "Watch"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Conservation Guides</CardTitle>
                <CardDescription className="mb-4">
                  Comprehensive guides on various conservation techniques and best practices.
                </CardDescription>
                <Button variant="outline">Browse Guides</Button>
              </Card>

              <Card className="text-center p-6">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Certification Programs</CardTitle>
                <CardDescription className="mb-4">
                  Earn certificates in environmental conservation and blockchain technology.
                </CardDescription>
                <Button variant="outline">View Programs</Button>
              </Card>

              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="mb-2">Community Forum</CardTitle>
                <CardDescription className="mb-4">
                  Connect with other environmental champions and share knowledge.
                </CardDescription>
                <Button variant="outline">Join Forum</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
