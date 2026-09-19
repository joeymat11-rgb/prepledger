# N3-MACROS-DATA part A, Claude review A1 of the Astra build

2026-09-19. cowork (Earned lane hand), told to disagree.
Branch rebuild/c-n3-macros-data, head e66f4464, one build commit over the spec commit d3b9cbf2.
T below is rebuild/m3/w7-preview/today. All fixtures and figures below are invented.

## VERDICT: ACCEPT WITH NOTES, and N3-A MUST WAIT ON ITS LANE BRANCH

The product half is sound and I could not break the claim that matters most: for an
athlete who never turns macros on, I measured NO observable difference at the head.
Same engine arguments, same whole engine state, same stored bytes, same refusal codes,
same rendered string. The two things I disagree with the builder about are (1) a change
to validate() that nobody ordered, whose written justification is backwards, and which
the new cell now pins; and (2) the old-reader question the builder left unmeasured,
which I measured and which is worse than "unknown": an OLDER build refuses the WHOLE
import, not one day. Neither blocks the code. Together with a third measured fact, that
the new cell has NO CI home, they decide the merge question: N3-A stays on its lane
branch until the reseal child carries it.

## The bar, measured by me, at e66f4464

| System | food-macros | food | copy | view | adapter | package | total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Windows, owner's PC, %TEMP%\earned-astra-33 | 15/15 | 57/57 | 39/39 | 23/23 | 20/20 | 11/11 | 165/165 |
| Linux, clean farm worktree at e66f4464 | 15/15 | 57/57 | 39/39 | 23/23 | 20/20 | 11/11 | 165/165 |

Zero fail, zero cancelled, zero skipped, zero todo on both, one node process per cell,
MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York. This confirms the PM's 165 of 165 and
contradicts the builder's own sandbox numbers (it reported food 56/1/57 and package
0/11/11): those eleven package rows and that one food row are GREEN outside the sandbox,
so the report's "17 failing existing checks" are a property of the builder's sandbox, not
of this branch. package.test.cjs passing also settles the report's first UNMEASURED item:
the built package and its input census are green, and no product import of
device-preferences.mjs exists to move the census (measured: no file in the tree imports
it except the new cell, dynamically).

git diff --numstat d3b9cbf2..HEAD -- rebuild/engine .github printed NOTHING on the PC.
The commit touches exactly five paths, none sealed, none the template, none a copy array.

RED FIRST, re-proved by me on a clean d3b9cbf2 worktree carrying ONLY the new cell file:
15 tests, 4 pass, 11 fail, byte-for-byte the builder's table. I read every failure reason.
Ten of the eleven are rows about NEW behaviour (macro endpoints, macro refusal codes,
macro durability, macro admission, and ERR_MODULE_NOT_FOUND for the absent preference
module). The eleventh is not, and is finding 1.

## FINDING 1 (NOTE, recommend REVERT): the validate() change nobody ordered, and its
## written reason is measurably the wrong way round

food-commands.cjs:89 changed from `dayOf(JSON.parse(JSON.stringify(op.payload.day)))`
to `dayOf(op.payload.day)` with the comment "JSON would erase an own undefined key".

WHAT IT ACTUALLY CHANGES. I ran base and head validate() side by side over 28 shapes,
including every one the ticket names. Seven diverge. One is the intended additive change
(cal+pro+macros: base false, head true). The other SIX all go base VALID to head INVALID:

| day (invented) | base validate | head validate |
| --- | --- | --- |
| `{cal:1234}` with own `pro` set to `undefined` | true | false |
| `{cal:1234, pro:88}` with own `fat` set to `undefined` | true | false |
| `{cal:1234, pro:88}` with an extra own NON-member set to `undefined` | true | false |
| `{cal:{toJSON(){return 1234}}, pro:88}` | true | false |
| `{cal:new Number(1234), pro:88}` | true | false |
| `{pro:88}` plus a NON-ENUMERABLE own `cal:"x"` | true | false |

NaN, Infinity, negative zero, a numeric string, a boxed-free getter, an inherited member,
a circular reference, a BigInt, a Date and a fractional value are IDENTICAL at base and
head. So is every cal/pro value in refusalFor: I ran 21 odd values (Boolean, {}, [],
[12], null, boxed Number, an object with toString, Date, NaN, Infinity, -0, numeric
strings, '+1', '1e2', a Proxy) through base and head refusalFor for both cal and pro and
measured ZERO divergences. The typeof guard at food-model.cjs:50 really does run only for
macro keys, and a non-string non-number cal or pro behaves exactly as it did.

