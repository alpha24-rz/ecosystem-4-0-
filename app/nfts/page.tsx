import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TreePine, Waves, Sprout, Award, Search, ExternalLink, Heart } from "lucide-react"
import Image from "next/image"

export default function NFTsPage() {
  const nftCollections = [
    {
      id: 1,
      name: "Forest Guardian",
      description: "Awarded for tree planting contributions",
      image: "/placeholder.svg?height=300&width=300",
      category: "Tree Planting",
      rarity: "Common",
      totalSupply: 5000,
      owned: 1250,
      floorPrice: "0.05 ETH",
      project: "California Reforestation Initiative",
      icon: TreePine,
      attributes: [
        { trait: "Trees Planted", value: "50+" },
        { trait: "Location", value: "California" },
        { trait: "Season", value: "Spring 2024" },
      ],
    },
    {
      id: 2,
      name: "Ocean Protector",
      description: "Earned through ocean cleanup activities",
      image: "/placeholder.svg?height=300&width=300",
      category: "Ocean Cleanup",
      rarity: "Rare",
      totalSupply: 2000,
      owned: 445,
      floorPrice: "0.12 ETH",
      project: "Pacific Coast Cleanup",
      icon: Waves,
      attributes: [
        { trait: "Cleanup Area", value: "5km+" },
        { trait: "Waste Collected", value: "100kg+" },
        { trait: "Marine Life Saved", value: "High Impact" },
      ],
    },
    {
      id: 3,
      name: "City Guardian",
      description: "Recognized for urban gardening efforts",
      image: "/placeholder.svg?height=300&width=300",
      category: "Urban Gardening",
      rarity: "Uncommon",
      totalSupply: 3000,
      owned: 890,
      floorPrice: "0.08 ETH",
      project: "Urban Green Spaces",
      icon: Sprout,
      attributes: [
        { trait: "Gardens Created", value: "10+" },
        { trait: "Community Impact", value: "High" },
        { trait: "Air Quality Improvement", value: "Significant" },
      ],
    },
    {
      id: 4,
      name: "Rainforest Keeper",
      description: "Honored for rainforest conservation",
      image: "/placeholder.svg?height=300&width=300",
      category: "Forest Conservation",
      rarity: "Legendary",
      totalSupply: 500,
      owned: 125,
      floorPrice: "0.5 ETH",
      project: "Amazon Rainforest Protection",
      icon: TreePine,
      attributes: [
        { trait: "Area Protected", value: "1000+ acres" },
        { trait: "Indigenous Support", value: "Direct" },
        { trait: "Biodiversity Impact", value: "Critical" },
      ],
    },
    {
      id: 5,
      name: "Coral Guardian",
      description: "Awarded for coral reef restoration",
      image: "/placeholder.svg?height=300&width=300",
      category: "Marine Conservation",
      rarity: "Epic",
      totalSupply: 1000,
      owned: 234,
      floorPrice: "0.25 ETH",
      project: "Coral Reef Restoration",
      icon: Waves,
      attributes: [
        { trait: "Corals Planted", value: "100+" },
        { trait: "Reef Health", value: "Restored" },
        { trait: "Marine Ecosystem", value: "Thriving" },
      ],
    },
    {
      id: 6,
      name: "Solar Pioneer",
      description: "Recognized for renewable energy adoption",
      image: "/placeholder.svg?height=300&width=300",
      category: "Renewable Energy",
      rarity: "Rare",
      totalSupply: 1500,
      owned: 567,
      floorPrice: "0.15 ETH",
      project: "Community Solar Gardens",
      icon: Sprout,
      attributes: [
        { trait: "Energy Generated", value: "10MWh+" },
        { trait: "Carbon Offset", value: "5 tons CO2" },
        { trait: "Community Benefit", value: "High" },
      ],
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      case "Uncommon":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "Epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "Legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Environmental NFTs</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover and collect unique NFTs that represent real environmental impact and conservation efforts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">8,750</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total NFTs Minted</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">3,511</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique Holders</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">15.7 ETH</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">0.08 ETH</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Floor Price</div>
          </div>
        </div>

        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="rewards">Earn Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-8">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search NFTs..." className="pl-10" />
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
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">0 - 0.1 ETH</SelectItem>
                    <SelectItem value="medium">0.1 - 0.5 ETH</SelectItem>
                    <SelectItem value="high">0.5+ ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NFT Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nftCollections.map((nft) => (
                <Card
                  key={nft.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-green-600 text-white">{nft.category}</Badge>
                      <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{nft.name}</CardTitle>
                        <CardDescription className="text-sm">{nft.description}</CardDescription>
                      </div>
                      <nft.icon className="h-6 w-6 text-green-600 ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Project: {nft.project}</div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total Supply</div>
                        <div className="font-semibold">{nft.totalSupply.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Owned</div>
                        <div className="font-semibold">{nft.owned.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-500 mb-1">Floor Price</div>
                      <div className="text-xl font-bold text-green-600">{nft.floorPrice}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Buy Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-nfts" className="space-y-8">
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start participating in environmental projects to earn your first NFT rewards!
              </p>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Browse Projects
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">How to Earn NFT Rewards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TreePine className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Participate in Projects</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join environmental conservation projects and make verified contributions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Earn NFT Rewards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive unique NFTs based on your contribution level and project type
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Trade & Showcase</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trade your NFTs on marketplaces or showcase your environmental impact
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
