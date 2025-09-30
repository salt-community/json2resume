import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { GistInfo } from '@/components/GistTemplate/gistFetcher'
import {
  buildRawGistUrl,
  fetchAndValidateGistTemplate,
  fetchGistContent,
  fetchGistFiles,
  parseGistUrl,
  validateTemplate,
} from '@/components/GistTemplate/gistFetcher'

global.fetch = vi.fn()

describe('Gist Fetcher Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseGistUrl', () => {
    test('should parse gist.github.com URLs', () => {
      expect(parseGistUrl('https://gist.github.com/username/123456')).toEqual({
        username: 'username',
        gistId: '123456',
        filename: undefined,
      })
    })

    test('should parse gist.githubusercontent.com URLs', () => {
      expect(
        parseGistUrl(
          'https://gist.githubusercontent.com/username/123456/raw/template.html',
        ),
      ).toEqual({
        username: 'username',
        gistId: '123456',
        filename: 'template.html',
      })
    })

    test('should return null for invalid URLs', () => {
      expect(parseGistUrl('https://github.com/username/repo')).toBeNull()
      expect(parseGistUrl('not-a-url')).toBeNull()
    })
  })

  describe('buildRawGistUrl', () => {
    test('should build raw URLs correctly', () => {
      const gistInfo: GistInfo = {
        username: 'username',
        gistId: '123456',
        filename: 'template.html',
      }
      expect(buildRawGistUrl(gistInfo)).toBe(
        'https://gist.githubusercontent.com/username/123456/raw/template.html',
      )
    })
  })

  describe('fetchGistFiles', () => {
    test('should fetch file list successfully', async () => {
      const mockData = { files: { 'template.html': {}, 'style.css': {} } }
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchGistFiles({
        username: 'username',
        gistId: '123456',
      })
      expect(result).toEqual(['template.html', 'style.css'])
    })

    test('should handle errors gracefully', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))
      const result = await fetchGistFiles({
        username: 'username',
        gistId: '123456',
      })
      expect(result).toEqual([])
    })
  })

  describe('fetchGistContent', () => {
    test('should fetch content successfully', async () => {
      const mockContent = '<html><body>Template</body></html>'
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      })

      const result = await fetchGistContent(
        'https://gist.github.com/username/123456#file-template-html',
      )
      expect(result.success).toBe(true)
      expect(result.content).toBe(mockContent)
    })

    test('should handle errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({ ok: false, status: 404 })
      const result = await fetchGistContent(
        'https://gist.github.com/username/123456#file-template-html',
      )
      expect(result.success).toBe(false)
    })
  })

  describe('validateTemplate', () => {
    test('should validate HTML templates', () => {
      expect(validateTemplate('<html><body>>[name]<<</body></html>')).toEqual({
        isValid: true,
      })
      expect(validateTemplate('Not HTML')).toEqual({
        isValid: false,
        error: 'Content does not appear to be an HTML template',
      })
    })
  })

  describe('fetchAndValidateGistTemplate', () => {
    test('should fetch and validate successfully', async () => {
      const mockContent = '<html><body>>[name]<<</body></html>'
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      })

      const result = await fetchAndValidateGistTemplate(
        'https://gist.github.com/username/123456#file-template-html',
      )
      expect(result.success).toBe(true)
      expect(result.isValid).toBe(true)
    })
  })
})
