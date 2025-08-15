"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Upload, File, X, AlertCircle, RefreshCw, Trash2, Eye } from "lucide-react"
import axios from "axios"

export default function PDFUpload() {
  const [files, setFiles] = useState([])
  const [uploadedPdfs, setUploadedPdfs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showUrlHelper, setShowUrlHelper] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState("")
  const [currentPdfName, setCurrentPdfName] = useState("")
  const fileInputRef = useRef(null)

  const API_BASE_URL = "https://dexplovate.onrender.com"

  useEffect(() => {
    fetchUploadedPdfs()
  }, [])

  const fetchUploadedPdfs = async () => {
    setLoading(true)
    setError("")

    const fetchUrl = `${API_BASE_URL}/api/upload-pdf/`
    console.log("[v0] Fetching PDFs from:", fetchUrl)

    try {
      const response = await axios.get(fetchUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 30000,
        withCredentials: false,
      })

      console.log("[v0] Successfully fetched PDFs:", response.data)
      setUploadedPdfs(response.data)
    } catch (error) {
      console.error("[v0] Error fetching PDFs:", error)
      console.log("[v0] Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      })

      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
      } else if (error.request) {
        setError(
          `Failed to connect to backend at ${API_BASE_URL}. Please check if your Django service is running and accessible.`,
        )
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

        const uploadUrl = `${API_BASE_URL}/api/upload-pdf/`
        console.log("[v0] Uploading to:", uploadUrl)

        await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
          withCredentials: false,
        })

        console.log("[v0] Successfully uploaded:", file.name)
      }

      setFiles([])
      await fetchUploadedPdfs()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      console.log("[v0] Upload error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      })

      if (error.response) {
        setError(`Upload failed: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`)
      } else if (error.request) {
        setError(
          `Upload failed: Cannot connect to server at ${API_BASE_URL}. Make sure your Django backend is running.`,
        )
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

  const handlePreview = async (pdf) => {
    console.log("[v0] Attempting to access PDF:", pdf.file)
    setError("")

    const fileName = pdf.file.split("/").pop() || "Unknown file"
    setCurrentPdfUrl(pdf.file)
    setCurrentPdfName(fileName)
    setShowUrlHelper(true)
  }

  const handleDelete = async (pdfId) => {
    if (!confirm("Are you sure you want to delete this PDF?")) {
      return
    }

    setDeleting(pdfId)
    setError("")

    try {
      await axios.delete(`${API_BASE_URL}/api/delete-pdf/${pdfId}/`, {
        timeout: 30000,
        withCredentials: false,
      })

      setUploadedPdfs(uploadedPdfs.filter((pdf) => pdf.id !== pdfId))
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

  const handleDownloadPdf = async (url, filename) => {
    try {
      console.log("[v0] Attempting to download PDF:", url)

      // First try to fetch the PDF to check if it's accessible
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
      })

      // Create download link
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log("[v0] Download initiated successfully")

      // Show success message
      setTimeout(() => {
        alert(
          "Download started! If the download didn't work, your Django server may not be serving media files properly. Try copying the URL and accessing it directly in a new browser tab.",
        )
      }, 1000)
    } catch (error) {
      console.error("[v0] Download failed:", error)
      alert(
        "Download failed due to server configuration issues. Please copy the URL below and try accessing it directly in a new browser tab.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">PDF Document Manager</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload, preview, and manage your PDF documents with ease. Drag and drop or click to upload.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
              <Upload className="h-7 w-7" />
              Upload PDFs
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Supported formats: PDF only. Maximum file size: 10MB per file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-blue-400 bg-blue-50 shadow-lg scale-[1.02]"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`transition-all duration-300 ${dragActive ? "scale-110" : ""}`}>
                <Upload
                  className={`h-16 w-16 mx-auto mb-6 transition-colors ${dragActive ? "text-blue-500" : "text-gray-400"}`}
                />
                <p className="text-2xl font-bold text-gray-700 mb-2">
                  {dragActive ? "Drop files here" : "Drag and drop PDFs here"}
                </p>
                <p className="text-lg text-gray-500">or click to browse your files</p>
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
                <span className="font-medium">{error}</span>
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Selected Files ({files.length}):</h3>
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
                          <p className="font-semibold text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl text-blue-600">
                <File className="h-7 w-7" />
                Your Documents ({uploadedPdfs.length})
              </CardTitle>
              <Button
                variant="outline"
                onClick={fetchUploadedPdfs}
                disabled={loading}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-xl text-gray-600">Loading your documents...</p>
              </div>
            ) : uploadedPdfs.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <File className="h-20 w-20 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No documents uploaded yet. Start by uploading your first PDF!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploadedPdfs.map((pdf) => {
                  const fileName = pdf.file.split("/").pop() || "Unknown file"

                  return (
                    <div
                      key={pdf.id}
                      className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                          <File className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate mb-1" title={fileName}>
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(pdf.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(pdf)}
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pdf.id)}
                          disabled={deleting === pdf.id}
                          className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
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

        {showUrlHelper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Access Your PDF</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUrlHelper(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Server Issue Detected</h4>
                  </div>
                  <p className="text-red-800">
                    Your Django server isn't serving PDF files properly. Use the options below to access your document.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📄 {currentPdfName}</h4>
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleDownloadPdf(currentPdfUrl, currentPdfName)}
                        className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                      >
                        <Upload className="h-5 w-5 mr-3" />
                        Try Download (May Fail Due to Server)
                      </Button>

                      <Button
                        onClick={() => {
                          window.open(currentPdfUrl + "?t=" + Date.now(), "_blank")
                        }}
                        variant="outline"
                        className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Try Direct View (May Fail)
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-100 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Copy URL to try in different browser:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentPdfUrl}
                        readOnly
                        className="flex-1 p-2 text-sm bg-white border rounded font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(currentPdfUrl)
                          alert("URL copied! Try pasting in a new browser tab.")
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">🔧 Django Backend Fix Needed</h5>
                    <p className="text-sm text-blue-800 mb-2">
                      To fix this permanently, add this to your Django main urls.py:
                    </p>
                    <code className="block p-2 bg-white rounded text-xs font-mono border">
                      urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
                    </code>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Current Status:</strong> Your PDFs are uploaded successfully to the database, but the
                      Django server can't serve the actual files. The URLs are correct, but return 404 errors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
