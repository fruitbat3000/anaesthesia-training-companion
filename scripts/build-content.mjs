// Builds the site's revision content from content/ into code/content/*.js.
//
//   content/pages/*.md          → long-form pages (exams hub, stages, portfolio …)
//   content/notes/{primary,final}/*.md → revision notes
//   content/questions/*.md      → single-best-answer questions (blocks starting "@@ id")
//   content/stations/*.md       → CASE / FCPE station practice packs
//   content/capabilities/*.md   → RCoA stage key capabilities and SIAs (paraphrased), with links
//   content/units/*.md          → clinical unit guides for each stage
//   content/refs.json           → verified references, cited by id
//   content/syllabus/*-codes.txt → RCoA syllabus codes used for validation and coverage
//
// Output files are plain scripts (no modules) so the site still opens from the file system.
// Usage: node scripts/build-content.mjs [--check]   (--check: validate only, write nothing)

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
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

/* ---------- stage capabilities and SIAs (content/capabilities/*.md) ----------
 * Front matter: stage, source, checked. Then an intro paragraph, then one block per domain:
 *   ## id | generic|clinical|sia | Name
 *   rcoa: <url>   outcome: <text>
 *   ### Optional group heading
 *   - A [2b]: capability text          (the [level] is optional)
 *   evidence: item · item               notes: id, id   stations: id, id   ela: 05b, icm
 */
