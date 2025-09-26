/**
 * GistTemplateDemo.tsx
 * --------------------
 * Purpose
 *   Showcase how to render a JSON Resume through a Gist HTML template using
 *   the <GistTemplate /> component. Also provides UI controls to try another
 *   gist URL and toggle raw HTML output.
 *
 * Notes
 *   - This is demo/test UI. In production, you would typically just use
 *     <GistTemplate gistUrl={...} resumeData={...} /> directly.
 */

import React, { useState } from 'react'
import {
  GistTemplate,
  ClassicGistTemplate,
  DEFAULT_CLASSIC_TEMPLATE_URL,
} from './GistTemplate'
import type { ResumeData } from './templateEngine'

// Sample resume data for testing the template engine end-to-end.
// You can replace this with user-generated data at runtime.
const SAMPLE_RESUME_DATA: ResumeData = {
  basics: {
    name: 'John Doe',
    label: 'Full Stack Developer',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    url: 'https://johndoe.dev',
    summary:
      'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
    location: {
      city: 'San Francisco',
      region: 'California',
      countryCode: 'US',
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'johndoe',
        url: 'https://linkedin.com/in/johndoe',
      },
      {
        network: 'GitHub',
        username: 'johndoe',
        url: 'https://github.com/johndoe',
      },
    ],
  },
  // ...the rest of the sample below is not special — just realistic data
  work: [
    {
      name: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      url: 'https://techsolutions.com',
      startDate: '2021-03-01',
      endDate: '',
      summary:
        'Lead development of customer-facing web applications serving 100K+ users.',
      highlights: [
        'Architected and implemented microservices reducing response time by 40%',
        'Led team of 4 developers in agile environment',
        'Mentored junior developers and conducted code reviews',
      ],
    },
    {
      name: 'StartupXYZ',
      position: 'Frontend Developer',
      url: 'https://startupxyz.com',
      startDate: '2019-06-01',
      endDate: '2021-02-28',
      summary:
        'Built responsive web applications using React and modern JavaScript.',
      highlights: [
        'Developed reusable component library used across 5 products',
        'Improved page load times by 60% through optimization',
        'Collaborated with designers to implement pixel-perfect UIs',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2015-09-01',
      endDate: '2019-05-01',
      score: '3.8',
      courses: [
        'Data Structures',
        'Algorithms',
        'Database Systems',
        'Software Engineering',
      ],
    },
  ],
  skills: [
    {
      name: 'Frontend Development',
      level: 'Expert',
      keywords: [
        'React',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Tailwind CSS',
      ],
    },
    {
      name: 'Backend Development',
      level: 'Advanced',
      keywords: [
        'Node.js',
        'Express',
        'Python',
        'PostgreSQL',
        'MongoDB',
        'REST APIs',
      ],
    },
    {
      name: 'DevOps & Cloud',
      level: 'Intermediate',
      keywords: ['AWS', 'Docker', 'CI/CD', 'GitHub Actions', 'Terraform'],
    },
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      startDate: '2022-01-01',
      endDate: '2022-06-01',
      description:
        'Full-stack e-commerce solution with payment integration and admin dashboard.',
      highlights: [
        'Built with React, Node.js, and PostgreSQL',
        'Integrated Stripe payment processing',
        'Implemented real-time inventory management',
      ],
      url: 'https://github.com/johndoe/ecommerce-platform',
    },
  ],
  languages: [
    { language: 'English', fluency: 'Native' },
    { language: 'Spanish', fluency: 'Conversational' },
  ],
  interests: [
    { name: 'Technology', keywords: ['Open Source', 'AI/ML', 'Blockchain'] },
    {
      name: 'Outdoor Activities',
      keywords: ['Hiking', 'Photography', 'Rock Climbing'],
    },
  ],
}

/**
 * Simple playground that lets you:
 *  - Try the default template
 *  - Paste in another gist URL
 *  - Toggle to see the raw HTML output from the engine
 */
export const GistTemplateDemo: React.FC = () => {
  const [customGistUrl, setCustomGistUrl] = useState(
    DEFAULT_CLASSIC_TEMPLATE_URL,
  )
  const [processedHtml, setProcessedHtml] = useState<string>('')
  const [showRawHtml, setShowRawHtml] = useState(false)

  const handleProcessed = (html: string) => {
    setProcessedHtml(html)
    console.log('Template processed successfully:', html.length, 'characters')
  }

  const handleError = (error: string) => {
    console.error('Template processing error:', error)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          GistTemplate Demo
        </h1>
        <p className="text-gray-600">
          Demonstrating GitHub Gist template processing with sample resume data
        </p>
      </div>

      {/* Configuration panel for the gist URL + options */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Template Configuration</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="gist-url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              GitHub Gist URL:
            </label>
            <input
              id="gist-url"
              type="url"
              value={customGistUrl}
              onChange={(e) => setCustomGistUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://gist.github.com/username/gistId#file-template-html"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a GitHub Gist URL containing an HTML template with
              placeholder syntax
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCustomGistUrl(DEFAULT_CLASSIC_TEMPLATE_URL)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Use Default Classic Template
            </button>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRawHtml}
                onChange={(e) => setShowRawHtml(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show raw HTML output</span>
            </label>
          </div>
        </div>
      </div>

      {/* Rendered template result */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Rendered Template</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <GistTemplate
              gistUrl={customGistUrl}
              resumeData={SAMPLE_RESUME_DATA}
              onProcessed={handleProcessed}
              onError={handleError}
              className="min-h-[400px]"
            />
          </div>
        </div>

        {/* Raw HTML (debug/teaching aid) */}
        {showRawHtml && processedHtml && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Raw HTML Output</h3>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {processedHtml}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GistTemplateDemo
