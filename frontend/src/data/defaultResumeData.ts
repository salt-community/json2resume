// Raw JSON data
import type { ResumeData } from '@/types.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataConverter.ts'

export const defaultData: ResumeData = {
  $schema:
    'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    enabled: true,
    name: '',
    label: '',
    image:
      '',
    uploadedImage: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      enabled: true,
      city: '',
      region: '',
      countryCode: '',
    },
    profiles: [],
  },
  work: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  certificates: [],
  awards: [],
  publications: [],
  volunteer: [],
  meta: {
    version: '1.0.0',
    sectionHeaders: {
      work: 'Work Experience',
      education: 'Education',
      projects: 'Projects',
      awards: 'Awards',
      certificates: 'Certifications',
      publications: 'Publications',
      skills: 'Skills',
      languages: 'Languages',
      interests: 'Interests',
      references: 'References',
      volunteer: 'Volunteering',
      social: 'Social',
    },
  },
}

// Export the parsed, type-safe resume data
export const defaultResumeData: ResumeData =
  resumeDataFromJsonObj(defaultData)
