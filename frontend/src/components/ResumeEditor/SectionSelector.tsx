import React from 'react'

type Section = {
  id: string
  selected: boolean
}

type Props = {
  sections: Array<Section>
  setSections: React.Dispatch<React.SetStateAction<Array<Section>>>
}

export default function SectionSelector({ sections, setSections }: Props) {
  const handleClick = (id: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === id ? { ...s, selected: !s.selected } : s,
      ),
    )
  }

  return (
    <div className="w-full">
      <ul className="space-y-2">
        {sections.map(({ id, selected }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => handleClick(id)}
              aria-pressed={selected}
              className={[
                'w-full rounded-sm border border-border px-3 py-2 text-sm capitalize text-left',
                selected
                  ? 'bg-accent text-on-accent border-accent'
                  : 'bg-surface text-text-subtle hover:bg-surface-strong',
                'break-words transition-colors',
              ].join(' ')}
            >
              {id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
