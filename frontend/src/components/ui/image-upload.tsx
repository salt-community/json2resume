import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Label } from './label'

interface ImageUploadProps {
  value?: string // Base64 data URI
  onChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  showLabel?: boolean // Whether to show the "Profile Image" label
}

// Helper function to format file sizes
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Compression function: iteratively compress image to target size
async function compressImage(
  file: File,
  targetSizeBytes: number = 250 * 1024, // 250KB default
): Promise<{ dataUri: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        let maxDimension = 400
        const aspectRatio = img.width / img.height
        let width = img.width
        let height = img.height

        // Resize if image is larger than max dimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            width = maxDimension
            height = maxDimension / aspectRatio
          } else {
            height = maxDimension
            width = maxDimension * aspectRatio
          }
        }

        // Quality steps to try
        const qualitySteps = [0.85, 0.8, 0.75, 0.7]
        let currentQualityIndex = 0
        let currentMaxDimension = maxDimension

        const tryCompress = () => {
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(width)
          canvas.height = Math.round(height)
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Try current quality
          const quality = qualitySteps[currentQualityIndex]
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'))
                return
              }

              // Check if we've reached target size
              if (blob.size <= targetSizeBytes) {
                // Convert blob to base64 data URI
                const reader = new FileReader()
                reader.onload = () => {
                  resolve({
                    dataUri: reader.result as string,
                    originalSize,
                    compressedSize: blob.size,
                  })
                }
                reader.onerror = () => reject(new Error('Failed to read compressed image'))
                reader.readAsDataURL(blob)
                return
              }

              // If still too large and we've tried all qualities, reduce dimensions
              if (currentQualityIndex >= qualitySteps.length - 1) {
                if (currentMaxDimension > 250) {
                  currentMaxDimension -= 50
                  if (width > height) {
                    width = currentMaxDimension
                    height = currentMaxDimension / aspectRatio
                  } else {
                    height = currentMaxDimension
                    width = currentMaxDimension * aspectRatio
                  }
                  currentQualityIndex = 0 // Reset quality to start again with smaller dimensions
                  tryCompress()
                  return
                } else {
                  // We've reached minimum dimensions and quality, accept current result
                  const reader = new FileReader()
                  reader.onload = () => {
                    resolve({
                      dataUri: reader.result as string,
                      originalSize,
                      compressedSize: blob.size,
                    })
                  }
                  reader.onerror = () => reject(new Error('Failed to read compressed image'))
                  reader.readAsDataURL(blob)
                  return
                }
              }

              // Try next quality level
              currentQualityIndex++
              tryCompress()
            },
            'image/jpeg',
            quality,
          )
        }

        tryCompress()
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = dataUrl
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function ImageUpload({
  value,
  onChange,
  className,
  showLabel = true,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number
    compressedSize: number
  } | null>(null)

  const handleFileSelect = async (file: File) => {
    // File validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, JPEG, or PNG)')
      return
    }

    setIsCompressing(true)
    setCompressionInfo(null)

    try {
      const result = await compressImage(file)
      onChange(result.dataUri)
      setCompressionInfo({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
      })
    } catch (error) {
      console.error('Image compression failed:', error)
      // Fallback to original image if compression fails
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          onChange(result)
        }
      }
      reader.onerror = () => {
        alert('Failed to process image. Please try again.')
      }
      reader.readAsDataURL(file)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleRemove = () => {
    onChange(undefined)
    setCompressionInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <Label>Profile Image</Label>}

      {value ? (
        <div className="space-y-2">
          {/* Image Preview */}
          <div className="relative inline-block">
            <img
              src={value}
              alt="Profile preview"
              className="w-24 h-24 object-cover rounded-lg border border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Compression Info */}
          {compressionInfo && (
            <p className="text-xs text-muted-foreground">
              Compressed from {formatFileSize(compressionInfo.originalSize)} to{' '}
              {formatFileSize(compressionInfo.compressedSize)}
            </p>
          )}

          {/* Upload New Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="w-full"
            disabled={isCompressing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Image
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          } ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground mb-2">
                Compressing image...
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop an image here, or click to select
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}
