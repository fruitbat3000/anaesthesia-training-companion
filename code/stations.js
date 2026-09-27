/* CASE / FCPE station practice: list, and a station runner with candidate and examiner views,
 * a 2 + 9 minute timer, key-feature checklist, domain and global ratings, and a feedback summary. */
(function () {
  'use strict';
  const { $, $$, el, C, store, KEYS } = App;

  // Rating language follows the RCoA Trainer Support Pack (June 2026) marking framework (SOURCES.md S14).
  const KF_LEVELS = ['Unable to identify', 'Limited', 'Acceptable', 'Good', 'Comprehensive'];
  const DOMAIN_LEVELS = ['Very poor', 'Poor', 'Acceptable', 'Good', 'Excellent'];
  const GRS = [
    ['Clear fail', 'Always needs direct help; could not be left unsupervised.'],
    ['Borderline fail', 'Some ability but needs frequent help; supervisor must be close by.'],
    ['Borderline pass', 'Does the basics without help; needs guidance with complex tasks.'],
    ['Good pass', 'Independent for most things; supervisor available by phone.'],
    ['Excellent pass', 'Capable and independent.'],
  ];
  const ARENAS = { preop: 'Preoperative', intraop: 'Intraoperative', postop: 'Postoperative', critical: 'Critically ill patient', outside: 'Practice outside theatre' };

  const records = () => store.get(KEYS.stations, {});

  /* ---------- list ---------- */
  const filt = { exam: '', arena: '' };
  function renderList() {
    const list = C.stations.filter(s => (!filt.exam || s.exam === filt.exam) && (!filt.arena || s.arena === filt.arena));
    const rec = records();
    const chip = (key, value, label) => el('button', { type: 'button', class: 'chip', 'aria-pressed': String(filt[key] === value), onclick: () => { filt[key] = value; renderList(); } }, label);
    $('#view-stations').replaceChildren(
      el('header', { class: 'page-head' },
        el('h1', null, 'Station practice'),
        el('p', { class: 'lede' }, 'Nine-minute scenarios in the style of the new clinical exams: CASE (Primary) and FCPE (Final). Work in pairs or with a trainer: one person reads the candidate brief, the other runs the examiner view, times the station, ticks key features and gives structured feedback.'),
        el('p', null, el('a', { href: '#stations/how' }, 'How to run a practice station →'))),
      el('div', { class: 'filters card' },
        el('div', { class: 'chips' }, chip('exam', '', `All (${C.stations.length})`), chip('exam', 'case', 'CASE (Primary)'), chip('exam', 'fcpe', 'FCPE (Final)')),
        el('div', { class: 'chips' }, chip('arena', '', 'Any setting'), Object.entries(ARENAS).map(([k, v]) => chip('arena', k, v)))),
      list.length ? el('div', { class: 'station-grid' }, list.map(s => el('a', { class: 'station-card', href: `#stations/${s.id}` },
        el('span', { class: 'station-tags' }, el('span', { class: `badge ${s.exam}` }, s.exam === 'case' ? 'CASE' : 'FCPE'), el('span', { class: 'badge' }, ARENAS[s.arena] || s.arena), rec[s.id] ? el('span', { class: 'badge done' }, `✓ ${rec[s.id].grs || 'practised'}`) : null),
        el('span', { class: 'station-title' }, s.title),
        el('span', { class: 'station-sum' }, s.summary),
        el('span', { class: 'station-meta small' }, [s.domain, s.group, s.science].filter(Boolean).join(' · '), ' ', App.statusBadge(s.status))))) : el('p', { class: 'empty' }, 'No stations match these filters.'));
  }

  /* ---------- timer ---------- */
  let beepCtx = null;
  function beep(times = 1) {
    try {
      beepCtx = beepCtx || new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < times; i++) {
        const o = beepCtx.createOscillator(); const g = beepCtx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(beepCtx.destination);
        const t = beepCtx.currentTime + i * 0.35;
        g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t); o.stop(t + 0.3);
      }
    } catch (e) { /* audio unavailable */ }
  }
  let tHandle = null;
  function timerWidget() {
    const phases = [['Reading time', 120], ['Station', 540]];
    let phase = -1; let endAt = 0; let paused = 0;
    const label = el('span', { class: 'timer-label' }, 'Ready: 2 min reading, then 9 min station');
    const clock = el('span', { class: 'timer-clock' }, '2:00');
    const bar = el('span', { class: 'timer-bar' }, el('span'));
    const startBtn = el('button', { type: 'button', class: 'btn' }, 'Start reading time');
    const skipBtn = el('button', { type: 'button', class: 'btn ghost small', hidden: true }, 'Skip to station');
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    function tick() {
      if (phase < 0) return;
      const left = paused ? paused : Math.max(0, (endAt - Date.now()) / 1000);
      clock.textContent = fmt(Math.ceil(left));
      bar.firstChild.style.width = `${100 - (100 * left) / phases[phase][1]}%`;
      clock.classList.toggle('late', phase === 1 && left <= 60);
      if (phase === 1 && Math.ceil(left) === 60 && !tick.warned) { tick.warned = true; beep(1); }
      if (left <= 0 && !paused) {
        if (phase === 0) { beep(2); begin(1); } else { beep(3); clearInterval(tHandle); label.textContent = 'Time up'; startBtn.textContent = 'Restart'; startBtn.hidden = false; skipBtn.hidden = true; phase = -1; }
      }
    }
    function begin(p) {
      phase = p; paused = 0; tick.warned = false;
      endAt = Date.now() + phases[p][1] * 1000;
      label.textContent = phases[p][0];
      skipBtn.hidden = p !== 0;
      startBtn.textContent = 'Pause';
      clearInterval(tHandle); tHandle = setInterval(tick, 250); tick();
    }
    startBtn.addEventListener('click', () => {
      if (phase < 0) { begin(0); beep(1); return; }
      if (paused) { endAt = Date.now() + paused * 1000; paused = 0; startBtn.textContent = 'Pause'; }
      else { paused = Math.max(0, (endAt - Date.now()) / 1000); startBtn.textContent = 'Resume'; }
    });
    skipBtn.addEventListener('click', () => { begin(1); beep(1); });
    return el('div', { class: 'station-timer card' }, el('div', { class: 'timer-row' }, el('div', null, label, clock), el('div', { class: 'timer-btns' }, startBtn, skipBtn)), bar);
  }

  /* ---------- station runner ---------- */
  async function renderStation(id, mode) {
    clearInterval(tHandle);
    const s = C.stations.find(x => x.id === id);
    const box = $('#view-station');
    if (!s) { box.replaceChildren(el('h1', null, 'Station not found'), el('a', { href: '#stations' }, 'All stations')); return null; }
    box.replaceChildren(el('p', { class: 'loading' }, 'Loading…'));
    const all = await App.loadPart('stations');
    const h = all[s.id];
    const rec = records()[s.id] || {};
    const examiner = mode === 'examiner';

    const modeTabs = el('div', { class: 'seg', role: 'tablist' },
      el('a', { role: 'tab', href: `#stations/${s.id}`, 'aria-selected': String(!examiner) }, 'Candidate view'),
      el('a', { role: 'tab', href: `#stations/${s.id}/examiner`, 'aria-selected': String(examiner) }, 'Examiner view'));

    const header = el('header', { class: 'page-head' },
      el('nav', { class: 'crumbs' }, el('a', { href: '#stations' }, 'Station practice'), ' / ', s.exam === 'case' ? 'CASE' : 'FCPE'),
      el('h1', null, s.title),
      el('div', { class: 'station-tags' },
        el('span', { class: `badge ${s.exam}` }, s.exam === 'case' ? 'CASE · Primary' : 'FCPE · Final'),
        el('span', { class: 'badge' }, ARENAS[s.arena] || s.arena),
        s.domain ? el('span', { class: 'badge' }, s.domain) : null,
        s.group ? el('span', { class: 'badge' }, s.group) : null,
        s.science ? el('span', { class: 'badge' }, s.science) : null,
        App.statusBadge(s.status)),
      modeTabs);

    const candidate = el('section', { class: 'card brief' }, el('h2', null, 'Candidate instructions'), el('div', { class: 'prose', html: h.candidate }),
      el('p', { class: 'small' }, 'You have 2 minutes to read this, then 9 minutes in the station.'));

    if (!examiner) {
      box.replaceChildren(header, timerWidget(), candidate,
        el('details', { class: 'card reveal' }, el('summary', null, 'After the station: what good looks like and learning points'),
          h.model ? el('div', { class: 'prose', html: h.model }) : null,
          h.learning ? el('div', { class: 'prose', html: h.learning }) : null,
          s.related.length ? el('p', null, 'Revise: ', s.related.map((r, i) => { const n = C.notes.find(x => x.id === r); return n ? [i ? ', ' : '', el('a', { href: `#notes/${n.id}` }, n.title)] : null; })) : null,
          App.refList(s.refs)),
        el('p', { class: 'page-foot' }, App.reportLink('Station', s.id, s.title)));
      return s;
    }

    // Examiner view
    const ticks = new Set(rec.ticks || []);
    const ratings = Object.assign({}, rec.ratings || {});
    let grs = rec.grs || '';
    const skills = s.skills.length ? s.skills : ['Clinical reasoning', 'Communication', 'Situational awareness'];

    const kf = el('ul', { class: 'kf-list' }, h.features.map((f, i) => el('li', null, el('label', null,
      el('input', { type: 'checkbox', checked: ticks.has(i), onchange: e => { e.target.checked ? ticks.add(i) : ticks.delete(i); updateKf(); } }), el('span', { html: f })))));
    const kfLevel = el('p', { class: 'kf-level' });
    function updateKf() {
      const frac = h.features.length ? ticks.size / h.features.length : 0;
      const lvl = frac >= 0.9 ? 4 : frac >= 0.7 ? 3 : frac >= 0.45 ? 2 : frac > 0 ? 1 : 0;
      kfLevel.replaceChildren('Key features identified: ', el('strong', null, `${ticks.size}/${h.features.length}`), ` — ${KF_LEVELS[lvl]}`);
      kfLevel.dataset.level = lvl;
    }
    updateKf();

    const scale = (name, levels, value, onpick) => el('div', { class: 'rating' }, el('span', { class: 'rating-name' }, name),
      el('div', { class: 'seg small', role: 'radiogroup', 'aria-label': name }, levels.map(l => el('button', { type: 'button', role: 'radio', 'aria-checked': String(value === l), onclick: e => { onpick(l); $$('button', e.target.parentNode).forEach(b => b.setAttribute('aria-checked', String(b === e.target))); } }, l))));

    const notesBox = el('textarea', { rows: 4, placeholder: 'Specific observations: what went well, what to work on…' });
    notesBox.value = rec.notes || '';
    const summaryOut = el('pre', { class: 'summary-out', hidden: true });

    function summaryText() {
      const lines = [
        `Practice station: ${s.title} (${s.exam === 'case' ? 'CASE' : 'FCPE'} style)`,
        `Date: ${new Date().toLocaleDateString('en-GB')}`,
        `Key features identified: ${ticks.size}/${h.features.length}`,
        ...h.features.map((f, i) => `  ${ticks.has(i) ? '✓' : '✗'} ${f.replace(/<[^>]+>/g, '')}`),
        'Clinical performance skills:',
        ...skills.map(k => `  ${k}: ${ratings[k] || 'not rated'}`),
        `Global rating: ${grs || 'not rated'}`,
        notesBox.value.trim() ? `Comments: ${notesBox.value.trim()}` : '',
        '(Practice only; not an RCoA assessment. Suitable as supporting evidence for a reflection or SLE discussion.)',
      ];
      return lines.filter(Boolean).join('\n');
    }
    function saveRecord() {
      const r = records();
      r[s.id] = { t: Date.now(), ticks: [...ticks], ratings, grs, notes: notesBox.value };
      store.set(KEYS.stations, r);
    }

    box.replaceChildren(header, timerWidget(),
      el('div', { class: 'examiner-layout' },
        el('div', null,
          candidate,
          el('section', { class: 'card' }, el('h2', null, 'Scenario and examiner information'), el('div', { class: 'prose', html: h.scenario })),
          el('section', { class: 'card' }, el('h2', null, 'Examiner prompts'), el('div', { class: 'prose', html: h.prompts })),
          h.model ? el('section', { class: 'card' }, el('h2', null, 'What good looks like'), el('div', { class: 'prose', html: h.model })) : null,
          h.learning ? el('section', { class: 'card' }, el('h2', null, 'Learning points'), el('div', { class: 'prose', html: h.learning })) : null,
          el('section', { class: 'card' }, el('h2', null, 'Domains assessed'), el('div', { class: 'prose', html: h.domains }))),
        el('aside', { class: 'mark-sheet card' },
          el('h2', null, 'Mark sheet'),
          el('h3', null, 'Key features'), kf, kfLevel,
          el('h3', null, 'Clinical performance skills'),
          skills.map(k => scale(k, DOMAIN_LEVELS, ratings[k], v => { ratings[k] = v; })),
          el('h3', null, 'Global rating'),
          el('div', { class: 'grs' }, GRS.map(([l, d]) => el('label', { class: 'grs-opt' }, el('input', { type: 'radio', name: 'grs', checked: grs === l, onchange: () => { grs = l; } }), el('span', null, el('strong', null, l), el('span', { class: 'small' }, d))))),
          el('p', { class: 'small' }, 'In the real exam the global rating does not add marks; it is used to set the pass mark (borderline regression).'),
          el('h3', null, 'Comments'), notesBox,
          el('div', { class: 'mark-actions' },
            el('button', { type: 'button', class: 'btn', onclick: () => { saveRecord(); summaryOut.textContent = summaryText(); summaryOut.hidden = false; App.toast('Saved in this browser'); } }, 'Save and show summary'),
            el('button', { type: 'button', class: 'btn ghost', onclick: async () => { saveRecord(); try { await navigator.clipboard.writeText(summaryText()); App.toast('Summary copied'); } catch (e) { summaryOut.textContent = summaryText(); summaryOut.hidden = false; } } }, 'Copy summary')),
          summaryOut,
          s.related.length ? el('div', null, el('h3', null, 'Related notes'), el('ul', { class: 'linklist' }, s.related.map(r => C.notes.find(x => x.id === r)).filter(Boolean).map(n => el('li', null, el('a', { href: `#notes/${n.id}` }, n.title))))) : null,
          App.refList(s.refs),
          el('p', { class: 'page-foot' }, App.reportLink('Station', s.id, s.title)))));
    return s;
  }

  App.on('stations', args => {
    clearInterval(tHandle);
    if (!args[0]) { renderList(); return { view: 'stations', tab: 'stations', current: '#stations', title: 'Station practice' }; }
    if (args[0] === 'how') { const p = App.renderPage('stations-how'); return { view: 'page', tab: 'stations', current: '#stations/how', title: p && p.title }; }
    const s = C.stations.find(x => x.id === args[0]);
    renderStation(args[0], args[1]);
    return { view: 'station', tab: 'stations', current: '#stations', title: s ? s.title : 'Station' };
  });
})();
