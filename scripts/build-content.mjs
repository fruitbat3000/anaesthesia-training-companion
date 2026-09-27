// Builds the site's revision content from content/ into code/content/*.js.
//
//   content/pages/*.md          → long-form pages (exams hub, stages, portfolio …)
//   content/notes/{primary,final}/*.md → revision notes
//   content/questions/*.md      → single-best-answer questions (blocks starting "@@ id")
//   content/stations/*.md       → CASE / FCPE station practice packs
//   content/refs.json           → verified references, cited by id
//   content/syllabus/*-codes.txt → RCoA syllabus codes used for validation and coverage
//
// Output files are plain scripts (no modules) so the site still opens from the file system.
// Usage: node scripts/build-content.mjs [--check]   (--check: validate only, write nothing)

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdown, frontMatter, list, plain, inline } from './lib/md.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const C = p => join(ROOT, 'content', p);
const OUT = join(ROOT, 'code', 'content');
const CHECK_ONLY = process.argv.includes('--check');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const readCodes = f => new Set(readFileSync(C(`syllabus/${f}`), 'utf8').split('\n').filter(l => !l.startsWith('#')).join(' ').split(/\s+/).filter(Boolean));
const CODES = { primary: readCodes('primary-codes.txt'), final: readCodes('stage2-codes.txt') };
const ALL_CODES = new Set([...CODES.primary, ...CODES.final]);

const refs = JSON.parse(readFileSync(C('refs.json'), 'utf8'));

const mdFiles = dir => (existsSync(C(dir)) ? readdirSync(C(dir)).filter(f => f.endsWith('.md')).sort().map(f => join(dir, f)) : []);

/* ---------- subjects ---------- */
const SUBJECTS = {
  primary: {
    physiology: { name: 'Physiology', paper: 'A' },
    pharmacology: { name: 'Pharmacology', paper: 'A' },
    physics: { name: 'Physics & equipment', paper: 'B' },
    measurement: { name: 'Clinical measurement & data interpretation', paper: 'B' },
    anatomy: { name: 'Anatomy', paper: 'B' },
    statistics: { name: 'Statistics', paper: 'B' },
    clinical: { name: 'Applied clinical (Stage 1)', paper: 'CASE' },
  },
  final: {
    airway: { name: 'Airway & ENT', domain: 'GA' },
    obstetrics: { name: 'Obstetrics', domain: 'GA' },
    paediatrics: { name: 'Paediatrics', domain: 'GA' },
    neuro: { name: 'Neuroanaesthesia', domain: 'GA' },
    cardiothoracic: { name: 'Cardiac & thoracic', domain: 'GA' },
    vascular: { name: 'Vascular & major surgery', domain: 'GA' },
    specialties: { name: 'Other surgical specialties', domain: 'GA' },
    trauma: { name: 'Trauma, burns & transfer', domain: 'RT' },
    pom: { name: 'Perioperative medicine', domain: 'POM' },
    regional: { name: 'Regional anaesthesia', domain: 'RA' },
    pain: { name: 'Pain medicine', domain: 'PA' },
    icm: { name: 'Intensive care', domain: 'ICM' },
    professional: { name: 'Safety, quality & professional', domain: 'PRO' },
  },
};
// Blueprint for mock papers (RCoA Trainer Support Pack, June 2026; SOURCES.md S14)
const BLUEPRINTS = {
  'primary-a': { exam: 'primary', title: 'Primary AKT — Paper A', minutes: 140, parts: { pharmacology: 40, physiology: 40 } },
  'primary-b': { exam: 'primary', title: 'Primary AKT — Paper B', minutes: 140, parts: { physics: 30, measurement: 35, anatomy: 10, statistics: 5 } },
  'final': { exam: 'final', title: 'Final AKT', minutes: 180, parts: { GA: 50, POM: 10, RA: 10, OTHER: 30 } },
};
const FINAL_DOMAINS = ['GA', 'POM', 'RA', 'PA', 'ICM', 'RT', 'PS', 'PRO'];

