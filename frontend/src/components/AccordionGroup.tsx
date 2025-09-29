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
import type { ResumeData } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import TranslateTo from './accordionComponents/TranslateTo'

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
      title: 'Work Experience',
      content: <Work resumeData={resumeData} setResumeData={setResumeData} />,
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
      content: (
        <Certifications resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Publications',
      content: (
        <Publications resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Skills',
      content: <Skills resumeData={resumeData} setResumeData={setResumeData} />,
    },
    {
      title: 'Languages',
      content: (
        <Languages resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Interests',
      content: (
        <Interests resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'References',
      content: (
        <References resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Projects',
      content: (
        <Projects resumeData={resumeData} setResumeData={setResumeData} />
      ),
    },
    {
      title: 'Export',
      content: <Export resumeData={resumeData} />,
    },

    {
      title: 'Translate to: ',
      content: <TranslateTo />,
    },

    {
      title: 'Theme:',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
  ]
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
  
        <AccordionItem className={index === 11 ? 'mb-16' : ''} value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
