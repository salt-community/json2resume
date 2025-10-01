import React, { useCallback, useMemo, useRef, useState } from 'react'
import Papa from 'papaparse'
import JSZip from 'jszip'
import { FileArchive, FileUp, Save, Trash2, Upload } from 'lucide-react'
import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactCodeMirror from '@uiw/react-codemirror'
import { jsonLanguage } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view'
import { history } from '@codemirror/commands'

/**
 * LinkedIn CSV/ZIP → JSON Importer
 * --------------------------------------------------------------
 * What it does:
 *  - Accepts either a ZIP from LinkedIn's data export or multiple CSV files
 *  - Parses CSVs in the browser (no backend required)
 *  - Merges everything into a unified JSON object that's easy to consume
 *  - Lets the user download the merged JSON or integrate with resume data
 *
 * Libraries required:
 *   npm i papaparse jszip @types/papaparse
 * (shadcn/ui & lucide-react are used for the UI)
 */

interface LinkedinImporterProps {
  onDataImported?: (data: ResumeData) => void
}

// Helper to download a Blob as a file from the browser
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Heuristic: map LinkedIn CSV filenames → logical collection keys
function mapCsvNameToCollection(name: string) {
  const n = name.toLowerCase()
  if (n.includes('position')) return 'positions'
  if (n.includes('experience')) return 'positions'
  if (n.includes('education')) return 'education'
  if (n.includes('skill')) return 'skills'
  if (n.includes('language')) return 'languages'
  if (n.includes('certification')) return 'certifications'
  if (n.includes('project')) return 'projects'
  if (n.includes('course')) return 'courses'
  if (n.includes('accomplishment')) return 'accomplishments'
  // Only include received recommendations, not given ones
  if (n.includes('recommendation') && n.includes('received'))
    return 'recommendations'
  if (n.includes('connection')) return 'connections'
  if (n.includes('profile')) return 'profile'
  // fallback: use base name without .csv, snake_cased
  return n.replace(/\.csv$/i, '').replace(/[^a-z0-9]+/g, '_')
}

// Normalize/trim CSV header keys
function normalizeHeader(h: string): string {
  return h
    .replaceAll('\uFEFF', '') // strip BOM if present
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^a-z0-9_]/g, '')
}

// Papa Parse configuration
const PAPA_CFG: Papa.ParseConfig = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: normalizeHeader,
}

// Parse a single CSV file into an array of objects
async function parseCsvFile(file: File) {
  const text = await file.text()
  return new Promise<Array<any>>((resolve, reject) => {
    Papa.parse(text, {
      ...PAPA_CFG,
      complete: (res) => {
        if (res.errors && res.errors.length) {
          console.warn('CSV parse errors:', res.errors)
        }
        resolve(res.data)
      },
      error: (err: unknown) => reject(err as Error),
    })
  })
}

// Read a ZIP and parse all CSV entries into collections
async function parseZip(file: File) {
  const zip = await JSZip.loadAsync(file)
  const out: Record<string, Array<any>> = {}

  for (const relPath of Object.keys(zip.files)) {
    if (!relPath.toLowerCase().endsWith('.csv')) continue
    const entry = zip.files[relPath]
    if (!entry) continue
    const csvText = await entry.async('text')
    const data = await new Promise<Array<any>>((resolve, reject) => {
      Papa.parse(csvText, {
        ...PAPA_CFG,
        complete: (res) => resolve(res.data),
        error: (err: unknown) => reject(err as Error),
      })
    })
    const key = mapCsvNameToCollection(relPath.split('/').pop() || relPath)
    out[key] = (out[key] || []).concat(data)
  }
  return out
}

// Merge two collection maps
function mergeCollections(
  a: Record<string, Array<any>>,
  b: Record<string, Array<any>>,
) {
  const out: Record<string, Array<any>> = { ...a }
  for (const [k, v] of Object.entries(b)) {
    out[k] = (out[k] || []).concat(v)
  }
  return out
}

// Build the unified JSON shape we want to work with downstream
function buildUnifiedJson(collections: Record<string, Array<any>>) {
  const unified = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'linkedin-export',
    },
    profile: collections.profile?.[0] || {},
    positions: collections.positions || [],
    education: collections.education || [],
    skills: (collections.skills || []).map(
      (row: any) => row.skill_name || row.name || row.skill || row,
    ),
    languages: collections.languages || [],
    certifications: collections.certifications || [],
    projects: collections.projects || [],
    courses: collections.courses || [],
    accomplishments: collections.accomplishments || [],
    recommendations: collections.recommendations || [],
    connections: collections.connections || [],
    // Keep the originals in case you need exact fields later
    raw: collections,
  }
  return unified
}

