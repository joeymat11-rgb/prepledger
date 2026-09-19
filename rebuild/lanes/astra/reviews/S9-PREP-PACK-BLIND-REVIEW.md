# S9 PREP PACK blind correctness review
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Head: 1d0cbffa029fad12603d12857671ddaa2cc9ee0a (git rev-parse HEAD)
pack-pin.test.mjs SHA256 (certutil): 00e252026a232af893f58badc25af9553ee4a5b1cfe95141ee5d088cfb04a4f2
approved-pin.test.mjs SHA256 (certutil): 0ebe25349b8f9d4d50ae30486a1e3d5f2a530c67acde2ba49cfb5387f259851c

VERDICT: REJECT

Findings below were recorded in this file before opening the five prior code-review/report files.
P = rebuild/lanes/c/ui-port/pack-pin.test.mjs; A = approved-pin.test.mjs in that directory.
The intended empty literals are not defects and were never filled, including in scratch copies.

F1 [P1] Ancestor junctions bypass the link refusal (A:128-140; P:202-215).
Input: synthetic ref/a.txt containing X; literal {"ref/a.txt": SHA256("X")}; files=["ref/a.txt"].
Rename ref to outside-ref; create ref as a junction to outside-ref. No source modification.
Exact output: {"ancestorIsLink":true,"finalIsFile":true,"refusals":[]}.
A root junction also returned []. P rejects a junction AT its root or inside its walk, but
root=alias/pack, with alias a junction to actual and actual/pack/a.txt containing X, returned [].
Why: lstat checks only the final path component; preceding components are followed. A pinned
reference directory can become a redirect without the required NOT-A-REGULAR-FILE refusal.
This matters especially to the 09-08 references, which P's 09-18 pack walk does not cover.
Smallest fix: lstat every component below a trusted checkout root, including pack ancestors,
and refuse a link before descending/reading. Add same-byte ancestor-junction fixtures.
Measured on Windows; equivalent Linux ancestor traversal is a source inference, not a run.

