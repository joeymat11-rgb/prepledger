"use strict";
// Disposable loopback harness. Keys are generated per run, never fixtures.
// Metrics wrap the real D1 binding; production routes, bridge, core and signer
// execute inside the application workerd isolate, not the Node test process.
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const { createRequire } = require("node:module");
const { randomBytes } = require("node:crypto");
const { buildCore } = require("../build.cjs");
const { createBridge } = require("../bridge.cjs");
const { generateSigningKey } = require("../crypto.cjs");
const { testIssuer } = require("../../rigs/rig190.cjs");
const directory = path.resolve(__dirname, ".."), dependency = createRequire(path.join(directory, "package.json"));
const wrangler = createRequire(dependency.resolve("wrangler/package.json"));
const NOW = "2026-09-04T16:00:00.000Z", NAME = "earned-r1-metered-application";

async function createR1Runtime() {
  if (wrangler("./package.json").version !== "4.129.0") throw Error("pinned Wrangler required");
  await buildCore();
  const bundle = await dependency("esbuild").build({ stdin: { resolveDir: directory, sourcefile: "r1-metered-entry.mjs", contents: `
    import { createWorker } from './worker.cjs';
    import { createBridge } from './bridge.cjs';
    export default { async fetch(request, env) {
      // Test-only local calibration, never a production Worker route. Allocate
      // and touch a known backing store and do deterministic CPU work. The
      // measured quantity comes from the OS counter, not this loop's duration.
      if(new URL(request.url).pathname==='/__r1-meter-calibration') {
        const a=new Uint8Array(8*1024*1024); let n=0;
        for(let k=0;k<8;k++) for(let i=0;i<a.length;i++) {a[i]=(a[i]+i+k)&255;n=(n+a[i])>>>0;}
        return new Response(JSON.stringify({checksum:n,bytes:a.byteLength}),{headers:{'Content-Type':'application/json'}});
      }
      const stats = { statements:0, batches:0, rowsRead:0, rowsWritten:0, queryMs:0, batchMaxWallMs:0, domainWrites:0, missingMeta:false };
      const sql = new WeakMap();
      function statement(original, text) {
        const wrapped = { bind(...args) { return statement(original.bind(...args),text); }, original };
        sql.set(wrapped,text); return wrapped;
      }
      const db = { prepare(text) { return statement(env.DB.prepare(text),text); }, async batch(input) {
        stats.statements += input.length; stats.batches++;
        const start = performance.now();
        const rows = await env.DB.batch(input.map(x=>x.original));
        stats.batchMaxWallMs = Math.max(stats.batchMaxWallMs, performance.now()-start);
        rows.forEach((result,index)=>{
          const m=result.meta;
          if(!m || !Number.isFinite(m.rows_read) || !Number.isFinite(m.rows_written) || !Number.isFinite(m.duration)) stats.missingMeta=true;
          else { stats.rowsRead+=m.rows_read; stats.rowsWritten+=m.rows_written; stats.queryMs+=m.duration; }
          if (/^(?:INSERT|UPDATE|DELETE)/i.test(sql.get(input[index]).trim()) && /authority_rows/i.test(sql.get(input[index]))) stats.domainWrites += m?.rows_written || 0;
        }); return rows;
      } };
      const authorityKey=JSON.parse(env.AUTHORITY_KEY), auth=JSON.parse(env.AUTH_CONFIG);
      const bridge=createBridge({db,authorityKey,identityKeys:JSON.parse(env.IDENTITY_KEYS),clock:()=>env.TEST_NOW,
        reconciliationProfile:'earned/r1/v1',r1:{issuer:auth.issuer,origin:auth.origins[0]}});
      const response=await createWorker({bridge,authorityKey,auth,clock:()=>env.TEST_NOW}).fetch(request);
      const headers=new Headers(response.headers); headers.set('X-R1-Test-D1',JSON.stringify(stats));
      return new Response(response.body,{status:response.status,headers});
    } };
  ` }, bundle: true, platform:"node",format:"esm",write:false,logLevel:"silent",
    banner:{js:"import * as c from 'node:crypto'; const require = n => { if(n==='node:crypto') return c; throw Error('Unsupported bundled builtin'); };"} });
  const authorityKey=generateSigningKey("r1-resource-run"), identityKeys={first:randomBytes(32).toString("hex"),second:randomBytes(32).toString("hex")}, issuer=testIssuer();
  const {Miniflare,Log,LogLevel,convertV4MiniflareOptions}=wrangler("miniflare");
  const mf=new Miniflare(await convertV4MiniflareOptions({name:NAME,modules:true,script:bundle.outputFiles[0].text,
    compatibilityDate:"2026-09-03",compatibilityFlags:["nodejs_compat"],host:"127.0.0.1",port:0,inspectorPort:0,
    d1Databases:{DB:"earned-r1-resource-local"},resourcePersistencePath:fs.mkdtempSync(path.join(os.tmpdir(),"earned-r1-meter-")),
    bindings:{AUTHORITY_KEY:JSON.stringify(authorityKey),IDENTITY_KEYS:JSON.stringify(identityKeys),AUTH_CONFIG:JSON.stringify(issuer.config),TEST_NOW:NOW},
    log:new Log(LogLevel.ERROR),telemetry:{enabled:false},cf:false}));
  try {
    const db=await mf.getD1Database("DB");
    const sql=n=>fs.readFileSync(path.join(directory,"migrations",n),"utf8").replace(/--[^\n]*/g,"");
    await db.batch(sql("0001_authority.sql").split(";").map(s=>s.trim()).filter(Boolean).map(s=>db.prepare(s)));
    const second=sql("0002_reconciliation.sql"), statements=second.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm)||[];
    if(statements.length!==6 || second.replace(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm,"").trim()) throw Error("unconsumed migration");
    await db.batch(statements.map(s=>db.prepare(s)));
    const bridge=createBridge({db,authorityKey,identityKeys,clock:()=>NOW,reconciliationProfile:"earned/r1/v1",r1:{issuer:issuer.config.issuer,origin:issuer.config.origins[0]}});
    const url=await mf.ready;
    return {mf,db,bridge,authorityKey,identityKeys,issuer,name:NAME,url,NOW,close:()=>mf.dispose(),
      async request(route,body,subject="subject-first") {
        const response=await fetch(new URL(route,url),{method:"POST",headers:{"Content-Type":"application/json",Origin:issuer.config.origins[0],Authorization:"Bearer "+issuer.token(subject)},body:JSON.stringify(body)});
        const text=await response.text();
        return {status:response.status,body:JSON.parse(text),stats:JSON.parse(response.headers.get("x-r1-test-d1")),responseBytes:Buffer.byteLength(text)};
      }};
  } catch(error) {await mf.dispose();throw error;}
}
module.exports={createR1Runtime};
if(require.main===module) (async()=>{const r=await createR1Runtime();try {console.log("R1 WORKER RUNTIME STARTED",(await r.request("/enrol/create",{intent_id:"test",schema_version:1,nonce:randomBytes(32).toString("base64url")})).status);}finally{await r.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
