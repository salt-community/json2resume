import { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'
import { GistTemplate } from '@/components/GistTemplate'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

// Print optimization styles for continuous PDF layout
const PRINT_OPTIMIZATION_STYLES = `
<style>
  @media print {
    @page { 
      size: A4; 
      margin: 18mm; 
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Remove all page break controls for continuous flow */
    * {
      page-break-inside: auto !important;
      break-inside: auto !important;
      page-break-before: auto !important;
      break-before: auto !important;
      page-break-after: auto !important;
      break-after: auto !important;
    }
    
    /* Ensure continuous flow without breaks */
    .gist-template-container {
      width: 100% !important;
      max-width: none !important;
    }
  }
</style>
`

export default function PdfExport({ resumeData }: Props) {
  const [isExporting, setIsExporting] = useState(false)
  const [processedHtml, setProcessedHtml] = useState('')

  const exportToPdf = () => {
    if (!resumeData.basics?.name) {
      alert('Please fill in at least the basic information before exporting.')
      return
    }

    if (!processedHtml) {
      alert('Please wait for the template to load before exporting.')
      return
    }

    setIsExporting(true)

    try {
      // Create a new window for PDF export
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        alert('Please allow popups to export PDF. Then try again.')
        return
      }

      // Write the processed HTML with print optimizations
      printWindow.document.write(processedHtml + PRINT_OPTIMIZATION_STYLES)
      printWindow.document.close()

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()

          // Close the window after printing (optional)
          printWindow.onafterprint = () => {
            printWindow.close()
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <FileText className="h-5 w-5" />
          <span className="text-sm">
            Export your resume as a professional PDF
          </span>
        </div>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Generate a high-quality PDF of your resume using the current template.
          The PDF will be optimized for continuous printing without page breaks.
        </p>

        <Button
          onClick={exportToPdf}
          disabled={isExporting || !resumeData.basics.name || !processedHtml}
          className="w-full max-w-sm"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </>
          )}
        </Button>

        {!resumeData.basics.name && (
          <p className="text-sm text-orange-600 font-medium">
            Please fill in your basic information first
          </p>
        )}

        {!processedHtml && resumeData.basics.name && (
          <p className="text-sm text-blue-600 font-medium">
            Loading template...
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-sm">Export Features:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Uses your current template design</li>
          <li>• Print-optimized A4 format</li>
          <li>• Continuous page layout (no page breaks)</li>
          <li>• Preserves all colors and styling</li>
          <li>• Compatible with all major browsers</li>
        </ul>
      </div>

      {/* Hidden GistTemplate to capture the rendered HTML */}
      <div style={{ display: 'none' }}>
        <GistTemplate
          gistUrl="https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161"
          resumeData={filterByEnabled(resumeData)}
          onProcessed={(html) => setProcessedHtml(html)}
        />
      </div>
    </div>
  )
}

function filterByEnabled(data: ResumeData): ResumeData {
  return {
    ...data,
    basics: data.basics?.enabled === false ? undefined : data.basics,
    work: (data.work ?? []).filter((w) => w.enabled !== false),
    education: (data.education ?? []).filter((e) => e.enabled !== false),
    projects: (data.projects ?? []).filter((p) => p.enabled !== false),
    skills: (data.skills ?? []).filter((s) => s.enabled !== false),
    certificates: (data.certificates ?? []).filter((c) => c.enabled !== false),
    awards: (data.awards ?? []).filter((a) => a.enabled !== false),
    publications: (data.publications ?? []).filter((p) => p.enabled !== false),
    volunteer: (data.volunteer ?? []).filter((v) => v.enabled !== false),
    languages: (data.languages ?? []).filter((l) => l.enabled !== false),
    interests: (data.interests ?? []).filter((i) => i.enabled !== false),
    references: (data.references ?? []).filter((r) => r.enabled !== false),
  }
}
