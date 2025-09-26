import type { ResumeData } from '@/types'

// Type-safe parser for resume data
export function resumeDataFromJsonObj(jsonData: any): ResumeData {
  return {
    $schema: jsonData.$schema,
    basics: {
      name: jsonData.basics?.name || '',
      label: jsonData.basics?.label,
      image: jsonData.basics?.image,
      email: jsonData.basics?.email,
      phone: jsonData.basics?.phone,
      url: jsonData.basics?.url,
      summary: jsonData.basics?.summary,
      location: jsonData.basics?.location
        ? {
            address: jsonData.basics.location.address,
            postalCode: jsonData.basics.location.postalCode,
            city: jsonData.basics.location.city,
            countryCode: jsonData.basics.location.countryCode,
            region: jsonData.basics.location.region,
          }
        : undefined,
      profiles: jsonData.basics?.profiles || [],
    },
    work: jsonData.work || [],
    volunteer: jsonData.volunteer || [],
    education: jsonData.education || [],
    awards: jsonData.awards || [],
    publications: jsonData.publications || [],
    skills: jsonData.skills || [],
    languages: jsonData.languages || [],
    interests: jsonData.interests || [],
    references: jsonData.references || [],
    projects: jsonData.projects || [],
    meta: jsonData.meta,
  }
}