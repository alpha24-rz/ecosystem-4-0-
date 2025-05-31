import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, TreePine, Waves, Users, Award, Shield, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const featuredProjects = [
    {
      id: 1,
      title: "California Reforestation Initiative",
      description: "Massive tree planting project across California's wildfire-affected areas",
      category: "Tree Planting",
      progress: 68,
      target: 10000,
      current: 6800,
      image: "/images/Gone from the Amazon_.jpeg", // Path gambar yang benar
      participants: 1250,
      nftReward: "Forest Guardian NFT",
    },
    {
      id: 2,
      title: "Pacific Coast Cleanup",
      description: "Beach and ocean cleanup initiative along the Pacific coastline",
      category: "Ocean Cleanup",
      progress: 45,
      target: 500,
      current: 225,
      image: "/images/Artem Firsov.jpeg", // Path gambar yang benar
      participants: 890,
      nftReward: "Ocean Protector NFT",
    },
    {
      id: 3,
      title: "Urban Green Spaces",
      description: "Creating sustainable green spaces in urban environments",
      category: "Urban Gardening",
      progress: 82,
      target: 50,
      current: 41,
      image: "/images/Qual As 5 Cidades Mais Verdes Do Brasil_ Explorando A Sustentabilidade Urbana_.jpeg", // Path gambar yang benar
      participants: 567,
      nftReward: "City Guardian NFT",
    },
  ]

  const stats = [
    { label: "Trees Planted", value: "125,000+", icon: TreePine },
    { label: "Beach Areas Cleaned", value: "2,500 km", icon: Waves },
    { label: "Active Contributors", value: "15,000+", icon: Users },
    { label: "NFTs Issued", value: "8,750", icon: Award },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900/20" />
        <div className="absolute inset-0 bg-[url('/images/imagehero.jpeg')] bg-cover bg-center opacity-10" /> {/* Gambar hero yang sesuai */}

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              🌱 Powered by Blockchain Technology
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Ecosystem 4.0
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join the revolution in environmental conservation. Earn NFT rewards for your contributions to tree
              planting, ocean cleanup, and sustainable projects worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              >
                <Leaf className="mr-2 h-5 w-5" />
                Start Contributing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                    <stat.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join ongoing environmental initiatives and make a real impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/images/placeholder.jpg"} // Gambar dengan path yang benar
                    alt={project.title}
                    width={300} // Ukuran gambar sesuai kebutuhan
                    height={200} // Ukuran gambar sesuai kebutuhan
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">{project.category}</Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
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

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of environmental champions and start earning NFT rewards for your conservation efforts
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                <Leaf className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
