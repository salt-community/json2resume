// Inline themes as HTML strings, using our custom template engine syntax.
// Supported syntax examples used below:
// - Vars: >>[basics.name]<<, >>[.]<<
// - If: [[#if basics.summary]] ... [[/if]]
// - Each: [[#each work]] ... [[/each]]
// - Join: [[#join keywords|, ]]
export const inlineThemes = {
  aslan: {
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume — >>[basics.name]<<</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <style>
    :root {
      --bg: #ffffff;
      --fg: #111111;
      --muted: #555555;
      --sidebar-bg: #2b2b2b;
      --sidebar-fg: #ffffff;
      --divider: #e5e5e5;
    }

    a:empty {
  display: none;
}

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font: 400 13px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--fg);
      background: var(--bg);
    }

    .page {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 100vh;
    }

    /* SIDEBAR */
    .sidebar {
      background: var(--sidebar-bg);
      color: var(--sidebar-fg);
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .avatar {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto;
    }

    .sidebar h2 {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 8px 0;
    }

    .sidebar ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar li {
      font-size: 13px;
      margin: 4px 0;
    }

    .sidebar a {
      color: var(--sidebar-fg);
      text-decoration: none;
      word-break: break-all;
    }

    .chip {
      display: inline-block;
      background: #444;
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      margin: 2px 2px 0 0;
    }

    /* CONTENT */
    .content {
      padding: 32px 40px;
    }

    .name {
      font-size: 34px;
      font-weight: 800;
      margin: 0;
    }

    .label {
      font-size: 15px;
      font-weight: 500;
      color: var(--muted);
      margin-top: 2px;
    }

    .summary {
      margin-top: 10px;
      font-size: 14px;
      color: var(--muted);
      max-width: 900px;
    }

    .section {
      margin-top: 32px;
    }

    .section h2 {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--divider);
      padding-bottom: 4px;
    }

    .item {
      margin-bottom: 16px;
    }

    .item-header {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
    }

    .item-date {
      font-size: 13px;
      color: var(--muted);
      margin-top: 2px;
    }

    .item-description {
      font-size: 13px;
      color: var(--muted);
      margin-top: 4px;
    }

    .item ul {
      margin: 6px 0 0 16px;
      padding: 0;
    }

    .item li {
      font-size: 13px;
      color: var(--muted);
      margin: 3px 0;
    }

    /* EDUCATION GRID */
    .education-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
    }
  </style>
</head>

