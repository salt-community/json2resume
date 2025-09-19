import { createFileRoute } from '@tanstack/react-router'
import { Resume } from '../components'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Resume />
      </div>
    </div>
  )
}
