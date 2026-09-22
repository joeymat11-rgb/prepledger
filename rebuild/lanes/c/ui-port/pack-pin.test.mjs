/* PACK-PIN (S9 hunk H19; S9-RELEASE-SPEC.md C.5.1, PM-R6'(i)) - the WHOLE owner-approved
   design pack pinned by a literal, sorted (path, sha256) list read from the WORKING TREE.

   WHY THIS CELL EXISTS. After S9 the acceptance of every lane C look ticket IS the design
   gates being green (DECISIONS:536 (4)). A gate that judges a ticket must not be editable
   by the ticket it judges, so the gate code under quality/, its per-platform screen
   baselines and its state records are INSIDE this pin, not outside it. Today nothing in
   the tree notices a pack file moving: design.test.cjs:15-:20 compares each approved file
   to a constant in design.cjs and both sides are unsealed, and rebuild/m1/ appears nowhere
   in the S8 sealed inventory.

   WHAT IT READS. The working tree at run time, which on a GitHub runner is the
   actions/checkout tree of the branch being pushed. Never an object at a fixed commit: at
   a fixed commit the value can never change, the red rows below are unreachable by
   construction, and the commit the pack was measured at sits on an unmerged lane branch a
   runner does not fetch (R3 BLOCKING-F).

   WHAT IT HOLDS. The full list, one line per file, and not one composite sha256 over the
   whole serialisation. Holding the list is what lets a refusal NAME THE PATH (R3 N5).

   BOTH OPERATING SYSTEMS, as a requirement and not an aspiration (R4 N1.1, ADOPTED).
   Every path this cell emits or compares is pack-root-relative with FORWARD SLASHES on
   every OS, and every sort is by path BYTES (Buffer.compare), never the default string
   sort. The literal is generated from git, which spells paths with forward slashes; a walk
   that handed back the platform separator would mismatch every line on windows-latest.

   LINKS ARE NOT FOLLOWED (R4 N1.2, ADOPTED). Every entry is lstat'ed. Anything that is
   neither a regular file nor a plain directory refuses PACK-PIN NOT-A-REGULAR-FILE <path>,
   and is neither read nor descended into. That closes the one green-while-changed R4
   found: a tracked pack file replaced by a link to a copy of the same bytes reads green
   under readFileSync, which follows links, while git cat-file blob does not.

   AN UNREADABLE FILE IS THE SEVENTH REFUSAL (the PM's ruling on the author's Q2, taken in
   round 3 because from S9 the vocabulary is sealed bytes and a later addition costs a
   reseal child). R1 N3 measured the hole on the PC with a DENY ACE: readFileSync THREW, so
   the cell went loudly red with a message that was none of its refusals and the walk
   stopped before every later path. Now the walk refuses PACK-PIN UNREADABLE <path> AND
   CONTINUES, so a second defect further down is still named in the same run.

   TWO RESIDUALS THIS CELL DOES NOT CLOSE, NAMED HERE SO THEY ARE NOT DISCOVERED LATER.
   (a) A file inside a __pycache__ DIRECTORY inside the pack is invisible to this pin by
   construction, and python will import it if sys.path reaches it. A row below records that
   as a decision. Closing it would mean un-ignoring the caches a design machine really does
   leave behind, which is the worse trade. (b) An unreadable DIRECTORY still throws out of
   readdirSync: that is the LOUD RED the file case used to be, it is never a silent green,
   and closing it would mean a second optional reader for directories. Both are in the
   integrator list of S9-PREP-PACK-AUTHOR-REPORT.md.

   THE LITERAL IS EMPTY ON THIS BRANCH AND THE PACK IS NOT IN THIS CHECKOUT.
   rebuild/m1/approved-2026-09-18/ lives on the design lane's branches and has not merged,
   so the REAL ROW at the bottom FAILS BY NAME today. That is the point of it: it never
   skips and it never passes vacuously. Which of the two refusals it prints is measured in
   S9-PREP-PACK-AUTHOR-REPORT.md and stated at the row.

   On a case-sensitive system a case-only rename is already MISSING by lstat; the exact-spelling clause is held by rows on Windows only.

   Empty directories, hard links and NTFS streams are outside Git's byte inventory and C.5.1.

   NO OWNER DATA. Every fixture below is built by this file in a mkdtemp folder out of
   bytes it writes itself, and removed again. It reads no measurement of any kind. */

import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const conditionIsNotCancelled = (cond) =>
  /^\s*if:\s*\$\{\{\s*!cancelled\(\)\s*\}\}\s*$/.test(cond);

function assertConditionedRun(yml, file, label) {
  const owners = [];
  for (let nameAt = 0; nameAt < yml.length; nameAt += 1) {
    const named = /^(\s*)-\s+name:/.exec(yml[nameAt]);
    if (!named) continue;
    const stepIndent = named[1].length;
    let end = nameAt + 1;
    while (end < yml.length && (!yml[end].trim() || /^\s*#/.test(yml[end])
      || /^\s*/.exec(yml[end])[0].length > stepIndent)) end += 1;
    const block = yml.slice(nameAt, end);
    for (const line of block) {
      const run = /^(\s*)run:\s*node\s+--test\s+(.+?)\s*$/.exec(line);
      if (!run || run[1].length !== stepIndent + 2) continue;
      const files = run[2].split(/\s+/);
      if (files.includes(file)) owners.push({ block, runIndent: run[1].length, line });
    }
  }
  assert.equal(owners.length, 1, "expected exactly one node --test step for " + file);
  const { block, runIndent, line } = owners[0];
  assert.equal(/[*?]/.test(line), false,
    "the step globs instead of naming its files: " + line.trim());
  const continueKeys = block.filter((entry) => {
    const match = /^(\s*)(?:continue-on-error|"continue-on-error"|'continue-on-error')\s*:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(continueKeys.length, 0,
    "STEP-CONTINUE-ON-ERROR-FORBIDDEN " + label + ": "
    + continueKeys.map((entry) => entry.trim()).join(" / "));
  const conditions = block.filter((entry) => {
    const match = /^(\s*)if:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(conditions.length, 1,
    label + " must carry exactly one step-level `if:`: "
    + block.map((entry) => entry.trim()).join(" / "));
  assert.equal(conditionIsNotCancelled(conditions[0]), true,
    "the condition is not `not cancelled`: " + conditions[0].trim());
}

function decoyWorkflows(file) {
  const run = "        run: node --test " + file;
  return {
    control: ["      - name: target", "        if: ${{ !cancelled() }}", run],
    grouped: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        run: node --test synthetic-control.test.mjs " + file],
    siblingContinue: ["      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling", "      - name: target", "        if: ${{ !cancelled() }}", run],
    nestedContinue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        env:", "          continue-on-error: true", "        with:",
      "          continue-on-error: false", run],
    continueTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        continue-on-error: true", run],
    continueFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        continue-on-error: false", run],
    quotedDoubleTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      '        "continue-on-error": true', run],
    quotedDoubleFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      '        "continue-on-error": false', run],
    quotedSingleTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        'continue-on-error': true", run],
    quotedSingleFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        'continue-on-error': false", run],
    quotedIf: ["      - name: target", '        "if": ${{ !cancelled() }}', run],
    quotedSiblingContinue: ["      - name: sibling", '        "continue-on-error": true',
      "        run: echo sibling", "      - name: target", "        if: ${{ !cancelled() }}", run],
    quotedNestedContinue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        env:", '          "continue-on-error": true', "        with:",
      "          'continue-on-error': false", run],
    commentCutIndented: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "      # same step", "        continue-on-error: true"],
    commentCutColumn0: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "# same step", "        continue-on-error: true"],
    commentBoundaryIndented: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "      # divider", "      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling"],
    commentBoundaryColumn0: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "# divider", "      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling"],
    D: ["      - name: target", "        env:", "          if: ${{ !cancelled() }}", run],
    E: ["      - name: target", "        env:", "          if: ${{ !cancelled() }}",
      "        if: ${{ false }}", run],
    F: ["      - name: decoy", "        if: ${{ !cancelled() }}", "        run: echo " + file,
      "      - name: target", "        if: ${{ false }}", run],
    afterRun: ["      - name: target", run, "        env:", "          if: ${{ false }}",
      "        if: ${{ !cancelled() }}"],
    duplicateCondition: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        if: ${{ !cancelled() }}", run],
    duplicateRunner: ["      - name: first", "        if: ${{ !cancelled() }}", run,
      "      - name: second", "        if: ${{ false }}", run],
    siblingPath: ["      - name: target", "        if: ${{ !cancelled() }}",
      run + ".bak"],
  };
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../../..");

/* The owner-approved design of record, DECISIONS:530, pack tree 6d7710467408f69e61a2917c583540fc2336a3fa. */
const PACK_ROOT_REL = "rebuild/m1/approved-2026-09-18";
const PACK_ROOT_ABS = path.join(REPO_ROOT, ...PACK_ROOT_REL.split("/"));

/* THE LITERAL. One line per file, "<pack-root-relative path> <space> <64-hex sha256>",
   sorted by path BYTES ascending. */
