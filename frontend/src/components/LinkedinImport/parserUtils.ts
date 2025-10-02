import Papa from 'papaparse'
import JSZip from 'jszip'

/**
 * LinkedIn CSV/ZIP Parser Utilities
 * ==================================
 *
 * This module handles the low-level parsing of LinkedIn export files (CSV/ZIP)
 * and provides data normalization utilities. It's designed to be framework-agnostic
 * and can be used independently of the React UI components.
 *
 * Key responsibilities:
 * - Parse individual CSV files using Papa Parse
 * - Extract and parse CSV files from ZIP archives
 * - Normalize CSV headers for consistent data access
 * - Map LinkedIn CSV filenames to logical collection names
 * - Merge multiple data collections
 * - Build unified JSON structure from parsed collections
 *
 * Dependencies: papaparse, jszip
 *
 */

/**
 * Normalizes CSV header strings for consistent data access
 *
 * LinkedIn exports often have inconsistent header formatting (spaces, special chars, BOM)
 * This function standardizes headers to snake_case format for reliable property access
 *
 * @param h - Raw header string from CSV
 * @returns Normalized header in snake_case format
 *
 * @example
 * normalizeHeader('First Name') // returns 'first_name'
 * normalizeHeader('Email Address') // returns 'email_address'
 * normalizeHeader('\uFEFFCompany Name') // returns 'company_name' (removes BOM)
 */
export function normalizeHeader(h: string): string {
  return h
    .replaceAll('\uFEFF', '') // strip BOM if present
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^a-z0-9_]/g, '')
}

/**
 * Papa Parse configuration object for consistent CSV parsing
 *
 * This configuration ensures all CSV files are parsed with the same settings:
 * - Headers are automatically detected and normalized
 * - Dynamic typing converts strings to appropriate types (numbers, booleans)
 * - Empty lines are skipped to avoid parsing issues
 * - Headers are transformed using our normalization function
 */
export const PAPA_CFG: Papa.ParseConfig = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: normalizeHeader,
}

/**
 * Maps LinkedIn CSV filenames to logical collection keys
 *
 * LinkedIn exports use various naming conventions for their CSV files.
 * This heuristic function maps these filenames to consistent collection names
 * that our application can work with reliably.
 *
 * The mapping is based on common LinkedIn export patterns and handles:
 * - Multiple variations of the same data type (e.g., "position" vs "experience")
 * - Special cases like recommendations (only received, not given)
 * - Fallback to snake_case conversion for unknown files
 *
 * @param name - CSV filename (case-insensitive)
 * @returns Collection key for organizing the parsed data
 *
 * @example
 * mapCsvNameToCollection('Positions.csv') // returns 'positions'
 * mapCsvNameToCollection('Education.csv') // returns 'education'
 * mapCsvNameToCollection('Recommendations_Received.csv') // returns 'recommendations'
 */
export function mapCsvNameToCollection(name: string) {
  const n = name.toLowerCase()
  if (n.includes('position')) return 'positions'
  if (n.includes('experience')) return 'positions'
  if (n.includes('education')) return 'education'
  if (n.includes('skill')) return 'skills'
  if (n.includes('language')) return 'languages'
  if (n.includes('certification')) return 'certifications'
  if (n.includes('project')) return 'projects'
  if (n.includes('course')) return 'courses'
  if (n.includes('accomplishment')) return 'accomplishments'
  // Only include received recommendations, not given ones
  if (n.includes('recommendation') && n.includes('received'))
    return 'recommendations'
  if (n.includes('profile')) return 'profile'
  // fallback: use base name without .csv, snake_cased
  return n.replace(/\.csv$/i, '').replace(/[^a-z0-9]+/g, '_')
}

/**
 * Parses a single CSV file into an array of objects
 *
 * This function handles the asynchronous parsing of CSV files using Papa Parse.
 * It includes error handling and logging for debugging purposes.
 *
 * @param file - File object containing CSV data
 * @returns Promise resolving to array of parsed objects
 * @throws Error if parsing fails
 *
 * @example
 * const csvData = await parseCsvFile(csvFile)
 * console.log(csvData[0]) // First row as object
 */
