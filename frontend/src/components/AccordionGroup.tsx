import Basic from './accordionComponents/Basic'
import Volunteering from './accordionComponents/Volunteering'
import Education from './accordionComponents/Education'
import Awards from './accordionComponents/Awards'
import type { ResumeData } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

function AccordionGroup({ resumeData, setResumeData }: Props) {
  const items: Array<{ title: string; content: React.ReactNode }> = [
    {
      title: 'Basics',
      content: <Basic resumeData={resumeData} setResumeData={setResumeData} />,
    },

    {
      title: 'Volunteering',
      content: (
        <Volunteering resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Education',
      content: (
        <Education resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Awards',
      content: <Awards resumeData={resumeData} setResumeData={setResumeData} />,
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