function checkCodes(file, codes, exam) {
  for (const c of codes) {
    if (!ALL_CODES.has(c)) err(file, `unknown syllabus code "${c}"`);
    else if (exam && !CODES[exam].has(c) && !CODES[exam === 'primary' ? 'final' : 'primary'].has(c)) err(file, `code "${c}" not in ${exam} syllabus`);
  }
}
function checkRefs(file, ids) {
  for (const r of ids) if (!refs[r]) err(file, `unknown reference "${r}"`);
}

/* ---------- pages ---------- */
const pages = {};
for (const f of mdFiles('pages')) {
  const [fm, body] = frontMatter(readFileSync(C(f), 'utf8'));
  const id = basename(f, '.md');
  if (!fm.title) err(f, 'missing title');
  pages[id] = { id, title: fm.title, section: fm.section || '', lede: fm.lede ? inline(fm.lede) : '', html: markdown(body), updated: fm.updated || '' };
}

/* ---------- notes ---------- */
const notes = [];
const noteHtml = { primary: {}, final: {} };
for (const exam of ['primary', 'final']) {
  for (const f of mdFiles(`notes/${exam}`)) {
    const [fm, body] = frontMatter(readFileSync(C(f), 'utf8'));
    const id = fm.id || basename(f, '.md');
    if (!fm.title) err(f, 'missing title');
    if (!SUBJECTS[exam][fm.subject]) err(f, `unknown subject "${fm.subject}"`);
    const codes = list(fm.codes);
    if (!codes.length) warn(f, 'no syllabus codes');
    checkCodes(f, codes, exam);
    const r = list(fm.refs);
    checkRefs(f, r);
    if (!r.length) warn(f, 'no references');
    const html = markdown(body);
    notes.push({
      id, exam, title: fm.title, subject: fm.subject, codes, refs: r,
      ela: list(fm.ela), related: list(fm.related), status: fm.status || 'draft',
      summary: fm.summary || '', order: +(fm.order || 50), words: plain(html).split(' ').length,
      keys: [...html.matchAll(/<(h[23]|strong)[^>]*>(.*?)<\/\1>/g)].map(m => plain(m[2])).join(' · ').slice(0, 700),
    });
    noteHtml[exam][id] = html;
  }
}
const noteIds = new Set(notes.map(n => n.id));
if (noteIds.size !== notes.length) err('notes', 'duplicate note ids');
for (const n of notes) for (const r of n.related) if (!noteIds.has(r)) warn(`note ${n.id}`, `related note "${r}" does not exist yet`);

/* ---------- questions ---------- */
const questions = { primary: [], final: [] };
const qIds = new Set();
for (const f of mdFiles('questions')) {
  const src = readFileSync(C(f), 'utf8');
  const exam = basename(f).startsWith('final') ? 'final' : 'primary';
  const blocks = src.split(/^@@\s+/m).slice(1);
  for (const b of blocks) {
    const lines = b.split('\n');
    const id = lines[0].trim();
    const fields = {};
    let key = null;
    for (const line of lines.slice(1)) {
      const m = line.match(/^(stem|[A-E]|answer|explain|subject|domain|codes|note|refs|status|level|image):\s?(.*)$/);
      if (m) { key = m[1]; fields[key] = m[2]; }
      else if (key && line.trim()) fields[key] += '\n' + line;
      else if (key && !line.trim() && (key === 'explain' || key === 'stem')) fields[key] += '\n';
    }
    const where = `${f} ${id}`;
    if (qIds.has(id)) err(where, 'duplicate question id');
    qIds.add(id);
    for (const k of ['stem', 'A', 'B', 'C', 'D', 'E', 'answer', 'explain']) if (!fields[k] || !fields[k].trim()) err(where, `missing ${k}`);
    if (fields.answer && !/^[A-E]$/.test(fields.answer.trim())) err(where, `bad answer "${fields.answer}"`);
    const subject = (fields.subject || '').trim();
    if (exam === 'primary' && !SUBJECTS.primary[subject]) err(where, `unknown subject "${subject}"`);
    const domain = (fields.domain || '').trim();
    if (exam === 'final' && !FINAL_DOMAINS.includes(domain)) err(where, `unknown final domain "${domain}"`);
    if (exam === 'final' && !SUBJECTS.final[subject]) err(where, `unknown subject "${subject}"`);
    const codes = list(fields.codes);
    checkCodes(where, codes, exam);
    const r = list(fields.refs);
    checkRefs(where, r);
    const note = (fields.note || '').trim();
    if (note && !noteIds.has(note)) err(where, `note "${note}" does not exist`);
    const opts = ['A', 'B', 'C', 'D', 'E'].map(k => inline((fields[k] || '').trim()));
    if (new Set(opts).size !== 5) err(where, 'options are not all different');
    questions[exam].push({
      id, subject, domain: domain || undefined, codes, note: note || undefined, refs: r, status: (fields.status || 'draft').trim(),
      stem: markdown((fields.stem || '').trim()), options: opts, answer: 'ABCDE'.indexOf((fields.answer || '').trim()),
      explain: markdown((fields.explain || '').trim()),
    });
  }
}

