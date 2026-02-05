import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'
import jsonObjFromJsonString from '@/data/jsonObjFromJsonString'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj'

type Props = {
  onDataImported?: (data: ResumeData) => void
}

export default function JsonImporter({ onDataImported }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return
    setBusy(true)
    try {
      for (const file of Array.from(files)) {
        const lower = file.name.toLowerCase()
        const isJson =
          lower.endsWith('.json') || file.type === 'application/json'
        if (!isJson) {
          console.warn(`Ignoring ${file.name} (only .json files are allowed)`)
          alert('Only .json files are allowed.')
          continue
        }

        try {
          const text = await file.text()
          const jsonObj = jsonObjFromJsonString(text)
          const rData = resumeDataFromJsonObj(jsonObj)
          onDataImported?.(rData)
        } catch (e) {
          console.error(`Failed to parse ${file.name} as JSON:`, e)
          alert(`Failed to parse ${file.name} as valid JSON.`)
        }
      }
    } finally {
      setBusy(false)
    }
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const files = e.dataTransfer.files
    void handleFiles(files)
  }

  const onBrowse = () => fileInputRef.current?.click()

  return (
    <div className="p-6">
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">JSON Import</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Import your resume data from a JSON file.
        </p>
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
            <Upload className="w-5 h-5" />
            <p className="font-medium">
              Drop your JSON file here — or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Only .json files are accepted
            </p>
            <Button variant="secondary" className="mt-3" disabled={busy}>
              Choose JSON file
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            multiple={false}
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  )
}
