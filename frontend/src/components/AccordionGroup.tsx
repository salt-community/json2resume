import { useMemo } from 'react'
import Basic from './accordionComponents/Basic'
import Work from './accordionComponents/Work'
import Volunteering from './accordionComponents/Volunteering'
import Education from './accordionComponents/Education'
import Awards from './accordionComponents/Awards'
import Certifications from './accordionComponents/Certifications'
import Publications from './accordionComponents/Publications'
import Skills from './accordionComponents/Skills'
import Languages from './accordionComponents/Languages'
import Interests from './accordionComponents/Interests'
import References from './accordionComponents/References'
import Projects from './accordionComponents/Projects'
import Export from './accordionComponents/Export'
import ResumeTranslator from './accordionComponents/ResumeTranslator'
import { LinkedinImporter } from './LinkedinImport'
import Themes from './accordionComponents/Themes'
import SectionHeadersComponent from './accordionComponents/SectionHeaders'
import type { ResumeData } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  onThemeChange?: (themeUrl: string) => void
  onTranslationComplete?: (data: ResumeData) => void
  currentTheme?: string
}

function AccordionGroup({
  resumeData,
  setResumeData,
  onThemeChange,
  onTranslationComplete,
  currentTheme,
}: Props) {
  const items: Array<{
    title: string
    content: React.ReactNode
    checkbox: boolean
  }> = useMemo(
    () => [
      {
        title: 'LinkedIn Import',
        content: <LinkedinImporter onDataImported={setResumeData} />,
        checkbox: true,
      },
      {
        title: 'Section Headers',
        content: (
          <SectionHeadersComponent
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Basics',
        content: (
          <Basic resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Work Experience',
        content: <Work resumeData={resumeData} setResumeData={setResumeData} />,
        checkbox: true,
      },
      {
        title: 'Education',
        content: (
          <Education resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Projects',
        content: (
          <Projects resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Skills',
        content: (
          <Skills resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Certifications',
        content: (
          <Certifications
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Awards',
        content: (
          <Awards resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Publications',
        content: (
          <Publications resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Volunteering',
        content: (
          <Volunteering resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Languages',
        content: (
          <Languages resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Interests',
        content: (
          <Interests resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'References',
        content: (
          <References resumeData={resumeData} setResumeData={setResumeData} />
        ),
        checkbox: true,
      },
      {
        title: 'Themes',
        content: (
          <Themes onThemeChange={onThemeChange} currentTheme={currentTheme} />
        ),
        checkbox: true,
      },

      {
        title: 'Translation',
        content: onTranslationComplete ? (
          <ResumeTranslator
            resumeData={resumeData}
            onTranslationComplete={onTranslationComplete}
          />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>Translation feature not available</p>
          </div>
        ),
        checkbox: true,
      },
      {
        title: 'Export',
        content: <Export resumeData={resumeData} />,
        checkbox: true,
      },
    ],

    [
      resumeData,
      setResumeData,
      onThemeChange,
      onTranslationComplete,
      currentTheme,
    ],
  )
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item, index) => (
        <>
          <AccordionItem
            className={index === 13 ? 'mb-16' : ''}
            value={`item-${index}`}
          >
            <AccordionTrigger className="flex items-center w-full">
              <span className="flex-1 text-left">{item.title}</span>
              <Checkbox
                className=" ml-4 flex-shrink-0 order-last"
                onClick={(e) => e.stopPropagation()}
              />
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        </>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