F2 [P1 test integrity] Both cells' fixtures can bless a broken digest (P:101, A:84).
Exact edit P18/A10: replace .update(bytes) with
.update(Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"))).
Exact output: P "# tests 41", "# pass 40", "# fail 1"; A 26/25/1, identical to baseline.
Every fixture row stays green; the sole failure in each is still the intentionally red REAL ROW.
Independent counterexample with that mutant: a.txt="hello\r\n", literal=SHA256("hello\n")
computed separately from the engine; exact output {"pack":[],"approved":[]}.
P19/A11 instead replace .update(bytes) with
.update(Buffer.concat([Buffer.from("wrong-domain:"),bytes])); results are again P 41/40/1, A 26/25/1.
Why: fixture expectations call the same sha256 helper as production. They check agreement with
that helper, not raw-byte SHA256. CRLF normalization and binary decoding can survive all rows.
The shipped helper is correct; this is a demonstrated missing test, not a claim it normalizes now.
Smallest fix: hard-coded independently verified digest vectors plus LF/CRLF and distinct invalid
UTF-8 buffers against one unchanged literal. Do not generate these expectations with the helper.

F3 [P2 robustness] Growth during the actual read can pass silently (P:190-195; A:140-141).
Input: a.txt=X, literal=SHA256(X). In scratch, wrap fs.openSync to remember this file's fd;
wrap fs.readSync to append MORE immediately before invoking the original readSync on that fd.
Leave fs.readFileSync and the production reader argument unchanged. This injects the schedule
between readFileSync's size measurement and its real read, with only one Node process.
Exact outputs: pack-growth-inside-real-readFileSync {"changed":true,"size":5,"refusals":[]}
and approved-growth-inside-real-readFileSync {"changed":true,"size":5,"refusals":[]}.
Why: readFileSync allocates/reads the old size (1); the engines hash X while the file is XMORE.
Smallest fix for this witness: read through an fd, compare fstat before/after and bytes read,
and emit a named refusal for instability; keep a deterministic growth fixture. This does not
claim to solve arbitrary concurrent snapshots or writes after the final check.
Measured by deterministic scheduling injection inside a real read, not a concurrent-writer run.

F4 [P2 portability] A case-only rename stays green in APPROVED-PIN on Windows (A:128-141).
Input: a.txt=X, b.txt=Y, both pinned; rename a.txt to A.txt, leaving the list/literal unchanged.
Exact output: {"pack":["PACK-PIN MISSING a.txt","PACK-PIN ADDED A.txt"],"approved":[]}.
Repeat with sole ref/a.txt=X and rename ref to REF:
{"pack":["PACK-PIN MISSING ref/a.txt","PACK-PIN ADDED REF/a.txt"],"approved":[]}.
Why: A asks the case-insensitive filesystem to resolve the old spelling, never compares actual
entry spelling. A reference can leave its exact pinned path without MISSING on this OS.
Linux on a case-sensitive filesystem should instead return MISSING; not measured here.
Smallest fix: verify exact component names while performing F1's ancestor walk; add file and
parent-directory case-only renames. P already handles names inside its walk correctly.

F5 [P2 coverage] PACK's individual byte-order contracts still have untested alternatives.
P09: P:158 byteCompare(out[i-1].file,out[i].file)<0 -> out[i-1].file<out[i].file.
P10: P:225 sortByBytes([...observed.keys()]) -> [...observed.keys()].sort().
Each leaves all 40 fixture rows green (41/40/1). The separate comparator unit row does not
prove these call sites use it. With real files U+E000.txt and U+10000.txt, P09 accepts a
code-unit-ordered literal: []. P10 outputs ["PACK-PIN ADDED \ud800\udc00.txt",
"PACK-PIN ADDED \ue000.txt"], the reverse of the required byte order.
P08 changes serialise's comparator to code-unit order and likewise survives (known helper gap).
Smallest fix: drive parseLiteral and ADDED with the existing U+E000/U+10000 pair and explicit
expected order; a comparator-only row is insufficient. Output-order defects do not hide bytes.

F6 [P2 requirement mismatch; previously ruled] CI skips the cells after an earlier failure.
Source measurement: .github/workflows/rebuild.yml:318-319 names both exact paths once:
node --test rebuild/lanes/c/ui-port/pack-pin.test.mjs rebuild/lanes/c/ui-port/approved-pin.test.mjs
Matrix at :23 is [ubuntu-latest, windows-latest]; there is no if: on this step or job, and no
continue-on-error. Thus a prior red step suppresses it; this fails requested invariant (7).
This is a source/semantics result, not a fabricated hosted-run output: GitHub's default is success().
[GitHub status-check semantics](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#status-check-functions).
The existing comment explicitly acknowledges the skip. Smallest fix under this assignment's
invariant: add if: ${{ !cancelled() }} so prior failure does not skip this step.
There is no fork-specific exclusion in this job; PRs targeting rebuild/** match the trigger.
Repository fork approval policies and actual hosted execution were not verified. Prior Q4
explicitly accepted the skip; this is not presented as a newly discovered engine defect.

F7 [P3 named-refusal gap; known] An unreadable directory aborts PACK's walk (P:182).
Input: scratch pack a.txt=X and blocked/b.txt=Y, both pinned; deny ListDirectory on blocked
using a Windows ACE for this process's user. Exact output, scratch prefix abbreviated:
pack-unreadable-directory EPERM EPERM: operation not permitted, scandir '<scratch>\acl-case\blocked'
No PACK-PIN refusal is emitted, and later entries cannot be judged. This is loud red, not green.
Smallest fix: catch readdir/lstat errors per path and return PACK-PIN UNREADABLE for that path,
continuing reachable siblings. Both scratch deny ACEs used in this review were removed.
Control with real ReadData denial on a.txt and changed b.txt:
P -> ["PACK-PIN MISMATCH b.txt","PACK-PIN UNREADABLE a.txt"];
A -> ["APPROVED-PIN UNREADABLE a.txt","APPROVED-PIN MISMATCH b.txt"]. File handling works.

Other invariant measurements and scope limits

All engine probes use extracted, otherwise unchanged production functions and synthetic bytes.
P: changed X->Z names MISMATCH a.txt; add c.txt names ADDED c.txt; remove a.txt names MISSING a.txt.
Rename a.txt->c.txt gives MISSING a.txt plus ADDED c.txt; move into d/ gives MISSING a.txt plus
ADDED d/a.txt. Swapping X/Y between a.txt/b.txt gives both MISMATCH names. Empty file addition
is ADDED empty.txt. Empty directory addition returns []; directory names alone are not pinned.
The empty-directory result fails the literal "any tree difference" request, but C.5.1's binding
inventory is git-tracked files, so it is not an extra rejection of that narrower contract.

IGNORE audit (P:126): exactly two case-sensitive predicates, matching C.5.1's written patterns:
- A relative path starts with quality/run/. quality/run/gate.py containing executable content
  is invisible: []. Meaningful files can hide here; the rule does not inspect tracked status.
- Any non-final path segment equals __pycache__. Both __pycache__/gate.py and
  quality/__pycache__/gate.py containing executable content are invisible: []. Same limitation.
Near misses app/quality/run/gate.py, quality/runx/gate.py, quality/Run/gate.py,
app/__pycache__x/gate.py, and regular FILES quality/run and app/__pycache__ each produce ADDED
with their exact name. No extra ignore predicate was found. Tightening the two intentional
exclusions would require a spec decision; they are not full protection for arbitrary tree bytes.

A has SEVEN refusals at this head, including UNREADABLE, not six. I independently isolated all:
[] list -> ["APPROVED-PIN LIST-EMPTY"]; append new.txt -> ["APPROVED-PIN UNLISTED new.txt"];
remove a.txt -> ["APPROVED-PIN MISSING a.txt"]; replace it with directory ->
["APPROVED-PIN NOT-A-REGULAR-FILE a.txt"]; denied reader -> ["APPROVED-PIN UNREADABLE a.txt"];
change X->Z -> ["APPROVED-PIN MISMATCH a.txt"]; list shrinks to b.txt ->
["APPROVED-PIN ORPHAN a.txt"]. Each ran alone against an otherwise matching fixture.
Reorder [b.txt,a.txt] and repeat [a.txt,b.txt,a.txt] each return [] in the engine. Duplicates
are separately rejected by A's live-list row. Order is not pinned here; today's design.test.cjs
:25-26 separately asserts the two real names in order (read, not run). Add ../outside.txt,
including when that synthetic file exists, or C:/outside.txt -> UNLISTED with that exact name.

LF->CRLF, UTF-16LE, UTF-8 BOM and invalid UTF-8 bytes each give MISMATCH in BOTH shipped engines.
Spaces inside filenames, composed/decomposed Unicode, U+E000/U+10000, a trailing period, and a
455-character absolute path round-trip green unchanged. Leading-space filenames fail hard with
ERR_ASSERTION: PACK-PIN literal line is not "<path> <space> <64-hex sha256>". Not silent green.
Content containing spaces, newline and a serialized-looking digest still gives MISMATCH.
There is no composite path+content hash: each file is SHA256(raw bytes), keyed separately by path.
serialise can produce the same text for two entries a,b and one artificial name "a <hash>\nb",
but parseLiteral rejects that newline-bearing name. I found no accepted-tree delimiter collision.

P root junction -> PACK-ROOT-ABSENT; inside/dangling junction -> NOT-A-REGULAR-FILE junction.
A dangling final junction is refused by its shipped row; dangling ancestor gives MISSING ref/a.txt.
File symlink creation returned EPERM here, so those shipped rows take their Windows fallback.
Hard-link replacement (nlink=2) returns [] in both cells; hard links remain regular files.
Writing NTFS stream a.txt:hidden="changed" leaves readdir=[a.txt,b.txt], both pins return [].
These plus empty directories show that the pin covers ordinary file paths/default bytes, not
all filesystem metadata/streams/topology. Hard links/ADS are notes outside Git's byte inventory;
if "any tree difference" includes them, explicitly refuse extra links/streams or widen the model.

Table of code changes and which rows noticed

30 independent single-clause mutants; copies only. IDs are THIS review's IDs, not prior tables.
Rows are the cells' 1-based TAP numbers. P40/A25 are intentionally red REAL ROWS and excluded
from "noticed"; P41/A26 are the final vocabulary rows. NONE means all fixture rows stayed green,
never that the whole cell became green. Every process still exited 1. No literal was filled.
Baseline P=41/40/1; A=26/25/1; zero skipped/todo. 21 mutants killed, 9 survived.

| ID | Exact clause change (single site unless helper) | Additional red rows |
|---|---|---|
| P01 | root guard drops !st.isDirectory() | 17,34 |
| P02 | root lstatSync -> statSync | 34 |
| P03 | walk lstatSync -> statSync | 15,26,31,41 |
| P04 | literal.length===0 -> false | 18,41 |
| P05 | rel.startsWith(IGNORE_PREFIX) -> rel.includes(IGNORE_PREFIX) | 1-11,13,15,23-26,29-31,33-38 |
| P06 | ignore segments drop .slice(0,-1) | 25 |
| P07 | sortByBytes helper .sort(byteCompare) -> .sort() | 12 |
| P08 | serialise comparator -> a.file<b.file?-1:a.file>b.file?1:0 | NONE |
| P09 | parsed literal byteCompare comparison -> string < | NONE |
| P10 | ADDED sortByBytes(keys) -> keys.sort() | NONE |
| P11 | irregular output sort -> insertion order | NONE |
| P12 | unreadable output sort -> insertion order | NONE |
| P13 | got!==e.sha256 -> false (suppress MISMATCH) | 2-5,9,22,23,30,37,41 |
| P14 | got===undefined -> false (suppress MISSING) | 7,15,35,41 |
| P15 | !listed.has(rel) -> false (suppress ADDED) | 6,11,24,25,41 |
| P16 | !st.isFile() -> false (suppress irregular handling) | 15,26,31,41 |
| P17 | read catch records nothing, continues | 36-38,41 |
| P18 | sha256 helper decodes UTF-8 and normalizes CRLF (F2) | NONE |
| P19 | sha256 helper prepends wrong-domain: (F2) | NONE |
| A01 | LIST-EMPTY predicate -> false | 2,11,18,26 |
| A02 | !Object.hasOwn(literal,file) -> false | 5,6,11,12,17,20,24,26 |
| A03 | missing stat catch branch continues without refusal | 4,26 |
| A04 | !st.isFile() -> false | 10,19,26 |
| A05 | read catch continues without UNREADABLE | 21,22,26 |
| A06 | sha256(bytes)!==literal[file] -> false | 3,7,8,22,26 |
| A07 | !named.has(key) -> false (suppress ORPHAN) | 6,11,15-17,24,26 |
| A08 | ORPHAN .sort(byteCompare) -> .sort() | 24 |
| A09 | final lstatSync -> statSync | 19 |
| A10 | same digest normalization as P18 | NONE |
| A11 | same digest prefix as P19 | NONE |

NEW versus ALREADY KNOWN

Compared only AFTER the blind findings were on disk with S9-PREP-PACK-REVIEW-R1.md through
-R4.md and S9-PREP-PACK-AUTHOR-REPORT.md, all under rebuild/lanes/b/.
- NEW: F1 ancestor redirects, F2 digest mutants, F3 growth during read, F4 APPROVED case rename.
  Earlier case-rename claims concern PACK only (R1:290; R2:302-322), which my tests confirm.
- F5 NEW at the literal validator/ADDED call sites (P09/P10). Related non-ASCII coverage concern
  was ALREADY KNOWN in R4 N4-2. P08 serialise sort was ALREADY KNOWN, R3 section 2/P18.
- ALREADY KNOWN: P11/P12, R3 section 2/P37/P39 and R4 section 7, expressly PM-upheld residuals.
- ALREADY KNOWN: F6, R3 section 5/Q4 and author:289-303; acknowledged, not silently missed.
- ALREADY KNOWN: F7, author:1055-1058 and P's header; my directory ACE is fresh evidence.
- ALREADY KNOWN: __pycache__ hiding (R1 N5a), duplicate engine acceptance (R1 N8).
  Empty directories, hard links and NTFS streams were not found in those five records;
  reported here as scope notes, not elevated into Git-content defects.

What I did not verify

No Linux execution, hosted runners, fork policy, Node 22 execution, real design pack, filled
production literals, or full application/conformance suite. Runs used exactly the supplied
Node executable (v24.19.0, win32), one process at a time; direct module execution runs node:test
without --test child processes. Each .cmd set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York
on separate lines before execution. The CI combined command was inspected, not run concurrently.
No actual concurrent writer, Linux-only filename bytes, file symlinks, or immutable-snapshot proof.
All tests used synthetic fixtures; no forbidden data/auth/soak paths were accessed. No tracked
file was edited; no commit/push/checkout/reset/stash/clean/fetch, installs, generators or receipts.
Scratch retained intentionally for exact reproduction (no cleanup deletion was attempted):
C:\Users\joeym\AppData\Local\Temp\astra-s9-pack-9f374cdb14e94428a19f2710f70f6d13
Its counterexamples.mjs, second-probes.mjs, third-probes.mjs, unicode-mutants.mjs, file-denial.mjs,
mutation-inventory.json and per-ID .cmd/.log files contain the inputs and outputs quoted here.
Only this review file was written in the worktree. No production fix was applied.
