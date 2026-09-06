'use strict';
// Standalone first checkpoint; PACKAGE owns complete trace/mode/delta accounting.
const path=require('node:path'),{spawnSync}=require('node:child_process'),root=path.resolve(__dirname,'../../../..'),NativeDate=Date;
const kind=process.argv[2]||'frozen';
if(process.argv.includes('--matrix')){for(const mode of ['frozen','native'])for(const day of ['2026-09-03','2026-09-07']){const r=spawnSync(process.execPath,[__filename,kind,'--worker',mode,day,'--summary'],{cwd:root,env:{...process.env,MEASURED_TEST_NOW:'2026-09-03',TZ:'America/New_York'},encoding:'utf8',windowsHide:true});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.status!==0)process.exit(r.status||1);}process.exit(0);}
const worker=process.argv.indexOf('--worker'),mode=worker<0?'native':process.argv[worker+1],day=worker<0?(process.env.IG_DAY||'2026-09-03'):process.argv[worker+2];
if(mode==='frozen'){const ms=NativeDate.parse(day+'T16:00:00.000Z');globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[ms]));}static now(){return ms;}};}
const {laws,CASES}=require('./laws/import-guards.cjs');
const {createFrozenEngine}=require('./helpers/import-guards-frozen.cjs');
const {createHosts}=require('./helpers/import-guards-hosts.cjs');
const bundle=process.env.ENGINE_MAIN;
if(kind==='frozen'&&!bundle)throw Error('ENGINE_MAIN explicit required');
const factory=kind==='frozen'?o=>createFrozenEngine({...o,bundle,root}):require(path.join(root,'rebuild/engine/index.cjs')).createEngine;
(async()=>{let red=0,green=0,fail=0;const pick=process.argv.indexOf('--case'),caseId=pick<0?null:process.argv[pick+1];for(const law of laws)for(const test of CASES.filter(x=>x.defect===law.defect&&(!caseId||x.id===caseId))){const result=await law.run({day,caseId:test.id,engine:factory,createHosts:T=>createHosts({engine:T,root}),record(){}});const expected=kind==='frozen'&&test.frozenRed?false:true,okay=result.ok===expected;if(result.ok)green++;else red++;if(!okay)fail++;if(!process.argv.includes('--summary')||!okay)console.log(`${test.id} ${result.ok?'GREEN':'RED'} ${okay?'EXPECTED':'UNEXPECTED'}${result.ok?'':' '+result.assertions.filter(a=>!a.ok).map(a=>a.id).join(',')}`);}console.log(`IMPORT-GUARDS ${kind} ${mode} ${day}: ${green} GREEN / ${red} RED / ${fail} UNEXPECTED`);process.exitCode=fail?1:0;})().catch(e=>{console.error(e);process.exitCode=1;});
