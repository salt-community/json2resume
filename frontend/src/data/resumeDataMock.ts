// Raw JSON data
import type { ResumeData } from '@/types.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'

const rawResumeData: ResumeData = {
  $schema:
    'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: 'David Aslan',
    label:
      'Fullstack Software Developer Consultant @ SALT | .NET, Spring Boot, React, Next.js | Clean Code, CI/CD & Cloud Deployment',
    image: 'https://avatars.githubusercontent.com/u/11655066?v=4',
    email: 'david.aslan1999@gmail.com',
    phone: '+46735648833',
    url: 'https://davidaslan.dev/',
    summary:
      'Hello 👋 I am a Full-stack Developer based in Stockholm with strong skills in .NET, Spring Boot, React, and Next.js. I focus on building clean, maintainable software that delivers real impact. I am experienced in agile practices like TDD and mob programming and thrive in collaborative, fast-paced teams aiming for continuous improvement.',
    location: {
      countryCode: 'SE',
      address: 'Stockholm, Sweden',
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'davidaslandev',
        url: 'https://www.linkedin.com/in/davidaslandev/',
      },
    ],
  },
  work: [
    {
      name: 'SALT - School of Applied Technology',
      position: 'Software Developer Consultant',
      startDate: '2024-07',
      endDate: '2025-09',
      summary:
        'Working with teams, architecting, building and maintaining software.',
      url: 'https://www.linkedin.com/company/salteurope/',
      location: 'Stockholm, Sweden',
    },
    {
      name: 'SALT - School of Applied Technology',
      position: 'Java Software Developer',
      startDate: '2024-04',
      endDate: '2024-07',
      summary:
        'Three month intense education focused on Java and Spring Boot. Applied knowledge daily in challenges, presented a full-stack application after one week of solo work, and collaborated with 11 classmates on a fullstack bank app where my team handled CI/CD, testing, and frontend components.',
      url: 'https://www.linkedin.com/company/salteurope/',
      location: 'Stockholm, Sweden',
    },
    {
      name: 'Loggamera',
      position: '.NET Fullstack Developer',
      startDate: '2022-12',
      endDate: '2023-05',
      summary:
        'Migrated 500+ frontend pages from Bootstrap 3.1 to 5 with CI/CD, integrated new hardware devices into IMD software, delivered new features and resolved customer-reported bugs.',
      url: 'https://www.linkedin.com/company/loggamera/',
      location: 'Täby, Stockholm, Sweden',
    },
    {
      name: 'Värmeverket',
      position: 'Full-stack Developer',
      startDate: '2022-08',
      endDate: '2022-11',
      summary:
        'Redesigned and optimized the Värmeverket website (varmeverket.com) for speed and mobile responsiveness in collaboration with the internal design team.',
      url: 'https://www.linkedin.com/company/varmeverket/',
      location: 'Stockholm, Sweden',
    },
    {
      name: 'Telenor',
      position: 'Säljare med kundansvar (B2B/B2C)',
      startDate: '2019-07',
      endDate: '2022-05',
      summary:
        'Handled B2B/B2C sales and served as the dedicated point of contact for business clients at Telenor, building long-term professional relationships. Achieved sales targets and managed store operations including inventory and theft prevention.',
      url: 'https://www.linkedin.com/company/telenor-group/',
      location: 'Stockholm, Sweden',
    },
    {
      name: 'DollarStore',
      position: 'Butiksmedarbetare',
      startDate: '2017-11',
      endDate: '2019-01',
      summary:
        'Handled daily store operations: cash register, inventory, restocking, customer service, and store upkeep.',
      url: 'https://www.linkedin.com/company/dollarstore/',
      location: 'Stockholm, Sweden',
    },
    {
      name: 'Simplex Bemanning AB',
      position: 'Mover & Assembler',
      startDate: '2018-12',
      endDate: '2019-12',
      summary:
        'Worked in a physically demanding role focused on moving and assembly. Required strong communication skills and effective collaboration with colleagues and customers.',
      url: 'https://www.linkedin.com/company/simplex-bemanning-ab/',
      location: 'Stockholm, Sweden',
    },
  ],
  education: [
    {
      institution: 'KYH',
      area: '.NET Developer',
      studyType: 'YH-Examen',
      startDate: '2021-09',
      endDate: '2023-08',
    },
    {
      institution: 'Blekinge Tekniska Högskola',
      area: 'Technical Artist',
      studyType: 'Kandidatexamen',
      startDate: '2018-12',
      endDate: '2019-12',
    },
    {
      studyType: 'Gymnasieexamen',
      institution: 'NTI Gymnasiet',
      area: 'Teknik program',
      startDate: '2015-12',
      endDate: '2018-12',
    },
  ],
  skills: [
    {
      name: 'Backend Development',
      level: 'Expert',
      keywords: [
        '.NET',
        'Spring Boot',
        'Java',
        'C#',
        'Node.js',
        'OOP',
        'REST APIs',
        'Microservices',
      ],
    },
    {
      name: 'Frontend Development',
      level: 'Expert',
      keywords: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'HTML5',
        'CSS3',
        'Responsive Design',
      ],
    },
    {
      name: 'Database & Data',
      level: 'Advanced',
      keywords: [
        'SQL',
        'PostgreSQL',
        'Database Design',
        'Query Optimization',
        'Data Modeling',
      ],
    },
    {
      name: 'DevOps & Cloud',
      level: 'Intermediate',
      keywords: [
        'Docker',
        'CI/CD',
        'Google Cloud Platform',
        'Microsoft Azure',
        'Git',
        'GitHub Actions',
        'Deployment',
      ],
    },
    {
      name: 'Software Engineering',
      level: 'Expert',
      keywords: [
        'TDD',
        'Clean Code',
        'Agile',
        'Mob Programming',
        'Code Review',
        'SOLID Principles',
        'Design Patterns',
      ],
    },
    {
      name: 'Testing & Quality',
      level: 'Advanced',
      keywords: [
        'Unit Testing',
        'Integration Testing',
        'Jest',
        'JUnit',
        'Test Automation',
        'Code Coverage',
      ],
    },
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Full Professional',
    },
    {
      language: 'Swedish',
      fluency: 'Native',
    },
  ],
  references: [
    {
      name: 'Ikbal Gundogdu',
      reference:
        'Working with David in our intensive Java fullstack bootcamp was amazing as David brought energy, curiosity, and a willingness to tackle problems that kept our mob-programming productive and fun.',
    },
    {
      name: 'Samuel Karlhager',
      reference:
        'Working together with David during our Java Fullstack bootcamp at SALT, it became clear to me that he is highly proficient in backend, frontend and DevOps, together with a great and uplifting personality.',
    },
    {
      name: 'Andreas Kamf',
      reference:
        "David is a great developer and a great person to have on the team. He's technically sharp, reliable, and always ready to jump in and solve problems without fuss.",
    },
    {
      name: 'Manuel Acevedo',
      reference:
        'I had the pleasure of working with David on the Nova Bank Core App project, where we were both part of the CI/CD and frontend team. David constantly impressed me with his ability to think outside the box and offer creative, effective solutions.',
    },
  ],
  meta: {
    version: 'v1.0.0',
    sectionHeaders: {
      work: 'Work',
      volunteer: 'Volunteer',
      education: 'Education',
      awards: 'Awards',
      certificates: 'Certificates',
      publications: 'Publications',
      skills: 'Skills',
      languages: 'Languages',
      interests: 'Interests',
      references: 'References',
      projects: 'Projects',
    },
  },
}

// Export the parsed, type-safe resume data
export const mockedResumeData: ResumeData = resumeDataFromJsonObj(rawResumeData)
