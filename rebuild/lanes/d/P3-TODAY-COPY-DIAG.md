# P3-TODAY-COPY-DIAG: four Today defects diagnosed (read-only)

Lane D diagnosis, 2026-09-18. Branch `rebuild/d-p3-today-copy-diag` off `origin/rebuild/t2-client-core`
at d5363d0. READ-ONLY on product: this round changes no product file, no test, no ledger and no spec.
Input: the four symptoms as the PM recorded them at DECISIONS:533 (slice build at tip 4cab65b, coach
constant M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0, Today screen, evening of 2026-09-18, after the real
history import). The owner's screenshot was not available to this round and was not needed.

NOTATION. This file obeys DECISIONS:114 (no U+2013 and no U+2014 anywhere). Engine strings that
carry an em dash are quoted with the character written as `<U+2014>`, so the quote stays exact
without putting the character in this document.

METHOD. Every claim below is from the code that actually runs on the branch, read in the worktree,
plus probes over the pinned approved references, the design pack on `origin/rebuild/c-ui-port`, the
S8 seal spec and `plain-copy.cjs` executed directly. The A1 preview build would not run here
(`@noble/hashes` is absent from the only node_modules available on this machine and `npm install`
is forbidden), so no built asset was inspected; where that matters it is said so.

SUMMARY

