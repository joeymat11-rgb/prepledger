'use strict';
// Build-only expectation authoring. Run from repo root without ENGINE_MAIN; it compiles the pinned public Git sources.
// Writes ignored scratch only. Candidate execution is a separate reviewer gate.
const NativeDate=Date;
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=process.cwd(),P=path.join(root,'rebuild/conform/v4/postfix');
fs.mkdirSync(path.join(root,'.tmp/postfix/expectation-build'),{recursive:true});
const {createFrozenSource,produce,exactCells}=require(path.join(P,'helpers/import-guards-expectations.cjs'));
const target=require(path.join(P,'target.cjs')),struct=require(path.join(P,'structural-delta.cjs'));
const mod=require(path.join(P,'laws/import-guards.cjs')),base=require(path.join(P,'manifest.json'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex'),source=createFrozenSource({root}),bundle=source.bundle;
const pins={...base.baseline.publicPins};for(const rel of ['rebuild/conform/v4/postfix/helpers/import-guards-frozen.cjs','rebuild/conform/v4/postfix/helpers/import-guards-hosts.cjs'])pins[rel]=sha(fs.readFileSync(path.join(root,rel)));
const trace=r=>({frames:r.frames,detail:r.detail});
const selected=process.argv.slice(2),cases=mod.CASES.filter(c=>!selected.length||selected.includes(c.id));
(async()=>{const rows=mod.laws.map(l=>({defect:l.defect,cases:[]}));let n=0,total=0;
for(const c of cases){const row={id:c.id,assertions:mod.ASSERTION_INVENTORY.filter(a=>a.caseId===c.id).map(a=>({id:a.id,count:1})),originalFailures:null,expectations:[]};
for(const cell of base.matrix){
const unprojected=await produce({source,caseId:c.id,...cell,project:false});
// Independent real-target byte match; no extracted candidate is loaded here.
const prior=global.Date;global.Date=NativeDate;const actual=await target.worker({kind:'direct-frozen',bundle,bundleSha256:sha(fs.readFileSync(bundle)),frozenHelper:'rebuild/conform/v4/postfix/helpers/import-guards-frozen.cjs',hostsHelper:'rebuild/conform/v4/postfix/helpers/import-guards-hosts.cjs',helperRoot:root,helperPins:pins,caseFile:path.join(P,'laws/import-guards.cjs'),caseSha256:sha(fs.readFileSync(path.join(P,'laws/import-guards.cjs'))),lawId:mod.laws.find(l=>l.defect===c.defect).id,caseId:c.id,traceProfile:2,...cell});global.Date=prior;
if(JSON.stringify(trace(actual))!==JSON.stringify(trace(unprojected)))throw Error('UNPROJECTED-TARGET-MISMATCH:'+c.id+'/'+cell.mode+'/'+cell.day);
const expected=await produce({source,caseId:c.id,...cell,project:true});const {delta,cite}=exactCells(trace(actual),trace(expected),c.id);struct.compareStructural(trace(actual),trace(expected),delta);
const failures=actual.assertions.filter(a=>!a.ok).map(a=>a.id).sort();if(row.originalFailures&&JSON.stringify(row.originalFailures)!==JSON.stringify(failures))throw Error('MODE-FAILURES-DIFFER:'+c.id);row.originalFailures=failures;
row.expectations.push({...cell,originalTraceSha256:sha(JSON.stringify(trace(actual))),delta});n++;total+=delta.cells.length;
}
rows.find(r=>r.defect===c.defect).cases.push(row);console.log(c.id+' EXPECTATION '+row.expectations.length+' cells='+row.expectations.reduce((n,e)=>n+e.delta.cells.length,0));}
fs.writeFileSync(path.join(root,'.tmp/postfix/expectation-build/import-guards-deltas.json'),JSON.stringify(rows,null,2)+'\n');console.log('INDEPENDENT EXPECTATIONS '+n+' cells; '+total+' exact delta cells; no candidate loaded');})().catch(e=>{console.error(e.stack);process.exitCode=1;});
