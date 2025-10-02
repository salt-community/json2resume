import type { ResumeData } from '@/types'
import { getJSON, setJSON, removeItem } from '@/storage/storage.ts'

/**
 * Namespaced key for persisted resume data.
 * Update the suffix to invalidate old cached data if needed (e.g., '.v2').
 */
export const RESUME_STORAGE_KEY = 'app.resumeData.v1'

/**
 * Save resume data to localStorage.
 * Returns true if saved successfully, false otherwise.
 */
export function saveResumeData(data: ResumeData): boolean {
  return setJSON(RESUME_STORAGE_KEY, data)
}

/**
 * Load resume data from localStorage.
 * Returns ResumeData or null if missing/invalid.
 */
export function loadResumeData(): ResumeData | null {
  return getJSON<ResumeData>(RESUME_STORAGE_KEY)
}

/**
 * Clear resume data from localStorage.
 */
export function clearResumeData(): void {
  removeItem(RESUME_STORAGE_KEY)
}
