"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, before, after } = require("node:test");

let build, result, serve, server, port;
before(async () => {
  build = await import(pathToFileURL(path.resolve(__dirname, "../build.mjs")).href);
  result = await build.buildPreview();
  serve = await import(pathToFileURL(path.resolve(__dirname, "../serve.mjs")).href);
  server = await serve.startServer({ port: 0 });
  port = server.address().port;
});
after(async () => { if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); });

function request(target, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: target, method }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("built package contains only the three reviewed assets", async () => {
  assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  assert.deepEqual(result.assets, ["index.html", "styles.css", "app.js"]);
  assert.equal(result.mockSha256, "e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563");
});

test("Today template bytes and original style bytes are copied from the pinned public mock", async () => {
  const original = await fs.readFile(path.join(build.ROOT, "rebuild/m1/earned-mock.public.html"));
  const extracted = build.extractMock(original);
  const html = await fs.readFile(path.join(build.DIST, "index.html"), "utf8");
  const styles = await fs.readFile(path.join(build.DIST, "styles.css"), "utf8");
  for (const template of extracted.templates) assert(html.includes(template));
  assert.deepEqual([...html.matchAll(/<template id="s-([^"]+)">/g)].map((match) => match[1]), ["T01", "T02", "T08"]);
  assert(styles.startsWith(`${extracted.styles}\n`));
  assert.throws(() => build.extractMock(Buffer.concat([original, Buffer.from("\n")])), /MOCK-PIN FAIL/);
});

test("bundle uses only explicit read modules and rejects private, writer and external inputs", () => {
  assert(result.inputs.includes("rebuild/m3/w7-preview/app.cjs"));
  assert(!result.inputs.some((name) => /(?:seed|migrate|merge|writers|node_modules|ledger|private)/i.test(name)));
  for (const name of ["rebuild/engine/seed.cjs", "rebuild/engine/index.cjs", "rebuild/engine/migrate.cjs", "rebuild/engine/merge.cjs", "rebuild/engine/writers.cjs", "ledger/state.json", "node:fs", "node_modules/react/index.js"]) {
    assert.throws(() => build.assertBundleInputs({ [name]: {} }), /BUNDLE-INPUTS FAIL/);
  }
  assert.throws(() => build.assertBundleInputs({ "rebuild/m3/w7-preview/app.cjs": { imports: [{ path: "node:fs", external: true }] } }), /external executable import/);
});

test("an extra build asset blocks serving and a rebuild removes only that extra file", async () => {
  const extra = path.join(build.DIST, "unapproved-test-asset.txt");
  await fs.writeFile(extra, "synthetic package boundary probe");
  try {
    await assert.rejects(serve.startServer({ port: 0 }), /unapproved assets/);
    await build.buildPreview();
    await assert.rejects(fs.access(extra), { code: "ENOENT" });
    assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  } finally {
    await fs.unlink(extra).catch((error) => { if (error.code !== "ENOENT") throw error; });
  }
});

test("local server serves built assets with network, persistence-worker and cache restrictions", async () => {
  assert.equal(server.address().address, "127.0.0.1");
  for (const name of ["/", "/index.html", "/styles.css", "/app.js"]) {
    const response = await request(name);
    assert.equal(response.status, 200);
    assert.match(response.headers["cache-control"], /no-store/);
    assert.match(response.headers["content-security-policy"], /connect-src 'none'/);
    assert.match(response.headers["content-security-policy"], /worker-src 'none'/);
    assert.match(response.headers["content-security-policy"], /font-src https:\/\/fonts.gstatic.com/);
    assert.equal(response.headers["x-content-type-options"], "nosniff");
  }
  const head = await request("/", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
});

test("source, private paths, traversal and writes cannot reach the repository", async () => {
  for (const target of ["/ledger/state.json", "/src/app.jsx", "/rebuild/engine/seed.cjs", "/package.json", "/app.js.map", "/sw.js", "/.env"]) {
    const response = await request(target);
    assert.equal(response.status, 404, target);
    assert.equal(response.body, "Not found");
  }
  for (const target of ["/../ledger/state.json", "/%2e%2e/ledger/state.json", "/%2E%2E%2Fledger/state.json", "/%5c..%5cledger/state.json", "/%00", "/%zz", "//outside/app.js"]) {
    const response = await request(target);
    assert.equal(response.status, 400, target);
    assert.equal(response.body, "Invalid request path");
  }
  const write = await request("/", "POST");
  assert.equal(write.status, 405);
  assert.equal(write.headers.allow, "GET, HEAD");
  assert.equal(write.body, "Method not allowed");
});
