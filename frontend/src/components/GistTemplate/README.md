# GistTemplate Component

A React component system for fetching HTML templates from GitHub Gists and processing them with resume data using a custom mini templating engine.

## Features

- 🔗 **Fetch templates from GitHub Gists** - Supports various Gist URL formats
- 🎨 **Custom templating syntax** - Simple but powerful placeholder system
- 🔒 **Security-focused** - HTML escaping and content sanitization
- ⚡ **TypeScript support** - Fully typed with comprehensive interfaces
- 🎯 **React hooks** - Clean API with `useGistTemplate` hook
- 📱 **Loading states** - Built-in loading and error handling
- 🔄 **Retry functionality** - Automatic retry on failures

## Quick Start

```tsx
import { GistTemplate } from './components/GistTemplate'

function MyComponent() {
  const resumeData = {
    basics: {
      name: 'John Doe',
      email: 'john@example.com',
      // ... other resume data
    },
  }

  return (
    <GistTemplate
      gistUrl="https://gist.github.com/username/gistId#file-template-html"
      resumeData={resumeData}
    />
  )
}
```

## Templating Syntax

The component supports a mini templating language for processing resume data:

### 1. Placeholders (Scalar Values)

```html
<!-- Basic placeholder -->
>>[basics.name]<<

<!-- With dot notation -->
>>[basics.location.city]<<

<!-- Array indexing -->
>>[work[0].position]<<

<!-- Raw output (no HTML escaping) -->
>>[basics.summary|raw]<<
```

### 2. Conditionals

```html
<!-- Show if value exists -->
[[#if basics.email]]
<a href="mailto:>>[basics.email]<<">>>[basics.email]<<</a>
[[/if]]

<!-- Show if value doesn't exist -->
[[#if !basics.phone]]
<p>No phone number provided</p>
[[/if]]
```

### 3. Loops

```html
<!-- Loop through arrays -->
[[#each work]]
<div>
  <h3>>>[position]<< at >>[name]<<</h3>
  <p>>>[summary]<<</p>

  [[#if highlights]]
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
<!-- Join array items with commas -->
<p>Skills: [[#join skills[0].keywords]]</p>
```

## Components

### `GistTemplate`

Main component for processing Gist templates.

```tsx
<GistTemplate
  gistUrl="https://gist.github.com/username/gistId"
  resumeData={resumeData}
  filename="template.html" // optional
  className="custom-class" // optional
  onProcessed={(html) => console.log(html)} // optional
  onError={(error) => console.error(error)} // optional
  showLoading={true} // optional, default true
/>
```

### `ClassicGistTemplate`

Convenience component using the default classic template.

```tsx
<ClassicGistTemplate resumeData={resumeData} className="resume-container" />
```

### `useGistTemplate` Hook

For custom implementations:

```tsx
function CustomComponent() {
  const { processedHtml, loading, error, refetch } = useGistTemplate(
    gistUrl,
    resumeData,
    filename,
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
}
```

## Supported Gist URL Formats

- `https://gist.github.com/username/gistId`
- `https://gist.github.com/username/gistId#file-filename`
- `https://gist.githubusercontent.com/username/gistId/raw/filename`

## Resume Data Structure

The component expects resume data following the JSON Resume schema:

```typescript
interface ResumeData {
  basics?: {
    name?: string
    label?: string
    email?: string
    phone?: string
    url?: string
    summary?: string
    location?: {
      city?: string
      region?: string
      // ...
    }
    profiles?: Array<{
      network?: string
      username?: string
      url?: string
    }>
  }
  work?: Array<{
    name?: string
    position?: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights?: string[]
    // ...
  }>
  // ... other sections
}
```

## Security

- **HTML Escaping**: All values are HTML-escaped by default unless `|raw` filter is used
- **Template Sanitization**: Templates are sanitized to remove potentially dangerous script tags
- **Safe Rendering**: Uses React's `dangerouslySetInnerHTML` with processed content

## Error Handling

The component provides comprehensive error handling:

- Network errors when fetching Gists
- Invalid Gist URLs
- Template processing errors
- Missing or invalid resume data
- Automatic retry functionality

## Development

To test the component, use the included demo:

```tsx
import { GistTemplateDemo } from './components/GistTemplate'

function App() {
  return <GistTemplateDemo />
}
```

## Processing Order

Templates are processed in this deterministic order:

1. **Each blocks** (outermost to innermost, recursively)
2. **If blocks** (outermost to innermost, recursively)
3. **Join statements**
4. **Scalar placeholders**

This ensures consistent and predictable template processing.
