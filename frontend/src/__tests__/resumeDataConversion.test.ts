import { describe, expect, test } from 'vitest'
import type { ResumeData } from '@/types'
import jsonObjFromJsonString from '@/data/jsonObjFromJsonString'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj'
import { jsonObjFromResumeData } from '@/data/jsonObjFromResumeData'
import { jsonStringFromJsonObj } from '@/data/jsonStringFromJsonObj'
import { mockedResumeData } from '@/data/resumeDataMock'

describe('Resume Data Conversion Tests', () => {
  describe('JSON String to ResumeData conversion', () => {
    test('should convert valid JSON string to ResumeData', () => {
      const jsonString = JSON.stringify(mockedResumeData)
      const jsonObj = jsonObjFromJsonString(jsonString)
      const resumeData = resumeDataFromJsonObj(jsonObj)

      expect(resumeData).toBeDefined()
      expect(resumeData.basics.name).toBe('David Aslan')
      expect(resumeData.basics.email).toBe('david.aslan1999@gmail.com')
      expect(Array.isArray(resumeData.work)).toBe(true)
      expect(Array.isArray(resumeData.skills)).toBe(true)
    })

    test('should handle empty JSON string', () => {
      const jsonString = '{}'
      const jsonObj = jsonObjFromJsonString(jsonString)
      const resumeData = resumeDataFromJsonObj(jsonObj)

      expect(resumeData).toBeDefined()
      expect(resumeData.basics.name).toBe('')
      expect(resumeData.work).toEqual([])
      expect(resumeData.skills).toEqual([])
    })

    test('should handle malformed JSON string', () => {
      const malformedJson = '{"basics": {"name": "Test", "invalid": }'

      expect(() => {
        jsonObjFromJsonString(malformedJson)
      }).toThrow()
    })

    test('should handle missing optional fields gracefully', () => {
      const minimalJson = '{"basics": {"name": "Test User"}}'
      const jsonObj = jsonObjFromJsonString(minimalJson)
      const resumeData = resumeDataFromJsonObj(jsonObj)

      expect(resumeData.basics.name).toBe('Test User')
      expect(resumeData.basics.email).toBeUndefined()
      expect(resumeData.basics.location).toBeUndefined()
      expect(resumeData.work).toEqual([])
      expect(resumeData.skills).toEqual([])
    })
  })

  describe('ResumeData to JSON conversion', () => {
    test('should convert ResumeData to JSON object', () => {
      const jsonObj = jsonObjFromResumeData(mockedResumeData)

      expect(jsonObj).toBeDefined()
      expect(jsonObj.$schema).toBe(mockedResumeData.$schema)
      expect(jsonObj.basics?.name).toBe(mockedResumeData.basics.name)
      expect(Array.isArray(jsonObj.work)).toBe(true)
      expect(Array.isArray(jsonObj.skills)).toBe(true)
    })

    test('should handle empty ResumeData', () => {
      const emptyResumeData: ResumeData = {
        basics: { name: '' },
      }
      const jsonObj = jsonObjFromResumeData(emptyResumeData)

      expect(jsonObj.basics?.name).toBe('')
      expect(jsonObj.work).toEqual([])
      expect(jsonObj.skills).toEqual([])
    })

    test('should handle non-object input', () => {
      const result = jsonObjFromResumeData(null as any)
      expect(result).toEqual({})
    })
  })

  describe('JSON String to JSON String roundtrip conversion', () => {
    test('should maintain data integrity through full conversion cycle', () => {
      const originalJsonString = JSON.stringify(mockedResumeData)

      // Convert: JSON string → JSON object → ResumeData → JSON object → JSON string
      const jsonObj1 = jsonObjFromJsonString(originalJsonString)
      const resumeData = resumeDataFromJsonObj(jsonObj1)
      const jsonObj2 = jsonObjFromResumeData(resumeData)
      const finalJsonString = jsonStringFromJsonObj(jsonObj2)

      // Parse both JSON strings for comparison
      const original = JSON.parse(originalJsonString)
      const final = JSON.parse(finalJsonString)

      // Compare key properties
      expect(final.basics.name).toBe(original.basics.name)
      expect(final.basics.email).toBe(original.basics.email)
      expect(final.basics.location?.countryCode).toBe(
        original.basics.location?.countryCode,
      )
      expect(final.work).toHaveLength(original.work.length)
      expect(final.skills).toHaveLength(original.skills.length)
      expect(final.languages).toHaveLength(original.languages.length)
    })

    test('should handle complex nested data structures', () => {
      const complexResumeData: ResumeData = {
        $schema: 'https://example.com/schema.json',
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          location: {
            address: '123 Main St',
            city: 'New York',
            countryCode: 'US',
            region: 'NY',
          },
          profiles: [
            {
              network: 'LinkedIn',
              username: 'johndoe',
              url: 'https://linkedin.com/in/johndoe',
            },
          ],
        },
        work: [
          {
            name: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01',
            endDate: '2023-12',
            highlights: ['Built amazing features', 'Led team of 5'],
          },
        ],
        skills: [
          {
            name: 'JavaScript',
            level: 'Expert',
            keywords: ['React', 'Node.js'],
          },
        ],
        meta: {
          version: '1.0.0',
          sectionHeaders: { work: 'Experience', skills: 'Technical Skills' },
        },
      }

      const jsonString = JSON.stringify(complexResumeData)
      const jsonObj = jsonObjFromJsonString(jsonString)
      const resumeData = resumeDataFromJsonObj(jsonObj)
      const backToJsonObj = jsonObjFromResumeData(resumeData)
      const finalJsonString = jsonStringFromJsonObj(backToJsonObj)

      const original = JSON.parse(jsonString)
      const final = JSON.parse(finalJsonString)

      expect(final.basics.location?.city).toBe(original.basics.location?.city)
      expect(final.basics.profiles).toHaveLength(
        original.basics.profiles.length,
      )
      expect(final.work[0].highlights).toEqual(original.work[0].highlights)
      expect(final.skills[0].keywords).toEqual(original.skills[0].keywords)
      expect(final.meta?.sectionHeaders?.work).toBe(
        original.meta?.sectionHeaders?.work,
      )
    })

    test('should preserve array structures correctly', () => {
      const resumeWithArrays: ResumeData = {
        basics: { name: 'Array Test' },
        work: [
          { name: 'Company 1', position: 'Dev 1' },
          { name: 'Company 2', position: 'Dev 2' },
        ],
        skills: [
          { name: 'Skill 1', keywords: ['keyword1', 'keyword2'] },
          { name: 'Skill 2', keywords: ['keyword3'] },
        ],
        languages: [
          { language: 'English', fluency: 'Native' },
          { language: 'Spanish', fluency: 'Intermediate' },
        ],
      }

      const jsonString = JSON.stringify(resumeWithArrays)
      const jsonObj = jsonObjFromJsonString(jsonString)
      const resumeData = resumeDataFromJsonObj(jsonObj)
      const backToJsonObj = jsonObjFromResumeData(resumeData)
      const finalJsonString = jsonStringFromJsonObj(backToJsonObj)

      const final = JSON.parse(finalJsonString)

      expect(final.work).toHaveLength(2)
      expect(final.skills).toHaveLength(2)
      expect(final.languages).toHaveLength(2)
      expect(final.work[0].name).toBe('Company 1')
      expect(final.skills[0].keywords).toHaveLength(2)
    })
  })

  describe('Edge cases and error handling', () => {
    test('should handle undefined and null values', () => {
      const resumeWithNulls: ResumeData = {
        basics: { name: 'Test' },
        work: undefined,
        skills: undefined,
        meta: undefined,
      }

      const jsonObj = jsonObjFromResumeData(resumeWithNulls)
      expect(jsonObj.work).toEqual([])
      expect(jsonObj.skills).toEqual([])
      expect(jsonObj.meta).toBeUndefined()
    })

    test('should handle empty arrays', () => {
      const resumeWithEmptyArrays: ResumeData = {
        basics: { name: 'Test' },
        work: [],
        skills: [],
        languages: [],
      }

      const jsonObj = jsonObjFromResumeData(resumeWithEmptyArrays)
      expect(jsonObj.work).toEqual([])
      expect(jsonObj.skills).toEqual([])
      expect(jsonObj.languages).toEqual([])
    })
  })
})
