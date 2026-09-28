/* Anaesthesia Training Companion — shared helpers, routing, search, theme and disclaimer.
 * Plain scripts, no build step for the app itself: the site opens straight from the file system.
 * Content (notes, questions, stations, pages) is compiled by scripts/build-content.mjs into code/content/. */
(function () {
  'use strict';

  const S = window.SITE;
  const C = window.CONTENT || { pages: {}, notes: [], stations: [], refs: {}, questions: { primary: { total: 0 }, final: { total: 0 } } };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // replaceChildren() turns null into the text "null"; views pass optional blocks as null, so skip them (as el() does).
  const nativeReplace = Element.prototype.replaceChildren;
  Element.prototype.replaceChildren = function (...kids) {
    return nativeReplace.apply(this, kids.flat(Infinity).filter(c => c != null && c !== false));
  };

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
  const KEYS = { novice: 'nas-progress-v1', notes: 'atc-notes-v1', qbank: 'atc-qbank-v1', sessions: 'atc-sessions-v1', stations: 'atc-stations-v1', caps: 'atc-caps-v1', rag: 'atc-rag-v1' };

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

  /* ---------- sidebar navigation ---------- */
  const I = {
    home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
    novice: '<path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1"/><circle cx="12" cy="14" r="5"/>',
    stage: '<path d="M4 19h16M6 16V9M12 16V5M18 16v-4"/>',
    exams: '<path d="M4 7l8-3 8 3-8 3z"/><path d="M7 8.5V13c0 1.5 2.2 3 5 3s5-1.5 5-3V8.5"/>',
    notes: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 11h6M9 15h6M9 7h3"/>',
    questions: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.4 2.4 0 1 1 3.3 2.2c-.6.3-.9.8-.9 1.4v.3M12 16.8v.1"/>',
    stations: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2M10 3h4"/>',
    resources: '<path d="M5 4h4v16H5zM10 4h4v16h-4zM15.5 4.5l3.8 1 -3.6 14.5-3.8-1z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>',
  };
  const icon = k => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;

  const SUBNAV = {
    // A plain string is a subheading.
    novice: ['Get started', ['#start', 'Start here'], ['#journey', 'A GA step by step'],
      'Syllabus', ['#syllabus', 'All topics'], ['#syllabus/d-basic-sciences', 'Basic sciences'], ['#syllabus/d-medicine-and-surgery', 'Medicine and surgery'], ['#syllabus/d-generic-anaesthesia', 'Generic anaesthesia'], ['#syllabus/d-critical-incidents-and-emergencies', 'Critical incidents'],
      'Sign-off', ['#iac', 'The IAC'], ['#checklist', 'Printable checklist'],
      'Reference', ['#glossary', 'Glossary']],
    stage1: ['This stage', ['#stage/1', 'Overview'], ['#stage/1/year-by-year', 'Year by year and ARCP'], ['#stage/1/the-stage-1-certificate', 'The Stage 1 certificate'],
      'Curriculum', ['#stage/1/capabilities', 'Key capabilities'], ['#stage/1/checklist', 'Printable checklist'],
      'Clinical training', ['#stage/1/units', 'Unit guides'], ['#stage/1/clinical-blocks-in-stage-1', 'Blocks and e-learning'],
      'Primary FRCA', ['#stage/1/the-primary-frca', 'The exam'], ['#map/primary', 'Syllabus map'], ['#stage/1/revision-notes-by-paper', 'Revision notes by paper'],
      'Local', ['#stage/1/in-yorkshire-and-humber', 'Yorkshire and Humber']],
    stage2: ['This stage', ['#stage/2', 'Overview'], ['#stage/2/year-by-year', 'Year by year and ARCP'], ['#stage/2/the-stage-2-certificate', 'The Stage 2 certificate'],
      'Curriculum', ['#stage/2/capabilities', 'Key capabilities'], ['#stage/2/checklist', 'Printable checklist'],
      'Clinical training', ['#stage/2/units', 'Unit guides'], ['#stage/2/the-units-of-stage-2', 'Units and e-learning'],
      'Final FRCA', ['#stage/2/the-final-frca', 'The exam'], ['#map/final', 'Syllabus map'], ['#stage/2/revision-notes-by-topic', 'Revision notes by topic'],
      'Local', ['#stage/2/in-yorkshire-and-humber', 'Yorkshire and Humber']],
    stage3: ['This stage', ['#stage/3', 'Overview'], ['#stage/3/year-by-year', 'Year by year and ARCP'], ['#stage/3/from-certificate-to-cct', 'Certificate to CCT'],
      'Curriculum', ['#stage/3/capabilities', 'Key capabilities'], ['#stage/3/checklist', 'Printable checklist'],
      'Special Interest Areas', ['#stage/3/sias', 'All SIAs'], ['#stage/3/choosing-and-evidencing-an-sia', 'Choosing an SIA'],
      'Beyond the core', ['#stage/3/subspecialties', 'Subspecialties'], ['#stage/3/dual-training-and-acting-up', 'Dual training and acting up'], ['#stage/3/preparing-for-consultant-practice', 'Consultant practice'],
      'Local', ['#stage/3/in-yorkshire-and-humber', 'Yorkshire and Humber']],
    exams: [['#exams', 'Overview'], ['#exams/primary', 'Primary FRCA'], ['#exams/final', 'Final FRCA'], ['#exams/transition', 'Which format will I sit?'], ['#exams/plan', 'Study plan'], ['#exams/banks', 'Question banks'], ['#exams/trainers', 'For trainers']],
    notes: ['Syllabus maps', ['#map/primary', 'Primary syllabus map'], ['#map/final', 'Final syllabus map'], 'Notes', ['#notes/primary', 'Primary notes'], ['#notes/final', 'Final notes'], ['#notes/coverage', 'Code coverage']],
    questions: [['#questions', 'Practise'], ['#questions/mock', 'Mock papers'], ['#questions/stats', 'My progress']],
    stations: [['#stations', 'All stations'], ['#stations/how', 'How to use them']],
    resources: [['#resources', 'Key resources'], ['#resources/guidelines', 'Guidelines library'], ['#resources/portfolio', 'Portfolio & ARCP'], ['#resources/wellbeing', 'Wellbeing & flexibility']],
  };
  const NAV = [
    { items: [['home', '#home', 'Home', 'home']] },
    { label: 'Training', items: [['novice', '#start', 'Novice (IAC)', 'novice'], ['stage1', '#stage/1', 'Stage 1 · CT1–3', 'stage'], ['stage2', '#stage/2', 'Stage 2 · ST4–5', 'stage'], ['stage3', '#stage/3', 'Stage 3 · ST6–7', 'stage']] },
    { label: 'FRCA', items: [['exams', '#exams', 'Exams hub', 'exams']] },
    { label: 'Study', items: [['notes', '#notes', 'Revision notes', 'notes'], ['questions', '#questions', 'Question bank', 'questions'], ['stations', '#stations', 'Station practice', 'stations']] },
    { label: 'More', items: [['resources', '#resources', 'Resources', 'resources'], ['about', '#about', 'About', 'info']] },
  ];

  // Sections can add a block under their sub-menu (navExtras[tab] = () => node)
  // and a count beside a sub-menu link (navCounts[href] = () => '3/19').
  const navExtras = {};
  const navCounts = {};

  // Each stage of training has its own accent colour (matches the home-page stage cards).
  const STAGE_OF = { novice: 0, stage1: 1, stage2: 2, stage3: 3 };
  let navState = [];
  function setNav(tab, current) {
    navState = [tab, current];
    const nav = $('#side-nav');
    if (!nav) return;
    nav.replaceChildren(...NAV.map(group => el('div', { class: 'nav-group' },
      group.label ? el('p', { class: 'nav-label' }, group.label) : null,
      el('ul', null, group.items.map(([key, href, label, ic]) => {
        const active = key === tab;
        const kids = active && SUBNAV[key];
        const stage = STAGE_OF[key];
        return el('li', { class: [active ? 'active' : '', stage != null ? `stage-item s${stage}` : ''].join(' ').trim() || null },
          el('a', { href, class: 'nav-link', 'aria-current': active && !kids ? 'page' : null, html: `${icon(ic)}<span>${label}</span>` }),
          kids ? el('ul', { class: 'nav-sub' }, kids.map(k => typeof k === 'string'
            ? el('li', { class: 'nav-sub-label' }, k)
            : el('li', null, el('a', { href: k[0], 'aria-current': k[0] === current ? 'page' : null }, k[1], navCounts[k[0]] ? el('span', { class: 'nav-count' }, navCounts[k[0]]()) : null)))) : null,
          active && navExtras[key] ? navExtras[key]() : null);
      })))));
  }

  /* ---------- mobile drawer ---------- */
  function closeDrawer() {
    document.body.classList.remove('drawer-open');
    const s = $('#scrim'); if (s) s.hidden = true;
    const b = $('#menu-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
  }
  function wireDrawer() {
    const b = $('#menu-toggle');
    if (!b) return;
    b.addEventListener('click', () => {
      const open = !document.body.classList.contains('drawer-open');
      document.body.classList.toggle('drawer-open', open);
      $('#scrim').hidden = !open;
      b.setAttribute('aria-expanded', String(open));
    });
    $('#scrim').addEventListener('click', closeDrawer);
    $('#side-nav').addEventListener('click', e => { if (e.target.closest('a')) closeDrawer(); });
  }

  /* ---------- "On this page" contents ---------- */
  function toc(root, title) {
    const heads = $$('h2[id]', root);
    if (heads.length < 3) return null;
    const list = el('ol', null, heads.map(h => el('li', null, el('a', { href: '#', 'data-target': h.id, onclick: e => { e.preventDefault(); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, h.textContent))));
    const box = el('nav', { class: 'toc', 'aria-label': 'On this page' }, el('p', { class: 'toc-title' }, title || 'On this page'), list);
    if ('IntersectionObserver' in window) {
      const links = Object.fromEntries($$('a', list).map(a => [a.dataset.target, a]));
      const obs = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { $$('a', list).forEach(a => a.classList.remove('on')); links[en.target.id] && links[en.target.id].classList.add('on'); } });
      }, { rootMargin: '-80px 0px -70% 0px' });
      heads.forEach(h => obs.observe(h));
    }
    return box;
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
    closeDrawer();
    const res = handler(args, params) || {};
    show(res.view || name);
    setNav(res.tab || name, res.current || '#' + pathPart);
    const stage = STAGE_OF[res.tab || name];
    if (stage != null) document.body.dataset.stage = stage; else delete document.body.dataset.stage;
    document.title = (res.title ? res.title + ' · ' : '') + 'Anaesthesia Training Companion';
    document.body.dataset.view = res.view || name;
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
    const strip = h => h.replace(/<[^>]+>/g, ' ');
    (C.units || []).forEach(u => index.push({ type: 'Unit guide', title: u.title, sub: `Stage ${u.stage}`, href: `#stage/${u.stage}/unit/${u.id}`, hay: `${u.title} ${strip(u.lede)} ${strip(u.html)}`.toLowerCase() }));
    Object.values(C.capabilities || {}).forEach(set => set.domains.forEach(d => {
      const sia = set.key === 'sias';
      index.push({ type: sia ? 'SIA' : `Stage ${set.stage} domain`, title: d.name, sub: strip(d.outcome).slice(0, 90), href: sia ? `#stage/3/sia/${d.id}` : `#stage/${set.stage}/capabilities/${d.id}`,
        hay: `${d.name} ${strip(d.outcome)} ${d.groups.map(g => g.name + ' ' + g.caps.map(c => strip(c.text)).join(' ')).join(' ')}`.toLowerCase() });
    }));
    ['primary', 'final'].forEach(ex => index.push({ type: 'Syllabus map', title: `${ex === 'primary' ? 'Primary' : 'Final'} FRCA syllabus map`, sub: 'Topics, confidence ratings, textbooks and resources', href: `#map/${ex}`, hay: `${ex} syllabus map revision tracker textbooks resources rag confidence`.toLowerCase() }));
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
  function hideSearch() { const p = $('#palette'); if (p && !p.hidden) { p.hidden = true; document.body.classList.remove('palette-open'); } }
  function openSearch() {
    const p = $('#palette');
    p.hidden = false;
    document.body.classList.add('palette-open');
    const input = $('#site-q');
    input.value = '';
    renderHits('');
    setTimeout(() => input.focus(), 10);
  }
  let hitIndex = 0;
  function renderHits(q) {
    const pop = $('#search-pop');
    hitIndex = 0;
    if (q.trim().length < 2) {
      pop.replaceChildren(el('div', { class: 'palette-hint' },
        el('p', { class: 'palette-hint-title' }, 'Jump to'),
        el('div', { class: 'palette-quick' }, [['#map/primary', 'Primary syllabus map'], ['#map/final', 'Final syllabus map'], ['#notes/primary', 'Primary notes'], ['#notes/final', 'Final notes'], ['#questions/mock', 'Mock papers'], ['#stations', 'Station practice'], ['#exams', 'FRCA 2027 changes'], ['#start', 'Novice start'], ['#stage/1/capabilities', 'Stage 1 capabilities'], ['#stage/2/units', 'Stage 2 unit guides'], ['#stage/3/sias', 'SIAs']].map(([h, l]) => el('a', { href: h }, l)))));
      return;
    }
    const res = search(q, 10);
    pop.replaceChildren(...(res.length ? res.map((r, i) => el('a', { href: r.href, class: 'search-hit' + (i === 0 ? ' sel' : '') },
      el('span', { class: 'hit-type' }, r.type), el('span', { class: 'hit-title' }, r.title), r.sub ? el('span', { class: 'hit-sub' }, r.sub) : null))
      : [el('p', { class: 'palette-empty' }, `No matches for “${q}”.`)]),
    el('a', { href: `#search?q=${encodeURIComponent(q)}`, class: 'search-all' }, `See all results for “${q}” →`));
  }
  function wireSearch() {
    const input = $('#site-q');
    const palette = $('#palette');
    let t;
    $('#search-trigger').addEventListener('click', openSearch);
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => renderHits(input.value), 90); });
    input.addEventListener('keydown', e => {
      const hits = $$('#search-pop .search-hit');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!hits.length) return;
        hits[hitIndex] && hits[hitIndex].classList.remove('sel');
        hitIndex = (hitIndex + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
        hits[hitIndex].classList.add('sel');
        hits[hitIndex].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const sel = hits[hitIndex];
        location.hash = sel ? sel.getAttribute('href') : `#search?q=${encodeURIComponent(input.value.trim())}`;
        hideSearch();
      }
      if (e.key === 'Escape') hideSearch();
    });
    palette.addEventListener('click', e => { if (e.target === palette || e.target.closest('a')) hideSearch(); });
    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { hideSearch(); closeDrawer(); }
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
    on, route, fillStaticLinks, search, toc, navExtras, navCounts,
    refreshNav: () => setNav(...navState),
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
      wireDrawer();
      fillStaticLinks();
      wireProgressTools();
      (App.inits || []).forEach(f => f());
      window.addEventListener('hashchange', route);
      route();
    },
    inits: [],
  };
})();
