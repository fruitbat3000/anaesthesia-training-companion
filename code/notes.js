/* Revision notes: library (Primary / Final), note reader, and syllabus coverage map. */
(function () {
  'use strict';
  const { $, $$, el, C, store, KEYS } = App;

  const read = () => store.get(KEYS.notes, {});
  const isRead = id => !!(read()[id] && read()[id].done);
  function setRead(id, done) {
    const r = read();
    r[id] = Object.assign(r[id] || {}, { done, t: Date.now() });
    store.set(KEYS.notes, r);
  }
  function touch(id) {
    const r = read();
    r[id] = Object.assign(r[id] || {}, { t: Date.now() });
    store.set(KEYS.notes, r);
  }

  const subjName = (exam, s) => (C.subjects[exam][s] || { name: s }).name;
  const byOrder = (a, b) => a.order - b.order || a.title.localeCompare(b.title);

  /* ---------- library ---------- */
  const lib = { exam: 'primary', subject: '', q: '', hideRead: false };

  function renderLibrary() {
    const exam = lib.exam;
    const all = C.notes.filter(n => n.exam === exam);
    const subjects = Object.keys(C.subjects[exam]).filter(s => all.some(n => n.subject === s));
    const words = lib.q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = all.filter(n => (!lib.subject || n.subject === lib.subject)
      && (!lib.hideRead || !isRead(n.id))
      && words.every(w => `${n.title} ${n.summary} ${n.keys} ${n.codes.join(' ')}`.toLowerCase().includes(w)));
    const doneAll = all.filter(n => isRead(n.id)).length;

    const head = el('header', { class: 'page-head' },
      el('h1', null, exam === 'primary' ? 'Primary FRCA revision notes' : 'Final FRCA revision notes'),
      el('p', { class: 'lede' }, exam === 'primary'
        ? 'Concise notes on the basic sciences and applied clinical topics of Stage 1, mapped to the Primary FRCA syllabus (v2.2). Each note ends with how the topic is likely to be tested in the AKT and in a CASE station.'
        : 'Concise notes on Stage 2 clinical anaesthesia, mapped to the Stage 2 examination syllabus. The new Final does not retest Primary science, so these focus on clinical reasoning, weighted like the Final AKT (half general anaesthesia) and the FCPE.'),
      el('div', { class: 'meters' }, App.meter(doneAll, all.length, 'Notes read')));

    const chips = el('div', { class: 'chips' },
      el('button', { type: 'button', class: 'chip', 'aria-pressed': String(!lib.subject), onclick: () => { lib.subject = ''; renderLibrary(); } }, `All (${all.length})`),
      subjects.map(s => el('button', { type: 'button', class: 'chip', 'aria-pressed': String(lib.subject === s), onclick: () => { lib.subject = s; renderLibrary(); } },
        `${subjName(exam, s)} (${all.filter(n => n.subject === s).length})`)));

    const search = el('input', { type: 'search', placeholder: 'Filter these notes…', value: lib.q, 'aria-label': 'Filter notes' });
    search.addEventListener('input', e => { lib.q = e.target.value; clearTimeout(search._t); search._t = setTimeout(() => { renderLibrary(); const s = $('#view-notes input[type=search]'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }, 200); });
    const hide = el('label', null, el('input', { type: 'checkbox', checked: lib.hideRead, onchange: e => { lib.hideRead = e.target.checked; renderLibrary(); } }), ' Hide notes I have read');

    const groups = (lib.subject ? [lib.subject] : subjects).map(s => {
      const items = list.filter(n => n.subject === s).sort(byOrder);
      if (!items.length) return null;
      return el('section', { class: 'note-group' },
        el('h2', null, subjName(exam, s), el('span', { class: 'count' }, `${items.filter(n => isRead(n.id)).length}/${items.length} read`)),
        el('div', { class: 'note-grid' }, items.map(noteCard)));
    }).filter(Boolean);

    $('#view-notes').replaceChildren(head,
      el('div', { class: 'filters card' }, el('label', { class: 'search' }, search), chips, el('div', { class: 'toggles' }, hide, el('a', { class: 'print-link', href: '#notes/coverage' }, 'Syllabus coverage map'))),
      groups.length ? el('div', null, groups) : el('p', { class: 'empty' }, 'No notes match. Try clearing the filters.'));
  }

  function noteCard(n) {
    return el('a', { class: 'note-card' + (isRead(n.id) ? ' is-read' : ''), href: `#notes/${n.id}` },
      el('span', { class: 'note-card-title' }, n.title),
      n.summary ? el('span', { class: 'note-card-sum' }, n.summary) : null,
      el('span', { class: 'note-card-meta' }, isRead(n.id) ? el('span', { class: 'read-tick' }, '✓ Read') : null, `${Math.max(1, Math.round(n.words / 200))} min`, App.statusBadge(n.status)));
  }

  /* ---------- note reader ---------- */
  async function renderNote(id) {
    const n = C.notes.find(x => x.id === id);
    const box = $('#view-note');
    if (!n) { box.replaceChildren(el('h1', null, 'Note not found'), el('p', null, el('a', { href: '#notes' }, 'Back to the notes library'))); return null; }
    box.replaceChildren(el('p', { class: 'loading' }, 'Loading…'));
    let htmlMap;
    try { htmlMap = await App.loadPart(`notes-${n.exam}`); } catch (e) { box.replaceChildren(el('p', null, 'This note could not be loaded.')); return n; }
    touch(n.id);

    const siblings = C.notes.filter(x => x.exam === n.exam && x.subject === n.subject).sort(byOrder);
    const i = siblings.findIndex(x => x.id === n.id);
    const prev = siblings[i - 1];
    const next = siblings[i + 1];
    const qBank = n.exam;
    const relatedQs = (C.questions[qBank].byNote || {})[n.id] || 0;

    const readBtn = el('button', { type: 'button', class: 'btn' + (isRead(n.id) ? ' done' : '') }, isRead(n.id) ? '✓ Marked as read' : 'Mark as read');
    readBtn.addEventListener('click', () => {
      const now = !isRead(n.id);
      setRead(n.id, now);
      readBtn.textContent = now ? '✓ Marked as read' : 'Mark as read';
      readBtn.classList.toggle('done', now);
    });

    const body = el('div', { class: 'prose note-body', html: htmlMap[n.id] || '' });
    if (App.novice) App.novice.markTerms(body);

    const noteToc = App.toc(body);
    const aside = el('aside', { class: 'note-aside' },
      noteToc,
      el('div', { class: 'card' },
        el('h3', null, 'Syllabus codes'),
        el('div', { class: 'code-chips' }, n.codes.map(c => el('a', { class: 'code-chip', href: `#notes/coverage/${n.exam}?code=${c}`, title: 'Show on the coverage map' }, c))),
        el('p', { class: 'small' }, n.exam === 'primary' ? 'Primary FRCA syllabus v2.2' : 'Stage 2 examination syllabus')),
      relatedQs ? el('div', { class: 'card' }, el('h3', null, 'Test yourself'), el('p', null, `${relatedQs} practice question${relatedQs === 1 ? '' : 's'} on this topic.`),
        el('a', { class: 'btn', href: `#questions/note/${n.id}` }, 'Start')) : null,
      n.related.length ? el('div', { class: 'card' }, el('h3', null, 'Related notes'),
        el('ul', { class: 'linklist' }, n.related.map(r => C.notes.find(x => x.id === r)).filter(Boolean).map(r => el('li', null, el('a', { href: `#notes/${r.id}` }, r.title))))) : null,
      n.ela.length ? el('div', { class: 'card' }, el('h3', null, 'e-Learning Anaesthesia'), App.elaList(n.ela)) : null,
      (n.bjaed || []).length ? el('div', { class: 'card' }, el('h3', null, 'BJA Education'), el('p', { class: 'small' }, el('a', { href: '#', onclick: e => { e.preventDefault(); document.getElementById('bjaed').scrollIntoView({ behavior: 'smooth' }); } }, `${n.bjaed.length} review article${n.bjaed.length === 1 ? '' : 's'} for this topic →`))) : null);

    box.replaceChildren(
      el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
        el('a', { href: `#notes/${n.exam}` }, n.exam === 'primary' ? 'Primary notes' : 'Final notes'), ' / ',
        el('a', { href: `#notes/${n.exam}?subject=${n.subject}` }, subjName(n.exam, n.subject))),
      el('header', { class: 'page-head note-head' },
        el('h1', null, n.title),
        n.summary ? el('p', { class: 'lede' }, n.summary) : null,
        el('div', { class: 'note-meta' }, App.statusBadge(n.status), el('span', { class: 'small' }, `${Math.max(1, Math.round(n.words / 200))} min read`), readBtn)),
      el('div', { class: 'note-layout' },
        el('article', null, body,
          (n.bjaed || []).length ? el('section', { class: 'note-refs note-bjaed', id: 'bjaed' },
            el('h2', null, 'Read next in BJA Education'),
            el('p', { class: 'small' }, 'Review articles chosen for this topic. Free to RCoA members through My RCoA, and open to everyone 12 months after publication.'),
            el('ul', { class: 'bjaed-list' }, n.bjaed.map(b => el('li', null,
              el('a', { class: 'ext', href: `https://doi.org/${b.doi}`, target: '_blank', rel: 'noopener' }, b.t),
              el('span', { class: 'ref-src' }, ` ${b.a ? b.a + ' ' : ''}BJA Educ ${b.y}${b.v ? `;${b.v}` : ''}${b.p ? `:${b.p}` : ''}`))))) : null,
          n.refs.length ? el('section', { class: 'note-refs' }, el('h2', null, 'References and further reading'), App.refList(n.refs)) : null,
          el('div', { class: 'callout-box warn small-callout' }, el('p', null, 'Educational summary only. Doses and thresholds must be checked against the BNF, current guidelines and local policy before clinical use. ', el('a', { href: '#disclaimer' }, 'Disclaimer.'))),
          el('div', { class: 'pager' },
            prev ? el('a', { href: `#notes/${prev.id}`, class: 'pager-prev' }, el('span', { class: 'small' }, '← Previous'), el('span', null, prev.title)) : el('span'),
            next ? el('a', { href: `#notes/${next.id}`, class: 'pager-next' }, el('span', { class: 'small' }, 'Next →'), el('span', null, next.title)) : el('span')),
          el('p', { class: 'page-foot' }, App.reportLink('Revision note', n.id, n.title, `Syllabus codes: ${n.codes.join(', ')}`))),
        aside));
    return n;
  }

  /* ---------- coverage map ---------- */
  function renderCoverage(exam, focus) {
    const raw = C.coverage[exam];
    const codes = C.codes[exam];
    // notes covering a code, including Stage 2 key-capability tags that cover their items (and vice versa)
    const notesFor = c => {
      const ids = new Set((raw[c] || { n: [] }).n);
      if (exam === 'final') {
        const kc = c.split('_').slice(0, 3).join('_');
        if (kc !== c && raw[kc]) raw[kc].n.forEach(x => ids.add(x));
        Object.keys(raw).forEach(k => { if (k.startsWith(c + '_')) raw[k].n.forEach(x => ids.add(x)); });
      }
      return [...ids];
    };
    const cov = Object.fromEntries(codes.map(c => [c, { ids: notesFor(c), q: (raw[c] || { q: 0 }).q }]));
    const covered = c => cov[c].ids.length;
    const groups = {};
    codes.forEach(c => {
      const parts = c.split('_');
      let g = parts[1];
      if (exam === 'primary' && g === 'GA' && /^[FG]\d$/.test(parts[2])) g = { F1: 'GA — equipment', F2: 'GA — physics', F3: 'GA — clinical measurement', G1: 'GA — anatomy', G2: 'GA — physiology', G3: 'GA — pharmacology' }[parts[2]];
      else if (g === 'GA') g = 'GA — clinical';
      (groups[g] = groups[g] || []).push(c);
    });
    const nCovered = codes.filter(covered).length;
    const notesById = Object.fromEntries(C.notes.map(n => [n.id, n]));

    const tabs = el('div', { class: 'chips' }, ['primary', 'final'].map(e => el('a', { class: 'chip', href: `#notes/coverage/${e}`, 'aria-pressed': String(e === exam) }, e === 'primary' ? 'Primary syllabus' : 'Stage 2 syllabus')));
    const detail = el('div', { class: 'card coverage-detail', id: 'cov-detail' }, el('p', { class: 'small' }, 'Select a code to see the notes that cover it.'));

    function showCode(c) {
      $$('.cov-code.sel').forEach(x => x.classList.remove('sel'));
      const b = $(`.cov-code[data-code="${c}"]`);
      if (b) { b.classList.add('sel'); b.scrollIntoView({ block: 'nearest' }); }
      const v = cov[c];
      const ids = v.ids;
      detail.replaceChildren(el('h3', null, c),
        ids.length ? el('ul', { class: 'linklist' }, ids.map(id => notesById[id]).filter(Boolean).map(n => el('li', null, el('a', { href: `#notes/${n.id}` }, n.title))))
          : el('p', null, 'Not yet covered by a note.'),
        v.q ? el('p', { class: 'small' }, `${v.q} practice question${v.q === 1 ? '' : 's'} tagged to this code.`) : null,
        el('p', { class: 'small' }, 'The wording of each item is in the ', el('a', { href: exam === 'primary' ? C.refs['rcoa-primary-syllabus'].u : C.refs['rcoa-stage2-syllabus'].u, target: '_blank', rel: 'noopener', class: 'ext' }, 'RCoA syllabus'), '.'));
    }

    $('#view-coverage').replaceChildren(
      el('header', { class: 'page-head' },
        el('h1', null, 'Syllabus coverage'),
        el('p', { class: 'lede' }, 'Every code in the RCoA syllabus, coloured by whether a revision note covers it. Use it to find gaps in your revision, and to see where the notes still need writing.'),
        tabs,
        el('div', { class: 'meters' }, App.meter(nCovered, codes.length, 'Codes covered by a note'))),
      el('div', { class: 'coverage-layout' },
        el('div', null, Object.entries(groups).map(([g, list]) => el('section', { class: 'cov-group' },
          el('h2', null, g, el('span', { class: 'count' }, `${list.filter(covered).length}/${list.length}`)),
          el('div', { class: 'cov-codes' }, list.map(c => el('button', { type: 'button', class: 'cov-code' + (covered(c) ? ' on' : ''), 'data-code': c, onclick: () => showCode(c) }, c.replace(/^[12]_/, ''))))))),
        detail));
    if (focus && cov[focus]) setTimeout(() => showCode(focus), 0);
  }

  /* ---------- routes ---------- */
  App.on('notes', (args, params) => {
    const a = args[0];
    if (a === 'coverage') {
      const exam = args[1] === 'final' ? 'final' : 'primary';
      renderCoverage(exam, params.get('code'));
      return { view: 'coverage', tab: 'notes', current: '#notes/coverage', title: 'Syllabus coverage' };
    }
    if (a === 'primary' || a === 'final' || !a) {
      lib.exam = a || lib.exam;
      if (params.get('subject')) lib.subject = params.get('subject');
      else if (a) lib.subject = lib.subject && C.subjects[lib.exam][lib.subject] ? lib.subject : '';
      if (!C.subjects[lib.exam][lib.subject]) lib.subject = '';
      renderLibrary();
      return { view: 'notes', tab: 'notes', current: `#notes/${lib.exam}`, title: 'Revision notes' };
    }
    const n = C.notes.find(x => x.id === a);
    renderNote(a);
    return { view: 'note', tab: 'notes', current: n ? `#notes/${n.exam}` : '#notes/primary', title: n ? n.title : 'Note' };
  });
})();
