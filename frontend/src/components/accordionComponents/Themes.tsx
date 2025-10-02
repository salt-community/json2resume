import { memo, useMemo, useState } from 'react'
import { ExternalLink, Eye, FileCode, Github, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inlineThemes } from '@/data/localThemes'

type ThemeSource =
  | { kind: 'url'; url: string }
  | { kind: 'inline'; html: string; css?: string }

interface ThemePreset {
  id: string
  description: string
  source: ThemeSource
}

const presetThemes: Array<ThemePreset> = [
  {
    id: 'SALT Resume',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    },
  },
  {
    id: 'AIK Resume',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/samuel-kar/11b0969ab91989b64650ac9361c8103b',
    },
  },
  {
    id: 'Classic',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/f23e349d88017d6d0c3df09741cdf7c6',
    },
  },
  {
    id: 'Fun',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/c74fd529168695a92ead6cd9976017d6',
    },
  },
  {
    id: 'Terminal',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/8160c1ac2a49a95416c6ec991df48916',
    },
  },
  {
    id: 'Regular',
    description: 'Modern two-column layout with dark sidebar',
    source: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/deceafa6ab9de41a77833607cabd4dc0',
    },
  },
  // Local inline themes
  {
    id: 'Minimal Local',
    description: 'Clean, typography-first resume rendered from inline HTML/CSS',
    source: {
      kind: 'inline',
      html: inlineThemes.minimal.html,
    },
  },
  {
    id: 'Clean Local',
    description: 'Simple card-based layout shipped with the app',
    source: {
      kind: 'inline',
      html: inlineThemes.clean.html,
    },
  },
]

interface Props {
  // Backward compatible: legacy URL-based callback (still called for URL themes)
  onThemeChange?: (themeUrl: string) => void
  // New: theme source callback supporting URL or inline content
  onThemeChangeV2?: (theme: ThemeSource) => void
  // Accept either a legacy URL or a ThemeSource object
  currentTheme?: string | ThemeSource
}

