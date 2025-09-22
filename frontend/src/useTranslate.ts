import { useMutation } from "@tanstack/react-query"

// Types for the translation request and response
interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

interface TranslationResponse {
  translatedText: string

}

// API function to handle the translation request
async function translateText(payload: TranslationRequest): Promise<TranslationResponse> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
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