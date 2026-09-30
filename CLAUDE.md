# novice-anaesthetist-syllabus — session log

Claude-specific working instructions **and** the running session history. Durable, AI-agnostic facts belong in `AGENTS.md`. Link to them here rather than duplicating.

## Working instructions for Claude
- Read `AGENTS.md` and `STATUS.md` at the start of each session.
- Security class is 0 (public). Never add trainee-identifiable or patient data.
- Verify every RCoA URL and curriculum detail against the live source before using it. Never reconstruct them from memory, and log them in `SOURCES.md`.
- At session end: promote anything worth keeping into `STATUS.md` / `DECISIONS.md` / `TODO.md`, update this log, then commit and push.

## Session log

### 2026-09-30 — Four-part syllabus overview; e-LA Revision Guides
- Mark asked for a syllabus landing page keeping the four-box syllabus from Dr Brooks's guide (p. 23 diagram: basic sciences, medicine and surgery, generic anaesthesia, anaesthetic specialities), with each box linking through to content and resources, filterable by Novice / Primary / Final.
- Built `#map` (old `#map` default of the Primary map now goes to the overview; `#map/primary` and `#map/final` unchanged, and `#map/<exam>/<subject>` now scrolls to that subject). Mapping in `content/syllabus/overview.json`, validated and compiled by the build (every note and novice topic placed; `x-selftest` deliberately unmapped). Boxes were first laid out 4 | 1 over 3 | 2 as in the diagram; Mark later asked for reading order, 1 | 2 over 3 | 4 ("less mind map, more intuitive"); they stack 1 → 4 on phones; sections fold, with "Expand all"; filter kept in the URL (`?level=`), and opening it from a stage menu keeps that stage's colour.
- Placement is Claude's judgement where the 2010-era boxes don't match modern notes (e.g. Final POM disease notes under co-morbidities, vascular added under general duties, a "professional practice" strip across all four). Worth Dr Brooks checking.
- Credit stays on the About page only (DECISIONS "Tone and credits"); the page says the structure is adapted from the guide credited there.
- Pushed; then Mark asked for a less fussy landing page with more colour and design. Redesigned: each box has its own colour and icon, sections are pill links with counts, and a "Syllabus" hub sits where the four boxes meet. Each section (e.g. Physiology) is now its own page (`#map/<box>/<section>`) with cards grouped by level and by syllabus-map topic group, sibling-section tabs, textbooks and resources, and previous/next.
- The "Syllabus" hub is now placed by JS on the real junction of the four boxes (rows differ in height). The box grid is shared (`App.syllabusBoxes`) and also sits on the home page after "Where are you in training?", with its own level filter.
- Mark added the e-LA Revision Guides (Physiology, Pharmacology, Physics; RCoA/e-LfH, 2020) to `docs/` and said "all 3 - go" to: (1) guide pointers on notes, (2) guides as sources, (3) an accuracy cross-check. Done (1) and (2): 115 guide topics with page and e-LA session codes in `content/elaguides.json`, mapped to 65 Primary notes (+ `cpet-risk`, `remote-ect-mri`) as an "e-LA Revision Guide" card; guides added to refs and to the Physiology/Pharmacology/Physics/Measurement map resources (S34). All 121 session and 3 guide e-LfH Details ids resolved in Chrome and checked with curl; the link checker now covers them (518 OK, 0 problems). e-LfH renumbered LASERs 07d_03_09 → 07d_04_09. No guide text is reproduced.
- e-LfH method that works (Chrome, on a catalogue page): module sections come from the Knockout node's `Children` (the child API returns `[]` for module ids); `GET /Catalogue/GetCatalogueChildComponents?ParentComponentId=<section>&RootComponentId=14` lists sessions; `POST /Component/GetDetailsPartialForCatalogueComponent/` with `componentDetails={"ComponentId","ParentIds","callingFunction":"2"}` returns HTML containing `Component/Details/<id>`. Tool output containing query strings gets blocked, so return only `code:id` pairs.
- (3) Accuracy cross-check is **running** on the local model (qwen3.8) at session close: `docs/qc/qc.py` (not in git; resumable, skips notes already done) writes `docs/qc/qc-results.jsonl` (12 of 65 notes done at close, ~4 min each). For each note it lists contradictions with the guide and up to 3 missing examinable points. The test note (cardiac cycle) found real gaps: S3/S4, atrial kick up to 40% in tachycardia, diastole shortening with heart rate.
- Mark reported the home-page level filter didn't work: `$$` wasn't imported in `pages.js` (fixed). His re-test then hit GitHub Pages' 10-minute cache, so the build now fingerprints scripts, the stylesheet and lazy content parts (`?v=`).
- Mark: Medicine and surgery had only 17 topics. Filled from Brooks's own box 2 list (investigations, co-morbidity drug management, emergency resuscitation). Then Mark asked for it to be "more exhaustive" and cross-checked against the syllabus, using BJA Education for inspiration: every RCoA syllabus section (212 code groups) now has a home in the boxes (`overview.json` → `syllabus`); the build adds notes by their codes (≥25% or ≥3 codes, with reviewed exclusions) and fails on an unhoused section. All 726 BJA Education reviews (Crossref, S35) classified by Claude into box sections and listed on section pages (the link check confirms the DOIs: 1,049 OK). Gap list for new notes in TODO.
- Notes from the first 23 e-LA guide cross-check results were reviewed and edited (commit "Notes cross-checked…"); the guide's HbSS "left shift" claim was rejected (HbS is right-shifted).
- **Next step (restart here):** check `docs/qc/qc.log` ends with DONE (if not, rerun `python3 docs/qc/qc.py`). Then review every flag against the guide text in `docs/qc/*.txt`, fix genuine errors and add clearly examinable gaps in our own words (keep draft status), rebuild, and give Mark a summary of changes and rejected flags. Then the standing next steps from 2026-09-28 (evening).

