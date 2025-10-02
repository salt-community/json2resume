import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ResumeData } from '@/types'
import AccordionGroup from '@/components/AccordionGroup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { defaultResumeData, mockedResumeData } from '@/data/resumeDataMock.ts'
import JsonCodeEditor from '@/components/ResumeEditor/JsonCodeEditor.tsx'
import { jsonStringFromJsonObj } from '@/data/jsonStringFromJsonObj.ts'
import { jsonObjFromResumeData } from '@/data/jsonObjFromResumeData.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'
import jsonObjFromJsonString from '@/data/jsonObjFromJsonString.ts'
import { GistTemplate } from '@/components/GistTemplate'
import { loadResumeData } from '@/storage/resumeStorage'
import { inlineThemes } from '@/data/localThemes'

// Theme selection can be a URL or inline HTML
type ThemeSource =
  | { kind: 'url'; url: string }
  | { kind: 'inline'; html: string }

export const Route = createFileRoute('/editor')({
  component: App,
})

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(
    () => loadResumeData() ?? mockedResumeData,
  )
  const [selectedTheme, setSelectedTheme] = useState<ThemeSource>({
    kind: 'url',
    url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
  })
  const json = jsonStringFromJsonObj(jsonObjFromResumeData(resumeData))

  // Legacy handler: URL only
  const handleThemeChange = (themeUrl: string) => {
    setSelectedTheme({ kind: 'url', url: themeUrl })
  }

  // New handler: union type
  const handleThemeChangeV2 = (theme: ThemeSource) => {
    setSelectedTheme(theme)
  }

  const handleTranslationComplete = (translatedData: ResumeData) => {
    setResumeData(translatedData)
  }

  return (
    <div className="flex justify-center bg-surface-strong h-screen overflow-hidden">
      <div className=" text-text-strong grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 h-full overflow-hidden">
        <section className="h-full overflow-auto bg-surface rounded-xl border border-border shadow-sm p-4">
          <button
            className="p-4 w-full cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => setResumeData(defaultResumeData)}
          >
            Reset to Default
          </button>

          <Tabs defaultValue="form">
            <TabsList className="w-full bg-surface rounded-lg border border-border">
              <TabsTrigger
                className="p-8 font-bold text-2xl text-text-strong"
                value="form"
              >
                Form
              </TabsTrigger>
              <TabsTrigger
                className="p-8 font-bold text-2xl text-text-strong"
                value="json"
              >
                Json
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <AccordionGroup
                resumeData={resumeData}
                setResumeData={setResumeData}
                onThemeChange={handleThemeChange}
                onThemeChangeV2={handleThemeChangeV2}
                onTranslationComplete={handleTranslationComplete}
                currentTheme={selectedTheme}
              />
            </TabsContent>
            <TabsContent value="json">
              <JsonCodeEditor
                jsonState={json}
                onChange={(jsonString: string) => {
                  const obj: any = jsonObjFromJsonString(jsonString)

                  // Build ResumeData from JSON (existing behavior)
                  let rData = resumeDataFromJsonObj(obj)

                  // Apply section visibility from config.sections
                  const sectionsCfg = obj?.config?.sections as
                    | Partial<{
                        basics: boolean
                        work: boolean
                        education: boolean
                        projects: boolean
                        skills: boolean
                        certificates: boolean
                        awards: boolean
                        publications: boolean
                        volunteer: boolean
                        languages: boolean
                        interests: boolean
                        references: boolean
                      }>
                    | undefined

                  if (sectionsCfg) {
                    const apply = (arr: Array<any> | undefined, enabled: boolean) =>
                      (arr ?? []).map((x) => ({ ...x, enabled }))

                    rData = {
                      ...rData,
                      basics:
                        typeof sectionsCfg.basics === 'boolean'
                          ? { ...(rData.basics ?? {}), enabled: sectionsCfg.basics }
                          : rData.basics,
                      work:
                        typeof sectionsCfg.work === 'boolean'
                          ? (apply(rData.work as any[], sectionsCfg.work) as any)
                          : rData.work,
                      education:
                        typeof sectionsCfg.education === 'boolean'
                          ? (apply(rData.education as any[], sectionsCfg.education) as any)
                          : rData.education,
                      projects:
                        typeof sectionsCfg.projects === 'boolean'
                          ? (apply(rData.projects as any[], sectionsCfg.projects) as any)
                          : rData.projects,
                      skills:
                        typeof sectionsCfg.skills === 'boolean'
                          ? (apply(rData.skills as any[], sectionsCfg.skills) as any)
                          : rData.skills,
                      certificates:
                        typeof sectionsCfg.certificates === 'boolean'
                          ? (apply(rData.certificates as any[], sectionsCfg.certificates) as any)
                          : rData.certificates,
                      awards:
                        typeof sectionsCfg.awards === 'boolean'
                          ? (apply(rData.awards as any[], sectionsCfg.awards) as any)
                          : rData.awards,
                      publications:
                        typeof sectionsCfg.publications === 'boolean'
                          ? (apply(rData.publications as any[], sectionsCfg.publications) as any)
                          : rData.publications,
                      volunteer:
                        typeof sectionsCfg.volunteer === 'boolean'
                          ? (apply(rData.volunteer as any[], sectionsCfg.volunteer) as any)
                          : rData.volunteer,
                      languages:
                        typeof sectionsCfg.languages === 'boolean'
                          ? (apply(rData.languages as any[], sectionsCfg.languages) as any)
                          : rData.languages,
                      interests:
                        typeof sectionsCfg.interests === 'boolean'
                          ? (apply(rData.interests as any[], sectionsCfg.interests) as any)
                          : rData.interests,
                      references:
                        typeof sectionsCfg.references === 'boolean'
                          ? (apply(rData.references as any[], sectionsCfg.references) as any)
                          : rData.references,
                    }
                  }

                  setResumeData(rData)

                  // Apply theme from config.theme
                  const themeCfg = obj?.config?.theme as
                    | { kind: 'url'; url?: string }
                    | { kind: 'inline'; html?: string }
                    | { kind: 'local'; id?: string }
                    | undefined

                  if (themeCfg && typeof themeCfg === 'object') {
                    if (themeCfg.kind === 'url' && typeof (themeCfg as any).url === 'string') {
                      setSelectedTheme({ kind: 'url', url: (themeCfg as any).url })
                    } else if (
                      themeCfg.kind === 'inline' &&
                      typeof (themeCfg as any).html === 'string'
                    ) {
                      setSelectedTheme({ kind: 'inline', html: (themeCfg as any).html })
                    } else if (themeCfg.kind === 'local' && typeof (themeCfg as any).id === 'string') {
                      // Minimal local mapping example: 'Minimal Local' -> inline theme
                      if ((themeCfg as any).id === 'Minimal Local') {
                        setSelectedTheme({ kind: 'inline', html: inlineThemes.minimal.html })
                      }
                    }
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="h-full bg-surface-strong rounded-xl border border-border shadow-sm p-4 overflow-auto">
          <GistTemplate
            resumeData={filterByEnabled(resumeData)}
            gistUrl={
              selectedTheme.kind === 'url' ? selectedTheme.url : undefined
            }
            inlineHtml={
              selectedTheme.kind === 'inline' ? selectedTheme.html : undefined
            }
          />
        </section>
      </div>
    </div>
  )
}

function filterByEnabled(data: ResumeData): ResumeData {
  return {
    ...data,
    basics: data.basics?.enabled === false ? undefined : data.basics,
    work: (data.work ?? []).filter((w) => w.enabled !== false),
    education: (data.education ?? []).filter((e) => e.enabled !== false),
    projects: (data.projects ?? []).filter((p) => p.enabled !== false),
    skills: (data.skills ?? []).filter((s) => s.enabled !== false),
    certificates: (data.certificates ?? []).filter((c) => c.enabled !== false),
    awards: (data.awards ?? []).filter((a) => a.enabled !== false),
    publications: (data.publications ?? []).filter((p) => p.enabled !== false),
    volunteer: (data.volunteer ?? []).filter((v) => v.enabled !== false),
    languages: (data.languages ?? []).filter((l) => l.enabled !== false),
    interests: (data.interests ?? []).filter((i) => i.enabled !== false),
    references: (data.references ?? []).filter((r) => r.enabled !== false),
  }
}
