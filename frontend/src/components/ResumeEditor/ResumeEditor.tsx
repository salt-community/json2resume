import {useState} from "react";
import { filterResumeData, parseResumeJson } from './utils'
import type { ResumeData } from '@/components'
import SectionSelector from '@/components/ResumeEditor/SectionSelector.tsx'
import JsonArea from '@/components/ResumeEditor/JsonArea.tsx'
import TemplateSelector from '@/components/TemplateSelector.tsx'
import LanguageSelector from '@/components/ResumeEditor/LanguageSelector.tsx'
import { useTranslate } from "@/useTranslate";

interface ResumeEditorProps {
  onGenerate?: (resumeData: ResumeData) => void
}

export default function ResumeEditor({ onGenerate }: ResumeEditorProps) {
  const originalJson = `{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/54/World_champion_Daniel_St%C3%A5hl_2019.jpg",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "url": "https://johndoe.com",
    "summary": "A summary of John Doe…",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "https://twitter.com/john"
    }]
  },
  "work": [{
    "name": "Company",
    "position": "President",
    "url": "https://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description…",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "url": "https://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description…",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "url": "https://institution.com/",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "score": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "certificates": [{
    "name": "Certificate",
    "date": "2021-11-07",
    "issuer": "Company",
    "url": "https://certificate.com"
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "url": "https://publication.com",
    "summary": "Description…"
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }],
  "languages": [{
    "language": "English",
    "fluency": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference…"
  }],
  "projects": [{
    "name": "Project",
    "startDate": "2019-01-01",
    "endDate": "2021-01-01",
    "description": "Description...",
    "highlights": [
      "Won award at AIHacks 2016"
    ],
    "url": "https://project.com/"
  }]
}`
  const [json, setJson] = useState(originalJson)

  // Original list of sections
  const originalSections = [
    'basics',
    'profiles',
    'work',
    'volunteer',
    'education',
    'awards',
    'certificates',
    'publications',
    'skills',
    'languages',
    'interests',
    'references',
    'projects',
  ]

  // Sections state with selected status (default select key sections)
  const [sections, setSections] = useState<Array<{ id: string; selected: boolean }>>(
    () => originalSections.map((id) => ({ 
      id, 
      selected: ['basics', 'work', 'education', 'skills'].includes(id) 
    }))
  )

  // Templates state (default select the first)
  const originalTemplates = [
    'template-1'
  ]
  const [templates, setTemplates] = useState<Array<{ id: string; selected: boolean }>>(
    () => originalTemplates.map((id, idx) => ({ id, selected: idx === 0 }))
  )

  // Languages state (default select the first)
  const originalLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Portuguese',
    'Italian',
    'Russian',
    'Arabic',
    'Hindi',
    'Bengali',
    'Turkish',
    'Vietnamese',
    'Polish',
    'Dutch',
    'Swedish',
  ]
  const [languages, setLanguages] = useState<Array<{ id: string; selected: boolean }>>(
    () => originalLanguages.map((id, idx) => ({ id, selected: idx === 0 }))
  )

  // Generate button state
  const [isGenerating, setIsGenerating] = useState(false)
  const { mutateAsync: translate } = useTranslate()
  const handleGenerate = async () => {
    if (!onGenerate) return
    
    setIsGenerating(true);
    
    try {
      // 1. Parse JSON data
      const parsedData = parseResumeJson(json)
      if (!parsedData) {
        alert('Invalid JSON data. Please check your input.')
        return
      }

      // 2. Filter data based on selected sections
      const filteredData = filterResumeData(parsedData, sections)

      // 3. Get selected language
      const selectedLanguage = languages.find(lang => lang.selected)

      // 4. Translate the data using the API
      const translatedData = await translate({ 
        resumeData: filteredData,
        targetLanguage: selectedLanguage?.id || 'en' 
      })

      // 5. Pass the final data to the parent component
      onGenerate(translatedData)
      
    } catch (error) {
      console.error('Error generating resume:', error)
      alert('Error generating resume. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
          <SectionSelector sections={sections} setSections={setSections} />
        </div>
        <div className="col-span-12 md:col-span-7">
          <JsonArea jsonState={json} onChange={setJson} />
        </div>
        <div className="col-span-12 md:col-span-3">
          <TemplateSelector templates={templates} setTemplates={setTemplates} />
        </div>
      </div>
      
      <div className="mt-4">
        <LanguageSelector languages={languages} setLanguages={setLanguages} />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Resume...
            </span>
          ) : (
            'Generate Resume'
          )}
        </button>
      </div>
    </>
  )
}
