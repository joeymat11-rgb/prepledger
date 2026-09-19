# S9-PREP-RUNNER re-check R5
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; narrow re-check of fix round 5; highest effort
Head checked: 4ccfdfcdd54bfbb24234d5776bd0834cea68e718
Script SHA256 (certutil): 316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e

VERDICT: REJECT

F1 CLOSED. product() counted all five special keys; serialized proposed().product and proposed().released each retained __proto__, constructor, toString, hasOwnProperty and valueOf. Output: "5 carried byte-identical from the parent" / "5 released under DECISIONS:12". H18 fixes both original maps.
F2 STILL OPEN. The original ./ witness now refuses PATH-IS-NOT-CANONICAL through executed spec(), for brief.file, carrierSuccessor.file/.parent, successor carrier original/successor, and child argv. A case-only alias still reaches an AUTHORIZED artifact and re-pins the released file; G3 below.
F3 STILL OPEN, narrowly. The one-key and four-key role-carried records now refuse ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD; execution-only refuses ANCESTOR-RELEASED-BLOCK-IS-NOT-A-GRANDPARENT-PRODUCT-PIN; grandparent self-release refuses GRANDPARENT-PIN-BROKEN. However H20 still accepts the malformed closed-record witness in G4.
F4 STILL OPEN as a test-coverage finding. All 22 applicable original mutations now die; M17/M18 are gone. Base is 145 pass, 0 fail, 0 skipped. New role-check and path-field deletions still leave all ten suites green; distinguish the redundant survivors in the table from the missing tests.

New findings (most severe first)

G1 HIGH, pre-existing reviewed-map omission, now reachable with H18's preserved product key (b-package.cjs:3595-3597).
Input: a canonical, committed synthetic S8 spec with an own product key __proto__, role edited, pre=sha("original bytes\n"), post=sha("changed bytes\n"). Its reviewed commit contains the original bytes; disk contains the declared changed bytes. All other pins and exact synthetic acceptance citations agree.
Executed spec(), product(), children(), and envelope(), including its end-phase checks against the actual successful child run: output includes "PRODUCT IMPLEMENTED" and "ENVELOPE AUTHORIZED"; authorized=true, reviewedOwnKey=false. The exact same mismatch under the key ordinary refuses GIT-SOURCE-PIN.
Git hash was 45c0b761a6c6640319e6cddeb492718532f70161ed9174c75ca7f1158c508b2f; disk hash was 7c60358cb724c1b671469c5f167cea45a4f70df4e3ac87b79340692e6f17f574. reviewed[file] = pin.post || pin.pre silently drops __proto__, so L.checkSources never checks the reviewed byte it claims to check.
Smallest fix: build reviewed using own data properties (e.g. Object.fromEntries over execution and product entries). Add this mismatch and the ordinary-key refusal as paired executable tests. No full-package PASS is claimed by this phase-level witness.

G2 HIGH, pre-existing execution-pin omission (proposed():3218-3221).
Input: an admitted brief.file="__proto__", or carrierSuccessor={file:"__proto__",parent:<canonical child>,witnessPins:{}}; the file exists. Both produce executionPins without an own __proto__ entry. A child argv of exactly __proto__ instead refuses CHILD-ARGV-TARGET.
Stronger carrier witness: a BRIEF-ACCEPTED synthetic spec, exact artifact/acceptance, then change that carrier from "original bytes\n" to "changed bytes\n". Output: "CARRIERS PRESENT __proto__", "PRODUCT IMPLEMENTED", "ENVELOPE AUTHORIZED"; executionOwnKey=false and authorized=true despite different Git/disk hashes above.
This is a pin leaving the artifact silently, not a named refusal. Smallest fix: give pins own-property construction too; cover both the brief and carrier routes. Fixed runner/spec coordinates cannot be exactly __proto__, and the child route already refuses it.

