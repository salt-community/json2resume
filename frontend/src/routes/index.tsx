import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { Basics, ResumeData } from '@/types'
import AccordionGroup from '@/components/AccordionGroup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fakeResumeData } from '@/data/resumeData'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(fakeResumeData)

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
          <TabsContent value="json">Display json editor here</TabsContent>
        </Tabs>
      </section>
    </div>
  )
}