function Themes({ onThemeChange, onThemeChangeV2, currentTheme }: Props) {
  const [customUrl, setCustomUrl] = useState('')
  const [customInlineHtml, setCustomInlineHtml] = useState('')

  const [selectedTheme, setSelectedTheme] = useState<string | null>(() => {
    // Match by URL for legacy string or by inline content for object
    if (typeof currentTheme === 'string') {
      const matchByUrl = presetThemes.find(
        (t) => t.source.kind === 'url' && t.source.url === currentTheme,
      )
      return matchByUrl ? matchByUrl.id : null
    } else if (
      currentTheme &&
      typeof currentTheme === 'object' &&
      'kind' in currentTheme
    ) {
      if (currentTheme.kind === 'url') {
        const matchByUrl = presetThemes.find(
          (t) => t.source.kind === 'url' && t.source.url === currentTheme.url,
        )
        return matchByUrl ? matchByUrl.id : null
      } else {
        const matchByInline = presetThemes.find(
          (t) =>
            t.source.kind === 'inline' &&
            t.source.html === currentTheme.html &&
            t.source.css === currentTheme.css,
        )
        return matchByInline ? matchByInline.id : 'Custom (Inline)'
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  const customInlinePreset: ThemePreset = useMemo(
    () => ({
      id: 'Custom (Inline)',
      description: 'Paste your own theme HTML (uses custom template language)',
      source: { kind: 'inline', html: customInlineHtml },
    }),
    [customInlineHtml],
  )

  const handlePresetSelect = (theme: ThemePreset) => {
    setSelectedTheme(theme.id)
    if (theme.source.kind === 'url') {
      setCustomUrl(theme.source.url)
      onThemeChange?.(theme.source.url)
    } else {
      setCustomUrl('')
    }
    onThemeChangeV2?.(theme.source)
  }

  const handleCustomUrlSubmit = () => {
    if (!customUrl.trim()) return

    // Validate GitHub Gist URL
    const gistUrlPattern = /^https:\/\/gist\.github\.com\/[^/]+\/[a-f0-9]+$/
    if (!gistUrlPattern.test(customUrl)) {
      alert('Please enter a valid GitHub Gist URL')
      return
    }

    setIsLoading(true)
    setSelectedTheme('custom')
    onThemeChange?.(customUrl)
    onThemeChangeV2?.({ kind: 'url', url: customUrl })

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleApplyInline = () => {
    if (!customInlineHtml.trim()) {
      alert('Please paste your theme HTML first')
      return
    }
    setSelectedTheme(customInlinePreset.id)
    onThemeChangeV2?.({ kind: 'inline', html: customInlineHtml })
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
            Choose a theme for your resume preview or enter a custom GitHub Gist
            URL
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

        {/* Custom Inline Theme */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Custom Inline Theme</Label>
          <div className="space-y-2">
            <textarea
              className="w-full h-48 p-3 border rounded-md font-mono text-xs bg-surface text-text-strong border-border"
              placeholder="Paste your template HTML here (supports >>[path]<<, [[#if]], [[#each]], [[#join]])"
              value={customInlineHtml}
              onChange={(e) => setCustomInlineHtml(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Click “Apply Inline Theme” to use the HTML above. Selecting
                another preset will override it.
              </p>
              <Button
                onClick={handleApplyInline}
                disabled={!customInlineHtml.trim()}
                className="px-4"
              >
                Apply Inline Theme
              </Button>
            </div>
          </div>
        </div>

        {/* Preset Themes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Preset Themes</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
            {[customInlinePreset, ...presetThemes].map((theme) => {
              const disabled =
                theme.id === customInlinePreset.id && !customInlineHtml.trim()
              return (
                <div
                  key={theme.id}
                  className={`relative border rounded-lg p-4 transition-all hover:shadow-md ${
                    disabled
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer'
                  } ${
                    selectedTheme === theme.id
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                  style={{
                    backgroundColor:
                      selectedTheme === theme.id
                        ? 'var(--theme-selected)'
                        : 'var(--theme-surface)',
                    color:
                      selectedTheme === theme.id
                        ? 'var(--theme-on-selected)'
                        : 'var(--theme-text-strong)',
                  }}
                  onClick={() => {
                    if (disabled) return
                    handlePresetSelect(theme)
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor:
                            selectedTheme === theme.id
                              ? 'var(--theme-accent)'
                              : 'var(--theme-surface-strong)',
                        }}
                      >
                        <Palette
                          className="w-5 h-5"
                          style={{
                            color:
                              selectedTheme === theme.id
                                ? 'var(--theme-on-accent)'
                                : 'var(--theme-accent)',
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm break-words">
                          {theme.id}
                        </h4>
                        <p
                          className="text-xs mt-1 break-words"
                          style={{
                            color: 'var(--theme-text-muted)',
                          }}
                        >
                          {theme.description}
                        </p>
                      </div>
                    </div>
                    {selectedTheme === theme.id && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 ml-2"
                        style={{ backgroundColor: 'var(--theme-accent)' }}
                      ></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-mono truncate flex-1 min-w-0"
                      style={{ color: 'var(--theme-text-muted)' }}
                    >
                      {theme.source.kind === 'url'
                        ? `${new URL(theme.source.url).host}/...`
                        : theme.id === customInlinePreset.id
                          ? 'custom inline'
                          : 'local theme'}
                    </span>
                    {theme.source.kind === 'url' ? (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(
                              theme.source.kind === 'url'
                                ? theme.source.url
                                : '#',
                              '_blank',
                            )
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(
                              theme.source.kind === 'url'
                                ? theme.source.url
                                : '#',
                              '_blank',
                            )
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          disabled
                        >
                          <FileCode className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Theme Status */}
        {selectedTheme && (
          <div
            className="p-3 rounded-md border"
            style={{
              backgroundColor: 'var(--theme-surface-strong)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              ></div>
              <span
                className="text-sm"
                style={{ color: 'var(--theme-text-strong)' }}
              >
                Theme applied successfully! The preview will update with your
                selected theme.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Themes)