WHY THE STATED REASON IS BACKWARDS. The op's identity is its canonical_content_commitment,
computed by rebuild/client/canonical.cjs, whose own profile line 8 reads "absent -> the key
is OMITTED (an undefined value is never written)". I measured it:

    encode({cal:1234})                 -> {"cal":1234}
    encode({cal:1234, pro:undefined})  -> {"cal":1234}      byte identical: true

So the canonical encoder erases an own undefined key exactly as JSON does. The BASE
validator was therefore judging the content that would actually be committed and stored.
The HEAD validator judges a pre-serialization object that never exists durably, and
refuses an op whose committed bytes are a perfectly valid legacy day. On the two rows
where head is genuinely better (a boxed Number encodes as `{"cal":{}}`, a toJSON value
makes the encoder throw "unencodable function"), base validate was lying and the client
caught the damage one layer down as WORKOUT_INPUT_INVALID anyway.

IS ANY OF IT REACHABLE? No, and I measured that too rather than arguing it.
- WHERE validate IS CALLED. Exactly two product call sites in the whole tree.
  rebuild/client/index.cjs:307, on the in-memory envelope Ops.build just made from
  prepare()'s output. And rebuild/m3/w6/local/source-admission.mjs:508, on ops that
  arrived through the w5 source codec, i.e. parsed JSON. It is NEVER called on a stored
  day at read: T/food-host.mjs:53 foodDaysIn filters by class and profile and does not
  call it.
- WHAT prepare() PRODUCES. Measured: own keys only, every value typeof number, no own
  undefined, Object.prototype. dayOf builds a fresh object, so the write path can never
  hand validate a diverging shape.
- WHAT A JSON ROUND TRIP LEAVES. Re-running all 28 shapes AFTER a JSON round trip (the
  wire and the source bundle) leaves exactly ONE divergence, the intended macros one.
  So the import path cannot see the change either.
  (A structuredClone, which is what IndexedDB stores, does preserve four of them, but
  nothing can put such an object into the repository: only prepare() writes there.)

SO: no shipped path can produce a divergence, nothing on a phone can, and no stored day
would be refused at read. The athlete sees nothing. That is why this is a NOTE and not a
blocker.

WHY IT SHOULD STILL BE REVERTED. It is outside "the ADDITIVE data layer only". It exists
to satisfy exactly one assertion, which I isolated: on the base product the cell fails at
food-macros.test.mjs:92 with the message `raw validator: undefined`, `true !== false`.
That row asserts `valid({cal:1234, pro:88, fat:undefined}) === false`. The line ABOVE it,
:91, already asserts `assert.throws(() => prepare(day))`, which is the check that matters,
and which passes at the base. The row demands that validate refuse an op whose committed
content is `{"cal":1234,"pro":88}`. The premise is wrong.

THE ROW THAT DECIDES IT: food-macros.test.mjs:88 puts `undefined` in the raw-value loop,
and :92 asserts validate is false for it. Remove `undefined` from that loop (it is
already covered by `prepare` throwing on :91) and the one reason for the product change
disappears.

SMALLEST FIX: restore food-commands.cjs:89 to
`try { dayOf(JSON.parse(JSON.stringify(op.payload.day))); } catch { return false; }`
and drop `undefined` from the value list at food-macros.test.mjs:88.
I MEASURED that this is the whole cost: mutation M10, which reverts exactly that line and
nothing else, is KILLED by food-macros.test.mjs and by no other cell. Two rows of the new
cell, and nothing in food, copy, view, adapter or package, currently pin a change nobody
ordered. If the PM prefers to KEEP it, keep it only with a row that states the real
justification (a boxed Number and a toJSON value are not encodable as numbers), and say so
at the line, because the comment now on :88 is not what the code does.

## FINDING 2 (NOTE that decides the merge question): OLD READER, NEW FACT, measured

The builder marks this unmeasured. I measured both halves, with BASE bytes doing all the
reading: a d3b9cbf2 worktree, and a head food host writing into the SAME fake IndexedDB.

