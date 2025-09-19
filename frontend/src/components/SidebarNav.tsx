const items = [
  'basics',
  'profiles',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
]

export default function SidebarNav() {
  return (
    <div className="w-full">
      <ul className="space-y-2">
        {items.map((label, idx) => (
          <li key={label}>
            <div
              className={[
                'w-full rounded-sm border border-neutral-700 px-3 py-2 text-sm capitalize',
                'bg-neutral-800 text-neutral-200',
                idx === 0 ? 'bg-indigo-600 text-white' : '',
                'break-words',
              ].join(' ')}
            >
              {label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
