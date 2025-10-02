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
  .resume { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #1f2937; line-height: 1.5; }
  .header { border-bottom: 1px solid #e5e7eb; padding-bottom: .5rem; margin-bottom: .75rem; }
  .name { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
  .label { color: #6b7280; margin-top: .25rem; }
  .section { margin-top: 1rem; }
  .section h2 { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: .5rem; }
  .item { margin-bottom: .5rem; }
  .muted { color: #6b7280; }
  .chip { display: inline-block; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 9999px; padding: .125rem .5rem; margin: .125rem; font-size: .8rem; }
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
  clean: {
    html: `
<style>
  .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: .5rem; padding: 1rem; }
  .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; align-items: start; }
  .title { font-size: 1.5rem; font-weight: 700; margin: 0 0 .25rem 0; color: #111827; }
  .subtitle { color: #6b7280; margin-bottom: .75rem; }
  .heading { font-weight: 600; margin-bottom: .5rem; color: #111827; }
  .section { margin-bottom: 1rem; }
  .item { margin-bottom: .5rem; }
  .chip { display: inline-block; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 9999px; padding: .125rem .5rem; margin: .125rem; font-size: .8rem; }
</style>
<div class="card">
  <div class="grid">
    <aside>
      <div class="heading">Profile</div>
      [[#if basics.image]]<div style="margin-bottom:.5rem;">
        <img src=">>[basics.image]<<"
             alt="Profile image"
             style="height:80px;width:80px;border-radius:9999px;object-fit:cover;border:1px solid #e5e7eb"/>
      </div>[[/if]]
      [[#if basics.url]]<div><a href=">>[basics.url]<<">>>[basics.url]<<</a></div>[[/if]]

      [[#if languages]]
      <div class="section">
        <div class="heading">[[#if meta.sectionHeaders.languages]]>>[meta.sectionHeaders.languages]<<[[/if]][[#if !meta.sectionHeaders.languages]]Languages[[/if]]</div>
        <ul>
          [[#each languages]]
            <li>>>[language]<< [[#if fluency]]— >>[fluency]<<[[/if]]</li>
          [[/each]]
        </ul>
      </div>
      [[/if]]

      [[#if basics.profiles]]
      <div class="section">
        <div class="heading">Social</div>
        <ul>
          [[#each basics.profiles]]
            <li><a href=">>[url]<<">>>[url]<<</a></li>
          [[/each]]
        </ul>
      </div>
      [[/if]]
    </aside>

    <main>
      <div class="title">>>[basics.name]<<</div>
      [[#if basics.label]]<div class="subtitle">>>[basics.label]<<</div>[[/if]]
      [[#if basics.summary]]<p class="subtitle" style="margin-top:.25rem;">>>[basics.summary]<<</p>[[/if]]

      [[#if work]]
      <section class="section">
        <div class="heading">[[#if meta.sectionHeaders.work]]>>[meta.sectionHeaders.work]<<[[/if]][[#if !meta.sectionHeaders.work]]Work Experience[[/if]]</div>
        [[#each work]]
          <div class="item">
            <div><strong>>>[position]<<</strong> <span class="subtitle">| >>[name]<<</span></div>
            <div class="subtitle">>>[startDate]<< – [[#if endDate]]>>[endDate]<<[[/if]][[#if !endDate]]present[[/if]]</div>
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

      [[#if projects]]
      <section class="section">
        <div class="heading">[[#if meta.sectionHeaders.projects]]>>[meta.sectionHeaders.projects]<<[[/if]][[#if !meta.sectionHeaders.projects]]Projects[[/if]]</div>
        [[#each projects]]
          <div class="item">
            <div><strong>>>[name]<<</strong> [[#if url]]<span class="subtitle">| <a href=">>[url]<<">>>[url]<<</a></span>[[/if]]</div>
            [[#if description]]<div>>>[description]<<</div>[[/if]]
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
        <div class="heading">[[#if meta.sectionHeaders.education]]>>[meta.sectionHeaders.education]<<[[/if]][[#if !meta.sectionHeaders.education]]Education[[/if]]</div>
        [[#each education]]
          <div class="item">
            <div><strong>>>[studyType]<<</strong> <span class="subtitle">| >>[institution]<<</span></div>
            <div class="subtitle">>>[startDate]<< – [[#if endDate]]>>[endDate]<<[[/if]][[#if !endDate]]present[[/if]]</div>
            [[#if courses]]<div class="subtitle">[[#join courses|, ]]</div>[[/if]]
          </div>
        [[/each]]
      </section>
      [[/if]]

      [[#if skills]]
      <section class="section">
        <div class="heading">[[#if meta.sectionHeaders.skills]]>>[meta.sectionHeaders.skills]<<[[/if]][[#if !meta.sectionHeaders.skills]]Skills[[/if]]</div>
        [[#each skills]]
          <div class="item">
            <strong>>>[name]<<</strong>
            [[#if level]] <span class="subtitle">— >>[level]<<</span> [[/if]]
            [[#if keywords]]<div>[[#each keywords]]<span class="chip">>>[.]<<</span>[[/each]]</div>[[/if]]
          </div>
        [[/each]]
      </section>
      [[/if]]
    </main>
  </div>
</div>`.trim(),
  },
} as const