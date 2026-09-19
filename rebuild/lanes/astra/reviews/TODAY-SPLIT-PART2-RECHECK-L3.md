# TODAY-SPLIT PART 2: narrow re-check, loop round 3
Reviewer: Astra (Codex), commissioned under DECISIONS:412, :569 and :613; narrow re-check, loop round 3; highest effort
Head checked: c02b001e3646555050594c39856bfd31f2d48590
VERDICT: REJECT

Scope: the eight changed paths in c38ed5fb7e31e11a6e5169a4afeda2d7bfdc90af..c02b001e3646555050594c39856bfd31f2d48590,
the two commissioned reviews' blocking inputs, independent reconstruction, clause mutations,
and the banner. The author disputes nothing. The seven declared STOPs remain separate tickets.
Two blocking invariants still fail; neither asks this loop to implement a STOP.

Earlier findings (2a = incremental review; 2b = blind findings carried by L2)

| Finding | Disposition and executed output |
|---|---|
| L2 B1 / 2b F5 / 2a F1, lexical identity | STILL OPEN, B1 below. Original helper alone refuses 3 versus 2 anchors; L2's count-preserving helper refuses context matches 0 of 2, at BOTH refs. A context-preserving variant still exits 0 and breaks the real sleep screen. |
| L2 B2 / 2b F6 / 2a F4, silenced refusal | CLOSED. Plain return, `"//"; return;`, and `&& false`, each independently re-witnessed: witness=0, cut=1, `TA-I018: THE REPLACEMENT CHANGES CONTROL FLOW`, `PARSED STRUCTURE DIFFERS`, at BOTH refs. The parsed comparison fixes these inputs. |
| L2 B3, sealed banner | Original three statements CLOSED: seven declarations; W10 is a draft rewrite; 127 literals = 117 moved + ten authored. STILL OPEN for the replacement copy-location assertion, B3 below. |
| 2a F2, object-valued refusal | CLOSED. Execute TA-I067/068/069 with real plainOrDrop and stale-night copy: `This night changed while you were editing. Review the saved record before trying again. Nothing was recorded.` |
| 2a F3, uninvoked generator | CLOSED as a missing invocation: row 32 invokes gen-interface; execution cannot load eslint-scope. No generator-equivalence PASS; D5. |
| 2a F5, table order | CLOSED. Reverse only today-app's region array: cut=0 at s9 and tip; both outputs equal their respective unreversed controls byte for byte. |
| 2a F7, uncovered assignment | CLOSED for the refusal/write-order clauses in isolation: (uncovered,subStops)=(1,0),(0,1),(1,1) each exits 1, writes=[]; (0,0) exits 0, writes=[rows.json,regions.json]. Full planted-source execution remains unavailable, D5. |
| 2b F1/F8, nested paint/async continuation | STILL OPEN AS NAMED DEBT D1. Nested painter under a shimmed click adds one synthetic food operation. After await Promise.resolve(), the writer throws `WRITER-OUTSIDE-GESTURE: recordIntake`; error text remains empty. |
| 2b F2, initialization order | Original input CLOSED: model.setFoodDays injecting options.sleep gives the injected lane in PRE and POST. One-shot getter still differs: PRE reads=1/lane, POST reads=2/null; D4. |
| 2b F3, surviving clauses | Eight closures re-measured with own inputs: M02 direct call admitted; M05 loses Escape event; M09 inverts true/false/true; M10 retains pending; M14/M15 construct three times instead of once; M16/M17 return null instead of a Promise. M18/M21 remain D3. |
| 2b F4, stale test counts | Runnable count rows CLOSED in the 35 passing instrument rows. Scope-dependent census/capture assertions remain unavailable, D5. |
| 2b F7, facade capabilities | STILL OPEN AS NAMED DEBT D2. Ungestured facade food save {cal:2100,pro:130} and sleep save {date:"2030-02-03",hours:7}, supersedes:null, each return ok=true and add one encrypted synthetic operation. |
| 2b F9, inaccurate report | CLOSED. Initial sleep repaint throwing SYNTHETIC_PAINT_FAILURE gives saves=0,busy=true. Two synthetic food dispatches give saves=2,disabled=true. The corrected report states these inherited outputs; D2. |

