// Utility functions for ResumeEditor data processing
import type { ResumeData } from '../resume/ResumeTypes'

type SectionSelection = { id: string; selected: boolean }
type LanguageSelection = { id: string; selected: boolean }

/**
 * Filters resume data based on selected sections
 */
export function filterResumeData(
  resumeData: ResumeData,
  selectedSections: SectionSelection[]
): ResumeData {
  const selectedSectionIds = new Set(
    selectedSections.filter(s => s.selected).map(s => s.id)
  )

  const filtered: ResumeData = {
    basics: resumeData.basics, // Always include basics
  }

  // Only include sections that are selected
  if (selectedSectionIds.has('work') && resumeData.work) {
    filtered.work = resumeData.work
  }
  if (selectedSectionIds.has('volunteer') && resumeData.volunteer) {
    filtered.volunteer = resumeData.volunteer
  }
  if (selectedSectionIds.has('education') && resumeData.education) {
    filtered.education = resumeData.education
  }
  if (selectedSectionIds.has('awards') && resumeData.awards) {
    filtered.awards = resumeData.awards
  }
  if (selectedSectionIds.has('certificates') && resumeData.certificates) {
    filtered.certificates = resumeData.certificates
  }
  if (selectedSectionIds.has('publications') && resumeData.publications) {
    filtered.publications = resumeData.publications
  }
  if (selectedSectionIds.has('skills') && resumeData.skills) {
    filtered.skills = resumeData.skills
  }
  if (selectedSectionIds.has('languages') && resumeData.languages) {
    filtered.languages = resumeData.languages
  }
  if (selectedSectionIds.has('interests') && resumeData.interests) {
    filtered.interests = resumeData.interests
  }
  if (selectedSectionIds.has('references') && resumeData.references) {
    filtered.references = resumeData.references
  }
  if (selectedSectionIds.has('projects') && resumeData.projects) {
    filtered.projects = resumeData.projects
  }
  if (selectedSectionIds.has('profiles') && resumeData.basics?.profiles) {
    // Profiles are part of basics, so we keep them if selected
    filtered.basics = {
      ...filtered.basics,
      profiles: resumeData.basics.profiles
    }
  }

  return filtered
}

/**
 * Mock translation function - simulates API call to translate resume data
 */
export async function mockTranslateResumeData(
  resumeData: ResumeData,
  selectedLanguage: LanguageSelection | null
): Promise<ResumeData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // For now, only implement Spanish translation as requested
  if (!selectedLanguage || selectedLanguage.id !== 'Spanish') {
    return resumeData // Return original if not Spanish
  }

  // Mock Spanish translations
  const spanishTranslations: Record<string, string> = {
    // Job titles and positions
    'Programmer': 'Programador',
    'President': 'Presidente',
    'Volunteer': 'Voluntario',
    
    // Section content
    'A summary of John Doe…': 'Un resumen de John Doe…',
    'Description…': 'Descripción…',
    'Started the company': 'Fundó la empresa',
    'Awarded \'Volunteer of the Month\'': 'Galardonado como \'Voluntario del Mes\'',
    'There is no spoon.': 'No hay cuchara.',
    'Reference…': 'Referencia…',
    'Description...': 'Descripción...',
    'Won award at AIHacks 2016': 'Ganó premio en AIHacks 2016',
    
    // Skills and languages
    'Web Development': 'Desarrollo Web',
    'React': 'React',
    'Node.js': 'Node.js',
    'Python': 'Python',
    'Docker': 'Docker',
    'Machine Learning': 'Aprendizaje Automático',
    
    // Education and institutions
    'University': 'Universidad',
    'Software Development': 'Desarrollo de Software',
    'Bachelor': 'Licenciatura',
    
    // Other
    'Company': 'Empresa',
    'Organization': 'Organización',
    'Certificate': 'Certificado',
    'Publication': 'Publicación',
    'Project': 'Proyecto',
    'Award': 'Premio',
    'Wildlife': 'Vida Silvestre'
  }

  function translateText(text: string): string {
    return spanishTranslations[text] || text
  }

  // Create translated version
  const translated: ResumeData = {
    basics: {
      ...resumeData.basics,
      label: resumeData.basics?.label ? translateText(resumeData.basics.label) : undefined,
      summary: resumeData.basics?.summary ? translateText(resumeData.basics.summary) : undefined,
    },
    work: resumeData.work?.map(job => ({
      ...job,
      position: job.position ? translateText(job.position) : undefined,
      summary: job.summary ? translateText(job.summary) : undefined,
      highlights: job.highlights?.map(h => translateText(h))
    })),
    volunteer: resumeData.volunteer?.map(vol => ({
      ...vol,
      position: vol.position ? translateText(vol.position) : undefined,
      summary: vol.summary ? translateText(vol.summary) : undefined,
      highlights: vol.highlights?.map(h => translateText(h))
    })),
    education: resumeData.education?.map(edu => ({
      ...edu,
      institution: edu.institution ? translateText(edu.institution) : undefined,
      area: edu.area ? translateText(edu.area) : undefined,
      studyType: edu.studyType ? translateText(edu.studyType) : undefined,
    })),
    awards: resumeData.awards?.map(award => ({
      ...award,
      title: award.title ? translateText(award.title) : undefined,
      awarder: award.awarder ? translateText(award.awarder) : undefined,
      summary: award.summary ? translateText(award.summary) : undefined,
    })),
    certificates: resumeData.certificates?.map(cert => ({
      ...cert,
      name: cert.name ? translateText(cert.name) : undefined,
      issuer: cert.issuer ? translateText(cert.issuer) : undefined,
    })),
    publications: resumeData.publications?.map(pub => ({
      ...pub,
      name: pub.name ? translateText(pub.name) : undefined,
      publisher: pub.publisher ? translateText(pub.publisher) : undefined,
      summary: pub.summary ? translateText(pub.summary) : undefined,
    })),
    skills: resumeData.skills?.map(skill => ({
      ...skill,
      name: skill.name ? translateText(skill.name) : undefined,
    })),
    languages: resumeData.languages, // Keep languages as-is
    interests: resumeData.interests?.map(interest => ({
      ...interest,
      name: interest.name ? translateText(interest.name) : undefined,
    })),
    references: resumeData.references?.map(ref => ({
      ...ref,
      reference: ref.reference ? translateText(ref.reference) : undefined,
    })),
    projects: resumeData.projects?.map(project => ({
      ...project,
      name: project.name ? translateText(project.name) : undefined,
      description: project.description ? translateText(project.description) : undefined,
      highlights: project.highlights?.map(h => translateText(h))
    })),
  }

  return translated
}

/**
 * Parse JSON string to ResumeData object
 */
export function parseResumeJson(jsonString: string): ResumeData | null {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed as ResumeData
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return null
  }
}
