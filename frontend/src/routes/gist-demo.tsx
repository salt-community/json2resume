import { createFileRoute } from '@tanstack/react-router'
import { GistTemplateDemo } from '@/components' // <-- index.ts barrel

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
