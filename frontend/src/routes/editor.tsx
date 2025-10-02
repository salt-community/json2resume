import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ResumeData } from '@/types'
import AccordionGroup from '@/components/AccordionGroup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockedResumeData } from '@/data/resumeDataMock.ts'
import JsonCodeEditor from '@/components/ResumeEditor/JsonCodeEditor.tsx'
import { jsonStringFromJsonObj } from '@/data/jsonStringFromJsonObj.ts'
import { jsonObjFromResumeData } from '@/data/jsonObjFromResumeData.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'
import jsonObjFromJsonString from '@/data/jsonObjFromJsonString.ts'
import { GistTemplate } from '@/components/GistTemplate'
import { loadResumeData } from '@/storage/resumeStorage'

// Theme selection can be a URL or inline HTML
type ThemeSource = { kind: 'url'; url: string } | { kind: 'inline'; html: string }

export const Route = createFileRoute('/editor')({
  component: App,
})

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => loadResumeData() ?? mockedResumeData)
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
    <div className="min-h-screen bg-surface-strong text-text-strong grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
      <section className="bg-surface rounded-xl border border-border shadow-sm p-4">
        <Tabs defaultValue="form">
          <TabsList className="w-full bg-surface rounded-lg border border-border">
            <TabsTrigger className="p-8 font-bold text-2xl text-text-strong" value="form">
              Form
            </TabsTrigger>
            <TabsTrigger className="p-8 font-bold text-2xl text-text-strong" value="json">
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
                const rData = resumeDataFromJsonObj(
                  jsonObjFromJsonString(jsonString),
                )
                setResumeData(rData)
              }}
            />
          </TabsContent>
        </Tabs>
      </section>
      <section className="bg-surface-strong rounded-xl border border-border shadow-sm p-4 overflow-auto">
        <GistTemplate
          gistUrl={selectedTheme.kind === 'url' ? selectedTheme.url : undefined}
          inlineHtml={selectedTheme.kind === 'inline' ? selectedTheme.html : undefined}
          resumeData={resumeData}
        />
      </section>
    </div>
  )
}
