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

export const Route = createFileRoute('/editor')({
  component: App,
})

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(mockedResumeData)
  const json = jsonStringFromJsonObj(jsonObjFromResumeData(resumeData))

  return (
    <div className="grid grid-cols-2 gap-8 p-16">
      <section>
        <Tabs defaultValue="form">
          <TabsList className="w-full">
            <TabsTrigger className="p-8 font-bold text-2xl" value="form">
              Form
            </TabsTrigger>
            <TabsTrigger className="p-8 font-bold text-2xl" value="json">
              Json
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <AccordionGroup
              resumeData={resumeData}
              setResumeData={setResumeData}
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
      <section className=" min-h-screen">
        <GistTemplate
          gistUrl="https://gist.github.com/david11267/b03fd23966945976472361c8e5d3e161"
          resumeData={resumeData}
        />
      </section>
    </div>
  )
}
