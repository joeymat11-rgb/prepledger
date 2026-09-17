/* import-screen.mjs - THE IMPORT ROUTE, and the ONE module the page's input law
   lets reach rebuild/engine/migrate.cjs, rebuild/engine/merge.cjs and the
   rebuild/m4/import lane (DECISIONS:475 (1) and (4); today/build.mjs
   IMPORT_ROUTE_ONLY and assertImportRouteIsolation).

   WHY THOSE THREE NAMES ARE HERE AND NOWHERE ELSE. Today is a reader of an
   already migrated state, and that is why the law refuses those names on every
   other path. The Import route is the one place where the page is not reading a
   migrated state: it is being offered a sealed file and has to REPRODUCE, on the
   phone, the walk port.cjs did on the PC before it will adopt a byte of it
   (source-admission.mjs replay(), SOURCE_PREPARATION_REPRODUCTION_MISMATCH).
   That reproduction is engine-provider.cjs, and engine-provider.cjs requires
   migrate.cjs and merge.cjs by literal path. So the names enter the page through
   THIS module's graph and through no other, and today-entry.mjs's own graph,
   walked without the dynamic edge today-app.cjs opens into this file, still
   carries none of them. That is the law cell, not a promise.

   WRITE ORDER, and why it is this one (DECISIONS:472 (a), (b), (d) and :475 (1)):
     1. pick the file                      - nothing is read
     2. the six words, "Unlock"            - unsealBundle + qualifyBundle, WRITE-FREE
     3. the identity question, FIRST       - the bundle carries no athlete identity;
                                             the ONLY identity guard is his answer,
                                             and "No" here writes nothing at all
        then importBundle                  - custody, the first durable write
        then the controller's review        - reviewSource reads FROM custody, which
                                             is why custody has to come first
        then "Import this history"          - prepareSource, publish, reconcile
     4. adoption                            - the existing local-source-basis consumer
   ANY refusal or cancel after custody calls retractImport, so no route leaves
   residue (P3-IMPORT-RETRACT, DECISIONS:475 (2)).

   NOTHING LEAVES THE PAGE. No fetch, no XMLHttpRequest, no navigator.share, no
   download, no createObjectURL, no window.open, no storage outside the device
   store. The bundle's bytes are read from the file the athlete picked, handed to
   the machinery, and dropped. */

"use strict";

import { unsealBundle, qualifyBundle, importBundle, listImports, retractImport,
  listImportRetractions } from '../../w6/local/browser-entry.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../w6/local/source-admission.mjs';
import { createSourcePlatform } from '../../w6/local/source-platform.mjs';
import Production from '../../../m4/import/production-mapping.cjs';

/* THE IDENTITY QUESTION, verbatim. The bundle carries NO athlete identity - a
   file differing only by athlete_label admits, and programme() compares only
   programme fields - so this answer is the ONLY identity guard there is
   (DECISIONS:472 (a)). It has to be asked of him, before anything is written,
   and it must be the CONTROLLER'S question and not a rewording of it: this
   constant is source-admission.mjs:96's `prefix_question` byte for byte (the
   ticket cites :80, which is where it stood before the lane D import swap), and
   identityYes() refuses to go on if the controller's own review comes back
   asking something else. */
export const IDENTITY_QUESTION = 'Did every workout in this file happen before '
  + 'this first Earned workout, with none already recorded in Earned?';
export const IDENTITY_QUESTION_CHANGED = 'LOCAL_SOURCE_IDENTITY_QUESTION_CHANGED';

/* EVERY STRING THE ATHLETE READS ON THIS ROUTE. Named here so the copy census
   cell can count them and so no sentence is composed at a call site. The one
   string this file does NOT own is the identity question: that belongs to the
   controller and is printed exactly as source-admission.mjs:96 states it. */