const ELA = {
  '01': ['e-LA Module 01', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_9983&programmeId=14'],
  '03': ['e-LA Module 03', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_41657&programmeId=14'],
  '04a': ['e-LA Module 04a', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_7975&programmeId=14'],
  '04b': ['e-LA Module 04b', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_8723&programmeId=14'],
  '04c': ['e-LA Module 04c', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_7976&programmeId=14'],
  '05a': ['e-LA Module 05a', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_8724&programmeId=14'],
  '05b': ['e-LA Module 05b', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37596_8725&programmeId=14'],
  '07a': ['e-LA Module 07a', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_8727&programmeId=14'],
  '07b': ['e-LA Module 07b', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_9553&programmeId=14'],
  '07c': ['e-LA Module 07c', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_9558&programmeId=14'],
  '07d': ['e-LA Module 07d', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_8729&programmeId=14'],
  '07e': ['e-LA Module 07e', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_8730&programmeId=14'],
  '07f': ['e-LA Module 07f', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_34064_34003&programmeId=14'],
  '08': ['e-LA Module 08', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_8747&programmeId=14'],
  '09': ['e-LA Module 09', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_10007&programmeId=14'],
  '11': ['e-LA Module 11', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_33984&programmeId=14'],
  '12': ['e-LA Module 12', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_33997&programmeId=14'],
  '13': ['e-LA Module 13', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_34048&programmeId=14'],
  '14': ['e-LA Module 14', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14_37565_34065&programmeId=14'],
  icm: ['e-ICM programme', 'https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_34610&programmeId=34610'],
};
const stationIds = new Set(stations.map(s => s.id));
const capabilities = {};
for (const f of mdFiles('capabilities')) {
  const [fm, body] = frontMatter(readFileSync(C(f), 'utf8'));
  const key = basename(f, '.md');
  const [intro, ...blocks] = body.split(/^## /m);
  const domains = blocks.map(b => {
    const lines = b.split('\n');
    const [id, kind, name] = lines[0].split('|').map(x => x.trim());
    if (!['generic', 'clinical', 'sia'].includes(kind)) err(f, `domain ${id}: kind must be generic, clinical or sia`);
    const d = { id, kind, name, groups: [], evidence: [], notes: [], stations: [], ela: [], rcoa: '', outcome: '', about: '', length: '', group: '' };
    let group = null;
    for (const raw of lines.slice(1)) {
      const l = raw.trim();
      if (!l) continue;
      let m;
      if ((m = l.match(/^### (.+)$/))) { group = { name: m[1], caps: [] }; d.groups.push(group); }
      else if ((m = l.match(/^- ([A-Z]{1,2}\d?)(?: \[([^\]]+)\])?: (.+)$/))) {
        if (!group) { group = { name: '', caps: [] }; d.groups.push(group); }
        group.caps.push({ k: m[1], level: m[2] || '', text: inline(m[3]) });
      }
      else if ((m = l.match(/^(rcoa|outcome|evidence|notes|stations|ela|about|length|group):\s*(.*)$/))) {
        const [, field, v] = m;
        if (field === 'evidence') d.evidence = v.split(' · ').map(x => inline(x.trim()));
        else if (['notes', 'stations', 'ela'].includes(field)) d[field] = list(v);
        else d[field] = field === 'rcoa' ? v : inline(v);
      }
      else err(f, `domain ${id}: cannot parse "${l.slice(0, 60)}"`);
    }
    for (const n of d.notes) if (!noteIds.has(n)) err(f, `domain ${id}: unknown note "${n}"`);
    for (const s of d.stations) if (!stationIds.has(s)) err(f, `domain ${id}: unknown station "${s}"`);
    d.ela = d.ela.map(e => { if (!ELA[e]) err(f, `domain ${id}: unknown e-LA module "${e}"`); return ELA[e] || [e, '']; });
    if (!d.rcoa) err(f, `domain ${id}: missing rcoa link`);
    const keys = d.groups.flatMap(g => g.caps.map(c => c.k));
    if (new Set(keys).size !== keys.length) err(f, `domain ${id}: duplicate capability letter`);
    return d;
  });
  capabilities[key] = { key, stage: fm.stage || '', source: fm.source || '', checked: fm.checked || '', intro: markdown(intro.trim()), domains };
}

/* ---------- unit guides (content/units/*.md): front matter stage, order, title, lede, short ---------- */
const units = [];
for (const f of mdFiles('units')) {
  const [fm, body] = frontMatter(readFileSync(C(f), 'utf8'));
  const id = basename(f, '.md');
  if (!fm.title || !fm.stage) err(f, 'missing title or stage');
  for (const m of body.matchAll(/\{\{caps ([\w-]+) ([\w-]+)(?: ([\w,]+))?\}\}/g)) {
    const d = capabilities[m[1]] && capabilities[m[1]].domains.find(x => x.id === m[2]);
    if (!d) { err(f, `caps widget: unknown ${m[1]} ${m[2]}`); continue; }
    const keys = new Set(d.groups.flatMap(g => g.caps.map(c => c.k)));
    for (const k of (m[3] || '').split(',').filter(Boolean)) if (!keys.has(k)) err(f, `caps widget: ${m[1]} ${m[2]} has no capability ${k}`);
  }
  for (const m of body.matchAll(/\(#notes\/([\w-]+)\)/g)) if (!noteIds.has(m[1])) err(f, `unknown note link ${m[1]}`);
  for (const m of body.matchAll(/\(#stations\/([\w-]+)\)/g)) if (!stationIds.has(m[1])) err(f, `unknown station link ${m[1]}`);
  units.push({ id, stage: fm.stage, order: +fm.order || 99, title: fm.title, short: fm.short || fm.title, lede: fm.lede ? inline(fm.lede) : '', html: markdown(body), updated: fm.updated || '' });
}
units.sort((a, b) => a.stage.localeCompare(b.stage) || a.order - b.order);

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

/* ---------- BJA Education pointers for notes (content/bjaed.json) ---------- */
const bjaedSrc = JSON.parse(readFileSync(C('bjaed.json'), 'utf8'));
for (const [id, dois] of Object.entries(bjaedSrc.notes)) {
  const n = notes.find(x => x.id === id);
  if (!n) { err('bjaed.json', `unknown note ${id}`); continue; }
  n.bjaed = dois.map(d => {
    const a = bjaedSrc.articles[d];
    if (!a) { err('bjaed.json', `no metadata for ${d}`); return null; }
    return { doi: d, t: a.t, a: a.a, y: a.y, v: a.v, p: a.p };
  }).filter(Boolean);
}
const bjaedCount = Object.keys(bjaedSrc.articles).length;

/* ---------- e-LA Revision Guide pointers for notes (content/elaguides.json) ---------- */
const elaGuideSrc = JSON.parse(readFileSync(C('elaguides.json'), 'utf8'));
const ELFH = id => `https://portal.e-lfh.org.uk/Component/Details/${id}`;
const elaGuides = Object.fromEntries(Object.entries(elaGuideSrc.guides).map(([k, g]) => [k, { t: g.t, v: g.v, u: ELFH(g.id) }]));
for (const t of elaGuideSrc.topics) {
  if (!elaGuides[t.g]) err('elaguides.json', `unknown guide ${t.g}`);
  const sessions = t.s.map(c => { const id = elaGuideSrc.sessions[c]; if (!id) err('elaguides.json', `no e-LfH id for ${c}`); return [(elaGuideSrc.renamed || {})[c] || c, ELFH(id)]; });
  for (const id of t.notes) {
    const n = notes.find(x => x.id === id);
    if (!n) { err('elaguides.json', `unknown note ${id}`); continue; }
    (n.elaGuide = n.elaGuide || []).push({ g: t.g, t: t.t, p: t.p, s: sessions });
  }
}

/* ---------- GPAS chapters linked from unit guides and SIAs (content/gpas.json) ---------- */
const gpas = JSON.parse(readFileSync(C('gpas.json'), 'utf8'));
delete gpas._note;
const gpasList = (f, ids) => ids.map(n => { if (!gpas.chapters[n]) err('gpas.json', `${f}: unknown chapter ${n}`); return gpas.chapters[n] && { n, ...gpas.chapters[n] }; }).filter(Boolean);
for (const [id, ids] of Object.entries(gpas.units)) {
  const u = units.find(x => x.id === id);
  if (!u) err('gpas.json', `unknown unit ${id}`); else u.gpas = gpasList(id, ids);
}
for (const [id, ids] of Object.entries(gpas.sias)) {
  const d = capabilities.sias && capabilities.sias.domains.find(x => x.id === id);
  if (!d) err('gpas.json', `unknown SIA ${id}`); else d.gpas = gpasList(id, ids);
}

/* ---------- readable syllabus map (content/syllabus/map.json, content/texts.json) ---------- */
const texts = JSON.parse(readFileSync(C('texts.json'), 'utf8'));
delete texts._note;
const mapSrc = JSON.parse(readFileSync(C('syllabus/map.json'), 'utf8'));
const DOMAIN_KEY = { PBC: 'pbc', MPR: 'mprr', TW: 'tw', SQI: 'sqi', SG: 'sg', RD: 'rmd', RMD: 'rmd', POM: 'pom', GA: 'ga', RA: 'ra', RT: 'rt', PS: 'ps', PA: 'pain', ICM: 'icm', IC: 'icm' };
// Exam-syllabus sections whose capability letter changed in curriculum v1.5.
const SECTION_LABEL = {
  '1_ICM_D': 'Recognises the acutely ill child and starts managing paediatric emergencies (moved to Resuscitation and transfer in curriculum v1.5).',
  '2_IC_D': 'Recognises the acutely ill child and starts managing paediatric emergencies (moved to Resuscitation and transfer in curriculum v1.5).',
};
const syllabusMap = {};
for (const exam of ['primary', 'final']) {
  const src = mapSrc[exam];
  const f = `syllabus/map.json (${exam})`;
  const examNotes = notes.filter(n => n.exam === exam);
  const seen = new Map();
  const papers = src.papers.map(pp => ({ name: pp.name, subjects: pp.subjects.map(sid => {
    const sj = src.subjects[sid];
    if (!sj || !SUBJECTS[exam][sid]) { err(f, `unknown subject ${sid}`); return null; }
    const byOrder = examNotes.filter(n => n.subject === sid).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)).map(n => n.id);
    const groups = (sj.groups || [[SUBJECTS[exam][sid].name, byOrder]]).map(([name, ids]) => ({ name, notes: ids }));
    for (const g of groups) for (const id of g.notes) {
      if (!noteIds.has(id)) err(f, `unknown note ${id}`);
      if (seen.has(id)) err(f, `note ${id} listed twice`);
      seen.set(id, sid);
    }
    for (const t of sj.texts || []) if (!texts[t]) err(f, `unknown text ${t}`);
    for (const r of sj.refs || []) if (!refs[r]) err(f, `unknown reference ${r}`);
    for (const e of sj.ela || []) if (!ELA[e]) err(f, `unknown e-LA module ${e}`);
    return { id: sid, name: SUBJECTS[exam][sid].name, groups, texts: sj.texts || [], refs: sj.refs || [], ela: (sj.ela || []).map(e => ELA[e]).filter(Boolean) };
  }).filter(Boolean) }));
  for (const n of examNotes) if (!seen.has(n.id)) err(f, `note ${n.id} is not on the map`);
  // Official structure: code groups (stage_domain_letter) labelled with our paraphrase of that key capability.
  const capSet = capabilities[exam === 'primary' ? 'stage-1' : 'stage-2'];
  const groups = new Map();
  for (const code of CODES[exam]) {
    const parts = code.split('_');
    const g = parts.slice(0, 3).join('_');
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(code);
  }
  const sections = [];
  for (const [g, codes] of groups) {
    const [, dom, letterPart] = g.split('_');
    const letter = letterPart.replace(/\d+$/, '');
    const part = letterPart.slice(letter.length);
    const d = capSet && capSet.domains.find(x => x.id === DOMAIN_KEY[dom]);
    const cap = d && d.groups.flatMap(x => x.caps).find(c => c.k === letter);
    const covering = [...new Set(notes.filter(n => n.codes.some(c => c === g || c.startsWith(g + '_'))).map(n => n.id))];
    sections.push({ g, domain: d ? d.name : dom, letter, part, label: SECTION_LABEL[g] || (cap ? cap.text : ''), codes: codes.length, notes: covering });
  }
  syllabusMap[exam] = { intro: src.intro, papers, sections };
}

/* ---------- four-part syllabus overview (content/syllabus/overview.json) ---------- */
// Novice topics live in code/data.js (the app's own data), so evaluate it in a sandbox to check ids.
const siteData = (() => { const w = {}; new Function('window', readFileSync(join(ROOT, 'code', 'data.js'), 'utf8'))(w); return w.SITE; })();
const noviceTopics = new Map(siteData.domains.flatMap(d => d.groups.flatMap(g => g.topics.map(t => [t.id, t]))));
const ovSrc = JSON.parse(readFileSync(C('syllabus/overview.json'), 'utf8'));
const OV = 'syllabus/overview.json';
const ovUsed = new Set();
const siaById = new Map((capabilities.sias ? capabilities.sias.domains : []).map(d => [d.id, d]));
// Each item compiles to [level, title, href]; level is novice | primary | final | stage3.
function ovItem(ref) {
  ovUsed.add(ref);
  const [kind, id] = ref.includes(':') ? ref.split(':') : ['note', ref];
  if (kind === 'n') { const t = noviceTopics.get(id); if (!t) return err(OV, `unknown novice topic ${id}`); return ['novice', t.title, `#syllabus/${id}`]; }
  if (kind === 'u') { const u = units.find(x => x.id === id); if (!u) return err(OV, `unknown unit guide ${id}`); return [u.stage === '1' ? 'primary' : 'final', u.title, `#stage/${u.stage}/unit/${id}`, 'unit']; }
  if (kind === 's') { const d = siaById.get(id); if (!d) return err(OV, `unknown SIA ${id}`); return ['stage3', d.name, `#stage/3/sia/${id}`, 'sia']; }
  const n = notes.find(x => x.id === id);
  if (!n) return err(OV, `unknown note ${id}`);
  return [n.exam, n.title, `#notes/${id}`];
}
// Syllabus cross-check: every RCoA syllabus section (code group) has a home in the boxes, and every note tagged
// with one of its codes is added to those box sections (on top of the hand-placed items).
const ovSections = new Map(ovSrc.quadrants.flatMap(q => q.groups.flatMap(g => g.sections.map(s => [s.name, s]))));
ovSections.set('across', ovSrc.across);
const ovSyl = ovSrc.syllabus || { map: {}, science: [] };
const groupOf = code => code.split('_').slice(0, 3).join('_');
const allGroups = new Set([...CODES.primary, ...CODES.final].map(groupOf));
for (const g of allGroups) if (!ovSyl.map[g] && !ovSyl.science.includes(g)) err(OV, `RCoA syllabus section ${g} has no home in the four boxes`);
const ovAdded = {};
for (const g of Object.keys(ovSyl.map)) if (!allGroups.has(g)) err(OV, `unknown syllabus section ${g}`);
// A note joins a box section only when a real share of its own codes point there (≥ 25%, or ≥ 3 codes),
// so a single incidental code in a long list does not pull it into an unrelated section.
for (const n of notes) {
  const count = {};
  for (const c of n.codes) for (const name of ovSyl.map[groupOf(c)] || []) count[name] = (count[name] || 0) + 1;
  for (const [name, k] of Object.entries(count)) {
    if (k < 3 && k / n.codes.length < 0.25) continue;
    if ((ovSyl.exclude || {})[name] && ovSyl.exclude[name].includes(n.id)) continue;
    const sec = ovSections.get(name);
    if (!sec) { err(OV, `unknown box section "${name}"`); continue; }
    if (!sec.items.includes(n.id)) { sec.items.push(n.id); ovAdded[name] = (ovAdded[name] || 0) + 1; }
  }
}
if (process.argv.includes('--overview-report')) console.log('syllabus cross-check added:', JSON.stringify(ovAdded));
const ovMaps = (f, ids) => (ids || []).map(m => { const [exam, sid] = m.split(':'); if (!mapSrc[exam] || !mapSrc[exam].subjects[sid]) err(OV, `${f}: unknown map subject ${m}`); return [exam, sid, SUBJECTS[exam] && SUBJECTS[exam][sid] ? SUBJECTS[exam][sid].name : sid]; });
// BJA Education reviews for each box section (content/bjaed-sections.json).
const bjaedSections = JSON.parse(readFileSync(C('bjaed-sections.json'), 'utf8')).articles;
const bjaedBySection = {};
for (const a of bjaedSections) for (const name of a.s) {
  if (!ovSections.has(name)) { err('bjaed-sections.json', `${a.doi}: unknown box section "${name}"`); continue; }
  (bjaedBySection[name] = bjaedBySection[name] || []).push([a.t, a.y, a.doi]);
}
for (const list of Object.values(bjaedBySection)) list.sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]));
const overview = {
  quadrants: ovSrc.quadrants.map(q => ({ n: q.n, id: q.id, name: q.name, blurb: q.blurb, novice: q.novice,
    groups: q.groups.map(g => ({ name: g.name, sections: g.sections.map(s => ({ name: s.name, maps: ovMaps(s.name, s.maps), items: s.items.map(ovItem).filter(Boolean), bjaed: bjaedBySection[s.name] || [] })) })) })),
  across: { name: ovSrc.across.name, items: ovSrc.across.items.map(ovItem).filter(Boolean), bjaed: bjaedBySection.across || [] },
};
for (const id of noviceTopics.keys()) if (!ovUsed.has(`n:${id}`) && !ovSrc.unmapped.includes(`n:${id}`)) err(OV, `novice topic ${id} is not on the overview`);
for (const n of notes) if (!ovUsed.has(n.id)) err(OV, `note ${n.id} is not on the overview`);

/* ---------- report ---------- */
const summary = [
  `pages ${Object.keys(pages).length}`,
  `notes ${notes.length} (primary ${notes.filter(n => n.exam === 'primary').length}, final ${notes.filter(n => n.exam === 'final').length})`,
  `questions ${questions.primary.length + questions.final.length} (primary ${questions.primary.length}, final ${questions.final.length})`,
  `stations ${stations.length}`,
  `capabilities ${Object.values(capabilities).map(c => `${c.key} ${c.domains.reduce((a, d) => a + d.groups.reduce((b, g) => b + g.caps.length, 0), 0)}`).join(', ')}`,
  `units ${units.length}`,
  `refs ${Object.keys(refs).length}`,
  `BJA Education ${bjaedCount} articles on ${Object.keys(bjaedSrc.notes).length} notes`,
  `e-LA Revision Guides ${elaGuideSrc.topics.length} topics on ${notes.filter(n => n.elaGuide).length} notes`,
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

// Lazy-loaded parts are fingerprinted so browsers never pair a new index with an old cached part.
const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 10);
const parts = {
  'notes-primary': part('notes-primary', noteHtml.primary),
  'notes-final': part('notes-final', noteHtml.final),
  'questions-primary': part('questions-primary', questions.primary),
  'questions-final': part('questions-final', questions.final),
  stations: part('stations', stationHtml),
};
writeFileSync(join(OUT, 'index.js'), js('window.CONTENT', {
  built: new Date().toISOString().slice(0, 10),
  subjects: SUBJECTS,
  blueprints: BLUEPRINTS,
  finalDomains: { GA: 'General anaesthesia', POM: 'Perioperative medicine', RA: 'Regional anaesthesia', PA: 'Pain', ICM: 'Intensive care', RT: 'Resuscitation, trauma & transfer', PS: 'Procedural sedation', PRO: 'Professional, safety & quality' },
  pages,
  notes,
  stations,
  capabilities,
  units,
  syllabusMap,
  overview,
  elaGuides,
  texts,
  gpas: { index: gpas.index, chapters: gpas.chapters },
  questions: { primary: qMeta('primary'), final: qMeta('final') },
  refs,
  coverage,
  codes: { primary: [...CODES.primary], final: [...CODES.final] },
  partVersions: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, hash(v)])),
}));
for (const [k, v] of Object.entries(parts)) writeFileSync(join(OUT, `${k}.js`), v);
const size = f => (statSync(join(OUT, f)).size / 1024).toFixed(0) + ' KB';
console.log('wrote', ['index.js', 'notes-primary.js', 'notes-final.js', 'questions-primary.js', 'questions-final.js', 'stations.js'].map(f => `${f} ${size(f)}`).join(', '));

// Cache-busting: stamp each local script and stylesheet in index.html with a fingerprint of the file,
// so a new deploy is picked up at once instead of after the host's 10-minute cache.
const INDEX = join(ROOT, 'code', 'index.html');
const indexHtml = readFileSync(INDEX, 'utf8');
const stamped = indexHtml.replace(/(<(?:script src|link rel="stylesheet" href)=")([a-z0-9/.-]+\.(?:js|css))(?:\?v=[a-f0-9]+)?"/g,
  (m, pre, file) => existsSync(join(ROOT, 'code', file)) ? `${pre}${file}?v=${hash(readFileSync(join(ROOT, 'code', file), 'utf8'))}"` : m);
if (stamped !== indexHtml) writeFileSync(INDEX, stamped);
