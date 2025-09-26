import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header } from '@/components'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      {/* Navigation Header */}
      <Header />
      {/* Main Content */}
      <Outlet />
    </>
  )
}
