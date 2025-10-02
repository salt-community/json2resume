import type { ResumeData } from '@/types'
import { getJSON, removeItem, setJSON } from '@/storage/storage.ts'
import jsonObjFromJsonString from '@/data/jsonObjFromJsonString'
import { resumeDataFromJsonObj } from '@/data/resumeDataFromJsonObj.ts'

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
  // setJSON safely stores even string values (it will JSON.stringify the string)
  return setJSON(RESUME_STORAGE_KEY, jsonString)
}

/**
 * Load resume data from localStorage by reading the JSON string,
 * parsing it into an object, and converting it into ResumeData.
 * Returns ResumeData or null if missing/invalid.
 */
export function loadResumeData(): ResumeData | null {
  const raw = getJSON<string>(RESUME_STORAGE_KEY)
  if (!raw) return null
  try {
    const obj = jsonObjFromJsonString(raw)
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
  const raw = getJSON<string>(RESUME_STORAGE_KEY)
  if (!raw) return null
  try {
    const obj = jsonObjFromJsonString(raw)
    const resumeData = resumeDataFromJsonObj(obj)
    const config = (obj)?.config
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
