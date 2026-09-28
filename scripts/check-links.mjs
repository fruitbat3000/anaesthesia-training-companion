// Checks every link in code/data.js and writes a Markdown report.
//
// - e-LfH session pages: must load, must not be "[Retired]", and must show the
//   session code we expect (or the expected title for the few with no code).
// - e-LfH catalogue sections: must still contain sessions.
// - Other links: must load (HTTP 2xx/3xx). Sites that block automated requests
//   (RCoA, the Y&H deanery, Wiley, LWW) are listed as "check by hand".
//
// Usage: node scripts/check-links.mjs [report.md]
// Exit code 1 if any link is broken.

import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../code/data.js', import.meta.url), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const S = ctx.window.SITE;

// Revision content (references, guide pages, notes and stations) compiled by build-content.mjs
const contentCtx = { window: {} };
for (const f of ['index.js', 'notes-primary.js', 'notes-final.js', 'stations.js']) {
  vm.runInNewContext(readFileSync(new URL(`../code/content/${f}`, import.meta.url), 'utf8'), contentCtx);
}
const CONTENT = contentCtx.window.CONTENT;
const PARTS = contentCtx.window.CONTENT_PARTS || {};

const UA = 'Mozilla/5.0 (compatible; anaesthesia-training-companion-link-check; +https://github.com/fruitbat3000/anaesthesia-training-companion)';
const BOT_BLOCKED = [/(^|\.)rcoa\.ac\.uk$/, /yorksandhumberdeanery\.nhs\.uk$/, /^doi\.org$/, /onlinelibrary\.wiley\.com$/, /journals\.lww\.com$/, /(^|\.)bnf\.nice\.org\.uk$/, /(^|\.)apagbi\.org\.uk$/, /(^|\.)ficm\.ac\.uk$/, /(^|\.)das\.uk\.com$/, /(^|\.)cpoc\.org\.uk$/, /(^|\.)cambridge\.org$/, /^academic\.oup\.com$/];
// e-LfH sessions whose page titles carry no session code
const NO_CODE = { '01_12_01': 'Airway Maintenance: Facemask', '01_13_01': 'Venous Access' };

const problems = [];
const manual = [];
let ok = 0;

async function get(url, headers = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      return { status: res.status, text: await res.text() };
    } catch (e) {
      if (attempt) return { status: 0, text: String(e) };
    }
  }
}

async function checkSession(code, [title, url]) {
  const { status, text } = await get(url);
  if (status !== 200) return problems.push(`\`${code}\` ${title}: HTTP ${status || 'error'} (${url})`);
  if (text.includes('[Retired]')) return problems.push(`\`${code}\` ${title}: now marked **[Retired]** on e-LfH (${url})`);
  const expect = NO_CODE[code] || code;
  if (!text.includes(expect)) return problems.push(`\`${code}\` ${title}: page no longer shows "${expect}" (${url})`);
  ok++;
}

async function checkCatalogue(code, [title, url]) {
  const hier = new URL(url).searchParams.get('HierarchyId') || '';
  const parent = hier.split('_').pop();
  const api = `https://portal.e-lfh.org.uk/Catalogue/GetCatalogueChildComponents?ParentComponentId=${parent}&RootComponentId=14`;
  const { status, text } = await get(api, { 'X-Requested-With': 'XMLHttpRequest' });
  let items = [];
  try { items = JSON.parse(text); } catch { /* not JSON */ }
  if (status !== 200 || !Array.isArray(items) || !items.length) return problems.push(`${title}: catalogue section is empty or missing (${url})`);
  ok++;
}

async function checkPlain(key, url) {
  const host = new URL(url).hostname;
  if (BOT_BLOCKED.some(re => re.test(host))) return manual.push(`${key}: ${url}`);
  const { status } = await get(url);
  if (status >= 200 && status < 400) ok++;
  // Some small sites refuse connections from cloud runners; flag these for a manual check.
  else if (status === 0) manual.push(`${key}: ${url} (could not connect from the checker)`);
  else problems.push(`\`${key}\`: HTTP ${status} (${url})`);
}

// Run with modest concurrency to be polite to e-LfH.
async function pool(tasks, n = 4) {
  const queue = [...tasks];
  await Promise.all(Array.from({ length: n }, async () => { while (queue.length) await queue.shift()(); }));
}