B1 - BLOCKING: the witnessed text context still does not identify the binding

Invariant: an accepted cut must preserve which binding an athlete-facing call resolves to.
Exact input at EACH named source ref: prepend this helper, then add ONE leading space to
the ORIGINAL renderSleep's `    const date = sleepNightDate();` and
`    readSleepCheckIn(date);` lines. Change no table field, digest or moved byte.

```js
function astraShadow() {
  const sleepNightDate = () => "LOCAL";
  function renderSleep(focus) {
    const root = template("t-sleep");
    const map = slots(root);
    const date = sleepNightDate();
    readSleepCheckIn(date);
    put(map, "sleep-title", SLEEP_TITLE);
    return date;
  }
  return renderSleep(false);
}
```

Exact output at BOTH s9 and tip: cut exit=0, stderr=""; helper input returns "LOCAL";
emitted helper returns "SEALED" with facade.sleepNightDate=()=>"SEALED".
For that isolated call, template returns {}, slots returns a Map, readSleepCheckIn/put are
no-ops, SLEEP_TITLE="Sleep", and hooks.readSleepCheckIn is a no-op.
The decisive real-page comparison uses the actual composed modules and synthetic model:

| Source | api.render("sleep") | sleep-save exists |
|---|---|---|
| s9 PRE | error=null | true |
| s9 POST | error="sleepNightDate is not defined" | false |
| tip PRE | error=null | true |
| tip POST | error="sleepNightDate is not defined" | false |

The author's full-context plant only ADDED the other anchor. This input also spaces out its
original, preserving TA-I043's count. TA-I042's context digest still equals the committed
4c10a14bf81a9acd1602295e87693e1c316548a85e00e902a9f903181a167322.
Smallest fix: require TA-I042's reference to resolve to the witnessed TA-S25 sleepNightDate
binding, and refuse the local helper binding; retain this two-ref negative input.
A copied header plus adjacent lines is insufficient. The B1 invariant is UPHELD.

B3 - BLOCKING: visible fallback text contradicts the new banner

Invariant: a statement sealed beside the writers must describe the actual file.
Banner today-lanes.cjs:32-33 says "every copy byte the athlete reads stayed in the released view".
Exact input: mount the real page with a synthetic sleep lane whose rows()=>[],
refresh=async()=>[], save=async()=>{throw {};}; select hours mode, type "7.5", click Save,
and await api.sleepPending(). One save attempt runs; the read-back is empty.
Exact sleep-error text:

```text
Sleep could not be saved on this device. The store's own reason: SLEEP_WRITE_UNKNOWN. Nothing was recorded. What you typed is still here.
```

SLEEP_WRITE_UNKNOWN is a literal in today-lanes.cjs:584 and absent from today-app.cjs.
Smallest fix through regions.json: say the twelve injected copy constants stay released,
while moved fallback reason literals and sentence assembly remain here. Regenerate the banner.
No writer behavior change is requested. The numerical corrections themselves are correct.

NAMED DEBTS (each line can be carried verbatim into S10)

- D1 / TODAY-GESTURE-PAINT-ROOTS: exclude paint nested inside a listener from writer admission, and explicitly rule and paint async-continuation refusals; the current tripwire permits the former and silently rejects the latter.
- D2 / TODAY-OUTCOME-TYPE: remove writer-bearing/live mutable facade handles, recover sleepBusy when the initial repaint throws, and independently fence duplicate food saves; these are inherited behavior, not pure-move fixes.
- D3 / S10 writer cells: add repeated same-date readSleepCheckInView forcing forDate before EACH paint (M18), and inspect typed hours after successful save (M21); own traces remain read/paint/read/paint versus read/paint/paint, and empty hours versus "7.5".
- D4 / S10 boot contract: preserve one options.sleep acquisition at its original point, or explicitly rule the accepted option shape; a one-shot getter returns its lane after one PRE read but null after two POST reads.
- D5 / S10 instruments: rerun rows 12/13/14/16/32/33 with the real eslint-scope stack, independently exercise generator scope/binding outputs, and retain the uncovered-assignment no-write input; isolated tail checks are not generator-equivalence proof.
- D6 / S10 negative coverage: retain the earlier overlap-refusal debt, including competing replaces nested in a seam; no new overlap proof was commissioned or credited in L3.
- D7 / S10 evidence: validate or explicitly label headLines/closeLines as informational; incrementing either exits 0 with identical product bytes. The inventory correction to 182 witnessed regions plus 20 seams is verified.
- D8 / S10 banner: define and enumerate recordSleep's "eleven sentences"; its parsed body has three sleepErrorText assignments and six say calls, including clearing, and dynamic refusal maps/reasons do not define a fixed sentence inventory.
- D9 / S10 instruments: classify the 21 L3 clause survivors listed below as equivalent or add branch-specific inputs; equal serialized observations do not establish general equivalence.

