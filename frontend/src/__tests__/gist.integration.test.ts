import { describe, test, expect } from 'vitest'
import {
  fetchGistFiles,
  fetchGistContent,
  fetchAndValidateGistTemplate,
  parseGistUrl,
} from '@/components/GistTemplate/gistFetcher'
import { DEFAULT_CLASSIC_TEMPLATE_URL } from '@/components/GistTemplate'

// Only run if explicitly requested: RUN_INTEGRATION=true npm test
const itIntegration = process.env.RUN_INTEGRATION === 'true' ? test : test.skip

// Allow overriding which Gist to use during integration tests
const GIST_URL =
  process.env.TEST_GIST_URL || DEFAULT_CLASSIC_TEMPLATE_URL
const GIST_FILENAME = process.env.TEST_GIST_FILENAME

// Basic pre-parse (static for conditional test definitions)
const parsed = parseGistUrl(GIST_URL)
const hasParsedInfo = !!parsed

// Validate test should only run if we have a filename that looks like HTML,
// or an explicit filename was provided.
const shouldRunValidate =
  !!GIST_FILENAME || !!parsed // we'll dynamically detect an html-like file in the test

describe('GitHub Gist integration', () => {
  itIntegration('fetchGistFiles returns a non-empty list for a valid gist', async () => {
    const info = parseGistUrl(GIST_URL)
    expect(info).toBeTruthy()
    if (!info) return

    const files = await fetchGistFiles(info)
    expect(Array.isArray(files)).toBe(true)
    expect(files.length).toBeGreaterThan(0)
  }, 30000)

  itIntegration('fetchGistContent retrieves raw content for a specific file (if available)', async () => {
    const info = parseGistUrl(GIST_URL)
    expect(info).toBeTruthy()
    if (!info) return

    // Discover a file name if not provided
    let filename = GIST_FILENAME
    if (!filename) {
      const files = await fetchGistFiles(info)
      expect(files.length).toBeGreaterThan(0)
      // Prefer common template-looking files
      filename =
        files.find(
          (f) =>
            f.endsWith('.html') ||
            f.endsWith('.html.custom') ||
            f.endsWith('.template'),
        ) || files[0]
    }

    const res = await fetchGistContent(GIST_URL, filename)
    expect(res.success).toBe(true)
    expect(res.content && res.content.length).toBeGreaterThan(0)
    expect(res.url).toBeTruthy()
    expect(res.url).toContain('gist.githubusercontent.com')
  }, 30000)

  ;(shouldRunValidate ? itIntegration : test.skip)(
    'fetchAndValidateGistTemplate returns valid HTML template when an HTML-like file is available',
    async () => {
      const info = parseGistUrl(GIST_URL)
      expect(info).toBeTruthy()
      if (!info) return

      // Pick a likely HTML template, or use env-provided filename
      let filename = GIST_FILENAME
      if (!filename) {
        const files = await fetchGistFiles(info)
        expect(files.length).toBeGreaterThan(0)
        filename =
          files.find(
            (f) =>
              f.endsWith('.html') ||
              f.endsWith('.html.custom') ||
              f.endsWith('.template'),
          ) || undefined
      }

      // If we still have no filename, we can still try; the helper will try to decide
      const result = await fetchAndValidateGistTemplate(GIST_URL, filename)

      // For a genuine HTML template, we expect success and isValid true
      expect(result.success).toBe(true)
      expect(result.isValid).toBe(true)
      expect(result.content && result.content.length).toBeGreaterThan(0)
    },
    30000,
  )
})
