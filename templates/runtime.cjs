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

async function createR1Runtime({ authorityRoot, p1 = false } = {}) {
  if (wrangler("./package.json").version !== "4.129.0") throw Error("pinned Wrangler required");
  const CAP=global.__retainingCapture; if(!CAP)throw Error('DIAGNOSTIC_CONTEXT_REQUIRED');
  const bundle={outputFiles:[{text:CAP.readPinnedBundle()}]};
  const authorityKey=generateSigningKey("r1-resource-run"), identityKeys={first:randomBytes(32).toString("hex"),second:randomBytes(32).toString("hex")}, issuer=testIssuer();
  const p1Bytes=p1 ? randomBytes(32) : null;
  const {Miniflare,Log,LogLevel,convertV4MiniflareOptions}=wrangler("miniflare");
  const mf=new Miniflare(await convertV4MiniflareOptions({name:NAME,modules:true,script:bundle.outputFiles[0].text,
    compatibilityDate:"2026-09-03",compatibilityFlags:["nodejs_compat"],host:"127.0.0.1",port:0,inspectorPort:0,
    d1Databases:{DB:"earned-r1-resource-local"},resourcePersistencePath:CAP.ownedPersistence(),
    bindings:{AUTHORITY_KEY:JSON.stringify(authorityKey),IDENTITY_KEYS:JSON.stringify(identityKeys),AUTH_CONFIG:JSON.stringify(issuer.config),TEST_NOW:NOW,
      ...(p1Bytes ? {P1_TEST_KEY:p1Bytes.toString('base64url')} : {})},
    log:new Log(LogLevel.ERROR),telemetry:{enabled:false},cf:false}));
  CAP.registerRuntime(mf);
  try {
    const db=CAP.guardDatabase(await mf.getD1Database("DB"));
    const sql=n=>fs.readFileSync(path.join(directory,"migrations",n),"utf8").replace(/--[^\n]*/g,"");
    await db.batch(sql("0001_authority.sql").split(";").map(s=>s.trim()).filter(Boolean).map(s=>db.prepare(s)));
    const second=sql("0002_reconciliation.sql"), statements=second.match(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm)||[];
    if(statements.length!==6 || second.replace(/CREATE TRIGGER[\s\S]*?^END;|CREATE UNIQUE INDEX[\s\S]*?;/gm,"").trim()) throw Error("unconsumed migration");
    await db.batch(statements.map(s=>db.prepare(s)));
    let storage;
    if(p1Bytes){
      const third=sql('0003_payload_storage.sql');
      const parts=third.match(/CREATE TRIGGER[\s\S]*?^END;|(?:CREATE TABLE|INSERT INTO|DROP TABLE|ALTER TABLE)[\s\S]*?;/gm)||[];
      if(parts.length!==8)throw Error('unconsumed P1 migration');
      await db.batch(parts.map(s=>db.prepare(s)));
      const P=require('../../rigs/p1-test-profile.cjs');
      await db.prepare('INSERT INTO authority_storage VALUES(1,?,?,?)').bind(P.PROFILE,P.NAMESPACE,P.EPOCH).run();
      storage=await P.createTestStorage(p1Bytes);
    }
    const bridge=createBridge({db,authorityKey,identityKeys,clock:()=>NOW,reconciliationProfile:"earned/r1/v1",r1:{issuer:issuer.config.issuer,origin:issuer.config.origins[0]},storage});
    const url=await mf.ready;
    return {mf,db,bridge,authorityKey,identityKeys,issuer,name:NAME,url,NOW,storage,close:()=>mf.dispose(),
      async request(route,body,subject="subject-first") {
        const response=await fetch(new URL(route,url),{method:"POST",headers:{"Content-Type":"application/json",Origin:issuer.config.origins[0],Authorization:"Bearer "+issuer.token(subject)},body:JSON.stringify(body)});
        const text=await response.text();
        return {status:response.status,body:JSON.parse(text),stats:JSON.parse(response.headers.get("x-r1-test-d1")),responseBytes:Buffer.byteLength(text)};
      }};
  } catch(error) {await mf.dispose();throw error;}
}
module.exports={createR1Runtime};
if(require.main===module) (async()=>{const r=await createR1Runtime();try {console.log("R1 WORKER RUNTIME STARTED",(await r.request("/enrol/create",{intent_id:"test",schema_version:1,nonce:randomBytes(32).toString("base64url")})).status);}finally{await r.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
