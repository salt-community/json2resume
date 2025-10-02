import { useMemo, useCallback } from 'react'
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
import { saveResumeData } from '@/storage/resumeStorage'

// Theme selection can be a URL or inline HTML
type ThemeSource = { kind: 'url'; url: string } | { kind: 'inline'; html: string }

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  onThemeChange?: (themeUrl: string) => void
  onThemeChangeV2?: (theme: ThemeSource) => void
  onTranslationComplete?: (data: ResumeData) => void
  currentTheme?: string | ThemeSource
}

function AccordionGroup({
  resumeData,
  setResumeData,
  onThemeChange,
  onThemeChangeV2,
  onTranslationComplete,
  currentTheme,
}: Props) {
  // Wrap updates so any field change (including de-select) persists to storage
  const setResumeDataAndSave = useCallback(
    (data: ResumeData) => {
      saveResumeData(data)
      setResumeData(data)
    },
    [setResumeData],
  )

  const items: Array<{ title: string; content: React.ReactNode }> = useMemo(
    () => [
      {
        title: 'LinkedIn Import',
        content: <LinkedinImporter onDataImported={setResumeDataAndSave} />,
      },
      {
        title: 'Section Headers',
        content: (
          <SectionHeadersComponent
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Basics',
        content: (
          <Basic resumeData={resumeData} setResumeData={setResumeDataAndSave} />
        ),
      },
      {
        title: 'Work Experience',
        content: (
          <Work resumeData={resumeData} setResumeData={setResumeDataAndSave} />
        ),
      },
      {
        title: 'Education',
        content: (
          <Education
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Projects',
        content: (
          <Projects
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Skills',
        content: (
          <Skills resumeData={resumeData} setResumeData={setResumeDataAndSave} />
        ),
      },
      {
        title: 'Certifications',
        content: (
          <Certifications
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Awards',
        content: (
          <Awards
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Publications',
        content: (
          <Publications
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Volunteering',
        content: (
          <Volunteering
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Languages',
        content: (
          <Languages
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Interests',
        content: (
          <Interests
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'References',
        content: (
          <References
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
      },
      {
        title: 'Themes',
        content: (
          <Themes
            onThemeChange={onThemeChange}
            onThemeChangeV2={onThemeChangeV2}
            currentTheme={currentTheme}
          />
        ),
      },
      {
        title: 'Export',
        content: <Export resumeData={resumeData} />,
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
      },
    ],
    [
      resumeData,
      setResumeDataAndSave,
      onThemeChange,
      onThemeChangeV2,
      onTranslationComplete,
      currentTheme,
    ],
  )
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item, index) => (
        <AccordionItem
          className={index === 13 ? 'mb-16' : ''}
          value={`item-${index}`}
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
