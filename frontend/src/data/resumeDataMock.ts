// Raw JSON data
import type { ResumeData } from '@/types.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'

export const defaultResumeData: ResumeData = {
  $schema:
    'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    enabled: true,
    name: 'Your Full Name',
    label: 'Job Title (e.g., Senior Frontend Engineer)',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
    uploadedImage: '',
    email: 'you@example.com',
    phone: '+1 (555) 000-0000',
    url: 'https://your-website-or-portfolio.com',
    summary:
      '1–3 sentence professional summary. Mention years of experience, strengths, and what you are seeking.',
    location: {
      enabled: true,
      city: 'City',
      region: 'State/Region',
      countryCode: 'US',
    },
    profiles: [
      {
        enabled: true,
        network: 'LinkedIn',
        username: 'your-handle',
        url: 'https://linkedin.com/in/your-handle',
      },
      {
        enabled: true,
        network: 'GitHub',
        username: 'your-handle',
        url: 'https://github.com/your-handle',
      },
    ],
  },
  work: [
    {
      enabled: true,
      name: 'Company Name',
      position: 'Role (e.g., Frontend Engineer)',
      location: 'City, Country',
      url: 'https://company.com',
      startDate: '2022-01',
      endDate: 'Present',
      summary:
        'What you did and the impact you made. Keep it concise and results-oriented.',
      highlights: [
        'Led X to achieve Y% improvement in Z',
        'Built A using B, improving C by D%',
      ],
    },
  ],
  education: [
    {
      enabled: true,
      institution: 'University Name',
      area: 'Field of Study',
      studyType: 'Degree (e.g., B.Sc.)',
      startDate: '2018-09',
      endDate: '2022-06',
      score: 'GPA or grade (optional)',
      courses: ['Relevant Course 1', 'Relevant Course 2'],
      url: 'https://university.example.com',
    },
  ],
  projects: [
    {
      enabled: true,
      name: 'Project Name',
      description:
        'Short description: what the project does and your role in it.',
      url: 'https://project.example.com',
      startDate: '2023-04',
      endDate: '2023-08',
      highlights: [
        'Implemented feature X using Y which improved Z',
        'Wrote tests and documentation to ensure maintainability',
      ],
    },
  ],
  skills: [
    {
      enabled: true,
      name: 'Frontend',
      level: 'Advanced',
      keywords: ['React', 'TypeScript', 'CSS', 'Vite', 'Testing'],
    },
  ],
  languages: [
    { enabled: true, language: 'English', fluency: 'Native' },
    { enabled: true, language: 'Spanish', fluency: 'Professional' },
  ],
  interests: [
    { enabled: true, name: 'Open Source', keywords: ['Tooling', 'DX'] },
  ],
  references: [
    {
      enabled: true,
      name: 'Jane Smith — Former Manager',
      reference: '“Concise testimonial or available upon request.”',
    },
  ],
  certificates: [
    {
      enabled: true,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      date: '2024-05',
      url: 'https://verify.example.com/cert/123',
    },
  ],
  awards: [
    {
      enabled: true,
      title: 'Award Title',
      awarder: 'Organization',
      date: '2023-11',
      summary: 'What the award recognizes and why you received it.',
    },
  ],
  publications: [
    {
      enabled: true,
      name: 'Article or Paper Title',
      publisher: 'Publisher / Venue',
      releaseDate: '2023-06',
      url: 'https://publication.example.com',
      summary: 'Brief description of the work and your contribution.',
    },
  ],
  volunteer: [
    {
      enabled: true,
      organization: 'Organization Name',
      position: 'Volunteer Role',
      url: 'https://org.example.com',
      startDate: '2021-01',
      endDate: '2022-03',
      summary: 'How you contributed and the impact created.',
      highlights: ['Coordinated X', 'Supported Y initiative'],
    },
  ],
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
    },
  },
}

// Export the parsed, type-safe resume data
export const mockedResumeData: ResumeData =
  resumeDataFromJsonObj(defaultResumeData)
