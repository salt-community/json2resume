// Generate JSON schema from ResumeData type
export const resumeSchema = {
  type: 'object',
  properties: {
    $schema: {
      type: 'string',
      title: 'Schema Version',
      description: 'JSON Resume schema version',
    },
    basics: {
      type: 'object',
      title: 'Basic Information',
      properties: {
        name: {
          type: 'string',
          title: 'Full Name',
          description: 'Your full name',
        },
        label: {
          type: 'string',
          title: 'Professional Title',
          description: 'Your professional title or job title',
        },
        image: {
          type: 'string',
          title: 'Profile Image URL',
          description: 'URL to your profile image',
        },
        email: {
          type: 'string',
          title: 'Email',
          format: 'email',
          description: 'Your email address',
        },
        phone: {
          type: 'string',
          title: 'Phone Number',
          description: 'Your phone number',
        },
        url: {
          type: 'string',
          title: 'Website URL',
          format: 'uri',
          description: 'Your personal website or portfolio URL',
        },
        summary: {
          type: 'string',
          title: 'Professional Summary',
          description: 'A brief summary of your professional background',
        },
        location: {
          type: 'object',
          title: 'Location',
          properties: {
            address: {
              type: 'string',
              title: 'Address',
            },
            postalCode: {
              type: 'string',
              title: 'Postal Code',
            },
            city: {
              type: 'string',
              title: 'City',
            },
            countryCode: {
              type: 'string',
              title: 'Country Code',
              description: 'Two-letter country code (e.g., US, CA, GB)',
            },
            region: {
              type: 'string',
              title: 'Region/State',
            },
          },
        },
        profiles: {
          type: 'array',
          title: 'Social Profiles',
          items: {
            type: 'object',
            properties: {
              network: {
                type: 'string',
                title: 'Network',
                description:
                  'Social network name (e.g., LinkedIn, GitHub, Twitter)',
              },
              username: {
                type: 'string',
                title: 'Username',
              },
              url: {
                type: 'string',
                title: 'Profile URL',
                format: 'uri',
              },
            },
            required: ['network'],
          },
        },
      },
      required: ['name'],
    },
    work: {
      type: 'array',
      title: 'Work Experience',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Company Name',
            description: 'Name of the company or organization',
          },
          position: {
            type: 'string',
            title: 'Job Title',
            description: 'Your position or job title',
          },
          url: {
            type: 'string',
            title: 'Company Website',
            format: 'uri',
            description: 'Company website URL',
          },
          startDate: {
            type: 'string',
            title: 'Start Date',
            format: 'date',
            description: 'When you started this position (YYYY-MM format)',
          },
          endDate: {
            type: 'string',
            title: 'End Date',
            format: 'date',
            description:
              'When you ended this position (YYYY-MM format) or leave empty if current',
          },
          summary: {
            type: 'string',
            title: 'Job Summary',
            description: 'Brief description of your role and responsibilities',
          },
          highlights: {
            type: 'array',
            title: 'Key Achievements',
            items: {
              type: 'string',
              title: 'Achievement',
            },
            description: 'List your key achievements and accomplishments',
          },
          location: {
            type: 'string',
            title: 'Location',
            description: 'City, State/Country',
          },
        },
        required: ['name', 'position'],
      },
    },
    education: {
      type: 'array',
      title: 'Education',
      items: {
        type: 'object',
        properties: {
          institution: {
            type: 'string',
            title: 'Institution Name',
            description: 'Name of the educational institution',
          },
          area: {
            type: 'string',
            title: 'Field of Study',
            description: 'Your field of study or major',
          },
          studyType: {
            type: 'string',
            title: 'Degree Type',
            description: 'Type of degree or certification',
          },
          startDate: {
            type: 'string',
            title: 'Start Date',
            format: 'date',
            description: 'When you started (YYYY-MM format)',
          },
          endDate: {
            type: 'string',
            title: 'End Date',
            format: 'date',
            description:
              'When you graduated (YYYY-MM format) or leave empty if current',
          },
          score: {
            type: 'string',
            title: 'GPA/Score',
            description: 'Your GPA or final score',
          },
          url: {
            type: 'string',
            title: 'Institution Website',
            format: 'uri',
            description: 'Institution website URL',
          },
          courses: {
            type: 'array',
            title: 'Relevant Courses',
            items: {
              type: 'string',
              title: 'Course Name',
            },
            description: 'List relevant courses you took',
          },
        },
        required: ['institution', 'area'],
      },
    },
    skills: {
      type: 'array',
      title: 'Skills',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Skill Name',
            description: 'Name of the skill',
          },
          level: {
            type: 'string',
            title: 'Proficiency Level',
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            description: 'Your proficiency level with this skill',
          },
          keywords: {
            type: 'array',
            title: 'Related Technologies',
            items: {
              type: 'string',
              title: 'Technology',
            },
            description: 'Related technologies or tools',
          },
        },
        required: ['name'],
      },
    },
    projects: {
      type: 'array',
      title: 'Projects',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Project Name',
            description: 'Name of the project',
          },
          description: {
            type: 'string',
            title: 'Project Description',
            description: 'Brief description of the project',
          },
          url: {
            type: 'string',
            title: 'Project URL',
            format: 'uri',
            description: 'Link to the project (GitHub, live demo, etc.)',
          },
          startDate: {
            type: 'string',
            title: 'Start Date',
            format: 'date',
            description: 'When you started the project (YYYY-MM format)',
          },
          endDate: {
            type: 'string',
            title: 'End Date',
            format: 'date',
            description:
              'When you completed the project (YYYY-MM format) or leave empty if ongoing',
          },
          highlights: {
            type: 'array',
            title: 'Key Features',
            items: {
              type: 'string',
              title: 'Feature',
            },
            description: 'List key features or accomplishments',
          },
          keywords: {
            type: 'array',
            title: 'Technologies Used',
            items: {
              type: 'string',
              title: 'Technology',
            },
            description: 'Technologies, frameworks, and tools used',
          },
          entity: {
            type: 'string',
            title: 'Organization',
            description: 'Organization or company (if applicable)',
          },
          type: {
            type: 'string',
            title: 'Project Type',
            description: 'Type of project (e.g., Personal, Work, Open Source)',
          },
          roles: {
            type: 'array',
            title: 'Your Roles',
            items: {
              type: 'string',
              title: 'Role',
            },
            description: 'Your roles and responsibilities in the project',
          },
        },
        required: ['name', 'description'],
      },
    },
    languages: {
      type: 'array',
      title: 'Languages',
      items: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            title: 'Language',
            description: 'Name of the language',
          },
          fluency: {
            type: 'string',
            title: 'Fluency Level',
            enum: [
              'Elementary',
              'Limited Working',
              'Professional Working',
              'Full Professional',
              'Native',
            ],
            description: 'Your fluency level in this language',
          },
        },
        required: ['language', 'fluency'],
      },
    },
    references: {
      type: 'array',
      title: 'References',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Reference Name',
            description: 'Name of the person providing the reference',
          },
          reference: {
            type: 'string',
            title: 'Reference Text',
            description: 'The reference text or testimonial',
          },
        },
        required: ['name', 'reference'],
      },
    },
    volunteer: {
      type: 'array',
      title: 'Volunteer Experience',
      items: {
        type: 'object',
        properties: {
          organization: {
            type: 'string',
            title: 'Organization Name',
            description: 'Name of the organization',
          },
          position: {
            type: 'string',
            title: 'Position',
            description: 'Your volunteer position or role',
          },
          url: {
            type: 'string',
            title: 'Organization Website',
            format: 'uri',
            description: 'Organization website URL',
          },
          startDate: {
            type: 'string',
            title: 'Start Date',
            format: 'date',
            description: 'When you started (YYYY-MM format)',
          },
          endDate: {
            type: 'string',
            title: 'End Date',
            format: 'date',
            description:
              'When you ended (YYYY-MM format) or leave empty if current',
          },
          summary: {
            type: 'string',
            title: 'Volunteer Summary',
            description: 'Brief description of your volunteer work',
          },
          highlights: {
            type: 'array',
            title: 'Key Achievements',
            items: {
              type: 'string',
              title: 'Achievement',
            },
            description: 'List your key achievements and accomplishments',
          },
        },
        required: ['organization', 'position'],
      },
    },
    awards: {
      type: 'array',
      title: 'Awards',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            title: 'Award Title',
            description: 'Name of the award',
          },
          date: {
            type: 'string',
            title: 'Date',
            format: 'date',
            description: 'When you received the award (YYYY-MM format)',
          },
          awarder: {
            type: 'string',
            title: 'Awarding Organization',
            description: 'Organization that gave the award',
          },
          summary: {
            type: 'string',
            title: 'Award Summary',
            description: 'Brief description of the award',
          },
        },
        required: ['title'],
      },
    },
    publications: {
      type: 'array',
      title: 'Publications',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Publication Title',
            description: 'Title of the publication',
          },
          publisher: {
            type: 'string',
            title: 'Publisher',
            description: 'Name of the publisher',
          },
          releaseDate: {
            type: 'string',
            title: 'Release Date',
            format: 'date',
            description: 'When it was published (YYYY-MM format)',
          },
          url: {
            type: 'string',
            title: 'Publication URL',
            format: 'uri',
            description: 'Link to the publication',
          },
          summary: {
            type: 'string',
            title: 'Publication Summary',
            description: 'Brief description of the publication',
          },
        },
        required: ['name'],
      },
    },
    interests: {
      type: 'array',
      title: 'Interests',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Interest Name',
            description: 'Name of the interest',
          },
          keywords: {
            type: 'array',
            title: 'Related Keywords',
            items: {
              type: 'string',
              title: 'Keyword',
            },
            description: 'Related keywords or topics',
          },
        },
        required: ['name'],
      },
    },
    meta: {
      type: 'object',
      title: 'Metadata',
      properties: {
        canonical: {
          type: 'string',
          title: 'Canonical URL',
          format: 'uri',
          description: 'Canonical URL for this resume',
        },
        version: {
          type: 'string',
          title: 'Version',
          description: 'Resume version',
        },
        lastModified: {
          type: 'string',
          title: 'Last Modified',
          format: 'date-time',
          description: 'When this resume was last modified',
        },
      },
    },
  },
  required: ['basics'],
}

