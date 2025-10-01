import { describe, expect, test } from 'vitest'
import {
  compile,
  renderTemplate,
} from '../components/GistTemplate/templateEngine'
import type { ResumeData } from '../components/GistTemplate/templateEngine'

describe('Template Engine', () => {
  // Helper functions to create test data
  const createBasicResumeData = (
    overrides: Partial<ResumeData> = {},
  ): ResumeData => ({
    basics: {
      name: 'John Doe',
      label: 'Software Developer',
      email: 'john@example.com',
      ...overrides.basics,
    },
    ...overrides,
  })

  const createResumeDataWithWork = (): ResumeData => ({
    basics: { name: 'John Doe' },
    work: [
      {
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: '2023-12',
        summary: 'Led development of key features',
        highlights: [
          'Improved performance by 50%',
          'Mentored junior developers',
        ],
      },
      {
        company: 'Startup Inc',
        position: 'Full Stack Developer',
        startDate: '2018-06',
        endDate: '2019-12',
        summary: 'Built web applications from scratch',
      },
    ],
  })

  const createResumeDataWithSkills = (): ResumeData => ({
    basics: { name: 'John Doe' },
    skills: [
      {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6', 'React', 'Node.js'],
      },
      {
        name: 'Python',
        level: 'Advanced',
        keywords: ['Django', 'Flask', 'Data Analysis'],
      },
    ],
  })

  const createResumeDataWithLocation = (): ResumeData => ({
    basics: {
      name: 'John Doe',
      location: {
        city: 'San Francisco',
        country: 'USA',
      },
    },
  })

  const createResumeDataWithProfiles = (): ResumeData => ({
    basics: {
      name: 'John Doe',
      profiles: [
        {
          network: 'GitHub',
          username: 'johndoe',
          url: 'https://github.com/johndoe',
        },
        {
          network: 'LinkedIn',
          username: 'john-doe',
          url: 'https://linkedin.com/in/john-doe',
        },
      ],
    },
  })

  const createResumeDataWithImages = (): ResumeData => ({
    basics: {
      name: 'John Doe',
      image: 'https://example.com/old-image.jpg',
      uploadedImage: 'https://example.com/new-image.jpg',
    },
  })

  const createResumeDataWithSummary = (): ResumeData => ({
    basics: {
      name: 'John Doe',
      summary:
        'Experienced developer with <strong>5 years</strong> of experience',
    },
  })

  const createResumeDataWithEducation = (): ResumeData => ({
    basics: { name: 'John Doe' },
    education: [
      {
        institution: 'University of Technology',
        area: 'Computer Science',
        studyType: 'Bachelor',
        startDate: '2014-09',
        endDate: '2018-06',
      },
    ],
  })

  describe('Variable Rendering', () => {
    test('renders simple variables', () => {
      const template = 'Hello >>[basics.name]<<!'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Hello John Doe!')
    })

    test('renders nested object properties', () => {
      const template =
        'Location: >>[basics.location.city]<<, >>[basics.location.country]<<'
      const resumeData = createResumeDataWithLocation()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Location: San Francisco, USA')
    })

    test('renders current context with dot notation', () => {
      const template = '[[#each work]]>>[.]<< [[/each]]'
      const resumeData = createResumeDataWithWork()
      const result = renderTemplate(template, resumeData)
      const expected =
        '{&quot;company&quot;:&quot;Tech Corp&quot;,&quot;position&quot;:&quot;Senior Developer&quot;,&quot;startDate&quot;:&quot;2020-01&quot;,&quot;endDate&quot;:&quot;2023-12&quot;,&quot;summary&quot;:&quot;Led development of key features&quot;,&quot;highlights&quot;:[&quot;Improved performance by 50%&quot;,&quot;Mentored junior developers&quot;]} {&quot;company&quot;:&quot;Startup Inc&quot;,&quot;position&quot;:&quot;Full Stack Developer&quot;,&quot;startDate&quot;:&quot;2018-06&quot;,&quot;endDate&quot;:&quot;2019-12&quot;,&quot;summary&quot;:&quot;Built web applications from scratch&quot;} '
      expect(result).toBe(expected)
    })

    test('handles missing properties gracefully', () => {
      const template = 'Missing: >>[basics.nonexistent]<<'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Missing: ')
    })

    test('handles null and undefined values', () => {
      const template =
        'Null: >>[basics.nullValue]<<, Undefined: >>[basics.undefinedValue]<<'
      const resumeData = createBasicResumeData({
        basics: { nullValue: null, undefinedValue: undefined },
      })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Null: , Undefined: ')
    })
  })

  describe('HTML Escaping', () => {
    test('escapes HTML by default', () => {
      const template = 'Summary: >>[basics.summary]<<'
      const resumeData = createResumeDataWithSummary()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe(
        'Summary: Experienced developer with &lt;strong&gt;5 years&lt;/strong&gt; of experience',
      )
    })

    test('allows raw HTML when htmlEscape is false', () => {
      const template = 'Summary: >>[basics.summary]<<'
      const resumeData = createResumeDataWithSummary()
      const result = renderTemplate(template, resumeData, {
        htmlEscape: false,
      })
      expect(result).toBe(
        'Summary: Experienced developer with <strong>5 years</strong> of experience',
      )
    })
  })

  describe('Conditional Rendering', () => {
    test('renders content when condition is truthy', () => {
      const template = '[[#if basics.label]]Title: >>[basics.label]<<[[/if]]'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Title: Software Developer')
    })

    test('skips content when condition is falsy', () => {
      const template = '[[#if basics.nonexistent]]This should not appear[[/if]]'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })

    test('handles negation with ! operator', () => {
      const template = '[[#if !basics.nonexistent]]This should appear[[/if]]'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('This should appear')
    })

    test('handles empty string as falsy', () => {
      const template = '[[#if basics.emptyString]]Should not appear[[/if]]'
      const resumeData = createBasicResumeData({ basics: { emptyString: '' } })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })

    test('handles zero as falsy', () => {
      const template = '[[#if basics.zero]]Should not appear[[/if]]'
      const resumeData = createBasicResumeData({ basics: { zero: 0 } })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })

    test('handles empty array as falsy', () => {
      const template = '[[#if basics.emptyArray]]Should not appear[[/if]]'
      const resumeData = createBasicResumeData({ basics: { emptyArray: [] } })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })
  })

  describe('Loop Rendering', () => {
    test('renders each item in an array', () => {
      const template =
        '[[#each work]]Company: >>[company]<<, Position: >>[position]<<\n[[/each]]'
      const resumeData = createResumeDataWithWork()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe(
        'Company: Tech Corp, Position: Senior Developer\nCompany: Startup Inc, Position: Full Stack Developer\n',
      )
    })

    test('handles empty arrays gracefully', () => {
      const template =
        '[[#each basics.emptyArray]]This should not appear[[/each]]'
      const resumeData = createBasicResumeData({ basics: { emptyArray: [] } })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })

    test('handles non-array values in each', () => {
      const template = '[[#each basics.name]]This should not appear[[/each]]'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('')
    })

    test('uses dot notation for current item in loop', () => {
      const template = '[[#each skills]]>>[name]<< (>>[level]<<)\n[[/each]]'
      const resumeData = createResumeDataWithSkills()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('JavaScript (Expert)\nPython (Advanced)\n')
    })
  })

  describe('Join Helper', () => {
    test('joins array with default separator', () => {
      const template = 'Skills: [[#join skills.0.keywords]]'
      const resumeData = createResumeDataWithSkills()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Skills: ES6, React, Node.js')
    })

    test('joins array with custom separator', () => {
      const template = 'Skills: [[#join skills.0.keywords| | ]]'
      const resumeData = createResumeDataWithSkills()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Skills: ES6 |React |Node.js')
    })

    test('handles empty arrays in join', () => {
      const template = 'Empty: [[#join basics.emptyArray|, ]]'
      const resumeData = createBasicResumeData({ basics: { emptyArray: [] } })
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Empty: ')
    })

    test('handles non-array values in join', () => {
      const template = 'Not array: [[#join basics.name|, ]]'
      const resumeData = createBasicResumeData()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Not array: ')
    })
  })

  describe('Special Image Handling', () => {
    test('prioritizes uploadedImage over image', () => {
      const template = 'Image: >>[basics.image]<<'
      const resumeData = createResumeDataWithImages()
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Image: https://example.com/new-image.jpg')
    })

    test('falls back to image when uploadedImage is not available', () => {
      const resumeData = createResumeDataWithImages()
      delete resumeData.basics.uploadedImage

      const template = 'Image: >>[basics.image]<<'
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Image: https://example.com/old-image.jpg')
    })

    test('handles missing image properties', () => {
      const resumeData = createBasicResumeData({ basics: { name: 'John' } })
      const template = 'Image: >>[basics.image]<<'
      const result = renderTemplate(template, resumeData)
      expect(result).toBe('Image: ')
    })
  })

  describe('Complex Templates', () => {
    test('renders complex nested template', () => {
      const template = `
        <div class="resume">
          <h1>>>[basics.name]<<</h1>
          <p class="title">>>[basics.label]<<</p>
          [[#if basics.summary]]
          <div class="summary">>>[basics.summary]<<</div>
          [[/if]]
          <div class="work">
            [[#each work]]
            <div class="job">
              <h3>>>[position]<< at >>[company]<<</h3>
              <p>>>[summary]<<</p>
              [[#if highlights]]
              <ul>
                [[#each highlights]]
                <li>>>[.]<<</li>
                [[/each]]
              </ul>
              [[/if]]
            </div>
            [[/each]]
          </div>
        </div>
      `
      const resumeData = createBasicResumeData({
        work: createResumeDataWithWork().work,
        basics: {
          ...createBasicResumeData().basics,
          summary: createResumeDataWithSummary().basics.summary,
        },
      })
      const result = renderTemplate(template, resumeData, {
        htmlEscape: false,
      })

      expect(result).toContain('<h1>John Doe</h1>')
      expect(result).toContain('<p class="title">Software Developer</p>')
      expect(result).toContain(
        '<div class="summary">Experienced developer with <strong>5 years</strong> of experience</div>',
      )
      expect(result).toContain('<h3>Senior Developer at Tech Corp</h3>')
      expect(result).toContain('<li>Improved performance by 50%</li>')
      expect(result).toContain('<li>Mentored junior developers</li>')
    })

    test('handles nested conditionals and loops', () => {
      const template = `
        [[#each work]]
        <div class="job">
          <h3>>>[position]<<</h3>
          [[#if summary]]
          <p>>>[summary]<<</p>
          [[/if]]
          [[#if highlights]]
          <ul>
            [[#each highlights]]
            <li>>>[.]<<</li>
            [[/each]]
          </ul>
          [[/if]]
        </div>
        [[/each]]
      `
      const resumeData = createResumeDataWithWork()
      const result = renderTemplate(template, resumeData, {
        htmlEscape: false,
      })

      expect(result).toContain('<h3>Senior Developer</h3>')
      expect(result).toContain('<p>Led development of key features</p>')
      expect(result).toContain('<li>Improved performance by 50%</li>')
      expect(result).toContain('<h3>Full Stack Developer</h3>')
      expect(result).toContain('<p>Built web applications from scratch</p>')
    })
  })

  describe('Compile and Caching', () => {
    test('compile returns a render function', () => {
      const template = 'Hello >>[basics.name]<<!'
      const compiled = compile(template)

      expect(typeof compiled.render).toBe('function')

      const resumeData = createBasicResumeData()
      const result = compiled.render(resumeData)
      expect(result).toBe('Hello John Doe!')
    })

    test('caching works correctly', () => {
      const template = 'Hello >>[basics.name]<<!'
      const resumeData = createBasicResumeData()

      // First compilation
      const compiled1 = compile(template)
      const result1 = compiled1.render(resumeData)

      // Second compilation should use cache
      const compiled2 = compile(template)
      const result2 = compiled2.render(resumeData)

      expect(result1).toBe(result2)
      expect(result1).toBe('Hello John Doe!')
    })

    test('different templates are cached separately', () => {
      const template1 = 'Hello >>[basics.name]<<!'
      const template2 = 'Goodbye >>[basics.name]<<!'
      const resumeData = createBasicResumeData()

      const compiled1 = compile(template1)
      const compiled2 = compile(template2)

      expect(compiled1).not.toBe(compiled2)

      const result1 = compiled1.render(resumeData)
      const result2 = compiled2.render(resumeData)

      expect(result1).toBe('Hello John Doe!')
      expect(result2).toBe('Goodbye John Doe!')
    })
  })

  describe('Error Handling', () => {
    test('throws error for malformed templates with unclosed blocks', () => {
      const template = 'Hello >>[basics.name]<< [[#if basics.label]]Unclosed'
      const resumeData = createBasicResumeData()

      // This should throw a TemplateParseError due to unclosed block
      expect(() => renderTemplate(template, resumeData)).toThrow()
    })

    test('handles empty template', () => {
      const resumeData = createBasicResumeData()
      const result = renderTemplate('', resumeData)
      expect(result).toBe('')
    })

    test('handles template with only text', () => {
      const resumeData = createBasicResumeData()
      const result = renderTemplate('Just plain text', resumeData)
      expect(result).toBe('Just plain text')
    })
  })

  describe('Edge Cases', () => {
    test('handles deeply nested objects', () => {
      const data = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'Deep value',
              },
            },
          },
        },
      }

      const template = 'Deep: >>[level1.level2.level3.level4.value]<<'
      const result = renderTemplate(template, data)
      expect(result).toBe('Deep: Deep value')
    })

    test('handles arrays with objects', () => {
      const data = {
        items: [
          { name: 'Item 1', value: 100 },
          { name: 'Item 2', value: 200 },
        ],
      }

      const template = '[[#each items]]>>[name]<<: >>[value]<<\n[[/each]]'
      const result = renderTemplate(template, data)
      expect(result).toBe('Item 1: 100\nItem 2: 200\n')
    })

    test('handles boolean values in conditionals', () => {
      const data = { isActive: true, isDisabled: false }

      const template1 = '[[#if isActive]]Active[[/if]]'
      const template2 = '[[#if isDisabled]]Disabled[[/if]]'

      expect(renderTemplate(template1, data)).toBe('Active')
      expect(renderTemplate(template2, data)).toBe('')
    })
  })
})
