import { Link, createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/themes-guide')({
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
      {description ? <p className="mt-2 text-text-muted">{description}</p> : null}
      {children ? <div className="mt-4 text-left">{children}</div> : null}
    </section>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-surface text-text-strong">
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <header className="py-12 md:py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Themes Guide
          </h1>
          <p className="mt-3 text-text-muted">
            How to create resume themes for the editor to use.
          </p>
        </header>

        <div className="space-y-10 md:space-y-12">
          <GuideSection
            title="1. Create a Github Gist"
            description="Create a public gist on Github for storing the theme"
          >
            <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-text-muted">
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
                <a>if you don't want your theme public, </a>
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

          <div className="border-t border-border pt-8 md:pt-10">
            <GuideSection
              title="2. Insert HTML theme"
              description="Create a theme in our custom html interpreter language"
            >
              <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-text-muted">
                <li>
                  <a>Create the HTML theme in accordance </a>
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
                  <a>Note that we will insert css to regulate pdf height and width.</a>
                  <br/>
                  <a>This means that the only thing your theme should do<br/>in regards to size is assume the width of 210mm.</a>
                </li>
              </ul>
            </GuideSection>
          </div>

          <div className="border-t border-border pt-8 md:pt-10">
            <GuideSection
              title="3. Done!"
              description="Now all you need to do is link to it in the editor"
            >
              <ul className="mx-auto w-fit list-disc pl-5 space-y-2 text-text-muted">
                <li>
                  <a>To select your theme in the editor you need to...</a>
                </li>
                <li>
                  <a>Go to the </a>
                  <Link
                    className="text-link"
                    to={'/editor'}
                    >Editor
                  </Link>
                  <a> to try out your theme!</a>
                </li>
              </ul>
            </GuideSection>
          </div>
        </div>
      </div>
    </div>
  )
}