(a) THE PAGE IS FINE. Head writes `{cal:1234, pro:88, fat:37, carbs:149}`. The base
food host reads it back, and I measured, all with base bytes:

    rows: 1
    row.day as the OLD reader sees it: {"cal":1234,"pro":88,"fat":37,"carbs":149}
    base foodProjection threw: no
    base unavailable: []
    base loggedDay: {"cal":1234,"pro":88}
    base winningRows count: 1
    what the OLD screen would show: "1234 kcal . 88 g protein"

The generation loads. Nothing throws. The day is NOT lost. The old reader simply cannot
see fat and carbs, which is the point. This is because T/food-host.mjs:72 passes the
whole day through without consulting MEMBERS, and base foodProjection and base loggedDay
loop over their own two-member MEMBERS. Good design, and it holds.

(b) BUT THE BASE VALIDATORS REFUSE THE OP.
    base Food.validate(stored op): false
    base dayOf(stored day): THREW FOOD_INPUT_INVALID
That is food-commands.cjs:47, the unknown-key guard. The page never calls validate, so
nothing happens on the page. The IMPORT does call it, and that is where it bites.

(c) THE WHOLE IMPORT REFUSES ON AN OLDER BUILD. Through the real S3 fixture and the real
controller, base source-admission.mjs over a generation holding one cal+pro day and one
macros day:

    handle.ready: false
    handle.issues: [{"code":"LOCAL_SOURCE_DAILY_UNRESOLVED","op_id":"A1-op-1"}]
    controller.view(handle) THREW LOCAL_SOURCE_QUALIFICATION_UNOWNED
    repository unchanged by preparation: true
    the macros op is still in the repository intact

Not one day lost: the WHOLE source cannot be viewed, so the whole import or restore
refuses, and the legacy cal+pro day in the same source goes with it. Nothing is
destroyed (preparation writes nothing), but the athlete gets no import at all.
The head control on the same fixture is clean: view.ready true, dailyLogs for the macros
day is `{"cal":1500,"pro":90}` with no macro key anywhere in the engine state.

(d) SUPERSEDE, AND IT IS SILENT. The old reader then corrects the same day with two
figures. Measured, base bytes:

    every stored day, in log order:
      [{"cal":1234,"pro":88,"fat":37,"carbs":149},{"cal":1500,"pro":90}]
    winning row.day: {"cal":1500,"pro":90}
    fat still in the WINNING record? false
    the macros device reopens: head winning row.day {"cal":1500,"pro":90}
    the superseded macros op is still IN THE LOG: true

So a save from an old reader (or from the head page with the toggle OFF, which is the
same shape) silently drops fat and carbs from the winning record. The fact is not
destroyed, it is only unreachable: nothing in the tree reads a superseded op's macros.
This is exactly the spec's Q1 ("blank optional boxes KEEP already-recorded macros") and
the builder's own handoff line about a retaining writer. N3-A does not claim to solve it
and should not. It is named here because it is the second reason not to let a macros day
exist on a real device before N3-B ships the retaining writer.

WHAT THIS DECIDES. It is safe for the CODE to sit on the chain (nothing changes for an
athlete with no macros). It is NOT safe for a macros DAY to exist on a phone while any
older build can still be loaded: that athlete's import refuses whole. Since the page
cannot write a macros day until N3-B wires the inputs, the risk is zero today and
becomes real the moment N3-B lands. N3-B must therefore carry a compatibility answer,
and the reseal child must land the two together.

SMALLEST FIX: none in N3-A. Add to the N3-B handoff, as a named acceptance row:
"a source carrying one macros op must not refuse the whole import on a build that
predates the macros keys", and decide there between a schema bump, a forward-compatible
unknown-key rule in dayOf, and never shipping a macros write before the reader is out.

## FINDING 3 (NOTE, and the reason N3-A cannot merge yet): the new cell has no CI home

.github/workflows/rebuild.yml:232 names THIRTEEN Today cells by exact path.
food-macros.test.mjs is not one of them, and .github is untouched by this commit
(numstat empty, measured). So all fifteen new rows run nowhere in CI, on neither OS.
The workflow is SEALED P at S8:201, so the CI home can only be added in the reseal child.
The spec itself asked for the rows to go into T/test/food.test.mjs precisely to inherit
its CI home (section 9), but that file is SEALED P+E (spec section 8, S8:746 and :1609),
so the spec contradicts itself and DECISIONS:595 resolved it by ordering a new free file.
The consequence is unavoidable and is exactly :186 (3) and :582: no product byte sits on
the chain without a CI home.

