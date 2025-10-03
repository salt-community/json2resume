import type { ResumeData } from '@/types'

/**
 * Export the current resume (found via [data-resume-content]) to a PDF by
 * cloning into a hidden iframe, measuring height, injecting print CSS, and printing.
 */
export async function exportResumeToPDF(resumeData: ResumeData): Promise<void> {
  const resumeElement = document.querySelector(
    '[data-resume-content]',
  ) as HTMLElement | null
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

  // HTML skeleton to host the content
  const title = `Resume - ${resumeData.basics?.name ?? 'Resume'}`
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          :root, html, body {
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            color: #000000;
            line-height: 1.6;
          }
          * {
            box-sizing: border-box;
          }
          .resume-container {
            width: 100%;
            margin: 0;
            padding: 0;
            background: #ffffff;
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
  iframe.contentDocument?.open()
  iframe.contentDocument?.write(htmlContent)
  iframe.contentDocument?.close()

  // Allow time for layout and assets to settle
  await delay(800)

  const iframeDoc = iframe.contentDocument
  if (!iframeDoc) {
    cleanupIframe(iframe)
    throw new Error('Could not access iframe document')
  }

  // Measure height in px using multiple sources for robustness
  const resumeContainer = iframeDoc.querySelector(
    '.resume-container',
  ) as HTMLElement | null
  const docScrollHeight = iframeDoc.documentElement.scrollHeight
  const bodyScrollHeight = iframeDoc.body.scrollHeight
  const containerScrollHeight = resumeContainer?.scrollHeight ?? 0
  const containerRectHeight =
    resumeContainer?.getBoundingClientRect().height ?? 0
  const contentHeightPx = Math.max(
    docScrollHeight,
    bodyScrollHeight,
    containerScrollHeight,
    Math.ceil(containerRectHeight),
  )

  // Convert px -> mm (1px ≈ 0.264583mm)
  const pageHeightMm = Math.max(1, contentHeightPx * 0.264583)

  // Inject concise print styles
  const printStyles = `
    @media print {
      @page { size: 210mm ${pageHeightMm}mm; margin: 0; }
      html, body {
        width: 210mm;
        height: ${pageHeightMm}mm;
        overflow: hidden;
      }
      .resume-container {
        width: 210mm;
        height: ${pageHeightMm}mm;
        min-height: ${pageHeightMm}mm;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      /* Keep colors and text crisp in print */
      *, html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      img {
        max-width: 100% !important;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      /* Fix for specific circular profile images that get distorted (minimal theme) */
      img[style*="border-radius:9999px"] {
        height: 64px !important;
        width: 64px !important;
        object-fit: cover !important;
      }
      /* Ensure profile images maintain proper aspect ratio without forcing dimensions */
      img.avatar, img[alt*="profile" i], img[alt*="photo" i], img[alt*="avatar" i] {
        object-fit: cover !important;
        /* Let theme CSS determine dimensions and border-radius */
      }
      /* Remove costly effects for smaller PDFs */
      * {
        box-shadow: none !important;
        text-shadow: none !important;
        filter: none !important;
        transform: none !important;
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  `
  const styleEl = iframeDoc.createElement('style')
  styleEl.innerHTML = printStyles
  iframeDoc.head.appendChild(styleEl)

  // Viewport meta to help some engines
  const metaViewport = iframeDoc.createElement('meta')
  metaViewport.setAttribute('name', 'viewport')
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
  iframeDoc.head.appendChild(metaViewport)

  // Kick off printing after styles apply
  setTimeout(() => {
    iframe.contentWindow?.print()
  }, 150)

  // Cleanup after print
  setTimeout(() => {
    cleanupIframe(iframe)
  }, 3000)
}

/**
 * Export arbitrary data as a JSON file.
 */
export function exportJSON(data: unknown, suggestedName?: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const nameBase = toSafeKebabCase(suggestedName ?? 'resume', 'resume')
  const a = document.createElement('a')
  a.href = url
  a.download = `${nameBase}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Helpers */

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function cleanupIframe(iframe: HTMLIFrameElement) {
  if (iframe.parentNode) {
    iframe.parentNode.removeChild(iframe)
  }
}

function toSafeKebabCase(input: string, fallback = 'file'): string {
  const safe = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
  return safe || fallback
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
