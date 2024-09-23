'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, Image as ImageIcon, Download, Maximize2, X } from "lucide-react"
import Image from 'next/image'
import { removeBackground } from '@/app/actions/removeBackground'

export function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const processImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    try {
      const processedImageUrl = await removeBackground(selectedImage)
      setProcessedImage(processedImageUrl)
    } catch (error) {
      console.error("Error processing image:", error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'processed-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFullscreen = (imageUrl: string) => {
    setFullscreenImage(imageUrl)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Image Processor</h1>
        <p className="text-gray-600">Remove backgrounds with ease</p>
      </header>

      <main className="flex flex-1 p-8 gap-8">
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Upload Image</h2>
          <div 
            className={`mb-6 border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${
              dragActive ? 'border-gray-400 bg-gray-100' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
              <p className="mt-2 text-sm text-gray-400">
                {selectedImage ? 'Click or drag to replace' : 'Click or drag and drop to upload an image'}
              </p>
            </label>
          </div>
          {selectedImage ? (
            <div className="mb-6 relative group">
              <Image
                src={selectedImage}
                alt="Selected Image"
                width={400}
                height={400}
                style={{ objectFit: 'contain', maxHeight: '400px' }}
                className="rounded-lg shadow-md transition-opacity duration-300 group-hover:opacity-75"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => handleFullscreen(selectedImage)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="mb-6 border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
              <p className="mt-2 text-sm text-gray-400">No image selected</p>
            </div>
          )}
          <Button
            onClick={processImage}
            disabled={!selectedImage || isProcessing}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white transition duration-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Process Image
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Processed Image</h2>
          {processedImage ? (
            <div className="relative">
              <Image
                src={processedImage}
                alt="Processed Image"
                width={400}
                height={400}
                style={{ objectFit: 'contain', maxHeight: '400px' }}
                className="rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600"
                  onClick={() => handleFullscreen(processedImage)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600"
                  onClick={() => handleDownload(processedImage)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
              <p className="mt-2 text-sm text-gray-400">No processed image yet</p>
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-gray-600 bg-white border-t border-gray-200 shadow-sm">
        © 2024 Image Processor. All rights reserved.
      </footer>

      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={fullscreenImage}
              alt="Fullscreen Image"
              width={1200}
              height={1200}
              style={{ objectFit: 'contain' }}
              className="rounded-lg shadow-lg"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}