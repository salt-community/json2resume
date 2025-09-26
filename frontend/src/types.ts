export interface ResumeData {
  $schema?: string
  basics: Basics
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
}

export interface Profile {
  network?: string
  username?: string
  url?: string
}

export interface Basics {
  name: string
  label?: string
  image?: string
  email?: string
  phone?: string
  url?: string
  summary?: string
  location?: Location
  profiles?: Array<Profile>
}

export interface Work {
  name?: string
  location?: string
  description?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: Array<string>
}

export interface Volunteer {
  organization?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: Array<string>
}

export interface Education {
  institution?: string
  url?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string
  score?: string
  courses?: Array<string>
}

export interface Award {
  title?: string
  date?: string
  awarder?: string
  summary?: string
}

export interface Certificate {
  name?: string
  date?: string
  issuer?: string
  url?: string
}

export interface Publication {
  name?: string
  publisher?: string
  releaseDate?: string
  url?: string
  summary?: string
}

export interface Skill {
  name?: string
  level?: string
  keywords?: Array<string>
}

export interface Language {
  language?: string
  fluency?: string
}

export interface Interest {
  name?: string
  keywords?: Array<string>
}

export interface Reference {
  name?: string
  reference?: string
}

export interface Project {
  name?: string
  startDate?: string
  endDate?: string
  description?: string
  highlights?: Array<string>
  url?: string
}

export interface Meta {
  canonical?: string
  version?: string
  lastModified?: string
}