const LITERAL = Object.freeze([
  "README.md 3bca3a954bd60cec565af1f992e83b5cbaed11a87cce5f928b726ce4307f4dff",
  "app/app.css bf4924e74fc4edc5cebf7fba6519613d9eec7f44397db990396fe402c124edc2",
  "app/app.html 4c6fc3c69aabb7fcdf34ce6b2f276141f1b649ae9284b15655747ed6d6073c84",
  "app/app.js 0f12d829d4bcd5fd207dbd51b64d7f822ffd8034c1c0d9616fa5e9ff2daefb2b",
  "app/assets/grain.png 878b291b3454fca2ec07ac2d9e2bc22fb1d06604c8209a03f066e9f9a17fb57e",
  "app/assets/mist.png 72de840ebed8524916c8ff28bf246bbcee4ffac9ab8c0e8ec53cf40ef7325bbd",
  "app/assets/plate-dawn-tall.jpg 3192f9b2d7dea8d1efda6bd37ab4c438b939c510a6c2d496fa269e5a4479bfb4",
  "app/assets/plate-dawn.jpg c82fda130cd156dbba9f5e4177c7ed0c74a975233fd604a27a76c73f9bf2a560",
  "app/assets/plate-ink-tall.jpg e4a05e29f4e12cd763897428da63466aa7ddaa1ddf7d84264c3d6d3f04dda93e",
  "app/assets/plate-ink.jpg 054eb668ee717f5dc84800f38f8bf0f6be0cee3a003c3276d39a71362e1a46c5",
  "app/compare.html 5b9135e2c7ccb9a9b45ce4e02d73117fc4ad068da6ef514426ff2265f43ad20d",
  "app/compare/overlay-dawn-coach.jpg 9b0a0b50db6580935d1af3bd4d09d3c3750cee71a7ebbfc38f668ee84f4068fa",
  "app/compare/overlay-dawn-today.jpg 58fc6b43ec74ad2dab9adbdf0b84898fb3bc736395220ef8279befdf0d072371",
  "app/compare/overlay-dawn-workout.jpg b513e669427658d74c01c42357d341b29271a43cda2aaccbea646c2d3fa8c4d3",
  "app/compare/overlay-ink-coach.jpg 6085ae8283d564ebb1b85a412b01f7dea6a5be8894fcc538f9b076551b5838c8",
  "app/compare/overlay-ink-today.jpg 0b150c0ae91a1b18d1ae6df607c7377cf01cc68bbe0775edb5ceb5a9fdeb7431",
  "app/compare/overlay-ink-workout.jpg 621ab7844fdd9ee989b873a5c65a3522155157ea870a83713334ee0fca210d95",
  "app/compare/side-dawn-coach.jpg 3f7f035d3b8169000175066dc0303cf3e5e08155b1024c7e30d3b4cec88efac5",
  "app/compare/side-dawn-today.jpg 343a516747987cd0f3b975ece8b5739dec3a192b768b3aad6564cc1e25c3fff7",
  "app/compare/side-dawn-workout.jpg 891c9c639223f6603312451457da2bf390ba50aa0c1c7a494eac53f380089dca",
  "app/compare/side-ink-coach.jpg e14e27c48a79f1869db00f6539f109af1e479d9d3760d97b3fa6c3999cc07d51",
  "app/compare/side-ink-today.jpg 816654599add983c8a16f7a313edfe6c647613c059bc6ccb72e69d2e07fabbd9",
  "app/compare/side-ink-workout.jpg 5fdfec3264ab3449a25949c3247c51bd3395a4eac844e96a19dec9975e21ea35",
  "app/compare/six-views.jpg 62707a9c1c09e466d2f286756eee2defc3acb4c8eb2b6e9a9023e81c724bed59",
  "app/compare/tint-dawn-coach.jpg ed64b4fecb50dd21168c3c4b8e8d2e855c8ec17df242bcdcf300d7d50fd57fae",
  "app/compare/tint-dawn-today.jpg ed7cd188619f3fcbcfcc542356147555997446b6fe2beae30c063fb3ac4abc09",
  "app/compare/tint-dawn-workout.jpg 784cec6527b80858da79d88027cdd5f3db357fe8ae0eefd2ec630565cd8f05af",
  "app/compare/tint-ink-coach.jpg 15909b59b59a80a0f003002ecad56299159ed367f40cb3da7aefc4ddf2c0c07b",
  "app/compare/tint-ink-today.jpg 82baf0242b832719da852691880356dd3e0a07772f8fc7d73a64e89ffbfa1760",
  "app/compare/tint-ink-workout.jpg 6f422f70d56276cb9dbee0c4d270a6ef9893f6fedb24d3c9516e739bde179ae3",
  "app/fonts/earned-sans.woff2 c04be0b43dc3911dd36a7cb7203c5ff6daa4f42522e2bc2e6fa3325a61c43d8b",
  "app/fonts/earned-serif.woff2 ff90213df9f50596c71ada04c34d2dee9327fe86526e713a9d49a7064b1db660",
  "app/page.html 49a360ee571f434ef0b85c4b85d63d5f9cae2eda5e7340012368f66c8a9cf4b2",
  "app/review.html c570da24e0b40dee0ef77d0d57d6ebe030e680ca18d9005a9588e0b8c863954c",
  "app/states-coach.css d33f62e0c54004063b5fe40720f220350d9311213bf80f13d49d260061ca0686",
  "app/states-coach.js 6aafa06d080f7fdceaeb4f011a9dd07ea84c012802cabf53ef4dea43a5762e8b",
  "app/states-index.js 9d3806125c9875ab3f835609fbb9296b1ce65d9d37a0ec487f027566dfe22474",
  "app/states-today.js 6f03c468f2bc62108f622f127ec0b5c81589522dea61261e94592151ddd28cbe",
  "app/states-workout.css 5d6e4082c88e9129979f764dc992e4cbb0439c3a9b2e0d625535c524d47a4f0a",
  "app/states-workout.js 20b597eef4d48ab1011490f99549b38672472d71144c9d179fa2c840dfe2a5be",
  "app/states.css eae53de1838338a76a416052a381494602c5fc9545c330afce2438a19a2ca219",
  "app/states.html 78e3be7cccbab014b5da233da3bed3a6f324e1f6bf1b6f9f5c8abd6e51bf6843",
  "app/states.js e299d044b5fbb3a20ca1eb8e8c808585dd92e3880b76530553e4be17a40441c9",
  "quality/STANDARD.md 37b90f4273f2710ff10ebeb8e1a536dc5eff07402854cd501962f69a6e3e5160",
  "quality/baseline/linux/ENV.txt c4bb05a2c2d9cf7ab9d6717e905aee809defe8056f6ad1b88c4702a2d4620ecb",
  "quality/baseline/linux/dawn-coach.png c40a1f0e8a67a9618849cc90f3d3cc14226eea0157136aa15d714765881a27f0",
  "quality/baseline/linux/dawn-today.png e5417552426859f2e2f5514aa160f33d69dfb049cdd3951a08a164a90236de31",
  "quality/baseline/linux/dawn-workout.png 925e0fd1dc3c9aae6591aacd5d4464731c1bc0bdbff85661460920c9cfde30cc",
  "quality/baseline/linux/ink-coach.png 0c9b741a7174042f8f04dd338c50933c4137f784d06fb2be275e4b5f17c5c425",
  "quality/baseline/linux/ink-today.png 32f52cfd814e23e2bc688861dba4c028dea3d277ba9f33f46037aab5ad101813",
  "quality/baseline/linux/ink-workout.png 7cd837db28d1403628599d495b6f49757cdbb44f985bd0a36e77b4b0dd83bcf3",
  "quality/baseline/states/C-02-dawn.json 105ddd9ea332102f46fb4c5cae95f5cb245b9f0231ec8ed579631cebc78f2d2a",
  "quality/baseline/states/C-02-ink.json 004052df9b07e765673db263be42353a26d2ec4c21ea03d89c6672c02024cec9",
  "quality/baseline/states/C-03-dawn.json ddb3a0585e77deb2d3521f364789a3f5a3c48e2b585639fcd92eaf074a53b74d",
  "quality/baseline/states/C-03-ink.json 492d05258ba6935de9fc8c05a798ef5488b912b6cbe664d19fc91b65c3a1b1c5",
  "quality/baseline/states/C-04-dawn.json 27233743da67f2cc53de90dc8afa54229d7307587e0069079c01420af4af7117",
  "quality/baseline/states/C-04-ink.json b75cf3a635c166d173f09fcb2e57033b037168b0cb9fadec91b9abad4aa69607",
  "quality/baseline/states/C-05-dawn.json e5cb4ec23755940dab5192fb93ef17bf6a7474d76e49cb42dce76f0d5eedd0d7",
  "quality/baseline/states/C-05-ink.json d29f6fa4b0cc9752d50bedde197e2fdec2f4eae3aea8573f6e526f61cad6e64d",
  "quality/baseline/states/C-06-dawn.json 1430a465b61471ffdc5418e7248a6f867279133cf3dd3c721e08e75b6c43ff2c",
  "quality/baseline/states/C-06-ink.json 85a2a2c1a5eb5008422d325ce43161cc8fdf6e7190591d60d282ee6eebbafadc",
  "quality/baseline/states/C-07-dawn.json 9bed7853dc7466d272e04a403e6d2fcc37097f459963b7690b287b0f3972f0d1",
  "quality/baseline/states/C-07-ink.json f619ae22c10f4ecf5acac0a754e7bcbad01cf6f57948d2c885cb0f61e8fc5251",
  "quality/baseline/states/C-08-dawn.json 7c8f618365c09b5c2e20f5b3871ba62a63728d3b87263edbb8521a0e3b580dde",
  "quality/baseline/states/C-08-ink.json 135202759671fbe2dc85761a6ff9ce5b941b4400750b2535919fb45dbf32fb4d",
  "quality/baseline/states/C-09-dawn.json 4b8d09148f817ff51909f2e2af554b741b3dc1221e8834e5404807f03fafd513",
  "quality/baseline/states/C-09-ink.json 21b59434999fe2b5fb476fda3eea559db1a4476c9b6fe3f251fda62bd1358084",
  "quality/baseline/states/C-10-dawn.json 4d3f826a8be8557d41c5280f95210875afb9198c6d67474ab8b51f3f193cc55a",
  "quality/baseline/states/C-10-ink.json 6f45bb57f5539aea214f90e9c3a0b448af5aa32b95155075bf3bfaf7b8091eea",
  "quality/baseline/states/C-11-dawn.json d8259c9c1b8a5bc5431dd8831ea46138d3cb5cc9d9f3a2b9caf90e3beb5409bd",
  "quality/baseline/states/C-11-ink.json 39bf5ae547dcf466feb68f2c2181ca9615f85044bb2015ed6149302093451f3f",
  "quality/baseline/states/C-12-dawn.json e19e0a711134298cba490faa728c426aaab6d0b78781a998569eb1f605d15aab",
  "quality/baseline/states/C-12-ink.json 90e51de2dc803afa56f9dc082a4a180833636caf0db75a60c7f8e0aabdb993b6",
  "quality/baseline/states/C-13-dawn.json 2a78dfa2c24591afbca007e8740f615a6fbc2418582b7a8263a5355c739a44a8",
  "quality/baseline/states/C-13-ink.json bf61afa9ab0d7035a69e743acd94735c703adbc66d7c80ac47cb40525b6fd8f4",
  "quality/baseline/states/C-14-dawn.json 68f0f28c523fc7b52f654ba024e14d634274d7984e5d75c253bb08ad048c0dc6",
  "quality/baseline/states/C-14-ink.json ae7c3a4c918465aa55f2a770d5a7691ff4b9da07cf0424cd3fcf225683432c2a",
  "quality/baseline/states/C-15-dawn.json ec1703b6bfe3bb287b7b7e114a05698a1ae891faf666ec90426693b1f60f5e2c",
  "quality/baseline/states/C-15-ink.json 27fb65c51edbbbbe4ef183bbab995dac77e71eca6c08bd51781b17c0b90910aa",
  "quality/baseline/states/C-16-dawn.json 9916ba9241e7425a8f14a316ba915f67adf84dc6897b094e5df9901bde4d28a5",
  "quality/baseline/states/C-16-ink.json 94f91c9a531bab975d858a9674ea365046727910080eaf771a5ee9100c892b1a",
  "quality/baseline/states/C-17-dawn.json 760433444f70293301fbad0e6fc52744e5420ec5c9d1a5d41d7a2f24960fe785",
  "quality/baseline/states/C-17-ink.json ac0ea1478d758befc07bf8bc3be7442bcd179eac51bb3d672ec382875a8e5c8b",
  "quality/baseline/states/C-18-dawn.json 7a5db5e8b1928b3b6e2ea286b765e77f89e0ffea923b5229abdc4543491494a3",
  "quality/baseline/states/C-18-ink.json 29d21b98b78f405dfc8220165c82894e1474a49388314de4f73c70ce0e25b080",
  "quality/baseline/states/C-19-dawn.json 0cc72595d0beb5e7f2ac5c7719f7a3f8ed5e74714207569bd4e9fcde75781513",
  "quality/baseline/states/C-19-ink.json 961968933c89d63a92002197b9bc257ff2333d64d61faf71d3000cfb5bb929b1",
  "quality/baseline/states/C-20-dawn.json edb691e4f28effd1db38c4b1cd90bf71882474768945c73ce03f1b73af2c2f0d",
  "quality/baseline/states/C-20-ink.json c66985913684849cf71c3246bb755163c09f88d009530b43370be4f7dfd4b55b",
  "quality/baseline/states/C-21-dawn.json 79417ac58907663f31a5046dd3ee841d54141a52afa45fab5675a2c88f0779ce",
  "quality/baseline/states/C-21-ink.json 47037d448dfaeee621d2902605cf0b54a4b23e078ceac4c6a23964ce9e16d398",
  "quality/baseline/states/C-22-dawn.json 3e8d126f4ca441fef663cc5e266eee6e186f5280dce98977c80e552133ca68f0",
  "quality/baseline/states/C-22-ink.json 219a170fdfa3d0715dbc75a548f90f40c50dac83439929e099b63907c5b3581c",
  "quality/baseline/states/C-23-dawn.json 254f9a3d2ba2a35da076b01478606d07f57045f54cccaf890df0f4e3037bd46a",
  "quality/baseline/states/C-23-ink.json d803766cfe470d3be8005ef6515a80d9d3f622e5a9dbf6c2e813ea6075bb1960",
  "quality/baseline/states/C-24-dawn.json ba5d2834a29aaf3ffa3207c782a5a820614d3196bfdd24aca156d74347e6b3ac",
  "quality/baseline/states/C-24-ink.json 3aa1d799c9703a3eb64fa08e5811f28594e4ff17b629c307f62c451d2aeab4a7",
  "quality/baseline/states/C-25-dawn.json 760f7ec9c52e58f09028d26998d38555333a3595c8efed71997ff999130a4f49",
  "quality/baseline/states/C-25-ink.json 5f805d94bcfb932b96acdd3649789e85353e866580652026fcb2460c83dc0cc2",
  "quality/baseline/states/C-26-dawn.json 936bba687cd174362a791e1999ebf73dcdaac1b15ffb9341f60f3ecc0331184f",
  "quality/baseline/states/C-26-ink.json 97c0abe114155e1bd993f463673816007f60d8540d2b2e430002b2a9975d8703",
  "quality/baseline/states/C-27-dawn.json 659401b36693cb5b5668308283e3ba9e85abe5fe8bd1cc707a372bce58b2bc9a",
  "quality/baseline/states/C-27-ink.json 9525588fc88a92a350706f40fd33b13047ff33a4591ca7bfd8e5cdd92f087b3f",
  "quality/baseline/states/C-28-dawn.json 9f64f4b9a869a4bdd1ffa6dae8858c1fc3e17abddf2d03280727448117fb91d8",
  "quality/baseline/states/C-28-ink.json c58a82fa654af33be78eb9adc03fe2906bf1dfcf807d00c88210ae6f334f2a55",
  "quality/baseline/states/C-29-dawn.json d91fa3910c4579404ebb2586b4ece87d9989ed5bf2fb0f491161dfa7e104a03b",
  "quality/baseline/states/C-29-ink.json 3b5b2f0fa39ba0421bb9c46bca9566d1c93ab2ae16b76897ccdd3f31de01fa5c",
  "quality/baseline/states/C-30-dawn.json efe14c6abb2114142b7a4f8a18ad0ec8b9bc683c1b6819cca2507281b54f870b",
  "quality/baseline/states/C-30-ink.json 7f1817c9d2b0327d2c1787403f615855b6b6fe9869678457365110aa8930eb5b",
  "quality/baseline/states/C-31-dawn.json 1980f2b7d1615ca4e8a134c4f2f7d2b7de02344a6f0e7e474d40935442a51284",
  "quality/baseline/states/C-31-ink.json 734063a39d1d998b2390031c8dd7317075e889195d62d7e808e7023da2534e93",
  "quality/baseline/states/C-32-dawn.json d3a362c5a0546b3246ce1727358618bce8ed8e873893de68739c38f1d048642d",
  "quality/baseline/states/C-32-ink.json 7ac91cacf2351a7e4fd60959b4e1f55a006e89022f2c3f1e0b89027420a54d20",
  "quality/baseline/states/C-33-dawn.json f518d32e2e40ff9ce75111ed617084aefcb5d413cac2f379bd5272d75f4e1abd",
  "quality/baseline/states/C-33-ink.json f8d8be70ef91b9adc4cb5e1b0237d5c43a42e91aa8ffa07ddccaf4c2e59d0ba4",
  "quality/baseline/states/C-34-dawn.json df2f985333d336d5ab13891201c88eb8edf1b96f5958bb82f3d1a6c101fceca8",
  "quality/baseline/states/C-34-ink.json ea60ed42f953e194d6ed1e2e3fab6113d67fc28489d52c12c83496c6692e1502",
  "quality/baseline/states/C-35-dawn.json 3117b37efedd02bb0db7f31f365caa671bb69ba2e09b7656e2b8686aaf6b5575",
  "quality/baseline/states/C-35-ink.json 9cab5ff46b0340b93887abb81def81a41b94b2e9a54364b926d7cac9bed136e4",
  "quality/baseline/states/C-36-dawn.json c24b00c19d4c6a4339f58c61541f8aa30b24da88c170f60eb08dc16fd2f128f4",
  "quality/baseline/states/C-36-ink.json 56783f29a804cedc4eed28958dd141c99398ca0d29cfa6db4dcbc94b2e6353cc",
  "quality/baseline/states/C-37-dawn.json 5e75c95e6276ffa0980167f355c8b89880fc18aa79a447bd818995b9de90ab05",
  "quality/baseline/states/C-37-ink.json 548b594cb174968aeba3b24a24b5700074a3f472948b4dad33b9cab44c174397",
  "quality/baseline/states/C-38-dawn.json baba27a42d0bd41c3d46bdc7923a14dea629813ddfa1db5f020785f17b75499b",
  "quality/baseline/states/C-38-ink.json 5e9fe30cecd1bdf09763a375284b447f9f0562e0d92abba58fba46adb2ccbb06",
  "quality/baseline/states/C-39-dawn.json 5a5ea2406769e3190ed78f61610970bb3c004b89e755af06a54043d39ea08149",
  "quality/baseline/states/C-39-ink.json 3b98d69046e6452f4af23fb65ea4e03a485392e00097902f9996882ae74af285",
  "quality/baseline/states/C-40-dawn.json ed9ad429b15446edb2ed14b898e83c8fc6e1dd3670cb469d95062a531e7eae4a",
  "quality/baseline/states/C-40-ink.json 6b34d994d09d20eef4459fec384c7e02e78401b6429e2364264bd46037a5b442",
  "quality/baseline/states/C-41-dawn.json 9e466a6445b6306cf68123dbb90a982b484f06224d83baeb5ac757396d88d9d9",
  "quality/baseline/states/C-41-ink.json b58f666a0c1fcd3ef6926e02d5c10efa7a6f6bcb5d83ba4eb8cd580cb1a6c5b3",
  "quality/baseline/states/C-42-dawn.json a6f21c520c607675b47abee5954b78772f6ec6df3dba43e9dac45e374f810740",
  "quality/baseline/states/C-42-ink.json 9760673321a63402ddfbd1961bdf005877a8811013e7be29656241765e4f00c3",
  "quality/baseline/states/C-43-dawn.json d5d1bd66577b436b73ae01f42bc0eb6d8b39cccc472067025557d889028c45c1",
  "quality/baseline/states/C-43-ink.json c6bf836824d7a1dc81af1e20be74a35270635fa11b1845d76aa1fc492a05d050",
  "quality/baseline/states/C-44-dawn.json 901c19ae1f6990183830d375e6d40fb081291388925866960190a59e5addd0ef",
  "quality/baseline/states/C-44-ink.json b74be663732f6b619760ac611c64d4fcc053444078773ae429b4280d8a3d6d6d",
  "quality/baseline/states/C-45-dawn.json f82d5f0f6aad123d98e4da2fb56e720f41b1ce46d1704e05abda6ee4ab9507f4",
  "quality/baseline/states/C-45-ink.json d0212765f2f8f2662efa538fd0e0d8f9d65e30e248f79196dd3c02294a27dcaa",
  "quality/baseline/states/C-46-dawn.json fa65330bc456b5d8a2b52ff4dcc409a9579a10f7b587af8ad32acd7c214af507",
  "quality/baseline/states/C-46-ink.json 5d922c12d3a267195236bdb98fb0544388ec1d5d680486f1a17f49dd4896c4f5",
  "quality/baseline/states/C-47-dawn.json a2e55fe17f8b5fa3a35b6c7413246cd86bb48ea90d2430fedbcfed0cc3f8dda1",
  "quality/baseline/states/C-47-ink.json af48447cf8644ebf322f0b5e53ed2c677447d575c31c0dbd6899f0a1a8dfec73",
  "quality/baseline/states/C-48-dawn.json 10c1f6803b7a5cbf24c28738be6bdf37a3af57ac091c6c0e3d49ecf340699bf8",
  "quality/baseline/states/C-48-ink.json 2139f4a8b4a3f22da8aadac6e3397a4681c3e22d1d7cbc2ee2b210deafae1467",
  "quality/baseline/states/C-49-dawn.json ffe232bcaa06acce2cc89a7a44c9778b329456804f069e5e687fb650faeeb9eb",
  "quality/baseline/states/C-49-ink.json d9a1b74dae89d4b7b99cfb03aae91af36950fa9af3c9822fc0dd4b0a65fe579e",
  "quality/baseline/states/C-50-dawn.json b0a41447c412196648b4a3c4029f8c5bc0ebe88ef7587e4cd7aefff01b0da9b9",
  "quality/baseline/states/C-50-ink.json e34c9d140eb3de46864adea6991208960b082ec303ff6f9d25dd6e617100c1df",
  "quality/baseline/states/C-50b-dawn.json 70013f3699ab502541d030d4a35d99824da62773e1f60d461ebd1354bfd32d39",
  "quality/baseline/states/C-50b-ink.json 279cd50010dd99e6da7fe06827c860b7a2b0ac082cbfd18782fea2841235d962",
  "quality/baseline/states/C-51-dawn.json 0c6f14e9ca184ba6ef430224c21d0cbe2611f143655969003f8f5cfe25d39469",
  "quality/baseline/states/C-51-ink.json 2ce8fbaf5bbf1a453692a42aa4985eb64cc381e4b195ee9c9561cca622c9db2a",
  "quality/baseline/states/C-52-dawn.json d06941bf857b4b3a68577d59de3ec632c8498d26f3e24045a6b4fbe53e30af6b",
  "quality/baseline/states/C-52-ink.json 715570b9f7b4192f097d6539142bc6042a565158e68f0a21e0a397a7a504923a",
  "quality/baseline/states/C-53-dawn.json 1418e240aa88e5f06a08608488eb66bf3f76eb787e9c1ae0bd6c4fc59757e588",
  "quality/baseline/states/C-53-ink.json 88d2fc2fbef0de4aeba20118faeaea50d90b123d678303b0c58638219e359425",
  "quality/baseline/states/C-54-dawn.json 9adf88896b45fd81e932f68732e0d915f42a231632a3b8d511f825b114710d80",
  "quality/baseline/states/C-54-ink.json d3521f241a7a820b46054f80deeca2b974a412ff04ca618d8909465e9e7825f8",
  "quality/baseline/states/C-55-dawn.json f9532cc5012fedeabca42f57f176ad144b56f82834f8030b856bf20f7fad1b7a",
  "quality/baseline/states/C-55-ink.json 34ac4a3ba73cb71a5688962a0d8a724e6b00a69f94f6ebe3dbfb54f13cce2742",
  "quality/baseline/states/C-56-dawn.json f3d585a0b47e0ee3c68010d406a7689cd7c109876065a231b95556b49c1ed326",
  "quality/baseline/states/C-56-ink.json e6fd174d9eae4d71f7f86a9cf8455f2730e0bf4ccd4d43d145b68f2b36fd5db9",
  "quality/baseline/states/C-57-dawn.json aebe86736a1e8305215729fbf31610bc868c32e6464a1b9f5e8025d3923b0099",
  "quality/baseline/states/C-57-ink.json 4a5ef1cf3bfde258f9aec6a5c32277014535bdc5aa65cf987528a08a31a1df02",
  "quality/baseline/states/C-58-dawn.json 8cef5d26607a9f9f73c0df66aec9bc6d4b58ffbee835bdfb37d2befbf3ced6cc",
  "quality/baseline/states/C-58-ink.json 556cc0815039dfadacb2ae985ed6d3c22819e1dcdeba002b02e0846a11eeba83",
  "quality/baseline/states/C-59-dawn.json a28ff9fe8e0d81854e30db38b31135fa847fb6a0cbaa329228c930fce9e03bd2",
  "quality/baseline/states/C-59-ink.json bba905732cafe05fdd0364084f02f2891845a22575fa6b3b23ef9063d583524b",
  "quality/baseline/states/C-60-dawn.json 98c7de5f11f91f5a9be88d5d8748852b7d7e40410edd47c38a0deda212b99788",
  "quality/baseline/states/C-60-ink.json 8d48419c356587498a2a719e84a25e9305fb8c3b3c88059c39cf6f107362979e",
  "quality/baseline/states/C-61-dawn.json a7dedca62c06705532968c8d572f3aa6b31096c290bf5e7b0294db0cab60f5db",
  "quality/baseline/states/C-61-ink.json 658f2e3ac84b916431e2ad070c2295f18b56316645dbb3bdfb85f36be3d6cbad",
  "quality/baseline/states/C-62-dawn.json 90d3711bf51d21fd7f8892a3c80648b8832b6f2b6ee8202d2781e1c9ff21b492",
  "quality/baseline/states/C-62-ink.json 8134636e2d8b44e80af46ca023e8777bcdd25e4a113d9d9c5b31dd89413fecee",
  "quality/baseline/states/C-63-dawn.json c012aec8d0c4b76f342e6be384bde87873d5284ca5d9bedafb090b1f35980057",
  "quality/baseline/states/C-63-ink.json 85b7f053799acc93a834dbbdd4ff81982a49722ad4098762c0b56dce2086c5b6",
  "quality/baseline/states/C-64-dawn.json 3a680466424baf6215a3ce47057d80403eece538a63f31911ddcae2481ec43a4",
  "quality/baseline/states/C-64-ink.json 25cef7cd3948cf1663940b2c11170ed1357b819a3fa55e8364124cf09e44ee23",
  "quality/baseline/states/C-65-dawn.json 7c0fdf29dbbddcc2510bfac623945f3edabfc96704ce2ac174f4d60991d95035",
  "quality/baseline/states/C-65-ink.json 32fc1dcf62312a457297056a15be041a377636ff52c7105870101c47a1771621",
  "quality/baseline/states/INDEX.json 1a68c1c3a22efd7980ad8f3cbad322765176f6c2e73012679612244f3923b837",
  "quality/baseline/states/T-02-dawn.json abb757d56722014af1c1773c1f6822e4404c25e0ca210f452e1375768f98f95e",
  "quality/baseline/states/T-02-ink.json 1d73c9c513de714661b162a7ebe76a9a50ff85a1974d12e4d0bfcdcca1788374",
  "quality/baseline/states/T-03-dawn.json 61d7e919990df8330ac33231d4a52136c9d37a60dd41ee9586dcefad32566123",
  "quality/baseline/states/T-03-ink.json 7dc557aec6dc195ecdcbd0e0a8dc03ed7fe366e954cf6ee40bd82c541cb9dafc",
  "quality/baseline/states/T-04-dawn.json 28ea7210db7e3cacbc42065eb32b0c7664330b792db4562f5abe7bbeb8de9c60",
  "quality/baseline/states/T-04-ink.json ea18f95ef4c93a2aa0753bf33c64672250aeffdcc83f6fc1e870f400afe4ccc7",
  "quality/baseline/states/T-05-dawn.json 3cf439ecb6ccb2fd4e70f8f47ccf583e9ad6acc69d63d5384abe9e8fdb4d390d",
  "quality/baseline/states/T-05-ink.json 031311ce7f02ecd39c4777babbfa5bb9ecd2429649f1adf70bea4f73275d9ab5",
  "quality/baseline/states/T-06-dawn.json cadef32fb1934fec134e158e96f88369a06b4c2e1ba4ee0b65f65ae25a957d6a",
  "quality/baseline/states/T-06-ink.json 82d9e11f5bad92a7f9c5ff07ef5cac4911b13b77b70b9e4485e8383ac958675b",
  "quality/baseline/states/T-07-dawn.json 54cc705426f5340306226afb91ebf92947eb0b789b41fd99a720b4f368bcdfd8",
  "quality/baseline/states/T-07-ink.json d846817f95779f90819790995f3c7e901a844d9356b48b627e8d7ac3c77bed22",
  "quality/baseline/states/T-08-dawn.json 1bebf4d5da08c9127465e621800f0e6ddc54b82dd5f1cf783d4ac97b498ca704",
  "quality/baseline/states/T-08-ink.json baa59c82536f7e276af4dea6f803395fb964144db3b3db86ea78d78beea75f88",
  "quality/baseline/states/T-09-dawn.json e790637206cb9d664def282e6eb46797ff5375e0a24b2b0e9b5d5e796023f33c",
  "quality/baseline/states/T-09-ink.json 448d99cd739dd60ab6897b4c8ba93adab2eebbadded676e7b2c97540b8f45b3a",
  "quality/baseline/states/T-10-dawn.json e90492e9f911515b0971feeb3af3dd363d6978f3c4c7e594752b03431c4a2778",
  "quality/baseline/states/T-10-ink.json e7dd7b7f1d20f8203b935bd7083badeceafa3a3f2356f6ddf5170ee795493c14",
  "quality/baseline/states/T-11-dawn.json 7ce9118f6507adfcbe528b015b340edd4c9146383b0bd20e83bad167e87971ca",
  "quality/baseline/states/T-11-ink.json 48c76b4998d0d4a0ca7294730273de37579af84858d1264b85dfeaa214bf72df",
  "quality/baseline/states/T-12-dawn.json 8789fb19a2deca7ed9990b57390ecfbb6f722f46a6b710a8ead73dfaa4eba105",
  "quality/baseline/states/T-12-ink.json 78e41d354319cb6b12f7dcbd9ea72aff4727df8bfb14e8ecf1550c208ddafdcb",
  "quality/baseline/states/T-13-dawn.json 97c32c4786f8ddf318fba7fc6e52d6b94e20ec88c616db3e0f2215a0829104cd",
  "quality/baseline/states/T-13-ink.json 47b9e0b97f51bc7236a86e678027829ead623002a542e4ec13c44ad944ee4c03",
  "quality/baseline/states/T-14-dawn.json 45ebaebd275344a3ca57944c0720b61ca4545d656820e28540389f7110c3b667",
  "quality/baseline/states/T-14-ink.json 0018de99cd7b3d79258f82b98a15adcdda71623dba7b6309567a80aa3a118910",
  "quality/baseline/states/T-15-dawn.json cba44c43b34495d7224c825f4241cd9a5a6a00cc772c2e208caa6fabb6dda014",
  "quality/baseline/states/T-15-ink.json 10adb8ac656313a92f0b35c869e07709334d15cc1e52c95a625ebaa812880a21",
  "quality/baseline/states/T-16-dawn.json 10648cc2a53476b79761b7778c20111f949013d5671e629d2b3e3439c5bea199",
  "quality/baseline/states/T-16-ink.json f06a00001c2b3983f7ba23844c74e7334dd70fff1d584282377a6e1dab6cbdbf",
  "quality/baseline/states/T-17-dawn.json 7d6d73954776b3fca35be2b8d02fa450c53fdd2414b23c9e8a736c8ddd8a73f8",
  "quality/baseline/states/T-17-ink.json e7c88e4d75459b3fd78e5f2f320b872564e4876285d40f512c32956c6aa82a14",
  "quality/baseline/states/T-18-dawn.json 50ef167e263e1c97dd4176d15ecce3735e8c43da6a18565cea673d795ecbde9f",
  "quality/baseline/states/T-18-ink.json 0c485adc615885cbcf6eebaf6278edc91765fe742bd7f09f3a6a9524e64e9c05",
  "quality/baseline/states/T-19-dawn.json 864ede9510096abab30b520baf94b5c5b811046bb50b93621936f41a4adb421b",
  "quality/baseline/states/T-19-ink.json b8a41a5961ea41ce43b818d4a8e354e888f897032a54478b3300fa579dc80953",
  "quality/baseline/states/T-20-dawn.json 0ddcfbe55ce6b710d46d5e78e8e38c5150b70d2ee168c4aa383f229b7f6e8244",
  "quality/baseline/states/T-20-ink.json a84f5a69519218334f4f42b94bd4fd54fea8b17545a0deb746d544ade4dafca0",
  "quality/baseline/states/T-21-dawn.json 35883c705ccdad4e21a81b4f9cbdec42775d2738876e4b22455ffa7cee3a1507",
  "quality/baseline/states/T-21-ink.json 69062e78be2bdb78432a1928221e38b3a5166e20837cbd0acc4c4bda0e8c6d78",
  "quality/baseline/states/T-22-dawn.json 2d585aa19d869d2fe59f6c39cbafd09be76b1075454c0290dfe6ad4785e561e0",
  "quality/baseline/states/T-22-ink.json f2589064f62de47add7f7ac59fc595916ec66d853caaef3963aecf7cc1166859",
  "quality/baseline/states/T-23-dawn.json ce8e91e07a1e810ce01c3aa6939227ffe98e76bb09e6db77df8e1d4f39f20b08",
  "quality/baseline/states/T-23-ink.json f25359071006a5da94a62e89b7d3974258eae9bbcc06e15a8adb7934d0d32538",
  "quality/baseline/states/T-24-dawn.json 738f1b17a70399f3e804ddff360ba15fb26a6d7ae9d94b0da2fc8c3635077c9a",
  "quality/baseline/states/T-24-ink.json d9036e2878433ff95e035a4118210c32d83d787cf555a418ffd4deec4e5194c2",
  "quality/baseline/states/T-25-dawn.json a123283958ca12cd94b7894361101904bcefd516d6e21754cf252a224b97a48f",
  "quality/baseline/states/T-25-ink.json 54df916d98632932e84b448f988b1b88bcf97778c8bd4908f75a859fc300cdc3",
  "quality/baseline/states/T-26-dawn.json 11be4bace02911d5014a8a666c6e24acfd0d49d6c25b1192583ce33b0ad81f81",
  "quality/baseline/states/T-26-ink.json d4dff8af4a635bde2e7d14b1f5ceabc7f16376fbe23ef411a60363a0803062a5",
  "quality/baseline/states/T-27-dawn.json 38d22e51cd843c8f02b288afa57175c034047c0ecc9becb1feb52a61420c8566",
  "quality/baseline/states/T-27-ink.json 9c555e79a857c2c9800a08212f41e23fc960696ccb90688b99d4f741e2e20b0a",
  "quality/baseline/states/T-28-dawn.json 860321d6c5dcfb48ba49d915d4cb5c61cb73a6387463e6332db5933ed98bcf6b",
  "quality/baseline/states/T-28-ink.json 352b2bb518af81699f2692919745d49fb8c66a53e31ba3a229f07c13c7ea1e81",
  "quality/baseline/states/T-29-dawn.json c9c5b9b6e4dbf1da82d550e8171dc8d0fd294636857ad93d846ca9abe94e1123",
  "quality/baseline/states/T-29-ink.json a4cd6472b5970d5236f653f468f7d651411f46875e04584e93915491328b63ad",
  "quality/baseline/states/T-30-dawn.json 04970d4cb1e12f7dc28cf9b780d5bc553e903b476e6b61dca96aefa1fdf6d018",
  "quality/baseline/states/T-30-ink.json 68eecc36fbb951ef59ca6512f923999b24615f43ba4a7186a51c80ca76aeb9b3",
  "quality/baseline/states/T-31-dawn.json 02a65286d88aeccdd1651d02ba167e79dd3f245cf37ba7b76354a850a9452711",
  "quality/baseline/states/T-31-ink.json 3322a8c4d5759a1c6a4e5f072d3123c84c87b203668bd3692fcbc1640fc9fb9f",
  "quality/baseline/states/T-32-dawn.json d67e590593bb55123896799a613de9a843ae3f927bce9884150adfbabdb1dc3b",
  "quality/baseline/states/T-32-ink.json 982690089358d4db67c2198feb47149c681afe2dbea1949fd10fde5dd2c3f397",
  "quality/baseline/states/T-33-dawn.json ce9c12ea9f0053baa962f543102dd4c26241731c3997752cab7c6426e7fd74fd",
  "quality/baseline/states/T-33-ink.json 64114e4fa91334eaccc7051b892f3be5bedc94a065704b362348de26b5f97641",
  "quality/baseline/states/T-36-dawn.json 6b60d025b9f637e5e0206d85b62a2a7bb5d3690eedb1a07e0cd8a926272928fc",
  "quality/baseline/states/T-36-ink.json f7f2530d0204c5ca391d004e6acb2a4a6dd20957fbbe52a7d3774d0aa4f63343",
  "quality/baseline/states/T-37-dawn.json 3f402c5fd8188260dc4ea2cec596b57eb679015fde1e7d0fad748c7415d7c662",
  "quality/baseline/states/T-37-ink.json 826efa8427efcd52d1d8de53b777c066925e8c469da8b7b849d113ffea41b8fe",
  "quality/baseline/states/T-38-dawn.json e068f97b2c596f3208209a8bbc15bd71a13a9ea62a2d07468e94ff67dedc5c42",
  "quality/baseline/states/T-38-ink.json b44c239984dcd0985cc4cf2b47540fa80d4862e4bdd4fe9c4a4627b3f0ef3bca",
  "quality/baseline/states/T-39-dawn.json ebd8ac25db919dbd51ef5a4ed24b78bb4c265bb68295ab22b08d50959c223680",
  "quality/baseline/states/T-39-ink.json 6349293819d3104ed3e810f8858105eb951d616752dd78275e8db34c60b06b67",
  "quality/baseline/states/T-40-dawn.json 8830171e310392d0f12dbc8337645a60719f538d7a458aeb0c074a08f5b21633",
  "quality/baseline/states/T-40-ink.json 722e9899c5f6fce58689c59a5b18324a677e72dfb99aa3667b0fcef02bc67669",
  "quality/baseline/states/T-40b-dawn.json a01006a6a3969ee3ab19e97fb88dfa4110d8ab7010139512b08db3dcf105f0ac",
  "quality/baseline/states/T-40b-ink.json 45f3b2e85829fbfb10e056cfd706ef5d3cb47f0a42771213b6c863deda5118c1",
  "quality/baseline/states/T-40c-dawn.json 81a27632b893878b5f2964d721f5dfa57c497cf31dd4b59a49068d58f2f6e495",
  "quality/baseline/states/T-40c-ink.json deea72440e20a64a35e7a3acc555ee67be081453c961da777483e40593ef07f3",
  "quality/baseline/states/T-40d-dawn.json 9879fb2115957ed3c25fa29464ec112bc4649848c1b64c5e49c5b45d369fc42e",
  "quality/baseline/states/T-40d-ink.json 61687144a56f51318e9328e8b5c2d8237bb4ba419f6f34303f4c126bb71bea3e",
  "quality/baseline/states/T-40e-dawn.json 9271c7b3896c4bb818d6204c9bd4f718a83f979cbdf07127370db1ea9ad53d01",
  "quality/baseline/states/T-40e-ink.json 2ec2495802eb1617dc9f4e51951056908292193ca710c5691e51528fd196e32a",
  "quality/baseline/states/T-40f-dawn.json b670a9a7819e7b09b79b8417661c47e4979e786498252cadf3922f3eff90c5b8",
  "quality/baseline/states/T-40f-ink.json 3702d207e9e0856a264a2ee48496e4be89412baa9111c2ba5628665a538c70b0",
  "quality/baseline/states/T-40g-dawn.json 04dd143622495e4e7dc3d379dffc979ab647002b1e335c272089465abb9b6731",
  "quality/baseline/states/T-40g-ink.json 024a5f59549210590e61d489c45fe2fc9ac80529d0d98f546bf6e9ba2cca4c7e",
  "quality/baseline/states/T-40h-dawn.json bc8a39bcd9c1361a411b0408d44c568ab962b462ff3353f61e8b17d9722a6254",
  "quality/baseline/states/T-40h-ink.json d5d297a4047e1787c536bae946e71e21474462ec9dd0c7215f2874ceecce89b1",
  "quality/baseline/states/T-41-dawn.json 93983ae19a6e9769700820da65d2ad700472c528ca7c1517ccb1485d74d27871",
  "quality/baseline/states/T-41-ink.json 7d747f3d0fb23e327debc8f7f59d7c516f89d71ed443cec4e02fa0ebf105a89d",
  "quality/baseline/states/T-42-dawn.json 6f5fccc1e559462a7f213ce1e51a09a3c3692a8d6b40a3edc3dedd60505841dd",
  "quality/baseline/states/T-42-ink.json 13db0960f5020d382e33cf62af48e967915ede5560209afdb301cd710dbbed1e",
  "quality/baseline/states/T-43-dawn.json a61765fb987c58448080c9003fe1cc128c31c83e015a15fc3e6d37eafa38146d",
  "quality/baseline/states/T-43-ink.json fe7e55f3362cd944d5cd777219170158c2bafdc9a03a841fed5300cd1af820fc",
  "quality/baseline/states/T-44-dawn.json 1cd5bcc4b7accddaf534a6604c13458972626364633c6c8b9d2fa74562ff5551",
  "quality/baseline/states/T-44-ink.json db633f283c730a8001a1381597bb82f96d680906b9aa7d3221d439f831b92929",
  "quality/baseline/states/T-45-dawn.json 62dddc7d2614daf039762c7cc180d2f9ca4c10693b7804cc9b00fd46a329b143",
  "quality/baseline/states/T-45-ink.json e75fd4011cde4ecd459bb9a20b14cb307222fb7e04b96882cec5390c3a6f813e",
  "quality/baseline/states/T-46-dawn.json f5553906c3e5e5dba9b1cdccaacf3bc15fe68126d5b47e3444d4a8a760ef676f",
  "quality/baseline/states/T-46-ink.json 9886f3a7c8cb028572acae703a53ef88353155d84e6ccdbd4c90c360d338ba84",
  "quality/baseline/states/T-47-dawn.json cec920fca5370e9304404669e6142189a95447e2a2685575e0c89f1c391ad89e",
  "quality/baseline/states/T-47-ink.json c82d54fb69d13edeecc80276990ac356ee0164615c8b63dd55fd01f9e3af89cb",
  "quality/baseline/states/T-48-dawn.json 5d097632007708c74813df74c3f6abf3a40640ed28de1a5f81f61f927abed241",
  "quality/baseline/states/T-48-ink.json 29e43888f1c478d9d394e8929cfda0b8e79db773480db1be16fc2f03ccb7c401",
  "quality/baseline/states/T-49-dawn.json 03f1433dfd6357723ec8033d0ed7d38e7624ced497d15d084173c41966d4d57b",
  "quality/baseline/states/T-49-ink.json c86d4b73c267a52aaea4df6c4927d47da0a2137f91d75c9d715321d1247a746e",
  "quality/baseline/states/T-50-dawn.json 77587f59ff56e245b260111ef56e9e375abccf7b188c581eff3bb29a8f0c3bd9",
  "quality/baseline/states/T-50-ink.json 7d0a05cf211c5f74da75f659ffa02ffa3db04d9b2686582b0eac35436df38990",
  "quality/baseline/states/T-51-dawn.json 1ed83fa8f70540958a0eb7b6504b7672ec010135f7fd02c7add89f498df5739d",
  "quality/baseline/states/T-51-ink.json 1024932fdb1ccab3d579d088e3793a9ef46c707b3ca05ba92b2597aac33de281",
  "quality/baseline/states/T-52-dawn.json 58d844507467436ca06bde06e5ead2b0000d4ba0fbfecbb3a3362e7870bb8ddf",
  "quality/baseline/states/T-52-ink.json c26a3d6a9664c1141bbed324b592c31ba11d379803f4387451d650b51e712095",
  "quality/baseline/states/T-53-dawn.json 783b697b73def6461fbcec3a901213dc05f1bfb289e396ea69b9b85aafdbccfd",
  "quality/baseline/states/T-53-ink.json 419905dc0e54779e876c7b294bf25772fca26548efc3d3d7dd6862e4eba6491e",
  "quality/baseline/states/T-54-dawn.json d8da746c630fc3ce6552658089c29bccfbf9fc9d96420370630537cfb0ab7dca",
  "quality/baseline/states/T-54-ink.json fdaabf460176c7ab347db83680a930b59dc7d41242c4707de7556677f4b8b194",
  "quality/baseline/states/T-55-dawn.json 0f0508a1550d4194f14016c3a13877762ea3ef0c6fda123a9e91b99b97de47c6",
  "quality/baseline/states/T-55-ink.json 238c5c440c6571f7de08777e62659e07df122977da152646977b7046bc5b9a52",
  "quality/baseline/states/T-56-dawn.json 283158fdd3d1665e850bdb674983af8dc6caba5ba00bf638ae48e1597fbdd6ee",
  "quality/baseline/states/T-56-ink.json fc4cf7af818e621580749823c2ec1f8364589572261ca6e15ce3cb26a200715b",
  "quality/baseline/states/T-57-dawn.json 7fdcd4ac330ec2018a7d07694c4324d53a3224c31b963d3f1ef8645c63e314c4",
  "quality/baseline/states/T-57-ink.json 3fd36b3ff4bc8d5868895f96be7baa5480ce432ebe6821329229293685b3d4cf",
  "quality/baseline/states/T-58-dawn.json 673b3357c4389697f967004f6f67d34481690eec9c88f77a40ba0afee5335aae",
  "quality/baseline/states/T-58-ink.json e32c84e128dd03d35f7b260792d76f33863abf9f3d9e20f86da6bd0f38d286e6",
  "quality/baseline/states/T-59-dawn.json 4987d0ec10f4896caed33bb61ca585a47186be34fa186db45df5c05e61258700",
  "quality/baseline/states/T-59-ink.json d4ecc1740a36e5fbb230651d58b0c3b82d8165944c3a8823346abc30b49e77fe",
  "quality/baseline/states/T-60-dawn.json 79e8b2c3ec31adc9619f55878cd19115ea9fac5f7517f92b923f3972d574625d",
  "quality/baseline/states/T-60-ink.json e54189db39010176beb492c07076c5b058428f03f5bb2089804e905fa37eb097",
  "quality/baseline/states/T-61-dawn.json 371fe6cd276b0c497e18a59dbdc2df57c744ffb408a44a12882e90b99dd270cd",
  "quality/baseline/states/T-61-ink.json 43b38c3a4380e4c426a150b9a0453e199809018610cdaca546d4c2ed9a55bfa7",
  "quality/baseline/states/T-62-dawn.json fdd484aac7eddb9d6df63896a94ec18c33e7b96d362126948c89e9849cdda257",
  "quality/baseline/states/T-62-ink.json c74a16d3ae61f37b3368ef57e203d673d7475132505b3b064b676b50b9e0b06d",
  "quality/baseline/states/T-63-dawn.json b80551feae6c7881154bb7ca0fd15a5a888ea082a7216370211313896ef24497",
  "quality/baseline/states/T-63-ink.json 596184c166e95671f42994c84dcb37efa32f77e8b5c1c719425e4ba694556d44",
  "quality/baseline/states/T-64-dawn.json ae90e05741ce95d5331f3e5d5aabc09c8c6eb112124d87909b79727993f5ff3a",
  "quality/baseline/states/T-64-ink.json 8a2d55c4f0db51a9784dd1ba464d7c08563fb7a7feec486d2e0e830e9ad93c07",
  "quality/baseline/states/T-65-dawn.json 8ddd097469f90948cd8648a78059a09c2030792392cc3c90e34781f4d5602926",
  "quality/baseline/states/T-65-ink.json 90127d9ae62b830105c2b08efb9b0309d342540dac8d9dd8522c2228415e2441",
  "quality/baseline/states/T-66-dawn.json 778357461423cc7178b15ca2533cec9ae8e43dc9c39243b6a5b0f58e8dbc8940",
  "quality/baseline/states/T-66-ink.json a1a990a608f528a45fcacca7be2766e56311f12ec938730cbd7da907e7302434",
  "quality/baseline/states/T-67-dawn.json 025374b9c371cd94303f0e15267e6bbf485ed90464d8774ea730cafab894c379",
  "quality/baseline/states/T-67-ink.json 0d010725fad842b3113c39b7d41b4ad8c4264da7a615bed14a0821d8dfb8a663",
  "quality/baseline/states/T-68-dawn.json 0c51cdce9377705a1617b1fc870cae646fbfa0b41108ecfd15c0b8b4a0d511b0",
  "quality/baseline/states/T-68-ink.json 2ebfa287246ac75f6f120c8af38a025ec5e86add827fb53cb126d4de52df9e58",
  "quality/baseline/states/T-69-dawn.json d50bbf7afe4eb044c6baa6f254cdad5017617e6a1b011c2e6d7750d58dfe3e36",
  "quality/baseline/states/T-69-ink.json 1b0f0af506b00c4f8685287a0722bda0fbf4f106f5a9bbde8ca810c5abdd3ad9",
  "quality/baseline/states/T-70-dawn.json 64da307324d93725591159221bfde36b32ba74b560ce6c177e09ca143e40dd5d",
  "quality/baseline/states/T-70-ink.json bb5905fa805efde343ab27b4f1530aabdaddeba56cc9230934e7d84ed09f0039",
  "quality/baseline/states/T-71-dawn.json 51ef283d1981b4b5b2ed895d629f27301513c81b3716555bb8060cf5f734d406",
  "quality/baseline/states/T-71-ink.json f91841bed76958b2e8c0e0116027b54b1743cfb0d95cc18ce7e220c614fa4cf2",
  "quality/baseline/states/T-72-dawn.json 96e22ff53f9fe1cfdcdc6bf7b67c1046416c4013597b13e1302cb89212940e63",
  "quality/baseline/states/T-72-ink.json 83bf5cc25247b06a98928b8a094420a13fcc1030eb130e2ec06066f12cc93280",
  "quality/baseline/states/T-73-dawn.json e916e03d6544308ce690da4b644dfc1d5bc5331bea41fa8e7477e5b161ad117b",
  "quality/baseline/states/T-73-ink.json af2cda570677fa979dc322835330dee1ec233ecb885e59121a213a69c805611d",
  "quality/baseline/states/T-74-dawn.json 89fab8b0a85530d3d85229f51c14cdf39f0ad48b7fdd7e7d739b6ae05aa52661",
  "quality/baseline/states/T-74-ink.json d091db922476c1f28e3dc5e100d5b7b0ea93ad597dc2bb1b6661cc87f9fac8d6",
  "quality/baseline/states/T-75-dawn.json a982591168203f0f897000cc6870b894204f26bea0673bc51f5bf644d48527a2",
  "quality/baseline/states/T-75-ink.json cf5d6593f7d3bbcdfcef9f9c3f7390b36a2e4323e08a071889ba43bf467a7f38",
  "quality/baseline/states/T-76-dawn.json 608b40682bbc8931890e4c6868e6cc91666665f6c58531e97cfa6f0b9b9e08fe",
  "quality/baseline/states/T-76-ink.json 9a973210334a0c2c5cace266dddc8d2d6fe58affb753053588676c46026a37de",
  "quality/baseline/states/T-77-dawn.json 508adf39c0c0e8b4252183948fefcfbfbca30a8f06649ebe862b19fcd243c1cf",
  "quality/baseline/states/T-77-ink.json 0ebe0a8ecb46a1fc3a37c98a60036acaa30cf48937ab7c0bae436c48c9441407",
  "quality/baseline/states/T-78-dawn.json ee832fd976d1436427d7c5a735bd1647cfb965c5ee4491dd23462a709c02d8d0",
  "quality/baseline/states/T-78-ink.json e110f056dc89a958874f8004fe08bae1a0265ec3a7c4302168f9c861201250cf",
  "quality/baseline/states/T-79-dawn.json dec52fa11145395e4632c7312d1542ea5aa33e3d3c88e78b2271c3504128db26",
  "quality/baseline/states/T-79-ink.json c5bd5a70bac837873782d15d2cfa094bafbefe94c5a48e846d491580db02427c",
  "quality/baseline/states/T-80-dawn.json 7342b20001b2cf07cef020a0f38c6c64ec70c1e5e3b67fc29d0f48c88ce0bfe2",
  "quality/baseline/states/T-80-ink.json dc1d06ff5d392fe73f7ac91cd8ea89f2b0a098d69728ce79a853e988f3458d6b",
  "quality/baseline/states/T-81-dawn.json 3d190fd7ce8cffa55cb8fc626f0e0d96583fe3d7c0a3ce4a2d46ed34e47cb447",
  "quality/baseline/states/T-81-ink.json e2871b39c4c0daf057b9caf1e07e779340e55b434467e556356e03bb741b0e57",
  "quality/baseline/states/T-82-dawn.json f797b2060b457e193661ca5b6dfbeba7fecd6e0dd8d385106ef51f43b9a67d28",
  "quality/baseline/states/T-82-ink.json 7247943da13047e45f9a0e240839960d551677eae708c19df2b6bc56f63fa642",
  "quality/baseline/states/T-83-dawn.json 0a9d9ba317efd249479e6b8e56611e9db159a1d11343ce9cb6a98623730e61e5",
  "quality/baseline/states/T-83-ink.json e473ba8afb2a9cdad97d0adb5837b42c0928a1d7810d60011477d2f30265211f",
  "quality/baseline/states/T-84-dawn.json 0c6e52696b0e5f533a27fcce52006db1dd988e0620f154f8b8199c6859fc57c2",
  "quality/baseline/states/T-84-ink.json aee56aa94c91d7f1158a40013b71ccf121ee30bb56a3171b934823707ea3dff2",
  "quality/baseline/states/T-85-dawn.json 2c6f3f399cb98d13764fd8cf5bc354b2ca73c79262fcc5a184d797d0ea772aba",
  "quality/baseline/states/T-85-ink.json b1df4ce5aab598bd436e989c947f7f7e5dedc1d631c36eecc93642208e723a1c",
  "quality/baseline/states/T-86-dawn.json f4ecff1058986266713414f05a393068a1a65a4db2aac51c4d872b2da6636538",
  "quality/baseline/states/T-86-ink.json 710ffd7ff23b8bdc63f354af37b3969982555a176fd030d1b492a793fd8ee131",
  "quality/baseline/states/T-87-dawn.json 883acd00bbd49d8729a9ce421f3b9d3f436800f27b2b755ddcbde0e10c2728e4",
  "quality/baseline/states/T-87-ink.json 03ddc714899269ff1eda6c3c24347c2018aa617e912a097af9192eeece1bb1f4",
  "quality/baseline/states/T-88-dawn.json ed8a8511a4380c81eb50722fb72256558034fb25c4bb6b3f3dba2cdc74f395da",
  "quality/baseline/states/T-88-ink.json 34118f9db1e17b547b1c2323d0eb823e47bd97d8f7fbf848763892cd306cc9fa",
  "quality/baseline/states/T-89-dawn.json cc0da77c31630c6cc664dede3a5e1f7732857bd510c165b3c8af9b8cfd200bec",
  "quality/baseline/states/T-89-ink.json 075360a526df41baf7c6c6c821a60303e6b0cfbb1cf4b046cc209efb66d9b4e9",
  "quality/baseline/states/T-90-dawn.json 0ff942ae3f605e63238cfcbb1c35b2cc95ed2b936388a679a66113a9fecf5603",
  "quality/baseline/states/T-90-ink.json 5eb3d5a1338be1e5f6b04837da77fff2979cf5706cba00a16beb1428f82046b6",
  "quality/baseline/states/T-91-dawn.json dac9e602c9b561bb9e74fac969249ad80d404c254fad1bf4a7e92f673e5122d1",
  "quality/baseline/states/T-91-ink.json dc6e1bd4cdc67ede693288fcf2a4cf2f1b48fc43771062d708755df154f03d2a",
  "quality/baseline/states/T-92-dawn.json 6a20e8d0a323d7daa68542128a273288a892ed702a47dd3c58a0a435acfc3de2",
  "quality/baseline/states/T-92-ink.json 53f226d9ab72b9892979f47b60fe93ad62cd8d269b8408a111c0c37f88e6bc55",
  "quality/baseline/states/T-93-dawn.json ee821abf124cbb687266f44e14018f0f495c0c37d35a574c8a855055882b64de",
  "quality/baseline/states/T-93-ink.json 9e45a56e46e9fb503ab4360905a6fa87fc7e884a04375187bc84ed8cf8b1d585",
  "quality/baseline/states/T-94-dawn.json 6432f3b3990f244ac1238ef18d9ddbb8856f3aad7f3a87d2a4a6c12155a1a730",
  "quality/baseline/states/T-94-ink.json 9830a5c7d14d44adf66f9e7ad03eafd9f16d36681c7e95dc6e478bfb6fbfa0dc",
  "quality/baseline/states/T-95-dawn.json fd386b15736634655d01ee8ab1929bb06786d19c39681ecbdfe81c2e9d0ab414",
  "quality/baseline/states/T-95-ink.json bb0e9e9ece881234a9a32efa96bdca64b8264703ceefd374cb0bea38d306b19a",
  "quality/baseline/states/W-01-dawn.json 5968a83c709cc6bf624f943f640e9b85e5620202a3a124a768cef613d7f0730f",
  "quality/baseline/states/W-01-ink.json 2663ecb3fd0977c1935756a16351dd4392c96939530ec38e4933dd5b37de4508",
  "quality/baseline/states/W-02-dawn.json 39a10cfcc7f5bcfaf3001fb8b5abbf9050d2849067ef0df30f0bf6075b967b54",
  "quality/baseline/states/W-02-ink.json 21a386e3de3871961a4efdd4dcd8ce566c628a8c622e14aea5ab6878e1dae997",
  "quality/baseline/states/W-03-dawn.json 94c82dbb67746aadb701b4590983c0667b4030901afd38a523a02225da64319e",
  "quality/baseline/states/W-03-ink.json 74aeeb64fe1c6196d795e5ffad2c20f525ffa849808cf6f4f06a039d235c6011",
  "quality/baseline/states/W-04-dawn.json 7f8f69b8cbbb2f3a3711c8b4d7d7e7750033a12fdf076efdabee4ec68e9ad795",
  "quality/baseline/states/W-04-ink.json 020bdfb686e43e5737845fad3931f40d0a5d020249012ecef0ba8d8c4a6e3886",
  "quality/baseline/states/W-05-dawn.json 1a22782f09f7e2a2272d077f4bba771db5ecd1ee4c979402476ae570fee90d83",
  "quality/baseline/states/W-05-ink.json aa05d8c7bcb8147a35a8d44877bdd308168f834da5ec81c9fd226d1dd8556393",
  "quality/baseline/states/W-06-dawn.json da9fc9d8a97b84ba692a5902bad45058a68631e09c6ab05dbfdff790ec8c1c55",
  "quality/baseline/states/W-06-ink.json e6c440b8d03369249e22c83594b3aabb98f2129f032bba9f69e85465f5231e4a",
  "quality/baseline/states/W-07-dawn.json 24c91e63aa506a3e973171eca73e35a96ea7ddef2f3123a562027f6fa56d9371",
  "quality/baseline/states/W-07-ink.json 9028352e9e1db07164e4e69f36231dded0e592dd7e341623c7e20b0bd6b461bd",
  "quality/baseline/states/W-08-dawn.json 29bf173ac3d6b6f4b9982571a7909ba5aaad9ef286c31df962b9576dd70fd314",
  "quality/baseline/states/W-08-ink.json cb46d1073945c555cee22c328e4dd67a413c1ee77cb7a74ffbadce36019b6a7d",
  "quality/baseline/states/W-09-dawn.json 58b173d64177901e5736b04e5f68c44453f3a64257d645d6d8239de6d91b68b0",
  "quality/baseline/states/W-09-ink.json e48dbf88aec4f42410a790ca0e0bbf8db88064cacc421c49d8eb11c98851aca1",
  "quality/baseline/states/W-10-dawn.json fcefc43f3aa6f9562ff9b7dde2a66c5fb56eb3d64eb404b53ba86af0b117b9b9",
  "quality/baseline/states/W-10-ink.json b25ab3af583f0b9b9d82b6fadf67d99e5e257cc644a23c48d38cf152dfeff80b",
  "quality/baseline/states/W-11-dawn.json 374cb2ad1451f2adf015018fa6f83a3b775af8e3d9e712f64a35160792818a3c",
  "quality/baseline/states/W-11-ink.json a6c489f5018e0a2d61baaecb5ed8feb10e01e43b6011419ede0380b723b55678",
  "quality/baseline/states/W-12-dawn.json 4cb139a2531177588bbfd982668624ce2623100009ed3143de5350ed592917ec",
  "quality/baseline/states/W-12-ink.json 8a7dfe4ac3044e39f3aa8c503cba43d821974876309a12e012f2ffc2fb0ff150",
  "quality/baseline/states/W-13-dawn.json 9ba35e841c489b0ced7b69402cc055a6f36ab7e1332c8bbc54446b23a4eb4763",
  "quality/baseline/states/W-13-ink.json af2b911ec0cba8535c9dd3657c6ff5174d0def26e1d1395b71212a611655076a",
  "quality/baseline/states/W-14-dawn.json 95f8c29bf74cc79d35c85a8b24106c0fb0f1042e1da32da825fe1bea960071df",
  "quality/baseline/states/W-14-ink.json f17c2fdeb1f1e379b34c7494d640b646b0984b5543bc803b5bc666d2562683ff",
  "quality/baseline/states/W-15-dawn.json 7ec36958657dea11627051dd5cb8f5b5ae77b0a277c027480be0e8bb00eb0b54",
  "quality/baseline/states/W-15-ink.json c5e6882d50512900d53cecbff8dadcc350aef64080297867f02b3ee7e65727a2",
  "quality/baseline/states/W-16-dawn.json 65ae12c792d1fae81decf7a541b2efcbd3513927bb23f607935cf5b49fff65cc",
  "quality/baseline/states/W-16-ink.json 6cae92aa2e436ce851b91c07ce00413769a3330dfe6833be1f2567c9552182ba",
  "quality/baseline/states/W-17-dawn.json 3f573d57a80c9f382817ad1c9c68dba6d0f24222edafb31751f3906cc0f8b12b",
  "quality/baseline/states/W-17-ink.json 2d235d4981d94b5894eac40b9003336d3bd8547659476a7ed4204b3998fa77ea",
  "quality/baseline/states/W-18-dawn.json 7978d7af36053d9e7f02431b16554c0720147a13162859cdf307c4e911d59477",
  "quality/baseline/states/W-18-ink.json af6afe9eb61c5ef999298bfb2b4b44d05440ef4228c2e2813aa6dc8e2afaf601",
  "quality/baseline/states/W-19-dawn.json 76b695e8ac50f56e499a4dba09f4e59b4b813378cd8f62de28b4b17f0406e421",
  "quality/baseline/states/W-19-ink.json d770fe20e8e891a1766586150731a835c1691071148b0f4af431db02844d4c97",
  "quality/baseline/states/W-20-dawn.json 90fc40fef9865f4da03e032743fa9a5ed536f21f90c7476d51c9609fb7a1de0b",
  "quality/baseline/states/W-20-ink.json f381b09a60ef9195bbeb8fc974498cb50b9ea899e74da183bcbdded796d14c39",
  "quality/baseline/states/W-21-dawn.json 0ee53610a6c05dfaac9374c71e3c4d517ceec83705a65d53eaa56b9ae2a04e00",
  "quality/baseline/states/W-21-ink.json 8bdc3962a316a7550f03a51701662c9f11677302185e69584717e836a2eab757",
  "quality/baseline/states/W-22-dawn.json c2255ed69bd09f06381977a6e632d2140e393b1f875b074e544b04b3bbf7402d",
  "quality/baseline/states/W-22-ink.json 2969a39aed613bb6ec03ea6356efc8494c871ec7ca03ede8a3fcb5dde4cd60cb",
  "quality/baseline/states/W-23-dawn.json d4b6a2c5f2facfec621dd51a79462e1a9474773ea1e6e501b51f7e7b303871be",
  "quality/baseline/states/W-23-ink.json 25de3e810aeb0d9b65bf880444ae05e29317353190ca5f31ffd8208c82f9ef60",
  "quality/baseline/states/W-24-dawn.json c6e076735d78158b3acf1e98c498c33ab9a39a1c6a90886fe0106907bf3be3ad",
  "quality/baseline/states/W-24-ink.json ad5b1487158fea49b4c6a7b1eb4872c93d2eb5d0a5f7f168e7725635747717de",
  "quality/baseline/states/W-25-dawn.json 82ce543d59dc49a836fd005c10ea3c67316a38167974cc972d8cad18314cc737",
  "quality/baseline/states/W-25-ink.json 897d7c1f2bbe25fb9bb479543d55186123a3b69c91204d4349e717db6efceb08",
  "quality/baseline/states/W-26-dawn.json eb97593f03004b36d00fd408567948c5e21792c943745230ce32a67c79391001",
  "quality/baseline/states/W-26-ink.json 29a0ee1a1fdd4b12ff80baa28ad989d0d036e3e7ccba2190c7f8ff03c044c002",
  "quality/baseline/states/W-27-dawn.json 1e885a8207a67ae7e1169f996a07c665d80e049a0c77fa93c28b48878f0fb0ea",
  "quality/baseline/states/W-27-ink.json bac1efaaa7a9ba3b84cb88400e72481911d44a43f2d5fad87980acc44e74e20c",
  "quality/baseline/states/W-28-dawn.json 233e23d49ec4ac4fb120451bef837336c4f63a0b3baae65a234538c9131d6c5d",
  "quality/baseline/states/W-28-ink.json ded7918383d9f275c840854025054871c99ac5a272cf8662f3c5c1e4e7776d77",
  "quality/baseline/states/W-29-dawn.json 8d12f14031b8b9f1165c34d5b5c1a6e1083ce292e0eac831c7958b569146f2e0",
  "quality/baseline/states/W-29-ink.json 379b19d3c968d38aa277a572b2e3a75f1f444d9a09b27a0072d7840287338f7b",
  "quality/baseline/states/W-30-dawn.json 6304d9138c14d2c5b34400853b356191409ff773a7a5ba8af8bd721eea30d96a",
  "quality/baseline/states/W-30-ink.json 85b8d14fef0d321520705cc41460523a15c67adcdb88b11426b305ac7625f55f",
  "quality/baseline/states/W-31-dawn.json f30a464fe3b42edae9925f9605c19074e98e4a7c29e2affc42bdc0dd09a17f9a",
  "quality/baseline/states/W-31-ink.json 1137c91c760599eb3c9558bba50dc4e8081c37ff15d023bc659be99bd1b05e36",
  "quality/baseline/states/W-32-dawn.json 104f9ceb37b37b7b273aa0c13dcc0bacc0f62b6dc0c9e3d45946fbf432dbb696",
  "quality/baseline/states/W-32-ink.json 6f84ed7faf6e6d01ce191ce01b906552254ac503d723d3c2c5d1c0daddb0cd59",
  "quality/baseline/states/W-33-dawn.json 365528beb83a611b12f2c5eaaf04c141a0b3eeb9720e7b098f130d71990de632",
  "quality/baseline/states/W-33-ink.json 9cbc72d96252067103da942f587039a447a5d2161984ab51eee0b63184e46ba3",
  "quality/baseline/states/W-34-dawn.json 5439f44c9f0587d64847b8ad6c96d37fc67abfd30fabe31141722b0be09fef8f",
  "quality/baseline/states/W-34-ink.json dbe823453a66886d909a8a295d795322d184fc119fd71a88b4abacf012eeab74",
  "quality/baseline/states/W-35-dawn.json 846675572f34905e30ea09ef51fda10f5937735598e5e58f0f959f1981411333",
  "quality/baseline/states/W-35-ink.json 9e3d1b69f48e741edd4590b4f8f58e658f8d4649206cca585f36d29bbc69f12b",
  "quality/baseline/states/W-36-dawn.json 2effc2deebf393a8c2d8eba7f6bc8cadd26d71e6e6441420eb54a42495977178",
  "quality/baseline/states/W-36-ink.json 235149619e24e615be3b19082711cc34e3eee2918a869580b1e11479de33dfad",
  "quality/baseline/states/W-37-dawn.json 8d5ca8db5c78602369d4a48dec5854e2a139e3313e2b025ea66082e56614902d",
  "quality/baseline/states/W-37-ink.json d0671eeb6acb5727dc229a594c19bd288427db87124a3cba6f8e8d298ee411c9",
  "quality/baseline/states/W-38-dawn.json 6d03324efb54cabedc5ca7b67b3c3a477a086cc1fb2de367f51caada6c9ca6c2",
  "quality/baseline/states/W-38-ink.json dbe4b801cc0c1e20e8e8760fa4a022738bde29aefae307fd3d2f02de6953d8fb",
  "quality/baseline/states/W-39-dawn.json a6cbee01903c35222e687c860bcb73a86149e3240ae9b6172657295fda42cced",
  "quality/baseline/states/W-39-ink.json 37d19d22523187115a150388aaa1b18625db5572ec75f49096b52fb7618c92b9",
  "quality/baseline/states/W-40-dawn.json 69dd3935a333c453c5e9029ad2a48e0cc887ca237692d41f31c9409783aedd33",
  "quality/baseline/states/W-40-ink.json 9daa3b758a16670f8784fc912eec51b79a4a3e3e1b58e21289bcfd599ee88d0a",
  "quality/baseline/states/W-41-dawn.json 104b5acbf37e6b811b3039ee52bb210b822393950a0007623ee0a042b40faddb",
  "quality/baseline/states/W-41-ink.json d76291a7cc4f1e881ac8f2b3f9ca080a6e536ae5afa207b890045e949a190d0a",
  "quality/baseline/states/W-42-dawn.json 501411c862a8eeeb50c7966c13e97b5cf012beeacd46ed037391fc7bf673ba1d",
  "quality/baseline/states/W-42-ink.json 3ccb04aabcc199c27190c096c1e2d45a0c552411c59fc4b544add2b9652c180e",
  "quality/baseline/states/W-43-dawn.json 7d52b34f19de64a7f038ce9dfd554acf37ea2a4604ee5315d5d0ee4054ad5fa6",
  "quality/baseline/states/W-43-ink.json 65d71f7ac7cf7f3be9291dfd18da18c9ad1a992c29f9386ee4b115a122b01094",
  "quality/baseline/states/W-44-dawn.json 8021144279bce550d95e2d22a6b45a9a8d1287fb31c8fcd0cbf84e033ff7f126",
  "quality/baseline/states/W-44-ink.json b23e5b4f072bd13cbcd53b620df215d134d76ebb70bc96650543ee287d2624f3",
  "quality/baseline/states/W-45-dawn.json 6d04f92d0f66c46c33663516efb46583e1f620362f81614412edd31c3511043b",
  "quality/baseline/states/W-45-ink.json fc9a5ff8eec46fd2b9298bae3da3de1c6c242646ab7a88acd60b0109764d16fd",
  "quality/baseline/states/linux/C-02-dawn.png 00d39a7dd3648bfd44fe78c6ebf587dbaf86d6a1d672f4bf53826902be860af7",
  "quality/baseline/states/linux/C-02-ink.png 7f53c8c7e329cf41bc4b2ef871255262b4480fd3d12ce455a68d046df7d20a46",
  "quality/baseline/states/linux/C-03-dawn.png 5348455e13f5df02ba8fc22d0015387f2eefabc6447135d5c04c99b3da326323",
  "quality/baseline/states/linux/C-03-ink.png cbe4b184ca16b73e6be9172fd1f517fd2245d6264e732da28b1047dcc7ff3758",
  "quality/baseline/states/linux/C-04-dawn.png cd93a28231860f8e958b3204734ace7d828abfeed04be6476580e28da9c46c07",
  "quality/baseline/states/linux/C-04-ink.png 62f232c7ef106254e3ef18ecca4b58670e06a8cfb8c3f09c0d2c154c4c553cf3",
  "quality/baseline/states/linux/C-05-dawn.png dca4f2393349953945a02afc3b4b41ac7dc4f446ed2c729a53f6214f73fc2d06",
  "quality/baseline/states/linux/C-05-ink.png 3c707d895c9978a7a8b4221eec2185a8e978af2226b15bc61f4b31f9bae6d7d7",
  "quality/baseline/states/linux/C-06-dawn.png 76a67ed32f0de31d73e2cef7abcdb84f72bc94ed23257cedf463437ce49989ff",
  "quality/baseline/states/linux/C-06-ink.png 3e4d2d79cbf607d2ccd1e2f47aebc84d0bdbdc3686b8fdef5eb1568b61d2e197",
  "quality/baseline/states/linux/C-07-dawn.png f46b5d3615ec448e6967dbf6a61f546ac72ecf00ca23c0e761a3904208d6db4d",
  "quality/baseline/states/linux/C-07-ink.png b0addedac5b542919e7a6ee6e1c5934ec34e39baab210fa60d8b93c144153bf8",
  "quality/baseline/states/linux/C-08-dawn.png 3edf164e6e5ded67d26989fbba4f16d5f3c8f5eec4f92235d907aae12f8f51cb",
  "quality/baseline/states/linux/C-08-ink.png 7a51c30de32a9c5cdf258c38d626221bd53a29e29e73f49e595c7c4df90f3d2d",
  "quality/baseline/states/linux/C-09-dawn.png 8d1cca5d67de6b9a6b0ea2c1fdb703ef5b9fcbcb1d370b48f9b612a8fb41e3f7",
  "quality/baseline/states/linux/C-09-ink.png 2bc842a9d72262fd5a3c61c6f58d0b72519ebce048e7c6ff513aa8eade20b453",
  "quality/baseline/states/linux/C-10-dawn.png 3305b746294c1c3e8935f9c50370a23a0fef5a6019c034e0a04ece720732d0c1",
  "quality/baseline/states/linux/C-10-ink.png 0db1433056e844d8b260d7084f3dc10ad6a098ab84cba5898ca2389906179b6e",
  "quality/baseline/states/linux/C-11-dawn.png f589d0775b3b41bd803d657996eb6e647a523da34e784366b7f7f48b0b39825f",
  "quality/baseline/states/linux/C-11-ink.png 6ef9a2dc1fbce7a16ed517a160cfa655b5b1070f3d6355fec9845c2af0e4040b",
  "quality/baseline/states/linux/C-12-dawn.png ed55b67315efc8ccaa1cdbf41f261e5a1adc445a00e16c1c5afead874ff9b16d",
  "quality/baseline/states/linux/C-12-ink.png 11ca67f22f6da7182af7dc7ed52f05b2ba5a5dae77c8d5c6e62036fbf104c29c",
  "quality/baseline/states/linux/C-13-dawn.png d978e3aa41ceefb7226adf00c5ee1ccc05a881d774584681ef7638c3ec6bd611",
  "quality/baseline/states/linux/C-13-ink.png d07b231b4cdd43e9521f00b4c1868823144cf2cdac888939c96f575685fe3f83",
  "quality/baseline/states/linux/C-14-dawn.png da4ad7831e0921b8e34ab75758ff0bb4c0c7e1b04ac0134c98076521c0d88f6a",
  "quality/baseline/states/linux/C-14-ink.png e211ddd0e3ca2eda1105ce573a073ae37b5be49ab4b7f5c6ef0eb06d1dad33db",
  "quality/baseline/states/linux/C-15-dawn.png acfcfd5c05cd871a672361c66ff2dcbd307904a6438afece171b116bef89a54f",
  "quality/baseline/states/linux/C-15-ink.png e35d53aa3897e3782d3561bf62a11897a06ff5c13a1497da8d7ec260433255d8",
  "quality/baseline/states/linux/C-16-dawn.png 85f8da7dc2c53f426475ff67ff27d0fbd9de511635a7a54526a12603cc133c4d",
  "quality/baseline/states/linux/C-16-ink.png 23a9008ea44a8e914ecf9c046339fbf5c5279cc106a9ed7a8027c27b8903dcad",
  "quality/baseline/states/linux/C-17-dawn.png 900d9369679994b2e23348738f35dcebbd07b1c457d2bf57a961ec00c05e0fc5",
  "quality/baseline/states/linux/C-17-ink.png 0b306047103e84cdfac72a6f67b1e9e27acf37574495477de9dc2beda8ba6aff",
  "quality/baseline/states/linux/C-18-dawn.png 966810085ad8e6890a66334d538bfed5f165e80c1481dd20cf2dba3dc4fcaddc",
  "quality/baseline/states/linux/C-18-ink.png 7f91e6b9f3296e756390cdf631721f6a3ed9cad34103b170327e109d434a53aa",
  "quality/baseline/states/linux/C-19-dawn.png cf7bfbbc24742fb6f61154d1e83d0533768dc002f08d2956d4572db9880b49cf",
  "quality/baseline/states/linux/C-19-ink.png 94be6a011afb414f23af7bf925d5670edeb84c40737a17be2713dfc096c5f350",
  "quality/baseline/states/linux/C-20-dawn.png a5192cb9171a10b7dc4a7ad0e94adb84a39e5ef7d75d66b5a27bf08c0ab4d535",
  "quality/baseline/states/linux/C-20-ink.png 8f598204d24e24997e174035234cb34252015de0f698113b8848efe5da236a8d",
  "quality/baseline/states/linux/C-21-dawn.png cc4d7c36777df80b8597bc9dd2bfaa3a736085d6a91eef5725fe21ed910f7ebd",
  "quality/baseline/states/linux/C-21-ink.png f0b04ede093434ed45d3777c54050e642da55010ae6221a9aefc0931ad765772",
  "quality/baseline/states/linux/C-22-dawn.png 8c85665e3b0386b6b7edf22fb88343e64b70fab0dc2c32d657f7f7869964975d",
  "quality/baseline/states/linux/C-22-ink.png 45d0fadf491a47cd1784426cb78d262b8cc893d887b53ebd3ec4338dec513587",
  "quality/baseline/states/linux/C-23-dawn.png 3b340d52442659cee09ec2a69e5e0f4fc03c9babd26547c5d1da3874e9b1d415",
  "quality/baseline/states/linux/C-23-ink.png 47d55e2464aae77c66c2daf3da458b2612931c880cdffdb37e7e04d4c6a6092d",
  "quality/baseline/states/linux/C-24-dawn.png 0d33250a2cb5197226f064838d3576a6dd0e063a58ea418d7156879b81fadf92",
  "quality/baseline/states/linux/C-24-ink.png 102a6ece55abf8d878f8da709742503fb08dca5f44b3f8055275d06c6ffa5471",
  "quality/baseline/states/linux/C-25-dawn.png ab4044b8eb244b874b59db02b754bc7993bf1e345c1a7af0d89516e797fa76b6",
  "quality/baseline/states/linux/C-25-ink.png a25c757e1d3373c56cac72bdbdfd5de6fe79f7187083c9b4d4e7905f1140e200",
  "quality/baseline/states/linux/C-26-dawn.png b9002315c743cc441d66148027413e4cd54ef5602067024b4c9a8bbca6b01ead",
  "quality/baseline/states/linux/C-26-ink.png 22c2da7d5cc9d6cc4b99a666c77f03f8134c7d166cf441588f41b21b814b5d0d",
  "quality/baseline/states/linux/C-27-dawn.png 2a95d282975a98ef014547aeacdd9eb29cfb2cfaf861da897e4c62f191468ca8",
  "quality/baseline/states/linux/C-27-ink.png 66e00b6867ce423e6bbfabb9b411db0283e3b0d25284758677f951936e907f02",
  "quality/baseline/states/linux/C-28-dawn.png d8e69d231c34f6e2ad4f523b97175e11feee3de8dcf755555961c4eff987fac8",
  "quality/baseline/states/linux/C-28-ink.png a762465a39ca8522e47bf367a9d0088b7d5a318d59fb6097366469767fa14258",
  "quality/baseline/states/linux/C-29-dawn.png ff1d25757d1ab728fe55e3c6f1c858f45e8ce678305b4e9bc1f14baba761070c",
  "quality/baseline/states/linux/C-29-ink.png 8807116accff768b6b58112c8fa48f54b2adfe9deb415f1c034089bc3122a17d",
  "quality/baseline/states/linux/C-30-dawn.png 88cc14bbf7f3ffc6f9791916847fb7a25cbaee728e61bd36e156b667d8af50f1",
  "quality/baseline/states/linux/C-30-ink.png 4e73e2bf48debcf485a39f5c5f3ad22d3c87635706960ebc3e4e18fa9832e54f",
  "quality/baseline/states/linux/C-31-dawn.png 94f440d03f8554d0a0c8276b41aac221cbfedae7012e2d18ee4d982cbb9de3dd",
  "quality/baseline/states/linux/C-31-ink.png dd264c1abac0adfe84d83cdeabd80d06649ee755cf82b14db5e81271c0d44e74",
  "quality/baseline/states/linux/C-32-dawn.png 5b3b38169d02b418de4ded95e5819783601c197ccef49fb67bbe82189407a928",
  "quality/baseline/states/linux/C-32-ink.png 6351c157ad2a1c5845cbc544fd6c4df4c894a5ab7c8c6c9a04e8f8a7795c8fd6",
  "quality/baseline/states/linux/C-33-dawn.png c206aa2c956072f9173feb710bd56ab909bf4e321bc14c9bf273e1c4f8cb9699",
  "quality/baseline/states/linux/C-33-ink.png b6cca346c8dcc5e7b76803b3c4082cca717b26515e0afe94cd7c24587c890d02",
  "quality/baseline/states/linux/C-34-dawn.png b1c48a9241283dcb347bd4694c1d52c237dd6bba427079c6622ae0d1a58cb254",
  "quality/baseline/states/linux/C-34-ink.png b124389347e3fdb76304a4257e72b3ed06cc56f93ef372daa474387b71281234",
  "quality/baseline/states/linux/C-35-dawn.png a2912e52aee4ad1e89f58771bf476e2e9cbf3e6edc015582bfa0d7cd496f4602",
  "quality/baseline/states/linux/C-35-ink.png c25d454fe0c5df81dad6f0c969d03aeb937dd32e65b204299d0ae77f543162e7",
  "quality/baseline/states/linux/C-36-dawn.png 3485cfad2e322161e49cc89a0a5793ba8710517401c1f0e901c04f07b4a7a13e",
  "quality/baseline/states/linux/C-36-ink.png 1b7d8256ef9ee561f93a3ae03a771af2ff6f06f72df6466efc7104aa2c56eb64",
  "quality/baseline/states/linux/C-37-dawn.png 56f43012def189e10b90b9d73207c2733b3cb65f60f22b8f9cf458af42477f63",
  "quality/baseline/states/linux/C-37-ink.png e1c96329f168e8c5f485306f64045578fd6939e2abdd19fab191f8d28209ce43",
  "quality/baseline/states/linux/C-38-dawn.png 1eb2815349b7541f9ddf1eda0cb240e5f29d07643a2ce50bf648a84806d90386",
  "quality/baseline/states/linux/C-38-ink.png 58c6262c9b722ee07bef181463ab0ba1e3d690e08a46d8267e042a18a31b6ead",
  "quality/baseline/states/linux/C-39-dawn.png 5ab1719bf0ecfaebe4ba250a2be7c07ff1d9eaf4442bcc2d7283f5f4fe430d76",
  "quality/baseline/states/linux/C-39-ink.png 14e15500f219ff5c1ecf45832e291d3376e7039643988f94a5887aef86550dc8",
  "quality/baseline/states/linux/C-40-dawn.png 6d5fe91da129e7a39accbb628bac2cd06fac0fc0c2184e2ee60da720c46ccee3",
  "quality/baseline/states/linux/C-40-ink.png 4369d71d34534b2702c86b08395c7a140b53c4768b2ee6acc6a5252366288bee",
  "quality/baseline/states/linux/C-41-dawn.png 08c8671acd9118a80f79a82ee46bba93d2f73f985476b3ed6e253b490c40da57",
  "quality/baseline/states/linux/C-41-ink.png db20278f4be84e41444d48100a7a38dfc35481cbfb70bef4131bbe0064aae6eb",
  "quality/baseline/states/linux/C-42-dawn.png 44d30c1039d7233e3f7db9c118b5a97923cea6577bfca29722f6c8e4a636caf7",
  "quality/baseline/states/linux/C-42-ink.png da4eefe60c76a048b3e3803558846811642808fc630c7832143cdc4b4cf4b384",
  "quality/baseline/states/linux/C-43-dawn.png 76fad6d583c4556de72a0be21694c240efb94e163ed7a54f673b7dfae4c94b6b",
  "quality/baseline/states/linux/C-43-ink.png 32ae2e6e1c2d86b61dc5f236512a7d772b1772e894c6d017538f028107e7304b",
  "quality/baseline/states/linux/C-44-dawn.png cf12fa06ef6aa07e7fec88652fe4fb91fd966edca3138f7e1f98319287eb7ba2",
  "quality/baseline/states/linux/C-44-ink.png 9f7859f89053d455caa84f61b69f5ae4182ff8e680f1534f4fce93c1ebd369d5",
  "quality/baseline/states/linux/C-45-dawn.png 364cf331a78b3ee9dac0f888f0ee4b1c3de51e96cff93564d7247c1b5af27e4c",
  "quality/baseline/states/linux/C-45-ink.png 6579cce527ab681c1d223e3a0e5a12d9215c07fdda9fa9f3390b50fae067b197",
  "quality/baseline/states/linux/C-46-dawn.png 5dca7e7d3b55ff290c3511cdff918a2d18b3587d62581d8fc6e4e5495d7c1bcf",
  "quality/baseline/states/linux/C-46-ink.png 463557be8129c2aebec9eda98a28038034af86ab68023343e8d6000acb74861d",
  "quality/baseline/states/linux/C-47-dawn.png b7078720088fbeb3f646a83f0f2467d459b40d0cbc7ebb9d58e8c245ecc0c52d",
  "quality/baseline/states/linux/C-47-ink.png 22b4e09212fb6d0443738a9076335a47d56a8e13b6b5435664b8cf9731cfe4bd",
  "quality/baseline/states/linux/C-48-dawn.png d9f9ccde92dfcb7abd1eb3d8647539a7646189e6caf07c12d069b49625bc8965",
  "quality/baseline/states/linux/C-48-ink.png ef6cf4c7e842040c66e481f1e1233b46b85aec97721108a4a74dd36311046f4d",
  "quality/baseline/states/linux/C-49-dawn.png 9baa5df4918cab29d671c5afc2af3dff83611067b31e570b75ac38748793a304",
  "quality/baseline/states/linux/C-49-ink.png 4cab25649a5bbc8814110e634174703ef6fa1521f428d80494e0c244110416a2",
  "quality/baseline/states/linux/C-50-dawn.png 5844f22fc2cd57631d17100f0efabcfe71cf7f3b945bba72fb2d71a248e0db1b",
  "quality/baseline/states/linux/C-50-ink.png 9391e27bd343850a1565b0ec486158d6a8d2f231f76c72e819bca8d7f79a878c",
  "quality/baseline/states/linux/C-50b-dawn.png 269d2060115270c294fa851d3b03d6d40348705a3bb03bb4598ac06185209877",
  "quality/baseline/states/linux/C-50b-ink.png 57246e2e3776205c5921a8b064e96eb1bd59ffbfebc05daa9d2aa3ab28b385c0",
  "quality/baseline/states/linux/C-51-dawn.png fcbcdc0a65d5a198f97de71a465b9d248dbbe260d2b38fcf2433a41982639331",
  "quality/baseline/states/linux/C-51-ink.png e07a0252e5a54484e27ad4d9ecab4d96f065309e06e58546579baec6ca44b97c",
  "quality/baseline/states/linux/C-52-dawn.png f661d3ec04e8426a3376de0683d48a5209bbabc1ba159fd51466e7d1af3edfaa",
  "quality/baseline/states/linux/C-52-ink.png d9e49e5e0b2a60a253e6fca00f6309a8214609d28ce8e74ed11e0fe81c6970c9",
  "quality/baseline/states/linux/C-53-dawn.png 9b201b5dbecc985dea9207a0bb4b39d54f45103042a11708095c2c32f9a92cd6",
  "quality/baseline/states/linux/C-53-ink.png f8fcb35fc1644fa4340284664ce146557bd263ec8346de5fc93de720c95a1500",
  "quality/baseline/states/linux/C-54-dawn.png aeff92c9fc6c6e11d8d08a6ac3d3bb52f8d0735cbb2f521e9aec1281b5a55487",
  "quality/baseline/states/linux/C-54-ink.png 571c7b9317d350b07d21c9ca8135b1bba05b16e5332cdca61ec4b12e0f1ab6f2",
  "quality/baseline/states/linux/C-55-dawn.png ce36c824a9444fb0c38b93330f4bb20cd07b7f49c4f2a66a21690ccb65a496f0",
  "quality/baseline/states/linux/C-55-ink.png 5f68144604017a12479d317134afe198d9e139e4af981aa55d349c0b42ea4745",
  "quality/baseline/states/linux/C-56-dawn.png 54a1bae676ab474e5eee51e94122d3b590b605074b643fca0846a0d9fe80885e",
  "quality/baseline/states/linux/C-56-ink.png f81b6581ddf2cec86bc61221d6a91bc032464c309640db12bd4bfe7614cc5f3a",
  "quality/baseline/states/linux/C-57-dawn.png 49007824ceb682acbb6ffde2b4f045c29320874d956fcdfe6df76a3d6fdca27a",
  "quality/baseline/states/linux/C-57-ink.png 58208577244c904f5f33c6e1e0ddab5e18832e172cd38ce70574297717f65924",
  "quality/baseline/states/linux/C-58-dawn.png 75cad940efa00b903a64b65af0a13f1f72afa899be5d8cdb322aae4275defeb7",
  "quality/baseline/states/linux/C-58-ink.png 7f69f287333b2d25d9203e82926092c8c7e76672d1d3719b667cb7fe4817eab3",
  "quality/baseline/states/linux/C-59-dawn.png c3cd155bfe920bee5876ab5119e615c05014530f0d1a43e01028e8c7be19edb2",
  "quality/baseline/states/linux/C-59-ink.png 85911d2d2d02a75da4a3c30f3c1404e1d85691c2d4f9c75397ade7c1706e709a",
  "quality/baseline/states/linux/C-60-dawn.png 3ad465b78a43f606fa124b0bd77b3ebb8f78311f639429ff6388e7267f0ae5b4",
  "quality/baseline/states/linux/C-60-ink.png 63f165df180f1f33d5f6f0a09839e2f97e4f4de6ad39b4d1806cbc8bf3a669eb",
  "quality/baseline/states/linux/C-61-dawn.png 0ed151afedcc7c7ff93fd03010c0983f1a00f070b229f2a67b5c899cb11eb981",
  "quality/baseline/states/linux/C-61-ink.png 54910db4e0c17a8fdd97b6ab57320182d0591a4d63a7e5e806aacd248b4e4410",
  "quality/baseline/states/linux/C-62-dawn.png 38b95ab3eb3cd10483e1dd12e524d2125c85dc8d8bc160e85f0f4d84c5605f24",
  "quality/baseline/states/linux/C-62-ink.png 2bb1d5f6d8de351e849a1c1c91a9d3364998dfc6c463ffde8744e7cf01c41b3f",
  "quality/baseline/states/linux/C-63-dawn.png 51d6b94dfedbd465a788efccb0eb73e6422d0d648f0d23d1d5cd1dea7af63eaf",
  "quality/baseline/states/linux/C-63-ink.png 74b9bf2092a1460cbefb71c8fc1d062b7f7063a15383dd9e86fa785a1a33c748",
  "quality/baseline/states/linux/C-64-dawn.png 378c9e44707a3853373d8cac427b22fa37434fd1f35ba0166f764fb446319aed",
  "quality/baseline/states/linux/C-64-ink.png ad28e18b088922b0bbb96e47535146c6e8229ec8ba7022bbb89d62d8ca867dd9",
  "quality/baseline/states/linux/C-65-dawn.png ffcd23c507a4cd26b3e96506a06f460b1dc951444ce10c597bb209e01d828b48",
  "quality/baseline/states/linux/C-65-ink.png 1358b30076ca330272fd125980b3f0c12593331f9faad15b91616afe514243a5",
  "quality/baseline/states/linux/ENV.txt f388bb6d58d2d4501380e76335f611a5ebe664f8650b89df07e953d778b7197a",
  "quality/baseline/states/linux/T-02-dawn.png be662f232f7fda17c0c18d526d4f591ba37d424d23a312dcca0a77fb662a4a04",
  "quality/baseline/states/linux/T-02-ink.png 97a9dae4586064c36b08313fe120954d3dee9562d896888bb9cc55b797fb4b06",
  "quality/baseline/states/linux/T-03-dawn.png 545fa5805e985cb094c29965453509074c8c1d09ae865663a8b503ec6c1cf189",
  "quality/baseline/states/linux/T-03-ink.png 03a9483dfd15c8dc4bb84c0ce196f8ee5408b3c25a0c60d89ad3799a83bc9d60",
  "quality/baseline/states/linux/T-04-dawn.png db9a8d172e2933c3f77abea841a07b9e23053a278ef0a0b21b01726f427dbfd4",
  "quality/baseline/states/linux/T-04-ink.png 671073c61f404329e2439d193195b30df2c780e6e93c7dd74b3c7c21034051ed",
  "quality/baseline/states/linux/T-05-dawn.png 2b82078f47995a7d21d5b3a414d0e65a9ebdfa72f8d7ac2e03132ac82ef7e328",
  "quality/baseline/states/linux/T-05-ink.png e5a42575e25e4143a4e3ea4d3d4969119955c7abc18a68f603501957d272501f",
  "quality/baseline/states/linux/T-06-dawn.png 6ea750f0179e14983ac3d8019a35c8a6416fa4eb0befe013ff0d2a91f4d4311e",
  "quality/baseline/states/linux/T-06-ink.png 6a1ed69e6a541829a490dc4fb2ed2e0fccd6ad833bcf480da90ffb25c6fb09f1",
  "quality/baseline/states/linux/T-07-dawn.png 60ea1a6b5b623ee3e040e7c2c2fd1354de02e680008cf337507d9a409ababbdb",
  "quality/baseline/states/linux/T-07-ink.png 63b7088b911728b01b6d1aa87e5923c072afc0565225ee141094c99bf16bade0",
  "quality/baseline/states/linux/T-08-dawn.png a9d8a6f95a809ad9bca1d5e096524f3c062baec16896b34799fcea662a5c6095",
  "quality/baseline/states/linux/T-08-ink.png 544386b989dfd490b86bd3e54cdc51e1e573331b0d8ff967053cd2e6fcc2b1ed",
  "quality/baseline/states/linux/T-09-dawn.png 2d48a5b5b7f236ce478b493268e05a11ac680561b6a2fda37eafc2aff8c75820",
  "quality/baseline/states/linux/T-09-ink.png 9a1a16db9bc902f90938ae2310f0a4b38455a6a382ae4a5eeddc69879e6fd479",
  "quality/baseline/states/linux/T-10-dawn.png 8071fbf738e60a787e480c34760ad86d401908c2853dca14dca83145d86795a1",
  "quality/baseline/states/linux/T-10-ink.png 6c903df4460f60b0ffbadbe60dd06a6a8d4a4927f7f1891a2a2e45e90c147c69",
  "quality/baseline/states/linux/T-11-dawn.png d3d7122786fae5d56575c3da563060ccdb9769adc9d4bb0ef4519f4a6ca756e0",
  "quality/baseline/states/linux/T-11-ink.png 0f93b74dde466ca43ef999495e03c2249c645bf43702dd7a03e2bf77f9d316fb",
  "quality/baseline/states/linux/T-12-dawn.png aebad5f604654ff3173f50025b6b6384b9bd63f7708068693cc469ba457f75e5",
  "quality/baseline/states/linux/T-12-ink.png c41cad4f654e16267ade5e4207c2b5055814f9e240dfbdcdc58654621dcaaec5",
  "quality/baseline/states/linux/T-13-dawn.png 4839f2b8b7a3049b329ebfbf69778f1814c81d98ffb064c238295115548d17f1",
  "quality/baseline/states/linux/T-13-ink.png e06c27fa40d4e5bea184789dc15f53907d464177cec83c28bf13b113b93f60eb",
  "quality/baseline/states/linux/T-14-dawn.png f364f031d7b0e642e3f1dcf9cbc28fe2b377f9b90178f4ca083b8512da32b3f5",
  "quality/baseline/states/linux/T-14-ink.png 8784551ba10e398a12a1f3ae4d2ea1bc0ee609db39fc32a716633cba630066c7",
  "quality/baseline/states/linux/T-15-dawn.png 278171083baabec7f6e4ea1928a6aaf9c3ee5e9f2da59a68fbfe5c72a10e8918",
  "quality/baseline/states/linux/T-15-ink.png 4566bc3582a4851e365040462a741e96eec3950d4399c2bd3ac0b2ca7ad87381",
  "quality/baseline/states/linux/T-16-dawn.png 019cc8b7fe4151132034af74cbfd117b0b798346df6831a1bd4b003a950949be",
  "quality/baseline/states/linux/T-16-ink.png 3573cb9c8817093f9955b0768cce4da66c7798385bbb2f954e170889d429b852",
  "quality/baseline/states/linux/T-17-dawn.png a32020b1c3d8f3b0dce108e7346c131a203240710bf592fba882b7c8902d9c59",
  "quality/baseline/states/linux/T-17-ink.png b1ba1a2a5909e5940cb0de71375840312a54d8ed78b85156cb287527b3cdf837",
  "quality/baseline/states/linux/T-18-dawn.png f028f8ba88fd0358109c351c4c38caea8354afa2242dd87d3cea9650c7dd9f18",
  "quality/baseline/states/linux/T-18-ink.png e0d980ff96a1c23a0808750f406f6a9ee9251e0a25d0e14177b0eee17643dee5",
  "quality/baseline/states/linux/T-19-dawn.png d0f6a5692866d938d8416a52be5787f62c269614dbae246cb3891986c1f3309b",
  "quality/baseline/states/linux/T-19-ink.png b5f57ae373e24e694dcb9eda5c09b768e22fa906773cca147423a0f1f8ae7ee5",
  "quality/baseline/states/linux/T-20-dawn.png 69e2ef8bcc803a2f79a99e744b37b287d7e4ee591bd28a80fefcbbda14cdc74a",
  "quality/baseline/states/linux/T-20-ink.png f807b993c18cc112d714c882c6cc79c020f214c846b7b525c57e27d15aef7507",
  "quality/baseline/states/linux/T-21-dawn.png e135a0f5b49ed7834544dfa5b2509a5cafe5bf2b2517601cd0c249d07e0fefcc",
  "quality/baseline/states/linux/T-21-ink.png 15e0fa77f79d2762229e41189fb71ba455605781ab6a4db9f11c29b7ec23ab04",
  "quality/baseline/states/linux/T-22-dawn.png 2a13bdf5f61b897c4ea4ee520fe7d00d38dc474fe471d93558a620d2d0d2fc15",
  "quality/baseline/states/linux/T-22-ink.png d5df215d477c071e8146758cdda5764927da36f1856bab6378c741ee86d6b73e",
  "quality/baseline/states/linux/T-23-dawn.png 3ad59e23bfe83dad6be007c8473fcf69beff1a69f90e1154026a862f328a3820",
  "quality/baseline/states/linux/T-23-ink.png 6c87341785f70558a8da157dabda53be96cfe0427fe4b50b1fa3fdc5beb831d5",
  "quality/baseline/states/linux/T-24-dawn.png 4c5e7bf24dbda79b626d4c545f757d1c362a18810a82c5f2fab3f41d9a91a25c",
  "quality/baseline/states/linux/T-24-ink.png 486e115839162f8c31c4d5541f6a165adbf47b1d07d1128cc5e58790f67755fc",
  "quality/baseline/states/linux/T-25-dawn.png d5f4bf9db2ace2a643783862593e2d833ab0f8374b8bdba25e18ecf33e83d181",
  "quality/baseline/states/linux/T-25-ink.png 3dcf60885141deec6f344714cafe7a1e66cd2516386b00ebfb3246da2d37631b",
  "quality/baseline/states/linux/T-26-dawn.png 4c5e7bf24dbda79b626d4c545f757d1c362a18810a82c5f2fab3f41d9a91a25c",
  "quality/baseline/states/linux/T-26-ink.png 486e115839162f8c31c4d5541f6a165adbf47b1d07d1128cc5e58790f67755fc",
  "quality/baseline/states/linux/T-27-dawn.png 65fbc1ee4a7b854a9919e3da42615c1d0d6887b62c45b4f6d4d94c4170e89ca4",
  "quality/baseline/states/linux/T-27-ink.png aa6a2a1fc636bbdccae950683b4c2229299ac9abab26588bce7ffb0790f427ee",
  "quality/baseline/states/linux/T-28-dawn.png 3757245a24aed0652f1c293746bcd22ea22564738b8c011de9bfe3543d6f1917",
  "quality/baseline/states/linux/T-28-ink.png c038e5f5fd69ce18150c5deb62b2b3e1af227a3e6519e7fcaa309f150d6e9157",
  "quality/baseline/states/linux/T-29-dawn.png 5ac4a175e47ea28e7ce8bfe94b31b4f5fc026895ccca88c96f2d58dacbc209c8",
  "quality/baseline/states/linux/T-29-ink.png d8fead50837aaf4583bd4c29558b16daf5dd6d42f9b083244060a3a6819fe1b9",
  "quality/baseline/states/linux/T-30-dawn.png aaa8fc6875512e3d211112122dac4efe5b7cc6e313a5e6e305f824fc46717dff",
  "quality/baseline/states/linux/T-30-ink.png 62ad93b749024b22232edafc1b71ce244d0bb10456bf58caa00e904b319703ec",
  "quality/baseline/states/linux/T-31-dawn.png 4c5e7bf24dbda79b626d4c545f757d1c362a18810a82c5f2fab3f41d9a91a25c",
  "quality/baseline/states/linux/T-31-ink.png 486e115839162f8c31c4d5541f6a165adbf47b1d07d1128cc5e58790f67755fc",
  "quality/baseline/states/linux/T-32-dawn.png 581cf8a8b82e8ba10c4a2ae499e5ffaccf0ed9876ceef9889ae27c2ccd81585b",
  "quality/baseline/states/linux/T-32-ink.png 5baa7534fcefce3549a171166946c3a4cee787e7896dc3b9a935638bcac08ace",
  "quality/baseline/states/linux/T-33-dawn.png b06f0ef18759b6883b13de5f3b9c97abb1cffce2500c2238a25399444c24b107",
  "quality/baseline/states/linux/T-33-ink.png a124f8471e6192b1b1455c141ab3ccb26f82cca6b93c9db5185ff6719a4bbb46",
  "quality/baseline/states/linux/T-36-dawn.png 665e9b0fc9110147f81b2ba84a867f1fceefaa917cc0e1371923e2d1b83412d6",
  "quality/baseline/states/linux/T-36-ink.png b680eccdd63e1d4121c7440e5be4f3b8e9eac3792fe8ff6142ec018980c2d37f",
  "quality/baseline/states/linux/T-37-dawn.png 0415f4ca8c6f1ff0e3a96e9817d617b45f76c5ae720a8b3c9ebe791ba6b5b2e2",
  "quality/baseline/states/linux/T-37-ink.png 3f2a08a16a3137b7f6a2f340be758c1840654acf8049150a10a6c5833ece7e68",
  "quality/baseline/states/linux/T-38-dawn.png b9e54db3024e52aa1c4ad74ddd50d6d8a6a6f360db2897c3d85990988dedf918",
  "quality/baseline/states/linux/T-38-ink.png af910a6e8402621de28bf1f916a7ebc5679a6914dfb6018dfaf16559c4beb1d7",
  "quality/baseline/states/linux/T-39-dawn.png 33e49f898803c0d311cbf492c1170165787a02cdc20866d107f1d094069e5c5e",
  "quality/baseline/states/linux/T-39-ink.png cf2fa4e7ccdde100f1b0c5b5914ca170c77c9b5a3b43574fb4e55ccf9af58276",
  "quality/baseline/states/linux/T-40-dawn.png 347293450423c11f3c207a0d4de8dd0969f6a1d3a3c42dcd8d6db9063c634e9f",
  "quality/baseline/states/linux/T-40-ink.png e082d873cff1031dd0a3f30a33b08e6ee814ce1039af423d775d832782425b93",
  "quality/baseline/states/linux/T-40b-dawn.png cb4f5d85e5d067a63d849e6e0e58791cf71c2c222265d78a5c9d77783cdb8b1b",
  "quality/baseline/states/linux/T-40b-ink.png f3aae55d02e19db3d3874e97353b3f8cedbc973b2d704990d440deb39113f90a",
  "quality/baseline/states/linux/T-40c-dawn.png ff58465b64b58b28f6cdc69dcae416fe47fd63ae355f20cf82efcb310b648a3f",
  "quality/baseline/states/linux/T-40c-ink.png 77cdff49785a5d35ae5846d10a04ec21339a082ca44e49ffb775e46ce62ea0b3",
  "quality/baseline/states/linux/T-40d-dawn.png 43e2598dfeff68104d33d866237ed3a10b49bfbdb0db121f1ae7422eff5b3d9d",
  "quality/baseline/states/linux/T-40d-ink.png 1ec003410905558fac3099de96fb98772447438ac842e70c7f8826d9f3beb5e6",
  "quality/baseline/states/linux/T-40e-dawn.png a51541b7f37f74002b45690e508e538ae9dcb2997e9dfc4670fc40eb053fc1ac",
  "quality/baseline/states/linux/T-40e-ink.png 9ecc26c991cfab0b6420e23088a89364df40a517340a78f67c15f94be5cff564",
  "quality/baseline/states/linux/T-40f-dawn.png 6188e27af941667b182e70371438676f4aa5f608050f0256224055b83b1d6bc1",
  "quality/baseline/states/linux/T-40f-ink.png b195a219ccfb12c91c7062688180eaa10a2864fd510df9363b16047d179a9cbb",
  "quality/baseline/states/linux/T-40g-dawn.png 06ec0625022b9db4d2705f7a31408f4c41dd6c3c2440bf352de08a69e9f6cd00",
  "quality/baseline/states/linux/T-40g-ink.png e88425c840dea017358497af71400a78aedea3c135874a0f6e90289fe4c76c06",
  "quality/baseline/states/linux/T-40h-dawn.png ef82614af67b8d854cfbe77355aaed9a9b4a157bcdd741058b258e2d35254175",
  "quality/baseline/states/linux/T-40h-ink.png 9c7fd86ace3798568c45d07f1572758cd72ee58ce10c256bc58361d919d3d40b",
  "quality/baseline/states/linux/T-41-dawn.png ee78915175565a8cfc4bf128773d8ec0f0dcedc92421ac46b64d9e3bb6d89c3c",
  "quality/baseline/states/linux/T-41-ink.png 5fce4311302fdc6e50bdf14dbe73c570d10223a53bdf314837b2e2b840a12d07",
  "quality/baseline/states/linux/T-42-dawn.png 4c5e7bf24dbda79b626d4c545f757d1c362a18810a82c5f2fab3f41d9a91a25c",
  "quality/baseline/states/linux/T-42-ink.png 486e115839162f8c31c4d5541f6a165adbf47b1d07d1128cc5e58790f67755fc",
  "quality/baseline/states/linux/T-43-dawn.png f8041ff35f6a6eef65874240b686d7856028f4bdc89356737114e7c010362fff",
  "quality/baseline/states/linux/T-43-ink.png e35f8a1d15cf23ee9ef033d3aa8a19ffbf4215176fdd52098ef6ce31410e723c",
  "quality/baseline/states/linux/T-44-dawn.png 060e610fa3a4a41564f70ed7093f95412da58f834d7c604443ea4982c972181a",
  "quality/baseline/states/linux/T-44-ink.png 9739ef533dddd2b383e586875bb1d2f13eb461b6069ced237ca763ffbbdf3b2b",
  "quality/baseline/states/linux/T-45-dawn.png 879bfe7b3cc610085f8e4299a7e4c27d18890daeef19cdd95520b3e7e4515efc",
  "quality/baseline/states/linux/T-45-ink.png 59de7af740224bba51d34e80df7abe47e6b09277a93447cb7579e36f461a41e0",
  "quality/baseline/states/linux/T-46-dawn.png 1a0f60d8d4b349d9a42230fa3e43efc95f6e27603c39dd177ff19a429cfbd4bc",
  "quality/baseline/states/linux/T-46-ink.png 8c5ce75495037896274164e308cdf19da8f12fad0cadd61fbc068e1464ba1d5f",
  "quality/baseline/states/linux/T-47-dawn.png 2edaefe8e022944c0377924b17be158054d8b87a10df057dad12500ddeb5f1d6",
  "quality/baseline/states/linux/T-47-ink.png 1315987e66273dde08154f806b9ca75c0e43b34c34bc06a2e7849e9e028bea2e",
  "quality/baseline/states/linux/T-48-dawn.png 1a057a04a72b093b9cf0bc0b2d96615289fb7339483fc93e12e37bcb08c88a88",
  "quality/baseline/states/linux/T-48-ink.png 3ee34e04595a03adab6d28a4c96ceac40a7ad56fcec6a7fde1581e6a8779e18e",
  "quality/baseline/states/linux/T-49-dawn.png 9433fb9ff0e0d6ba3219158e7543c4ef603ffb75f0227e0aa2a7a5962a7a3e23",
  "quality/baseline/states/linux/T-49-ink.png 2e80689d721a5563b2fd9733670fbfbac2a2adfef74bf4a7129808049e44800a",
  "quality/baseline/states/linux/T-50-dawn.png 8071fbf738e60a787e480c34760ad86d401908c2853dca14dca83145d86795a1",
  "quality/baseline/states/linux/T-50-ink.png 6c903df4460f60b0ffbadbe60dd06a6a8d4a4927f7f1891a2a2e45e90c147c69",
  "quality/baseline/states/linux/T-51-dawn.png fc4f6db05687c170949ea59943daa9392b4c2ae3bd33a6a7048b754e35c0c540",
  "quality/baseline/states/linux/T-51-ink.png f245e6af7d0aae04810f95521c8cd0785f7c2e25c87b22107ae264ce2378236f",
  "quality/baseline/states/linux/T-52-dawn.png de9a11fc12adafbab8fe969a086e815b1e6366c588d5e0d9db6e32465cc027dd",
  "quality/baseline/states/linux/T-52-ink.png b315e340ae2f69fba745f59f4c9178cfa64ca909bec3f182eb6ffe31a273252b",
  "quality/baseline/states/linux/T-53-dawn.png 54e38fb910ade7c7fc22f1f3d35e1c00338667352a4a65e0d747cac09cb53ffd",
  "quality/baseline/states/linux/T-53-ink.png 34737de1d1837a81e5840773cc0e2e44c3eb0d5234be6063f7256d994fc01292",
  "quality/baseline/states/linux/T-54-dawn.png f39d44740e5bc28f0bdfafb886b3ec700a4129445c3f430cc206ff6b2d94256c",
  "quality/baseline/states/linux/T-54-ink.png b43ce0dd5d75a8de2c986f3590e1aca5273ac3efe708b6b4a1b258ae4441cbf8",
  "quality/baseline/states/linux/T-55-dawn.png 1d85566b2a4226016257163b692f372af38b81f79364d147cedd2a271e0dc18d",
  "quality/baseline/states/linux/T-55-ink.png e217613afe28468e5b040664cbc3978af6781b70834da8698873fed5561ecfb5",
  "quality/baseline/states/linux/T-56-dawn.png c8be64ca0dc4853a78f408941b69773ddff5b835c1c48ab0044bb22d7f9b58c5",
  "quality/baseline/states/linux/T-56-ink.png 0cf3e1233e7f38fc62185f890ec0e6abb15b3af5934b892d8a2cc3701ab79929",
  "quality/baseline/states/linux/T-57-dawn.png 8b3f3e3f1460eeb84a367e45589be06a0b6a7a0da926bca1053b045e97051e79",
  "quality/baseline/states/linux/T-57-ink.png 752560e4d772965efe1d8aa90337cf8a81c626969f0b6b7a250ce3c1461c187d",
  "quality/baseline/states/linux/T-58-dawn.png eaa336e38c47153c93d78f037f80608f60f350cc67cc077926f9094f46ce5a45",
  "quality/baseline/states/linux/T-58-ink.png d536b44aa1e00b1a4c938b4e85cda766dd0b745d3f4b7faaaba294aebffae157",
  "quality/baseline/states/linux/T-59-dawn.png 75c596d44322416c007c6fa28909a03ee482c83746c0407e22e5dfad7c02d7b0",
  "quality/baseline/states/linux/T-59-ink.png 7ff94824366b9db93e2386c96c98562b635c517f19348f88a1bfb539d439bb1c",
  "quality/baseline/states/linux/T-60-dawn.png a638b71a4c5d252817e200e7eaed22360a04cd847554379577dcf829c3c871e7",
  "quality/baseline/states/linux/T-60-ink.png d0b8b581edcf9688845992dfceecc0bb501040884c01aec12e0b645d2aa334ac",
  "quality/baseline/states/linux/T-61-dawn.png b716cce91998d457fe57a0074d8cc31357bdcaaf892226888e08be8fa623ab40",
  "quality/baseline/states/linux/T-61-ink.png 4255817726a312331a1fe14d4fb243a430422b484dd77e3c04563003edd4dd31",
  "quality/baseline/states/linux/T-62-dawn.png d5dba47e14c8608a3d9b6189c1e261728fd612fa6d4289e7b891e15184bd0ee4",
  "quality/baseline/states/linux/T-62-ink.png 18aa3489f97265c0503495b86792462059365d3c28b13e5e48f4bdf7b7934769",
  "quality/baseline/states/linux/T-63-dawn.png 2452e40dc6d97bd929404d9fd0738c7d113385c856bcf2787eb408093f12925e",
  "quality/baseline/states/linux/T-63-ink.png c89906e0237d3a27d195eac60b361eb2d5f1b963590f60516fa85e45d94fcae6",
  "quality/baseline/states/linux/T-64-dawn.png fa662fad59f035d305b1bead70d4dad6c6918816178191fdcf0c2f4270d4cf80",
  "quality/baseline/states/linux/T-64-ink.png b364bc798d6abc9e87fe804e174a960423d4517e701da75fbae7e59e60a8255b",
  "quality/baseline/states/linux/T-65-dawn.png fdc4e8e913692c01715cffbd36f2fcec22d531a5e77f182300d148570e2218ee",
  "quality/baseline/states/linux/T-65-ink.png 1775b05fbad04f078a192b38e63767ea990e91af9b7e1d734d854cfd0116cce1",
  "quality/baseline/states/linux/T-66-dawn.png 60dc0cb56bb3d7513d2aa792a7e33d4520ecf77346a790ffea1c26c4d4bf393b",
  "quality/baseline/states/linux/T-66-ink.png 13e480ef9553f720f2c6732a99a14c54d74ba041c3ffcd164828dd267df5d765",
  "quality/baseline/states/linux/T-67-dawn.png 32893dc51a3d0e4571fc6345f0d2be176235bab723922943639db930470d7ff9",
  "quality/baseline/states/linux/T-67-ink.png abc5c9a21ad197b3040879db99f64bbd78db60936c17bdcf139810f6529c57f8",
  "quality/baseline/states/linux/T-68-dawn.png 0e5723948b5ff51c62d04dc2dc7d7291e64006df02791782ba1e77d500b054a5",
  "quality/baseline/states/linux/T-68-ink.png 8a14b516b00a4b668935f95daa09a514ca830ab3854415c7f3ca4fb89a19fb43",
  "quality/baseline/states/linux/T-69-dawn.png f8bd28e89661bd55f950addaf63a0f15d468fe1934fb0a915c8d2edfbd317622",
  "quality/baseline/states/linux/T-69-ink.png 9ac1210048ceb77f491cb9e972b3778b56aa450a4cee4de02c26469599107973",
  "quality/baseline/states/linux/T-70-dawn.png 88fe4ef72b66b02615bd3c3200479745976ea3b2368614e872624d8d4e377366",
  "quality/baseline/states/linux/T-70-ink.png ddbe8c807d76319f9bb63296f1360766a9aac0fb02eeca7618c2ce15f1b29f3a",
  "quality/baseline/states/linux/T-71-dawn.png 9d168a129937f1cfd736e13ca7a991139161777f2f110344c2c2b13230d6102b",
  "quality/baseline/states/linux/T-71-ink.png 994636c0a168d94ffd4fdb994bbde800502da54d284b47bc79ef889387854dbc",
  "quality/baseline/states/linux/T-72-dawn.png fc3f05befe7e68dbf00aea28c04e4024c19fca8d949fd5bd7633828f9b8d5cd2",
  "quality/baseline/states/linux/T-72-ink.png 39274a256f7277165a4cb80581e3369c20bc5eae58707dc8b59bae99f8a7d543",
  "quality/baseline/states/linux/T-73-dawn.png f0a4f608a391e63bc567f2218b9dd566412aae64559504e982db941324b3037e",
  "quality/baseline/states/linux/T-73-ink.png 62ca9cc70bdc9b6f217de50828e708890a3e8d347a3199b4413aa298e4b0bae4",
  "quality/baseline/states/linux/T-74-dawn.png ea561d04065e6b6c55714657c106181601efab83ac5a2fe273bde05dfdf19cc3",
  "quality/baseline/states/linux/T-74-ink.png 49d83558530ec7f5f4155a324c88febd018af1dc3217f7ac3920c54746913a89",
  "quality/baseline/states/linux/T-75-dawn.png 46a91bdcf36205f3386ff2657b7e7e5c74395b4a28d6d560e9a9a0ad1e6f9738",
  "quality/baseline/states/linux/T-75-ink.png c23bddb0b853aa2efc5fdeb66c87912fa0ec325f311195e1c39b14cd0a7082fc",
  "quality/baseline/states/linux/T-76-dawn.png d55b244fdc5aff827461ee8fa1b18c2a869b243feb6ebed59aa720e67c526544",
  "quality/baseline/states/linux/T-76-ink.png 1e58bd0bc898ea65fa8a9266c83bd5b9cbb65f9bcfe381f0e78dcb1cc4f7ab22",
  "quality/baseline/states/linux/T-77-dawn.png a8bf408ac3fb0d8f36bb0a4ae75f494ddc875f2735c99da8bad033b20aafb449",
  "quality/baseline/states/linux/T-77-ink.png 4ff58580eeab24ca5469534636fe01d882f9e8d4432256608daef1c7823caa6e",
  "quality/baseline/states/linux/T-78-dawn.png 085f170ddda1d328f89c1f95c6efdeac2e07aba47f1a29fee69b094cb3c5d47c",
  "quality/baseline/states/linux/T-78-ink.png 02518e4736990f3fc739558b3ede1d5acec5213422ddd120ee3545bf53cd4b93",
  "quality/baseline/states/linux/T-79-dawn.png 87756a196b2ecd227b37910b6d27e554908547fad4e87336a23df5245fab7913",
  "quality/baseline/states/linux/T-79-ink.png e16575bedda0050d55f97d94b8e1281fa13b3cee800590d65f9031b7352efcc1",
  "quality/baseline/states/linux/T-80-dawn.png 688b235593be5339098cbc7d332c37f6e6e4633ad00bfa9c514b7c87029281e2",
  "quality/baseline/states/linux/T-80-ink.png fac042fbed68fa5562a0542e3a1a6af8120eed63ba7c1ff4883a90eca0a985a8",
  "quality/baseline/states/linux/T-81-dawn.png 86fd9c37b8c2f550267a451d6dd4724b94c5a42425a771fa74f8ee47ff5dd1a6",
  "quality/baseline/states/linux/T-81-ink.png 3a20cff7518254a6d29bca41eebb825418ce1ba42cb88cfc8078be305c9f6f8b",
  "quality/baseline/states/linux/T-82-dawn.png 4d481d737c8c295c076aa2d7b1395fd25a702b5f1323944487671ad2391b75e0",
  "quality/baseline/states/linux/T-82-ink.png 785048b6bc5786441710859ce2aaaf9d166299bf558c0abf7be6cb95ba2d60b3",
  "quality/baseline/states/linux/T-83-dawn.png bc3eec7423801b439ab2061b55535f836065c861e4630b28be1b2e32130f27a5",
  "quality/baseline/states/linux/T-83-ink.png 9a9053543f0f10b20acfea406f7a68dd022010b65b834139cd2517b8fa514589",
  "quality/baseline/states/linux/T-84-dawn.png b9b36107ebe6d6307125f62e11967e42935a12becf4f7b117118bfb7b4a5ed94",
  "quality/baseline/states/linux/T-84-ink.png 651d3762fba43d1a4a9159936b5074aaedb841b94830692883d3de28294012e1",
  "quality/baseline/states/linux/T-85-dawn.png b905b961f7b17dc0c7b16a28bc6bd58ae6aa6f6f06ec07c72b82af3684fee9b5",
  "quality/baseline/states/linux/T-85-ink.png 708aac7d04c87f9a62641f60e8117eb826cb3bad897743221a52a34287611459",
  "quality/baseline/states/linux/T-86-dawn.png 1ee516a1734fd383c147af0283e535bdc0169a50325273f92ed2483faf19c290",
  "quality/baseline/states/linux/T-86-ink.png 77a0442a58ef877629e9a7823d14060b6855789f2e9cdcf9061f8299279a13a2",
  "quality/baseline/states/linux/T-87-dawn.png 224fa0b45cdf539455f867c66c7e49767c66cb7df66849cce3dca43404e23c79",
  "quality/baseline/states/linux/T-87-ink.png 711174397853f37645c3753c9bbe23c3c74579a4fb99edd98d5ff3078721b1ff",
  "quality/baseline/states/linux/T-88-dawn.png 0a5a23d7c712684b67e3c6a45c018bf7bb4cc8c27d606940ff5fcd04dbf1a2b0",
  "quality/baseline/states/linux/T-88-ink.png edfba60056b41b3a113443c977c1cf63548a940de2e88496cc1bf503b526975f",
  "quality/baseline/states/linux/T-89-dawn.png c856a9a3a67dd37c634b1fd7862415d82ebd0811a30ec7683de5c3a9bbda3803",
  "quality/baseline/states/linux/T-89-ink.png 0867a8f8dd68309b3dca14fe7fc6312825dcae4367dc11ae40fb4550dc1b55e7",
  "quality/baseline/states/linux/T-90-dawn.png 0f7922b26d6cb0116260002b3056b043a13f80861265c81f1ffa5f29a9e33e97",
  "quality/baseline/states/linux/T-90-ink.png db1537f46b7daeb9b61e2936780eed3e9555c0566c66cfb2591bc4407814f43f",
  "quality/baseline/states/linux/T-91-dawn.png ffd00d69a3415801245ec42fd4fede596142c9d404c4fb5e674959b72901718f",
  "quality/baseline/states/linux/T-91-ink.png 27bdf703ca9fa479d98ee59ce617e029415486fa417224ccd076a3c6e2173d1c",
  "quality/baseline/states/linux/T-92-dawn.png 45d6ce6c2172fda7b202c54ae9a22cc2a0ec74e3e598e79b3733a501595238be",
  "quality/baseline/states/linux/T-92-ink.png 8e3f9322fe58431714d104b261173f8437fd48b173813ad805d7217adab75dde",
  "quality/baseline/states/linux/T-93-dawn.png 89fc85964aeb8cb69cd274940a2a3cb7e5ca77f0639d018030c3eb8bca1ca70f",
  "quality/baseline/states/linux/T-93-ink.png 719dce7c975a7c8924ad8d0514f242e6675ba53a5c02bebcc1b45c2a21d2a5b3",
  "quality/baseline/states/linux/T-94-dawn.png e8294f01c98fcc21277d8548756f0e068db5e26b54eedcbeb69b667b11967506",
  "quality/baseline/states/linux/T-94-ink.png dcfb90ae5f511b2f62abc23f5d6460ae91d3d4ccd247235eb2dfbf9e7c5d5103",
  "quality/baseline/states/linux/T-95-dawn.png 5e548879b5d968fd54043ba53a116864a6c5db69abb120e07fe17fc9d18ce0cf",
  "quality/baseline/states/linux/T-95-ink.png 4131dc141cd6e9955fe1f723666f8c588781526d5d8287a9d01af3d0e62ba732",
  "quality/baseline/states/linux/W-01-dawn.png 2d8bc692f1e29763c3640c038c98ea433b670809de5392e3508cc2b76e889531",
  "quality/baseline/states/linux/W-01-ink.png be904dc0a05c2b49c498d7b14fc69efb4a8669c408e75dacb07ba87cdb9098a1",
  "quality/baseline/states/linux/W-02-dawn.png ce6b08a6c065de48c5982500f8c4f083168c337beb6b6a430514f3f9907e6f52",
  "quality/baseline/states/linux/W-02-ink.png 618496a58ac1e9b22b36b1405c60b093bc842ee732020d26f942477b113131e3",
  "quality/baseline/states/linux/W-03-dawn.png c765d02c09bf2755ef2a4e07f9a36161632d7590ea9d11b242a9dd02f6d023f5",
  "quality/baseline/states/linux/W-03-ink.png 3aea000870aff19eb525969e186dd47859d1d3e831e662f48ea6cb3b958d507d",
  "quality/baseline/states/linux/W-04-dawn.png a4ecf3fbc919b77f44f34e36ba1dc426e9a23390d0fbf217fa35511a6486a35b",
  "quality/baseline/states/linux/W-04-ink.png c032eb8999bfac162dec2034b5288cf0e7ebe722b0e019988692d51d7e1929e8",
  "quality/baseline/states/linux/W-05-dawn.png 0e837972ad3a9d8f33e59152a607a4e367dc3af3f6725cd90a56f6d63d2f62be",
  "quality/baseline/states/linux/W-05-ink.png d947490c0067c276ad67c82facf9846507388cfc8576757176b0c80b1687c1de",
  "quality/baseline/states/linux/W-06-dawn.png 0e837972ad3a9d8f33e59152a607a4e367dc3af3f6725cd90a56f6d63d2f62be",
  "quality/baseline/states/linux/W-06-ink.png d947490c0067c276ad67c82facf9846507388cfc8576757176b0c80b1687c1de",
  "quality/baseline/states/linux/W-07-dawn.png aa3b9ce03f1dcdd5fd2ad869a99cb07ece3b855d22ad779e34c1871eb6c3c6cb",
  "quality/baseline/states/linux/W-07-ink.png a08903b79597bac94a714999453043ef2b6174b8f6a087cfdb8d16447b6c20d6",
  "quality/baseline/states/linux/W-08-dawn.png e67366c45d3882c3ce9367f6cade320a02efec4b0ec5aeb47add6f06e430d711",
  "quality/baseline/states/linux/W-08-ink.png 05924cad7dd1d90c995bd6d7de344c88220931d4f983df8cde475f8878273f46",
  "quality/baseline/states/linux/W-09-dawn.png e2ed874c1fe934ce5e387a0e464f6ab87e1ea6e4ba873db794f53299db1d67cc",
  "quality/baseline/states/linux/W-09-ink.png 296d4ea1c90279eea023fabc1d2e5415eb4f50c4644b852886af1d69a4c28bb1",
  "quality/baseline/states/linux/W-10-dawn.png 2fb7bcc58ccb51c94b3d337a67f5d5460fb8f81147fa9b286c7ec289532241c3",
  "quality/baseline/states/linux/W-10-ink.png 55b2b95ebdf1cb749005beadf05c37424a9b66a5321541a8a7c517b7b841bc2e",
  "quality/baseline/states/linux/W-11-dawn.png d4c03d86a2a45bb8225a8d7a80290e7e34cfa5b96eecdcbb49c973c4459d4308",
  "quality/baseline/states/linux/W-11-ink.png e48e933f1ccea602f308c698d1e1e8a9c1b6351fef72f7915e6f76929bf1a604",
  "quality/baseline/states/linux/W-12-dawn.png d5290f3d40fd36b3937a3875ca204312fa6fec417dce67d449809bd1ee010611",
  "quality/baseline/states/linux/W-12-ink.png 43c659579b871cd184f29242bbc714712612e845d3ef2d85d3f4818dccf180bd",
  "quality/baseline/states/linux/W-13-dawn.png 289376fcff2b9c1b1e679be3becf67d6b74d76a062c827f6a54997ae8819dcc4",
  "quality/baseline/states/linux/W-13-ink.png c851cde3aa1f1c36e6aec66356647d556d1bc84c0c508d11ba32c53fad75cbd0",
  "quality/baseline/states/linux/W-14-dawn.png 36019f5f4e89225a13dc57bce00aaaadc5b14b24131ba6362134c35df9099a00",
  "quality/baseline/states/linux/W-14-ink.png a2e6309d1b6b9cf02c4e48c65a7507a0f51b165fc5c5763046810d66a2a1d963",
  "quality/baseline/states/linux/W-15-dawn.png 0f011f4968aa644297577dd5c47828e5bb632f4c65fc43f993e4dd79fbd3000a",
  "quality/baseline/states/linux/W-15-ink.png 2283924e95f0841ce0e8bf53460496b282f609778fd3492fe105e0d0431b79e8",
  "quality/baseline/states/linux/W-16-dawn.png 0e837972ad3a9d8f33e59152a607a4e367dc3af3f6725cd90a56f6d63d2f62be",
  "quality/baseline/states/linux/W-16-ink.png d947490c0067c276ad67c82facf9846507388cfc8576757176b0c80b1687c1de",
  "quality/baseline/states/linux/W-17-dawn.png 23e3fe273cd2d8d2bc5f527698d01da98dd55d0c453d94af8645126047079fc9",
  "quality/baseline/states/linux/W-17-ink.png 922d075853eb46ff6da35fea4d0c47184b16c20a94105149b7d02466c201428a",
  "quality/baseline/states/linux/W-18-dawn.png 4f4237ae7bb239f8d927e3875730fc16feb49d87158c0deeebff20658a8d3ccf",
  "quality/baseline/states/linux/W-18-ink.png d000d6875ddf11852d0120eeef6ca8b546c6adf11efc2cb9cdc21785b2ea6608",
  "quality/baseline/states/linux/W-19-dawn.png 3da5c09fd71c087f1735e8b3c831dcc0a7eb975823a2a00047cc522346fd443a",
  "quality/baseline/states/linux/W-19-ink.png 3a3167cebb78508c3805c28ee598258d78401b939d302a525649a775473a252c",
  "quality/baseline/states/linux/W-20-dawn.png a67e281959e731f4352cc6f1c2ba0a822f2c4b8483173cdca662dd9b05c41032",
  "quality/baseline/states/linux/W-20-ink.png 4bab8911515d562d33b49941aad557c5c8c082c7432665ceec41dac858c464b7",
  "quality/baseline/states/linux/W-21-dawn.png 9bf10a8ae50c2e02d28c54076ea046318b9b10a0596fa05fa663db3ebbf30b7d",
  "quality/baseline/states/linux/W-21-ink.png e8d6e776ac7c4b78f97da4a4cd7c6d5595e8618d0bde0cb34e73228aba190f8b",
  "quality/baseline/states/linux/W-22-dawn.png a80a1dd492d3c53b34201198c65a43b1dce4c1af61ff5faf5487c27d74f65fce",
  "quality/baseline/states/linux/W-22-ink.png 9d31657bc0aaec1565cd4bf47f070e38b9c3cee0c088ad55c1a95ed750b0c700",
  "quality/baseline/states/linux/W-23-dawn.png 46da5129597eabaa4e34a72c2d4220b6ee53805abbd4a74f4e0aaaf321085675",
  "quality/baseline/states/linux/W-23-ink.png 40cf603ec414cfdfc9cb984b3584f58916da47c3416a7283477dd0a23facb25e",
  "quality/baseline/states/linux/W-24-dawn.png 3243e17a5e9d6828f324b9020c23e68a29b5b9f8d137df2bdbe27efbd548b5b1",
  "quality/baseline/states/linux/W-24-ink.png d81090f1102cfdb66850672e256d7ca285f079c58534b9f073b88a2aa3101c26",
  "quality/baseline/states/linux/W-25-dawn.png f8c8e72c89dc95320dcd1e2c08ec731bf24da9a44466a138b49e7135017f6361",
  "quality/baseline/states/linux/W-25-ink.png a116dfade057621747ae77698210baab21a74f9085e61e73851e491d48f36523",
  "quality/baseline/states/linux/W-26-dawn.png 8607f6832e1f7da704588f01c46a15125c628422c0bd7029aecfde3b38126e5c",
  "quality/baseline/states/linux/W-26-ink.png f493e220e4ffa5ce048006c2f8db4d078eea7272a8cef397ce92c07969b687e1",
  "quality/baseline/states/linux/W-27-dawn.png a87a20082e030308e5ca5ce882027221997bfa2e6fb080c3506e5312fd05cdb2",
  "quality/baseline/states/linux/W-27-ink.png e80a7567d782bea21b59031455e37f3fa6e5fd4fa80698b785149628eb2b4ec4",
  "quality/baseline/states/linux/W-28-dawn.png 8f85050116b8ecd4bbc5105f919176a9ca33714308426a1957fbcfa3d499bccb",
  "quality/baseline/states/linux/W-28-ink.png c45c04ba0e02f179433a44d0d25ab0ea807025ae32070bd4799de0815f7ca110",
  "quality/baseline/states/linux/W-29-dawn.png 601fa25613164dbe5ca4b5235cf3eff9fe4379ff800a2bdd28647c3497376b76",
  "quality/baseline/states/linux/W-29-ink.png 79c72072751525ca9acf580303202c8d5c21c221bda9bdc4c2341d37d27d268a",
  "quality/baseline/states/linux/W-30-dawn.png 437b837ed781a134019783125ae13dd0003ea7fe229c3a626804792dbc51efca",
  "quality/baseline/states/linux/W-30-ink.png c4213bca1451b1b0f0049ed261e78c5157e4fa090053930e3ed55384d6cdb5c7",
  "quality/baseline/states/linux/W-31-dawn.png 196dbef561329fa50f90378f171a144b4619dc54c768cb82fd2a9363aea0b67b",
  "quality/baseline/states/linux/W-31-ink.png 48f4e21f4ec9ed8c0a7a276ccbc172a10fcc1a0c3e1fb25739b7feb664ddafe6",
  "quality/baseline/states/linux/W-32-dawn.png 2998d1274159df12a5419b4b1eba7e201822255ce46d9c577be26c02d98ad5b4",
  "quality/baseline/states/linux/W-32-ink.png 4190d7996bcc842e4a37d36acfa58b07b16797a9fef324a481695d58c3aff49a",
  "quality/baseline/states/linux/W-33-dawn.png 12ba43db685c800ccd1762abc19896b77cc5fd4935967a32a9cd22db8b90cb26",
  "quality/baseline/states/linux/W-33-ink.png 93e0b31675974af0d2dcebbc206c912219ae15faa6883bb0f4656ab3a5882ea4",
  "quality/baseline/states/linux/W-34-dawn.png 6ab121c6fd67f9f0ba648021ab410199a1bbd2cc9e3c4786b4ad7ac1785083c8",
  "quality/baseline/states/linux/W-34-ink.png fa790da12967cb1b846e605bebb043c5ef94690237c4f2eef66863bcadfc7b46",
  "quality/baseline/states/linux/W-35-dawn.png d40456897b26f07fe0803ec63095be1068c1a0f0c80b8978c59d591522988a6f",
  "quality/baseline/states/linux/W-35-ink.png 8ca52db14cb797a5297fc188c363115386c64204c29498351b88120ae6866e1f",
  "quality/baseline/states/linux/W-36-dawn.png 536be06908c297825ad5fe329202b918c3d804e966eebfcd37360950804317d5",
  "quality/baseline/states/linux/W-36-ink.png 87e7711d9db499dab3c067fa5faeb4769309d9184f3c12eb161d2a2dac7fd96c",
  "quality/baseline/states/linux/W-37-dawn.png 29168b1972e8c2786e2e21575178ecc0931f1c2227ee8b128d96f0678052a168",
  "quality/baseline/states/linux/W-37-ink.png e6365f87ab83d82b280d22e4385a02b3c19521fa7e6d197b45b45679c3735e85",
  "quality/baseline/states/linux/W-38-dawn.png a46526979ba79286cc49f129ddfbfcdc25458d463c02b46e596fb053b32f86d5",
  "quality/baseline/states/linux/W-38-ink.png 9ff232f278356cd740819d485002a5b051d61a7dbfab9564af85b7971d478c80",
  "quality/baseline/states/linux/W-39-dawn.png 8c2be311aed303aa4f5222301de0fe23458546d3b285fbf4841911a5d0aebbe2",
  "quality/baseline/states/linux/W-39-ink.png 071e5051a09c18bc8d64769b1f4858aa90e8637a0abd3995c2c87ee5f2f11152",
  "quality/baseline/states/linux/W-40-dawn.png 498a0e018ea0899f546d8855b21ace165b62c9508b2d1c6e23a667c7fb3ae3f0",
  "quality/baseline/states/linux/W-40-ink.png 060a9a5464ebdf46214b6ea2383fda46a8d81f0638baedac52f0cf57b985e997",
  "quality/baseline/states/linux/W-41-dawn.png f8c8e72c89dc95320dcd1e2c08ec731bf24da9a44466a138b49e7135017f6361",
  "quality/baseline/states/linux/W-41-ink.png a116dfade057621747ae77698210baab21a74f9085e61e73851e491d48f36523",
  "quality/baseline/states/linux/W-42-dawn.png 81530aee39715df42c5e184b3dcde32e379fff1362f5edc3e421121c3142da58",
  "quality/baseline/states/linux/W-42-ink.png d8ecc1ef0dbe13495c31488909fdfc552c88cfc8dfc696ea3d29830484c468e2",
  "quality/baseline/states/linux/W-43-dawn.png a80a1dd492d3c53b34201198c65a43b1dce4c1af61ff5faf5487c27d74f65fce",
  "quality/baseline/states/linux/W-43-ink.png 9d31657bc0aaec1565cd4bf47f070e38b9c3cee0c088ad55c1a95ed750b0c700",
  "quality/baseline/states/linux/W-44-dawn.png 065dcd6805b4301eaaf11e9893f4af69647191d4c43980bdb209d70d089ab574",
  "quality/baseline/states/linux/W-44-ink.png af01a222d6d74330afbfa768f85ff642de72d1fef39d7f5523c6ea0d0c74a2f0",
  "quality/baseline/states/linux/W-45-dawn.png 0e837972ad3a9d8f33e59152a607a4e367dc3af3f6725cd90a56f6d63d2f62be",
  "quality/baseline/states/linux/W-45-ink.png d947490c0067c276ad67c82facf9846507388cfc8576757176b0c80b1687c1de",
  "quality/baseline/states/win32/C-02-dawn.png f3d87db6de46b5d3f570fd037d031e9255520dad388753262438bf96e18c3164",
  "quality/baseline/states/win32/C-02-ink.png 67c15143c6695618a593df3a64582b50f17849fce39b73f6ba220651b1f078a7",
  "quality/baseline/states/win32/C-03-dawn.png 711f6a5763e52541aa40f8f6f550d43dfc41a172b1d5945feb64f914a88e86d4",
  "quality/baseline/states/win32/C-03-ink.png 4946718dfd865a65f269e9cfce8fca4feae4eb2ab4d9d40cf7965b0b601b7a73",
  "quality/baseline/states/win32/C-04-dawn.png 5897559bf6a528d485a405e86394f543d533d8b0de67ee2784d82962d9306ef8",
  "quality/baseline/states/win32/C-04-ink.png 5caeb4dbba46f5f5c6ffdd8a729a2e8fa88862222277e19c816113ba376e9f35",
  "quality/baseline/states/win32/C-05-dawn.png 2dc1e8f21fbe01c0b5a9e6c7af4397fb8515033d77ad9a52bbe92a56d4dcde3e",
  "quality/baseline/states/win32/C-05-ink.png 653be59d82cb01dbf847c65aa53a7efffa915c6031c24360a29b245758b8db07",
  "quality/baseline/states/win32/C-06-dawn.png 3fc4b9a53347333ac803151c644e6790500c08f90c17f6a412abbb0a783ac1cb",
  "quality/baseline/states/win32/C-06-ink.png 96cd212b937f62581929478b596e4812b7b1b4124e8861b8d71f48dce4e2b6da",
  "quality/baseline/states/win32/C-07-dawn.png 4c96bb7ebb24b40b2a89811bf076abbcc8dfd1a9bfd395c7a187181407c991ce",
  "quality/baseline/states/win32/C-07-ink.png 6ae22a0fe5bd2038a19ae33c7d85e24a40d610f888f5c5d762b25671134de1f3",
  "quality/baseline/states/win32/C-08-dawn.png 59bdc1e0b376c7bbe43945eef7bd7223d0dd7cc27fc89417f92cc07ffd40430b",
  "quality/baseline/states/win32/C-08-ink.png 79528513845557d43bab51106ed8ecdf7a6560d6e97ee6c494b9b0d7f849da83",
  "quality/baseline/states/win32/C-09-dawn.png e5982e71bd76f67053136278e57d4f063f36dbee89ef7f7208863b22b4cc6715",
  "quality/baseline/states/win32/C-09-ink.png e6e66524b155419680f4a8c6bf84fc8aa7cdff3447cc8ddf5ff2ebb0fc5896d7",
  "quality/baseline/states/win32/C-10-dawn.png 6f4894b5ec2bb167292842a9fd20395317c028f47a9b98648aacac5bc67e77c0",
  "quality/baseline/states/win32/C-10-ink.png 44dbb86debc16919fd42e7ea66f4533c6b0b87e31b9a92a6744071f5b71d1e1f",
  "quality/baseline/states/win32/C-11-dawn.png fe8d45e3dd65367f3ab01b9123b20feb8f63ac1e61399ab5c31f083b6898173a",
  "quality/baseline/states/win32/C-11-ink.png 298978d5fda8c03689ee687b456b18f469e608f43b7241a958429e2ddd366019",
  "quality/baseline/states/win32/C-12-dawn.png 99cce8b92427f8042441b8d938f113950f4919f2044920f98fbda7325821b3f5",
  "quality/baseline/states/win32/C-12-ink.png 608eed8d2dde7cabcc170790f34cf95b158a397152aa6f298024179f061c3927",
  "quality/baseline/states/win32/C-13-dawn.png 1929b1ad01888c394d2d890c535326c5b2a8849f32815f207376cf64c8ee00b5",
  "quality/baseline/states/win32/C-13-ink.png f641427831b17571f4b2222d0138ac4630df2f7cffba8cc602d9900577c788bf",
  "quality/baseline/states/win32/C-14-dawn.png 4dc059cfcbb39e82a2f6cab7a3082e3c3160c7d1a7843f931cf25389582e6daf",
  "quality/baseline/states/win32/C-14-ink.png 414fd352fe0aaacde42e81b8b0ac6a2b85075b69e2f0d6153e5b05f8488130e6",
  "quality/baseline/states/win32/C-15-dawn.png bad53e70e5b5103f25db1b21620fb67cbcb3db68071039af5470af7cf4eedf16",
  "quality/baseline/states/win32/C-15-ink.png e955d7f1abd6803ba18e95c6439c3932f1850e51384e56a6a750626d509aef3f",
  "quality/baseline/states/win32/C-16-dawn.png 1d2b8dfb377a010c27b6fb7db066363c309a758c33e1ec582981a7ea72dc01e6",
  "quality/baseline/states/win32/C-16-ink.png bf417be9b58ed8f6a84386d1687ab42446125ff93b1df8d9e03736b9925a953e",
  "quality/baseline/states/win32/C-17-dawn.png 0cb5437c2d81b6a99c5922f3657749f84e0b621cffa701be7d7ac44ea668b884",
  "quality/baseline/states/win32/C-17-ink.png d2712a2e9304fe6e5631dc41dfa510b0ed86df0de56aacd5547b5de1fd92cc35",
  "quality/baseline/states/win32/C-18-dawn.png ffbff45edbf55c106b12a19626af648ea99b39406b4d35882b1b48dd7ce8d3c4",
  "quality/baseline/states/win32/C-18-ink.png f5616b04b46df2eaa1c8e6ac32f2802b15309ca4707305d8feb0cd97939b5945",
  "quality/baseline/states/win32/C-19-dawn.png 5d92dd76d77769994875b80b3843198aca69ebba0108257644ce81130e3de067",
  "quality/baseline/states/win32/C-19-ink.png e0f556d40a8914efed6a118faa85c2c4b0c0b26d1a825763471b70975bd3ca2a",
  "quality/baseline/states/win32/C-20-dawn.png 071187beac89d6341979372f6bea53d66098707bc354b3ae1a54f901a2491634",
  "quality/baseline/states/win32/C-20-ink.png 0ada33af515e7b68cae886bd20abbb2e7911409564788ef46b9f5cef46a040d3",
  "quality/baseline/states/win32/C-21-dawn.png 0ca09841efcf6b8ed8e4f2e7a4488521caaa9375352d3f63ac4f61ffaa4a8928",
  "quality/baseline/states/win32/C-21-ink.png 10c985d12e9a0e98ca6252bb42d49c64ef68c461ea42d1ece6f8938e98315da1",
  "quality/baseline/states/win32/C-22-dawn.png 1efa912e15cf45655f7f6dceee630d448fc96c72a9c7730e3110cfc2e923d503",
  "quality/baseline/states/win32/C-22-ink.png eeead21fccb4aa4f86a94e672b37a66cd7999bb52b9f6d65fcee73129e6cbfca",
  "quality/baseline/states/win32/C-23-dawn.png 43448a91d4910ac99a184e3bbc5f73b07a17c211c4eacfcc60c5284e50c4178c",
  "quality/baseline/states/win32/C-23-ink.png a4bcf3cbeb0b21656c176ec4931a8928c9b2f298937500eec19599b9de947d43",
  "quality/baseline/states/win32/C-24-dawn.png d480674ba2815ace4b27a32189c0a772730adbed25e1900b63a7d9e3dcf801cb",
  "quality/baseline/states/win32/C-24-ink.png 69b4f3a57d4c0c09e6bd7c50dded3a5946f7880334cd849492ac245166945b5b",
  "quality/baseline/states/win32/C-25-dawn.png 6a6eb96d177f3d621f4db6ca931269f7d481076f29993228b75270d77ed8f839",
  "quality/baseline/states/win32/C-25-ink.png b55ca502f1d02e312536657f8ad48dc7932ee3ebe29a0e2139afbf44ccd84de7",
  "quality/baseline/states/win32/C-26-dawn.png ddccdbe9d2eb9babcf2edac9f02fe0f94553de3e22b79e6c8873ed8392d33cc5",
  "quality/baseline/states/win32/C-26-ink.png 61a2a90e09509ddfb2f83b33c262625a4a668a2ae79ce5a2b6f9ba5748d3ef80",
  "quality/baseline/states/win32/C-27-dawn.png 60efd9de12e16524c518d9b7cc91ef2a16d1b5bf4cc56118c0f4966afe562d58",
  "quality/baseline/states/win32/C-27-ink.png fcf67cc8affddc81aa8cfc68b0cb36eaecc0991055ff20d21c60d37128960483",
  "quality/baseline/states/win32/C-28-dawn.png f1728fdc03b802799345cb219329d7390908cf766d51fcd967525096dec3b739",
  "quality/baseline/states/win32/C-28-ink.png 500cfc9bc8a6ded96f57b2ad63b0f021b17af6e95118b01d2b5fcb7e462f5f61",
  "quality/baseline/states/win32/C-29-dawn.png bb739ace41b90b407215d880cd88bfa2b8ea82df579039ed55a398182d2c41e6",
  "quality/baseline/states/win32/C-29-ink.png 06209eb7b5c7283f9cf353131070a694a881f15ba1029f09c2ad6ab22b6ae209",
  "quality/baseline/states/win32/C-30-dawn.png 7ebb27c9a2cc45718678cf3829a550db93d00a1d6c406b92489d3b28d4c7933c",
  "quality/baseline/states/win32/C-30-ink.png 63f3e18562a750f079f0cf5f0f443c3b8137ff7053146348008dbf99995dc444",
  "quality/baseline/states/win32/C-31-dawn.png 16f19a3cb2c3d5061cc6f6139a0c44aefc9400de337ea83f594bfb4961a87b16",
  "quality/baseline/states/win32/C-31-ink.png 7a93f63cb9b0af6fb0d75dd801e61e533a18d52fe1f4d79e6b230b2ce8b2b567",
  "quality/baseline/states/win32/C-32-dawn.png 210d3aadc620cdc0f5a69b1edbbced7d857d6cd8ea61c67e9bd4b36c58fe0fa9",
  "quality/baseline/states/win32/C-32-ink.png 74232dbf6c4b280f94e5e8000eaecf0cf7c833a145a547b51d48824f04d1dd36",
  "quality/baseline/states/win32/C-33-dawn.png 20ad46a8907b9fee724f30ca96173598e692c9aab1e9ca85391a0f24dc723d47",
  "quality/baseline/states/win32/C-33-ink.png 005d10f75f6452a99589ff000e1aef1290d57e7332a88cd910bba7dbdf5e1ea4",
  "quality/baseline/states/win32/C-34-dawn.png cb2cd7d0b3aff2f4b4596872d0ddbeece6a077861f3ed67e7c5339e6226965f2",
  "quality/baseline/states/win32/C-34-ink.png 60a902abf57c89ec5f8c8fc4b61af99131e51d83605b14dd2ba95f5a13ca1a5c",
  "quality/baseline/states/win32/C-35-dawn.png 039eb425b5e56108442762f29bf5ab5c3ce17f9b77c92d5de9e0372f3a9a1911",
  "quality/baseline/states/win32/C-35-ink.png c6b4c511646399412f6a9612be1df5e4b3cfd1847393a95cf30f2d08201a4bcd",
  "quality/baseline/states/win32/C-36-dawn.png 6830f833b8f337c584f00572320d2f61fbcd97d748a92297ddb9dd7be7bf0cfc",
  "quality/baseline/states/win32/C-36-ink.png 4a01a1a7a4d150f1f628f4018b5179c17f26616cb24a8e59f8c8294387108050",
  "quality/baseline/states/win32/C-37-dawn.png b06906117dbf76d4acdc96f0cbb26febef79dd5f529fe5bac0cdc603b2a0e2bc",
  "quality/baseline/states/win32/C-37-ink.png 9f43302aabe8f764bdb53d256e4c086228f75832539edcb26f2c3e559c3e248c",
  "quality/baseline/states/win32/C-38-dawn.png 710362cab10b76e6b6e8fef2822b334dec88aa2b6dd22342bc462b0a6a9c8a34",
  "quality/baseline/states/win32/C-38-ink.png 15b1784a206cc70b838748fee977fdd128bde1f3ac984554785f3725ed8e761a",
  "quality/baseline/states/win32/C-39-dawn.png 060e92f75fafba9e146f6545c17d52feebb3186438ec596f1595090e1c744a8a",
  "quality/baseline/states/win32/C-39-ink.png 201bb1a7ea7d880a40ccf760cb31edf2c34c0d4cb29cee7fbfe2bc5763ae78bd",
  "quality/baseline/states/win32/C-40-dawn.png 188dae6a8e78b100ab39f0c10b33b04e470d0f78a17852a79e85cde22e1f08a3",
  "quality/baseline/states/win32/C-40-ink.png ee0bab4c978ceb834f33a4803c7625e35d02edf93e1feb8ffab3b9b351a64985",
  "quality/baseline/states/win32/C-41-dawn.png 1243351a7b89ae047b9bd9514b6436b33751dee00e2fe1b91ab20aa133094252",
  "quality/baseline/states/win32/C-41-ink.png 86322f41629d2ad613bbb565fbaa0878e16d3e73b1c22ff1daaf0ccad94fbcf3",
  "quality/baseline/states/win32/C-42-dawn.png 9d6b711b84aee8a967aee911a8d80c1d4eac19a4f1cef4e388d84821cbe68ba4",
  "quality/baseline/states/win32/C-42-ink.png 068460212e9415b50268697eb4db1e339239038c94877e5733f12484c14f399d",
  "quality/baseline/states/win32/C-43-dawn.png 1aed199a2644f470517a3b8ca190cda158273e23e6dd73292687c91909771643",
  "quality/baseline/states/win32/C-43-ink.png 295053386b5cb7bbf07fada4eb7373d07046c55c0d58509f2f90695400970f9e",
  "quality/baseline/states/win32/C-44-dawn.png 43f84ce433214a7ab1d78733948cbb92ef0e9882ae728f640fed19711d50efd6",
  "quality/baseline/states/win32/C-44-ink.png 4243bcd747882af623c5becf324e483d1ade68a364fc107545fbf0a190306a89",
  "quality/baseline/states/win32/C-45-dawn.png e7b19e67744a6ce3c105cd75a3c060e7ec8a2aa4aefff3097ece94e892986bc8",
  "quality/baseline/states/win32/C-45-ink.png a08ac76ea9a1ea9f9d7e9164640974e501da343c40634fd57580b136754de53a",
  "quality/baseline/states/win32/C-46-dawn.png e02e414f009dfbd63312786a5a7086b35f3831cbd8eb38d6a01aa76be0935a0a",
  "quality/baseline/states/win32/C-46-ink.png 6d621d1a16f620b46daf49ff0dc0734b944c32a1e6873a8b653252d8b0668b99",
  "quality/baseline/states/win32/C-47-dawn.png aa56f090292ba0730f2344bada8151b68a881ecffda50d4b5d2d4160db2e80a5",
  "quality/baseline/states/win32/C-47-ink.png a9db04349da65cc6456e954d00c8a8812cc59b48ec0282c3cb0bbb1cfc7fa14f",
  "quality/baseline/states/win32/C-48-dawn.png 597d7aec92416852c53afc7a76f1c7d6493ffbb9b7b2ad2d74a6cf605d9e05b7",
  "quality/baseline/states/win32/C-48-ink.png adca891077088053f5ef3a129ff3efa86d5ebdd7f29b81a5c984ccddad062c49",
  "quality/baseline/states/win32/C-49-dawn.png 8a498899236cd7ff9e66ea261b755213bbeedad37bdd87ec9fd1f19b38f8bfae",
  "quality/baseline/states/win32/C-49-ink.png ca1444444654d3f8f32b892280e9afc2bbc9fbcf02ec77da096d4a366119a2eb",
  "quality/baseline/states/win32/C-50-dawn.png 02cacc2a6cec386fb685e07382893f57c770c6c744037367780849eb0d7d0f55",
  "quality/baseline/states/win32/C-50-ink.png 6619e9a18a0c8d858e53097c752508021e898c180470531948524809ec3c07b4",
  "quality/baseline/states/win32/C-50b-dawn.png 6639e54fd48ffda746f9d2fa6e48858656781feaf58e7c6df49f71643051d23a",
  "quality/baseline/states/win32/C-50b-ink.png 800fc95108b86610be70dd510139af53b0b824067676cbcde31755a2e05155b1",
  "quality/baseline/states/win32/C-51-dawn.png eb524d65b4d41e45b98269c86aa8d435667cea75364d0a91edc5dbae1b612e55",
  "quality/baseline/states/win32/C-51-ink.png 61f3c6408ab5dd174dc3101fe1b19bba267b41ba690fa459a6e20a81a6b5b2cb",
  "quality/baseline/states/win32/C-52-dawn.png db57a59bf9f350a42d7e777ab8abcbd3abb34a99e69908d3e026a912b991d319",
  "quality/baseline/states/win32/C-52-ink.png 848f3683eba2ad3a3805b125fd01b13df210e73a799229157dd220062d055122",
  "quality/baseline/states/win32/C-53-dawn.png 7a92b55aaa182aa221e383596c85f2baf45cb76cf2f3c78fd05d62d614ab3a97",
  "quality/baseline/states/win32/C-53-ink.png 6c1e6e967162a618069aa05a9321fd4e65bad9d07ecaf47cf36ec1ef256d3ce3",
  "quality/baseline/states/win32/C-54-dawn.png 7996054dfdf7be243e6b14e1d9b90b25d349f02e9bd0cac44d3af5b3db96e643",
  "quality/baseline/states/win32/C-54-ink.png 8c60358fe8394aeea53519e9f1d6ed5bb1c6e58efd46b850a9a95db765fc6225",
  "quality/baseline/states/win32/C-55-dawn.png 7128b9edda8cade487b200b9e0d5d525d754d7a3e9ab46b8fe5d7d7b9ae9b0c3",
  "quality/baseline/states/win32/C-55-ink.png 8d0bac720e54b1af5e2886a5fb772da40928568e4dfb3effb206de30a4d7d9ae",
  "quality/baseline/states/win32/C-56-dawn.png 6fc2a17a6091bd747821bcaed15a828ed4dc01b9e92e4f10766efd643ee3f24e",
  "quality/baseline/states/win32/C-56-ink.png fb2df5c9d795519b558cce4d9b769080e045cda6ce0a5b62c62079e40b71c344",
  "quality/baseline/states/win32/C-57-dawn.png 975db8cce7fe556511bca71bafe5bc5d25497fc70c2afe35e58414b87eb6bb54",
  "quality/baseline/states/win32/C-57-ink.png 9a12d7071569c8d19c254076842fa4137bf02ff1502bea8c9a418cb73eaa9da7",
  "quality/baseline/states/win32/C-58-dawn.png 78535be05db70f83aa3a4ff7edad033e2d9de0903c2fe8de86d4335d0c1cc2d6",
  "quality/baseline/states/win32/C-58-ink.png 9b1dcfb202b59b48a33a67b638d98266b937eca7ba4aa7ea3ca4291877201095",
  "quality/baseline/states/win32/C-59-dawn.png 90f770974eda4ef43619036de801992e5b702dc5065da425babeb79d52339bcb",
  "quality/baseline/states/win32/C-59-ink.png 3f063de1db80d1b9fad00913f838d04f127447e7eaafe974071c6b128fbed5f0",
  "quality/baseline/states/win32/C-60-dawn.png cd12ce39052b34460c1fc1e886fcb689bfc581e8b17ac4880d130f6c721cc7b7",
  "quality/baseline/states/win32/C-60-ink.png 4dd374d0701b359f402d5e579e01ad9595ae5c9e22271b70bce3b04a25071b26",
  "quality/baseline/states/win32/C-61-dawn.png c0bae8f79952328b38bd6f5a17c0c046ea447c8ac06a2b406a3c25a1f79962ad",
  "quality/baseline/states/win32/C-61-ink.png 2f8b52dcd7f2fa25e48726d89466540fa35425aafbe342c90d130c3e128fdaaa",
  "quality/baseline/states/win32/C-62-dawn.png 9f3af74d6ea0a90e45288532fb459601f25f67160fa8cf14b68617e9004ea55d",
  "quality/baseline/states/win32/C-62-ink.png 7fb04ce1a9ccbe8b3bcfee4038369d1fd9d3bab2721c31f5ea76c2c3ee789ef9",
  "quality/baseline/states/win32/C-63-dawn.png 15f757a931ce7f9274bfaad4ce76982f759c7598db9952fa59ccae701f59a91e",
  "quality/baseline/states/win32/C-63-ink.png 0c9418124c5842486d3fae8747c687872403ba1c8600d694955f06765e539aaa",
  "quality/baseline/states/win32/C-64-dawn.png bc735bfcf81ff8c8e5003810919d8d5b053f2261084a508b14ab7692b588ee78",
  "quality/baseline/states/win32/C-64-ink.png 65deee9ed7d3fa043c64bffc6e85b2d8d7b081c2adefc3f87e1ee03e77cb0ae3",
  "quality/baseline/states/win32/C-65-dawn.png 8160c4df03ab66c005b9b7988107e0d3ef6a9a25f19068fe55dad79827f9743d",
  "quality/baseline/states/win32/C-65-ink.png f5a03c48e3cf1beb10ac09e40efa4832581c2f39b07c429e63b56129275d9ae9",
  "quality/baseline/states/win32/ENV.txt 1c1e166caa460dc043af91a78c6b959b22c6d4824e3c3da3f1e1f88d9e410d3a",
  "quality/baseline/states/win32/T-02-dawn.png b3fa0cba5dd715200ae2a5901f17dc33422c513ecd77a6838ff5f4cdcd593c82",
  "quality/baseline/states/win32/T-02-ink.png 3177a7cad3eb096442d5e9ab4cb9904e21c81043d115c05ade4922ff37a56bc9",
  "quality/baseline/states/win32/T-03-dawn.png b8f01604e81df66d7e215df17829b223bafd0e67b55dd50c0b75b3152296dce9",
  "quality/baseline/states/win32/T-03-ink.png bbf96856697d858d8493e8ad5ab3d0f22afed994946f2df1f78edd0589dd7609",
  "quality/baseline/states/win32/T-04-dawn.png 64e750d67e51c1b1f1733acc35c3c0eeeef0522895b805b9b8585b98f27f0fac",
  "quality/baseline/states/win32/T-04-ink.png 94e79b8ec2401d91e154605bea82aee67e3f865c5b5604b8ef50fcbc6bb308ef",
  "quality/baseline/states/win32/T-05-dawn.png 2bb1040abf885bf53ce04d08aa0179f17803e8d1135bb7e029e6080725f58c84",
  "quality/baseline/states/win32/T-05-ink.png 00cae133fb659a24fa66e1d9068f41a0cbf58c01ed1b5cb05560bfc75f70b908",
  "quality/baseline/states/win32/T-06-dawn.png a12e79f9f754d7013fa84b14b80d42ad96fec8dc57521af3d91fd2a56d73fe9c",
  "quality/baseline/states/win32/T-06-ink.png 4842d8492a1600a4f99c53d30aed8c36a3d80e6a429557bddc1f28094adb94dd",
  "quality/baseline/states/win32/T-07-dawn.png 54ed761fefa435fe57d164deb08f2d4e63d5e07f8c8410bfb345ee9ffe36e03c",
  "quality/baseline/states/win32/T-07-ink.png 36ad0fdd9165bc3f3e3a25cca97a51e65b0358a363191ae4132c5c5731a8024e",
  "quality/baseline/states/win32/T-08-dawn.png 78d531d72956886ecfe6c2391f973c9fbe99f5136a1880ddec2939065fdc24c6",
  "quality/baseline/states/win32/T-08-ink.png c30b9f7899a77f0e8701a20cef3f09cf664758cd39906235448456a6d19cabb2",
  "quality/baseline/states/win32/T-09-dawn.png cb5b0fe644f67260423f8605bc0bf1321a1856bdeecc9557df96aeed02f705fa",
  "quality/baseline/states/win32/T-09-ink.png dba8e273c5c9707c3353d1daf7e99f5853883268079baaab939c0b964d6eef6e",
  "quality/baseline/states/win32/T-10-dawn.png 2ce07b5815d0b645bc881d94305ab41a40d66b1bd69b10068cad7cedc4d61ac6",
  "quality/baseline/states/win32/T-10-ink.png d0a26f210e75d30e3eb815e7d34d0b07bac67f786afd9c81ca7f5c60f801fde0",
  "quality/baseline/states/win32/T-11-dawn.png 163e3799b4c24086fd2cf9f1e1c63778c697cfd8001f65fdc22c2f09b042f3b9",
  "quality/baseline/states/win32/T-11-ink.png 626c958c92661221c3ae9ac1f7e1884c06c9056141f15cc5f382ac7aa42985ac",
  "quality/baseline/states/win32/T-12-dawn.png f915985fe859af58ba26b94d2a24849d1883791d2801fa245524758d262aac4f",
  "quality/baseline/states/win32/T-12-ink.png e9d4ac76488f9dbbc4ddea6494591553dbbe5a02c02901b08d1a325a5ff14f31",
  "quality/baseline/states/win32/T-13-dawn.png f214a63f862a59e8be279ea1ecd53d85333f1de866773ebe2b2bc94a4c0083a1",
  "quality/baseline/states/win32/T-13-ink.png 70713f1ced6d4e5ad8b59bf12f1e0bf1f032ee6678025b985fb37536fb30f471",
  "quality/baseline/states/win32/T-14-dawn.png f0226da77979bf71b341502591a2055b6177866c7f85705a708239cd8f06ad80",
  "quality/baseline/states/win32/T-14-ink.png 4266747362335feada52cb5d9fef707adeb97a1dbc607aedaa31fa04ad32e369",
  "quality/baseline/states/win32/T-15-dawn.png 955cca831009275af50c82e057f16cb3eb707f7e545a4755e4d54125f1ce2b01",
  "quality/baseline/states/win32/T-15-ink.png cc9dd67c78b96a52307c74582bf21bad0d516c98da614c19b512344bb4ab0439",
  "quality/baseline/states/win32/T-16-dawn.png 7701861626ebdc7baaa6c2df6273d4ac6b2ce22fad7ac7d75e806cb5d53d7997",
  "quality/baseline/states/win32/T-16-ink.png 9d2c571638ecf7c1bb59ab692b90098adf758fa1039482df85e5f04d1569b083",
  "quality/baseline/states/win32/T-17-dawn.png f8c4ca7b10e3181240e52c03766cd74a771f2c7a8925f0576210c42783acf703",
  "quality/baseline/states/win32/T-17-ink.png 47a2f8365084c6261ccbd729330678eaa565810576d5dcfe6d59bf5ebfde6531",
  "quality/baseline/states/win32/T-18-dawn.png b70d7e55b2d6c7507f364a84f8f4a5a62286bb3489cf3ad0912af9bb59253619",
  "quality/baseline/states/win32/T-18-ink.png 3c4350ca94211acf579315d4ada240e58745431abab1cfd1b19d24f48b5e3940",
  "quality/baseline/states/win32/T-19-dawn.png 29a4442c9b67b8ea4ecc8fa836eb3bfe79ce12870faeac8115996663fcaa0520",
  "quality/baseline/states/win32/T-19-ink.png e28b21d7216081404d6988bd5ea3109ec098300842a553aa3a598b5e9e4f4dd3",
  "quality/baseline/states/win32/T-20-dawn.png b5f4de1010a362bd971d519c2c47d7c7328e5da71f4aa838cd3c5d1ae3a7326f",
  "quality/baseline/states/win32/T-20-ink.png f5f4f9c7a407780392f9e676e77261bf6af614cdd867081b9ad2f4f3d54462bd",
  "quality/baseline/states/win32/T-21-dawn.png 6c87037fb14e004cb18772d65b373f6a01657d508310e9e3bc594fb906dd442c",
  "quality/baseline/states/win32/T-21-ink.png 822622990c107a6773feb54ce1e0f5505abce375c434c71c51e6744b7f8383d4",
  "quality/baseline/states/win32/T-22-dawn.png 2822db4d1b9b2a517795105990397af1ad0f5d503028c986a0a2075374f26783",
  "quality/baseline/states/win32/T-22-ink.png 6f6d8df214a9f15196bd8d7409e33f1ab5e466d5ffe21b885f3d9222e8f746ce",
  "quality/baseline/states/win32/T-23-dawn.png 2c7c42b125b25c7ee64b0021e296889fa33794b7262cf070902c98c0c3317420",
  "quality/baseline/states/win32/T-23-ink.png dd5aa3b018ff3ab15d69b073c9cf7cfec568b710e4257d26ece14364c43530c8",
  "quality/baseline/states/win32/T-24-dawn.png b8781e47fea83c85dec0120a3895be83207f1523ca231071f3caffc4d93ee960",
  "quality/baseline/states/win32/T-24-ink.png 01a85d4fa512b08f80fc377ce3a7263c629c3ee541b12ac580c238d1f7512343",
  "quality/baseline/states/win32/T-25-dawn.png 28462f293e6fcbd2979e4f0f3f768d684be6d4837955c42b7d4abd1166c4a641",
  "quality/baseline/states/win32/T-25-ink.png 305e71e889e335532ad5befea16577fdd77e0274cc4d283bdebebc47e8d42c40",
  "quality/baseline/states/win32/T-26-dawn.png b8781e47fea83c85dec0120a3895be83207f1523ca231071f3caffc4d93ee960",
  "quality/baseline/states/win32/T-26-ink.png 01a85d4fa512b08f80fc377ce3a7263c629c3ee541b12ac580c238d1f7512343",
  "quality/baseline/states/win32/T-27-dawn.png fafae8fb794644335438b3ef231c12350498cce9b4464a363dc478a2945a9812",
  "quality/baseline/states/win32/T-27-ink.png 2e06ef6b6ce8ea30c905bca2ce1dfe69c351b4c457b3256abc881b8cdaf45872",
  "quality/baseline/states/win32/T-28-dawn.png 12859c6d32b60ab04517d3b27adc61a6e5570593bf32ed8aa2d2fb7df55f8a27",
  "quality/baseline/states/win32/T-28-ink.png 3faae832b1336bb799845e78ed0336caccfb8095f1d9b37cfe9cb5ee6e4be431",
  "quality/baseline/states/win32/T-29-dawn.png e927f64e9f48d417bd307eff395e43ba6b92c1cf9f8a1c72b6e2ffe593028b2b",
  "quality/baseline/states/win32/T-29-ink.png eb2d58c23086513338da19328db5804b3245376c5335c0564f87c3460fc22f0b",
  "quality/baseline/states/win32/T-30-dawn.png a1c498b7aca27bbb40da607027ce12678719265bc7524aa8746eb1b38591360b",
  "quality/baseline/states/win32/T-30-ink.png f4a19555d09df86bc9254dc8975ef7bd70526617e0b19254f9af1cdbd35b8e7e",
  "quality/baseline/states/win32/T-31-dawn.png b8781e47fea83c85dec0120a3895be83207f1523ca231071f3caffc4d93ee960",
  "quality/baseline/states/win32/T-31-ink.png 01a85d4fa512b08f80fc377ce3a7263c629c3ee541b12ac580c238d1f7512343",
  "quality/baseline/states/win32/T-32-dawn.png 07a533c92e9788244b1eefc19b0ac05e5e6c04391a90dfbba5d2685b0a32524c",
  "quality/baseline/states/win32/T-32-ink.png b587cd4820221be4098476eb8c930dcab9fde68420b3aceed0704cd24c1a3716",
  "quality/baseline/states/win32/T-33-dawn.png 5b1b8058b3eef1c2c7bee3c57e342eea20d52e93f0acd1f63b167cd2f5d7d6c8",
  "quality/baseline/states/win32/T-33-ink.png 37775dd97df1e5477f243870370abeb717aaf00cbf805c8269aa2fcdcf2d9732",
  "quality/baseline/states/win32/T-36-dawn.png fc7cd33e31f2db70787020d202c5bb5a87dbff3948e5fc28f38e3780a06ef201",
  "quality/baseline/states/win32/T-36-ink.png 1f06c4ee3f2f6986b88e67a77a196d34e2eabe706892ea62f7d83a21396cf33e",
  "quality/baseline/states/win32/T-37-dawn.png bbada8d82bb2eba04dcf84b509f5c31bd94f368372103c2f7d394b42c848e89b",
  "quality/baseline/states/win32/T-37-ink.png 8b84fedca768502e7c3ad20c0a97148694442739e3f6ad2c930efc4ef57cc1ad",
  "quality/baseline/states/win32/T-38-dawn.png ffbb8425d1542a0c446a6d5f11ae2b4cb27de8defc10361f4a9033155492ca40",
  "quality/baseline/states/win32/T-38-ink.png ef8d8ed7a9533ed9e368ace1b9ff7725913bfe296cb5fb2b5bf72d26a2d6e6d2",
  "quality/baseline/states/win32/T-39-dawn.png b490cfb4099ddd80d26597c4f74b097b6fbb20c39b13d58df7fb632b46455fe5",
  "quality/baseline/states/win32/T-39-ink.png da958c4046d7916a8a0f5888f3d7c0c79f2529bfc749e269c710db62862afb3b",
  "quality/baseline/states/win32/T-40-dawn.png e23e845be5ae3cbde818a2f6b5fcd8fbaf18bc8e741234fd7c83a5fa4cc0bbb1",
  "quality/baseline/states/win32/T-40-ink.png cb155c4e138dae578a83c398cf4fecdf8955397012deed77dc62eae66979afb1",
  "quality/baseline/states/win32/T-40b-dawn.png 27f9a20984f5b6120bb28c933bcbe1d6b0e9424e348bf4858baf56db50cd6873",
  "quality/baseline/states/win32/T-40b-ink.png 9315fb2d5c21884ee5ce0972c33ff06b185f6c9a3b66679d36962d5100d6cff3",
  "quality/baseline/states/win32/T-40c-dawn.png 9d8dcc2ff1dd974b008a8b825a66a50dd6b650017e23a1fe2373ec6907080cb2",
  "quality/baseline/states/win32/T-40c-ink.png 88060b020a2e60cebcb5e8e5695864e49e0935ebd23993b3def093e76b4feda8",
  "quality/baseline/states/win32/T-40d-dawn.png abd05c663e3699a9f8208733d6bbe70b2921b9a418b35dfb57cbd92692783d58",
  "quality/baseline/states/win32/T-40d-ink.png f3898e510c1f62d4821ff75ed360d40cf1dc28697ab1a688ca0e2074fb279044",
  "quality/baseline/states/win32/T-40e-dawn.png 9312dedd9e94f686cd886e7b7eae6a80f023db4704c81274233cdc57cc3eab0b",
  "quality/baseline/states/win32/T-40e-ink.png 5d24b78476c06bacebcf22302891205b71042fdad3491bd80ad67d90c4b5f125",
  "quality/baseline/states/win32/T-40f-dawn.png 6573604a71ae5d459d11bd235a9ac445d803609d7963ea776920aa80af5488e7",
  "quality/baseline/states/win32/T-40f-ink.png d6c5a91137ef870cfb320afe60a648ed7c6033d2715abf4a4440f0a6fb1559cf",
  "quality/baseline/states/win32/T-40g-dawn.png 136898a69bdd6c1b8f2d81fd87694aa5d67146c16beba894524bc07732ad610c",
  "quality/baseline/states/win32/T-40g-ink.png bc9adf450a2cfeaf91dcf029793e30bdac20545786691b84cea4dab9577b9fbc",
  "quality/baseline/states/win32/T-40h-dawn.png 7e6c1b622985a65786fcccce7b5a140d61888e1b72893df18194d09ba9286681",
  "quality/baseline/states/win32/T-40h-ink.png 9a5894691bf86fddc470f6357f4e1ce004894fd244bd2ea19393b39545b94842",
  "quality/baseline/states/win32/T-41-dawn.png 9087b9fcbca93b336f634fa42be076fdaa45d9df5da76291e3dd2c282a9ab3d7",
  "quality/baseline/states/win32/T-41-ink.png 4b90f34fcbc6baf84dc3696c864308e8f998a8e0f61bed229405829261dda7bc",
  "quality/baseline/states/win32/T-42-dawn.png b8781e47fea83c85dec0120a3895be83207f1523ca231071f3caffc4d93ee960",
  "quality/baseline/states/win32/T-42-ink.png 01a85d4fa512b08f80fc377ce3a7263c629c3ee541b12ac580c238d1f7512343",
  "quality/baseline/states/win32/T-43-dawn.png 207fd939af3c97efd0b34b0eaa0bd5fb8cdcaa407b88fcfecd4e5782f0631f5b",
  "quality/baseline/states/win32/T-43-ink.png def3ff89d40e9525743eecb99029fe21f0710385ce405bd7c9c6f3e6358a8ce9",
  "quality/baseline/states/win32/T-44-dawn.png 40869950c39312cb11b5881472fb2bac351c0f05826b65b2018e48c9a27eff76",
  "quality/baseline/states/win32/T-44-ink.png 92626de9dd93b3068c603b60d4d13d2fcb4c8d8e5bdbaced7a2424b0ab8d946a",
  "quality/baseline/states/win32/T-45-dawn.png 29a7b5bc5828a7b0755aed60784ab3f281e023546582999e5fbe69afef8b98a5",
  "quality/baseline/states/win32/T-45-ink.png e35b1d9fbcda2a63c8efb116060533f1aa308e36142fdc2e6144de65abb844bf",
  "quality/baseline/states/win32/T-46-dawn.png a93bc4c12f2c1ebdd035a44f2ab7d4d0813005eabc3c9834de3d2bbac3a60c76",
  "quality/baseline/states/win32/T-46-ink.png 38801b2cef636e654ba838e06ae82c19cc948bd2aabd4ee7b59627eab968e008",
  "quality/baseline/states/win32/T-47-dawn.png 26fd13ea442f03c29601396abb3f903bae1d52e46874dee8764d571b4f6db409",
  "quality/baseline/states/win32/T-47-ink.png fc8aaa99847e115fef1d7f02c40363771bb411aa3fe48498bd7155cd118b7a1e",
  "quality/baseline/states/win32/T-48-dawn.png 32ef4f63ba7b60cf346fe52a599ea699d3dc09315bdea39df7e404baa3b200c0",
  "quality/baseline/states/win32/T-48-ink.png d2ce1673040311e14ac5c0ad0ed887f2598880df87684da24b2cb3cb39133379",
  "quality/baseline/states/win32/T-49-dawn.png bc04c248019309d2d33d1dd8a6fc325f469893ad27564209a758d3717f6ead28",
  "quality/baseline/states/win32/T-49-ink.png 2d04888cd38056ed09d8c20130d0a7afa33cc03e9fb08b01e5e2d6787277d543",
  "quality/baseline/states/win32/T-50-dawn.png 2ce07b5815d0b645bc881d94305ab41a40d66b1bd69b10068cad7cedc4d61ac6",
  "quality/baseline/states/win32/T-50-ink.png d0a26f210e75d30e3eb815e7d34d0b07bac67f786afd9c81ca7f5c60f801fde0",
  "quality/baseline/states/win32/T-51-dawn.png af7cb75f536a7add6b7eb875f0a37bb8b78ccd1075e3de128be72412a33052f8",
  "quality/baseline/states/win32/T-51-ink.png 8f93f6b031fc9f58d40a8a8ed794fbf314d9f2d3ff6d2ebed5625a96699a1c9a",
  "quality/baseline/states/win32/T-52-dawn.png 4d8ecb99877195f17902215aff0e5a424e55bda636283a549b515f5404e060ec",
  "quality/baseline/states/win32/T-52-ink.png dc92311cf765b1779a997c911857cec2c3e25053d7e9bba6c0c26ed9cb75bc9b",
  "quality/baseline/states/win32/T-53-dawn.png e3695cdd9ef15cb44feacb6545ef9c91727cd3e4a3b3e9454ab953556ffd7afd",
  "quality/baseline/states/win32/T-53-ink.png 9f4a52a9e4ca2bdd54713240ac95e5ab60056af964e4c858dd771992ac5862db",
  "quality/baseline/states/win32/T-54-dawn.png 1da6bc3a6277d03de590c90053a30d8b828c4ca78fb8837c176f56e40ada50e8",
  "quality/baseline/states/win32/T-54-ink.png 35bbc1dfde5b82becad4947b6ee762cdad5e582348e92c368b015cb389c5b1c9",
  "quality/baseline/states/win32/T-55-dawn.png 63956af92e7ef786941c751b8ccf7f39342b68334464629a6c3eed9a27def3f1",
  "quality/baseline/states/win32/T-55-ink.png df7d6d806a438432c2565d20f0c39760e10423a6c4cbe7a4be86f6fedec7b35c",
  "quality/baseline/states/win32/T-56-dawn.png 273db9eef2388b53a7d9665639c784c88b1293e4c33103ad2486844a3e8251d2",
  "quality/baseline/states/win32/T-56-ink.png abaab3d5ab367197e38c97986a6d7c48f3094fc8a5f2e5e58567053257684f2c",
  "quality/baseline/states/win32/T-57-dawn.png 9476dc75c8d6c52f333b9c603c48068852bb1b4d366ee5d4e9b0d662d3e9de57",
  "quality/baseline/states/win32/T-57-ink.png aac8a6f8e88d287a5fadf20918d9eec219fe287f9285f9cad33f23f088572355",
  "quality/baseline/states/win32/T-58-dawn.png c1bd92815022c3cef06e7d22f09a69a5bb34e00fb1d4617411e58e8b5c4a4936",
  "quality/baseline/states/win32/T-58-ink.png 9658f6c3a62fa71d428822b17db9b28cef763bb56dd4cde45c3c35172411a410",
  "quality/baseline/states/win32/T-59-dawn.png cd7584dc2da6ef2fa00be919bf04cd38f758c1648b1f8ede1f98e8eb79b36f44",
  "quality/baseline/states/win32/T-59-ink.png 1ad1b88a7dacfba5ead9cd20c209ad68ff6635f1d52d0f177623603708d9bc04",
  "quality/baseline/states/win32/T-60-dawn.png 98460d255c08e91a4f261cf6632b2e0027e0039a98fb77969dac23bcd15c635e",
  "quality/baseline/states/win32/T-60-ink.png 5dbcd85f9cbd6fc12200991b119636dad48abfeec8c4d6ec8272dfc59a83a91e",
  "quality/baseline/states/win32/T-61-dawn.png fdae82ee1b0f13c7cc4b98ec3f8f1c00d5e2481ceaff07749e2b2c0ac8986e6c",
  "quality/baseline/states/win32/T-61-ink.png 77132a79e168f9d570ca209129e52a6c185f714c9bbdc538b424eb38803b05d2",
  "quality/baseline/states/win32/T-62-dawn.png 8eefd3eb7eea3ad0a9bbde34089071a8ca55b054ca3c58eae378426e5b99c29b",
  "quality/baseline/states/win32/T-62-ink.png 7efe0abe83305b1db13e673994889bedac3e16bb500fb1910b968b9bc5b342dd",
  "quality/baseline/states/win32/T-63-dawn.png 8afca75e2b7a2a6c14f5cc50cea53a4d991863abf4619773dc16f9d0138b2bc6",
  "quality/baseline/states/win32/T-63-ink.png afb7a5b7947dd4877a1cacb290e9e40794bef94466d116b1483314317f903230",
  "quality/baseline/states/win32/T-64-dawn.png d92238c12a0f66216d8010a1434d5c8b29d63005e6ea8ba3767f3bebdba4ef74",
  "quality/baseline/states/win32/T-64-ink.png 285b1efdd9adb14aaa16d4f859df45b8390f971fc070540d4cecad9d7f6c7d7d",
  "quality/baseline/states/win32/T-65-dawn.png 500b5e20a3d3e39f4e2e5db05542885a9da2976dd8ebcc940ae6f552dd7d80e4",
  "quality/baseline/states/win32/T-65-ink.png e8fc70363ef3f61205f4304e7b95adc90763bb7f1b1eef6146563cd3e02f3e24",
  "quality/baseline/states/win32/T-66-dawn.png e18831449b9f840c8b5df9028385fcc445c963fa80dcb39d94d152ac55481a98",
  "quality/baseline/states/win32/T-66-ink.png 3e6d407f9d08c3bec64bc9110f46497c60e8e261a93446327f043c6a5a9a5051",
  "quality/baseline/states/win32/T-67-dawn.png 0f46c068a09e5560bf2dfd4218aa507e3f7afc69f638aca5f08da65848c4c534",
  "quality/baseline/states/win32/T-67-ink.png 7941b5fab3e5cd94bd8fedb0b344d76337695eba8c35d2678ff5c777b1186a28",
  "quality/baseline/states/win32/T-68-dawn.png 90d3dc1bdadec81edd1fc03f12f2f0e9b6eef0e25aa62a3317dff6abb18c744a",
  "quality/baseline/states/win32/T-68-ink.png 51b4f1dc93a3727d39e21b8c761baf8cc953dbd4d20d60dd23c515014e01f7e8",
  "quality/baseline/states/win32/T-69-dawn.png eba5d53da48b90c130506b10790c2ac813da1941b8822e2fa4aff51e0719f3de",
  "quality/baseline/states/win32/T-69-ink.png 30db4286900a4dbd5152a11cdbbe1c2c09dfa9d27917a3afddfd4ce91a06c956",
  "quality/baseline/states/win32/T-70-dawn.png 45b716689f523d126082467f4cb60a3a35d5de34fe6a50f4a63d964c90dda4d7",
  "quality/baseline/states/win32/T-70-ink.png 1da6e09d279c13cab934556ce46a53acf7807b59a3f95508d03e547cd8c94dab",
  "quality/baseline/states/win32/T-71-dawn.png 3da8b220d1696447512928c015f60be5e921a04a950cff7801db7a983a7bfb33",
  "quality/baseline/states/win32/T-71-ink.png c4f4c26141a434f84aa1c01e36d1e4b1051be2a1bb1c2c3311f477192826cc83",
  "quality/baseline/states/win32/T-72-dawn.png bcc6fbe7bfd721dd319202ddff4e4870ed6e2431f093dd960cdf8a2b266df0d0",
  "quality/baseline/states/win32/T-72-ink.png bf65397d2311196f6a145c27e0844a846d018f392e562d7e2ba1eb9f7ed02b78",
  "quality/baseline/states/win32/T-73-dawn.png df46c68eaf81d541bfe83477fb2fe2a8be7b4d00e7c5bbd959a96961bf85c5ba",
  "quality/baseline/states/win32/T-73-ink.png c81db16f10341599d3d480b731b346eac76c801c481d6a9ff2b9e52a2a669688",
  "quality/baseline/states/win32/T-74-dawn.png 62d1f17165007123e4813b4687eb96c5d2a800fe484e3a4a044e3646afe11e85",
  "quality/baseline/states/win32/T-74-ink.png 1debca091c5ef730874337a5ae2aca2ab8fe083c0f9581dbaa2a9733fbf42fec",
  "quality/baseline/states/win32/T-75-dawn.png b50e80650a9fcc8acd8ae9af821b00b4a46668bc788e7ac1394bd748d8ae1c75",
  "quality/baseline/states/win32/T-75-ink.png 4259ddf2782a775a7276ae6bfba3489ac671d03f9cc6fa27c45fe9e7c94967c4",
  "quality/baseline/states/win32/T-76-dawn.png ef73332ba57414f4482a78cb4cac69a4b7df8f2146eed3dd9517d41e25c45f79",
  "quality/baseline/states/win32/T-76-ink.png f84b477a6e8df9abc7fb243779776c9b7a265d47bf69e7815404429bf105fb07",
  "quality/baseline/states/win32/T-77-dawn.png 96a07ba51df95a4f64ad8c953b23cdf43a3ccef8eb7fd248cac3bec7b9d8d8fc",
  "quality/baseline/states/win32/T-77-ink.png dc56cfd9c7875807a06481e664235b12ab34e44901d5979d0722928b451bb81e",
  "quality/baseline/states/win32/T-78-dawn.png 1f9a52544efa1337137f454cbd2f69ca60ec0f5acf4b27390c199fe553a97ed8",
  "quality/baseline/states/win32/T-78-ink.png 5787c14b9b3bcd61949612899a27188855f424ad6733ab70427cad10893e44ba",
  "quality/baseline/states/win32/T-79-dawn.png 3e3e1cb49fbccc3767dcf3047c083a53a279947ce699f7ef7ad99d8b03cdb319",
  "quality/baseline/states/win32/T-79-ink.png 574ca3af565efb670ae4ddf0233ce8769e85923409a1b0bbf47c476ac2801aae",
  "quality/baseline/states/win32/T-80-dawn.png b88d3d73f2d97091f7f32a0ff0415c05f72185ae69b6ec580633e10f1ab6a7ed",
  "quality/baseline/states/win32/T-80-ink.png c26a8440b33d57e118063cc373813ff7b88c8ace06118a590f0abea00240367f",
  "quality/baseline/states/win32/T-81-dawn.png 3d28682ac681c5e5309c0cd47465bac31b5cb8d490a75a0b692af6897b139e25",
  "quality/baseline/states/win32/T-81-ink.png 80579cc57d656c346c270269d58a37be71e17b591d20ecf2a72c8a4606cebf7d",
  "quality/baseline/states/win32/T-82-dawn.png 795b6922119ad156f842ed5a5d77dd375f82623c37da0183c93bf3873765b1ab",
  "quality/baseline/states/win32/T-82-ink.png c5435e432eaece4ea4ae7232445795ad5a886cedd4e481c7739793f45949c450",
  "quality/baseline/states/win32/T-83-dawn.png 55dc2ecf3c26f12e583b5becbbb3567d11516fd5ee8f93b23a0e38b1ee2f7f1f",
  "quality/baseline/states/win32/T-83-ink.png 862c3c3c2bd53071c79400289db44b78660baed2f8b2088b87a236359596b17f",
  "quality/baseline/states/win32/T-84-dawn.png 9b1490ae3c0d1bf56e5fdaa55bc8acfe5b62a2bb2a13ad28d11ab87b2115f2ea",
  "quality/baseline/states/win32/T-84-ink.png 50694037c5cc624f4bc65344d31509c0ea46b7f87a49989b4fa288c77136e09c",
  "quality/baseline/states/win32/T-85-dawn.png a4c2aec7c00d05b5dbd2e3f1919db003777542b501f2571d1ff8b205a0d35ef1",
  "quality/baseline/states/win32/T-85-ink.png 24d93b78c6699377288e8be5a61afac9525466648892f5e112e0d604f17ebdef",
  "quality/baseline/states/win32/T-86-dawn.png a3e73b4e913e3c65936b2a2688cbfacc50e3e8af524c90b780f3b3dd1d4ad10b",
  "quality/baseline/states/win32/T-86-ink.png 85d78221d11eb6f8118d85556a8e3625fea8e73752c9c952b99d727285054c17",
  "quality/baseline/states/win32/T-87-dawn.png 344709f075c8a86da0b5dd2f51cae177d8c1d8de348f1bf33c0a31ba8d8ab987",
  "quality/baseline/states/win32/T-87-ink.png 754a368bca4f43eea510db87417a9304cf293c9674ef2a15d168ea317edbd597",
  "quality/baseline/states/win32/T-88-dawn.png 365ccf3c0059ed7cc967c7caa0b758e2de7db92f862ec6b531b1b7cbf44635f4",
  "quality/baseline/states/win32/T-88-ink.png 5bb51617b3b883e3b8ec4da940a314c2bce05deb577bf5f917c330214115839c",
  "quality/baseline/states/win32/T-89-dawn.png c9d6e058b0d8874f2594c4374b16e7430bfd19bf63b7de2a2ffaa626b93259b5",
  "quality/baseline/states/win32/T-89-ink.png a0560a38a3deb4be088d5d436da61b7e23cc45f5251b8df6c3f216327641e35d",
  "quality/baseline/states/win32/T-90-dawn.png 75c67d1a52c1c04c95a25684b600ac8b43755f5061504d9f9a532fba5847b15d",
  "quality/baseline/states/win32/T-90-ink.png 5cbde056686d6eeb4820676091c328a390c98dfbe755af1df43629cfdfdd372e",
  "quality/baseline/states/win32/T-91-dawn.png ed9ebbb95ee27664873421c87f81fc5352da842344720bb915133ebad807f120",
  "quality/baseline/states/win32/T-91-ink.png 3489100c5ad4338a00f38f1c954b174b266ccf28e62a4b9093b126857f171f4d",
  "quality/baseline/states/win32/T-92-dawn.png cd64bcffb388bfe17eb526c62f77ff7c19fcfca528aec592c6f8c12c671e1f6b",
  "quality/baseline/states/win32/T-92-ink.png 9fdb58ff25f52b6406ec2bba954499b6069a197d72e00c06729c56306385762f",
  "quality/baseline/states/win32/T-93-dawn.png 6ddef189ae0d4b33f8dd9c365504000ea643e18c229317cbf5b8b303170a6ce9",
  "quality/baseline/states/win32/T-93-ink.png 7c9271bace92cc3fdfba0b0170f093528f8d12698b6268dcacc24334dfa9a899",
  "quality/baseline/states/win32/T-94-dawn.png 7e342aefea8f4426aaa224f99b89d8972f5fdcffec7fd45b25bbecc5e3e8ee1e",
  "quality/baseline/states/win32/T-94-ink.png c36f6b8702dccf26a5a890d346cd7f7c033a2c1a4a2b18c514810845e2822ac9",
  "quality/baseline/states/win32/T-95-dawn.png 48b3c423caa328dd853f189dd90dc01b1d4d4f60cbad877856dfef9d7db4772a",
  "quality/baseline/states/win32/T-95-ink.png 786db4fe8d3c7fc8ff16134c5d7ff0319abbfd6d42770ebcc189aae44ad4fe57",
  "quality/baseline/states/win32/W-01-dawn.png 4e727286def7a82704f8e4dd4fa0da60be1d727f358956112865b6d47b7a4fb4",
  "quality/baseline/states/win32/W-01-ink.png c7cea5d81e6db8576a934d41373ef623420a0727b6e972542b002267d7cd381c",
  "quality/baseline/states/win32/W-02-dawn.png 74c90f1dab76d17ec8e3060f1b57dc6da7c510b1d73b011928f9524dfbc4bb8a",
  "quality/baseline/states/win32/W-02-ink.png 63fafb9b60a37611a5f2357754f5c8fe16eb30dd52d67ef7f93c0de21c7a5e38",
  "quality/baseline/states/win32/W-03-dawn.png d9895a7d768162dc078844826cd152ae03587e57ed1834f6d39b7fcdc112a4b0",
  "quality/baseline/states/win32/W-03-ink.png 54daceaa1e86049f1587f13670bc7f3b6bd7c8680b71901d8b7ee647422a2e78",
  "quality/baseline/states/win32/W-04-dawn.png 780c22b4709618712b1ec34f45c445e2f6a47f031c7b6e79273cfb3a0299bed1",
  "quality/baseline/states/win32/W-04-ink.png 17652bb9a951f1e0c8f6bdb9d251a8465c0017750a5c8aaa43e126b467451c34",
  "quality/baseline/states/win32/W-05-dawn.png 089b66c54d22d62afe1eecdaac29ff86ae612110ec311366c6515e8c1dcf1629",
  "quality/baseline/states/win32/W-05-ink.png f1336ad90e21116095664c085a333c05155e9f0e7df962462f0d46f200422ff8",
  "quality/baseline/states/win32/W-06-dawn.png 089b66c54d22d62afe1eecdaac29ff86ae612110ec311366c6515e8c1dcf1629",
  "quality/baseline/states/win32/W-06-ink.png f1336ad90e21116095664c085a333c05155e9f0e7df962462f0d46f200422ff8",
  "quality/baseline/states/win32/W-07-dawn.png 8d892909ea272b290cac6b3f7318e9530bc7adfc2eef810022eb2d4c3d768c2b",
  "quality/baseline/states/win32/W-07-ink.png d6164dd1f66fe31cbdb5398b10ec4b869f789f7b7c2272eb5d22a27e751808be",
  "quality/baseline/states/win32/W-08-dawn.png 53a156e703780aa4e5c2b410c9e7b6dc2b90aa3a49211ad8f6790a3c6901dc91",
  "quality/baseline/states/win32/W-08-ink.png 97fb61b9af693b499dd7a6dc0700877cc3358fcb2eb1bb0fbddabb5096795584",
  "quality/baseline/states/win32/W-09-dawn.png 39aa30f3d1df064c469d348bd1f0fa578a57374de0a7cfa212bff8a9c5497a13",
  "quality/baseline/states/win32/W-09-ink.png 4d2839f67e13b469df1f0efa8a1bc3064aea8219811ef34bff27c75c68df4706",
  "quality/baseline/states/win32/W-10-dawn.png 463120231f80828ee1ad66d3cbfde6c0122f82148ab8d24027c0ee724a28bdb9",
  "quality/baseline/states/win32/W-10-ink.png 9c70c06d1527fd8fc1e9b4fbeffe977691b2729ac1188ce56e6ecde0d690874d",
  "quality/baseline/states/win32/W-11-dawn.png a589fb4eb36040e24c75bd1dd9392b129968e91a5dde6dd3e1e921e4244c443e",
  "quality/baseline/states/win32/W-11-ink.png 9c20d9b0c912494ad1765f2308f49ac3f4dac3b712bd0d7ba0d1ec138eb95374",
  "quality/baseline/states/win32/W-12-dawn.png 4aaa43b383383caafe16e2d2e39f00e214a46e935fdd700aa6870bcbdb82985b",
  "quality/baseline/states/win32/W-12-ink.png 7e18b62d476caa5548a485331b8f65fc3791b7edeb133eb9d677203eb4e88c79",
  "quality/baseline/states/win32/W-13-dawn.png 224b176eb8abb0e0d1bf9ecea5163548a56fb2a379fe97d6208f33dd65e5ec99",
  "quality/baseline/states/win32/W-13-ink.png 00e61b0608dc2674963bdb40aa3ec07a65d64ceed623a68afc3bd3c9d08ec22a",
  "quality/baseline/states/win32/W-14-dawn.png 59fe34b7a013ae70e08ac991cd1b7c2a6d65261d9033e527820d5ea004bbfe4b",
  "quality/baseline/states/win32/W-14-ink.png 945e4a5e0eb37af7f0fb10f414e626a25952f8cc699cb6d83387c17d84c367fe",
  "quality/baseline/states/win32/W-15-dawn.png a01f7c432a488618709db99e26517d685df07b5f88ed7d0f9c915f6ceac54348",
  "quality/baseline/states/win32/W-15-ink.png 99773054fd5bb04447a3dcdaf8521d2561ec8285b3027bc7576393f39d3e3d04",
  "quality/baseline/states/win32/W-16-dawn.png 089b66c54d22d62afe1eecdaac29ff86ae612110ec311366c6515e8c1dcf1629",
  "quality/baseline/states/win32/W-16-ink.png f1336ad90e21116095664c085a333c05155e9f0e7df962462f0d46f200422ff8",
  "quality/baseline/states/win32/W-17-dawn.png 8ef196d241ec34508299a924b3529d2f4304d765acd463f50fed328bab4712fa",
  "quality/baseline/states/win32/W-17-ink.png a79e3bc9755485582dc17602a73bd93e2ea719cdeba4cba54bfa4f2a7cf44a06",
  "quality/baseline/states/win32/W-18-dawn.png 5429bac0b504749e643f04180a913b78be47d8c47825cc842d5c33e918ba288e",
  "quality/baseline/states/win32/W-18-ink.png 558591e9d73a85bac4677eace1e4e04625783a2ebd783e8734bf2274f67ea90d",
  "quality/baseline/states/win32/W-19-dawn.png c331b349e7c914238cae8a35609dc8f46ecde91cfaaca0933126ad278ad85fe6",
  "quality/baseline/states/win32/W-19-ink.png fb6a2cd7d6012d7259540209de698222f0e5587a76fb62ce8a47b340b7f0fcae",
  "quality/baseline/states/win32/W-20-dawn.png becbdf327894367515625a2a674db2646107c8426fb82aff7867a859cc435091",
  "quality/baseline/states/win32/W-20-ink.png afa3f90a69cbc2c8f51d84bdfcf3b313eced5e5f6c48c8ebb19795845a3f32ab",
  "quality/baseline/states/win32/W-21-dawn.png 8da4f7e1f6d4c1b2f7ae87630dc7008e0200d8fa57ddfdf4e13336429b45564f",
  "quality/baseline/states/win32/W-21-ink.png b65714dcbe5d8a92c90e09dfa2b312764a39bbf62272462b78f9bbc66c59661e",
  "quality/baseline/states/win32/W-22-dawn.png 0104e86d73865f08a9559b80a026914fd0ef528079e08303f371ef7137b0bbf3",
  "quality/baseline/states/win32/W-22-ink.png 15a0c9b5ebb96857583867f2163d2236ce052cd2d577cf699937f450460972e3",
  "quality/baseline/states/win32/W-23-dawn.png 3a129c30b447903fab841aa3bd7e3441442a6999c0e1c9ceb38e45c405d7efe0",
  "quality/baseline/states/win32/W-23-ink.png e2de2260812142bb30ad0c2dccd966ded5a1e79c089abf90b1fcca21e3ccce19",
  "quality/baseline/states/win32/W-24-dawn.png 9bfe5a9f8e37d0276aed7711750e2af9e2fbb6f1cc4988befea00e5c0454f7d7",
  "quality/baseline/states/win32/W-24-ink.png 898d18a22bd19531897a1168aaf96aad29335d5c3687e5735c3e25ddf470bb32",
  "quality/baseline/states/win32/W-25-dawn.png 8f3a07aa8d594cead9b69e3dd88f311d256a0861ba048bf7a6b838db642745ba",
  "quality/baseline/states/win32/W-25-ink.png c652897a0de8329b199be3e05db244d209cd0c80f87a65010bd615bbaec2f3a7",
  "quality/baseline/states/win32/W-26-dawn.png 64ce91798a290dd15671eb0aa29767bcbde033c9393a80df5677811b4793cdfb",
  "quality/baseline/states/win32/W-26-ink.png 56c50b6fff2d74934b52f2fb3ce432c46eae1c77044dba7bd6b3d1f2a90a52ea",
  "quality/baseline/states/win32/W-27-dawn.png 581560e9683e6328d6e9db9704328101c5e6324b3aaa5035488f1dcf61012d0a",
  "quality/baseline/states/win32/W-27-ink.png 5f93974545668173a1221148bf704575f249e9e40c11b77a6d98721789650718",
  "quality/baseline/states/win32/W-28-dawn.png e928a82fecc70d489343501e27f8c73296c1c0839ea669c737c93f5e6f863ee5",
  "quality/baseline/states/win32/W-28-ink.png a57da097bf61474430f5fbe9416e668237da2104a8df3e30db9a9052ebdeef35",
  "quality/baseline/states/win32/W-29-dawn.png 827b046fc4f89c5e063350db58fc7e3b63eef39e6592afc210b8470de3092bea",
  "quality/baseline/states/win32/W-29-ink.png deb56b3679b1721ec7e8000ba2a370f0e948b7a7a0c9daceb38386ed5a031239",
  "quality/baseline/states/win32/W-30-dawn.png 43893b90a247b4b6ad1c29260a1ca167e7eece2628e77204175c59246e9069b0",
  "quality/baseline/states/win32/W-30-ink.png 87e84b83f4f33a6d7c38815e93cc857d0190cb543d2cd69f445a1accc20e0db4",
  "quality/baseline/states/win32/W-31-dawn.png 989350f0cf509c993589f1c959d60f9fa21b136c44c0860c56d0fb398ef3b453",
  "quality/baseline/states/win32/W-31-ink.png 422f53035df7c3d6209653b322e811adee3671897f9fcfeac99db27460868fb7",
  "quality/baseline/states/win32/W-32-dawn.png 03860e1abf6d3939d4510512033122b64e4224625bbd3f4b51d81387bf5fafa0",
  "quality/baseline/states/win32/W-32-ink.png 2002ee98e6213bae7eb4eff77511773b1ed81eefdde2a6a463b319e6c959d52e",
  "quality/baseline/states/win32/W-33-dawn.png 348e9ffa6a62178ad58248ffb98e4fbf25e94d7fd8facd474c5d83100b7c83f4",
  "quality/baseline/states/win32/W-33-ink.png 6ac7d3ceca5d5ce563aecbd4b754fd14d62e1238719165a88c0ed642936ed4d6",
  "quality/baseline/states/win32/W-34-dawn.png 05259e70e039c29d097c0ea6f2f1754227b9381477c56faa45e67cc1e628bcae",
  "quality/baseline/states/win32/W-34-ink.png 1fb4801ab068eb227cd7865314766f72af32f90d0a9d2a9041975a7d819abdf8",
  "quality/baseline/states/win32/W-35-dawn.png b1c7e0544dca1c2ba3f44fe7e4317a0337216f9c5671b71970fadc92e8e72433",
  "quality/baseline/states/win32/W-35-ink.png 4db5217919fb0cb662f46483a31e8f68423a83b183d15dad4f217d1e5541bee0",
  "quality/baseline/states/win32/W-36-dawn.png 3f7293b2b8cfd1657105e0c8a7360548df21e7fd9c5d8baae3ba7a61793501f0",
  "quality/baseline/states/win32/W-36-ink.png a4bdd7bf7e7852a9abb4f65108ca90118a3f1fd47120052c76f21c5b51199fa5",
  "quality/baseline/states/win32/W-37-dawn.png f38047a6f75853716e89878cf816c8ce6f467ece33d9a2d542060ffa7ee59329",
  "quality/baseline/states/win32/W-37-ink.png 1a400089874d68650da6a4adc3c787fed09d2dce39d4e10d57288865555fb574",
  "quality/baseline/states/win32/W-38-dawn.png ab955db6736e59a71d6ee66cfc916cdb3a88559bf0eeb61a2aeda7afc7a2199c",
  "quality/baseline/states/win32/W-38-ink.png dc3e0f7f136aa030ffd8a986dd024b90a532f8e37c46f74f8bb78b03bae9e678",
  "quality/baseline/states/win32/W-39-dawn.png af9e9ae34b09d327dfd132067934e6e17d9c7ad9bcb8256cfd1c9840ed70db5e",
  "quality/baseline/states/win32/W-39-ink.png 68c58e4cdf2c5807cbdad9a4abe1fe05dc083c1816d6f481765f186c937c9a23",
  "quality/baseline/states/win32/W-40-dawn.png d07eecd99d0fdcab7cb5917b470777093ec439b5666e16e730b189475d2f9cf0",
  "quality/baseline/states/win32/W-40-ink.png 9d5b8dc275ab96b9b959301b19e752722409cf3ffd6122bd01259065fa7ce81d",
  "quality/baseline/states/win32/W-41-dawn.png 8f3a07aa8d594cead9b69e3dd88f311d256a0861ba048bf7a6b838db642745ba",
  "quality/baseline/states/win32/W-41-ink.png c652897a0de8329b199be3e05db244d209cd0c80f87a65010bd615bbaec2f3a7",
  "quality/baseline/states/win32/W-42-dawn.png bc446314c5ec13703203225d7429509501ff47c120ff5cb3f2c2720f951b87c3",
  "quality/baseline/states/win32/W-42-ink.png c15fd376f9fe3ac9f385df20b9f5e6844e52b5c825d1e7d7709a8c1d6b7e678c",
  "quality/baseline/states/win32/W-43-dawn.png 0104e86d73865f08a9559b80a026914fd0ef528079e08303f371ef7137b0bbf3",
  "quality/baseline/states/win32/W-43-ink.png 15a0c9b5ebb96857583867f2163d2236ce052cd2d577cf699937f450460972e3",
  "quality/baseline/states/win32/W-44-dawn.png a285713f4d4c18bfc00b1b6199da07d69f7e20cf288281007673ea9f95a7a6b9",
  "quality/baseline/states/win32/W-44-ink.png b28394c1af6e1c8a76a9a6cc77a75a8ee2313632b9f08440289181670f784311",
  "quality/baseline/states/win32/W-45-dawn.png 089b66c54d22d62afe1eecdaac29ff86ae612110ec311366c6515e8c1dcf1629",
  "quality/baseline/states/win32/W-45-ink.png f1336ad90e21116095664c085a333c05155e9f0e7df962462f0d46f200422ff8",
  "quality/baseline/win32/ENV.txt 4943aa6d57603ae5ccf08387b253d3356d0375a0c30a118a734aa8669befaf56",
  "quality/baseline/win32/dawn-coach.png 42058579b3b12a38664edcd7c631ab4b27a8557982c1393057ed8b3d21965bb0",
  "quality/baseline/win32/dawn-today.png 4527c68efb5aaf850089f7e2ee3a33e918ee621ccc29d3db5b16fc5b23d8aa47",
  "quality/baseline/win32/dawn-workout.png 62929ffa8b46dbb9c6c48a17f44c121092573bafb92d7839ec58adad3d461632",
  "quality/baseline/win32/ink-coach.png f563a3a61571fd48332780065a14a457ebfb67fbd762c19b93ac9469afd6430c",
  "quality/baseline/win32/ink-today.png 8b825dfb9e7f2222e83570585d63eeb40ea3e1c458b428e277fc4015115305de",
  "quality/baseline/win32/ink-workout.png 6c6d8c6c5fe983eab78035389ded6995c28eb0cea49ba113760718141415bb15",
  "quality/common.py 374a3b92ff973499a66f55d7405e62b0be456b6bd4c816ebec8a47c72f371beb",
  "quality/gate.py a3dc60f8822be3823a52749a779319ec592430f3918df5338cc434b320a7b0f6",
  "quality/phonesheet.py 9c2277682a99ff22de81fccd9e706bf03883afadcbef9805f1d76b028f3ebfb4",
  "quality/statesheet.py b9877a8e3da7ed6ff0ef0ef7cac60b2c347cefa1e9e2b402fecc1a446f11bc14",
  "quality/teeth.py 6f5ac2236060a36604c6d59958b9d83be5aa21accf609c5006889bdcd93b89ea",
  "ref/dawn-board.png f0cb958fd7d2def51f707bf2fe0fdf1eeafbb243859953295c6e6419242c1779",
  "ref/dawn-coach-native.png 507ceea88e9692480bd4b162e1a4eeddb93848a7912efdcff5e9f6a2d61647a8",
  "ref/dawn-today-native.png 1829ba02c61c3272290a58727bd0cc15010fb799d0f0aa3e1a3c780a56ea2d05",
  "ref/dawn-workout-native.png cbe785b4b289fa1b4b9bb36e6e2913390bed78acf9f29e648d3c8fcde958637d",
  "ref/ink-board.png 217a8bf0c846ff7531a7413cfdac979fa2dfd9f489d3bafbbd614382e4435fa3",
  "ref/ink-coach-native.png f1138f8709491244218c926d71487a5d5833eb893966484a5687176f99a41fb1",
  "ref/ink-today-native.png e80c388e4edec5a8241efcfb4e142708554182e7a1558148bb2d84c8885676be",
  "ref/ink-workout-native.png 56221feb62ac2be7bda52f0949f6fe17f259ad7a7e201d2bc8e7f1a1a2a13e58",
  "states/COACHING-RULES-INVENTORY-v1-notes.md fc0b9ef1f2ae19ed67878fbd154dc316987fcfcf6fe4bc4eafa70ae03f27eb36",
  "states/STATE-INVENTORY-DRAFT.md 059ffefd4522c0e8eb560206776bd42ea9f9ca609bc1e598c255e0d5c55c54fd",
  "states/TICKET-proposal-response.md 7dbaf2463135e5053329b1ed4131bb8e71c93a7da59d8364578ef32bf023d48e"
]);

