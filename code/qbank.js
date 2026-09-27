/* Question bank: single-best-answer practice, timed mock papers to the AKT blueprint, and progress. */
(function () {
  'use strict';
  const { $, $$, el, C, store, KEYS } = App;
  const CUR = 'atc-current-session-v1';
  const LETTERS = 'ABCDE';

  const bank = { primary: null, final: null };
  async function loadBank(exam) {
    if (!bank[exam]) {
      const list = await App.loadPart(`questions-${exam}`);
      bank[exam] = { list, byId: Object.fromEntries(list.map(q => [q.id, q])) };
    }
    return bank[exam];
  }
  const history = () => store.get(KEYS.qbank, {});
  const keyOf = (exam, q) => (exam === 'final' ? q.domain : q.subject);
  const groupName = (exam, k) => (exam === 'final' ? C.finalDomains[k] : (C.subjects.primary[k] || { name: k }).name) || k;
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fmtTime = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };

  /* ---------- setup ---------- */
  const setup = store.get('atc-qsetup-v1', { exam: 'primary', groups: [], n: 20, filter: 'all', mode: 'practice' });
  const saveSetup = () => store.set('atc-qsetup-v1', setup);

  async function renderSetup() {
    const view = $('#view-questions');
    view.replaceChildren(el('p', { class: 'loading' }, 'Loading questions…'));
    const b = await loadBank(setup.exam);
    const h = history();
    const counts = {};
    b.list.forEach(q => { const k = keyOf(setup.exam, q); counts[k] = (counts[k] || 0) + 1; });
    const groups = Object.keys(counts).sort((x, y) => groupName(setup.exam, x).localeCompare(groupName(setup.exam, y)));
    setup.groups = setup.groups.filter(g => counts[g]);
    const pool = () => b.list.filter(q => (!setup.groups.length || setup.groups.includes(keyOf(setup.exam, q)))
      && (setup.filter === 'all' || (setup.filter === 'new' && !h[q.id]) || (setup.filter === 'wrong' && h[q.id] && !h[q.id].c) || (setup.filter === 'flagged' && h[q.id] && h[q.id].f)));

    const cur = store.get(CUR, null);
    const seg = (name, value, options) => el('div', { class: 'seg', role: 'radiogroup', 'aria-label': name }, options.map(([v, label]) =>
      el('button', { type: 'button', role: 'radio', 'aria-checked': String(value === v), onclick: () => { setup[name] = v; if (name === 'exam') setup.groups = []; saveSetup(); renderSetup(); } }, label)));

    const available = pool().length;
    const n = Math.min(setup.n === 'all' ? available : setup.n, available);
    const startBtn = el('button', { type: 'button', class: 'btn big', disabled: !n, onclick: () => {
      const qs = shuffle(pool()).slice(0, n);
      startSession({ exam: setup.exam, mode: setup.mode, title: `${setup.exam === 'primary' ? 'Primary' : 'Final'} practice · ${n} questions`, qids: qs.map(q => q.id), minutes: setup.mode === 'exam' ? Math.round(n * (setup.exam === 'primary' ? 1.75 : 1.8)) : 0 });
    } }, n ? `Start ${n} question${n === 1 ? '' : 's'}` : 'No questions match');

    const answered = b.list.filter(q => h[q.id]).length;
    const correct = b.list.filter(q => h[q.id] && h[q.id].c).length;

    view.replaceChildren(
      el('header', { class: 'page-head' },
        el('h1', null, 'Question bank'),
        el('p', { class: 'lede' }, 'Original single-best-answer questions in the style of the new Applied Knowledge Tests: a clinical stem, five options and one best answer, with an explanation for every option. Practise by topic, or sit a timed mock paper.')),
      cur && !cur.finished ? el('div', { class: 'callout-box tip resume' }, el('p', null, el('strong', null, 'You have an unfinished session: '), cur.title, ` (${Object.keys(cur.answers).length}/${cur.qids.length} answered).`),
        el('p', null, el('a', { class: 'btn small', href: '#questions/session' }, 'Resume'), ' ', el('button', { type: 'button', class: 'btn small ghost', onclick: () => { store.remove(CUR); renderSetup(); } }, 'Discard'))) : null,
      el('div', { class: 'qsetup card' },
        el('div', { class: 'qsetup-row' }, el('span', { class: 'qsetup-label' }, 'Exam'), seg('exam', setup.exam, [['primary', `Primary (${C.questions.primary.total})`], ['final', `Final (${C.questions.final.total})`]])),
        el('div', { class: 'qsetup-row' }, el('span', { class: 'qsetup-label' }, setup.exam === 'final' ? 'Domains' : 'Subjects'),
          el('div', { class: 'chips' },
            el('button', { type: 'button', class: 'chip', 'aria-pressed': String(!setup.groups.length), onclick: () => { setup.groups = []; saveSetup(); renderSetup(); } }, 'All'),
            groups.map(g => el('button', { type: 'button', class: 'chip', 'aria-pressed': String(setup.groups.includes(g)), onclick: () => {
              setup.groups = setup.groups.includes(g) ? setup.groups.filter(x => x !== g) : [...setup.groups, g]; saveSetup(); renderSetup();
            } }, `${groupName(setup.exam, g)} (${counts[g]})`)))),
        el('div', { class: 'qsetup-row' }, el('span', { class: 'qsetup-label' }, 'Questions'), seg('filter', setup.filter, [['all', 'All'], ['new', 'Unanswered'], ['wrong', 'Answered wrongly'], ['flagged', 'Flagged']])),
        el('div', { class: 'qsetup-row' }, el('span', { class: 'qsetup-label' }, 'How many'), seg('n', setup.n, [[10, '10'], [20, '20'], [40, '40'], ['all', 'All']])),
        el('div', { class: 'qsetup-row' }, el('span', { class: 'qsetup-label' }, 'Mode'), seg('mode', setup.mode, [['practice', 'Practice: answer shown after each'], ['exam', 'Exam: timed, answers at the end']])),
        el('div', { class: 'qsetup-go' }, startBtn, el('span', { class: 'small' }, `${available} available with these settings.`))),
      el('div', { class: 'grid-2' },
        el('a', { class: 'tile', href: '#questions/mock' }, el('span', { class: 'tile-title' }, 'Mock papers'), el('span', { class: 'tile-text' }, 'Timed papers built to the RCoA blueprint: Primary AKT Paper A, Paper B, and the Final AKT.')),
        el('a', { class: 'tile', href: '#questions/stats' }, el('span', { class: 'tile-title' }, 'Your progress'), el('span', { class: 'tile-text' }, answered ? `${answered} of ${b.list.length} ${setup.exam === 'primary' ? 'Primary' : 'Final'} questions answered · ${App.pct(correct, answered)}% correct at last attempt` : 'Accuracy by subject and your recent sessions.'))),
      el('p', { class: 'small' }, 'Keyboard: A–E or 1–5 to choose, Enter to check or move on, F to flag, ← → to move between questions. Questions are drafts awaiting clinical review. Use "Report a problem" on any question you disagree with.'));
  }

  /* ---------- mock papers ---------- */
  async function renderMocks() {
    const view = $('#view-questions');
    view.replaceChildren(el('p', { class: 'loading' }, 'Loading…'));
    await Promise.all([loadBank('primary'), loadBank('final')]);
    const cards = Object.entries(C.blueprints).map(([id, bp]) => {
      const b = bank[bp.exam];
      const avail = {};
      b.list.forEach(q => {
        let k = keyOf(bp.exam, q);
        if (bp.exam === 'final' && !['GA', 'POM', 'RA'].includes(k)) k = 'OTHER';
        avail[k] = (avail[k] || 0) + 1;
      });
      const full = Object.values(bp.parts).reduce((a, c) => a + c, 0);
      // largest scale (≤1) at which every part can still be filled
      const scale = Math.min(1, ...Object.entries(bp.parts).map(([k, v]) => (avail[k] || 0) / v));
      const sizes = size => Object.fromEntries(Object.entries(bp.parts).map(([k, v]) => [k, Math.max(1, Math.round(v * size))]));
      const make = size => () => {
        const parts = sizes(size);
        const qids = [];
        Object.entries(parts).forEach(([k, v]) => {
          const pool = b.list.filter(q => { let kk = keyOf(bp.exam, q); if (bp.exam === 'final' && !['GA', 'POM', 'RA'].includes(kk)) kk = 'OTHER'; return kk === k; });
          qids.push(...shuffle(pool).slice(0, v).map(q => q.id));
        });
        const n = qids.length;
        startSession({ exam: bp.exam, mode: 'exam', title: `${bp.title}${size < 1 ? ` (${n}-question version)` : ''}`, qids: shuffle(qids), minutes: Math.round(bp.minutes * n / full), blueprint: id });
      };
      const quarter = 0.25;
      return el('div', { class: 'card mock-card' },
        el('h2', null, bp.title),
        el('p', { class: 'small' }, `${full} questions · ${Math.floor(bp.minutes / 60)} h ${bp.minutes % 60 ? (bp.minutes % 60) + ' min' : ''}`),
        el('table', { class: 'mini-table' }, el('tbody', null, Object.entries(bp.parts).map(([k, v]) => el('tr', null,
          el('td', null, k === 'OTHER' ? 'Other domains (pain, ICM, resuscitation & transfer, sedation, professional)' : groupName(bp.exam, k)),
          el('td', { class: 'num' }, String(v)),
          el('td', { class: 'num small' }, `${avail[k] || 0} in bank`))))),
        el('div', { class: 'mock-actions' },
          scale >= 1 ? el('button', { type: 'button', class: 'btn', onclick: make(1) }, 'Start full paper') : el('button', { type: 'button', class: 'btn', disabled: true, title: 'The bank does not yet hold enough questions in every section' }, 'Full paper (bank still growing)'),
          scale >= quarter ? el('button', { type: 'button', class: 'btn ghost', onclick: make(quarter) }, `Quarter paper (${Math.round(full * quarter)} q)`) : null,
          scale > 0 && scale < quarter ? el('button', { type: 'button', class: 'btn ghost', onclick: make(scale) }, `Mini paper (${Object.values(sizes(scale)).reduce((a, c) => a + c, 0)} q)`) : null));
    });
    view.replaceChildren(
      el('header', { class: 'page-head' }, el('h1', null, 'Mock papers'),
        el('p', { class: 'lede' }, 'Timed papers with the same subject mix as the new AKTs (RCoA Trainer Support Pack, June 2026). Answers and explanations are shown at the end. Shorter versions keep the same proportions and time per question.')),
      el('div', { class: 'grid-3 mocks' }, cards),
      el('p', { class: 'small' }, 'The real pass mark is set by the RCoA using modified Angoff standard setting and varies by paper. No pass mark is shown here.'));
  }

  /* ---------- sessions ---------- */
  function startSession(opts) {
    const s = Object.assign({ id: Date.now().toString(36), i: 0, answers: {}, checked: {}, flags: {}, struck: {}, started: Date.now(), elapsed: 0, finished: false }, opts);
    store.set(CUR, s);
    location.hash = '#questions/session';
  }
  const saveCur = s => store.set(CUR, s);

  let timerHandle = null;
  async function renderSession(review) {
    clearInterval(timerHandle);
    const view = $('#view-questions');
    const s = store.get(CUR, null);
    if (!s) { location.replace('#questions'); return; }
    const b = await loadBank(s.exam);
    s.qids = s.qids.filter(id => b.byId[id]);
    if (!s.qids.length) { store.remove(CUR); location.replace('#questions'); return; }
    s.i = Math.min(s.i, s.qids.length - 1);
    const reviewing = review || s.finished;
    let tickStart = Date.now();

    function draw() {
      const q = b.byId[s.qids[s.i]];
      const chosen = s.answers[q.id];
      const revealed = reviewing || (s.mode === 'practice' && s.checked[q.id]);
      const struck = s.struck[q.id] || [];

      const opts = el('ol', { class: 'options', role: 'radiogroup', 'aria-label': 'Answer options' }, q.options.map((o, k) => {
        const cls = ['opt'];
        if (chosen === k) cls.push('chosen');
        if (revealed && k === q.answer) cls.push('correct');
        if (revealed && chosen === k && k !== q.answer) cls.push('wrong');
        if (struck.includes(k)) cls.push('struck');
        return el('li', { class: cls.join(' ') },
          el('button', { type: 'button', class: 'opt-btn', role: 'radio', 'aria-checked': String(chosen === k), disabled: revealed, onclick: () => choose(k) },
            el('span', { class: 'opt-letter' }, LETTERS[k]), el('span', { class: 'opt-text', html: o })),
          revealed ? null : el('button', { type: 'button', class: 'strike', title: struck.includes(k) ? 'Restore this option' : 'Rule out this option', 'aria-label': `Rule out option ${LETTERS[k]}`, onclick: () => strike(k) }, '✕'));
      }));

      const correct = chosen === q.answer;
      const feedback = revealed ? el('div', { class: 'explain ' + (chosen == null ? 'skipped' : correct ? 'right' : 'wrong') },
        el('p', { class: 'verdict' }, chosen == null ? `Not answered. The best answer is ${LETTERS[q.answer]}.` : correct ? `Correct — ${LETTERS[q.answer]}.` : `Not quite. You chose ${LETTERS[chosen]}; the best answer is ${LETTERS[q.answer]}.`),
        el('div', { class: 'prose', html: q.explain }),
        q.note || q.refs.length ? el('div', { class: 'explain-links' },
          q.note ? el('p', null, 'Revise: ', el('a', { href: `#notes/${q.note}` }, (C.notes.find(n => n.id === q.note) || { title: q.note }).title)) : null,
          App.refList(q.refs)) : null,
        el('p', { class: 'q-foot' }, el('span', { class: 'small' }, q.codes.join(' · ')), ' ', App.statusBadge(q.status), ' ', App.reportLink('Question', q.id, `Question ${q.id}`, `Session question ${s.i + 1}; answer key ${LETTERS[q.answer]}`))) : null;

      const answeredCount = Object.keys(s.answers).length;
      const nav = el('div', { class: 'q-nav-grid', 'aria-label': 'Question navigator' }, s.qids.map((id, k) => {
        const qq = b.byId[id];
        const a = s.answers[id];
        const cls = ['qn'];
        if (k === s.i) cls.push('here');
        if (a != null) cls.push('ans');
        if ((reviewing || (s.mode === 'practice' && s.checked[id])) && a != null) cls.push(a === qq.answer ? 'ok' : 'bad');
        if (s.flags[id]) cls.push('flag');
        return el('button', { type: 'button', class: cls.join(' '), onclick: () => { s.i = k; saveCur(s); draw(); }, 'aria-label': `Question ${k + 1}` }, String(k + 1));
      }));

      const primaryBtn = reviewing ? null
        : s.mode === 'practice' && !s.checked[q.id] ? el('button', { type: 'button', class: 'btn', disabled: chosen == null, onclick: check }, 'Check answer')
          : s.i < s.qids.length - 1 ? el('button', { type: 'button', class: 'btn', onclick: () => go(1) }, 'Next question →')
            : el('button', { type: 'button', class: 'btn', onclick: finish }, 'Finish and see results');

      view.replaceChildren(
        el('div', { class: 'q-top' },
          el('div', null, el('p', { class: 'q-title' }, s.title + (reviewing ? ' · review' : '')),
            el('p', { class: 'small' }, `Question ${s.i + 1} of ${s.qids.length} · ${answeredCount} answered · ${groupName(s.exam, keyOf(s.exam, q))}`)),
          el('div', { class: 'q-tools' },
            s.minutes && !reviewing ? el('span', { class: 'timer', id: 'q-timer' }, '') : null,
            el('button', { type: 'button', class: 'btn small ghost' + (s.flags[q.id] ? ' flagged' : ''), onclick: flag, 'aria-pressed': String(!!s.flags[q.id]) }, s.flags[q.id] ? '⚑ Flagged' : '⚐ Flag'),
            reviewing ? el('a', { class: 'btn small ghost', href: '#questions/results' }, 'Results') : el('button', { type: 'button', class: 'btn small ghost', onclick: finish }, 'End session'))),
        el('div', { class: 'progress-line' }, el('span', { style: `width:${App.pct(s.i + 1, s.qids.length)}%` })),
        el('div', { class: 'q-layout' },
          el('div', { class: 'q-main card' },
            el('div', { class: 'stem prose', html: q.stem }),
            opts,
            feedback,
            el('div', { class: 'q-actions' },
              el('button', { type: 'button', class: 'btn ghost', disabled: s.i === 0, onclick: () => go(-1) }, '← Previous'),
              primaryBtn,
              reviewing && s.i < s.qids.length - 1 ? el('button', { type: 'button', class: 'btn', onclick: () => go(1) }, 'Next →') : null)),
          el('aside', { class: 'q-side' }, el('div', { class: 'card' }, el('h3', null, 'Navigator'), nav,
            el('p', { class: 'small legend' }, el('span', { class: 'qn ans' }, ' '), ' answered ', el('span', { class: 'qn flag' }, ' '), ' flagged')))));
      updateTimer();
    }

    function record(q, k) {
      const h = history();
      const prev = h[q.id] || { n: 0 };
      h[q.id] = { a: k, c: k === q.answer, n: prev.n + 1, t: Date.now(), f: prev.f || false };
      store.set(KEYS.qbank, h);
    }
    function choose(k) {
      const q = b.byId[s.qids[s.i]];
      s.answers[q.id] = k;
      saveCur(s);
      draw();
    }
    function strike(k) {
      const id = s.qids[s.i];
      const list = s.struck[id] || [];
      s.struck[id] = list.includes(k) ? list.filter(x => x !== k) : [...list, k];
      saveCur(s); draw();
    }
    function check() {
      const q = b.byId[s.qids[s.i]];
      if (s.answers[q.id] == null) return;
      s.checked[q.id] = true;
      record(q, s.answers[q.id]);
      saveCur(s); draw();
    }
    function flag() {
      const id = s.qids[s.i];
      s.flags[id] = !s.flags[id];
      const h = history();
      if (h[id]) { h[id].f = s.flags[id]; store.set(KEYS.qbank, h); }
      else if (s.flags[id]) { h[id] = { n: 0, f: true }; store.set(KEYS.qbank, h); }
      saveCur(s); draw();
    }
    function go(d) { s.i = Math.max(0, Math.min(s.qids.length - 1, s.i + d)); saveCur(s); draw(); }
    function finish() {
      if (!reviewing) {
        const unanswered = s.qids.length - Object.keys(s.answers).length;
        if (unanswered && !s._confirm) { s._confirm = true; App.toast(`${unanswered} unanswered. Select "End session" again to finish.`); setTimeout(() => { s._confirm = false; }, 4000); return; }
      }
      s.finished = true;
      s.elapsed += (Date.now() - tickStart) / 1000;
      // exam mode: record every answer now; practice mode: record anything answered but not checked
      s.qids.forEach(id => { if (s.answers[id] != null && !s.checked[id]) record(b.byId[id], s.answers[id]); });
      const score = s.qids.filter(id => s.answers[id] === b.byId[id].answer).length;
      const by = {};
      s.qids.forEach(id => { const k = keyOf(s.exam, b.byId[id]); by[k] = by[k] || [0, 0]; by[k][1]++; if (s.answers[id] === b.byId[id].answer) by[k][0]++; });
      const sessions = store.get(KEYS.sessions, []);
      sessions.unshift({ id: s.id, title: s.title, exam: s.exam, n: s.qids.length, score, date: Date.now(), by, mins: Math.round(s.elapsed / 60) });
      store.set(KEYS.sessions, sessions.slice(0, 60));
      saveCur(s);
      clearInterval(timerHandle);
      location.hash = '#questions/results';
    }
    function updateTimer() {
      const t = $('#q-timer');
      if (!t) return;
      const used = s.elapsed + (Date.now() - tickStart) / 1000;
      const left = s.minutes * 60 - used;
      t.textContent = left > 0 ? `⏱ ${fmtTime(left)} left` : `⏱ Time up (+${fmtTime(-left)})`;
      t.classList.toggle('late', left < 300);
    }
    timerHandle = setInterval(() => {
      if (!$('#view-questions') || $('#view-questions').hidden) { clearInterval(timerHandle); return; }
      updateTimer();
      // bank elapsed time every 15 s so a reload keeps it
      if (Date.now() - tickStart > 15000) { s.elapsed += (Date.now() - tickStart) / 1000; tickStart = Date.now(); saveCur(s); }
    }, 1000);

    keyHandler = e => {
      if ($('#view-questions').hidden || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
      const k = e.key.toUpperCase();
      const q = b.byId[s.qids[s.i]];
      const revealed = reviewing || (s.mode === 'practice' && s.checked[q.id]);
      if (!revealed && (LETTERS.includes(k) && k.length === 1 || /^[1-5]$/.test(k))) { choose(LETTERS.includes(k) ? LETTERS.indexOf(k) : +k - 1); e.preventDefault(); }
      else if (k === 'ENTER') { if (s.mode === 'practice' && !s.checked[q.id] && !reviewing) check(); else if (s.i < s.qids.length - 1) go(1); e.preventDefault(); }
      else if (k === 'ARROWRIGHT') go(1);
      else if (k === 'ARROWLEFT') go(-1);
      else if (k === 'F' && !reviewing) flag();
    };
    draw();
  }
  let keyHandler = null;
  document.addEventListener('keydown', e => { if (keyHandler && /^#questions\/(session|review)/.test(location.hash)) keyHandler(e); });

  /* ---------- results ---------- */
  async function renderResults() {
    const view = $('#view-questions');
    const s = store.get(CUR, null);
    if (!s || !s.finished) { location.replace('#questions'); return; }
    const b = await loadBank(s.exam);
    const ids = s.qids.filter(id => b.byId[id]);
    const score = ids.filter(id => s.answers[id] === b.byId[id].answer).length;
    const by = {};
    ids.forEach(id => { const k = keyOf(s.exam, b.byId[id]); by[k] = by[k] || [0, 0]; by[k][1]++; if (s.answers[id] === b.byId[id].answer) by[k][0]++; });
    const wrong = ids.filter(id => s.answers[id] !== b.byId[id].answer);
    const p = App.pct(score, ids.length);
    view.replaceChildren(
      el('header', { class: 'page-head' }, el('h1', null, 'Results'), el('p', { class: 'lede' }, s.title)),
      el('div', { class: 'result-hero card' },
        el('div', { class: 'ring', style: `--p:${p}` }, el('span', null, `${p}%`)),
        el('div', null, el('p', { class: 'result-score' }, `${score} of ${ids.length} correct`),
          el('p', { class: 'small' }, `Time: ${Math.max(1, Math.round(s.elapsed / 60))} min${s.minutes ? ` of ${s.minutes} allowed` : ''}.`),
          el('p', null, el('a', { class: 'btn', href: '#questions/review' }, 'Review answers'), ' ',
            wrong.length ? el('button', { type: 'button', class: 'btn ghost', onclick: () => startSession({ exam: s.exam, mode: 'practice', title: 'Retry: questions I got wrong', qids: shuffle(wrong), minutes: 0 }) }, `Retry the ${wrong.length} I got wrong`) : null, ' ',
            el('a', { class: 'btn ghost', href: '#questions' }, 'New session')))),
      el('div', { class: 'card' }, el('h2', null, 'By topic'),
        el('table', { class: 'data-table' }, el('thead', null, el('tr', null, el('th', null, 'Topic'), el('th', { class: 'num' }, 'Score'), el('th', null, ''))),
          el('tbody', null, Object.entries(by).sort((a, b2) => b2[1][1] - a[1][1]).map(([k, [c, n]]) => el('tr', null,
            el('td', null, groupName(s.exam, k)), el('td', { class: 'num' }, `${c}/${n}`), el('td', null, App.meter(c, n))))))),
      el('div', { class: 'card' }, el('h2', null, 'Questions'),
        el('ol', { class: 'result-list' }, ids.map((id, k) => {
          const q = b.byId[id];
          const ok = s.answers[id] === q.answer;
          const stemText = q.stem.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          return el('li', { class: ok ? 'ok' : 'bad' }, el('button', { type: 'button', class: 'linklike', onclick: () => { s.i = k; saveCur(s); location.hash = '#questions/review'; } },
            `${ok ? '✓' : '✗'} ${stemText.slice(0, 120)}${stemText.length > 120 ? '…' : ''}`));
        }))));
  }

  /* ---------- stats ---------- */
  async function renderStats() {
    const view = $('#view-questions');
    view.replaceChildren(el('p', { class: 'loading' }, 'Loading…'));
    await Promise.all([loadBank('primary'), loadBank('final')]);
    const h = history();
    const sessions = store.get(KEYS.sessions, []);
    const block = exam => {
      const b = bank[exam];
      const by = {};
      b.list.forEach(q => { const k = keyOf(exam, q); by[k] = by[k] || { n: 0, a: 0, c: 0 }; by[k].n++; if (h[q.id] && h[q.id].n) { by[k].a++; if (h[q.id].c) by[k].c++; } });
      return el('div', { class: 'card' }, el('h2', null, exam === 'primary' ? 'Primary FRCA' : 'Final FRCA'),
        el('table', { class: 'data-table' },
          el('thead', null, el('tr', null, el('th', null, exam === 'final' ? 'Domain' : 'Subject'), el('th', null, 'Answered'), el('th', { class: 'num' }, 'Correct at last attempt'))),
          el('tbody', null, Object.entries(by).sort((a, b2) => groupName(exam, a[0]).localeCompare(groupName(exam, b2[0]))).map(([k, v]) => el('tr', null,
            el('td', null, groupName(exam, k)), el('td', null, App.meter(v.a, v.n)), el('td', { class: 'num' }, v.a ? `${App.pct(v.c, v.a)}%` : '—'))))));
    };
    const flagged = Object.values(h).filter(v => v.f).length;
    view.replaceChildren(
      el('header', { class: 'page-head' }, el('h1', null, 'Your progress'), el('p', { class: 'lede' }, 'Saved in this browser only. Export it from the About page to move it to another device.')),
      el('div', { class: 'grid-2' }, block('primary'), block('final')),
      el('div', { class: 'card' }, el('h2', null, 'Recent sessions'),
        sessions.length ? el('table', { class: 'data-table' }, el('thead', null, el('tr', null, el('th', null, 'Date'), el('th', null, 'Session'), el('th', { class: 'num' }, 'Score'))),
          el('tbody', null, sessions.slice(0, 20).map(x => el('tr', null, el('td', null, new Date(x.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })), el('td', null, x.title), el('td', { class: 'num' }, `${x.score}/${x.n} (${App.pct(x.score, x.n)}%)`)))))
          : el('p', { class: 'small' }, 'No sessions yet.'),
        el('p', { class: 'small' }, `${flagged} question${flagged === 1 ? '' : 's'} flagged. Choose "Flagged" on the practice page to revisit them.`)));
  }

  /* ---------- routes ---------- */
  App.on('questions', args => {
    const a = args[0];
    keyHandler = null;
    const T = { view: 'questions', tab: 'questions' };
    if (a === 'session') { renderSession(false); return { ...T, current: '#questions', title: 'Question session' }; }
    if (a === 'review') { renderSession(true); return { ...T, current: '#questions', title: 'Review answers' }; }
    if (a === 'results') { renderResults(); return { ...T, current: '#questions', title: 'Results' }; }
    if (a === 'mock') { renderMocks(); return { ...T, current: '#questions/mock', title: 'Mock papers' }; }
    if (a === 'stats') { renderStats(); return { ...T, current: '#questions/stats', title: 'Your progress' }; }
    if (a === 'note' && args[1]) {
      const n = C.notes.find(x => x.id === args[1]);
      if (n) {
        loadBank(n.exam).then(b => {
          const qs = b.list.filter(q => q.note === n.id);
          if (qs.length) startSession({ exam: n.exam, mode: 'practice', title: `Test yourself: ${n.title}`, qids: shuffle(qs).map(q => q.id), minutes: 0 });
          else location.replace('#questions');
        });
      }
      return { ...T, current: '#questions', title: 'Questions' };
    }
    renderSetup();
    return { ...T, current: '#questions', title: 'Question bank' };
  });
})();