// Convert LinkedIn data to ResumeData format
function convertToResumeData(unifiedData: any): ResumeData {
  const profile = unifiedData.profile || {}

  function parseWebsitesField(websites: unknown) {
    if (typeof websites !== 'string' || !websites.trim()) return []
    const inner = websites.trim().replace(/^\[/, '').replace(/\]$/, '')
    return inner
      .split(',')
      .map((part) => part.trim())
      .map((part) => {
        const idx = part.indexOf(':')
        if (idx === -1) return null
        const type = part.slice(0, idx).trim()
        const url = part.slice(idx + 1).trim()
        if (!url) return null
        const network = type
          ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          : ''
        return { network, url }
      })
      .filter(Boolean) as Array<{ network: string; url: string }>
  }

  return {
    basics: {
      name:
        profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : profile.name || profile.full_name || 'Unknown',
      label: profile.headline || profile.title || '',
      email: profile.email_address || profile.email || '',
      phone: profile.phone_numbers || '',
      url: (() => {
        const websiteEntries = parseWebsitesField(profile.websites)
        return profile.linkedin_url || websiteEntries[0]?.url || ''
      })(),
      summary: profile.summary || profile.about || '',
      location: {
        city: profile.city || '',
        region: profile.state || profile.region || '',
        countryCode: profile.country || '',
      },
      profiles: (() => {
        const websiteEntries = parseWebsitesField(profile.websites)
        const primaryUrl = profile.linkedin_url || websiteEntries[0]?.url || ''
        const filteredWebsites = websiteEntries.filter(
          (w) => w.url !== primaryUrl,
        )
        const linkedIn = profile.linkedin_url
          ? [
              {
                network: 'LinkedIn',
                url: profile.linkedin_url,
                username: profile.linkedin_url.split('/').pop() || '',
              },
            ]
          : []
        return [...linkedIn, ...filteredWebsites]
      })(),
    },
    work: (unifiedData.positions || []).map((pos: any) => {
      const start =
        pos.started_on || pos.start_date || pos.start_date_month_year || ''
      const endRaw = (pos.finished_on ??
        pos.end_date ??
        pos.end_date_month_year) as string | null | undefined
      const end = endRaw == null || endRaw === '' ? 'Present' : endRaw
      return {
        name: pos.company_name || pos.organization || '',
        position: pos.title || pos.position || '',
        location: pos.location || '',
        startDate: start,
        endDate: end,
        summary: pos.description || pos.summary || '',
        highlights: [],
      }
    }),
    education: (unifiedData.education || []).map((edu: any) => ({
      institution: edu.school_name || edu.institution || '',
      area: edu.field_of_study || 'FIELD OF STUDY',
      studyType: edu.degree_name || edu.degree || '',
      startDate: edu.start_date || edu.start_date_month_year || '',
      endDate: edu.end_date || edu.end_date_month_year || '',
      score: edu.grade || '',
    })),
    skills: (() => {
      const raw = unifiedData.skills || []
      const keywords: string[] = raw
        .map((s: any) =>
          typeof s === 'string' ? s : s.name || s.skill_name || '',
        )
        .map((s: string) => String(s).trim())
        .filter((s: string) => s.length > 0)
      const deduped: string[] = Array.from(new Set(keywords))
      return deduped.length
        ? [
            {
              name: 'Software Development',
              level: 'Expert',
              keywords: deduped,
            },
          ]
        : []
    })(),
    languages: (() => {
      const mapped = (unifiedData.languages || []).map((lang: any) => ({
        language: lang.language_name || lang.name || '',
        fluency: lang.proficiency || lang.level || '',
      }))
      const hasEnglish = mapped.some(
        (l: any) => (l.language || '').toLowerCase() === 'english',
      )
      if (!hasEnglish) {
        mapped.push({ language: 'English', fluency: 'Full Professional' })
      }
      return mapped
    })(),
    certificates: (unifiedData.certifications || []).map((cert: any) => ({
      name: cert.name || cert.certification_name || '',
      issuer: cert.issuing_organization || cert.issuer || '',
      date: cert.issue_date || cert.date || '',
      url: cert.credential_url || cert.url || '',
    })),
    projects: (unifiedData.projects || []).map((proj: any) => ({
      name: proj.name || proj.title || '',
      description: proj.description || '',
      startDate: proj.start_date || '',
      endDate: proj.end_date || '',
      url: proj.url || '',
    })),
    references: (unifiedData.recommendations || []).map((rec: any) => ({
      name:
        rec.recommender_name ||
        rec.name ||
        `${rec.first_name || ''} ${rec.last_name || ''}`.trim() ||
        'Unknown',
      reference: rec.recommendation_text || rec.message || rec.text || '',
    })),
    meta: {
      version: 'v1.0.0',
      sectionHeaders: {
        work: 'Work',
        volunteer: 'Volunteer',
        education: 'Education',
        awards: 'Awards',
        certificates: 'Certificates',
        publications: 'Publications',
        skills: 'Skills',
        languages: 'Languages',
        interests: 'Interests',
        references: 'References',
        projects: 'Projects',
      },
    },
  }
}

