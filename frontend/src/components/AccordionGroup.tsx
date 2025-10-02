import { useCallback, useMemo } from 'react'
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
import { saveResumeData } from '@/storage/resumeStorage'

// Theme selection can be a URL or inline HTML
type ThemeSource =
  | { kind: 'url'; url: string }
  | { kind: 'inline'; html: string }

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

  const sectionKeyMap: Record<string, keyof ResumeData | null> = {
    Basics: 'basics',
    'Work Experience': 'work',
    Education: 'education',
    Projects: 'projects',
    Skills: 'skills',
    Certifications: 'certificates',
    Awards: 'awards',
    Publications: 'publications',
    Volunteering: 'volunteer',
    Languages: 'languages',
    Interests: 'interests',
    References: 'references',
  }

  function isSectionChecked(title: string): boolean {
    const key = sectionKeyMap[title]
    if (!key) return false
    if (key === 'basics') return (resumeData.basics?.enabled ?? true) !== false
    const arr = (resumeData as any)[key] as
      | Array<{ enabled?: boolean }>
      | undefined
    return Boolean(arr?.some((x) => x.enabled !== false))
  }

  function setSectionEnabled(title: string, enabled: boolean) {
    const key = sectionKeyMap[title]
    if (!key) return
    if (key === 'basics') {
      setResumeData({
        ...resumeData,
        basics: { ...(resumeData.basics ?? {}), enabled },
      })
      return
    }
    const arr = ((resumeData as any)[key] ?? []) as Array<any>
    setResumeData({
      ...(resumeData as any),
      [key]: arr.map((x) => ({ ...x, enabled })),
    })
  }
  const items: Array<{
    title: string
    content: React.ReactNode
    checkbox: boolean
  }> = useMemo(
    () => [
      {
        title: 'LinkedIn Import',
        content: <LinkedinImporter onDataImported={setResumeDataAndSave} />,
        checkbox: false,
      },
      {
        title: 'Section Headers',
        content: (
          <SectionHeadersComponent
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: false,
      },
      {
        title: 'Basics',
        content: (
          <Basic resumeData={resumeData} setResumeData={setResumeDataAndSave} />
        ),
        checkbox: true,
      },
      {
        title: 'Work Experience',
        content: (
          <Work resumeData={resumeData} setResumeData={setResumeDataAndSave} />
        ),
        checkbox: true,
      },
      {
        title: 'Education',
        content: (
          <Education
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Projects',
        content: (
          <Projects
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Skills',
        content: (
          <Skills
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Certifications',
        content: (
          <Certifications
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Awards',
        content: (
          <Awards
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Publications',
        content: (
          <Publications
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Volunteering',
        content: (
          <Volunteering
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Languages',
        content: (
          <Languages
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'Interests',
        content: (
          <Interests
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
      },
      {
        title: 'References',
        content: (
          <References
            resumeData={resumeData}
            setResumeData={setResumeDataAndSave}
          />
        ),
        checkbox: true,
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
        checkbox: false,
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
        checkbox: false,
      },
      {
        title: 'Export',
        content: <Export resumeData={resumeData} />,
        checkbox: false,
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
        <>
          <AccordionItem
            className={index === 13 ? 'mb-16' : index === 1 ? 'mb-16' : ''}
            value={`item-${index}`}
          >
            <AccordionTrigger className="flex items-center w-full">
              <span className="flex-1 text-left">{item.title}</span>
              {item.checkbox && (
                <Checkbox
                  className=" ml-4 flex-shrink-0 order-last"
                  checked={isSectionChecked(item.title)}
                  onCheckedChange={(val) =>
                    setSectionEnabled(item.title, Boolean(val))
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        </>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
