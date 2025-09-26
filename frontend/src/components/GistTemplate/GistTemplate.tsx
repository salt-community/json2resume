/**
 * GistTemplate Component (refactored)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { renderTemplate, type ResumeData } from './templateEngine'
import {
  fetchAndValidateGistTemplate,
  type GistFetchResult,
} from './gistFetcher'

export interface GistTemplateProps {
  gistUrl: string
  resumeData: ResumeData
  filename?: string
  className?: string
  onProcessed?: (html: string) => void
  onError?: (error: string) => void
  showLoading?: boolean
}

export interface GistTemplateState {
  processedHtml: string
  loading: boolean
  error: string | null
  rawTemplate: string
  templateFetched: boolean
}

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
    let cancelled = false

    try {
      const fetchResult: GistFetchResult = await fetchAndValidateGistTemplate(
        gistUrl,
        filename,
      )

      if (cancelled) return

      if (!fetchResult.success || !fetchResult.content) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: fetchResult.error || 'Failed to fetch template',
        }))
        return
      }

      // Render with the new template engine (HTML-escapes values by default)
      const processedHtml = renderTemplate(fetchResult.content, resumeData)

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
      if (!cancelled) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
      }
    }

    return () => {
      cancelled = true
    }
  }, [gistUrl, resumeData, filename])

  useEffect(() => {
    fetchAndProcessTemplate()
  }, [fetchAndProcessTemplate])

  return {
    ...state,
    refetch: fetchAndProcessTemplate,
  }
}

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading template...</p>
      <p className="text-sm text-gray-500 mt-1">Fetching from GitHub Gist</p>
    </div>
  </div>
)

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

  useEffect(() => {
    if (processedHtml && onProcessed) onProcessed(processedHtml)
  }, [processedHtml, onProcessed])

  useEffect(() => {
    if (error && onError) onError(error)
  }, [error, onError])

  if (loading && showLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />

  if (processedHtml) {
    return (
      <div
        className={`gist-template-container ${className}`}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    )
  }

  return (
    <div className="p-4 text-center text-gray-500">
      No template content available
    </div>
  )
}

/** Default template URL */
export const DEFAULT_CLASSIC_TEMPLATE_URL =
  'https://gist.github.com/samuel-kar/11b0969ab91989b64650ac9361c8103b'

export const ClassicGistTemplate: React.FC<
  Omit<GistTemplateProps, 'gistUrl'>
> = (props) => (
  <GistTemplate {...props} gistUrl={DEFAULT_CLASSIC_TEMPLATE_URL} />
)

export default GistTemplate