## FINDING 4 (NOTE): six survivors out of thirty single-clause mutations

Thirty one-clause changes, one at a time, on a clean scratch copy at e66f4464, ALL SIX
cells run per change. Twenty four were killed. Six survived; two of those are equivalent
mutants and I say so rather than counting them as gaps.

| Mutation | Result | The row that would kill it |
| --- | --- | --- |
| M09 remove the unknown-key guard, food-commands.cjs:47 | SURVIVED, real gap | `assert.throws(() => dayOf({ cal: 1800, steps: 10 }), /FOOD_INPUT_INVALID/)` and `assert.equal(valid({ cal: 1234, zzz: 1 }), false)`. food.test.mjs:200 tests prepare's INPUT key guard, never dayOf's own. This is the exact guard that makes an older build refuse a macros op (finding 2b), so it matters more now than at the base. |
| M16 `/^\d+$/` becomes `/^-?\d+$/` in refusalFor | SURVIVED, real gap, one input | Only `-0` changes: with the mutation `{fat:'-0'}` is ACCEPTED and stores -0. food.test.mjs:279 tests `'-3'`, which the bound catches anyway. Killing row: `assert.equal(refusalFor({cal:'2100',pro:'150',fat:'-0'}), 'FAT_RANGE')` and `assert.equal(refusalFor({cal:'-0'}), 'CAL_RANGE')`. |
| M26 a stored non-Boolean is coerced instead of refused | SURVIVED, real gap | Nothing in the cell can plant a corrupt value, because writeTrackMacros refuses one. I planted `'yes'`, `1`, `0`, `null` and `{}` UNDER the module and measured: every one is REFUSED with DEVICE_PREFERENCES_READ_FAILED, and the refused read does not rewrite the value. The code is right; only the proof is missing. Killing row: open the store directly, `store.put('yes','trackMacros')`, then `await assert.rejects(pref.readTrackMacros(), {code:'DEVICE_PREFERENCES_READ_FAILED'})`. |
| M30 drop `db.onversionchange = close` | SURVIVED, real gap | Nothing exercises versionchange. I measured it: a second connection opening at version 2 is NOT blocked, and the first handle then refuses both a read and a write with the right codes. Killing row: hold a handle, open version 2, assert the second open is not blocked and the held handle's next read rejects DEVICE_PREFERENCES_READ_FAILED. |
| M12 `typeof value !== "number"` becomes `typeof value === "undefined"` | SURVIVED, EQUIVALENT | `Number.isFinite` is the strict form and is false for every non-number, so the next clause already refuses. No behaviour change exists to detect. |
| M29 remove the closed-handle guard | SURVIVED, EQUIVALENT under this store | After `db.close()`, `db.transaction()` throws InvalidStateError, which the catch turns into the same DEVICE_PREFERENCES_*_FAILED code. The guard is belt and braces; the store enforces it. |

Every other clause is pinned. Notably killed: M19 (feeding the engine fat and carbs) by
food-macros; M04 and M05 (moving a member between MEMBERS and ENGINE_MEMBERS) by both
food cells; M23 (first row wins instead of last) by both; M20 (loggedDay reporting macros)
by food.test.mjs; M21 (one digit changed in the fat sentence) and M22 (carbs refusing
under the fat code) by food-macros; M24, M25, M27 and M28 (preference default, commit
timing, Boolean-only, database name) by food-macros.

## FINDING 5 (NOTE): where MEMBERS now reaches, and it reaches further than the diff shows

MEMBERS grew from two to four. I grepped the WHOLE tree, sealed files included, for
MEMBERS, LIMITS, REFUSALS, dayOf, refusalFor, dayFromEntry, recordedDay and loggedDay,
and for every importer of the two modules.

