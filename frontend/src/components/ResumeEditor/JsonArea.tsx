import React from "react"

export type JsonAreaProps = {
  // Current JSON string to display (controlled)
  jsonState: string
  // Called when user edits; receives the formatted value
  onChange: (value: string) => void
}

function formatJsonString(input: string): string {
  try {
    const obj = JSON.parse(input)
    return JSON.stringify(obj, null, 2)
  } catch {
    return input
  }
}

function JsonArea({ jsonState, onChange }: JsonAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    const formatted = formatJsonString(next)
    onChange(formatted)
  }

  return (
    <div className="rounded-sm border border-border bg-surface p-3 md:p-4">
      <div className="h-[520px] overflow-hidden rounded-sm border border-border bg-surface-strong">
        <textarea
          aria-label="JSON editor"
          spellCheck={false}
          className="m-0 h-full w-full overflow-auto p-4 font-mono text-[12px] leading-6 text-text-subtle bg-transparent outline-none resize-none"
          value={jsonState}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default JsonArea
