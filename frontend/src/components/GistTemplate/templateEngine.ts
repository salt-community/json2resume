/**
 * Mini Templating Engine for GitHub Gist Resume Templates
 *
 * This module implements a simple templating system that processes HTML templates
 * with placeholders and control structures, replacing them with data from a JSON Resume object.
 *
 * Template Syntax:
 * - Placeholders: >>[path.to.value]<< or >>[path.to.value|raw]<<
 * - Conditionals: [[#if path]] ... [[/if]] or [[#if !path]] ... [[/if]]
 * - Loops: [[#each path.to.array]] ... [[/each]]
 * - Join: [[#join path.to.array]]
 *
 * Processing Order (deterministic):
 * 1. Resolve all [[#each ...]] blocks (outermost to innermost, recursively)
 * 2. Resolve all [[#if ...]] blocks (outermost to innermost, recursively)
 * 3. Resolve all [[#join ...]] singletons
 * 4. Replace all >>[...]<< scalar placeholders
 */

// Type definition for the JSON Resume data structure
export interface ResumeData {
  basics?: {
    name?: string
    label?: string
    image?: string
    email?: string
    phone?: string
    url?: string
    summary?: string
    location?: {
      address?: string
      postalCode?: string
      city?: string
      countryCode?: string
      region?: string
    }
    profiles?: Array<{
      network?: string
      username?: string
      url?: string
    }>
  }
  work?: Array<{
    name?: string
    position?: string
    url?: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights?: string[]
  }>
  volunteer?: Array<{
    organization?: string
    position?: string
    url?: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights?: string[]
  }>
  education?: Array<{
    institution?: string
    url?: string
    area?: string
    studyType?: string
    startDate?: string
    endDate?: string
    score?: string
    courses?: string[]
  }>
  awards?: Array<{
    title?: string
    date?: string
    awarder?: string
    summary?: string
  }>
  certificates?: Array<{
    name?: string
    date?: string
    issuer?: string
    url?: string
  }>
  publications?: Array<{
    name?: string
    publisher?: string
    releaseDate?: string
    url?: string
    summary?: string
  }>
  skills?: Array<{
    name?: string
    level?: string
    keywords?: string[]
  }>
  languages?: Array<{
    language?: string
    fluency?: string
  }>
  interests?: Array<{
    name?: string
    keywords?: string[]
  }>
  references?: Array<{
    name?: string
    reference?: string
  }>
  projects?: Array<{
    name?: string
    startDate?: string
    endDate?: string
    description?: string
    highlights?: string[]
    url?: string
  }>
  [key: string]: any // Allow for additional fields
}

/**
 * HTML-escapes a string to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Safely gets a nested property from an object using dot notation
 * Supports array indexing like "arr[0].field"
 */
