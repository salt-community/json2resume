import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/useTranslate'
import type { ResumeData } from '@/types'

interface TemporaryTranslatorProps {
  resumeData: ResumeData
  onTranslationComplete: (translatedData: ResumeData) => void
}

export default function TemporaryTranslator({ 
  resumeData, 
  onTranslationComplete 
}: TemporaryTranslatorProps) {
  const [targetLanguage, setTargetLanguage] = useState('russian')
  const [isTranslated, setIsTranslated] = useState(false)
  
  const translateMutation = useTranslate()

  const handleTranslate = () => {
    translateMutation.mutate(
      {
        resumeData,
        targetLanguage,
        sourceLanguage: 'english'
      },
      {
        onSuccess: (translatedData) => {
          onTranslationComplete(translatedData)
          setIsTranslated(true)
        },
        onError: (error) => {
          console.error('Translation failed:', error)
          alert(`Translation failed: ${error.message}`)
        }
      }
    )
  }

  const handleReset = () => {
    setIsTranslated(false)
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h3 className="text-lg font-semibold">Temporary Translator</h3>
      
      <div className="space-y-2">
        <label htmlFor="targetLanguage" className="block text-sm font-medium">
          Target Language:
        </label>
        <select
          id="targetLanguage"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={translateMutation.isPending}
        >
          <option value="russian">Russian</option>
          <option value="chinese">Chinese</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="japanese">Japanese</option>
          <option value="korean">Korean</option>
          <option value="arabic">Arabic</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleTranslate}
          disabled={translateMutation.isPending}
          className="flex-1"
        >
          {translateMutation.isPending ? 'Translating...' : 'Translate Resume'}
        </Button>
        
        {isTranslated && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        )}
      </div>

      {translateMutation.isError && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 text-sm">
            Error: {translateMutation.error?.message || 'Translation failed'}
          </p>
        </div>
      )}

      {translateMutation.isSuccess && (
        <div className="p-3 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-700 text-sm">
            ✅ Resume translated to {targetLanguage} successfully!
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>This will translate the resume data and update the preview.</p>
        <p>Current language: {targetLanguage}</p>
      </div>
    </div>
  )
}
