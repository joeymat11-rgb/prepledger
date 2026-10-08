/* coach-app.mjs - C-UI-6, THE COACH SCREEN of the 2026-09-18 design of record.

   What this module is. The view the Coach route paints: the pack's #screen-coach
   (rebuild/m1/approved-2026-09-18/app/app.html) cloned from the shipped template
   `t-coach`, element for element, with the same classes, mounted as the chassis the
   pack draws: a scrolling `.body` and a fixed `.stack` as the two children of the
   live `.ui` host. Its structural states are the pack's own (app/states-coach.js,
   C-02 to C-65 and C-50b), ported move for move onto this real view, so the review
   hook `?state=C-nn` puts THIS screen into THAT look and the pack's two gates judge
   the real client, not the prototype.

   What it is not (C-UI-6 LOCKED, rebuild/coach/tools.cjs header): no live adapter, no
   network, no audio. Nothing here opens the microphone, fetches, records or writes.
   With no live coach in this build, every way of asking (a prompt, the mic, the text
   box) answers with the pack's own refusal card for that fact (C-61): "There is no
   live coach in this build." and "Nothing changed." The orb states (idle, listening,
   answering) and the level ring are real and reachable through the states; the ring
   follows a level source only when one is handed in (`level`), and this lane hands in
   none, so it stays still at its listening weight exactly as the pack draws it "without
   permission (or in a review frame)". Nothing pulses while idle: this module owns no
   loop, no interval and no animation; the embers are the scene's alone.

   Every visible word is in the region between the two COACH-COPY markers below, and
   design.cjs (assertCoachBinding) holds each quoted string there to occur verbatim in
   the pinned approved references and to carry no dash. A word typed here that the
   design does not have fails the build. */

/* COACH-COPY-START */
export const COACH_COPY = Object.freeze({
  idle: 'Idle',
  listening: 'Listening',
  answering: 'Answering',
  speak: 'Tap to speak',
  stop: 'Tap to stop',
  textMode: 'Use text mode',
  voice: 'Use voice',
  tapInstead: 'I’ll tap instead',
  tapNote: 'Voice is off for this session. Tap the prompts or type.',
  goAhead: 'Go ahead.',
  noLiveCoach: 'There is no live coach in this build.',
  nothingChanged: 'Nothing changed.',
  fixed: 'Nothing changes until you say yes.',
  oneCall: 'One call needs you',
  yourCall: 'Your call',
  applied: 'Applied',
  withdrawn: 'Withdrawn',
  why: 'Why?',
  changeAnswer: 'Change my answer',
});

/* the same proposal the Today card carries, so the two screens read as one component */
const SET = Object.freeze({ kind: 'One call needs you', title: 'Chest', change: 'Add one set this week',
  reason: 'Your chest lifts are holding while the scale falls. One more set is the smallest move that can show up.',
  yes: 'Yes, add it', no: 'No, keep it as is', why: 'Why one set?' });

const C10 = 'Today is upper body. Eat between 2,100 and 2,300 calories. The provisional protein target is at least 160 grams. If the bench reps come back clean: the load goes back up.';

/* The coach states of the pack, in the order of quality/baseline/states/INDEX.json.
   Each run makes the same moves app/states-coach.js makes, on this view.
   No straight apostrophe may appear in a comment inside this region. */
