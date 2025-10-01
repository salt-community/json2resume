import { describe, expect, test } from 'vitest'
import type { ResumeData } from '@/types.ts'
import { translateText } from '@/useTranslate.ts'

// Only run if explicitly requested: RUN_INTEGRATION=true npm test
const itIntegration = process.env.RUN_INTEGRATION === 'true' ? test : test.skip

describe('translateText backend integration', () => {
  itIntegration(
    'posts payload to backend and returns a ResumeData-shaped object (requires backend running)',
    async () => {
      const resume: ResumeData = {
        basics: {
          name: 'John Doe',
        },
      }

      const payload = {
        resumeData: resume,
        targetLanguage: 'es',
        sourceLanguage: 'en',
      }

      const result = await translateText(payload)

      // Basic shape assertions that should hold regardless of exact translation
      expect(result).toBeTruthy()
      expect(typeof result).toBe('object')
      expect(result.basics).toBeTruthy()
      expect(typeof result.basics.name).toBe('string')
    },
    20000 // allow time for network and backend processing
  )
})
