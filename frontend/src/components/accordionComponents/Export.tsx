import { useState } from 'react'
import { Download } from 'lucide-react'
import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'
import { exportJSON, exportResumeToPDF } from '@/utils/export'

type Props = {
  resumeData: ResumeData
}

export default function Export({ resumeData }: Props) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportResumeToPDF(resumeData)
    } catch (error) {
      alert('Error exporting PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    try {
      exportJSON(resumeData, resumeData.basics?.name || 'resume')
    } catch (error) {
      alert('Error exporting JSON. Please try again.')
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Export Options</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">PDF Export</h4>
              <p className="text-sm text-muted-foreground">
                Export your resume as a PDF with dynamic height calculation
              </p>
            </div>
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">JSON Export</h4>
              <p className="text-sm text-muted-foreground">
                Download your current resume data as a .json file
              </p>
            </div>
            <Button onClick={handleExportJSON} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