| Consumer | Can its behaviour change? | Measured |
| --- | --- | --- |
| T/food-model.cjs | yes, by design | dayFromEntry and refusalFor now admit four fields; foodProjection and loggedDay pin themselves to ENGINE_MEMBERS |
| T/today-model.cjs:436 loggedFood | no | loggedDay is ENGINE_MEMBERS only |
| T/today-model.cjs:439 recordedFood | YES, it now carries fat and carbs | recordedDay is NOT in the diff and never filtered: it returns the whole winning row. I measured it byte-identical at base and head over the same macro row |
| T/today-app.cjs:1227 and :1353 | NO | its own local `dayOf(row)` picks cal and pro by name. Measured over a macros row: `{"cal":1950,"pro":160}`, intakeLine `"1950 kcal . 160 g protein"`, identical to the macro-free row |
| T/today-app.cjs:1281 refusalFor | NO | the entry it builds is `{cal, pro}` only, so FAT_RANGE and CARBS_RANGE are unreachable from the page; and FOOD_REFUSAL_COPY at :142 would fall back to the generic sentence if one ever arrived |
| T/food-host.mjs | NO | imports createFoodCommands, PROFILE, ACTION, OP_CLASS, OP_KIND. Not MEMBERS |
| W/local/source-admission.mjs:508 and :547 | admits macros, projects cal and pro | measured: dailyLogs for a macros day is `{"cal":1500,"pro":90}`, the raw op stays intact in the repository |
| M/measure/measure-sources.mjs:135 and :157 | NO | both read `row.cal` and `row.pro` by name |
| I/import/daily-history.cjs | NO | `if (original.schema_version !== 1) fail('DAILY_SCHEMA_UNSUPPORTED')` at :41, and the page writes schema 2. The spec's claim on this file is correct |
| coach/tools.cjs | NO | its FORBIDDEN_KEYS window is over engine state keys; no food module is imported anywhere under coach/ |
| T/design.cjs, the template, the copy arrays | NO | none imports either module; the copy array is byte-unchanged |

One consumer therefore DOES show something new: `recordedFood(today).day` now carries fat
and carbs when the day has them. Nothing renders it yet. It is not BLOCKING because no
writer can produce such a day until N3-B, and because the page's own dayOf() drops it.
It is exactly the surface the spec names for N3-B display ("Read macro values from
recordedFood(today).day, not loggedFood"), so it is deliberate, but it is a grown surface
that is not in the diff and the build report does not name it.

RECORDEDDAY, the ticket's direct question: for a macros day it returns the whole winning
row, `{op_id, date, time, offset, day}` with `day` carrying every stored key. It is read
by today-model.cjs:439, by today-app's provenanceLine (time and offset only) and by the
two food cells. It is not exported, not sent to the coach and not in any measure source.

## FINDING 6 (NOTE): a malformed macro with no calories and no protein says "nothing"

refusalFor's NOTHING check now runs BEFORE the range checks and asks only about
ENGINE_MEMBERS. Measured at the head:

    {}                              -> NOTHING
    {cal:'', pro:''}                -> NOTHING
    {fat:'37'}                      -> NOTHING
    {carbs:'0'}                     -> NOTHING
    {fat:'37', carbs:'149'}         -> NOTHING
    {cal:'0'}                       -> null, day {"cal":0}
    {pro:'0'}                       -> null, day {"pro":0}
    {cal:'2100',pro:'150',fat:''}   -> null, day {"cal":2100,"pro":150}
    {cal:'2100',pro:'150',fat:'0'}  -> null, day {"cal":2100,"pro":150,"fat":0}

"Macros alone refuse" is met, and the blank / explicit-zero rule is exactly right: blank
omits the key, an explicit zero is a present value, nothing is inferred, no clamp.
The wrinkle: a MALFORMED macro typed with no calories and no protein also returns
NOTHING, not FAT_RANGE. `{fat:'no'}` gets the sealed page's "Enter calories, protein, or
both. Nothing was recorded." rather than the fat sentence. That is not wrong today (the
page cannot produce such an entry), and the spec's section 7 "Required fields refusal"
belongs to N3-B, but N3-B must decide the order of the two checks deliberately rather
than inherit it. SMALLEST FIX: none in N3-A. A named N3-B row.

## FINDING 7 (NOTE): the two proposed sentences are byte-exact, and the seam is honest

I compared the two strings in food-model.cjs:38 and :39 against the spec's section 7 table
rows programmatically. Both are byte-identical (93 and 95 bytes), ASCII only, zero U+2013
and zero U+2014. All four touched code files and the build report: zero U+2013, zero
U+2014, zero CR bytes, no non-ASCII character at all.
MACRO_REFUSAL_COPY is marked PROPOSED, NOT OWNER-APPROVED at :35 and is bound into no
copy array and no view. REFUSALS is byte-unchanged and the sealed page's copy inventory
is untouched: copy.test.mjs is 39/39 on both systems. That seam is kept exactly as
DECISIONS:595 required ("every sentence the athlete reads waits for his ruling").

