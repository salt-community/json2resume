/**
 * LinkedIn Importer Utilities
 * ============================
 *
 * This module contains utility functions that support the LinkedIn importer
 * functionality. These are browser-specific utilities for file operations
 * and user interactions.
 *
 * Key responsibilities:
 * - File download operations
 * - Browser-specific file handling
 * - UI interaction helpers
 *
 * These utilities are designed to be reusable across different parts
 * of the LinkedIn importer system.
 *
 */

/**
 * Downloads a Blob as a file from the browser
 *
 * This utility function creates a temporary download link for a Blob object
 * and triggers the download without requiring server interaction. It handles
 * the complete lifecycle of the download process including cleanup.
 *
 * The function:
 * 1. Creates a temporary object URL for the blob
 * 2. Creates a temporary anchor element with download attributes
 * 3. Programmatically clicks the link to trigger download
 * 4. Cleans up the temporary elements and URL
 *
 * @param blob - The Blob object to download
 * @param filename - The desired filename for the downloaded file
 *
 * @example
 * const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' })
 * downloadBlob(jsonBlob, 'linkedin_export.json')
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