/* ---------- stations ---------- */
const stations = [];
const stationHtml = {};
const STATION_SECTIONS = ['Candidate instructions', 'Scenario', 'Examiner prompts', 'Key features', 'Domains assessed'];
for (const f of mdFiles('stations')) {
  const [fm, body] = frontMatter(readFileSync(C(f), 'utf8'));
  const id = fm.id || basename(f, '.md');
  if (!['case', 'fcpe'].includes(fm.exam)) err(f, `exam must be case or fcpe (got "${fm.exam}")`);
  const sections = {};
  body.split(/^## /m).slice(1).forEach(s => {
    const nl = s.indexOf('\n');
    sections[s.slice(0, nl).trim()] = s.slice(nl + 1).trim();
  });
  for (const s of STATION_SECTIONS) if (!sections[s]) err(f, `missing section "## ${s}"`);
  const codes = list(fm.codes);
  checkCodes(f, codes);
  const r = list(fm.refs);
  checkRefs(f, r);
  // Key features become a checklist: one per list item
  const features = (sections['Key features'] || '').split('\n').filter(l => /^\s*[-*]\s+/.test(l)).map(l => inline(l.replace(/^\s*[-*]\s+/, '')));
  stations.push({
    id, exam: fm.exam, title: fm.title, arena: fm.arena || '', domain: fm.domain || '', group: fm.group || '',
    science: fm.science || '', skills: list(fm.skills), codes, refs: r, status: fm.status || 'draft', summary: fm.summary || '',
    related: list(fm.related),
  });
  stationHtml[id] = {
    candidate: markdown(sections['Candidate instructions'] || ''),
    scenario: markdown(sections['Scenario'] || ''),
    prompts: markdown(sections['Examiner prompts'] || ''),
    features,
    domains: markdown(sections['Domains assessed'] || ''),
    model: markdown(sections['What good looks like'] || ''),
    learning: markdown(sections['Learning points'] || ''),
  };
}
for (const s of stations) for (const r of s.related) if (!noteIds.has(r)) warn(`station ${s.id}`, `related note "${r}" does not exist yet`);

