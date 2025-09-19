export default function JsonArea() {
  return (
    <div className="rounded-sm border border-neutral-700 bg-neutral-800 p-3 md:p-4">
      <div className="h-[520px] overflow-hidden rounded-sm border border-neutral-700 bg-neutral-900">
        <pre className="m-0 h-full w-full overflow-auto p-4 font-mono text-[12px] leading-6 text-neutral-200">
{`"basics": { "name": "John Doe", "label": "Programmer", "image": "", "email": "john@email.com", "phone": "912 555-4321", "url": "https://johndoe.com", "summary": "A summary of John Doe.", "location": { "address": "2712 Broadway St", "postalCode": "CA 94115", "city": "San Francisco", "countryCode": "US", "region": "California" }, "profiles": [{ "network": "Twitter", "username": "john", "url": "http://twitter.com/john" }]},
"work": [{ "name": "Company", "position": "President", "url": "https://company.com", "startDate": "2013-01-01", "endDate": "2014-01-01", "summary": "Description...", "highlights": ["Started the company"] }],`}
        </pre>
      </div>
    </div>
  )
}
