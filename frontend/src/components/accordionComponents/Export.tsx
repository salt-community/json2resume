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
            <title>Resume - ${resumeData.basics?.name ?? 'Resume'}</title>
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
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate exact scrollable height
      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      // Prefer measuring the actual resume container if present
      const resumeContainer = iframeDoc.querySelector('.resume-container')

      // Gather multiple measurements for robustness
      const docScrollHeight = iframeDoc.documentElement.scrollHeight
      const bodyScrollHeight = iframeDoc.body.scrollHeight
      const containerScrollHeight = resumeContainer?.scrollHeight ?? 0
      const containerRectHeight = resumeContainer?.getBoundingClientRect().height ?? 0

      // Choose the best estimate of content height in px
      const contentHeightPx = Math.max(
        docScrollHeight,
        bodyScrollHeight,
        containerScrollHeight,
        Math.ceil(containerRectHeight)
      )

      // Convert px -> mm (1px ≈ 0.264583mm)
      const pageHeightMm = contentHeightPx * 0.264583

      // Debug logs to validate content-driven height
      // These logs help ensure we size the page to the exact content height to avoid bottom whitespace
      console.log('[PDF Export] Measurements', {
        docScrollHeight,
        bodyScrollHeight,
        containerScrollHeight,
        containerRectHeight,
        chosenContentHeightPx: contentHeightPx,
        pageHeightMm,
        devicePixelRatio: window.devicePixelRatio,
      })

      // Add print-specific styles with exact height and full page coverage
      // Note: Do NOT wrap with a nested <style> tag here; we inject this into a <style> element below.
      const printStyles = `
        @media print {
          @page {
            size: 210mm ${pageHeightMm}mm;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: ${pageHeightMm}mm;
            overflow: hidden;
          }
          .resume-container {
            width: 210mm;
            margin: 0;
            padding: 0;
            height: ${pageHeightMm}mm;
            min-height: ${pageHeightMm}mm;
            overflow: hidden;
          }
          .page {
            width: 210mm !important;
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
          /* Optimize for file size while maintaining text selectability */
          img {
            max-width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }

          /* Enable background graphics but optimize for size */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          /* Optimize text rendering for PDF */
          body, html {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            -webkit-text-stroke: 0.01em transparent;
            text-rendering: optimizeLegibility;
          }

          /* Optimize text elements for smaller file size */
          p, span, div, h1, h2, h3, h4, h5, h6, li, td, th {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            -webkit-text-stroke: 0.01em transparent;
            text-rendering: optimizeLegibility;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Reduce background complexity for smaller file size */
          [style*="background"],
          [class*="bg-"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-image: none !important;
          }

          /* Optimize resume container for PDF generation */
          .resume-container,
          .page,
          .main-content,
          .sidebar,
          .content,
          .header {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            -webkit-text-stroke: 0.01em transparent;
            text-rendering: optimizeLegibility;
          }

          /* Remove unnecessary visual elements for smaller file size */
          .no-print,
          .print-hidden {
            display: none !important;
          }

          /* Ensure proper font embedding for text selectability */
          @font-face {
            font-family: 'system-ui';
            font-display: swap;
          }
        }
      `

      // Inject the print styles
      const styleElement = iframeDoc.createElement('style')
      styleElement.innerHTML = printStyles
      iframeDoc.head.appendChild(styleElement)

      // Enable background graphics and optimize for file size
      try {
        // Add additional CSS for file size optimization
        const optimizationStyle = iframeDoc.createElement('style')
        optimizationStyle.innerHTML = `
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
              /* Optimize for smaller file size */
              font-size: 12px !important;
              line-height: 1.4 !important;
            }
            /* Ensure text remains selectable and crisp */
            p, span, div, h1, h2, h3, h4, h5, h6 {
              -webkit-text-stroke: 0.01em transparent !important;
              text-rendering: optimizeLegibility !important;
            }
            /* Remove complex visual effects for smaller file size */
            * {
              box-shadow: none !important;
              text-shadow: none !important;
              filter: none !important;
              transform: none !important;
            }
          }
        `
        iframeDoc.head.appendChild(optimizationStyle)

        // Add print optimization meta tags
        const metaViewport = iframeDoc.createElement('meta')
        metaViewport.setAttribute('name', 'viewport')
        metaViewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0',
        )
        iframeDoc.head.appendChild(metaViewport)

        // Small delay to ensure styles are applied
        setTimeout(() => {
          iframe.contentWindow?.print()
        }, 150)
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

  const exportToJSON = () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const name = resumeData.basics?.name?.trim() || 'resume'
      const safe = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
      a.href = url
      a.download = `${safe || 'resume'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting JSON:', error)
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
              onClick={exportToPDF}
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
            <Button onClick={exportToJSON} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
