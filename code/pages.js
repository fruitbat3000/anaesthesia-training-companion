/* Home page, long-form guide pages (exams hub, stages, resources), and page widgets. */
(function () {
  'use strict';
  const { $, $$, el, C, S, store, KEYS } = App;

  /* ---------- widgets that pages can embed with {{name args}} ---------- */
  const WIDGETS = {
    timeline() {
      const stages = [
        ['Novice', 'CT1, first 3–6 months', 'IAC: EPAs 1 & 2', '#start'],
        ['Stage 1', 'CT1–CT3', 'EPAs 3 & 4 · Primary FRCA · Stage 1 certificate', '#stage/1'],
        ['Stage 2', 'ST4–ST5', 'Final FRCA · Stage 2 certificate', '#stage/2'],
        ['Stage 3', 'ST6–ST7', 'Special Interest Areas · CCT', '#stage/3'],
      ];
      return el('ol', { class: 'timeline' }, stages.map(([name, years, milestone, href]) =>
        el('li', null, el('a', { href }, el('span', { class: 'tl-name' }, name), el('span', { class: 'tl-years' }, years), el('span', { class: 'tl-milestone' }, milestone)))));
    },
    notes(args) {
      // {{notes primary physiology,pharmacology}} or {{notes final obstetrics}}
      const [exam, subjects] = args;
      const want = (subjects || '').split(',').filter(Boolean);
      const list = C.notes.filter(n => n.exam === exam && (!want.length || want.includes(n.subject))).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
      if (!list.length) return el('p', { class: 'small' }, 'Notes for this area are being written.');
      // One folding group per subject, so a long list reads as a short index.
      const groups = Object.keys(C.subjects[exam]).filter(s => list.some(n => n.subject === s));
      return el('div', { class: 'note-folds' }, groups.map(s => {
        const items = list.filter(n => n.subject === s);
        return el('details', { class: 'note-fold' },
          el('summary', null, el('span', { class: 'note-fold-name' }, C.subjects[exam][s].name), el('span', { class: 'note-fold-count' }, `${items.length} note${items.length === 1 ? '' : 's'}`)),
          el('div', { class: 'chip-list' }, items.map(n => el('a', { class: 'topic-chip', href: `#notes/${n.id}` }, n.title))));
      }));
    },
    stations(args) {
      const [exam] = args;
      const list = C.stations.filter(s => !exam || s.exam === exam);
      return el('div', { class: 'chip-list' }, list.map(s => el('a', { class: 'topic-chip', href: `#stations/${s.id}` }, s.title)));
    },
    gpas() {
      // {{gpas}}: every GPAS chapter with its link.
      const g = C.gpas;
      return el('div', { class: 'table-wrap' }, el('table', null,
        el('thead', null, el('tr', null, el('th', null, 'Chapter'), el('th', null, 'Covers'), el('th', null, 'Edition'))),
        el('tbody', null, Object.entries(g.chapters).map(([n, c]) => el('tr', null,
          el('td', null, n), el('td', null, el('a', { class: 'ext', href: c.u, target: '_blank', rel: 'noopener' }, c.t)), el('td', null, String(c.y)))))));
    },
    stats() {
      const q = C.questions.primary.total + C.questions.final.total;
      return el('div', { class: 'stat-row' },
        stat(C.notes.length, 'revision notes'), stat(q, 'practice questions'), stat(C.stations.length, 'station packs'), stat(Object.keys(C.refs).length, 'checked references'));
    },
    'exam-table'() {
      const rows = [
        ['Primary MCQ (90 SBA)', 'Primary AKT', '2 papers × 80 SBA, 2 h 20 min each, separate days. Online, remotely invigilated. September and March.'],
        ['Primary OSCE + SOE', 'Primary CASE', '13 stations × 9 min (2 min reading). October, February and June.'],
        ['Final written (CRQ + MCQ)', 'Final AKT', '1 paper × 100 SBA, 3 h. No CRQ. First sitting January 2028.'],
        ['Final SOE', 'Final FCPE', '12 stations × 9 min (2 min reading). November and April.'],
      ];
      return el('div', { class: 'table-wrap' }, el('table', null,
        el('thead', null, el('tr', null, el('th', null, 'Legacy (to June 2027)'), el('th', null, 'New (from July 2027)'), el('th', null, 'Format'))),
        el('tbody', null, rows.map(r => el('tr', null, el('td', null, r[0]), el('td', null, el('strong', null, r[1])), el('td', null, r[2]))))));
    },
  };
  const stat = (n, label) => el('div', { class: 'stat' }, el('span', { class: 'stat-n' }, String(n)), el('span', { class: 'stat-l' }, label));

  function renderWidgets(root) {
    App.$$('p', root).forEach(p => {
      const m = p.textContent.trim().match(/^\{\{([\w-]+)\s*(.*?)\}\}$/);
      if (!m || !WIDGETS[m[1]]) return;
      p.replaceWith(WIDGETS[m[1]](m[2].split(/\s+/).filter(Boolean)));
    });
  }

  /* ---------- generic page ---------- */
  function renderPage(id, into) {
    const p = C.pages[id];
    const box = into || $('#view-page');
    if (!p) {
      box.replaceChildren(el('h1', null, 'Page not found'), el('p', null, 'This page has not been written yet. ', el('a', { href: '#home' }, 'Go to the home page.')));
      return null;
    }
    const body = el('div', { class: 'prose', html: p.html });
    renderWidgets(body);
    App.fillStaticLinks(body);
    const eyebrow = id === 'exams' || id.startsWith('exams-') ? 'FRCA examinations' : id.startsWith('stage-') ? 'Training pathway' : ['guidelines', 'portfolio', 'wellbeing', 'resources-more'].includes(id) ? 'Resources' : id === 'stations-how' ? 'Station practice' : 'Guide';
    const rail = App.toc(body);
    box.replaceChildren(el('div', { class: 'doc-layout' + (rail ? ' has-rail' : '') },
      el('div', { class: 'doc-main' },
        el('header', { class: 'page-head' },
          el('p', { class: 'eyebrow' }, eyebrow),
          el('h1', null, p.title),
          p.lede ? el('p', { class: 'lede', html: p.lede }) : null,
          p.updated ? el('p', { class: 'meta-line' }, el('span', { class: 'dot-ok' }), `Checked against official sources · ${p.updated}`) : null),
        body,
        el('p', { class: 'page-foot' }, App.reportLink('Page', id, p.title))),
      rail ? el('aside', { class: 'doc-rail' }, rail) : null));
    return p;
  }

  App.on('page', args => { const p = renderPage(args[0]); return { view: 'page', tab: 'home', title: p && p.title }; });
  App.on('disclaimer', () => { const p = renderPage('disclaimer'); return { view: 'page', tab: 'home', title: p && p.title }; });
  App.stageOverview = args => {
    const n = ['1', '2', '3'].includes(args[0]) ? args[0] : '1';
    const p = renderPage(`stage-${n}`);
    const section = args[1] && document.getElementById(args[1]);
    return {
      view: 'page', tab: `stage${n}`, current: section ? `#stage/${n}/${args[1]}` : `#stage/${n}`, title: p && p.title,
      // Scroll again once layout settles and web fonts load, as both change the height above the section.
      after: section ? () => {
        const go = () => section.scrollIntoView({ block: 'start' });
        go(); setTimeout(go, 120); document.fonts.ready.then(go);
      } : null,
    };
  };
  App.on('stage', App.stageOverview); // stages.js extends this with the capability, unit and SIA views
  App.on('exams', args => {
    const id = args[0] ? `exams-${args[0]}` : 'exams';
    const p = renderPage(id);
    return { view: 'page', tab: 'exams', current: args[0] ? `#exams/${args[0]}` : '#exams', title: p && p.title };
  });
  App.on('resources', args => {
    if (args[0]) {
      const p = renderPage(args[0]);
      return { view: 'page', tab: 'resources', current: `#resources/${args[0]}`, title: p && p.title };
    }
    return { view: 'resources', tab: 'resources', current: '#resources', title: 'Resources' };
  });

  /* ---------- sidebar progress for Stages 1 and 2 (their exam's notes and questions) ---------- */
  function examProgress(exam) {
    const read = store.get(KEYS.notes, {});
    const qb = store.get(KEYS.qbank, {});
    const notes = C.notes.filter(n => n.exam === exam);
    const notesRead = notes.filter(n => read[n.id] && read[n.id].done).length;
    const mine = Object.entries(qb).filter(([id, r]) => r.n && (exam === 'final') === id.startsWith('f'));
    const correct = mine.filter(([, r]) => r.c).length;
    const row = (label, a, b, href) => el('a', { class: 'nav-progress-row', href },
      el('div', { class: 'nav-progress-top' }, el('span', null, label), el('span', { class: 'nav-progress-num' }, `${a}/${b}`)),
      el('span', { class: 'bar', 'aria-hidden': 'true' }, el('span', { style: `width:${b ? (100 * a / b) : 0}%` })));
    return el('div', { class: 'nav-progress', 'aria-label': 'Your progress' },
      el('p', { class: 'nav-progress-title' }, `Your ${exam === 'final' ? 'Final' : 'Primary'} progress`),
      row('Notes read', notesRead, notes.length, `#notes/${exam}`),
      row('Questions answered', mine.length, C.questions[exam].total, '#questions/stats'),
      mine.length ? el('p', { class: 'nav-progress-foot' }, `${App.pct(correct, mine.length)}% correct at last attempt`) : null);
  }
  App.navExtras.stage1 = () => examProgress('primary');
  App.navExtras.stage2 = () => examProgress('final');

  /* ---------- home ---------- */
  function renderHome() {
    const notesRead = store.get(KEYS.notes, {});
    const qb = store.get(KEYS.qbank, {});
    const answered = Object.keys(qb).length;
    const correct = Object.values(qb).filter(r => r.c).length;
    const lastNote = Object.entries(notesRead).filter(([, v]) => v && v.t).sort((a, b) => b[1].t - a[1].t)[0];
    const lastNoteMeta = lastNote && C.notes.find(n => n.id === lastNote[0]);
    const nov = App.novice;
    const novDone = nov ? nov.topics.filter(t => nov.progress.topics[t.id]).length : 0;

    const stageCard = (label, years, text, href, cls) => el('a', { class: `stage-card ${cls}`, href },
      el('span', { class: 'stage-years' }, years), el('span', { class: 'stage-label' }, label), el('span', { class: 'stage-text' }, text), el('span', { class: 'stage-go', 'aria-hidden': 'true' }, '→'));

    const tile = (icon, title, text, href, meta) => el('a', { class: 'tile', href },
      el('span', { class: 'tile-icon', html: icon }), el('span', { class: 'tile-title' }, title), el('span', { class: 'tile-text' }, text), meta ? el('span', { class: 'tile-meta' }, meta) : null);

    const I = {
      notes: '<svg viewBox="0 0 24 24"><path d="M5 4h10l4 4v12H5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 11h8M8 15h8M8 7h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      q: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/></svg>',
      st: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4l2.5 2M10 3h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      ex: '<svg viewBox="0 0 24 24"><path d="M4 6l8-3 8 3-8 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 8v5c0 1.5 2.2 3 5 3s5-1.5 5-3V8M20 6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    };

    $('#view-home').replaceChildren(
      el('section', { class: 'home-hero' },
        el('p', { class: 'eyebrow' }, 'Yorkshire & Humber School of Anaesthesia'),
        el('h1', null, 'From your first day in theatre ', el('em', null, 'to your CCT')),
        el('p', { class: 'lede' }, 'The RCoA curriculum by stage, a guide to the FRCA (including the new exam formats from July 2027), revision notes mapped to the syllabus, practice questions and exam-station practice, in one place.'),
        el('div', { class: 'hero-actions' },
          el('a', { class: 'btn', href: '#questions' }, 'Practise questions'),
          el('a', { class: 'btn ghost', href: '#map' }, 'Syllabus overview'),
          el('a', { class: 'btn ghost', href: '#notes' }, 'Browse revision notes'),
          el('a', { class: 'btn ghost', href: '#exams' }, 'FRCA 2027 changes')),
        WIDGETS.stats()),

      el('h2', { class: 'section-h' }, 'Where are you in training?'),
      el('div', { class: 'stage-grid' },
        stageCard('Novice', 'First 3–6 months', 'The Initial Assessment of Competence: a GA step by step, the novice syllabus and e-LA Module 1.', '#start', 's0'),
        stageCard('Stage 1', 'CT1–CT3', 'EPAs 3 and 4, obstetrics, paediatrics and ICM, the Primary FRCA and the Stage 1 certificate.', '#stage/1', 's1'),
        stageCard('Stage 2', 'ST4–ST5', 'Specialist units at intermediate level, the Final FRCA and the Stage 2 certificate.', '#stage/2', 's2'),
        stageCard('Stage 3', 'ST6–ST7', 'The 14 domains, Special Interest Areas, subspecialties and the road to a consultant post.', '#stage/3', 's3')),

      homeSyllabus(),

      el('div', { class: 'callout-box exam home-exam' },
        el('p', { class: 'callout-title' }, 'The FRCA changes format from July 2027'),
        el('p', null, 'The Primary becomes an Applied Knowledge Test (2 × 80 SBA) plus CASE, a 13-station clinical exam. The Final becomes a 100-question AKT plus FCPE, a 12-station clinical exam. The curriculum and syllabus are unchanged. ', el('a', { href: '#exams' }, 'What it means for you →'))),

      el('h2', { class: 'section-h' }, 'Study tools'),
      el('div', { class: 'tile-grid' },
        tile(I.notes, 'Revision notes', 'Concise, original notes for the Primary and Final, each mapped to RCoA syllabus codes with a station prompt.', '#notes', `${C.notes.length} notes`),
        tile(I.q, 'Question bank', 'Single-best-answer practice by topic, or full mock papers built to the new AKT blueprint.', '#questions', `${C.questions.primary.total + C.questions.final.total} questions`),
        tile(I.st, 'Station practice', '9-minute CASE and FCPE scenarios with examiner prompts, key features and a feedback form.', '#stations', `${C.stations.length} stations`),
        tile(I.ex, 'Exams hub', 'Formats, dates, the transition year, a study plan and a directory of question banks.', '#exams', 'Updated September 2026')),

      el('div', { class: 'grid-2 home-cards' },
        el('div', { class: 'card' },
          el('h2', null, 'Pick up where you left off'),
          el('ul', { class: 'linklist' },
            lastNoteMeta ? el('li', null, 'Last note: ', el('a', { href: `#notes/${lastNoteMeta.id}` }, lastNoteMeta.title)) : el('li', null, 'No notes read yet. ', el('a', { href: '#notes' }, 'Start with the notes library.')),
            el('li', null, answered ? `Questions answered: ${answered} (${App.pct(correct, answered)}% correct at last attempt). ` : 'No questions answered yet. ', el('a', { href: answered ? '#questions/stats' : '#questions' }, answered ? 'See progress' : 'Try ten questions')),
            el('li', null, `Novice topics covered: ${novDone} of ${nov ? nov.topics.length : 0}. `, el('a', { href: '#syllabus' }, 'Open the novice syllabus')))),
        el('div', { class: 'card' },
          el('h2', null, 'Yorkshire & Humber'),
          el('p', null, 'Regional teaching runs through ', el('a', { href: S.links.yairn, target: '_blank', rel: 'noopener', class: 'ext' }, 'YAIRN'), ': Core (CT1–3), Advanced (ST4–7), ICM and Exam Preparation branches. Each stage page lists the relevant branch.'),
          el('p', { class: 'small' }, 'Ask your College Tutor about your hospital\'s IAC programme, teaching and exam practice.'))),
      el('p', { class: 'home-foot small' }, 'Educational material only, not medical advice. Content is in draft and awaiting clinical review. ', el('a', { href: '#disclaimer' }, 'Read the disclaimer.')));
  }
  // The four-box syllabus (built by syllabus-map.js), with a level filter that redraws in place.
  function homeSyllabus() {
    if (!App.syllabusBoxes || !C.overview) return null;
    let level = 'all';
    const slot = el('div');
    const seg = el('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Show topics for' }, App.syllabusLevels.map(([k, label]) =>
      el('button', { type: 'button', role: 'radio', 'aria-checked': String(k === level), onclick: e => {
        level = k;
        $$('button', seg).forEach(b => b.setAttribute('aria-checked', String(b === e.currentTarget)));
        slot.replaceChildren(App.syllabusBoxes(level));
      } }, label)));
    slot.append(App.syllabusBoxes(level));
    return el('section', { class: 'home-syllabus' },
      el('div', { class: 'home-syllabus-head' },
        el('div', null,
          el('h2', { class: 'section-h' }, 'The syllabus in four boxes'),
          el('p', { class: 'small' }, 'Every topic from your first list to the Final. Open a section to see its topics, notes and guides. ', el('a', { href: '#map' }, 'Full overview →'))),
        seg),
      slot);
  }
  App.on('home', () => { renderHome(); return { view: 'home', tab: 'home', title: '' }; });

  App.inits.push(() => {
    // Extra material for the Resources page (novice-era cards stay as they are).
    const extra = C.pages['resources-more'];
    const view = $('#view-resources');
    if (extra && view && !$('#resources-more')) {
      const h = view.querySelector('h1');
      if (h) h.textContent = 'Key resources';
      const box = el('div', { id: 'resources-more', class: 'prose', html: extra.html });
      renderWidgets(box);
      view.querySelector('.grid-2').after(box);
    }
  });

  App.renderWidgets = renderWidgets;
  App.renderPage = renderPage;
})();