function getNestedProperty(obj: any, path: string): any {
  if (!path || path === '.') return obj

  // Handle array indexing syntax like "arr[0].field"
  const parts = path.split('.').flatMap((part) => {
    if (part.includes('[')) {
      const matches = part.match(/^([^[]+)\[(\d+)\](.*)$/)
      if (matches) {
        const [, arrayName, index, rest] = matches
        const result = [arrayName, index]
        if (rest) result.push(rest)
        return result
      }
    }
    return [part]
  })

  let current = obj
  for (const part of parts) {
    if (current == null) return undefined

    // Handle numeric indices for arrays
    if (/^\d+$/.test(part)) {
      current = current[parseInt(part, 10)]
    } else {
      current = current[part]
    }
  }

  return current
}

/**
 * Checks if a value is considered "truthy" according to template logic
 * null, undefined, "", false, 0, and empty arrays are falsy
 */
function isTruthy(value: any): boolean {
  if (value == null) return false
  if (value === false || value === 0 || value === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

/**
 * Processes [[#each path]] ... [[/each]] blocks
 * Recursively handles nested structures
 */
function processEachBlocks(
  template: string,
  data: ResumeData,
  currentContext: any = data,
): string {
  const eachRegex = /\[\[#each\s+([^\]]+)\]\]([\s\S]*?)\[\[\/each\]\]/g

  return template.replace(eachRegex, (match, path, content) => {
    const arrayData = getNestedProperty(currentContext, path)

    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      return '' // Empty array or not an array - render nothing
    }

    // Process each item in the array
    return arrayData
      .map((item) => {
        // Recursively process nested each/if blocks within this context
        let processedContent = processEachBlocks(content, data, item)
        processedContent = processIfBlocks(processedContent, data, item)
        return processedContent
      })
      .join('')
  })
}

/**
 * Processes [[#if path]] ... [[/if]] and [[#if !path]] ... [[/if]] blocks
 * Supports negation with !path syntax
 */
function processIfBlocks(
  template: string,
  data: ResumeData,
  currentContext: any = data,
): string {
  const ifRegex = /\[\[#if\s+(!?)([^\]]+)\]\]([\s\S]*?)\[\[\/if\]\]/g

  return template.replace(ifRegex, (match, negation, path, content) => {
    const value = getNestedProperty(currentContext, path)
    const isNegated = negation === '!'
    const shouldRender = isNegated ? !isTruthy(value) : isTruthy(value)

    if (shouldRender) {
      // Recursively process nested blocks within this context
      let processedContent = processEachBlocks(content, data, currentContext)
      processedContent = processIfBlocks(processedContent, data, currentContext)
      return processedContent
    }

    return '' // Condition not met - render nothing
  })
}

/**
 * Processes [[#join path.to.array]] statements
 * Replaces with comma-separated list of array items
 */
function processJoinStatements(
  template: string,
  data: ResumeData,
  currentContext: any = data,
): string {
  const joinRegex = /\[\[#join\s+([^\]]+)\]\]/g

  return template.replace(joinRegex, (match, path) => {
    const arrayData = getNestedProperty(currentContext, path)

    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      return '' // Empty array or not an array
    }

    // Join primitive values only
    return arrayData
      .filter(
        (item) =>
          typeof item === 'string' ||
          typeof item === 'number' ||
          typeof item === 'boolean',
      )
      .join(', ')
  })
}

/**
 * Processes >>[path]<< and >>[path|raw]<< placeholders
 * Applies HTML escaping unless |raw filter is specified
 */
function processPlaceholders(
  template: string,
  data: ResumeData,
  currentContext: any = data,
): string {
  const placeholderRegex = />>\[([^\]|]+)(\|raw)?\]<</g

  return template.replace(placeholderRegex, (match, path, rawFilter) => {
    const value = getNestedProperty(currentContext, path)

    if (value == null) return ''

    const stringValue = String(value)

    // Apply HTML escaping unless |raw filter is used
    return rawFilter ? stringValue : escapeHtml(stringValue)
  })
}

/**
 * Main template processing function
 * Processes template in the specified deterministic order:
 * 1. Each blocks (outermost to innermost, recursively)
 * 2. If blocks (outermost to innermost, recursively)
 * 3. Join statements
 * 4. Scalar placeholders
 */
export function processTemplate(template: string, data: ResumeData): string {
  let result = template

  // Step 1: Process all [[#each ...]] blocks
  result = processEachBlocks(result, data)

  // Step 2: Process all [[#if ...]] blocks
  result = processIfBlocks(result, data)

  // Step 3: Process all [[#join ...]] statements
  result = processJoinStatements(result, data)

  // Step 4: Process all >>[...]<< placeholders
  result = processPlaceholders(result, data)

  return result
}

/**
 * Sanitizes HTML template content before processing
 * Basic validation to ensure template structure is safe
 */
export function sanitizeTemplate(template: string): string {
  // Basic sanitization - remove potentially dangerous script tags
  // In a production environment, you might want more comprehensive sanitization
  return template.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  )
}