export const COPY = Object.freeze({
  title: 'Import my history',
  back: 'Back',
  entryNew: 'Import my history',
  entryDone: 'History imported',
  pickLabel: 'Choose the earned-port file',
  pickLead: 'The file the PC wrote. It is sealed: nothing can read it without the six words.',
  wordsLabel: 'Type the six words from the PC',
  unlock: 'Unlock',
  unlocked: 'Unlocked. Nothing has been written to this phone yet.',
  identityLead: 'One question before anything is written.',
  yes: 'Yes',
  no: 'No',
  reviewHead: 'What this file holds',
  confirm: 'Import this history',
  working: 'Working.',
  done: 'Imported. Today and your gym card now use it.',
  summaryHead: 'Your import',
  retractionsHead: 'Files you took back',
  noStore: 'This browser did not give the page an encrypted local store to import into.',
  authFailed: 'That passphrase or file did not unlock. Check the six words and the file.',
  /* P3-PORT-FIX (spec 3.2). "training week", not "programme": under the new
     admission rule the only things that can disagree ARE the week, the lift list
     and where each lift sits, so a sentence promising a different programme
     would be wider than the rule. The second half repeats the one fact he most
     needs after a refusal, and which the screen already guarantees by
     retracting below. */
  programmeMismatch: 'This file was written by a different training week than the one you set '
    + 'up on this phone. Nothing on this phone was changed.',
  /* P3-PORT-FIX-2 (DECISIONS:509 Q5 + Q2). TWO FIELDS ARRIVE UNDER THAT CODE
     FOR REASONS THE SENTENCE ABOVE DOES NOT DESCRIBE, and the PM ruled the copy
     keyed on the FIELD rather than on the code. These are his words, verbatim.
     `capture_sets`: nothing is wrong with his training week - the week, the
     lifts, the days and the muscle groups all agreed - and what refused was his
     OWN recorded Earned session's slot count. `setup_document`: the phone holds
     no first-run document at all, so "the one you set up on this phone" names
     something that does not exist. Both keep the second half, which is the one
     fact he most needs and which the screen guarantees by retracting. */
  captureSetsMismatch: 'A workout you already recorded on this phone has a different number '
    + 'of sets than this file has for that lift. Nothing on this phone was changed.',
  noSetupDocument: 'This phone has no saved setup to compare this file with. Nothing on '
    + 'this phone was changed.',
  cancelled: 'Cancelled. Nothing on this phone was changed.',
  retracted: 'That file was taken back. Nothing on this phone was changed.',
  retractRefused: 'That file could not be taken back on its own. It is still listed below.',
});

/* THE REASON LABELS retractImport accepts. Its own rule is an alphabet
   (/^[A-Za-z][A-Za-z_-]{0,63}$/, import-bundle.mjs:675) precisely so no ledger
   value can ride out on a reason, so these are labels and never sentences. */
export const RETRACT_REASON = Object.freeze({
  refused: 'review-refused', cancelled: 'athlete-cancelled' });

/* THE SENTENCES THIS FILE ADDS TO THE MACHINERY'S OWN WORDS. Every refusal is
   shown as the code the machinery answered with, verbatim; a code that reaches
   an athlete with nothing a person can act on gets one honest sentence beside
   it, and nothing else does. A code this map does not know is printed alone,
   which is the honest answer to a refusal nobody here anticipated.
   P3-PORT-FIX (spec 3.2) adds the second entry: before it, the athlete whose
   own history was refused read a bare LOCAL_SOURCE_PROGRAMME_UNRESOLVED. */
export const REFUSAL_SENTENCE = Object.freeze({
  BUNDLE_AUTH_FAILED: COPY.authFailed,
  LOCAL_SOURCE_PROGRAMME_UNRESOLVED: COPY.programmeMismatch });

/* P3-PORT-FIX-2 (DECISIONS:509 Q5 + Q2). THE SENTENCE IS KEYED ON THE FIELD
   WHEN ONE IS PRESENT, AND ON THE CODE OTHERWISE. One code, several reasons:
   the machinery already tells the athlete WHICH field disagreed, and a sentence
   that ignores it can be false while the code line above it is true. This map
   is keyed by the machinery's own CLOSED vocabulary (source-admission.mjs,
   spec 3.1 plus the four P3-PORT-FIX-2 members), and a field it does not name -
   which is most of them - falls through to the code's sentence unchanged. */