### 2026-09-28 (evening) — BJA Education pointers, GPAS, IACOA
- Mark asked whether to signpost BJA Education from topics (yes) and added GPAS chapters and the IAC/IACOA workbooks to `docs/`.
- 197 BJA Education articles chosen by hand for 144 notes from Crossref searches (`content/bjaed.json`, S31). Shown as "Read next in BJA Education" on notes and as a count on the syllabus maps; the link check confirms the DOIs via Crossref in batches (parallel requests hit a 429).
- Mistake: one early Crossref test request included Mark's email as the polite-pool `mailto`; removed at once and told Mark. Do not send it to outside services.
- GPAS chapters 1, 2, 5–19 (`content/gpas.json`, S32): links taken from the live RCoA index (they don't follow one pattern); shown on unit guides, SIAs and the guidelines page.
- IACOA workbook read (S33); Stage 1 obstetrics guide now has EPA 3 and 4, timing, level 3 entrustment and sign-off steps.
- Session closed here. **Next step (restart here):** Mark shares the site with the working group, settles the licence with Dr Brooks and asks about YAIRN hosting. For Claude: the remaining work is in `TODO.md` ("From the working group emails" and "Soon"), starting with the 47 notes without BJA Education pointers, the installable-app (PWA) option and the contributor guide.

### 2026-09-28 (afternoon) — Working group emails; syllabus maps
- Mark shared the working-group email thread (Dr Brooks, the LTHT College Tutor, a Mid Yorkshire resident with web experience). Gap analysis recorded in TODO. Names and roles are in Claude memory only; the repo refers to people by role.
- Built readable Primary and Final syllabus maps (`#map/primary`, `#map/final`, `code/syllabus-map.js`, `content/syllabus/map.json`): topics by paper and subject, red/amber/green ratings, a "revise next" list, core textbooks (verified editions, `content/texts.json`, S29) and free resources per subject, plus an RCoA-section view labelled with the paraphrased capability wording.
- Mark: sync is tbc; licence to be explained; hosting probably with YAIRN, which would allow a progress database (DECISIONS 2026-09-28, hosting).

### 2026-09-28 (day) — Stages 1–3 brought up to Novice depth
- Mark: stage menus should expand like Novice, stage colours should run through the menu, the e-LA modules weren't links, and Stages 1–3 felt "tacked on". Then: "make the whole thing as comprehensive, yet clear and easy to navigate as possible."
- Stage colours (amber/blue/teal/violet) now run through the sidebar and stage pages. Stage menus have subheadings and progress (capabilities, and notes and questions for the stage's exam).
- e-LA module catalogue links verified in Chrome (S25) and linked from the stage tables.
- Read all 42 RCoA learning syllabus domain pages (v1.5) and all 26 SIA pages, plus the EPA/IACOA and Triple C assessment guidance (S26–S28). Paraphrased into `content/capabilities/` (598 capabilities in total); new `code/stages.js` gives tickable checklists, a stage hub, 20 unit guides (`content/units/`), SIA pages and printable checklists. Search indexes them; the link checker covers them.
- The RCoA's Cloudflare started refusing scripted fetches after ~70 page loads; the IACOA workbook PDF could not be read (TODO).
- Headless Chrome (`--headless=new --screenshot`) works for QA while Mark's browser window is minimised, but only for unscrolled views.

### 2026-09-28 (morning) — Review fixes: banner, "null", novice integration, stage pages
- Disclaimer banner didn't hide on "I understand" (CSS `display:flex` beat `[hidden]`); added a global `[hidden]` rule.
- "null" on the question bank: `replaceChildren()` prints null args; core.js now filters them (as `el()` does).
- Novice: sidebar sub-menu has subheadings (Get started / Syllabus by domain with counts / Sign-off / Reference) and a progress block; start page shows per-domain progress bars; each syllabus topic has "Go further" links to Primary notes and a "Test yourself" question session (`#questions/topic/<id>`, mapping `DEEPER` in novice.js); prev/next pager through the novice pages; page headers match the rest of the site.
- Stage 1–3 pages: "at a glance" cards (`::: glance`), ### subheadings, notes lists folded by subject, timeline moved to the end. Facts unchanged.
- QA note: when Mark's Chrome window is minimised, MCP screenshots come out blank; use headless Chrome (`--headless=new --screenshot`) instead.

### 2026-09-27 (later) — Visual redesign
- Mark: "content is great, it's got all the aesthetic charm of a github repo". Asked for a modern, clean, slick look.
- Researched current docs/SaaS sites. The new design is docs-style: a sticky blurred top bar, a grouped left sidebar (a drawer on phones), ⌘K / "/" command-palette search, an "On this page" rail, card-based home with a gradient hero, and Geist / Geist Mono / Instrument Serif fonts. Light and dark themes. `code/styles.css` was fully rewritten. " · " lists in content now render as tag chips (`md.mjs`).
- Mark's screenshot showed text cut off at the right edge. Couldn't reproduce this at 390/913/1100/1400/2241 px; probably the screenshot crop.
- **Next step:** Mark reviews the look; then Dr Brooks's content review as before.

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