/* THE IGNORE LIST, the cell's OWN and ANCHORED AT THE PACK ROOT (C.5.1; R3 N5 second half;
   R16). It is NOT read from .gitignore: .gitignore is in neither S8 map, so a branch that
   could widen the ignore file could widen the pin. These two entries live inside a cell S9
   declares role "new", so from S9 on widening them is a sealed byte move product() :1970
   and :1972 refuse. ANCHORED means matched from the first character of the pack-root
   relative path, so a file placed at app/quality/run/x.js does NOT leave the pin. The
   __pycache__ rule is a SEGMENT rule, because Python writes one beside every package. */
const IGNORE_PREFIX = "quality/run/";
const PYCACHE_SEGMENT = "__pycache__";

const toPosix = (p) => p.split(path.sep).join("/");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/* SORTED BY PATH BYTES, never by the default string sort (R4 N1.1, ADOPTED). The default
   sort compares UTF-16 code units, which orders a supplementary character BELOW U+E000
   because its surrogate pair starts at 0xD800; UTF-8 bytes order it ABOVE. The real pack's
   904 paths are all ASCII, where the two agree, so this is a guard rather than a fix, and
   the row "the comparator is byte-wise" below proves it is the guard it claims to be. */
const byteCompare = (a, b) => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
const sortByBytes = (paths) => [...paths].sort(byteCompare);

