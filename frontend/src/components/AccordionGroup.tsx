import Basic from './accordionComponents/dataSections/Basic'
import Volunteering from './accordionComponents/dataSections/Volunteering'
import Awards from './accordionComponents/dataSections/Awards'
import Certifications from './accordionComponents/dataSections/Certifications'
import Publications from './accordionComponents/dataSections/Publications'
import Skills from './accordionComponents/dataSections/Skills'
import Languages from './accordionComponents/dataSections/Languages'
import Interests from './accordionComponents/dataSections/Interests'
import References from './accordionComponents/dataSections/References'
import Projects from './accordionComponents/dataSections/Projects'
import Export from './accordionComponents/Export'
import ResumeTranslator from './accordionComponents/dataSections/ResumeTranslator'
import Themes from './accordionComponents/Themes'
import SectionHeadersComponent from './accordionComponents/SectionHeaders'
import Social from './accordionComponents/dataSections/Social'
import Education from './accordionComponents/dataSections/Education'
import Work from './accordionComponents/dataSections/Work'
import type { ResumeData } from '@/types'
import DataImporter from '@/components/DataImport/DataImporter'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'

// Theme selection can be a URL or inline HTML
type ThemeSource =
  | { kind: 'url'; url: string }
  | { kind: 'inline'; html: string }

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  onThemeChangeV2?: (theme: ThemeSource) => void
  onTranslationComplete?: (data: ResumeData) => void
  currentTheme?: string | ThemeSource
}

function AccordionGroup({
  resumeData,
  setResumeData,
  onThemeChangeV2,
  onTranslationComplete,
  currentTheme,
}: Props) {
  // Centralized saving is handled in the editor via derived JSON effect
  const setResumeDataAndSave = (data: ResumeData) => {
    setResumeData(data)
  }

  const sectionKeyMap: Record<string, keyof ResumeData | null> = {
    Basics: 'basics',
    Social: null,
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
    if (!key && title !== 'Social') return false
    if (key === 'basics') return (resumeData.basics?.enabled ?? true) !== false
    if (title === 'Social') return (resumeData.meta?.social?.enabled ?? true) !== false
    const arr = (resumeData as any)[key!] as
      | Array<{ enabled?: boolean }>
      | undefined
    return Boolean(arr?.some((x) => x.enabled !== false))
  }

  function setSectionEnabled(title: string, enabled: boolean) {
    const key = sectionKeyMap[title]
    if (!key && title !== 'Social') return
    if (key === 'basics') {
      setResumeData({
        ...resumeData,
        basics: { ...(resumeData.basics ?? {}), enabled },
      })
      return
    }
    if (title === 'Social') {
      setResumeData({
        ...resumeData,
        meta: {
          ...resumeData.meta,
          social: {
            enabled,
            website: resumeData.meta?.social?.website
          }
        }
      })
      return
    }
    const arr = ((resumeData as any)[key!] ?? []) as Array<any>
    setResumeData({
      ...(resumeData as any),
      [key as string]: arr.map((x) => ({ ...x, enabled })),
    })
  }
  const items: Array<{
    title: string
    content: React.ReactNode
    checkbox: boolean
  }> = [
    {
      title: 'Data Import',
      content: <DataImporter onDataImported={setResumeDataAndSave} />,
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
      title: 'Social',
        content: (
          <Social resumeData={resumeData} setResumeData={setResumeDataAndSave} />
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
        <Skills resumeData={resumeData} setResumeData={setResumeDataAndSave} />
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
        <Awards resumeData={resumeData} setResumeData={setResumeDataAndSave} />
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
  ]

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
