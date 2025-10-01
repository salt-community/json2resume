/**
 * GistTemplate.tsx
 * -----------------
 * Purpose
 *   Fetch an HTML template from a GitHub Gist, render it using the lightweight
 *   template engine (with your JSON Resume data), and display the final HTML.
 *
 * Key ideas
 *   - Uses `fetchAndValidateGistTemplate` to retrieve HTML from your Gist.
 *   - Uses `renderTemplate` (our engine) to merge JSON data -> HTML.
 *   - Exposes a hook (`useGistTemplate`) for reuse and UI state management.
 *   - HTML output is escaped by default by the engine; we simply inject it.
 *
 * Safety
 *   - The template engine HTML-escapes injected values to avoid XSS.
 *   - The template’s *own* HTML/CSS is rendered as-is (trusted template).
 */

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { renderTemplate } from './templateEngine'
import { fetchAndValidateGistTemplate } from './gistFetcher'
import type { ResumeData } from './templateEngine'
import type { GistFetchResult } from './gistFetcher'

export interface GistTemplateProps {
  /** URL to the Gist that contains an HTML template */
  gistUrl: string
  /** JSON Resume-like data structure that feeds the template */
  resumeData: ResumeData
  /** Optional filename if the Gist has multiple files */
  filename?: string
  /** ClassName applied to the container that receives the rendered HTML */
  className?: string
  /** Callback with the final HTML after a successful render */
  onProcessed?: (html: string) => void
  /** Callback on error (fetch or render) */
  onError?: (error: string) => void
  /** Whether to show a loading placeholder while fetching */
  showLoading?: boolean
}

export interface GistTemplateState {
  /** Final rendered HTML */
  processedHtml: string
  /** Is the template currently being fetched/processed? */
  loading: boolean
  /** Any error message from fetching or rendering */
  error: string | null
  /** Raw template text (before rendering) */
  rawTemplate: string
  /** True once we have fetched the template at least once */
  templateFetched: boolean
}

/**
 * useGistTemplate
 * ---------------
 * A reusable hook that:
 *  1) fetches the Gist template,
 *  2) renders it with the provided resume data,
 *  3) returns the UI state + a refetch function.
 */
export function useGistTemplate(
  gistUrl: string,
  resumeData: ResumeData,
  filename?: string,
) {
  const [state, setState] = useState<GistTemplateState>({
    processedHtml: '',
    loading: false,
    error: null,
    rawTemplate: '',
    templateFetched: false,
  })

  // Separate template fetching from data rendering
  const fetchTemplate = useCallback(async () => {
    // Guard against missing inputs
    if (!gistUrl) {
      setState((prev) => ({
        ...prev,
        error: 'Missing required props: gistUrl is required',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // 1) Fetch validated HTML template from the Gist
      const fetchResult: GistFetchResult = await fetchAndValidateGistTemplate(
        gistUrl,
        filename,
      )

      if (!fetchResult.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: fetchResult.error || 'Failed to fetch template',
        }))
        return
      }

      // 2) Store the raw template and mark as fetched
      setState((prev) => ({
        ...prev,
        rawTemplate: fetchResult.content || '',
        templateFetched: true,
        loading: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }, [gistUrl, filename])

  // Use useMemo to efficiently render template with data
  const processedHtml = useMemo(() => {
    if (!state.rawTemplate || !state.templateFetched) {
      return state.processedHtml
    }

    try {
      return renderTemplate(state.rawTemplate, resumeData)
    } catch (error) {
      console.error('Failed to render template:', error)
      return state.processedHtml
    }
  }, [
    state.rawTemplate,
    state.templateFetched,
    resumeData,
    state.processedHtml,
  ])

  // Update state when processed HTML changes
  useEffect(() => {
    if (processedHtml !== state.processedHtml) {
      setState((prev) => ({
        ...prev,
        processedHtml,
      }))
    }
  }, [processedHtml, state.processedHtml])

  // Fetch template only when URL or filename changes
  useEffect(() => {
    fetchTemplate()
  }, [fetchTemplate])

  const refetch = useCallback(async () => {
    await fetchTemplate()
  }, [fetchTemplate])

  return {
    ...state,
    refetch,
  }
}

/** Small presentational loading component */
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading template...</p>
      <p className="text-sm text-gray-500 mt-1">Fetching from GitHub Gist</p>
    </div>
  </div>
)

/** Small presentational error component */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800">
          Template Processing Error
        </h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        {onRetry && (
          <div className="mt-3">
            <button
              onClick={onRetry}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)

/**
 * GistTemplate
 * ------------
 * Thin wrapper that renders loading/error states, and injects the processed HTML.
 */
const GistTemplate: React.FC<GistTemplateProps> = memo(
  ({
    gistUrl,
    resumeData,
    filename,
    className = '',
    onProcessed,
    onError,
    showLoading = true,
  }) => {
    const { processedHtml, loading, error, refetch } = useGistTemplate(
      gistUrl,
      resumeData,
      filename,
    )

    // Bubble up the processed HTML if a callback is provided
    useEffect(() => {
      if (processedHtml && onProcessed) onProcessed(processedHtml)
    }, [processedHtml, onProcessed])

    // Bubble up errors if a callback is provided
    useEffect(() => {
      if (error && onError) onError(error)
    }, [error, onError])

    if (loading && showLoading) return <LoadingState />
    if (error) return <ErrorState error={error} onRetry={refetch} />

    if (processedHtml) {
      return (
        <div
          className={`gist-template-container ${className}`}
          data-resume-content="true"
          // Safe because values were HTML-escaped by the engine;
          // the template *structure* is trusted by you (from your gist).
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      )
    }

    return (
      <div className="p-4 text-center text-gray-500">
        No template content available
      </div>
    )
  },
)

export { GistTemplate }

/** Sensible default template URL (your shared classic template) */
export const DEFAULT_CLASSIC_TEMPLATE_URL =
  'https://gist.github.com/samuel-kar/11b0969ab91989b64650ac9361c8103b'

/** Convenience wrapper that pre-binds the default template URL */
export const ClassicGistTemplate: React.FC<Omit<GistTemplateProps, 'gistUrl'>> =
  memo((props) => (
    <GistTemplate {...props} gistUrl={DEFAULT_CLASSIC_TEMPLATE_URL} />
  ))

export default GistTemplate
