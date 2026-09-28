# Anaesthesia Training Companion

A website for anaesthetists in training in the Yorkshire and Humber school, from the first day in theatre to the CCT. It brings together the RCoA 2021 curriculum by stage, a guide to the FRCA (including the new formats from July 2027), original revision notes mapped to the RCoA syllabus codes, single-best-answer practice questions with mock papers, and CASE/FCPE station practice packs. It signposts official material and does not replace it.

**Live draft:** see `STATUS.md` for the current GitHub Pages address (deployed from `code/` on every push to `main`). The site is marked `noindex` until clinical review is complete.

## Start here

- **What it is / conventions:** [`AGENTS.md`](AGENTS.md)
- **Current state:** [`STATUS.md`](STATUS.md)
- **Session history + AI instructions:** [`CLAUDE.md`](CLAUDE.md)
- **How to edit content:** [`code/README.md`](code/README.md)

## Layout

```
├── README.md, AGENTS.md, CLAUDE.md, STATUS.md, DECISIONS.md, TODO.md, SOURCES.md
├── content/            # authored content (Markdown) → compiled into code/content/
│   ├── pages/          # guide pages (exams hub, stages, portfolio, guidelines, disclaimer…)
│   ├── notes/primary/  # Primary FRCA revision notes (131)
│   ├── notes/final/    # Final FRCA revision notes (60)
│   ├── questions/      # SBA question files (blocks starting "@@ id")
│   ├── stations/       # CASE / FCPE station packs
│   ├── capabilities/   # RCoA key capabilities per stage + SIAs (paraphrased)
│   ├── units/          # clinical unit guides for Stages 1 and 2
│   ├── refs.json       # verified references cited by id
│   └── syllabus/       # RCoA syllabus code lists (codes only)
├── code/               # the static website (GitHub Pages)
├── scripts/            # build-content.mjs (validate + compile), check-links.mjs (weekly)
├── proposals/          # the 2026-09-27 scoping proposal
└── docs/               # reference PDFs, NOT in git
```

## Build

```
node scripts/build-content.mjs      # validate content and write code/content/*.js
node scripts/check-links.mjs        # check every external link (also runs weekly in CI)
cd code && python3 -m http.server 8000
```

## Security class

> **Security class:** `0 Public` (published curriculum material and original educational content only; no trainee or patient data)
