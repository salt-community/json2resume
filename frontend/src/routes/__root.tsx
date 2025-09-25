import { Outlet, createRootRoute, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                activeProps={{
                  className:
                    'inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600',
                }}
              >
                Resume Editor
              </Link>
              <Link
                to="/gist-demo"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className:
                    'inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600',
                }}
              >
                Gist Template Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Outlet />
    </>
  )
}
