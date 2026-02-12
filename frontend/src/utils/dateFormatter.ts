import type { ResumeData, GlobalDateConfig, SectionDateConfig } from '@/types'

/**
 * Formats a date string based on the provided configuration.
 *
 * @param dateString - The input date string (YYYY-MM-DD or YYYY-MM or YYYY)
 * @param sectionConfig - The section date configuration (format)
 * @param globalConfig - The global date configuration (locale)
 * @returns The formatted date string
 */
export const formatDate = (
    dateString: string,
    sectionConfig: SectionDateConfig,
    globalConfig: GlobalDateConfig
): string => {
    if (!dateString) return ''

    const { format } = sectionConfig
    const { locale } = globalConfig
    const dateParts = dateString.split('-')
    const year = dateParts[0]
    const month = dateParts[1]
    const day = dateParts[2]

    if (format === 'Y') {
        return year
    }

    // Handle YYYY-MM formats (YM, YTextM, YTextShortM)
    if (format === 'YM' || format === 'YTextM' || format === 'YTextShortM') {
        if (!month) return year // Fallback if no month provided

        if (format === 'YTextM' || format === 'YTextShortM') {
            const date = new Date(parseInt(year), parseInt(month) - 1)
            const monthName = date.toLocaleString(
                locale === 'se' ? 'sv-SE' : 'en-US',
                format === 'YTextShortM' ? { month: 'short' } : { month: 'long' }
            )
            // Capitalize first letter of month for consistency
            const capitalizedMonth =
                monthName.charAt(0).toUpperCase() + monthName.slice(1)
            // Remove any trailing dot if present (common in some locales for abbreviations)
            let finalMonth = capitalizedMonth.replace('.', '')

            // If strict 3-letter format is requested (YTextShortM), truncate to 3 chars
            // This handles cases like Swedish 'juni'/'juli'/'mars' becoming 'Jun'/'Jul'/'Mar'
            if (format === 'YTextShortM') {
                finalMonth = finalMonth.substring(0, 3)
            }

            return `${finalMonth} ${year}`
        }

        // YM format (MM/YYYY or YYYY-MM)
        if (locale === 'se') {
            return `${year}-${month}`
        } else {
            return `${month}/${year}`
        }
    }

    // Handle YYYY-MM-DD format (YMD)
    if (format === 'YMD') {
        if (!month || !day) return year // Fallback

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
const DEFAULT_SECTION_CONFIG: SectionDateConfig = {
    format: 'YM',
}

const DEFAULT_GLOBAL_CONFIG: GlobalDateConfig = {
    locale: 'en',
}

export const formatResumeData = (data: ResumeData): ResumeData => {
    const newData = { ...data }
    const educationConfig = newData.meta?.educationDateConfig || DEFAULT_SECTION_CONFIG
    const workConfig = newData.meta?.workDateConfig || DEFAULT_SECTION_CONFIG
    const projectConfig = newData.meta?.projectDateConfig || DEFAULT_SECTION_CONFIG
    const volunteerConfig = newData.meta?.volunteerDateConfig || DEFAULT_SECTION_CONFIG
    const awardsConfig = newData.meta?.awardsDateConfig || DEFAULT_SECTION_CONFIG
    const certificatesConfig = newData.meta?.certificatesDateConfig || DEFAULT_SECTION_CONFIG
    const publicationsConfig = newData.meta?.publicationsDateConfig || DEFAULT_SECTION_CONFIG

    // Fallback if global config hasn't been initialized yet (though converter should handle it)
    const globalConfig = newData.meta?.globalDateConfig || DEFAULT_GLOBAL_CONFIG

    const formatDatesForSection = (
        items: any[] | undefined,
        config: SectionDateConfig
    ) => {
        if (!items) return items
        return items.map((item) => ({
            ...item,
            startDate: item.startDate
                ? formatDate(item.startDate, config, globalConfig)
                : item.startDate,
            endDate: item.isOngoing
                ? globalConfig.presentString ||
                (globalConfig.locale === 'se' ? 'nu' : 'present')
                : item.endDate
                    ? formatDate(item.endDate, config, globalConfig)
                    : item.endDate,
            date: item.date
                ? formatDate(item.date, config, globalConfig)
                : item.date,
            releaseDate: item.releaseDate
                ? formatDate(item.releaseDate, config, globalConfig)
                : item.releaseDate,
        }))
    }

    if (newData.education) {
        newData.education = formatDatesForSection(
            newData.education,
            educationConfig
        )
    }

    if (newData.work) {
        newData.work = formatDatesForSection(newData.work, workConfig)
    }

    if (newData.projects) {
        newData.projects = formatDatesForSection(newData.projects, projectConfig)
    }

    if (newData.volunteer) {
        newData.volunteer = formatDatesForSection(
            newData.volunteer,
            volunteerConfig
        )
    }

    if (newData.awards) {
        newData.awards = formatDatesForSection(newData.awards, awardsConfig)
    }

    if (newData.certificates) {
        newData.certificates = formatDatesForSection(
            newData.certificates,
            certificatesConfig
        )
    }

    if (newData.publications) {
        newData.publications = formatDatesForSection(
            newData.publications,
            publicationsConfig
        )
    }

    return newData
}
