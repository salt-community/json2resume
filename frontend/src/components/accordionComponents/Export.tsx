import { useState } from 'react'
import { Download } from 'lucide-react'
import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
}

export default function Export({ resumeData }: Props) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = async () => {
    setIsExporting(true)
    // Note: For best results, ensure "Background graphics" is enabled in your browser's print dialog
    try {
      // Find the rendered resume inside the Gist iframe and extract its HTML
      const gistIframe = document.querySelector(
        'iframe[sandbox][srcdoc]',
      ) as HTMLIFrameElement | null

      if (!gistIframe) {
        throw new Error('Resume content not found')
      }

      const gistDoc = gistIframe.contentDocument
      const resumeInnerHtml =
        gistDoc?.body?.innerHTML ||
        gistIframe.getAttribute('srcdoc') ||
        ''

      if (!resumeInnerHtml || resumeInnerHtml.trim().length === 0) {
        throw new Error('Resume content not found')
      }

      // Create a hidden iframe for PDF generation
      const iframe = document.createElement('iframe')
      /*iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.top = '-9999px'
      iframe.style.width = '800px'
      iframe.style.height = '600px'*/
      document.body.appendChild(iframe)

      // Create HTML document for PDF generation with the extracted content
      const htmlContent = resumeInnerHtml

      // Write content to the print iframe
      iframe.contentDocument?.open()
      iframe.contentDocument?.write(htmlContent)
      iframe.contentDocument?.close()

      // Wait for content to load and images to render
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate exact scrollable height
      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      const scrollHeight = iframeDoc.documentElement.scrollHeight
      const pageHeightMm = scrollHeight * 0.264583
      const contentWidthPx = iframeDoc.documentElement.scrollWidth
      const pageWidthMm = contentWidthPx * 0.264583

      // Add print-specific styles with exact height and full page coverage
      const printCSS = `
        @media print {
          @page {
            size: ${pageWidthMm}mm ${pageHeightMm}mm;
            margin: 0;
          }
        }
      `
      const styleElement = iframeDoc.createElement('style')
      styleElement.textContent = printCSS
      iframeDoc.head.appendChild(styleElement)

      // Small delay to ensure styles are applied
      setTimeout(() => {
        iframe.contentWindow?.print()
      }, 150)

      // Clean up iframe after a delay
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 3000)

    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    } finally {
      setIsExporting(false)
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
              onClick={exportToPDF} 
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
