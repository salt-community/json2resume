import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Palette, Github } from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
  url: string
  preview: string
}

const presetThemes: Theme[] = [
  {
    id: 'salt-resume',
    name: 'SALT Resume',
    description: 'Modern two-column layout with dark sidebar',
    url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    preview: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161'
  },
  {
    id: 'salt-resume-2',
    name: 'SALT Resume (Copy)',
    description: 'Modern two-column layout with dark sidebar',
    url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    preview: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161'
  },
  {
    id: 'salt-resume-3',
    name: 'SALT Resume (Copy 2)',
    description: 'Modern two-column layout with dark sidebar',
    url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    preview: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161'
  }
]

interface Props {
  onThemeChange?: (themeUrl: string) => void
}

export default function Themes({ onThemeChange }: Props) {
  const [customUrl, setCustomUrl] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePresetSelect = (theme: Theme) => {
    setSelectedTheme(theme.id)
    setCustomUrl(theme.url)
    onThemeChange?.(theme.url)
  }

  const handleCustomUrlSubmit = () => {
    if (!customUrl.trim()) return
    
    // Validate GitHub Gist URL
    const gistUrlPattern = /^https:\/\/gist\.github\.com\/[^\/]+\/[a-f0-9]+$/
    if (!gistUrlPattern.test(customUrl)) {
      alert('Please enter a valid GitHub Gist URL')
      return
    }

    setIsLoading(true)
    setSelectedTheme('custom')
    onThemeChange?.(customUrl)
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value)
    if (selectedTheme !== 'custom') {
      setSelectedTheme(null)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Theme Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose a theme for your resume preview or enter a custom GitHub Gist URL
          </p>
        </div>

        {/* Custom URL Input */}
        <div className="space-y-3">
          <Label htmlFor="theme-url" className="text-sm font-medium">
            Custom Theme URL
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                id="theme-url"
                type="url"
                placeholder="https://gist.github.com/username/gist-id"
                value={customUrl}
                onChange={handleUrlChange}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleCustomUrlSubmit}
              disabled={!customUrl.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Apply
                </div>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a GitHub Gist URL containing your custom theme HTML/CSS
          </p>
        </div>

        {/* Preset Themes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Preset Themes</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetThemes.map((theme) => (
              <div
                key={theme.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePresetSelect(theme)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-500" />
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                  </div>
                  {selectedTheme === theme.id && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {theme.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono">
                    gist.github.com/...
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(theme.preview, '_blank')
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Theme Status */}
        {selectedTheme && (
          <div className="p-3 rounded-md bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">
                Theme applied successfully! The preview will update with your selected theme.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
