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
  cancelled: 'Cancelled. Nothing on this phone was changed.',
  retracted: 'That file was taken back. Nothing on this phone was changed.',
  retractRefused: 'That file could not be taken back on its own. It is still listed below.',
});

/* THE REASON LABELS retractImport accepts. Its own rule is an alphabet
   (/^[A-Za-z][A-Za-z_-]{0,63}$/, import-bundle.mjs:675) precisely so no ledger
   value can ride out on a reason, so these are labels and never sentences. */
export const RETRACT_REASON = Object.freeze({
  refused: 'review-refused', cancelled: 'athlete-cancelled' });

/* THE ONE SENTENCE THIS FILE ADDS TO THE MACHINERY'S OWN WORDS. Every refusal
   is shown as the code the machinery answered with, verbatim; BUNDLE_AUTH_FAILED
   is the only one that reaches an athlete with nothing a person can act on, so
   it gets one honest sentence and nothing else does. A code this map does not
   know is printed alone, which is the honest answer to a refusal nobody here
   anticipated. */
export const REFUSAL_SENTENCE = Object.freeze({ BUNDLE_AUTH_FAILED: COPY.authFailed });

/* Round 2, review r1 finding 4: a refusal that carried ONE code printed it
   twice - "LOCAL_SOURCE_PROGRAMME_UNRESOLVED (LOCAL_SOURCE_PROGRAMME_UNRESOLVED)"
   - because confirm() passes the first code AND the joined list. The detail is
   what the machinery said BESIDES the code, so a detail that repeats the code
   is not detail. Nothing is hidden: confirm() below now hands over only the
   codes after the first. */
const codeLine = (code, detail) =>
  String(code) + (detail && String(detail) !== String(code) ? ' (' + detail + ')' : '');

export function refusalLines(code, detail) {
  const lines = [codeLine(code, detail)];
  const sentence = REFUSAL_SENTENCE[code];
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

  const fail = (code, detail) => { refusal = { code: code || 'IMPORT_ROUTE_REFUSED', detail: detail || null }; };

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
           prints all of them (review r1 finding 4). */
        fail(codes[0] || 'LOCAL_SOURCE_NOT_READY', codes.slice(1).join(' ') || null);
        await retract(RETRACT_REASON.refused);
      } else {
        const capability = localSourceCommitCapability(prepared);
        await capability.publish();
        await capability.reconcile();
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
    root.append(button('import-back', COPY.back,
      () => (custody ? cancelAfterCustody() : back()), 'option'));
    if (refusal) {
      const box = el('p', 'import-refusal');
      box.className = 'error';
      box.textContent = refusalLines(refusal.code, refusal.detail).join(' ');
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
     the summary below is read back from the machinery on every paint. */
  function reopen() {
    if (step === 'done') { step = 'summary'; note = ''; refusal = null; }
  }

  return Object.freeze({ paint, reopen, step: () => step, refusal: () => refusal,
    imports: () => imports.slice(), retractions: () => retractions.slice(),
    busy: () => busy, review: () => review, custody: () => custody,
    /* What the last tap started, so a caller can await it instead of guessing. */
    settled: () => working });
}

export default { createImportScreen, COPY, STEPS, IDENTITY_QUESTION, RETRACT_REASON,
  REFUSAL_SENTENCE, refusalLines, unlockedFacts, reviewFacts, summaryRows, retractionRows,
  ENGINE_REVISION_LABEL };
