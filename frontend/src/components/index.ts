// Resume components
export { Resume } from './resume/Resume'
export { ResumePdfDocument } from './resume/ResumePdfDocument'
export { ResumePreview } from './resume/ResumePreview'

// Types and mock data
export type {
  ResumeData,
  Basics,
  Location,
  Profile,
  Work,
  Volunteer,
  Education,
  Award,
  Certificate,
  Publication,
  Skill,
  Language,
  Interest,
  Reference,
  Project,
} from './resume/ResumeTypes'
export { MOCK_RESUME_DATA } from './resume/ResumeTypes'

// Hooks
export { usePdfBlob } from './resume/hooks/usePdfBlob'

// Existing components
export { default as Header } from './Header'