const STATE_TABLE = [
  { id: 'C-02', title: 'The coach screen stub', rules: 'C01 C02 C03 C04 C05', status: 'LIVE', component: 'panel',
    run: (v) => v.panel({ title: 'Ask your coach.', lead: 'Make sense of your plan and the progress behind it.', blocks: [
      { note: 'The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records.' },
    ] }) },
  { id: 'C-03', title: 'Idle', rules: 'C01', component: 'coach board (the reference state)', run: () => {} },
  { id: 'C-04', title: 'Listening', rules: 'C01', component: 'listening indicator', run: (v) => v.listen() },
  { id: 'C-05', title: 'Answering', rules: 'C04', component: 'coach answer card', run: (v) => {
    v.answer({ said: 'You asked: what am I hitting today?', text: C10 });
    v.showPill();
  } },
  { id: 'C-06', title: 'Text mode for loud gyms', rules: 'C01', component: 'text input mode', run: (v) => v.textMode(true) },
  { id: 'C-07', title: 'Tap mode, I’ll tap instead', rules: 'C01', component: 'tap-instead control', run: (v) => v.tapMode(true) },
  { id: 'C-08', title: 'Mic unavailable or denied', rules: 'C01', component: 'mic refusal block', run: (v) => {
    v.hideLine(); v.quiet();
    v.micOff('Microphone not available');
    v.micRefusal('Earned could not use the microphone on this device. The browser said:', 'NotAllowedError: Permission denied');
  } },
  { id: 'C-09', title: 'Session ended', rules: 'C01', component: 'session-ended block', run: (v) => {
    const card = v.answer({ state: 'idle', text: 'The app ended the call.', from: false });
    v.confirmRow(card, 'Start again');
  } },
  { id: 'C-64', title: 'Offline', rules: 'none', status: 'NOT WIRED', component: 'status pill', run: (v) => {
    v.statusPill('This device is offline. Everything else in Earned works.');
    v.micOff('Voice needs a connection');
  } },
  { id: 'C-65', title: 'Untraceable number caught', rules: 'C04', status: 'TEST GATE', component: 'none (a test gate)', run: (v) => {
    v.marker(v.prompts, 'Not an athlete-facing state. A number the coach cannot trace marks the transcript and the turn does not ship.');
  } },
  { id: 'C-35', title: 'Machine unnamed', rules: 'none', component: 'coach prompt', run: (v) => {
    v.answer({ said: 'You asked: what’s my seat?', text: 'I need to know which machine you mean.', from: false });
  } },
  { id: 'C-39', title: 'Logging a set, entry missing', rules: 'T08', component: 'coach prompt', run: (v) => {
    v.answer({ said: 'You said: log that set.', text: 'Tell me the weight and the reps you actually did.', from: false });
  } },
  { id: 'C-40', title: 'Logging a set, effort missing', rules: 'T08', component: 'coach prompt, RIR chips', run: (v) => {
    const card = v.answer({ said: 'You said: 105 for 8.', text: 'Tell me how many clean reps you had left, or say you are unsure.', from: false });
    v.chips(card, ['0', '1', '2', '3+', 'Unsure'], -1, 'Clean reps left');
  } },
  { id: 'C-38', title: 'Logging a set, confirmation needed', rules: 'T08 C02', component: 'confirm control', run: (v) => {
    const card = v.answer({ said: 'You said: 50 for 8.', text: 'Say yes and I will log 50 lb for 8 reps. Nothing is recorded yet.', from: false });
    v.confirmRow(card, 'Yes, log it', 'No');
  } },
  { id: 'C-43', title: 'Tier 1 fact, confirmation required', rules: 'C02', component: 'confirm control', run: (v) => {
    const card = v.answer({ said: 'You said: about seven and a half hours.', text: 'Nothing is written until you say yes. I have not recorded your sleep answer.', from: false });
    v.confirmRow(card, 'Yes, log it', 'No');
  } },
  { id: 'C-44', title: 'Tier 1 fact recorded', rules: 'R07', component: 'coach answer card', run: (v) => {
    v.answer({ said: 'You said: yes.', text: 'Recorded. What went down: energy 3 of 5 on Wed, Sep 16. The plan does not change today’s session.', from: 'From this device’s encrypted local store. Example numbers.' });
  } },
  { id: 'C-45', title: 'Tier 1 answer outside the approved sheet', rules: 'R07', component: 'coach answer card', run: (v) => {
    v.refusal({ said: 'You said: my legs are wrecked.', text: 'That is not one of the answers on the check-in sheet. Soreness is recorded as none, a little, or a lot.', tail: 'Nothing was recorded.' });
  } },
  { id: 'C-46', title: 'Tier 1, already recorded today', rules: 'R07', component: 'coach answer card', run: (v) => {
    v.refusal({ said: 'You said: energy 4 of 5.', text: 'Today’s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet.', tail: 'Nothing was recorded.' });
  } },
  { id: 'C-48', title: 'Tier 2 proposal offered', rules: 'C02 V04 P01 P02 P03', component: 'proposal card', run: (v) => v.proposal({ ...SET }) },
  { id: 'C-49', title: 'Tier 2 proposal declined', rules: 'C02', component: 'proposal card, recorded', run: (v) => {
    v.proposal({ ...SET, state: 'declined', stateWord: 'You said no.', stateText: 'Nothing changes.' });
  } },
  { id: 'C-50', title: 'Tier 2 proposal accepted', rules: 'C02', component: 'proposal card, recorded', run: (v) => {
    v.proposal({ ...SET, state: 'recorded', stateWord: 'You said yes.', stateText: 'It applies when your plan is next built.' });
  } },
  { id: 'C-50b', title: 'Tier 2 proposal applied by the engine', rules: 'C02', status: 'NOT WIRED', component: 'proposal card, applied', run: (v) => {
    v.proposal({ ...SET, state: 'applied', stateWord: 'You said yes.', stateText: 'Chest is at 11 sets this week.', why: 'Why?', undo: false });
  } },
  { id: 'C-51', title: 'Tier 2, no consent surface', rules: 'C02', status: 'DORMANT', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You said: yes, add it.', text: 'There is no way on this device to record an answer to a proposal, so I have not recorded one.', tail: 'Nothing changed.' });
  } },
  { id: 'C-52', title: 'Tier 2, the producer issued nothing', rules: 'V05 V06 V07 V08', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You asked: should I add a set?', text: 'The engine issued no proposal, so there is nothing to accept.', tail: 'Nothing changed.' });
  } },
  { id: 'C-53', title: 'Tier 2, no re-plan entry point for this fact', rules: 'none', status: 'DORMANT', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You said: my shoulder hurts.', text: 'No engine entry point re-plans on pain, on equipment or on time away, so I cannot ask for one.', tail: 'Nothing changed.' });
  } },
  { id: 'C-54', title: 'Tier 2, the model tried to construct a number', rules: 'C02', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You said: make it 12 sets.', text: 'That proposal did not come from the engine. I do not build numbers of my own, and I will not act on one.', tail: 'Nothing changed.' });
  } },
  { id: 'C-55', title: 'Tier 2 proposal expired', rules: 'C02', status: 'RULED OUT', component: 'proposal card, open', run: (v) => {
    const card = v.proposal({ ...SET });
    v.marker(card, 'No expiry: the card stays until the plan is next built.');
  } },
  { id: 'C-56', title: 'Tier 2 proposal undone after acceptance', rules: 'C02', component: 'proposal card, recorded', run: (v) => {
    v.proposal({ ...SET, state: 'recorded', stateWord: 'You said yes.', stateText: 'It applies when your plan is next built.', note: 'Changing your answer works until the plan is next built.' });
  } },
  { id: 'C-57', title: 'Tier 3 refusal', rules: 'C01', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You said: lower my calorie floor.', text: 'The calorie floor is a modeled estimate using the available lean-mass input and energy-availability formula, not a proved personal safety boundary. I can read the available number and reasoning; I cannot move it.', tail: 'This conversation doesn’t change your plan.' });
  } },
  { id: 'C-58', title: 'Tier 3, unrecognised topic', rules: 'C01', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You said: book me a massage.', text: 'That is not something this conversation changes.', tail: 'This conversation doesn’t change your plan.' });
  } },
  { id: 'C-59', title: 'Unknown value, I do not have', rules: 'C04', component: 'coach answer card', run: (v) => {
    v.answer({ said: 'You asked: what is my maintenance?', text: 'Maintenance is not measured yet. I do not have a number for you, and I am not going to make one up.', from: false });
  } },
  { id: 'C-60', title: 'General unavailable', rules: 'C03 C04', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You asked: how much did I lift in June?', text: 'I cannot answer that from what the app holds.', tail: 'Nothing changed.' });
  } },
  { id: 'C-61', title: 'No live adapter', rules: 'C05', status: 'DORMANT', component: 'refusal card', run: (v) => {
    v.refusal({ said: 'You asked: are you a live coach?', text: 'There is no live coach in this build.', tail: 'Nothing changed.' });
  } },
  { id: 'C-62', title: 'No verified spending cap', rules: 'none', status: 'DORMANT', component: 'cap refusal block', run: (v) => {
    v.refusal({ said: 'You said: start a voice session.', text: 'A live voice session cannot start on this build: there is no verified spending cap for it, and there is no way to override that here.', quoted: 'COACH_COST_CAP_ABSENT' });
  } },
  { id: 'C-63', title: 'Opt-in required', rules: 'none', status: 'DORMANT', component: 'opt-in panel', run: (v) => {
    v.panel({ title: 'Voice coaching', lead: 'Voice is off until you turn it on. Everything else in Earned works without it.', blocks: [
      { h: 'What it uses' },
      { p: 'The microphone on this phone, while a session is open. The mic is off at every other moment.' },
      { p: 'The audio of what you say, and the text of what you say and what is said back.' },
      { h: 'Where it goes' },
      { p: 'That audio and that text leave this phone so they can be answered, and the answer comes back here.' },
      { p: 'Nothing else leaves. Your weigh-ins, your sets and your check-ins stay in this device’s encrypted local store.' },
      { note: 'This is your choice alone, and you can turn it off again at any time.' },
      { actions: [{ label: 'Turn on voice' }, { label: 'Not now' }] },
    ] });
  } },
];

