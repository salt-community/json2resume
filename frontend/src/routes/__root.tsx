import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      {/* Navigation Header */}
      {/* Main Content */}
      <Outlet />
    </>
  )
}
