import type { ResumeData } from '@/types'
import { getJSON, removeItem, setJSON } from '@/storage/storage.ts'
import { resumeDataFromJsonObj } from '@/data/resumeDataConverter.ts'

/**
 * Namespaced key for persisted resume JSON.
 * Update the suffix to invalidate old cached data if needed (e.g., '.v2').
 */
export const RESUME_STORAGE_KEY = 'app.resumeJson.v1'

/**
 * Save resume JSON string to localStorage.
 * Returns true if saved successfully, false otherwise.
 */
export function saveResumeData(jsonString: string): boolean {
  // Parse the JSON string to an object, then store it
  // This avoids double-stringification
  try {
    const obj = JSON.parse(jsonString)
    return setJSON(RESUME_STORAGE_KEY, obj)
  } catch {
    // If parsing fails, store as string (fallback)
    return setJSON(RESUME_STORAGE_KEY, jsonString)
  }
}

/**
 * Load resume data from localStorage.
 * Returns ResumeData or null if missing/invalid.
 */
export function loadResumeData(): ResumeData | null {
  const obj = getJSON<any>(RESUME_STORAGE_KEY)
  if (!obj) return null
  try {
    return resumeDataFromJsonObj(obj)
  } catch {
    return null
  }
}

/**
 * Load both ResumeData and the raw config from localStorage.
 * Returns an object with resumeData and config (if present), or null if missing/invalid.
 */
export function loadResumeDataAndConfig():
  | { resumeData: ResumeData; config?: any }
  | null {
  const obj = getJSON<any>(RESUME_STORAGE_KEY)
  if (!obj) return null
  try {
    const resumeData = resumeDataFromJsonObj(obj)
    const config = obj?.config
    return { resumeData, config }
  } catch {
    return null
  }
}

/**
 * Clear resume data from localStorage.
 */
export function clearResumeData(): void {
  removeItem(RESUME_STORAGE_KEY)
}
