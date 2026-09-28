/* Readable syllabus map for the Primary and Final FRCA: topics by paper and subject with a red/amber/green
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

  App.on('map', args => {
    const exam = args[0] === 'final' ? 'final' : 'primary';
    render(exam);
    return { view: 'map', tab: 'notes', current: `#map/${exam}`, title: `${EXAM[exam]} syllabus map` };
  });
})();
