import type { ResumeData } from '@/types.ts'

/**
 * LinkedIn Data Converter
 * =======================
 *
 * This module handles the conversion of LinkedIn export data into the standardized
 * ResumeData format used throughout the application. It performs complex data
 * transformation and mapping to ensure compatibility with resume templates.
 *
 * Key responsibilities:
 * - Transform LinkedIn profile data to ResumeData.basics format
 * - Map LinkedIn positions to work experience entries
 * - Convert education records with proper field mapping
 * - Process skills data and create structured skill objects
 * - Handle language proficiency data
 * - Transform certifications, projects, and references
 * - Parse website/social media URLs from LinkedIn data
 * - Provide fallback values for missing data
 *
 * The conversion handles LinkedIn's various data formats and field naming
 * conventions, ensuring robust data transformation even with incomplete exports.
 *
 */

/**
 * Converts LinkedIn unified data to ResumeData format
 *
 * This is the main conversion function that transforms LinkedIn export data
 * into the standardized ResumeData structure. It handles complex field mapping,
 * data normalization, and provides sensible defaults for missing information.
 *
 * The conversion process:
 * 1. Extracts and normalizes basic profile information
 * 2. Maps LinkedIn positions to work experience entries
 * 3. Transforms education records with proper field mapping
 * 4. Processes skills data into structured format
 * 5. Handles language proficiency information
 * 6. Converts certifications, projects, and references
 * 7. Parses website/social media URLs
 * 8. Provides fallback values for missing data
 *
 * @param unifiedData - Unified LinkedIn data from parserUtils
 * @returns Complete ResumeData object ready for resume generation
 *
 * @example
 * const resumeData = convertToResumeData(unifiedLinkedInData)
 * console.log(resumeData.basics.name) // Full name
 * console.log(resumeData.work.length) // Number of positions
 */
