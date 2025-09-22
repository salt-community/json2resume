// Resume data types based on official JSON Resume schema
// https://jsonresume.org/schema

export interface ResumeData {
  basics: Basics
  work?: Work[]
  volunteer?: Volunteer[]
  education?: Education[]
  awards?: Award[]
  certificates?: Certificate[]
  publications?: Publication[]
  skills?: Skill[]
  languages?: Language[]
  interests?: Interest[]
  references?: Reference[]
  projects?: Project[]
}

export interface Basics {
  name: string
  label?: string // e.g., "Programmer"
  image?: string // base64 or URL for portrait
  email?: string
  phone?: string
  url?: string
  summary?: string // "About me" section
  location?: Location
  profiles?: Profile[]
}

export interface Location {
  address?: string
  postalCode?: string
  city?: string
  countryCode?: string
  region?: string
}

export interface Profile {
  network?: string // e.g., "LinkedIn", "Twitter"
  username?: string
  url?: string
}

export interface Work {
  name?: string // Company/Organization name
  position?: string // Job title
  url?: string
  startDate?: string // ISO date or "2013-01-01"
  endDate?: string // ISO date or null for current
  summary?: string
  highlights?: string[] // Bullet points
}

export interface Volunteer {
  organization?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: string[]
}

export interface Education {
  institution?: string
  url?: string
  area?: string // Field of study
  studyType?: string // Degree type
  startDate?: string
  endDate?: string
  score?: string // GPA, etc.
  courses?: string[]
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
  level?: string // "Master", "Expert", "Advanced", "Intermediate", "Beginner"
  keywords?: string[]
}

export interface Language {
  language?: string
  fluency?: string // "Native speaker", "Full Professional", "Professional Working", "Limited Working", "Elementary"
}

export interface Interest {
  name?: string
  keywords?: string[]
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
  highlights?: string[]
  url?: string
}

// Mock data based on JSON Resume schema example
export const MOCK_RESUME_DATA: ResumeData = {
  basics: {
    name: "John Doe",
    label: "Programmer",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait.jpg",
    email: "john@gmail.com",
    phone: "(912) 555-4321",
    url: "https://johndoe.com",
    summary: "A summary of John Doe…",
    location: {
      address: "2712 Broadway St",
      postalCode: "CA 94115",
      city: "San Francisco",
      countryCode: "US",
      region: "California"
    },
    profiles: [{
      network: "Twitter",
      username: "john",
      url: "https://twitter.com/john"
    }]
  },
  work: [{
    name: "Company",
    position: "President",
    url: "https://company.com",
    startDate: "2013-01-01",
    endDate: "2014-01-01",
    summary: "Description…",
    highlights: [
      "Started the company"
    ]
  }],
  volunteer: [{
    organization: "Organization",
    position: "Volunteer",
    url: "https://organization.com/",
    startDate: "2012-01-01",
    endDate: "2013-01-01",
    summary: "Description…",
    highlights: [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  education: [{
    institution: "University",
    url: "https://institution.com/",
    area: "Software Development",
    studyType: "Bachelor",
    startDate: "2011-01-01",
    endDate: "2013-01-01",
    score: "4.0",
    courses: [
      "DB1101 - Basic SQL"
    ]
  }],
  awards: [{
    title: "Award",
    date: "2014-11-01",
    awarder: "Company",
    summary: "There is no spoon."
  }],
  certificates: [{
    name: "Certificate",
    date: "2021-11-07",
    issuer: "Company",
    url: "https://certificate.com"
  }],
  publications: [{
    name: "Publication",
    publisher: "Company",
    releaseDate: "2014-10-01",
    url: "https://publication.com",
    summary: "Description…"
  }],
  skills: [{
    name: "Web Development",
    level: "Master",
    keywords: [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }],
  languages: [{
    language: "English",
    fluency: "Native speaker"
  }],
  interests: [{
    name: "Wildlife",
    keywords: [
      "Ferrets",
      "Unicorns"
    ]
  }],
  references: [{
    name: "Jane Doe",
    reference: "Reference…"
  }],
  projects: [{
    name: "Project",
    startDate: "2019-01-01",
    endDate: "2021-01-01",
    description: "Description...",
    highlights: [
      "Won award at AIHacks 2016"
    ],
    url: "https://project.com/"
  }]
}
