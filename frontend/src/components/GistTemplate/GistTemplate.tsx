/**
 * GistTemplate Component
 *
 * This component fetches HTML templates from GitHub Gists and processes them
 * with resume data using the mini templating engine. It handles the complete
 * workflow from fetching raw Gist content to rendering the final HTML.
 *
 * Features:
 * - Fetches templates from GitHub Gist URLs
 * - Processes templates with resume data using custom templating syntax
 * - Provides loading states and error handling
 * - Sanitizes content for security
 * - Renders processed HTML safely using dangerouslySetInnerHTML
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  processTemplate,
  sanitizeTemplate,
  type ResumeData,
} from './templateEngine'
import {
  fetchAndValidateGistTemplate,
  type GistFetchResult,
} from './gistFetcher'

export interface GistTemplateProps {
  /** The GitHub Gist URL containing the HTML template */
  gistUrl: string
  /** The resume data to inject into the template */
  resumeData: ResumeData
  /** Optional specific filename to fetch from the Gist */
  filename?: string
  /** Custom CSS classes to apply to the container */
  className?: string
  /** Callback fired when template processing completes */
  onProcessed?: (html: string) => void
  /** Callback fired when an error occurs */
  onError?: (error: string) => void
  /** Whether to show loading state */
  showLoading?: boolean
}

export interface GistTemplateState {
  /** The processed HTML ready for rendering */
  processedHtml: string
  /** Current loading state */
  loading: boolean
  /** Error message if something went wrong */
  error: string | null
  /** The raw template content from the Gist */
  rawTemplate: string
  /** Whether the template has been successfully fetched */
  templateFetched: boolean
}

/**
 * Hook to manage Gist template fetching and processing
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

  const fetchAndProcessTemplate = useCallback(async () => {
    if (!gistUrl || !resumeData) {
      setState((prev) => ({
        ...prev,
        error: 'Missing required props: gistUrl and resumeData are required',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Fetch the template from GitHub Gist
      const fetchResult: GistFetchResult = await fetchAndValidateGistTemplate(
        gistUrl,
        filename,
      )

      if (!fetchResult.success || !fetchResult.content) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: fetchResult.error || 'Failed to fetch template',
        }))
        return
      }

      // Sanitize the template content
      const sanitizedTemplate = sanitizeTemplate(fetchResult.content)

      // Process the template with resume data
      const processedHtml = processTemplate(sanitizedTemplate, resumeData)

      setState((prev) => ({
        ...prev,
        processedHtml,
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
  }, [gistUrl, resumeData, filename])

  // Fetch template when dependencies change
  useEffect(() => {
    fetchAndProcessTemplate()
  }, [fetchAndProcessTemplate])

  return {
    ...state,
    refetch: fetchAndProcessTemplate,
  }
}

/**
 * Loading component displayed while fetching and processing template
 */
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading template...</p>
      <p className="text-sm text-gray-500 mt-1">Fetching from GitHub Gist</p>
    </div>
  </div>
)

/**
 * Error component displayed when template processing fails
 */
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
 * Main GistTemplate component that renders processed HTML from a GitHub Gist template
 */
export const GistTemplate: React.FC<GistTemplateProps> = ({
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

  // Fire callbacks when state changes
  useEffect(() => {
    if (processedHtml && onProcessed) {
      onProcessed(processedHtml)
    }
  }, [processedHtml, onProcessed])

  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // Render loading state
  if (loading && showLoading) {
    return <LoadingState />
  }

  // Render error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  // Render processed HTML
  if (processedHtml) {
    return (
      <div
        className={`gist-template-container ${className}`}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    )
  }

  // Empty state (shouldn't normally be reached)
  return (
    <div className="p-4 text-center text-gray-500">
      No template content available
    </div>
  )
}

/**
 * Default hardcoded Gist URL for the classic resume template
 * This can be used as a fallback or default template
 */
export const DEFAULT_CLASSIC_TEMPLATE_URL =
  'https://gist.github.com/samuel-kar/11b0969ab91989b64650ac9361c8103b#file-classic-resume-html-custom'

/**
 * Convenience component that uses the default classic template
 */
export const ClassicGistTemplate: React.FC<
  Omit<GistTemplateProps, 'gistUrl'>
> = (props) => (
  <GistTemplate {...props} gistUrl={DEFAULT_CLASSIC_TEMPLATE_URL} />
)

export default GistTemplate
