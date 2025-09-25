import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
        <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
          <header className="py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Json2Resume
          </h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl">
            Create, edit, and export a professional resume with an intuitive editor and beautiful templates.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/editor"
              className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors"
            >
              Open Editor
            </Link>
            <a
              href="/templates-guide"
              className="inline-flex items-center rounded-lg border border-neutral-700 px-5 py-3 font-medium text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors"
            >
              Create Template
            </a>
          </div>
        </header>
      </div>
    </div>
  )
}