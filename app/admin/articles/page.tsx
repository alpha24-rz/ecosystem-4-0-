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
  Calendar,
  User,
  FileText,
  Globe,
  Loader2,
} from "lucide-react"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { Article } from "@/lib/models/article"

export default function ArticlesPage() {
  const { user, userData, loading } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()

  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [publishedFilter, setPublishedFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data for new article
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    tags: "",
    published: false,
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

    fetchArticles()
  }, [user, userData, loading, router, currentPage, publishedFilter, categoryFilter, searchQuery])

  const fetchArticles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", "10")

      if (publishedFilter !== "all") {
        params.append("published", publishedFilter)
      }

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter)
      }

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      const response = await fetch(`/api/articles?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch articles")
      }

      const data = await response.json()
      setArticles(data.articles || [])
      setTotalArticles(data.pagination?.total || 0)
      setTotalPages(data.pagination?.pages || 1)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching articles:", error)
      setError("Failed to fetch articles. Please try again.")
      setIsLoading(false)

      // Fallback to mock data for demo
      const mockArticles = [
        {
          _id: "1",
          title: "The Future of Environmental Conservation",
          slug: "future-environmental-conservation",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          excerpt: "Exploring innovative approaches to environmental conservation in the digital age.",
          author: "Dr. Jane Smith",
          category: "Conservation",
          tags: ["environment", "conservation", "technology"],
          published: true,
          publishedAt: new Date("2024-01-15"),
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          _id: "2",
          title: "NFTs and Environmental Impact",
          slug: "nfts-environmental-impact",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
          excerpt: "Understanding how NFTs can be used to promote environmental awareness.",
          author: "John Doe",
          category: "Technology",
          tags: ["nft", "blockchain", "environment"],
          published: false,
          createdAt: new Date("2024-01-12"),
          updatedAt: new Date("2024-01-12"),
        },
      ] as Article[]

      setArticles(mockArticles)
      setTotalArticles(25)
      setTotalPages(Math.ceil(25 / 10))
      setIsLoading(false)
    }
  }

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId],
    )
  }

  const handleSelectAll = () => {
    setSelectedArticles(selectedArticles.length === articles.length ? [] : articles.map((article) => article._id!))
  }

  const handleCreateArticle = async () => {
    setIsSubmitting(true)

    try {
      if (!newArticle.title || !newArticle.content || !newArticle.author) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newArticle,
          tags: newArticle.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create article")
      }

      const data = await response.json()

      toast({
        title: "Article Created",
        description: `Article "${newArticle.title}" has been created successfully`,
      })

      setNewArticle({
        title: "",
        content: "",
        excerpt: "",
        author: "",
        category: "",
        tags: "",
        published: false,
      })
      setIsCreateDialogOpen(false)
      setIsSubmitting(false)

      fetchArticles()
    } catch (error) {
      console.error("Error creating article:", error)
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/articles/${articleToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete article")
      }

      toast({
        title: "Article Deleted",
        description: "Article has been deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setArticleToDelete(null)
      setIsSubmitting(false)
      setSelectedArticles((prev) => prev.filter((id) => id !== articleToDelete))

      fetchArticles()
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Article Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage blog posts and educational content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
                <DialogDescription>Write a new blog post or educational content</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="article-title">Title</Label>
                    <Input
                      id="article-title"
                      placeholder="Enter article title"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="article-author">Author</Label>
                    <Input
                      id="article-author"
                      placeholder="Enter author name"
                      value={newArticle.author}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="article-category">Category</Label>
                    <Select
                      value={newArticle.category}
                      onValueChange={(value) => setNewArticle((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservation">Conservation</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="article-tags">Tags (comma separated)</Label>
                    <Input
                      id="article-tags"
                      placeholder="environment, conservation, nft"
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-excerpt">Excerpt</Label>
                  <Textarea
                    id="article-excerpt"
                    placeholder="Brief description of the article"
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-content">Content</Label>
                  <Textarea
                    id="article-content"
                    placeholder="Write your article content here..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle((prev) => ({ ...prev, content: e.target.value }))}
                    rows={10}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="article-published"
                    checked={newArticle.published}
                    onCheckedChange={(checked) => setNewArticle((prev) => ({ ...prev, published: checked as boolean }))}
                  />
                  <Label htmlFor="article-published">Publish immediately</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={handleCreateArticle}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Article"
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
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter((a) => a.published).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((articles.filter((a) => a.published).length / articles.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter((a) => !a.published).length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(articles.map((a) => a.category)).size}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>Manage blog posts and educational content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles by title, content, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Drafts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Conservation">Conservation</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedArticles.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <span className="text-sm font-medium">
                {selectedArticles.length} article{selectedArticles.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Publish
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedArticles.length > 0) {
                      setArticleToDelete(selectedArticles[0])
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

          {/* Articles List */}
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Checkbox
                        checked={selectedArticles.includes(article._id!)}
                        onCheckedChange={() => handleSelectArticle(article._id!)}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{article.title}</h3>
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString()
                              : new Date(article.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {article.content.length} characters
                          </div>
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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
                          View Article
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Article
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Globe className="mr-2 h-4 w-4" />
                          {article.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setArticleToDelete(article._id!)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Article
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalArticles)} of {totalArticles}{" "}
              articles
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
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle} disabled={isSubmitting}>
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
