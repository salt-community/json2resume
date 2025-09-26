/**
 * index.ts (barrel)
 * -----------------
 * Purpose
 *   Re-export public modules so consumers can import from a single entrypoint.
 *
 * What’s exported
 *   - UI components + hook (GistTemplate)
 *   - Template engine’s main API (render/compile + types)
 *   - Gist fetch utilities
 *   - Demo component (optional for apps that want to embed it)
 */

export {
  GistTemplate,
  ClassicGistTemplate,
  useGistTemplate,
  DEFAULT_CLASSIC_TEMPLATE_URL,
  type GistTemplateProps,
  type GistTemplateState,
} from './GistTemplate'

// New engine API (replaces previous processTemplate/sanitizeTemplate)
export { renderTemplate, compile, type ResumeData } from './templateEngine'

// Gist helpers (fetch + validate)
export {
  fetchGistContent,
  fetchAndValidateGistTemplate,
  parseGistUrl,
  buildRawGistUrl,
  validateTemplate,
  type GistInfo,
  type GistFetchResult,
} from './gistFetcher'

// Optional: demo UI for docs/tests
export { GistTemplateDemo } from './GistTemplateDemo'
