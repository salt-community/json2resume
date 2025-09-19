// Resume data types based on JSON Resume schema and Sherlock Holmes example

export interface ResumeData {
  basics: Basics
  work: Work[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  references: Reference[]
  interests: Interest[]
}

export interface Basics {
  name: string
  label: string // e.g., "Consulting Detective"
  image?: string // base64 or URL for portrait
  email: string
  phone: string
  url?: string
  summary: string // "About me" section
  location: Location
  profiles: Profile[]
}

export interface Location {
  address: string
  city: string
  region: string
  postalCode: string
  countryCode: string
}

export interface Profile {
  network: string // e.g., "LinkedIn", "Twitter"
  username?: string
  url: string
}

export interface Work {
  name: string // Company/Organization name
  position: string // Job title
  location: string
  startDate: string // ISO date or "Mar 1881"
  endDate?: string // ISO date or "Present"
  summary?: string
  highlights: string[] // Bullet points
}

export interface Education {
  institution: string
  area: string // Field of study
  studyType?: string // Degree type
  location: string
  startDate?: string
  endDate: string
  highlights: string[]
}

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface Language {
  language: string
  fluency:
    | 'Elementary'
    | 'Limited Working'
    | 'Professional Working'
    | 'Full Professional'
    | 'Native'
}

export interface Reference {
  name: string
  reference?: string // Description/relationship
  contact: {
    phone?: string
    email?: string
  }
}

export interface Interest {
  name: string
}

// Mock data based on Sherlock Holmes example
export const MOCK_RESUME_DATA: ResumeData = {
  basics: {
    name: 'SHERLOCK HOLMES',
    label: 'CONSULTING DETECTIVE',
    email: 'sherlock.holmes@bakerstreet.com',
    phone: '+44 20 7224 3688',
    summary:
      'Highly skilled detective with a knack for solving complex cases using deductive reasoning and observation skills. Experienced in assisting law enforcement agencies and conducting independent investigations. Proficient in forensic science and chemical analysis.',
    location: {
      address: '221B Baker Street',
      city: 'London',
      region: 'London',
      postalCode: 'NW1 6XE',
      countryCode: 'GB',
    },
    profiles: [
      {
        network: 'LinkedIn',
        url: 'https://www.linkedin.com/in/sherlockholmes',
      },
      {
        network: 'Twitter',
        url: 'https://twitter.com/sherlockholmes',
      },
    ],
  },
  work: [
    {
      name: 'SELF-EMPLOYED',
      position: 'Consulting Detective',
      location: 'London',
      startDate: 'Mar 1881',
      endDate: 'Present',
      highlights: [
        'Solving complex criminal cases using deductive reasoning and observation skills.',
        'Assisting Scotland Yard in various investigations.',
        'Profiling and predicting criminal behavior.',
        'Utilizing forensic science techniques to analyze crime scenes.',
      ],
    },
    {
      name: 'UNIVERSITY OF CAMBRIDGE',
      position: 'Chemist',
      location: 'Cambridge',
      startDate: 'Sep 1878',
      endDate: 'Feb 1881',
      highlights: [
        'Conducted research on serums and antidotes.',
        'Published several papers on chemical analysis techniques.',
      ],
    },
  ],
  education: [
    {
      institution: 'UNIVERSITY OF CAMBRIDGE',
      area: 'Chemistry',
      location: 'Cambridge',
      endDate: '1878',
      highlights: [
        'Specialized in Organic Chemistry.',
        'Conducted research on chemical compounds and reactions.',
      ],
    },
    {
      institution: 'UNIVERSITY OF OXFORD',
      area: 'Criminology',
      location: 'Oxford',
      endDate: '1874',
      highlights: [
        'Studied criminal behavior and crime prevention.',
        'Conducted research on crime scene analysis.',
      ],
    },
  ],
  skills: [
    { name: 'DEDUCTIVE REASONING', level: 'Expert' },
    { name: 'OBSERVATION SKILLS', level: 'Expert' },
    { name: 'FORENSIC ANALYSIS', level: 'Advanced' },
    { name: 'CHEMICAL ANALYSIS', level: 'Advanced' },
    { name: 'CRIMINAL PROFILING', level: 'Advanced' },
    { name: 'VIOLIN PLAYING', level: 'Intermediate' },
  ],
  languages: [
    { language: 'ENGLISH', fluency: 'Native' },
    { language: 'FRENCH', fluency: 'Professional Working' },
    { language: 'GERMAN', fluency: 'Limited Working' },
  ],
  references: [
    {
      name: 'DR. JOHN WATSON',
      reference: 'Self-Employed',
      contact: {
        phone: '+44 20 7224 3688',
        email: 'john.watson@bakerstreet.com',
      },
    },
  ],
  interests: [
    { name: 'VIOLIN PLAYING' },
    { name: 'CHEMISTRY' },
    { name: 'BOXING' },
    { name: 'FENCING' },
    { name: 'BEEKEEPING' },
  ],
}
