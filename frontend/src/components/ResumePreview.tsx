import { useRef, useState } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import type React from 'react'
import { usePdfBlob } from './hooks/usePdfBlob'

type PdfDocElement = React.ReactElement<DocumentProps>

type Props = {
  doc: PdfDocElement
  className?: string
  fileName?: string // e.g. "resume.pdf"
}

export function ResumePreview({
  doc,
  className,
  fileName = 'resume.pdf',
}: Props) {
  const { url, loading, error } = usePdfBlob(doc)
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const canInteract = Boolean(url && iframeLoaded)

  const handlePrint = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    // Important for some browsers: focus before print
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
  }

  const handleDownload = () => {
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.rel = 'noopener' // good practice
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleOpenNewTab = () => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {/* Topbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-600">
          {error
            ? 'Unable to generate PDF.'
            : loading
              ? 'Generating PDF…'
              : iframeLoaded
                ? 'Preview ready'
                : 'Loading preview…'}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            disabled={!canInteract}
            className={`px-4 py-2 rounded-2xl shadow-sm transition
              ${
                canInteract
                  ? 'cursor-pointer px-4 py-2 bg-[#FF7961] text-white rounded hover:bg-red-400 hover:shadow-lg transition-shadow duration-100'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Print
          </button>

          <button
            onClick={handleDownload}
            disabled={!url}
            className={`px-4 py-2 rounded-2xl shadow-sm transition
              ${
                url
                  ? 'cursor-pointer bg-white border hover:bg-gray-100'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Download
          </button>

          <button
            onClick={handleOpenNewTab}
            disabled={!url}
            className={`px-4 py-2 rounded-2xl shadow-sm transition
              ${
                url
                  ? 'cursor-pointer bg-white border hover:bg-gray-100'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Open in new tab
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        {url ? (
          <iframe
            ref={iframeRef}
            src={url}
            title="Resume Preview"
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-[70vh] md:h-[80vh]"
          />
        ) : (
          <div className="p-6 text-sm text-gray-600">
            {error
              ? 'An error occurred while generating the PDF.'
              : 'Preparing preview…'}
          </div>
        )}
      </div>
    </div>
  )
}
