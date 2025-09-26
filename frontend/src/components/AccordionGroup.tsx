import { useState } from 'react'
import Basic from './accordionComponents/Basic'
import type {
  Award,
  Basics,
  Education,
  Interest,
  Language,
  Meta,
  Profile,
  Project,
  Publication,
  Reference,
  ResumeData,
  Skill,
  Volunteer,
  Work,
} from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fakeResumeData } from '@/data/resumeData'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function AccordionGroup({ resumeData, setResumeData }: Props) {
  const [basics, setBasics] = useState<Basics>(fakeResumeData.basics)
  const [work, setWork] = useState<Array<Work>>(fakeResumeData.work || [])
  const [volunteer, setVolunteer] = useState<Array<Volunteer>>(
    fakeResumeData.volunteer || [],
  )
  const [education, setEducation] = useState<Array<Education>>(
    fakeResumeData.education || [],
  )
  const [awards, setAwards] = useState<Array<Award>>(
    fakeResumeData.awards || [],
  )
  const [publications, setPublications] = useState<Array<Publication>>(
    fakeResumeData.publications || [],
  )
  const [skills, setSkills] = useState<Array<Skill>>(
    fakeResumeData.skills || [],
  )
  const [languages, setLanguages] = useState<Array<Language>>(
    fakeResumeData.languages || [],
  )
  const [interests, setInterests] = useState<Array<Interest>>(
    fakeResumeData.interests || [],
  )
  const [references, setReferences] = useState<Array<Reference>>(
    fakeResumeData.references || [],
  )
  const [projects, setProjects] = useState<Array<Project>>(
    fakeResumeData.projects || [],
  )
  const [meta, setMeta] = useState<Meta>(fakeResumeData.meta || {})

  const items: Array<{ title: string; content: React.ReactNode }> = [
    {
      title: 'Basics',
      content: <Basic basics={basics} setBasics={setBasics} />,
    },
    {
      title: 'Profiles',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Volunteering',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Education',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Awards',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Certifications',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Publications',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Skills',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Languages',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Interests',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'References',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
      title: 'Projects',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },

    {
      title: 'Translate to: ',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },

    {
      title: 'Theme:',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
  ]
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
        <AccordionItem value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