<body>
<div class="page">

 <!-- SIDEBAR -->
  <aside class="sidebar">

    [[#if basics.image]]
      <img class="avatar" src=">>[basics.image]<<" alt=">>[basics.name]<<"/>
    [[/if]]

    [[#if meta.social]]
    <section>
      <h2>Social</h2>
      <ul>
        [[#if basics.url]]
          <li><a href=">>[basics.url]<<">>>[basics.url]<<</a></li>
        [[/if]]
        [[#each basics.profiles]]
          <li><a href=">>[url]<<">>>[network]<< — >>[username]<<</a></li>
        [[/each]]
      </ul>
    </section>
    [[/if]]

    [[#if skills]]
    <section>
      <h2>Technical Skills</h2>
      [[#each skills]]
        <div class="skill-group">
          <div class="skill-title">>>[name]<<</div>
          [[#each keywords]]
            <span class="chip">>>[.]<<</span>
          [[/each]]
        </div>
      [[/each]]
    </section>
    [[/if]]

    [[#if languages]]
    <section>
      <h2>Languages</h2>
      <ul>
        [[#each languages]]
          <li>>>[language]<< — >>[fluency]<<</li>
        [[/each]]
      </ul>
    </section>
    [[/if]]

  </aside>

<!-- CONTENT -->
<main class="content">

  [[#if basics.enabled]]
    <h1 class="name">>>[basics.name]<<</h1>
    [[#if basics.label]]<div class="label">>>[basics.label]<<</div>[[/if]]
    [[#if basics.summary]]<p class="summary">>>[basics.summary]<<</p>[[/if]]
  [[/if]]

    <!-- WORK -->
  [[#if work]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.work]]>>[meta.sectionHeaders.work]<<[[/if]][[#if !meta.sectionHeaders.work]]Work Experience[[/if]]</h2>
    [[#each work]]
      [[#if enabled]]
      <div class="item">
        <div class="item-header">
<span>>>[position]<<</span> —
<a href=">>[url]<<">>>[name]<<</a>        </div>
        <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
        [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
        [[#if highlights]]
          <ul>[[#each highlights]]<li>>>[.]<<</li>[[/each]]</ul>
        [[/if]]
      </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- EDUCATION -->
  [[#if education]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.education]]>>[meta.sectionHeaders.education]<<[[/if]][[#if !meta.sectionHeaders.education]]Education[[/if]]</h2>
    <div class="education-grid">
      [[#each education]]
        [[#if enabled]]
        <div class="item">
          [[#if url]]
          <div class="item-header">
            <span>>>[studyType]<<</span> — <a href=">>[url]<<">>>[institution]<<</a>
          </div>
          [[/if]]
          <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
          [[#if area]]<div class="item-description">>>[area]<<</div>[[/if]]
          [[#if score]]<div class="item-description">Score: >>[score]<<</div>[[/if]]
          [[#if courses]]
            <ul>[[#each courses]]<li>>>[.]<<</li>[[/each]]</ul>
          [[/if]]
        </div>
        [[/if]]
      [[/each]]
    </div>
  </section>
  [[/if]]



  <!-- VOLUNTEER -->
  [[#if volunteer]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.volunteer]]>>[meta.sectionHeaders.volunteer]<<[[/if]][[#if !meta.sectionHeaders.volunteer]]Volunteer[[/if]]</h2>
    [[#each volunteer]]
      [[#if enabled]]
      <div class="item">
        <div class="item-header">
          <span>>>[position]<<</span> — <span>>>[organization]<<</span>
        </div>
        <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
        [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
        [[#if highlights]]
          <ul>[[#each highlights]]<li>>>[.]<<</li>[[/each]]</ul>
        [[/if]]
      </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- PROJECTS -->
  [[#if projects]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.projects]]>>[meta.sectionHeaders.projects]<<[[/if]][[#if !meta.sectionHeaders.projects]]Projects[[/if]]</h2>
    [[#each projects]]
      [[#if enabled]]
      <div class="item">
        <div class="item-header">
          <span>>>[name]<<</span>
          [[#if url]]— <a href=">>[url]<<">>>[url]<<</a>[[/if]]
        </div>
        <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
        [[#if description]]<div class="item-description">>>[description]<<</div>[[/if]]
        [[#if highlights]]
          <ul>[[#each highlights]]<li>>>[.]<<</li>[[/each]]</ul>
        [[/if]]
      </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- AWARDS -->
  [[#if awards]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.awards]]>>[meta.sectionHeaders.awards]<<[[/if]][[#if !meta.sectionHeaders.awards]]Awards[[/if]]</h2>
    [[#each awards]]
      [[#if enabled]]
        <div class="item">
          <div class="item-header">>>[title]<< — >>[awarder]<<</div>
          <div class="item-date">>>[date]<<</div>
          [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
        </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- CERTIFICATES -->
  [[#if certificates]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.certificates]]>>[meta.sectionHeaders.certificates]<<[[/if]][[#if !meta.sectionHeaders.certificates]]Certificates[[/if]]</h2>
    [[#each certificates]]
        <div class="item">
          <div class="item-header">
            >>[name]<< [[#if issuer]]— >>[issuer]<<[[/if]]
          </div>
          <div class="item-date">>>[date]<<</div>
        </div>
    [[/each]]
  </section>
  [[/if]]

  <!-- PUBLICATIONS -->
  [[#if publications]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.publications]]>>[meta.sectionHeaders.publications]<<[[/if]][[#if !meta.sectionHeaders.publications]]Publications[[/if]]</h2>
    [[#each publications]]
      [[#if enabled]]
        <div class="item">
<div class="item-header">
  >>[name]<< — <a href=">>[url]<<">>>[publisher]<<</a>
</div>          <div class="item-date">>>[releaseDate]<<</div>
          [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
        </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- INTERESTS -->
  [[#if interests]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.interests]]>>[meta.sectionHeaders.interests]<<[[/if]][[#if !meta.sectionHeaders.interests]]Interests[[/if]]</h2>
    [[#each interests]]
      [[#if enabled]]
        <div class="item">
          <strong>>>[name]<<</strong>
          [[#each keywords]]<span class="chip">>>[.]<<</span>[[/each]]
        </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

  <!-- REFERENCES -->
  [[#if references]]
  <section class="section">
    <h2>[[#if meta.sectionHeaders.references]]>>[meta.sectionHeaders.references]<<[[/if]][[#if !meta.sectionHeaders.references]]References[[/if]]</h2>
    [[#each references]]
      [[#if enabled]]
        <div class="item">
          <strong>>>[name]<<</strong>
          [[#if reference]]<div class="item-description">>>[reference]<<</div>[[/if]]
        </div>
      [[/if]]
    [[/each]]
  </section>
  [[/if]]

</main>
</div>
</body>
</html>
`.trim(),
  },
  minimal: {
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resume — >>[basics.name]<<</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    /* BASIC COLORS AND TYPOGRAPHY */
   :root {
  --bg: #ffffff;      /* page background = white */
  --fg: #000000;      /* main text = black */
  --muted: #444444;   /* secondary text = dark gray */
  --divider: #e5e5e5; /* section dividers */
  --accent: #000000;  /* for chips */
}

 body {
  margin: 0;
  font-family: "Segoe UI", Roboto, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: black;
  background-color: white;
}
a {
  color: var(--fg);
  text-decoration: none;
  word-break: break-word;
}
    a:empty {
      display: none;
    }

    /* CONTAINER */
    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* HEADER HIERARCHY */
    h1 {
      font-size: 32px;
      font-weight: 800;
      margin: 0;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 32px 0 12px 0;
      border-bottom: 1px solid var(--divider);
      padding-bottom: 4px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    h4 {
      font-size: 14px;
      font-weight: 600;
      margin: 8px 0 4px 0;
    }

    h1, h2, h3, h4, a {
  color: var(--fg);
}

    /* BASIC TEXT */
    p, li {
      font-size: 14px;
      color: var(--muted);
      margin: 4px 0;
    }

    ul {
      padding-left: 16px;
      margin: 4px 0;
    }

    /* AVATAR */
    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 16px auto;
      display: block;
    }

    /* SECTIONS */
    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* SKILLS INLINE WRAP */
.item {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.item strong {
  margin-right: 6px;
}

.chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--chip-bg);  /* dark chip */
  color: var(--chip-fg);       /* white text on chip */
  font-size: 12px;
}

    /* GRID FOR EDUCATION OR SKILLS IF NEEDED */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
  </style>
  
</head>

<body>
  <div class="container">

    <!-- HEADER -->
    [[#if basics.enabled]]
      [[#if basics.image]]
        <img class="avatar" src=">>[basics.image]<<" alt=">>[basics.name]<<">
      [[/if]]
      <h1>>>[basics.name]<<</h1>
      [[#if basics.label]]<h4>>>[basics.label]<<</h4>[[/if]]
      [[#if basics.summary]]<p>>>[basics.summary]<<</p>[[/if]]
    [[/if]]

    <!-- WORK EXPERIENCE -->
    [[#if work]]
      <section class="section">
        <h2>[[#if meta.sectionHeaders.work]]>>[meta.sectionHeaders.work]<<[[/if]][[#if !meta.sectionHeaders.work]]Work Experience[[/if]]</h2>
        [[#each work]]
          [[#if enabled]]
            <div class="item">
              <div class="item-header">
                <span>>>[position]<<</span>
                [[#if url]]— <a href=">>[url]<<">>>[name]<<</a>[[/if]]
              </div>
              <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
              [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
              [[#if highlights]]
                <ul>[[#each highlights]]<li>>>[.]<<</li>[[/each]]</ul>
              [[/if]]
            </div>
          [[/if]]
        [[/each]]
      </section>
    [[/if]]

    <!-- EDUCATION -->
    [[#if education]]
      <section class="section">
        <h2>[[#if meta.sectionHeaders.education]]>>[meta.sectionHeaders.education]<<[[/if]][[#if !meta.sectionHeaders.education]]Education[[/if]]</h2>
        <div class="grid">
          [[#each education]]
            [[#if enabled]]
              <div class="item">
                <div class="item-header">
                  <span>>>[studyType]<<</span> [[#if url]]— <a href=">>[url]<<">>>[institution]<<</a>[[/if]]
                </div>
                <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
                [[#if area]]<div class="item-description">>>[area]<<</div>[[/if]]
                [[#if score]]<div class="item-description">Score: >>[score]<<</div>[[/if]]
              </div>
            [[/if]]
          [[/each]]
        </div>
      </section>
    [[/if]]

    <!-- SKILLS -->
[[#if skills]]
  <section class="section">
    <h2>Technical Skills</h2>
    [[#each skills]]
      <div class="item">
        <strong>>>[name]<<:</strong>
        [[#each keywords]]<span class="chip">>>[.]<<</span>[[/each]]
      </div>
    [[/each]]
  </section>
[[/if]]


    <!-- VOLUNTEER -->
    [[#if volunteer]]
      <section class="section">
        <h2>[[#if meta.sectionHeaders.volunteer]]>>[meta.sectionHeaders.volunteer]<<[[/if]][[#if !meta.sectionHeaders.volunteer]]Volunteer[[/if]]</h2>
        [[#each volunteer]]
          [[#if enabled]]
            <div class="item">
              <div class="item-header">
                <span>>>[position]<<</span> — <span>>>[organization]<<</span>
              </div>
              <div class="item-date">>>[startDate]<< – >>[endDate]<<</div>
              [[#if summary]]<div class="item-description">>>[summary]<<</div>[[/if]]
            </div>
          [[/if]]
        [[/each]]
      </section>
    [[/if]]

    <!-- PROJECTS -->
    [[#if projects]]
      <section class="section">
        <h2>[[#if meta.sectionHeaders.projects]]>>[meta.sectionHeaders.projects]<<[[/if]][[#if !meta.sectionHeaders.projects]]Projects[[/if]]</h2>
        [[#each projects]]
          [[#if enabled]]
            <div class="item">
              <div class="item-header">
                <span>>>[name]<<</span>
                [[#if url]]— <a href=">>[url]<<">>>[url]<<</a>[[/if]]
              </div>
              [[#if description]]<div class="item-description">>>[description]<<</div>[[/if]]
            </div>
          [[/if]]
        [[/each]]
      </section>
    [[/if]]

  </div>
</body>
</html>
`.trim(),
  },
} as const