## FINDING 8 (NOTE): device-preferences.mjs, read against IndexedDB's real semantics

I read every line and then measured the parts the builder's fault-injected fake does not.

- A WRITE RESOLVES ONLY ON COMMIT. `resolve` lives in `tx.oncomplete` (:42-48), never in
  `request.onsuccess`. Confirmed by mutation: M25, which adds `if (write) resolve(value)`
  to the request's success handler, is KILLED.
- A BLOCKED OPEN is handled, and it does not leak. `onblocked` refuses and sets `failed`;
  if the open later succeeds, `onsuccess` sees `failed` and calls `request.result.close()`
  (:21-24). Reasoned from the source, not measured: I could not make this fake store fire
  onblocked at all (a second connection at version 2 opened immediately). Listed below as
  not verified.
- VERSIONCHANGE MID-FLIGHT. `db.onversionchange = close` (:29). Measured: a second
  connection at version 2 is NOT blocked, and the first handle's next read and next write
  both reject, DEVICE_PREFERENCES_READ_FAILED and DEVICE_PREFERENCES_WRITE_FAILED. Per
  the store's own rule, `close()` lets a transaction already in flight run to completion,
  so a write in progress still resolves truthfully. Nothing in the cell measures this
  (mutation M30 survives).
- A STORED NON-BOOLEAN REFUSES, it does not coerce. Measured by planting a value under the
  module: `'yes'`, `1`, `0`, `null` and `{}` each reject DEVICE_PREFERENCES_READ_FAILED,
  and the refused read leaves the stored value alone. Missing key reads false. Nothing in
  the cell measures this either (mutation M26 survives).
- NO ATHLETE IDENTITY. The database is the literal `'earned-device-preferences'`, the
  store `'preferences'`, the key `'trackMacros'`. No id, no name, no athlete branch.
- NOT REACHABLE FROM EXPORT, IMPORT OR SYNC. No file in the tree imports the module
  except the new cell, dynamically. The source codec, source-admission, replay-registry
  and the coach window never name it. It is a separate database from the local era's, so
  no generation, outbox or receipt can carry it.
- ONE FORWARD-COMPATIBILITY FACT for N3-B, measured: once the database exists at version 2
  or higher, an older page opening at version 1 gets DEVICE_PREFERENCES_OPEN_FAILED with
  cause VersionError. Refusing is the right behaviour, but it means the preference is
  one-way: a version bump locks every older cached page out of the setting permanently.
- ONE HOUSEKEEPING FACT for N3-B: T/gym-check.mjs:549 and T/browser-check.mjs:283 read
  `indexedDB.databases()` and their comments claim "C4b - ONE STORE". They use `includes`
  and a deny-list, so a new name will not fail them, but when N3-B actually creates
  `earned-device-preferences` on the device that claim stops being true and those two
  comments need a deliberate word, not a silent pass.

WHAT THE FAULT-INJECTED FAKE PROVES AND DOES NOT. It wraps fake-indexeddb's real
transaction API from OUTSIDE the product (food-macros.test.mjs:176-210) and injects
failures at open, at `db.transaction`, at `store.get`, at `store.put`, and an abort after
a successful request, plus a delay that holds a transaction open. That is a genuine proof
that every one of those failures rejects with the right code, that a prior value survives
a failed write, and that acknowledgement waits for commit. It proves NOTHING about a real
browser's quota eviction, private-mode storage, a killed process mid-commit, a second tab,
or a phone's power loss, and the builder says so. I agree with that limit and add the
three above that the fake COULD have proved and did not.

## THE ENGINE IS FED THE SAME, re-proved with a cell of my own