/* What a refusal calls the pack root: its repository-relative path when it is inside this
   checkout, and its own absolute path when it is a mkdtemp fixture. */
function label(root) {
  const rel = path.relative(REPO_ROOT, root);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel) ? toPosix(rel) : toPosix(root);
}

/* BOTH CLAUSES ARE C.5.1's WORDS AND NOT ONE CHARACTER WIDER (R1 BLOCKING-2). The spec
   skips a path that BEGINS "quality/run/" and one that contains a "__pycache__/" SEGMENT:
   both are written with the trailing slash and both are about DIRECTORIES. So the prefix
   is matched with its slash and never against the bare path "quality/run", and the segment
   rule excludes the FINAL segment. A regular FILE at either place is an ordinary pack file
   and stays pinned. The directory cases are unchanged: the walk lstats quality/run,
   descends it as a plain directory and skips every child by the prefix; it descends a
   __pycache__ directory and skips every child by the segment rule. */
function isIgnored(rel) {
  if (rel.startsWith(IGNORE_PREFIX)) return true;
  return rel.split("/").slice(0, -1).includes(PYCACHE_SEGMENT);
}

/* NO LEADING OR TRAILING SPACE IN THE PATH (R1 N4). The first build's ".+" was greedy, so
   two spaces between the path and the hex parsed as a path ENDING in a space and a typo in
   this cell's own constant was reported as two facts about the tree. */
