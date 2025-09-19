import { createFileRoute } from '@tanstack/react-router'
import StatusHeader from '@/components/StatusHeader.tsx'
import ResumeEditor from '@/components/ResumeEditor.tsx'
import { Resume } from '@/components/Resume.tsx'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
          <StatusHeader />
          <ResumeEditor />
        </div>
      </div>
      <Resume />
    </>
  )
}
