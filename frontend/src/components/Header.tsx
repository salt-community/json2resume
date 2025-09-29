import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-surface text-text-strong justify-between w-full">
      <nav className="bg-surface shadow-sm border-b border-border w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-strong hover:text-link"
                activeProps={{
                  className:
                    'inline-flex items-center px-1 pt-1 border-b-2 border-accent text-sm font-medium text-accent',
                }}
              >
                Resume Editor
              </Link>
              <Link
                to="/gist-demo"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-muted hover:text-link"
                activeProps={{
                  className:
                    'inline-flex items-center px-1 pt-1 border-b-2 border-accent text-sm font-medium text-accent',
                }}
              >
                Gist Template Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