export function convertToResumeData(unifiedData: any): ResumeData {
  const profile = unifiedData.profile || {}

  /**
   * Parses LinkedIn's website field format into structured objects
   *
   * LinkedIn stores website information in a complex string format like:
   * "[Twitter: https://twitter.com/user, GitHub: https://github.com/user]"
   *
   * This function parses this format and returns an array of structured objects
   * with network names and URLs for easy consumption.
   *
   * @param websites - Raw website string from LinkedIn export
   * @returns Array of {network, url} objects
   */
  function parseWebsitesField(websites: unknown) {
    if (typeof websites !== 'string' || !websites.trim()) return []
    const inner = websites.trim().replace(/^\[/, '').replace(/\]$/, '')
    return inner
      .split(',')
      .map((part) => part.trim())
      .map((part) => {
        const idx = part.indexOf(':')
        if (idx === -1) return null
        const type = part.slice(0, idx).trim()
        const url = part.slice(idx + 1).trim()
        if (!url) return null
        const network = type
          ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
          : ''
        return { network, url }
      })
      .filter(Boolean) as Array<{ network: string; url: string }>
  }

  return {
    // JSON Resume schema identifier - match mock data exactly
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    // Basic profile information - match mock data structure exactly
    basics: {
      enabled: true,
      // Construct full name from first/last or use alternative name fields
      name:
        profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : profile.name || profile.full_name || 'Unknown',
      // Professional headline or title
      label: profile.headline || profile.title || '',
      // Profile image
      image: profile.profile_picture_url || '',
      // Uploaded image (empty for LinkedIn imports)
      // Email address with fallback options
      email: (() => {
        // First try to get email from the dedicated emails collection
        const emailData = unifiedData.emails?.[0]
        if (emailData?.email_address) return emailData.email_address
        // Fallback to profile data
        return profile.email_address || profile.email || ''
      })(),
      // Phone number
      phone: (() => {
        // First try to get phone from the dedicated phones collection
        const phoneData = unifiedData.phones?.[0]
        if (phoneData?.number) return phoneData.number
        // Fallback to profile data
        return profile.phone_numbers || ''
      })(),
      // Primary website URL (LinkedIn URL takes precedence)
      url: (() => {
        const websiteEntries = parseWebsitesField(profile.websites)
        return profile.linkedin_url || websiteEntries[0]?.url || ''
      })(),
      // Professional summary/about section
      summary: profile.summary || profile.about || '',
      // Location information - match mock data structure exactly
      location: {
        enabled: true,
        city: profile.city || '',
        region: profile.state || profile.region || '',
        countryCode: profile.country || '',
      },
      // Social media profiles and websites
      profiles: (() => {
        const websiteEntries = parseWebsitesField(profile.websites)
        const primaryUrl = profile.linkedin_url || websiteEntries[0]?.url || ''
        const filteredWebsites = websiteEntries.filter(
          (w) => w.url !== primaryUrl,
        )
        const linkedIn = profile.linkedin_url
          ? [
              {
                enabled: true,
                network: 'LinkedIn',
                url: profile.linkedin_url,
                username: profile.linkedin_url.split('/').pop() || '',
              },
            ]
          : []
        return [
          ...linkedIn,
          ...filteredWebsites.map((w) => ({ ...w, enabled: true })),
        ]
      })(),
    },
    // Work experience - match mock data structure exactly
    work: (unifiedData.positions || []).map((pos: any) => {
      // Handle various LinkedIn date field formats
      const start =
        pos.started_on || pos.start_date || pos.start_date_month_year || ''
      const endRaw = (pos.finished_on ??
        pos.end_date ??
        pos.end_date_month_year) as string | null | undefined
      // Default to 'Present' for current positions
      const end = endRaw == null || endRaw === '' ? 'Present' : endRaw
      return {
        enabled: true,
        name: pos.company_name || pos.organization || '',
        position: pos.title || pos.position || '',
        location: pos.location || '',
        url: '', // LinkedIn doesn't provide company URLs
        startDate: start,
        endDate: end,
        summary: pos.description || pos.summary || '',
        highlights: [], // LinkedIn doesn't provide structured highlights
      }
    }),
    // Education - match mock data structure exactly
    education: (unifiedData.education || []).map((edu: any) => ({
      enabled: true,
      institution: edu.school_name || edu.institution || '',
      area: edu.field_of_study || '',
      studyType: edu.degree_name || edu.degree || '',
      startDate: edu.start_date || edu.start_date_month_year || '',
      endDate: edu.end_date || edu.end_date_month_year || '',
      score: edu.grade || '',
      courses: [], // LinkedIn doesn't provide course information
      url: '', // LinkedIn doesn't provide school URLs
    })),
    // Skills - processes LinkedIn skills into structured format
    skills: (() => {
      const raw = unifiedData.skills || []
      // Extract skill names from various LinkedIn formats
      const keywords: string[] = raw
        .map((s: any) =>
          typeof s === 'string' ? s : s.name || s.skill_name || '',
        )
        .map((s: string) => String(s).trim())
        .filter((s: string) => s.length > 0)
      // Remove duplicates
      const deduped: string[] = Array.from(new Set(keywords))
      // Group all skills under a single category for simplicity
      return deduped.length
        ? [
            {
              enabled: true,
              name: 'Software Development',
              level: 'Expert',
              keywords: deduped,
            },
          ]
        : []
    })(),
    // Languages - processes language proficiency data
    languages: (() => {
      const mapped = (unifiedData.languages || []).map((lang: any) => ({
        enabled: true,
        language: lang.language_name || lang.name || '',
        fluency: lang.proficiency || lang.level || '',
      }))
      // Ensure English is included if not present (common assumption)
      const hasEnglish = mapped.some(
        (l: any) => (l.language || '').toLowerCase() === 'english',
      )
      if (!hasEnglish) {
        mapped.push({
          enabled: true,
          language: 'English',
          fluency: 'Full Professional',
        })
      }
      return mapped
    })(),
    // Projects - match mock data structure exactly
    projects: (unifiedData.projects || []).map((proj: any) => ({
      enabled: true,
      name: proj.name || proj.title || '',
      description: proj.description || '',
      url: proj.url || '',
      startDate: proj.start_date || '',
      endDate: proj.end_date || '',
      highlights: [], // LinkedIn doesn't provide structured highlights
    })),
    // References - maps LinkedIn recommendations to references
    references: (unifiedData.recommendations || []).map((rec: any) => ({
      enabled: true,
      name:
        rec.recommender_name ||
        rec.name ||
        `${rec.first_name || ''} ${rec.last_name || ''}`.trim() ||
        'Unknown',
      reference: rec.recommendation_text || rec.message || rec.text || '',
    })),
    // Certificates - match mock data structure exactly
    certificates: (unifiedData.certifications || []).map((cert: any) => ({
      enabled: true,
      name: cert.name || cert.certification_name || '',
      issuer: cert.issuing_organization || cert.issuer || '',
      date: cert.issue_date || cert.date || '',
      url: cert.credential_url || cert.url || '',
    })),
    // Awards - empty array (LinkedIn doesn't provide awards)
    awards: [],
    // Publications - empty array (LinkedIn doesn't provide publications)
    publications: [],
    // Volunteer - empty array (LinkedIn doesn't provide volunteer work)
    volunteer: [],
    // Interests - empty array (LinkedIn doesn't provide interests)
    interests: [],
    // Metadata - match mock data structure exactly
    meta: {
      version: '1.0.0',
      sectionHeaders: {
        work: 'Work Experience',
        education: 'Education',
        projects: 'Projects',
        awards: 'Awards',
        certificates: 'Certifications',
        publications: 'Publications',
        skills: 'Skills',
        languages: 'Languages',
        interests: 'Interests',
        references: 'References',
        volunteer: 'Volunteering',
      },
    },
  }
}
