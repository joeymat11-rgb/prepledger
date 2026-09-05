// M7's unchanged second gate. Only the candidate engine import is redirected.
// Logs/artifacts are public frozen/synthetic test outputs under ignored .tmp.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "../../..");
const OUT = path.join(ROOT, ".tmp/m2-second-gate");
const PRELOAD = path.join(HERE, "second-gate-preload.cjs"), ADAPTER = path.join(HERE, "second-gate-adapter.mjs");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const gitBlob = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const read = p => fs.readFileSync(path.join(ROOT,p), "utf8").replaceAll("\r\n", "\n");
const inventory = JSON.parse(fs.readFileSync(path.join(HERE, "second-gate-inventory.json")));
const assertionCatalog = JSON.parse(fs.readFileSync(path.join(HERE, "second-gate-assertions.json")));
const SOURCES = ["src/app.jsx", "tools/engine-test.jsx", "tools/closure-sf1.mjs", "tools/closure-sf2.mjs",
  "tools/_engine-surface.jsx", "tools/sync-laws.mjs", "tools/_fixed-now.mjs", "tools/engine-baseline.json",
  "tools/vacuity-scan.mjs", "tools/vacuity-baseline.json", "tools/snapshots/2026-08-06-ledger.json",
  "tools/snapshots/2026-08-07-ledger.json", "tools/fixtures/ledger-preimage-2026-08-15.json"];
