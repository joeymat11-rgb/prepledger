'use strict';
// Public construction carrier only. Original witnesses and historical carriers
// stay byte-identical. Compose their reviewed expectation tables once; D12 once.
// No FULL/private route or acceptance receipt is implemented by this program.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),Module=require('node:module'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const H=require('../../../engine/test/b1b2-public-engine.cjs');
const PINS=Object.freeze({
 'defect-witnesses':'557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644',
 'defect-witnesses-2':'833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2',
 'defect-witnesses-3':'f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6',
 'defect-witnesses-4':'c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7'
});
// Extract only the public literal tables, never import the historical runner's
// broad helper dependency closure or execute its entry point. The source heads
// are the accepted historical candidates, not claims of present acceptance.
function tables(){
 const b1=fs.readFileSync(path.join(__dirname,'legacy-b1-carriers.cjs'),'utf8');
 const b2=fs.readFileSync(path.join(root,'rebuild/m4/spec/b2-inherited-carriers.cjs'),'utf8');
 const one=b1.slice(b1.indexOf('const EXPECTATIONS ='),b1.indexOf('\n// ---------------------------------------------------------------------------\nlet activeContext'));
 const two=b2.slice(b2.indexOf('const W1 ='),b2.indexOf('\n// Expected post-B2 tail'));
 assert.ok(one.startsWith('const EXPECTATIONS ='));assert.ok(two.startsWith('const W1 ='));
 assert.doesNotMatch(one+two,/\brequire\s*\(|process\.|readFile|import\s*\(/);
 return {b1:vm.runInNewContext(one+';EXPECTATIONS',Object.create(null)),b2:vm.runInNewContext('const DASH="—";'+two+';SUCCESSORS',Object.create(null))};
}
function exact(source,before,after,site,edits){assert.equal(source.split(before).length-1,1,'one exact expectation site: '+site);assert.ok(!edits.some(e=>e.site===site),'duplicate substitution '+site);edits.push({site,beforeSha256:sha(before),afterSha256:sha(after),occurrences:1});return source.replace(before,after);}
function prepareCarrier(id,bytes){
 assert.ok(Object.hasOwn(PINS,id),'B1B2 unknown witness');assert.equal(sha(bytes),PINS[id],'original witness pin');
 let source=bytes.toString('utf8');const edits=[],t=tables();
 if(id==='defect-witnesses-2'){
  source=exact(source,'assert.equal(step.slopePer1k, 100);','assert.equal(step.slopePer1k, 0.1);','D12-slope',edits);
  source=exact(source,'assert.equal(step.resolved, false);','assert.equal(step.resolved, true);','D12-resolved',edits);
 }
 for(const [before,after,site]of t.b1[id]||[])source=exact(source,before,after,site,edits);
 for(const [site,before,after]of t.b2[id]||[])source=exact(source,before,after,site,edits);
 return {source,edits,sourceHash:sha(bytes),carrierHash:sha(source)};
}
const REPAIRED_MODES = {"--witness-1":"defect-witnesses","--witness-3":"defect-witnesses-3","--witness-4":"defect-witnesses-4"};
function runPublic(selected){
 if(selected!==undefined)assert.ok(Object.values(REPAIRED_MODES).includes(selected),'closed repaired witness');
 H.inspectClosure();const results=[];
 for(const id of selected===undefined?Object.keys(PINS):[selected]){
  const file=path.join(root,'rebuild/engine/test',id+'.cjs'),bytes=fs.readFileSync(file),p=prepareCarrier(id,bytes),output=[];
  const m=new Module(file);m.filename=file;
  m.require=request=>{
   if(request==='node:assert/strict')return assert;
   if(request==='../index.cjs')return H;
   if(request==='../policy.cjs')return require('../../../engine/policy.cjs');
   throw Error('B1B2 denied before load: '+request);
  };
  // A local log sink is the only presentation injection. All engine calls use
  // the real current public module assembly and the one invented seed fixture.
  m.__capture=(...args)=>output.push(args.map(String).join(' '));
  m._compile('const console={log:(...a)=>module.__capture(...a)};\n'+p.source,file);
  const expected={'defect-witnesses':10,'defect-witnesses-2':11,'defect-witnesses-3':5,'defect-witnesses-4':5}[id];
  assert.equal(output.filter(x=>x.startsWith('REPRODUCED ')).length,expected);
  assert.match(output.at(-1),new RegExp(expected+'/'+expected));assert.deepEqual(fs.readFileSync(file),bytes);
  results.push({id,cases:expected,edits:p.edits,tail:output.at(-1),output});
 }
 assert.equal(results.flatMap(r=>r.edits).filter(e=>e.site.startsWith('D12-')).length,selected===undefined?2:0);
 return results;
}
module.exports={PINS,prepareCarrier,runPublic};
if(require.main===module){const argv=process.argv.slice(2);assert.ok(argv.length===0||(argv.length===1&&(argv[0]==='--public-laws'||Object.hasOwn(REPAIRED_MODES,argv[0]))),'unsupported public carrier argv');}
if(require.main===module&&process.argv.length===2){process.env.TZ='America/New_York';const r=runPublic();console.log('B1B2 PUBLIC CARRIERS: '+r.length+'/4; '+r.reduce((n,x)=>n+x.cases,0)+' cases; '+r.reduce((n,x)=>n+x.edits.length,0)+' substitutions; original bytes retained');}
if(require.main===module&&Object.hasOwn(REPAIRED_MODES,process.argv[2])){process.env.TZ='America/New_York';const id=REPAIRED_MODES[process.argv[2]],r=runPublic(id)[0];for(const line of r.output)console.log(line);console.log('B1B2 REPAIRED WITNESS witnesses-'+process.argv[2].slice(-1)+': '+r.cases+' cases; '+r.edits.length+' substitutions; original SHA256 '+PINS[id]);}

const PUBLIC_LAW_CATALOG = [
  {
    "name": "laws-analyst-writer-contract.cjs",
    "sha256": "1eb1675230bf6eaebec753271c91ac56eaa16784e470ff66e17b263e4296069f",
    "ids": [
      "V4-analyst-effort-rule-matches-writer"
    ]
  },
  {
    "name": "laws-cache-identity.cjs",
    "sha256": "0621c181ad6489ebcc9c33fc5ac128a397a13f54455c657f930e71671989a17f",
    "ids": [
      "E-D13-energy-density-cache-tracks-relevant-state",
      "E-D20-forecast-refreshes-after-an-observed-rate-change",
      "E-D26-today-model-refreshes-when-the-calendar-day-changes"
    ]
  },
  {
    "name": "laws-clock-and-as-of.cjs",
    "sha256": "cf1774660a73e9ee9186913a93cfd7604750c8f0ace9e7e15fb4e28f1bb6581c",
    "ids": [
      "P-D7-anchor-and-trend-exclude-future-sessions",
      "D-D8-stale-sleep-does-not-claim-current-debt",
      "E-D9-split-selects-latest-effective-date",
      "E-D10-calendar-week-is-seven-calendar-dates",
      "E-D15-session-frequency-does-not-change-with-food-row-density",
      "P-D19-inclusive-break-end-prose-agrees-with-active-day",
      "E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date",
      "E-D28-programme-volume-follows-the-current-effective-split",
      "V4-merge-earned-receipt-historical-asof"
    ]
  },
  {
    "name": "laws-counts-only-guards.cjs",
    "sha256": "686f324ccf6dec75418841638b28def216411a4c22dc3080d4801f71bd2a69e9",
    "ids": [
      "P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix",
      "V4-guard-record-identities-and-sets",
      "V4-pristine-compares-record-content"
    ]
  },
  {
    "name": "laws-evidence-comparability.cjs",
    "sha256": "f2c62bbae2f557cefa871cdeaa5fbf3f788dedf75875c943816cadad06b8509a",
    "ids": [
      "P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit",
      "P-D30-first-set-trend-respects-the-recorded-technique-era",
      "V4-volume-tolerance-post-change",
      "V4-volume-replication-same-era"
    ]
  },
  {
    "name": "laws-merge-tie-identity.cjs",
    "sha256": "a8c4044da67ef4692ba1041745c4ad5825a41b4c0c1162b569a1be46b2b1c31e",
    "ids": [
      "V4-merge-preserves-written-trial-decisions",
      "V4-merge-preserves-offer-dismissal",
      "V4-daily-conflict-direction-independent"
    ]
  },
  {
    "name": "laws-numeric-values-and-units.cjs",
    "sha256": "a0de4b75c1e4fbb79f98e09f80f6706f153d74e5a56ac3b41ed300c5ea34a1f6",
    "ids": [
      "E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted",
      "E-D12-step-slope-keeps-per-thousand-units",
      "E-D14-current-rate-uses-missing-drip-default"
    ]
  },
  {
    "name": "laws-receipt-identity.cjs",
    "sha256": "4dfb562acb93892b13099de2aeda7b5e538a744ab4e6a730835ca326213ee9c1",
    "ids": [
      "P-D3-volume-receipt-belongs-to-whole-lift-name",
      "P-D4-other-lift-earn-cannot-spend-sightings"
    ]
  },
  {
    "name": "laws-receipt-truth.cjs",
    "sha256": "871a5fcad74a50e6d2c5ca29a3ecb229c391cb1c289cac50dff0bfc8df8547d1",
    "ids": [
      "E-D16-seven-day-forecast-does-not-grade-a-month-late-read",
      "E-D17-undone-adjustment-is-not-described-as-applied",
      "E-D24-partial-yesterday-remains-owed-until-calories-are-present",
      "E-D25-zero-protein-successes-cannot-be-a-good-protein-read",
      "P-D27-maintenance-is-not-described-as-a-long-stalled-cut",
      "V4-curl-receipt-prices-actual-vector",
      "V4-volume-receipt-requires-actual-change"
    ]
  },
  {
    "name": "laws-scalar-per-set-load.cjs",
    "sha256": "1c9b0a54b899777e491bb6b7d251963566adf42f40791e25a9e7ae6e44ba03a3",
    "ids": [
      "V4-load-writes-advance-per-set-vector",
      "V4-owned-session-retains-entered-load"
    ]
  },
  {
    "name": "laws-state-shape-and-failure.cjs",
    "sha256": "104803f6ab038ee9b29404cd37b454f3b2f870c6cca81b94f25b835d39c5ed3a",
    "ids": [
      "E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash",
      "E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day",
      "V4-unknown-schema-return-untouched"
    ]
  },
  {
    "name": "laws-target-and-load-domain.cjs",
    "sha256": "96707b1c0b024dd4be4dcf1f3c2fe7fb0e33c7e8d88d713413ade62f8ba33654",
    "ids": [
      "P-D1-first-targets-fit-current-set-count",
      "E-D2-invalid-set-count-stays-quarantined",
      "P-D5-ladder-minimum-counts-distinct-rungs",
      "P-D6-deload-preserves-absent-load"
    ]
  },
  {
    "name": "laws-undo-half-effects.cjs",
    "sha256": "4db1af687ca9ed8de228625370b97211c248df8b14f346ba2e77511f1544ce75",
    "ids": [
      "V4-break-undo-restores-scale-effect"
    ]
  }
];
// PM finite grant: these exact public slices only; never import helpers or the
// writer-reference module. Production seed/frozen bundle is never evaluated.
function publicLawHelpers(){
 const hp=path.join(root,'rebuild/conform/v4/helpers.cjs'),wp=path.join(root,'rebuild/engine/test/writers-reference.cjs');
 const hb=fs.readFileSync(hp),wb=fs.readFileSync(wp);assert.equal(sha(hb),'a9c03c7ac76fdebbc7d74ff7068a79b705ac0ad0753e891c5b16ef75fe241b08');assert.equal(sha(wb),'42fc5d84a5619d152ded1efbb5b2dabf1a92ccbf4f6f8be14074fa0c4fe29415');
 const h=hb.toString().split('\n'),w=wb.toString().split('\n'),slice=(lines,a,b)=>lines.slice(a-1,b).join('\n');
 const code=[slice(h,3,3),slice(h,9,9),slice(h,31,38),slice(h,49,66),slice(w,17,26)].join('\n');assert.doesNotMatch(code,/\brequire\s*\(|\bimport\s*\(|readFile|createWriterReference|supplement/);
 const m=new Module(__filename);m.require=()=>{throw Error('PUBLIC_LAW_DENIED_BEFORE_READ');};m._compile(code+'\nmodule.exports={NativeDate,clone,clock,patch,state,lift,deterministicRandom,deterministicIds};',__filename);return m.exports;
}
function snapshot(value){
 if(value===undefined)return {$undefined:true};if(typeof value==='number'&&!Number.isFinite(value))return {$number:String(value)};
 if(value instanceof Date)return {$date:value.toISOString()};if(Array.isArray(value))return value.map(snapshot);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,snapshot(value[k])]));return value;
}
function publicLawBundle(helpers,frames){return {kind:'candidate',clock:helpers.clock,engine(day='2026-09-03'){
 const c=typeof day==='string'?helpers.clock(day):day;
 const T=H.createEngine({clock:c,ids:helpers.deterministicIds(c,helpers.deterministicRandom())}).__test;
 if(frames)for(const [name,fn]of Object.entries(T))if(typeof fn==='function')T[name]=(...inputs)=>{const before=snapshot(inputs);try{const result=fn(...inputs);frames.push({name,before,result:snapshot(result),after:snapshot(inputs)});return result;}catch(e){frames.push({name,before,error:e.name+': '+e.message,after:snapshot(inputs)});throw e;}};
 return T;
}};}
function publicLawSource(name){const pin=PUBLIC_LAW_CATALOG.find(p=>p.name===name);assert.ok(pin,'PUBLIC_LAW_DENIED_BEFORE_READ');const bytes=fs.readFileSync(path.join(root,'rebuild/conform/v4',name));assert.equal(sha(bytes),pin.sha256,'public law source pin '+name);return bytes;}
function loadPublicLaws(){
 const dir=path.join(root,'rebuild/conform/v4'),names=fs.readdirSync(dir).filter(f=>/^laws-.*\.cjs$/.test(f)).sort();
 assert.deepEqual(names,PUBLIC_LAW_CATALOG.map(x=>x.name),'exact13 public law files');
 const pending=PUBLIC_LAW_CATALOG.map(pin=>{const bytes=publicLawSource(pin.name);const source=bytes.toString();assert.deepEqual([...source.matchAll(/\brequire\s*\(([^)]*)\)/g)].map(m=>m[1]),Array((source.match(/\brequire\s*\(/g)||[]).length).fill("'./helpers.cjs'"),'closed law dependencies');assert.doesNotMatch(source,/\bimport\s*\(|\beval\s*\(|new Function|process\.|readFile|fetch\s*\(/);return {pin,source};});
 const helpers=publicLawHelpers(),laws=[];
 for(const {pin,source}of pending){const m=new Module(path.join(dir,pin.name));m.require=request=>{assert.equal(request,'./helpers.cjs','PUBLIC_LAW_DENIED_BEFORE_READ');return helpers;};m._compile(source,path.join(dir,pin.name));assert.deepEqual(m.exports.INVENTORY,m.exports.laws.map(l=>l.id));assert.deepEqual(m.exports.INVENTORY,pin.ids);laws.push(...m.exports.laws);}
 laws.sort((a,b)=>Number(a.defect.slice(1))-Number(b.defect.slice(1)));assert.equal(laws.length,45);assert.equal(new Set(laws.map(l=>l.id)).size,45);
 laws.forEach((l,i)=>{assert.equal(l.defect,'D'+(i+1));assert.equal(l.expect,'GREEN');assert.equal(typeof l.run,'function');assert.equal(typeof l.control,'function');assert.ok(l.cite&&l.mutants.length);l.mutants.forEach(m=>{assert.equal(typeof m.make,'function');assert.equal(typeof m.name,'string');});});return {helpers,laws};
}
function runPublicLaws(){
 const manifest=H.inspectClosure(),pins=H.CONSTRUCTION_SOURCE_MANIFEST.modules;
 const base=Object.keys(manifest).every(n=>manifest[n]===pins[n].base),candidate=Object.keys(manifest).every(n=>manifest[n]===pins[n].candidate);assert.ok(base||candidate,'law execution requires exact public M or manifested candidate modules');
 const {helpers,laws}=loadPublicLaws();const rows=[];
 const execute=(law,B)=>{try{const r=law.run(B);assert.equal(typeof r.ok,'boolean');return {status:r.ok?'GREEN':'RED',detail:snapshot(r.detail)};}catch(e){return {status:'HARNESS_ERROR',error:e.name+': '+e.message};}};
 for(const law of laws){const frames=[],raw=execute(law,publicLawBundle(helpers,frames));let control,mutants=[];try{control=execute(law,law.control(publicLawBundle(helpers)));mutants=law.mutants.map(m=>({name:m.name,...execute(law,m.make(law.control(publicLawBundle(helpers))))}));}catch(e){control={status:'HARNESS_ERROR',error:e.name+': '+e.message};}const row={id:law.id,defect:law.defect,raw,control,mutants,frames};rows.push(row);console.log(law.defect+' run='+raw.status+' control='+control.status+' mutants='+mutants.map(m=>m.status).join(','));}
 const side=base?'M':'candidate',all=rows.flatMap(r=>[r.raw,r.control,...r.mutants]);const result={side,fixture:'explicit public synthetic SEED; never production or frozen bundle',manifest,rows,totals:{laws:rows.length,rawGreen:rows.filter(r=>r.raw.status==='GREEN').length,rawRed:rows.filter(r=>r.raw.status==='RED').length,controlsGreen:rows.filter(r=>r.control.status==='GREEN').length,mutants:rows.reduce((n,r)=>n+r.mutants.length,0),mutantsRed:rows.reduce((n,r)=>n+r.mutants.filter(m=>m.status==='RED').length,0),harnessErrors:all.filter(x=>x.status==='HARNESS_ERROR').length}};
 const dir=path.join(root,'.tmp','b1b2-public-audit');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'public-laws-'+side+'.json'),JSON.stringify(result,null,2)+'\n');console.log('PUBLIC_LAWS_TOTAL '+JSON.stringify({side,...result.totals}));return result;
}
module.exports.PUBLIC_LAW_CATALOG=PUBLIC_LAW_CATALOG;module.exports.runPublicLaws=runPublicLaws;
if(require.main===module&&process.argv.includes('--public-laws')){process.env.TZ='America/New_York';const result=runPublicLaws();process.exitCode=result.totals.harnessErrors?1:0;}

module.exports.publicLawSource=publicLawSource;

// Reproducible normalized snapshot and per-row/frame comparison hashes.
module.exports.PUBLIC_LAW_CHECKPOINT = {
  "provenance": "public M vs manifested candidate; synthetic fixture, no original frozen bundle; accounting, not all-laws PASS",
  "baseSnapshotSHA256": "bfe5bcfcd5036d0343582f39362f71e32ca47bc879d9c340b336718eb2d3da18",
  "candidateSnapshotSHA256": "915b4b0f9e0225c4aebfbff0cc5657a9796be3ecb808ce24a4e9691928209df8",
  "restoredSources": {
    "rebuild/engine/dates.cjs": "b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067",
    "rebuild/engine/sleep.cjs": "b55cb352aed6be0032391e7b695223928154cd89c43023838c69baaa33a22e2d",
    "rebuild/engine/policy.cjs": "a92706d3187e621102f90e83c91e14b8b7fbda7006a9793c3c9413ceff98a870",
    "rebuild/engine/today.cjs": "36ce41f37c6d50d79588540470f6f87d050e9ef944b9ce76eb44ad380b952135",
    "rebuild/engine/plan.cjs": "4c6f981706694771501d3d050440eb4f9a62e64b6eac7c59ff9c4742dfaa7e93",
    "rebuild/engine/progression.cjs": "9adaeecb715e42533fcd51483e67f52a9d8d530a0de80865e28ae572152599a8",
    "rebuild/engine/volume.cjs": "d58159bc0c098983fa1db6a1f8542d93611537934fca2b2a17bae236bcacd321",
    "rebuild/engine/writers.cjs": "694e220db85eac38a1068e7e7ed9404edb786140df165dd621f0eee2f4531959"
  },
  "sourceRestored": true,
  "comparison": {
    "id": "public-laws",
    "classification": "MEASURED_PUBLIC_SYNTHETIC",
    "base": {
      "laws": 45,
      "rawGreen": 6,
      "rawRed": 39,
      "controlsGreen": 44,
      "mutants": 52,
      "mutantsRed": 45,
      "harnessErrors": 0
    },
    "candidate": {
      "laws": 45,
      "rawGreen": 30,
      "rawRed": 15,
      "controlsGreen": 43,
      "mutants": 52,
      "mutantsRed": 21,
      "harnessErrors": 0
    },
    "changedRows": [
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
      "D7",
      "D8",
      "D9",
      "D10",
      "D16",
      "D17",
      "D18",
      "D19",
      "D21",
      "D23",
      "D24",
      "D25",
      "D27",
      "D28",
      "D29",
      "D30",
      "D31",
      "D32",
      "D45"
    ],
    "unchangedRows": 20,
    "d22RowParity": true,
    "d22FramesParity": true
  },
  "rows": [
    {
      "defect": "D1",
      "baseRowSHA256": "108a2ed9d8ce2a26b0d28ff40e1b061b1fd69dfb65a151aaaf7cf0821358a51d",
      "candidateRowSHA256": "8fba26fcbc419aa580d5009fa96645d0daf581a656ca2a4d558f67d4244640c9",
      "baseFramesSHA256": "86f436220e258a0898f0bdd98b0100e17e913e74f6f0718dcd410d2b6533c4db",
      "candidateFramesSHA256": "1861cbcab61072163a37033fc4e696e904471a22f659801387424d3de49a512a"
    },
    {
      "defect": "D2",
      "baseRowSHA256": "d208bbcfa931784608ee7859449fa2b09237f29a17bfd7758c54ff23964ebd3d",
      "candidateRowSHA256": "2dd0b1c4bfa4538f3c057b5cb18cdde6bd65aa46ff3e63dd0d6ab4a2b6597cbf",
      "baseFramesSHA256": "27f945f19dba00c1b37391841b2feb85717764c1c6622f52580f30804b9df336",
      "candidateFramesSHA256": "77da5a5ce36fe83cde270d8f6396cdf6bccce9d92b5626c8c75f26203e4033e2"
    },
    {
      "defect": "D3",
      "baseRowSHA256": "1e2ed7215f11b4ea49643ad2de0ed0a897c0c13f519b4941061d9a78871e2b4a",
      "candidateRowSHA256": "b7073c5370a9b834b28e15e71850df1a632e566297d203cb034f1fe29746eadd",
      "baseFramesSHA256": "e32d2f6ae3f793716d5518f60b882899459032306f3d1b3084913d0cf4af24cc",
      "candidateFramesSHA256": "d8742111efb4f874df71ee0270fda2392da1e9d41b6195cf1975661dfd60966c"
    },
    {
      "defect": "D4",
      "baseRowSHA256": "66280ffdf8f8abfad3ad9dd8933170abaaea4efe444f1769ee652b50bcd12e14",
      "candidateRowSHA256": "95422c170cf11db7e1650f723d7932b94dff483b3b1c01cd1523fa26fe0478ad",
      "baseFramesSHA256": "70bca8a4ffd6566fe78837f08f0e42703fc1535f420a1a9760f68ed0acd6e0ea",
      "candidateFramesSHA256": "b06eb765dff41bc8ab6a83d47b7d6bbe08c2ca6b19ca40ff28f25813ef9225dc"
    },
    {
      "defect": "D5",
      "baseRowSHA256": "a879cdc542241ed6a9bf510377e81c33baf87e580aa7be13387ca57d966026c6",
      "candidateRowSHA256": "00a099b9ddaefcdfcf93978b09ce82370aadd55f343c3f04e3c19bef3e241a02",
      "baseFramesSHA256": "7f9d015090ece802b27d65e8ed5556f4a5dcbc0aeea1652e54bb7cc605ebd478",
      "candidateFramesSHA256": "b45d5f441c3a2916bd47675b15331d9a30a10237467b4c6ad005d3ead7b9e43f"
    },
    {
      "defect": "D6",
      "baseRowSHA256": "b4a2f6fac25e938ec0bbb57c712f616b84c2adbab1fbb284824bb794088ef0e9",
      "candidateRowSHA256": "cf56ad42aa8b23a96451f70370ea2913fe1d17a336539fa0a3ec7373d268fb01",
      "baseFramesSHA256": "267ec55d7739ec3cacb5513547987955fcd508c10bcab01678b14c52822718cf",
      "candidateFramesSHA256": "77bff391e4dd55aba23d07699b0a0c3518c72daa3e2751700e6fd07c3f152123"
    },
    {
      "defect": "D7",
      "baseRowSHA256": "74d24744467c2e1ce65e5d5a6bc0c6a9a2bdb1269cf5478bb1b2c419e91a3651",
      "candidateRowSHA256": "3852533f451ce91e30dfb0443d649ab3e7dd56e76f21c349293372e726717a61",
      "baseFramesSHA256": "1d8145dc9807dafa2756160086765944f1e0338216902142175dd64640eb3808",
      "candidateFramesSHA256": "1e0b70416485c9717c360bd668721261978838aa366b9b8bccf8389796c0c11a"
    },
    {
      "defect": "D8",
      "baseRowSHA256": "28ee4750ec89d68ff9aad12dfbe2cb91938ab8565737922d6e3818f379721bbb",
      "candidateRowSHA256": "beda3876a3611212c53fb959ec5717a4faacd48e7b9e42fcb001fe96f83187a9",
      "baseFramesSHA256": "56a4eba0c4fabdcf87e667bdfba72eb5ed3cb74133e2a80c0bb498f9fa938383",
      "candidateFramesSHA256": "7defd5c5086d721f2442a7d0d81a21255469be127bb4cd563dc084ac2ffeb91f"
    },
    {
      "defect": "D9",
      "baseRowSHA256": "e32b0315332a6f70cbb05e6355c98ce8fa0edbe5710b0a3d2bea20b10790203b",
      "candidateRowSHA256": "b1803a5519eefd64f5e9484099d510f66b65c775d8e8aeb29ada0f69e0ca2b56",
      "baseFramesSHA256": "9b06e38d473fa04d58fcd29b2462d3ff4ec920e8228c1ad2c58dcb101482877c",
      "candidateFramesSHA256": "af249178fc99604313302ab3eeea7807f43100988b4ecdf0306230d5ed28a4eb"
    },
    {
      "defect": "D10",
      "baseRowSHA256": "7909efda0ba0f5e84732afc6afd3dbff4d1a2da3fb40c02be7f26df344e4752b",
      "candidateRowSHA256": "9dea1d35a18256a99804f3e04ea0bd8c6604fbbca0dc57ca2cde5083272536e8",
      "baseFramesSHA256": "09d018f6ba01230a1f949ad5b93ea55d9f56619754e6459ded9cf9c9bf301049",
      "candidateFramesSHA256": "22ebeb153f8e2259ea2ce4e863383049684bb2d95d5f730abf465b6a428063be"
    },
    {
      "defect": "D11",
      "baseRowSHA256": "b801a9cb4f6b3c3468c3dc955fd618428f9ae50c39399f4cf38337c93cdb10b9",
      "candidateRowSHA256": "b801a9cb4f6b3c3468c3dc955fd618428f9ae50c39399f4cf38337c93cdb10b9",
      "baseFramesSHA256": "e368250bc70652298bc78d4dad9d5d983f788e76898d95852b065bd3d0a9f6ff",
      "candidateFramesSHA256": "e368250bc70652298bc78d4dad9d5d983f788e76898d95852b065bd3d0a9f6ff"
    },
    {
      "defect": "D12",
      "baseRowSHA256": "b6f6f6689edf81060b93bac6258c53f8e957358b786b5625d01ab10dfb5f54b0",
      "candidateRowSHA256": "b6f6f6689edf81060b93bac6258c53f8e957358b786b5625d01ab10dfb5f54b0",
      "baseFramesSHA256": "a9c83f68d0e14159cc60f46f9634db87f640ce7f9e1545c2ec223f483fe928e9",
      "candidateFramesSHA256": "a9c83f68d0e14159cc60f46f9634db87f640ce7f9e1545c2ec223f483fe928e9"
    },
    {
      "defect": "D13",
      "baseRowSHA256": "9e1716d436b0d998b80267274eb54147e7d4bc7a38587e3351d93702fcb1f16d",
      "candidateRowSHA256": "9e1716d436b0d998b80267274eb54147e7d4bc7a38587e3351d93702fcb1f16d",
      "baseFramesSHA256": "ade9e0672fe8d28387d3e9ba6e7863742470df8cd365f7b11f218ef9cd4059a4",
      "candidateFramesSHA256": "ade9e0672fe8d28387d3e9ba6e7863742470df8cd365f7b11f218ef9cd4059a4"
    },
    {
      "defect": "D14",
      "baseRowSHA256": "90176a0776846f9ffadb877de9a2547b1c86aaf4ea8274f8c3478d4bc595ab96",
      "candidateRowSHA256": "90176a0776846f9ffadb877de9a2547b1c86aaf4ea8274f8c3478d4bc595ab96",
      "baseFramesSHA256": "02c0f6b84e2a9d45540ea9fd7df6786ded39755c689d9ee85edc132089f3deb6",
      "candidateFramesSHA256": "02c0f6b84e2a9d45540ea9fd7df6786ded39755c689d9ee85edc132089f3deb6"
    },
    {
      "defect": "D15",
      "baseRowSHA256": "6ffcd2b8b5aa29f04d1cfa7e6590cd77b41a35e93b4b106db65e75b1ca7ec57a",
      "candidateRowSHA256": "6ffcd2b8b5aa29f04d1cfa7e6590cd77b41a35e93b4b106db65e75b1ca7ec57a",
      "baseFramesSHA256": "18ba0b9f7a3cb2585fe2461a1c3bf29c96fcc8233cfd2e1fb67d5fde5b6dc3a5",
      "candidateFramesSHA256": "18ba0b9f7a3cb2585fe2461a1c3bf29c96fcc8233cfd2e1fb67d5fde5b6dc3a5"
    },
    {
      "defect": "D16",
      "baseRowSHA256": "6121184e78440afb7a800d8cf8a5f80e5b5c62fd33805844fcb2edb83734cc79",
      "candidateRowSHA256": "7fa84213076a86bc83a8337abec73677783fe87d8afe99d7aa44a436bb1ee3c4",
      "baseFramesSHA256": "62da29a1af1f265eae4a7787769e26cf2e47e4363595e6a61cc19148225c8d9f",
      "candidateFramesSHA256": "408fbc42cf8fec4e03eda7d5c19f1231a1c0a4279c7851a0b99cfd8de132a2fc"
    },
    {
      "defect": "D17",
      "baseRowSHA256": "bd2b8be45580049f4428a042eb96a10801580852f49f6b1dbecd5df59c7188e9",
      "candidateRowSHA256": "ef4eb793b164c5446355a3091eb5bb03e717b6b93798d90636dd3bd48adf8567",
      "baseFramesSHA256": "e4fa47fa7a71a853d3db5f193447d5943bb068cfa9b62ca895a939fde1e53302",
      "candidateFramesSHA256": "e8f60a8e154b7e887c983c613bb8d6e6521e9e9fc69725a9d4c8d2ce5b5bb9e3"
    },
    {
      "defect": "D18",
      "baseRowSHA256": "87cb48c22bb81f309963f7d2ef705f20b17edc6007218b1d33da388c66e23df7",
      "candidateRowSHA256": "2f13f80b9fe5aebb85f52cf76344c379be9b6197584529b8bfefe9ebe4685d88",
      "baseFramesSHA256": "748449e6e2e29b06f95f9a23272784c8823c98d56325cc116a235260cb04db19",
      "candidateFramesSHA256": "3d7101a7f2300576838bb0317b43e51d5922d8faf6ac01c8f7e29c3214f3eb80"
    },
    {
      "defect": "D19",
      "baseRowSHA256": "3387c65d406c3facfd16a151d98760d2a58e51c595f9344a9b37901bcf41cc9b",
      "candidateRowSHA256": "df3a4597557b14b8712ca60315661cca0c4dfd98a51628364c929d0b94e5a876",
      "baseFramesSHA256": "0ec24a6773b5ee8f469c675dad41c6899bea8a55154ac86e13d279528c2992f7",
      "candidateFramesSHA256": "e27d21c336a78292daa8dd3a61792c7faa24d3b1f12fdef5395b53ea470074b2"
    },
    {
      "defect": "D20",
      "baseRowSHA256": "82e1efbb92c8f2612a0329bd53b704e7e872e23ce133e5fe9aed339c706a5d6d",
      "candidateRowSHA256": "82e1efbb92c8f2612a0329bd53b704e7e872e23ce133e5fe9aed339c706a5d6d",
      "baseFramesSHA256": "7dd62d7dfd52d57115a3326c62d8615cc9a24de856c44d2a1a3997ba436d6480",
      "candidateFramesSHA256": "7dd62d7dfd52d57115a3326c62d8615cc9a24de856c44d2a1a3997ba436d6480"
    },
    {
      "defect": "D21",
      "baseRowSHA256": "ed2330f5763c7a23e65fe2608559b92080b32447a288db469059f803d88265a3",
      "candidateRowSHA256": "9c8d5bb868860e1caa2a7bf741977388235998a9e068f36cb05c70f1376b2271",
      "baseFramesSHA256": "e68dd3cb1803dfdd3026738c57c6afb788c8f1f08a233bed05af59b085dfb14a",
      "candidateFramesSHA256": "6aef1b56651af804a5307e67c19e9db65b8120b580759426c1fd786d83b9b816"
    },
    {
      "defect": "D22",
      "baseRowSHA256": "c3302a9e045711ad576049dda394019dac77168fd18053504b28d5e747f083b5",
      "candidateRowSHA256": "c3302a9e045711ad576049dda394019dac77168fd18053504b28d5e747f083b5",
      "baseFramesSHA256": "dfc10bb1ecbe8ae5ac76f59a5486c4531a49dfc84b91e56cfb527b9015c11c45",
      "candidateFramesSHA256": "dfc10bb1ecbe8ae5ac76f59a5486c4531a49dfc84b91e56cfb527b9015c11c45"
    },
    {
      "defect": "D23",
      "baseRowSHA256": "f071a52fdb46fc2e3902a3d727ffb60697ed58637eb6fb90f3be63cd5844883e",
      "candidateRowSHA256": "8c89ce989b7a9f80ff0d15dec29de43914f5f126313beb1f5e938c086213b446",
      "baseFramesSHA256": "8ad408532f31d750a3e3d3042e04cc9fd07651648064c7c99a97c02d8d67c4b8",
      "candidateFramesSHA256": "b9286954436e34a95ce1557d9e34afaf22b1d09f156e3dc452a6824397dec794"
    },
    {
      "defect": "D24",
      "baseRowSHA256": "6873698279074c8ce259d344a25e695f5affeb23741ffd6689fc9acfb638ec98",
      "candidateRowSHA256": "de68f69aeb9021656b80b76c5164435c01aaaabd2cc013e27b1b3c9ca8cf163d",
      "baseFramesSHA256": "976e39847170d7abe8d9783465b3a0564a78ba8da48767581b281ab8ed7a01e1",
      "candidateFramesSHA256": "e8e5b88fc2e83325bb0ffb3c855b401fa9546d8d5935469ab3661a21e03260ae"
    },
    {
      "defect": "D25",
      "baseRowSHA256": "b20e2f81ff2bd7f8b3e9070acde6f822161c9f2480a09ea652eed5ad2e07d256",
      "candidateRowSHA256": "359db44c25a9859db66a0fbeb62f8b7c21350ac0dfafb2ea207b8412bf6aa16a",
      "baseFramesSHA256": "6b2ac63ed11e2d7f0e37a08934b81634be05f321e38d3a32df1609da40be2acc",
      "candidateFramesSHA256": "3551a64aa752d238f16156ae911bd7096ad7faffa362d0cefaaa96bf1b8e31bb"
    },
    {
      "defect": "D26",
      "baseRowSHA256": "2c30f781c9c2193416fab463b2f6c88a4c526e529d5c65f6dd931ab2617a13eb",
      "candidateRowSHA256": "2c30f781c9c2193416fab463b2f6c88a4c526e529d5c65f6dd931ab2617a13eb",
      "baseFramesSHA256": "4341f0ac12992e280de3c13a1da36ee08628037b1a17f2035a07be46b4853b59",
      "candidateFramesSHA256": "4341f0ac12992e280de3c13a1da36ee08628037b1a17f2035a07be46b4853b59"
    },
    {
      "defect": "D27",
      "baseRowSHA256": "e0c1b910bf44bf38f215d8035b80bbece51cdf1d0cf29897bcd68a9a43c56d9e",
      "candidateRowSHA256": "8cd5f74e90e1d5ccb5e817580a6b6320ec78d3fa80c29814d76f0e6dbda3c4c2",
      "baseFramesSHA256": "843f61eac841ca7608954ef8b102809a4171efc250d26464a8e89822a69293db",
      "candidateFramesSHA256": "0c83d80afa23fa2f55a27c2c2fdeeccfae019c8aca2331a320e72942f69cbebe"
    },
    {
      "defect": "D28",
      "baseRowSHA256": "99545d443b60b2521b0bdfb17b1b9001ee6a4b1d740274624aa0edcce2ba2689",
      "candidateRowSHA256": "58074546394c460babda9bae2371680e6a77fa9408a40a60cd7bd853d452d923",
      "baseFramesSHA256": "427fa7242ae371265ebf87241fdb027f02e6ca2f655894c26f043a4b4c9aee29",
      "candidateFramesSHA256": "39637151b795c181407ec7b00499818d8888911bdc4f884b1724200b465d55d0"
    },
    {
      "defect": "D29",
      "baseRowSHA256": "ff5ee4a56e5e584c96f799d07887ca9c18f802fd0e8e5a18913a566a4b556e7d",
      "candidateRowSHA256": "8467ff23eb3961d261fd361318e647805843a792d754167a66ccc7fe4615ebf7",
      "baseFramesSHA256": "098ad413434e4095dd7c738a1d90c5076ad76f3fe137175e6fafbb80f0574ce0",
      "candidateFramesSHA256": "7b6a50a314d437d3b09072d05dfd28d431a898df22ac1a9942da6ff5b81c61b2"
    },
    {
      "defect": "D30",
      "baseRowSHA256": "91dd1134d7af29985ca15ab7debfe23ef6fa5d73fde32ccc6280791017872ec8",
      "candidateRowSHA256": "5ef34181c5679d8d30500b226c1af76fc0295e4603826075b5ae651b25a37c5a",
      "baseFramesSHA256": "da43d894b2e921c65ced15855c1fe332225b57ff0b4fb3704359cbe2145313df",
      "candidateFramesSHA256": "046baa49ae8ed8924ff6baba7cc498ee881436e2351599d1ee51f5253a94b196"
    },
    {
      "defect": "D31",
      "baseRowSHA256": "7a0233b078ae82cb12530a66b2e8745ae99c6d01a281f5b0ffcec16c198dc0b0",
      "candidateRowSHA256": "55ac932afd1d96655bbefb91cdd48bc9c0dd2a2f911d1da2a229bd02060da891",
      "baseFramesSHA256": "6d735913544486f1e14ee256c1a850e8781a478d0e21b7beba354e1bf7f45553",
      "candidateFramesSHA256": "e4626af5f23db386025fd06594a667eeae6dbb074b2c716b4d6a17491950d682"
    },
    {
      "defect": "D32",
      "baseRowSHA256": "e5189d804ee275b7218ef7487485516080f84c31f94681ee5be5afaf4dd7198c",
      "candidateRowSHA256": "e7c9aa2e33d5446721b21cdd11979173a9217367e8376a439b9a512835f823ae",
      "baseFramesSHA256": "11d41b0a0a5c3d6cddf94414b727cccb84126333db9ebb22ab7554c07568a26a",
      "candidateFramesSHA256": "3f604996d2f26503680e41c22169ee93117d869073880cb33dd86eb4e96c7f3c"
    },
    {
      "defect": "D33",
      "baseRowSHA256": "37933a56022f9c65303027e69c867cdd6488531a10f3c51902f97a4045d1f3e9",
      "candidateRowSHA256": "37933a56022f9c65303027e69c867cdd6488531a10f3c51902f97a4045d1f3e9",
      "baseFramesSHA256": "2edaef8be7004eefa1edaec9ea667b0ec7e71a24ad57d17b7d5f1edc039c2da4",
      "candidateFramesSHA256": "2edaef8be7004eefa1edaec9ea667b0ec7e71a24ad57d17b7d5f1edc039c2da4"
    },
    {
      "defect": "D34",
      "baseRowSHA256": "6e13c47e53ba8c9fcabf94f00b9cabaf61b3e3dfe200c6990e584c383eedf0e0",
      "candidateRowSHA256": "6e13c47e53ba8c9fcabf94f00b9cabaf61b3e3dfe200c6990e584c383eedf0e0",
      "baseFramesSHA256": "ff10693ad8986f4baacac9a4483d9ec070ecd88e529d5d782025fbcb37b92c09",
      "candidateFramesSHA256": "ff10693ad8986f4baacac9a4483d9ec070ecd88e529d5d782025fbcb37b92c09"
    },
    {
      "defect": "D35",
      "baseRowSHA256": "0d48f834799310ae78f81cd5ba3930ad80133c2a37fc2a2a80c6c94ccfb5e809",
      "candidateRowSHA256": "0d48f834799310ae78f81cd5ba3930ad80133c2a37fc2a2a80c6c94ccfb5e809",
      "baseFramesSHA256": "eca1c9ab911fdd745f89dba5ccc0e555f3a68dcae57deb6d75b81d79544b4352",
      "candidateFramesSHA256": "eca1c9ab911fdd745f89dba5ccc0e555f3a68dcae57deb6d75b81d79544b4352"
    },
    {
      "defect": "D36",
      "baseRowSHA256": "570541fb0a61d181013b6f94e734a0b7f89ff5b21c91f16c32e744686c979e79",
      "candidateRowSHA256": "570541fb0a61d181013b6f94e734a0b7f89ff5b21c91f16c32e744686c979e79",
      "baseFramesSHA256": "5ec5c78db4ecf9cba7de4ca437438a23f5c163aaf6091e62b718db687c7516e9",
      "candidateFramesSHA256": "5ec5c78db4ecf9cba7de4ca437438a23f5c163aaf6091e62b718db687c7516e9"
    },
    {
      "defect": "D37",
      "baseRowSHA256": "28140b31e0926a785c99abc237cfbb8c8fe09dcf57d4155c47644087de3eaa40",
      "candidateRowSHA256": "28140b31e0926a785c99abc237cfbb8c8fe09dcf57d4155c47644087de3eaa40",
      "baseFramesSHA256": "4619d64bc6673150b6bdab1048488eeef81cc8774ea932101a5c7f0f115958d3",
      "candidateFramesSHA256": "4619d64bc6673150b6bdab1048488eeef81cc8774ea932101a5c7f0f115958d3"
    },
    {
      "defect": "D38",
      "baseRowSHA256": "f4248f2cb2e6f3dcc2c9acdbfef6b428815ac95e8b4133c9982c6615f239e416",
      "candidateRowSHA256": "f4248f2cb2e6f3dcc2c9acdbfef6b428815ac95e8b4133c9982c6615f239e416",
      "baseFramesSHA256": "01a7582fc349af52c5007f3361d8ab9843bc86cf4b8228d984544a0470f79975",
      "candidateFramesSHA256": "01a7582fc349af52c5007f3361d8ab9843bc86cf4b8228d984544a0470f79975"
    },
    {
      "defect": "D39",
      "baseRowSHA256": "9df9af906659ff15fed97a5146a72a8e7e9cbad158346f6be81e6cc9193c2b81",
      "candidateRowSHA256": "9df9af906659ff15fed97a5146a72a8e7e9cbad158346f6be81e6cc9193c2b81",
      "baseFramesSHA256": "c3fe4a4d7e0cfbd7e766989112a0bfca8236e977a54649dbb25f5b2b272cbddc",
      "candidateFramesSHA256": "c3fe4a4d7e0cfbd7e766989112a0bfca8236e977a54649dbb25f5b2b272cbddc"
    },
    {
      "defect": "D40",
      "baseRowSHA256": "13d10afbc06216cafe34a2ecd5254b3ba567a5c06e8b7a8d3bc309f828ebe109",
      "candidateRowSHA256": "13d10afbc06216cafe34a2ecd5254b3ba567a5c06e8b7a8d3bc309f828ebe109",
      "baseFramesSHA256": "d0434043dec38d4475be9094b6378c43af0fd6c7ac55561bf9756696c203e964",
      "candidateFramesSHA256": "d0434043dec38d4475be9094b6378c43af0fd6c7ac55561bf9756696c203e964"
    },
    {
      "defect": "D41",
      "baseRowSHA256": "edb5da82190e66df2e73fe3fff083b2b9b36aa4e8c2ef5771fab917a2bae7311",
      "candidateRowSHA256": "edb5da82190e66df2e73fe3fff083b2b9b36aa4e8c2ef5771fab917a2bae7311",
      "baseFramesSHA256": "19a27e31173a91cd0ab86c002d4884029a86d8aa8d9598a24e6378bda15a9b2c",
      "candidateFramesSHA256": "19a27e31173a91cd0ab86c002d4884029a86d8aa8d9598a24e6378bda15a9b2c"
    },
    {
      "defect": "D42",
      "baseRowSHA256": "d02a9817694e05b09ba425194012256c0d2d680e64e74ad0fa8c7c18b5dde810",
      "candidateRowSHA256": "d02a9817694e05b09ba425194012256c0d2d680e64e74ad0fa8c7c18b5dde810",
      "baseFramesSHA256": "daaa79838281da1f6f557d8c72f441e4cf2c28cd4f731e5e796ca0aadab6f73e",
      "candidateFramesSHA256": "daaa79838281da1f6f557d8c72f441e4cf2c28cd4f731e5e796ca0aadab6f73e"
    },
    {
      "defect": "D43",
      "baseRowSHA256": "fc496bf13916189d09aef3a644318e2bc25725a7591a689ba7b468bf13370c42",
      "candidateRowSHA256": "fc496bf13916189d09aef3a644318e2bc25725a7591a689ba7b468bf13370c42",
      "baseFramesSHA256": "d0f43058039d4e3b4ffb493d3e6b951530e327d89244bccc338b7e2ea8c19b07",
      "candidateFramesSHA256": "d0f43058039d4e3b4ffb493d3e6b951530e327d89244bccc338b7e2ea8c19b07"
    },
    {
      "defect": "D44",
      "baseRowSHA256": "cfd1137228234652872a72d1d06decb12f275331def0feceabfe55a7c54644cf",
      "candidateRowSHA256": "cfd1137228234652872a72d1d06decb12f275331def0feceabfe55a7c54644cf",
      "baseFramesSHA256": "7760da1a1dbe58136eb35aa24d8e7db0b36e8ca15310932f56140cda9d2d0053",
      "candidateFramesSHA256": "7760da1a1dbe58136eb35aa24d8e7db0b36e8ca15310932f56140cda9d2d0053"
    },
    {
      "defect": "D45",
      "baseRowSHA256": "abb388745b06ca80c7577e12f2733977d28a297537fdf5555be8f7b9f2e4e699",
      "candidateRowSHA256": "f6a4a37440a95eda26d71b6fd323ff83ed45fb8f9a07d39b780927759cc62ce1",
      "baseFramesSHA256": "1b55f16c4948a4eb4a5af1672e33de1f777cc01d8417f56b9eb8fbca540f920d",
      "candidateFramesSHA256": "2f6aa8584d2a9873931d8240e88472214d7bb559d93dc391ca5f96f9a9c2c342"
    }
  ]
};
