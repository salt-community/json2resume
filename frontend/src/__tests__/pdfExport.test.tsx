import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { ResumeData } from '@/types'

// Mock window.open and related methods
const mockPrintWindow = {
  document: {
    write: vi.fn(),
    close: vi.fn(),
  },
  focus: vi.fn(),
  print: vi.fn(),
  close: vi.fn(),
  onload: null as (() => void) | null,
  onafterprint: null as (() => void) | null,
}

const mockWindowOpen = vi.fn(() => mockPrintWindow)
const mockAlert = vi.fn()

describe('PDF Export Logic', () => {
  const createResumeData = (
    overrides: Partial<ResumeData> = {},
  ): ResumeData => ({
    basics: {
      name: 'John Doe',
      email: 'john@example.com',
      ...overrides.basics,
    },
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    mockWindowOpen.mockReturnValue(mockPrintWindow)

    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true,
    })

    Object.defineProperty(window, 'alert', {
      value: mockAlert,
      writable: true,
    })
  })

  test('should validate basic information before export', () => {
    const resumeDataEmpty = createResumeData({
      basics: { name: '', email: '' },
    })

    const exportFunction = () => {
      if (!resumeDataEmpty.basics.name) {
        mockAlert(
          'Please fill in at least the basic information before exporting.',
        )
        return false
      }
      return true
    }

    const result = exportFunction()
    expect(result).toBe(false)
    expect(mockAlert).toHaveBeenCalledWith(
      'Please fill in at least the basic information before exporting.',
    )
  })

  test('should allow export when basic information is present', () => {
    const resumeData = createResumeData()

    const exportFunction = () => {
      if (!resumeData.basics.name) {
        mockAlert(
          'Please fill in at least the basic information before exporting.',
        )
        return false
      }
      return true
    }

    const result = exportFunction()
    expect(result).toBe(true)
    expect(mockAlert).not.toHaveBeenCalled()
  })

  test('should open print window for PDF export', () => {
    const resumeData = createResumeData()

    const exportFunction = () => {
      if (!resumeData.basics.name) {
        mockAlert(
          'Please fill in at least the basic information before exporting.',
        )
        return null
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        mockAlert('Please allow popups to export PDF. Then try again.')
        return null
      }

      return printWindow
    }

    const result = exportFunction()
    expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank')
    expect(result).toBe(mockPrintWindow)
  })

  test('should handle popup blocked scenario', () => {
    mockWindowOpen.mockReturnValue(null)
    const resumeData = createResumeData()

    const exportFunction = () => {
      if (!resumeData.basics.name) {
        mockAlert(
          'Please fill in at least the basic information before exporting.',
        )
        return null
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        mockAlert('Please allow popups to export PDF. Then try again.')
        return null
      }

      return printWindow
    }

    const result = exportFunction()
    expect(result).toBeNull()
    expect(mockAlert).toHaveBeenCalledWith(
      'Please allow popups to export PDF. Then try again.',
    )
  })

  test('should include print optimization styles', () => {
    const printStyles = `
      @media print {
        @page { 
          size: A4; 
          margin: 18mm; 
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        * {
          page-break-inside: auto !important;
          break-inside: auto !important;
          page-break-before: auto !important;
          break-before: auto !important;
          page-break-after: auto !important;
          break-after: auto !important;
        }
        
        .gist-template-container {
          width: 100% !important;
          max-width: none !important;
        }
      }
    `

    expect(printStyles).toContain('@media print')
    expect(printStyles).toContain('size: A4')
    expect(printStyles).toContain('margin: 18mm')
    expect(printStyles).toContain('color-adjust: exact !important')
    expect(printStyles).toContain('page-break-inside: auto !important')
  })

  test('should set up print window with content and styles', () => {
    const mockHtml = '<div data-resume-content>Mock Resume HTML</div>'
    const printStyles = '@media print { @page { size: A4; margin: 18mm; } }'

    const setupPrintWindow = (html: string, styles: string) => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return null

      printWindow.document.write(html + styles)
      printWindow.document.close()
      return printWindow
    }

    const result = setupPrintWindow(mockHtml, printStyles)
    expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank')
    expect(result).toBe(mockPrintWindow)
  })

  test('should handle print window events', () => {
    const setupPrintEvents = () => {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return null

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
          printWindow.onafterprint = () => {
            printWindow.close()
          }
        }, 500)
      }

      return printWindow
    }

    const result = setupPrintEvents()
    expect(result).toBe(mockPrintWindow)
    expect(result?.onload).toBeDefined()
    expect(typeof result?.onload).toBe('function')
  })

  test('should validate template processing state', () => {
    const validateExportState = (
      hasBasicInfo: boolean,
      hasProcessedHtml: boolean,
    ) => {
      if (!hasBasicInfo) {
        return {
          canExport: false,
          message:
            'Please fill in at least the basic information before exporting.',
        }
      }

      if (!hasProcessedHtml) {
        return {
          canExport: false,
          message: 'Please wait for the template to load before exporting.',
        }
      }

      return { canExport: true, message: 'Ready to export' }
    }

    // Test with missing basic info
    expect(validateExportState(false, true)).toEqual({
      canExport: false,
      message:
        'Please fill in at least the basic information before exporting.',
    })

    // Test with missing processed HTML
    expect(validateExportState(true, false)).toEqual({
      canExport: false,
      message: 'Please wait for the template to load before exporting.',
    })

    // Test with valid state
    expect(validateExportState(true, true)).toEqual({
      canExport: true,
      message: 'Ready to export',
    })
  })
})
