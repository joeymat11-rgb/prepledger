# S9 preparation runner blind review
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Reviewed HEAD: 4e447ae68ecc517e5031b3ebc737938371f3cee3
Script SHA256 (certutil): 32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3

VERDICT: REJECT

Two blocking integrity defects: silent loss of a declared pin and a release that still pins
the same file through a path alias. The former was named in the commissioning brief.
I recorded my findings in this file before opening R1/R2/R3 or the author report.

## Findings, most severe first

### F1. BLOCKING: __proto__ disappears from both output maps (3144-3148)

Input: JSON.parse produces an OWN product key "__proto__"; pin = {pre:H,post:H,role:"carried"}.
H = SHA256("synthetic special-key bytes\n"); the real synthetic file contains those bytes.
Controls: constructor, toString, hasOwnProperty, valueOf, each with the same valid pin.
No release declaration or grant is present. Call the real product() and proposed(), and compare
proposed() from da9f8683 over identical inputs. Exact measured output:
`oldHas=true; newHas=false; oldKeys=__proto__,constructor,toString,hasOwnProperty,valueOf;
newKeys=constructor,toString,hasOwnProperty,valueOf; prototypeRole=carried`.
product() reports "5 carried byte-identical from the parent" and "0 unlisted drift".
Assignment to productMap["__proto__"] sets its prototype instead of creating an own pin.
The new serialized artifact omits a file the parent and this spec still declare pinned.

Sibling: grant "__proto__" exactly, declare {pre:H,post:null,role:"released"}, and give the
parent an OWN pin at H. The actual grant is admitted, but measured output is
`{"granted":["__proto__"],"product":{},"released":{},"releasedKeys":[],"prototypeRole":"released"}`.
releasedMap has the same setter problem: the permanent release record is lost too.

Follow-through with full canonical, committed synthetic package JSON, H now equal to
SHA256("synthetic full-shape probe\n"): real spec() admits BOTH carried and released cases.
Real envelope() returns PENDING for their recomputed artifacts; productKeys is [] in both,
releasedKeys is null (block absent) for carried and [] for released.
This measures admission/recomputation, not a completed acceptance or FULL seal.
Smallest fix: use Object.create(null) or Object.fromEntries for BOTH new maps; add own-key
round-trip tests, including a no-release comparison against the prior implementation.
Other four special keys survived unchanged. Map/Set and Object.hasOwn uses in the new readers
did not show an analogous present defect; their mutation coverage is weaker (M05/M21).

### F2. BLOCKING: ./ aliases evade the execution-pin collision guard (1409-1418)

Exact input: f = "rebuild/m3/w7-preview/today/reviewer.css", containing
"synthetic full-shape probe\n"; H is its SHA256. Parent product[f] pins H.
Package id = M2-S8-PROBE; product[f] = {pre:H,post:null,role:"released"};
brief.file = "./" + f; brief.sha256 = H.
Synthetic chain line: head + "RELEASE-FROM-SEAL M2-S8-PROBE " + f + separator + " RULED",
where head is "- 2026-09-19 " + separator + " cowork (PM, EARNED - PM4) " + separator + " "
and separator is U+00B7; release.rulingLineSha256 hashes that exact line.

Exact results: `spec=ADMITTED; releasedKeys=[f]; executionPin=./f; envelope=PENDING;
allExecutionPinsVerifiedInGitAndDisk=true`. The last result executes the real L.checkSources
over ALL proposed execution pins at fixture HEAD, not just an fs path comparison.
Change f to "the legitimately released file changed\n"; next-generation pins() refuses:
`PARENT-PIN-BROKEN ./rebuild/m3/w7-preview/today/reviewer.css`.

The guard compares spellings, while disk access and Git's leading ./ syntax identify one file.
The artifact releases f and pins the same file through ./f. This reproduces R1-B1's supposedly
closed failure class without deleting a guard. The generic mechanism is defective; I did not
find this input in S8/H3 or the proposed two-file S9 list.
Smallest fix: require a single canonical repo-relative spelling at product, brief, successor
and execution-pin inputs, and compare those identities. Keep exact ledger/declaration equality;
do not silently normalize an ungranted token into authority for a different spelling.

Windows controls: backslashes, interior /./ and uppercase brief aliases also pass the release
guard and resolve on disk, but their Git object reads fail. Those variants prove inconsistent
path admission, not successful seals. The leading ./ witness passes BOTH disk and Git.

### F3. ROBUSTNESS: ancestor release metadata is trusted by hash alone (2064-2070, 2119-2124)

Start with the release suite's synthetic S10/S9/S8 structure, two released paths whose bytes
moved, and an unrelated retained grandparent pin. H = SHA256(".card { padding: 1rem; }\n").
Replace the parent's released["rebuild/m3/w7-preview/today/preview.css"] with either:
`{lastSealedSha256:H}`, or
`{role:"carried",lastSealedSha256:H,sealedBy:"M2-UNRELATED",rulingLineSha256:"0".repeat(64),extra:true}`.
Both pass pins(), printing exactly
"plus 2 skipped as released by an ancestor artifact's released block".
The first record does not identify a release; the second explicitly says carried.