Single-clause table

Each instrument mutant starts from original HEAD bytes; change one predicate/operator,
initializer, return, loop condition, effect or call argument on the changed executable lines.
Tests/assertions were not changed. Own scripts execute parsed-structure fixtures, actual resolver
and witness clauses, real generator runs, and full cuts/report comparisons. "Distinguished"
means an observed difference from the unmodified control, not full-suite mutation coverage.
Exact from/to/line and results: clause-mutations-final.json and final-extras.json in scratch.

| Clause family / single change | Executed result |
|---|---|
| I001-I033, AST inventory/cache/statement selection | 33/33 distinguished. |
| I034-I056, parser/call identity | 18/23 distinguished; five survivors listed below. |
| I057-I192, rewrite-name collection/canonical structure | 130/136 distinguished; six survivors. Inputs include argument/order changes, property keys, computed members, arrays/holes, literals, templates, classes, await/yield, listen/unlisten, and invalid replacements. |
| I193-I242, first difference/enclosing fragment/authorization | 44/50 distinguished; six survivors. Own original hidden-return and false-predicate inputs remain refused. |
| I243-I263, context witness/extent/bytes/report | 21/21 distinguished with valid, absent, wrong, partially present and different-extent witnesses, plus full-cut output. |
| I264-I337, resolver/context serialization | 70/74 distinguished; four false/null-to-undefined tails have equal exercised observations. |
| I338-I339, context witness generation effect/predicate | 2/2 distinguished at BOTH refs after removing the old contextSha before generation. Control regenerates all 182 region witnesses identically at each ref. |
| X1-X4, replace each newly passed lines/src/start/end argument with undefined | Four full cuts exit 1; valid control exits 0. |
| X5, replace report.structure expression with null | Cut exits 0; independent report comparison differs. |
| Instrument total | 344 distinct mutants; 323 distinguished, 21 survive exercised inputs. No survivor is declared a product defect without a counterexample. |
| Thirteen newly added statementRewrite flags, remove one then re-witness | 13/13 cuts refused, including all five added GA flags. |
| Thirteen changed replacement digests, corrupt one | 13/13 refused. |
| Context: alter each of five before/after/header lines; remove each field and whole context | Eight refused; removing only enclosing accepts identical bytes because contextText still hashes the actual header. |
| Context witnesses: corrupt each separately, both, or remove both | Each single corruption accepts via the other matching ref; both-corrupt and both-absent refuse. Each single corruption under its OWN --witness ref also refuses by context. |
| Authored banner/head: append one space to each of the 54 head elements separately | 54/54 refused by the product digest. This range changes no authored executable line in today-lanes.cjs. |
| Product digest / headLines / closeLines | Digest refuses; both metadata increments accept identical bytes, D7. |
| Each of fourteen changed explanatory notes, append ASTRA | All accept; Today and Gym product bytes remain identical to their own controls. Notes are informational, as declared. |
| Table total | 110 distinct mutations: 91 refusals, 19 accepted controls/metadata cases; two additional --witness-restricted executions above. |
| Prior writer/boot clauses | Own inputs distinguish M02/M05/M09/M10/M14/M15/M16/M17 and H1-H4; M18/M21 effects are re-measured in D3. |

Survivors: I042/I046/I047/I048/I052/I082/I088/I089/I094/I107/I172/I194/I196/I224/I229/I235/I236/I281/I289/I295/I301.
The first five full-cell mutation replays also completed with no additional failing rows;
I stopped that longer replay and used the bounded independent inputs above. No incomplete
replay or dependency failure counts as a passing mutation check.

Independent reconstruction and banner audit

