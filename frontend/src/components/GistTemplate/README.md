# GistTemplate (with Lightweight Template Engine)

Render JSON Resume data into an HTML/CSS template stored in a GitHub Gist.
This package fetches the template, merges it with your data using a tiny, dependency-free engine, and renders the final HTML in React.

## Features

- 🔗 Fetch from GitHub Gists — Works with multiple Gist URL formats.
- 🧩 Lightweight template engine — >>[path]<<, [[#if]], [[#each]], [[#join]], [[#if !...]].
- 🔒 Safe by default — All injected values are HTML-escaped.
- ⚡ TypeScript-first — Clean types + simple API.
- 🪝 Hook or Component — Use useGistTemplate or <GistTemplate />.
- 📱 Good UX — Built-in loading & error states.

## Quick Start

```tsx
import { GistTemplate } from './GistTemplate'

const resumeData = {
  basics: { name: 'John Doe', email: 'john@example.com' },
  // ...rest of your JSON Resume
}

export default function MyComponent() {
  return (
    <GistTemplate
      gistUrl="https://gist.github.com/username/gistId#file-template-html"
      resumeData={resumeData}
    />
  )
}
```

## Templating Syntax (supported by the engine)

### 1. Variables

```html
<!-- Reads from root data -->
>>[basics.name]<< >>[basics.location.city]<<

<!-- Inside [[#each]]: current item -->
>>[.]<<
```

Note: Numeric array indexes are supported via dot syntax (e.g. work.0.position).
Prefer [[#each work]] for readability.

### 2. Conditionals

```html
<!-- Render if value is truthy -->
[[#if basics.email]]
<a href="mailto:>>[basics.email]<<">>>[basics.email]<<</a>
[[/if]]

<!-- Negation -->
[[#if !basics.phone]]
<p>No phone number provided</p>
[[/if]]
```

### 3. Loops

```html
[[#each work]]
<div class="item">
  <h3>>>[position]<< <span class="muted">@ >>[name]<<</span></h3>
  [[#if summary]]
  <div class="summary">>>[summary]<<</div>
  [[/if]] [[#if highlights]]
  <ul>
    [[#each highlights]]
    <li>>>[.]<<</li>
    [[/each]]
  </ul>
  [[/if]]
</div>
[[/each]]
```

### 4. Join (Comma-separated lists)

```html
<!-- Join array of primitives with a separator (default: ", ") -->
<p>Tags: [[#join projects.0.highlights| • ]]</p>
```

The separator is whatever follows the |, e.g. |, or | • .

## Components

### `<GistTemplate />`

Fetches the Gist template, renders with your data, and injects the resulting HTML.

```tsx
<GistTemplate
  gistUrl="https://gist.github.com/username/gistId"
  resumeData={resumeData}
  filename="template.html" // optional (when multiple files)
  className="resume-container" // optional
  onProcessed={(html) => console.log(html)} // optional
  onError={(err) => console.error(err)} // optional
  showLoading={true} // optional (default true)
/>
```

### `<ClassicGistTemplate />`

Convenience wrapper pointing at a default, classic template.

```tsx
import { ClassicGistTemplate } from './GistTemplate'
;<ClassicGistTemplate resumeData={resumeData} />
```

### `useGistTemplate` Hook

For custom implementations:

```tsx
import { useGistTemplate } from './GistTemplate'

function Custom() {
  const { processedHtml, loading, error, refetch } = useGistTemplate(
    gistUrl,
    resumeData,
    filename,
  )

  if (loading) return <div>Loading…</div>
  if (error) return <div>Error: {error}</div>

  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
}
```

### Engine API (direct use)

```typescript
import { renderTemplate, compile } from './templateEngine'

// One-shot:
const html = renderTemplate(templateString, resumeJson)

// Reuse compiled AST:
const { render } = compile(templateString)
const htmlA = render(resumeJsonA)
const htmlB = render(resumeJsonB)

// Optional: disable escaping (ONLY for trusted HTML values)
const htmlUnsafe = renderTemplate(templateString, resumeJson, {
  htmlEscape: false,
})
```

Truthiness rules:
Empty strings/arrays/objects are falsey; numbers follow JS truthiness (0 is falsey).

Path resolution:
Relative paths resolve against the current context, then fall back to the root object. . or this refers to the current item inside [[#each]].

## Supported Gist URL Formats

- `https://gist.github.com/username/gistId`
- `https://gist.github.com/username/gistId#file-filename`
- `https://gist.githubusercontent.com/username/gistId/raw/filename`

Uses fetchAndValidateGistTemplate() under the hood to pick the right file and ensure it looks like HTML.

## Resume Data Structure

The component expects a JSON-Resume-like shape. It’s flexible (typed as Record<string, any>) but intended to follow the JSON Resume
schema. Example:

```typescript
type ResumeData = Record<string, any>

// Example
const resumeData: ResumeData = {
  basics: { name: 'John Doe', email: 'john@example.com' },
  work: [{ name: 'Company', position: 'Developer', highlights: ['Built X'] }],
  // ...
}
```

## Security

- Escaping by default: The engine HTML-escapes all injected values to avoid XSS.
- Templates are trusted: Your Gist template’s HTML/CSS is injected as-is.
- Opt-out (rare): You can disable escaping for a render call ({ htmlEscape: false }) if all values are trusted.

Per-placeholder “raw” filters are not supported. Prefer keeping escaping on.

## Error Handling

- You’ll get clear errors for:
- Invalid/unsupported Gist URLs
- Network/HTTP failures
- Empty or non-HTML templates

`<GistTemplate />` shows a loading state and a styled error with retry.

## Development

## Example Route with TanStack Router

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { GistTemplate } from '@/components/GistTemplate'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})

function ResumePage() {
  const resumeData = {
    basics: { name: 'John Doe', email: 'john@example.com' },
    // ...rest of your JSON Resume
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GistTemplate
        gistUrl="https://gist.github.com/username/gistId#file-template-html"
        resumeData={resumeData}
      />
    </div>
  )
}
```

## Notes & Limitations

Templates are processed in this deterministic order:

- No `else` blocks in `[[#if]]` (use `[[#if !path]]` as needed).

- No inline comparisons (e.g., `==`, `>`) — keep logic in data shaping.

- Prefer loops over array indexing in templates for clarity.
