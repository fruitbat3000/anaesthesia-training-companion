# Anaesthesia Training Companion (folder: novice-anaesthetist-syllabus)

Static, AI-agnostic description. Any assistant reads this first to orient. Session history lives in `CLAUDE.md`; do not put session logs here.

## What this is
A website for anaesthetists in training (Yorkshire and Humber school for now), covering every stage from the novice period to CCT: the RCoA 2021 curriculum by stage, the FRCA examinations (including the new AKT/CASE/FCPE formats from July 2027), original revision notes mapped to RCoA syllabus codes, SBA practice questions with mock papers built to the AKT blueprint, and CASE/FCPE station practice packs. The RCoA documents stay the authoritative source; the site must never contradict or misleadingly paraphrase them. All content is educational only (see the disclaimer page) and is marked draft until clinically reviewed.

## Security class
0 Public. Handling follows `security-classification.md`. The site uses published curriculum material and original educational content only, with no trainee names, assessment results or patient data.

## Status
Full build (all stages) complete as a draft awaiting clinical QC. See `STATUS.md`.

## Structure
- `code/`: the website (static HTML/CSS/JS; no dependencies). See `code/README.md`.
- `content/`: authored revision content (pages, notes, questions, stations, references, syllabus code lists), compiled by `scripts/build-content.mjs` into `code/content/`.
- `scripts/`: content build/validation and the weekly link checker.
- `docs/`: reference documents, **not in git** (Dr Brooks's PDF).

## Conventions
- Folder names kebab-case, UK English, ISO dates. Full rules: `shared-conventions/conventions.md`.
- Every curriculum claim on the site traces to an entry in `SOURCES.md`; every note and question cites references from `content/refs.json` (DOIs checked on Crossref, URLs checked live). Link to the RCoA and don't copy large sections of their text (copyright). Syllabus descriptors are not reproduced — codes only.
- Revision content is original: nothing copied from textbooks, commercial question banks or RCoA sample questions. Doses are allowed when referenced and must carry the BNF/local-policy caveat.
- Source-of-truth precedence: spec → decisions → status → sources → session notes.

## Source-of-truth files
- Spec: none yet
- Decisions: `DECISIONS.md`
- Status: `STATUS.md`
- Sources: `SOURCES.md`

## External sources / related folders
- None yet.
