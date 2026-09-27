/* Novice section (up to the IAC): syllabus, worked GA, IAC clusters, glossary and checklist.
 * Registers its views with the router in core.js. */
(function () {
  'use strict';

  const S = window.SITE;
  const STORE_KEY = App.KEYS.novice;
  const { $, $$ } = App;

  /* Short paraphrase of each cluster's Key Capabilities (IAC Workbook v1.2). */
  const CLUSTER_CAPS = {
    epa1: 'Focused history, examination and investigations. Recognise and escalate risk. Explain how past history affects anaesthesia. Explain the plan and common risks to the patient. Know the limits of a novice.',
    pre: 'Use the pre-op assessment to plan care. Know your scope and seek help. Starvation policies. Working knowledge of the machine, monitoring, airway equipment and common drugs.',
    intra: 'Mask ventilation, supraglottic airway, and intubation with direct and video laryngoscopy. RSI. Spontaneous and controlled ventilation. Physiological effects of GA. Positioning. Infection control. Extubation and emergence problems such as laryngospasm.',
    post: 'Give a clear handover to recovery. Manage problems in recovery, including acute pain and rescue opioids.',
    emerg: 'Rehearse the QRH "unknowns". Demonstrate the failed intubation routine on a manikin, following DAS. Show anaesthetic non-technical skills.',
  };

  /* ---------- progress storage (per browser only) ---------- */
  let progress = { topics: {}, ela: {} };
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        progress = { topics: p.topics || {}, ela: p.ela || {} };
      }
    } catch (e) { /* storage unavailable: run without saving */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }

  /* ---------- flattened data ---------- */
  const topics = [];
  S.domains.forEach(d => d.groups.forEach(g => g.topics.forEach(t => {
    topics.push(Object.assign({ domain: d, group: g }, t));
  })));
  const topicById = Object.fromEntries(topics.map(t => [t.id, t]));
  const allEla = Array.from(new Set(topics.flatMap(t => t.ela))).filter(c => S.ela[c]);

  /* ---------- helpers ---------- */
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => { if (c != null) n.append(c.nodeType ? c : document.createTextNode(c)); });
    return n;
  }
  const ext = (href, text, cls) => el('a', { href, target: '_blank', rel: 'noopener', class: cls }, text);
  const isCode = c => /^\d{2}_\d{2}_\d{2}$|^\d{2}[a-z]_\d{2}_\d{2}$/.test(c);

  function fillStaticLinks() {
    $$('[data-link]').forEach(a => {
      const url = S.links[a.dataset.link];
      if (url) a.href = url;
      else console.warn('Missing link', a.dataset.link);
    });
    $$('[data-checked]').forEach(n => { n.textContent = S.checked; });
  }

  /* ---------- header progress ---------- */
  function renderSummary() {
    const tDone = topics.filter(t => progress.topics[t.id]).length;
    const eDone = allEla.filter(c => progress.ela[c]).length;
    const meter = (label, a, b) => el('span', { class: 'meter', title: `${a} of ${b}` },
      label, ' ', el('span', { class: 'bar', 'aria-hidden': 'true' }, el('span', { style: `width:${b ? (100 * a / b) : 0}%` })), ` ${a}/${b}`);
    const box = $('#novice-progress');
    if (box) box.replaceChildren(meter('Topics covered', tDone, topics.length), meter('e-LfH sessions', eDone, allEla.length));
  }

  /* ---------- journey ---------- */
  function topicChip(id) {
    const t = topicById[id];
    if (!t) return null;
    return el('a', { href: `#syllabus/${id}`, class: 'topic-chip' + (progress.topics[id] ? ' done' : '') }, t.title);
  }
  function renderJourney() {
    $('#journey-list').replaceChildren(...S.journey.map(stage => el('li', null,
      el('div', { class: 'card' },
        el('h2', null, stage.title),
        el('ul', null, stage.points.map(p => el('li', null, p))),
        el('div', { class: 'topic-chips' }, stage.topics.map(topicChip))))));
    $$('#journey-list li li').forEach(markTerms);
  }

  /* ---------- syllabus ---------- */
  const filter = { q: '', clusters: new Set(), onlyFirst: false, hideDone: false };

  function renderClusterChips() {
    const wrap = $('#cluster-chips');
    wrap.replaceChildren(
      el('span', { class: 'small', style: 'align-self:center' }, 'IAC:'),
      ...Object.entries(S.clusters).map(([k, c]) => el('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(filter.clusters.has(k)), title: c.name,
        onclick: () => { filter.clusters.has(k) ? filter.clusters.delete(k) : filter.clusters.add(k); renderClusterChips(); renderSyllabus(); },
      }, c.short)));
  }

  function matches(t) {
    if (filter.onlyFirst && !t.first) return false;
    if (filter.hideDone && progress.topics[t.id]) return false;
    if (filter.clusters.size && !t.iac.some(c => filter.clusters.has(c))) return false;
    if (filter.q) {
      const hay = [t.title, t.note, t.group.name, t.domain.name, ...t.ela.map(c => c + ' ' + (S.ela[c] ? S.ela[c][0] : ''))]
        .join(' ').toLowerCase();
      if (!filter.q.split(/\s+/).every(w => hay.includes(w))) return false;
    }
    return true;
  }

  function resourceItem(code) {
    const r = S.ela[code];
    if (!r) return null;
    const done = !!progress.ela[code];
    const id = `ela-${code}-${Math.random().toString(36).slice(2, 7)}`;
    return el('li', { class: done ? 'done' : null },
      el('input', { type: 'checkbox', id, checked: done, 'data-ela': code, 'aria-label': `Completed: ${r[0]}` }),
      isCode(code) ? el('code', null, code) : null,
      ext(r[1], r[0], 'ext'));
  }

  function topicCard(t) {
    const done = !!progress.topics[t.id];
    const cbId = `t-${t.id}`;
    const tags = el('div', { class: 'topic-tags' },
      t.first ? el('span', { class: 'badge first' }, 'Start here') : null,
      t.iac.map(c => el('span', { class: 'badge', title: S.clusters[c].name }, S.clusters[c].short)));
    const res = el('ul', { class: 'res' },
      t.ela.map(resourceItem),
      (t.links || []).map(([text, key]) => el('li', null, el('span', { style: 'width:13px;flex:none' }), ext(S.links[key], text, 'ext'))));
    return el('article', { class: 'topic' + (done ? ' is-done' : ''), id: `topic-${t.id}` },
      el('div', { class: 'topic-head' },
        el('input', { type: 'checkbox', id: cbId, checked: done, 'data-topic': t.id, title: 'I have covered this' }),
        el('div', null,
          el('label', { for: cbId, class: 'topic-title' }, t.title),
          tags)),
      t.note ? el('p', { class: 'topic-note' }, t.note) : null,
      res.children.length ? res : null,
      el('p', { class: 'topic-foot' }, ext(feedbackUrl(t), 'Suggest a change', 'suggest')));
  }

  function feedbackUrl(t) {
    const body = [
      `Topic: ${t.title} (id: ${t.id})`,
      `Section: ${t.domain.name} > ${t.group.name}`,
      '',
      'What should change, and why? (Please include a source if it is a factual correction.)',
      '',
    ].join('\n');
    return `${S.links.repo}/issues/new?labels=feedback&title=${encodeURIComponent('Feedback: ' + t.title)}&body=${encodeURIComponent(body)}`;
  }

  function renderSyllabus() {
    const out = [];
    let shown = 0;
    S.domains.forEach(d => {
      const domTopics = d.groups.flatMap(g => g.topics);
      const done = domTopics.filter(t => progress.topics[t.id]).length;
      const groups = d.groups.map(g => {
        const list = g.topics.map(t => topicById[t.id]).filter(matches);
        shown += list.length;
        return list.length ? el('div', { class: 'group' }, el('h3', null, g.name), list.map(topicCard)) : null;
      }).filter(Boolean);
      if (groups.length) out.push(el('section', { class: 'domain' },
        el('h2', null, d.name, el('span', { class: 'count' }, `${done}/${domTopics.length} covered`)), groups));
    });
    $('#syllabus-list').replaceChildren(...out);
    $('#syllabus-empty').hidden = shown > 0;
    $$('#syllabus-list .topic-note').forEach(markTerms);
  }

  /* ---------- IAC clusters ---------- */
  function renderIac() {
    $('#iac-clusters').replaceChildren(...Object.entries(S.clusters).map(([k, c]) => {
      const list = topics.filter(t => t.iac.includes(k));
      const done = list.filter(t => progress.topics[t.id]).length;
      return el('div', { class: 'card cluster' },
        el('h3', null, c.name, el('span', { class: 'count' }, `${done}/${list.length}`)),
        el('p', { class: 'caps' }, CLUSTER_CAPS[k]),
        el('div', { class: 'topic-chips' }, list.map(t => topicChip(t.id))));
    }));
  }

  /* ---------- further resources ---------- */
  function renderFurther() {
    $('#further-list').replaceChildren(...S.further.map(g => el('div', { class: 'card' },
      el('h3', null, g.name),
      el('ul', { class: 'linklist further' }, g.items.map(([title, key, desc]) =>
        el('li', null, ext(S.links[key], title, 'ext'), el('span', { class: 'desc' }, desc)))))));
  }

  /* ---------- glossary ---------- */
  const terms = S.glossary.filter(g => g.match).map(g => ({ g, re: new RegExp(g.match, /[a-z]/.test(g.match.replace(/\\b|\\d/g, '')) ? 'i' : '') }));

  // Wrap the first use of each glossary term in a block of text with a tappable term.
  function markTerms(root) {
    if (!root || root.dataset.terms) return;
    root.dataset.terms = '1';
    const used = new Set();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('a, button, code, .term, label, h1, h2, h3') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let changed = false;
      for (;;) {
        let best = null;
        for (const t of terms) {
          if (used.has(t.g.term)) continue;
          const m = t.re.exec(text);
          if (m && (!best || m.index < best.m.index)) best = { t, m };
        }
        if (!best) break;
        used.add(best.t.g.term);
        changed = true;
        frag.append(text.slice(0, best.m.index));
        frag.append(el('button', { type: 'button', class: 'term', 'data-term': best.t.g.term, 'aria-haspopup': 'dialog' }, best.m[0]));
        text = text.slice(best.m.index + best.m[0].length);
      }
      if (changed) { frag.append(text); node.replaceWith(frag); }
    });
  }

  const pop = el('div', { class: 'term-pop', role: 'dialog', hidden: true });
  document.body.append(pop);
  function showTerm(btn) {
    const g = S.glossary.find(x => x.term === btn.dataset.term);
    if (!g) return;
    pop.replaceChildren(el('strong', null, g.term), el('p', null, g.def), el('a', { href: '#glossary' }, 'Full glossary'));
    pop.hidden = false;
    const r = btn.getBoundingClientRect();
    const w = Math.min(340, window.innerWidth - 32);
    pop.style.width = w + 'px';
    pop.style.left = Math.max(16, Math.min(r.left + window.scrollX, window.scrollX + window.innerWidth - w - 16)) + 'px';
    pop.style.top = (r.bottom + window.scrollY + 6) + 'px';
    pop.dataset.for = g.term;
  }
  function hideTerm() { pop.hidden = true; pop.dataset.for = ''; }
  document.addEventListener('click', e => {
    const btn = e.target.closest('.term[data-term]');
    if (btn) { e.preventDefault(); pop.dataset.for === btn.dataset.term && !pop.hidden ? hideTerm() : showTerm(btn); return; }
    if (!e.target.closest('.term-pop')) hideTerm();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTerm(); });

  function renderGlossary(q = '') {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = [...S.glossary].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }))
      .filter(g => words.every(w => (g.term + ' ' + g.def).toLowerCase().includes(w)));
    $('#glossary-list').replaceChildren(...list.flatMap(g => [el('dt', null, g.term), el('dd', null, g.def)]));
  }

  /* ---------- printable checklist ---------- */
  function renderChecklist() {
    $('#print-date').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const tDone = topics.filter(t => progress.topics[t.id]).length;
    const eDone = allEla.filter(c => progress.ela[c]).length;
    $('#checklist-summary').textContent = `Topics covered: ${tDone} of ${topics.length}. e-LfH sessions completed: ${eDone} of ${allEla.length}. ★ = start-here topic.`;
    const box = on => (on ? '☑' : '☐');
    const sessionLabel = c => `${box(progress.ela[c])} ${isCode(c) ? c : S.ela[c][0].replace(/ \(section\)$/, '')}`;
    const row = t => el('tr', null,
      el('td', { class: 'cl-have' }, box(progress.topics[t.id])),
      el('td', null, t.title, t.first ? ' ★' : ''),
      el('td', { class: 'cl-iac' }, t.iac.map(c => S.clusters[c].short).join(', ')),
      el('td', { class: 'cl-ela' }, t.ela.filter(c => S.ela[c]).map(sessionLabel).join('   ')));
    const groupBody = g => el('tbody', null,
      el('tr', { class: 'cl-group' }, el('td', { colspan: '4' }, g.name)),
      g.topics.map(row));
    const head = el('thead', null, el('tr', null,
      el('th', { class: 'cl-have' }, 'I have'), el('th', null, 'Topic'), el('th', null, 'IAC'), el('th', null, 'e-LfH sessions')));
    $('#checklist').replaceChildren(...S.domains.map(d => el('section', { class: 'cl-domain' },
      el('h2', null, d.name),
      el('table', { class: 'cl' }, head.cloneNode(true), d.groups.map(groupBody)))));
  }

  /* ---------- events ---------- */
  function onChange(e) {
    const t = e.target;
    if (t.matches('[data-topic]')) {
      if (t.checked) progress.topics[t.dataset.topic] = true; else delete progress.topics[t.dataset.topic];
      save(); renderSummary();
      const card = t.closest('.topic');
      card.classList.toggle('is-done', t.checked);
      const h = card.closest('.domain');
      if (h) {
        const d = S.domains.find(x => x.name === h.querySelector('h2').firstChild.textContent);
        const all = d.groups.flatMap(g => g.topics);
        h.querySelector('.count').textContent = `${all.filter(x => progress.topics[x.id]).length}/${all.length} covered`;
      }
      if (filter.hideDone && t.checked) setTimeout(renderSyllabus, 400);
    } else if (t.matches('[data-ela]')) {
      const code = t.dataset.ela;
      if (t.checked) progress.ela[code] = true; else delete progress.ela[code];
      save(); renderSummary();
      // The same session can appear under several topics; keep them in step.
      $$(`[data-ela="${code}"]`).forEach(cb => { cb.checked = t.checked; cb.closest('li').classList.toggle('done', t.checked); });
    }
  }

  function wireFilters() {
    let timer;
    $('#q').addEventListener('input', e => {
      clearTimeout(timer);
      timer = setTimeout(() => { filter.q = e.target.value.trim().toLowerCase(); renderSyllabus(); }, 120);
    });
    $('#only-first').addEventListener('change', e => { filter.onlyFirst = e.target.checked; renderSyllabus(); });
    $('#hide-done').addEventListener('change', e => { filter.hideDone = e.target.checked; renderSyllabus(); });
  }

  /* ---------- routes ---------- */
  const T = { tab: 'novice' };
  App.on('novice', () => { location.replace('#start'); return { view: 'start', ...T }; });
  App.on('start', () => { $$('#view-start .card li, #view-start .card p').forEach(markTerms); renderSummary(); return { view: 'start', ...T, title: 'Novice: start here' }; });
  App.on('journey', () => { renderJourney(); return { view: 'journey', ...T, title: 'A GA step by step' }; });
  App.on('iac', () => { renderIac(); $$('#view-iac .card p, #view-iac .card li, #view-iac > p').forEach(markTerms); return { view: 'iac', ...T, title: 'The IAC' }; });
  App.on('glossary', () => { renderGlossary($('#gq').value); return { view: 'glossary', ...T, title: 'Glossary' }; });
  App.on('checklist', () => { renderChecklist(); return { view: 'checklist', ...T, title: 'Novice checklist' }; });
  App.on('syllabus', args => {
    const arg = args[0];
    hideTerm();
    if (arg && topicById[arg]) {
      filter.q = ''; filter.clusters.clear(); filter.onlyFirst = false; filter.hideDone = false;
      $('#q').value = ''; $('#only-first').checked = false; $('#hide-done').checked = false;
      renderClusterChips();
      renderSyllabus();
      return {
        view: 'syllabus', ...T, current: '#syllabus', title: topicById[arg].title,
        after: () => {
          const card = document.getElementById(`topic-${arg}`);
          if (card) { card.scrollIntoView({ block: 'start' }); card.classList.add('flash'); setTimeout(() => card.classList.remove('flash'), 1800); }
        },
      };
    }
    renderSyllabus();
    return { view: 'syllabus', ...T, current: '#syllabus', title: 'Novice syllabus' };
  });

  App.inits.push(() => {
    load();
    // progress panel on the novice start page
    const hero = $('#view-start .hero');
    if (hero && !$('#novice-progress')) hero.after(App.el('div', { class: 'card progress-card' }, App.el('h2', null, 'Your novice progress'), App.el('div', { id: 'novice-progress', class: 'meters' })));
    renderClusterChips();
    wireFilters();
    renderFurther();
    $('#gq').addEventListener('input', e => renderGlossary(e.target.value));
    $('#print-btn').addEventListener('click', () => window.print());
    document.addEventListener('change', onChange);
  });
  // expose for the resources page and home dashboard
  App.novice = { topics, allEla, get progress() { return progress; }, markTerms, renderFurther };
})();