export async function parseCsvFile(file: File) {
  const text = await file.text()
  return new Promise<Array<any>>((resolve, reject) => {
    Papa.parse(text, {
      ...PAPA_CFG,
      complete: (res) => {
        if (res.errors && res.errors.length) {
          console.warn('CSV parse errors:', res.errors)
        }
        resolve(res.data)
      },
      error: (err: unknown) => reject(err as Error),
    })
  })
}

/**
 * Extracts and parses all CSV files from a ZIP archive
 *
 * LinkedIn exports are typically provided as ZIP files containing multiple CSV files.
 * This function recursively processes all CSV files in the ZIP and organizes them
 * into collections based on their filenames.
 *
 * The function:
 * - Extracts the ZIP file using JSZip
 * - Iterates through all files in the archive
 * - Filters for CSV files only
 * - Parses each CSV using our standard configuration
 * - Maps filenames to collection keys
 * - Combines data from multiple files with the same collection key
 *
 * @param file - ZIP file containing LinkedIn export data
 * @returns Promise resolving to collections object with parsed data
 * @throws Error if ZIP extraction or CSV parsing fails
 *
 * @example
 * const collections = await parseZip(zipFile)
 * console.log(collections.positions) // Array of position objects
 * console.log(collections.education) // Array of education objects
 */
export async function parseZip(file: File) {
  const zip = await JSZip.loadAsync(file)
  const out: Record<string, Array<any>> = {}

  for (const relPath of Object.keys(zip.files)) {
    if (!relPath.toLowerCase().endsWith('.csv')) continue
    const entry = zip.files[relPath]
    if (!entry) continue
    const csvText = await entry.async('text')
    const data = await new Promise<Array<any>>((resolve, reject) => {
      Papa.parse(csvText, {
        ...PAPA_CFG,
        complete: (res) => resolve(res.data),
        error: (err: unknown) => reject(err as Error),
      })
    })
    const key = mapCsvNameToCollection(relPath.split('/').pop() || relPath)
    out[key] = (out[key] || []).concat(data)
  }
  return out
}

/**
 * Merges two collection maps into a single collection
 *
 * When processing multiple files (e.g., multiple CSV uploads or ZIP + CSV),
 * this function combines the data from different sources while preserving
 * all entries from both collections.
 *
 * @param a - First collection map
 * @param b - Second collection map to merge
 * @returns New collection map containing merged data
 *
 * @example
 * const merged = mergeCollections(existingData, newData)
 * // merged.positions contains positions from both collections
 */
export function mergeCollections(
  a: Record<string, Array<any>>,
  b: Record<string, Array<any>>,
) {
  const out: Record<string, Array<any>> = { ...a }
  for (const [k, v] of Object.entries(b)) {
    out[k] = (out[k] || []).concat(v)
  }
  return out
}

/**
 * Builds a unified JSON structure from parsed collections
 *
 * This function transforms the raw parsed collections into a structured
 * format that's easier to work with downstream. It includes:
 * - Metadata about the export
 * - Normalized data structures for each data type
 * - Special handling for skills (extracts skill names)
 * - Preservation of raw data for debugging
 *
 * The unified structure serves as an intermediate format between
 * raw LinkedIn data and the final ResumeData format.
 *
 * @param collections - Parsed collections from CSV/ZIP files
 * @returns Unified JSON object with structured data
 *
 * @example
 * const unified = buildUnifiedJson(collections)
 * console.log(unified.meta.source) // 'linkedin-export'
 * console.log(unified.positions.length) // Number of positions
 */
export function buildUnifiedJson(collections: Record<string, Array<any>>) {
  const unified = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'linkedin-export',
    },
    profile: collections.profile?.[0] || {},
    positions: collections.positions || [],
    education: collections.education || [],
    skills: (collections.skills || []).map(
      (row: any) => row.skill_name || row.name || row.skill || row,
    ),
    languages: collections.languages || [],
    certifications: collections.certifications || [],
    projects: collections.projects || [],
    courses: collections.courses || [],
    accomplishments: collections.accomplishments || [],
    recommendations: collections.recommendations || [],
    // Keep the originals in case you need exact fields later
    raw: collections,
  }
  return unified
}
