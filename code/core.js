/* Anaesthesia Training Companion — shared helpers, routing, search, theme and disclaimer.
 * Plain scripts, no build step for the app itself: the site opens straight from the file system.
 * Content (notes, questions, stations, pages) is compiled by scripts/build-content.mjs into code/content/. */
(function () {
  'use strict';

  const S = window.SITE;
  const C = window.CONTENT || { pages: {}, notes: [], stations: [], refs: {}, questions: { primary: { total: 0 }, final: { total: 0 } } };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach(c => { if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c)); });
    return n;
  }
  const ext = (href, text, cls) => el('a', { href, target: '_blank', rel: 'noopener', class: cls || 'ext' }, text);
  const html = s => { const t = document.createElement('template'); t.innerHTML = s; return t.content; };

  /* ---------- storage (per browser only; every access guarded) ---------- */
  const store = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } },
  };
  const KEYS = { novice: 'nas-progress-v1', notes: 'atc-notes-v1', qbank: 'atc-qbank-v1', sessions: 'atc-sessions-v1', stations: 'atc-stations-v1' };

  /* ---------- lazy content loading (script injection works on file://) ---------- */
  const loading = {};
  function loadPart(key) {
    window.CONTENT_PARTS = window.CONTENT_PARTS || {};
    if (window.CONTENT_PARTS[key]) return Promise.resolve(window.CONTENT_PARTS[key]);
    if (!loading[key]) loading[key] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `content/${key}.js`;
      s.onload = () => resolve(window.CONTENT_PARTS[key]);
      s.onerror = () => reject(new Error(`Could not load ${key}`));
      document.head.append(s);
    });
    return loading[key];
  }

  /* ---------- small UI pieces ---------- */
  const statusBadge = status => el('span', { class: `status ${status === 'reviewed' ? 'reviewed' : 'draft'}`, title: status === 'reviewed' ? 'Checked by a clinical reviewer' : 'Written and referenced; awaiting clinical review' }, status === 'reviewed' ? 'Reviewed' : 'Draft');

  function refList(ids) {
    const items = (ids || []).map(id => C.refs[id]).filter(Boolean);
    if (!items.length) return null;
    return el('ol', { class: 'refs' }, items.map(r => el('li', null, ext(r.u, r.t), r.s ? el('span', { class: 'ref-src' }, ` — ${r.s}`) : null)));
  }

  function elaList(codes) {
    const items = (codes || []).filter(c => S.ela[c]);
    if (!items.length) return null;
    return el('ul', { class: 'linklist ela-list' }, items.map(c => el('li', null, el('code', null, c), ' ', ext(S.ela[c][1], S.ela[c][0]))));
  }

  function feedbackUrl(kind, id, title, extra) {
    const body = [`${kind}: ${title} (id: ${id})`, extra || '', '', 'What is wrong or missing, and why? Please include a source for factual corrections.', ''].join('\n');
    return `${S.links.repo}/issues/new?labels=feedback&title=${encodeURIComponent(`Feedback: ${title}`)}&body=${encodeURIComponent(body)}`;
  }
  const reportLink = (kind, id, title, extra) => ext(feedbackUrl(kind, id, title, extra), 'Report a problem', 'suggest');

  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = el('div', { id: 'toast', class: 'toast', role: 'status' }); document.body.append(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function pct(a, b) { return b ? Math.round((100 * a) / b) : 0; }
  function meter(value, max, label) {
    return el('span', { class: 'meter', title: `${value} of ${max}` }, label ? el('span', { class: 'meter-label' }, label) : null,
      el('span', { class: 'bar', 'aria-hidden': 'true' }, el('span', { style: `width:${pct(value, max)}%` })),
      el('span', { class: 'meter-num' }, `${value}/${max}`));
  }

  /* ---------- sub-navigation per section ---------- */
  const SUBNAV = {
    novice: [['#start', 'Start here'], ['#journey', 'A GA step by step'], ['#syllabus', 'Syllabus'], ['#iac', 'The IAC'], ['#glossary', 'Glossary'], ['#checklist', 'Printable checklist']],
    exams: [['#exams', 'Overview'], ['#exams/primary', 'Primary FRCA'], ['#exams/final', 'Final FRCA'], ['#exams/transition', 'Which format will I sit?'], ['#exams/plan', 'Study plan'], ['#exams/banks', 'Question banks'], ['#exams/trainers', 'For trainers']],
    notes: [['#notes/primary', 'Primary notes'], ['#notes/final', 'Final notes'], ['#notes/coverage', 'Syllabus coverage']],
    questions: [['#questions', 'Practise'], ['#questions/mock', 'Mock papers'], ['#questions/stats', 'My progress']],
    stations: [['#stations', 'All stations'], ['#stations/how', 'How to use them']],
    resources: [['#resources', 'Key resources'], ['#resources/guidelines', 'Guidelines library'], ['#resources/portfolio', 'Portfolio & ARCP'], ['#resources/wellbeing', 'Wellbeing & flexibility']],
    stage1: null, stage2: null, stage3: null, home: null,
  };

  function setNav(tab, current) {
    $$('#main-tabs a').forEach(a => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const items = SUBNAV[tab];
    const bar = $('#sub-tabs');
    if (!items) { bar.hidden = true; return; }
    bar.hidden = false;
    $('#sub-tabs-inner').replaceChildren(...items.map(([href, label]) =>
      el('a', { href, 'aria-current': href === current ? 'page' : null }, label)));
    const active = $('#sub-tabs-inner [aria-current]');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  /* ---------- router ---------- */
  const routes = {};
  const VIEW_IDS = () => $$('main > .view').map(v => v.id.replace('view-', ''));
  function show(viewId) { VIEW_IDS().forEach(v => { $(`#view-${v}`).hidden = v !== viewId; }); }

  function route() {
    const hash = decodeURIComponent(location.hash.slice(1)) || 'home';
    const [pathPart, query] = hash.split('?');
    const [name, ...args] = pathPart.split('/');
    const params = new URLSearchParams(query || '');
    const handler = routes[name] || routes.home;
    hideSearch();
    const res = handler(args, params) || {};
    show(res.view || name);
    setNav(res.tab || name, res.current || '#' + pathPart);
    document.title = (res.title ? res.title + ' · ' : '') + 'Anaesthesia Training Companion';
    if (!res.keepScroll) window.scrollTo(0, 0);
    if (res.after) res.after();
  }
  function on(name, handler) { routes[name] = handler; }

  /* ---------- theme ---------- */
  function wireTheme() {
    const btn = $('#theme-toggle');
    const apply = t => {
      if (t === 'dark') document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = t === 'dark' ? 'Light mode' : 'Dark mode';
    };
    let theme = store.get('nas-theme-v2', 'light');
    apply(theme);
    btn.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; apply(theme); store.set('nas-theme-v2', theme); });
  }

  /* ---------- disclaimer banner ---------- */
  const DISCLAIMER_VERSION = 1;
  function wireDisclaimer() {
    const b = $('#disclaimer-banner');
    b.hidden = store.get('atc-disclaimer', 0) >= DISCLAIMER_VERSION;
    $('#disclaimer-ok').addEventListener('click', () => { store.set('atc-disclaimer', DISCLAIMER_VERSION); b.hidden = true; });
  }

  /* ---------- site search ---------- */
  let index = null;
  function buildIndex() {
    if (index) return index;
    index = [];
    const subjName = n => (C.subjects[n.exam] && C.subjects[n.exam][n.subject] ? C.subjects[n.exam][n.subject].name : n.subject);
    C.notes.forEach(n => index.push({ type: n.exam === 'primary' ? 'Primary note' : 'Final note', title: n.title, sub: subjName(n), href: `#notes/${n.id}`, hay: `${n.title} ${n.summary} ${n.keys} ${subjName(n)} ${n.codes.join(' ')}`.toLowerCase() }));
    C.stations.forEach(s => index.push({ type: s.exam === 'case' ? 'CASE station' : 'FCPE station', title: s.title, sub: s.arena, href: `#stations/${s.id}`, hay: `${s.title} ${s.summary} ${s.arena} ${s.domain} ${s.group}`.toLowerCase() }));
    Object.values(C.pages).forEach(p => index.push({ type: 'Guide', title: p.title, sub: '', href: App.pageHref(p.id), hay: `${p.title} ${p.html.replace(/<[^>]+>/g, ' ')}`.toLowerCase() }));
    S.domains.forEach(d => d.groups.forEach(g => g.topics.forEach(t => index.push({ type: 'Novice topic', title: t.title, sub: g.name, href: `#syllabus/${t.id}`, hay: `${t.title} ${t.note || ''} ${g.name}`.toLowerCase() }))));
    S.glossary.forEach(g => index.push({ type: 'Glossary', title: g.term, sub: g.def.slice(0, 80), href: '#glossary', hay: `${g.term} ${g.def}`.toLowerCase() }));
    return index;
  }
  function search(q, limit) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const scored = [];
    for (const it of buildIndex()) {
      if (!words.every(w => it.hay.includes(w))) continue;
      const t = it.title.toLowerCase();
      let score = 0;
      words.forEach(w => { if (t.includes(w)) score += 5; if (t.startsWith(w)) score += 3; });
      if (it.type === 'Guide') score -= 1;
      scored.push([score, it]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    return scored.slice(0, limit || 400).map(x => x[1]);
  }
  function hideSearch() { const p = $('#search-pop'); if (p) p.hidden = true; }
  function wireSearch() {
    const input = $('#site-q');
    const pop = $('#search-pop');
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < 2) { pop.hidden = true; return; }
        const res = search(q, 8);
        pop.replaceChildren(...(res.length ? res.map(r => el('a', { href: r.href, class: 'search-hit' }, el('span', { class: 'hit-type' }, r.type), el('span', { class: 'hit-title' }, r.title), r.sub ? el('span', { class: 'hit-sub' }, r.sub) : null)) : [el('p', { class: 'small', style: 'padding:.6rem .8rem;margin:0' }, 'No matches.')]),
          el('a', { href: `#search?q=${encodeURIComponent(q)}`, class: 'search-all' }, `See all results for “${q}”`));
        pop.hidden = false;
      }, 120);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { location.hash = `#search?q=${encodeURIComponent(input.value.trim())}`; input.blur(); }
      if (e.key === 'Escape') { hideSearch(); input.blur(); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.site-search')) hideSearch(); else if (e.target.closest('a')) { hideSearch(); input.value = ''; } });
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    });
  }
  on('search', (args, params) => {
    const q = params.get('q') || '';
    const res = search(q);
    const groups = {};
    res.forEach(r => { (groups[r.type] = groups[r.type] || []).push(r); });
    $('#view-search').replaceChildren(
      el('h1', null, `Search: “${q}”`),
      el('p', { class: 'lede' }, `${res.length} result${res.length === 1 ? '' : 's'}.`),
      ...Object.entries(groups).map(([type, list]) => el('section', { class: 'search-group' }, el('h2', null, type),
        el('ul', { class: 'result-list' }, list.map(r => el('li', null, el('a', { href: r.href }, r.title), r.sub ? el('span', { class: 'small' }, ` — ${r.sub}`) : null))))));
    return { view: 'search', tab: 'home', title: `Search: ${q}` };
  });

  /* ---------- static links ---------- */
  function fillStaticLinks(root = document) {
    $$('[data-link]', root).forEach(a => { const url = S.links[a.dataset.link]; if (url) a.href = url; });
    $$('[data-checked]', root).forEach(n => { n.textContent = S.checked; });
  }

  /* ---------- export / import all progress ---------- */
  function wireProgressTools() {
    const msg = text => { $('#progress-msg').textContent = text; };
    $('#export-progress').addEventListener('click', () => {
      const data = { exported: new Date().toISOString(), version: 2 };
      Object.entries(KEYS).forEach(([k, key]) => { data[k] = store.get(key, null); });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = el('a', { href: URL.createObjectURL(blob), download: 'anaesthesia-training-progress.json' });
      document.body.append(a); a.click(); a.remove();
      msg('Progress exported.');
    });
    $('#import-progress').addEventListener('change', async e => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const p = JSON.parse(await f.text());
        if (!p || typeof p !== 'object') throw new Error('bad file');
        if (p.version === 2) Object.entries(KEYS).forEach(([k, key]) => { if (p[k]) store.set(key, p[k]); });
        else if (p.topics || p.ela) store.set(KEYS.novice, { topics: p.topics || {}, ela: p.ela || {} }); // version 1 files (novice only)
        msg('Progress imported. Reloading…');
        setTimeout(() => location.reload(), 600);
      } catch (err) { msg('That file could not be read as progress data.'); }
      e.target.value = '';
    });
    let armed = false;
    $('#reset-progress').addEventListener('click', e => {
      if (!armed) { armed = true; e.target.textContent = 'Click again to confirm'; setTimeout(() => { armed = false; e.target.textContent = 'Clear all progress'; }, 4000); return; }
      Object.values(KEYS).forEach(k => store.remove(k));
      msg('All progress cleared. Reloading…');
      setTimeout(() => location.reload(), 600);
    });
  }

  on('about', () => {
    const q = C.questions.primary.total + C.questions.final.total;
    const reviewed = C.notes.filter(n => n.status === 'reviewed').length;
    $('#about-stats').textContent = `Content: ${C.notes.length} revision notes (${reviewed} reviewed), ${q} practice questions, ${C.stations.length} station packs. Content built ${C.built || '—'}.`;
    return { view: 'about', tab: 'home' };
  });

  /* ---------- public API ---------- */
  window.App = {
    S, C, $, $$, el, ext, html, store, KEYS, loadPart, statusBadge, refList, elaList, feedbackUrl, reportLink, toast, pct, meter,
    on, route, fillStaticLinks, search,
    pageHref: id => {
      if (id === 'exams') return '#exams';
      if (id.startsWith('exams-')) return '#exams/' + id.slice(6);
      if (id.startsWith('stage-')) return '#stage/' + id.slice(6);
      if (['guidelines', 'portfolio', 'wellbeing'].includes(id)) return '#resources/' + id;
      if (id === 'stations-how') return '#stations/how';
      return '#page/' + id;
    },
    start() {
      wireTheme();
      wireDisclaimer();
      wireSearch();
      fillStaticLinks();
      wireProgressTools();
      (App.inits || []).forEach(f => f());
      window.addEventListener('hashchange', route);
      route();
    },
    inits: [],
  };
})();
