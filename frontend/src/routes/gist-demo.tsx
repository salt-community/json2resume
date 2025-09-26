/**
 * /gist-demo route
 * ----------------
 * Purpose
 *   Mount the demo page that renders a gist template with sample resume data.
 *
 * Note
 *   The demo component is exported from your components barrel (index.ts)
 *   or can be imported directly from './GistTemplateDemo'.
 */

import { createFileRoute } from '@tanstack/react-router'
import { GistTemplateDemo } from '@/components' // or '@/components/GistTemplate/GistTemplateDemo'

export const Route = createFileRoute('/gist-demo')({
  component: GistDemo,
})

function GistDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GistTemplateDemo />
    </div>
  )
}