/* The answer variants: copy on the one answer card */
const ANSWER_VARIANTS = [
  ['C-10', 'Answer, today’s plan', 'LIVE', 'T02 N01 N05 R05', C10],
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
  ['C-47', 'Tier 1, equipment unavailable', 'DORMANT', 'none', 'I have not recorded which machine you used. There is no field for equipment anywhere in this app, so there is nowhere to keep it.'],
];
const ANSWER_COMPONENT = 'answer card (copy variant)';
/* COACH-COPY-END */

const COACH_SCREEN = "coach";

/* The whole state list, in the order the pack's INDEX.json files it. */
export const COACH_STATES = Object.freeze([
  ...STATE_TABLE.map((row) => Object.freeze({ id: row.id, title: row.title, status: row.status || "LIVE",
    rules: row.rules || "", component: row.component || "", run: row.run })),
  ...ANSWER_VARIANTS.map(([id, title, status, rules, text]) => Object.freeze({ id, title, status, rules,
    component: ANSWER_COMPONENT, run: (v) => { v.answer({ text }); } })),
]);
const BY_ID = new Map(COACH_STATES.map((state) => [state.id, state]));

/* Every class this view writes at runtime (the template's own classes are bound by
   design.cjs's template check). design.cjs holds each to be a selector in the pinned
   approved stylesheets. */
