import type { ResumeData, DateConfig } from '@/types'

/**
 * Formats a date string based on the provided configuration.
 *
 * @param dateString - The input date string (YYYY-MM-DD or YYYY-MM or YYYY)
 * @param config - The date configuration (format and locale)
 * @returns The formatted date string
 */
export const formatDate = (dateString: string, config: DateConfig): string => {
    if (!dateString) return ''

    const { format, locale } = config
    const dateParts = dateString.split('-')
    const year = dateParts[0]
    const month = dateParts[1]
    const day = dateParts[2]

    if (format === 'Y') {
        return year
    }

    // Handle YYYY-MM formats (YM and YTextM)
    if (format === 'YM' || format === 'YTextM') {
        if (!month) return year // Fallback if no month provided

        if (format === 'YTextM') {
            const date = new Date(parseInt(year), parseInt(month) - 1)
            const monthName = date.toLocaleString(
                locale === 'se' ? 'sv-SE' : 'en-US',
                { month: 'long' },
            )
            // Capitalize first letter
            const capitalizedMonth =
                monthName.charAt(0).toUpperCase() + monthName.slice(1)

            if (locale === 'se') {
                // Swedish format: "Januari 2023" (Month Year) is common for resume
                return `${capitalizedMonth} ${year}`
            }
            return `${capitalizedMonth} ${year}`
        }

        // YM Format
        if (locale === 'se') {
            return `${year}-${month}`
        } else {
            return `${month}/${year}` // US style for EN
        }
    }

    // Handle YYYY-MM-DD format (YMD)
    if (format === 'YMD') {
        if (!month) return year
        if (!day) {
            // If day is missing but requested, fallback to YM logic
            return formatDate(dateString, { ...config, format: 'YM' })
        }

        if (locale === 'se') {
            return `${year}-${month}-${day}`
        } else {
            return `${month}-${day}-${year}`
        }
    }

    return dateString
}

/**
 * Creates a shallow copy of ResumeData with formatted dates for Education and Work sections.
 * This is used for the preview rendering.
 *
 * @param data - The original ResumeData
 * @returns Formatted ResumeData
 */
// Default config to match UI defaults
const DEFAULT_CONFIG: DateConfig = {
    format: 'YM',
    locale: 'en',
}

export const formatResumeData = (data: ResumeData): ResumeData => {
    const newData = { ...data }
    const educationConfig = newData.meta?.educationDateConfig || DEFAULT_CONFIG
    const workConfig = newData.meta?.workDateConfig || DEFAULT_CONFIG

    // Format Education
    if (newData.education) {
        newData.education = newData.education.map((edu) => ({
            ...edu,
            startDate: edu.startDate
                ? formatDate(edu.startDate, educationConfig)
                : edu.startDate,
            endDate: edu.isOngoing
                ? educationConfig.locale === 'se'
                    ? 'nu'
                    : 'present'
                : edu.endDate
                    ? formatDate(edu.endDate, educationConfig)
                    : edu.endDate,
        }))
    }

    // Format Work
    if (newData.work) {
        newData.work = newData.work.map((work) => ({
            ...work,
            startDate: work.startDate
                ? formatDate(work.startDate, workConfig)
                : work.startDate,
            endDate: work.isOngoing
                ? workConfig.locale === 'se'
                    ? 'nu'
                    : 'present'
                : work.endDate
                    ? formatDate(work.endDate, workConfig)
                    : work.endDate,
        }))
    }

    // Format Projects
    if (newData.projects) {
        const projectConfig = newData.meta?.projectDateConfig || DEFAULT_CONFIG
        newData.projects = newData.projects.map((project) => ({
            ...project,
            startDate: project.startDate
                ? formatDate(project.startDate, projectConfig)
                : project.startDate,
            endDate: project.isOngoing
                ? projectConfig.locale === 'se'
                    ? 'nu'
                    : 'present'
                : project.endDate
                    ? formatDate(project.endDate, projectConfig)
                    : project.endDate,
        }))
    }

    // Format Volunteer
    if (newData.volunteer) {
        const volunteerConfig = newData.meta?.volunteerDateConfig || DEFAULT_CONFIG
        newData.volunteer = newData.volunteer.map((vol) => ({
            ...vol,
            startDate: vol.startDate
                ? formatDate(vol.startDate, volunteerConfig)
                : vol.startDate,
            endDate: vol.isOngoing
                ? volunteerConfig.locale === 'se'
                    ? 'nu'
                    : 'present'
                : vol.endDate
                    ? formatDate(vol.endDate, volunteerConfig)
                    : vol.endDate,
        }))
    }

    // Format Awards
    if (newData.awards) {
        const awardsConfig = newData.meta?.awardsDateConfig || DEFAULT_CONFIG
        newData.awards = newData.awards.map((award) => ({
            ...award,
            date: award.date ? formatDate(award.date, awardsConfig) : award.date,
        }))
    }

    // Format Certificates
    if (newData.certificates) {
        const certificatesConfig =
            newData.meta?.certificatesDateConfig || DEFAULT_CONFIG
        newData.certificates = newData.certificates.map((cert) => ({
            ...cert,
            date: cert.date
                ? formatDate(cert.date, certificatesConfig)
                : cert.date,
        }))
    }

    // Format Publications
    if (newData.publications) {
        const publicationsConfig =
            newData.meta?.publicationsDateConfig || DEFAULT_CONFIG
        newData.publications = newData.publications.map((pub) => ({
            ...pub,
            releaseDate: pub.releaseDate
                ? formatDate(pub.releaseDate, publicationsConfig)
                : pub.releaseDate,
        }))
    }

    return newData
}
