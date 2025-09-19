function Box() {
  return (
    <div className="flex h-40 items-center justify-center rounded-sm border border-neutral-700 bg-neutral-800 text-sm text-neutral-300 md:h-44 lg:h-48">
      Placeholder
    </div>
  )
}

export default function PlaceholderGrid() {
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
