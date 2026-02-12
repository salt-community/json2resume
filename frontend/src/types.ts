export interface ResumeData {
  $schema?: string
  basics?: Basics
  work?: Array<Work>
  volunteer?: Array<Volunteer>
  education?: Array<Education>
  awards?: Array<Award>
  certificates?: Array<Certificate>
  publications?: Array<Publication>
  skills?: Array<Skill>
  languages?: Array<Language>
  interests?: Array<Interest>
  references?: Array<Reference>
  projects?: Array<Project>
  meta?: Meta
}

export interface Location {
  address?: string
  postalCode?: string
  city?: string
  countryCode?: string
  region?: string
  enabled: boolean
}

export interface Profile {
  network?: string
  username?: string
  url?: string
  enabled: boolean
}

export interface Basics {
  name?: string
  label?: string
  image?: string
  email?: string
  phone?: string
  url?: string
  summary?: string
  location?: Location
  profiles?: Array<Profile>
  uploadedImage?: string // Base64 data URI for uploaded images
  enabled: boolean
}

export interface Work {
  name?: string
  location?: string
  description?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  isOngoing?: boolean
  summary?: string
  highlights?: Array<string>
  enabled: boolean
}

export interface Volunteer {
  organization?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  isOngoing?: boolean
  summary?: string
  highlights?: Array<string>
  enabled: boolean
}

export interface Education {
  institution?: string
  url?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string
  isOngoing?: boolean
  score?: string
  courses?: Array<string>
  enabled: boolean
}

export interface Award {
  title?: string
  date?: string
  awarder?: string
  summary?: string
  enabled: boolean
}

export interface Certificate {
  name?: string
  date?: string
  issuer?: string
  url?: string
  enabled: boolean
}

export interface Publication {
  name?: string
  publisher?: string
  releaseDate?: string
  url?: string
  summary?: string
  enabled: boolean
}

export interface Skill {
  id?: string
  name?: string
  level?: string
  keywords?: Array<string>
  enabled: boolean
}

export interface Language {
  language?: string
  fluency?: string
  enabled: boolean
}

export interface Interest {
  id?: string
  name?: string
  keywords?: Array<string>
  enabled: boolean
}

export interface Reference {
  name?: string
  reference?: string
  enabled: boolean
}

export interface Project {
  name?: string
  startDate?: string
  endDate?: string
  isOngoing?: boolean
  description?: string
  highlights?: Array<string>
  url?: string
  enabled: boolean
}

export interface GlobalDateConfig {
  locale: 'se' | 'en'
  presentString?: string
}

export interface SectionDateConfig {
  format: 'YMD' | 'YM' | 'Y' | 'YTextM' | 'YTextShortM'
}

// Keeping DateConfig as a type alias for SectionDateConfig + GlobalDateConfig for backward compatibility if needed, 
// or mostly to avoid breaking imports immediately, but likely better to just switch usages.
// Actually, let's redefine DateConfig to be the SectionDateConfig to minimize rename churn in files that only care about format locally?
// No, better to be explicit.
export type DateConfig = SectionDateConfig // Deprecated alias if we want, but let's just use SectionDateConfig in components

export interface SocialMeta {
  enabled: boolean
  website?: {
    network?: string
    username?: string
  }
}

export interface Meta {
  canonical?: string
  version?: string
  lastModified?: string
  sectionHeaders?: SectionHeaders
  social?: SocialMeta
  globalDateConfig?: GlobalDateConfig
  educationDateConfig?: SectionDateConfig
  workDateConfig?: SectionDateConfig
  projectDateConfig?: SectionDateConfig
  volunteerDateConfig?: SectionDateConfig
  awardsDateConfig?: SectionDateConfig
  certificatesDateConfig?: SectionDateConfig
  publicationsDateConfig?: SectionDateConfig
}

export interface SectionHeaders {
  work?: string
  volunteer?: string
  education?: string
  awards?: string
  certificates?: string
  publications?: string
  skills?: string
  languages?: string
  interests?: string
  references?: string
  projects?: string
  social?: string
}