export const REFUSAL_FIELD_SENTENCE = Object.freeze({
  capture_sets: COPY.captureSetsMismatch,
  setup_document: COPY.noSetupDocument });

/* Round 2, review r1 finding 4: a refusal that carried ONE code printed it
   twice - "LOCAL_SOURCE_PROGRAMME_UNRESOLVED (LOCAL_SOURCE_PROGRAMME_UNRESOLVED)"
   - because confirm() passes the first code AND the joined list. The detail is
   what the machinery said BESIDES the code, so a detail that repeats the code
   is not detail. Nothing is hidden: confirm() below now hands over only the
   codes after the first. */
const codeLine = (code, detail) =>
  String(code) + (detail && String(detail) !== String(code) ? ' (' + detail + ')' : '');

export function refusalLines(code, detail, leadField) {
  const lines = [codeLine(code, detail)];
  /* P3-PORT-FIX-2, AMENDED IN THE FIX ROUND (independent review R1, NOTE 1).
     THE SENTENCE DESCRIBES THE FAULT THE CODE LINE LEADS WITH. `leadField` is
     the FIRST issue's field, which is the fault whose code is printed above,
     handed in by the caller that has the issues. A refusal that carries several
     (a training week fault AND a capture fault, say) used to have its sentence
     chosen by the first token this map RECOGNISED anywhere in the joined
     detail, so the athlete could read the capture sentence under a code line
     that led with `split.map`: a true code line with a false sentence beneath
     it. A field this map does not name - which is most of them - and a leading
     issue with no field at all both fall through to the code's own sentence,
     which is never wrong about which fault led.
     `leadField` OMITTED (not null) means the caller has only the rendered
     detail string and no issues to read; then the first token this map knows
     still wins, as before. A lift id is never a key and neither is a code, so a
     token can only match by being a field the PM ruled a sentence for. */
  const field = leadField === undefined
    ? String(detail == null ? '' : detail).split(' ')
      .find(token => Object.hasOwn(REFUSAL_FIELD_SENTENCE, token))
    : leadField;
  const sentence = typeof field === 'string' && field
    && Object.hasOwn(REFUSAL_FIELD_SENTENCE, field)
    ? REFUSAL_FIELD_SENTENCE[field] : REFUSAL_SENTENCE[code];
  if (sentence) lines.push(sentence);
  return lines;
}

/* THE STEPS, named so a cell can assert which one the screen is on without
   reading a sentence off it. */
export const STEPS = Object.freeze(['pick', 'words', 'identity', 'review', 'done', 'summary']);

/* WHAT THE MACHINERY EXPOSES FOR DISPLAY, in plain words and nothing else.
   Every line below is a LABEL and a value the machinery already returns: the
   sealed payload's own oracle verdict and dataLoss block, and the controller's
   own review record. No number is computed here, no verdict is worded here, and
   a field the machinery did not give is not printed at all. */
export function unlockedFacts(payload) {
  const loss = (payload && payload.dataLoss) || {};
  const rows = [];
  if (payload && payload.createdAt) rows.push(['Sealed on the PC at', String(payload.createdAt)]);
  if (payload && payload.oracle) rows.push(['The PC oracle verdict', String(payload.oracle.verdict)]);
  if (loss.safe !== undefined) rows.push(['dataLossGuard safe', String(loss.safe)]);
  if (loss.lost !== undefined) rows.push(['dataLossGuard lost', String(loss.lost)]);
  if (payload && payload.engine) {
    rows.push(['Engine schema version', String(payload.engine.schemaV)]);
    rows.push(['Engine sha256', String(payload.engine.sha256)]);
  }
  if (payload && payload.source) rows.push(['File sha256', String(payload.source.sha256)]);
  return rows;
}

