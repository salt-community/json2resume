import React, { useRef, useState, useCallback } from 'react'
import { Upload, FileText, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  onFileRemove?: () => void
  acceptedTypes?: string[]
  maxSizeInMB?: number
  className?: string
  disabled?: boolean
  isLoading?: boolean
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]

const DEFAULT_MAX_SIZE_MB = 10

export function FileUploader({
  onFileUpload,
  onFileRemove,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  className = '',
  disabled = false,
  isLoading = false,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check if file exists
      if (!file) {
        return 'Please select a file'
      }

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        const types = acceptedTypes
          .map((type) => type.split('/')[1].toUpperCase())
          .join(', ')
        return `Please select a valid file type (${types})`
      }

      // Check file size
      const maxSizeBytes = maxSizeInMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeInMB}MB`
      }

      // Check for empty file
      if (file.size === 0) {
        return 'File appears to be empty'
      }

      return null
    },
    [acceptedTypes, maxSizeInMB],
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null)

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setSelectedFile(file)
      onFileUpload(file)
    },
    [validateFile, onFileUpload],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleRemove = useCallback(() => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileRemove?.()
  }, [onFileRemove])

  const handleUploadClick = useCallback(() => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click()
    }
  }, [disabled, isLoading])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  const getFileTypeDescription = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return 'Image file (JPG, PNG)'
    } else if (fileType === 'application/pdf') {
      return 'PDF document'
    }
    return 'Document'
  }

  if (selectedFile) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>Selected File</Label>
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface-strong">
          <div className="flex items-center space-x-3">
            {getFileIcon(selectedFile.type)}
            <div>
              <p className="font-medium text-text-strong">
                {selectedFile.name}
              </p>
              <p className="text-sm text-text-muted">
                {getFileTypeDescription(selectedFile.type)} •{' '}
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Upload Resume File</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <div className="flex flex-col items-center space-y-2">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-text-strong">
              {isLoading ? 'Processing...' : 'Drag and drop your resume here'}
            </p>
            <p className="text-sm text-text-muted">or click to select a file</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isLoading}
            onClick={(e) => {
              e.stopPropagation()
              handleUploadClick()
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <p className="text-xs text-text-muted">
            Supports JPG, PNG, PDF up to {maxSizeInMB}MB
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isLoading}
      />
    </div>
  )
}
