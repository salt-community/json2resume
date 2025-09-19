import { ResumePdfDocument } from './ResumePdfDocument'
import { ResumePreview } from './ResumePreview'
import { MOCK_RESUME_DATA } from './ResumeTypes'
import type { ResumeData } from './ResumeTypes'

interface ResumeProps {
  resumeData?: ResumeData
  className?: string
}

export function Resume({
  resumeData = MOCK_RESUME_DATA,
  className,
}: ResumeProps) {
  // Generate the PDF document
  const pdfDocument = <ResumePdfDocument resumeData={resumeData} />

  return (
    <div className={className}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resume Preview
        </h1>
        <p className="text-gray-600">
          Preview and download your professional resume as PDF
        </p>
      </div>

      <ResumePreview
        doc={pdfDocument}
        fileName={`${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.pdf`}
      />
    </div>
  )
}
