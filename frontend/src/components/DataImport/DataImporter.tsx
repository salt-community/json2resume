import { Suspense, lazy } from 'react'
import type { ResumeData } from '@/types'

type Props = {
  onDataImported?: (data: ResumeData) => void
}

// Lazy load heavy import components
const JsonImporter = lazy(
  () => import('@/components/DataImport/JsonImport/JsonImporter'),
)
const LinkedinImporter = lazy(
  () => import('@/components/DataImport/LinkedinImport/LinkedinImporter'),
)

export default function DataImporter({ onDataImported }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Import</h3>
        <p className="text-sm text-muted-foreground">
          Import your resume data from LinkedIn or a JSON file.
        </p>
      </div>

      <div className="">
        <Suspense
          fallback={
            <div className="p-4 text-center">Loading JSON Importer...</div>
          }
        >
          <JsonImporter onDataImported={onDataImported} />
        </Suspense>
        <Suspense
          fallback={
            <div className="p-4 text-center">Loading LinkedIn Importer...</div>
          }
        >
          <LinkedinImporter onDataImported={onDataImported} />
        </Suspense>
      </div>
    </div>
  )
}
