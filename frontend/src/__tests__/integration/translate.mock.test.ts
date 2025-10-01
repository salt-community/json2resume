import { afterEach, describe, expect, test, vi } from 'vitest'
import type { ResumeData } from '@/types.ts'
import { translateText } from '@/useTranslate.ts'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('translateText with mocked backend', () => {
  test('returns mocked ResumeData when backend succeeds', async () => {
    const mockedResponse: ResumeData = {
      basics: { name: 'Juan Doe' },
    }

    const mockFetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockedResponse,
      } as unknown as Response) as unknown as typeof globalThis.fetch

    vi.stubGlobal('fetch', mockFetch)

    const payload = {
      resumeData: { basics: { name: 'John Doe' } },
      targetLanguage: 'es',
      sourceLanguage: 'en',
    }

    const result = await translateText(payload)

    // Assert result is exactly what backend "returned"
    expect(result).toEqual(mockedResponse)

    // Assert request was made correctly
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = (mockFetch as any).mock.calls[0]
    expect(url).toContain('/translate')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')

    const body = JSON.parse(options.body)
    expect(body.targetLanguage).toBe('es')
    expect(body.sourceLanguage).toBe('en')
    expect(body.resumeData.basics.name).toBe('John Doe')
  })

  test('throws when backend returns non-OK response', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'boom' }),
      } as unknown as Response) as unknown as typeof globalThis.fetch

    vi.stubGlobal('fetch', mockFetch)

    const payload = {
      resumeData: { basics: { name: 'John Doe' } },
      targetLanguage: 'es',
      sourceLanguage: 'en',
    }

    await expect(translateText(payload)).rejects.toThrow(
      'Translation failed: 500 Internal Server Error',
    )
  })
})