| # | where it is decided | who owns it | C-UI-2 |
|---|---|---|---|
| S1 | `rebuild/engine/today.cjs:573-581` chooses it, `today-app.cjs:863` prints it | engine choice, carried raw by the Today binding | REMOVES |
| S2 | `rebuild/engine/today.cjs:213` writes it, `today-app.cjs:868-870` prints only one of its four parts | Today binding | REMOVES |
| S3 | `index.shell.html:17-21` and `:28`, shipped verbatim by `slice/pwa/shell.cjs:129-147` | preview shell shipped as the product page | CARRIES (it is C-UI-8's file, and C-UI-8 is last) |
| S4 | `index.shell.html:5` viewport meta, plus no `env(safe-area-inset-top)` in anything shipped | preview shell and the pinned stylesheets | REMOVES the overlap, CARRIES the missing inset (see S4) |

---

## S1. The headline is a proposal card title

### The slot

`rebuild/m3/w7-preview/today/screens.template.html:20-23`

```html
  <section class="intro">
    <p class="label">Your plan for today</p>
    <h1 data-slot="instruction"></h1>
    <p data-slot="instruction-why"></p>
  </section>
```

### The binding

`rebuild/m3/w7-preview/today/today-app.cjs:863`

```js
    put(map, "instruction", view.nowModel.move.title);
```

`put()` runs every string through `plainOrDrop()` (plain-copy.cjs), which is the only rewrite
between the engine and the pixel.

### The function that chooses it, and the condition

`rebuild/engine/today.cjs`, inside `nowModelUncached` (declared at `:534`):

```js
568:  const decisionsN = ((s.proposals || []).filter((p) => p && !p.resolved).length) + ((s.agentProposals || []).length);
...
573:  if (decisionsN > 0) {
574:    /* A2 - ANSWER-FIRST: the headline IS decision #1 (verb + object, the engine's own
575:       card title); its one-line effect follows; "+N more" is quiet metadata. */
577:    const first9 = (s.proposals || []).find((p) => p && !p.resolved) || (s.agentProposals || [])[0] || null;
578:    const eff9 = first9 ? String(first9.why || first9.body || "").split(". ")[0] : "";
579:    move = { kind: "decisions", n: decisionsN,
580:      title: first9 ? String(first9.title || "ONE DECISION WAITS") : "ONE DECISION WAITS",
581:      body: ... };
582:  }
583:  else if (fix.state === "caution") move = { kind: "fix", lever: fix.lever, title: _plain9(String(fix.title || "").toUpperCase()), body: _plain9(fix.body) };
```

So: whenever the state carries one unresolved proposal, `move.kind` is `"decisions"` and
`move.title` IS that proposal's card title, verbatim and unprocessed. Note that the `fix`
branch on `:583` passes its title through `_plain9` and `.toUpperCase()`; the decisions branch
passes its title through neither.

### The copy source

`rebuild/engine/writers.cjs:1899`

```js
      propose(`volpush_${vp.mg}_${monday}`, `${cap(mgLabel(vp.mg))} <U+2014> EARNED VOLUME: ${vp.fromWk} → ${vp.toWk} WEEKLY SETS`,
```

That template literal produces exactly `Side delt <U+2014> EARNED VOLUME: 10 → 12 WEEKLY SETS`.
`plainCopy` (plain-copy.cjs:58) then rewrites the aside dash to a colon:

```js
58:  text = text.replace(/[\s ]*[<U+2013><U+2014>][\s ]+/g, ": ");
```

Executed, that returns `SIDE DELT: EARNED VOLUME: 10 → 12 WEEKLY SETS`: the owner's string
character for character, arrow included. U+2192 is not a dash, so plain-copy never touches it.
The capitals are the engine's own: there is no `text-transform` in either pinned approved
stylesheet (checked; `h1` is `font-size:47px;line-height:1.04;letter-spacing:-.025em` in
Additions C and nothing more), so nothing on the page upper-cased anything. The one word not
in capitals in the owner's reading, "Side delt", is `cap(mgLabel(vp.mg))` and is correct.

### Root cause, in two sentences

`nowModel` puts the first unresolved proposal's card title in `move.title` on purpose
(comment at today.cjs:574, "the headline IS decision #1"), because the frozen app had a
decisions surface behind that headline. The rebuild's Today has no decisions surface and no
proposal card at all, so `today-app.cjs:863` binds a card title into a slot the design labels
"Your plan for today", and a per muscle volume proposal reads as the day's session.

This is an ENGINE choice carried raw by a Today binding, not a coach-text decision:
`rebuild/coach` has no part in this slot. It is not a fallback for an empty field either. It
is, however, reachable only after a real import: `s.proposals` is empty in every fixture and
nothing in `rebuild/` ever files a proposal. `runAdaptive` (writers.cjs:1615) is defined and
exported but CALLED FROM NOWHERE in the tree (verified by content search over `rebuild/`; the
one near miss, `rebuild/m4/workout/engine-runtime.cjs:76`, is the composition record saying
"its completion/adaptive writers never escape"). The only path by which `state.proposals` can
be non-empty on the owner's phone is the admitted import's own replayed state, adopted
wholesale at `rebuild/m3/w7-preview/today/local-source-basis.mjs` (`const state=view.state;`
... `return clone(state);`) and installed as the basis by `today-model.cjs` `adoptBasis`. In
other words: his old app had an open EARNED VOLUME card, the import carried it across, and
Today had never once been rendered over a state with one in it.

### Why no test caught it

Nearest cell: `rebuild/m3/w7-preview/today/test/view.test.mjs:93`, "Today paints the approved
design from engine values only", line 101:

```js
  assert.equal(slot(doc, "instruction").textContent, plainCopy(reference.nowModel(state).move.title));
```

It passed because it is tautological for this defect: it asserts that the slot equals whatever
the engine emitted, normalised. No cell asserts a PROPERTY of the headline (that it names the
day's session, that it is not a card title, that it is a sentence the label "Your plan for
today" can carry). And the branch is unreachable in the suite anyway: the fixture is
`rebuild/m3/w7-preview/fixtures.cjs:32`, `proposals: [], agentProposals: []`, so `decisionsN`
is always 0 and `move` always falls to the fix / rate / quiet branches. This is the
fixture-shape versus real-imported-shape gap exactly.

Second, independent miss, worth recording because it is the LAYOUT gate as well as the copy
gate: the headline vocabulary the layout is measured against is harvested from the engine
source by regex, and the regex cannot see this title.
`rebuild/m3/w7-preview/today/design.cjs:594-595`:

```js
    for (const pattern of [/(?:^|[\s,{(])title\s*:\s*"((?:[^"\\\n]|\\.){3,140})"/g,
      /(?:^|[\s,{(])title\s*:\s*'((?:[^'\\\n]|\\.){3,140})'/g]) {
```

Only quoted `title:` literals. The volume push title is a BACKTICK template literal passed as
`propose()`'s second positional argument, so it is in neither pattern. `headlineVocabulary()`
feeds `copy.test.mjs:149` and `browser-check.mjs:60` (`const HEADLINES = design.headlineVocabulary();`),
and the latter is the check that proves the 47px to 33px fluid headline keeps the primary
action inside a 390x844 viewport. So this string was measured by neither, and a 45-character
all-caps headline has never been through the fluid-floor check. The design.cjs comment above
that function also states an assumption that is now false: "the engine's own
nowModel().move.title, which the engine renders in upper case".

### C-UI-2: REMOVES, by construction

The ticket's own lines (`rebuild/lanes/c/ui-port/C-UI-2.md`):

> MAY CHANGE: `screens.template.html` (`t-today`), `today-app.cjs` (bindings only: the
> slots keep their names; new slots for the status pill, the note block, the timeline
> markers), `checkin-*` only where Today's Recovery row binds.

> LOCKED: the weigh-in stays inline (ruling 5); the stack is Start, Recovery, Talk and nothing
> else; the greeting and status line copy comes from the inventory's verbatim list.

The slot goes away. In the design of record (`rebuild/m1/approved-2026-09-18/app/app.html`,
`#screen-today`) the intro block is:

```html
      <h1 class="greeting" id="greeting">Morning, Joe.</h1>
      <p class="status-line" id="status-line">Upper body today. One change to review.</p>
```

and a proposal is a separate timeline card, `<div class="tcard proposal" id="card-proposal">`,
whose fields are kind / lift / change / reason / yes / no (see `app/states-today.js` `proposal()`
and `SET = { kind: 'One call needs you', title: 'Chest', change: 'Add one set this week', ... }`).
The design pack README section 3 says `screens.template.html` "is rebuilt to the prototype's
markup, screen by screen", so `instruction` and `instruction-why` cease to exist as slots and
`greeting` and `status-line` replace them, with the copy LOCKED to the inventory's verbatim list
rather than to `move.title`. The day's session moves to the status line ("Upper body today.")
and to `#card-train` ("Train today." / "Upper body, 4 exercises."), which is what the owner
expected to read.

The proposal card itself is C-UI-3 (`T-40, T-40b..T-40h`), not C-UI-2, so between the two the
volume proposal is simply not painted. The state inventory already documents this defect's
class, at row T-40 of `states/STATE-INVENTORY-DRAFT.md:130`:

> The sentence "One call needs you: <reason>." lands in the instruction-why slot as prose.
> There is **no proposal card**, no yes control and no accept path on Today

Two cautions for whoever builds C-UI-2. (a) `app/states-today.js:135` does put an engine
sentence in the greeting for one drawn state ("Hold the bench at 105 and let the reps come
back.", with `greeting.style.fontSize = '34px'`), so the greeting is not unconditionally a
greeting; the LOCKED line's "inventory's verbatim list" is the only thing standing between a
builder and rebinding `greeting` to `nowModel.move.title` again. (b) the inventory has NO row
for the greeting: the word does not occur anywhere in `STATE-INVENTORY-DRAFT.md`, so that
LOCKED line cites a list that does not yet exist for this slot. Both are worth one sentence
in the dispatch.

### Smallest safe fix (sketch, NOT applied)

The engine cannot be touched by anything: the design pack README section 4 locks "Nothing under
`rebuild/engine/`" for every C-UI ticket, and the S8 seal pins `rebuild/engine/today.cjs` and
`rebuild/engine/writers.cjs` in its `product` map. So the fix is a binding fix, in one of two
places.

Shape A, at the binding (`today-app.cjs`, PINNED):

```diff
-    put(map, "instruction", view.nowModel.move.title);
+    /* A proposal card title is not the day's plan. Until Today has a proposal card
+       (C-UI-3 / inventory T-40), the headline stays the day's own move and the open
+       decision is named where a count belongs, not in the headline slot. */
+    const move = view.nowModel.move;
+    put(map, "instruction", move.kind === "decisions" ? view.nowModelNoDecisions.move.title : move.title);
```

Shape B, at the adapter (`today-model.cjs`, UNPINNED), which needs no pinned file at all:
`projectionOf()` (today-model.cjs:97) gains one further projection computed on a clone whose
`proposals` and `agentProposals` are emptied, and `read()` serves THAT one as `nowModel`. The
headline then carries the engine's own next-best headline and nothing else changes. `nowModel`
is memoised per state object (`memoOnState`), so a clone is safe and cheap.

| file | pinned by S8? | note |
|---|---|---|
| `rebuild/engine/today.cjs` | PINNED (`product`) | do not touch; also LOCKED for every C-UI ticket |
| `rebuild/engine/writers.cjs` | PINNED (`product`) | do not touch; same lock |
| `rebuild/m3/w7-preview/today/today-app.cjs` | PINNED (`product`) | shape A needs it, so shape A rides a lane B reseal child |
| `rebuild/m3/w7-preview/today/today-model.cjs` | unpinned | shape B lives here alone |
| `rebuild/m3/w7-preview/today/screens.template.html` | unpinned | only if a decision-count slot is added |
| `rebuild/m3/w7-preview/today/design.cjs` | unpinned | widen `headlineVocabulary` to backtick literals |
| `rebuild/m3/w7-preview/today/browser-check.mjs` | unpinned | consumer of the widened vocabulary |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | PINNED (`executionPins`) | a NEW cell for this state needs a reseal |

Shape B, with no new template slot and no new cell, is deployable as a lane C slice hotfix with
no reseal: `view.test.mjs:101` stays green because the fixture's `proposals` is empty and the
fixture render is byte-identical. Widening `headlineVocabulary` is also unpinned and, measured
here, does NOT break `copy.test.mjs:149`: `plainCopy` on the uppercased volume title returns
`SIDE DELT: EARNED VOLUME: 10 → 12 WEEKLY SETS`, no dash survives and no word is dropped,
so that cell passes with the title admitted. It will, correctly, put a 45-character all-caps
string through `browser-check.mjs`'s fluid-floor check for the first time; that is the point of
widening it, and it is the one part of this fix that should be run before it is believed.

---

## S2. The body text under the headline is a sentence fragment

### The slot and the binding

Slot: `screens.template.html:23`, `<p data-slot="instruction-why"></p>` (quoted above).

Binding: `rebuild/m3/w7-preview/today/today-app.cjs:864-870`

```js
864:    const owed = !view.hasReadToday;
865:    /* Before a weigh-in the sentence under the instruction is the engine's reason for
866:       asking; after it, the engine's reading of where the plan stands. Both are the
867:       engine's own strings. */
868:    put(map, "instruction-why", owed
869:      ? (view.marchingOrder.why || view.statusFace.cause)
870:      : (view.statusFace.cause || view.nowModel.move.body));
```

On the evening in question he had not weighed in, so `owed` was true and the slot took
`marchingOrder.why`.

### Where that string comes from

`rebuild/engine/today.cjs:493-500`, inside `marchingOrder`:

```js
493:  const o0 = focus && focus.owed && focus.owed[0];
494:  if (o0) {
495:    const cueBy = { weight: "When you wake", night: "Before coffee", day: "Before bed tonight", yesterday: "Right now" };
496:    return {
497:      owed: true, kind: o0.k,
498:      ifText: cueBy[o0.k] || "Next", thenText: (o0.t || "").toLowerCase(),
499:      why: o0.why || "", targetLine, link: oweTarget(o0.k),
```

and the owed item itself is `nowFocus`, `rebuild/engine/today.cjs:213`:

```js
213:  if (nightOwed) owed.push({ k: "night", t: "Log last night", why: "bed, wake, and how long you took to drop off <U+2014> the body-composition read leans on this harder than anything else you enter" });
```

`plainCopy` on that string returns, executed here:
`bed, wake, and how long you took to drop off: the body-composition read leans on this harder
than anything else you enter` - the owner's line exactly, colon included.

### Root cause, in two sentences

The engine writes a marching order as FOUR parts meant to be read together, `ifText`,
`thenText`, `why` and `targetLine` ("Before coffee" + "log last night" + the why), and
`today-app.cjs:868` binds only `why`, which is written as a subordinate clause and therefore
starts lower case and reads as a fragment. It is a SLEEP why rather than a weigh-in why only
because `nowFocus` orders the owed list night-first (today.cjs:213 pushes before the weight
rung at `:216`), and after the real import there is no sleep night on record for last night,
so `nightOwed` fires and the sleep rung becomes `owed[0]`.

Correcting three guesses in the dispatch: nothing is cut, there is no offset and no
off-by-one, and this is not the sleep ENTRY helper copy. The full engine string is on screen;
it only looks truncated because the cue it belongs under was never printed. And the colon the
owner saw in place of a dash is `plainCopy`'s aside rule (plain-copy.cjs:58), working exactly
as DECISIONS:114 requires.

### Why no test caught it

Nearest cells: `view.test.mjs:102` inside the same paint test, and `view.test.mjs:116` in
"the primary action before a weigh-in is the engine's own marching order":

```js
102:  assert.equal(slot(doc, "instruction-why").textContent, plainCopy(reference.marchingOrder(state).why));
116:  assert.equal(slot(kit.doc, "instruction-why").textContent, plainCopy(view.marchingOrder.why));
```

The same tautology as S1: the assertion IS the binding. Line 116 is worse, because it reads
`view.marchingOrder.why` from the very object the binding read, so it would hold no matter
what the engine put there. And the sleep rung specifically cannot fire in the suite: the
fixture writes a night for every one of the 28 days before today, `fixtures.cjs:22`,
`nights.push({ d, h: 8, bed: "22:00", wake: "06:00", awakeMin: 0 })` inside the `i = 28 .. 1`
loop, so `owedNights` is empty and `owed[0]` is always the weight rung. `copy.test.mjs:444`
("Today renders every state it can reach without a dash") walks many Today states, but it
asserts only the absence of a dash, never that a slot holds a whole sentence.

### C-UI-2: REMOVES, by construction

Same MAY CHANGE and LOCKED lines as S1. `instruction-why` is replaced by `status-line`, whose
content in the design of record is the day's own reading ("Upper body today. One change to
review.", `app/app.html`; `face()` in `app/states-today.js:9-11`), and whose copy the ticket
LOCKS to the inventory's verbatim list. The owed rungs move to the timeline cards, where each
one carries its own whole sentence as a card title ("Weigh in before breakfast.", "Eat about
2,300 kcal today.", "Train today."), which is the composition S2 is missing. So the slot that
can hold a fragment does not exist after C-UI-2.

The same caution applies as for S1: "bindings only: the slots keep their names" is the phrase
a builder could read as licence to keep `marchingOrder.why` flowing into the renamed slot. The
dispatch should say in one line that `status-line` takes the inventory's sentence and not
`marchingOrder.why`.

### Smallest safe fix (sketch, NOT applied)

Compose the marching order into one sentence instead of printing one quarter of it:

```diff
-    put(map, "instruction-why", owed
-      ? (view.marchingOrder.why || view.statusFace.cause)
-      : (view.statusFace.cause || view.nowModel.move.body));
+    /* The engine writes a marching order in four parts and the why is a subordinate
+       clause. Printing the clause alone leaves a fragment on screen, so the cue and the
+       action it belongs under are printed with it. No engine word is changed or dropped. */
+    const mo = view.marchingOrder;
+    const orderLine = mo && mo.owed && mo.why
+      ? mo.ifText + ", " + mo.thenText + ": " + mo.why
+      : null;
+    put(map, "instruction-why", owed
+      ? (orderLine || view.statusFace.cause)
+      : (view.statusFace.cause || view.nowModel.move.body));
```

| file | pinned by S8? | note |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | PINNED (`product`) | the diff above lives here |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | PINNED (`executionPins`) | `:102` and `:116` both change |

S2 has NO unpinned route: the composition changes what the fixture renders, so
`view.test.mjs:102` and `:116` must be edited too, and both files are pinned. This one must
ride a lane B reseal child. The one narrower variant that would stay inside the seal is to
compose ONLY when `mo.kind === "night"`, which the fixture can never reach, leaving both
pinned cells byte-identical; that is a smaller fix but it leaves the weigh-in rung reading as
a fragment as well, which is the same defect one rung along. Recommend the full composition
and the reseal rather than the half.

Second, cheaper half, worth taking with it and NOT inside the seal: `nowFocus`'s night rung
fires for a man whose imported history carries no sleep at all, which is the population this
import exists for. That is an engine ordering question and cannot be fixed in lane C; it is
noted here for lane B's engine window rather than proposed.

---

## S3. Developer prose at the bottom of the production screen

### The source

`rebuild/m3/w7-preview/today/index.shell.html:16-29` (the whole file is 32 lines):

```html
  <main class="stage">
    <aside class="review">
      <p><strong>Earned &middot; Today</strong><br>Owner-approved 2026-09-08 design over the real engine and the real local operation log. Synthetic athlete; this is not an account.</p>
      <p id="today-storage">Checking this device's local storage&hellip;</p>
      <p id="today-status" role="status">Ready.</p>
    </aside>
    <section class="phone" aria-label="Earned Today">
      <div class="view" id="phone">
        <p class="note">Opening today&hellip;</p>
        <noscript>Today needs JavaScript. Nothing has been recorded.</noscript>
      </div>
    </section>
    <aside class="review">The morning weigh-in and the gym card are wired, each over its own durable store on this device. The nutrition detail, recovery check-in and coach are entry points only and say so on screen.</aside>
  </main>
```

Line 28 is the sentence the owner saw, verbatim. It is not a comment rendered as text, not a
status paragraph and not a build.mjs injection: it is a plain `<aside>` in the page shell.

### Why the production slice shows it

The shell is read verbatim, `design.cjs:621`:

```js
const shellHtml = () => fs.readFileSync(path.join(SOURCE, "index.shell.html"), "utf8");
```

`build.mjs:468, 492` writes `index.html` as that shell with the templates substituted into the
one marker:

```js
468:  const shell = design.shellHtml();
492:    "index.html": shell.replace("<!-- APPROVED_TEMPLATES -->", template),
```

and the slice then takes those bytes and makes exactly three edits, none of which touches the
asides, `rebuild/slice/pwa/shell.cjs:129-147` `installableHtml()`: the stylesheet link (adds
the manifest, theme colour, icons, the two web-app-capable metas), the bundle script (adds
preflight.js), and `</main>` (prepends `preflight.html`, which is itself a fourth
`<aside class="review">`, `#pwa-preflight`). `build-pwa.mjs:103` writes the result:

```js
103:  files.set("index.html", Buffer.from(shell.installableHtml(indexSource.toString("utf8"), names)));
```

So the deployed page is the PC review harness with a manifest bolted on. There is nothing
between the preview shell and the owner's phone.

### Root cause, in two sentences

The preview shell was written as a desktop review harness, with the phone frame flanked by two
explanatory asides, and the slice was built to add installability to A1's page rather than to
produce a page of its own. Nothing in the slice ever removed or gated the harness, so the
review prose is part of the product document on the phone.

### Why no test caught it

There is no cell that asserts anything about the shipped document outside the phone frame. The
only two assertions on the shell at all are `design.test.cjs:65`
(`assert.doesNotMatch(design.shellHtml(), /https?:\/\//)`) and `design.test.cjs:191` (the
template marker occurs exactly once). Every jsdom cell mounts that same shell as its own test
page (`view.test.mjs:52`, `copy.test.mjs:108`, `gym.test.mjs:473`, and six more) and scopes
every text assertion to `#phone` via `phoneText(doc)`, so the asides read as test scaffolding
rather than as shipped content, which is precisely the blind spot. `package.test.cjs:42` checks
that the built package is exactly the three reviewed assets, by NAME, and `copy.test.mjs:167`
scans the built HTML for dashes; neither looks at what the prose says. The pwa suite
(`rebuild/slice/pwa/test/pwa.test.cjs`) asserts headers, the manifest, the worker and the
precache list, never the document body.

### C-UI-2: CARRIES

C-UI-2's MAY CHANGE list is `screens.template.html`, `today-app.cjs` and `checkin-*`. It does
not name `index.shell.html`, `build.mjs`, `design.cjs` or anything under `rebuild/slice/pwa`.
So C-UI-2 changes what is inside the phone frame and leaves the harness around it exactly as it
is. Of the eight tickets, the shell belongs to two other ones:

- C-UI-1 MAY CHANGE includes "the preview build (`build.mjs`) to serve the assets offline and
  to honour the review hooks", and the review hooks it names include `?chrome=1`. The
  prototype's own convention is that the harness chrome is opt-in behind that flag
  (`app/app.css:334-343`, `.chrome { display: none; }` and `body.with-chrome .chrome { ... }`),
  so C-UI-1 is where the harness could become opt-in without a new idea.
- C-UI-8 MAY CHANGE is `rebuild/slice/pwa/*` and `DEPLOYS.md`, with the acceptance line "the
  owner's phone screenshot matches the board". That acceptance would catch S3. C-UI-8's
  SEQUENCING line is "last".

So: S3 survives C-UI-2 unchanged. Read literally, it survives C-UI-1 too (the ticket permits
the hook, it does not require the harness to be gated), and is only guaranteed gone at C-UI-8,
which is the last ticket in the port. That is many weeks of the owner reading developer prose
on his own phone every morning.

### Smallest safe fix (sketch, NOT applied)

The harness is right on the PC and wrong on the phone, so gate it on the same predicate the
slice already uses for its own install line. `rebuild/slice/pwa/preflight.css` already carries:

```css
@media (display-mode: standalone) {
  #pwa-preflight [data-pwa="install"] { display: none; }
}
```

Add one rule beside it:

```diff
 @media (display-mode: standalone) {
   #pwa-preflight [data-pwa="install"] { display: none; }
+  /* The review harness is the PC preview's, not the athlete's. Launched from the Home
+     Screen there is no reviewer on the other side of the glass. */
+  .stage > .review:not(#pwa-preflight) { display: none; }
 }
```

| file | pinned by S8? | note |
|---|---|---|
| `rebuild/slice/pwa/preflight.css` | unpinned (nothing under `rebuild/slice/` is in the seal) | the rule above |
| `rebuild/slice/pwa/test/pwa.test.cjs` | unpinned | the assertion that the rule is there |
| `rebuild/m3/w7-preview/today/index.shell.html` | unpinned | the alternative, blunter fix |
| `rebuild/m3/w7-preview/today/preview.css` | PINNED (`product`) | do NOT put the rule here |

Unpinned and slice-only, so a lane C hotfix deploys this with no seal. Note the trap: the
obvious home for a `display: none` rule is `preview.css`, and `preview.css` IS pinned. Put it
in the slice, which is also the honest layer, since the harness is only wrong on the installed
app. Caveat to record: `display-mode: standalone` does not match the page opened in a Safari
tab, so the prose would still be visible if the owner opens the deploy URL rather than the Home
Screen icon. If the PM wants it gone from the deploy entirely, delete lines 17 to 21 and line
28 of `index.shell.html` (keeping the `#today-storage` and `#today-status` elements, which
`today-app.cjs` and eight test cells read by id) and let `build.mjs` keep emitting the rest
unchanged. That is also unpinned, and it is the version C-UI-8 will want anyway.

---

## S4. The page header sits under the status bar

### What ships

Viewport meta, `rebuild/m3/w7-preview/today/index.shell.html:5`:

```html
  <meta name="viewport" content="width=device-width,initial-scale=1">
```

No `viewport-fit=cover`. And `installableHtml()` (shell.cjs:129-147) does not touch the
viewport meta: its three `once()` edits are the stylesheet link, the bundle script and
`</main>`.

Safe-area usage in anything shipped: NONE. A content search for `safe-area` and
`viewport-fit` across every `.css`, `.html`, `.mjs`, `.cjs` and `.js` under `rebuild/` returns
four hits, all in two unrelated spikes (`rebuild/m3/clock-spike/` and one stub), and none in
the Today page, in `preview.css`, in either pinned approved stylesheet, or anywhere in
`rebuild/slice/pwa/`.

Manifest display mode, `rebuild/slice/pwa/pwa.cjs:152-153`:

```js
    display: "standalone",
    orientation: "portrait",
```

The top spacing above the wordmark is a fixed figure, from the pinned approved design and
nothing else. `rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html`:

```css
.page{padding:25px 23px 20px;min-height:100%;display:flex;flex-direction:column}
.mast{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:30px}
.stage{display:grid;justify-items:center;gap:16px;padding:24px 8px}
@media(max-width:350px){.page{padding:22px 18px}...}
```

and from Refinement A, which is laid down first and whose narrow-screen rule C does not
override:

```css
@media(max-width:430px){.stage{padding:12px 8px 25px}.phone{width:390px;border-radius:25px}.page{padding-left:22px;padding-right:22px}}
```

So on a 393px-wide phone the document's whole top inset above the wordmark is 12px of `.stage`
padding plus 25px of `.page` padding, both fixed, and nothing anywhere reserves the status bar.
Neither approved reference uses `safe-area` or `viewport-fit` either (checked), because both
were authored as a 390x844 frame inside a desktop page, not as a full-screen app.

### Root cause, in two sentences

The page declares itself a standalone app (`display: "standalone"`, plus
`apple-mobile-web-app-capable` and `mobile-web-app-capable`, both added by
`installableHtml()`), but it is laid out as a fixed 390x844 rectangle inside a desktop review
page, with every vertical inset a hard pixel figure taken from an approved reference that had
no device chrome to avoid. No layer of the shipped page, at any level, expresses the status bar
as a quantity: not the viewport meta, not the manifest, not the pinned stylesheets, not
`preview.css`, not the slice.

I could not reproduce the exact overlap geometry from this machine and I am not going to claim
it. The preview build does not run here, so I did not measure the built document, and the
screenshot was not available. What is measured and certain is the necessary condition: the
shipped page reserves no space for the status bar by any mechanism. Two things I cannot settle
from source and that the fix should be checked against on the phone: (a) whether iOS is
overlaying the status bar despite the absent `viewport-fit=cover`, which is the behaviour the
symptom implies and which the presence of `apple-mobile-web-app-capable` makes plausible; and
(b) how the document was scrolled when the wordmark and the bottom aside were both in frame,
since in source the first `.review` aside sits ABOVE the phone section and should push the
wordmark roughly 90px down the document. Whoever applies the S4 fix should read the answer off
the phone rather than off this file.

Note also that the two fixes interact: fixing S3 by hiding the leading `.review` aside in
standalone REMOVES the ~90px that aside was contributing above the wordmark, so S3's fix makes
S4 strictly worse if S4 is not fixed in the same deploy. They must ship together.

### Why no test caught it

Nearest cell: `rebuild/slice/pwa/test/pwa.test.cjs:365`:

```js
  assert.equal(manifest.display, "standalone");
```

It passed, and it is the whole of what the seal proves about standalone: that the app DECLARES
standalone, never that it is DRAWN for standalone. No cell anywhere asserts the viewport meta's
content, and no cell asserts an `env(safe-area-inset-*)` anywhere. `design.test.cjs:65` is the
only assertion on the shell head and it only checks for remote origins.
`rebuild/m3/w7-preview/today/browser-check.mjs` measures the 390x844 fit in a headless browser,
which has no notch and no status bar, so a page that fits 844 usable pixels passes there and
overlaps on the device. There is no golden for the installed state at all: the phone is the only
place this could have been caught and `A5-REPORT.md` section 8 already says no iPhone had
confirmed this build's installed behaviour.

### C-UI-2: REMOVES the overlap, CARRIES the missing inset

The design of record fixes the overlap, but with a hard figure rather than an inset, and the
part C-UI-2 may change is only half of what is needed.

`rebuild/m1/approved-2026-09-18/app/app.html:5`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

`app/app.css`:

```css
#app { position: relative; width: 100%; height: 100%; height: 100dvh; overflow: hidden; background: var(--screen); }
.header { margin-top: 53px; height: 44px; display: flex; align-items: center; justify-content: space-between; }
.ui { padding-bottom: max(24px, env(safe-area-inset-bottom, 0px)); }
.screen-today .ui > .stack { padding-bottom: max(24px, env(safe-area-inset-bottom, 0px)); }
```

So the prototype reserves the status bar with `.header { margin-top: 53px }`, which is the same
54px its own review chrome draws the status bar at (`app.css:337`,
`body.with-chrome .chrome.status { top: 0; height: 54px; }`), and uses `env()` only at the
BOTTOM. There is no `safe-area-inset-top` anywhere in the pack (searched).

What that means ticket by ticket:

- The 53px reservation arrives with the new `t-today` markup and the new pinned stylesheet, so
  it is C-UI-1 (which MAY CHANGE `design.cjs`'s pins and replaces `preview.css`) and C-UI-2
  (which MAY CHANGE `screens.template.html` `t-today`). C-UI-2's acceptance line requires "gate
  green for `today` at 393 x 852 (fits, primary in the first viewport, thumb zone, columns,
  spacing, contrast)", which is the check that would hold it.
- The viewport meta is in `index.shell.html`, which NO ticket names in a MAY CHANGE line.
  C-UI-1's "the preview build (`build.mjs`)" is the nearest permission; C-UI-8's
  `rebuild/slice/pwa/*` is where `installableHtml()` lives and is the natural home. Either way
  it is not C-UI-2.
- A true top inset (`env(safe-area-inset-top)`) is in no ticket at all, because it is in no
  reference. The pack fixes the overlap on a 393x852 iPhone with a constant. On a device whose
  top inset is not ~53px the constant is wrong, and on a device where the web view is already
  inset (no `viewport-fit=cover`) 53px is additive and pushes everything down twice.

So, precisely: after C-UI-2 the wordmark no longer sits under the status bar on the owner's
phone class, provided C-UI-1 or C-UI-8 also adds `viewport-fit=cover`; the missing top inset as
a QUANTITY is carried through the whole port.

### Smallest safe fix (sketch, NOT applied)

Two edits, both in the slice, and they must land together: `env()` resolves to 0 without
`viewport-fit=cover`, so the padding alone is a no-op and the meta alone makes the overlap
certain.

```diff
 function installableHtml(indexHtml, names) {
-  let html = once(indexHtml, '<link rel="stylesheet" href="styles.css">',
+  let html = once(indexHtml, '<meta name="viewport" content="width=device-width,initial-scale=1">',
+    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
+    "the viewport meta");
+  html = once(html, '<link rel="stylesheet" href="styles.css">',
```

and, in `preflight.css`, beside the standalone block S3's fix uses:

```diff
 @media (display-mode: standalone) {
+  /* The installed app draws under the status bar (viewport-fit=cover above), so the
+     document reserves it as a quantity the device reports rather than a constant. */
+  .stage { padding-top: max(12px, env(safe-area-inset-top)); }
+  body { padding-bottom: env(safe-area-inset-bottom); }
 }
```

| file | pinned by S8? | note |
|---|---|---|
| `rebuild/slice/pwa/shell.cjs` | unpinned | the fourth `once()` edit; it asserts its own single match, so an upstream shell change fails the build rather than silently skipping |
| `rebuild/slice/pwa/preflight.css` | unpinned | the inset rules, same block as S3's |
| `rebuild/slice/pwa/test/pwa.test.cjs` | unpinned | assert the emitted meta and the two rules |
| `rebuild/m3/w7-preview/today/index.shell.html` | unpinned | the alternative: put `viewport-fit=cover` at source and drop the `once()` edit |
| `rebuild/m3/w7-preview/today/preview.css` | PINNED (`product`) | do NOT put the inset rules here |
| `rebuild/m1/approved-2026-09-08/*` | pinned by `design.cjs` sha256, not by S8 | untouchable either way; this is why the rule belongs in the slice |

Unpinned and slice-only: a lane C hotfix deploys this with no seal. Putting
`viewport-fit=cover` straight into `index.shell.html:5` is one line instead of an eight-line
build edit and is also unpinned; the only argument for the `once()` edit is that it keeps the PC
preview's behaviour unchanged. Either is defensible; the `index.shell.html` edit is smaller.

---

## Recommendation for the PM

SPLIT, and make the split along the seal rather than along the symptom. S3 and S4 are the two
the owner is living with every morning and they are the two that need nothing sealed: both are
pure `rebuild/slice/pwa/*` changes (`shell.cjs`, `preflight.css`, `pwa.test.cjs`), plus
optionally one line of the unpinned `index.shell.html`, and nothing under `rebuild/m4/spec`
names any of them, so a lane C hotfix can deploy them together today with no reseal child and
no engine byte moved. They MUST go together, because hiding the leading review aside removes the
~90px that was standing in for the status bar. S1 can go with them in its unpinned shape B
form, confined to `today-model.cjs`, which leaves the two pinned Today cells byte-identical
because the fixture carries no proposals; that turns the headline back into the engine's own
next-best move and costs nothing sealed. S2 is the one that cannot be hotfixed honestly: the
composition changes what the fixture renders, so `view.test.mjs:102` and `:116` must change,
and both `today-app.cjs` and `view.test.mjs` are pinned, so it rides the next lane B reseal
child together with the widened `headlineVocabulary`, the new `proposals`-bearing test cell and
a golden for the real imported shape. Fold NOTHING into C-UI-2 on the strength of it removing
the slot: C-UI-2 does remove S1 and S2 by construction, but it removes neither S3 nor S4, the
shell belongs to C-UI-8 which is sequenced last, and the ticket's "bindings only: the slots keep
their names" is exactly the phrase under which a builder can carry `move.title` and
`marchingOrder.why` into the renamed slots. Add one line to the C-UI-2 dispatch naming those two
bindings as things the port must NOT carry, and one line noting that the LOCKED reference to
"the inventory's verbatim list" has no greeting row behind it yet.

---

## What this round could not determine

1. The exact overlap geometry behind S4. The preview build does not run on this machine
   (`@noble/hashes` is absent from the only available node_modules and `npm install` is
   forbidden by the brief), so no built `index.html` was inspected and no page was rendered.
   The source-level facts in S4 are certain; the pixel account is not, and the two open
   questions are named in that section.
2. Whether iOS is overlaying the status bar despite the absent `viewport-fit=cover`. That is a
   device fact, not a repository fact, and it decides nothing about the fix (the fix adds both
   the meta and the inset).
3. Which of the four the owner's screenshot shows simultaneously and at what scroll offset. The
   screenshot was not available to this round.
4. What exactly his imported file carried in `proposals`. The import path's replayed state is
   the only possible source (established above by exclusion: nothing in `rebuild/` calls
   `runAdaptive`), but the content of his own record was not read and was not needed.

## Files read for this diagnosis

`rebuild/m3/w7-preview/today/`: `screens.template.html`, `index.shell.html`, `today-app.cjs`,
`today-model.cjs`, `today-engine.cjs`, `design.cjs`, `plain-copy.cjs`, `preview.css`,
`build.mjs`, `browser-check.mjs`, `local-source-basis.mjs`, `test/view.test.mjs`,
`test/copy.test.mjs`, `test/package.test.cjs`, `test/design.test.cjs`.
`rebuild/m3/w7-preview/fixtures.cjs`. `rebuild/engine/`: `today.cjs`, `writers.cjs`,
`migrate.cjs` (one region). `rebuild/slice/pwa/`: `shell.cjs`, `pwa.cjs`, `preflight.html`,
`preflight.css`, `build-pwa.mjs`, `test/pwa.test.cjs`. `rebuild/m4/workout/engine-runtime.cjs`.
`rebuild/m4/spec/acceptance-s8-real-shape.json`. `rebuild/m1/approved-2026-09-08/`:
`Earned-additions-C-approved.html`, `Earned-refinement-A.html`. On
`origin/rebuild/c-ui-port`: `rebuild/lanes/c/ui-port/C-UI-2.md`, `ui-port/README.md`,
`rebuild/m1/approved-2026-09-18/README.md`, `app/app.html`, `app/app.css`,
`app/states-today.js`, `states/STATE-INVENTORY-DRAFT.md`.

Nothing under `src/history.js`, `ledger/`, `rebuild/conform/private`, `C:\Users\joeym\EarnedPort\`
or `%TEMP%\port-real.log` was opened. One repository-wide `findstr` for `safe-area` returned two
incidental line hits from a path containing "soak" (`rebuild/m3/soak-stub/`); nothing in that
directory was opened or read further.
