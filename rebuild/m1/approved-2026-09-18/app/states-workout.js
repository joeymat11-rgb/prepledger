/* Inside the workout (inventory W-01 to W-45).
   Every state starts from the prototype's default render of the workout screen and moves the pieces the inventory names.
   Copy is the inventory's own where the inventory has it; engine em dashes are turned into colons or full stops at this boundary, and no dash reaches the screen.
   Numbers are examples (50 lb, 8 reps, seat 4), never an athlete's. */
(function () {
  'use strict';
  var S = window.earnedStates, R = S.register;
  var W = 'workout';

  /* The layer's own codes, shown once each where the inventory says the code is shown. Examples, not a contract. */
  var CODE = {
    prepare: 'WORKOUT_PREPARATION_UNAVAILABLE',
    order: 'SESSION_ORDER_REFUSED',
    log: 'SET_NOT_ACKNOWLEDGED',
    undo: 'SET_REMOVAL_NOT_ACKNOWLEDGED',
    finish: 'FINISH_NOT_ACKNOWLEDGED'
  };
  var CHEV = '<svg viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var STUB = 'Today’s workout cannot open';   /* the fallback heading the stub screens use rather than a blank (W-44) */

  function q(sel) { return document.querySelector('#screen-workout ' + sel); }

  /* ---- the active set: the default render, with the set object set where the state needs it ---- */
  function active(a, o) {
    o = o || {};
    var s = a.E.set;
    s.n = o.n || 1; s.of = 4;
    s.lb = o.lb == null ? 50 : o.lb; s.reps = o.reps == null ? 8 : o.reps;
    s.logged = !!o.logged; s.rir = o.rir == null ? null : o.rir;
    a.E.renderSet();
    a.text('#last-time span', o.last || 'Last time: 50 lb × 8 reps');   /* the × rule: never the letter x, never "for" */
    return s;
  }

  /* ---- one reason line under the lift name: the engine's sentence, never a headline.
     A reason belongs to the states whose inventory row gives one (W-07 to W-13); the normal active set (W-06) has none,
     so every active-set state draws the same board and only the engine's own sentence is ever added to it. ---- */
  function reason(a, lines, o) {
    o = o || {};
    var box = a.el('div', 'w-reasons'), row = a.el('div', 'w-reason-row'), why = null, more = [];
    row.appendChild(a.el('span', 'w-reason', lines[0]));
    if (o.why) { why = a.el('button', 'link w-why', 'Why'); why.type = 'button'; row.appendChild(why); }
    box.appendChild(row);
    lines.slice(1).forEach(function (t) { var p = a.el('p', 'w-reason w-more', t); if (o.why) p.hidden = true; more.push(p); box.appendChild(p); });
    q('.screen-title').insertAdjacentElement('afterend', box);
    if (why) why.addEventListener('click', function () { more.forEach(function (p) { p.hidden = !p.hidden; }); });
    return box;
  }

  /* ---- the prescription as a line, for the two states that have no figure to set in numerals ---- */
  function prescLine(a, left, right) {
    var n = a.$('numerals'); n.innerHTML = '';
    var d = a.el('div', 'w-presc');
    d.appendChild(a.el('span', null, left));
    d.appendChild(a.el('span', 'w-presc-x', '×'));
    d.appendChild(a.el('span', null, right));
    n.appendChild(d);
    a.text('#log-label', 'Log set ' + a.E.set.n);
    return d;
  }

  function hint(a, txt) { var h = a.el('div', 'w-hint', txt); a.$('numerals').insertAdjacentElement('afterend', h); return h; }

  /* ---- a refusal that names the layer sits in the stack, right above the Log row it refused.
     Nothing on the board is taken away to make room: the body scrolls (the chassis in app.css) and the stack grows upward. ---- */
  function refusalNear(a, txt, tail) {
    var d = a.el('div', 'refusal note-block w-refusal');
    d.appendChild(a.el('span', 'refusal-text', txt));
    if (tail) d.appendChild(a.el('span', 'refusal-tail', tail));
    var lr = q('.log-row'); lr.parentNode.insertBefore(d, lr);
    return d;
  }
  /* the refused Log the app itself inserts (app.js rirRefusal): the same element, to the class and the letter,
     so the drawn state and the live one are one block and the live path replaces it rather than stacking a second.
     It names the effort answer, so the chip group carries the mark: refusal and flagged field are one component. */
  function rirRefusal(a) {
    var d = a.el('div', 'refusal note-block w-refusal rir-refusal');
    d.textContent = 'Choose clean reps left, or Unsure.';
    var lr = q('.log-row'); lr.parentNode.insertBefore(d, lr);
    a.$('rir').classList.add('is-invalid');
    return d;
  }
  /* the live Log refuses through app.js, which inserts the same block; the chip group follows it either way */
  (function () {
    var stack = document.querySelector('#screen-workout .stack'), rir = document.getElementById('rir');
    if (!stack || !rir) return;
    new MutationObserver(function () {
      rir.classList.toggle('is-invalid', !!stack.querySelector('.rir-refusal'));
    }).observe(stack, { childList: true, subtree: true });
  })();

  /* ---- a refusal that names the entry sits under the numerals it names, inside the set card ---- */
  function refusalInCard(a, txt) {
    var d = a.el('div', 'refusal note-block w-refusal w-card-refusal', txt);
    a.$('numerals').insertAdjacentElement('afterend', d);
    return d;
  }

  /* ---- the machine row, in its four reading states ---- */
  function machine(a, title, sub, off) {
    a.text('#machine .setting', title); a.text('#machine .when', sub);
    if (off) a.disable('#machine');
  }
  /* ---- the Recovery row, the same component Today draws (#recovery): same classes, same moon, same words ---- */
  function recoveryRow(a) {
    var b = a.el('button', 'rowcard'); b.type = 'button';
    var ic = a.el('span', 'icon-square'); ic.setAttribute('aria-hidden', 'true'); ic.innerHTML = MOON;
    var tx = a.el('span', 'text');
    tx.appendChild(a.el('div', 'title', 'Recovery check in'));
    tx.appendChild(a.el('div', 'sub', 'How are you feeling?'));   /* not "optional": a set screen never grades what it offers */
    var ch = a.el('span', 'chev'); ch.setAttribute('aria-hidden', 'true'); ch.innerHTML = CHEV;
    b.appendChild(ic); b.appendChild(tx); b.appendChild(ch);
    return b;
  }

  /* ---- the rest screen after a log: the same set card, repainted. The Log button does not move: it keeps its place in the
     stack on its own, because the chips that go are above it and everything below it (the link row, the stack's own lift) stays. ---- */
  function rest(a, o) {
    active(a, { n: o.n, logged: true, rir: o.rir });
    a.text('#screen-workout .screen-title', o.title);
    q('.ui').classList.add('w-rest');
    a.hide('#machine');
    q('.rir-head').hidden = true; a.hide('#rir');   /* there is no effort to answer while resting */

    var cur = a.$('setcard');
    function after(n) { cur.insertAdjacentElement('afterend', n); cur = n; return n; }

    if (o.facts) {
      a.text('#setcard .eyebrow', 'What you did · Set ' + o.n);
      var lt = a.$('last-time'), f = a.el('div', 'w-facts', o.facts);
      lt.parentNode.replaceChild(f, lt);
    } else { cur.hidden = true; }

    if (o.restRefusal) {
      var r = a.el('div', 'refusal note-block w-refusal');
      r.appendChild(a.el('span', 'refusal-text', o.restRefusal));
      after(r);
    } else {
      after(a.el('p', 'w-rest-line', 'Your plan does not set a rest length.'));
    }
    if (o.extra) o.extra(a, after);
    if (o.next) {
      var nx = a.el('div', 'w-next');
      nx.appendChild(a.el('div', 'eyebrow', o.next.head));
      nx.appendChild(a.el('div', 'w-next-presc', o.next.presc));
      if (o.next.aim) nx.appendChild(a.el('div', 'w-next-aim', o.next.aim));
      after(nx);
    }
    a.text('#log-label', o.primary);
    if (o.undo === false) a.hide('#edit'); else a.text('#edit', 'Undo');
  }

  /* ---- panels that carry a decision: the spec's last block is the action group, and panel() lifts it out of the
     scrolling body onto the thumb edge (.panel > .pactions.is-last in states.css, Workout 716). Nothing on this screen
     pins it a second way, and nothing is ever added after it. ---- */

  /* ---- the machine settings editor (a panel). o.settings draws the form the refusal is talking about, so a state that
     refuses a malformed entry shows the malformed entry: the text and the form always agree. ---- */
  function editor(a, blocks, o) {
    o = o || {};
    var settings = o.settings || [{ name: 'Seat', value: '4' }], b = [];
    settings.forEach(function (s) {
      b.push({ field: 'Setting', value: s.name, placeholder: 'Seat' });
      b.push({ field: 'Value', value: s.value, placeholder: '4' });
    });
    b.push({ actions: [{ label: 'Add another setting', kind: 'link' }, { label: 'Remove this setting', kind: 'link' }] });
    b.push({ field: 'Anything to remember', placeholder: 'A cue you want back next time', value: o.remember || '' });
    b = b.concat(blocks || [], [{ actions: [{ label: 'Save these settings', kind: 'primary' }, { label: 'Close without saving', kind: 'link' }] }]);
    var p = a.panel({ screen: W, title: 'Save the settings for this machine', blocks: b });
    p.querySelector('.pactions').classList.add('w-pair');   /* add and remove are a pair, not two statements: they stay in the flow */
    return p;
  }

  /* ============================ the stub screens ============================ */
  /* Nothing on these screens can be retried in the app, so the only action is the way out the header already holds.
     It is a tertiary link, not a primary: a refusal does not dress its exit as the thing to do. It is the panel's
     last (and only) action group, so it sits on the shared edge the Log button keeps. */
  var OUT = { actions: [{ label: 'Back to Today', kind: 'link' }] };
  R('W-01', { screen: W, title: 'No workout store on this device', rules: 'none', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: STUB, blocks: [
      { refusal: 'Your workout could not be opened on this device, and nothing was recorded.', tail: false }, OUT
    ] });
    a.statusPill(W, 'This browser did not give the page an encrypted local store to keep a workout in.', 'warn');
  } });
  R('W-02', { screen: W, title: 'The layer refused to prepare', rules: 'T13 T16', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: STUB, blocks: [
      { refusal: 'Earned could not prepare today’s workout, and nothing was recorded.', tail: 'The layer’s own reason: ' + CODE.prepare + '.' }, OUT
    ] });
  } });
  R('W-03', { screen: W, title: 'Start refused while his record is being adopted', rules: 'none', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: STUB, blocks: [
      { refusal: 'Start is not available until this device can read your setup. Reload to try again.', tail: false }, OUT
    ] });
  } });
  R('W-04', { screen: W, title: 'Start refused by the order guard', rules: 'T09', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: STUB, blocks: [
      { refusal: 'Start was refused by the order guard.', tail: 'The host’s own reason: ' + CODE.order + '. Nothing is stored.' }, OUT
    ] });
  } });
  R('W-05', { screen: W, title: 'Prepared, starting', rules: 'T01 T02 T08', component: 'none', apply: function (a) {
    /* transient: the card starts the session itself and repaints into the active set, so the active set is all there is to draw */
    active(a, { n: 1 });
  } });

  /* ============================ the active set ============================ */
  /* the reference board: nothing is added and nothing is taken away. Every other active-set state is this one plus the
     one thing its inventory row names, so the Log button, the chips and the coach pill never move between them. */
  R('W-06', { screen: W, title: 'Active set, normal', rules: 'T01 T02 T03 T08 T14 T17 V02 V03', component: 'set card, RIR chips, Log, machine row', apply: function (a) {
    active(a, { n: 1 });
  } });
  R('W-07', { screen: W, title: 'Active set, first session at a new load', rules: 'T06', component: 'set card', apply: function (a) {
    active(a, { n: 1, last: ' ' });
    a.hide('#last-time'); a.hide('#setcard .divider');
    reason(a, ['Debut: find the working weight. Pick a load you can control for about 8 reps, enter the load and log what it gives.']);
  } });
  R('W-08', { screen: W, title: 'Active set, no load prescribed', rules: 'T06', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    prescLine(a, 'Find a working load', '8 reps');
    reason(a, ['No load is prescribed for this set.']);
  } });
  R('W-09', { screen: W, title: 'Active set, no rep target prescribed', rules: 'T06', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    prescLine(a, '50 lb', 'Record the reps performed');
    reason(a, ['No rep target is prescribed for this set.']);
  } });
  R('W-10', { screen: W, title: 'Active set, held lift', rules: 'T07', status: 'DORMANT', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    reason(a, ['Held: the opener ran 0 clean reps left twice.']);
  } });
  R('W-11', { screen: W, title: 'Active set, governor hold in the effort plan', rules: 'T07 T08', status: 'DORMANT', component: 'set card, RIR chips', apply: function (a) {
    active(a, { n: 1 });
    reason(a, ['Governor hold: the opener stays two clean reps back. Aim to finish with 2 clean reps left.']);
  } });
  R('W-12', { screen: W, title: 'Active set, alarm day RIR floors', rules: 'T12 R04', status: 'DORMANT', component: 'set card, RIR chips', apply: function (a) {
    active(a, { n: 4 });
    reason(a, ['Alarm day: every 0 becomes a 1. Aim to finish with 1 clean rep left.']);
  } });
  R('W-13', { screen: W, title: 'Active set, more than one reason line', rules: 'T03 T04', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    reason(a, [
      'Exercise 1 of 4 · Aim to finish with 2 clean reps left.',
      'The load is held at 50 lb until the reps come back clean.',
      'Last session came up short twice on this lift.'
    ], { why: true });
  } });
  R('W-14', { screen: W, title: 'Active set, a machine setup note from the engine', rules: 'the capture’s setup cell only; T15 is app frozen and not on the phone', component: 'machine row', apply: function (a) {
    active(a, { n: 1 });
    var link = a.el('button', 'link w-setup', 'Setup'); link.type = 'button';
    var note = a.el('div', 'note-block w-setup-note', 'Setup: seat pin in the fourth hole, back pad two from the top.');
    a.$('machine').insertAdjacentElement('afterend', note);
    note.insertAdjacentElement('beforebegin', link);
    link.addEventListener('click', function () { note.hidden = !note.hidden; });
  } });
  R('W-15', { screen: W, title: 'Active set, clean rep help open', rules: 'T08', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    var n = a.el('div', 'note-block w-help', 'A clean rep is one you finish under control, with the same form as the first. If you cannot tell how many were left in you, choose Unsure.');
    a.$('rir').insertAdjacentElement('afterend', n);
  } });
  R('W-16', { screen: W, title: 'Active set, last time known', rules: 'T03', component: 'set card', apply: function (a) {
    active(a, { n: 1, last: 'Last time: 50 lb × 8 reps' });
  } });
  R('W-17', { screen: W, title: 'Active set, no qualified comparison', rules: 'T03', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    a.hide('#last-time'); a.hide('#setcard .divider');   /* no guess, and no empty row where the guess would be */
  } });
  R('W-18', { screen: W, title: 'Active set, no load step on file', rules: 'T06', component: 'set card', apply: function (a) {
    active(a, { n: 1 });
    var n = a.$('numerals'), load = n.querySelector('.num');
    ['−', '+'].forEach(function (g, i) {
      var b = a.el('button', 'pstep w-step', g); b.type = 'button'; b.disabled = true;
      b.setAttribute('aria-label', i ? 'More' : 'Less');
      if (i) load.insertAdjacentElement('afterend', b); else n.insertBefore(b, load);   /* the step belongs to the load, not to the whole set */
    });
    hint(a, 'No load step is on file for this machine. Type the load you used.');
  } });

  /* ============================ refused logs: the entry stays, the screen stays ============================ */
  R('W-19', { screen: W, title: 'Set unlogged, refused for a missing entry', rules: 'T08', component: 'set card', apply: function (a) {
    /* the refusal names the entry, so it sits under the numerals it names and the empty box carries the mark */
    active(a, { n: 1 });
    a.text('#r-value', ''); a.$('r-value').className = 'value w-blank is-invalid';
    a.text('#log-label', 'Log set 1');
    refusalInCard(a, 'Enter the weight and reps you actually completed.');
  } });
  R('W-20', { screen: W, title: 'Set unlogged, refused for a missing effort answer', rules: 'T08', component: 'RIR chips', apply: function (a) {
    active(a, { n: 1, rir: null });
    rirRefusal(a);   /* the block app.js itself inserts when Log is refused: one element, not a drawn copy of it */
  } });
  R('W-21', { screen: W, title: 'Set unlogged, refused by the layer', rules: 'T13 T16', component: 'set card', apply: function (a) {
    active(a, { n: 1, rir: '2' });
    refusalNear(a, 'This set could not be recorded on this device, and no part of it was recorded.', 'The layer’s own reason: ' + CODE.log + '.');
  } });

  /* ============================ logged: the rest screen ============================ */
  R('W-22', { screen: W, title: 'Set logged, with a next set', rules: 'T01 T02 T08 T09', component: 'set card, Log button', apply: function (a) {
    rest(a, { n: 1, rir: '2', title: 'Set 1 logged', facts: '50 lb × 8 reps · 2 clean reps left',
      next: { head: 'Next · Set 2 of 4', presc: '50 lb × 8 reps', aim: 'Aim to finish with 2 clean reps left.' },
      primary: 'Start set 2' });
  } });
  R('W-23', { screen: W, title: 'Set logged, effort unknown', rules: 'T08', component: 'set card', apply: function (a) {
    rest(a, { n: 1, rir: 'unsure', title: 'Set 1 logged', facts: '50 lb × 8 reps · Effort unknown',
      next: { head: 'Next · Set 2 of 4', presc: '50 lb × 8 reps', aim: 'Aim to finish with 2 clean reps left.' },
      primary: 'Start set 2' });
  } });
  R('W-24', { screen: W, title: 'Set logged, last set of the lift', rules: 'T09', component: 'set card, Log button', apply: function (a) {
    rest(a, { n: 4, rir: '1', title: 'Chest press complete', facts: '50 lb × 8 reps · 1 clean rep left', primary: 'Finish this workout' });
  } });
  R('W-25', { screen: W, title: 'Undo', rules: 'T09', component: 'set card', apply: function (a) {
    active(a, { n: 1, logged: false });
    a.E.note(a.$('workout-note'), 'Undone on this device from the saved-set screen before the next set.');
  } });
  R('W-26', { screen: W, title: 'Undo refused', rules: 'T09', component: 'set card', apply: function (a) {
    rest(a, { n: 1, rir: '2', title: 'Set 1 logged', facts: '50 lb × 8 reps · 2 clean reps left',
      restRefusal: 'The layer refused: ' + CODE.undo + '. Nothing changed.',
      next: { head: 'Next · Set 2 of 4', presc: '50 lb × 8 reps', aim: 'Aim to finish with 2 clean reps left.' },
      primary: 'Start set 2' });
  } });
  R('W-27', { screen: W, title: 'Editing a logged set', rules: 'T09', status: 'NOT WIRED', component: 'NEW edit-set control', apply: function (a) {
    rest(a, { n: 1, rir: '2', title: 'Set 1 logged', facts: '50 lb × 8 reps · 2 clean reps left',
      next: { head: 'Next · Set 2 of 4', presc: '50 lb × 8 reps', aim: 'Aim to finish with 2 clean reps left.' },
      primary: 'Start set 2',
      extra: function (a2, after) {
        var b = a2.el('button', 'link w-edit-set', 'Edit this set'); b.type = 'button'; after(b);
        after(a2.el('div', 'note-block', 'Editing a logged set is not wired yet. The paths that work are Undo and logging the set again.'));
      } });
  } });
  R('W-28', { screen: W, title: 'Every slot recorded, no saved set', rules: 'T09', component: 'set card', apply: function (a) {
    rest(a, { n: 4, title: 'Chest press complete', primary: 'Finish this workout', undo: false });
  } });
  R('W-29', { screen: W, title: 'Skipped set', rules: 'T09', status: 'NOT WIRED', component: 'NEW skip control', apply: function (a) {
    active(a, { n: 3 });
    var dots = document.querySelectorAll('#set-dots i');
    if (dots[1]) dots[1].className = 'skip';
    reason(a, ['Set 2: skipped.']);
    a.E.note(a.$('workout-note'), 'Skipping a set is not wired yet. Nothing was recorded.');
  } });
  R('W-30', { screen: W, title: 'Finish refused', rules: 'T09', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: 'This workout is not finished', blocks: [
      { refusal: 'This workout could not be finished on this device, and nothing was recorded.', tail: 'The layer’s own reason: ' + CODE.finish + '.' },
      { actions: [{ label: 'Finish this workout', kind: 'primary' }, { label: 'Back to the set', kind: 'link' }] }
    ] });
  } });
  R('W-31', { screen: W, title: 'Finished', rules: 'T09', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: 'Workout recorded', lead: 'Today’s workout is recorded on this device.', blocks: [
      { recorded: '4 sets recorded', stamp: 'Upper body, 4 exercises.' },
      { actions: [{ label: 'Back to Today', kind: 'primary' }] }
    ] });
  } });
  R('W-32', { screen: W, title: 'Resume after the app was killed', rules: 'T09', component: 'set card', apply: function (a) {
    active(a, { n: 3 });
  } });

  /* ============================ the machine settings ============================ */
  R('W-33', { screen: W, title: 'Machine settings, reading', rules: 'none (coach wave one)', component: 'machine row', apply: function (a) {
    active(a, { n: 1 });
    machine(a, 'Machine settings', 'Reading your saved settings for this machine.', true);
  } });
  R('W-34', { screen: W, title: 'Machine setting unknown', rules: 'none', component: 'machine row', apply: function (a) {
    active(a, { n: 1 });
    machine(a, 'Machine settings', 'No settings saved yet.');
  } });
  R('W-35', { screen: W, title: 'Machine settings known', rules: 'none', component: 'machine row', apply: function (a) {
    a.panel({ screen: W, title: 'Your settings for this machine', blocks: [
      { rows: [['Seat', '4'], ['Back pad', '2']] },
      { h: 'To remember:' },
      { p: 'Feet flat, elbows just under the handles.' },
      { p: 'From you, Sep 9.', muted: true },
      { actions: [{ label: 'Edit these settings' }, { label: 'Back to the set', kind: 'link' }] }
    ] });
  } });
  R('W-36', { screen: W, title: 'Machine settings could not be read', rules: 'none', component: 'machine row', apply: function (a) {
    active(a, { n: 1 });
    machine(a, 'Machine settings', 'Settings could not be read.', true);
    a.noteBlock('#machine', 'Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them.');
  } });
  R('W-37', { screen: W, title: 'Machine settings editor open', rules: 'none', component: 'NEW settings editor', apply: function (a) { editor(a); } });
  R('W-38', { screen: W, title: 'Editor refused, nothing entered', rules: 'none', component: 'NEW settings editor', apply: function (a) {
    /* nothing entered: the form is empty, so the sentence and the form say the same thing */
    editor(a, [{ refusal: 'Add a setting or a cue before saving. Nothing was recorded.', tail: false }], { settings: [{ name: '', value: '' }] });
  } });
  R('W-39', { screen: W, title: 'Editor refused, malformed', rules: 'none', component: 'NEW settings editor', apply: function (a) {
    /* the malformed entry is drawn: the same name twice. The refusal sits under the second Seat, and both carry the mark. */
    editor(a, [{ refusal: 'Each setting needs a short name and a short value, and each name only once. Nothing was recorded.', tail: false, field: 'Setting' }],
      { settings: [{ name: 'Seat', value: '4' }, { name: 'Seat', value: '2' }] });
  } });
  R('W-40', { screen: W, title: 'Editor refused, not saved', rules: 'none', component: 'NEW settings editor', apply: function (a) {
    editor(a, [{ refusal: 'These settings could not be recorded on this device, and no part of them was recorded.', tail: false }]);
  } });
  R('W-41', { screen: W, title: 'Editor cancelled', rules: 'none', component: 'NEW settings editor', apply: function (a) {
    active(a, { n: 1 });
    a.E.note(a.$('workout-note'), 'Closed without saving. Nothing was recorded, and your saved settings are unchanged.');
  } });
  R('W-42', { screen: W, title: 'Check-in reachable from the active set', rules: 'R07', component: 'timeline card', apply: function (a) {
    active(a, { n: 1 });
    a.$('machine').insertAdjacentElement('afterend', recoveryRow(a));
  } });
  R('W-43', { screen: W, title: 'No rest length', rules: 'T15 is app frozen; the sentence is always on the rest screen', component: 'set card', apply: function (a) {
    rest(a, { n: 1, rir: '2', title: 'Set 1 logged', facts: '50 lb × 8 reps · 2 clean reps left',
      next: { head: 'Next · Set 2 of 4', presc: '50 lb × 8 reps', aim: 'Aim to finish with 2 clean reps left.' },
      primary: 'Start set 2' });
  } });
  R('W-44', { screen: W, title: 'The card has no title', rules: 'none', component: 'state pill', apply: function (a) {
    a.panel({ screen: W, title: 'Workout recorded', lead: 'Today’s workout is recorded on this device.', blocks: [
      { p: 'This workout has no title on this device, so the screen is named for what happened.', muted: true },
      { recorded: '4 sets recorded' }
    ] });
  } });
  R('W-45', { screen: W, title: 'A late answer arrives after the athlete left', rules: 'none', component: 'none', apply: function (a) {
    /* the read resolves, is cached, and paints nothing: the active set is exactly as it was */
    active(a, { n: 1 });
  } });
})();
