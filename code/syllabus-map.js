/* The four-part syllabus overview (#map), and readable syllabus maps for the Primary and Final FRCA: topics by paper and subject with a red/amber/green
 * self-rating, core textbooks and free resources, plus the official RCoA section structure.
 * Ratings are saved per browser under KEYS.rag as { noteId: 'r' | 'a' | 'g' }. */
(function () {
  'use strict';
  const { $, $$, el, C, store, KEYS } = App;

  const EXAM = { primary: 'Primary FRCA', final: 'Final FRCA' };
  const RAG = [['r', 'Not yet', 'Not confident yet'], ['a', 'Getting there', 'Partly confident'], ['g', 'Confident', 'Confident: ready for questions']];
  const ratings = () => store.get(KEYS.rag, {});
  const noteById = id => C.notes.find(n => n.id === id);
  const readMap = () => store.get(KEYS.notes, {});
  const qFor = n => (C.questions[n.exam].byNote || {})[n.id] || 0;
  const state = { view: 'subject', only: '' };

  function tally(ids) {
    const r = ratings();
    const t = { g: 0, a: 0, r: 0, n: 0 };
    ids.forEach(id => { t[r[id] || 'n']++; });
    return t;
  }
  function ragBar(ids) {
    const t = tally(ids);
    const total = ids.length || 1;
    return el('span', { class: 'rag-bar', title: `${t.g} confident · ${t.a} getting there · ${t.r} not yet · ${t.n} not rated` },
      ['g', 'a', 'r', 'n'].map(k => el('span', { class: `rag-${k}`, style: `width:${(100 * t[k]) / total}%` })));
  }
  const subjectIds = sj => sj.groups.flatMap(g => g.notes);

  function topicRow(id) {
    const n = noteById(id);
    if (!n) return null;
    const cur = ratings()[id] || '';
    if (state.only && !(state.only === 'n' ? !cur : cur === state.only)) return null;
    const q = qFor(n);
    const read = readMap()[id] && readMap()[id].done;
    return el('li', { class: 'map-topic', 'data-rag': cur || 'n' },
      el('div', { class: 'rag-pick', role: 'radiogroup', 'aria-label': `Confidence: ${n.title}` },
        RAG.map(([k, label, title]) => el('button', { type: 'button', class: `rag-btn rag-${k}`, role: 'radio', 'aria-checked': String(cur === k), title, 'data-note': id, 'data-rag': k }, el('span', { class: 'sr-only' }, label)))),
      el('div', { class: 'map-topic-main' },
        el('a', { class: 'map-topic-title', href: `#notes/${id}` }, n.title),
        el('span', { class: 'map-topic-meta' },
          `${n.codes.length} syllabus code${n.codes.length === 1 ? '' : 's'}`,
          q ? el('a', { href: `#questions/note/${id}` }, `${q} question${q === 1 ? '' : 's'}`) : null,
          (n.bjaed || []).length ? el('a', { href: `#notes/${id}`, title: n.bjaed.map(b => b.t).join('\n') }, `BJA Ed ×${n.bjaed.length}`) : null,
          read ? el('span', { class: 'read-tick' }, '✓ read') : null)));
  }

  function subjectCard(exam, sj) {
    const ids = subjectIds(sj);
    const groups = sj.groups.map(g => {
      const rows = g.notes.map(topicRow).filter(Boolean);
      return rows.length ? el('div', { class: 'map-group' }, sj.groups.length > 1 ? el('h4', null, g.name) : null, el('ul', { class: 'map-topics' }, rows)) : null;
    }).filter(Boolean);
    if (!groups.length) return null;
    return el('section', { class: 'map-subject', id: `map-${sj.id}` },
      el('header', { class: 'map-subject-head' },
        el('h3', null, sj.name),
        el('span', { class: 'map-subject-n' }, `${ids.length} topics`),
        ragBar(ids)),
      readingStrip(sj),
      groups);
  }

  // Short, always-visible pointers under each subject heading; the title attribute carries why each is useful.
  function readingStrip(sj) {
    const texts = sj.texts.map(id => C.texts[id]).filter(Boolean);
    const free = [
      ...sj.refs.map(r => C.refs[r] && [C.refs[r].t.replace(/\s*\(.*$/, ''), C.refs[r].u]),
      ...sj.ela.map(([name, url]) => [name, url]),
    ].filter(Boolean);
    const link = (label, url, title) => el('a', { class: 'ext', href: url, target: '_blank', rel: 'noopener', title }, label);
    return el('div', { class: 'map-reading' },
      texts.length ? el('p', null, el('span', { class: 'map-reading-h' }, 'Core texts'),
        texts.map((t, i) => [i ? el('span', { class: 'sep' }, ' · ') : null, link(t.t, t.u, t.why), el('span', { class: 'text-meta' }, ` (${t.a.split(',')[0].replace(/ \(eds?\)$/, '')}${t.a.includes(',') ? ' et al.' : ''}, ${t.ed.replace(' edition', ' ed.')}, ${t.y})`)])) : null,
      free.length ? el('p', null, el('span', { class: 'map-reading-h' }, 'Free'),
        free.map(([label, url], i) => [i ? el('span', { class: 'sep' }, ' · ') : null, link(label, url, '')])) : null);
  }

  function bySubject(exam) {
    const M = C.syllabusMap[exam];
    return M.papers.map(p => {
      const cards = p.subjects.map(sj => subjectCard(exam, sj)).filter(Boolean);
      return cards.length ? el('section', { class: 'map-paper' }, el('h2', { id: `paper-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }, p.name), cards) : null;
    }).filter(Boolean);
  }

  function bySection(exam) {
    const M = C.syllabusMap[exam];
    const doms = [];
    M.sections.forEach(s => { let d = doms.find(x => x.name === s.domain); if (!d) doms.push(d = { name: s.domain, items: [] }); d.items.push(s); });
    return doms.map(d => el('section', { class: 'map-paper' },
      el('h2', { id: `dom-${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }, d.name),
      el('div', { class: 'map-sections' }, d.items.map(s => el('div', { class: 'map-section' },
        el('div', { class: 'map-section-head' },
          el('span', { class: 'cap-k' }, s.letter + (s.part ? ` (${s.part})` : '')),
          el('span', { class: 'map-section-label', html: s.label }),
          el('a', { class: 'map-section-codes', href: `#notes/coverage/${exam}`, title: 'Show these codes on the coverage map' }, `${s.codes} code${s.codes === 1 ? '' : 's'}`)),
        el('div', { class: 'code-chips' }, s.notes.map(id => {
          const n = noteById(id);
          const r = ratings()[id];
          return n ? el('a', { class: `topic-chip${r ? ' rated-' + r : ''}`, href: `#notes/${id}` }, n.title) : null;
        })))))));
  }

  function render(exam) {
    const M = C.syllabusMap[exam];
    const allIds = M.papers.flatMap(p => p.subjects.flatMap(subjectIds));
    const t = tally(allIds);
    const view = $('#view-map');
    const body = el('div', { class: 'map-body' });
    const draw = () => body.replaceChildren(...(state.view === 'subject' ? bySubject(exam) : bySection(exam)));
    const seg = (items, key, onPick) => el('div', { class: 'seg', role: 'radiogroup' }, items.map(([k, label]) =>
      el('button', { type: 'button', role: 'radio', 'aria-checked': String(state[key] === k), onclick: e => { state[key] = k; $$('button', e.target.closest('.seg')).forEach(b => b.setAttribute('aria-checked', String(b === e.target.closest('button')))); onPick(); } }, label)));
    const other = exam === 'primary' ? 'final' : 'primary';
    const focus = allIds.filter(id => (ratings()[id] || 'n') === 'r').slice(0, 6);
    const main = el('div', { class: 'doc-main' },
      el('header', { class: 'page-head' },
        el('p', { class: 'eyebrow' }, `${EXAM[exam]} · syllabus map`),
        el('h1', null, `${EXAM[exam]} syllabus map`),
        el('p', { class: 'lede' }, M.intro),
        el('p', { class: 'meta-line' }, el('span', { class: 'dot-ok' }), `${allIds.length} topics covering all ${C.codes[exam].length} RCoA syllabus codes · `, el('a', { href: `#map/${other}` }, `${EXAM[other]} map →`))),
      el('div', { class: 'card map-dash' },
        el('div', { class: 'map-dash-top' },
          el('div', null,
            el('p', { class: 'cap-summary-n' }, el('span', null, String(t.g)), ` of ${allIds.length}`),
            el('p', { class: 'small' }, 'topics rated confident')),
          el('div', { class: 'map-dash-bar' }, ragBar(allIds),
            el('p', { class: 'rag-legend small' },
              el('span', { class: 'rag-dot rag-g' }), ` Confident ${t.g}  `, el('span', { class: 'rag-dot rag-a' }), ` Getting there ${t.a}  `,
              el('span', { class: 'rag-dot rag-r' }), ` Not yet ${t.r}  `, el('span', { class: 'rag-dot rag-n' }), ` Not rated ${t.n}`))),
        focus.length ? el('p', { class: 'map-focus small' }, el('strong', null, 'Revise next: '), focus.map((id, i) => [i ? ' · ' : '', el('a', { href: `#notes/${id}` }, noteById(id).title)])) : null,
        el('p', { class: 'small map-how' }, 'Rate each topic with the three dots: red for not yet, amber for getting there, green for confident. Ratings stay in this browser; export them from the About page.')),
      el('div', { class: 'filters card no-print map-controls' },
        el('div', { class: 'toggles' },
          seg([['subject', 'By subject'], ['section', 'By RCoA section']], 'view', draw),
          seg([['', 'All'], ['n', 'Not rated'], ['r', 'Not yet'], ['a', 'Getting there'], ['g', 'Confident']], 'only', draw))),
      body);
    const layout = el('div', { class: 'doc-layout has-rail' }, main, el('aside', { class: 'doc-rail' }));
    view.replaceChildren(layout);
    draw();
    const rail = App.toc(body, state.view === 'subject' ? 'Papers' : 'Domains');
    if (rail) layout.lastChild.append(rail);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('.rag-btn');
    if (!b) return;
    const r = ratings();
    const id = b.dataset.note;
    if (r[id] === b.dataset.rag) delete r[id]; else r[id] = b.dataset.rag; // click again to clear
    store.set(KEYS.rag, r);
    const exam = (noteById(id) || {}).exam;
    const y = window.scrollY;
    render(exam);
    window.scrollTo(0, y);
  });

  /* ---------- four-part overview (#map) ----------
   * Landing page: the four boxes of the source novice guide as coloured tiles (laid out 1 | 2 over 3 | 4, reading order), each listing its sections. Each section has its own page (#map/<box>/<section>) with
   * every novice topic, note, unit guide and SIA in it. The level filter travels in the URL as ?level=. */
  const LEVELS = [['all', 'Everything'], ['novice', 'Novice'], ['primary', 'Primary'], ['final', 'Final']];
  const LEVEL_NAME = { novice: 'Novice', primary: 'Primary', final: 'Final', stage3: 'Stage 3' };
  const LEVEL_BLOCK = {
    novice: ['Novice topics', 'The first months and the IAC, each with e-LA sessions to work through.'],
    primary: ['Primary FRCA and Stage 1', 'Revision notes for the Primary, and Stage 1 unit guides.'],
    final: ['Final FRCA and Stage 2', 'Revision notes for the Final, and Stage 2 unit guides.'],
    stage3: ['Stage 3 Special Interest Areas', 'Where this area goes in your final years of training.'],
  };
  const KIND_NAME = { unit: 'Unit guide', sia: 'SIA' };
  const QICON = {
    'basic-sciences': '<path d="M9 3h6M10 3v6.5L4.8 18.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9.5V3"/><path d="M7.5 14h9"/>',
    'medicine-surgery': '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    'generic-anaesthesia': '<path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5 6.8 15M17.2 9l2.6-1.5"/><circle cx="12" cy="12" r="4"/>',
    'anaesthetic-specialities': '<path d="M12 3 4 7l8 4 8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/>',
  };
  const qIcon = id => el('span', { class: 'ovq-icon', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${QICON[id] || ''}</svg>` });
  const slugify = t => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const shows = (level, lv) => level === 'all' || level === lv;
  const withLevel = (href, level) => level === 'all' ? href : `${href}?level=${level}`;
  const isDone = ([lv, , href]) => {
    const id = href.split('/').pop();
    if (lv === 'novice') return !!(App.novice && App.novice.progress.topics[id]);
    return href.startsWith('#notes/') && !!(readMap()[id] && readMap()[id].done);
  };
  const sectionsOf = q => q.groups.flatMap(g => g.sections.map(s => ({ ...s, group: g.name, slug: slugify(s.name) })));
  const count = (items, level) => items.filter(([lv]) => shows(level, lv)).length;

  App.syllabusLevels = LEVELS;
  function levelSeg(level, hrefFor) {
    return el('nav', { class: 'seg ov-filter', 'aria-label': 'Show topics for' },
      LEVELS.map(([k, label]) => el('a', { href: hrefFor(k), 'aria-current': level === k ? 'true' : null }, label)));
  }

  function ovTile(q, level) {
    const secs = sectionsOf(q);
    const total = secs.reduce((a, s) => a + count(s.items, level), 0);
    const groups = q.groups.map(g => el('div', { class: 'ovq-group' },
      g.name ? el('p', { class: 'ovq-group-name' }, g.name) : null,
      el('ul', { class: 'ovq-links' }, g.sections.map(s => {
        const n = count(s.items, level);
        const href = withLevel(`#map/${q.id}/${slugify(s.name)}`, level);
        return el('li', null, n
          ? el('a', { href }, el('span', null, s.name), el('span', { class: 'ovq-n' }, String(n)))
          : el('span', { class: 'ovq-empty', title: `Nothing at ${LEVEL_NAME[level]} level` }, s.name));
      }))));
    return el('section', { class: `ovq ovq-${q.n}`, 'aria-labelledby': `qh-${q.id}` },
      el('span', { class: 'ovq-num', 'aria-hidden': 'true' }, String(q.n)),
      el('header', { class: 'ovq-head' },
        qIcon(q.id),
        el('div', null,
          el('h2', { id: `qh-${q.id}` }, q.name),
          el('p', { class: 'ovq-blurb' }, q.blurb))),
      el('p', { class: 'ovq-total' }, el('strong', null, String(total)), ` topic${total === 1 ? '' : 's'}`, level === 'all' ? '' : ` at ${LEVEL_NAME[level]} level`),
      groups);
  }

  // The rows differ in height, so centre the hub on the real junction of the four boxes (midway through the gaps).
  function placeHub(grid) {
    // Boxes read 1 | 2 over 3 | 4.
    const hub = $('.ovq-hub', grid), a = $('.ovq-1', grid), b = $('.ovq-2', grid), c = $('.ovq-3', grid);
    if (!hub || !a || !b || !c) return;
    hub.style.top = `${(a.offsetTop + a.offsetHeight + c.offsetTop) / 2}px`;
    hub.style.left = `${(a.offsetLeft + a.offsetWidth + b.offsetLeft) / 2}px`;
  }
  const hubObservers = [];
  // The four boxes and hub, as used on this page and the home page.
  function boxGrid(level) {
    const grid = el('div', { class: 'ovq-grid' },
      C.overview.quadrants.map(q => ovTile(q, level)),
      el('div', { class: 'ovq-hub', 'aria-hidden': 'true' }, el('span', null, 'Syllabus')));
    for (let i = hubObservers.length - 1; i >= 0; i--) if (!hubObservers[i][0].isConnected) { hubObservers[i][1].disconnect(); hubObservers.splice(i, 1); }
    if ('ResizeObserver' in window) {
      const obs = new ResizeObserver(() => placeHub(grid));
      $$('.ovq', grid).forEach(q => obs.observe(q));
      hubObservers.push([grid, obs]);
    }
    requestAnimationFrame(() => placeHub(grid));
    return grid;
  }
  App.syllabusBoxes = boxGrid;

  function renderOverview(level) {
    const O = C.overview;
    const everything = O.quadrants.flatMap(q => sectionsOf(q).flatMap(s => s.items)).concat(O.across.items);
    const uniq = lv => new Set(everything.filter(([l]) => l === lv).map(it => it[2])).size;
    const acrossN = count(O.across.items, level);
    $('#view-map').replaceChildren(el('div', { class: 'ov-page' },
      el('header', { class: 'ov-hero' },
        el('p', { class: 'eyebrow' }, 'The syllabus'),
        el('h1', null, 'Everything you need to know, ', el('em', null, 'in four boxes')),
        el('p', { class: 'lede' }, 'From your first list to the Final, every topic sits in one of four parts. Pick a box, open a section, and follow the links to topics, revision notes and unit guides.'),
        el('div', { class: 'ov-stats' },
          [['novice', uniq('novice'), 'novice topics'], ['primary', uniq('primary'), 'Primary and Stage 1'], ['final', uniq('final'), 'Final and Stage 2'], ['stage3', uniq('stage3'), 'Stage 3 SIAs']].map(([lv, n, label]) =>
            el('span', { class: `ov-stat lv-${lv}` }, el('strong', null, String(n)), label)))),
      el('div', { class: 'ov-bar no-print' }, el('span', { class: 'small' }, 'Show:'), levelSeg(level, k => withLevel('#map', k))),
      boxGrid(level),
      acrossN ? el('a', { class: 'ov-across', href: withLevel('#map/across', level) },
        el('span', null, el('strong', null, O.across.name), el('span', { class: 'small' }, ` · ${acrossN} topic${acrossN === 1 ? '' : 's'}`)), el('span', { class: 'ov-arrow' }, '→')) : null,
      el('p', { class: 'small ov-foot' }, 'The four-part structure is adapted from the novice guide credited on the ', el('a', { href: '#about' }, 'About page'), '. For confidence ratings and textbooks, use the ', el('a', { href: '#map/primary' }, 'Primary'), ' and ', el('a', { href: '#map/final' }, 'Final'), ' syllabus maps.')));
  }

  // Which topic group a note sits in on its exam's syllabus map, for sub-headings on big sections.
  let noteGroup = null;
  const groupOf = id => {
    if (!noteGroup) { noteGroup = {}; ['primary', 'final'].forEach(ex => C.syllabusMap[ex].papers.forEach(p => p.subjects.forEach(sj => sj.groups.forEach(g => g.notes.forEach(n => { noteGroup[n] = g.name; }))))); }
    return noteGroup[id];
  };
  const mapSubject = (exam, sid) => C.syllabusMap[exam].papers.flatMap(p => p.subjects).find(x => x.id === sid);

  function itemCard(it) {
    const [lv, title, href, kind] = it;
    const done = isDone(it);
    const n = href.startsWith('#notes/') ? noteById(href.slice(7)) : null;
    const q = n ? qFor(n) : 0;
    return el('li', null, el('a', { class: `ovs-card lv-${lv}${done ? ' is-done' : ''}`, href },
      el('span', { class: 'ovs-card-title' }, title),
      el('span', { class: 'ovs-card-meta' },
        el('span', { class: 'ovs-kind' }, kind ? KIND_NAME[kind] : lv === 'novice' ? 'Topic · e-LA' : 'Revision note'),
        q ? el('span', null, `${q} question${q === 1 ? '' : 's'}`) : null,
        done ? el('span', { class: 'ovs-done' }, '✓ done') : null)));
  }

  function levelBlock(lv, items) {
    const [h, sub] = LEVEL_BLOCK[lv];
    const notesOnly = items.filter(it => it[2].startsWith('#notes/'));
    const others = items.filter(it => !it[2].startsWith('#notes/'));
    let lists;
    if (notesOnly.length > 8) {
      const byGroup = new Map();
      notesOnly.forEach(it => { const g = groupOf(it[2].slice(7)) || 'Other'; if (!byGroup.has(g)) byGroup.set(g, []); byGroup.get(g).push(it); });
      lists = [...byGroup].map(([g, list]) => el('div', { class: 'ovs-sub' }, el('h3', null, g), el('ul', { class: 'ovs-cards' }, list.map(itemCard))));
      if (others.length) lists.push(el('div', { class: 'ovs-sub' }, el('h3', null, 'Guides'), el('ul', { class: 'ovs-cards' }, others.map(itemCard))));
    } else lists = [el('ul', { class: 'ovs-cards' }, items.map(itemCard))];
    return el('section', { class: `ovs-block lv-${lv}` },
      el('header', { class: 'ovs-block-head' }, el('h2', { id: `lv-${lv}` }, h), el('span', { class: 'ovs-block-n' }, String(items.length)), el('p', { class: 'small' }, sub)),
      lists);
  }

  function renderSection(qid, slug, level) {
    const O = C.overview;
    const across = qid === 'across';
    const q = across ? null : O.quadrants.find(x => x.id === qid);
    const secs = q ? sectionsOf(q) : [];
    const s = across ? { name: 'Professional practice, safety and quality', items: O.across.items, maps: [] } : secs.find(x => x.slug === slug) || secs[0];
    if (!s) { location.replace('#map'); return 'Syllabus'; }
    const i = secs.indexOf(s);
    const items = s.items.filter(([lv]) => shows(level, lv));
    const blocks = ['novice', 'primary', 'final', 'stage3'].map(lv => [lv, items.filter(it => it[0] === lv)]).filter(([, l]) => l.length);
    const maps = (s.maps || []).filter(([exam]) => level === 'all' || level === exam).map(([exam, sid]) => [exam, mapSubject(exam, sid)]).filter(([, sj]) => sj);
    const here = k => withLevel(across ? '#map/across' : `#map/${q.id}/${s.slug}`, k);
    $('#view-map').replaceChildren(el('div', { class: `ovs-page ${q ? 'ovq-' + q.n : 'ovq-0'}` },
      el('header', { class: 'ovs-hero' },
        el('p', { class: 'crumbs' }, el('a', { href: withLevel('#map', level) }, 'The syllabus'), ' / ', q ? `${q.n} · ${q.name}` : 'Across all four'),
        el('div', { class: 'ovs-title' }, q ? qIcon(q.id) : null, el('div', null,
          s.group ? el('p', { class: 'ovs-eyebrow' }, s.group) : null,
          el('h1', null, s.name))),
        el('div', { class: 'ov-stats' }, ['novice', 'primary', 'final', 'stage3'].map(lv => { const n = s.items.filter(it => it[0] === lv).length; return n ? el('a', { class: `ov-stat lv-${lv}`, href: `#lv-${lv}`, onclick: e => { e.preventDefault(); const t = document.getElementById(`lv-${lv}`); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, el('strong', null, String(n)), LEVEL_NAME[lv]) : null; }))),
      q && secs.length > 1 ? el('nav', { class: 'ovs-siblings no-print', 'aria-label': `Sections of ${q.name}` }, secs.map(x => el('a', { href: withLevel(`#map/${q.id}/${x.slug}`, level), 'aria-current': x === s ? 'page' : null, class: count(x.items, level) ? null : 'is-empty' }, x.name))) : null,
      el('div', { class: 'ov-bar no-print' }, el('span', { class: 'small' }, 'Show:'), levelSeg(level, here)),
      blocks.length ? blocks.map(([lv, list]) => levelBlock(lv, list)) : el('p', { class: 'ovs-empty' }, `Nothing in ${s.name} at ${LEVEL_NAME[level]} level. `, el('a', { href: here('all') }, 'Show everything')),
      maps.length ? el('section', { class: 'ovs-block ovs-reading' },
        el('header', { class: 'ovs-block-head' }, el('h2', null, 'Textbooks and free resources')),
        maps.map(([exam, sj]) => el('div', { class: 'ovs-sub' }, el('h3', null, el('a', { href: `#map/${exam}/${sj.id}` }, `${EXAM[exam]} map: ${sj.name} ›`)), readingStrip(sj)))) : null,
      q ? el('nav', { class: 'pager no-print' },
        secs[i - 1] ? el('a', { class: 'pager-prev', href: withLevel(`#map/${q.id}/${secs[i - 1].slug}`, level) }, el('span', { class: 'small' }, '← Previous'), secs[i - 1].name) : el('a', { class: 'pager-prev', href: withLevel('#map', level) }, el('span', { class: 'small' }, '← Back to'), 'All four boxes'),
        secs[i + 1] ? el('a', { class: 'pager-next', href: withLevel(`#map/${q.id}/${secs[i + 1].slug}`, level) }, el('span', { class: 'small' }, 'Next →'), secs[i + 1].name) : el('a', { class: 'pager-next', href: withLevel('#map', level) }, el('span', { class: 'small' }, 'Back to →'), 'All four boxes')) : null));
    return s.name;
  }

  App.on('map', (args, params) => {
    if (args[0] === 'primary' || args[0] === 'final') {
      const exam = args[0];
      const sid = args[1];
      render(exam);
      return { view: 'map', tab: 'notes', current: `#map/${exam}`, title: `${EXAM[exam]} syllabus map`,
        after: sid ? () => { const n = document.getElementById(`map-${sid}`); if (n) n.scrollIntoView({ block: 'start' }); } : null };
    }
    const level = LEVELS.some(([k]) => k === params.get('level')) ? params.get('level') : 'all';
    // Opened with a level, the page sits in that stage's menu and colour.
    const tab = { novice: 'novice', primary: 'stage1', final: 'stage2' }[level] || 'notes';
    const current = level === 'all' ? '#map' : `#map?level=${level}`;
    if (args[0]) {
      const title = renderSection(args[0], args[1], level);
      const after = () => { const a = $('.ovs-siblings [aria-current]'); if (a) a.parentNode.scrollLeft = a.offsetLeft - a.parentNode.offsetLeft - 16; };
      return { view: 'map', tab, current, title, after };
    }
    renderOverview(level);
    return { view: 'map', tab, current, title: 'The syllabus in four parts' };
  });
})();
