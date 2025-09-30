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
import ResumeTranslator from './accordionComponents/ResumeTranslator'
import SectionHeaders from './accordionComponents/SectionHeaders'
import { LinkedinImporter } from './LinkedinImport'
import type { ResumeData } from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Themes from './accordionComponents/Themes'

type Props = {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  onThemeChange?: (themeUrl: string) => void
  onTranslationComplete?: (data: ResumeData) => void
  currentTheme?: string
}

function AccordionGroup({ resumeData, setResumeData, onThemeChange, onTranslationComplete, currentTheme }: Props) {
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
    },
    {
      title: 'LinkedIn Import',
      content: <LinkedinImporter onDataImported={setResumeData} />,
    },
    {
      title: 'Themes',
      content: <Themes onThemeChange={onThemeChange} currentTheme={currentTheme} />,
    },
    {
      title: 'Section Headers',
      content: <SectionHeaders resumeData={resumeData} setResumeData={setResumeData} />,
    },
  ]
  return (
    <Accordion type="single" collapsible>
      {items.map((item, index) => (
  
        <AccordionItem className={index === 12 ? 'mb-16' : ''} value={`item-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionGroup
