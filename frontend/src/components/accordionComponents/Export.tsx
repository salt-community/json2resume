import type { ResumeData } from '@/types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Download } from 'lucide-react'

type Props = {
  resumeData: ResumeData
}

export default function Export({ resumeData }: Props) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      // Get the current resume HTML content from the GistTemplate
      const resumeElement = document.querySelector('[data-resume-content]')
      if (!resumeElement) {
        throw new Error('Resume content not found')
      }

      // Clone the resume content
      const clonedContent = resumeElement.cloneNode(true) as HTMLElement
      
      // Create a hidden iframe for PDF generation
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.top = '-9999px'
      iframe.style.width = '800px'
      iframe.style.height = '600px'
      document.body.appendChild(iframe)

      // Create HTML document for PDF generation
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
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
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${clonedContent.outerHTML}
            </div>
          </body>
        </html>
      `

      // Write content to iframe
      iframe.contentDocument?.write(htmlContent)
      iframe.contentDocument?.close()

      // Wait for content to load and images to render
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Calculate exact scrollable height
      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      const scrollHeight = iframeDoc.documentElement.scrollHeight
      const pageHeightMm = scrollHeight * 0.264583

      // Add print-specific styles with exact height and full page coverage
      const printStyles = `
        <style>
          @media print {
            @page {
              size: 210mm ${pageHeightMm}mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              height: ${pageHeightMm}mm;
              overflow: hidden;
            }
            .resume-container {
              width: 100%;
              margin: 0;
              padding: 0;
              height: ${pageHeightMm}mm;
              overflow: hidden;
            }
            .page {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .main-content {
              margin: 0 !important;
              padding: 0 !important;
            }
            .sidebar {
              margin: 0 !important;
              padding: 16px !important;
            }
            .content {
              margin: 0 !important;
              padding: 8px !important;
            }
            .header {
              margin: 0 !important;
              padding: 8px 16px !important;
            }
            /* Ensure images and graphics are included */
            img {
              max-width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Force background graphics to be enabled */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Ensure all backgrounds, borders, and colors are printed */
            body, html {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Specific overrides for background elements */
            [style*="background"],
            [class*="bg-"],
            .bg-white,
            .bg-gray,
            .bg-black,
            .bg-blue,
            .bg-red,
            .bg-green,
            .bg-yellow,
            .bg-purple,
            .bg-pink,
            .bg-indigo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Force background graphics for resume elements */
            .resume-container,
            .page,
            .main-content,
            .sidebar,
            .content,
            .header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      `

      // Inject the print styles
      const styleElement = iframeDoc.createElement('style')
      styleElement.innerHTML = printStyles
      iframeDoc.head.appendChild(styleElement)

      // Enable background graphics programmatically
      try {
        // Add additional CSS to force background graphics
        const backgroundGraphicsStyle = iframeDoc.createElement('style')
        backgroundGraphicsStyle.innerHTML = `
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        `
        iframeDoc.head.appendChild(backgroundGraphicsStyle)
        
        // Small delay to ensure styles are applied
        setTimeout(() => {
          iframe.contentWindow?.print()
        }, 100)
      } catch (error) {
        // Fallback: just print normally
        iframe.contentWindow?.print()
      }

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
