"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Video, Zap, Eye, Download, Share2, Trash2, Edit, Plus, Loader2 } from "lucide-react"
import Image from "next/image"

interface NFTMetadata {
  name: string
  description: string
  image: string
  animation_url?: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string | number
    display_type?: "boost_number" | "boost_percentage" | "number" | "date"
  }>
  properties: {
    category: string
    creator: string
    royalties: number
  }
}

interface NFTCollection {
  id: string
  name: string
  description: string
  symbol: string
  totalSupply: number
  mintedCount: number
  floorPrice: number
  volume: number
}

interface NFTFormData {
  name: string
  description: string
  collection: string
  category: string
  price: number
  royalties: number
  supply: number
  unlockableContent: boolean
  explicitContent: boolean
  blockchain: "ethereum" | "polygon" | "binance"
  metadata: NFTMetadata
  files: {
    image?: File
    animation?: File
    audio?: File
  }
}

export function AdvancedNFTManager() {
  const [activeTab, setActiveTab] = useState("create")
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    collection: "",
    category: "art",
    price: 0,
    royalties: 10,
    supply: 1,
    unlockableContent: false,
    explicitContent: false,
    blockchain: "ethereum",
    metadata: {
      name: "",
      description: "",
      image: "",
      attributes: [],
      properties: {
        category: "art",
        creator: "",
        royalties: 10,
      },
    },
    files: {},
  })

  const [newAttribute, setNewAttribute] = useState({
    trait_type: "",
    value: "",
    display_type: undefined as any,
  })

  useEffect(() => {
    loadCollections()
    loadNFTs()
  }, [])

  const loadCollections = async () => {
    // Mock data - replace with actual API call
    setCollections([
      {
        id: "1",
        name: "Eco Warriors",
        description: "Environmental conservation NFTs",
        symbol: "ECO",
        totalSupply: 10000,
        mintedCount: 2500,
        floorPrice: 0.1,
        volume: 125.5,
      },
      {
        id: "2",
        name: "Green Future",
        description: "Sustainable future artwork",
        symbol: "GREEN",
        totalSupply: 5000,
        mintedCount: 1200,
        floorPrice: 0.25,
        volume: 89.2,
      },
    ])
  }

  const loadNFTs = async () => {
    // Mock data - replace with actual API call
    setNfts([
      {
        id: "1",
        name: "Forest Guardian #001",
        image: "/placeholder.svg?height=300&width=300",
        collection: "Eco Warriors",
        price: 0.15,
        status: "listed",
        rarity: "rare",
      },
      {
        id: "2",
        name: "Ocean Protector #042",
        image: "/placeholder.svg?height=300&width=300",
        collection: "Eco Warriors",
        price: 0.08,
        status: "sold",
        rarity: "common",
      },
    ])
  }

  const handleFileUpload = (type: "image" | "animation" | "audio", file: File) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [type]: file,
      },
    }))

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleAddAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          attributes: [
            ...prev.metadata.attributes,
            {
              trait_type: newAttribute.trait_type,
              value: newAttribute.value,
              display_type: newAttribute.display_type,
            },
          ],
        },
      }))
      setNewAttribute({ trait_type: "", value: "", display_type: undefined })
    }
  }

  const handleRemoveAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        attributes: prev.metadata.attributes.filter((_, i) => i !== index),
      },
    }))
  }

  const handleMintNFT = async () => {
    setIsLoading(true)
    try {
      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Here you would integrate with actual blockchain minting
      console.log("Minting NFT:", formData)

      // Reset form
      setFormData({
        name: "",
        description: "",
        collection: "",
        category: "art",
        price: 0,
        royalties: 10,
        supply: 1,
        unlockableContent: false,
        explicitContent: false,
        blockchain: "ethereum",
        metadata: {
          name: "",
          description: "",
          image: "",
          attributes: [],
          properties: {
            category: "art",
            creator: "",
            royalties: 10,
          },
        },
        files: {},
      })

      setActiveTab("manage")
      await loadNFTs()
    } catch (error) {
      console.error("Minting failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "uncommon":
        return "bg-green-100 text-green-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NFT Management Studio</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, manage, and track your environmental NFTs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Collection
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Collection
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create NFT</TabsTrigger>
          <TabsTrigger value="manage">Manage NFTs</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Create NFT Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Details</CardTitle>
                  <CardDescription>Basic information about your NFT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nft-name">Name</Label>
                      <Input
                        id="nft-name"
                        placeholder="Enter NFT name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nft-collection">Collection</Label>
                      <Select
                        value={formData.collection}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, collection: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.id}>
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nft-description">Description</Label>
                    <Textarea
                      id="nft-description"
                      placeholder="Describe your NFT"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nft-category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="utility">Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nft-price">Price (ETH)</Label>
                      <Input
                        id="nft-price"
                        type="number"
                        step="0.001"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nft-royalties">Royalties (%)</Label>
                      <Input
                        id="nft-royalties"
                        type="number"
                        max="50"
                        placeholder="10"
                        value={formData.royalties}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, royalties: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Media Files</CardTitle>
                  <CardDescription>Upload your NFT assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Main Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 50MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload("image", e.target.files[0])}
                      />
                    </div>
                  </div>

                  {/* Animation Upload */}
                  <div className="space-y-2">
                    <Label>Animation (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Video className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">MP4, WebM, GIF</p>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload("animation", e.target.files[0])}
                      />
                    </div>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle>Properties & Attributes</CardTitle>
                  <CardDescription>Add traits that make your NFT unique</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Trait type"
                      value={newAttribute.trait_type}
                      onChange={(e) => setNewAttribute((prev) => ({ ...prev, trait_type: e.target.value }))}
                    />
                    <Input
                      placeholder="Value"
                      value={newAttribute.value}
                      onChange={(e) => setNewAttribute((prev) => ({ ...prev, value: e.target.value }))}
                    />
                    <Button onClick={handleAddAttribute}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {formData.metadata.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{attr.trait_type}:</span> {attr.value}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAttribute(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {formData.files.image ? (
                      <Image
                        src={URL.createObjectURL(formData.files.image) || "/placeholder.svg"}
                        alt="NFT Preview"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium">{formData.name || "Untitled NFT"}</h3>
                    <p className="text-sm text-gray-600">{formData.description || "No description"}</p>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span>{formData.price} ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Blockchain</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.blockchain}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, blockchain: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="binance">Binance Smart Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Advanced Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Advanced Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="unlockable">Unlockable Content</Label>
                    <Switch
                      id="unlockable"
                      checked={formData.unlockableContent}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, unlockableContent: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="explicit">Explicit Content</Label>
                    <Switch
                      id="explicit"
                      checked={formData.explicitContent}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, explicitContent: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Mint Button */}
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleMintNFT}
                disabled={isLoading || !formData.name || !formData.files.image}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting NFT...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Mint NFT
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Manage NFTs Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{nft.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{nft.collection}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{nft.price} ETH</span>
                    <Badge variant={nft.status === "sold" ? "default" : "secondary"}>{nft.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{collection.name}</CardTitle>
                    <Badge>{collection.symbol}</Badge>
                  </div>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Supply:</span>
                      <div className="font-medium">{collection.totalSupply.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Minted:</span>
                      <div className="font-medium">{collection.mintedCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Floor Price:</span>
                      <div className="font-medium">{collection.floorPrice} ETH</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Volume:</span>
                      <div className="font-medium">{collection.volume} ETH</div>
                    </div>
                  </div>
                  <Progress value={(collection.mintedCount / collection.totalSupply) * 100} className="mt-4" />
                  <p className="text-xs text-gray-600 mt-1">
                    {((collection.mintedCount / collection.totalSupply) * 100).toFixed(1)}% minted
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-green-600">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">214.7 ETH</div>
                <p className="text-xs text-green-600">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.075 ETH</div>
                <p className="text-xs text-red-600">-3% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
