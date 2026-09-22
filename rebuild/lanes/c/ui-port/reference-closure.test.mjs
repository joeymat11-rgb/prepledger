/* P-S9-2: the declared design-of-record reader. Each reference is reached through a
   literal relative new URL so the package runner's bounded source closure can see the
   same file this cell reads. The sha256 literals were measured from Git at f1231339. */
import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import fs from "node:fs";

const EXPECTED_PATHS = Object.freeze([
  "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html",
  "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html",
  "rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md",
  "rebuild/m1/MOCK.md",
]);

const REFERENCES = Object.freeze([
  Object.freeze({
    repoPath: "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html",
    url: new URL("../../../m1/approved-2026-09-08/Earned-refinement-A.html", import.meta.url),
    sha256: "fddfe0542c4a578653a11941d96fbf6727dc2d9f83c500449c694339e89ab031",
  }),
  Object.freeze({
    repoPath: "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html",
    url: new URL("../../../m1/approved-2026-09-08/Earned-additions-C-approved.html", import.meta.url),
    sha256: "caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45",
  }),
  Object.freeze({
    repoPath: "rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md",
    url: new URL("../../../m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md", import.meta.url),
    sha256: "a0963e54240ba0d60c44a18d51399728e11d68239dcad798b094d48de60b6cf5",
  }),
  Object.freeze({
    repoPath: "rebuild/m1/MOCK.md",
    url: new URL("../../../m1/MOCK.md", import.meta.url),
    sha256: "cdf8eb5c3be00359f8f16706022ce153c8d77482df4323e136d223280464300c",
  }),
]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function referenceRefusals(readFile = fs.readFileSync) {
  const refusals = [];
  for (const reference of REFERENCES) {
    let bytes;
    try { bytes = readFile(reference.url); }
    catch { refusals.push("D-REFERENCE-CLOSURE UNREADABLE " + reference.repoPath); continue; }
    /* CONSTRUCTED RED MUTANT: one digest comparison is deliberately absent for the
       red-first checkpoint. This is not an existing product defect. */
    if (reference.repoPath === "rebuild/m1/MOCK.md") continue;
    if (sha256(bytes) !== reference.sha256)
      refusals.push("D-REFERENCE-CLOSURE CHANGED " + reference.repoPath);
  }
  return refusals;
}

function assertReferenceClosure(readFile = fs.readFileSync) {
  const refusals = referenceRefusals(readFile);
  assert.deepEqual(refusals, [], refusals.length
    ? refusals.join("\n") : "D-REFERENCE-CLOSURE unexpected refusal");
}

test("P-S9-2: the four design-of-record documents match their independent Git hashes", () => {
  const seen = [];
  assertReferenceClosure((url) => { seen.push(url.href); return fs.readFileSync(url); });
  assert.deepEqual(REFERENCES.map((reference) => reference.repoPath), EXPECTED_PATHS,
    "D-REFERENCE-CLOSURE reference list changed");
  assert.equal(seen.length, EXPECTED_PATHS.length, "D-REFERENCE-CLOSURE reference read omitted");
});

for (const repoPath of EXPECTED_PATHS) {
  test("D-REFERENCE-CLOSURE changed document is refused: " + repoPath, () => {
    const changed = REFERENCES.find((reference) => reference.repoPath === repoPath);
    assert(changed, "D-REFERENCE-CLOSURE reference omitted " + repoPath);
    const readChanged = (url) => url.href === changed.url.href
      ? Buffer.concat([fs.readFileSync(url), Buffer.from("\nconstructed change\n", "utf8")])
      : fs.readFileSync(url);
    assert.throws(() => assertReferenceClosure(readChanged), (error) =>
      error instanceof assert.AssertionError
      && String(error.message).includes("D-REFERENCE-CLOSURE CHANGED " + repoPath));
  });
}
