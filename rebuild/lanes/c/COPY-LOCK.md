# THE COPY LOCK (S10) - the eight answers, ownership, enforcement

Status: BUILDER DRAFT for review (runbook T3c; S10-WORKING-BRIEF c58b892 section 8; S9-RELEASE-SPEC C.6 seven
questions plus R4 N3 as the eighth, DECISIONS:549 (B)). Worktree detached at f97924a; nothing committed. The PM rules
the answers (DECISIONS:780 Q5 sets coverage only); an answer that changes a string the athlete reads goes to Joe (J3).
Round 2 (fix round after REVIEW-S10-COPYLOCK-l1 REJECT): F1 sigil rule, F2 inline <style>/<script> bodies, F3 input
values (static and mounted), F4 limits named below, answer 5 as ruled at DECISIONS:818. No athlete-read string changed.

## Files
- `rebuild/m3/w7-preview/today/test/copy-lock.cjs` the lock: piece extraction, `measure()`, `check()`, `uncovered()`.
- `rebuild/m3/w7-preview/today/test/copy-lock-states.mjs` the runtime half: five named states of the mounted gym card.
- `rebuild/m3/w7-preview/today/test/copy-lock.test.mjs` the sealed cell (CL-PIN, CL-HOLDS, CL-TWO-SIDED, CL-PLANTS,
  CL-COMPOSED, CL-CLOSURE).
- `rebuild/m3/w7-preview/today/test/copy-lock.corpus.json` the pinned corpus (958 locked pieces, 52 scanned files,
  13 named tools, 5 states), sha256 e3b1be10..., pinned by value in the test; the two dashes some measured
  diagnostics carry are written as \u escapes, so the file holds no U+2013/U+2014.
- `rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs` the re-measure tool (never CI, never evidence).

## The eight answers (each: does it change any string the athlete reads?)
1. UNIT. One PIECE: a whole static string the page source carries, decoded exactly as JavaScript decodes it: a whole
   '...' / "..." literal, one static chunk of a template literal, one markup text node or one placeholder / aria-label /
   title / alt value, or one shown <input value> (every type but hidden, checkbox, radio, file, image, range, color,
   password), in .html and in any JS string that carries markup, one quoted CSS string, and in markup the quoted strings
   of an inline <style> body and the pieces of an inline <script> body; kept when it reads as words (`proseLike`, which
   errs toward locking diagnostics too; a leading . # [ @ marks a selector only when no whitespace follows it, so the
   boot-refusal tail ". Nothing was recorded." is locked). Each piece is pinned with the exact count each scanned
   file carries and with the design.cjs lists that declare it. Compared whole, never as a substring, so a refusal names
   the sentence and the file. Athlete-read string changed: NO.
2. OBSERVED SIDE. The composed product, in two halves. Static: every .cjs/.mjs/.js/.html/.css file under
   rebuild/m3/w7-preview/today, /import, /measure and rebuild/slice/pwa (test, node_modules, dist skipped), walked on
   every run so a NEW file is scanned unlisted; 13 exact-path harness/build tools (the *-check.mjs, build.mjs,
   serve.mjs, build-pwa.mjs, serve-pwa.mjs, browser-offline-check.mjs) are not measured, which cannot hide a move: the
   owner is left short. Runtime: the released gym card (gym-app.mjs) mounted in the real shell and approved template
   with the real durable machine-settings host (fake-indexeddb), every text node, the four attributes and the current
   value of every shown input and textarea harvested per state (so the answer typed in N2, "six", is read); every
   letter shown must come from a locked piece or a named fixture value. Not the built bundle: the build bundles the
   import route (migrate.cjs, merge.cjs), which a builder may not load locally, and the built app.js is not
   to be read. Athlete-read string changed: NO.
3. STATE SET. Every string any state can put on screen from the scanned files (the 958 pieces, all states by
   construction), plus five named mounted states: GYM-ACTIVE-SET, GYM-SETTINGS-EDITOR-OPEN, GYM-SETTINGS-REFUSED-EMPTY,
   GYM-SETTINGS-N2, GYM-SETTINGS-SAVED, each with its exact harvested string set. GYM-SETTINGS-N2 is c6fb3017 N2
   (DECISIONS:780 Q5), measured: after an empty Save, a Save revised while held writes exactly one durable settings op
   (Seat four) and the card still says "Add a setting or a cue before saving. Nothing was recorded." beside the recorded
   setting. The lock pins it as it is. The 09-18 pack's 210 state records are NOT the day-one state set: the client
   still renders the 09-08 look (CUI1 not accepted, :732), so those records describe the prototype, not this product.
   Athlete-read string changed: NO.
