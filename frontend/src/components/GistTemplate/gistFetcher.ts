/**
 * GitHub Gist Fetcher Utility
 *
 * This module handles fetching raw content from GitHub Gists for use as resume templates.
 * It supports both regular Gist URLs and direct raw content URLs.
 *
 * Supported URL formats:
 * - https://gist.github.com/username/gistId
 * - https://gist.github.com/username/gistId#file-filename
 * - https://gist.githubusercontent.com/username/gistId/raw/filename
 */

export interface GistInfo {
  username: string
  gistId: string
  filename?: string
}

export interface GistFetchResult {
  success: boolean
  content?: string
  error?: string
  url?: string
}

/**
 * Parses a GitHub Gist URL to extract username, gist ID, and optional filename
 */
export function parseGistUrl(url: string): GistInfo | null {
  try {
    const urlObj = new URL(url)

    // Handle gist.github.com URLs
    if (urlObj.hostname === 'gist.github.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean)

      if (pathParts.length >= 2) {
        const username = pathParts[0]
        const gistId = pathParts[1]

        // Check for filename in hash fragment
        let filename: string | undefined
        if (urlObj.hash && urlObj.hash.startsWith('#file-')) {
          filename = urlObj.hash.substring(6) // Remove '#file-' prefix
          // Only replace dashes with dots if filename doesn't contain a dot (likely no extension)
          // This handles both cases: files with extensions (keep dashes) and files without (replace dashes)
          if (!filename.includes('.')) {
            filename = filename.replace(/-/g, '.')
          }
        }

        return { username, gistId, filename }
      }
    }

    // Handle gist.githubusercontent.com URLs (raw content)
    if (urlObj.hostname === 'gist.githubusercontent.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean)

      if (pathParts.length >= 4) {
        const username = pathParts[0]
        const gistId = pathParts[1]
        // pathParts[2] is usually 'raw'
        const filename = pathParts[3]

        return { username, gistId, filename }
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing Gist URL:', error)
    return null
  }
}

/**
 * Converts a regular Gist URL to a raw content URL
 */
export function buildRawGistUrl(gistInfo: GistInfo, filename?: string): string {
  const { username, gistId } = gistInfo
  const targetFilename = filename || gistInfo.filename

  if (targetFilename) {
    return `https://gist.githubusercontent.com/${username}/${gistId}/raw/${targetFilename}`
  } else {
    // If no specific filename, we'll need to fetch the gist metadata first
    // For now, we'll try a common pattern
    return `https://gist.githubusercontent.com/${username}/${gistId}/raw/`
  }
}

/**
 * Fetches the list of files in a Gist using GitHub API
 */
export async function fetchGistFiles(
  gistInfo: GistInfo,
): Promise<Array<string>> {
  try {
    const response = await fetch(
      `https://api.github.com/gists/${gistInfo.gistId}`,
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const gistData = await response.json()
    return Object.keys(gistData.files || {})
  } catch (error) {
    console.error('Error fetching Gist files:', error)
    return []
  }
}

/**
 * Fetches raw content from a GitHub Gist
 * Handles different URL formats and attempts to find the correct file
 */
export async function fetchGistContent(
  url: string,
  specificFilename?: string,
): Promise<GistFetchResult> {
  try {
    const gistInfo = parseGistUrl(url)

    if (!gistInfo) {
      return {
        success: false,
        error: 'Invalid GitHub Gist URL format',
      }
    }

    // Determine which filename to use
    let targetFilename = specificFilename || gistInfo.filename

    // If no filename specified, try to get the list of files
    if (!targetFilename) {
      const files = await fetchGistFiles(gistInfo)

      if (files.length === 0) {
        return {
          success: false,
          error: 'No files found in the Gist',
        }
      }

      // Look for common template file extensions
      const templateFile = files.find(
        (file) =>
          file.endsWith('.html') ||
          file.endsWith('.html.custom') ||
          file.endsWith('.template'),
      )

      targetFilename = templateFile || files[0] // Use first file as fallback
    }

    // Build the raw URL
    const rawUrl = buildRawGistUrl(gistInfo, targetFilename)

    // Fetch the raw content
    const response = await fetch(rawUrl)

    // If fetch failed and we have a parsed filename (might be wrong), try fetching file list
    if (!response.ok && targetFilename && gistInfo.filename) {
      const files = await fetchGistFiles(gistInfo)
      
      if (files.length > 0) {
        // Try to find a file that matches the base name (without extension)
        const baseName = targetFilename.split('.')[0].replace(/\./g, '-')
        const matchingFile = files.find(
          (file) =>
            file === targetFilename ||
            file.startsWith(baseName) ||
            file.replace(/\./g, '-').startsWith(baseName.replace(/\./g, '-'))
        )
        
        if (matchingFile) {
          // Retry with the correct filename
          const correctedUrl = buildRawGistUrl(gistInfo, matchingFile)
          const retryResponse = await fetch(correctedUrl)
          
          if (retryResponse.ok) {
            const content = await retryResponse.text()
            return {
              success: true,
              content,
              url: correctedUrl,
            }
          }
        }
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch Gist content: ${response.status} ${response.statusText}`,
        url: rawUrl,
      }
    }

    const content = await response.text()

    return {
      success: true,
      content,
      url: rawUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Validates that the fetched content appears to be a valid HTML template
 */
export function validateTemplate(content: string): {
  isValid: boolean
  error?: string
} {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Template content is empty' }
  }

  // Check for basic HTML structure
  if (!content.includes('<html') && !content.includes('<HTML')) {
    return {
      isValid: false,
      error: 'Content does not appear to be an HTML template',
    }
  }

  // Check for template placeholders (basic validation)
  const hasPlaceholders =
    />>\[[^\]]+\]<</.test(content) || /\[\[#(if|each|join)/.test(content)

  if (!hasPlaceholders) {
    console.warn(
      'Template does not contain expected placeholder syntax - it may be a static HTML file',
    )
  }

  return { isValid: true }
}

/**
 * Convenience function to fetch and validate a Gist template in one call
 */
export async function fetchAndValidateGistTemplate(
  url: string,
  filename?: string,
): Promise<GistFetchResult & { isValid?: boolean }> {
  const result = await fetchGistContent(url, filename)

  if (result.success && result.content) {
    const validation = validateTemplate(result.content)

    if (!validation.isValid) {
      return {
        ...result,
        success: false,
        error: validation.error,
        isValid: false,
      }
    }

    return {
      ...result,
      isValid: true,
    }
  }

  return result
}
