// TypeScript / React
import ReactCodeMirror from '@uiw/react-codemirror'
import { jsonLanguage } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { drawSelection, highlightActiveLine, highlightActiveLineGutter, lineNumbers } from '@codemirror/view'
import { history } from '@codemirror/commands'

export default function JsonCodeEditor({
  jsonState,
  onChange,
}: {
  jsonState: string
  onChange: (v: string) => void
}) {
  return (
    <ReactCodeMirror
      value={jsonState}
      onChange={onChange}
      theme={oneDark}
      basicSetup={false}
      extensions={[
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        jsonLanguage,
      ]}
      height="590px"
    />
  )
}