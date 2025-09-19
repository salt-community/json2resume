import SidebarNav from '@/components/SidebarNav.tsx'
import JsonArea from '@/components/JsonArea.tsx'
import PlaceholderGrid from '@/components/PlaceholderGrid.tsx'
import ChipGrid from '@/components/ChipGrid.tsx'

export default function ResumeEditor() {
  return (
    <>
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
    </>
  )
}
