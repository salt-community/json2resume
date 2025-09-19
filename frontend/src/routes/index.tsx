import { createFileRoute } from '@tanstack/react-router'
import StatusHeader from '@/components/StatusHeader.tsx'
import SidebarNav from '@/components/SidebarNav.tsx'
import JsonArea from '@/components/JsonArea.tsx'
import PlaceholderGrid from '@/components/PlaceholderGrid.tsx'
import ChipGrid from '@/components/ChipGrid.tsx'
import { Resume } from '@/components/Resume.tsx'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
          <StatusHeader />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-2">
              <SidebarNav />
            </div>
            <div className="col-span-12 md:col-span-7">
              <JsonArea />
            </div>
            <div className="col-span-12 md:col-span-3">
              <PlaceholderGrid />
            </div>
          </div>
          <ChipGrid />
        </div>
      </div>
      <Resume />
    </div>
  )
}