4. UNPORTED SCREENS. The lock pins the client's CURRENT words on every screen, ported or not: no screen is refused for
   lacking a 09-18 record and none is admitted unpinned. A look ticket that ports a screen changes pieces and so
   re-measures (answer 5). Athlete-read string changed: NO (nothing is removed or reworded by the lock).
5. LEGITIMATE CHANGE. RULED by the PM at DECISIONS:818: the corpus stays sealed; a wording change re-measures it in a
   reseal child with an independent diff review. So the price of any change to a locked piece is: run
   `copy-lock-measure.mjs --write`, put the new CORPUS_SHA256 literal in copy-lock.test.mjs, and land both (sealed)
   in a reseal child that declares the corpus and the test, with an independent review of the corpus entry diff
   (added / removed / re-owned pieces, list membership, the five states' string sets) before it lands. This holds for
   the released today-app.cjs and gym-app.mjs too: after S10 a wording edit there is no longer a lane C-only ticket
   (:536 (4) narrowed for copy by this ruling). The released-corpus alternative (each change cited by a PM ledger line)
   is not taken. Athlete-read string changed: NO.
6. THE ARRAYS. Both exist; neither is redundant. design.cjs's assertDesignBinding keeps its direction (each declared
   string upstream in the approved references and present in a view; preview-owned strings absent upstream). The lock
   adds the sealed reverse direction: list membership per string is pinned (DECLARATION-DROPPED / -ADDED) and each
   string's owner counts are pinned, so the coordinated deletion that passes every existing check (S9-RELEASE-SPEC
   C.5.2 item 2) is refused. Athlete-read string changed: NO.
7. MACHINE. None in particular: text and jsdom only, no browser, fonts or rasterisation, so R4 N3's tolerance
   question does not arise; the result must be identical on windows-latest, ubuntu-latest and the owner PC (tree is
   eol=lf; CR is folded as a template literal folds it). Measured here: Windows, Node 24.19 only. Linux is owed at the
   first CI run that reaches the step. Athlete-read string changed: NO.
8. CI. Yes: `node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/copy-lock.test.mjs` as an S10 child
   (guard-clean: no protected load, guard log empty) and one rebuild.yml line in the Today step on both OS. Not added
   here: REGEN --write must declare the five new files, and the workflow hunk lands last (brief section 9).
   Athlete-read string changed: NO.

## Ownership and mirrors
- Released presentation copy: today-app.cjs (148 pieces), gym-app.mjs (43). Unsealed copy the lock now holds:
  design.cjs (240, incl. its five lists), screens.template.html (93), setup-model.mjs (125), checkin-model.mjs (36),
  exercise-catalogue.mjs (246), slice/pwa shell.cjs (34) and pwa.cjs (27), and the rest per corpus.entries[].files.
  Round 2 re-measure added exactly three pieces: ". Nothing was recorded." (today-app.cjs 1, today-entry.mjs 1) and two
  "# ..." comment lines of the _headers file shell.cjs emits (never on a screen; locked because the rule errs toward
  locking). F2 and F3 added no static piece today; F3 added "six" to the GYM-SETTINGS-N2 state set.
- Mirrors: the five design.cjs lists (membership pinned), setup-model COPY / VALIDATION / REFUSAL_SENTENCES (pieces),
  the template, gym-app's exported SETTINGS_* constants (pieces). Harness restatements (gym-check.mjs etc.) are tools.
- Generated / dynamic refusal copy from layers outside the scan roots (rebuild/m4/workout, rebuild/m3/w6, rebuild/engine,
  printed by gym-app refusalText) is held by the seal at its owner, not by the lock; the lock never reads rebuild/engine.

## Named limits (not claimed)
- D-COPYLOCK-TODAY-MOUNT: no mounted Today-card state; today-app.cjs requires the import screen, which loads the
  protected five locally. Today's words are held statically; a mounted Today row is CI or PM-seat work under grant (g).
- The built bundle is not scanned (answer 2). Engine-authored headline titles (design.headlineVocabulary reads every
  rebuild/engine/*.cjs) are outside the lock.
- `proseLike` is a heuristic: a one-word lowercase label with no space or capital (e.g. "lb" alone) is not locked.
- The static side sees only whole pieces. Text ASSEMBLED at run time from lowercase single words (e.g.
  ['nothing', 'was', 'recorded'].join(' ')) and text carrying code punctuation = < > { } \ ` (e.g.
  'Reps = 0 means the set was skipped.') are not locked pieces, so the static scan does not see them (review plants P3,
  P5: still PASSED after round 2, by this limit). Only the five mounted gym states see composed output, and only for
  what those states show: such text elsewhere (Today, setup, import, measure, pwa) is unseen by the lock.
- CSS-generated text (content:) is held by the static side only (quoted strings of .css files and inline <style>
  bodies); the mounted harvest cannot see it, as jsdom does not render generated content.
