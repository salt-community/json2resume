import { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

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

type SectionItem = {
  id: string
  title: string
  content: React.ReactNode
  checkbox: boolean
}

function GridNavigationGroup({
  resumeData,
  setResumeData,
  onThemeChangeV2,
  onTranslationComplete,
  currentTheme,
}: Props) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  )

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
    if (title === 'Social')
      return (resumeData.meta?.social?.enabled ?? true) !== false
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
            website: resumeData.meta?.social?.website,
          },
        },
      })
      return
    }
    const arr = ((resumeData as any)[key!] ?? []) as Array<any>
    setResumeData({
      ...(resumeData as any),
      [key as string]: arr.map((x) => ({ ...x, enabled })),
    })
  }

  const allItems: SectionItem[] = [
    {
      id: 'data-import',
      title: 'Data Import',
      content: <DataImporter onDataImported={setResumeDataAndSave} />,
      checkbox: false,
    },
    {
      id: 'section-headers',
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
      id: 'basics',
      title: 'Basics',
      content: (
        <Basic resumeData={resumeData} setResumeData={setResumeDataAndSave} />
      ),
      checkbox: true,
    },
    {
      id: 'social',
      title: 'Social',
      content: (
        <Social resumeData={resumeData} setResumeData={setResumeDataAndSave} />
      ),
      checkbox: true,
    },
    {
      id: 'work',
      title: 'Work Experience',
      content: (
        <Work resumeData={resumeData} setResumeData={setResumeDataAndSave} />
      ),
      checkbox: true,
    },
    {
      id: 'education',
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
      id: 'projects',
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
      id: 'skills',
      title: 'Skills',
      content: (
        <Skills resumeData={resumeData} setResumeData={setResumeDataAndSave} />
      ),
      checkbox: true,
    },
    {
      id: 'certifications',
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
      id: 'awards',
      title: 'Awards',
      content: (
        <Awards resumeData={resumeData} setResumeData={setResumeDataAndSave} />
      ),
      checkbox: true,
    },
    {
      id: 'publications',
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
      id: 'volunteering',
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
      id: 'languages',
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
      id: 'interests',
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
      id: 'references',
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
      id: 'themes',
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
      id: 'translation',
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
      id: 'export',
      title: 'Export',
      content: <Export resumeData={resumeData} />,
      checkbox: false,
    },
  ]

  const categories: { title: string; items: SectionItem[] }[] = [
    {
      title: 'Setup and actions',
      items: [...allItems.slice(0, 2), ...allItems.slice(15)],
    },
    {
      title: 'Data Sections',
      items: allItems.slice(2, 15),
    },
  ]

  const selectedItem = selectedSectionId
    ? allItems.find((i) => i.id === selectedSectionId)
    : null

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Grid of cards */}
      <div className="flex-shrink-0">
        {categories.map((category, catIndex) => (
          <div key={category.title}>
            <h3
              className={cn(
                'text-xs text-muted-foreground font-medium mb-2',
                catIndex === 0 ? 'mt-0' : 'mt-4',
              )}
            >
              {category.title}
            </h3>
            <div
              className={cn(
                'grid gap-3',
                catIndex === 0
                  ? 'grid-cols-5'
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
              )}
            >
              {category.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedSectionId(
                      selectedSectionId === item.id ? null : item.id,
                    )
                  }
                  className={cn(
                    'flex items-center justify-between w-full p-3 rounded-md border text-left text-sm font-medium transition-colors',
                    // Base styles (not selected)
                    'bg-surface border-border',
                    // Hover only when not selected (greyish in dark mode)
                    selectedSectionId !== item.id &&
                      'hover:bg-surface-strong dark:hover:bg-neutral-700',
                    // Selected styles (matching tabs)
                    selectedSectionId === item.id && [
                      'bg-accent',
                      'dark:bg-input/30',
                      'dark:text-foreground',
                      'dark:border-input',
                      'shadow-sm',
                      // Keep accent color on hover when selected
                      'hover:bg-accent',
                      'dark:hover:bg-input/30',
                    ],
                  )}
                >
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.checkbox && (
                    <Checkbox
                      className="ml-2 flex-shrink-0"
                      checked={isSectionChecked(item.title)}
                      onCheckedChange={(val) =>
                        setSectionEnabled(item.title, Boolean(val))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Content panel - takes remaining space */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-border mt-4">
        {selectedItem ? (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 transition-opacity">
            {selectedItem.content}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default GridNavigationGroup
