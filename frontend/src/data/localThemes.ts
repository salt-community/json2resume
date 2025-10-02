// Inline themes as HTML strings, using our custom template engine syntax.
// Supported syntax examples used below:
// - Vars: >>[basics.name]<<, >>[.]<<
// - If: [[#if basics.summary]] ... [[/if]]
// - Each: [[#each work]] ... [[/each]]
// - Join: [[#join keywords|, ]]
export const inlineThemes = {
  minimal: {
    html: `
<style>
  .resume { 
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; 
    color: #111827; 
    line-height: 1.5; 
    background: #ffffff; 
    border: 1px solid #e5e7eb; 
    border-radius: .5rem; 
    padding: 1rem;
  }
  .header { border-bottom: 1px solid #e5e7eb; padding-bottom: .5rem; margin-bottom: .75rem; }
  .name { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
  .label { color: #4b5563; margin-top: .25rem; }
  .section { margin-top: 1rem; }
  .section h2 { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: .5rem; }
  .item { margin-bottom: .5rem; }
  .muted { color: #6b7280; }
  .chip { display: inline-block; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 9999px; padding: .125rem .5rem; margin: .125rem; font-size: .8rem; }
  a { color: #2563eb; text-decoration: none; }
</style>

<div class="resume">
  <header class="header">
    <h1 class="name">>>[basics.name]<<</h1>
    [[#if basics.label]]<div class="label">>>[basics.label]<<</div>[[/if]]
    [[#if basics.image]]<div class="mt-2"><img src=">>[basics.image]<<"
      alt="Profile image" style="height:64px;width:64px;border-radius:9999px;object-fit:cover;border:1px solid #e5e7eb"/></div>[[/if]]
  </header>

  [[#if basics.summary]]
  <section class="section">
    <h2>Summary</h2>
    <p class="muted">>>[basics.summary]<<</p>
  </section>
  [[/if]]

  [[#if skills]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.skills]]>>[meta.sectionHeaders.skills]<<[[/if]][[#if !meta.sectionHeaders.skills]]Technical Skills[[/if]]</h2>
    [[#each skills]]
      <div class="item">
        <strong>>>[name]<<</strong>
        [[#if level]] <span class="muted">— >>[level]<<</span> [[/if]]
        [[#if keywords]]
          <div>
            [[#each keywords]]<span class="chip">>>[.]<<</span>[[/each]]
          </div>
        [[/if]]
      </div>
    [[/each]]
  </section>
  [[/if]]

  [[#if languages]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.languages]]>>[meta.sectionHeaders.languages]<<[[/if]][[#if !meta.sectionHeaders.languages]]Languages[[/if]]</h2>
    <ul>
      [[#each languages]]
        <li>>>[language]<< [[#if fluency]]— >>[fluency]<<[[/if]]</li>
      [[/each]]
    </ul>
  </section>
  [[/if]]

  [[#if basics.profiles]]
  <section class="section">
    <h2>Social</h2>
    <ul>
      [[#each basics.profiles]]
        <li><a href=">>[url]<<">>>[url]<<</a></li>
      [[/each]]
    </ul>
  </section>
  [[/if]]

  [[#if work]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.work]]>>[meta.sectionHeaders.work]<<[[/if]][[#if !meta.sectionHeaders.work]]Work Experience[[/if]]</h2>
    [[#each work]]
      <div class="item">
        <div><strong>>>[position]<<</strong> <span class="muted">| >>[name]<<</span></div>
        <div class="muted">>>[startDate]<< – [[#if endDate]]>>[endDate]<<[[/if]][[#if !endDate]]present[[/if]]</div>
        [[#if summary]]<div>>>[summary]<<</div>[[/if]]
        [[#if highlights]]
          <ul>
            [[#each highlights]]<li>>>[.]<<</li>[[/each]]
          </ul>
        [[/if]]
      </div>
    [[/each]]
  </section>
  [[/if]]

  [[#if education]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.education]]>>[meta.sectionHeaders.education]<<[[/if]][[#if !meta.sectionHeaders.education]]Education[[/if]]</h2>
    [[#each education]]
      <div class="item">
        <div><strong>>>[studyType]<<</strong> <span class="muted">| >>[institution]<<</span></div>
        <div class="muted">>>[startDate]<< – [[#if endDate]]>>[endDate]<<[[/if]][[#if !endDate]]present[[/if]]</div>
        [[#if courses]]<div class="muted">[[#join courses|, ]]</div>[[/if]]
      </div>
    [[/each]]
  </section>
  [[/if]]
</div>`.trim(),
  },
} as const
