import LinkedinImporter from '@/components/DataImport/LinkedinImport/LinkedinImporter'
import JsonImporter from '@/components/DataImport/JsonImport/JsonImporter'
import type { ResumeData } from '@/types'

type Props = {
  onDataImported?: (data: ResumeData) => void
}

export default function DataImporter({ onDataImported }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Import</h3>
        <p className="text-sm text-muted-foreground">
          Import your resume data from LinkedIn or a JSON file.
        </p>
      </div>

      <div className="space-y-6">
        <LinkedinImporter onDataImported={onDataImported} />

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">JSON Import</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Import your resume data from a JSON file.
          </p>
          <JsonImporter onDataImported={onDataImported} />
        </div>
      </div>
    </div>
  )
}