/**
 * Public exports
 */

export {
  GistTemplate,
  ClassicGistTemplate,
  useGistTemplate,
  DEFAULT_CLASSIC_TEMPLATE_URL,
  type GistTemplateProps,
  type GistTemplateState,
} from './GistTemplate'

// From the new engine
export { renderTemplate, compile, type ResumeData } from './templateEngine'

export {
  fetchGistContent,
  fetchAndValidateGistTemplate,
  parseGistUrl,
  buildRawGistUrl,
  validateTemplate,
  type GistInfo,
  type GistFetchResult,
} from './gistFetcher'

export { GistTemplateDemo } from './GistTemplateDemo'
