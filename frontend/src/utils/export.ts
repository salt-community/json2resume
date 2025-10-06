import type { ResumeData } from '@/types'
import { renderTemplate } from '@/components/GistTemplate/templateEngine'
import { fetchAndValidateGistTemplate } from '@/components/GistTemplate/gistFetcher'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to get element path for matching
function getElementPath(element: Element, root: Element): number[] {
  const path: number[] = []
  let current = element
  while (current && current !== root) {
    const parent = current.parentElement
    if (parent) {
      const index = Array.from(parent.children).indexOf(current)
      path.unshift(index)
    }
    current = parent as Element
  }
  return path
}

// Helper function to find element by path
function findElementByPath(root: Element, path: number[]): Element | null {
  let current = root
  for (const index of path) {
    if (current.children[index]) {
      current = current.children[index]
    } else {
      return null
    }
  }
  return current
}

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

  // Get the CSS from the Gist template element
  const gistTemplateElement = document.querySelector('[id^="gist-template-"]')
  let templateCss = ''

  if (gistTemplateElement) {
    const styleTag = gistTemplateElement.querySelector('style')
    if (styleTag) {
      let css = styleTag.textContent || ''
      // Remove CSS scoping by replacing scoped selectors with unscoped ones
      css = css.replace(/#gist-template-[a-zA-Z0-9-]+\s+/g, '')
      templateCss = css
    }
  }

  console.log('=== Cloning Approach with CSS ===')
  console.log(
    'Original element height:',
    resumeElement.getBoundingClientRect().height,
  )
  console.log('Original element scrollHeight:', resumeElement.scrollHeight)
  console.log('Template CSS length:', templateCss.length)

  // Create a hidden iframe for PDF generation
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.left = '-9999px'
  iframe.style.top = '-9999px'
  iframe.style.width = '800px'
  iframe.style.height = '5000px' // Make it much taller to accommodate content
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
          ${templateCss}
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

  // Debug: Compare iframe heights after loading
  console.log('=== Iframe Heights After Loading ===')
  console.log('Iframe body scrollHeight:', iframeDoc.body.scrollHeight)
  console.log(
    'Iframe documentElement scrollHeight:',
    iframeDoc.documentElement.scrollHeight,
  )
  const iframeResumeContainer = iframeDoc.querySelector(
    '.resume-container',
  ) as HTMLElement | null
  console.log(
    'Iframe resume-container height:',
    iframeResumeContainer?.getBoundingClientRect().height,
  )
  console.log(
    'Iframe resume-container scrollHeight:',
    iframeResumeContainer?.scrollHeight,
  )

  // Measure height in px using multiple sources for robustness
  const resumeContainer = iframeDoc.querySelector(
    '.resume-container',
  ) as HTMLElement | null
  const docScrollHeight = iframeDoc.documentElement.scrollHeight
  const bodyScrollHeight = iframeDoc.body.scrollHeight
  const containerScrollHeight = resumeContainer?.scrollHeight ?? 0
  const containerRectHeight =
    resumeContainer?.getBoundingClientRect().height ?? 0

  // Use the actual content height, not the iframe height
  const contentHeightPx = Math.max(
    bodyScrollHeight,
    containerScrollHeight,
    Math.ceil(containerRectHeight),
  )

  // Convert px -> mm (1px ≈ 0.264583mm)
  const pageHeightMm = Math.max(1, contentHeightPx * 0.264583)

  console.log('=== Height Calculation Debug ===')
  console.log('Iframe content height:', contentHeightPx)
  console.log('Page height (mm):', pageHeightMm)

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
      /* Remove costly effects for smaller PDFs, but preserve profile image effects */
      *:not(img.avatar):not(img[alt*="profile" i]):not(img[alt*="photo" i]):not(img[alt*="avatar" i]) {
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
