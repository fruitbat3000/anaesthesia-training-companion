// A deliberately small Markdown converter for the site's own content.
// Supports: #–#### headings, paragraphs, **bold**, *italic*, `code`, [links](url),
// - / 1. lists (two levels, by indentation), > blockquotes, > [!note|tip|warn|exam] callouts,
// | tables |, --- rules, ::: cols / ::: glance / ::: card / ::: box blocks, and $$ plain formula lines.
// Anything else is treated as text and escaped. Output is trusted HTML (we author the input).

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inline(s) {
  // protect code spans first
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    const external = /^https?:/.test(url);
    return `<a href="${url.replace(/"/g, '%22')}"${external ? ' target="_blank" rel="noopener" class="ext"' : ''}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\^([^^\s]+)\^/g, '<sup>$1</sup>');
  s = s.replace(/~([^~\s]+)~/g, '<sub>$1</sub>');
  s = s.replace(/ -- /g, ' – ');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

function slug(s) { return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;

  const isBlank = l => !l.trim();
  const listRe = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

  function parseList(start) {
    // returns [html, nextIndex]
    const baseIndent = lines[start].match(/^\s*/)[0].length;
    const ordered = /^\s*\d+\./.test(lines[start]);
    const items = [];
    let j = start;
    while (j < lines.length) {
      const m = lines[j].match(listRe);
      if (!m || m[1].length < baseIndent) break;
      if (m[1].length > baseIndent) {
        // nested list belongs to previous item
        const [html, next] = parseList(j);
        items[items.length - 1].children += html;
        j = next;
        continue;
      }
      let text = m[3];
      j++;
      // continuation lines (indented, not a list marker)
      while (j < lines.length && !isBlank(lines[j]) && !listRe.test(lines[j]) && /^\s+/.test(lines[j])) {
        text += ' ' + lines[j].trim();
        j++;
      }
      items.push({ text, children: '' });
      // allow a single blank line between items of the same list
      if (j < lines.length && isBlank(lines[j]) && j + 1 < lines.length) {
        const n = lines[j + 1].match(listRe);
        if (n && n[1].length >= baseIndent) j++;
      }
    }
    const tag = ordered ? 'ol' : 'ul';
    return [`<${tag}>${items.map(it => `<li>${inline(it.text)}${it.children}</li>`).join('')}</${tag}>`, j];
  }

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) { i++; continue; }

    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      const level = m[1].length;
      out.push(`<h${level} id="${slug(m[2])}">${inline(m[2])}</h${level}>`);
      i++; continue;
    }
    if (/^---+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if ((m = line.match(/^:::\s*(\w+)(?:\s+(.*))?$/))) {
      // container block until a line of ':::'
      const kind = m[1];
      const title = m[2] || '';
      const body = [];
      i++;
      let depth = 1;
      while (i < lines.length) {
        if (/^:::\s*\w+/.test(lines[i])) depth++;
        else if (/^:::\s*$/.test(lines[i])) { depth--; if (!depth) break; }
        body.push(lines[i]);
        i++;
      }
      i++;
      const inner = markdown(body.join('\n'));
      if (kind === 'cols') out.push(`<div class="md-cols">${inner}</div>`);
      else if (kind === 'glance') out.push(`<div class="md-cols glance">${inner}</div>`);
      else if (kind === 'card') out.push(`<div class="md-card">${title ? `<h3>${inline(title)}</h3>` : ''}${inner}</div>`);
      else if (kind === 'steps') out.push(`<div class="md-steps">${inner}</div>`);
      else out.push(`<div class="md-box md-${kind}">${title ? `<p class="md-box-title">${inline(title)}</p>` : ''}${inner}</div>`);
      continue;
    }

    if (/^\$\$/.test(line)) {
      out.push(`<p class="formula">${inline(line.replace(/^\$\$\s*/, ''))}</p>`);
      i++; continue;
    }

    if (/^>/.test(line)) {
      const body = [];
      while (i < lines.length && /^>/.test(lines[i])) { body.push(lines[i].replace(/^>\s?/, '')); i++; }
      const cm = body[0].match(/^\[!(\w+)\]\s*(.*)$/);
      if (cm) {
        const kind = cm[1].toLowerCase();
        const title = cm[2];
        out.push(`<div class="callout-box ${kind}">${title ? `<p class="callout-title">${inline(title)}</p>` : ''}${markdown(body.slice(1).join('\n'))}</div>`);
      } else {
        out.push(`<blockquote>${markdown(body.join('\n'))}</blockquote>`);
      }
      continue;
    }

    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = r => r.replace(/^\||\|\s*$/g, '').split('|').map(c => c.trim());
      const head = cells(rows[0]);
      const hasSep = rows[1] && /^\|[\s:|-]+\|?\s*$/.test(rows[1]);
      const body = rows.slice(hasSep ? 2 : 1).map(cells);
      out.push(`<div class="table-wrap"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${
        body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    if (listRe.test(line)) {
      const [html, next] = parseList(i);
      out.push(html);
      i = next;
      continue;
    }

    // paragraph
    const para = [];
    while (i < lines.length && !isBlank(lines[i]) && !/^(#{1,4}\s|>|\||:::|\$\$|---+\s*$)/.test(lines[i]) && !listRe.test(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(' ');
    const parts = text.split(' · ');
    if (parts.length >= 3 && parts.every(t => t.length <= 70 && !/[.:;]\s/.test(t))) {
      // "A · B · C" lists render as tag chips
      out.push(`<ul class="md-tags">${parts.map(t => `<li>${inline(t.trim())}</li>`).join('')}</ul>`);
    } else {
      out.push(`<p>${inline(text)}</p>`);
    }
  }
  return out.join('\n');
}

// Front matter: a block between '---' lines of `key: value` pairs.
export function frontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, src];
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return [data, src.slice(m[0].length)];
}

export const list = v => (v ? v.split(/\s*,\s*/).filter(Boolean) : []);
export const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
