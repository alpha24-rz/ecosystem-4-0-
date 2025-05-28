"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArticleEditor } from "@/components/cms/article-editor"
import { AdvancedNFTManager } from "@/components/nft/advanced-nft-manager"
import { WebsiteCustomizer } from "@/components/customizer/website-customizer"
import { SecureFileUpload } from "@/components/upload/secure-file-upload"
import {
  FileText,
  Palette,
  Coins,
  Upload,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react"

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("articles")
  const [articles, setArticles] = useState([
    {
      id: "1",
      title: "The Future of Environmental Conservation",
      status: "published",
      author: "Admin",
      publishDate: "2024-01-20",
      views: 1250,
      featured: true,
    },
    {
      id: "2",
      title: "Blockchain Technology in Sustainability",
      status: "draft",
      author: "Admin",
      publishDate: "2024-01-18",
      views: 0,
      featured: false,
    },
  ])

  const [showEditor, setShowEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)

  const handleSaveArticle = async (articleData: any) => {
    console.log("Saving article:", articleData)
    // Save to backend
    setShowEditor(false)
    setEditingArticle(null)
  }

  const handlePublishArticle = async (articleData: any) => {
    console.log("Publishing article:", articleData)
    // Publish to backend
    setShowEditor(false)
    setEditingArticle(null)
  }

  const handlePreviewArticle = (articleData: any) => {
    console.log("Previewing article:", articleData)
    // Open preview in new tab
  }

  const handleEditArticle = (article: any) => {
    setEditingArticle(article)
    setShowEditor(true)
  }

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== articleId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (showEditor) {
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSaveArticle}
        onPublish={handlePublishArticle}
        onPreview={handlePreviewArticle}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management System</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage articles, NFTs, website appearance, and media files</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published NFTs</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">2.1 GB used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">
            <FileText className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="nfts">
            <Coins className="mr-2 h-4 w-4" />
            NFTs
          </TabsTrigger>
          <TabsTrigger value="customizer">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="media">
            <Upload className="mr-2 h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Article Management</h2>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Articles</CardTitle>
              <CardDescription>Manage your blog posts and educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{article.title}</h3>
                        {article.featured && <Badge variant="secondary">Featured</Badge>}
                        <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.publishDate}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NFTs Tab */}
        <TabsContent value="nfts">
          <AdvancedNFTManager />
        </TabsContent>

        {/* Website Customizer Tab */}
        <TabsContent value="customizer">
          <WebsiteCustomizer />
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Media Library</h2>
            <p className="text-gray-600 dark:text-gray-400">Upload and manage your media files</p>
          </div>
          <SecureFileUpload
            maxFileSize={50}
            maxFiles={20}
            onUploadComplete={(files) => console.log("Upload completed:", files)}
            onUploadError={(error) => console.error("Upload error:", error)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