The own reconstruction imports neither cut.cjs nor resolve.cjs. It reads explicit named Git
blobs, resolves anchors/context, applies declared substitutions, builds wrappers, and inserts
composition rows. At s9, BOTH files equal the committed output byte for byte:
- today-lanes.cjs SHA-256: e6ff7c388e9858aabab7b8fa78b1281709083953e1ed039a6a32f856349e4c93.
- today-app.cjs SHA-256: d1e1f1e7e69a7ed1af6dbbef8f0d1b9c5eef2017deb7e80f9d4df50da3548cad.
At tip both equal cut.cjs's tip output; the committed output is the s9 form, not tip's.
No moved byte differs outside a declared substitution. Bytes after the banner match c38ed5fb.
PART2-CUT-REPORT.json equals the fresh s9 report after removing only machine-specific root.

Verified counts/claims: 34 moved regions, 679 moved lines; 41 declared substitutions,
39 applied rows/41 substring occurrences, W2#30 and W1#33 already covered; W10 rewrites the
draft identifier, the other 40 rows carry paint/screen handles. Seven pre-move declarations,
three requires, 22 parameters including twelve copy constants; return keys only facade/hooks,
37 getters and 29 hooks. Parsed literals: 127 total, 117 moved, ten authored, with exactly
the banner's listed authored values. Product arrays head/open/close=54/41/143.
The two guarded names are recordIntake/recordSleep; nested and delayed call measurements
show the stated synchronous tripwire, not isolation. The nine-subject inventory names five
Gym subjects plus submitWeighIn/recoverWorkout; those seven remain declared STOPs.
The getters return capabilities, D2; zero-census and the eleven-sentence count are not certified.

Executed bar: native instruments s9=35/41 and tip=35/41; unavailable rows are exactly
12 name census, 13 capture, 14 census without map, 16 reproduction's capture tail,
32 generator equality, 33 uncovered assignment: each cannot load eslint-scope.
All seven added rows pass. Writer fence=404/404; checkin=28/28; food=56/57; problem=127/131.
The five Today failures hit ASTRA_REVIEW_READ_ONLY when their build rows try writing inside
the worktree. A preload enforced the commissioned boundary; no row was skipped or weakened.
Only one Node process/test file ran at a time, except permitted synchronous child helpers.
All used C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe,
Node v24.19.0, with separate environment lines before execution:
`$env:MEASURED_TEST_NOW = '2026-09-03'`
`$env:TZ = 'America/New_York'`
Acorn 8.17.0/acorn-walk came from Node's embedded sources; nothing installed.
Scratch: C:\Users\joeym\AppData\Local\Temp\astra-split-l3-67; disposable splitb-* fixture
folders also remain in OS temp. No cleanup was attempted.

What I did not verify

- No full eslint-scope/census/capture or independent generator binding-equivalence proof; D5 remains despite the author's farm results.
- No whole Today step, conformance gate, package/seal runner, receipt, CI, browser/phone, auth files, protected paths, real athlete records or protected soak.
- No new hunt outside the changed hunks, earlier findings and banner; no implementation of the seven STOP tickets.
- This worktree's DECISIONS.md has 548 lines; :569/:613/:618 are absent here. The commission supplies their applicable constraints.
- No full-suite mutant PASS, general semantic oracle, read-only returned capability claim, or certification of the eleven-sentence count.
- No tracked file edit, commit, push, checkout, reset, stash, clean, fetch, install or deletion. Only this review file is added inside the worktree.

Final workspace evidence (last shell commands and their stdout)

```text
git status --porcelain
?? rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-RECHECK-L3.md

git diff --stat -- rebuild/lanes/c/TODAY-SPLIT-BUILD-REPORT-2.md rebuild/lanes/c/today-split-spike/cut.cjs rebuild/lanes/c/today-split-spike/gen-witness.cjs rebuild/lanes/c/today-split-spike/regions.json rebuild/lanes/c/today-split-spike/resolve.cjs rebuild/lanes/c/today-split-spike/test/instruments.test.cjs rebuild/lanes/c/today-split/PART2-CUT-REPORT.json rebuild/m3/w7-preview/today/today-lanes.cjs rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-RECHECK-L3.md
```

The diff produced no stdout. Git also emitted twice on stderr:
`warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied`
