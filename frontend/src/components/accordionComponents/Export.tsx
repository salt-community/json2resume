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
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.top = '-9999px'
      iframe.style.width = '800px'
      iframe.style.height = '600px'
      document.body.appendChild(iframe)

      // Create HTML document for PDF generation with the extracted content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Resume - ${resumeData.basics.name}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
                color: black;
                line-height: 1.6;
                overflow: visible;
              }
              * {
                box-sizing: border-box;
              }
              .resume-container {
                width: 100%;
                margin: 0;
                padding: 0;
                background: white;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${resumeInnerHtml}
            </div>
          </body>
        </html>
      `

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
          body {
            margin: 0;
            padding: 0;
            height: ${pageHeightMm}mm;
            width: ${pageWidthMm}mm;
            overflow: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .resume-container {
            width: ${pageWidthMm}mm;
            margin: 0;
            padding: 0;
            height: ${pageHeightMm}mm;
            overflow: hidden;
          }
          .page,
          .main-content,
          .sidebar,
          .content,
          .header {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          img {
            max-width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
          [style*="background"],
          [class*="bg-"] {
            background-image: none !important;
          }
          .no-print,
          .print-hidden {
            display: none !important;
          }
          * {
            box-shadow: none !important;
            text-shadow: none !important;
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
