"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  status: "uploading" | "completed" | "error"
  progress: number
  error?: string
}

interface FileUploadProps {
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
}

export function SecureFileUpload({
  acceptedTypes = ["image/*", "video/*", "audio/*", ".pdf", ".doc", ".docx"],
  maxFileSize = 50,
  maxFiles = 10,
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        onUploadError?.(`Maximum ${maxFiles} files allowed`)
        return
      }

      setIsUploading(true)

      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: file.type,
        url: "",
        uploadedAt: new Date(),
        status: "uploading",
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate file upload with progress
      for (const [index, file] of acceptedFiles.entries()) {
        const fileId = newFiles[index].id

        try {
          // Validate file size
          if (file.size > maxFileSize * 1024 * 1024) {
            throw new Error(`File size exceeds ${maxFileSize}MB limit`)
          }

          // Validate file type
          const isValidType = acceptedTypes.some((type) => {
            if (type.includes("*")) {
              return file.type.startsWith(type.replace("*", ""))
            }
            return file.name.toLowerCase().endsWith(type)
          })

          if (!isValidType) {
            throw new Error("File type not supported")
          }

          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
          }

          // Create object URL for preview
          const url = URL.createObjectURL(file)

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "completed",
                    progress: 100,
                    url,
                  }
                : f,
            ),
          )
        } catch (error: any) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "error",
                    error: error.message,
                  }
                : f,
            ),
          )
          onUploadError?.(error.message)
        }
      }

      setIsUploading(false)
      const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
      onUploadComplete?.(completedFiles)
    },
    [uploadedFiles, maxFiles, maxFileSize, acceptedTypes, onUploadComplete, onUploadError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxFileSize * 1024 * 1024,
    disabled: isUploading,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    if (type.startsWith("audio/")) return Music
    if (type.includes("pdf") || type.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Upload up to {maxFiles} files. Maximum size: {maxFileSize}MB per file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  {isUploading ? "Uploading..." : "Drag & drop files here, or click to select"}
                </p>
                <p className="text-sm text-gray-500">Supported formats: {acceptedTypes.join(", ")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.type)
                return (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {file.type.startsWith("image/") && file.url ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <FileIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center space-x-2">
                          {file.status === "completed" && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{formatFileSize(file.size)}</p>

                      {/* Status */}
                      <div className="flex items-center space-x-2">
                        {file.status === "uploading" && (
                          <>
                            <Progress value={file.progress} className="flex-1" />
                            <span className="text-xs text-gray-500">{file.progress}%</span>
                          </>
                        )}
                        {file.status === "completed" && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {file.status === "error" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>

                      {/* Error Message */}
                      {file.status === "error" && file.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{file.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span>
                {uploadedFiles.filter((f) => f.status === "completed").length} of {uploadedFiles.length} files uploaded
              </span>
              <span>Total size: {formatFileSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0))}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
