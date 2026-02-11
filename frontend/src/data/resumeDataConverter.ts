import type { ResumeData } from '@/types'

/**
 * Convert ResumeData to JSON object format
 */
export function jsonObjFromResumeData(data: ResumeData) {
  if (typeof data !== 'object') return {}
  if (typeof data == 'undefined') return {}
  // eslint-disable-next-line
  if (data === null) return {}

  const basics = (data.basics ?? {}) as NonNullable<ResumeData['basics']>
  const location = basics?.location
    ? {
      address: basics.location.address,
      postalCode: basics.location.postalCode,
      city: basics.location.city,
      countryCode: basics.location.countryCode,
      region: basics.location.region,
      enabled: basics.location.enabled ?? true,
    }
    : undefined

  return {
    $schema: data.$schema,
    basics: {
      name: basics?.name,
      label: basics?.label,
      image: basics?.image,
      email: basics?.email,
      phone: basics?.phone,
      url: basics?.url,
      summary: basics?.summary,
      location,
      profiles: Array.isArray(basics?.profiles) ? basics.profiles : [],
      uploadedImage: basics?.uploadedImage,
      enabled: basics?.enabled ?? true,
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

/**
 * Convert JSON object to ResumeData format
 */
export function resumeDataFromJsonObj(jsonData: any): ResumeData {
  return {
    $schema: jsonData.$schema,
    basics: {
      name: jsonData.basics?.name || '',
      label: jsonData.basics?.label,
      image: jsonData.basics?.image,
      uploadedImage: jsonData.basics?.uploadedImage,
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
          enabled: jsonData.basics.location.enabled ?? true,
        }
        : undefined,
      profiles: jsonData.basics?.profiles || [],
      enabled: jsonData.basics?.enabled ?? true,
    },
    work: jsonData.work || [],
    volunteer: jsonData.volunteer || [],
    education: jsonData.education || [],
    awards: jsonData.awards || [],
    publications: jsonData.publications || [],
    skills: (jsonData.skills || []).map((s: any) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
    })),
    languages: jsonData.languages || [],
    interests: (jsonData.interests || []).map((i: any) => ({
      ...i,
      id: i.id || crypto.randomUUID(),
    })),
    references: jsonData.references || [],
    projects: jsonData.projects || [],
    meta: jsonData.meta,
  }
}