const LITERAL_LINE = /^(\S(?:.*\S)?) ([0-9a-f]{64})$/;

/* A literal line that is not "<path> <space> <64-hex>" is a defect in this cell's own
   constant and not a fact about the tree, so it fails hard here rather than joining the
   refusal vocabulary. The same for a path listed twice. */
function parseLiteral(lines) {
  const out = [];
  const seen = new Set();
  for (const raw of lines) {
    const line = String(raw);
    if (line.trim() === "") continue;
    const m = LITERAL_LINE.exec(line);
    assert.ok(m, 'PACK-PIN literal line is not "<path> <space> <64-hex sha256>": ' + line);
    assert.ok(!m[1].includes("\\"), "PACK-PIN literal path must use forward slashes: " + m[1]);
    assert.ok(!seen.has(m[1]), "PACK-PIN literal names the same path twice: " + m[1]);
    seen.add(m[1]);
    out.push({ file: m[1], sha256: m[2] });
  }
  /* ASSERTED, NEVER RE-SORTED (R1 BLOCKING-3, R1 N4). The first build sorted the parsed
     lines, so an unsorted literal was accepted in silence and the cell could not claim the
     pasted lines were the ones C.5.1 step 3 emitted. Sortedness is a property of this
     cell's own constant, so it fails hard here exactly as a malformed line does, and the
     literal walk below is in path byte order because the literal IS. */
  for (let i = 1; i < out.length; i++) {
    assert.ok(byteCompare(out[i - 1].file, out[i].file) < 0,
      "PACK-PIN literal is not sorted by path bytes: " + out[i].file + " follows " + out[i - 1].file);
  }
  return out;
}

