/*
  usePdfBlob: Renders a React-PDF <Document> to a Blob + objectURL for preview/print.
  It locally polyfills `Buffer` and `process` in the browser, then dynamically imports
  `@react-pdf/renderer` (after polyfills) to avoid "Buffer is not defined" issues.
  Also revokes old object URLs on updates/unmount to prevent memory leaks.
 */

import { useEffect, useRef, useState } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import type React from 'react'

type PdfDocElement = React.ReactElement<DocumentProps>

// Local polyfill loader, only runs inside this hook
let __pdfPolyfillsReady = false

interface ProcessLike {
  env?: Record<string, string | undefined>
  [key: string]: unknown
}

interface GlobalPolyfillTarget {
  Buffer?: typeof import('buffer').Buffer
  process?: ProcessLike
  global?: unknown
}

async function ensurePdfPolyfills(): Promise<void> {
  if (__pdfPolyfillsReady) return

  // Load polyfills dynamically so they only affect this route/chunk
  const bufferMod: typeof import('buffer') = await import('buffer')
  // Import process polyfill with any typing to avoid TS issues
  const processMod = await import('process' as any)

  const g = globalThis as unknown as GlobalPolyfillTarget

  // Set Buffer globally if missing (needed by some react-pdf deps)
  if (!g.Buffer) g.Buffer = bufferMod.Buffer

  // Some bundlers expose process as default, others as the module itself
  const procCandidate = (processMod as any)?.default ?? (processMod as any)

  if (!g.process) g.process = procCandidate || { env: {} }
  if (g.process && !g.process.env) g.process.env = {} // a few libs read process.env
  if (!g.global) g.global = globalThis // some libs still expect "global"

  __pdfPolyfillsReady = true
}

export function usePdfBlob(doc: PdfDocElement) {
  const [url, setUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const currentUrl = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        // 1) Ensure polyfills exist BEFORE loading react-pdf
        await ensurePdfPolyfills()

        // 2) Dynamically import react-pdf after polyfills are in place
        const { pdf } = await import('@react-pdf/renderer')

        const b = await pdf(doc).toBlob()
        if (!mounted) return

        setBlob(b)

        // Revoke old URL (if any) before setting a new one
        if (currentUrl.current) URL.revokeObjectURL(currentUrl.current)
        const u = URL.createObjectURL(b)
        currentUrl.current = u
        setUrl(u)
      } catch (e) {
        if (!mounted) return
        setError(e)
        setBlob(null)
        setUrl(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
      if (currentUrl.current) {
        URL.revokeObjectURL(currentUrl.current)
        currentUrl.current = null
      }
    }
  }, [doc])

  return { url, blob, loading, error }
}
