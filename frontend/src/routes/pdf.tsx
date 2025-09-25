import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pdf')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pdf"!</div>
}
