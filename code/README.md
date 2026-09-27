# Site source

A static site with no dependencies. The app (HTML, CSS, JS) has no build step and opens straight from the file system; the revision content is compiled from `content/` by `scripts/build-content.mjs` into `code/content/*.js` (generated files are committed, and the deploy workflow rebuilds them).

## View it

Open `index.html` in a browser, or serve it:

```
cd code
python3 -m http.server 8000
```

Then go to http://localhost:8000.

## App files

- `index.html` — page shell, the novice section's static text, About page
- `data.js` — novice syllabus data, e-LfH session links, glossary, shared links
- `core.js` — helpers, router, site search, theme, disclaimer banner, progress export/import
- `novice.js` — novice section (start, GA step by step, syllabus, IAC, glossary, checklist)
- `pages.js` — home page, guide pages from `content/pages`, page widgets (`{{timeline}}`, `{{notes …}}`, `{{stats}}`, `{{exam-table}}`)
- `notes.js` — revision notes library, note reader, syllabus coverage map
- `qbank.js` — question bank: practice sessions, timed mock papers to the AKT blueprint, results, progress
- `stations.js` — CASE/FCPE station list and runner (candidate/examiner views, timer, mark sheet, summary)
- `styles.css` — light theme by default with a dark theme; print styles
- `content/` — generated; do not edit

## Editing content (in `content/`, then run `node scripts/build-content.mjs`)

- **Note:** a Markdown file with front matter `title, subject, codes, refs, related, summary, order, status`. `codes` must be real RCoA syllabus codes (Primary v2.2 or Stage 2); `refs` must be ids in `content/refs.json`. End with an `> [!exam] In the exam` box.
- **Question:** a block in `content/questions/*.md` starting `@@ id`, with `subject` (Primary) or `subject` + `domain` (Final), `codes`, `note`, `stem`, `A`–`E`, `answer`, `explain`, optional `refs`. Explain every option.
- **Station:** Markdown with front matter (`exam: case|fcpe`, `arena`, `domain`, `group`, `science`, `skills`) and sections `## Candidate instructions`, `## Scenario`, `## Examiner prompts`, `## Key features` (a bullet list: becomes the checklist), `## Domains assessed`, `## What good looks like`, `## Learning points`.
- **Review status:** set `status: reviewed` (notes and stations in front matter; questions as a field) once a clinician has checked the item, and add the reviewer's name to the About page credits.
- The build fails on unknown codes, unknown references, malformed questions or missing station sections.

## Progress storage

Everything is saved only in the viewer's browser (`localStorage`): novice ticks (`nas-progress-v1`), notes read (`atc-notes-v1`), question history (`atc-qbank-v1`), sessions (`atc-sessions-v1`), station records (`atc-stations-v1`). The About page exports and imports all of them.