export function reviewFacts(review) {
  const rows = [];
  rows.push(['Workout days in this file', String((review.legacy_members || []).length)]);
  if ((review.legacy_members || []).length) rows.push(['Those days', review.legacy_members.join(', ')]);
  rows.push(['Workouts already recorded in Earned', String((review.native_members || []).length)]);
  rows.push(['File size in bytes', String(review.source_bytes)]);
  rows.push(['Standing on', String(review.as_of)]);
  rows.push(['Ordering answer needed', String(review.prefix_required)]);
  return rows;
}

/* THE READ-ONLY SUMMARY. listImports() and listImportRetractions() are the two
   read sides the machinery exposes (browser-entry.mjs); a retracted file stays
   in the second list forever, because retract deletes nothing. The engine
   revision is the production mapping's own ENGINE_REVISION, printed so the
   athlete and the runbook can read WHICH accepted engine his history was
   checked against. */
export const ENGINE_REVISION_LABEL = 'Checked against engine revision';

export function summaryRows(imports) {
  return (imports || []).map(entry => [entry.name, [
    ['Imported at', String(entry.importedAt)],
    ['File sha256', String(entry.sourceSha256)],
    ['The PC oracle verdict', String(entry.oracleVerdict)],
    ['Still needs the import review', String(entry.rebaseRequired)]]]);
}

export function retractionRows(retractions) {
  return (retractions || []).map(record => [record.name, [
    ['Taken back at', String(record.retractedAt)],
    ['Reason label', String(record.reason)],
    ['File sha256', String(record.sourceSha256)]]]);
}

/* ---------------------------------------------------------------------------
   THE SCREEN. Pure DOM with data-slot on everything, exactly as the measure
   screen builds itself (measure-view.mjs's own note): this route carries no
   approved-design template yet, so every element names itself the way an
   approved template's slots do. The classes are the approved ones the setup
   screens already use (.field, .option, .cta, .error, .note), and
   today/preview.css gives this route's inputs the 16 px / 48 px rule and its
   controls the 44 px tap minimum.
   --------------------------------------------------------------------------- */
