/**
 * GistTemplate Module Exports
 *
 * This module provides components and utilities for fetching GitHub Gist templates
 * and processing them with resume data using a custom templating engine.
 */

// Main component exports
export {
  GistTemplate,
  ClassicGistTemplate,
  useGistTemplate,
  DEFAULT_CLASSIC_TEMPLATE_URL,
  type GistTemplateProps,
  type GistTemplateState,
} from './GistTemplate'

// Template engine exports
export {
  processTemplate,
  sanitizeTemplate,
  type ResumeData,
} from './templateEngine'

// Gist fetcher exports
export {
  fetchGistContent,
  fetchAndValidateGistTemplate,
  parseGistUrl,
  buildRawGistUrl,
  validateTemplate,
  type GistInfo,
  type GistFetchResult,
} from './gistFetcher'

// Demo component (for development/testing)
export { GistTemplateDemo } from './GistTemplateDemo'
