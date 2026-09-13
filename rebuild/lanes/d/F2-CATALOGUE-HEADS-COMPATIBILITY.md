# F2 catalogue-head compatibility addendum

Lane D prebuild, 2026-09-12. Authority: DECISIONS:159, :170, :174-175.
This records compatibility with C's merged tuples; it does not amend acceptance or the frozen v1.0 brief bytes.
Base: ff6b6b573174bad3d20c4a817d7b68978506bf39 with F1 prebuild 2afd2c1 and prior F2 carried at e86018c.
B1/B2 product is not present at this base. This is not its accepted successor or a sealed package.

## Tuple interpretation

- Saved primary tags remain exactly `{head, secondary}`; no stored setup exercise field is added.
- A helper accepts exactly `{mg,lend}` or `{mg,lend,head}`. A fourth key is refused.
- Absent `head` retains the old tuple's meaning. Explicit null, undefined, empty, non-string or unknown heads refuse.
- A present head must be an own key in injected `REGION_MG`, and `REGION_MG[head]` must equal `mg`.
- The effective helper target is the explicit head when present, otherwise `mg`. The saved tuple is copied intact.
- Previously allowed headless regional `mg` tuples remain supported; they are not rewritten into the optional-head form.
- Duplicate effective targets refuse, including aliases such as `{mg:'delts_front',lend:.5}` plus `{mg:'delts',head:'delts_front',lend:.25}`.
- Distinct resolved sibling targets may coexist. Coarse and resolved helper targets retain separate totals; no silent allocation or deduplication invents a split.
- The effective target must not equal the direct bucket or its coarse muscle. A coarse direct target cannot also receive a helper from one of its regions.
- A resolved direct region may receive a distinct resolved sibling region, consistently with the pre-existing direct-region tuple rule.
- Lends remain finite, positive and at most one. No fraction, catalogue assignment, band or physiological claim changes.
- Explicit `secondary:[]` stays empty even for an id colliding with legacy `INDIRECT`; absent whole snapshots keep the legacy branch.
- Same-snapshot replay compares all helper members, including head. A later catalogue correction cannot rewrite an enrolled snapshot.

## Engine effects and remaining seams

Designed counts, synthetic observed engine-history counts and structural targets use the same effective helper target.
Explicit resolved targets qualify for their existing regional band; indirect-only rows remain ineligible for a direct set offer.
Headless coarse back/delts counts remain unqualified with null band/tier. Their budget expands to the whole known region family without multiplying sets.
The merged catalogue has 83 exercises: 16 helpers now carry explicit heads; five ambiguous back helpers stay headless.
The v1.0 recon sentence treating face-pull and deadlift helpers as headless describes the old snapshot; current C snapshots supply their explicit heads.
Sources: `today/exercise-catalogue.mjs`, `today/setup-commands.mjs:tagsOf`, `today/setup-model.mjs:document`, and DECISIONS:170.
Product implementation: `m4/workout/setup-tags.cjs:check` and `engine/volume.cjs:volumeSecondary` (paths relative to rebuild).
No Today/host binding, client operation, history projection, private FULL, seal, reviewer verdict or phone result is supplied by this addendum.