G3 HIGH, H21's admitted Windows case aliases preserve F2's failure (canonicalPath():1186; releaseRuling():1466-1475).
Exact inputs: Git tree keys a.css and A.CSS containing "alias bytes\n"; product a.css role released; PM token "RELEASE-FROM-SEAL M2-S8-PROBE a.css"; brief.file="A.CSS" with that hash; one genuine new own child. Both Git keys were constructed in the disposable repo with update-index --add --cacheinfo; on Windows both disk spellings read the same file.
Executed spec(), product(), proposed(), and an exact ACCEPTED envelope: phase=IMPLEMENTED, authorized=true, released=["a.css"], executionPins includes "A.CSS". After writing "edited after release\n" to a.css, the next pins() call prints PARENT-PIN-BROKEN A.CSS.
With only lowercase a.css in Git, A.CSS is also ADMITTED by spec(), but L.checkSources later throws "Command failed: git show HEAD:A.CSS"; failCode=null. Thus the comment that uppercase is refused "here" is false, and the later Git lookup is not a complete identity guard.
Smallest fix: refuse distinct spellings resolving to the same platform file across product/released/execution inputs, including case collisions in the Git inventory; do not rewrite a spelling into authority or prohibit all uppercase names in standing packages.

G4 MEDIUM, H20 counts four keys without requiring the four named own keys (pins():2211-2220).
Canonical JSON grandparent: omit packageId, retain product[f]=the valid pin H=4ee865c982c5830b407eb7373c898303a88f52d680e1ee7f06d93a1458d51d48 (f is rebuild/m3/w7-preview/today/preview.css). Canonical JSON parent release entry: {"role":"released","lastSealedSha256":H,"rulingLineSha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","extra":true}. It has four keys but no sealedBy.
Output: "0 un-superseded grandparent pin(s)" and "plus 1 skipped as released by an ancestor artifact's released block". undefined === undefined satisfies the sealedBy check. This is a malformed-ancestor robustness hole, not a release generated by an honest proposed() chain.
A separate in-memory object with inherited role="released" and four own keys (lastSealedSha256, rulingLineSha256, sealedBy, extra) also skips. That prototype witness is not reachable by ordinary JSON.parse alone; the missing-packageId witness is plain canonical JSON.
Smallest fix: exact own-key-set equality plus a nonempty, shaped grandparent packageId and own string sealedBy; keep all existing value and product-pin checks.

G5 MEDIUM, pre-existing receipt writer silently omits the product pin (writeSealedRunReceipt():3490-3499).
Input: spec() admits a product own key __proto__ and the file exists. The actual scratch receipt is written with no such key. After committing that receipt in the disposable fixture, sealedRunReceipt() returns {ok:false,code:"SEALED-RUN-RECEIPT-VOID",moved:["__proto__"]} (other return fields omitted here).
The writer reports success; the later reverse inventory check fails closed. This loses receipt reuse rather than authorizing missing evidence. Smallest fix: own-property construction for the receipt product map; assert the written keys and the committed reread.

G6 MEDIUM, incomplete canonical walk demonstrably reaches comparisons and sealed bytes.
carrierSuccessor.witnessPins={"./brief.md":sha256("synthetic accepted brief\n")} passes spec(), is read and hashed by carriers(), and remains in proposed().carrierSuccessor. An exact synthetic accepted envelope with that map returned authorized=true. carriers() also admitted witnessFlips for ./brief.md:1 and brief.md:1 together and printed "2 exact expectation substitution(s) at 2 assertion site(s)" for one physical site.
This supplies the PM's requested reachable justification to widen the walk: these are path identities, not inert labels. Smallest fix: walk witnessPins keys and witnessFlips[].file, and exercise their equality/count comparisons with aliases. protectedSurfaces is explicitly free text, so its admission is not by itself a reason to treat it as a path schema.

Other requested measurements

H20 controls: reverse key order ADMITTED and one pin skipped; array REFUSED by ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD. Duplicate literal or escaped-decoded keys both print JSON-DUPLICATE-KEY before H20, so JSON.parse folding cannot hide a fifth key on the real parser path. A genuine fifth key is refused in the base suite.
Honest grandparent product+executionPins for the same file/hash: ADMITTED, one skipped. A release two generations back, absent from both current parent and grandparent pin inventories: ADMITTED, zero pins reasserted, no spurious closed-record refusal. No honest-chain regression reproduced.

