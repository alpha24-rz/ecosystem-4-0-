"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { NFT } from "@/lib/models/nft"

export default function NFTsPage() {
  const { user, userData, loading } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rarityFilter, setRarityFilter] = useState("all")
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [nftToDelete, setNftToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNFTs, setTotalNFTs] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data for new NFT
  const [newNFT, setNewNFT] = useState({
    name: "",
    description: "",
    category: "",
    rarity: "",
    project: "",
    recipientEmail: "",
    image: "/placeholder.svg?height=300&width=300",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    if (!loading && user && userData && userData.role !== "admin" && userData.role !== "super_admin") {
      router.push("/user")
      return
    }

    fetchNFTs()
  }, [user, userData, loading, router, currentPage, statusFilter, rarityFilter, searchQuery])

  const fetchNFTs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "12")

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      if (rarityFilter !== "all") {
        params.append("rarity", rarityFilter)
      }

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/nfts?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch NFTs")
      }

      const data = await response.json()
      setNfts(data.nfts || [])
      setTotalNFTs(data.pagination?.total || 0)
      setTotalPages(data.pagination?.pages || 1)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      setError("Failed to fetch NFTs. Please try again.")
      setIsLoading(false)

      // Fallback to mock data for demo
      const mockNFTs = [
        {
          _id: "1",
          tokenId: "NFT001",
          name: "Forest Guardian #1250",
          description: "Awarded for planting 50+ trees in California Reforestation Initiative",
          image: "/placeholder.svg?height=300&width=300",
          category: "Tree Planting",
          rarity: "Common" as const,
          project: "California Reforestation Initiative",
          owner: "John Doe",
          ownerEmail: "john@example.com",
          mintDate: "2024-01-20",
          status: "minted" as const,
          metadata: {
            treesPlanted: 52,
            location: "California",
            season: "Spring 2024",
          },
          contractAddress: "0x1234...5678",
          transactionHash: "0xabcd...efgh",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          tokenId: "NFT002",
          name: "Ocean Protector #890",
          description: "Earned through Pacific Coast cleanup activities",
          image: "/placeholder.svg?height=300&width=300",
          category: "Ocean Cleanup",
          rarity: "Rare" as const,
          project: "Pacific Coast Cleanup",
          owner: "Sarah Chen",
          ownerEmail: "sarah@example.com",
          mintDate: "2024-01-18",
          status: "minted" as const,
          metadata: {
            cleanupArea: "5km",
            wasteCollected: "120kg",
            marineLifeSaved: "High Impact",
          },
          contractAddress: "0x1234...5678",
          transactionHash: "0xijkl...mnop",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as NFT[]

      setNfts(mockNFTs)
      setTotalNFTs(8750)
      setTotalPages(Math.ceil(8750 / 12))
      setIsLoading(false)
    }
  }

  const handleSelectNFT = (nftId: string) => {
    setSelectedNFTs((prev) => (prev.includes(nftId) ? prev.filter((id) => id !== nftId) : [...prev, nftId]))
  }

  const handleSelectAll = () => {
    setSelectedNFTs(selectedNFTs.length === nfts.length ? [] : nfts.map((nft) => nft._id!))
  }

  const handleCreateNFT = async () => {
    setIsSubmitting(true)

    try {
      if (
        !newNFT.name ||
        !newNFT.description ||
        !newNFT.category ||
        !newNFT.rarity ||
        !newNFT.project ||
        !newNFT.recipientEmail
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/nfts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newNFT,
          tokenId: `NFT${Date.now()}`,
          owner: "System",
          ownerEmail: newNFT.recipientEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create NFT")
      }

      const data = await response.json()

      toast({
        title: "NFT Created",
        description: `NFT "${newNFT.name}" has been created successfully`,
      })

      setNewNFT({
        name: "",
        description: "",
        category: "",
        rarity: "",
        project: "",
        recipientEmail: "",
        image: "/placeholder.svg?height=300&width=300",
      })
      setIsMintDialogOpen(false)
      setIsSubmitting(false)

      fetchNFTs()
    } catch (error) {
      console.error("Error creating NFT:", error)
      toast({
        title: "Error",
        description: "Failed to create NFT. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleDeleteNFT = async () => {
    if (!nftToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/nfts/${nftToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete NFT")
      }

      toast({
        title: "NFT Deleted",
        description: "NFT has been deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setNftToDelete(null)
      setIsSubmitting(false)
      setSelectedNFTs((prev) => prev.filter((id) => id !== nftToDelete))

      fetchNFTs()
    } catch (error) {
      console.error("Error deleting NFT:", error)
      toast({
        title: "Error",
        description: "Failed to delete NFT. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
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

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
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
                    <Input
                      id="nft-name"
                      placeholder="Enter NFT name"
                      value={newNFT.name}
                      onChange={(e) => setNewNFT((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nft-category">Category</Label>
                    <Select
                      value={newNFT.category}
                      onValueChange={(value) => setNewNFT((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tree Planting">Tree Planting</SelectItem>
                        <SelectItem value="Ocean Cleanup">Ocean Cleanup</SelectItem>
                        <SelectItem value="Urban Gardening">Urban Gardening</SelectItem>
                        <SelectItem value="Forest Conservation">Forest Conservation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-description">Description</Label>
                  <Textarea
                    id="nft-description"
                    placeholder="Enter NFT description"
                    value={newNFT.description}
                    onChange={(e) => setNewNFT((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nft-project">Associated Project</Label>
                    <Input
                      id="nft-project"
                      placeholder="Enter project name"
                      value={newNFT.project}
                      onChange={(e) => setNewNFT((prev) => ({ ...prev, project: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nft-rarity">Rarity</Label>
                    <Select
                      value={newNFT.rarity}
                      onValueChange={(value) => setNewNFT((prev) => ({ ...prev, rarity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Common">Common</SelectItem>
                        <SelectItem value="Uncommon">Uncommon</SelectItem>
                        <SelectItem value="Rare">Rare</SelectItem>
                        <SelectItem value="Epic">Epic</SelectItem>
                        <SelectItem value="Legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-recipient">Recipient Email</Label>
                  <Input
                    id="nft-recipient"
                    type="email"
                    placeholder="Enter recipient email"
                    value={newNFT.recipientEmail}
                    onChange={(e) => setNewNFT((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsMintDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={handleCreateNFT}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Mint NFT"
                  )}
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
            <div className="text-2xl font-bold">{totalNFTs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+245 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minted NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalNFTs * 0.94).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">94.1% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalNFTs * 0.06).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting minting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Holders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalNFTs * 0.4).toLocaleString()}</div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedNFTs.length > 0) {
                      setNftToDelete(selectedNFTs[0])
                      setIsDeleteDialogOpen(true)
                    }
                  }}
                >
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
                <Card key={nft._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                      <Badge className={getStatusColor(nft.status)}>{nft.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Checkbox
                        checked={selectedNFTs.includes(nft._id!)}
                        onCheckedChange={() => handleSelectNFT(nft._id!)}
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
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setNftToDelete(nft._id!)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
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
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * 12 + 1} to {Math.min(currentPage * 12, totalNFTs)} of {totalNFTs} NFTs
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete NFT</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this NFT? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNFT} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
