/* Earned state driver.
   Every state in the inventory is a function that puts a screen into that look, starting from the prototype's default render.
   ?state=T-09 applies one on load. window.earnedStates lists them for the state sheet. Nothing here is an engine: every number is an example. */
(function () {
  'use strict';
  var E = window.earned, $ = E.$;
  var registry = {}, order = [];

  function register(id, def) { if (!registry[id]) order.push(id); registry[id] = def; }
  function list() { return order.map(function (id) { var d = registry[id]; return { id: id, screen: d.screen, title: d.title, status: d.status || 'LIVE', rules: d.rules || '', component: d.component || '' }; }); }

  /* ---------- helpers every state file uses ---------- */
  function text(sel, t) { var el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (el) el.textContent = t; return el; }
  function hide(sel) { var el = document.querySelector(sel); if (el) el.hidden = true; return el; }
  function show(sel) { var el = document.querySelector(sel); if (el) el.hidden = false; return el; }
  function attr(sel, k, v) { var el = document.querySelector(sel); if (el) { if (v === null) el.removeAttribute(k); else el.setAttribute(k, v); } return el; }
  function disable(sel, on) { var el = document.querySelector(sel); if (el) el.disabled = on !== false; return el; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  /* the screen's own status line: the storage sentence sits under it, never above the day's instruction */
  var STATUS_ANCHOR = { today: '#status-line', workout: '.screen-title', coach: '.coach-line' };
  function statusPill(screen, txt, kind) {
    /* a quiet line under the screen's status line: device store, blocked record, stored readings. One per screen, replaced on each call */
    var ui = document.querySelector('#screen-' + screen + ' .ui'); var old = ui.querySelector('.status-pill'); if (old) old.remove();
    if (!txt) return null;
    var p = el('div', 'status-pill' + (kind ? ' ' + kind : ''), txt);
    /* inside a panel the line belongs to the panel: under its title or lead, never above it */
    var pan = ui.querySelector('.panel');
    var anchor = pan ? (pan.querySelector('.panel-lead') || pan.querySelector('.panel-title')) : (ui.querySelector(STATUS_ANCHOR[screen] || '') || ui.querySelector('.hairline'));
    if (pan && !anchor) { (pan.querySelector('.panel-body') || pan).insertAdjacentElement('afterbegin', p); } else anchor.insertAdjacentElement('afterend', p);
    if (pan && pan.earnedPanelEnd) requestAnimationFrame(pan.earnedPanelEnd);
    return p;
  }
  function noteBlock(afterSel, txt, cls) {
    var a = document.querySelector(afterSel); if (!a) return null; var n = el('div', 'note-block' + (cls ? ' ' + cls : ''), txt); a.insertAdjacentElement('afterend', n); return n;
  }

  /* the chevron the workout header carries; a panel borrows it when its screen has none of its own */
  var BACK_SVG = '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 1L2 10l8 9"/></svg>';

  function closePanel(screen) {
    var sec = $('screen-' + screen); if (!sec || !sec.earnedClosePanel) return false;
    var fn = sec.earnedClosePanel; sec.earnedClosePanel = null; fn(); return true;
  }

  /* ---------- a generic panel: sub screens (Why this plan, the nutrition entry, the sleep entry, the machine settings editor, the coach opt-in) ----------
     spec: { screen, title, lead, blocks: [ {h}, {p}, {note}, {refusal}, {field}, {choice}, {actions}, {recorded}, {answer}, {rows} ], back: 'today' } */
  function panel(spec) {
    var sec = $('screen-' + spec.screen), ui = sec.querySelector('.ui');
    closePanel(spec.screen);
    /* Today keeps its day in a scrolling .body above a fixed .stack; a panel lives in the body and the stack steps aside */
    var host = ui.querySelector(':scope > .body') || ui, stack = ui.querySelector(':scope > .stack');
    var stowed = [];
    Array.prototype.forEach.call(host.children, function (c) { if (c.classList.contains('header') || c.classList.contains('hairline') || c.classList.contains('chrome') || c.hidden) return; c.hidden = true; stowed.push(c); });
    if (stack && !stack.hidden) { stack.hidden = true; stowed.push(stack); }
    var old = ui.querySelector('.panel'); if (old) old.remove();
    /* a panel is a chassis too: a scrolling body (title, lead, blocks) and, when the spec ends with an action group, that group fixed at the thumb */
    var p = el('section', 'panel'); p.setAttribute('aria-label', spec.title || '');
    var pb = el('div', 'panel-body scrolls'); p.appendChild(pb);
    if (spec.title) pb.appendChild(el('h1', 'panel-title', spec.title));
    if (spec.lead) pb.appendChild(el('p', 'panel-lead', spec.lead));
    var specs = spec.blocks || [], nodes = specs.map(function (b) { var n = block(b); pb.appendChild(n); return n; });
    host.appendChild(p);
    /* a refusal that names a field belongs under that field, and the field carries the mark */
    specs.forEach(function (b, i) {
      if (!b.refusal || !b.field) return;
      var names = [].concat(b.field), target = null;
      Array.prototype.forEach.call(p.querySelectorAll('.pfield'), function (f) {
        var l = f.querySelector('.pfield-label'); if (l && names.indexOf(l.textContent) >= 0) { f.classList.add('is-invalid'); target = f; }
      });
      if (target) target.insertAdjacentElement('afterend', nodes[i]);
    });
    /* the action group that ends the spec sits where the parent screen's own primary sits, outside the scrolling body */
    var lastNode = nodes[nodes.length - 1];
    if (lastNode && lastNode.classList.contains('pactions') && lastNode.parentNode === pb) { lastNode.classList.add('is-last'); p.appendChild(lastNode); }
    /* a flat surface stays behind the whole text column while a panel is open: the body's own backing ends where its content ends and scrolls with it */
    sec.classList.add('has-panel');
    function panelEnd() {
      var kids = Array.prototype.filter.call(pb.children, function (c) { return !c.hidden; });
      var last = kids[kids.length - 1]; if (!last) return;
      var lr = last.getBoundingClientRect(); pb.style.setProperty('--panel-end', Math.max(0, Math.round(lr.bottom - pb.getBoundingClientRect().top + pb.scrollTop)) + 'px');
    }
    panelEnd(); requestAnimationFrame(panelEnd); document.fonts && document.fonts.ready.then(panelEnd); window.addEventListener('resize', panelEnd);
    p.earnedPanelEnd = panelEnd; E.scrollFades && E.scrollFades(pb);
    var hdr = ui.querySelector('.header'), inserted = null;
    if (spec.back !== false) {
      hdr.classList.add('has-back');
      var brand = hdr.querySelector('.brand');
      if (brand && !brand.querySelector('.back')) {
        inserted = el('button', 'back'); inserted.type = 'button'; inserted.setAttribute('aria-label', 'Back to Today'); inserted.innerHTML = BACK_SVG;
        brand.insertBefore(inserted, brand.firstChild);
        inserted.addEventListener('click', function () { closePanel(spec.screen); });
      }
    }
    sec.earnedClosePanel = function () {
      var cur = ui.querySelector('.panel'); if (cur) cur.remove();
      stowed.forEach(function (c) { c.hidden = false; });
      hdr.classList.remove('has-back');
      if (inserted && inserted.parentNode) inserted.parentNode.removeChild(inserted);
      sec.classList.remove('has-panel');
      E.railEnd && E.railEnd();
    };
    E.railEnd && E.railEnd();
    return p;
  }
  function block(b) {
    if (b.h) return el('div', 'eyebrow panel-h', b.h);
    if (b.p) return el('p', 'panel-p' + (b.muted ? ' muted' : ''), b.p);
    if (b.note) return el('div', 'note-block', b.note);
    if (b.refusal) { var r = el('div', 'refusal'); r.appendChild(el('span', 'refusal-text', b.refusal)); if (b.tail !== false) r.appendChild(el('span', 'refusal-tail', b.tail || 'Nothing was recorded.')); return r; }
    if (b.field) {
      var f = el('label', 'pfield' + (b.disabled ? ' is-disabled' : '')); f.appendChild(el('span', 'pfield-label', b.field));
      var row = el('span', 'pfield-row'); var inp = el('input'); inp.type = 'text'; inp.setAttribute('inputmode', b.inputmode || 'text'); inp.placeholder = b.placeholder || ''; if (b.value != null) inp.value = b.value; if (b.disabled) inp.disabled = true; row.appendChild(inp);
      if (b.unit) row.appendChild(el('span', 'pfield-unit', b.unit)); if (b.step) { var m = el('button', 'pstep', '−'); m.type = 'button'; m.setAttribute('aria-label', 'Less'); var pl = el('button', 'pstep', '+'); pl.type = 'button'; pl.setAttribute('aria-label', 'More'); if (b.stepDisabled) { m.disabled = true; pl.disabled = true; } row.appendChild(m); row.appendChild(pl); }
      f.appendChild(row); if (b.hint) f.appendChild(el('span', 'pfield-hint', b.hint)); return f;
    }
    if (b.choice) { var c = el('div', 'pchoice'); c.setAttribute('role', 'group'); c.setAttribute('aria-label', b.label || ''); b.choice.forEach(function (o, i) { var x = el('button', 'chip', o); x.type = 'button'; x.setAttribute('aria-pressed', String(i === (b.selected == null ? -1 : b.selected))); c.appendChild(x); }); return c; }
    if (b.actions) { var a = el('div', 'pactions'); b.actions.forEach(function (o) { var x = el('button', o.kind === 'primary' ? 'primary panel-primary' : (o.kind === 'link' ? 'link' : 'decision'), null); x.type = 'button'; if (o.kind === 'primary') { x.appendChild(el('span', null, o.label)); } else x.textContent = o.label; if (o.disabled) x.disabled = true; a.appendChild(x); }); return a; }
    if (b.recorded) { var rc = el('div', 'recorded-block'); rc.appendChild(el('div', 'recorded-main', b.recorded)); if (b.stamp) rc.appendChild(el('div', 'recorded-stamp', b.stamp)); if (b.source) rc.appendChild(el('div', 'recorded-source', b.source)); return rc; }
    if (b.answer) { var an = el('div', 'coach-answer is-panel'); an.appendChild(el('div', null, b.answer)); if (b.from) an.appendChild(el('div', 'from', b.from)); return an; }
    if (b.rows) { var t = el('div', 'kv-rows'); b.rows.forEach(function (kv) { var rr = el('div', 'kv-row'); rr.appendChild(el('span', 'kv-k', kv[0])); rr.appendChild(el('span', 'kv-v', kv[1])); t.appendChild(rr); }); return t; }
    if (b.marker) { var mk = el('div', 'marker-line'); mk.appendChild(el('span', 'marker-k', b.marker)); mk.appendChild(el('span', 'marker-v', b.value || '')); return mk; }
    return el('div', null, '');
  }

  /* ---------- apply ---------- */
  function apply(id) {
    var d = registry[id]; if (!d) return false;
    ['today', 'workout', 'coach'].forEach(closePanel);
    E.show(d.screen);
    var api = { text: text, hide: hide, show: show, attr: attr, disable: disable, el: el, statusPill: statusPill, noteBlock: noteBlock, panel: panel, block: block, closePanel: closePanel, $: $, E: E };
    d.apply(api);
    document.documentElement.setAttribute('data-state', id);
    E.railEnd && E.railEnd();
    return true;
  }

  window.earnedStates = { register: register, list: list, apply: apply, get: function (id) { return registry[id]; } };
  window.addEventListener('load', function () {
    var id = new URLSearchParams(location.search).get('state');
    if (id) setTimeout(function () { apply(id); }, 30);
  });
})();
