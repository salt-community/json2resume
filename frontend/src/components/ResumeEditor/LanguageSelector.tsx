type LanguageOption = { id: string; selected: boolean }
type Setter<T> = (value: T | ((prev: T) => T)) => void

export default function LanguageSelector({
                                           languages,
                                           setLanguages,
                                         }: {
  languages: Array<LanguageOption>
  setLanguages: Setter<Array<LanguageOption>>
}) {
  const handleSelect = (index: number) => {
    setLanguages(prev => prev.map((opt, i) => ({ ...opt, selected: i === index })))
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
      {languages.map((lang, i) => {
        const isSelected = lang.selected
        return (
          <div
            key={lang.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelect(i)
              }
            }}
            className={`rounded-sm border border-border bg-surface px-3 py-4 text-center text-sm ${isSelected ? 'text-text' : 'text-text-muted'} cursor-pointer select-none`}
            aria-pressed={isSelected}
          >
            {lang.id}
          </div>
        )
      })}
    </div>
  )
}