export const COACH_CLASSES = Object.freeze(["said", "tail", "quoted", "is-refusal", "confirm-row", "decision",
  "chips", "chip", "unsure", "coach-marker", "coach-back-links", "link", "tcard", "proposal", "head", "kind",
  "why", "lift", "change", "reason", "decisions", "recorded", "state-word", "undo", "listening", "bars", "go",
  "mic-refusal", "mic-alt", "note-block", "status-pill", "panel", "panel-body", "scrolls", "panel-title",
  "panel-lead", "eyebrow", "panel-h", "panel-p", "pactions", "is-last", "has-panel", "has-back", "is-focused",
  "is-recorded", "is-declined", "is-applied"]);

/* The level ring's arithmetic, lifted from the pack (app/app.js levelLoop). A level
   SOURCE is whatever later lane owns audio; this module only turns samples into a
   level and a level into the ring. */
export function levelFromSamples(samples) {
  if (!samples || !samples.length) return 0;
  let sum = 0;
  for (let at = 0; at < samples.length; at += 1) { const value = (samples[at] - 128) / 128; sum += value * value; }
  const rms = Math.sqrt(sum / samples.length);
  return Math.min(1, Math.max(0, (rms - 0.015) * 6));
}
export function smoothLevel(current, target) {
  const now = Number.isFinite(current) ? current : 0;
  const next = Math.min(1, Math.max(0, Number.isFinite(target) ? target : 0));
  return now + (next - now) * (next > now ? 0.5 : 0.12);   /* quick up, slow down */
}

function scrollFades(el, view, cleanups) {
  if (!el || !view) return;
  const update = () => {
    const can = el.scrollHeight > el.clientHeight + 1;
    const end = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    el.classList.toggle("can-scroll", can);
    el.classList.toggle("at-end", !can || end);
    el.classList.toggle("at-start", !can || el.scrollTop <= 1);
  };
  el.addEventListener("scroll", update, { passive: true });
  view.addEventListener("resize", update);
  let observer = null;
  if (typeof view.MutationObserver === "function") {
    observer = new view.MutationObserver(update);
    observer.observe(el, { attributes: true, subtree: true, childList: true, characterData: true });
  }
  const fonts = view.document && view.document.fonts;
  if (fonts && fonts.ready && typeof fonts.ready.then === "function") fonts.ready.then(update, () => {});
  update();
  cleanups.push(() => { view.removeEventListener("resize", update); if (observer) observer.disconnect(); });
}

/* ONE STATE READ PER PAGE LOAD. The pack applies `?state=` once, on load; so does this.
   A later visit to the coach in the same page is the live screen. */
const REVIEW_STATE_TAKEN = new WeakSet();
function reviewStateOnce(view) {
  if (!view || !view.location || REVIEW_STATE_TAKEN.has(view)) return null;
  REVIEW_STATE_TAKEN.add(view);
  const found = /[?&]state=([A-Za-z0-9-]+)/.exec(view.location.search || "");
  return found && BY_ID.has(found[1]) ? found[1] : null;
}

/* The coach screen. `phone` is the live `.ui` host; `back` leaves the screen; `level`
   is an optional level source { start(onLevel), stop() }; `timers` lets a test drive
   the orb's settle. Returns the view, whose `close()` takes back every attribute it
   put on the screen frame. */
