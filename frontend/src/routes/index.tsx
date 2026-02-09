import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-text-strong flex items-center justify-center">
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <header className="py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Json2Resume
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-2xl">
            Manage all your resume information in one place. Create, edit, and
            export a professional resume with an intuitive editor and beautiful
            themes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/editor"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-3 font-medium text-on-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface transition-colors"
            >
              Open Editor
            </Link>
            <Link
              to="/themes-guide"
              className="inline-flex items-center rounded-lg border border-border px-5 py-3 font-medium text-text-strong hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-surface transition-colors"
            >
              Create Theme
            </Link>
          </div>
        </header>
      </div>
    </div>
  )
}
