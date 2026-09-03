# EARNED — ratified documents (durability copy)

Landed 2026-09-03 from the EARNED build chat ("CC HANDOFF 2026-09-03 · DOCS-TO-REPO").
These files are ratified text and their rigs, stored here so they survive outside the chat.
They are documentation only: nothing under `src/` reads them and the app does not change.

Every file below was extracted from the handoff bundle with its byte count and SHA-256
checked against the bundle header. Do not edit these files in place; a new ratified
version lands as a new file with a new hash row.

## Contents

- `docs/ratified/` — the RUNTIME SHEET v1.7.37 (appendix v1.36) and the SOURCE INGESTION PROTOCOL v1.0.
- `docs/ratified/provenance/` — the Python scripts that produced appendix passes v1.30 → v1.36 and the v1.36 split.
- `docs/packs/` — PROGRESSION-1 PACK 3 (FIX-4 / FIX-4b, commit 66bc7c3).
- `tools/rigs/` — rigs 174 → 183 with their logs. They are evidence of the passes, not part of the app's test suite.

## Index

| path | bytes | sha256 |
|---|---:|---|
| `docs/ratified/EARNED-RUNTIME-SHEET-v1.7.37.txt` | 423834 | `6d7870c1b2e8c6e20bd77a310e3fe658b4b7b2dc965112085f75443e44e88533` |
| `docs/ratified/EARNED-SOURCE-INGESTION-PROTOCOL-v1.0.txt` | 51954 | `17eac82109789c9bc2fc0123e17dc708527ec656798e8f094e1a9baf026c9f89` |
| `docs/packs/EARNED-PROGRESSION-1-PACK-3-FIX-4-FIX-4b-66bc7c3.txt` | 152275 | `0973f580811ef63253505cbd966ef1994763addf824a745374c2c483da4c0b54` |
| `tools/rigs/rig175.cjs` | 8516 | `6ced1b560b70794d8af6627b7762a5f328754b3f39dfadc8b082df1392fa61d1` |
| `tools/rigs/rig175.log` | 2025 | `a802dfa5519bf93f7a90437d1f57c5a92565e67286cca98054a9ab82bd357807` |
| `tools/rigs/rig176.cjs` | 8808 | `8c541c6ffeef60bc050ab5d9a20e9043c1cce48d423b9a1d652bb2402ba38615` |
| `tools/rigs/rig176.log` | 1889 | `02d09f6b83368d3ececa3bb5906dbc712843640e43fc4223f3e8d1238ea698c8` |
| `tools/rigs/rig177.cjs` | 9576 | `a512e279591d451715e0be7f4c547a19c7a5d6525ae4c01aa8ebdb0bacaa3f67` |
| `tools/rigs/rig177.log` | 3198 | `c88f4b6f43b1688194fd9dc4a3d5eddbba0268e8f86e9f22099a6be7a5f38b12` |
| `tools/rigs/rig178.cjs` | 9484 | `13c112b6e37f5665e5f7d91d8005ab85a03dacbf608a9be454b212be277fce23` |
| `tools/rigs/rig178.log` | 2669 | `ce0994cde15622a178266a0be611eaedb51fce6bcfa0e8b38c233a1fb456c96a` |
| `tools/rigs/rig179.cjs` | 8178 | `c0e033cbc267257669ba7b790c7cf00ba08018ae549c6bb6ea7e74c52c554ef5` |
| `tools/rigs/rig179.log` | 2163 | `c61d6b07ba3099b3416bd6fee698b674d3eb508a7db58e44f7c080d530113863` |
| `tools/rigs/rig180.cjs` | 7614 | `0b1ac868f59403faf2d26b5b98729318ce11186e9052c40a573a6f36e1e7fd99` |
| `tools/rigs/rig180.log` | 2387 | `7599f1e4c51ee37fd484bd2625569971944263e1b331caa92307248e955fe524` |
| `tools/rigs/rig181.cjs` | 12772 | `1a859b6eab49ea95fd7b04b41a58696b23e2a9d08729397e7f78e4a0ad6c19d5` |
| `tools/rigs/rig181.log` | 4586 | `f84ae3398f082cd9ae3e8a0cef04095192f38191750fe80afd5831497630c2cb` |
| `tools/rigs/rig182.cjs` | 12094 | `30d0de40d6d4d238dcee9cddb2d679f54d1f91639ccafc9de1f17be8fb8f6269` |
| `tools/rigs/rig182.log` | 3535 | `9eeb5526a6e6cc161720ba5cb94cffe3f255ff93fa8c79559eee7d31b8c97d12` |
| `tools/rigs/rig183.cjs` | 12072 | `dd33ce4751c0b1ccbd3076feb03c1470ec21069a1a26a8ec0420309ece4b07f8` |
| `tools/rigs/rig183.log` | 3872 | `dbe757bcb51826503862d6e28f5b1c572010c8c85afce8d05739c26aa9b3f572` |
| `tools/rigs/rig174-live.cjs` | 12070 | `7ce8c128b6efb118a80e39971a4620bbf3c04a8f17e614c11aaf50ff6a487d5d` |
| `tools/rigs/rig174-qorder.cjs` | 1427 | `bb17b3c1a4c964dcbf878f520754f4b8ed4192a3c7caf3f76e4f5ce72f25387f` |
| `tools/rigs/rig174-feeddiff.cjs` | 626 | `be90ffe12835077425e50c641b1fedfe4f8a56cc551f4232104b3f848f28cdea` |
| `tools/rigs/rig174-build-engines.mjs` | 786 | `07fb54176e26e6e8f0d9d6c0e18b216431ad325ea15ddca3b77f0b67338e0998` |
| `tools/rigs/rig174-gate.log` | 2056 | `f08a1baa3b815bdea981aa5d4591b58e5eb5141a0e81254722122a79b3bb147c` |
| `tools/rigs/rig174-mutations.log` | 28086 | `71568efee782bd3ebe9f4e0792000b46a1c2752b83ad7cd2eb1505770616028b` |
| `tools/rigs/rig174-explore.log` | 1604 | `da81a6253fdf464663fce28ecf60e8251c327715de80aedb7da4e42b3ec6bb41` |
| `tools/rigs/rig174-live-run.log` | 6080 | `abb027844b164e475a6d13e95a1f8af6f52d6bc4182059fb369a40151547639f` |
| `docs/ratified/provenance/apply_v130.py` | 31365 | `df943c41b0633a4f8c16ab30a1ccec6347447c310a7dc161daeb0b32a64ef01f` |
| `docs/ratified/provenance/apply_v131.py` | 20225 | `b46f3bb679484e87d404b9bcf26af85f6fe61686646960679d3ebd3c6fca8135` |
| `docs/ratified/provenance/apply_v132.py` | 22456 | `2e26f5a31ec02ecb6030b23f0b8b47673a4b3f332b9be7a15f48988d34e86608` |
| `docs/ratified/provenance/apply_v133.py` | 25114 | `1ae6cf212ea33085f174ff00f39221eb2b9b6632bef88dff59ebb0df0d1a5b1e` |
| `docs/ratified/provenance/apply_v134.py` | 28844 | `3b72c4757064a1d0dcaa64d4d7fba03b76e7a9cde0741fa468c660e3d75d199d` |
| `docs/ratified/provenance/apply_v135.py` | 21445 | `4b786707baa0697920069d1ae24735981ccb394f2c9cd77877a4de37a998f024` |
| `docs/ratified/provenance/split_v136.py` | 28701 | `89d64142b122e9eebb31e049a4cac4a1e3485cf8db79afd0c3b2e745380f7f15` |

## MISSING — awaiting owner copy

These three ratified documents were not in the bundle. They are referenced by the sheet and
belong in this directory; add each with its own bytes / sha256 row when the owner supplies it.

- `docs/ratified/EARNED-PRODUCT-DEFINITION-v2.2-RATIFIED.txt` (the spine)
- `docs/ratified/EARNED-EQUIPMENT-CAPTURE-RESEARCH-NOTE-v1.txt`
- `docs/ratified/EARNED-ENGINE-DELTA-ORACLE-v1.txt`

## Verifying

```bash
sha256sum docs/ratified/EARNED-RUNTIME-SHEET-v1.7.37.txt   # compare with the row above
```
