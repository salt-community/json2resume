import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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
import { loadResumeData, loadResumeDataAndConfig, saveResumeData } from '@/storage/resumeStorage'
import { inlineThemes } from '@/data/localThemes'

// Theme selection can be a URL or inline HTML
type ThemeSource =
  | { kind: 'url'; url: string }
  | { kind: 'inline'; html: string }

export const Route = createFileRoute('/editor')({
  component: App,
})

function App() {
  const loaded = loadResumeDataAndConfig()
  const [resumeData, setResumeData] = useState<ResumeData>(() => loaded?.resumeData ?? mockedResumeData)
  const [selectedTheme, setSelectedTheme] = useState<ThemeSource>(() => {
    const themeCfg = loaded?.config?.theme as
      | { kind: 'url'; url?: string }
      | { kind: 'inline'; html?: string }
      | { kind: 'local'; id?: string }
      | undefined

    if (themeCfg && typeof themeCfg === 'object') {
      if (themeCfg.kind === 'url' && typeof (themeCfg as any).url === 'string') {
        return { kind: 'url', url: (themeCfg as any).url }
      } else if (
        themeCfg.kind === 'inline' &&
        typeof (themeCfg as any).html === 'string'
      ) {
        return { kind: 'inline', html: (themeCfg as any).html }
      } else if (themeCfg.kind === 'local' && typeof (themeCfg as any).id === 'string') {
        if ((themeCfg as any).id === 'Minimal Local') {
          return { kind: 'inline', html: inlineThemes.minimal.html }
        }
      }
    }

    // Fallback default
    return {
      kind: 'url',
      url: 'https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161',
    }
  })

  // Build config from current state (theme only)
  const baseJsonObj = jsonObjFromResumeData(resumeData)
  const themeConfig =
    selectedTheme.kind === 'url'
      ? { kind: 'url', url: selectedTheme.url }
      : { kind: 'inline', html: selectedTheme.html }

  const json = jsonStringFromJsonObj({
    ...baseJsonObj,
    config: {
      theme: themeConfig,
    },
  })

  // Persist JSON (including config) whenever it changes
  // This ensures checkbox and theme changes are reflected in storage
  useEffect(() => {
    saveResumeData(json)
  }, [json])

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
      <div className=" max-w-[1920px] text-text-strong grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 h-full overflow-hidden">
        <section className="h-full overflow-auto bg-surface rounded-xl border border-border shadow-sm p-4">
          <button
            className="p-4 w-full cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => setResumeData(defaultResumeData)}
          >
            Reset to Default
          </button>

          <Tabs defaultValue="form">
            <TabsList className="w-full bg-surface rounded-lg my-4 ">
              <TabsTrigger
                className="p-8 font-bold text-2xl text-text-strong "
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

                  // Enabled flags are already represented directly in the JSON;
                  // no need to derive from config. Apply the parsed data as-is.
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
          <div className="origin-top-left scale-[0.5] md:scale-100 w-[200%] h-[200%] md:w-auto md:h-auto">
            <GistTemplate
              resumeData={filterByEnabled(resumeData)}
              gistUrl={
                selectedTheme.kind === 'url' ? selectedTheme.url : undefined
              }
              inlineHtml={
                selectedTheme.kind === 'inline' ? selectedTheme.html : undefined
              }
            />
          </div>
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