/* C.5.1's serialisation, the one step 3 of the procedure emits and step 4 pastes. */
const serialise = (entries) =>
  [...entries].sort((a, b) => byteCompare(a.file, b.file))
    .map((e) => e.file + " " + e.sha256 + "\n").join("");

/* THE ENGINE, and the only thing in this file that judges anything. It is a function of
   (trusted root, pinned relative pack path, literal lines) so that the fixture rows and the REAL ROW run the same code
   over different inputs: a fixture row that exercised a different engine would prove
   nothing about the real one. It returns the refusals as an array of strings, so a row can
   assert the EXACT text, and an empty array is the only green.

   AN ENTRY IS NAMED ONCE. An irregular entry refuses NOT-A-REGULAR-FILE, and an unreadable
   one refuses UNREADABLE; both take no part in the MISSING and ADDED comparisons, so one
   defect prints one line. The order is MISMATCH and MISSING walking the literal in byte
   order, then ADDED in byte order, then NOT-A-REGULAR-FILE, then UNREADABLE, each in byte
   order, which is stable whatever order readdir hands back. */
function walk(root, rel, observed, irregular, unreadable, readFile, names) {
  const dirAbs = rel === "" ? root : path.join(root, ...rel.split("/"));
  /* The root listing is already guarded by judge; interior directories retain the declared residual. */
  for (const name of names === undefined ? fs.readdirSync(dirAbs) : names) {
    const childRel = rel === "" ? name : rel + "/" + name;
    if (isIgnored(childRel)) continue;
    const abs = path.join(dirAbs, name);
    const st = fs.lstatSync(abs);
    if (st.isDirectory()) { walk(root, childRel, observed, irregular, unreadable, readFile); continue; }
    if (!st.isFile()) { irregular.add(childRel); continue; }
    /* NAMED, AND THE WALK GOES ON (the PM's ruling on Q2). A file the walk cannot read used
       to throw out of here, which stopped the run before every later path; now it is one
       more refusal and every later path is still judged in the same run. */
    let bytes = null;
    try { bytes = readFile(abs); } catch { unreadable.add(childRel); continue; }
    observed.set(childRel, sha256(bytes));
  }
}

