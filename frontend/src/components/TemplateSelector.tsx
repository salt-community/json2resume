function Box() {
  return (
    <div className="flex h-40 items-center justify-center rounded-sm border border-border bg-surface text-sm text-text-muted md:h-44 lg:h-48">
      Placeholder
    </div>
  )
}

export default function TemplateSelector() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </div>
  )
}
