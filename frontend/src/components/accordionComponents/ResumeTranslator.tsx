import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslate } from '@/useTranslate'
import type { ResumeData } from '@/types'
import { Languages, RotateCcw, Search, CheckCircle, X } from 'lucide-react'

interface ResumeTranslatorProps {
  resumeData: ResumeData
  onTranslationComplete: (translatedData: ResumeData) => void
}

export default function ResumeTranslator({ 
  resumeData, 
  onTranslationComplete 
}: ResumeTranslatorProps) {
  const [targetLanguage, setTargetLanguage] = useState('spanish')
  const [isTranslated, setIsTranslated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const translateMutation = useTranslate()

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

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
          const selectedLang = languageOptions.find(lang => lang.value === targetLanguage)
          setToastMessage(`Resume translated to ${selectedLang?.label} successfully!`)
          setShowToast(true)
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
    // 15 Most Common Languages
    { value: 'chinese', label: 'Chinese (Mandarin)' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'russian', label: 'Russian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'german', label: 'German' },
    { value: 'javanese', label: 'Javanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'french', label: 'French' },
    { value: 'turkish', label: 'Turkish' },
    // Additional popular languages
    { value: 'italian', label: 'Italian' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'swedish', label: 'Swedish' },
    { value: 'norwegian', label: 'Norwegian' },
    { value: 'danish', label: 'Danish' },
    { value: 'finnish', label: 'Finnish' },
    { value: 'polish', label: 'Polish' },
    { value: 'czech', label: 'Czech' },
    { value: 'hungarian', label: 'Hungarian' },
    { value: 'romanian', label: 'Romanian' },
    { value: 'bulgarian', label: 'Bulgarian' },
    { value: 'croatian', label: 'Croatian' },
    { value: 'serbian', label: 'Serbian' },
    { value: 'slovak', label: 'Slovak' },
    { value: 'slovenian', label: 'Slovenian' },
    { value: 'lithuanian', label: 'Lithuanian' },
    { value: 'latvian', label: 'Latvian' },
    { value: 'estonian', label: 'Estonian' },
    { value: 'ukrainian', label: 'Ukrainian' },
    { value: 'belarusian', label: 'Belarusian' },
    { value: 'greek', label: 'Greek' },
    { value: 'hebrew', label: 'Hebrew' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'gujarati', label: 'Gujarati' },
    { value: 'kannada', label: 'Kannada' },
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'thai', label: 'Thai' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'indonesian', label: 'Indonesian' },
    { value: 'malay', label: 'Malay' },
    { value: 'tagalog', label: 'Tagalog' },
    { value: 'swahili', label: 'Swahili' },
    { value: 'amharic', label: 'Amharic' },
    { value: 'hausa', label: 'Hausa' },
    { value: 'yoruba', label: 'Yoruba' },
    { value: 'igbo', label: 'Igbo' },
    { value: 'zulu', label: 'Zulu' },
    { value: 'afrikaans', label: 'Afrikaans' },
    { value: 'persian', label: 'Persian' },
    { value: 'pashto', label: 'Pashto' },
    { value: 'dari', label: 'Dari' },
    { value: 'uzbek', label: 'Uzbek' },
    { value: 'kazakh', label: 'Kazakh' },
    { value: 'kyrgyz', label: 'Kyrgyz' },
    { value: 'tajik', label: 'Tajik' },
    { value: 'turkmen', label: 'Turkmen' },
    { value: 'mongolian', label: 'Mongolian' },
    { value: 'tibetan', label: 'Tibetan' },
    { value: 'nepali', label: 'Nepali' },
    { value: 'sinhala', label: 'Sinhala' },
    { value: 'burmese', label: 'Burmese' },
    { value: 'khmer', label: 'Khmer' },
    { value: 'lao', label: 'Lao' },
  ]

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return languageOptions
    return languageOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const selectedLanguage = languageOptions.find(lang => lang.value === targetLanguage)

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resume Translation</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetLanguage">Target Language</Label>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Language Dropdown */}
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 border-b last:border-b-0 ${
                      targetLanguage === option.value ? 'bg-gray-200 text-gray-900' : ''
                    }`}
                    onClick={() => setTargetLanguage(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No languages found
                </div>
              )}
            </div>

            {/* Selected Language Display */}
            {selectedLanguage && (
              <div className="p-2 bg-muted rounded-md">
                <p className="text-sm font-medium">Selected: {selectedLanguage.label}</p>
              </div>
            )}
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


          <div className="text-sm text-muted-foreground">
            <p>This will translate your resume content using AI and update the preview.</p>
            <p>Current target: {selectedLanguage?.label}</p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-gray-900 flex-1">{toastMessage}</p>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
