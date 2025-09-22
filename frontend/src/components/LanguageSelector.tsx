export default function LanguageSelector() {
  const chips = new Array(18).fill('Language')
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
      {chips.map((label, i) => (
        <div
          key={i}
          className="rounded-sm border border-border bg-surface px-3 py-4 text-center text-sm text-text-muted"
        >
          {label}
        </div>
      ))}
    </div>
  )
}
