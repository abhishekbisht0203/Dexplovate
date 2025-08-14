"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Upload, File, X, Eye, AlertCircle, RefreshCw, Trash2 } from 'lucide-react'
import axios from "axios"

export default function PDFUpload() {
  const [files, setFiles] = useState([])
  const [uploadedPdfs, setUploadedPdfs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [previewPdf, setPreviewPdf] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const fileInputRef = useRef(null)

  // Your Render backend URL - no .env needed
  const API_BASE_URL = "https://dexplovate.onrender.com"

  useEffect(() => {
    fetchUploadedPdfs()
  }, [])

  const fetchUploadedPdfs = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get(`${API_BASE_URL}/upload-pdf/`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 30000,
        withCredentials: false,
      })

      setUploadedPdfs(response.data)
    } catch (error) {
      console.error("Error fetching PDFs:", error)
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
      } else if (error.request) {
        setError(`Failed to connect to backend at ${API_BASE_URL}. Please check if your Render service is running.`)
      } else {
        setError(`Request error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (selectedFiles) => {
    const pdfFiles = Array.from(selectedFiles).filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== selectedFiles.length) {
      setError("Only PDF files are allowed")
      return
    }

    if (pdfFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("File size must be less than 10MB")
      return
    }

    setError("")
    setFiles(pdfFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError("")

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        await axios.post(`${API_BASE_URL}/upload-pdf/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
          withCredentials: false,
        })
      }

      setFiles([])
      await fetchUploadedPdfs()
    } catch (error) {
      console.error("Upload error:", error)
      if (error.response) {
        setError(`Upload failed: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
      } else if (error.request) {
        setError(`Upload failed: Cannot connect to server at ${API_BASE_URL}`)
      } else {
        setError(`Upload failed: ${error.message}`)
      }
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handlePreview = (pdf) => {
    const pdfUrl = pdf.file.startsWith("http") ? pdf.file : `${API_BASE_URL}${pdf.file}`
    window.open(pdfUrl, "_blank")
  }

  const handleDelete = async (pdfId) => {
    if (!confirm("Are you sure you want to delete this PDF?")) {
      return
    }

    setDeleting(pdfId)
    setError("")

    try {
      await axios.delete(`${API_BASE_URL}/upload-pdf/${pdfId}/`, {
        timeout: 30000,
        withCredentials: false,
      })

      setUploadedPdfs(uploadedPdfs.filter((pdf) => pdf.id !== pdfId))

      if (previewPdf && previewPdf.id === pdfId) {
        setPreviewPdf(null)
      }
    } catch (error) {
      console.error("Delete error:", error)
      if (error.response) {
        setError(`Delete failed: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
      } else if (error.request) {
        setError(`Delete failed: Cannot connect to server at ${API_BASE_URL}`)
      } else {
        setError(`Delete failed: ${error.message}`)
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Upload Your PDFs Effortlessly
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Drag and drop files or click to upload. Manage your document library with ease.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-cyan-600">
              <Upload className="h-7 w-7" />
              Upload PDFs
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Supported formats: PDF. Max file size: 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-50 shadow-lg scale-[1.02]"
                  : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50 hover:shadow-md"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`transition-all duration-300 ${dragActive ? "scale-110" : ""}`}>
                <Upload
                  className={`h-16 w-16 mx-auto mb-6 transition-colors ${dragActive ? "text-cyan-500" : "text-gray-400"}`}
                />
                <p className="text-2xl font-bold text-gray-700 mb-2">
                  {dragActive ? "Drop files here" : "Drag and drop PDFs here"}
                </p>
                <p className="text-lg text-gray-500">
                  or click to browse
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">
                  {error}
                </span>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Selected Files:
                </h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <File className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full h-14 text-lg font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-3" />
                      Upload {files.length} PDF{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl text-cyan-600">
                <File className="h-7 w-7" />
                Your Uploaded Files ({uploadedPdfs.length})
              </CardTitle>
              <Button
                variant="outline"
                onClick={fetchUploadedPdfs}
                disabled={loading}
                className="border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300 transition-colors bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-cyan-400" />
                <p className="text-xl text-gray-600">
                  Loading PDFs...
                </p>
              </div>
            ) : uploadedPdfs.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <File className="h-20 w-20 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">
                  No files uploaded yet. Start by dragging your PDFs here!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {uploadedPdfs.map((pdf) => {
                  const fileName = pdf.file.split("/").pop() || "Unknown file"

                  return (
                    <div
                      key={pdf.id}
                      className="group border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                          <File className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-gray-900 truncate text-lg mb-1"
                            title={fileName}
                          >
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(pdf.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(pdf)}
                          className="flex-1 h-10 border-cyan-200 text-cyan-600 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all duration-200 font-semibold"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pdf.id)}
                          disabled={deleting === pdf.id}
                          className="h-10 px-3 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                        >
                          {deleting === pdf.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}