// UI Schema for better form layout
export const resumeUiSchema = {
  basics: {
    name: {
      'ui:placeholder': 'Enter your full name',
    },
    label: {
      'ui:placeholder': 'e.g., Software Developer',
    },
    email: {
      'ui:placeholder': 'your.email@example.com',
    },
    phone: {
      'ui:placeholder': '+1 (555) 123-4567',
    },
    url: {
      'ui:placeholder': 'https://yourwebsite.com',
    },
    summary: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 4,
      },
    },
    location: {
      address: {
        'ui:placeholder': '123 Main Street',
      },
      city: {
        'ui:placeholder': 'New York',
      },
      countryCode: {
        'ui:placeholder': 'US',
      },
      region: {
        'ui:placeholder': 'NY',
      },
    },
    profiles: {
      'ui:options': {
        addable: true,
        removable: true,
        orderable: true,
      },
      items: {
        network: {
          'ui:placeholder': 'LinkedIn',
        },
        username: {
          'ui:placeholder': 'yourusername',
        },
        url: {
          'ui:placeholder': 'https://linkedin.com/in/yourusername',
        },
      },
    },
  },
  work: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'Acme Corporation',
      },
      position: {
        'ui:placeholder': 'Senior Software Developer',
      },
      url: {
        'ui:placeholder': 'https://acme.com',
      },
      startDate: {
        'ui:placeholder': '2020-01',
      },
      endDate: {
        'ui:placeholder': '2023-12 (leave empty if current)',
      },
      summary: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      highlights: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder':
            'e.g., Led development of new features that increased user engagement by 25%',
        },
      },
      location: {
        'ui:placeholder': 'San Francisco, CA',
      },
    },
  },
  education: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      institution: {
        'ui:placeholder': 'University of California, Berkeley',
      },
      area: {
        'ui:placeholder': 'Computer Science',
      },
      studyType: {
        'ui:placeholder': 'Bachelor of Science',
      },
      startDate: {
        'ui:placeholder': '2018-09',
      },
      endDate: {
        'ui:placeholder': '2022-05',
      },
      score: {
        'ui:placeholder': '3.8/4.0',
      },
      url: {
        'ui:placeholder': 'https://berkeley.edu',
      },
      courses: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., Data Structures and Algorithms',
        },
      },
    },
  },
  skills: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'JavaScript',
      },
      level: {
        'ui:widget': 'select',
      },
      keywords: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., React, Node.js, TypeScript',
        },
      },
    },
  },
  projects: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'E-commerce Platform',
      },
      description: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      url: {
        'ui:placeholder': 'https://github.com/username/project',
      },
      startDate: {
        'ui:placeholder': '2023-01',
      },
      endDate: {
        'ui:placeholder': '2023-06',
      },
      highlights: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., Implemented real-time chat functionality',
        },
      },
      keywords: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., React, Node.js, MongoDB',
        },
      },
      entity: {
        'ui:placeholder': 'Acme Corporation',
      },
      type: {
        'ui:placeholder': 'Personal Project',
      },
      roles: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., Full-stack Developer, UI/UX Designer',
        },
      },
    },
  },
  languages: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      language: {
        'ui:placeholder': 'Spanish',
      },
      fluency: {
        'ui:widget': 'select',
      },
    },
  },
  references: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'John Smith',
      },
      reference: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 4,
        },
      },
    },
  },
  volunteer: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      organization: {
        'ui:placeholder': 'Local Food Bank',
      },
      position: {
        'ui:placeholder': 'Volunteer Coordinator',
      },
      url: {
        'ui:placeholder': 'https://foodbank.org',
      },
      startDate: {
        'ui:placeholder': '2022-01',
      },
      endDate: {
        'ui:placeholder': '2023-12',
      },
      summary: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 3,
        },
      },
      highlights: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder':
            'e.g., Organized weekly food drives serving 200+ families',
        },
      },
    },
  },
  awards: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      title: {
        'ui:placeholder': 'Employee of the Year',
      },
      date: {
        'ui:placeholder': '2023-12',
      },
      awarder: {
        'ui:placeholder': 'Acme Corporation',
      },
      summary: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 2,
        },
      },
    },
  },
  publications: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'Advanced React Patterns',
      },
      publisher: {
        'ui:placeholder': 'Tech Publishing House',
      },
      releaseDate: {
        'ui:placeholder': '2023-06',
      },
      url: {
        'ui:placeholder': 'https://example.com/publication',
      },
      summary: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 2,
        },
      },
    },
  },
  interests: {
    'ui:options': {
      addable: true,
      removable: true,
      orderable: true,
    },
    items: {
      name: {
        'ui:placeholder': 'Photography',
      },
      keywords: {
        'ui:options': {
          addable: true,
          removable: true,
          orderable: true,
        },
        items: {
          'ui:placeholder': 'e.g., Landscape, Portrait, Digital',
        },
      },
    },
  },
}