/* readFile is the OPTIONAL READER of the PM's Q2 ruling: the file system's own by default,
   and passed only by the fixture rows that need an unreadable file on a machine where one
   cannot be built (Windows without a DENY ACE, and a farm scratch running as root). The
   REAL ROW passes none, and a row below asserts that by reading this file's own source. */
function judge(root, packRootRel, literalLines, readFile) {
  /* P-PACK-5: the caller supplies the trusted root and exact relative spelling.
     Real and synthetic inputs enter this single walk; no absolute-path comparison
     selects a boundary. The trusted root itself is not inspected as a component. */
  const parts = packRootRel.split("/");
  const packRoot = path.join(root, ...parts);
  let dir = root;
  let st = null;
  for (let i = 0; i < parts.length; i++) {
    const component = path.join(dir, parts[i]);
    try { st = fs.lstatSync(component); } catch { st = null; }
    if (st === null) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];
    if (i < parts.length - 1 && !st.isDirectory()) {
      return ["PACK-PIN NOT-A-REGULAR-FILE " + label(component)];
    }
    let names;
    try { names = fs.readdirSync(dir); } catch { return ["PACK-PIN UNREADABLE " + label(dir)]; }
    if (!names.includes(parts[i])) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];
    dir = component;
  }
  if (st === null || !st.isDirectory()) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];

  let rootNames;
  try { rootNames = fs.readdirSync(packRoot); } catch { return ["PACK-PIN UNREADABLE " + label(packRoot)]; }

  const literal = parseLiteral(literalLines);
  if (literal.length === 0) return ["PACK-PIN LITERAL-EMPTY"];

  const observed = new Map();
  const irregular = new Set();
  const unreadable = new Set();
  walk(packRoot, "", observed, irregular, unreadable, readFile, rootNames);

  const refusals = [];
  for (const e of literal) {
    if (irregular.has(e.file) || unreadable.has(e.file)) continue;
    const got = observed.get(e.file);
    if (got === undefined) refusals.push("PACK-PIN MISSING " + e.file);
    else if (got !== e.sha256) refusals.push("PACK-PIN MISMATCH " + e.file);
  }
  const listed = new Set(literal.map((e) => e.file));
  for (const rel of sortByBytes([...observed.keys()])) {
    if (!listed.has(rel)) refusals.push("PACK-PIN ADDED " + rel);
  }
  /* R3's DISPUTE, UPHELD BY THE PM AND RECORDED AS A DECISION RATHER THAN AN OVERSIGHT.
     The byte sorts on these two output lists have NO row and will not get one. Killing
     either deterministically needs a fixture in which the walk's insertion order provably
     differs from byte order, and insertion order is readdir order, which neither operating
     system guarantees: such a row is a flake generator on a PC six lanes share. Neither
     sort can produce a false green or a wrong name - both lines are printed either way and
     only their order moves - and the comparator itself is proven by the row "the comparator
     is byte-wise" below. The ADDED list's sort above has a row on Windows; Linux readdir order may
     already match byte order, so Linux cannot reliably hold removal of that sort. */
  for (const rel of sortByBytes([...irregular])) refusals.push("PACK-PIN NOT-A-REGULAR-FILE " + rel);
  for (const rel of sortByBytes([...unreadable])) refusals.push("PACK-PIN UNREADABLE " + rel);
  return refusals;
}

/* R2 N2. EVERY REFUSAL THIS FILE EMITS IS RECORDED AS IT IS RETURNED, so the last row can
   DERIVE the vocabulary from what the rows above actually produced instead of asserting
   the shape of a constant and calling that reachability. Recording is a harness concern
   and never a verdict: packPin returns exactly what the engine returned, unchanged, and
   every caller - the fixture rows and the REAL ROW alike - goes through this one door. */
const EMITTED = new Set();

function packPin(root, packRootRel, literalLines, readFile = fs.readFileSync) {
  const refusals = judge(root, packRootRel, literalLines, readFile);
  for (const r of refusals) EMITTED.add(r.split(" ", 2).join(" "));
  return refusals;
}

/* Fixture-only conversion: every caller constructs its pack below os.tmpdir().
   It supplies that trusted root explicitly; this helper does not select a boundary. */
const s9PackRel = (packRoot) => packRoot.slice(os.tmpdir().length + 1).split(path.sep).join("/");

/* THE THROWAWAY FIXTURE PACK: the real pack's shape in miniature, built by this file in a
   mkdtemp folder and removed again. It holds a board under ref/, an app file, a gate
   script and a baseline PNG and a state record under quality/, README.md, the untracked
   run output and __pycache__ a machine that has RUN the gates leaves behind, and the DECOY
   at app/quality/run/x.js which an unanchored ignore rule would drop out of the pin.

   The literal comes from the MANIFEST, not from a walk of what was written: a fixture that
   generated its own expectation with the code under test would assert nothing. */
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = (s) => Buffer.concat([PNG_SIG, Buffer.from(s, "utf8")]);
const txt = (s) => Buffer.from(s, "utf8");

const FIXTURE = Object.freeze([
  { file: "README.md", tracked: true, bytes: txt("# the pack\n") },
  { file: "app/states-today.js", tracked: true, bytes: txt("export const T = 1;\n") },
  { file: "app/quality/run/x.js", tracked: true, bytes: txt("// the decoy: NOT ignored\n") },
  { file: "quality/STANDARD.md", tracked: true, bytes: txt("# the standard\n") },
  { file: "quality/gate.py", tracked: true, bytes: txt("TOL = 0.001\n") },
  { file: "quality/baseline/linux/ENV.txt", tracked: true, bytes: txt("linux\n") },
  { file: "quality/baseline/states/C-02-dawn.json", tracked: true, bytes: txt('{"text":"dawn"}\n') },
  { file: "quality/baseline/screens/T-01.png", tracked: true, bytes: png("T-01") },
  { file: "ref/ink-board.png", tracked: true, bytes: png("ink-board") },
  { file: "states/STATE-INVENTORY-DRAFT.md", tracked: true, bytes: txt("# states\n") },
  { file: "quality/run/last-run.json", tracked: false, bytes: txt('{"ran":true}\n') },
  { file: "quality/__pycache__/common.cpython-311.pyc", tracked: false, bytes: txt("cache\n") },
  { file: "quality/baseline/__pycache__/x.cpython-311.pyc", tracked: false, bytes: txt("cache\n") },
]);

function writeAt(root, rel, bytes) {
  const full = path.join(root, ...rel.split("/"));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, bytes);
  return full;
}

/* Builds the fixture, hands (root, literal lines) to the body, and removes it again. */
function withPack(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-pack-"));
  try {
    for (const e of FIXTURE) writeAt(root, e.file, e.bytes);
    const lines = FIXTURE.filter((e) => e.tracked)
      .map((e) => ({ file: e.file, sha256: sha256(e.bytes) }));
    lines.sort((a, b) => byteCompare(a.file, b.file));
    return body(root, lines.map((e) => e.file + " " + e.sha256));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

/* Replaces one line of a literal with the same path at a different sha256, which is what a
   moved file looks like to the cell without having to know the new bytes. */
const moved = (lines, file) =>
  lines.map((l) => (l.startsWith(file + " ") ? file + " " + "0".repeat(64) : l));
const without = (lines, file) => lines.filter((l) => !l.startsWith(file + " "));

test("GREEN CONTROL: the fixture pack as built, against its own literal, refuses nothing", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

test("B.8 (1) a board moved FAILS PACK-PIN MISMATCH ref/ink-board.png", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "ref/ink-board.png")),
      ["PACK-PIN MISMATCH ref/ink-board.png"]);
  });
});

test("B.8 (2) an app file moved FAILS PACK-PIN MISMATCH app/states-today.js", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "app/states-today.js")),
      ["PACK-PIN MISMATCH app/states-today.js"]);
  });
});

/* The row v3's quality/** exclusion would have passed, and the whole point of PM-R6'(i):
   a gate that judges every post-S9 look ticket must not be editable by the ticket. */
test("B.8 (3) a gate script moved FAILS PACK-PIN MISMATCH quality/gate.py", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/gate.py")),
      ["PACK-PIN MISMATCH quality/gate.py"]);
  });
});

test("B.8 (4) a baseline moved FAILS PACK-PIN MISMATCH naming the state record", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/baseline/states/C-02-dawn.json")),
      ["PACK-PIN MISMATCH quality/baseline/states/C-02-dawn.json"]);
  });
});

test("B.8 (5) a file added FAILS PACK-PIN ADDED naming the new state record", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/baseline/states/C-99-dawn.json", txt('{"text":"dusk"}\n'));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines),
      ["PACK-PIN ADDED quality/baseline/states/C-99-dawn.json"]);
  });
});

test("B.8 (6) a file removed FAILS PACK-PIN MISSING naming the state inventory", () => {
  withPack((root, lines) => {
    fs.rmSync(path.join(root, "states", "STATE-INVENTORY-DRAFT.md"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines),
      ["PACK-PIN MISSING states/STATE-INVENTORY-DRAFT.md"]);
  });
});

/* B.8's seventh row, the green control the ignore list exists for: the design gates are
   run on the design lane's own machine, and a checkout they have run in carries untracked
   output inside the pack. It must not read as ADDED. */
test("GREEN CONTROL: untracked run output and __pycache__ inside the pack change nothing", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/run/2026-09-19/report.html", txt("<p>run</p>\n"));
    writeAt(root, "quality/run/latest.png", png("latest"));
    writeAt(root, "app/__pycache__/helper.cpython-311.pyc", txt("cache\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* THE ANCHOR. An unanchored segment match would drop a file placed at app/quality/run/x.js
   out of the pin for ever, which is a place to hide a change (R3 N5, second half). */
test("THE ANCHOR: the decoy at app/quality/run/x.js is pinned, and a move of it is named", () => {
  withPack((root, lines) => {
    assert.ok(lines.some((l) => l.startsWith("app/quality/run/x.js ")),
      "the decoy must be in the fixture literal, or this row proves nothing");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "app/quality/run/x.js")),
      ["PACK-PIN MISMATCH app/quality/run/x.js"]);
  });
});

test("THE ANCHOR, the other half: a file at the anchored prefix IS skipped", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    writeAt(root, "quality/run/x.js", txt("// skipped\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* R4 N1.1, ADOPTED, and the row that proves it on the machine that would break it. A walk
   built on the platform separator spells the same path with a backslash on windows-latest
   and mismatches every one of the 904 literal lines. This row keeps ONE literal line and
   reads every other pack file back out of the ADDED refusals, so it sees exactly what the
   walk emits, in the order it emits it. */
test("R4 N1.1: every path the walk emits is pack-root-relative, forward-slashed, byte-sorted", () => {
  withPack((root, lines) => {
    const keep = lines.filter((l) => l.startsWith("README.md "));
    assert.equal(keep.length, 1);
    const refusals = packPin(os.tmpdir(), s9PackRel(root), keep);
    const expected = sortByBytes(
      FIXTURE.filter((e) => e.tracked && e.file !== "README.md").map((e) => e.file),
    ).map((f) => "PACK-PIN ADDED " + f);
    assert.deepEqual(refusals, expected);
    for (const r of refusals) assert.ok(!r.includes("\\"), "a path came back with a backslash: " + r);
  });
});

/* The comparator, on its own, because the real pack's 904 paths are all ASCII and ASCII is
   the one alphabet where the default sort and a byte sort agree. */
test("R4 N1.1: the comparator is byte-wise, and the default string sort would differ", () => {
  /* Built rather than typed, so the two characters are TEXT in this file and not the
     invisible things they name: U+E000 is one UTF-16 code unit and three UTF-8 bytes
     starting 0xEE; U+10000 is a surrogate pair starting 0xD800 and four UTF-8 bytes
     starting 0xF0. UTF-16 puts the surrogate first; the bytes put it second. */
  const a = String.fromCharCode(0xe000) + ".json";
  const b = String.fromCodePoint(0x10000) + ".json";
  assert.deepEqual(sortByBytes([b, a]), [a, b]);
  assert.deepEqual([b, a].sort(), [b, a]);
  assert.notDeepEqual([b, a].sort(), sortByBytes([b, a]));
});

/* C.5.1 step 3 and step 5 as one row: what the procedure emits is what the cell reads. */
test("C.5.1: the serialisation round-trips through parseLiteral unchanged", () => {
  withPack((root, lines) => {
    const parsed = parseLiteral(lines);
    const text = serialise(parsed);
    assert.equal(text, lines.join("\n") + "\n");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), text.split("\n")), []);
  });
});

function tryLink(target, linkPath, type) {
  try { fs.symlinkSync(target, linkPath, type); return null; }
  catch (e) { return e.code || String(e); }
}

/* R4 N1.2, ADOPTED, and R4 section 2's only green-while-changed. readFileSync FOLLOWS a
   link; git cat-file blob does not. So a tracked pack file replaced by a link to a copy of
   the SAME BYTES reads green under a naive walk while the tree has changed, and the same
   commit checks out on Windows as a text file holding the target path, which is red there
   and green on linux. lstat closes it on both.

   WHAT EACH OS'S ROW PROVES, exactly, because the two OS do not allow the same things:
   an unprivileged process on linux may create a FILE symlink; an unprivileged process on
   Windows may NOT (measured on the PC: EPERM, no Developer Mode), but it may create a
   DIRECTORY JUNCTION, which needs no privilege. So the file-link half is proved on linux
   and recorded as unbuildable on Windows, and the junction half is proved on BOTH. */
test("R4 N1.2 (a): a FILE link over a pinned file refuses NOT-A-REGULAR-FILE, naming it", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      const twin = path.join(outside, "ink-board.png");
      fs.writeFileSync(twin, png("ink-board"));
      const target = path.join(root, "ref", "ink-board.png");
      fs.rmSync(target);
      const err = tryLink(twin, target, "file");
      if (err === null) {
        assert.equal(sha256(fs.readFileSync(target)), sha256(png("ink-board")),
          "the link must read back as the SAME bytes, or this row is not the attack");
        assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE ref/ink-board.png"]);
      } else {
        assert.equal(process.platform, "win32",
          "a file link must be buildable by an unprivileged process off win32, got " + err);
        /* R1 N6: the CODE is recorded, not pinned. It is EPERM on this PC with no
           Developer Mode, and windows-latest is a different account this branch has never
           run on. A row that pinned the errno would go red on a runner for a reason that
           is not a defect in the pin; a runner that SUCCEEDS takes the branch above and
           runs the whole attack, which is the outcome to prefer. */
        assert.equal(typeof err, "string");
        assert.ok(err.length > 0, "a failed link must report a code");
        console.log("PACK-PIN file-link on win32 is unbuildable unprivileged, code: " + err);
      }
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

test("R4 N1.2 (b): a DIRECTORY link over a pinned directory refuses it and is not descended", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "states"));
      fs.writeFileSync(path.join(outside, "states", "C-02-dawn.json"), txt('{"text":"dawn"}\n'));
      const target = path.join(root, "quality", "baseline", "states");
      fs.rmSync(target, { recursive: true });
      const err = tryLink(path.join(outside, "states"), target, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), [
        "PACK-PIN MISSING quality/baseline/states/C-02-dawn.json",
        "PACK-PIN NOT-A-REGULAR-FILE quality/baseline/states",
      ]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* THE TWO REFUSALS THE REAL ROW CAN PRINT BEFORE THE S9 HEAD EXISTS, and their order.
   PACK-ROOT-ABSENT is a fact about the checkout and LITERAL-EMPTY is a fact about this
   cell, so the checkout is judged first: on this branch the pack has not merged, when it
   merges the refusal becomes LITERAL-EMPTY, and when the integrator runs C.5.1 it goes
   green. Three states, in that order, each with a name. */
test("PACK-ROOT-ABSENT: a pack root that is not in the checkout refuses, naming the root", () => {
  const gone = path.join(os.tmpdir(), "s9cpin-no-such-pack-" + process.pid);
  assert.ok(!fs.existsSync(gone));
  assert.deepEqual(packPin(os.tmpdir(), s9PackRel(gone), ["README.md " + "a".repeat(64)]),
    ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(gone)]);
});

test("PACK-ROOT-ABSENT: a pack root that is a FILE is absent too, not walked", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-notdir-"));
  try {
    const f = path.join(dir, "pack");
    fs.writeFileSync(f, txt("not a directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(f), ["README.md " + "a".repeat(64)]),
      ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(f)]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("LITERAL-EMPTY: a present pack and an unfilled literal refuses, and never passes", () => {
  withPack((root) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), []), ["PACK-PIN LITERAL-EMPTY"]);
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), ["", "   "]), ["PACK-PIN LITERAL-EMPTY"]);
  });
});

test("the two refusals do not both fire: an absent root is judged before an empty literal", () => {
  const gone = path.join(os.tmpdir(), "s9cpin-no-such-pack-b-" + process.pid);
  assert.ok(!fs.existsSync(gone));
  assert.deepEqual(packPin(os.tmpdir(), s9PackRel(gone), []), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(gone)]);
});

test("a literal line that is not the serialisation fails hard rather than being skipped", () => {
  withPack((root, lines) => {
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, "quality/gate.py deadbeef"]),
      /literal line is not/);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, lines[0]]),
      /names the same path twice/);
  });
});

/* THE DAY-OF COST, measured rather than assumed. At ecbef86a the real pack holds 904
   git-tracked files, so this row builds 904 and walks them. It asserts the SHAPE (green
   over 904 lines, one line per file) and PRINTS the elapsed time; it asserts no threshold,
   because a threshold on a PC shared with six other lanes is a flake generator. The
   fixture's bytes are small, which is the right shape for this measurement: the cost of
   this cell is 904 lstat-and-read round trips, not the sha256 of a few megabytes. */
function withBigPack(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-904-"));
  try {
    const entries = [{ file: "README.md", bytes: txt("# the pack\n") }];
    const add = (f, b) => entries.push({ file: f, bytes: b });
    for (let i = 0; i < 8; i++) add("ref/board-" + String(i).padStart(2, "0") + ".png", png("ref" + i));
    for (let i = 0; i < 42; i++) add("app/mod-" + String(i).padStart(2, "0") + ".js", txt("export const M" + i + " = " + i + ";\n"));
    for (let i = 0; i < 3; i++) add("states/STATE-" + i + ".md", txt("# state " + i + "\n"));
    for (const n of ["STANDARD.md", "common.py", "gate.py", "phonesheet.py", "statesheet.py", "teeth.py"]) add("quality/" + n, txt("# " + n + "\n"));
    for (let i = 0; i < 6; i++) add("quality/baseline/linux/L-" + i + ".png", png("linux" + i));
    add("quality/baseline/linux/ENV.txt", txt("linux\n"));
    for (let i = 0; i < 419; i++) add("quality/baseline/states/S-" + String(i).padStart(3, "0") + ".json", txt('{"text":"state ' + i + '"}\n'));
    for (let i = 0; i < 418; i++) add("quality/baseline/screens/T-" + String(i).padStart(3, "0") + ".png", png("screen-" + i + "-".repeat(512)));
    for (const e of entries) writeAt(root, e.file, e.bytes);
    const lines = entries.map((e) => ({ file: e.file, sha256: sha256(e.bytes) }));
    lines.sort((a, b) => byteCompare(a.file, b.file));
    return body(root, lines.map((e) => e.file + " " + e.sha256), entries.length);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("SCALE: 904 files, the shape of the real pack, green and timed", () => {
  withBigPack((root, lines, count) => {
    assert.equal(count, 904);
    assert.equal(lines.length, 904);
    const started = process.hrtime.bigint();
    const refusals = packPin(os.tmpdir(), s9PackRel(root), lines);
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    assert.deepEqual(refusals, []);
    console.log("PACK-PIN over 904 files on " + process.platform + ": " + ms.toFixed(0) + " ms");
  });
});

test("SCALE: one moved byte among 904 is named, and nothing else is", () => {
  withBigPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/baseline/states/S-207.json")),
      ["PACK-PIN MISMATCH quality/baseline/states/S-207.json"]);
  });
});

/* THE WORKING TREE, AT RUN TIME. Nothing is cached between calls: the same (root, literal)
   pair is green, then red the moment a byte moves on disk, then green again. This is what
   makes the red rows reachable at all, and it is what a value taken at a fixed commit
   could not do (R3 BLOCKING-F). */
