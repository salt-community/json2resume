import type { ResumeData } from '@/types'

export function jsonObjFromResumeData(data: ResumeData) {
  if (typeof data !== 'object') return {}
  if (typeof data == 'undefined') return {}
  // eslint-disable-next-line
  if (data === null) return {}

  const basics = data.basics
  const location = basics.location
    ? {
        address: basics.location.address,
        postalCode: basics.location.postalCode,
        city: basics.location.city,
        countryCode: basics.location.countryCode,
        region: basics.location.region,
      }
    : undefined

  return {
    $schema: data.$schema,
    basics: {
      name: basics.name,
      label: basics.label,
      image: basics.image,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: basics.summary,
      location,
      profiles: Array.isArray(basics.profiles) ? basics.profiles : [],
    },
    work: Array.isArray(data.work) ? data.work : [],
    volunteer: Array.isArray(data.volunteer) ? data.volunteer : [],
    education: Array.isArray(data.education) ? data.education : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
    publications: Array.isArray(data.publications) ? data.publications : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
    references: Array.isArray(data.references) ? data.references : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    meta: data.meta,
  }
}
