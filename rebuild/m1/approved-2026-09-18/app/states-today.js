/* Today's states (inventory T-02 to T-95 plus the proposal card ruling of 2026-09-17). Copy is the rebuild's own where the code has it. */
(function () {
  'use strict';
  var S = window.earnedStates, R = S.register;
  var T = 'today';

  /* ---- shared moves ---- */
  function face(a, o) {
    o = o || {};
    a.text('#greeting', o.greeting || 'Morning, Joe.');
    a.text('#status-line', o.status || 'Upper body today. One change to review.');
  }
  function weighSaved(a, line) { a.text('#card-weigh .title', line); a.hide('#weigh-form'); a.hide('#weigh-note'); }
  /* a refusal that names the weight marks the field it names */
  function weighInvalid(a) { var f = document.querySelector('#weigh-form .field'); if (f) f.classList.add('is-invalid'); }
  function noProposal(a) { a.hide('#card-proposal'); }
  function marker(a, cardSel, txt, on) {
    var sub = document.querySelector(cardSel + ' .sub'); if (!sub) return; var old = sub.querySelector('.marker'); if (old) old.remove();
    if (!txt) return; var m = a.el('span', 'marker' + (on ? ' on' : ''), txt); sub.appendChild(m);
  }
  function primary(a, label, disabled) { a.text('#start span:first-child', label); a.disable('#start', !!disabled); }
  /* The stack holds Start, Recovery and Talk and nothing else: a footer link or a footer note belongs to the day,
     under the timeline, so Start's top stays at 631 in every state. (Review round 3.) */
  function dayFoot(a, node) { var body = document.querySelector('#screen-today .ui > .body'); if (body) body.appendChild(node); return node; }
  function dayLink(a, label) { var b = a.el('button', 'link on-scene day-foot', label); b.type = 'button'; return dayFoot(a, b); }
  function dayNote(a, txt, cls) { return dayFoot(a, a.el('div', 'note-block day-foot' + (cls ? ' ' + cls : ''), txt)); }
  var UNTIL_YOU_SAY_YES = 'Nothing changes until you say yes.';
  function proposal(a, o) {
    /* one card for every proposal kind: set, break, ladder, weight. o.kind is the eyebrow, o.title the serif line, o.change, o.reason, o.yes, o.no */
    var c = a.$('card-proposal'); c.hidden = false; c.className = 'tcard proposal' + (o.state ? ' is-' + o.state : '');
    var kind = o.kind || 'One call needs you'; if (o.state === 'recorded' || o.state === 'declined') kind = 'Your call'; else if (o.state === 'applied') kind = 'Applied'; else if (o.state === 'superseded') kind = 'Withdrawn';
    a.show('#proposal-kind'); a.text('#proposal-kind', kind);
    a.text('#proposal-lift', o.title); a.text('#why-105', o.why || 'Why?');
    var reason = o.reason || '';
    if (reason && reason.indexOf(UNTIL_YOU_SAY_YES) < 0) reason = reason.replace(/\s*$/, ' ') + UNTIL_YOU_SAY_YES;
    a.text('#card-proposal .change', o.change || ''); a.text('#proposal-reason', reason);
    a.text('#use-105', o.yes || 'Yes, add it'); a.text('#keep-115', o.no || 'No, keep it as is');
    var open = a.$('proposal-open'), done = a.$('proposal-done'), note = a.$('proposal-done-note');
    if (!o.state || o.state === 'open') { open.hidden = false; done.hidden = true; note.hidden = true; return; }
    open.hidden = true; done.hidden = false;
    var rec = a.$('recorded-text'); rec.innerHTML = '';
    var w = a.el('span', 'state-word', o.stateWord); rec.appendChild(w); rec.appendChild(document.createTextNode(' ' + (o.stateText || '')));
    a.text('#undo-proposal', o.state === 'recorded' || o.state === 'declined' ? 'Change my answer' : ''); a.$('undo-proposal').hidden = !(o.state === 'recorded' || o.state === 'declined');
    note.hidden = !o.noteText; note.textContent = o.noteText || '';
  }
  var SET = { kind: 'One call needs you', title: 'Chest', change: 'Add one set this week', reason: 'Your chest lifts are holding while the scale falls. One more set is the smallest move that can show up. ' + UNTIL_YOU_SAY_YES, yes: 'Yes, add it', no: 'No, keep it as is', why: 'Why one set?' };

  /* ---------- Today's face ---------- */
  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', component: 'sample note', apply: function (a) {
    face(a, { status: 'Upper body today. Sample data.' }); a.noteBlock('#status-line', 'Sample data. Set up your week to start your own.', 'sample'); primary(a, 'Set up your week');
  } });
  R('T-03', { screen: T, title: 'Enrolled, adoption of your record pending', rules: 'N01 N05 T02', apply: function (a) {
    face(a, { status: 'Your record is opening. Nothing here is measured yet.' });
    a.text('#card-eat .title', 'Calories: not available yet.'); a.text('#card-eat .sub', 'Protein: not available yet.');
    a.text('#card-train .title', 'No session is scheduled today.'); a.text('#card-train .sub', 'Weight trend not available yet.');
    noProposal(a); primary(a, 'Log today’s weight');
  } });
  R('T-04', { screen: T, title: 'Your week is saved; figures are still the preview’s', rules: 'none', component: 'provenance note', apply: function (a) {
    face(a); a.noteBlock('#status-line', 'Your week is saved on this device. The numbers on this screen are still the preview’s sample athlete, not you. Nothing here was measured from anything you did.');
  } });
  R('T-05', { screen: T, title: 'Your record could not be read', rules: 'none', apply: function (a) {
    face(a, { status: 'Not everything opened. Nothing was recorded.' }); a.statusPill(T, 'Your athlete state did not come back: the store did not answer.', 'warn');
  } });
  R('T-06', { screen: T, title: 'The local record is not trusted (blocked)', rules: 'none', apply: function (a) {
    face(a, { greeting: 'Earned cannot show today’s plan.', status: 'This device’s record did not verify. Nothing on this screen is a value.' });
    ['#card-weigh .title', '#card-eat .title', '#card-train .title'].forEach(function (s) { a.text(s, 'Not available yet'); }); a.text('#card-eat .sub', ''); a.text('#card-train .sub', ''); a.hide('#weigh-form');
    noProposal(a); primary(a, 'Start upper body', true); a.statusPill(T, 'Nothing can start while this device’s record is not trusted.', 'warn');
    a.text('#recovery .sub', 'Not wired yet'); a.text('#talk-today .label', 'Not wired yet');
  } });
  R('T-07', { screen: T, title: 'This device has no encrypted local store', rules: 'none', apply: function (a) {
    face(a); a.statusPill(T, 'Nothing can be recorded on this device: its encrypted local store did not open.', 'warn'); a.disable('#save-weight');
  } });
  R('T-08', { screen: T, title: 'Store is durable', rules: 'none', apply: function (a) {
    face(a); a.statusPill(T, 'Saved in this device’s encrypted local store. It survives a reload, a restart, a reboot and a crash.');
  } });
  R('T-09', { screen: T, title: 'Training day, weigh-in owed', rules: 'T02 T04 R05 R06', apply: function (a) {
    face(a); a.text('#card-weigh .title', 'This morning: not logged yet.'); primary(a, 'Log today’s weight');
  } });
  R('T-10', { screen: T, title: 'Training day, weigh-in done, session can open', rules: 'T01 T02 T08 T14 V01 V02', apply: function (a) {
    face(a); weighSaved(a, 'This morning ✓ 181.4 lb'); a.text('#card-train .sub', 'Upper body, 4 exercises.'); primary(a, 'Start upper body');
  } });
  R('T-11', { screen: T, title: 'Rest day', rules: 'R04', apply: function (a) {
    face(a, { greeting: 'Rest today.', status: 'Nothing to decide. Next: lower body, tomorrow.' }); a.text('#card-train .title', 'Lower body, tomorrow.'); a.text('#card-train .sub', '4 exercises.'); noProposal(a); primary(a, 'Nothing to start today', true);
  } });
  R('T-12', { screen: T, title: 'No session scheduled today', rules: 'V01', apply: function (a) {
    face(a, { status: 'Nothing scheduled today, so there is nothing to start.' }); a.text('#card-train .title', 'No session is scheduled today.'); a.text('#card-train .sub', ''); noProposal(a); primary(a, 'Start', true);
  } });
  R('T-13', { screen: T, title: 'Today’s exercises are not available', rules: 'T13 T16', apply: function (a) {
    face(a, { status: 'Today’s exercises are not available, so there is nothing to start.' }); a.text('#card-train .title', 'Today’s exercises are not available: WORKOUT_PREPARATION_UNAVAILABLE'); a.text('#card-train .sub', ''); noProposal(a); primary(a, 'Start', true);
  } });
  R('T-14', { screen: T, title: 'Workout in progress', rules: 'T01 T08', apply: function (a) {
    face(a, { status: 'Upper body is under way.' }); weighSaved(a, 'This morning ✓ 181.4 lb'); a.text('#card-train .title', 'Train today.'); a.text('#card-train .sub', 'Upper body, 4 exercises · Workout in progress'); primary(a, 'Resume upper body');
  } });
  R('T-15', { screen: T, title: 'Workout recorded today', rules: 'T09', apply: function (a) {
    face(a, { status: 'Upper body logged. Nothing to decide.' }); weighSaved(a, 'This morning ✓ 181.4 lb'); a.text('#card-train .title', 'Trained today.'); a.text('#card-train .sub', 'Upper body, 4 exercises · Workout recorded'); noProposal(a); primary(a, 'Review the workout');
  } });
  R('T-16', { screen: T, title: 'Today’s workout cannot open', rules: 'T13 T16', apply: function (a) {
    face(a, { status: 'Today’s workout cannot open.' }); a.text('#card-train .sub', 'Upper body, 4 exercises · Today’s workout cannot open · WORKOUT_PREPARATION_UNAVAILABLE'); primary(a, 'Why it cannot open');
  } });
  R('T-17', { screen: T, title: 'An earlier workout was never finished', rules: 'T09', apply: function (a) {
    face(a, { status: 'An earlier workout is still open.' }); a.text('#card-train .sub', 'Upper body, 4 exercises · An earlier workout was never finished · Sep 14'); primary(a, 'Close the workout');
  } });
  R('T-18', { screen: T, title: 'Stored readings the plan did not use', rules: 'N02', apply: function (a) {
    face(a); a.statusPill(T, 'This device holds 2 stored readings the plan did not use.');
  } });
  R('T-19', { screen: T, title: 'Gated calorie band', rules: 'N05 N01', apply: function (a) {
    face(a, { status: 'Upper body today. Your calorie range is not available yet.' }); a.text('#card-eat .title', 'A calorie range is not available yet.'); a.text('#card-eat .sub', 'Protein at least 160 g.');
  } });
  R('T-20', { screen: T, title: 'No calorie band figure at all', rules: 'N05', apply: function (a) {
    face(a); a.text('#card-eat .title', 'Calories: not available yet.'); a.text('#card-eat .sub', 'Protein at least 160 g.');
  } });
  R('T-21', { screen: T, title: 'No lean anchor, so no protein target', rules: 'N01', apply: function (a) {
    face(a); a.text('#card-eat .title', 'Eat about 2,300 kcal today.'); a.text('#card-eat .sub', '');
  } });
  R('T-22', { screen: T, title: 'Weight trend not available', rules: 'N02', apply: function (a) {
    face(a); a.text('#card-weigh .title', 'Weigh in before breakfast.'); a.noteBlock('#card-weigh', 'Weight trend: not available yet.');
  } });
  R('T-23', { screen: T, title: 'Nutrition entry, lane not open', rules: 'N01 N05', apply: function (a) { face(a); marker(a, '#card-eat', 'Not wired yet'); } });
  R('T-24', { screen: T, title: 'Nutrition entry, nothing recorded', rules: 'N01', apply: function (a) { face(a); marker(a, '#card-eat', ''); } });
  R('T-25', { screen: T, title: 'Nutrition entry, recorded today', rules: 'N01', apply: function (a) { face(a); marker(a, '#card-eat', 'Recorded today', true); } });
  R('T-26', { screen: T, title: 'Check-in, nothing recorded', rules: 'R04 R07', apply: function (a) { face(a); a.text('#recovery .sub', 'Optional. How are you feeling?'); } });
  R('T-27', { screen: T, title: 'Check-in recorded', rules: 'R04 R07', apply: function (a) { face(a); a.text('#recovery .sub', 'Recorded today.'); } });
  R('T-28', { screen: T, title: 'Check-in, no store', rules: 'none', apply: function (a) { face(a); a.text('#recovery .sub', 'Not available on this device.'); } });
  /* the row's sub line is one line wide: an empty night is said in the day, where there is room for the sentence */
  R('T-29', { screen: T, title: 'Sleep, nothing for the night', rules: 'R01 R02 R03', apply: function (a) { face(a); a.statusPill(T, 'No sleep recorded for this night.'); } });
  R('T-30', { screen: T, title: 'Sleep, a night is held', rules: 'R01 R02 R03', status: 'DORMANT', apply: function (a) { face(a); a.text('#recovery .sub', 'Recorded today · Sleep 7.2 h'); } });
  R('T-31', { screen: T, title: 'Coach entry', rules: 'C01 C05', apply: function (a) { face(a); a.text('#talk-today .label', 'Talk through today’s plan'); } });
  /* these four are about the control at the foot of the day, so the day carries no outstanding proposal: the link stays above the fold */
  R('T-32', { screen: T, title: 'Import entry, none admitted', rules: 'none', apply: function (a) { face(a, { status: 'Upper body today. Nothing to decide.' }); noProposal(a); dayLink(a, 'Import my history'); } });
  R('T-33', { screen: T, title: 'Import entry, history imported', rules: 'none', apply: function (a) { face(a, { status: 'Upper body today. Nothing to decide.' }); noProposal(a); dayLink(a, 'History imported'); } });
  R('T-36', { screen: T, title: 'Report a problem, idle', rules: 'none', apply: function (a) { face(a, { status: 'Upper body today. Nothing to decide.' }); noProposal(a); dayLink(a, 'Report a problem'); } });
  R('T-37', { screen: T, title: 'Report a problem, copied', rules: 'none', apply: function (a) { face(a, { status: 'Upper body today. Nothing to decide.' }); noProposal(a); dayLink(a, 'Report a problem'); dayNote(a, 'Copied. Send it to Joe.'); } });
  R('T-38', { screen: T, title: 'Report a problem, copy not available', rules: 'none', apply: function (a) { face(a, { status: 'Upper body today. Nothing to decide.' }); noProposal(a); dayLink(a, 'Report a problem'); dayNote(a, 'Select all and copy, then send it to Joe.'); } });
  R('T-39', { screen: T, title: 'Headline shrink (long engine title)', rules: 'T02', apply: function (a) {
    face(a, { greeting: 'Hold the bench at 105 and let the reps come back.', status: 'Two short sets last time. The engine keeps the load until the reps are clean.' }); a.$('greeting').style.fontSize = '34px';
  } });
  R('T-41', { screen: T, title: 'Offline indicator', rules: 'none', status: 'NOT WIRED', apply: function (a) { face(a); a.statusPill(T, 'Offline. Everything here works without a connection; the voice coach needs one.'); } });

  /* ---------- The proposal card, per the 2026-09-17 ruling ---------- */
  R('T-40', { screen: T, title: 'Proposal: add a set (open)', rules: 'C02 V04', component: 'proposal card', apply: function (a) { face(a); proposal(a, SET); } });
  R('T-40b', { screen: T, title: 'Proposal: recorded (you said yes, not applied yet)', rules: 'C02', apply: function (a) {
    face(a, { status: 'Upper body today. One answer recorded.' }); proposal(a, Object.assign({}, SET, { state: 'recorded', stateWord: 'You said yes.', stateText: 'It applies when your plan is next built.' }));
  } });
  R('T-40c', { screen: T, title: 'Proposal: applied', rules: 'C02', apply: function (a) {
    face(a, { status: 'Upper body today. Nothing to decide.' }); proposal(a, Object.assign({}, SET, { state: 'applied', stateWord: 'You said yes.', stateText: 'Chest is at 11 sets this week.', why: 'Why?' })); a.$('undo-proposal').hidden = true;
  } });
  R('T-40d', { screen: T, title: 'Proposal: declined', rules: 'C02', apply: function (a) {
    face(a, { status: 'Upper body today. Nothing to decide.' }); proposal(a, Object.assign({}, SET, { state: 'declined', stateWord: 'You said no.', stateText: 'Nothing changes.' }));
  } });
  R('T-40e', { screen: T, title: 'Proposal: withdrawn when the plan was rebuilt', rules: 'C02', apply: function (a) {
    face(a); proposal(a, Object.assign({}, SET, { state: 'superseded', stateWord: 'Withdrawn.', stateText: 'Your plan was rebuilt and this proposal no longer applies.' })); a.$('undo-proposal').hidden = true;
  } });
  R('T-40f', { screen: T, title: 'Proposal: diet break (open)', rules: 'C02 P01', apply: function (a) {
    face(a); proposal(a, { kind: 'One call needs you', title: 'Diet break', change: 'Seven days at maintenance', reason: 'Your energy has read low for a week and three of the last seven days ran over the band. A break at measured maintenance, then the cut resumes.', yes: 'Yes, take the break', no: 'No, keep cutting', why: 'Why a break?' });
  } });
  R('T-40g', { screen: T, title: 'Proposal: machine ladder (open)', rules: 'C02 T17', apply: function (a) {
    face(a); proposal(a, { kind: 'One call needs you', title: 'Chest press rungs', change: 'Use the machine’s own steps', reason: 'Your logged loads show this machine moves in 2.5 kg steps, not the 5 lb the plan assumed.', yes: 'Yes, use them', no: 'No, keep the plan’s steps', why: 'Why?' });
  } });
  R('T-40h', { screen: T, title: 'Proposal: weight change (the board’s bench, dormant kind)', rules: 'C02 T10', status: 'DORMANT', apply: function (a) {
    face(a); proposal(a, { kind: 'One call needs you', title: 'Bench press', change: '115 to 105 lb for 8 reps', reason: 'Lowered from 115 after two short sets last session.', yes: 'Use 105', no: 'Keep 115', why: 'Why 105 lb?' });
  } });

  /* ---------- The weigh-in, inline on the card (the rebuild’s sheet states, on the board’s inline pattern) ---------- */
  R('T-42', { screen: T, title: 'Weigh-in empty', rules: 'N02', apply: function (a) { face(a); a.$('weight').value = ''; } });
  R('T-43', { screen: T, title: 'Weigh-in typed, not saved', rules: 'N02', apply: function (a) { face(a); a.$('weight').value = '181.4'; } });
  R('T-44', { screen: T, title: 'Weigh-in in flight', rules: 'N02', apply: function (a) { face(a); a.$('weight').value = '181.4'; a.disable('#save-weight'); a.text('#save-weight', 'Saving'); } });
  R('T-45', { screen: T, title: 'Weigh-in refused, out of range', rules: 'N02', apply: function (a) { face(a); a.$('weight').value = '20'; weighInvalid(a); a.E.note(a.$('weigh-note'), 'A morning weight is recorded between 60 and 400 lb, to one decimal place. Nothing was recorded.', 'refusal'); } });
  R('T-46', { screen: T, title: 'Weigh-in refused, empty', rules: 'N02', apply: function (a) { face(a); a.$('weight').value = ''; weighInvalid(a); a.E.note(a.$('weigh-note'), 'A weight is required. Nothing was recorded.', 'refusal'); } });
  R('T-47', { screen: T, title: 'Weigh-in refused, already recorded today', rules: 'N02', apply: function (a) { face(a); weighSaved(a, 'This morning ✓ 181.4 lb'); a.show('#weigh-note'); a.E.note(a.$('weigh-note'), 'Today’s weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.', 'refusal'); } });
  R('T-48', { screen: T, title: 'Weigh-in refused, no store', rules: 'none', apply: function (a) { face(a); a.disable('#save-weight'); a.E.note(a.$('weigh-note'), 'This device could not open its encrypted local store, so nothing can be recorded here.', 'refusal'); } });
  R('T-49', { screen: T, title: 'Weigh-in refused, save threw', rules: 'none', apply: function (a) { face(a); a.$('weight').value = '181.4'; a.E.note(a.$('weigh-note'), 'This weight could not be recorded, and nothing was recorded. The store did not answer.', 'refusal'); } });
  R('T-50', { screen: T, title: 'Weigh-in saved', rules: 'N02', apply: function (a) { face(a); weighSaved(a, 'This morning ✓ 181.4 lb'); } });
  R('T-51', { screen: T, title: 'Weigh-in saved with an engine note', rules: 'N02 N04', apply: function (a) { face(a); weighSaved(a, 'This morning ✓ 181.4 lb · spike: damped in trend'); } });
  R('T-52', { screen: T, title: 'Undo a weigh-in', rules: 'N02', status: 'NOT WIRED', apply: function (a) { face(a); weighSaved(a, 'This morning ✓ 181.4 lb'); a.show('#weigh-note'); a.E.note(a.$('weigh-note'), 'Changing a recorded reading is not wired yet.'); } });

  /* ---------- Why this plan (a panel) ---------- */
  function why(a, blocks) { a.panel({ screen: T, title: 'Why this plan', lead: 'Hold the bench at 105 and let the reps come back. Two short sets last time; the engine keeps the load until the reps are clean.', blocks: blocks }); }
  R('T-53', { screen: T, title: 'Why this plan, normal', rules: 'N03 N04 N07 N10 T04', component: 'panel', apply: function (a) { why(a, [
    { h: 'Your calories' }, { p: 'About 2,300 kcal: measured maintenance less the rate band, never below the floor.' },
    { h: 'Your protein' }, { p: 'At least 160 g: a provisional target from the available lean-mass input, not a measured personal minimum.' },
    { h: 'What supports cutting' }, { p: 'Lifts holding while the scale falls, confirmed a week apart.' },
    { h: 'The readings behind it' }, { p: '14 clean weigh-ins over 28 days.' },
    { h: 'The rate itself' }, { p: 'About 0.9 lb a week, between 0.6 and 1.2, measured across those readings.' }
  ]); } });
  R('T-54', { screen: T, title: 'Why, no reading stored', rules: 'N02', apply: function (a) { why(a, [{ h: 'The readings behind it' }, { p: 'No reading is stored on this device yet.', muted: true }]); } });
  R('T-55', { screen: T, title: 'Why, rate not measured', rules: 'N02 N04', apply: function (a) { why(a, [{ h: 'The rate itself' }, { p: 'The stored history does not establish a measured weekly rate yet.', muted: true }]); } });
  R('T-56', { screen: T, title: 'Why, a section has nothing', rules: 'N01 N05', apply: function (a) { why(a, [{ h: 'Your protein' }, { p: 'No supporting estimate is available.', muted: true }]); } });
  R('T-57', { screen: T, title: 'Why, blocked', rules: 'none', apply: function (a) { a.panel({ screen: T, title: 'Why this plan', blocks: [{ p: 'Nothing can be explained while the local record is not trusted.', muted: true }] }); } });

  /* ---------- The nutrition entry (a panel) ---------- */
  function food(a, blocks, lead) { a.panel({ screen: T, title: 'Today’s intake', lead: lead === false ? '' : (lead || 'Enter what you actually ate today. Either figure on its own is enough.'), blocks: blocks }); }
  /* the field labels are the engine's own ("Calories eaten" / "Protein eaten", today-app.cjs:109-113): the targets are named plainly, what you ate is named "eaten" */
  var CAL = 'Calories eaten', PRO = 'Protein eaten';
  var foodFields = [{ field: CAL, placeholder: 'kcal', inputmode: 'numeric' }, { field: PRO, placeholder: 'g', inputmode: 'numeric' }];
  R('T-58', { screen: T, title: 'Nutrition, store opening', rules: 'N01', component: 'panel', apply: function (a) { food(a, [
    { p: 'Opening this device’s encrypted store.', muted: true },
    { rows: [['Calories', 'About 2,300 kcal'], ['Protein', 'At least 160 g']] },
    { note: 'The full nutrition screen is not wired yet. Energy and protein above are today’s engine targets; nothing else on this screen is a value.' }
  ]); } });
  R('T-59', { screen: T, title: 'Nutrition, store refused', rules: 'N01', apply: function (a) { food(a, [{ refusal: 'Your intake cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep what you enter and nothing you type is kept. Open Earned again on this device, or use one that allows local storage, and this entry starts working.', tail: 'The store’s own reason: STORE_UNAVAILABLE.' }], false); } });
  R('T-60', { screen: T, title: 'Nutrition, no targets for this athlete', rules: 'N01 N05 P04', apply: function (a) { food(a, [{ note: 'Earned has no calorie band or protein target for you yet: it needs a starting estimate of your body composition, which this device has not recorded. Your intake is still yours to record, and it is kept.' }].concat(foodFields, [{ actions: [{ label: 'Record today’s intake', kind: 'primary' }] }])); } });
  R('T-61', { screen: T, title: 'Nutrition, macro rows nothing prescribed', rules: 'N01', apply: function (a) { food(a, [{ rows: [['Calories', 'About 2,300 kcal'], ['Protein', 'At least 160 g'], ['Carbohydrate', 'Not prescribed'], ['Fat', 'Not prescribed']] }, { p: 'The engine issues no carbohydrate or fat target.', muted: true }]); } });
  R('T-62', { screen: T, title: 'Nutrition entry open, nothing recorded', rules: 'N01', apply: function (a) { food(a, foodFields.concat([{ actions: [{ label: 'Record today’s intake', kind: 'primary' }] }])); } });
  R('T-63', { screen: T, title: 'Nutrition refused, nothing entered', rules: 'N01', apply: function (a) { food(a, foodFields.concat([{ refusal: 'Enter calories, protein, or both.' }, { actions: [{ label: 'Record today’s intake', kind: 'primary' }] }])); } });
  R('T-64', { screen: T, title: 'Nutrition refused, calories out of range', rules: 'N01', apply: function (a) { food(a, [{ field: CAL, placeholder: 'kcal', value: '25000', inputmode: 'numeric' }, foodFields[1], { refusal: 'Calories are recorded as a whole number between 0 and 20000.', field: CAL }, { actions: [{ label: 'Record today’s intake', kind: 'primary' }] }]); } });
  R('T-65', { screen: T, title: 'Nutrition refused, protein out of range', rules: 'N01', apply: function (a) { food(a, [foodFields[0], { field: PRO, placeholder: 'g', value: '1200', inputmode: 'numeric' }, { refusal: 'Protein is recorded as a whole number of grams between 0 and 1000.', field: PRO }, { actions: [{ label: 'Record today’s intake', kind: 'primary' }] }]); } });
  R('T-66', { screen: T, title: 'Nutrition refused by the client', rules: 'N01', apply: function (a) { food(a, [{ field: CAL, placeholder: 'kcal', value: '2250', inputmode: 'numeric' }, { field: PRO, placeholder: 'g', value: '165', inputmode: 'numeric' }, { refusal: 'This intake could not be recorded on this device, and no part of it was recorded. The store did not answer.', tail: 'Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today.' }, { actions: [{ label: 'Record today’s intake', kind: 'primary' }] }]); } });
  R('T-67', { screen: T, title: 'Nutrition recorded', rules: 'N01', apply: function (a) { food(a, [{ recorded: '2,250 kcal · 165 g protein', stamp: 'Recorded today at 19:40 (local offset +01:00)', source: 'Recording it again replaces today’s figures.' }].concat(foodFields, [{ actions: [{ label: 'Record today’s intake', kind: 'primary' }] }])); } });
  R('T-68', { screen: T, title: 'Nutrition recorded, read back failed', rules: 'N01', apply: function (a) { food(a, [{ recorded: 'Recorded today · 2,250 kcal', stamp: 'Earned could not read today’s record back just now, so what is shown here may not be the whole day.', source: 'Nothing you entered is lost. Read today’s record again below, or open Earned again on this device.' }, { actions: [{ label: 'Read today’s record again' }] }]); } });
  R('T-69', { screen: T, title: 'Nutrition, outcome unknown', rules: 'N01', apply: function (a) { food(a, [{ refusal: 'Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not.', tail: false }, { actions: [{ label: 'Read today’s record again' }] }]); } });
  R('T-70', { screen: T, title: 'Nutrition recorded, engine cannot read it back', rules: 'N01 P04', apply: function (a) { food(a, [{ recorded: '2,250 kcal · 165 g protein', stamp: 'Recorded and kept on this device.', source: 'Earned cannot show today’s figures back through its own ledger yet: it has no starting estimate of your body composition, and that ledger will not open without one. Nothing is lost, and they appear here as soon as that estimate exists.' }]); } });
  R('T-71', { screen: T, title: 'Nutrition, the lane opened into a refusal', rules: 'N01', apply: function (a) { food(a, [{ refusal: 'Your intake cannot be recorded on this device yet.', tail: 'The store’s own reason: STORE_REFUSED. Open Earned again on this device.' }], false); } });

  /* ---------- The sleep entry (a panel) ---------- */
  function sleep(a, blocks, lead) { a.panel({ screen: T, title: 'Sleep', lead: lead || 'Night of Tue, Sep 15', blocks: blocks }); }
  var HOW = 'How do you want to record it?';
  var times = [{ choice: ['Bed and wake times', 'Hours asleep'], selected: 0, label: HOW }, { field: 'Bed time', placeholder: '23:10', inputmode: 'numeric' }, { field: 'Wake time', placeholder: '06:40', inputmode: 'numeric' }, { field: 'Time awake', placeholder: 'minutes, optional', inputmode: 'numeric' }];
  var saveSleep = { actions: [{ label: 'Save sleep', kind: 'primary' }] };
  R('T-72', { screen: T, title: 'Sleep, no store', rules: 'R01 R02', component: 'panel', apply: function (a) { sleep(a, [{ refusal: 'Sleep cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep it. Open Earned again on this device, or use one that allows local storage.', tail: false }]); } });
  R('T-73', { screen: T, title: 'Sleep empty, times mode', rules: 'R01 R02', apply: function (a) { sleep(a, times.concat([saveSleep])); } });
  R('T-74', { screen: T, title: 'Sleep empty, hours mode', rules: 'R01 R02', apply: function (a) { sleep(a, [{ choice: ['Bed and wake times', 'Hours asleep'], selected: 1, label: HOW }, { field: 'About how many hours did you sleep?', placeholder: '7.5', inputmode: 'decimal', hint: 'Entered as an approximate duration.' }, saveSleep]); } });
  R('T-75', { screen: T, title: 'Sleep, times entered, estimate shown', rules: 'R01', apply: function (a) { sleep(a, [times[0], { field: 'Bed time', value: '23:10' }, { field: 'Wake time', value: '06:40' }, { field: 'Time awake', placeholder: 'minutes, optional' }, { p: 'Estimate from clock times: 7.5 h. Time awake was not recorded.', muted: true }, saveSleep]); } });
  R('T-76', { screen: T, title: 'Sleep, clock-change night', rules: 'R01', apply: function (a) { sleep(a, [times[0], { field: 'Bed time', value: '02:00' }, { field: 'Wake time', value: '02:00' }, { p: 'For a clock-change night, enter hours asleep.', muted: true }, saveSleep]); } });
  R('T-77', { screen: T, title: 'Sleep, the check-in already holds these hours', rules: 'R01 R07', apply: function (a) { sleep(a, [{ recorded: '7.5 h', stamp: 'From your check-in on Wed, Sep 16', source: 'The question is never asked twice.' }, { actions: [{ label: 'Use these hours', kind: 'primary' }, { label: 'Enter it differently', kind: 'link' }] }]); } });
  var BOTH_TIMES = ['Bed time', 'Wake time'];
  function sleepRefusals(list) { list.forEach(function (r) { R(r[0], { screen: T, title: 'Sleep refused, ' + r[1], rules: 'R01', apply: function (a) { sleep(a, times.concat([{ refusal: r[2], field: r[3] }, saveSleep])); } }); }); }
  sleepRefusals([['T-78', 'nothing chosen', 'Choose times or hours asleep.'], ['T-79', 'one time missing', 'Enter both times.', BOTH_TIMES], ['T-80', 'times not valid', 'Enter valid times.', BOTH_TIMES], ['T-81', 'matching times', 'For matching times, enter hours asleep instead.', BOTH_TIMES], ['T-82', 'minutes awake', 'Enter whole minutes awake within the time in bed.', 'Time awake']]);
  /* the hours refusal names the hours field, so this state is the hours mode, not the clock-time mode */
  var HOURS_LABEL = 'About how many hours did you sleep?';
  R('T-83', { screen: T, title: 'Sleep refused, hours out of range', rules: 'R01', apply: function (a) { sleep(a, [{ choice: ['Bed and wake times', 'Hours asleep'], selected: 1, label: HOW }, { field: HOURS_LABEL, value: '26', inputmode: 'decimal' }, { refusal: 'Enter hours from 0 to 24, with up to two decimal places.', field: HOURS_LABEL }, saveSleep]); } });
  sleepRefusals([['T-84', 'the night is not complete', 'Choose a completed night.']]);
  R('T-85', { screen: T, title: 'Sleep saving', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ actions: [{ label: 'Saving sleep', kind: 'primary', disabled: true }] }])); } });
  R('T-86', { screen: T, title: 'Sleep saved', rules: 'R01 R02', apply: function (a) { sleep(a, [{ recorded: '7.5 h asleep', stamp: 'Recorded Wed, Sep 16 at 07:02.', source: 'From bed and wake times.' }, { actions: [{ label: 'Change sleep', kind: 'link' }] }]); } });
  R('T-87', { screen: T, title: 'Sleep corrected', rules: 'R01', apply: function (a) { sleep(a, [{ recorded: '7.2 h asleep', stamp: 'Corrected Wed, Sep 16 at 08:15.', source: 'Entered as an approximate duration.' }, { actions: [{ label: 'Change sleep', kind: 'link' }] }]); } });
  R('T-88', { screen: T, title: 'Sleep correcting', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ actions: [{ label: 'Save correction', kind: 'primary' }, { label: 'Cancel', kind: 'link' }] }])); } });
  R('T-89', { screen: T, title: 'Sleep not saved, the client refused', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ refusal: 'Sleep could not be saved on this device. The store did not answer.' }, saveSleep])); } });
  R('T-90', { screen: T, title: 'Sleep, the night changed under the editor', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ refusal: 'This night changed while you were editing. Review the saved record before trying again.' }, saveSleep])); } });
  R('T-91', { screen: T, title: 'Sleep, the check-in changed', rules: 'R01 R07', apply: function (a) { sleep(a, times.concat([{ refusal: 'The check-in changed. Review its hours again.' }, saveSleep])); } });
  R('T-92', { screen: T, title: 'Sleep, outcome unknown', rules: 'R01', apply: function (a) { sleep(a, [{ p: 'Checking whether sleep was saved.', muted: true }, { actions: [{ label: 'Try reading it again' }] }]); } });
  R('T-93', { screen: T, title: 'Sleep, the log says nothing was written', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ refusal: 'Sleep could not be saved. The store’s own reason: WRITE_NOT_FOUND.', tail: 'Nothing was recorded. What you typed is still here.' }, saveSleep])); } });
  R('T-94', { screen: T, title: 'Sleep, midnight moved under an open draft', rules: 'R01', apply: function (a) { sleep(a, times.concat([{ refusal: 'The date changed. Check which night this is for.' }, { actions: [{ label: 'Keep this night', kind: 'primary' }] }])); } });
  /* the panel's title is Today's own row wording ("Recovery check in"), not the engine's hyphenated string */
  R('T-95', { screen: T, title: 'The check-in view for a night', rules: 'R07', apply: function (a) { a.panel({ screen: T, title: 'Recovery check in', lead: 'Wed, Sep 16', blocks: [{ rows: [['Energy', '3 of 5'], ['Soreness', 'A little'], ['Sleep', '7.5 h'], ['Joints', 'Fine']] }, { p: 'Recorded today at 07:02.', muted: true }] }); } });
})();
