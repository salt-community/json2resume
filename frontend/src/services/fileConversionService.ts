import type { ResumeData } from '@/types'

const API_URL =
  (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080') + '/api'

export interface FileConversionRequest {
  fileData: string // Base64 encoded file content
  fileType: string // MIME type
  fileName: string // Original file name
  targetLanguage?: string // Optional for future multi-language support
}

/**
 * Converts a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * API function to convert file to resume JSON
 */
export async function convertFileToResume(
  request: FileConversionRequest,
): Promise<ResumeData> {
  const response = await fetch(`${API_URL}/convert-file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let errorMessage = `File conversion failed: ${response.status} ${response.statusText}`

    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {
      // If response is not JSON, use the text content
      const errorText = await response.text()
      if (errorText) {
        errorMessage = errorText
      }
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

/**
 * Convenience function to convert a File object to resume JSON
 */
export async function convertFile(
  file: File,
  targetLanguage?: string,
): Promise<ResumeData> {
  const fileData = await fileToBase64(file)

  const request: FileConversionRequest = {
    fileData,
    fileType: file.type,
    fileName: file.name,
    targetLanguage,
  }

  return convertFileToResume(request)
}
