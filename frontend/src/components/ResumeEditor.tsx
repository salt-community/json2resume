import SidebarNav from '@/components/SidebarNav.tsx'
import JsonArea from '@/components/JsonArea.tsx'
import PlaceholderGrid from '@/components/PlaceholderGrid.tsx'
import ChipGrid from '@/components/ChipGrid.tsx'
import {useState} from "react";

export default function ResumeEditor() {
  const originalJson = `{"basics": { "name": "John Doe", "label": "Programmer", "image": "", "email": "john@email.com", "phone": "912 555-4321", "url": "https://johndoe.com", "summary": "A summary of John Doe.", "location": { "address": "2712 Broadway St", "postalCode": "CA 94115", "city": "San Francisco", "countryCode": "US", "region": "California" }, "profiles": [{ "network": "Twitter", "username": "john", "url": "http://twitter.com/john" }]},
"work": [{ "name": "Company", "position": "President", "url": "https://company.com", "startDate": "2013-01-01", "endDate": "2014-01-01", "summary": "Description...", "highlights": ["Started the company"] }]}`
  const [json, setJson] = useState(originalJson)

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
          <SidebarNav />
        </div>
        <div className="col-span-12 md:col-span-7">
          <JsonArea jsonState={json} onChange={setJson} />
        </div>
        <div className="col-span-12 md:col-span-3">
          <PlaceholderGrid />
        </div>
      </div>
      <ChipGrid />
    </>
  )
}
