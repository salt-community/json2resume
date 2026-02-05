// Raw JSON data
import type { ExtendedResumeData, ResumeData } from '@/types.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'

export const defaultData: ExtendedResumeData = {
  $schema:
    'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: 'Smulan',
    label: 'Senior Frontend Engineer',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
    email: 'smulan@gmail.com',
    phone: '+46701234567',
    url: '',
    summary:
      'A frontend developer cat with an eye and tail for web design. Delivers clean frontend apps for you in minutes, with good UX and professional codebase architecture. Words that describe me are Curios, Creative and Meow.',
    location: {
      address: 'Kattgränd 10',
      postalCode: '11825',
      city: 'Stockholm',
      countryCode: 'SE',
      region: 'Stockholm',
      enabled: true,
    },
    profiles: [
      {
        enabled: true,
        network: 'LinkedIn',
        username: 'smulan',
        url: 'https://linkedin.com/in/smulan',
      },
      {
        enabled: true,
        network: 'GitHub',
        username: 'smulan',
        url: 'https://github.com/smulan',
      },
      {
        enabled: true,
        network: 'Wall Scrathing Simulator',
        username: 'smulan',
        url: 'https://wall-scratching-simulator',
      },
    ],
    enabled: true,
  },
  work: [
    {
      enabled: true,
      name: 'Java Whiskers Cat Café',
      position: 'Frontend Engineer',
      url: 'https://javawhiskers.se/',
      startDate: '2023-02-06',
      endDate: '2025-08-15',
      summary:
        'Developed their first webpage, making their UI design in figma and using tanstack react as the frontend framework.',
      highlights: [],
    },
    {
      enabled: true,
      name: 'Java Whiskers Cat Café',
      position: 'Model',
      location: 'City, Country',
      url: 'https://javawhiskers.se/',
      startDate: '2022-03-04',
      endDate: '2023-02-05',
      summary: 'Looking cute and stylish.',
      highlights: [],
    },
  ],
  volunteer: [
    {
      enabled: false,
      organization: 'Code for Stockholm',
      position: 'Web Design Volunteer',
      url: 'https://codeforstockholm.org',
      startDate: '2019-11',
      endDate: '2020-02',
      summary:
        'Designed and improved civic tech web interfaces for local community projects.\n\nCollaborated with developers to implement user-friendly layouts and responsive design.\n\nAssisted in creating digital guides and tutorials for non-technical users.',
      highlights: [],
    },
  ],
  education: [
    {
      enabled: true,
      institution: 'Stockholm University',
      area: 'Web Design',
      studyType: 'Bachelor of Arts',
      startDate: '2018-09',
      endDate: '2021-06',
      score: '3.8/4.0',
      courses: [],
      url: 'https://university.example.com',
    },
  ],
  awards: [
    {
      enabled: false,
      title: 'Cutest Cat',
      awarder: 'Java Whiskers Cat Café',
      date: '2022-09',
      summary: 'What the award recognizes and why you received it.',
    },
  ],
  publications: [
    {
      enabled: false,
      name: 'New Web App Enhances Cat Café Experience',
      publisher: 'Tech & Trends Stockholm',
      releaseDate: '2025-09-06',
      url: 'https://techNtrends/c/68dfb54c-dc94-832a-8322-dd28582bb983#:~:text=techtrends.se/java%2Dwhiskers%2Dapp',
      summary:
        "Java Whiskers Cat Café, Stockholm's first cat café, has launched a new web application designed to streamline the café experience for visitors. The app allows customers to book visits, browse available cats for adoption, and order food and beverages directly from their smartphones. This initiative aims to enhance customer engagement and support the café's mission of rehoming rescue cats. The app is also available for download on both iOS and Android platforms.",
    },
  ],
  skills: [
    {
      enabled: true,
      name: 'Frontend',
      level: 'Advanced',
      keywords: [
        'React',
        'Javascript',
        'TypeScript',
        'HTML',
        'CSS',
        'Vite',
        'Vitest',
        'Cypress',
      ],
    },
    {
      name: 'Web Design',
      level: 'Advajced',
      keywords: [
        'Figma',
        'Canva',
        'Notion',
        'Adobe XD',
        'Sketch',
        'Zeplin',
        'Miro',
      ],
      enabled: true,
    },
  ],
  languages: [
    {
      enabled: false,
      language: 'Swedish',
      fluency: 'Native',
    },
    {
      enabled: false,
      language: 'Purr-tuguese',
      fluency: 'Native',
    },
    {
      enabled: false,
      language: 'English',
      fluency: 'Professional',
    },
  ],
  interests: [
    {
      enabled: false,
      name: 'Open Source',
      keywords: ['Tooling', 'DX'],
    },
    {
      name: 'Scratching',
      keywords: ['walls', 'floors', 'carpets'],
      enabled: false,
    },
  ],
  references: [
    {
      enabled: false,
      name: 'Jane Smith — Former Manager',
      reference:
        '"I had the pleasure of working with Smulan, who transitioned impressively from a beloved cat at our local cat café to a talented frontend developer and web designer. Smulan brings the same curiosity, attention to detail, and charm from their café days into every project, delivering clean, intuitive, and responsive designs. Smulan is creative, collaborative, and highly recommended for any web development or design role."',
    },
  ],
  projects: [
    {
      enabled: true,
      name: 'Java Whiskers Cat Café Webpage',
      description:
        'Developed the café’s first webpage, creating a clean and intuitive UI using Figma.\n\nImplemented the frontend using TanStack React framework.\n\nFocused on responsive design, accessibility, and enhancing the user experience for visitors.',
      url: 'https://javawhiskers.se/',
      startDate: '2023-02-06',
      endDate: '2025-08-15',
      highlights: [],
    },
    {
      enabled: true,
      name: 'Wall Scratching Simulator',
      startDate: '2021-02-18',
      endDate: '2021-07-11',
      description: 'Allows you to scratch walls digitally',
      highlights: [],
      url: 'https://wall-scratching-simulator',
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
  config: {
    theme: {
      kind: 'url',
      url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    },
  },
}

// Export the parsed, type-safe resume data
export const defaultResumeData: ResumeData = resumeDataFromJsonObj(defaultData)
