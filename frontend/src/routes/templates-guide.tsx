import { Link, createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/templates-guide')({
  component: RouteComponent,
})

type GuideSectionProps = {
  title: string
  description?: string
  children?: ReactNode
}

function GuideSection({ title, description, children }: GuideSectionProps) {
  return (
    <section className="mx-auto w-full max-w-2xl text-center">
      <h2 className="mb-[20px] inline-block -translate-x-[10px] text-2xl font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-neutral-300">{description}</p> : null}
      {children ? <div className="mt-4 text-left">{children}</div> : null}
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <header className="py-12 md:py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Templates Guide
          </h1>
          <p className="mt-3 text-neutral-300">
            How to create resume templates for the editor to use.
          </p>
        </header>

        <div className="space-y-10 md:space-y-12">
          <GuideSection
            title="1. Create a Github Gist"
            description="Create a public gist on Github for storing the template"
          >
            <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-neutral-300">
              <li>
                <a>Go to </a>
                <a className="text-link" href="https://gist.github.com/">
                  Github Gists
                </a>
                <a> to create a gist</a>
              </li>
              <li>
                <a>
                  Note: you will need to create a public gist for this to
                  work,{' '}
                </a>
                <br />
                <a>if you don't want your template public, </a>
                <br />
                <a>then you need to store the html locally </a>
                <br />
                <a>(still following our </a>
                <Link
                  className="text-link"
                  to="/html-interpreter-standard"
                >
                  HTML Interpreter Standards
                </Link>
                <a>) </a>
                <br />
                <a>and insert it directly into the editor</a>
              </li>
            </ul>
          </GuideSection>

          <div className="border-t border-neutral-800 pt-8 md:pt-10">
            <GuideSection
              title="2. Insert HTML Template"
              description="Create a template in our custom html interpreter language"
            >
              <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-neutral-300">
                <li>
                  <a>Create the HTTP template in accordance </a>
                  <br />
                  <a>with our </a>
                  <Link
                    className="text-link"
                    to="/html-interpreter-standard"
                  >
                    HTML Interpreter Standards
                  </Link>
                </li>
                <li>
                  <a>When you are done, save it as public </a>
                  <br />
                  <a>with the name </a>
                  <a className="text-text-highlight">$[INSERT]</a>
                </li>
              </ul>
            </GuideSection>
          </div>

          <div className="border-t border-neutral-800 pt-8 md:pt-10">
            <GuideSection
              title="3. Done!"
              description="Now all you need to do is link to it in the editor"
            >
              <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-neutral-300">
                <li>
                  <a>To select your template in the editor you need to...</a>
                </li>
                <li>
                  <a>Go to the </a>
                  <Link
                    className="text-link"
                    to={'/editor'}
                    >Editor
                  </Link>
                  <a> to try out your template!</a>
                </li>
              </ul>
            </GuideSection>
          </div>
        </div>
      </div>
    </div>
  )
}
