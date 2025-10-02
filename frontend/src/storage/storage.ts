/**
 * Simple JSON-based localStorage helpers with browser-safety checks.
 */

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * Save a JSON-serializable value to localStorage under a key.
 * Returns true if saved successfully, false otherwise.
 */
export function setJSON(key: string, value: unknown): boolean {
  if (!isBrowser()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn('[storage] Failed to setJSON for key:', key, err)
    return false
  }
}

/**
 * Retrieve and parse a JSON value from localStorage.
 * Returns the parsed value or null if missing or invalid.
 */
export function getJSON<T>(key: string): T | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return null
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn('[storage] Failed to getJSON for key:', key, err)
    return null
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeItem(key: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch (err) {
    console.warn('[storage] Failed to removeItem for key:', key, err)
  }
}
