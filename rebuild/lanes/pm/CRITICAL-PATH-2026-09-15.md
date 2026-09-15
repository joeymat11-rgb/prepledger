# EARNED — CRITICAL PATH TO THE PERSONAL-USE TARGET

Opus scout for the PM (Fable), 2026-09-15. Read-only. Nothing changed, nothing pushed.
Worktree `/home/claude/wt-m2`, detached at `origin/rebuild/t2-client-core` = **a755cd91ec930db265e60be78dd2604e05406919** (2026-09-14 23:05 ET).
Cloud runner: Linux, **Node v22.22.2** (Joe's PC runs Node 24; CI runs Node 22 both OS).
`rebuild/conform/private/`, `src/history.js` and `ledger/` were never opened.

**Target being planned against** (DECISIONS:268, :412, :413; `astra/PERSONAL-USE-DELIVERY.md`):
Joe trains on his phone with his REAL history imported and the approved coaching memory working;
then Dad starts on his own phone after Joe's two-day trial on the same candidate. Soak gates wide beta only.

**The one-sentence answer.** On a phone that has been set up, Today and the gym card still paint
**the preview's sample athlete**, and the app says so out loud (`today-app.cjs:186`). The engine side of
that gap was closed by H3 and is green on the tip; the ~10 lines of wiring that would make the screen
stand on the athlete's own state were never written. Until that lands, no amount of import work can put
Joe's history on his screen. Everything else in this report is sequenced behind it.

---

## 1. WHAT IS TRUE ON THE TIP — executed, not read

Every command below was run in this worktree at a755cd91. Tails are quoted verbatim.

### 1.1 Newest accepted engine package chain

The newest acceptance artifact with a receipt is **`rebuild/m4/spec/acceptance-h3-clean-init.json`**
(sha256 `b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f`, receipt DECISIONS:187,
judgment :188, merged :189). Its runner is **not** `rebuild/m4/spec/*-package.cjs` — that path holds
only the retired `load-write-package.cjs` / `native-carriers-package.cjs`. The current runner is
`rebuild/lanes/b/tooling/b-package.cjs` (`--ci|--full --package B-NTC|H3|B1|B2|B4|B3|B-LOM`).

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3
...
B PACKAGE H3 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate ·
  89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE H3 CHILD h3-sup-{source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate}
  OBSERVED; exit 0 (each)
B PACKAGE H3 CHILD engine-files-differential / h3-cells / a0-journeys / today-suites /
  ntc-provider-cells OBSERVED; exit 0 (each)
B PACKAGE H3 COVERAGE 0/19 original gate(s) covered ... 9 SUPERSEDED under DECISIONS:160 ... 10 re-execute under --full
B PACKAGE H3 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict
EXIT=0
```
(The `AUDIT RED-FIRST FAIL` token is the register **baseline** line; the next line says so explicitly —
H3 declares no D-id, so the 45-law accounting "imposes nothing on it". Not a regression.)

```
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package H3
...
B PACKAGE H3 AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY (DECISIONS:136 (3)); artifact, runner, spec and
  all 64 pinned product file(s) are byte-identical to the sealed run recorded in
  rebuild/lanes/b/tooling/receipts/H3.json 5149c5e4...; the private oracle, the historical audit and
  the 19 original gates are NOT re-run on this step
B PACKAGE H3 POSTFIX PACKAGE PASS M2-H3-CLEAN-INIT
EXIT=0
```
**Read this carefully:** `--full` printed PASS **in the cloud, with no private fixture**, because the
receipt is unchanged and DECISIONS:136(3) short-circuits to a byte-identity re-verify. It is *not* a
fresh private census. Useful operationally (an unchanged package re-verifies anywhere in seconds);
never quotable as a new FULL run.

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE B-NTC FAIL SUCCESSOR-BLOCK-KEYS-NOT-CLOSED; required evidence missing or failed
EXIT=1
```
**Expected, by design.** DECISIONS:189 and `.github/workflows/rebuild.yml:79-89`: H3 *succeeds* B-NTC as
the standing CI step; the parent "cannot recompute beside the r10 runner". Not a defect.

### 1.2 Screen and client suites

| Suite | Command | Result |
|---|---|---|
| Today (13 files, the whole CI step) | `node --test rebuild/m3/w7-preview/today/test/*.test.{mjs,cjs}` | **553 tests / 553 pass / 0 fail** |
| — setup.test.mjs | | 157/157 |
| — gym.test.mjs | | 64/64 |
| — checkin.test.mjs | | 28/28 |
| — machine-settings-ui.test.mjs | | 54/54 |
| — food / catalogue / copy / problem / view / adapter / ntc-h6-delta | | 57, 57, 39, 25, 23, 20, 8 — all green |
| W6 storage slice | `cd rebuild/m3/w6 && node --test test/*.test.mjs` | **552 tests / 552 pass / 0 fail** |
| A0 workout host (the CI step) | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **23/23** |
| Coach | `node --test "rebuild/coach/test/*.test.cjs"` | **201/201** |
| PWA shell | `node --test rebuild/slice/pwa/test/*.test.cjs` | **55/55** |
| Port script (PC tool) | `node --test rebuild/m3/setup/port/test/*.test.cjs` | 21 tests / 18 pass / **3 skipped** (Windows-only cells) |
| W0 public conformance | `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node rebuild/m3/w0/public-conformance.cjs` | PASS — 99 reference GREEN, 99 STRONG (141 mutants detected), 70 adapter GREEN, 29 RED-as-specified |
| W0 public oracle | `node rebuild/m3/w0/public-oracle.mjs` | PASS 7/7 frozen + 7/7 native; ENGINE-TRACK PASS |
| Restart witness | `node rebuild/t2/rig187.cjs` | PASS |

### 1.3 Builds

```
$ node rebuild/m3/w7-preview/today/build.mjs
A1 TODAY BUILD PASS: 3 assets; 110 pinned inputs (13 engine, 12 client); build earned-b6acba5d032b;
approved design pinned; 68 bound classes; 2 pinned typefaces inlined; no literal figure in the
template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the athlete
can see  [exit 0]

$ node rebuild/slice/pwa/build-pwa.mjs
A5 PWA BUILD PASS: 13 files in .tmp/slice-pwa-dist; 11 precached and pinned by sha256; cache name
earned-slice-a71fc6380b3276a2dc62150c05a4cbcd derived from those bytes; 13 exact header rules,
no-store on sw.js; 10 credential shapes and 4 private roots refused across 13 files;
theme #E7E1D4 / background #F4F0E8 read back from the approved design; no network reference
in any shipped byte  [exit 0]
```

### 1.4 The one non-green thing, and it is environmental

`rebuild/m3/w6/host/test/host-seams.test.mjs` fails **at module load** here:
```
Error: request for './_md.js' is from a module not been linked
  at rebuild/m3/w5/reconciliation/codec.cjs:4  →  rebuild/m3/w5/source/codec.cjs:4
  code: 'ERR_VM_MODULE_LINK_FAILURE'   (Node v22.22.2)
```
Deps are installed (`rebuild/m3/w6/node_modules/@noble/hashes/_md.js` is present). This is the Node 22
`require(esm)` linker, not a product red. **It is not in CI** (`rebuild.yml:95` names only
`journey.test.mjs` + `engine-equivalence.test.cjs`). **Needs the PC (Node 24) to judge.** The
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED / resolver_failed` line that appears alongside it comes from
`journey.test.mjs:570`, inside a **passing** test that asserts that refusal on purpose — not a failure.

### 1.5 The thing I could not execute

No `gh` on this box, so **no GitHub Actions run was verified**. The `slice-host` deploy, the
`shared-preflight` workflow added by launch M, and the both-OS `rebuild` runs at a755cd91 are all
**unverified** from here. Needs the PC or a `gh`-capable session.

---

## 2. GAP TABLE

| # | Personal-use requirement | Evidence identity today | What is actually missing | Smallest package that closes it |
|---|---|---|---|---|
| G1 | **Joe can train/log on the phone build** | Launch M `100820aa47a4f8729642033499eaec0f0ee282e1` is an ancestor of the tip (verified: `origin/rebuild/astra-launch-integrator` is 0 ahead). Today 553/553, W6 552/552, A0 23/23, PWA 55/55, both builds PASS — all re-executed above. `SLICE_NETLIFY_SITE_ID` + site `earned-slice` recorded in place 2026-09-11 (`STATUS-ARCHIVE.md:61`), and `af4ed1f1` touched `today/**`, so `slice-host.yml` should have fired. | (a) **No verified deploy or phone run.** No Actions evidence available here; `rebuild/lanes/c/C3-HAND-PROOF.md` (8 rows) has never been executed on a phone. (b) Once set up, the week **cannot be changed at all** — `setup-host.mjs:102`/`setup-commands.mjs:84` refuse a second setup and Edit My Week is unbuilt. | **P-DEPLOY** (verify the run, then Joe runs C3-HAND-PROOF v2). Size S, owner-gated. Edit My Week is a follow-on, not a blocker. |
| G2 | **Joe's history imported and visible in Today/gym** | Port tooling is DONE and merged at DECISIONS:106: `rebuild/m3/setup/port/**` (C2, PC seal) and the phone-side unseal + import custody (C2b), each independently reviewed ACCEPT. S3 portable core exists on `origin/rebuild/astra-d-s3-core-r2` @ `0df6ad3f` (30 files, +3003) — **REJECTED at R2** (DECISIONS:250). Partial harness repair `f0b01d9`/`a69b591` is **absent from origin**. | **Two things, in order.** (a) **Today never stands on the athlete's state at all** — see G3/§4 P0; this blocks visibility regardless of import. (b) R2-1 and R2-4 need a B-owned engine seam that does not exist: `createMerge(E,{clock,nativeDate=Date})` in `rebuild/engine/merge.cjs` (5 parse sites at :76/:161/:177/:515/:565, one constructor at :177) and `sessionMembership(s,iso)` extracted from `genSession`'s pool in `rebuild/engine/today.cjs:64-72`, exposed through `rebuild/m4/workout/engine-runtime.cjs` (EXPOSED 4→5). Exactly specified in `rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md`. | **P1 = M2-S3-COMPANION** (engine, M) then **P2 = S3 import join** (D/C, L). Then **P3**, Joe's actual port run on his own word. |
| G3 | **Today/gym paint HIS numbers** (the hidden prerequisite for G2 and for Dad) | `rebuild/m3/w7-preview/today/today-entry.mjs:209` `boot()` is called with **no arguments** on the shipped page (`:350`), so `createTodayModel` falls through to `today-model.cjs:82 createBasisState` — the **synthetic fixture athlete**. Worse: `:274` actively **throws `SETUP_BASIS_STATE_REFUSED`** if a caller supplies a basis on an enrolled installation. The app tells the user: `today-app.cjs:186` — *"Your week is saved on this device. The numbers on this screen are still the preview's sample athlete, not you."* | **Nothing but the wiring.** `setup.athleteState()` already exists (`today-entry.mjs:127-131`) and builds the state through the accepted constructor. The engine side is **closed and green on the tip**: `setup.test.mjs` cell *"H3 — the accepted engine CAN now paint Today for a clean-init athlete"* asserts `createTodayModel({basisState: createCleanInitState({setup})}).read()` does **not** throw and `view.workout.available === true` — *"it paints HIS week, not a stranger's"*. That cell is inside the 157/157 I ran. The stale comment at `today-entry.mjs:291-303` still says the gap is open; it predates H3's merge (DECISIONS:189). | **P0 = "HIS NUMBERS"** — screens/plumbing tier, size **S**. This is the ONE thing that must go first. |
| G4 | **Coaching memory persists a confirmed reason/change and is used next workout** | **Zero code exists anywhere reachable.** `rebuild/coach/` has no `memory-*` module; `origin/rebuild/astra-e-memory` is **docs-only** (10 files, all `.md`). The two scoped acceptances (C lifecycle `7e64848d` :294, E idle-client foundation `e85ad803` :324) are client *primitives*, not memory, and both are **absent from origin**. P6 (the engine reason on disk) has a written brief at `rebuild/slice/P6-REASON-ON-DISK-BRIEF.md` and **was never started** — no `rebuild/polish-p6` on origin. | Everything: `rebuild/client` reason-on-disk (P6, and `rebuild/client` is only 1209 lines total), then `coach/memory-{commands,model,host,tools}.cjs`, `decision-{commands,history}.cjs`, three tests, and C's consumer join. Custody and a 12-item bar (M01–M12) are already written in `rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` §4–5. | **P4a = P6 reason-on-disk** (S/M) then **P4b = Memory v1 minimum** (L). Needs an owner narrowing decision — see §5 Q6. |
| G5 | **Dad's own setup/store on his phone** | A4 + A4b are merged (:128, :149): six setup screens, days-only split, exercise catalogue, starter week. `setup.test.mjs` 157/157. `split-kinds.mjs` proposes U/L alternation from the days he taps. Per-phone isolation is the design (`:88`/`:138`: each phone keeps its own store; hosted sync deferred). | **Only G3.** Dad's setup writes a real first-run op, then Today shows him a stranger's numbers and prints the `SETUP_NOT_HIS_NUMBERS` sentence. Everything else for Dad exists. | **P0.** Nothing else new. Then Joe's two-day trial, then the walkthrough. |
| G6 | **Dad's split — F1 if needed** | Briefs accepted by name :163 (F1 v1.0) and :174 (F2 v1.0); gate-supersession tokens ruled :164 and :175. Prebuilt on origin: `rebuild/lane-d-f1-b1b2` @ `4d1549e3` (17 files, +1505) and `rebuild/lane-d-f2-b1b2` @ `f3e9561b` (28 files, +3082). Owner set starter sets = 2 (:157, amending :152). | F1 retains a **B2-dependent red cell**; no consumers, no gate run, no acceptance. Today a 2-day week gets one Upper + one Lower — each muscle once a week. | **P6 = M2-F1-FULL-BODY** (engine, M) — **only if Dad trains 2–3 days.** Ask Dad his days first; it costs nothing and may delete this package. |

---

## 3. THE ASTRA WEB, UNTANGLED

What each name is in code, and whether it is on the path.

### 3.1 "B1+B2 prepared but capture R1 rejected" — **OFF the critical path**

* **B1+B2** is one bundled engine package (DECISIONS:214, gate-supersession :232) carrying **24 register
  defects**: B1 = D10 D8 D21 D19 D16 D17 D24 D25 D27 D23 in `dates.cjs`/`sleep.cjs`/`policy.cjs`/`today.cjs`;
  B2 = D9 D2 D1 D5 D6 D7 D3 D4 D29 D18 D28 D30 D31 D32 in `progression.cjs`/`plan.cjs`/`volume.cjs`
  (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:70-88`). 52 register hours.
* Its prepared assembly is **`A = 3bfed63febef002b8540d6ff3c56e19d08368711`**. Reviews ran R1–R9;
  R4 date repair scoped-accepted :298, R4 consumer applicability :310, amendment-binding tooling :322.
* **The blocker is not product code. It is gate diagnostics.** `approvedNativeDifference` in
  `rebuild/m4/workout/test/b1b2-evidence.cjs` computes a `fieldDiff` whose before/after values are
  **private** (`astra/B1B2-NATIVE-CAPTURE-GO.md` §4: *"fieldDiff includes private before/after values…
  NativeFieldDeltas remain UNKNOWN"*). The "capture" work (:330) was an observer that would emit a
  public *category/count* summary from a child process. **R1 rejected it** because a late observation
  after the diagnostic write cannot be detected (`B1B2-NATIVE-CAPTURE-ALTERNATIVES.md`: *"a successful
  file written earlier cannot prove no later observation occurred"*).
* Two alternatives were studied (:364): V8 coverage internals, or an OS shared-memory atomic slot.
  Neither met the bar. B then built a **Windows shared-memory native module in C** (`mapping.c` 11875 B,
  `loader.cjs`, `build.cjs`, `PROTOCOL.md`, `test/prototype.test.cjs`) — scoped-accepted :408 as a
  **standalone capability only**, explicitly *not* closing R1. The integration plan was being drafted
  when Astra's weekly usage hit 100% (:410, reset advertised 2026-09-19).

**Translation for the PM:** roughly two days of engineering went into making a *diagnostic counter*
tamper-evident, so that a **cloud** PM who may not read private values could rule the native field
deltas. Under :412/:413 the PM operates Joe's PC directly again. See §5 A1.

**And it is not needed for the target anyway.** Measured, not argued — `rebuild/m2/AUDIT-REGISTER.md:489-534`
summary table, the "live" column against Joe's own blob:

| Defect | Package | live | bar |
|---|---|---|---|
| **D16** | B1 | **TRIGGERED** | untrue value/receipt the athlete sees |
| **D30** | B2 | **TRIGGERED** | untrue value/receipt the athlete sees |
| **D45** | B3 | **TRIGGERED** | none: cosmetic/internal |
| D22 (import shape crash) | B3 | NOT TRIGGERED | cosmetic |
| D36 D37 D38 D39 D40 D42 D44 | B3 | NOT APPLICABLE (needs a pre-v60 input, two replicas, or an undo sequence) | — |
| all 24 others | B1/B2/B4 | NOT TRIGGERED / NOT APPLICABLE | — |

Three of the thirty-three remaining defects can fire on Joe's real data, and only two are visible.

### 3.2 "Native-slot standalone scoped-accepted" — **a dead end unless the capture route is kept**

`astra/NATIVE-SLOT-PROTOTYPE-ACCEPTANCE.md`: source/tested `2592f091f9cd…`, author evidence
`9cc78e7701…`, independent ER `64ba4a96…`, 533 review blobs, 34/34 + 3 controls + one 4/4 census.
Accepted limits, verbatim: loader containment is *lexical*; the original helper's actual writer set is
**not** closed; **author and reviewer produced different binary hashes from the same source and pinned
flags, cause unestablished — "not interchangeable pins"**; Windows only. Its only consumer is the
rejected capture operator. There is nothing to admit it *into*. If §5 A1 is ruled, this becomes a
preserved artifact, not a dependency.

### 3.3 "N2 sleep entry admission" — **cheap, real, and the only sleep writer there is**

Measured on the tip: **nothing writes `state.sleep.nights`.** `grep` across `rebuild/m3`,
`rebuild/m4/workout`, `rebuild/client` finds only *readers*
(`checkin-model.mjs:90`, `native-trend-context.cjs:281`). The recovery check-in records `sleep_hours`
as a check-in fact (`checkin-commands.cjs:53-105`), never as an engine night. N2 makes the durable
night, and Today / next-workout / check-in read the same one.

Not a blocker: `native-trend-context.cjs:300-304` says a zero-night athlete is **read, not refused**
("`cleanAtDate` on an empty nights list returns true on its own first line"), and DECISIONS:109 PATH A /
D8 semantics say missing sleep means UNKNOWN with no restriction. So Joe and Dad can train with no sleep
record at all.

**This is the cleanest single admission available today.** Both heads are **on origin**:
`origin/rebuild/lane-c-n2` @ `744c63c9` (14 files, +4079) and `origin/rebuild/astra-c-n2-r4` @
`bfc29357` (13 files, +4607). D2 scoped-ACCEPTs at :236/:258/:278; R4 applicability closed at :310
*without* requiring a browser replay. It needs exact-head CI + one mechanical integration — **one
closed run, no new build**.

### 3.4 "Edit My Week" — **not a blocker, but a likely same-week follow-on**

Brief judged and narrowed :176 (`rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md`); bounded fix review
`fdc4c8e` PASS at `origin/rebuild/lane-d-plan-edit-r1` @ `74920fb0`; R1/R2 closed; **no package
acceptance**. It matters because today, once setup is saved, `setup-host.mjs:102` /
`setup-commands.mjs:84` refuse a second setup and there is no edit path — so if Joe or Dad taps the
wrong days, the only exit is clearing site data. Flag for the owner; do not put it in front of P0–P3.

### 3.5 "F1/F2" — see G6. Prebuilt, briefs accepted, gate tokens ruled, **conditional on Dad's days**.

### 3.6 "Coach wave one" — **text baseline merged; the reason it promises is not on disk**

Merged at :150 (`rebuild/coach/wave1-{text,tools}.cjs`, `onboarding-*`, `tools.cjs`, `local-world.mjs`,
`TOOL-CONTRACT.md`, 201/201 green here). What is **not** there: DECISIONS:117(3) ruled that "recorded
with the reason" means **on disk**, and the consent record still stores only `{proposal_id, answer}`
plus `{id, accepted, instance}` — the engine's reason and the proposal body die on reload
(`rebuild/slice/P6-REASON-ON-DISK-BRIEF.md`, "The gap"). Also outstanding: the C6 relay Worker (no
deploy without the owner's word, :158), phone session, provider account.

**One accepted-but-not-admitted artifact can be admitted with one closed package run:** the **coach
science correction**, `a0e8ec38b6b3d42212e9d79839501ba6eb31ab8f` / tested `c21e64f2…`, scoped-accepted
:400. Exactly three files with published sha256s
(`rebuild/coach/tools.cjs` 58784 B `b2bb3c95…`, `coach-text.cjs` 14880 B `2e5213b9…`,
`test/science-correction-contract.test.cjs` 10886 B `faa210fd…`). :400 records that the PM's own
source-only precheck found **identical coach preimages** in shared, launch M and prepared A, and that
the existing CI glob `node --test "rebuild/coach/test/*.test.cjs"` (`rebuild.yml:150`) already picks up
the new test — **so no workflow edit and no engine gate are needed.** Screens/plumbing tier: one
independent reviewer + CI + mechanical integrator. *Caveat:* those bytes are **not on origin** (§5 A3).

### 3.7 "S3 import R2 REJECT + partial repair" — see G2

S3 = making `rebuild/m4/import/reading-replay.cjs` run **in the browser** (extracting `replay-core.cjs`)
plus `rebuild/m3/w6/local/source-admission.mjs`. `origin/rebuild/astra-d-s3-core-r2` @ `0df6ad3f`
carries it (30 files, +3003, incl. `rebuild/m4/spec/s3-portable-sources.json` 781 lines).
R2-2/R2-3 were harness defects and are repaired (`rebuild/lanes/d/S3-CORE-R3-HARNESS-REPORT.md`:
17/17 harness, 10/10 preparation, 20/20 reading-replay, 29/29 core selections, 59 restored controls) —
but that repair sits at `f0b01d9`/`a69b591`, **absent from origin**.
R2-1 and R2-4 are the real remainder and are **exactly specified** as a B engine package in
`rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md` — that document is **on the tip** and is the best
brief-input in the whole repository. It is P1.

---

## 4. DEPENDENCY-ORDERED PLAN

All branches start from `origin/rebuild/t2-client-core` @ `a755cd91` unless stated.
Tiers per DECISIONS:88/:413 — **screens/plumbing** = written bar + one independent reviewer + CI both OS
+ mechanical integrator; **engine** = lane FULL gate + PM judgment.

### ▶ THE ONE THING THAT MUST GO FIRST

**P0 — "HIS NUMBERS": Today and the gym card stand on the athlete's own state**
*Lane C (screens/plumbing). New branch `rebuild/c-his-numbers`. Size **S**.*

Files: `rebuild/m3/w7-preview/today/today-entry.mjs` (in `boot()` at :209, `await setup.athleteState()`
and pass it as `basisState` at :304-306 when `setup.summary().enrolled === true`; narrow the
`SETUP_BASIS_STATE_REFUSED` guard at :274 so it still refuses a *foreign* injected basis but not the
installation's own); delete the stale note at :291-303; `today-app.cjs` needs no change —
`setupNoteNeeded` at :193 already clears the sentence once the labels match; test cells in
`test/setup.test.mjs` (S19 is already written for both directions) and `test/view.test.mjs`.

**Acceptance bar a reviewer must reproduce.**
1. Boot an enrolled jsdom installation whose first-run document has label `Dad` and three chosen
   exercises. `model.stateFromOps().athlete_label === 'Dad'`; the `SETUP_NOT_HIS_NUMBERS` note is
   absent (`note.hidden === true`); `read().workout.available === true`.
2. The gym card lists **the athlete's own exercise ids from setup**, not the fixture's.
3. A **fresh, un-enrolled** installation is byte-unchanged from today: still the fixture, still the note.
4. An injected foreign `basisState` on an enrolled installation still throws `SETUP_BASIS_STATE_REFUSED`.
5. A weigh-in and a logged set survive a store close/reopen **on the athlete's own basis**.
6. `node --test rebuild/m3/w7-preview/today/test/*.test.{mjs,cjs}` ≥ 553 pass / 0 fail; `A1 TODAY BUILD PASS`;
   `A5 PWA BUILD PASS`; both-OS CI green at the exact head.

**Unblocks:** G2, G3, G5 — every later claim about "his data on his screen". Do not start P2 or P3
before this merges; without it their acceptance cannot be observed.

### Then, in parallel

**P1 — M2-S3-COMPANION (engine). Lane B. Size M. Parallel with P0, P4a, P5.**
Parent: `rebuild/m4/spec/acceptance-h3-clean-init.json` `b457b539…` (receipt :187).
Product diff, from `rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md`, three files:
`rebuild/engine/merge.cjs` — `createMerge(E,{clock,nativeDate=Date})`, route the five parse sites
(:76 `_corrOf`, :161 and :177 `_fileCorr`, :515 `_mergeSession`, :565 `_adjInstant`) and the single
constructor at :177 (`new nativeDate(nativeDate.parse(latest9)+1).toISOString()`) through the injected
constructor, **default native so every existing caller is byte-unchanged**;
`rebuild/engine/today.cjs` — extract `genSession`'s existing ord/filter/exActive/sort pool into a
private `_sessionPool(s,dt)` (sites at :64-72), add `sessionMembership(s,iso)` returning
`null` for non-U/L days else a fresh `{day, exercise_ids:[…]}`;
`rebuild/m4/workout/engine-runtime.cjs` — add `sessionMembership` to the frozen facade, `EXPOSED`/`COMPOSITION` 4→5.

**Acceptance bar.** Brief accepted by sha as a ledger line; closed cumulative profile
`rebuild/m4/spec/acceptance-s3-companion.json` with H3's artifact as immutable parent; the five
byte-identity carriers declared SUPERSEDED under the :153/:160 token **exactly as H3 does** (H3's own
five children are the template and all ran green above); 45/45 laws executed with **no new D-id**, so
the Y1 own-child rule (:110) supplies the obligation; `genSession(...)` **byte-identical** to the
parent on the ordinary and pending-hack-debut public fixtures; native-vs-injected `Date` equivalence
including the review's offset-free March DST pair, malformed/NaN fallbacks and the +1 ms boundary;
`--ci … PUBLIC CI EVIDENCE PASS` exit 0 in the cloud **and** `--full … POSTFIX PACKAGE PASS` on the PC
**with the private census**, verdict-only; receipt line then authorized rerun.
*Conflict note:* it touches `today.cjs` (B1's file) and `merge.cjs` (B3's file). Both edits are additive
with native defaults; B1/B3 re-pin at their own rebase, which their briefs already contemplate
(REQUESTS 2026-09-11 16:25 item 6, ruled at :113(6)).
**Unblocks:** P2.

**P4a — P6 REASON ON DISK (plumbing). PM/client custody. Size S/M. Parallel with P0, P1, P5.**
Brief already written and never started: `rebuild/slice/P6-REASON-ON-DISK-BRIEF.md`. Custody
`rebuild/client/**` (the whole directory is 1209 lines) + `rebuild/slice/P6-REPORT.md`.
Branch `rebuild/polish-p6` (does not exist on origin — this is a fresh start).
**Bar** (the brief's own four items, made reproducible): the consent record carries, all-or-nothing with
the answer, the engine-issued proposal body, the reason text, the issuing revision, the turn/source and
the moment, **copied byte-for-byte from the issuance the client already holds — nothing model-authored**;
a pre-P6 op log replays to a **byte-identical** projection (red-first cell) and reports
`"not recorded before <date>"`; a read API returns the stored reason for a proposal id; **answering no
leaves the store byte-identical**. Plus `node rebuild/t2/rig187.cjs` PASS and both-OS CI.
**Unblocks:** P4b's M07/M08/M10 cells and the coach's honest "why did this change?".

**P5 — N2 SLEEP ENTRY ADMISSION (plumbing). Size S. Parallel with everything.**
No new build. Compose `origin/rebuild/astra-c-n2-r4` @ `bfc29357` (which already carries
`origin/rebuild/lane-c-n2` @ `744c63c9`) onto the current tip; re-run at the exact head.
**Bar:** a night entered from bed/wake or an approximate duration lands in `state.sleep.nights`; Today,
the next workout preparation and the check-in read that same night; a correction replaces it and the
originals survive; absence is UNKNOWN, never zero, and applies no restriction (D8, :109 PATH A); no
sleep score, target or new gate; Today ≥ 553/553 at the exact head, both-OS CI green; one independent
reviewer who did not write it. *This is the single cheapest real capability on the board.*

**P-COACH — admit the :400 coach correction (plumbing). Size XS. Parallel.**
Three files, sha256s published in `astra/SCIENCE-COACH-CORRECTIONS-ACCEPTANCE.md`. No workflow edit
needed (existing glob). **Bar:** the three blobs land byte-identical to the accepted hashes;
`node --test "rebuild/coach/test/*.test.cjs"` ≥ 201 + the new file, 0 fail; missing calorie/protein
targets stay unknown; all five tier-three refusals stay refused; acknowledgment wording promises no
applied programme. **Precondition: the bytes must be pushed from Joe's PC first (§5 A3).**

### Then, serially

**P2 — S3 IMPORT JOIN (D authors the import side, C the consumer). Size L. After P0 and P1.**
Base: `origin/rebuild/astra-d-s3-core-r2` @ `0df6ad3f`, plus the unpushed harness repair `f0b01d9`
(§5 A3), rebased onto the tip with P1 merged. D wires the guarded native-Date capability into
`rebuild/m4/import/engine-provider.cjs` + `local-source-profile.cjs` and the membership reader into
`rebuild/m3/w6/local/source-admission.mjs`.
**Bar:** portable replay parity Node **and** Edge on identical bytes; the preserved 57 core / 41 import
positives, 56 selected assertion kills with their 7 baselines and 56 restored controls, 27 real Edge
checks, 22 adapted boundary checks; a **full-year context permits the reached March parse and a
September-only context withholds it and stays poisoned**; matched full-capture membership positives,
omitted-whole-lift refusal, differing historical loads, skip/incomplete preservation; and **the
end-to-end witness that actually matters** — an invented synthetic legacy bundle sealed by
`rebuild/m3/setup/port/port.cjs`, unsealed through C2b custody on a device, and then **visible on Today
and the gym card**, with a new workout saved on top and surviving a force-kill and reopen. Independent
MAX review of the complete successor; PM judges.
**Unblocks:** P3.

**P3 — JOE'S REAL PORT (owner act, PC only). Size S. After P0 + P2.**
`rebuild/m3/setup/port/README.md` is the contract: *"It only runs when you ask for it, in your own
words, right before it happens."* **Bar:** port-oracle 10/10 GREEN in both clock modes; `dataLossGuard`
plus the port-oracle's own `counts()` show no class smaller after the walk; sealed with the six-word
password; unsealed on the phone; his history visible on Today and the gym card; a new workout saved,
the app killed and reopened, both the history and the new workout still there. **Verdict only — no
counts, hashes or prose from the private blob in any report or chat.**

**P4b — COACHING MEMORY v1, MINIMUM (E/C authors, D2 or Opus reviewer). Size L. After P4a.**
Custody is already published (`rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` §4):
E writes `rebuild/coach/memory-{commands,model,host,tools}.cjs`, `decision-{commands,history}.cjs`
and `test/{memory,decision-memory,memory-journey}.test.cjs`; C joins `tools.cjs`, `local-world.mjs`,
`wave1-tools.cjs` and a `memory-view.mjs` review surface. Reuses
`client.hostBindings({workoutCommands})` + `createDurablePublicClient` exactly as the machine-settings
host does — **no second database, no new stage command**.
**Bar — the minimum that honours DECISIONS:202, from §5 of that brief:** M01 (confirm → producer →
committed encrypted repository → close every host and the process → reopen the same installation →
a new coach instance recalls the exact text, source and date; a second user recalls none),
M02 (no/cancelled/invalid/forged confirmation writes nothing), M05 (correction and retirement survive
reopen; retired versions leave routine recall; older records byte-identical), M06 (canonical setup and
settings win over a contradicting memory, which is *labelled* as a preference), M08 (the historical
reason is recalled after reopen; old records say "not recorded"), M11 (a real review/correct/retire
interaction, then a fresh conversation using the corrected state, with an open workout draft preserved
through the pending memory I/O), M12 (remembered text is data, never a tool instruction; no key, store
id or transcript leak). **Defer M07/M10** (real engine issuance → durable decision → observed plan
consequence) unless the owner says the target requires them — see §5 Q6.

**P6 — M2-F1-FULL-BODY (engine). Size M. Only if Dad trains 2–3 days.**
Base `origin/rebuild/lane-d-f1-b1b2` @ `4d1549e3`, rebased on P1. Brief `BRIEF-F1-FULL-BODY-v1.0.md`
accepted :163; token :164; starter = one catalogue exercise per A4b bucket at **2 sets**, rep standard
10, no invented load (:157). **Bar:** RED-first laws of its own; **U/L-only athletes byte-identical to
the accepted parent**; a full-body session counts as one session and one exposure per participating
exercise; the same closed-profile / FULL / private-census / receipt / rerun chain as P1.

### What runs in parallel

```
day 0 ──┬── P0  HIS NUMBERS        (C, S)  ────────────►  merge
        ├── P1  S3 COMPANION       (B, M)  ─────────────────────►  merge
        ├── P4a P6 REASON ON DISK  (client, S/M) ──────────►  merge
        ├── P5  N2 ADMISSION       (C, S)  ────►  merge
        └── P-COACH :400 delta     (C, XS) ──►  merge          [needs §5 A3 push first]
                                                   │
                            P2  S3 IMPORT JOIN (D+C, L) ◄──────┘ (after P0 + P1)
                                        │
                            P3  JOE'S PORT (owner, S)
                                        │
                            P4b MEMORY v1 (E+C, L) ◄── after P4a; overlaps P2
                                        │
                            Joe's 2-day trial ──► Dad's walkthrough
                                        │
                            P6  F1 (B, M) ── only if Dad trains 2–3 days
```
**Not on the critical path, and should be said out loud so nobody waits on it:** B1+B2, B4, B3, the
native capture, the Windows native-slot module, Edit My Week, F2, the C6 relay Worker, voice, hosted
sync, the 30-day soak.

---

## 5. RISKS AND OWNER QUESTIONS

### 5.1 Process rules that now block delivery without adding safety — PM decisions

**A1. The native-capture / NativeFieldDeltas obligation. RECOMMEND AMEND.**
Cite: DECISIONS:330 (*"Real fieldDiff includes private values: fixed categories/counts are diagnostics,
NOT exact-field approval"*), :328 Q4/Q5, :364, :384, :402, :408, :410;
`astra/B1B2-NATIVE-CAPTURE-GO.md` §4; `rebuild/lanes/b/B1B2-NATIVE-CAPTURE-ALTERNATIVES.md`
("Recommendation": *"Neither option currently satisfies the full bar"*).
**Why it exists:** DECISIONS:193 confined private-fixture reads to a *designated local gate runner*, and
:196 designated **Astra B** — a cloud task that could not read Joe's private values itself. The capture
observer was invented to give that cloud PM a public, tamper-evident summary of a **private** field
diff. **Why it no longer needs to:** DECISIONS:412/:413 return sole PM to a Claude PM that operates
Joe's PC directly (:92), and the original bar already says so —
`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md` §3 "Cloud vs owner's PC": *"per DECISIONS:93 C4, FULL incl.
the private oracle is the PM's own execution before any receipt."* A PM reading the field deltas on the
PC has no child-process observer to evade, so the amendment is **strictly safer**, not weaker.
**Proposed ruling:** NativeFieldDeltas admission for M2-B1-B2 is discharged by the PM's own verdict-only
FULL run on the PC. The :408 standalone capability is preserved as an accepted artifact and retired from
the delivery path; the unfinished :404/:406 plan is preserved, not resumed. *Consequence:* nothing on
the critical path waits for Astra's 2026-09-19 usage reset.

**A2. "B1+B2 → B4+B3 before the import is proved." RECOMMEND AMEND, narrowly.**
Cite: DECISIONS:214/:232, :191 sequence; `astra/S3-DATA-USE-PM-JUDGMENT.md` (*"final integrated import
proof still needs accepted B3"*).
**Measured counter-evidence:** `rebuild/m2/AUDIT-REGISTER.md:489-534` — of B3's nine defects, **D22 is
NOT TRIGGERED** on Joe's blob and **D36/D37/D38/D39/D40/D42/D44 are NOT APPLICABLE** (they need a
pre-v60 input, two merged replicas, or an undo sequence, none of which a single-phone first import
performs). The only live one is **D45**, whose own bar is "none: cosmetic/internal". The rule therefore
protects against defects that cannot fire. And the plan already anticipated the alternative:
`PLAN-TRACK-B-PACKAGES-v1.md` §2 B3 "Conflicts" — *"C2's port proof must be re-run after B3 merges, or
C2 is scheduled after it."*
**Proposed ruling:** the import may be proved on the H3 + S3-companion parent; the port-oracle is
**re-run** after B3 merges, recorded as a standing obligation on B3's own ledger line. B1/B2/B4/B3
continue as quality work behind the personal milestone, not in front of it.

**A3. Astra's code is unpushed and exists only on one machine. HIGHEST RISK ON THE BOARD.**
After `git fetch origin '+refs/heads/*:refs/remotes/origin/*'`, **every one of these is ABSENT from
origin**: `3bfed63f` (B1+B2 prepared assembly A), `2592f091` / `9cc78e77` (native-slot source and
author evidence), `f2dea2ec` (R4 date repair), `a0e8ec38` / `c21e64f2` (the :400 coach correction),
`7e64848d` (C memory lifecycle), `e85ad803` (E idle-client foundation), `f0b01d9` (D's S3 harness
repair). The branch `codex/astra-native-slot-capture-plan` named in `CLAUDE-PM-HANDOFF.md` **does not
exist on origin at all**. They live in worktrees under
`C:/Users/joeym/Documents/prepledger-dev/work/pm-caretaker/` (TEAM.md §Worktrees). If that machine is
wiped or those trees pruned, the work is gone — including the delta :400 accepted and the harness
repair P2 depends on.
**Recommend as the first housekeeping act:** one mechanical, read-only push of each named head to its
own branch. No merge, no acceptance, no rebase — preservation only. Note :410 recorded a **sparse-index
staging refusal** in B's tree, so at least that one push needs the exact `git add --sparse --` handling
described in `CAPACITY-RECOVERY.md`.

**A4. Keep, unchanged, because they do add safety:** author ≠ reviewer ≠ integrator (:193, :413);
verdict-only private reporting; no golden edited to pass; the exact-head CI requirement; GATE-WINDOW's
START/END for any integration window; no soak read before 2026-10-05.

### 5.2 Needs Joe's word (not engineering routing)

| # | Question | Why it is his, and when |
|---|---|---|
| Q1 | **Run the port on your real ledger?** — in his own words immediately before, per `rebuild/m3/setup/port/README.md` and DECISIONS:193. | At P3, not before. Nothing else about the import needs his data. |
| Q2 | **Is the slice site live?** `SLICE_NETLIFY_SITE_ID` and site `earned-slice` were recorded in place 2026-09-11 (`STATUS-ARCHIVE.md:61`); `CLAUDE-PM-HANDOFF.md` notes current presence was never re-verified because `gh` was unavailable. **I could not verify it either.** | Now — but the PM should check the Actions run itself before asking Joe to repeat setup (:413 correction). Zero spend either way. |
| Q3 | **How many days a week will Dad train?** | Now, and it is free. 2–3 makes P6/F1 a real package; 4+ deletes it (A4b's alternation already covers 4–7). |
| Q4 | **D40 tie-break and visible-conflict presentation.** :412 keeps it an owner choice; the PM recorded "canonical-greater, both originals visible" on 2026-09-11 (`STATUS-ARCHIVE.md:63`). | **Not on the critical path** — D40 is NOT APPLICABLE to live and needs two replicas; two-phone sync is deferred (:88). Do not block B3's other eight defects on it (:60 and the plan's own recommendation). |
| Q5 | **SCIENCE-OWNER-CHOICES 1–3** (goal/volume authority; one-clean-rep final-set default; EA/diet-break policy). | Not on the critical path. They change future coaching behaviour, and each answer is independent; a No holds the current behaviour and undoes nothing already fixed. |
| Q6 | **What does "coaching memory working" have to include for YOUR trial?** Option A (recommended): remember a confirmed preference/constraint, recall it in a fresh session after a real restart, and let you correct or retire it — bar M01/M02/M05/M06/M11/M12. Option B: also prove the engine's reason for an accepted plan change is on disk and the plan actually changed — adds P4a's full weight plus M07/M08/M10. | **Now**, because it is the difference between P4b being M-sized and L-sized, and it is the largest single swing in the date range below. |
| Q7 | **Three known defects will be visible during your trial** — D16 (a month-late weigh-in graded as a 7-day forecast hit), D30 (first-set trend pooling lifts across a technique change), D45 (analyst wording disagreeing with the writer's earn rule). All three are TRIGGERED on your real data; none loses a fact. Fix first, or run the trial and fix them in the normal B1/B2/B3 chain? | Before P3. Recommend the second: pulling D16+D30+D45 into a special package would span three modules across three planned packages and stale their pre-image shas for little gain. |

### 5.3 Engineering routing, explicitly NOT owner questions

The `today-entry.mjs` basis wiring; the S3 companion's exact signatures; which lane owns which file;
whether N2 rides a composition or a fresh branch; effort levels; the Node-22 `host-seams` link failure.
Per `CLAUDE-PM-HANDOFF.md`: *"Internal source-reading questions are engineering routing, not owner decisions."*

### 5.4 Other risks

* **Astra is usage-blocked until ~2026-09-19** (:410, `ordinaryUsageAllowed=false`, weekly 100%).
  If A1 is ruled, no critical-path item waits on it, and Claude Opus seats can be opened for any paused
  lane (:413). If A1 is *not* ruled, the whole B1+B2 branch of the tree stalls until then at least.
* **One machine serialises every private FULL run.** P1 and P6 each need a PC session. Batch them.
* **`host-seams.test.mjs` has no CI home and cannot load under Node 22.** Judge it once on the PC; either
  fix it or name it retired, but do not leave an unjudged suite lying in the tree.
* **The `shared-preflight.yml` workflow arrived with launch M and its runs are unverified here.**
* **No phone has ever run this build.** `C3-HAND-PROOF.md` (8 rows) is written and pinned by test but
  never executed. Until it is, every "works on the phone" claim is synthetic.
* **A set-up phone cannot change its week.** If Joe or Dad taps the wrong days, the only recovery is
  clearing site data. Watch for this during the trial; Edit My Week is the fix.

---

## 6. RE-ESTIMATE

**Unit:** one working day = one Opus builder round plus its independent review, at the DECISIONS:119
cadence. Two builders + one reviewer per lane; the PM judges and integrates.

| Package | Build | Review | PM / PC | Wall days | Runs parallel with |
|---|---|---|---|---|---|
| **P0 HIS NUMBERS** | 0.5–1 | 0.5 | 0.25 | **1–1.5** | P1, P4a, P5, P-COACH |
| **P1 S3 COMPANION** (engine) | 1–2 | 1 | 0.5 (PC FULL) | **3–4.5** (incl. 0.5 brief) | P0, P4a, P5 |
| **P4a P6 REASON ON DISK** | 1–1.5 | 0.5–1 | 0.25 | **1.5–2.5** | P0, P1, P5 |
| **P5 N2 ADMISSION** | 0 (built) | 0.5–1 | 0.25 | **1–1.5** | everything |
| **P-COACH :400 delta** | 0 (accepted) | 0.25 | 0.25 | **0.5** | everything |
| **P2 S3 IMPORT JOIN** | 2–4 | 1–1.5 | 0.5 | **3–6** | after P0 + P1 |
| **P3 JOE'S PORT** | — | — | 0.5 | **0.5** | after P0 + P2, owner-gated |
| **P4b MEMORY v1** — Option A | 2.5–5 | 1–1.5 | 0.5 | **4–7** | overlaps P2, after P4a |
| **P4b MEMORY v1** — Option B | 4–7 | 1.5–2 | 0.5 | **6–9.5** | overlaps P2, after P4a |
| **P6 F1** (engine, conditional) | 1.5–2.5 | 1 | 0.5 | **3–4** | after P1; conditional on Q3 |

**Critical path to "Joe trains with his real history":**
P1 (3–4.5) → P2 (3–6) → P3 (0.5) = **6.5–11 working days**, with P0 finished on day 1–1.5 in parallel.

**Critical path to "…and the approved coaching memory working":**
P4a (1.5–2.5) → P4b Option A (4–7) = **5.5–9.5 days**, entirely in parallel with the import path.
Under Option B it becomes **7.5–12 days** and **takes over as the critical path**.

**Honest date range — Joe fully on target (Option A):**
**2026-09-23 to 2026-09-29.** (Option B: **2026-09-25 to 2026-10-01.**)

**Dad:** + Joe's two protected days of real use on the same candidate (:138, :268) + one walkthrough day
→ **2026-09-26 to 2026-10-02** (Option A), plus 3–4 days if Q3 turns out to need F1 and it is not
started in parallel — so **start F1 the moment Dad answers Q3**, not after the trial.

**Assumptions, stated so the PM can break them:**
1. §5 A1 is ruled — the native capture and the Windows native-slot module leave the critical path.
   If not: add **7–14+ days**, gated on Astra's 09-19 reset and an unbuilt shared-memory integration.
2. §5 A2 is ruled — the import is proved on H3 + S3-companion, port-oracle re-run after B3.
   If not: add B1+B2 (≈52 register hours) + B4 + B3 (39 h) ahead of the import — **weeks**, not days.
3. §5 A3 is done on day 0 — Astra's local heads are pushed. P2 and P-COACH cannot honestly start
   otherwise, and the plan's whole first week is at risk from one disk.
4. Claude Opus builder/reviewer seats are continuously available (:413) and Joe's PC is reachable for
   two private FULL runs.
5. One REJECT round per package. Diagnosis from the record: the Sept-11 engine work *was*
   accept-worthy at r2 and every later round was ceremony (DECISIONS:135). Two REJECT rounds on P1 or
   P2 adds **2–4 days** each.
6. Owner answers Q2, Q3, Q6 within a day; Q1 at the point of P3.
7. **Nothing here is a promise.** Independent review, both-OS CI at the exact head, the private FULL
   run, physical-phone evidence and Joe's own import/deploy words are all still required, and none of
   them is marked passed to meet a date. The Sept 18–23 forecast preserved at :410/:413 is **not
   reachable** for the full target; the nearest thing to it is a phone build standing on Joe's own
   setup (**P0, roughly 2026-09-16**) — which is a real and reportable partial milestone, and exactly
   what `PERSONAL-USE-DELIVERY.md` means by "First fresh use may start sooner under :100 and must be
   reported as a separate partial milestone."
8. The 30-day storage soak is untouched and gates **wide beta only** (:268); earliest readback
   2026-10-05 is neither a release date nor an assumed pass.
