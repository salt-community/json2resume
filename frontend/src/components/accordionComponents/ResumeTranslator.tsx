import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/useTranslate'
import type { ResumeData } from '@/types'
import { Languages, RotateCcw } from 'lucide-react'

interface ResumeTranslatorProps {
  resumeData: ResumeData
  onTranslationComplete: (translatedData: ResumeData) => void
}

export default function ResumeTranslator({ 
  resumeData, 
  onTranslationComplete 
}: ResumeTranslatorProps) {
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
        }
      }
    )
  }

  const handleReset = () => {
    setIsTranslated(false)
  }

  const languageOptions = [
    { value: 'russian', label: 'Russian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'arabic', label: 'Arabic' },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resume Translation</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetLanguage">Target Language</Label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={translateMutation.isPending}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleTranslate}
              disabled={translateMutation.isPending}
              className="flex items-center gap-2 flex-1"
            >
              <Languages className="w-4 h-4" />
              {translateMutation.isPending ? 'Translating...' : 'Translate Resume'}
            </Button>
            
            {isTranslated && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {translateMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">
                Error: {translateMutation.error?.message || 'Translation failed'}
              </p>
            </div>
          )}

          {translateMutation.isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm">
                ✅ Resume translated to {languageOptions.find(l => l.value === targetLanguage)?.label} successfully!
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>This will translate your resume content using AI and update the preview.</p>
            <p>Current target: {languageOptions.find(l => l.value === targetLanguage)?.label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