const tasks = [];
for (const [code, entry] of Object.entries(S.ela)) {
  tasks.push(() => (entry[1].includes('/Catalogue/') ? checkCatalogue(code, entry) : checkSession(code, entry)));
}
for (const [key, url] of Object.entries(S.links)) {
  if (key === 'feedbackNew' || url.includes('portal.e-lfh.org.uk/Catalogue/')) continue;
  tasks.push(() => checkPlain(key, url));
}
// External links in the revision content that are not already in data.js
const seen = new Set(Object.values(S.links));
const contentLinks = new Map();
for (const [id, r] of Object.entries(CONTENT.refs)) contentLinks.set(r.u, `ref ${id}`);
const htmlBlobs = [
  ...Object.values(CONTENT.pages).map(p => [`page ${p.id}`, p.html]),
  ...Object.entries(PARTS['notes-primary'] || {}).map(([k, v]) => [`note ${k}`, v]),
  ...Object.entries(PARTS['notes-final'] || {}).map(([k, v]) => [`note ${k}`, v]),
  ...Object.entries(PARTS.stations || {}).map(([k, v]) => [`station ${k}`, Object.values(v).join(' ')]),
  ...(CONTENT.units || []).map(u => [`unit ${u.id}`, u.html]),
  ...Object.entries(CONTENT.texts || {}).map(([k, t]) => [`textbook ${k}`, `href="${t.u}"`]),
  ...Object.entries((CONTENT.gpas || {}).chapters || {}).map(([k, c]) => [`GPAS chapter ${k}`, `href="${c.u}"`]),
  ...Object.values(CONTENT.capabilities || {}).flatMap(c => c.domains.map(d => [`capabilities ${c.key}/${d.id}`,
    [`href="${d.rcoa}"`, ...d.ela.map(([, url]) => `href="${url}"`)].join(' ')])),
];
for (const [where, html] of htmlBlobs) {
  for (const m of String(html).matchAll(/href="(https?:[^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (!contentLinks.has(url)) contentLinks.set(url, where);
  }
}
for (const [url, where] of contentLinks) {
  if (seen.has(url)) continue;
  seen.add(url);
  // top-level catalogue sections: a plain page check (the child-component API only suits leaf sections)
  tasks.push(() => checkPlain(where, url));
}

await pool(tasks);

// BJA Education DOIs: doi.org blocks bots, so confirm each DOI is still registered with Crossref,
// 20 at a time and one request after another (Crossref rate-limits parallel requests).
const bjaedDois = [...new Set(CONTENT.notes.flatMap(n => (n.bjaed || []).map(b => b.doi)))];
for (let i = 0; i < bjaedDois.length; i += 20) {
  const batch = bjaedDois.slice(i, i + 20);
  const url = `https://api.crossref.org/works?rows=20&select=DOI&filter=${batch.map(d => 'doi:' + d).join(',')}`;
  const { status, text } = await get(url);
  let found = [];
  try { found = JSON.parse(text).message.items.map(x => x.DOI.toLowerCase()); } catch (e) { /* handled below */ }
  if (status !== 200) { batch.forEach(d => manual.push(`BJA Education ${d}: Crossref returned HTTP ${status || 'error'}`)); continue; }
  for (const d of batch) {
    if (found.includes(d.toLowerCase())) ok++;
    else problems.push(`\`BJA Education\`: DOI ${d} not found on Crossref`);
  }
  await new Promise(r => setTimeout(r, 1000));
}

const today = new Date().toISOString().slice(0, 10);
const report = [
  `## Link check ${today}`,
  '',
  `${ok} links OK, ${problems.length} problem(s), ${manual.length} to check by hand.`,
  '',
  problems.length ? '### Problems\n\n' + problems.map(p => `- ${p}`).join('\n') : '### Problems\n\nNone.',
  '',
  '### Check by hand (these sites block automated checks)',
  '',
  manual.map(m => `- ${m}`).join('\n'),
  '',
  'To fix an e-LfH problem, find the replacement session in the [e-LA catalogue](https://portal.e-lfh.org.uk/Catalogue/Index?HierarchyId=0_14&programmeId=14), update `code/data.js`, and update the `checked` date. The method is in `SOURCES.md` (S3).',
].join('\n');

writeFileSync(process.argv[2] || 'link-report.md', report + '\n');
console.log(report);
process.exit(problems.length ? 1 : 0);