test("the cell reads the WORKING TREE on every call and caches nothing", () => {
  withPack((root, lines) => {
    const p = path.join(root, "quality", "gate.py");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    fs.writeFileSync(p, txt("TOL = 0.002\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN MISMATCH quality/gate.py"]);
    fs.writeFileSync(p, txt("TOL = 0.001\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* ============================ R1 FIX ROUND ============================
   Every row below closes a finding of rebuild/lanes/b/S9-PREP-PACK-REVIEW-R1.md. Each one
   names the finding it closes, so a later reader can tell which rows exist because
   something was measured wrong rather than because it was designed. */
/* R1 BLOCKING-2. C.5.1's skip is "a pack-root-relative path BEGINS quality/run/ or
   contains a __pycache__/ SEGMENT". Both are written WITH the trailing slash and both are
   about DIRECTORIES. A regular FILE at quality/run, and a regular FILE whose LAST segment
   is __pycache__, are ordinary files sitting inside the owner-approved pack; they are not
   the gate's untracked output and nothing in .gitignore keeps them out of a commit. R1
   measured that the first build swallowed both. They are pinned. */
test("R1 B2: a regular FILE at quality/run is ADDED, not swallowed by the ignore prefix", () => {
  withPack((root, lines) => {
    fs.rmSync(path.join(root, "quality", "run"), { recursive: true });
    writeAt(root, "quality/run", txt("// a FILE at the prefix, not the output directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN ADDED quality/run"]);
  });
});

test("R1 B2: a regular FILE named __pycache__ is ADDED, while the DIRECTORY stays ignored", () => {
  withPack((root, lines) => {
    writeAt(root, "app/__pycache__", txt("// a FILE, not a python cache directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN ADDED app/__pycache__"]);
  });
});

/* R1 B2, THE CONSEQUENCE, STATED RATHER THAN DISCOVERED. Dropping the "quality/run exactly"
   clause means the walk now lstats that path instead of skipping it, so a LINK standing
   there is an irregular entry and is named. That is the spec's shape: quality/run is only
   invisible to the pin as a plain directory whose CHILDREN begin quality/run/. A design
   machine that symlinks its own output directory gets one loud line naming it, which is
   the behaviour this cell chose and the PM can overrule with a sealed byte move. */
test("R1 B2: a LINK at quality/run is an irregular entry and is named, not treated as output", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "run"));
      fs.rmSync(path.join(root, "quality", "run"), { recursive: true });
      const err = tryLink(path.join(outside, "run"), path.join(root, "quality", "run"), "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE quality/run"]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});
/* R1 BLOCKING-3, first of three uncovered guards. label()'s repo-relative branch is the
   only code that produces the refusal text the S9 integrator will read on the day the pack
   has not merged, and R1 measured that no row asserted it. label() is pure path arithmetic
   and touches no disk, so this row is stable whether or not the pack is in the checkout. */
test("R1 B3: label() names a root inside this checkout repo-relatively and one outside it absolutely", () => {
  assert.equal(label(PACK_ROOT_ABS), PACK_ROOT_REL);
  assert.equal(label(path.join(REPO_ROOT, "rebuild", "m1")), "rebuild/m1");
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-label-"));
  try {
    assert.equal(label(out), toPosix(out));
    assert.notEqual(label(out), PACK_ROOT_REL);
    assert.ok(!label(out).includes("\\"), "a label came back with a backslash: " + label(out));
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

/* R1 BLOCKING-3, second: the literal-side half of R4 N1.1. A literal generated on Windows
   by a procedure that used the platform separator would spell every path with a backslash,
   and this cell's own constant would then disagree with its own walk on one OS only. The
   backslash is built from its code point so it is TEXT in this file. */
test("R1 B3: a literal path spelled with a BACKSLASH fails hard (R4 N1.1, the literal side)", () => {
  withPack((root, lines) => {
    const bs = String.fromCharCode(92);
    const bad = "quality" + bs + "gate.py " + "a".repeat(64);
    assert.ok(bad.includes(bs), "this row must carry a real backslash, or it proves nothing");
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, bad]), /must use forward slashes/);
  });
});

/* R1 BLOCKING-3, third, and R1 N4's first half. The first build RE-SORTED an unsorted
   literal in silence, so the cell could not claim the pasted lines were the ones C.5.1
   step 3 emitted. An unsorted literal is a defect in this cell's own constant, exactly
   like a malformed line or a duplicate path, and it now fails hard in the same way. */
test("R1 B3 / R1 N4: an UNSORTED literal fails hard rather than being silently re-sorted", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    const swapped = [...lines];
    const first = swapped[0];
    swapped[0] = swapped[1];
    swapped[1] = first;
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), swapped), /not sorted by path bytes/);
  });
});

test("the refusals walk the literal in path BYTE order, one line per moved file", () => {
  withPack((root, lines) => {
    const two = moved(moved(lines, "ref/ink-board.png"), "app/states-today.js");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), two), [
      "PACK-PIN MISMATCH app/states-today.js",
      "PACK-PIN MISMATCH ref/ink-board.png",
    ]);
  });
});
/* R1 BLOCKING-3's fourth point, and the one row that changes a mutation's verdict rather
   than only its count. R1 measured that "an entry is named ONCE" (the skip of an irregular
   entry in the literal walk) is killed on linux only, because the directory-link row pins a
   FILE UNDER the junction and never the junction itself, and the file-link row cannot be
   built on Windows. A DIRECTORY JUNCTION can be created AT the path of a pinned FILE, and
   that needs no privilege on either OS. So this row puts an irregular entry exactly where
   the literal names a file, on BOTH operating systems: one line, NOT_A_REGULAR_FILE, and no
   MISSING beside it. It is the Windows half the first build did not have. */
test("R4 N1.2 (c): a DIRECTORY link AT a pinned FILE refuses ONCE, on both operating systems", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "d"));
      fs.writeFileSync(path.join(outside, "d", "decoy.txt"), txt("not in the pack\n"));
      const target = path.join(root, "ref", "ink-board.png");
      fs.rmSync(target);
      const err = tryLink(path.join(outside, "d"), target, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE ref/ink-board.png"]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* R1 N4's second half. Two spaces between the path and the hex were read as a path with a
   TRAILING SPACE, so a typo in this cell's own constant was reported as two facts about
   the tree (a MISSING file with a space in its name and an ADDED one without). It is a
   defect in the constant and it fails hard. */
test("R1 N4: two spaces between the path and the hex fails hard, not as a trailing-space path", () => {
  withPack((root) => {
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), ["quality/gate.py  " + "a".repeat(64)]),
      /literal line is not/);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [" quality/gate.py " + "a".repeat(64)]),
      /literal line is not/);
  });
});

/* R1 N5(a), RECORDED AS A DECISION AND NOT LEFT TO BE DISCOVERED. A python module placed
   inside a __pycache__ DIRECTORY inside the pack is invisible to this pin by construction,
   and python will import it if sys.path reaches it. The ignore list cannot close this
   without un-ignoring the caches the design machine really does leave behind, which is the
   opposite trade. This row exists so the hole is a sealed, named fact: if a later round
   narrows the ignore list, this row goes red and somebody has to think. */
test("RESIDUAL (R1 N5a): a file inside a __pycache__ DIRECTORY is invisible to the pin, by construction", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/__pycache__/teeth.py", txt("# a module the pin cannot see\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* ============================ R2 FIX ROUND ============================
   Every row below closes a finding of rebuild/lanes/b/S9-PREP-PACK-REVIEW-R2.md or takes a
   PM ruling on a question the author asked, and names which. */

/* R2 BLOCKING-1. packPin opens with lstatSync(packRoot) and the comment above it says why,
   and R2 measured that NOTHING exercised that sentence: lstat -> stat turned no row red on
   either operating system. The two PACK-ROOT-ABSENT rows above use a path that does not
   exist and a path that is a regular FILE, and stat and lstat agree on both. This is R4
   section 2's green-while-changed one level up: not a pinned file replaced by a link to a
   twin, but the WHOLE PACK replaced by one, and the pack root is the one entry the walk
   never sees. A directory junction needs no privilege on either operating system, so the
   row is the same construction on both, which is what makes it the Windows row too. */
test("R2 B1: a LINK standing AT the pack root is ABSENT, even over a twin that matches", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-hold-"));
    try {
      const link = path.join(outside, "approved-2026-09-18");
      const err = tryLink(root, link, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), [],
        "the fixture must be green through its own root, or this row is not the attack");
      assert.equal(sha256(fs.readFileSync(path.join(link, "README.md"))), sha256(txt("# the pack\n")),
        "the twin must read back the SAME bytes through the link, or this row is not the attack");
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(link), lines), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(link)]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* R2 N3, SAID RATHER THAN LEFT TO BE REDISCOVERED. A LITERAL LINE NAMING A PATH OUTSIDE
   THE PACK IS BENIGN BY CONSTRUCTION, and the reason is the engine's shape: it never OPENS
   a literal path, it only asks the Map the walk built, and the walk only ever puts
   pack-root-relative paths in it. So "..", a leading slash, a drive letter and "./" are
   each a MISSING line naming the path and no traversal is reachable from any of them.
   That is not an inconsistency with the backslash clause above, which fails HARD: a
   backslash is a spelling defect that would make this cell's own constant disagree with
   its own walk on ONE operating system, which is the class of defect the parser exists to
   catch, while a path outside the pack is simply a line about a file that is not there. */
test("R2 N3: a literal path OUTSIDE the pack is benign: it is MISSING, and is never opened", () => {
  withPack((root, lines) => {
    const hex = "a".repeat(64);
    const bs = String.fromCharCode(92);
    const outsiders = ["../../etc/hosts", "./x", "/etc/hosts", "C:/Windows/win.ini"];
    assert.deepEqual([...outsiders].sort(byteCompare), outsiders,
      "the four must already be in path byte order, or the literal is unsorted and fails hard");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), [...outsiders.map((p) => p + " " + hex), ...lines]),
      outsiders.map((p) => "PACK-PIN MISSING " + p));
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), ["C:" + bs + "Windows " + hex, ...lines]),
      /must use forward slashes/);
  });
});

/* THE PM'S RULING ON THE AUTHOR'S Q2: UNREADABLE JOINS THE VOCABULARY NOW, as the seventh
   refusal, because from S9 the vocabulary is sealed bytes and a refusal added later costs
   a reseal child. R1 N3 measured the hole on the PC with a DENY ACE: a pinned file the
   walk cannot read made readFileSync THROW, so the cell went loudly red with a message
   that is none of its refusals AND the walk stopped before every later path. Now the walk
   NAMES it and CONTINUES, so a second defect further down is still named in the same run.
   R1's DENY-ACE measurement is the one real-file witness and it is WINDOWS ONLY; the
   author report says so.

   HOW THE ROW IS BUILT ON BOTH OPERATING SYSTEMS AND UNDER uid 0. A real unreadable file
   needs a DENY ACE on Windows and cannot be built at all in a farm scratch, which runs as
   root, where chmod proves nothing. So THE ENGINE TAKES AN OPTIONAL READER AS ITS LAST
   PARAMETER, defaulting to the file system's own, and ONLY FIXTURE ROWS PASS ONE. The last
   row of this block scans this file's own source and asserts the REAL ROW passes none, so
   the option can never become the way the real pin reads.

   ONE RESIDUAL, NAMED RATHER THAN DISCOVERED: an unreadable DIRECTORY still throws out of
   readdirSync. That is the same LOUD RED the file case used to be, it is not a silent
   green, and closing it would mean a second optional reader for directories. It is in the
   author report's integrator list. */
const readerRefusing = (root, ...rels) => {
  const denied = new Set(rels.map((r) => path.join(root, ...r.split("/"))));
  return (abs) => {
    if (!denied.has(abs)) return fs.readFileSync(abs);
    const e = new Error("EACCES: permission denied, open " + abs);
    e.code = "EACCES";
    throw e;
  };
};

test("R2 Q2 / UNREADABLE: a pinned file the walk cannot read is NAMED, not thrown over", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines, readerRefusing(root, "quality/gate.py")),
      ["PACK-PIN UNREADABLE quality/gate.py"]);
  });
});

test("R2 Q2 / UNREADABLE: the walk CONTINUES, so a later defect is named in the same run", () => {
  withPack((root, lines) => {
    assert.deepEqual(
      packPin(os.tmpdir(), s9PackRel(root), moved(lines, "ref/ink-board.png"), readerRefusing(root, "app/states-today.js")),
      ["PACK-PIN MISMATCH ref/ink-board.png", "PACK-PIN UNREADABLE app/states-today.js"]);
  });
});

/* An unreadable entry is a thing this cell cannot speak about, exactly as an irregular one
   is, so it takes no part in the MISSING and ADDED comparisons: one defect, one line,
   whether or not the literal names the path. */
test("R2 Q2 / UNREADABLE: an unreadable entry is named ONCE, never also MISSING or ADDED", () => {
  withPack((root, lines) => {
    const reader = readerRefusing(root, "quality/gate.py", "app/quality/run/x.js");
    const expected = [
      "PACK-PIN UNREADABLE app/quality/run/x.js",
      "PACK-PIN UNREADABLE quality/gate.py",
    ];
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines, reader), expected);
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), without(lines, "quality/gate.py"), reader), expected);
  });
});

test("R2 Q2: the OPTIONAL reader is a fixture affordance, and the REAL ROW passes none", () => {
  const src = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
  assert.equal(packPin.length, 3,
    "the reader must be OPTIONAL: packPin declares three parameters before its default");
  assert.match(src, /readFile = fs\.readFileSync/,
    "the default reader must be the file system's own");
  /* Built from two pieces so this row's own source does not match the pattern it searches
     for, which would make the row pass on itself. */
  const realCall = "packPin(" + "REPO_ROOT, PACK_ROOT_REL, LITERAL);";
  assert.deepEqual(src.match(/packPin\(REPO_ROOT.*/g), [realCall],
    "the real row must call the engine over the real pack with NO reader");
});


/* Astra P-PACK-1/2: synthetic paths and independently verified byte digests.
   certutil SHA256 verified the five nonempty vectors; .NET SHA256 verified empty.
   Expectations below never call the cell's sha256 helper. */
const S9_HEX = Object.freeze({
  empty: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  ascii: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  lf: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03",
  crlf: "cd2eca3535741f27a8ae40c31b0c41d4057a7a7b912b33b9aed86485d1c84676",
  invalid: "eddf68639913a3cb8331cdfe7f87559e0beccf2c289c0d90ac4d89b3204004f8",
  replacement: "2d4bf56bf338c578dae8b2b20d4d8b28801557d4c38e1d7c6699abddf69fee8d",
});
function s9WithRoot(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9-astra-"));
  try { return body(root); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}


/* Hooks watch only fs.lstatSync and fs.readdirSync; statSync, opendirSync, async
   readdir and fs.promises.readdir are not observed. Restore before any assertion. */
function s9NoDescents(blocked, body) {
  const lstat = fs.lstatSync;
  const readdir = fs.readdirSync;
  const attempts = [];
  const inside = (abs) => {
    const rel = path.relative(blocked, abs);
    return rel !== "" && rel.split(path.sep)[0] !== ".." && !path.isAbsolute(rel);
  };
  fs.lstatSync = (abs, ...args) => { if (inside(abs)) attempts.push("lstat"); return lstat(abs, ...args); };
  fs.readdirSync = (abs, ...args) => { if (abs === blocked || inside(abs)) attempts.push("readdir"); return readdir(abs, ...args); };
  let result;
  let failed = false;
  let bodyError;
  try { result = body(); }
  catch (error) { failed = true; bodyError = error; }
  finally {
    fs.lstatSync = lstat;
    fs.readdirSync = readdir;
  }
  if (failed) throw bodyError;
  assert.deepEqual(attempts, [], "refusal must precede metadata descent");
  return result;
}

for (const [name, bytes] of [
  ["empty", Buffer.alloc(0)], ["ascii", txt("abc")],
  ["lf", txt("hello\n")], ["crlf", txt("hello\r\n")],
  ["invalid", Buffer.from([0xc3, 0x28])], ["replacement", Buffer.from([0xef, 0xbf, 0xbd, 0x28])],
]) {
  test("Astra P-PACK-2: independent digest vector " + name, () => {
    s9WithRoot((root) => {
      writeAt(root, "a.txt", bytes);
      assert.deepEqual(s9Pin(root, "a.txt", S9_HEX[name]), []);
    });
  });
}

test("Astra P-PACK-2: LF and CRLF differ against one unchanged literal", () => {
  s9WithRoot((root) => {
    writeAt(root, "a.txt", txt("hello\n"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.lf), []);
    writeAt(root, "a.txt", txt("hello\r\n"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.lf), [S9_NAME + " MISMATCH a.txt"]);
  });
});

test("Astra P-PACK-2: invalid UTF-8 and its replacement decoding differ", () => {
  s9WithRoot((root) => {
    const invalid = Buffer.from([0xc3, 0x28]);
    const decoded = Buffer.from([0xef, 0xbf, 0xbd, 0x28]);
    assert.equal(invalid.toString("utf8"), decoded.toString("utf8"));
    writeAt(root, "a.txt", invalid);
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.invalid), []);
    writeAt(root, "a.txt", decoded);
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.invalid), [S9_NAME + " MISMATCH a.txt"]);
  });
});

test("Astra P-PACK-1: ordinary nested path stays green", () => {
  s9WithRoot((root) => {
    const file = "one/two/a.txt";
    writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, file, S9_HEX.ascii), []);
  });
});

/* L2 N4: pure budget arithmetic, also used by the actual long-path row. */
function s9LongPath(rootLength) {
  const tail = "/a.txt";
  const remaining = 455 - rootLength - 1 - tail.length;
  const first = "d".repeat(120) + "/" + "e".repeat(120) + "/";
  if (remaining <= first.length) return null;
  return first + "f".repeat(remaining - first.length) + tail;
}

test("Astra P-PACK-1: a 455-character absolute path stays green", (t) => {
  s9WithRoot((root) => {
    const file = s9LongPath(root.length);
    if (file === null) { t.skip("455-character path: temp root leaves no filename budget"); return; }
    assert.equal(path.join(root, ...file.split("/")).length, 455);
    writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, file, S9_HEX.ascii), []);
  });
});

test("Astra P-PACK-1: composed and decomposed names stay distinct and green", () => {
  s9WithRoot((root) => {
    const composed = String.fromCharCode(0xe9) + ".txt";
    const decomposed = "e" + String.fromCharCode(0x301) + ".txt";
    writeAt(root, composed, txt("abc"));
    writeAt(root, decomposed, txt("abc"));
    assert.deepEqual(s9Pair(root, [decomposed, composed]), []);
  });
});

const S9_NAME = "PACK-PIN";
const s9Pin = (root, file, hex) => packPin(os.tmpdir(), s9PackRel(root), [file + " " + hex]);
const s9Pair = (root, files) => packPin(os.tmpdir(), s9PackRel(root), files.map((file) => file + " " + S9_HEX.ascii));

for (const dangling of [false, true]) {
  test("Astra P-PACK-1: pack root ancestor junction " + (dangling ? "dangling" : "same-byte"), () => {
    s9WithRoot((root) => {
      const actual = path.join(root, "actual");
      const alias = path.join(root, "alias");
      writeAt(actual, "pack/a.txt", txt("abc"));
      assert.deepEqual(s9Pin(path.join(actual, "pack"), "a.txt", S9_HEX.ascii), []);
      assert.equal(tryLink(actual, alias, "junction"), null);
      if (dangling) fs.rmSync(actual, { recursive: true });
      assert.equal(fs.lstatSync(alias).isSymbolicLink(), true);
      let reads = 0;
      const refusals = s9NoDescents(alias, () =>
        packPin(os.tmpdir(), s9PackRel(path.join(alias, "pack")), ["a.txt " + S9_HEX.ascii], () => { reads++; return txt("abc"); }));
      assert.deepEqual(refusals, ["PACK-PIN NOT-A-REGULAR-FILE " + toPosix(alias)]);
      assert.equal(reads, 0, "a rejected ancestor must prevent all file reads");
    });
  });
}

test("Astra P-PACK-1: pack root ancestors and root require exact spelling", () => {
  s9WithRoot((root) => {
    writeAt(root, "nested/pack/a.txt", txt("abc"));
    const pack = path.join(root, "nested", "pack");
    assert.deepEqual(s9Pin(pack, "a.txt", S9_HEX.ascii), []);
    fs.renameSync(path.join(root, "nested"), path.join(root, "NESTED"));
    assert.deepEqual(s9Pin(pack, "a.txt", S9_HEX.ascii), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(pack)]);
    const correct = path.join(root, "NESTED", "pack");
    fs.renameSync(correct, path.join(root, "NESTED", "PACK"));
    assert.deepEqual(s9Pin(correct, "a.txt", S9_HEX.ascii), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(correct)]);
  });
});

test("Astra P-PACK-3: literal parsing and serialise use explicit UTF-8 byte order", () => {
  s9WithRoot((root) => {
    const lo = String.fromCharCode(0xe000) + ".txt";
    const hi = String.fromCodePoint(0x10000) + ".txt";
    for (const file of [hi, lo]) writeAt(root, file, txt("abc"));
    const lines = [lo + " " + S9_HEX.ascii, hi + " " + S9_HEX.ascii];
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [lines[1], lines[0]]), /not sorted by path bytes/);
    const entries = [{ file: hi, sha256: S9_HEX.ascii }, { file: lo, sha256: S9_HEX.ascii }];
    const emitted = serialise(entries);
    assert.equal(emitted, lines[0] + "\n" + lines[1] + "\n");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), emitted.split("\n")), []);
  });
});

test("Astra P-PACK-3: ADDED uses explicit U+E000 then U+10000 order", () => {
  s9WithRoot((root) => {
    const lo = String.fromCharCode(0xe000) + ".txt";
    const hi = String.fromCodePoint(0x10000) + ".txt";
    for (const file of ["a.txt", hi, lo]) writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.ascii), ["PACK-PIN ADDED " + lo, "PACK-PIN ADDED " + hi]);
  });
});


test("Astra P-PACK-1: missing pack ancestor stops before descent", () => {
  s9WithRoot((root) => {
    const missing = path.join(root, "missing");
    const pack = path.join(missing, "pack");
    const refused = s9NoDescents(missing, () => s9Pin(pack, "a.txt", S9_HEX.ascii));
    assert.deepEqual(refused, ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(pack)]);
  });
});


/* R6 listing stub: only the named synthetic directory is denied; restore on every exit. */
function s9DenyListing(denied, body) {
  const original = fs.readdirSync;
  fs.readdirSync = (dir, ...args) => {
    if (dir === denied) throw Object.assign(new Error("synthetic listing denial"), { code: "EACCES" });
    return original(dir, ...args);
  };
  try { return body(); }
  finally { fs.readdirSync = original; }
}

/* Windows-only permission witness: whoami/icacls child processes mutate ACLs only
   on this row's disposable fixture. RD denies listing, and finally clears the deny. */
function s9DenyListAcl(denied, body) {
  const identity = spawnSync("whoami.exe", [], { encoding: "utf8", windowsHide: true });
  assert.equal(identity.status, 0, "whoami must identify the actual test process account");
  const principal = identity.stdout.trim();
  try {
    const set = spawnSync("icacls.exe", [denied, "/deny", principal + ":(RD)"], { encoding: "utf8", windowsHide: true });
    assert.equal(set.status, 0, "icacls deny: " + set.stdout + set.stderr);
    return body();
  } finally {
    const clear = spawnSync("icacls.exe", [denied, "/remove:d", principal], { encoding: "utf8", windowsHide: true });
    assert.equal(clear.status, 0, "icacls remove deny: " + clear.stdout + clear.stderr);
  }
}

test("R6 N5: no-descent hooks restore and preserve the body's own error", () => {
  s9WithRoot((root) => {
    writeAt(root, "a.txt", txt("abc"));
    const lstat = fs.lstatSync;
    const readdir = fs.readdirSync;
    const own = new Error("body's original error");
    assert.throws(() => s9NoDescents(root, () => {
      fs.lstatSync(path.join(root, "a.txt"));
      fs.readdirSync(root);
      throw own;
    }), (error) => error === own);
    assert.equal(fs.lstatSync, lstat);
    assert.equal(fs.readdirSync, readdir);
    assert.throws(() => s9NoDescents(root, () => fs.readdirSync(root)), /refusal must precede metadata descent/);
    assert.equal(fs.readdirSync, readdir);
    assert.equal(s9NoDescents(root, () => 42), 42);
  });
});

for (const location of ["ancestor", "root"]) {
  for (const acl of [false, true]) {
    test("R6 P-PACK-4: unlistable pack " + location + (acl ? " Windows ACL" : " injected"),
      { skip: acl && process.platform !== "win32" ? "Windows list-directory ACL row; Linux permission run belongs to PM" : false }, () => {
      s9WithRoot((root) => {
        const pack = path.join(root, "parent", "pack");
        writeAt(pack, "a.txt", txt("abc"));
        const denied = location === "root" ? pack : path.join(root, "parent");
        const child = location === "root" ? path.join(pack, "a.txt") : pack;
        const apply = acl ? s9DenyListAcl : s9DenyListing;
        apply(denied, () => {
          assert.ok(fs.lstatSync(child), "known child remains traversable");
          assert.throws(() => fs.readdirSync(denied), (e) => ["EPERM", "EACCES"].includes(e.code));
          let reads = 0;
          assert.deepEqual(packPin(os.tmpdir(), s9PackRel(pack), ["a.txt " + S9_HEX.ascii], () => { reads++; return txt("abc"); }),
            ["PACK-PIN UNREADABLE " + toPosix(denied)]);
          assert.equal(reads, 0);
        });
      });
    });
  }
}


test("L2 P-PACK-5: the supplied trusted root bounds the exact component walk", () => {
  s9WithRoot((root) => {
    const pack = path.join(root, "parent", "pack");
    const file = writeAt(pack, "a.txt", txt("abc"));
    const lstat = fs.lstatSync;
    const readdir = fs.readdirSync;
    const visits = [];
    fs.lstatSync = (p, ...args) => { visits.push(["lstat", p]); return lstat(p, ...args); };
    fs.readdirSync = (p, ...args) => { visits.push(["readdir", p]); return readdir(p, ...args); };
    try {
      assert.deepEqual(packPin(root, "parent/pack", ["a.txt " + S9_HEX.ascii]), []);
    } finally { fs.lstatSync = lstat; fs.readdirSync = readdir; }
    assert.deepEqual(visits, [
      ["lstat", path.join(root, "parent")], ["readdir", root],
      ["lstat", pack], ["readdir", path.join(root, "parent")],
      ["readdir", pack], ["lstat", file],
    ]);
  });
});

test("L2 P-PACK-5: synthetic different-drive roots use one arm without absolute differencing", () => {
  const roots = process.platform === "win32" ? ["Q:\\s9-root", "R:\\s9-root"] : ["/s9-root-a", "/s9-root-b"];
  const lstat = fs.lstatSync;
  const readdir = fs.readdirSync;
  const readFile = fs.readFileSync;
  const relative = path.relative;
  try {
    path.relative = () => { throw new Error("absolute-path differencing is not a trust decision"); };
    for (const root of roots) {
      const pack = path.join(root, "pack");
      const file = path.join(pack, "a.txt");
      const visits = [];
      fs.lstatSync = (p) => {
        visits.push(["lstat", p]);
        assert.ok(p === pack || p === file, "only pinned components below the supplied root");
        return { isDirectory: () => p === pack, isFile: () => p === file };
      };
      fs.readdirSync = (p) => {
        visits.push(["readdir", p]);
        assert.ok(p === root || p === pack, "only the supplied root and pack are listed");
        return p === root ? ["pack"] : ["a.txt"];
      };
      fs.readFileSync = (p) => { visits.push(["read", p]); assert.equal(p, file); return txt("abc"); };
      assert.deepEqual(packPin(root, "pack", ["a.txt " + S9_HEX.ascii]), []);
      assert.deepEqual(visits, [["lstat", pack], ["readdir", root], ["readdir", pack], ["lstat", file], ["read", file]]);
    }
  } finally {
    fs.lstatSync = lstat; fs.readdirSync = readdir; fs.readFileSync = readFile; path.relative = relative;
  }
});

test("L2 N2: the guarded pack-root listing is consumed exactly once", () => {
  withPack((root, lines) => {
    const original = fs.readdirSync;
    let listings = 0;
    fs.readdirSync = (dir, ...args) => {
      if (dir === root) listings++;
      return original(dir, ...args);
    };
    try { assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []); }
    finally { fs.readdirSync = original; }
    assert.equal(listings, 1);
  });
});


test("L2 N4: the 455-character budget holds both sides of its boundary", () => {
  const first = "d".repeat(120) + "/" + "e".repeat(120) + "/";
  assert.equal(s9LongPath(205), first + "f/a.txt");
  assert.equal(s9LongPath(206), null);
  assert.equal(s9LongPath(207), null);
});

test("L2 N5: denied-listing hook restores after a throwing body", () => {
  const original = fs.readdirSync;
  const own = new Error("listing body's original error");
  try {
    assert.throws(() => s9DenyListing("synthetic-denied", () => {
      assert.notEqual(fs.readdirSync, original);
      throw own;
    }), (error) => error === own);
    assert.equal(fs.readdirSync, original);
    assert.equal(s9DenyListing("synthetic-denied", () => 42), 42);
    assert.equal(fs.readdirSync, original);
  } finally { fs.readdirSync = original; }
});

/* THE REAL ROW. It runs the SAME engine the fixture rows run, over the real pack root and
   this cell's own literal, and it is RED on this branch by construction: the pack is on
   the design lane's branches and the literal is unfilled. It does not skip, it is not
   conditional on the pack being present, and it cannot pass vacuously, because an empty
   literal is itself a refusal. The exact text it prints today is in
   rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md.

   THE LADDER OUT OF RED, for the S9 integrator, in order:
     PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18   the pack has not merged
     PACK-PIN LITERAL-EMPTY                                     it has, the literal has not
     (nothing)                                                  C.5.1's five steps are done
   Anyone who makes this row green by any other means has removed the cell. */
test("REAL ROW: the owner-approved pack at this head, against this cell's own literal", () => {
  const refusals = packPin(REPO_ROOT, PACK_ROOT_REL, LITERAL);
  assert.deepEqual(refusals, [],
    "PACK-PIN is not satisfied at this head. Refusals:\n  " + refusals.join("\n  ") +
    "\n(On rebuild/b-s9-prep-pack this is EXPECTED and is the red the cell was written for:" +
    " " + PACK_ROOT_REL + " has not merged and the literal is unfilled. C.5.1 fills it.)");
});

/* P-FENCE-1, EXTENDED TO THIS STEP BY DECISIONS:559 ("the pack-pin step of S9-PREP-C
   needs the same condition and the PM adds it as integrator") AND GIVEN A ROW OF ITS OWN
   BY DECISIONS:570 ("plus its own row"). The brief's section 9 item 3 is explicit that
   the row lives HERE and not as a second row inside the fence cell, because a cell that
   reads another cell's step is a cell nobody edits when that step moves.

   THE REASON THE CONDITION IS NEEDED, in one sentence: GitHub skips every step after a
   failed one; the standing step `b-package.cjs --ci --package S8` at rebuild.yml:150
   fails on exactly the branches this cell exists for, because a branch that does not
   contain the chain tip is refused SEAL-BASE-IS-NOT-THE-CHAIN-TIP by the runner's own
   rule of DECISIONS:135 (4); and a gate that is skipped in the world it was written for
   is not a gate. `!cancelled()` runs the step after an earlier failure and NOT when the
   run was cancelled, so a cancelled run still stops. It does not make the job green: this
   step's own exit status is still the job's.

   The row reads rebuild.yml as TEXT out of the WORKING TREE, finds the step by THIS
   FILE'S OWN PATH rather than by a line number, and never globs - the same three rules
   the fence's row (18) follows, so the two cannot drift apart in method. The step names
   this cell and approved-pin.test.mjs together; either spelling finds the same block. */
test("P-FENCE-1 / DECISIONS:570 - this cell's own step in rebuild.yml carries the not-cancelled condition", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const yml = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  assertConditionedRun(yml, SELF, "the pack step");
});

test("D-S9G-DECOY: pack reader refuses D, E and F workflow decoys", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  assert.doesNotThrow(() => assertConditionedRun(worlds.control, SELF, "control"));
  assert.doesNotThrow(() => assertConditionedRun(worlds.afterRun, SELF, "after run"));
  for (const id of ["D", "E", "F"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  for (const id of ["duplicateCondition", "duplicateRunner", "siblingPath"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
});

test("D-S9G-CONTINUE: pack reader refuses a direct continue-on-error key", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "grouped", "siblingContinue", "nestedContinue"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  const outcomes = ["continueTrue", "continueFalse"].map((id) => {
    try { assertConditionedRun(worlds[id], SELF, id); return id + ": accepted"; }
    catch (e) {
      return id + (e instanceof assert.AssertionError
        && String(e.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
        ? ": refused by name" : ": wrong refusal");
    }
  });
  assert.deepEqual(outcomes, ["continueTrue: refused by name", "continueFalse: refused by name"]);
});

test("D-S9G-QUOTED-KEY: pack reader refuses paired quoted continue-on-error keys", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "grouped", "siblingContinue", "nestedContinue",
    "quotedSiblingContinue", "quotedNestedContinue"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  assert.throws(() => assertConditionedRun(worlds.quotedIf, SELF, "quotedIf"), (error) =>
    error instanceof assert.AssertionError
      && !String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN"));
  const real = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  assert.doesNotThrow(() => assertConditionedRun(real, SELF, "real workflow"));
  const ids = ["continueTrue", "continueFalse", "quotedDoubleTrue", "quotedDoubleFalse",
    "quotedSingleTrue", "quotedSingleFalse"];
  const outcomes = ids.map((id) => {
    try { assertConditionedRun(worlds[id], SELF, id); return id + ": accepted"; }
    catch (error) {
      return id + (error instanceof assert.AssertionError
        && String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
        ? ": refused by name" : ": wrong refusal");
    }
  });
  assert.deepEqual(outcomes, ids.map((id) => id + ": refused by name"));
});

test("D-S9G-COMMENT-CUT: pack reader crosses comments without crossing step boundaries", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "commentBoundaryIndented", "commentBoundaryColumn0"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  const real = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  assert.doesNotThrow(() => assertConditionedRun(real, SELF, "real workflow"));
  const ids = ["commentCutIndented", "commentCutColumn0"];
  const outcomes = ids.map((id) => {
    try { assertConditionedRun(worlds[id], SELF, id); return id + ": accepted"; }
    catch (error) {
      return id + (error instanceof assert.AssertionError
        && String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
        ? ": refused by name" : ": wrong refusal");
    }
  });
  assert.deepEqual(outcomes, ids.map((id) => id + ": refused by name"));
});

test("D-CONDITION-MATCHER: pack reader requires the whole permitted expression", () => {
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() }}"), true);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() && false }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ false || !cancelled() }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() || true }}"), false);
});

/* Named so the refusal vocabulary is readable from outside and cannot drift in silence:
   any change to this list is a change to a sealed cell's bytes. */
export const REFUSALS = Object.freeze([
  "PACK-PIN PACK-ROOT-ABSENT",
  "PACK-PIN LITERAL-EMPTY",
  "PACK-PIN MISMATCH",
  "PACK-PIN MISSING",
  "PACK-PIN ADDED",
  "PACK-PIN NOT-A-REGULAR-FILE",
  "PACK-PIN UNREADABLE",
]);

/* R2 N2, AND THE TITLE IS NOW A CLAIM THE ROW MAKES. The old row asserted the length, the
   uniqueness and the SHAPE of the strings and called that reachability, which is a claim it
   did not make. This one DERIVES the set of verbs the engine actually emitted over every
   row above - packPin records each refusal as it hands it back - and compares that set with
   the exported vocabulary. So the export is the drift detector the comment above says it
   is, in both directions: a refusal no row reaches, and a refusal a row emits that the
   export does not carry, each go red here. Top-level rows in a node:test file run in
   order, so this row, written last, sees every emission above it; if that ever stopped
   being true this row would go RED, which is the safe direction. */
test("the refusal vocabulary is exactly seven, and every one was EMITTED by a row above", () => {
  assert.equal(REFUSALS.length, 7);
  assert.deepEqual(REFUSALS, [...new Set(REFUSALS)]);
  for (const r of REFUSALS) assert.match(r, /^PACK-PIN [A-Z-]+$/);
  assert.deepEqual([...EMITTED].sort(), [...REFUSALS].sort(),
    "the vocabulary and what the rows above emitted must be the same set");
});