export default function LinkedinImporter({
  onDataImported,
}: LinkedinImporterProps) {
  const [collections, setCollections] = useState<Record<string, Array<any>>>({})
  const [logs, setLogs] = useState<Array<string>>([])
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const addLog = useCallback(
    (m: string) => setLogs((l) => [m, ...l].slice(0, 200)),
    [],
  )

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files.length) return
      setBusy(true)
      try {
        let merged: Record<string, Array<any>> = { ...collections }
        for (const file of Array.from(files)) {
          const lower = file.name.toLowerCase()
          if (lower.endsWith('.zip')) {
            addLog(`Reading ZIP: ${file.name}`)
            const obj = await parseZip(file)
            merged = mergeCollections(merged, obj)
          } else if (lower.endsWith('.csv')) {
            addLog(`Reading CSV: ${file.name}`)
            const data = await parseCsvFile(file)
            const key = mapCsvNameToCollection(file.name)
            merged[key] = (merged[key] || []).concat(data)
          } else {
            addLog(`Ignoring ${file.name} (only .zip and .csv are supported)`)
          }
        }
        setCollections(merged)
        addLog('Done! Files parsed and merged.')
      } catch (e: any) {
        console.error(e)
        addLog(`Error: ${e?.message || e}`)
      } finally {
        setBusy(false)
      }
    },
    [collections, addLog],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      const files = e.dataTransfer.files
      void handleFiles(files)
    },
    [handleFiles],
  )

  const onBrowse = useCallback(() => fileInputRef.current?.click(), [])

  const unified = useMemo(() => buildUnifiedJson(collections), [collections])
  const resumeData = useMemo(() => convertToResumeData(unified), [unified])
  const formattedPreviewJson = useMemo(
    () => JSON.stringify(resumeData, null, 2),
    [resumeData],
  )

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(unified, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, 'linkedin_merged.json')
  }, [unified])

  const handleImportToResume = useCallback(() => {
    if (onDataImported) {
      onDataImported(resumeData)
      addLog('Data imported to resume editor!')
    }
  }, [resumeData, onDataImported, addLog])

  const handleClear = useCallback(() => {
    setCollections({})
    setLogs([])
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Upload className="w-5 h-5" /> Import LinkedIn Export (ZIP or
            multiple CSVs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            To use this importer, first request and download your data export
            from LinkedIn’s
            <a
              href="https://www.linkedin.com/mypreferences/d/download-my-data"
              target="_blank"
              rel="noreferrer noopener"
              className="underline ml-1"
            >
              data download page
            </a>
            . It typically takes 10–15 minutes after requesting before the ZIP
            is available.
          </div>
          <div
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'copy'
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            }`}
            onClick={onBrowse}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-3">
                <FileArchive />
                <FileUp />
              </div>
              <p className="font-medium">
                Drop your ZIP here — or select a bunch of CSV files
              </p>
              <p className="text-sm text-muted-foreground">
                All parsing happens locally in your browser
              </p>
              <Button variant="secondary" className="mt-3" disabled={busy}>
                Choose files
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.csv"
              multiple
              className="hidden"
              onChange={(e) => void handleFiles(e.target.files)}
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleImportToResume}
                disabled={!Object.keys(collections).length || busy}
                variant="default"
                className="flex-shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" /> Import to Resume
              </Button>
              <Button
                onClick={handleDownloadJson}
                disabled={!Object.keys(collections).length || busy}
                variant="outline"
                className="flex-shrink-0"
              >
                <Save className="w-4 h-4 mr-2" /> Download JSON
              </Button>
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={!Object.keys(collections).length || busy}
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!!Object.keys(collections).length && (
        <Card>
          <CardHeader>
            <CardTitle>Converted Resume Data</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactCodeMirror
              value={formattedPreviewJson}
              onChange={() => {}}
              theme={oneDark}
              basicSetup={false}
              extensions={[
                lineNumbers(),
                highlightActiveLineGutter(),
                history(),
                drawSelection(),
                highlightActiveLine(),
                jsonLanguage,
                EditorView.lineWrapping,
                EditorView.editable.of(false),
              ]}
              height="600px"
            />
          </CardContent>
        </Card>
      )}

      {!!logs.length && (
        <div className="mt-6 text-xs text-muted-foreground space-y-1">
          {logs.map((l, i) => (
            <div key={i}>• {l}</div>
          ))}
        </div>
      )}
    </div>
  )
}
