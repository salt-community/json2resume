import React, { useCallback, useMemo, useRef, useState } from 'react'
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
import {
  parseCsvFile,
  parseZip,
  mergeCollections,
  mapCsvNameToCollection,
  buildUnifiedJson,
} from './parserUtils'
import { convertToResumeData } from './dataConverter'
import { downloadBlob } from './utils'

/**
 * LinkedIn CSV/ZIP → JSON Importer Component
 * ==========================================
 *
 * This React component provides a complete UI for importing LinkedIn export data
 * and converting it to ResumeData format. It handles both ZIP files (LinkedIn's
 * standard export format) and individual CSV files.
 *
 * Key Features:
 * - Drag & drop file upload interface
 * - Support for ZIP archives and individual CSV files
 * - Real-time parsing and data conversion
 * - Live preview of converted ResumeData
 * - Download functionality for raw JSON data
 * - Integration callback for importing to resume editor
 * - Comprehensive error handling and user feedback
 *
 * The component orchestrates the parsing utilities and data converter to provide
 * a seamless user experience for LinkedIn data import.
 *
 * Dependencies:
 * - papaparse: CSV parsing
 * - jszip: ZIP file extraction
 * - @uiw/react-codemirror: JSON preview
 * - lucide-react: Icons
 * - shadcn/ui: UI components
 *
 */

interface LinkedinImporterProps {
  /** Callback function called when data is successfully imported to resume editor */
  onDataImported?: (data: ResumeData) => void
}

export default function LinkedinImporter({
  onDataImported,
}: LinkedinImporterProps) {
  // State management for parsed data collections
  const [collections, setCollections] = useState<Record<string, Array<any>>>({})

  // Activity logs for user feedback
  const [logs, setLogs] = useState<Array<string>>([])

  // Loading state for async operations
  const [busy, setBusy] = useState(false)

  // Drag & drop visual feedback
  const [dragOver, setDragOver] = useState(false)

  // Reference to hidden file input for programmatic access
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /**
   * Adds a log message to the activity log with automatic cleanup
   * Keeps only the most recent 200 log entries to prevent memory issues
   */
  const addLog = useCallback(
    (m: string) => setLogs((l) => [m, ...l].slice(0, 200)),
    [],
  )

  /**
   * Handles file processing for both ZIP and CSV files
   *
   * This function processes uploaded files and merges them with existing collections.
   * It supports both ZIP archives (LinkedIn's standard export) and individual CSV files.
   * The function maintains state across multiple file uploads, allowing users to
   * upload files incrementally.
   *
   * @param files - FileList from file input or drag & drop
   */
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files.length) return
      setBusy(true)
      try {
        // Start with existing collections to support incremental uploads
        let merged: Record<string, Array<any>> = { ...collections }

        // Process each file individually
        for (const file of Array.from(files)) {
          const lower = file.name.toLowerCase()

          if (lower.endsWith('.zip')) {
            // Handle ZIP archives (LinkedIn's standard export format)
            addLog(`Reading ZIP: ${file.name}`)
            const obj = await parseZip(file)
            merged = mergeCollections(merged, obj)
          } else if (lower.endsWith('.csv')) {
            // Handle individual CSV files
            addLog(`Reading CSV: ${file.name}`)
            const data = await parseCsvFile(file)
            const key = mapCsvNameToCollection(file.name)
            merged[key] = (merged[key] || []).concat(data)
          } else {
            // Skip unsupported file types
            addLog(`Ignoring ${file.name} (only .zip and .csv are supported)`)
          }
        }

        // Update state with merged collections
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

  /**
   * Handles drag & drop file events
   *
   * Prevents default browser behavior and processes dropped files
   */
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

  /**
   * Triggers file input dialog programmatically
   */
  const onBrowse = useCallback(() => fileInputRef.current?.click(), [])

  // Memoized data transformations for performance
  const unified = useMemo(() => buildUnifiedJson(collections), [collections])
  const resumeData = useMemo(() => convertToResumeData(unified), [unified])
  const formattedPreviewJson = useMemo(
    () => JSON.stringify(resumeData, null, 2),
    [resumeData],
  )

  /**
   * Downloads the unified JSON data as a file
   *
   * Creates a downloadable JSON file containing the raw LinkedIn data
   * in unified format for external use or backup purposes.
   */
  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(unified, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, 'linkedin_merged.json')
  }, [unified])

  /**
   * Imports the converted ResumeData to the parent component
   *
   * Calls the onDataImported callback with the converted resume data,
   * allowing the parent component to integrate the data into the resume editor.
   */
  const handleImportToResume = useCallback(() => {
    if (onDataImported) {
      onDataImported(resumeData)
      addLog('Data imported to resume editor!')
    }
  }, [resumeData, onDataImported, addLog])

  /**
   * Clears all imported data and logs
   *
   * Resets the component to its initial state, removing all parsed data
   * and activity logs.
   */
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
            from LinkedIn's
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