Additional measured cases: a same-hash execution-only grandparent pin is also skipped;
a grandparent's contradictory own product+released entry can exempt its own product pin.
Changing lastSealedSha256 to a different hash refuses
ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN.
Two ancestors naming one path obey parent-first precedence: valid parent/stale grandparent
passes; stale parent/valid grandparent refuses. Matching product+execution pins skip;
different hashes in those two maps refuse against the execution hash.

Reachability limit: these are synthetic bound ancestor records. Current proposed() does not
generate these malformed entries; I did not forge a real accepted ancestor or its receipts.
This is an incomplete defensive reader contract, not an arbitrary release through a valid
current spec. Smallest fix: validate the closed four-key schema, literal role, hash fields,
and sealedBy against the appropriate parent before using the record; require provenance from
that parent's PRODUCT inventory. A record in the grandparent itself is not proof that its
own product pin was released by a later package. Do not treat a mere matching hash as authority.

### F4. TEST GAP: live checks can be disabled with all ten suites green

M08 adds `false &&` to spec()'s release-block condition at 1654.
M09 prefixes the post-null assertion at 1735 with `if (false)`.
Both leave the source strings B.8 (1b) searches for intact. Exact result for EACH:
`# tests 130; # pass 130; # fail 0; # skipped 0`.
They disable real admissions, not equivalent refactors. Nine of 24 changes survived.
M01, M06 and M23 additionally weaken package identity, line uniqueness and token anchoring.
Smallest fix: execute spec() against canonical committed synthetic package files and assert
named refusals for a non-null released post and extra release-block keys. The full-spec
fixtures used for F1/F2 prove spec() can be exercised without running the main sequence.
Add the missing negative token, duplicate-line and special-key cases below.
Survival alone is not a product defect; M17/M18 cover a deliberately dormant ancestor branch.