Not a copy of the builder's. Mine proxies the real engine's writeDaily on a four-row log
that carries a SUPERSEDING correction, a protein-only day and an explicit zero, and
compares the captured arguments and the WHOLE serialized engine state against a
macro-free control:

    rows: 09-02 {cal:2100,pro:150,fat:70,carbs:200}
          09-03 {pro:130, fat:0}                      (protein only)
          09-02 {cal:1950,pro:160,carbs:0}            (supersedes the first)
          09-04 {cal:0, fat:1000, carbs:1000}         (explicit zero)

    writeDaily calls, control : [["2026-09-02",{"cal":1950,"pro":160}],
                                 ["2026-09-03",{"pro":130}],["2026-09-04",{"cal":0}]]
    writeDaily calls, macros  : identical
    arguments identical         : true
    whole engine state identical: true
    unavailable identical       : true
    any macro key in dailyLogs  : false

And the same log through the BASE bytes gives the same whole state as the head, for both
the macro-free and the macro-carrying rows. The projector really is unchanged. Mutation
M19, which swaps ENGINE_MEMBERS for MEMBERS at food-model.cjs:104 and would feed the
engine fat and carbs, is KILLED.

## THE SPEC, where it and the build disagree, and where the spec is wrong about the code

The spec is Astra's too and unreviewed. Reviewing the sections N3-A implements:

1. SPEC SECTION 3 and SECTION 6 say "new prepare/save and entry validation require BOTH
   cal and pro" and "New saves require cal and pro". THE BUILD DOES NOT DO THIS, and is
   RIGHT not to: DECISIONS:595 says in plain words that N3-A "may NOT change today's rule
   for what makes a valid new save" and that "both required" is N3-B. The spec sentences
   are N3-B's and should be labelled so; as written they read as N3-A requirements and a
   future reader will think the build missed them. SMALLEST FIX: N3-B marks those two
   sentences with their ticket half.
2. SPEC SECTION 9 says to add the new rows to T/test/food.test.mjs "so they inherit its
   existing CI home". SPEC SECTION 8 says that same file is SEALED P+E at S8:746 and
   :1609. The spec contradicts itself. DECISIONS:595 resolved it in favour of a new file.
   The spec should record the resolution, because as it stands section 9 instructs a
   sealed edit.
3. SPEC SECTION 3 says older binaries "reject unknown keys, T/food-commands.cjs:45".
   Correct, and I measured the consequence (finding 2b and 2c). The spec does not follow
   it through to what an older build does to a whole IMPORT, which is the material fact.
4. SPEC SECTION 8's claims about the files it says need no edit are all CORRECT as far as
   I could check them: food-host.mjs passes the day through generically, today-model.cjs
   recordedFood already exposes the raw row, measure-sources reads cal and pro by name,
   daily-history.cjs is schema-1 only (verified at :41), and source-admission imports the
   shared validators.
5. SPEC SECTION 9's sixteen rows versus the build's fifteen. Six of the sixteen are N3-B
   or unmeasurable here (correction retains hidden facts, raw display, adverse save
   outcomes, full backup round trip, copy inventory, narrow phone controls, required
   module census) and the build correctly did not fake them. The build ADDED an admission
   row the spec did not have. Honest.
6. SPEC SECTION 2 line about a "backup carrier" and the builder's report both say the
   round trip is UNMEASURED. I did not measure it either and did not try: the carrier is
   not named anywhere in the tree I may read.

## THE BUILDER'S REPORT AS A HYPOTHESIS

Where I disagree with it:
- "the validator erased own undefined" (the report's red-first rows for fat and carbs raw
  values) is stated as a DEFECT in the base. It is not a defect: the canonical encoder
  erases it too, so the base validator matched the committed content. Finding 1.
- "Package GREEN and unchanged emitted input census: blocked by the sandbox build
  failure" is now measured GREEN, 11/11, on both systems. The report's "17 failing
  existing checks" are sandbox artefacts and are 0 outside it.
- "old-client downgrade compatibility ... unmeasured". Measured, and it is worse than
  unknown for the import path. Finding 2.
Where it is straight: the seal and custody table, the file-by-file change list, the
red-first counts (4/11, re-proved exactly), the copy seam, the fault-harness limits, and
the N3-B handoff list, which is the best part of the document.

## THE PM'S QUESTION, ANSWERED PLAINLY

FOR AN ATHLETE WHO NEVER TURNS MACROS ON, IS ANY OBSERVABLE BEHAVIOUR OF THE TODAY PAGE
DIFFERENT AT THE HEAD? NO. Measured, not argued, four ways:

- A REFUSAL: no. Over 21 odd cal values and 21 odd pro values, base and head refusalFor
  agree on every single one, zero divergences. NOTHING, CAL_RANGE and PRO_RANGE are
  byte-unchanged, and the page can only build a two-key entry, so the new codes are
  unreachable from it.
- A STORED BYTE: no. The page's entry is `{cal, pro}`; dayFromEntry over such an entry is
  unchanged; prepare and dayOf over a two-member day are unchanged; validate cannot
  diverge on anything prepare produces (measured: prepare's output has no own undefined,
  every value typeof number).
- AN ENGINE INPUT: no. Same writeDaily arguments, same whole engine state, on a log with
  a supersession, a protein-only day and an explicit zero.
- A RENDERED STRING: no. copy.test.mjs 39/39 and view.test.mjs 23/23 on both systems,
  the copy array is byte-unchanged, and today-app's own dayOf and intakeLine over a
  macros row produce exactly the string they produce over the macro-free row.

The ONE thing that is different and that I want on the record: `recordedFood(today).day`
would carry fat and carbs if a day had them. No athlete can make such a day until N3-B,
and nothing renders it.

MAY N3-A MERGE TO THE CHAIN BEFORE THE RESEAL CHILD? NO. It MUST WAIT on
rebuild/c-n3-macros-data, for one measured reason and one supporting one:
1. The fifteen new rows have NO CI HOME. rebuild.yml:232 names thirteen Today cells by
   exact path, food-macros.test.mjs is not among them, and .github is untouched. The
   workflow is sealed, so the home can only be added in the reseal child. Product on the
   chain with no both-OS evidence is exactly what :186 (3) and :582 forbid. Landing it
   would put 42 lines of product and 277 lines of cell on the chain where CI never sees
   them, and the next hand to touch food-model.cjs would break them silently.
2. The compatibility fact of finding 2c belongs to the same child: whatever N3-B does
   about an older build refusing a whole import must be decided with the writer that can
   first create a macros day, not before it.

Nothing in the code argues for waiting. The absence of a CI home does, and it is
unarguable.

## RECOMMENDED BEFORE THIS BRANCH IS CARRIED BY THE RESEAL CHILD

1. Revert food-commands.cjs:89 to the base JSON round trip, and drop `undefined` from the
   raw-value list at food-macros.test.mjs:88 (finding 1). If the PM keeps the change
   instead, correct the comment at :88 to the real reason.
2. Add the four killing rows from finding 4 to food-macros.test.mjs: the dayOf unknown-key
   guard, the `-0` string, the planted non-Boolean preference value, and versionchange.
3. In the reseal child, add food-macros.test.mjs to rebuild.yml:232 in the same hunk that
   adds the product to the seal (finding 3).
4. Add two named N3-B acceptance rows: the whole-import refusal on an older build
   (finding 2c) and the silent supersede of hidden macros (finding 2d).
5. Fix the two spec self-contradictions (spec section 1 and 2 of my list above).

## WHAT I DID NOT VERIFY

- A real browser, a real phone, a real IndexedDB. Everything about device-preferences.mjs
  was measured against fake-indexeddb. Quota eviction, private mode, a killed process
  mid-commit, two tabs, power loss: unmeasured, and the module's `onblocked` path could
  not be exercised because this store never blocked.
- The backup and restore round trip for the optional keys. The carrier is not named
  anywhere in the tree I may read. Admission is not that proof, and I agree with the
  builder that it is not.
- Any browser, layout, accessibility or 16px check. I launched no browser.
  T/food-check.mjs, gym-check.mjs and browser-check.mjs were read, never run.
- design.test.cjs, problem.test.cjs, checkin, gym, setup, catalogue, machine-settings-ui,
  ntc-h6-delta and the measure cells. I ran the six the ticket named and no more, on a
  shared PC.
- The private conformance gates, the soak, the seal generator and any package --full.
  None was run, none was read.
- Whether the sealed acceptance shape really lists the five paths as FREE. I took the
  builder's table and DECISIONS:595's own measurement for that; I did not reparse
  acceptance-s8-real-shape.json myself.
- The concurrency of a second tab correcting the same day, and the ordering of two
  devices' ops under a real sync. winningRows was exercised only with a synthetic log.
- I did not run the mutation sweep on Windows. All thirty mutations were run on Linux,
  six cells each; the head bar itself was measured on both systems.

Committed by a reviewer, whose only change to this branch is this file.
