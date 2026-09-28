# Decision records — novice-anaesthetist-syllabus

Accepted decisions, newest first. One entry per decision. A decision here **overrides** session notes and status (see source-of-truth precedence). Do not record speculation; open questions live in `TODO.md`.

---

## 2026-09-28 — Syllabus maps with reading pointers; hosting direction (proposed)

**Decision (Mark):** build a readable syllabus map with pointers to core textbooks and other resources. Cross-device sync is "tbc". Hosting "can probably" be with YAIRN if the LTHT College Tutor agrees, which would allow a database for user progress.

**What was built:** Primary and Final syllabus maps (topics by paper and subject, red/amber/green self-rating, core texts and free resources per subject, and an RCoA-section view). Progress stays in the browser for now.

**Consequences if YAIRN hosting with a database goes ahead:** storing trainee progress against accounts is personal data. It needs a data protection impact assessment, a named data controller (probably YAIRN or the school), a lawful basis and privacy notice, and a new security classification for the project (it is class 0 because it holds no trainee data). The static site can stay as it is, with an optional sign-in and sync layer added, so nothing is lost if hosting takes time.

**Status:** hosting proposed, pending the College Tutor and YAIRN; syllabus maps accepted

---

## 2026-09-28 — Stages 1–3 get the same depth as the Novice section

**Decision (Mark):** "go and make the whole thing as comprehensive, yet clear and easy to navigate as possible." Stages 1–3 should not feel like afterthoughts next to the Novice section, and each stage keeps its home-page colour through the menu and its pages.

**What this means:** each stage has an overview, a tickable checklist of every RCoA key capability (paraphrased from the v1.5 learning syllabus, letters and supervision levels kept), unit guides for each clinical block (Stages 1 and 2), all 26 Special Interest Areas (Stage 3), a printable checklist, and progress in the sidebar. Ticks are a personal record saved in the browser; sign-off remains the HALOs on the LLP.

**Consequences:** RCoA curriculum text is paraphrased, never copied, and every domain links back to the RCoA page (S26–S28). Unit guides are original draft guidance and need clinical QC like the notes.

**Status:** accepted

---

## 2026-09-27 — Widen to all stages; build notes, question bank and station practice

**Decision (Mark, answering section 7 of `proposals/2026-09-27-all-stages.md`):**
1. **Audience:** all stages of anaesthetic training (novice to CCT), still focused on the Yorkshire & Humber school "for now". Content is mostly national, with a Yorkshire layer.
2. **Name/URL:** rename the site and the repo. Mark will send fresh links (to Dr Brooks and others) after the build.
3. **Review model:** build everything now, "looking super pro", and do quality control in due course. Every note, question and station carries a review status (draft until a clinician signs it off), shown discreetly.
4. **Doses and numbers:** allowed in revision material when referenced. The site must carry a clear disclaimer: educational material only, not medical advice, no liability, and doses to be checked against the BNF and local policy.
5. **Scope of work:** all phases (stage pages, exams hub, revision notes for the Primary and Final, SBA question bank, CASE/FCPE station practice, stage 3 detail).
6. **Dr Brooks** will review once it is built.

**Context:** Mark gave "full authority" to build the most useful training resource possible.

**Consequences:** This **supersedes** the 2026-09-23 scope decision (novice period up to the IAC) and relaxes the "no doses" note in S12 for revision material (the glossary stays dose-free). The site should stay out of search engines (`noindex`) until QC is done, because the repo and Pages site are public. Content is written as original material. Nothing is copied from textbooks, commercial banks or RCoA sample questions.

**Status:** accepted

---

## 2026-09-23 — Tone and credits

**Decision:** The site reads as neutral professional guidance, not in Dr Brooks's voice. Contributors are credited **only** in the Credit card on the About page: Dr Alistair Brooks (source guide, adapted with permission, including the glossary) and Dr Mark Stubbington (compiled and maintains the site). There are no inline attributions ("Dr Brooks's advice…", "(Brooks)" tags) and no footer credit.

**Context:** Mark found the attributed, first-person-style lines "a bit noddy" and wanted "just a website of professional guidance".

**Options considered:** attribute inline throughout; credit in the footer on every page; credit once on the About page.

**Rationale:** One clear credit meets the permission condition (reuse with credit) while keeping the guidance impersonal and authoritative in tone.

**Consequences:** New content should use a third-person or imperative register ("Flush the cannula immediately…") and should not add per-item attribution. The About page credit covers adapted material.

**Status:** accepted

---