## Executed controls and compatibility

Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
Each test command used a scratch .cmd with separate lines:
`set "MEASURED_TEST_NOW=2026-09-03"`
`set "TZ=America/New_York"`
Baseline command: node --test --test-reporter=tap rebuild/lanes/b/tooling/test/*.test.cjs
All ten suites unchanged: 130 pass, 0 fail, 0 skipped, in both the real tree and scratch.
The initial incomplete scratch copy lacked public artifacts/directories; it was corrected
before collecting mutation results. No such setup failure is counted as a mutation kill.

Grant controls: repeated tokens and duplicate paths form a set and are admitted as designed.
Prefix/suffix package ids refuse THIS-PACKAGE; lowercase token id and Windows separators
refuse GRANT-TOKEN; case-changed paths refuse DECLARED-PATH-IS-NOT-GRANTED.
A token "a,b" does not release the filename "a,b". "a.b.css" is admitted when declared/pinned.
"x/../a.css" is admitted only with that exact synthetic parent key and grant, illustrating
the missing canonical-path admission. Extra granted and extra declared paths refuse in
opposite directions. Wrong pre-image refuses RELEASE-PATH-PRE-IMAGE-IS-NOT-THE-PARENT-PIN.
Two identical ledger lines refuse RELEASE-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH.
No-release inputs return no grant and no released block. Normal releases emit exactly
role,lastSealedSha256,sealedBy,rulingLineSha256; __proto__ is the exception above.

S8 and H3 real --ci runs: exit 1, each with
`B PACKAGE <ID> FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`.
Old da9f8683 --ci comparison: same exit and byte-identical stderr; three stdout lines each.
Stdout matches after normalizing the spec/runner SHA256 fields and 20/24 child-root counts.
Literal stdout necessarily changes where it reports the changed runner/spec hashes.
Method: scratch-compile unedited old source, overlay only old runner/spec disk reads and their
matching Git-HEAD object reads, use the same current public tree/ref for all other reads;
redirect its mkdir to scratch. No assertion bypass, checkout, historical full run or seal.
Separately, both proposed() implementations over identical current S8/H3 inputs produce
byte-identical JSON: 21 top-level keys, 224/64 product entries, no released key.

## Code changes and tests that noticed

One independent change from the measured source per run; all ten unedited suites run each time.
R = release-from-seal; G = gate-supersession; S = seal-tip-and-byte-identity.
R(n) means its B.8 (n) test; other labels are the literal test identifiers.
S-release = "S9 H12/H13 - a RELEASED path is in neither direction of the receipt...";
S-commit = "r8 - a receipt that is not COMMITTED refuses..." (secondary fixture failure).
Each row ran 130 tests, none skipped. No other suite failed. Survivors are 130/0.

| ID | Exact local change (unmentioned code unchanged) | Pass/fail; tests that noticed |
|---|---|---|
| M01 | Release mine filter: g[1] === s.packageId -> s.packageId.startsWith(g[1]) | 130/0; NONE |
| M02 | assert(granted.has(file), -> assert(true \|\| granted.has(file), | 128/2; R(2),(7) |
| M03 | assert(declared.includes(file), -> assert(true \|\| declared.includes(file), | 129/1; R(7) |
| M04 | Pre-image assert RHS parentPin(pmap[file],file) -> s.product[file].pre | 129/1; R(2) |
| M05 | Release parent membership Object.hasOwn(pmap,file) -> file in pmap | 130/0; NONE |
| M06 | Release hits.length === 1 assertion -> assert(hits.length >= 1,...) | 130/0; NONE |
| M07 | ruledTerminal body -> /(?:^\|[ \u00b7])RULED$/.test(line.trim()) | 128/2; G(P-A1),R(P-A1) |
| M08 | if (Object.hasOwn(s,'release')...) -> if (false && Object.hasOwn(s,'release')...) | 130/0; NONE |
| M09 | Prefix H4 assert(pin.role !== 'released' \|\| pin.post === null,...) with if(false) | 130/0; NONE |
| M10 | assert(!argv.has(file), -> assert(true \|\| !argv.has(file), | 128/2; R(8),(R1-B1) |
| M11 | assert(!epin.has(file), -> assert(true \|\| !epin.has(file), | 129/1; R(R1-B1) |
| M12 | if(pin.role === 'released') disk-skip branch -> if(false && pin.role === 'released') | 125/5; R(2),(3),(8),(R1-B1),(P-A1) |
| M13 | proposed releaseRuling call -> {declared: released-role keys of s.product} | 129/1; R(P-A2) |
| M14 | releasedMap sealedBy -> 'M2-WRONG-PARENT' | 129/1; R(9) |
| M15 | Conditional released spread -> unconditional {released:releasedMap} | 127/3; R(9),(X1),(X2) |
| M16 | Ancestor block/hash assert(condition,...) -> assert(true \|\| (condition),...) | 129/1; R(P-A3) |
| M17 | Remove if(!out.has(file)) from releasedAncestry's out.set | 130/0; NONE |
| M18 | releasedAncestry(a,ga) -> releasedAncestry(a) | 130/0; NONE |
| M19 | Receipt forward skip if(isReleased(file)) -> if(false && isReleased(file)) | 128/2; S-release,S-commit |
| M20 | Receipt writer removes s.product[file].role !== 'released' && | 126/4; R(10),(P-A4),S-release,S-commit |
| M21 | Guard productMap[file]=p with if(file !== 'constructor') | 130/0; NONE |
| M22 | Receipt reverse loop removes !isReleased(file) && | 128/2; R(10),S-release |
| M23 | RELEASE_GRANT initial /^RELEASE-FROM-SEAL -> /RELEASE-FROM-SEAL | 130/0; NONE |
| M24 | Bound-parent assert(condition,...) -> assert(true \|\| (condition),...) | 129/1; R(P-A2) |

## NEW versus ALREADY KNOWN

Compared only AFTER the blind findings were written:
- F1 product loss: ALREADY KNOWN from the commissioning brief's Astra partial pass.
  No __proto__ finding appears in R1/R2/R3 or the author report. Released-map sibling: NEW.
- F2 alias bypass: NEW. Related exact-spelling collision was R1 BLOCKING-1 (lines 28-60);
  R2 section 8 item 2 (415-417) says the five doors are closed. ./ defeats that conclusion.
- F3 missing shape/provenance: ALREADY NOTED by Astra's commissioning brief, now reproduced
  and extended with execution-only/self-release/two-ancestor cases. Not the earlier fixed
  wrong-hash issue: R2 N2 (109-126) / author 11.5 / R3 P-A3 cover only that comparison.
- F4 H4/H5 source-only coverage: ALREADY KNOWN as a limitation (author section 2, 152-164;
  R1 N3, R2 N3). The live-check-disabling green counterexamples M08/M09 are NEW measurements.
- M17/M18 survival: ALREADY KNOWN, R3 section 3 (117-118) and N3 (268-286).
  Other survivor measurements M01/M05/M06/M21/M23 are NEW relative to those four documents.
  R1 section 4 measured duplicate-line refusal, but that test did not enter the ten-suite bar.
- Ordinary no-release compatibility and four-key artifact shape agree with earlier reports.
  I accept omission of the live rulingLine number: author section 6(6), R1 BLOCKING-2;
  recording a moving line index would break byte-identical recomputation.

## What I did not verify

- No --full, seal, acceptance receipt, generator, real S9 package, hosted CI or Linux run.
  Synthetic stage admission/PENDING recomputation is not a claim of POSTFIX PACKAGE PASS.
- No private fixture, src/history.js, any ledger directory, EarnedPort, port-real.log, protected
  soak, auth file or node_modules read/modified; no npm install or private-data gate.
- Old --ci used the documented public-input overlay, not a checkout of the full historical tree.
- No real ancestor acceptance was forged; F3 depends on malformed bound ancestor input.
- Scope was the requested diff and complete affected runner functions; no review of all
  pre-existing runner, engine or public app logic. No production fixes applied.
- The only repository file written is this report. No tracked file edited; no repository
  commit/push/checkout/reset/stash/clean. Git mutations occurred only inside suite/reviewer
  disposable synthetic fixture repositories. Reviewer scratch files were removed.