export function createImportScreen(deps = {}) {
  const { doc, installation = null, back = () => {}, onAdmitted = () => {},
    day = () => null, repaint = () => {} } = deps;
  const platform = deps.platform || createSourcePlatform();

  let step = 'pick';
  let file = null;          // the File the athlete picked
  let words = '';           // what is in the passphrase box right now
  let opened = null;        // { payload, bytes } from unsealBundle: WRITE-FREE
  let custody = null;       // { name } once importBundle has taken it
  let controller = null;
  let review = null;
  let refusal = null;       // { code, detail }
  let note = '';
  let busy = false;
  let imports = [];
  let retractions = [];
  /* ONE TAP AT A TIME, and a handle on it. Every control below goes through
     run(), so a second tap queues behind the first instead of racing it, and a
     caller (or a cell) can await exactly the work a tap started. */
  let working = Promise.resolve();
  const run = (fn) => { working = working.then(fn, fn); return working; };

  const el = (tag, slot, text) => {
    const node = doc.createElement(tag);
    if (slot) node.dataset.slot = slot;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  function button(slot, label, onTap, className = 'cta') {
    const node = el('button', slot, label);
    node.type = 'button';
    node.className = className;
    node.addEventListener('click', () => { if (!busy) run(onTap); });
    return node;
  }
  function facts(root, slot, rows) {
    const list = el('dl', slot);
    for (const [label, value] of rows) {
      list.append(el('dt', null, label), el('dd', null, value));
    }
    root.append(list);
    return list;
  }
  function group(root, slot, head, entries) {
    const section = el('section', slot);
    section.append(el('h2', slot + '-head', head));
    for (const [name, rows] of entries) {
      section.append(el('h3', slot + '-name', name));
      facts(section, slot + '-facts', rows);
    }
    root.append(section);
    return section;
  }

  /* ROUND 4, REVIEW R3 MINOR 3: A REFUSAL ENDS THE WORK, so the note that said
     work was in flight goes with it. confirm() sets note = COPY.working before
     it calls the machinery; when the machinery refuses, the screen used to
     paint the code AND "Working." beside it, which told the athlete something
     was still happening after everything had stopped. Every refusal on this
     route goes through fail(), so clearing it here covers all of them, and the
     two notes that belong to a refusal - retractRefused and retracted - are
     written AFTER fail() by retract() and cancelAfterCustody() and stand. */
  /* `field` (fix round, review R1 NOTE 1) is the LEADING issue's field, when the
     machinery gave one, so the sentence under the code line can describe the
     fault the code line leads with. It is added to the refusal only when there
     is one, so a refusal that never had a field is the same object it was. */
  const fail = (code, detail, field) => {
    note = '';
    refusal = { code: code || 'IMPORT_ROUTE_REFUSED', detail: detail || null,
      ...(typeof field === 'string' && field ? { field } : {}) };
  };

  /* ROUND 4, REVIEW R3 MAJOR 2: THE WAY BACK TO ANOTHER FILE, with no reload.
     A damaged file or a mistyped passphrase refuses at the words step and the
     screen keeps the file, which is right while he is retyping the six words -
     and WRONG the moment the file itself is the problem, because until this
     round there was no control anywhere that put him back on the chooser. This
     resets the draft to the first step and drops the bytes with it. Nothing
     durable is touched: it runs only where no custody is open, and custody is
     the first durable write this route makes. */
  function resetDraft() {
    opened = null; file = null; words = '';
    step = 'pick'; refusal = null; note = '';
  }

  async function readLists() {
    if (!installation || !installation.client) { imports = []; retractions = []; return; }
    try { imports = await listImports(installation.client); } catch (_) { imports = []; }
    try { retractions = await listImportRetractions(installation.client); } catch (_) { retractions = []; }
  }

  const webCrypto = () => deps.crypto || (doc.defaultView && doc.defaultView.crypto)
    || (typeof globalThis !== 'undefined' ? globalThis.crypto : undefined);

  /* THE WAY BACK OUT OF CUSTODY. Called on every refusal after importBundle and
     on a cancel, with a reason LABEL. It deletes nothing: the entry is carried
     verbatim into metadata.importRetractions[] and leaves metadata.imports[], so
     every consumer reads the generation it read before the file was staged. A
     retract the machinery refuses (a seeded sibling, an admitted import) is
     reported by its own code and the entry stays visible in the summary below. */
  async function retract(reason) {
    if (!custody) return null;
    const name = custody.name;
    /* The review this screen was standing on is gone with the file, so the
       screen goes back to the first step. The refusal box above it keeps the
       machinery's own word for why, and the summary below keeps whatever the
       device still holds. */
    custody = null; controller = null; review = null;
    opened = null; file = null; words = ''; step = 'pick';
    let result = null;
    try { result = await retractImport(installation.client, name, reason); }
    catch (error) { result = { retracted: false, code: (error && error.code) || 'LOCAL_IMPORT_RETRACT_FAILED' }; }
    if (!result || result.retracted !== true) {
      note = COPY.retractRefused;
      refusal = { code: (result && result.code) || 'LOCAL_IMPORT_RETRACT_FAILED',
        detail: refusal ? refusal.code : null };
    }
    await readLists();
    return result;
  }

  async function unlock() {
    refusal = null; note = '';
    if (!file) return;
    busy = true; repaint();
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const open = await unsealBundle(bytes, words, { crypto: webCrypto(), allowUnqualified: true });
      const refused = qualifyBundle(open.payload);
      if (refused) fail(refused.code, refused.reason + ' ' + refused.detail);
      else { opened = { payload: open.payload, bytes }; step = 'identity'; note = COPY.unlocked; }
    } catch (error) { fail(error && error.code, error && error.field); }
    busy = false; repaint();
  }

  /* "No" to the identity question. Custody has NOT been taken yet, by design:
     this is the whole reason the question is asked before importBundle rather
     than after it, so a No costs the device nothing to undo. */
  function identityNo() {
    opened = null; file = null; words = ''; step = 'pick';
    refusal = null; note = COPY.cancelled;
    repaint();
  }

  /* "Yes". Custody first, because reviewSource reads the material back OUT of
     custody (:472 (b)); then the controller, with the PRODUCTION registry and
     never a TEST-ONLY one, and the execution row bound at qualify time from the
     material digest the controller derives privately (P3-D-FOLLOWONS (a)). */
  async function identityYes() {
    refusal = null; note = '';
    busy = true; repaint();
    try {
      const carried = await importBundle(installation.client,
        { bundleBytes: opened.bytes, passphrase: words });
      if (carried.imported !== true) { fail(carried.code); busy = false; await readLists(); return repaint(); }
      custody = { name: carried.name };
      const bindings = await installation.client.hostBindings({});
      controller = createLocalSourceController({ repository: bindings.repository,
        namespace: installation.namespace, athleteId: installation.athleteId,
        deviceId: installation.deviceId,
        producerRegistry: Production.createProductionProducerRegistry({ hash: platform.hash }),
        asOf: () => day(), platform });
      review = await controller.reviewSource(carried.name);
      if (review.prefix_question !== IDENTITY_QUESTION) {
        const changed = new Error(IDENTITY_QUESTION_CHANGED);
        changed.code = IDENTITY_QUESTION_CHANGED;
        throw changed;
      }
      step = 'review';
    } catch (error) {
      fail(error && error.code ? error.code : error && error.message);
      await retract(RETRACT_REASON.refused);
    }
    busy = false; await readLists(); repaint();
  }

  /* THE EXPLICIT CONFIRM. identityConfirmed is the athlete's own Yes, carried
     from the question above and never defaulted; prefixAnswer is the same Yes,
     which is what local-source-order.cjs confirm() requires before it will build
     an order map at all (ORDER_EVIDENCE_REQUIRED on anything else). */
  async function confirm() {
    refusal = null; note = COPY.working;
    busy = true; repaint();
    try {
      const prepared = await controller.prepareSource(review,
        { identityConfirmed: true, prefixAnswer: true });
      if (prepared.profile !== 'earned/local-source-qualification/v1') {
        const codes = [...new Set((prepared.issues || []).map(issue => issue.code))];
        /* The first code is the refusal; the REST are the detail, so a walk
           that raised one code prints it once and a walk that raised several
           prints all of them (review r1 finding 4).
           P3-PORT-FIX (spec 3.3): plus, for each issue that carries one, its
           `field` and its `exercise_id`, in that order. Both come from the
           machinery's own CLOSED vocabulary (source-admission.mjs, spec 3.1);
           no value from the file rides out here, and an issue that carries no
           field adds nothing. Deduplicated, and never repeating the leading
           code, which codeLine above already guards. */
        const parts = [...codes.slice(1)];
        for (const issue of prepared.issues || []) {
          for (const key of ['field', 'exercise_id']) {
            const value = issue[key];
            if (typeof value === 'string' && value && !parts.includes(value)) parts.push(value);
          }
        }
        /* THE LEADING ISSUE'S FIELD, and only its own (fix round, review R1
           NOTE 1). `codes[0]` above is the FIRST issue's code, so the sentence
           beside it is chosen by the FIRST issue's field: the two halves of the
           box then describe the same fault. An issue behind it still prints its
           field and its lift on the code line; it just does not choose the
           words. A leading issue with no field leaves the code's own sentence,
           which cannot be wrong about which fault led. */
        const lead = (prepared.issues || [])[0];
        fail(codes[0] || 'LOCAL_SOURCE_NOT_READY', parts.join(' ') || null,
          lead && typeof lead.field === 'string' ? lead.field : null);
        await retract(RETRACT_REASON.refused);
      } else {
        const capability = localSourceCommitCapability(prepared);
        await capability.publish();
        await capability.reconcile();
        /* ROUND 4, REVIEW R3 NOTE (carried from r2): THE BYTES GO WHEN THE WORK
           IS DONE. `opened` held the whole decrypted bundle for the life of the
           page session - through the review, through the confirm and after it -
           for nothing: everything past custody reads the material back out of
           custody, not out of this closure. Dropped here, with the file and the
           words, the moment the import is admitted. */
        opened = null; file = null; words = '';
        custody = null; step = 'done'; note = '';
        await readLists();
        busy = false; repaint();
        await onAdmitted();
        return;
      }
    } catch (error) {
      fail(error && error.code ? error.code : error && error.message);
      await retract(RETRACT_REASON.refused);
    }
    busy = false; await readLists(); repaint();
  }

  async function cancelAfterCustody() {
    busy = true; repaint();
    await retract(RETRACT_REASON.cancelled);
    if (!refusal) note = COPY.retracted;
    busy = false; repaint();
  }

  function chrome(root) {
    root.append(el('h1', 'import-title', COPY.title));
    /* BACK, and what it leaves behind (round 4, review r3 MAJOR 2). WITH
       custody it is a cancel and retracts. WITHOUT custody nothing durable
       exists, so it drops the draft - the file, the words, the bytes and any
       refusal standing over them - before it hands the athlete back to Today.
       Re-entering the route then starts at the chooser, which is the only way
       a damaged file can be replaced without reloading the page. */
    root.append(button('import-back', COPY.back,
      () => (custody ? cancelAfterCustody() : (resetDraft(), back())), 'option'));
    if (refusal) {
      const box = el('p', 'import-refusal');
      box.className = 'error';
      /* The third argument is passed ALWAYS, `null` included (fix round, review
         R1 NOTE 1): a refusal that carries no field is one the machinery gave
         no field for, which is not the same as a caller that cannot say. */
      box.textContent = refusalLines(refusal.code, refusal.detail,
        refusal.field || null).join(' ');
      root.append(box);
    }
    if (note) { const p = el('p', 'import-note', note); p.className = 'note'; root.append(p); }
  }

  function pickStep(root) {
    root.append(el('p', 'import-pick-lead', COPY.pickLead));
    const wrap = el('div', 'import-pick');
    wrap.className = 'field';
    const label = el('label', null, COPY.pickLabel);
    label.setAttribute('for', 'import-file');
    const input = doc.createElement('input');
    input.id = 'import-file';
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', () => {
      file = input.files && input.files.length ? input.files[0] : null;
      if (file) { step = 'words'; refusal = null; note = ''; repaint(); }
    });
    wrap.append(label, input);
    root.append(wrap);
  }

  function wordsStep(root) {
    root.append(el('p', 'import-file-name', file ? file.name : ''));
    const wrap = el('div', 'import-words');
    wrap.className = 'field';
    const label = el('label', null, COPY.wordsLabel);
    label.setAttribute('for', 'import-passphrase');
    const input = doc.createElement('input');
    input.id = 'import-passphrase';
    input.type = 'text';
    /* The six words are typed, once, off a piece of paper. Every helper a phone
       keyboard offers for prose is wrong for them, so all three are off. */
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocomplete', 'off');
    input.spellcheck = false;
    input.value = words;
    input.addEventListener('input', () => { words = input.value; });
    input.addEventListener('change', () => { words = input.value; });
    wrap.append(label, input);
    root.append(wrap, button('import-unlock', COPY.unlock, () => unlock()));
  }

  function identityStep(root) {
    root.append(el('p', 'import-identity-lead', COPY.identityLead));
    root.append(el('p', 'import-identity-question', IDENTITY_QUESTION));
    facts(root, 'import-unlocked-facts', unlockedFacts(opened.payload));
    root.append(button('import-identity-yes', COPY.yes, () => identityYes()),
      button('import-identity-no', COPY.no, () => identityNo(), 'option'));
  }

  function reviewStep(root) {
    root.append(el('h2', 'import-review-head', COPY.reviewHead));
    /* THE CONTROLLER'S OWN QUESTION, printed from the controller's own record,
       beside the answer the athlete already gave. The constant this screen asked
       it with is checked against it in identityYes(); this line is the receipt. */
    root.append(el('p', 'import-review-question', review.prefix_question));
    root.append(el('p', 'import-review-answer', COPY.yes));
    facts(root, 'import-review-facts', reviewFacts(review));
    facts(root, 'import-review-engine',
      [[ENGINE_REVISION_LABEL, String(Production.ENGINE_REVISION)]]);
    root.append(button('import-confirm', COPY.confirm, () => confirm()));
  }

  function doneStep(root) {
    root.append(el('p', 'import-done', COPY.done));
  }

  function summary(root) {
    if (imports.length) group(root, 'import-summary', COPY.summaryHead, summaryRows(imports));
    if (retractions.length) group(root, 'import-retractions', COPY.retractionsHead,
      retractionRows(retractions));
  }

  async function paint(root, alive = () => true) {
    root.replaceChildren();
    await readLists();
    if (!alive()) return root;
    if (!installation || !installation.client) {
      chrome(root);
      root.append(el('p', 'import-state', COPY.noStore));
      return root;
    }
    chrome(root);
    /* AFTER ADMISSION THIS ROUTE IS READ ONLY. There is no second import door
       here: a second file taken to an installation that already admitted one is
       what the machinery answers IMPORT_REBASE_REQUIRED to, and the honest
       screen for an athlete who is done is the summary of what he has. */
    /* The import that JUST happened keeps its own screen: the athlete tapped
       confirm and is owed the sentence that says what it did, not a summary
       that reads as though he had arrived here from somewhere else. */
    if (step === 'done') { doneStep(root); summary(root); return root; }
    if (deps.admitted && deps.admitted()) { summary(root); return root; }
    if (step === 'pick') pickStep(root);
    else if (step === 'words') wordsStep(root);
    else if (step === 'identity') identityStep(root);
    else if (step === 'review') reviewStep(root);
    else if (step === 'done') doneStep(root);
    summary(root);
    return root;
  }

  /* RE-ENTERING THE ROUTE (round 2, review r1 finding 7). The page caches this
     screen for the whole page session, so the done sentence - which belongs to
     the import the athlete just confirmed - must not be what a LATER tap on the
     entry link paints. today-app.cjs calls this on a tap and never on a
     repaint. It resets nothing but the step: no custody is open at 'done', and
     the summary below is read back from the machinery on every paint.

     ROUND 4, REVIEW R3 MAJOR 2: AND IT NOW RESETS THE DRAFT TOO. A tap on the
     entry link is the athlete ARRIVING at this route, not resuming a half-typed
     one, so whatever file, words and refusal the last visit left behind are
     dropped and he starts at the chooser. That is what makes a damaged file
     replaceable without a page reload. Custody is never open here - it exists
     only inside the awaited stretch between importBundle and the confirm, and a
     tap cannot land inside it - so this can leave nothing durable behind; the
     guard says so out loud rather than trusting the reading. */
  function reopen() {
    if (custody) return;
    if (step === 'done') { step = 'summary'; note = ''; refusal = null; opened = null; return; }
    resetDraft();
  }

  return Object.freeze({ paint, reopen, resetDraft, step: () => step, refusal: () => refusal,
    /* The decrypted bundle this screen is holding for the draft in hand, so a
       cell can PROVE the closure carries no bytes rather than infer it. */
    holdingBytes: () => !!(opened && opened.bytes),
    imports: () => imports.slice(), retractions: () => retractions.slice(),
    busy: () => busy, review: () => review, custody: () => custody,
    /* What the last tap started, so a caller can await it instead of guessing. */
    settled: () => working });
}

export default { createImportScreen, COPY, STEPS, IDENTITY_QUESTION, RETRACT_REASON,
  REFUSAL_SENTENCE, REFUSAL_FIELD_SENTENCE,
  refusalLines, unlockedFacts, reviewFacts, summaryRows, retractionRows,
  ENGINE_REVISION_LABEL };
