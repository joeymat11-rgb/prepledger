"use strict";

/* A5 — the host workflow, read as data rather than trusted as prose.

   .github/workflows/slice-host.yml deploys the slice folder to a SECOND Netlify site. It
   must be a no-op with a clear log line until the owner creates that site, must never run
   on main, must never touch the frozen app's pipeline or its site, and must name exactly
   the two secrets the report tells Joe to add. Those are checkable facts, so they are
   checked here rather than asserted in a report.

   It uses `yaml`, which is in the repository's own root lockfile (devDependencies), so it
   runs wherever `npm ci --include=dev` has run. */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const YAML = require("yaml");

const pwa = require("../pwa.cjs");
const ROOT = pwa.ROOT;
const FILE = ".github/workflows/slice-host.yml";
const text = fs.readFileSync(path.join(ROOT, FILE), "utf8");
const doc = YAML.parseDocument(text);
const workflow = doc.toJS();
const job = workflow.jobs["slice-host"];
const steps = job.steps;
const deployStep = steps.find((s) => /Deploy to the slice/.test(s.name || ""));
const script = steps.map((s) => s.run || "").join("\n");
// What the runner executes, with the shell comments taken out.
const code = script.split("\n").filter((line) => !/^\s*#/.test(line)).join("\n");

test("the workflow is valid YAML with one job and no warnings", () => {
  assert.deepEqual([...doc.errors, ...doc.warnings], []);
  assert.equal(workflow.name, "slice-host");
  assert.deepEqual(Object.keys(workflow.jobs), ["slice-host"]);
  assert.equal(job["runs-on"], "ubuntu-latest");
  assert.deepEqual(workflow.permissions, { contents: "read" });
});

test("it is triggered by exactly what the plan says and by nothing else", () => {
  const on = workflow.on || workflow[true];   // YAML 1.1 reads a bare `on:` as boolean true
  assert.deepEqual(Object.keys(on).sort(), ["push", "workflow_dispatch"]);
  assert.deepEqual(on.push.branches, ["rebuild/t2-client-core"]);
  assert.deepEqual(on.push.paths.sort(),
    [".github/workflows/slice-host.yml", "rebuild/m3/w7-preview/today/**", "rebuild/slice/pwa/**"].sort());
  assert(!("pull_request" in on), "a fork's pull request must not reach a deploy secret");
  assert(!on.push.branches.includes("main"));
  // Belt and braces: it refuses at run time too.
  assert.match(script, /refs\/heads\/main/);
  /* review F1: workflow_dispatch is declared, but GitHub lists it only for workflows on
     the DEFAULT branch, and this file is deliberately never there — so the file must say
     so rather than leave the owner hunting a button that is not offered. */
  assert("workflow_dispatch" in on);
  assert.match(text, /only lists a workflow_dispatch workflow once its file is on\n# the DEFAULT branch/);
  assert.match(text, /the deploy route is the push/);
});

test("it names exactly the two secrets, and does not reach for any other", () => {
  const used = [...text.matchAll(/secrets\.([A-Z0-9_]+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(used)].sort(), ["NETLIFY_AUTH_TOKEN", "SLICE_NETLIFY_SITE_ID"]);
  assert.deepEqual(deployStep.env, { NT: "${{ secrets.NETLIFY_AUTH_TOKEN }}",
    SITE: "${{ secrets.SLICE_NETLIFY_SITE_ID }}" });
  /* No secret is ever printed. The token appears in exactly two shapes — an Authorization
     header curl sends, and an emptiness test — and the site id only inside a URL path and
     an emptiness test. Anything else (an echo, a file write, a query string) fails here. */
  const FORMS = ["Authorization: Bearer \\$NT\"", "\\[ -z \"\\$NT\" \\]",
    "\\[ -z \"\\$SITE\" \\]", "api/v1/sites/\\$SITE", "\\[ \"\\$bad\" = \"\\$SITE\" \\]"];
  for (const line of script.split("\n")) {
    if (!/\$(?:NT|SITE)\b/.test(line)) continue;
    const used = [...line.matchAll(new RegExp(FORMS.join("|"), "g"))].length;
    const total = (line.match(/\$(?:NT|SITE)\b/g) || []).length;
    assert.equal(used, total, "a secret is used in an unreviewed way: " + line);
  }
});

test("without the secrets it BUILDS, says so in words, and deploys nothing", () => {
  // The build and its tests come BEFORE the deploy step, so a run with no secrets still
  // proves the folder is buildable.
  const order = steps.map((s) => s.name || (s.uses || s.run || "").split("\n")[0]);
  const build = order.findIndex((n) => /Build the deployable folder/.test(n));
  const deploy = order.findIndex((n) => /Deploy to the slice/.test(n));
  assert(build > -1 && deploy > build, "the deploy runs before the build");
  const body = deployStep.run;
  assert.match(body, /if \[ -z "\$NT" \] \|\| \[ -z "\$SITE" \]; then/);
  assert.match(body, /SLICE HOST NO-OP/);
  assert.equal((body.match(/SLICE HOST NO-OP/g) || []).length, 5, "the no-op explains itself");
  // review F1: the no-op must tell the owner the REAL route, and must not send him
  // looking for a Run-workflow button that GitHub does not list for this file.
  assert.match(body, /NEXT PUSH to rebuild\/t2-client-core/);
  assert.match(body, /Do not look for a Run-workflow button/);
  // The no-op path ends the step successfully; it does not fail the run and does not
  // continue into the deploy.
  const noop = body.slice(body.indexOf("if [ -z"), body.indexOf("META="));
  assert.match(noop, /exit 0/);
  assert(!/curl/.test(noop), "the no-op path still calls out");
  assert.match(body, /A5-REPORT\.md/, "the no-op points at the instructions");
});

test("it cannot deploy the slice onto the frozen app's site or the soak site", () => {
  const body = deployStep.run;
  // Refusal one and two read the TARGET's own record.
  assert.match(body, /\*prepledger\*\) echo "SLICE HOST FAIL/);
  assert.match(body, /earned-soak\) echo "SLICE HOST FAIL/);
  /* review F4 — refusal three is INDEPENDENT of the target's own record: it asks the
     account which site ids are the frozen app's (deploy.yml's own rule) and the soak's,
     and refuses by id. It fails CLOSED, so an unreadable list stops the deploy. */
  assert.match(body, /FORBIDDEN=\$\(curl[^\n]*api\/v1\/sites\?per_page=100/);
  assert.match(body, /for bad in \$FORBIDDEN; do/);
  assert.match(body, /\[ "\$bad" = "\$SITE" \]; then echo "SLICE HOST FAIL/);
  assert.match(body, /could not read the account's site list[^\n]*Refusing/);
  assert.equal((body.match(/SLICE HOST FAIL/g) || []).length, 5, "every refusal says so");
  // It deploys an id the owner supplied, and it never CREATES a site: the only write to
  // the Netlify API is the deploy itself.
  const writes = [...body.matchAll(/curl[^\n]*-X POST[^\n]*/g)].map((m) => m[0]);
  assert.equal(writes.length, 1, "more than one write to the Netlify API");
  assert.match(body, /sites\/\$SITE\/deploys/);
  assert(!/-d '\{"name"/.test(body), "it creates a site");
});

/* review F2 — rebuild.yml is pinned by the accepted NATIVE-CARRIERS artifact and cannot
   gain a step until the PM's batched re-seal at B1, so THIS job is where the A5 checks
   live in the meantime. Every A5 test file must be run by it, including this one. */
test("this workflow is the CI home for every A5 test file", () => {
  const files = fs.readdirSync(path.join(ROOT, "rebuild/slice/pwa/test")).filter((n) => n.endsWith(".test.cjs"));
  assert(files.length >= 3, "no test files found");
  for (const name of files) {
    assert(code.includes("rebuild/slice/pwa/test/" + name), name + " is in no step of this workflow");
  }
  // The two lockfile-only suites run BEFORE the build, on the root lockfile alone
  // (workflow.test.cjs needs `yaml`, a root devDependency, which `npm ci` installs).
  const lockfileOnly = steps.find((s) => /no bundler/.test(s.name || "")).run;
  assert(lockfileOnly.includes("pwa.test.cjs") && lockfileOnly.includes("workflow.test.cjs"));
  assert(!lockfileOnly.includes("package.test.cjs"), "the bundler-dependent suite is in the bundler-free step");
  const order = steps.map((s) => s.name || "");
  assert(order.findIndex((n) => /no bundler/.test(n))
    < order.findIndex((n) => /Build the deployable folder/.test(n)));
  assert(JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).devDependencies.yaml,
    "workflow.test.cjs needs `yaml` from the root lockfile");
});

test("it deploys the build's own folder and nothing else from the tree", () => {
  const stage = steps.find((s) => /Stage exactly what the build emitted/.test(s.name || "")).run;
  assert.match(stage, /SRC=\.tmp\/slice-pwa-dist/);
  assert(!/git ls-files|cp -R \./.test(stage.replace("cp -R \"$SRC/.\"", "")), "it copies from the tree");
  assert.match(stage, /sha256sum/, "the run records what it shipped");
  for (const required of ["index.html", "sw.js", "_headers"]) assert(stage.includes(required), required);
});

test("it never touches the frozen app's pipeline, and the pipeline never sees this folder", () => {
  // The header comment names deploy.yml and soak.yml to say it does NOT touch them.
  // No step may mention either, or the frozen app's own site manifest.
  assert.doesNotMatch(code, /deploy\.yml|soak\.yml|site-manifest|scripts\//);
  // ("prepledger" is the repository's own name; "ledger/" is the owner's health data.)
  assert.doesNotMatch(code, /ledger\/|src\/history/);
  // deploy.yml ignores nothing under rebuild/, so it must not be able to pick this up:
  // this workflow's own paths are all under rebuild/ or its own file.
  const on = workflow.on || workflow[true];
  for (const p of on.push.paths) assert(/^rebuild\/|^\.github\/workflows\/slice-host\.yml$/.test(p), p);
  const pipeline = fs.readFileSync(path.join(ROOT, ".github/workflows/deploy.yml"), "utf8");
  assert.doesNotMatch(pipeline, /slice-host|slice-pwa|rebuild\//, "deploy.yml was edited to know about the slice");
  const soak = fs.readFileSync(path.join(ROOT, ".github/workflows/soak.yml"), "utf8");
  assert.doesNotMatch(soak, /slice-host|slice-pwa|SLICE_NETLIFY_SITE_ID/, "soak.yml was edited");
});
