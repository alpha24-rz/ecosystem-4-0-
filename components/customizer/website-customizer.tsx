"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Type,
  Layout,
  ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Eye,
  RotateCcw,
  Upload,
  Download,
  Settings,
  Zap,
} from "lucide-react"

interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      base: number
      heading: number
    }
    lineHeight: number
  }
  layout: {
    maxWidth: string
    spacing: number
    borderRadius: number
  }
  components: {
    header: {
      height: number
      transparent: boolean
      sticky: boolean
    }
    hero: {
      height: string
      backgroundType: "color" | "gradient" | "image"
      backgroundValue: string
    }
    footer: {
      columns: number
      showSocial: boolean
    }
  }
}

interface SectionConfig {
  id: string
  name: string
  enabled: boolean
  order: number
  settings: Record<string, any>
}

export function WebsiteCustomizer() {
  const [activeTab, setActiveTab] = useState("theme")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    colors: {
      primary: "#10b981",
      secondary: "#3b82f6",
      accent: "#8b5cf6",
      background: "#ffffff",
      text: "#1f2937",
    },
    typography: {
      fontFamily: "Inter",
      fontSize: {
        base: 16,
        heading: 32,
      },
      lineHeight: 1.6,
    },
    layout: {
      maxWidth: "1200px",
      spacing: 16,
      borderRadius: 8,
    },
    components: {
      header: {
        height: 80,
        transparent: false,
        sticky: true,
      },
      hero: {
        height: "60vh",
        backgroundType: "gradient",
        backgroundValue: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
      },
      footer: {
        columns: 4,
        showSocial: true,
      },
    },
  })

  const [sections, setSections] = useState<SectionConfig[]>([
    { id: "hero", name: "Hero Section", enabled: true, order: 1, settings: {} },
    { id: "features", name: "Features", enabled: true, order: 2, settings: {} },
    { id: "projects", name: "Projects", enabled: true, order: 3, settings: {} },
    { id: "nfts", name: "NFT Gallery", enabled: true, order: 4, settings: {} },
    { id: "articles", name: "Latest Articles", enabled: true, order: 5, settings: {} },
    { id: "testimonials", name: "Testimonials", enabled: false, order: 6, settings: {} },
    { id: "newsletter", name: "Newsletter", enabled: true, order: 7, settings: {} },
  ])

  const fontOptions = ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Source Sans Pro", "Nunito"]

  const updateThemeConfig = (path: string, value: any) => {
    setThemeConfig((prev) => {
      const keys = path.split(".")
      const updated = { ...prev }
      let current: any = updated

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return updated
    })
    setHasUnsavedChanges(true)
  }

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, enabled: !section.enabled } : section)),
    )
    setHasUnsavedChanges(true)
  }

  const reorderSections = (fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated.map((section, index) => ({ ...section, order: index + 1 }))
    })
    setHasUnsavedChanges(true)
  }

  const saveChanges = async () => {
    try {
      // Save theme config and sections to backend
      console.log("Saving theme config:", themeConfig)
      console.log("Saving sections:", sections)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Failed to save changes:", error)
    }
  }

  const resetToDefaults = () => {
    // Reset to default theme
    setHasUnsavedChanges(true)
  }

  const exportTheme = () => {
    const themeData = {
      theme: themeConfig,
      sections: sections,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ecosystem-theme.json"
    a.click()
  }

  const getDeviceClass = () => {
    switch (previewDevice) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-2xl"
      default:
        return "max-w-full"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Customizer Panel */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Website Customizer</h2>
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && <Badge variant="secondary">Unsaved</Badge>}
              <Button size="sm" onClick={saveChanges} disabled={!hasUnsavedChanges}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="theme" className="text-xs">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Theme Tab */}
          <TabsContent value="theme" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={themeConfig.colors.primary}
                      onChange={(e) => updateThemeConfig("colors.primary", e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={themeConfig.colors.primary}
                      onChange={(e) => updateThemeConfig("colors.primary", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={themeConfig.colors.secondary}
                      onChange={(e) => updateThemeConfig("colors.secondary", e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={themeConfig.colors.secondary}
                      onChange={(e) => updateThemeConfig("colors.secondary", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={themeConfig.colors.accent}
                      onChange={(e) => updateThemeConfig("colors.accent", e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={themeConfig.colors.accent}
                      onChange={(e) => updateThemeConfig("colors.accent", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={themeConfig.typography.fontFamily}
                    onValueChange={(value) => updateThemeConfig("typography.fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Font Size: {themeConfig.typography.fontSize.base}px</Label>
                  <Slider
                    value={[themeConfig.typography.fontSize.base]}
                    onValueChange={([value]) => updateThemeConfig("typography.fontSize.base", value)}
                    min={12}
                    max={24}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Heading Size: {themeConfig.typography.fontSize.heading}px</Label>
                  <Slider
                    value={[themeConfig.typography.fontSize.heading]}
                    onValueChange={([value]) => updateThemeConfig("typography.fontSize.heading", value)}
                    min={24}
                    max={48}
                    step={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Page Sections</CardTitle>
                <CardDescription>Enable/disable and reorder page sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sections.map((section, index) => (
                  <div key={section.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} size="sm" />
                      <span className="text-sm">{section.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => index > 0 && reorderSections(index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => index < sections.length - 1 && reorderSections(index, index + 1)}
                        disabled={index === sections.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Header Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Height: {themeConfig.components.header.height}px</Label>
                  <Slider
                    value={[themeConfig.components.header.height]}
                    onValueChange={([value]) => updateThemeConfig("components.header.height", value)}
                    min={60}
                    max={120}
                    step={10}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Transparent</Label>
                  <Switch
                    checked={themeConfig.components.header.transparent}
                    onCheckedChange={(checked) => updateThemeConfig("components.header.transparent", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Sticky</Label>
                  <Switch
                    checked={themeConfig.components.header.sticky}
                    onCheckedChange={(checked) => updateThemeConfig("components.header.sticky", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <Select
                    value={themeConfig.components.hero.backgroundType}
                    onValueChange={(value) => updateThemeConfig("components.hero.backgroundType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Background Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {themeConfig.components.hero.backgroundType === "image" && (
                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload background image</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Import/Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={exportTheme}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Theme
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Theme
                </Button>
                <Button variant="outline" className="w-full" onClick={resetToDefaults}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Controls */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="font-medium">Live Preview</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                <Eye className="mr-2 h-4 w-4" />
                {isPreviewMode ? "Exit Preview" : "Full Preview"}
              </Button>
              <Button onClick={saveChanges} disabled={!hasUnsavedChanges}>
                <Zap className="mr-2 h-4 w-4" />
                Publish Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
          <div
            className={`mx-auto bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${getDeviceClass()}`}
          >
            {/* Mock Website Preview */}
            <div
              style={{
                fontFamily: themeConfig.typography.fontFamily,
                fontSize: `${themeConfig.typography.fontSize.base}px`,
                lineHeight: themeConfig.typography.lineHeight,
                color: themeConfig.colors.text,
              }}
            >
              {/* Header */}
              <header
                style={{
                  height: `${themeConfig.components.header.height}px`,
                  backgroundColor: themeConfig.components.header.transparent
                    ? "transparent"
                    : themeConfig.colors.background,
                }}
                className="flex items-center justify-between px-6 border-b"
              >
                <div className="font-bold text-xl" style={{ color: themeConfig.colors.primary }}>
                  Ecosystem 4.0
                </div>
                <nav className="hidden md:flex space-x-6">
                  <a href="#" className="hover:opacity-75">
                    Home
                  </a>
                  <a href="#" className="hover:opacity-75">
                    Projects
                  </a>
                  <a href="#" className="hover:opacity-75">
                    NFTs
                  </a>
                  <a href="#" className="hover:opacity-75">
                    Learn
                  </a>
                </nav>
              </header>

              {/* Hero Section */}
              {sections.find((s) => s.id === "hero")?.enabled && (
                <section
                  style={{
                    height: themeConfig.components.hero.height,
                    background:
                      themeConfig.components.hero.backgroundType === "gradient"
                        ? themeConfig.components.hero.backgroundValue
                        : themeConfig.colors.primary,
                  }}
                  className="flex items-center justify-center text-white text-center"
                >
                  <div>
                    <h1
                      style={{
                        fontSize: `${themeConfig.typography.fontSize.heading}px`,
                      }}
                      className="font-bold mb-4"
                    >
                      Building a Sustainable Future
                    </h1>
                    <p className="text-xl mb-8">Join the environmental revolution with blockchain technology</p>
                    <button
                      style={{
                        backgroundColor: themeConfig.colors.accent,
                        borderRadius: `${themeConfig.layout.borderRadius}px`,
                      }}
                      className="px-8 py-3 text-white font-medium hover:opacity-90"
                    >
                      Get Started
                    </button>
                  </div>
                </section>
              )}

              {/* Features Section */}
              {sections.find((s) => s.id === "features")?.enabled && (
                <section className="py-16 px-6">
                  <div className="max-w-6xl mx-auto">
                    <h2
                      style={{
                        fontSize: `${themeConfig.typography.fontSize.heading * 0.75}px`,
                        color: themeConfig.colors.primary,
                      }}
                      className="text-center font-bold mb-12"
                    >
                      Our Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={{
                            borderRadius: `${themeConfig.layout.borderRadius}px`,
                          }}
                          className="p-6 border text-center"
                        >
                          <div
                            style={{
                              backgroundColor: themeConfig.colors.secondary,
                              borderRadius: `${themeConfig.layout.borderRadius}px`,
                            }}
                            className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                          >
                            <span className="text-white text-2xl">🌱</span>
                          </div>
                          <h3 className="font-semibold mb-2">Feature {i}</h3>
                          <p className="text-gray-600">Description of feature {i}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Footer */}
              <footer
                style={{
                  backgroundColor: themeConfig.colors.text,
                  color: themeConfig.colors.background,
                }}
                className="py-12 px-6"
              >
                <div className="max-w-6xl mx-auto text-center">
                  <div className="font-bold text-xl mb-4" style={{ color: themeConfig.colors.primary }}>
                    Ecosystem 4.0
                  </div>
                  <p className="opacity-75">Building a sustainable future together</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
