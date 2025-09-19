export default function ChipGrid() {
  const chips = new Array(18).fill('Language')
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
      {chips.map((label, i) => (
        <div
          key={i}
          className="rounded-sm border border-neutral-700 bg-neutral-800 px-3 py-4 text-center text-sm text-neutral-300"
        >
          {label}
        </div>
      ))}
    </div>
  )
}