export function openCoach({ doc, phone, back = () => {}, focus = false, state, level = null, timers = null } = {}) {
  if (!doc || !phone) throw new Error("Coach: a document and a host are required");
  const template = doc.getElementById("t-coach");
  if (!template) throw new Error("Coach: missing approved template t-coach");
  const content = template.content.cloneNode(true);
  const body = content.querySelector(".body"), stack = content.querySelector(".stack");
  if (!body || !stack) throw new Error("Coach: the t-coach template is not the pack's chassis");
  phone.replaceChildren(body, stack);

  const view = doc.defaultView || null;
  /* the screen frame is looked up each time: scene.mjs may wrap the host after a mount */
  const screenFrame = () => (typeof phone.closest === "function" && phone.closest(".screen")) || phone;
  const clock = timers || (view ? { setTimeout: view.setTimeout.bind(view), clearTimeout: view.clearTimeout.bind(view) }
    : { setTimeout: () => null, clearTimeout: () => {} });
  const $ = (selector) => phone.querySelector(selector);
  const el = (tag, cls, text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== null && text !== undefined) node.textContent = text;
    return node;
  };
  const button = (cls, text) => { const node = el("button", cls, text); node.type = "button"; return node; };
  const cleanups = [];
  let settle = null, levelOn = false, panelState = null, closed = false;

  const pill = $("#coach-state"), pillText = $("#coach-state-text");
  const prompts = $("#prompts"), card = $("#coach-answer"), cardText = $("#coach-answer-text");
  const from = card.querySelector(".from"), fromDefault = from.textContent;
  const line = $(".coach-line"), title = $(".coach-title"), header = $(".header");
  const text = $("#coach-text"), input = text.querySelector("input"), send = text.querySelector("button");
  const textLink = $("#coach-text-mode"), tapLink = $("#coach-tap");
  const mic = $("#mic"), micLabel = $("#mic-label"), micWrap = $(".mic-wrap"), links = $(".coach-links");

  function setCoachState(value) {
    screenFrame().setAttribute("data-state", value);
    pillText.textContent = value === "listening" ? COACH_COPY.listening
      : (value === "answering" ? COACH_COPY.answering : COACH_COPY.idle);
    pill.hidden = value === "idle";   /* quiet is quiet: the pill appears only while something is happening */
    mic.setAttribute("aria-pressed", String(value === "listening"));
    micLabel.textContent = value === "listening" ? COACH_COPY.stop : COACH_COPY.speak;
  }
  const noPill = () => { pill.hidden = true; };
  const showPill = () => { pill.hidden = false; };
  const quiet = () => { prompts.hidden = true; };
  const inCard = (host, node) => { host.insertBefore(node, host.querySelector(".from")); return node; };

  /* One answer card for every answer the coach gives. o: { said, text, tail, quoted, from, refusal, state } */
  function answer(o) {
    quiet();
    card.hidden = false;
    card.className = "coach-answer" + (o.refusal ? " is-refusal" : "");
    for (const old of card.querySelectorAll(".said, .confirm-row, .chips")) old.remove();
    if (o.said) card.insertBefore(el("div", "said", o.said), card.firstChild);
    cardText.textContent = o.text || "";
    if (o.tail) cardText.appendChild(el("span", "tail", o.tail));
    if (o.quoted) cardText.appendChild(el("span", "quoted", o.quoted));
    from.hidden = o.from === false;
    from.textContent = typeof o.from === "string" ? o.from : fromDefault;
    setCoachState(o.state || "answering");
    noPill();   /* the card is the answer; the pill has nothing left to report */
    return card;
  }
  const refusal = (o) => answer({ ...o, refusal: true, from: o.from === undefined ? false : o.from });
  function confirmRow(host, yes, no) {
    const row = el("div", "confirm-row");
    for (const label of [yes, no]) if (label) row.appendChild(button("decision", label));
    return inCard(host, row);
  }
  function chips(host, options, selected, label) {
    const group = el("div", "chips");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label || "");
    options.forEach((option, at) => {
      const chip = button("chip" + (option === "Unsure" ? " unsure" : ""), option);
      chip.setAttribute("aria-pressed", String(at === selected));
      group.appendChild(chip);
    });
    return inCard(host, group);
  }
  function marker(after, words) {
    if (!after) return null;
    const node = el("div", "coach-marker", words);
    after.insertAdjacentElement("afterend", node);
    return node;
  }
  function backLinks(after, labels) {
    const row = el("div", "coach-back-links");
    const made = labels.map((label) => row.appendChild(button("link", label)));
    after.insertAdjacentElement("afterend", row);
    return { row, made };
  }

  /* One proposal card for every proposal kind, three honest states (Today's own card). */
  function proposal(o) {
    quiet();
    card.hidden = true;
    for (const old of phone.querySelectorAll(".proposal")) old.remove();
    const node = el("div", "tcard proposal" + (o.state ? " is-" + o.state : ""));
    const head = el("div", "head");
    let kind = o.kind || COACH_COPY.oneCall;
    if (o.state === "recorded" || o.state === "declined") kind = COACH_COPY.yourCall;
    else if (o.state === "applied") kind = COACH_COPY.applied;
    else if (o.state === "superseded") kind = COACH_COPY.withdrawn;
    head.appendChild(el("div", "kind", kind));
    head.appendChild(button("link why", o.why || COACH_COPY.why));
    node.appendChild(head);
    node.appendChild(el("div", "lift", o.title));
    node.appendChild(el("div", "change", o.change));   /* the change line stays in every state */
    if (!o.state || o.state === "open") {
      const reason = o.reason || "";
      const fixed = COACH_COPY.fixed;
      node.appendChild(el("div", "reason", reason.slice(-fixed.length) === fixed ? reason : (reason ? reason + " " + fixed : fixed)));
      const decisions = el("div", "decisions");
      for (const label of [o.yes, o.no]) decisions.appendChild(button("decision", label));
      node.appendChild(decisions);
    } else {
      const recorded = el("div", "recorded");
      const sentence = el("span");   /* the state word and its sentence are one line */
      sentence.appendChild(el("span", "state-word", o.stateWord));
      sentence.appendChild(doc.createTextNode(" " + (o.stateText || "")));
      recorded.appendChild(sentence);
      if (o.undo !== false) recorded.appendChild(button("link undo", COACH_COPY.changeAnswer));
      node.appendChild(recorded);
      if (o.note) node.appendChild(el("div", "reason", o.note));
    }
    card.insertAdjacentElement("afterend", node);
    setCoachState("answering");
    noPill();
    return node;
  }

  /* Where voice cannot work there is no mic: the disc goes, one line says why, and the
     path that does work is the screen's primary on the edge the mic held. */
  function micOff(label, alt) {
    screenFrame().setAttribute("data-mic", "off");
    micLabel.textContent = label;
    mic.setAttribute("aria-hidden", "true");
    mic.setAttribute("tabindex", "-1");
    links.hidden = true;
    const old = micWrap.querySelector(".mic-alt");
    if (old) old.remove();
    const choice = button("decision mic-alt", alt || COACH_COPY.tapInstead);
    micWrap.insertBefore(choice, micLabel);
    return choice;
  }
  function micRefusal(sentence, quoted) {
    const block = el("div", "mic-refusal");
    block.appendChild(el("div", null, sentence));
    block.appendChild(el("span", "quoted", quoted));
    title.insertAdjacentElement("afterend", block);
    return block;
  }
  function statusPill(words) {
    const old = phone.querySelector(".status-pill");
    if (old) old.remove();
    const node = el("div", "status-pill", words);
    const panel = phone.querySelector(".panel");
    const anchor = panel ? (panel.querySelector(".panel-lead") || panel.querySelector(".panel-title"))
      : (line || phone.querySelector(".hairline"));
    anchor.insertAdjacentElement("afterend", node);
    return node;
  }
  function noteBlock(after, words) {
    const node = el("div", "note-block", words);
    after.insertAdjacentElement("afterend", node);
    return node;
  }

  /* The listening look: the orb and the mic warm, the level ring on, and the line
     under the title says whose turn it is. A level source, when one is handed in, moves
     the ring; with none the ring holds its listening weight. */
  function listen() {
    setCoachState("listening");
    line.hidden = true;
    const row = el("div", "listening");
    const bars = el("span", "bars");
    for (let at = 0; at < 4; at += 1) bars.appendChild(el("i"));
    row.appendChild(bars);
    row.appendChild(el("span", "go", COACH_COPY.goAhead));
    line.insertAdjacentElement("afterend", row);
    if (level && typeof level.start === "function") {
      let current = 0;
      levelOn = true;
      screenFrame().setAttribute("data-level", "live");
      try {
        const started = level.start((value) => {
          if (!levelOn) return;
          current = smoothLevel(current, value);
          screenFrame().style.setProperty("--level", current.toFixed(3));
        });
        if (started && typeof started.then === "function") started.then(null, () => screenFrame().setAttribute("data-level", "unavailable"));
      } catch (_) { screenFrame().setAttribute("data-level", "unavailable"); }
    }
    return row;
  }
  function stopLevel() {
    if (levelOn && level && typeof level.stop === "function") { try { level.stop(); } catch (_) { /* nothing to keep */ } }
    levelOn = false;
    screenFrame().style.removeProperty("--level");
    screenFrame().removeAttribute("data-level");
  }

  /* Text mode for loud gyms: the input with the caret in it, and the way back to voice. */
  let textBack = null;
  function textMode(on, { focusInput = false } = {}) {
    if (on) {
      screenFrame().setAttribute("data-mode", "text");
      text.hidden = false;
      if (!textBack) {
        textBack = backLinks(text, [COACH_COPY.voice]);
        textBack.made[0].addEventListener("click", () => textMode(false));
      }
      if (focusInput) { try { input.focus(); } catch (_) { /* focus is a convenience */ } }
      else input.classList.add("is-focused");
    } else {
      if (screenFrame().getAttribute("data-mode") === "text") screenFrame().removeAttribute("data-mode");
      text.hidden = true;
      input.classList.remove("is-focused");
      if (textBack) { textBack.row.remove(); textBack = null; }
    }
  }
  /* Tap mode: voice off for the session, the prompts and the text box still work. */
  let tapNote = null;
  function tapMode(on) {
    if (on) {
      screenFrame().setAttribute("data-mode", "tap");
      if (!tapNote) tapNote = noteBlock(line, COACH_COPY.tapNote);
      tapLink.textContent = COACH_COPY.voice;
    } else {
      if (screenFrame().getAttribute("data-mode") === "tap") screenFrame().removeAttribute("data-mode");
      if (tapNote) { tapNote.remove(); tapNote = null; }
      tapLink.textContent = COACH_COPY.tapInstead;
    }
  }

  /* A panel: a sub screen under the same header (C-02 the stub, C-63 the opt-in). */
  function block(spec) {
    if (spec.h) return el("div", "eyebrow panel-h", spec.h);
    if (spec.p) return el("p", "panel-p" + (spec.muted ? " muted" : ""), spec.p);
    if (spec.note) return el("div", "note-block", spec.note);
    if (spec.actions) {
      const group = el("div", "pactions");
      for (const action of spec.actions) group.appendChild(button("decision", action.label));
      return group;
    }
    return el("div", null, "");
  }
  function panel(spec) {
    closePanel();
    const stowed = [];
    for (const child of [...body.children]) {
      if (child.classList.contains("header") || child.classList.contains("hairline") || child.hidden) continue;
      child.hidden = true; stowed.push(child);
    }
    if (!stack.hidden) { stack.hidden = true; stowed.push(stack); }
    const section = el("section", "panel");
    section.setAttribute("aria-label", spec.title || "");
    const inner = el("div", "panel-body scrolls");
    section.appendChild(inner);
    if (spec.title) inner.appendChild(el("h1", "panel-title", spec.title));
    if (spec.lead) inner.appendChild(el("p", "panel-lead", spec.lead));
    const nodes = (spec.blocks || []).map((entry) => inner.appendChild(block(entry)));
    body.appendChild(section);
    const last = nodes[nodes.length - 1];
    if (last && last.classList.contains("pactions")) { last.classList.add("is-last"); section.appendChild(last); }
    screenFrame().classList.add("has-panel");
    header.classList.add("has-back");
    const panelEnd = () => {
      const kids = [...inner.children].filter((child) => !child.hidden);
      const end = kids[kids.length - 1];
      if (!end) return;
      const bottom = end.getBoundingClientRect().bottom - inner.getBoundingClientRect().top + inner.scrollTop;
      inner.style.setProperty("--panel-end", Math.max(0, Math.round(bottom)) + "px");
    };
    panelEnd();
    const fonts = doc.fonts;
    if (fonts && fonts.ready && typeof fonts.ready.then === "function") fonts.ready.then(panelEnd, () => {});
    if (view) { view.addEventListener("resize", panelEnd); cleanups.push(() => view.removeEventListener("resize", panelEnd)); }
    scrollFades(inner, view, cleanups);
    panelState = { section, stowed };
    return section;
  }
  function closePanel() {
    if (!panelState) return false;
    panelState.section.remove();
    for (const child of panelState.stowed) child.hidden = false;
    header.classList.remove("has-back");
    screenFrame().classList.remove("has-panel");
    panelState = null;
    return true;
  }

  /* THE LIVE SCREEN, with no live coach in this build. Asking, in any of the three
     ways, is answered by the pack's refusal card for exactly that fact (C-61), and
     nothing is recorded, sent or heard. The orb answers warm, then settles, as the
     pack's own answer does. */
  function noLiveCoach() {
    if (settle !== null) { clock.clearTimeout(settle); settle = null; }
    refusal({ text: COACH_COPY.noLiveCoach, tail: COACH_COPY.nothingChanged });
    settle = clock.setTimeout(() => {
      settle = null;
      if (!closed && screenFrame().getAttribute("data-state") === "answering") setCoachState("idle");
    }, 4000);
  }
  prompts.addEventListener("click", (event) => { if (event.target.closest(".prompt")) noLiveCoach(); });
  mic.addEventListener("click", () => { if (screenFrame().getAttribute("data-mic") !== "off") noLiveCoach(); });
  textLink.addEventListener("click", () => textMode(true, { focusInput: true }));
  tapLink.addEventListener("click", () => tapMode(screenFrame().getAttribute("data-mode") !== "tap"));
  send.addEventListener("click", () => noLiveCoach());
  input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); noLiveCoach(); } });
  input.addEventListener("focus", () => input.classList.add("is-focused"));
  input.addEventListener("blur", () => input.classList.remove("is-focused"));
  const backButton = phone.querySelector(".header .back");
  if (backButton) backButton.addEventListener("click", (event) => { event.preventDefault(); back(); });
  scrollFades(body, view, cleanups);

  const api = {
    root: body, body, stack, prompts, card, frame: screenFrame,
    setCoachState, showPill, noPill, quiet, answer, refusal, confirmRow, chips, marker, proposal,
    micOff, micRefusal, statusPill, noteBlock, listen, stopLevel, textMode, tapMode, panel, closePanel,
    hideLine: () => { line.hidden = true; },
    applyState(id) {
      const entry = BY_ID.get(id);
      if (!entry) return false;
      entry.run(api);
      doc.documentElement.setAttribute("data-state", id);
      return true;
    },
    close() {
      if (closed) return false;
      closed = true;
      if (settle !== null) { clock.clearTimeout(settle); settle = null; }
      stopLevel();
      closePanel();
      for (const undo of cleanups.splice(0)) { try { undo(); } catch (_) { /* best effort */ } }
      for (const name of ["data-state", "data-mode", "data-mic", "data-level"]) screenFrame().removeAttribute(name);
      const applied = doc.documentElement.getAttribute("data-state");
      if (applied && BY_ID.has(applied)) doc.documentElement.removeAttribute("data-state");
      return true;
    },
    closed: () => closed,
  };

  if (focus) { title.tabIndex = -1; try { title.focus(); } catch (_) { /* focus is a convenience */ } }
  const wanted = state === undefined ? reviewStateOnce(view) : state;
  if (wanted) api.applyState(wanted);
  return api;
}

