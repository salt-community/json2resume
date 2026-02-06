/**
 * Helper function to format file sizes for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Compression function: iteratively compress image to target size
 * Converts images to JPEG format and reduces quality/dimensions until target size is met
 */
export async function compressImage(
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