/* ---------- coverage (only codes that something covers; the full code lists ship separately) ---------- */
const coverage = { primary: {}, final: {} };
const examOf = c => (CODES.primary.has(c) ? 'primary' : 'final');
const cov = c => { const ex = examOf(c); return (coverage[ex][c] = coverage[ex][c] || { n: [], q: 0 }); };
for (const n of notes) for (const c of n.codes) if (!cov(c).n.includes(n.id)) cov(c).n.push(n.id);
for (const ex of ['primary', 'final']) for (const q of questions[ex]) for (const c of q.codes) cov(c).q++;
// A Stage 2 key-capability tag (2_GA_T) counts as covering its items, and vice versa.
const coveredCodes = ex => [...CODES[ex]].filter(c => {
  if (coverage[ex][c] && coverage[ex][c].n.length) return true;
  if (ex !== 'final') return false;
  const kc = c.split('_').slice(0, 3).join('_');
  if (kc !== c && coverage.final[kc] && coverage.final[kc].n.length) return true;
  return Object.keys(coverage.final).some(k => k.startsWith(c + '_') && coverage.final[k].n.length);
}).length;

/* ---------- report ---------- */
const summary = [
  `pages ${Object.keys(pages).length}`,
  `notes ${notes.length} (primary ${notes.filter(n => n.exam === 'primary').length}, final ${notes.filter(n => n.exam === 'final').length})`,
  `questions ${questions.primary.length + questions.final.length} (primary ${questions.primary.length}, final ${questions.final.length})`,
  `stations ${stations.length}`,
  `refs ${Object.keys(refs).length}`,
  `coverage primary ${coveredCodes('primary')}/${CODES.primary.size}, stage 2 ${coveredCodes('final')}/${CODES.final.size}`,
].join(' · ');

if (warnings.length) console.warn(`${warnings.length} warning(s):\n  ` + warnings.slice(0, 40).join('\n  ') + (warnings.length > 40 ? '\n  …' : ''));
if (errors.length) {
  console.error(`${errors.length} error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(summary);
if (CHECK_ONLY) process.exit(0);

/* ---------- write ---------- */
mkdirSync(OUT, { recursive: true });
const js = (name, value) => `/* Generated by scripts/build-content.mjs — do not edit. Edit content/ instead. */\n${name} = ${JSON.stringify(value)};\n`;
const part = (key, value) => `/* Generated by scripts/build-content.mjs — do not edit. */\n(window.CONTENT_PARTS = window.CONTENT_PARTS || {})[${JSON.stringify(key)}] = ${JSON.stringify(value)};\n`;

const qMeta = exam => {
  const bySubject = {};
  const byNote = {};
  for (const q of questions[exam]) {
    const k = exam === 'final' ? q.domain : q.subject;
    bySubject[k] = (bySubject[k] || 0) + 1;
    if (q.note) byNote[q.note] = (byNote[q.note] || 0) + 1;
  }
  return { total: questions[exam].length, bySubject, byNote };
};

writeFileSync(join(OUT, 'index.js'), js('window.CONTENT', {
  built: new Date().toISOString().slice(0, 10),
  subjects: SUBJECTS,
  blueprints: BLUEPRINTS,
  finalDomains: { GA: 'General anaesthesia', POM: 'Perioperative medicine', RA: 'Regional anaesthesia', PA: 'Pain', ICM: 'Intensive care', RT: 'Resuscitation, trauma & transfer', PS: 'Procedural sedation', PRO: 'Professional, safety & quality' },
  pages,
  notes,
  stations,
  questions: { primary: qMeta('primary'), final: qMeta('final') },
  refs,
  coverage,
  codes: { primary: [...CODES.primary], final: [...CODES.final] },
}));
writeFileSync(join(OUT, 'notes-primary.js'), part('notes-primary', noteHtml.primary));
writeFileSync(join(OUT, 'notes-final.js'), part('notes-final', noteHtml.final));
writeFileSync(join(OUT, 'questions-primary.js'), part('questions-primary', questions.primary));
writeFileSync(join(OUT, 'questions-final.js'), part('questions-final', questions.final));
writeFileSync(join(OUT, 'stations.js'), part('stations', stationHtml));
const size = f => (statSync(join(OUT, f)).size / 1024).toFixed(0) + ' KB';
console.log('wrote', ['index.js', 'notes-primary.js', 'notes-final.js', 'questions-primary.js', 'questions-final.js', 'stations.js'].map(f => `${f} ${size(f)}`).join(', '));
