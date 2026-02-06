import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Label } from './label'
import { compressImage, formatFileSize } from '@/utils/imageUtils'

interface ImageUploadProps {
  value?: string // Base64 data URI
  onChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  showLabel?: boolean // Whether to show the "Profile Image" label
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
