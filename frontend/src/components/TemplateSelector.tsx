type Template = {
  id: string
  selected: boolean
}

type Props = {
  templates: Array<Template>
  setTemplates: React.Dispatch<React.SetStateAction<Array<Template>>>
}

function Box({
  selected,
  label,
  onClick,
}: {
  selected: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-40 items-center justify-center rounded-sm border ${
        selected ? 'border-primary' : 'border-border'
      } bg-surface text-sm text-text-muted md:h-44 lg:h-48`}
    >
      {label}
    </button>
  )
}

export default function TemplateSelector({ templates, setTemplates }: Props) {
  const handleClick = (id: string) => {
    setTemplates(prev => prev.map(t => ({ ...t, selected: t.id === id })))
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map(t => (
        <Box
          key={t.id}
          selected={t.selected}
          label={t.id}
          onClick={() => handleClick(t.id)}
        />
      ))}
    </div>
  )
}