/* THE REVIEW HOOK'S STATE LIST. The pack's gates read `window.earnedStates.list()` and
   put a state on screen with `?screen=coach&state=C-nn`. The registry has the pack's
   shape (register, list, apply, get); a registry another screen already installed is
   joined, never replaced. `route` paints the live coach screen and returns its view. */
export function installCoachStates(view, route) {
  if (!view) return null;
  let registry = view.earnedStates;
  if (!registry || typeof registry.register !== "function" || typeof registry.list !== "function") {
    const defs = new Map(), order = [];
    registry = {
      register(id, def) { if (!defs.has(id)) order.push(id); defs.set(id, def); },
      list() { return order.map((id) => { const d = defs.get(id); return { id, screen: d.screen, title: d.title,
        status: d.status || "LIVE", rules: d.rules || "", component: d.component || "" }; }); },
      apply(id) { const d = defs.get(id); if (!d) return false; return d.apply() !== false; },
      get(id) { return defs.get(id); },
    };
    view.earnedStates = registry;
  }
  for (const entry of COACH_STATES) {
    registry.register(entry.id, { screen: COACH_SCREEN, title: entry.title, status: entry.status, rules: entry.rules,
      component: entry.component, apply: () => {
        const coach = typeof route === "function" ? route() : null;
        return !!(coach && typeof coach.applyState === "function" && coach.applyState(entry.id));
      } });
  }
  return registry;
}

/* ==== C-UI-6 DEPARTURES FROM THE BOARDS (S12 bar rule 6; review l1 F5) ====
   Two live clicks on this screen do not do what the prototype's clicks do. Both land on
   states the pack itself draws; each is recorded here and in the builder report for the
   comparison page, and neither adds a word.
   D1. The tap link (#coach-tap). The prototype (app/app.html) carries data-go="workout"
       on it, so a click there jumps to the workout screen. Here it toggles tap mode, the
       drawn C-07 (voice off for the session, the tap note under the coach line, the link
       reading as the way back to voice), and a second click toggles it off. The template
       drops the data-go jump (C6-1 names it as one of the three omissions); C6-6 holds
       the toggle both ways.
   D2. The text mode link (#coach-text-mode). The prototype toggles the link label in
       place. Here it opens the drawn C-06: the text box shown with the caret in it, and a
       back link to voice under it in the stack; the back link closes text mode again.
       C6-6 holds both ways.
   The lock is unchanged by both: no live adapter, no network, no audio. */
