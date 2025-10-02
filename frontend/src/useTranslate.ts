import { useMutation } from "@tanstack/react-query"
import type { ResumeData } from "@/types"

// Types for the translation request and response
interface TranslationRequest {
  resumeData: ResumeData
  targetLanguage: string
  sourceLanguage?: string
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api'

// API function to handle the translation request
export async function translateText(payload: TranslationRequest): Promise<ResumeData> {
  const response = await fetch(`${API_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Custom hook for translation
export function useTranslate() {
  return useMutation({
    mutationFn: translateText,
    onSuccess: (data) => {
      console.log('Translation successful:', data)
    },
    onError: (error) => {
      console.error('Translation failed:', error)
    },
  })
}