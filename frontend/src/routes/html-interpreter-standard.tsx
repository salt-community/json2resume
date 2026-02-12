import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/html-interpreter-standard')({
  component: RouteComponent,
})

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="whitespace-pre-wrap bg-surface-strong border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
      <code>{code}</code>
    </pre>
  )
}

function GuideSection({
  title,
  description,
  code,
}: {
  title: string
  description?: string
  code?: string
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description ? <p className="text-text-muted">{description}</p> : null}
      {code ? <CodeBlock code={code} /> : null}
    </section>
  )
}

/**
 * HTML Interpreter Language (stand-in spec)
 * -----------------------------------------
 * Normal HTML with 4 extra functions:
 * - Insertion: >>>[path]<<<
 * - Each: [[#each path]] ... [[/each]]
 * - If: [[#if path]] ... [[/if]] (truthy), also supports negation [[#if !path]] ... [[/if]]
 * - List: [[#list path]] ... [[/list]] (alias-like convenience for repeating list items)
 *
 * Notes
 * - Each and If must be closed.
 * - path refers to keys in your data, e.g., basics.name, work, work.0.company, etc.
 */
function RouteComponent() {
  const insertionExample = `<section>
  <h1 class="text-2xl font-bold">>>>[basics.name]<<<</h1>
  <p class="text-sm">>>>[basics.label]<<<</p>
  <a class="text-link" href="mailto:>>>[basics.email]<<<">>>>[basics.email]<<<</a>
</section>`

  const eachExample = `<ul>
  [[#each work]]
    <li class="py-1">
      <strong>
        >>>[company]<<<
      </strong>
       <a>
         —>>>[position]<<<
       </a>
    </li>
  [[/each]]
</ul>`

  const ifExample = `[[#if basics.summary]]
  <section>
    <h2 class="font-semibold">Profile</h2>
    <p>
      >>>[basics.summary]<<<
    </p>
  </section>
[[/if]]

[[#if !basics.website]]
  <p class="text-text-muted text-sm">No website provided.</p>
[[/if]]

<!-- Comparison -->
[[#if meta.globalDateConfig.locale == "se"]]
  <p>Hej världen!</p>
[[/if]]

[[#if meta.globalDateConfig.locale != "se"]]
  <p>Hello world!</p>
[[/if]]`

  const listExample = `<ul>
  [[#list skills]]
    <li>
      <span class="font-semibold">>>>[name]<<<</span>
      [[#list keywords]]
        <span class="ml-2 inline-block rounded px-2 py-0.5 border border-border text-xs">
          >>>[.]<<<
        </span>
      [[/list]]
    </li>
  [[/list]]
</ul>`

  const joinExample = `<p>
  Keywords: [[#join keywords|, ]]
</p>`

  const fullExample = `<!-- A compact resume header -->
<header class="pb-4 border-b border-border">
  <h1 class="text-3xl font-bold">>>>[basics.name]<<<</h1>
  [[#if basics.label]]
    <p class="text-text-muted">>>>[basics.label]<<<</p>
  [[/if]]
  [[#if basics.email]]
    <a class="text-link" href="mailto:>>>[basics.email]<<<">>>>[basics.email]<<<</a>
  [[/if]]
</header>

<!-- Experience -->
<section class="mt-6">
  <h2 class="text-xl font-semibold">Experience</h2>
  <ul class="mt-2 space-y-2">
    [[#each work]]
      <li class="rounded border border-border p-3">
        <div class="font-semibold">>>>[position]<<< @ >>>[name]<<<</div>
        [[#if summary]]
          <p class="text-sm text-text-muted mt-1">>>>[summary]<<<</p>
        [[/if]]
      </li>
    [[/each]]
  </ul>
</section>`

  return (
    <div className="min-h-screen bg-surface text-text-strong">
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <div className="mb-6 flex gap-3">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-black/[0.03] dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/[0.08] dark:hover:bg-white/10 transition-all text-sm font-medium shadow-sm text-text-strong"
          >
            Return to Homepage
          </Link>
          <Link
            to="/themes-guide"
            className="inline-block px-6 py-3 bg-black/[0.03] dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/[0.08] dark:hover:bg-white/10 transition-all text-sm font-medium shadow-sm text-text-strong"
          >
            Back
          </Link>
        </div>
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            HTML Interpreter Standard
          </h1>
          <p className="mt-3 text-text-muted">
            Author themes using normal HTML plus four helpers: Each, If, List, and
            value Insertion.
          </p>
        </header>

        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Quick reference</h2>
            <ul className="list-disc pl-6 text-text-muted space-y-1">
              <li>
                Insertion: <span className="text-text-strong font-mono">{">>>[path]<<<"}</span>
              </li>
              <li>
                List: <span className="text-text-strong font-mono">[[#list path]] ... [[/list]]</span>
              </li>
              <li>
                If: <span className="text-text-strong font-mono">[[#if path]] ... [[/if]]</span>,{' '}
                <span className="text-text-strong font-mono">[[#if !path]] ... [[/if]]</span>, <br />
                <span className="text-text-strong font-mono">[[#if path == "val"]] ... [[/if]]</span>
              </li>
              <li>
                Each: <span className="text-text-strong font-mono">[[#each path]] ... [[/each]]</span>
              </li>
              <li>
                Join: <span className="text-text-strong font-mono">[[#join path|separator]]</span>
              </li>
            </ul>
          </section>

          <GuideSection
            title="Insertion"
            description="Inject a value from your data into the HTML."
            code={insertionExample}
          />

          <GuideSection
            title="List"
            description="Like Each, but intended for list-like structures. Use it to repeat inner markup per item (and wrap with UL/OL as needed). Must be closed with [[/list]]."
            code={listExample}
          />

          <GuideSection
            title="If"
            description="Conditionally render the inner markup. Supports truthy checks, negation (ex: [[#if !path]]), and equality comparisons (ex: [[#if path == &quot;val&quot;]]). Must be closed with [[/if]]."
            code={ifExample}
          />

          <GuideSection
            title="Each"
            description="Repeat inner markup for every item in an array. Must be closed with [[/each]]."
            code={eachExample}
          />

          <GuideSection
            title="Join"
            description="Join an array of strings with a separator. Default separator is ', ' if not specified."
            code={joinExample}
          />

          <section className="space-y-3">
            <h3 className="text-xl font-semibold">Full example</h3>
            <p className="text-text-muted">
              A small sample combining Insertion, If, and Each in a typical resume header and
              experience section.
            </p>
            <CodeBlock code={fullExample} />
          </section>
        </div>
      </div>
    </div>
  )
}
