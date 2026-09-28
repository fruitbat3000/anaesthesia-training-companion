/* Stages 1–3: key capability checklists, clinical unit guides, Special Interest Areas and a printable checklist.
 * Capabilities are paraphrased from the RCoA learning syllabus (content/capabilities/*.md, see SOURCES.md S26–S27).
 * Ticks are stored per browser under KEYS.caps as { "stage-1:ga:A": true }. */
(function () {
  'use strict';
  const { $, $$, el, C, store, KEYS } = App;

  const STAGE_NAME = { 1: 'Stage 1', 2: 'Stage 2', 3: 'Stage 3' };
  const YEARS = { 1: 'CT1–CT3', 2: 'ST4–ST5', 3: 'ST6–ST7' };
  const EXAM = { 1: ['primary', 'Primary FRCA', '#exams/primary'], 2: ['final', 'Final FRCA', '#exams/final'] };
  const LEVELS = {
    1: 'Level 1: supervisor present in theatre throughout',
    '2a': 'Level 2a: supervisor in the theatre suite, checking in at regular intervals',
    '2b': 'Level 2b: supervisor in the hospital, available for prompt help',
    3: 'Level 3: supervisor on call from home',
    4: 'Level 4: independent (informing the consultant as local protocols require)',
  };
  const levelTitle = lv => lv.startsWith('FICM')
    ? `${lv}: Faculty of Intensive Care Medicine capability level (1 = direct supervision … 4 = independent)`
    : lv.split('/').map(x => LEVELS[x] || `Level ${x}`).join('; ');

  const set = n => C.capabilities[`stage-${n}`];
  const sias = () => C.capabilities.sias;
  const ticks = () => store.get(KEYS.caps, {});
  const capId = (key, dom, k) => `${key}:${dom}:${k}`;
  const allCaps = d => d.groups.flatMap(g => g.caps);
  function count(key, doms) {
    const t = ticks();
    let done = 0, total = 0;
    for (const d of doms) for (const c of allCaps(d)) { total++; if (t[capId(key, d.id, c.k)]) done++; }
    return [done, total];
  }
  const bar = (a, b) => el('span', { class: 'bar', 'aria-hidden': 'true' }, el('span', { style: `width:${App.pct(a, b)}%` }));
  const noteTitle = id => (C.notes.find(n => n.id === id) || { title: id }).title;
  const stationTitle = id => (C.stations.find(s => s.id === id) || { title: id }).title;
  const qCount = ids => ids.reduce((a, id) => {
    const n = C.notes.find(x => x.id === id);
    return a + (n ? ((C.questions[n.exam].byNote || {})[id] || 0) : 0);
  }, 0);

  /* ---------- building blocks ---------- */
  // RCoA GPAS chapters: what a department should provide, including (section 4) training and education.
  function gpasBox(list) {
    if (!list || !list.length) return null;
    return el('div', { class: 'callout-box key gpas-box' },
      el('p', { class: 'callout-title' }, 'Service standards (RCoA GPAS)'),
      el('ul', { class: 'linklist' }, list.map(c => el('li', null,
        el('a', { class: 'ext', href: c.u, target: '_blank', rel: 'noopener' }, `Chapter ${c.n}: ${c.t}`), ` (${c.y})`))),
      el('p', { class: 'small' }, 'GPAS sets out what a department should provide for this work. Its "Training and education" section describes what you should expect as a trainee, and service standards come up in FCPE professional stations.'));
  }

  function capItem(key, d, c) {
    const id = capId(key, d.id, c.k);
    const done = !!ticks()[id];
    const cb = `cb-${id.replace(/[^\w]/g, '-')}`;
    return el('li', { class: 'cap' + (done ? ' is-done' : '') },
      el('input', { type: 'checkbox', id: cb, 'data-cap': id, checked: done }),
      el('label', { for: cb },
        el('span', { class: 'cap-k' }, c.k),
        el('span', { class: 'cap-text', html: c.text })),
      c.level ? el('span', { class: 'cap-level', title: levelTitle(c.level) }, c.level) : null);
  }

  function capList(key, d, groups) {
    return (groups || d.groups).map(g => el('div', { class: 'cap-group' },
      g.name ? el('h4', null, g.name) : null,
      el('ul', { class: 'cap-list' }, g.caps.map(c => capItem(key, d, c)))));
  }

  function studyRow(d) {
    const items = [
      ...d.notes.map(id => el('a', { class: 'deeper-link', href: `#notes/${id}` }, noteTitle(id))),
      ...d.stations.map(id => el('a', { class: 'deeper-link deeper-st', href: `#stations/${id}` }, stationTitle(id))),
      ...d.ela.map(([name, url]) => el('a', { class: 'deeper-link deeper-ela ext', href: url, target: '_blank', rel: 'noopener' }, name)),
    ];
    const q = qCount(d.notes);
    if (!items.length) return null;
    return el('div', { class: 'topic-deeper cap-study' },
      el('span', { class: 'topic-deeper-label' }, 'Study'),
      items,
      q ? el('span', { class: 'small' }, `${q} practice question${q === 1 ? '' : 's'} via these notes`) : null);
  }

  function domainCard(key, d, opts = {}) {
    const [done, total] = count(key, [d]);
    return el('section', { class: `cap-domain kind-${d.kind}`, id: `dom-${d.id}`, 'data-dom': d.id },
      el('header', { class: 'cap-head' },
        el('div', null,
          el(opts.h || 'h2', { id: `cap-${d.id}` }, d.name),
          el('p', { class: 'cap-outcome', html: d.outcome })),
        el('div', { class: 'cap-count' },
          el('span', { class: 'cap-count-n', 'data-count': d.id }, `${done}/${total}`),
          bar(done, total))),
      d.length || d.group ? el('p', { class: 'cap-meta' }, d.group ? el('span', { class: 'badge' }, d.group) : null, d.length ? el('span', { class: 'badge' }, d.length) : null) : null,
      capList(key, d),
      d.evidence.length ? el('details', { class: 'cap-evidence' },
        el('summary', null, 'Examples of evidence'),
        el('ul', null, d.evidence.map(e => el('li', { html: e })))) : null,
      studyRow(d),
      el('p', { class: 'cap-foot' }, el('a', { class: 'ext', href: d.rcoa, target: '_blank', rel: 'noopener' }, 'RCoA learning syllabus for this ' + (d.kind === 'sia' ? 'SIA' : 'domain'))));
  }

  function head(n, eyebrow, title, lede, extra) {
    return el('header', { class: 'page-head' },
      el('p', { class: 'eyebrow' }, eyebrow),
      el('h1', null, title),
      lede ? el('p', { class: 'lede', html: lede }) : null,
      extra || null);
  }

  /* ---------- capabilities checklist ---------- */
  const filt = { q: '', kind: 'all', hide: false };
  function renderCapabilities(n, focus) {
    const s = set(n);
    const key = s.key;
    const [done, total] = count(key, s.domains);
    const view = $('#view-stage');
    const list = el('div', { class: 'cap-domains' });
    const draw = () => {
      const words = filt.q.toLowerCase().split(/\s+/).filter(Boolean);
      const t = ticks();
      list.replaceChildren(...s.domains.filter(d => filt.kind === 'all' || d.kind === filt.kind).map(d => {
        const groups = d.groups.map(g => ({ ...g, caps: g.caps.filter(c =>
          (!filt.hide || !t[capId(key, d.id, c.k)]) &&
          (!words.length || words.every(w => (d.name + ' ' + c.text.replace(/<[^>]+>/g, '')).toLowerCase().includes(w)))) })).filter(g => g.caps.length);
        if (!groups.length) return null;
        const card = domainCard(key, d);
        card.querySelectorAll('.cap-group').forEach(g => g.remove());
        card.querySelector('.cap-head').after(...capList(key, d, groups));
        return card;
      }));
      if (!list.children.length) list.append(el('p', { class: 'empty' }, 'No capabilities match. Try clearing the filters.'));
    };
    const summary = el('div', { class: 'card cap-summary' },
      el('div', { class: 'cap-summary-top' },
        el('div', null, el('p', { class: 'cap-summary-n' }, el('span', { 'data-count': 'all' }, `${done}`), ` of ${total}`), el('p', { class: 'small' }, 'key capabilities ticked')),
        el('div', { class: 'cap-summary-bar' }, bar(done, total))),
      el('div', { class: 'domain-meters' }, s.domains.map(d => {
        const [a, b] = count(key, [d]);
        return el('a', { class: 'domain-meter', href: `#stage/${n}/capabilities/${d.id}` },
          el('span', { class: 'domain-meter-top' }, el('span', null, d.name), el('span', { class: 'meter-num', 'data-count': d.id }, `${a}/${b}`)),
          bar(a, b));
      })));
    const search = el('input', { type: 'search', placeholder: 'Search capabilities…', value: filt.q, oninput: e => { filt.q = e.target.value; draw(); } });
    const seg = el('div', { class: 'seg', role: 'radiogroup' }, [['all', 'All 14 domains'], ['generic', 'Professional'], ['clinical', 'Clinical']].map(([k, label]) =>
      el('button', { type: 'button', role: 'radio', 'aria-checked': String(filt.kind === k), onclick: e => { filt.kind = k; $$('button', e.target.parentNode).forEach(b => b.setAttribute('aria-checked', String(b === e.target))); draw(); } }, label)));
    const filters = el('div', { class: 'filters card no-print' },
      el('label', { class: 'search' }, el('span', { class: 'sr-only' }, 'Search capabilities'), search),
      el('div', { class: 'toggles' }, seg,
        el('label', null, el('input', { type: 'checkbox', checked: filt.hide, onchange: e => { filt.hide = e.target.checked; draw(); } }), ' Hide ticked'),
        el('a', { class: 'print-link', href: `#stage/${n}/checklist` }, 'Printable checklist')));
    draw();
    const main = el('div', { class: 'doc-main' },
      head(n, `${STAGE_NAME[n]} · key capabilities`, `${STAGE_NAME[n]} key capabilities`,
        `Everything the RCoA expects you to show by the end of ${STAGE_NAME[n]} (${YEARS[n]}), domain by domain. Tick what you have evidence for, then link that evidence to the HALO on the LLP. Each domain links to notes, stations and e-learning on this site.`,
        el('p', { class: 'meta-line' }, el('span', { class: 'dot-ok' }), `Paraphrased from the RCoA learning syllabus (v1.5) · checked ${s.checked} · `, el('a', { class: 'ext', href: s.source, target: '_blank', rel: 'noopener' }, 'RCoA source'))),
      el('div', { class: 'callout-box key small-callout', html: s.intro + '<p>Ticks are a personal record only, saved in this browser. Sign-off happens through your HALOs on the LLP.</p>' }),
      summary, filters, list);
    const layout = el('div', { class: 'doc-layout has-rail' }, main, el('aside', { class: 'doc-rail' }));
    view.replaceChildren(layout);
    const rail = App.toc(list, 'Domains');
    if (rail) layout.lastChild.append(rail);
    return focus ? () => { const t = document.getElementById(`dom-${focus}`); if (t) { const go = () => t.scrollIntoView({ block: 'start' }); go(); setTimeout(go, 120); } } : null;
  }

  /* ---------- unit guides ---------- */
  const unitsFor = n => C.units.filter(u => String(u.stage) === String(n));
  function renderUnits(n) {
    const list = unitsFor(n);
    $('#view-stage').replaceChildren(
      head(n, `${STAGE_NAME[n]} · clinical units`, `${STAGE_NAME[n]} unit guides`,
        n === 2
          ? 'A guide to each block of Stage 2: what it is like, what the RCoA expects, how to gather evidence and what to read. The four discrete areas (cardiothoracic, neuro, obstetric and paediatric anaesthesia) usually need a Triple C form.'
          : 'A guide to each block of Stage 1: what it is like, what the RCoA expects, how to gather evidence and what to read.'),
      el('div', { class: 'unit-grid' }, list.map(u => {
        return el('a', { class: 'unit-card', href: `#stage/${n}/unit/${u.id}` },
          el('span', { class: 'unit-card-title' }, u.title),
          el('span', { class: 'unit-card-lede', html: u.lede }),
          el('span', { class: 'unit-card-go' }, 'Read the guide →'));
      })));
  }

  // {{caps stage-1 ga Q,R}} inside a unit guide becomes the live, tickable capabilities.
  function capWidgets(root) {
    $$('p', root).forEach(p => {
      const m = p.textContent.trim().match(/^\{\{caps ([\w-]+) ([\w-]+)(?: ([\w,]+))?\}\}$/);
      if (!m) return;
      const s = C.capabilities[m[1]];
      const d = s && s.domains.find(x => x.id === m[2]);
      if (!d) { p.textContent = ''; return; }
      const want = m[3] ? m[3].split(',') : null;
      const groups = d.groups.map(g => ({ ...g, caps: g.caps.filter(c => !want || want.includes(c.k)) })).filter(g => g.caps.length);
      p.replaceWith(el('div', { class: 'cap-inline' },
        el('p', { class: 'cap-inline-title' }, el('span', { class: 'badge' }, d.name), ' ', el('a', { href: `#stage/${s.stage}/capabilities/${d.id}` }, 'all capabilities in this domain →')),
        capList(s.key, d, groups.map(g => ({ ...g, name: '' })))));
    });
  }

  function renderUnit(n, id) {
    const list = unitsFor(n);
    const i = list.findIndex(u => u.id === id);
    const u = list[i];
    if (!u) { $('#view-stage').replaceChildren(el('h1', null, 'Guide not found'), el('p', null, el('a', { href: `#stage/${n}/units` }, 'Back to the unit guides'))); return 'Not found'; }
    const body = el('div', { class: 'prose', html: u.html });
    App.renderWidgets(body);
    capWidgets(body);
    const prev = list[i - 1], next = list[i + 1];
    const main = el('div', { class: 'doc-main' },
      el('p', { class: 'crumbs' }, el('a', { href: `#stage/${n}` }, STAGE_NAME[n]), ' / ', el('a', { href: `#stage/${n}/units` }, 'Unit guides')),
      head(n, `${STAGE_NAME[n]} · unit guide`, u.title, u.lede, u.updated ? el('p', { class: 'meta-line' }, el('span', { class: 'dot-ok' }), `Draft guidance · updated ${u.updated}`) : null),
      body,
      gpasBox(u.gpas),
      el('nav', { class: 'pager', 'aria-label': 'Unit guides' },
        prev ? el('a', { class: 'pager-prev', href: `#stage/${n}/unit/${prev.id}` }, el('span', { class: 'small' }, '← Previous'), prev.short) : el('span'),
        next ? el('a', { class: 'pager-next', href: `#stage/${n}/unit/${next.id}` }, el('span', { class: 'small' }, 'Next →'), next.short) : el('a', { class: 'pager-next', href: `#stage/${n}/capabilities` }, el('span', { class: 'small' }, 'Next →'), 'All key capabilities')),
      el('p', { class: 'page-foot' }, App.reportLink('Unit guide', u.id, u.title)));
    const layout = el('div', { class: 'doc-layout has-rail' }, main, el('aside', { class: 'doc-rail' }));
    $('#view-stage').replaceChildren(layout);
    const t = App.toc(body);
    if (t) layout.lastChild.append(t);
    return u.title;
  }

  /* ---------- Special Interest Areas ---------- */
  const SIA_GROUPS = [
    ['Group 1', 'Group 1: six months to a year each (Pain medicine is a year)'],
    ['Group 2', 'Group 2: three to six months each'],
    ['Neither group', 'Additional intensive care: six months'],
    ['Non-clinical', 'Non-clinical: up to six months in total, in one of these'],
  ];
  function renderSias() {
    const S = sias();
    $('#view-stage').replaceChildren(
      head(3, 'Stage 3 · Special Interest Areas', 'Special Interest Areas',
        'In Stage 3 you spend 12 months (whole-time equivalent) in one or more SIAs. The year can be a single Group 1 SIA for a year, two six-month Group 1 SIAs, one Group 1 plus one or two Group 2 SIAs, up to three Group 2 SIAs, or Additional intensive care plus one Group 1 or one or two Group 2 SIAs. The SIA year is time-based as well as capability-based, and should add up to a year.',
        el('p', { class: 'meta-line' }, el('span', { class: 'dot-ok' }), `Paraphrased from the RCoA SIA learning syllabus · checked ${S.checked} · `, el('a', { class: 'ext', href: S.source, target: '_blank', rel: 'noopener' }, 'RCoA source'))),
      el('div', { class: 'grid-2' },
        el('div', { class: 'card' }, el('h3', null, 'Special cases'),
          el('ul', null,
            el('li', null, 'Dual Anaesthetics and ICM trainees use the SIA year to complete Stage 3 ICM training.'),
            el('li', null, 'PHEM trainees complete Transfer medicine, Trauma and stabilisation and the Stage 3 Resuscitation and transfer HALO in their PHEM year.'),
            el('li', null, 'If you plan regular paediatric lists as a consultant outside a tertiary centre, the RCoA suggests the Paediatric anaesthesia SIA (DGH pathway).'))),
        el('div', { class: 'card' }, el('h3', null, 'Planning your SIA year'),
          el('ul', null,
            el('li', null, 'Talk to your TPD early: SIA posts are finite and planned across the school.'),
            el('li', null, 'Most of the SIA year should be spent on SIA activity; the other Stage 3 year completes the general Stage 3 capabilities.'),
            el('li', null, el('a', { href: '#stage/3/capabilities' }, 'Stage 3 key capabilities'), ' still apply alongside your SIA.')))),
      ...SIA_GROUPS.map(([g, label]) => {
        const items = S.domains.filter(d => d.group === g);
        if (!items.length) return null;
        return el('section', { class: 'sia-group' },
          el('h2', { class: 'section-h' }, label),
          el('div', { class: 'unit-grid' }, items.map(d => {
            const [a, b] = count(S.key, [d]);
            return el('a', { class: 'unit-card sia-card', href: `#stage/3/sia/${d.id}` },
              el('span', { class: 'unit-card-title' }, d.name),
              el('span', { class: 'unit-card-lede', html: d.outcome }),
              el('span', { class: 'unit-card-meta' }, el('span', { class: 'badge' }, d.length), el('span', { class: 'meter-num' }, `${a}/${b}`), bar(a, b)));
          })));
      }));
  }
  function renderSia(id) {
    const S = sias();
    const d = S.domains.find(x => x.id === id);
    if (!d) { renderSias(); return 'Special Interest Areas'; }
    const idx = S.domains.indexOf(d);
    const prev = S.domains[idx - 1], next = S.domains[idx + 1];
    $('#view-stage').replaceChildren(
      el('p', { class: 'crumbs' }, el('a', { href: '#stage/3' }, 'Stage 3'), ' / ', el('a', { href: '#stage/3/sias' }, 'Special Interest Areas')),
      head(3, `Special Interest Area · ${d.group}`, d.name, null),
      domainCard(S.key, d, { h: 'h2' }),
      gpasBox(d.gpas),
      el('nav', { class: 'pager', 'aria-label': 'Special Interest Areas' },
        prev ? el('a', { class: 'pager-prev', href: `#stage/3/sia/${prev.id}` }, el('span', { class: 'small' }, '← Previous'), prev.name) : el('span'),
        next ? el('a', { class: 'pager-next', href: `#stage/3/sia/${next.id}` }, el('span', { class: 'small' }, 'Next →'), next.name) : el('span')));
    return d.name;
  }

  /* ---------- printable checklist ---------- */
  function renderChecklist(n) {
    const s = set(n);
    const t = ticks();
    const box = on => (on ? '☑' : '☐');
    const [done, total] = count(s.key, s.domains);
    $('#view-stage').replaceChildren(
      el('div', { class: 'no-print checklist-bar' },
        el('a', { href: `#stage/${n}/capabilities` }, '← Back to the capabilities'),
        el('button', { type: 'button', class: 'btn', onclick: () => window.print() }, 'Print or save as PDF')),
      el('h1', null, `${STAGE_NAME[n]} key capabilities checklist`),
      el('p', { class: 'checklist-meta' }, `Printed ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Ticked: ${done} of ${total}. Paraphrased from the RCoA learning syllabus (v1.5); the LLP and HALOs are the record of sign-off.`),
      ...s.domains.map(d => el('section', { class: 'cl-domain' },
        el('h2', null, d.name),
        el('table', { class: 'cl' },
          el('thead', null, el('tr', null, el('th', { class: 'cl-have' }, 'Done'), el('th', null, 'Key capability'), el('th', { class: 'cl-iac' }, 'Level'))),
          d.groups.map(g => el('tbody', null,
            g.name ? el('tr', { class: 'cl-group' }, el('td', { colspan: '3' }, g.name)) : null,
            g.caps.map(c => el('tr', null,
              el('td', { class: 'cl-have' }, box(t[capId(s.key, d.id, c.k)])),
              el('td', null, el('strong', null, c.k + ' '), el('span', { html: c.text })),
              el('td', { class: 'cl-iac' }, c.level)))))))));
  }

  /* ---------- the stage hub on each overview page ---------- */
  function hub(n) {
    const s = set(n);
    const [done, total] = count(s.key, s.domains);
    const units = unitsFor(n);
    const tiles = [
      [`#stage/${n}/capabilities`, 'Key capabilities', `All ${total} RCoA key capabilities across the 14 domains, as a tickable checklist with links to study material.`, `${done}/${total} ticked`],
      n === 3
        ? ['#stage/3/sias', 'Special Interest Areas', 'All 26 SIAs: how the SIA year works, each SIA\'s outcomes and capabilities, and what to read.', `${sias().domains.length} SIAs`]
        : [`#stage/${n}/units`, 'Unit guides', `What each ${STAGE_NAME[n]} block is like, what to aim for, how to gather evidence and what to read.`, `${units.length} guides`],
      n === 3
        ? ['#stage/3/preparing-for-consultant-practice', 'Consultant preparation', 'Leadership, teaching, your CV and interviews, and looking after yourself.', 'Guide']
        : [EXAM[n][2], EXAM[n][1], `The exam in its new format, with revision notes, questions and ${n === 1 ? 'CASE' : 'FCPE'} stations mapped to this stage.`, n === 1 ? 'AKT + CASE' : 'AKT + FCPE'],
      [`#stage/${n}/checklist`, 'Printable checklist', 'Every capability on paper, with your ticks, to take to an ES meeting.', 'Print'],
    ];
    return el('section', { class: 'stage-hub no-print' },
      el('div', { class: 'tile-grid' }, tiles.map(([href, title, text, meta]) =>
        el('a', { class: 'tile', href }, el('span', { class: 'tile-title' }, title), el('span', { class: 'tile-text' }, text), el('span', { class: 'tile-meta' }, meta)))));
  }

  /* ---------- routes ---------- */
  App.on('stage', args => {
    const n = ['1', '2', '3'].includes(args[0]) ? +args[0] : 1;
    const sub = args[1];
    const T = { view: 'stage', tab: `stage${n}` };
    if (sub === 'capabilities') {
      const after = renderCapabilities(n, args[2]);
      return { ...T, current: `#stage/${n}/capabilities`, title: `${STAGE_NAME[n]} key capabilities`, after };
    }
    if (sub === 'units' && n !== 3) { renderUnits(n); return { ...T, current: `#stage/${n}/units`, title: `${STAGE_NAME[n]} unit guides` }; }
    if (sub === 'unit' && n !== 3) { const title = renderUnit(n, args[2]); return { ...T, current: `#stage/${n}/unit/${args[2]}`, title }; }
    if (sub === 'sias' && n === 3) { renderSias(); return { ...T, current: '#stage/3/sias', title: 'Special Interest Areas' }; }
    if (sub === 'sia' && n === 3) { const title = renderSia(args[2]); return { ...T, current: `#stage/3/sia/${args[2]}`, title }; }
    if (sub === 'checklist') { renderChecklist(n); return { ...T, current: `#stage/${n}/checklist`, title: `${STAGE_NAME[n]} checklist` }; }
    const res = App.stageOverview(args);
    const anchor = $('#view-page .prose .glance') || $('#view-page .page-head');
    if (anchor && !$('#view-page .stage-hub')) anchor.after(hub(n));
    return res;
  });

  /* ---------- ticking ---------- */
  document.addEventListener('change', e => {
    const cb = e.target.closest && e.target.closest('input[data-cap]');
    if (!cb) return;
    const t = ticks();
    if (cb.checked) t[cb.dataset.cap] = true; else delete t[cb.dataset.cap];
    store.set(KEYS.caps, t);
    // keep duplicates (e.g. the same capability in a unit guide and the list) and counts in step
    $$(`input[data-cap="${cb.dataset.cap}"]`).forEach(x => { x.checked = cb.checked; x.closest('.cap').classList.toggle('is-done', cb.checked); });
    const [key, dom] = cb.dataset.cap.split(':');
    const s = C.capabilities[key];
    const d = s.domains.find(x => x.id === dom);
    const [a, b] = count(key, [d]);
    $$(`[data-count="${dom}"]`).forEach(n => { n.textContent = `${a}/${b}`; const br = n.parentNode.parentNode.querySelector('.bar > span') || n.parentNode.querySelector('.bar > span'); if (br) br.style.width = `${App.pct(a, b)}%`; });
    const all = $('[data-count="all"]');
    if (all) all.textContent = count(key, s.domains)[0];
    App.refreshNav();
  });

  /* ---------- sidebar progress ---------- */
  function capsRow(n) {
    const s = set(n);
    const [a, b] = count(s.key, s.domains);
    return el('a', { class: 'nav-progress-row', href: `#stage/${n}/capabilities` },
      el('div', { class: 'nav-progress-top' }, el('span', null, 'Capabilities ticked'), el('span', { class: 'nav-progress-num' }, `${a}/${b}`)),
      bar(a, b));
  }
  [1, 2].forEach(n => {
    const examBlock = App.navExtras[`stage${n}`];
    App.navExtras[`stage${n}`] = () => {
      const box = examBlock();
      box.querySelector('.nav-progress-title').textContent = 'Your progress';
      box.querySelector('.nav-progress-title').after(capsRow(n));
      return box;
    };
    App.navCounts[`#stage/${n}/capabilities`] = () => count(set(n).key, set(n).domains).join('/');
  });
  App.navExtras.stage3 = () => {
    const S = sias();
    const [a, b] = count(S.key, S.domains.filter(d => Object.keys(ticks()).some(k => k.startsWith(`sias:${d.id}:`))));
    return el('div', { class: 'nav-progress' },
      el('p', { class: 'nav-progress-title' }, 'Your progress'),
      capsRow(3),
      b ? el('a', { class: 'nav-progress-row', href: '#stage/3/sias' },
        el('div', { class: 'nav-progress-top' }, el('span', null, 'Your SIA(s)'), el('span', { class: 'nav-progress-num' }, `${a}/${b}`)),
        bar(a, b)) : null);
  };
  App.navCounts['#stage/3/capabilities'] = () => count(set(3).key, set(3).domains).join('/');
  App.navCounts['#stage/3/sias'] = () => String(sias().domains.length);
  [1, 2].forEach(n => { App.navCounts[`#stage/${n}/units`] = () => String(unitsFor(n).length); });
})();