Windows spelling measurements (the admission column is spec() unless marked predicate-only; missing files are not successful seals):
| Spelling | Admission | Measured disk/Git consequence |
|---|---|---|
| A.CSS vs a.css | ADMITTED | Disk alias; single Git spelling fails bare Git lookup, two Git keys reach AUTHORIZED release/re-pin witness G3. |
| a.css. / a.css[space] | ADMITTED | This Node runtime reports exists=false and read ENOENT, not the plain file; no alias seal shown. |
| folder./x.css / folder[space]/x.css | ADMITTED | Missing on disk and in Git in the fixture; no alias seal shown. |
| ... / folder/.../x.css | ADMITTED | Missing in the initial fixture. A separately created .../x.css is readable, but checkSources refuses SOURCE-PIN-SCHEMA because it contains '..'. |
| folder/.[space]/x.css / .[space]/x.css | ADMITTED | First missing; second separately created and readable, but Git lookup fails (failCode=null). Git add -A also refused indexing the unusual directory fixture. |
| C:x / C:/x | ADMITTED | Missing under path.join(root,p), read ENOENT; no drive escape or alias seal reproduced. |
| server/share/x | ADMITTED | Ordinary relative path, not UNC. A created server/share/x.css is a regular Git file. |
| backslash UNC / //server/share/x | REFUSED (predicate-only) | canonicalPath=false; neither spelling can enter the walked fields. |
| a.css:x | ADMITTED | Created NTFS stream exists and differs from a.css; Git lookup fails without a named runner code. |
| a.css::$DATA | ADMITTED (predicate-only) | Default stream aliases a.css on disk; Git lookup fails without a named runner code. No authorized stream-alias seal claimed. |
| a%2ecss / a<U+FF0E>css / a<U+2215>css | ADMITTED | Created, committed, distinct files; L.checkSources passes each. No percent-decoding or Unicode-lookalike alias observed. |
| 300 'a' characters + .css | ADMITTED | Node read ENOENT, Git reports "Filename too long"; no alias seal. |

The remaining omitted fields were followed to their comparisons:
- substitutions[].original="rebuild/m4/spec/./orig.cjs": executed spec() ADMITTED a valid pin-retarget substitution; successorProof() REFUSED SUCCESSOR-SUBSTITUTION-TARGET-NOT-IN-THE-PARENT-GATE-CLOSURE. The comparison reads the unchecked spelling. No sealed substitution bypass demonstrated.
- successors.wrapper="./rebuild/m4/spec/orig.cjs": spec() ADMITTED; acceptedVerdicts() REFUSED SUCCESSOR-WRAPPER-NOT-A-PARENT-EXECUTION-PIN against the canonical parent key. A parent children schedule can make this wrapper unused.
- successors.support="rebuild/m4/spec/./support.cjs": REFUSED SUCCESSOR-SUPPORT-IS-NOT-A-DECLARED-CHANGE-OF-THIS-PACKAGE; its required matching product key is already walked. successors.reviewFile="./...": REFUSED SUCCESSOR-REVIEW-FILE-SHAPE.
- artifact.file and artifact.review with leading ./ both REFUSED in spec() by "Artifact path is the one this package id determines" / "Review path is the one this package id determines"; these are exact-constant comparisons, not named canonical refusals.
- parent.options[].artifact/review are omitted by the walk; source trace: option() reads them, hashes them, and compares the artifact spelling to the exact receipt. No new bypass claimed. tooling.runner is held to RUNNER exactly. protectedSurfaces=["./a.css"] is admitted and serialized as explicitly unasserted descriptive text.
- All 12 standing package JSONs: 149 children, 533 argv strings, zero canonicalPath failures. Only flags are --test and --test-reporter=tap; all remaining arguments are file targets. No legitimate flag value, glob or timezone is currently rejected. childArgv's closed grammar allows no such positional non-file value.

No-release compatibility and seven package pins:
- Current S8/H3 and the unchanged 4e447ae6 runner both exit 1, terminal "B PACKAGE <ID> FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld". Four stdout lines each; exact diff is only the two hashes in SPEC OBSERVED. All remaining bytes match.
- S8 spec hash: 6286a18ab9cb3be66ac0ecc43390304fd3372eb7f425c83af8a6e6c7b12a317b -> df3f785dad9c13eda9e27fc31ba84d1290690c621ed9fa7dc86c1bfe838c2a39. H3: 6da6523f627df89c4762eeb0d62e613cf3b6a6df0c024cc976c34029a3adfdb4 -> 119c215348aea0d49404be8fcf09cc2fb6216e3a4370878027e6ea2da61b69a6.
- Old runner hash: 32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3. Current hash is the header. Old CLI ran in scratch with its own HEAD=4e447ae6, read-only Git object alternates, and a lazy public-file projection from that revision; runner bytes unchanged. Current CLI ran in the assigned worktree.
- Actual old/new proposed() constructions, holding other fixture inputs fixed and using the real S8/H3 product maps: whole serialized proposed JSON equal, product JSON equal, 224/64 pins respectively. This isolates construction changes from the deliberately different runner/spec hashes.
- Product JSON SHA256: S8 f5277bae89c33fbdf382c4e58d10a4bbec73a4a4071f06a55237b6d93941148c; H3 c965daca0f6f611ba0c62df4e0579d1ead0ceb7785b3e17847f4dd4d6e4a5b5d.
- H3.json, S3.json, S4.json, S5.json, S6.json, S7.json, S8.json: raw-byte replacement of that one old runnerSha256 by the measured new hash equals each complete HEAD file; parsed JSON equality after only that replacement also true. No other byte differs.

