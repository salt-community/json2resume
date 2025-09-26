import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ResumeData } from '@/components/resume/ResumeTypes'
import StatusHeader from '@/components/StatusHeader.tsx'
import ResumeEditor from '@/components/ResumeEditor/ResumeEditor.tsx'
import { Resume } from '@/components/resume/Resume.tsx'

export const Route = createFileRoute('/editor')({
  component: App,
})

function App() {
  const [generatedResumeData, setGeneratedResumeData] = useState<ResumeData | null>(null)
  const [showResume, setShowResume] = useState(false)

  const handleGenerate = (resumeData: ResumeData) => {
    setGeneratedResumeData(resumeData)
    setShowResume(true)
  }

  const handleBackToEditor = () => {
    setShowResume(false)
  }

  return (
    <>
      {!showResume ? (
        <div className="min-h-screen bg-neutral-900 text-neutral-100">
          <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
            <StatusHeader />
            <ResumeEditor onGenerate={handleGenerate} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl p-4 md:p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToEditor}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Editor
              </button>
            </div>
            {generatedResumeData && (
              <Resume resumeData={generatedResumeData} />
            )}
          </div>
        </div>
      )}
    </>
  )
}
