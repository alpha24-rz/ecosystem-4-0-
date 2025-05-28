"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Award,
  ExternalLink,
  Calendar,
  User,
  TreePine,
  Waves,
  Sprout,
} from "lucide-react"
import Image from "next/image"

export default function NFTsPage() {
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false)

  const nfts = [
    {
      id: "1",
      tokenId: "NFT001",
      name: "Forest Guardian #1250",
      description: "Awarded for planting 50+ trees in California Reforestation Initiative",
      image: "/placeholder.svg?height=300&width=300",
      category: "Tree Planting",
      rarity: "Common",
      project: "California Reforestation Initiative",
      owner: "John Doe",
      ownerEmail: "john@example.com",
      mintDate: "2024-01-20",
      status: "minted",
      metadata: {
        treesPlanted: 52,
        location: "California",
        season: "Spring 2024",
      },
      contractAddress: "0x1234...5678",
      transactionHash: "0xabcd...efgh",
    },
    {
      id: "2",
      tokenId: "NFT002",
      name: "Ocean Protector #890",
      description: "Earned through Pacific Coast cleanup activities",
      image: "/placeholder.svg?height=300&width=300",
      category: "Ocean Cleanup",
      rarity: "Rare",
      project: "Pacific Coast Cleanup",
      owner: "Sarah Chen",
      ownerEmail: "sarah@example.com",
      mintDate: "2024-01-18",
      status: "minted",
      metadata: {
        cleanupArea: "5km",
        wasteCollected: "120kg",
        marineLifeSaved: "High Impact",
      },
      contractAddress: "0x1234...5678",
      transactionHash: "0xijkl...mnop",
    },
    {
      id: "3",
      tokenId: "NFT003",
      name: "City Guardian #567",
      description: "Recognized for urban gardening efforts in New York",
      image: "/placeholder.svg?height=300&width=300",
      category: "Urban Gardening",
      rarity: "Uncommon",
      project: "Urban Green Spaces",
      owner: "Mike Johnson",
      ownerEmail: "mike@example.com",
      mintDate: "2024-01-15",
      status: "minted",
      metadata: {
        gardensCreated: 12,
        communityImpact: "High",
        airQualityImprovement: "Significant",
      },
      contractAddress: "0x1234...5678",
      transactionHash: "0xqrst...uvwx",
    },
    {
      id: "4",
      tokenId: "NFT004",
      name: "Rainforest Keeper #125",
      description: "Honored for Amazon rainforest conservation efforts",
      image: "/placeholder.svg?height=300&width=300",
      category: "Forest Conservation",
      rarity: "Legendary",
      project: "Amazon Rainforest Protection",
      owner: "Emma Wilson",
      ownerEmail: "emma@example.com",
      mintDate: "2024-01-12",
      status: "pending",
      metadata: {
        areaProtected: "1000+ acres",
        indigenousSupport: "Direct",
        biodiversityImpact: "Critical",
      },
      contractAddress: "0x1234...5678",
      transactionHash: null,
    },
  ]

  const handleSelectNFT = (nftId: string) => {
    setSelectedNFTs((prev) => (prev.includes(nftId) ? prev.filter((id) => id !== nftId) : [...prev, nftId]))
  }

  const handleSelectAll = () => {
    setSelectedNFTs(selectedNFTs.length === nfts.length ? [] : nfts.map((nft) => nft.id))
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "minted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tree Planting":
      case "Forest Conservation":
        return TreePine
      case "Ocean Cleanup":
        return Waves
      case "Urban Gardening":
        return Sprout
      default:
        return Award
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NFT Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track environmental NFTs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isMintDialogOpen} onOpenChange={setIsMintDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Mint NFT
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mint New NFT</DialogTitle>
                <DialogDescription>Create a new environmental NFT reward for a user</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nft-name">NFT Name</Label>
                    <Input id="nft-name" placeholder="Enter NFT name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nft-category">Category</Label>
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
                  <Label htmlFor="nft-description">Description</Label>
                  <Textarea id="nft-description" placeholder="Enter NFT description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nft-project">Associated Project</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="california-reforestation">California Reforestation Initiative</SelectItem>
                        <SelectItem value="pacific-cleanup">Pacific Coast Cleanup</SelectItem>
                        <SelectItem value="urban-green">Urban Green Spaces</SelectItem>
                        <SelectItem value="amazon-protection">Amazon Rainforest Protection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nft-rarity">Rarity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-recipient">Recipient Email</Label>
                  <Input id="nft-recipient" type="email" placeholder="Enter recipient email" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsMintDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => setIsMintDialogOpen(false)}
                >
                  Mint NFT
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
            <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,750</div>
            <p className="text-xs text-muted-foreground">+245 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minted NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,234</div>
            <p className="text-xs text-muted-foreground">94.1% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">516</div>
            <p className="text-xs text-muted-foreground">Awaiting minting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Holders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,511</div>
            <p className="text-xs text-muted-foreground">Average 2.5 NFTs per holder</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>NFTs</CardTitle>
          <CardDescription>Manage environmental NFT rewards and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search NFTs by name, owner, or project..."
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
                <SelectItem value="minted">Minted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rarity" />
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedNFTs.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <span className="text-sm font-medium">
                {selectedNFTs.length} NFT{selectedNFTs.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Metadata
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* NFTs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => {
              const CategoryIcon = getCategoryIcon(nft.category)
              return (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                      <Badge className={getStatusColor(nft.status)}>{nft.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Checkbox
                        checked={selectedNFTs.includes(nft.id)}
                        onCheckedChange={() => handleSelectNFT(nft.id)}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{nft.name}</CardTitle>
                        <CardDescription className="text-sm">{nft.description}</CardDescription>
                      </div>
                      <CategoryIcon className="h-6 w-6 text-green-600 ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">Token ID</div>
                      <div className="text-gray-600 dark:text-gray-400">{nft.tokenId}</div>
                    </div>

                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">Project</div>
                      <div className="text-gray-600 dark:text-gray-400">{nft.project}</div>
                    </div>

                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div className="font-medium">{nft.owner}</div>
                        <div className="text-xs text-gray-500">{nft.ownerEmail}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Minted {new Date(nft.mintDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Chain
                      </Button>
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
                            Edit Metadata
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete NFT
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">Showing 1 to 4 of 8,750 NFTs</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