Three sibling maps, one measurement each
- proposed().executionPins: __proto__ reaches brief/carrier through spec(), disappears silently, and carrier envelope remains AUTHORIZED after drift; exact child argv __proto__ REFUSES CHILD-ARGV-TARGET.
- writeSealedRunReceipt().product: __proto__ reaches it through spec(), disappears from the written receipt; committed reread REFUSES SEALED-RUN-RECEIPT-VOID with moved=["__proto__"].
- envelope().reviewed: __proto__ reaches it as admitted product, disappears silently; wrong reviewed Git byte still AUTHORIZED, while ordinary-key control REFUSES GIT-SOURCE-PIN.

Mutation table
All rows run all ten suites, one change at a time, only on scratch copies. Baseline in both original worktree and copied suite: 145/0/0 (pass/fail/skipped). Every mutation below has zero skipped. R = release-from-seal; S = seal-tip-and-byte-identity; G = gate-supersession. K = killed; LIVE = every test green; NA is not counted as killed. M16 adapts the old assertion deletion to H20's assert.equal. Failed-cell names are abbreviated only here.
| Row | Exact single change or unambiguous target | Pass/fail | Result / witness |
|---|---|---:|---|
| M01 | release grant g[1] === s.packageId -> s.packageId.startsWith(g[1]) | 144/1 | K, R(M01) |
| M02 | assert(granted.has(file), -> assert(true || granted.has(file), | 143/2 | K, R(2),(7) |
| M03 | assert(declared.includes(file), -> assert(true || declared.includes(file), | 144/1 | K, R(7) |
| M04 | release pre-image expected parentPin(...) -> s.product[file].pre | 144/1 | K, R(2) |
| M05 | release Object.hasOwn(pmap,file) -> file in pmap | 144/1 | K, R(M05) |
| M06 | release assert.equal(hits.length,1,...) -> assert(hits.length >= 1,...) | 144/1 | K, R(M06) |
| M07 | ruledTerminal -> /(?:^|[ \u00b7])RULED$/.test(line.trim()) | 143/2 | K, R/G(P-A1) |
| M08 | release block if(Object.hasOwn...) -> if(false && Object.hasOwn...) | 144/1 | K, executed spec R(M08) |
| M09 | prefix released post-null assertion with if(false) | 144/1 | K, executed spec R(M09) |
| M10 | assert(!argv.has(file), -> assert(true || !argv.has(file), | 143/2 | K, R(8),(R1-B1) |
| M11 | assert(!epin.has(file), -> assert(true || !epin.has(file), | 144/1 | K, R(R1-B1) |
| M12 | product released disk-skip condition -> false && condition | 140/5 | K, R(2),(3),(8),(R1-B1),(P-A1) |
| M13 | proposed releaseRuling -> {declared:released product keys} | 140/5 | K, R(P-A2),(M01),(M05),(M06),(M23) |
| M14 | emitted sealedBy -> 'M2-WRONG-PARENT' | 143/2 | K, R(9),(P-A8 b) |
| M15 | emit released block unconditionally | 141/4 | K, R(9),(X1),(X2),(P-A8 c) |
| M16 | prefix ancestor lastSealed/product-pin assert.equal with if(false) | 143/2 | K, R(P-A3),(P-A9 c) |
| M17 | remove first-writer-wins guard | NA | H19 removed the merge/guard |
| M18 | remove grandparent argument | NA | Already the shipped code |
| M19 | receipt forward skip -> if(false && isReleased(file)) | 143/2 | K, S release/commit |
| M20 | receipt writer removes role !== 'released' filter | 141/4 | K, R(10),(P-A4), S release/commit |
| M21 | H18 product filter additionally excludes file === '__proto__' | 144/1 | K, R(P-A8 a) |
| M22 | receipt reverse loop removes !isReleased(file) | 143/2 | K, R(10), S release |
| M23 | /^RELEASE-FROM-SEAL -> /RELEASE-FROM-SEAL | 144/1 | K, R(M23) |
| M24 | bound-parent assert condition -> true || condition | 144/1 | K, R(P-A2) |
| N01 | H20 Object.keys(block).length === 4 -> true | 144/1 | K, R(P-A9 b) |
| N02 | H20 block.role === 'released' -> true | 145/0 | LIVE, real missing role-only test |
| N03 | H20 lastSealedSha256 string/hex clause -> true | 144/1 | K, R(P-A9 b) |
| N04 | H20 rulingLineSha256 string/hex clause -> true | 144/1 | K, R(P-A9 b) |
| N05 | H20 block.sealedBy === ga.packageId -> true | 144/1 | K, R(P-A9 b) |
| N06 | H20 Object.hasOwn(ga.product,file) -> file in ga.product | 145/0 | LIVE; no inherited-pin discriminator |
| N07 | H20 hash expected parentPin(ga.product[file],file) -> parentPin(entry,file) | 145/0 | LIVE; no unequal dual-map discriminator |
| N08 | delete H21 carrierSuccessor.parent push | 145/0 | LIVE |
| N09 | delete H21 successor original push | 145/0 | LIVE |
| N10 | delete H21 successor carrier push | 145/0 | LIVE |
| N11 | delete H21 child argv target push | 145/0 | LIVE |
| N12 | H21 !p.startsWith('/') -> true | 145/0 | LIVE, redundant with empty-segment rule |
| N13 | H21 !p.includes(backslash) -> true | 144/1 | K, R(P-A10 b) |
| N14 | H21 seg !== '' -> true | 144/1 | K, R(P-A10 b) |
| N15 | H21 seg !== '..' -> true | 144/1 | K, R(P-A10 b) |
| N16 | delete H22 canonicalSpecPaths(s) call | 143/2 | K, R(P-A10 a/b) |
| N17 | fixture SPECIAL_KEYS removes '__proto__' only | 144/1 | K, R(P-A8 b), grant still names it |
| N18 | fixture wrong sealedBy M2-SOMEONE-ELSE -> M2-S8-FIXTURE | 144/1 | K, R(P-A9 b) |
| N19 | fixture carried record: role carried -> released, other defects retained | 145/0 | LIVE, fixture masks the role distinction |
| N20 | same fixture record: sealedBy M2-UNRELATED -> M2-S8-FIXTURE | 145/0 | LIVE, role/fifth-key defects still refuse |
Totals: 22/22 applicable original rows killed; 10/20 new rows killed and 10/20 green. N02 survives because the fixture's carried record also has a fifth key and the wrong sealedBy. The independent four-key role-carried probe did refuse at HEAD. A green mutation is a coverage measurement, not automatically a reachable product defect; N06/N07 concern malformed ancestry, and N12 is redundant.

What I did not verify
- No --full, private inputs, protected soak, hosted run, real release/seal, generator, or actual app behavior. No receipt/artifact was generated in the shared tree; receipt and envelope probes used disposable synthetic repositories only.
- AUTHORIZED means the actual envelope() function returned true with exact synthetic Git/ledger evidence; no probe ran the complete package main sequence to POSTFIX PACKAGE PASS. Ancestor-shape probes supplied a bound object, matching the suite's phase-level method; they do not forge a standing chain seal.
- No Windows namespace exhaustiveness, every possible filesystem, reparse-point/hard-link attack, or authorized NTFS stream alias seal. The stated results are for Node v24.19.0 and this Windows volume. UNC refusal was measured at the predicate, without accessing a network share.
- Old full main sequence comparison used a read-only public-file projection in scratch, not a forbidden checkout. Only the allowed --ci path ran; it stopped at the same named profile refusal before children or private work.
- The earlier blind report was unavailable. M01-M24 were reconstructed from the author's explicit table and the current diff, not represented as recalled verbatim artifacts. Scratch measurements/logs remain under %TEMP%/astra-r5-433a2c255db943da84a31fa402194d59.
- No tracked file edited, no fix applied, no commit/push/checkout/reset/stash/clean in the assigned or shared repository. The sole review deliverable is this ASCII file.
