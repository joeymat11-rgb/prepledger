import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const SOURCE = path.join(ROOT, "rebuild/m3/w7-preview");
export const DIST = path.join(ROOT, ".tmp/w7-preview-dist");
export const ASSETS = Object.freeze(["index.html", "styles.css", "app.js"]);
export const MOCK_SHA256 = "e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563";
export const TEMPLATE_IDS = Object.freeze(["T01", "T02", "T08"]);
const PREVIEW_INPUTS = ["app.cjs", "model.cjs", "browser-engine.cjs", "fixtures.cjs", "synthetic.cjs"];
const READ_INPUTS = ["dates", "constants", "plan", "progression", "sleep", "energy", "policy", "today", "volume"];
const ALLOWED_INPUTS = new Set([
  ...PREVIEW_INPUTS.map((name) => `rebuild/m3/w7-preview/${name}`),
  ...READ_INPUTS.map((name) => `rebuild/engine/${name}.cjs`),
]);

export function assertBundleInputs(inputs) {
  const names = Object.keys(inputs).map((name) => name.replaceAll("\\", "/"));
  assert(names.length > 0, "BUNDLE-INPUTS FAIL: no executable input");
  for (const name of names) assert(ALLOWED_INPUTS.has(name), `BUNDLE-INPUTS FAIL: unapproved input ${name}`);
  for (const details of Object.values(inputs)) {
    assert(!(details.imports || []).some((entry) => entry.external), "BUNDLE-INPUTS FAIL: external executable import");
  }
  return names;
}

export function extractMock(bytes) {
  assert.equal(createHash("sha256").update(bytes).digest("hex"), MOCK_SHA256, "MOCK-PIN FAIL");
  const html = bytes.toString("utf8");
  const style = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(style, "MOCK-STYLES FAIL");
  const templates = TEMPLATE_IDS.map((id) => {
    const matches = [...html.matchAll(new RegExp(`<template id="s-${id}">[\\s\\S]*?<\\/template>`, "g"))];
    assert.equal(matches.length, 1, `MOCK-TEMPLATE FAIL: ${id}`);
    return matches[0][0];
  });
  return { styles: style[1], templates };
}

// Only this fixed, ignored directory can be written. A link or nested directory
// is rejected; cleanup never recursively traverses a caller-supplied path.
export async function ensureDist() {
  const root = await fs.realpath(ROOT);
  const tmp = path.join(ROOT, ".tmp");
  await fs.mkdir(tmp, { recursive: true });
  for (const directory of [tmp, DIST]) {
    if (directory === DIST) await fs.mkdir(directory, { recursive: true });
    const stat = await fs.lstat(directory);
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "OUTPUT-DIRECTORY FAIL: a real directory is required");
    assert.equal(await fs.realpath(directory), path.join(root, path.relative(ROOT, directory)), "OUTPUT-DIRECTORY FAIL: path escaped workspace");
  }
  return DIST;
}

export async function buildPreview() {
  const [mockBytes, shell, extraStyles] = await Promise.all([
    fs.readFile(path.join(ROOT, "rebuild/m1/earned-mock.public.html")),
    fs.readFile(path.join(SOURCE, "index.shell.html"), "utf8"),
    fs.readFile(path.join(SOURCE, "preview.css"), "utf8"),
  ]);
  const mock = extractMock(mockBytes);
  assert.equal(shell.split("<!-- MOCK_TEMPLATES -->").length, 2, "TEMPLATE-SLOT FAIL");
  const result = await build({
    absWorkingDir: ROOT,
    entryPoints: [path.join(SOURCE, "app.cjs")],
    outfile: path.join(DIST, "app.js"),
    bundle: true,
    platform: "browser",
    format: "iife",
    target: ["es2022"],
    sourcemap: false,
    write: false,
    metafile: true,
    logLevel: "silent",
  });
  const inputs = assertBundleInputs(result.metafile.inputs);
  assert.equal(result.outputFiles.length, 1, "BUNDLE-OUTPUT FAIL: unexpected auxiliary asset");
  const contents = {
    "index.html": shell.replace("<!-- MOCK_TEMPLATES -->", mock.templates.join("\n")),
    "styles.css": `${mock.styles}\n${extraStyles}`,
    "app.js": result.outputFiles[0].contents,
  };
  await ensureDist();
  const existing = await fs.readdir(DIST, { withFileTypes: true });
  for (const entry of existing) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "OUTPUT-CLEAN FAIL: unexpected directory or link");
  }
  for (const entry of existing) if (!ASSETS.includes(entry.name)) await fs.unlink(path.join(DIST, entry.name));
  for (const name of ASSETS) await fs.writeFile(path.join(DIST, name), contents[name]);
  assert.deepEqual((await fs.readdir(DIST)).sort(), [...ASSETS].sort(), "PACKAGE-ALLOWLIST FAIL");
  return { dist: DIST, assets: [...ASSETS], inputs, mockSha256: MOCK_SHA256 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await buildPreview();
    console.log(`W7-PREVIEW BUILD PASS: ${result.assets.length} allowlisted assets; ${result.inputs.length} approved browser inputs; pinned T01/T02/T08`);
  } catch (error) {
    console.error(`W7-PREVIEW BUILD FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
