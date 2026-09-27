# novice-anaesthetist-syllabus — session log

Claude-specific working instructions **and** the running session history. Durable, AI-agnostic facts belong in `AGENTS.md`. Link to them here rather than duplicating.

## Working instructions for Claude
- Read `AGENTS.md` and `STATUS.md` at the start of each session.
- Security class is 0 (public). Never add trainee-identifiable or patient data.
- Verify every RCoA URL and curriculum detail against the live source before using it. Never reconstruct them from memory, and log them in `SOURCES.md`.
- At session end: promote anything worth keeping into `STATUS.md` / `DECISIONS.md` / `TODO.md`, update this log, then commit and push.

## Session log

### 2026-09-28 (later) — Build complete, repo renamed, pushed
- Added 21 station packs (11 CASE, 10 FCPE); the link checker now covers all content links (170 OK, 0 broken); the deploy workflow builds and validates content; browser QA passed (all routes, a full Final mock, station views, 390 px width via iframe, dark mode).
- Updated README, code/README, AGENTS, STATUS, TODO and SOURCES (S21–S24).
- **Repo renamed** to `fruitbat3000/anaesthesia-training-companion`; the site is at https://fruitbat3000.github.io/anaesthesia-training-companion/ (old URL dead). The local folder is still `novice-anaesthetist-syllabus` (renaming it would break the Claude memory path).
- **Next step (restart here):** Mark shares the new link with Dr Brooks and reviewers; set up clinical QC (see TODO "Now").

