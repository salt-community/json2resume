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
            endDate: edu.endDate
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
            endDate: work.endDate
                ? formatDate(work.endDate, workConfig)
                : work.endDate,
        }))
    }

    return newData
}
