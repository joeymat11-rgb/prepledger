'use strict';
// LEGACY DIFFERENTIAL. The accepted L construction's own ACCEPTED preimage is
// recovered and composed beside the adopted candidate, and both are driven over
// LEGACY-ONLY inputs (no registered native view). The candidate's published
// expectation is that legacy-only cards and plans are byte-identical; this child
// is that claim's negative control, and it is the differential the frozen census
// cannot see (the census reads the seeded index composition, this reads the
// static prescription runtime's two exposed readers).
const path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
const S=require('./native-carriers-source.cjs'),R=require('./native-carriers-reference.cjs');
const X=require('./native-next-target-candidate/fixture.cjs');
const DAY=X.DAY,F=X.F;
const json=value=>JSON.stringify(value);
function pulses(spec){const out=[];for(let i=0;i<14;i++)out.push({d:F.dayOffset(DAY,i-13),bpm:60});for(const [o,b]of Object.entries(spec))out[13+Number(o)].bpm=b;return out;}
const BRANCHES={none:{},red:{0:71},amber:{0:68}};
function states(){
 const out=[];
 for(const [name,spec]of Object.entries(BRANCHES)){
  const s=F.createSyntheticState(DAY);s.pulse=pulses(spec);
  assert(!s.workoutFacts,'Legacy-only input carries no registered native view');
  out.push([name,s]);
 }
 return out;
}
// `--behaviour` skips the byte guard so this child can serve as a purely
// behavioural mutant detector; the accepted preimage is then supplied by the
// caller (the mutant runner recovers it once, before any mutation).
function main({behaviourOnly=false,accepted:supplied=null}={}){
 if(!behaviourOnly)S.verify(root);
 const candidate=X.candidateSources();
 const accepted={...candidate,...(supplied||R.recoverAccepted())};
 const clock=X.clockFor(DAY);
 const older=X.composeFrom(accepted,{clock,nativeTrendContext:X.assumed});
 const newer=X.composeFrom(candidate,{clock,nativeTrendContext:X.assumed});
 let compared=0,differing=0;
 for(const [name,s]of states()){
  const a=older.genSession(structuredClone(s),DAY,{}),b=newer.genSession(structuredClone(s),DAY,{});
  compared++;if(json(a)!==json(b)){differing++;console.error('LEGACY DIFFERENTIAL: genSession differs on branch '+name);}
  assert.equal(a.ex.length,b.ex.length,'Same card count on '+name);
  for(const card of a.ex){
   const ex=structuredClone(s).exercises.find(e=>e.id===card.id);
   if(!ex)continue;
   const pa=older.rirPlan(structuredClone(s),{...ex,holdFlag:false},{}),pb=newer.rirPlan(structuredClone(s),{...ex,holdFlag:false},{});
   compared++;if(json(pa)!==json(pb)){differing++;console.error('LEGACY DIFFERENTIAL: rirPlan differs on '+name+'/'+card.id);}
  }
 }
 assert.equal(differing,0,'Legacy-only outputs identical across the adoption');
 assert(compared>=9,'Enough legacy comparisons');
 console.log('NATIVE CARRIERS LEGACY DIFFERENTIAL: '+compared+'/'+compared+' legacy-only comparisons identical across '+Object.keys(BRANCHES).length+' alarm branches; 6/6 ACCEPTED preimages recovered and pin-verified');
}
function acceptedFromPacket(){
 const dir=process.env.EARNED_NATIVE_PACKET_ROOT;
 assert(dir,'Behaviour mode needs the materialised accepted preimage');
 const Delta=require('./native-next-target-candidate/source-delta.cjs'),fs2=require('node:fs');
 const out={};
 for(const file of Delta.OWNED){
  const text=fs2.readFileSync(path.join(dir,'inputs/accepted-generated',file),'utf8');
  assert.equal(S.sha(text),Delta.ACCEPTED[file],'Accepted preimage pin '+file);
  out[file]=text;
 }
 return out;
}
if(require.main===module){try{const b=process.argv.includes('--behaviour');main({behaviourOnly:b,accepted:b?acceptedFromPacket():null});}catch(error){const failed=require('./native-carriers-errors.cjs').failure(error);console.error(failed.line);process.exitCode=failed.exit;}}
module.exports={main,states};
