// TypeScript / React
import ReactCodeMirror, { basicSetup } from '@uiw/react-codemirror'
import { jsonLanguage } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view'
import { history } from '@codemirror/commands'

// Function to format JSON with proper indentation
const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    // If JSON is invalid, return the original string
    return jsonString
  }
}

export default function JsonCodeEditor({
  jsonState,
  onChange,
}: {
  jsonState: string
  onChange: (v: string) => void
}) {
  // Format the JSON when the component receives new data
  const formattedJson = formatJson(jsonState)
  return (
    <ReactCodeMirror
      value={formattedJson}
      onChange={onChange}
      theme={oneDark}
      basicSetup={false}
      extensions={[
        basicSetup(),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        jsonLanguage,
        EditorView.lineWrapping,
      ]}
      height="1080px"
    />
  )
}