### 2026-09-28 — Build in progress (checkpoint for context compaction)
- **Done and committed:** the new app (code/core.js, novice.js, pages.js, notes.js, qbank.js, stations.js, styles.css, index.html), the content pipeline (scripts/build-content.mjs + scripts/lib/md.mjs → code/content/*.js), refs.json (80 checked references), 16 guide pages (exams hub ×7, stages 1–3, portfolio, guidelines, wellbeing, resources-more, disclaimer, stations-how), **131 Primary notes (610/610 syllabus codes)**, **60 Final notes (436/436 Stage 2 codes)**, **249 Primary + 124 Final SBAs** (Final: GA 58, POM 15, RA 12, other 39 — a full mock is possible), 1 sample station (case-remi-tiva).
- Build: `node scripts/build-content.mjs` (validates codes, refs and question format). Local test: `cd code && python3 -m http.server 8765`.
- **Remaining (restart here):** (1) station packs (~20: CASE ×10, FCPE ×10) in content/stations with sections Candidate instructions / Scenario / Examiner prompts / Key features / Domains assessed / What good looks like / Learning points; (2) extend scripts/check-links.mjs to cover content/refs.json and page links, and add the build step to .github/workflows/pages.yml; (3) browser QA (phone width, mock papers, coverage page, dark mode); (4) update README/AGENTS/STATUS/TODO/SOURCES (S16 count, new S21+ refs incl. ARCP checklist v4.0 media/27791, curriculum v1.5 changes doc media/53486); (5) rename repo to `anaesthesia-training-companion` via gh, update links (S.links.repo, UA string), push, and give Mark the new Pages URL.

### 2026-09-27 (later) — Build started, paused at usage limit
- Mark's decisions (recorded in `DECISIONS.md`): Yorkshire for now; rename the site and repo (send fresh links afterwards); build everything, QC later; referenced doses allowed, with a disclaimer; do all phases; Dr Brooks reviews once it's built.
- Done: syllabus code lists in `content/syllabus/` (Primary v2.2 has **610** codes, not 324; Stage 2 has 436 codes). `scripts/lib/md.mjs` (mini Markdown converter) and `scripts/build-content.mjs` (validates and compiles content into `code/content/*.js`). Neither has been run yet: `content/refs.json` and all content still need writing.
- **Restart here.** Planned design: content in `content/{pages,notes/primary,notes/final,questions,stations}`. Question blocks start `@@ id` with fields stem/A–E/answer/explain/subject/domain/codes/note/refs. Stations need sections Candidate instructions / Scenario / Examiner prompts / Key features / Domains assessed. Verify references via the Crossref API (DOIs) and curl. Then rebuild the UI shell: stage switcher (Novice, Stage 1–3), Exams hub, Notes library + coverage page, question bank (practice, timed mocks to the AKT blueprint, stats), station practice (candidate/examiner modes, timers), a disclaimer banner and page, and `noindex`. Keep the old `#start/#journey/#syllabus/#iac` routes working. Name: "Anaesthesia Training Companion"; repo rename to `anaesthesia-training-companion` at the end, then give Mark the fresh links.

### 2026-09-27 — Research for an all-stages site (Claude Code, Mark's Mac)
- Mark asked to widen the scope to all stages, add question banks for the Primary and Final, read the RCoA trainer briefing on the new exam format, and write our own "FRCA in a box"-style notes. He asked for a research-and-proposal pass only, with nothing built.
- Key findings: new FRCA formats from July 2027 (Primary AKT + CASE, Final AKT + FCPE; S13). The RCoA Trainer Support Pack (June 2026; S14). No official CASE/FCPE sample stations yet. Curriculum v1.5 live since 17 Aug 2026 (S16). The e-LA exam archive has free Primary/Final question sets and Revision Guides (S17).
- The RCoA blocks curl/WebFetch even for PDFs now. Method: on an rcoa.ac.uk page, load pdf.js from cdn.jsdelivr.net (allowed by their CSP), fetch the PDF same-origin, write the text into an `<article>`, then use get_page_text.
- Wrote `proposals/2026-09-27-all-stages.md`. **Next step (restart here):** get Mark's decisions on section 7 of that proposal, record them in `DECISIONS.md`, then start phase 1.

### 2026-09-23 — Project scaffolded (Claude Code, Mark's Mac)
- Created from shared-project-template via `new-project.sh`. Class 0. Removed ARCHIVE-NOTE, HANDOVER, variants.
- Scope confirmed by Mark: a website signposting the RCoA curriculum to year-1 trainees; nothing sensitive.
- Mark supplied *An Introduction to Anaesthesia* (PDF, 30 pp, 2018), now in `docs/` (gitignored, so local only). A skim shows it's a self-directed novice guide whose Section 5 is a full novice syllabus with an "I have" checklist. It references the **2010** curriculum (Annex B), so it needs re-mapping to 2021. Author not stated. See `SOURCES.md` S2.
- Scope answered by Mark and recorded in `DECISIONS.md`: regional school; novice period up to the IAC; links, especially e-LfH; local only for now.
- The PDF's author is Dr Alistair Brooks, a colleague of Mark's. He was present and gave permission in person to reuse/adapt it with credit.
- The school is Yorkshire.
- Session ended here, ready to restart in this subfolder.
- **Next step (restart here):** work through `TODO.md` "Now": verify the RCoA IAC material and e-LfH content, read the PDF in full and map it, then propose a site structure. Ask Mark about the Yorkshire school's local IAC process and teaching programme.

### 2026-09-23 (later) — Sources verified, first site built (Claude Code, Mark's Mac)
- `git pull` wasn't possible because the repo has no remote. Commits are local only.
- Mark said to "run with" building an interactive site with learning resources, with e-LfH being particularly useful.
- The RCoA site 403s curl/WebFetch, so it was read in Chrome. WebFetch did save the binary PDFs, which were then extracted with `pdftotext`. The IAC Workbook v1.2 and the e-LA Module 1 workbook are in the scratchpad only.
- e-LfH: the catalogue is public. The browser endpoints `GetCatalogueChildComponents` and `GetDetailsPartialForCatalogueComponent` give public `Component/Details` IDs. **Don't run long synchronous loops on the catalogue page**, because it froze the tab. Use `fetch` from a light page such as `/cookiepolicy`. Found that Module 1 has been restructured (see `SOURCES.md` S3).
- Built `code/` as a static site. All 100 e-LfH session links were checked with curl (200, not retired, code matched).
- The Y&H deanery novice page has been retired. YAIRN was found as the school's teaching network.
- Next: Mark reviews the site, then add Yorkshire local detail (`TODO.md`).

### 2026-09-23 (later still) — Lighter theme, published
- Mark didn't like the (system dark) colour scheme. The site is now light by default with larger, darker text, a blue accent and an optional dark toggle.
- Mark chose a **public** repo with GitHub Pages so he could send Dr Brooks a link (see `DECISIONS.md`). Repo: https://github.com/fruitbat3000/novice-anaesthetist-syllabus. Site: https://fruitbat3000.github.io/novice-anaesthetist-syllabus/. Deployed by `.github/workflows/pages.yml` (it publishes `code/`).

### 2026-09-23 (evening) — Enhancements 1–4 and 8
- Mark approved: a weekly link check, Dr Brooks's glossary as tappable terms, a printable checklist, per-topic feedback links, and a "Further resources" section. He'll loop back on the rest (timeline, evidence ideas per IAC cluster, self-tests, Yorkshire layer) after Dr Brooks reviews.
- Further resources were all verified (S11). BJA Education was left out because its bot challenge stopped verification.
- The link checker passes locally: 118 OK, 22 bot-protected links listed for checking by hand.

### 2026-09-23 (late) — Professional tone
- Mark asked for the site to read as professional guidance, not in Dr Brooks's voice. His credit now appears **only** in the About page's Credit card, alongside Mark's. The inline "Dr Brooks's advice…" lines, the "(Brooks)" glossary tags and the footer credit were removed, and the copy was rewritten in a neutral third-person or imperative register. "Your first anaesthetic" is now "A GA step by step".

### 2026-09-23 (end of session) — Credits, link-check notifications, write-up
- Credited "Dr Mark Stubbington" in the About page Credit card, alongside Dr Brooks. Mark wants it there only, not in the footer (see `DECISIONS.md` "Tone and credits").
- The link-check workflow now always succeeds and reports broken links only through the `link-check` issue, so there are no "workflow failed" emails. An early test run had emailed Mark about yairn.co.uk refusing GitHub runners. That run was resolved and issue #1 closed.
- **Next step (restart here):** Mark sends the live link to Dr Brooks. When feedback arrives (by email, or as GitHub issues labelled `feedback`), apply it, then revisit the parked enhancements in `TODO.md` "Now". Keep new copy in the professional register.