## 2026-09-23 — Publish publicly on GitHub Pages for review

**Decision:** Push to a **public** GitHub repo (`fruitbat3000/novice-anaesthetist-syllabus`) and publish `code/` with GitHub Pages, so Mark can send Dr Brooks a link. The site is now light by default, with an optional dark mode.

**Context:** Mark wanted to share the site with Dr Brooks. GitHub Pages on a private repo needs a paid plan. Mark chose public over a private repo or a private claude.ai page.

**Options considered:** a public repo with Pages; a private repo with Al invited as a collaborator; a private repo plus a private claude.ai page.

**Rationale:** The content is class 0 (published curriculum material and links, with no trainee or patient data), and a clickable link is the simplest way for a reviewer to see it.

**Consequences:** This **supersedes "local only for now"** in the scope decision below. The site is publicly reachable before school sign-off, so treat it as a draft. `docs/` (Dr Brooks's PDF) stays out of git. Deployment is by `.github/workflows/pages.yml` on every push to `main`.

**Status:** accepted

---

## 2026-09-23 — Site structure and technology (first version)

**Decision:**
- **Technology:** a static site in `code/` (plain HTML, CSS and JS, no build step and no dependencies) that opens directly from `index.html`. All content lives in `code/data.js`.
- **Structure:** six views: *Start here*, *Your first anaesthetic* (Dr Brooks's worked GA, in stages), *Syllabus* (his domain → group → topic structure, with each topic linked to e-LA sessions and tagged by IAC Key Capability cluster), *The IAC*, *Resources*, *About*.
- **Interactivity:** "I have covered this" ticks per topic and per e-LA session, progress bars, search, IAC cluster filters, a "start here only" filter, deep links to topics, and export/import of progress. Progress is stored in the viewer's browser only (`localStorage`).
- **Mapping:** topics link to the **current live** e-LA sessions. Retired Module 1 basic-science sessions are replaced by their Module 07a–07e equivalents. The 2010 WPBA list in Dr Brooks's guide is dropped in favour of the 2021 IAC clusters and evidence types.

**Context:** Mark asked Claude to "run with" building an interactive site with learning resources, emphasising e-LfH. The structure is Claude's choice for Mark to review.

**Options considered:** a static site generator (e.g. Eleventy) vs plain files; organising by week vs by IAC cluster vs by Dr Brooks's structure.

**Rationale:** Plain files keep it local-only with nothing to install, easy to hand to the school later, and easy to host anywhere. Dr Brooks's structure is the one he designed for novices and it scales to the exams. IAC tags and the worked-GA view give the other two ways in without duplicating content.

**Consequences:** Hosting later is a file copy. Links need periodic re-checking (method in `SOURCES.md`). If the school wants shared or tracked progress, that needs a different approach.

**Status:** accepted (pending Mark's review of the content)

---

## 2026-09-23 — Dr Alistair Brooks's guide may be reused

**Decision:** The site may credit, link to and adapt Dr Alistair Brooks's *An Introduction to Anaesthesia* (`SOURCES.md` S2).

**Context:** Dr Brooks gave permission in person to Mark on 2026-09-23. It was verbal, with Dr Brooks present during the session.

**Options considered:** Link only to RCoA/e-LfH without using the guide; use the guide with permission.

**Rationale:** The guide already has a novice syllabus and a teaching approach built for exactly this audience.

**Consequences:** The guide can form the backbone of the site's structure. Credit Dr Brooks on the site. Update anything that's outdated (it was written against the 2010 curriculum) rather than presenting it as current.

**Status:** accepted

---

## 2026-09-23 — Scope of the site

**Decision:**
- **Audience:** novice trainees in the Yorkshire regional school of anaesthesia.
- **Timespan:** the novice period up to the Initial Assessment of Competence (IAC).
- **Depth:** mainly links, especially to e-Learning for Healthcare (e-LfH) modules. Content is signposting, not original teaching material.
- **Access:** local only for now (run and viewed on Mark's machine). Public or school-wide hosting is a later decision.

**Context:** Answers from Mark to the scoping questions at project start.

**Options considered:** national vs regional audience; up to IAC vs all of CT1; links only vs adding local teaching; public vs restricted.

**Rationale:** Keeping the first version narrow and local makes it quick to build and easy to check before anyone else sees it.

**Consequences:** The site is organised around what a novice needs before the IAC. Each topic links to the relevant RCoA curriculum item and e-LfH module(s). No hosting or domain work is needed yet.

**Status:** accepted