const hashes = {};
for (const name of SOURCES) {
  const expected = execFileSync("git", ["show", "fe516c1:" + name], { cwd: ROOT, windowsHide: true,
    maxBuffer: 16*1024*1024, stdio: ["ignore","pipe","pipe"] });
  assert.equal(read(name), expected.toString("utf8"), "frozen source/fixture/baseline drift: " + name);
  hashes[name] = { gitBlob: gitBlob(expected), sha256: sha(expected) };
}
assert.equal(hashes["src/app.jsx"].gitBlob, "f98671d823f0d8cd83e730cdd930afe5f5e7b628");
for(const [file,hash] of Object.entries(assertionCatalog.hashes)) assert.equal(hashes[file].gitBlob,hash,"assertion catalog source pin");
const assertionSites=new Map();
for(const [file,categories] of Object.entries(assertionCatalog.sites)) for(const [category,sites] of Object.entries(categories)) {
  assert.ok(category in assertionCatalog.counts);
  for(const site of sites) {
    const [line,column,count]=site.split(":").map(Number),key=file+":"+line+":"+column;
    assert.ok([line,column,count].every(x=>Number.isInteger(x)&&x>0));assert.ok(!assertionSites.has(key));
    assertionSites.set(key,{category,count});
  }
}
function classifyAssertions(observations) {
  const remaining=new Map([...assertionSites].map(([key,value])=>[key,value.count]));
  const counts=Object.fromEntries(Object.keys(assertionCatalog.counts).map(category=>[category,0]));
  for(const observation of observations) {
    const key=observation.file+":"+observation.line+":"+observation.column,site=assertionSites.get(key);
    assert.ok(site,"unknown executed assertion site: "+key);assert.ok(remaining.get(key)>0,"excess assertion occurrence: "+key);
    assert.equal(observation.outcome,"PASS");remaining.set(key,remaining.get(key)-1);counts[site.category]++;
  }
  assert.ok([...remaining.values()].every(count=>count===0),"missing executed assertion site or loop occurrence");
  assert.equal(observations.length,assertionCatalog.total);assert.deepEqual(counts,assertionCatalog.counts);
  return counts;
}
// Verify the original static inventory, including destructured aliases, remains
// tied to its exact file. The only computed lookup is AIM.requires (_fileCorr).
for (const name of Object.keys(inventory.inventory)) assert.ok(hashes[name]);
const carrierText = fs.readFileSync(path.join(HERE, "second-gate-carrier.cjs"), "utf8");
const frozenLines = read("src/app.jsx").split("\n"), carrierRanges = [[12341,12342],[12344,12390],[12589,12649],[12746,12760],[13259,13261]];
for (const [a,b] of carrierRanges) {
  const exact = frozenLines.slice(a-1,b).join("\n");
  assert.ok(carrierText.includes("// BEGIN frozen src/app.jsx:" + a + "-" + b + "\n" + exact + "\n// END frozen src/app.jsx:" + a + "-" + b));
}
const mode = process.argv[2];
assert.ok(["--reference","--candidate"].includes(mode) && process.argv.length === 3, "Use --reference or --candidate");
fs.mkdirSync(OUT,{recursive:true});
const env = { ...process.env, MEASURED_TEST_NOW:"2026-07-29", TZ:"America/New_York", NO_COLOR:"1" };
delete env.PL_LAWS_LIB; delete env.PL_ENGINE; delete env.NODE_OPTIONS;
const commands = [];
function run(side, name, args, extra={}) {
  const meta = path.join(OUT, side + "-" + name + ".metadata.json");
  const argv = ["--enable-source-maps", "--require", PRELOAD, ...args];
  commands.push({side,name,executable:process.execPath,args:argv,cwd:ROOT,environment:{MEASURED_TEST_NOW:env.MEASURED_TEST_NOW,TZ:env.TZ,...extra}});
  const child = spawnSync(process.execPath, argv, { cwd:ROOT, env:{...env,...extra,M2_SECOND_GATE_META:meta},
    encoding:"utf8", windowsHide:true, timeout:300000, maxBuffer:64*1024*1024 });
  fs.writeFileSync(path.join(OUT,side+"-"+name+".stdout.log"),child.stdout||"");
  fs.writeFileSync(path.join(OUT,side+"-"+name+".stderr.log"),child.stderr||"");
  const metadata = fs.existsSync(meta) ? JSON.parse(fs.readFileSync(meta)) : null;
  if (child.status !== 0 || !metadata || metadata.violations.length || metadata.missing.length) {
    console.error("FAIL second gate " + side + " " + name + ": exit=" + child.status);
    if (metadata?.missing.length) console.error("MISSING EXPORTS: " + metadata.missing.join(", "));
    if (metadata?.violations.length) console.error("TEST I/O/OBSERVER: " + metadata.violations.join("; "));
    // All inputs are pinned public fixtures or invented worlds, but raw harness
    // output is still kept out of the report. Retain assertion locations only.
    for (const row of metadata?.assertions.filter(x=>x.outcome==="FAIL").slice(0,12)||[]) console.error("FAILED ASSERTION " + row.file + ":" + row.line);
    throw Error("second gate failed; inspect ignored public diagnostic logs");
  }
  assert.equal(metadata.pendingRequests,0);
  return { output:child.stdout||"", metadata };
}
async function bundle(side,name,entry) {
  const redirects=[];
  const result = await esbuild.build({ entryPoints:[path.join(ROOT,entry)], bundle:true, platform:"node", jsx:"automatic",
    loader:{".jsx":"jsx"}, outfile:path.join(OUT,side+"-"+name+".cjs"), absWorkingDir:ROOT,
    logLevel:"silent", sourcemap:"linked", sourcesContent:false, metafile:true,
    plugins: side === "candidate" ? [{name:"candidate-engine-only",setup(build){
      build.onResolve({filter:/app\.jsx$/},args=>{
        assert.equal(args.path,"../src/app.jsx","unexpected engine import path");
        assert.equal(path.resolve(args.importer),path.join(ROOT,entry),"unexpected engine importer");
        redirects.push({importer:entry,from:args.path,to:"rebuild/engine/test/second-gate-adapter.mjs"});
        return {path:ADAPTER};
      });
    }}] : [] });
  if(side==="candidate") {
    assert.equal(redirects.length,1);
    assert.ok(!Object.keys(result.metafile.inputs).some(n=>n.replaceAll("\\","/").endsWith("src/app.jsx")));
  }
  return { file:path.join(OUT,side+"-"+name+".cjs"), redirects,
    inputs:Object.keys(result.metafile.inputs), bundleSha256:sha(fs.readFileSync(path.join(OUT,side+"-"+name+".cjs"))) };
}
async function gate(side) {
  const engineBuild = await bundle(side,"engine-test","tools/engine-test.jsx");
  const engine = run(side,"engine-test",[engineBuild.file]);
  const finals = [...engine.output.matchAll(/^FINAL108: (\d+) passed, (\d+) failed$/gm)];
  assert.equal(finals.length,1); const final=finals.at(-1);
  assert.equal(+final[2],0); assert.ok(+final[1]>0);
  assert.equal(engine.metadata.assertions.length,+final[1]);
  const classification=classifyAssertions(engine.metadata.assertions);
  assert.equal(engine.metadata.networkCalls,6,"two original ghSync drives, each GET + ledger PUT + snapshot PUT");
  console.log("SECOND GATE " + side + " " + final[0]);
  console.log("SECOND GATE " + side + " condition-origin counts: " + JSON.stringify(classification) + "; exact executed-site multiset; NOT branch coverage");
  const vacuity = run(side,"vacuity",["tools/vacuity-scan.mjs","tools/engine-test.jsx","--gate"]);
  const vacuityLine=vacuity.output.split(/\r?\n/).find(x=>x.startsWith("vacuity gate — "));
  assert.ok(vacuityLine);console.log("SECOND GATE " + side + " " + vacuityLine);
  let plEngine=ADAPTER, referenceBuild=null;
  if(side==="reference") {
    const file=path.join(OUT,"reference-engine.cjs");
    const result=await esbuild.build({stdin:{contents:'import "./tools/_fixed-now.mjs"; export {__test} from "./src/app.jsx";',resolveDir:ROOT,sourcefile:"second-gate-reference-entry.mjs"},
      bundle:true,platform:"node",jsx:"automatic",loader:{".jsx":"jsx"},outfile:file,absWorkingDir:ROOT,logLevel:"silent",metafile:true});
    referenceBuild={bundleSha256:sha(fs.readFileSync(file)),inputs:Object.keys(result.metafile.inputs)};plEngine=file;
    const types=run(side,"export-types",["-e",'const T=require('+JSON.stringify(file)+').__test;process.stdout.write(JSON.stringify(Object.fromEntries('+JSON.stringify(inventory.all)+'.map(n=>[n,typeof T[n]]))));']);
    assert.deepEqual(JSON.parse(types.output),inventory.types,"pinned frozen export presence/types");
  }
  const sync=run(side,"sync-laws",["tools/sync-laws.mjs"],{PL_ENGINE:plEngine});
  assert.ok(sync.output.includes("BROKEN-LAWS: none"));assert.ok(!/SKIP|SHAPE-DRIFT|VIOLATED/.test(sync.output));
  const syncLine=sync.output.split(/\r?\n/).find(x=>/^SYNC-LAWS: \d+ laws hold across \d+ committed seeds/.test(x));
  assert.ok(syncLine); console.log("SECOND GATE " + side + " " + syncLine);
  const surfaceBuild=await bundle(side,"surface","tools/_engine-surface.jsx");
  const surface=run(side,"surface",[surfaceBuild.file]);
  const baseline=fs.readFileSync(path.join(ROOT,"tools/engine-baseline.json"));
  assert.ok(Buffer.from(surface.output).equals(baseline),"surface stdout must equal committed baseline bytes");
  console.log("SECOND GATE " + side + " surface: byte-identical to committed baseline (" + baseline.length + " bytes)");
  const result={side,passed:+final[1],failed:+final[2],classification,syncLine,vacuityLine,surfaceBytes:baseline.length,
    engineMetadata:engine.metadata,syncMetadata:sync.metadata,surfaceMetadata:surface.metadata,engineBuild,surfaceBuild,referenceBuild};
  fs.writeFileSync(path.join(OUT,side+"-result.json"),JSON.stringify(result,null,2)+"\n");
  return result;
}
try {
  // Negative control: even when a caller catches the rejected request, the
  // independent exit hook must refuse success. No request is sent or delegated.
  const tripMeta=path.join(OUT,"tripwire-negative.metadata.json");
  const trip=spawnSync(process.execPath,["--require",PRELOAD,"-e",'fetch("https://example.invalid/blocked").catch(()=>{});'],
    {cwd:ROOT,env:{...env,M2_SECOND_GATE_META:tripMeta},encoding:"utf8",windowsHide:true,timeout:30000});
  const tripProof=JSON.parse(fs.readFileSync(tripMeta));
  assert.equal(trip.status,1);assert.equal(tripProof.networkCalls,0);assert.equal(tripProof.pendingRequests,0);
  assert.deepEqual(tripProof.violations,["fetch without declared harness mock"]);
  console.log("SECOND GATE I/O tripwire: PASS — a caught unmocked request fails the process; zero delegated requests");
  // Candidate acceptance always obtains a fresh complete reference result in
  // this invocation; a stale success manifest cannot bless a smaller test run.
  const reference=await gate("reference");
  let candidate;
  if(mode==="--candidate") {
    candidate=await gate("candidate");
    assert.equal(candidate.passed,reference.passed);assert.equal(candidate.syncLine,reference.syncLine);
    assert.deepEqual(candidate.engineMetadata.assertions,reference.engineMetadata.assertions,"same actual assertion sites/outcomes/counts");
    assert.equal(candidate.engineMetadata.randomCalls,reference.engineMetadata.randomCalls,"same deterministic random stream consumption");
  }
  const manifest={sourceCommit:"fe516c1",hashes,inventory,assertionCatalog:{path:"rebuild/engine/test/second-gate-assertions.json",sha256:sha(fs.readFileSync(path.join(HERE,"second-gate-assertions.json"))),method:assertionCatalog.method,counts:reference.classification},carrierRanges,carrierSha256:sha(Buffer.from(carrierText)),commands,
    reference:{passed:reference.passed,syncLine:reference.syncLine,surfaceBytes:reference.surfaceBytes},
    candidate:candidate?{passed:candidate.passed,syncLine:candidate.syncLine,surfaceBytes:candidate.surfaceBytes}:null};
  fs.writeFileSync(path.join(OUT,mode.slice(2)+"-manifest.json"),JSON.stringify(manifest,null,2)+"\n");
  console.log("SECOND GATE " + mode.slice(2) + ": PASS; exact original harnesses; July lazy-clock bridge; closed synthetic I/O; manifest .tmp/m2-second-gate/" + mode.slice(2) + "-manifest.json");
} catch(error) {
  console.error("SECOND GATE " + mode.slice(2) + ": FAIL — " + error.message);
  process.exitCode=1;
}
