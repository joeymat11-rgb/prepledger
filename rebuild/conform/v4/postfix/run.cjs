'use strict';
const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const {sha,fail,runRaw,rawLaw}=require('./target.cjs');
const L=require('./legacy-gates.cjs');
const REQUIRED=['D33','D34','D35'];
const NON_D=['T2-serialized-restart','T2-unsigned-pull','CANONICAL-v2-decimals','RIG185-rename-shape','ENGINE-explicit-defaults','SYNC-all-MERGE_ARR','REVIEW-Sol-v3','REVIEW-Grok-v3','T3-6a','T3-6b','T3-6c','T3-6d','T3-6e','T3-6f','T3-6g'];
const PIN_PATHS=['rebuild/engine','rebuild/conform/v4','rebuild/conform/fixtures','rebuild/conform/goldens','rebuild/conform/laws','rebuild/conform/oracle','rebuild/conform/run.cjs','rebuild/conform/manifest.json','rebuild/conform/engines/build-engines.mjs','src','tools','scripts','app.js','index.html','sw.js','manifest.webmanifest','package.json','package-lock.json'];
const GATES=[
  ['migrate-source','rebuild/engine/test/migrate-source.cjs','MIGRATE SOURCE PASS'],
  ['merge-source','rebuild/engine/test/merge-source.cjs','MERGE SOURCE PASS'],
  ['writers-source','rebuild/engine/test/writers-source.cjs','WRITERS SOURCE PASS'],
  ...['','-2','-3','-4','-5','-6','-7'].map((s,i)=>['witnesses-'+(i+1),'rebuild/engine/test/defect-witnesses'+s+'.cjs',i===0?'DEFECT WITNESSES':i===5?'M6 preserved defects native: 4/4 PASS':i===6?'preserved writer defects;':'DEFECT WITNESSES '+(i+1)]),
  ['migrate-differential','rebuild/engine/test/migrate-differential.cjs','M5 SYNTHETIC native: PASS'],
  ['merge-differential','rebuild/engine/test/merge-differential.cjs','M6 SYNTHETIC native: PASS'],
  ['writers-differential','rebuild/engine/test/writers-differential.cjs','M7 WRITERS native: PASS'],
  ['merge-laws','rebuild/engine/test/merge-laws.cjs','PASS exact sync-laws source'],
  ['migrate-full','rebuild/engine/test/migrate-full.cjs','PASS M2-5 full migration gate'],
  ['second-gate','rebuild/engine/test/second-gate.mjs','SECOND GATE candidate: PASS','--candidate'],
  ['conformance','rebuild/conform/run.cjs','SUITE CONSISTENT'],
  ['selftest','rebuild/conform/run.cjs','SELFTEST PASS','--selftest'],
  ['strict','scripts/check.mjs','All checks passed. Safe to ship.','--strict']
];
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function keys(obj,names,code) {if(!obj||typeof obj!=='object'||Array.isArray(obj)||!equal(Object.keys(obj).sort(),names.slice().sort()))fail(code);}
function validate(m) {
  keys(m,['version','phase','packageId','requiredIds','selectedApprovedFixIds','baseline','candidateBase','contract','inventory','nonD','theme','matrix','gates','review'],'MANIFEST-SCHEMA');
  keys(m.baseline,['auditCommit','extractionCommit','frozenCommit','frozenBlob','publicPins','engine','buildSources'],'BASELINE-SCHEMA');
  keys(m.contract,['file','commit','sha256','acceptance'],'CONTRACT-SCHEMA');
  keys(m.theme,['file','sha256'],'THEME-SCHEMA');keys(m.review,['status','receipt'],'REVIEW-SCHEMA');
  if(m.contract.file!=='rebuild/m2/BRIEF-POSTFIX-GATE.md'||m.contract.commit!=='45d52cbbde5290d6a1f09e8dbfabf2777076e537')fail('CONTRACT-PIN');
  if(m.version!==1||!['BASELINE','PACKAGE'].includes(m.phase)||m.packageId!=='M2-IMPORT-GUARDS'||!equal(m.requiredIds,REQUIRED)||!Array.isArray(m.selectedApprovedFixIds)||new Set(m.selectedApprovedFixIds).size!==m.selectedApprovedFixIds.length)fail('PHASE-OR-REQUIRED-INVENTORY');
  if(!/^[a-f0-9]{40}$/.test(m.candidateBase)||!m.baseline||m.baseline.auditCommit!=='614e20315b01543d3b7bbc4fa1fe8a5c20bcb690'||m.baseline.frozenBlob!=='f98671d823f0d8cd83e730cdd930afe5f5e7b628'||m.baseline.frozenCommit!=='fe516c1'||m.baseline.extractionCommit!=='ef83543aa825fb581671951d287854166717ad28')fail('BASELINE-PIN');
  if(!Array.isArray(m.inventory)||m.inventory.length!==45||!equal(m.inventory.map(x=>x.defect),Array.from({length:45},(_,i)=>'D'+(i+1)))||new Set(m.inventory.map(x=>x.law.id)).size!==45)fail('D-INVENTORY');
  for(const row of m.inventory) {
    keys(row,['defect','law','disposition','authorization','themeAcceptance','desiredClaim','implementation','dependencies','sourceDeltas','outputDeltas','cases','mutants'],'D-SCHEMA');
    keys(row.law,['defect','id','file','fileSha256','runSha256'],'LAW-SCHEMA');
    if(row.law.defect!==row.defect||typeof row.law.id!=='string'||!/^rebuild\/conform\/v4\/laws-[a-z-]+\.cjs$/.test(row.law.file)||![row.law.fileSha256,row.law.runSha256].every(x=>/^[a-f0-9]{64}$/.test(x)))fail('LAW-SCHEMA');
    if(!['UNRULED','APPROVED-FIX','KEEP','DEFER'].includes(row.disposition)||!['PENDING','PRESENT'].includes(row.implementation)||row.implementation==='PRESENT'&&row.disposition!=='APPROVED-FIX'||typeof row.desiredClaim!=='string'||!row.desiredClaim)fail('DISPOSITION-IMPLEMENTATION');
    if(!Array.isArray(row.dependencies)||row.dependencies.some(x=>!m.inventory.some(y=>y.defect===x))||new Set(row.dependencies).size!==row.dependencies.length)fail('DEPENDENCY-INVENTORY');
    for(const name of ['sourceDeltas','outputDeltas','cases','mutants'])if(!Array.isArray(row[name]))fail('CASE-DELTA-SCHEMA');
    if(row.disposition==='UNRULED'&&(row.authorization!==null||row.themeAcceptance!==null))fail('UNRULED-AUTHORIZATION');
    if(row.sourceDeltas.some(d=>!d.file||!d.declaration||d.file.includes('*')||d.declaration.includes('*')))fail('WILDCARD-SOURCE-EXEMPTION');
    if(m.phase==='BASELINE'&&row.implementation!=='PENDING')fail('BASELINE-IMPLEMENTED-CLAIM');
    if(m.phase==='BASELINE'&&['sourceDeltas','outputDeltas','cases','mutants'].some(k=>row[k].length))fail('BASELINE-UNIMPLEMENTED-DELTA-CLAIM');
  }
  const done=new Set(),active=new Set();function visit(id){if(active.has(id))fail('DEPENDENCY-CYCLE');if(done.has(id))return;active.add(id);for(const dep of m.inventory.find(r=>r.defect===id).dependencies)visit(dep);active.delete(id);done.add(id);}for(const row of m.inventory)visit(row.defect);
  const selected=m.requiredIds.filter(id=>m.inventory.find(x=>x.defect===id).disposition==='APPROVED-FIX');
  if(!equal(m.selectedApprovedFixIds,selected))fail('SELECTED-APPROVAL-MISMATCH');
  if(!Array.isArray(m.nonD)||!equal(m.nonD.map(x=>x.id),NON_D)||m.nonD.some(x=>x.status!=='OPEN'||!x.source||!x.source.section))fail('NON-D-INVENTORY');
  for(const item of m.nonD) {
    keys(item,['id','status','source'],'NON-D-SCHEMA');keys(item.source,['commit','file','section','sha256'],'NON-D-SOURCE-SCHEMA');
    const legacy=item.id.startsWith('T3-')||item.id==='T2-unsigned-pull';
    const file=legacy?'rebuild/t3/REPORT-CLAUDE.md':item.id==='SYNC-all-MERGE_ARR'?'rebuild/DECISIONS.md':'rebuild/ROADMAP.md';
    const section=legacy?'§6'+(item.id==='T2-unsigned-pull'?'e':item.id.slice(-1)):item.id==='SYNC-all-MERGE_ARR'?'line 20':'M0 lines 54–56';
    if(item.source.file!==file||item.source.commit!==(legacy?'0c3e7ce':m.candidateBase)||item.source.section!==section)fail('NON-D-SOURCE');
  }
  if(!equal(m.gates,GATES.map(x=>x[0])))fail('GATE-INVENTORY');
  if(!equal(m.matrix,[{mode:'frozen',day:'2026-09-03'},{mode:'native',day:'2026-09-03'},{mode:'frozen',day:'2026-09-07'},{mode:'native',day:'2026-09-07'}]))fail('MODE-CLOCK-INVENTORY');
  if(m.review.status!=='PENDING'||m.review.receipt!==null)fail('BASELINE-REVIEW-CLAIM');
  return m;
}
function preflight(m,{baseline,candidate}) {
  validate(m);baseline=fs.realpathSync(baseline);candidate=fs.realpathSync(candidate);
  const root=L.git(candidate,['rev-parse','--show-toplevel']).toString().trim();
  if(fs.realpathSync(path.join(root,'rebuild/engine'))!==candidate)fail('CANDIDATE-WRONG-PATH');
  if(L.git(baseline,['rev-parse','HEAD']).toString().trim()!==m.baseline.auditCommit)fail('BASELINE-CHECKOUT');
  L.verifyBase(root,m.candidateBase);
  const pinned=L.git(baseline,['ls-tree','-r','--name-only',m.baseline.auditCommit,'--',...PIN_PATHS]).toString().trim().split(/\r?\n/).sort();
  if(!equal(Object.keys(m.baseline.publicPins).sort(),pinned))fail('PUBLIC-PIN-INVENTORY');
  const enginePins=Object.fromEntries(pinned.filter(x=>/^rebuild\/engine\/[^/]+\.cjs$/.test(x)).map(x=>[path.basename(x),m.baseline.publicPins[x]]));
  if(!equal(Object.entries(m.baseline.engine).sort(),Object.entries(enginePins).sort()))fail('ENGINE-PIN-INVENTORY');
  L.checkSources(baseline,m.baseline.auditCommit,m.baseline.publicPins);
  L.checkSources(root,m.baseline.auditCommit,m.baseline.publicPins);
  L.checkSources(root,m.contract.commit,{[m.contract.file]:m.contract.sha256});
  L.verifyReceipt(root,m.candidateBase,m.contract.acceptance,{role:'cowork',mentions:['POSTFIX-GATE BRIEF','ACCEPTED','D33/D34/D35']});
  if(m.phase==='BASELINE')for(const row of m.inventory)if(row.disposition!=='UNRULED') {
    if(!row.authorization)fail('REQUIRED-DISPOSITION-RECEIPT-MISSING');
    L.verifyReceipt(root,m.candidateBase,row.authorization,{role:'owner',mentions:[row.defect,row.disposition]});
  }
  const files=fs.readdirSync(path.join(baseline,'rebuild/conform/v4')).filter(x=>/^laws-.*\.cjs$/.test(x)).sort();
  if(!equal(files,[...new Set(m.inventory.map(x=>path.basename(x.law.file)))].sort()))fail('EXTRA-OR-MISSING-LAW-FILE');
  const currentFiles=fs.readdirSync(path.join(root,'rebuild/conform/v4')).filter(x=>/^laws-.*\.cjs$/.test(x)).sort();
  if(!equal(files,currentFiles)||!equal(fs.readdirSync(path.join(__dirname,'laws')).sort(),['import-guards.cjs']))fail('EXTRA-OR-MISSING-LAW-FILE');
  const production=fs.readdirSync(candidate,{withFileTypes:true}).filter(x=>x.isFile()&&x.name.endsWith('.cjs')).map(x=>x.name).sort();
  if(!equal(production,Object.keys(m.baseline.engine).sort()))fail('CANDIDATE-MODULE-INVENTORY');
  for(const row of m.inventory)rawLaw(baseline,row.law);
  for(const item of m.nonD)L.checkSources(root,item.source.commit,{[item.source.file]:item.source.sha256},{disk:false});
  if(sha(fs.readFileSync(path.join(__dirname,m.theme.file)))!==m.theme.sha256)fail('THEME-SOURCE-PIN');
  return {root,baseline,candidate};
}
function packagePending(m,context) {
  const reasons=[];
  for(const row of m.inventory) {
    if(row.disposition!=='UNRULED') {
      if(!row.authorization)reasons.push(row.defect+' owner disposition receipt missing');
      else L.verifyReceipt(context.root,m.candidateBase,row.authorization,{role:'owner',mentions:[row.defect,row.disposition]});
      if(row.implementation==='PRESENT') {
        if(!row.themeAcceptance)reasons.push(row.defect+' theme acceptance missing');
        else L.verifyReceipt(context.root,m.candidateBase,row.themeAcceptance,{role:'cowork',mentions:[row.defect,'ACCEPTED']});
      }
    }
    if(!m.requiredIds.includes(row.defect))continue;
    if(row.disposition!=='APPROVED-FIX'||row.implementation!=='PRESENT')reasons.push(row.defect+' requires APPROVED-FIX/PRESENT');
    for(const dependency of row.dependencies)if(m.inventory.find(x=>x.defect===dependency).implementation!=='PRESENT')reasons.push(row.defect+' dependency '+dependency+' pending');
    if(!row.cases.length||!row.mutants.length||!row.sourceDeltas.length||!row.outputDeltas.length)reasons.push(row.defect+' actual reviewed cases/mutants/source/output deltas pending');
  }
  // Deliberate production interlock: v1 is BASELINE infrastructure only. This
  // cannot become a repairs gate by changing JSON status words to PRESENT.
  reasons.push('successor reviewed manifest, concrete import-guard cases and declaration/legacy-case carriers not implemented');
  return reasons;
}
function gateRun(root,bundles,gate,{emit=console.log}={}) {
  const [id,file,needle,arg]=gate;
  if(id==='migrate-full') {
    const manifest=JSON.parse(fs.readFileSync(path.join(root,'rebuild/conform/oracle/manifest.json')));
    if(!fs.existsSync(path.join(root,'rebuild/conform/private/live.json'))||!fs.existsSync(path.join(root,'rebuild/conform',manifest.goldens['live.main'].path)))fail('REQUIRED-PRIVATE-PREPARATION-MISSING');
  }
  const env={...process.env,NODE_OPTIONS:'',NODE_V8_COVERAGE:'',TZ:'America/New_York',MEASURED_TEST_NOW:'2026-09-03',ENGINE_MAIN:bundles.main,ENGINE_OLD:bundles.old};
  if(id==='strict')delete env.MEASURED_TEST_NOW;
  const result=spawnSync(process.execPath,[file,...(arg?[arg]:[])],{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:240000,maxBuffer:8*1024*1024});
  const logs=path.join(root,'.tmp/postfix/gates');fs.mkdirSync(logs,{recursive:true});
  fs.writeFileSync(path.join(logs,id+'.log'),(result.stdout||'')+(result.stderr||'')); // Local only; never forward raw failure diagnostics.
  if(result.error||result.status!==0||!result.stdout.includes(needle))fail('LEGACY-GATE-'+id);
  const tail=result.stdout.split(/\r?\n/).filter(x=>x.includes(needle)).at(-1);
  const extra=result.stdout.split(/\r?\n/).filter(line=>
    id==='migrate-full'&&line.startsWith('PASS M2-5 actual full oracle Date=')||
    id==='second-gate'&&/^SECOND GATE candidate (engine|sync|surface)/.test(line)||
    id==='conformance'&&line.includes('engine-track rig185')||
    id==='strict'&&line.includes('PASS engine suite'));
  for(const line of extra)emit(line);
  emit('LEGACY '+id+' PASS | '+tail);return {id,tail};
}
function parse(args) {
  const result={};
  for(let i=0;i<args.length;i+=2){const k=args[i];if(!['--manifest','--baseline','--candidate','--phase'].includes(k)||result[k]!==undefined||!args[i+1]||args[i+1].startsWith('--'))fail('OPTIONS');result[k]=args[i+1];}
  if(!result['--manifest']||!result['--baseline']||!result['--candidate'])fail('OPTIONS');
  return result;
}
function main(args=process.argv.slice(2)) {
  const options=parse(args),manifestFile=path.resolve(options['--manifest']);
  const m=JSON.parse(fs.readFileSync(manifestFile));
  if(m.version===2){if(options['--phase'])fail('ENVELOPE-SUBSTANTIVE-OVERRIDE');return require('./package-runner.cjs').main({manifestFile,baseline:options['--baseline'],candidate:options['--candidate']});}
  if(options['--phase'])m.phase=options['--phase'];
  const context=preflight(m,{baseline:options['--baseline'],candidate:options['--candidate']});
  console.log('POSTFIX phase='+m.phase+' candidateBase='+m.candidateBase+' baseline='+m.baseline.auditCommit+' selectedApprovedFixIds='+JSON.stringify(m.selectedApprovedFixIds)+' plannedRequiredIds='+JSON.stringify(m.requiredIds));
  for(const item of m.nonD)console.log('NON-D '+item.id+' OPEN | '+item.source.commit+':'+item.source.file+' '+item.source.section);
  if(m.phase==='PACKAGE') {
    for(const row of m.inventory)console.log(row.defect+' '+row.disposition+' / '+row.implementation);
    for(const reason of packagePending(m,context))console.log('PACKAGE BLOCKED '+reason);
    console.log('POSTFIX PACKAGE BLOCKED / FIXES PENDING');return 2;
  }
  const scratch=path.join(context.root,'.tmp/postfix/reference');
  const bundles=L.publicReferences({baseline:context.baseline,scratch,sourcePins:m.baseline.buildSources});
  console.log('ENV ENGINE_MAIN='+bundles.main+' ENGINE_OLD='+bundles.old+' MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York; raw candidate children receive no frozen reference');
  console.log(L.historicalAudit({baseline:context.baseline,bundles}));
  let comparisons=0;
  for(const row of m.inventory) {
    for(const mode of ['frozen','native']) {
      const common={baseline:context.baseline,inventory:m.baseline.engine,law:row.law,mode,day:'2026-09-03'};
      const original=runRaw({...common,candidate:path.join(context.baseline,'rebuild/engine')});
      const current=runRaw({...common,candidate:context.candidate});
      if(original.status!=='RED')fail('BASELINE-NOT-RED-'+row.defect);
      if(current.status!=='RED'||!equal(original.frames,current.frames)||!equal(original.detail,current.detail)||!equal(original.loaded,current.loaded))fail('UNAPPROVED-DELTA-'+row.defect);
      comparisons++;
    }
    console.log(row.defect+' '+row.law.id+' | RED-original / RED-candidate; frozen+native trace PASS | '+row.disposition+' / '+row.implementation);
  }
  console.log('RAW BASELINE PASS 45/45 IDs; '+comparisons+' exact mode comparisons; zero repair controls in candidate execution');
  for(const gate of GATES)gateRun(context.root,bundles,gate);
  console.log('POSTFIX TOTAL '+m.inventory.filter(x=>x.disposition==='UNRULED').length+' UNRULED / '+m.inventory.filter(x=>x.disposition==='APPROVED-FIX').length+' APPROVED-FIX / '+m.inventory.filter(x=>x.implementation==='PRESENT').length+' PRESENT / '+m.inventory.filter(x=>x.disposition==='KEEP').length+' KEEP / '+m.inventory.filter(x=>x.disposition==='DEFER').length+' DEFER / 15 non-D OPEN; theme cases and deltas PENDING');
  console.log('BASELINE PASS / FIXES PENDING');return 0;
}
// Publish shared gate exports before CLI dispatch can require this module again.
module.exports={REQUIRED,NON_D,GATES,validate,preflight,packagePending,gateRun,parse,main};
if(require.main===module)try{process.exitCode=main();}catch(e){const blocked=['REQUIRED-PRIVATE-PREPARATION-MISSING','REQUIRED-DISPOSITION-RECEIPT-MISSING','BASELINE-ESBUILD-MISSING','INTEGRATION-FETCH-BLOCKED'].includes(e.code);console.error('POSTFIX '+(blocked?'BLOCKED ':'FAIL ')+(e.code||e.name));process.exitCode=blocked?2:1;}
