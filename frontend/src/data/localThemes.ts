// Inline themes as HTML strings. CSS can be inline styles or a <style> block.
export const inlineThemes = {
  minimal: {
    html: `
<style>
  .resume { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #1f2937; line-height: 1.45; }
  .resume h1, .resume h2 { color: #111827; margin: 0; }
  .resume header { border-bottom: 1px solid #e5e7eb; padding-bottom: .5rem; margin-bottom: .75rem; }
  .muted { opacity: .75; font-size: .9em; }
  .section-title { font-weight: 600; margin: .75rem 0 .5rem; font-size: 1.05rem; }
</style>
<div class="resume">
  <header>
    <h1>{{name}}</h1>
    <div class="muted">{{title}}</div>
  </header>
  <section>
    <div class="section-title">Experience</div>
    <!-- Content rendered by the engine -->
  </section>
</div>`.trim(),
  },
  clean: {
    html: `
<style>
  .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: .5rem; padding: 1rem; }
  .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; align-items: start; }
  .title { font-size: 1.25rem; font-weight: 700; margin: 0 0 .25rem 0; }
  .subtitle { color: #6b7280; margin-bottom: .75rem; }
  .heading { font-weight: 600; margin-bottom: .5rem; }
</style>
<div class="card">
  <div class="grid">
    <aside>
      <div class="heading">Profile</div>
      <!-- Sidebar content -->
    </aside>
    <main>
      <div class="title">{{name}}</div>
      <div class="subtitle">{{title}}</div>
      <!-- Main content -->
    </main>
  </div>
</div>`.trim(),
  },
} as const