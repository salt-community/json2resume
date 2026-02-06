import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { ResumeData, SectionHeaders } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

const defaultHeaders: SectionHeaders = {
  work: 'Work Experience',
  volunteer: 'Volunteer Experience',
  education: 'Education',
  awards: 'Awards',
  certificates: 'Certificates',
  publications: 'Publications',
  skills: 'Skills',
  languages: 'Languages',
  interests: 'Interests',
  references: 'References',
  projects: 'Projects',
}

function SectionHeadersComponent({ resumeData, setResumeData }: Props) {
  const [headers, setHeaders] = useState<SectionHeaders>(
    resumeData.meta?.sectionHeaders || defaultHeaders,
  )

  const handleHeaderChange = (section: keyof SectionHeaders, value: string) => {
    const updatedHeaders = { ...headers, [section]: value }
    setHeaders(updatedHeaders)

    setResumeData({
      ...resumeData,
      meta: {
        ...resumeData.meta,
        sectionHeaders: updatedHeaders,
      },
    })
  }

  const resetToDefaults = () => {
    setHeaders(defaultHeaders)
    setResumeData({
      ...resumeData,
      meta: {
        ...resumeData.meta,
        sectionHeaders: defaultHeaders,
      },
    })
  }

  const sections: Array<{
    key: keyof SectionHeaders
    label: string
    description: string
  }> = [
    {
      key: 'social',
      label: 'Social',
      description: 'Social profiles and website',
    },
    {
      key: 'work',
      label: 'Work Experience',
      description: 'Professional employment history',
    },
    {
      key: 'volunteer',
      label: 'Volunteer Experience',
      description: 'Community service and volunteer work',
    },
    {
      key: 'education',
      label: 'Education',
      description: 'Academic background and qualifications',
    },
    {
      key: 'awards',
      label: 'Awards',
      description: 'Recognition and achievements',
    },
    {
      key: 'certificates',
      label: 'Certificates',
      description: 'Professional certifications',
    },
    {
      key: 'publications',
      label: 'Publications',
      description: 'Published works and articles',
    },
    {
      key: 'skills',
      label: 'Skills',
      description: 'Technical and professional skills',
    },
    {
      key: 'languages',
      label: 'Languages',
      description: 'Language proficiency',
    },
    {
      key: 'interests',
      label: 'Interests',
      description: 'Personal interests and hobbies',
    },
    {
      key: 'references',
      label: 'References',
      description: 'Professional references',
    },
    {
      key: 'projects',
      label: 'Projects',
      description: 'Personal and professional projects',
    },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Section Headers</h3>
          <p className="text-sm text-muted-foreground">
            Customize the headers that appear in your resume sections
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      <div className="grid gap-4">
        {sections.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            </div>
            <Input
              id={key}
              value={headers[key] || ''}
              onChange={(e) => handleHeaderChange(key, e.target.value)}
              placeholder={defaultHeaders[key]}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            These headers will appear as section titles in your resume themes.
          </p>
          <p>Leave empty to use the default header for that section.</p>
        </div>
      </div>
    </div>
  )
}

export default SectionHeadersComponent
