// Basic information types
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

// Work experience types
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

// Volunteer experience types
export interface Volunteer {
  organization?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: Array<string>
}

// Education types
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

// Awards types
export interface Award {
  title?: string
  date?: string
  awarder?: string
  summary?: string
}

// Publications types
export interface Publication {
  name?: string
  publisher?: string
  releaseDate?: string
  url?: string
  summary?: string
}

// Skills types
export interface Skill {
  name?: string
  level?: string
  keywords?: Array<string>
}

// Languages types
export interface Language {
  language?: string
  fluency?: string
}

// Interests types
export interface Interest {
  name?: string
  keywords?: Array<string>
}

// References types
export interface Reference {
  name?: string
  reference?: string
}

// Projects types
export interface Project {
  name?: string
  description?: string
  highlights?: Array<string>
  keywords?: Array<string>
  startDate?: string
  endDate?: string
  url?: string
  roles?: Array<string>
  entity?: string
  type?: string
}

// Meta information types
export interface Meta {
  canonical?: string
  version?: string
  lastModified?: string
}

// Main ResumeData type
export interface ResumeData {
  $schema?: string
  basics: Basics
  work?: Array<Work>
  volunteer?: Array<Volunteer>
  education?: Array<Education>
  awards?: Array<Award>
  publications?: Array<Publication>
  skills?: Array<Skill>
  languages?: Array<Language>
  interests?: Array<Interest>
  references?: Array<Reference>
  projects?: Array<Project>
  meta?: Meta
}
