import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/html-interpreter-standard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/html-interpreter-standard"!</div>
}
