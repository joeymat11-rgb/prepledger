'use strict';
// BRIEF-SET-ONE-ERA §2/§4: a separately named, runtime-only seeded set1 card
// invariant. No protected card/value/derived hash is returned, saved or logged.
const H=require('./set-one-era-source-projection.cjs');
const path=require('node:path'),T=require('../target.cjs');
const DAYS=Object.freeze(['2026-09-03','2026-09-07']),MODES=Object.freeze(['frozen','native']);
function sameCard(a,b){
  if(!Array.isArray(a)||!Array.isArray(b))return false;
  const x=a.filter(c=>c&&c.id==='set1'),y=b.filter(c=>c&&c.id==='set1');
  return x.length===1&&y.length===1&&JSON.stringify(x[0])===JSON.stringify(y[0]);
}
function prepareSeededSetOneCard({root}){
  const source=H.createFrozenSource({root}),native=globalThis.Date,savedTZ=process.env.TZ;
  const savedConsole=Object.getOwnPropertyDescriptors(console),rows=[],expected=[];
  let consumed=false,disposed=false;
  function clockFor(day){const p=day.split('-').map(Number),ms=new native(p[0],p[1]-1,p[2],12).getTime();return{nowMs:()=>ms,today:()=>day,nowISO:()=>new native(ms).toISOString(),hour:()=>12,dow:()=>new native(ms).getDay(),tz:'America/New_York'};}
  function selectDate(mode,clock){globalThis.Date=mode==='frozen'?class extends native{constructor(...a){super(...(a.length?a:[clock.nowMs()]));}static now(){return clock.nowMs();}}:native;}
  function quiet(){for(const name of ['log','info','warn','error','debug','dir','table','trace'])Object.defineProperty(console,name,{configurable:true,writable:true,value:()=>{}});}
  function restore(){globalThis.Date=native;if(savedTZ===undefined)delete process.env.TZ;else process.env.TZ=savedTZ;for(const [name,descriptor]of Object.entries(savedConsole))Object.defineProperty(console,name,descriptor);}
  process.env.TZ='America/New_York';
  try{
    // Even unexpected logging from a protected computation is suppressed. Only
    // the closed verdict records below may leave this function.
    quiet();
    for(const mode of MODES)for(const day of DAYS){
      const clock=clockFor(day);selectDate(mode,clock);
      let unchanged=false;
      try{
        const a=H.createFrozenEngine({source,clock}),b=H.createFrozenEngine({source,project:true,clock});
        // Both calls receive independent clones of exactly the same frozen seed;
        // its authored history and the frozen module globals stay in custody.
        const seed=structuredClone(a.SEED),left=structuredClone(seed),right=structuredClone(seed);
        const before=JSON.stringify(seed),history=JSON.stringify(a.HISTORY),rollups=JSON.stringify(a.ROLLUPS),x=a.labAnalytics2(left),y=b.labAnalytics2(right);
        unchanged=JSON.stringify(left)===before&&JSON.stringify(right)===before&&sameCard(x,y)&&JSON.stringify(b.HISTORY)===history&&JSON.stringify(b.ROLLUPS)===rollups;
        if(unchanged)expected.push({mode,day,seed,before,history,rollups,card:structuredClone(y.find(c=>c&&c.id==='set1'))});
      }catch{unchanged=false;}
      rows.push(Object.freeze({mode,day,verdict:unchanged?'UNCHANGED':'RED'}));
    }
  }finally{restore();}
  const sourceVerdict=Object.freeze({name:'D30-SEEDED-SET-ONE-CARD-SOURCE',status:rows.every(r=>r.verdict==='UNCHANGED')?'PASS':'RED',rows:Object.freeze(rows)});
  function dispose(){expected.length=0;disposed=true;}
  function compareCandidate({candidate,inventory}){
    if(disposed||consumed)throw Object.assign(Error('ERA-SEEDED-CUSTODY-CONSUMED'),{code:'ERA-SEEDED-CUSTODY-CONSUMED'});
    consumed=true;const actual=[];let factory;
    process.env.TZ='America/New_York';quiet();
    try{
      // Every source cell above is complete before any candidate load. Inventory
      // checks are real target checks; the outer carrier separately proves the
      // exact accepted source edit/parent lineage on the actual product.
      if(sourceVerdict.status==='PASS'&&path.isAbsolute(candidate))factory=T.loadCandidate(candidate,inventory);
      for(const row of rows){
        const e=expected.find(x=>x.mode===row.mode&&x.day===row.day);let unchanged=false;
        try{if(factory&&e){const clock=clockFor(row.day);selectDate(row.mode,clock);const c=factory({clock,ids:{fresh(){throw Error('ERA-SEEDED-ID');}}}).__test,input=structuredClone(e.seed);
          if(JSON.stringify(c.HISTORY)===e.history&&JSON.stringify(c.ROLLUPS)===e.rollups){const output=c.labAnalytics2(input);unchanged=JSON.stringify(input)===e.before&&sameCard([e.card],output)&&JSON.stringify(c.HISTORY)===e.history&&JSON.stringify(c.ROLLUPS)===e.rollups;}
        }}catch{unchanged=false;}
        actual.push(Object.freeze({mode:row.mode,day:row.day,verdict:unchanged?'UNCHANGED':'RED'}));
      }
    }catch{for(const row of rows)actual.push(Object.freeze({mode:row.mode,day:row.day,verdict:'RED'}));}
    finally{restore();dispose();}
    return Object.freeze({name:'D30-SEEDED-SET-ONE-CARD-CANDIDATE',status:actual.length===rows.length&&actual.every(r=>r.verdict==='UNCHANGED')?'PASS':'RED',rows:Object.freeze(actual)});
  }
  return Object.freeze({sourceVerdict,compareCandidate,dispose});
}
function verifySeededSetOneCard({root,candidate,inventory}){const p=prepareSeededSetOneCard({root});try{return{source:p.sourceVerdict,candidate:p.compareCandidate({candidate,inventory})};}finally{p.dispose();}}
module.exports={DAYS,MODES,sameCard,prepareSeededSetOneCard,verifySeededSetOneCard};
if(require.main===module){try{if(process.argv.length!==3||process.argv[2]!=='--source-only')throw Error('ERA-SEEDED-USAGE');const p=prepareSeededSetOneCard({root:process.cwd()}),r=p.sourceVerdict;for(const row of r.rows)process.stdout.write(r.name+' '+row.mode+' '+row.day+' '+row.verdict+'\n');p.dispose();if(r.status!=='PASS')process.exitCode=1;}catch{process.stdout.write('D30-SEEDED-SET-ONE-CARD RED\n');process.exitCode=1;}}
