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
- `syllabus-map.js` — the four-part syllabus overview (`#map`, filterable with `?level=novice|primary|final`) and the readable Primary and Final syllabus maps: topics by paper and subject with red/amber/green self-rating, core textbooks and free resources, and the RCoA section view
- `stages.js` — Stages 1–3: key capability checklists, unit guides, Special Interest Areas, printable checklists, the stage hub and sidebar progress
- `styles.css` — light theme by default with a dark theme; print styles
- `content/` — generated; do not edit

## Editing content (in `content/`, then run `node scripts/build-content.mjs`)

- **Note:** a Markdown file with front matter `title, subject, codes, refs, related, summary, order, status`. `codes` must be real RCoA syllabus codes (Primary v2.2 or Stage 2); `refs` must be ids in `content/refs.json`. End with an `> [!exam] In the exam` box.
- **Question:** a block in `content/questions/*.md` starting `@@ id`, with `subject` (Primary) or `subject` + `domain` (Final), `codes`, `note`, `stem`, `A`–`E`, `answer`, `explain`, optional `refs`. Explain every option.
- **Station:** Markdown with front matter (`exam: case|fcpe`, `arena`, `domain`, `group`, `science`, `skills`) and sections `## Candidate instructions`, `## Scenario`, `## Examiner prompts`, `## Key features` (a bullet list: becomes the checklist), `## Domains assessed`, `## What good looks like`, `## Learning points`.
- **Capabilities:** `content/capabilities/stage-N.md` and `sias.md`. Each `## id | generic|clinical|sia | Name` block has `rcoa:` (link), `outcome:`, optional `### Group` headings, capability lines `- A [2b]: text` (RCoA letter, optional supervision level), and optional `evidence:` (items separated by " · "), `notes:`, `stations:`, `ela:` (module codes such as `05b`, or `icm`). SIAs also take `group:` and `length:`. Paraphrase the RCoA text; do not copy it.
- **Unit guide:** `content/units/*.md` with front matter `stage, order, title, short, lede, updated`. `{{caps stage-1 ga Q,R}}` embeds those capabilities as live tick boxes (omit the letters for the whole domain). The build checks every widget and every `#notes/…` and `#stations/…` link.
- **Syllabus map:** `content/syllabus/map.json` groups every note into papers, subjects and topic groups, and names the core texts (ids in `content/texts.json`, with edition, year, publisher and ISBN), free resources (`refs.json` ids) and e-LA modules for each subject. The build fails if a note is missing or listed twice.
- **Four-part overview:** `content/syllabus/overview.json` places every novice topic (`n:id`), Primary and Final note (plain id), unit guide (`u:id`) and SIA (`s:id`) in the four boxes of the source novice guide (basic sciences, medicine and surgery, generic anaesthesia, anaesthetic specialities), with optional `maps` pointing each section at syllabus-map subjects for texts and resources. The build fails if a note or novice topic is left off (except those listed in `unmapped`).
- **BJA Education and GPAS:** `content/bjaed.json` maps note ids to BJA Education DOIs (with Crossref metadata); `content/gpas.json` lists GPAS chapters and which unit guides and SIAs they belong to. The build checks every id.
- **Review status:** set `status: reviewed` (notes and stations in front matter; questions as a field) once a clinician has checked the item, and add the reviewer's name to the About page credits.
- The build fails on unknown codes, unknown references, malformed questions or missing station sections.

## Progress storage

Everything is saved only in the viewer's browser (`localStorage`): novice ticks (`nas-progress-v1`), notes read (`atc-notes-v1`), question history (`atc-qbank-v1`), sessions (`atc-sessions-v1`), station records (`atc-stations-v1`), capability ticks (`atc-caps-v1`), syllabus map ratings (`atc-rag-v1`). The About page exports and imports all of them.
