// Raw JSON data
import type { ResumeData } from '@/types.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'

export const defaultResumeData: ResumeData = {
  basics: {
    name: '',
    profiles: [],
    enabled: true,
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: [],
  meta: {},
}

// Export the parsed, type-safe resume data
export const mockedResumeData: ResumeData =
  resumeDataFromJsonObj(defaultResumeData)
