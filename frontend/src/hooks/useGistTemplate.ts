import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ResumeData } from '@/components/GistTemplate/templateEngine'
import type { GistFetchResult } from '@/components/GistTemplate/gistFetcher'
import { renderTemplate } from '@/components/GistTemplate/templateEngine'
import { fetchAndValidateGistTemplate } from '@/components/GistTemplate/gistFetcher'

interface GistTemplateState {
  processedHtml: string
  loading: boolean
  error: string | null
  rawTemplate: string
  templateFetched: boolean
}

/**
 * Custom hook for managing Gist template fetching and rendering
 *
 * Features:
 * - Separates template fetching from data rendering
 * - Efficient rendering with useMemo
 * - Only fetches template when URL changes
 * - Only re-renders when data actually changes
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
