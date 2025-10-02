/**
 * GistTemplate.tsx
 * -----------------
 * Purpose
 *   Fetch an HTML template from a GitHub Gist OR use a provided inline HTML template,
 *   render it using the lightweight template engine, and display the final HTML.
 *
 * Safety
 *   - The template engine HTML-escapes injected values to avoid XSS.
 *   - The template’s own HTML/CSS is rendered as-is (trusted template).
 */

import React, { memo, useEffect } from 'react'
import type { ResumeData } from './templateEngine'
import { useGistTemplate } from '@/hooks'

export interface GistTemplateProps {
  /** URL to the Gist that contains an HTML template (optional if inlineHtml provided) */
  gistUrl?: string
  /** Inline HTML template (optional if gistUrl provided) */
  inlineHtml?: string
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
 * Extracts and scopes CSS from HTML content to prevent style leakage
 */
function extractAndScopeStyles(
  html: string,
  containerId: string,
): { html: string; css: string } {
  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Extract the style tag content
  const styleTag = tempDiv.querySelector('style')
  let css = ''
  if (styleTag) {
    css = styleTag.textContent || ''
    // Remove the style tag from the HTML
    styleTag.remove()
  }

  // Extract body content if it exists
  const bodyTag = tempDiv.querySelector('body')
  let bodyContent = ''
  if (bodyTag) {
    bodyContent = bodyTag.innerHTML
  } else {
    // If no body tag, use the entire content
    bodyContent = tempDiv.innerHTML
  }

  // Scope CSS selectors to the container
  const scopedCss = scopeCssSelectors(css, containerId)

  return {
    html: bodyContent,
    css: scopedCss,
  }
}

/**
 * Scopes CSS selectors to a specific container to prevent global style leakage
 */
function scopeCssSelectors(css: string, containerId: string): string {
  if (!css.trim()) return ''

  // Split CSS into rules
  const rules = css
    .split('}')
    .filter((rule) => rule.trim())
    .map((rule) => rule.trim() + '}')

  const scopedRules = rules
    .map((rule) => {
      // Skip empty rules
      if (!rule.trim() || rule === '}') return ''

      // Handle @media queries and other at-rules
      if (rule.startsWith('@')) {
        return scopeAtRule(rule, containerId)
      }

      // Handle regular CSS rules
      return scopeRegularRule(rule, containerId)
    })
    .filter((rule) => rule.trim())

  return scopedRules.join('\n')
}

/**
 * Scopes at-rules like @media, @page, etc.
 */
function scopeAtRule(rule: string, containerId: string): string {
  // Handle @media queries
  if (rule.startsWith('@media')) {
    const mediaMatch = rule.match(/^(@media[^{]+)\{([^}]+)\}/)
    if (mediaMatch) {
      const mediaQuery = mediaMatch[1]
      const innerRules = mediaMatch[2]
      const scopedInnerRules = scopeCssSelectors(innerRules, containerId)
      return `${mediaQuery} { ${scopedInnerRules} }`
    }
  }

  // Handle @page rules
  if (rule.startsWith('@page')) {
    // @page rules should remain global for print styles
    return rule
  }

  // For other at-rules, scope the inner content
  const atRuleMatch = rule.match(/^(@[^{]+)\{([^}]+)\}/)
  if (atRuleMatch) {
    const atRule = atRuleMatch[1]
    const innerRules = atRuleMatch[2]
    const scopedInnerRules = scopeCssSelectors(innerRules, containerId)
    return `${atRule} { ${scopedInnerRules} }`
  }

  return rule
}

/**
 * Scopes regular CSS rules
 */
function scopeRegularRule(rule: string, containerId: string): string {
  // Extract selector and declaration
  const ruleMatch = rule.match(/^([^{]+)\{([^}]+)\}/)
  if (!ruleMatch) return rule

  const selector = ruleMatch[1].trim()
  const declaration = ruleMatch[2]

  // Skip if already scoped
  if (selector.includes(`#${containerId}`)) return rule

  // Handle :root selector - convert to CSS custom properties on the container
  if (selector === ':root') {
    return `#${containerId} { ${declaration} }`
  }

  // Handle body selector - scope to container
  if (selector === 'body') {
    return `#${containerId} { ${declaration} }`
  }

  // Handle universal selector
  if (selector === '*') {
    return `#${containerId} * { ${declaration} }`
  }

  // Handle other selectors - scope them to the container
  const scopedSelector = selector
    .split(',')
    .map((sel) => {
      const trimmedSel = sel.trim()
      // Skip if already scoped
      if (trimmedSel.includes(`#${containerId}`)) return trimmedSel
      // Scope the selector
      return `#${containerId} ${trimmedSel}`
    })
    .join(', ')

  return `${scopedSelector} { ${declaration} }`
}

/**
 * GistTemplate
 * ------------
 * Thin wrapper that renders loading/error states, and injects the processed HTML.
 * Now with CSS isolation to prevent style leakage.
 */
const GistTemplate: React.FC<GistTemplateProps> = memo(
  ({
    gistUrl,
    inlineHtml,
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
      inlineHtml,
    )

    // Generate a unique container ID for CSS scoping
    const containerId = useMemo(
      () => `gist-template-${Math.random().toString(36).substr(2, 9)}`,
      [],
    )

    // Extract and scope styles from the processed HTML
    const { html: scopedHtml, css: scopedCss } = useMemo(() => {
      if (!processedHtml) return { html: '', css: '' }
      return extractAndScopeStyles(processedHtml, containerId)
    }, [processedHtml, containerId])

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
          id={containerId}
          className={`gist-template-container ${className}`}
          data-resume-content="true"
        >
          {/* Inject scoped CSS */}
          {scopedCss && (
            <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
          )}
          {/* Inject scoped HTML content */}
          <div dangerouslySetInnerHTML={{ __html: scopedHtml }} />
        </div>
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
