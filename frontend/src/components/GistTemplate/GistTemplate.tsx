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

import React, { memo, useEffect } from 'react'
import type { ResumeData } from './templateEngine'
import { useGistTemplate } from '@/hooks'

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
