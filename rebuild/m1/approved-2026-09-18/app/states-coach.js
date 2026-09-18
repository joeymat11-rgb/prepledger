/* Coach states (inventory C-02 to C-65, plus the applied proposal C-50b) under the ruling of 2026-09-17:
   the structural states are real components; the answer variants are copy on one answer card.
   Every number here is an example. C-01 lives on Today. */
(function () {
  'use strict';
  var S = window.earnedStates, R = S.register;
  var C = 'coach';

  /* ---- shared moves ---- */
  function state(a, s) { a.E.setCoachState(s || 'idle'); }
  /* The header pill reports the turn, so it goes out the moment the turn is over. Once a card is on screen the card is the
     answer and a lit "Answering" contradicts it; where the coach is waiting on the athlete (a confirm row, a chip row) it
     would be plain wrong. Only Listening (C-04) and the transient answering moment (C-05) keep it. */
  function noPill(a) { a.hide('#coach-state'); }

  /* The boards show the three prompts only while the coach is idle: an answer replaces them,
     so the mic stays the screen's primary action inside the first viewport. */
  function quiet(a) { a.hide('#prompts'); }

  /* Where voice cannot work there is no mic: the 80 px disc goes entirely (states-coach.css), because a dead control has no
     business being the largest thing on the screen. What is left is one line where the mic label was, saying why, and the
     path that does work as the screen's primary: a full-width decision in the stack, on the same edge the mic held. */
  function micOff(a, label, alt) {
    a.attr('#screen-coach', 'data-mic', 'off');
    a.text('#mic-label', label);
    a.attr('#mic', 'aria-hidden', 'true');
    a.attr('#mic', 'tabindex', '-1');
    a.hide('.coach-links');   /* the tap path is the decision below, said once */
    var wrap = document.querySelector('#screen-coach .mic-wrap');
    var old = wrap.querySelector('.mic-alt'); if (old) old.remove();
    var b = a.el('button', 'decision mic-alt', alt || 'I’ll tap instead'); b.type = 'button';
    wrap.insertBefore(b, a.$('mic-label'));
    return b;
  }

  /* One answer card for every answer the coach gives. o: { said, text, tail, from, refusal, quiet } */
  function answer(a, o) {
    quiet(a);
    var card = a.$('coach-answer'); card.hidden = false;
    card.className = 'coach-answer' + (o.refusal ? ' is-refusal' : '');
    var old = card.querySelector('.said'); if (old) old.remove();
    if (o.said) card.insertBefore(a.el('div', 'said', o.said), card.firstChild);
    var t = a.$('coach-answer-text'); t.textContent = o.text || '';
    if (o.tail) t.appendChild(a.el('span', 'tail', o.tail));
    if (o.quoted) t.appendChild(a.el('span', 'quoted', o.quoted));
    var from = card.querySelector('.from');
    from.hidden = o.from === false; if (o.from) from.textContent = o.from;
    state(a, o.state || 'answering');
    noPill(a);   /* the card is the answer; the pill has nothing left to report */
    return card;
  }
  function refusal(a, o) { o.refusal = true; if (o.from === undefined) o.from = false; return answer(a, o); }
  function inCard(a, card, node) { card.insertBefore(node, card.querySelector('.from')); return node; }
  function confirmRow(a, card, yes, no) {
    var r = a.el('div', 'confirm-row');
    [yes, no].forEach(function (l) { if (!l) return; var b = a.el('button', 'decision', l); b.type = 'button'; r.appendChild(b); });
    return inCard(a, card, r);
  }
  function chips(a, card, opts, sel, label) {
    var c = a.el('div', 'chips'); c.setAttribute('role', 'group'); c.setAttribute('aria-label', label || '');
    opts.forEach(function (o, i) { var b = a.el('button', 'chip' + (o === 'Unsure' ? ' unsure' : ''), o); b.type = 'button'; b.setAttribute('aria-pressed', String(i === sel)); c.appendChild(b); });
    return inCard(a, card, c);
  }
  function marker(a, afterSel, txt) {
    var after = document.querySelector(afterSel); if (!after) return null;
    var m = a.el('div', 'coach-marker', txt); after.insertAdjacentElement('afterend', m); return m;
  }
  function links(a, afterSel, labels) {
    var after = document.querySelector(afterSel); if (!after) return null;
    var d = a.el('div', 'coach-back-links');
    labels.forEach(function (l) { var b = a.el('button', 'link', l); b.type = 'button'; d.appendChild(b); });
    after.insertAdjacentElement('afterend', d); return d;
  }

  /* One proposal card for every proposal kind, three honest states. Built to Today's own card (#card-proposal, T-40 family):
     the eyebrow and Why sit on one baseline, the serif line below them, and a recorded card puts "Change my answer" on its
     own line under the state sentence. The only difference from Today is the timeline dot, which this screen has no rail for. */
  var FIXED = 'Nothing changes until you say yes.';   /* the app's fixed sentence, the end of every open proposal's reason */
  function proposal(a, o) {
    quiet(a); a.hide('#coach-answer');
    var old = document.querySelector('#screen-coach .proposal'); if (old) old.remove();
    var c = a.el('div', 'tcard proposal' + (o.state ? ' is-' + o.state : ''));
    var head = a.el('div', 'head');
    var kind = o.kind || 'One call needs you'; if (o.state === 'recorded' || o.state === 'declined') kind = 'Your call'; else if (o.state === 'applied') kind = 'Applied'; else if (o.state === 'superseded') kind = 'Withdrawn';
    head.appendChild(a.el('div', 'kind', kind));
    var why = a.el('button', 'link why', o.why || 'Why?'); why.type = 'button'; head.appendChild(why);
    c.appendChild(head);
    c.appendChild(a.el('div', 'lift', o.title));
    c.appendChild(a.el('div', 'change', o.change));   /* the change line stays in every state: "You said yes" keeps its object */
    if (!o.state || o.state === 'open') {
      var r = o.reason || '';
      c.appendChild(a.el('div', 'reason', r.slice(-FIXED.length) === FIXED ? r : (r ? r + ' ' + FIXED : FIXED)));
      var d = a.el('div', 'decisions');
      [o.yes, o.no].forEach(function (l) { var b = a.el('button', 'decision', l); b.type = 'button'; d.appendChild(b); });
      c.appendChild(d);
    } else {
      var rec = a.el('div', 'recorded');
      var line = a.el('span');   /* Today's #recorded-text: the state word and its sentence are one line */
      line.appendChild(a.el('span', 'state-word', o.stateWord));
      line.appendChild(document.createTextNode(' ' + (o.stateText || '')));
      rec.appendChild(line);
      if (o.undo !== false) { var u = a.el('button', 'link undo', 'Change my answer'); u.type = 'button'; rec.appendChild(u); }
      c.appendChild(rec);
      if (o.note) c.appendChild(a.el('div', 'reason', o.note));
    }
    a.$('coach-answer').insertAdjacentElement('afterend', c);
    state(a, 'answering'); noPill(a);   /* the card says what state the proposal is in; the header pill does not say it again */
    return c;
  }
  /* the same proposal the Today card carries, so the two screens read as one component */
  var SET = { kind: 'One call needs you', title: 'Chest', change: 'Add one set this week', reason: 'Your chest lifts are holding while the scale falls. One more set is the smallest move that can show up.', yes: 'Yes, add it', no: 'No, keep it as is', why: 'Why one set?' };
  function said(a, o) { return proposal(a, Object.assign({}, SET, o)); }

  /* ================= The stub the rebuild ships today ================= */
  R('C-02', { screen: C, title: 'The coach screen stub', rules: 'C01 C02 C03 C04 C05', status: 'LIVE', component: 'panel', apply: function (a) {
    a.panel({ screen: C, title: 'Ask your coach.', lead: 'Make sense of your plan and the progress behind it.', blocks: [
      { note: 'The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.' }
    ] });
  } });

  /* ================= The board and its structural states ================= */
  /* The board as it is drawn before anything is said: no data-state, so the orb keeps its outer rings.
     setCoachState('idle') is the quiet AFTER a turn, and it draws the orb without them. */
  R('C-03', { screen: C, title: 'Idle', rules: 'C01', component: 'coach board (the reference state)', apply: function () {} });

  R('C-04', { screen: C, title: 'Listening', rules: 'C01', component: 'listening indicator', apply: function (a) {
    /* the header pill already says Listening and the bars show it moving: this line says the one thing neither says,
       which is that it is his turn to talk. */
    state(a, 'listening');
    var line = document.querySelector('#screen-coach .coach-line'); line.hidden = true;
    var l = a.el('div', 'listening');
    var bars = a.el('span', 'bars'); for (var i = 0; i < 4; i++) bars.appendChild(a.el('i'));
    l.appendChild(bars); l.appendChild(a.el('span', 'go', 'Go ahead.'));
    line.insertAdjacentElement('afterend', l);
  } });

  R('C-05', { screen: C, title: 'Answering', rules: 'C04', component: 'coach answer card', apply: function (a) {
    /* the one state that is the turn itself: the answer is still arriving, so the pill is still true */
    answer(a, { said: 'You asked: what am I hitting today?', text: 'Today is upper body. Eat between 2,100 and 2,300 calories. The provisional protein target is at least 160 grams. If the bench reps come back clean: the load goes back up.' });
    a.show('#coach-state');
  } });

  R('C-06', { screen: C, title: 'Text mode for loud gyms', rules: 'C01', component: 'text input mode', apply: function (a) {
    a.attr('#screen-coach', 'data-mode', 'text');
    a.show('#coach-text');
    a.$('coach-text').querySelector('input').classList.add('is-focused');
    links(a, '#coach-text', ['Use voice']);
  } });

  R('C-07', { screen: C, title: 'Tap mode, I’ll tap instead', rules: 'C01', component: 'tap-instead control', apply: function (a) {
    a.attr('#screen-coach', 'data-mode', 'tap');
    a.noteBlock('.coach-line', 'Voice is off for this session. Tap the prompts or type.');
    a.text('#coach-tap', 'Use voice');
  } });

  R('C-08', { screen: C, title: 'Mic unavailable or denied', rules: 'C01', component: 'mic refusal block', apply: function (a) {
    /* the browser's own error, word for word: never a friendlier one. The mic itself is gone, because it cannot work,
       and the way that does work is the screen's primary: a full-width decision on the edge the mic held. */
    a.hide('.coach-line'); quiet(a);
    micOff(a, 'Microphone not available');
    var b = a.el('div', 'mic-refusal');
    b.appendChild(a.el('div', null, 'Earned could not use the microphone on this device. The browser said:'));
    b.appendChild(a.el('span', 'quoted', 'NotAllowedError: Permission denied'));
    document.querySelector('#screen-coach .coach-title').insertAdjacentElement('afterend', b);
  } });

  R('C-09', { screen: C, title: 'Session ended', rules: 'C01', component: 'session-ended block', apply: function (a) {
    var card = answer(a, { state: 'idle', text: 'The app ended the call.', from: false });
    confirmRow(a, card, 'Start again');
  } });

  R('C-64', { screen: C, title: 'Offline', rules: 'none', status: 'NOT WIRED', component: 'status pill', apply: function (a) {
    a.statusPill(C, 'This device is offline. Everything else in Earned works.');
    micOff(a, 'Voice needs a connection');
  } });

  R('C-65', { screen: C, title: 'Untraceable number caught', rules: 'C04', status: 'TEST GATE', component: 'none (a test gate)', apply: function (a) {
    marker(a, '#prompts', 'Not an athlete-facing state. A number the coach cannot trace marks the transcript and the turn does not ship.');
  } });

  /* ================= The coach asks back ================= */
  R('C-35', { screen: C, title: 'Machine unnamed', rules: 'none', component: 'coach prompt', apply: function (a) {
    answer(a, { said: 'You asked: what’s my seat?', text: 'I need to know which machine you mean.', from: false });
  } });
  R('C-39', { screen: C, title: 'Logging a set, entry missing', rules: 'T08', component: 'coach prompt', apply: function (a) {
    answer(a, { said: 'You said: log that set.', text: 'Tell me the weight and the reps you actually did.', from: false });
  } });
  R('C-40', { screen: C, title: 'Logging a set, effort missing', rules: 'T08', component: 'coach prompt, RIR chips', apply: function (a) {
    var card = answer(a, { said: 'You said: 105 for 8.', text: 'Tell me how many clean reps you had left, or say you are unsure.', from: false });
    chips(a, card, ['0', '1', '2', '3+', 'Unsure'], -1, 'Clean reps left');
  } });

  /* ================= Confirmation before anything is written ================= */
  R('C-38', { screen: C, title: 'Logging a set, confirmation needed', rules: 'T08 C02', component: 'confirm control', apply: function (a) {
    var card = answer(a, { said: 'You said: 50 for 8.', text: 'Say yes and I will log 50 lb for 8 reps. Nothing is recorded yet.', from: false });
    confirmRow(a, card, 'Yes, log it', 'No');
  } });
  R('C-43', { screen: C, title: 'Tier 1 fact, confirmation required', rules: 'C02', component: 'confirm control', apply: function (a) {
    var card = answer(a, { said: 'You said: about seven and a half hours.', text: 'Nothing is written until you say yes. I have not recorded your sleep answer.', from: false });
    confirmRow(a, card, 'Yes, log it', 'No');
  } });
  R('C-44', { screen: C, title: 'Tier 1 fact recorded', rules: 'R07', component: 'coach answer card', apply: function (a) {
    answer(a, { said: 'You said: yes.', text: 'Recorded. What went down: energy 3 of 5 on Wed, Sep 16. The plan does not change today’s session.', from: 'From this device’s encrypted local store. Example numbers.' });
  } });
  R('C-45', { screen: C, title: 'Tier 1 answer outside the approved sheet', rules: 'R07', component: 'coach answer card', apply: function (a) {
    refusal(a, { said: 'You said: my legs are wrecked.', text: 'That is not one of the answers on the check-in sheet. Soreness is recorded as none, a little, or a lot.', tail: 'Nothing was recorded.' });
  } });
  R('C-46', { screen: C, title: 'Tier 1, already recorded today', rules: 'R07', component: 'coach answer card', apply: function (a) {
    refusal(a, { said: 'You said: energy 4 of 5.', text: 'Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.', tail: 'Nothing was recorded.' });
  } });

  /* ================= Tier 2: the proposal card ================= */
  R('C-48', { screen: C, title: 'Tier 2 proposal offered', rules: 'C02 V04 P01 P02 P03', component: 'proposal card', apply: function (a) { said(a, {}); } });
  R('C-49', { screen: C, title: 'Tier 2 proposal declined', rules: 'C02', component: 'proposal card, recorded', apply: function (a) {
    said(a, { state: 'declined', stateWord: 'You said no.', stateText: 'Nothing changes.' });
  } });
  R('C-50', { screen: C, title: 'Tier 2 proposal accepted', rules: 'C02', component: 'proposal card, recorded', apply: function (a) {
    said(a, { state: 'recorded', stateWord: 'You said yes.', stateText: 'It applies when your plan is next built.' });
  } });
  R('C-50b', { screen: C, title: 'Tier 2 proposal applied by the engine', rules: 'C02', status: 'NOT WIRED', component: 'proposal card, applied', apply: function (a) {
    said(a, { state: 'applied', stateWord: 'You said yes.', stateText: 'Chest is at 11 sets this week.', why: 'Why?', undo: false });
  } });
  R('C-51', { screen: C, title: 'Tier 2, no consent surface', rules: 'C02', status: 'DORMANT', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You said: yes, add it.', text: 'There is no way on this device to record an answer to a proposal, so I have not recorded one.', tail: 'Nothing changed.' });
  } });
  R('C-52', { screen: C, title: 'Tier 2, the producer issued nothing', rules: 'V05 V06 V07 V08', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You asked: should I add a set?', text: 'The engine issued no proposal, so there is nothing to accept.', tail: 'Nothing changed.' });
  } });
  R('C-53', { screen: C, title: 'Tier 2, no re-plan entry point for this fact', rules: 'none', status: 'DORMANT', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You said: my shoulder hurts.', text: 'No engine entry point re-plans on pain, on equipment or on time away, so I cannot ask for one.', tail: 'Nothing changed.' });
  } });
  R('C-54', { screen: C, title: 'Tier 2, the model tried to construct a number', rules: 'C02', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You said: make it 12 sets.', text: 'That proposal did not come from the engine. I do not build numbers of my own, and I will not act on one.', tail: 'Nothing changed.' });
  } });
  R('C-55', { screen: C, title: 'Tier 2 proposal expired', rules: 'C02', status: 'RULED OUT', component: 'proposal card, open', apply: function (a) {
    said(a, {});
    marker(a, '#screen-coach .proposal', 'No expiry: the card stays until the plan is next built.');
  } });
  R('C-56', { screen: C, title: 'Tier 2 proposal undone after acceptance', rules: 'C02', component: 'proposal card, recorded', apply: function (a) {
    said(a, { state: 'recorded', stateWord: 'You said yes.', stateText: 'It applies when your plan is next built.', note: 'Changing your answer works until the plan is next built.' });
  } });

  /* ================= Tier 3 and the unavailable lanes ================= */
  R('C-57', { screen: C, title: 'Tier 3 refusal', rules: 'C01', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You said: lower my calorie floor.', text: 'The calorie floor is a modeled estimate using the available lean-mass input and energy-availability formula, not a proved personal safety boundary. I can read the available number and reasoning; I cannot move it.', tail: 'This conversation doesn’t change your plan.' });
  } });
  R('C-58', { screen: C, title: 'Tier 3, unrecognised topic', rules: 'C01', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You said: book me a massage.', text: 'That is not something this conversation changes.', tail: 'This conversation doesn’t change your plan.' });
  } });
  R('C-59', { screen: C, title: 'Unknown value, I do not have', rules: 'C04', component: 'coach answer card', apply: function (a) {
    answer(a, { said: 'You asked: what is my maintenance?', text: 'Maintenance is not measured yet. I do not have a number for you, and I am not going to make one up.', from: false });
  } });
  R('C-60', { screen: C, title: 'General unavailable', rules: 'C03 C04', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You asked: how much did I lift in June?', text: 'I cannot answer that from what the app holds.', tail: 'Nothing changed.' });
  } });
  R('C-61', { screen: C, title: 'No live adapter', rules: 'C05', status: 'DORMANT', component: 'refusal card', apply: function (a) {
    refusal(a, { said: 'You asked: are you a live coach?', text: 'There is no live coach in this build.', tail: 'Nothing changed.' });
  } });
  R('C-62', { screen: C, title: 'No verified spending cap', rules: 'none', status: 'DORMANT', component: 'cap refusal block', apply: function (a) {
    refusal(a, { said: 'You said: start a voice session.', text: 'A live voice session cannot start on this build: there is no verified spending cap for it, and there is no way to override that here.', quoted: 'COACH_COST_CAP_ABSENT' });
  } });
  R('C-63', { screen: C, title: 'Opt-in required', rules: 'none', status: 'DORMANT', component: 'opt-in panel', apply: function (a) {
    a.panel({ screen: C, title: 'Voice coaching', lead: 'Voice is off until you turn it on. Everything else in Earned works without it.', blocks: [
      { h: 'What it uses' },
      { p: 'The microphone on this phone, while a session is open. The mic is off at every other moment.' },
      { p: 'The audio of what you say, and the text of what you say and what is said back.' },
      { h: 'Where it goes' },
      { p: 'That audio and that text leave this phone so they can be answered, and the answer comes back here.' },
      { p: 'Nothing else leaves. Your weigh-ins, your sets and your check-ins stay in this device’s encrypted local store.' },
      { note: 'This is your choice alone, and you can turn it off again at any time.' },
      { actions: [{ label: 'Turn on voice' }, { label: 'Not now' }] }
    ] });
  } });

  /* ================= The answer variants: copy on the one answer card ================= */
  [
    ['C-10', 'Answer, today’s plan', 'LIVE', 'T02 N01 N05 R05', 'Today is upper body. Eat between 2,100 and 2,300 calories. The provisional protein target is at least 160 grams. If the bench reps come back clean: the load goes back up.'],
    ['C-11', 'Answer, no session today', 'LIVE', 'V01', 'There is no training session on the board today.'],
    ['C-12', 'Answer, no calorie band', 'LIVE', 'N05 C04', 'I do not have a calorie band for you today, so I am not going to make one up.'],
    ['C-13', 'Answer, no protein target', 'LIVE', 'N01 C04', 'I do not have a protein target for you.'],
    ['C-14', 'Answer, protein target present', 'LIVE', 'N01', 'At least 160 grams is the provisional protein target, using the available lean-mass input. It is not a measured personal minimum.'],
    ['C-15', 'Answer, weight trend', 'LIVE', 'N02 N04', 'Your trend weight is 181.4 pounds. You are losing about 0.9 pounds a week, somewhere between 0.6 and 1.2 pounds a week, measured across 14 readings from Aug 20 to Sep 16. Your last reading was Sep 16.'],
    ['C-16', 'Answer, no trend weight', 'LIVE', 'N02', 'There is no trend weight on this device yet.'],
    ['C-17', 'Answer, rate not measured', 'LIVE', 'N02 N04', 'The rate is not measured yet, so I have no weekly number for you.'],
    ['C-18', 'Answer, no reading stored', 'LIVE', 'N02', 'No reading is stored yet.'],
    ['C-19', 'Answer, why this instruction', 'LIVE', 'T04 R05 N03', 'Hold the bench at 105 and let the reps come back. Two sets came up short last session, so the engine keeps the load until the reps are clean.'],
    ['C-20', 'Answer, the engine has no reason', 'LIVE', 'N03 N10 C04', 'The engine gave no reasoning for that number.'],
    ['C-21', 'Answer, the current set', 'LIVE', 'T01 T02 T08', 'Chest press, set 2 of 3. 105 lb for 8 reps. Aim to finish with 2 clean reps left. Seat 4.'],
    ['C-22', 'Answer, no current set', 'LIVE', 'T13', 'The session is not started, so there is no current set.'],
    ['C-23', 'Answer, no session composed', 'LIVE', 'T13 V01', 'No gym session is composed on this device. Nothing changed.'],
    ['C-24', 'Answer, next set', 'LIVE', 'T01 T02', 'Next is seated row, set 1 of 3. 90 lb for 10 reps. Aim to finish with 2 clean reps left.'],
    ['C-25', 'Answer, that was the last set', 'LIVE', 'T09', 'That was the last set.'],
    ['C-26', 'Answer, last comparable', 'LIVE', 'T03', 'Last time on this machine at this seat: 105 lb × 8 reps on Sep 9. Nothing else on file is comparable.'],
    ['C-27', 'Answer, no qualified comparison', 'LIVE', 'T03', 'I have nothing comparable on file for that lift, and I am not going to reach into the session log for something that is not.'],
    ['C-28', 'Answer, the check-in read back', 'LIVE', 'R07 R04', 'From your check-in on Wed, Sep 16. You were asked how your energy was, and you said 3 of 5. The plan keeps today’s session as it is.'],
    ['C-29', 'Answer, nothing recorded for the check-in', 'LIVE', 'R07', 'Nothing is recorded for the check-in on Wed, Sep 16.'],
    ['C-30', 'Answer, the sleep record already holds the night', 'DORMANT', 'R01 R07', 'Your sleep record already has the night of Tue, Sep 15: 7.2 hours. I would ask you to confirm that rather than ask again.'],
    ['C-31', 'Answer, no check-in lane', 'LIVE', 'R07', 'There is no check-in lane on this device. Nothing changed.'],
    ['C-32', 'Machine settings recalled', 'LIVE', 'none', 'Chest press seat 4, back pad 2. Keep the handles on the low setting. That is what you told me, and I kept it.'],
    ['C-33', 'Machine setting unknown', 'LIVE', 'C04', 'I do not have it yet. Tell me while you are there and I will keep it.'],
    ['C-34', 'No place to keep machine settings', 'LIVE', 'none', 'There is no place on this device to keep machine settings yet, so I have none to read back.'],
    ['C-36', 'Machine settings captured', 'LIVE', 'none', 'Kept: chest press seat 4, back pad 2. I will read it back next time you ask.'],
    ['C-37', 'Machine settings could not be kept', 'LIVE', 'none', 'I could not keep that, and I have kept nothing.'],
    ['C-41', 'Logging a set, no session', 'LIVE', 'T13 V01', 'No gym session is composed on this device, so there is no set to log.'],
    ['C-42', 'Set logged', 'LIVE', 'T01 T08 T09', 'Logged set 2. 105 lb for 8 reps, 2 clean reps left. Next is seated row, set 1.'],
    ['C-47', 'Tier 1, equipment unavailable', 'DORMANT', 'none', 'I have not recorded which machine you used. There is no field for equipment anywhere in this app, so there is nowhere to keep it.']
  ].forEach(function (r) {
    R(r[0], { screen: C, title: r[1], status: r[2], rules: r[3], component: 'answer card (copy variant)', apply: function (a) { answer(a, { text: r[4] }); } });
  });
})();
