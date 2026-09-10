'use strict';
/* Small EXECUTED witness correcting reviewer finding F1: does the existing scoped bridge
   assert its captured D1 revision on a READ-ONLY call (receipts)?
   Public tracked code only (rebuild/m3/w5/bridge.cjs); synthetic in-memory D1 stub; no
   product/source change. Usage: node bridge-revision-witness.cjs <checkout> */
const path=require('node:path');
const CO=path.resolve(process.argv[2]);
const {createBridge}=require(path.join(CO,'rebuild/m3/w5/bridge.cjs'));
const out=[];const rec=(id,c,pass,d)=>out.push({id,c,pass,d});

// Minimal D1 stub honouring exactly the two statement shapes the bridge issues.
function makeDb({bumpBetweenReadAndCommit=false}={}){
  const st={revision:5,commits:0,reads:0,assertionsSeen:0,staleThrown:0};
  const rows=[{athlete:'ath-1',collection:'metadata',row_id:'state',
    value:JSON.stringify({devices:{'dev-A':{lease:{lease_id:'L1'}}},initialPlan:{}})}];
  const subjects=[{subject:'sub-1',athlete:'ath-1'}];
  const prepare=sql=>({sql,args:[],bind(...a){return {sql,args:a};}});
  return {st,db:{prepare,async batch(stmts){
    const first=stmts[0]&&(stmts[0].sql||'');
    if(first.includes('SELECT revision')){                    // the staged read
      st.reads++;
      const snap=st.revision;
      if(bumpBetweenReadAndCommit && st.reads===1) st.revision++;   // concurrent writer
      return [{results:[{revision:snap}]},{results:rows},{results:subjects}];
    }
    // the commit batch: statement 0 is the CASE WHEN revision = ? assertion
    const guard=stmts[0];
    if(!/authority_revision SET revision = CASE WHEN revision = \?/.test(guard.sql))
      throw new Error('no revision assertion present in commit batch');
    st.assertionsSeen++;
    const captured=guard.args[0];
    if(captured!==st.revision){ st.staleThrown++; const e=new Error('stale_revision'); throw e; }
    st.revision++; st.commits++; return [];
  }}};
}
const core={createAuthority:()=>({receipts:()=>[{seq:1,op:{op_id:'op-1',athlete_id:'ath-1'}}]})};
const cfg=db=>({db,authorityKey:{kid:'k'},identityKeys:{},clock:{now:()=>'2026-09-08T00:00:00Z'},core,maxAttempts:3});

(async()=>{
// W1 — a READ-ONLY scoped call still issues the captured-revision assertion.
{const {st,db}=makeDb();const b=createBridge(cfg(db));
 const r=await b.invokeScoped('sub-1','dev-A','receipts',['ath-1',0]);
 rec('W1','read-only scoped receipts call issues the captured-revision assertion and commits',
   st.assertionsSeen===1&&st.commits===1&&Array.isArray(r),
   `assertionsSeen=${st.assertionsSeen} commits=${st.commits} staleThrown=${st.staleThrown} result=${JSON.stringify(r).slice(0,50)}`);}

// W2 — a concurrent revision bump between the staged read and the commit makes the READ stale
//      and forces a retry; the first attempt does not publish.
{const {st,db}=makeDb({bumpBetweenReadAndCommit:true});const b=createBridge(cfg(db));
 const r=await b.invokeScoped('sub-1','dev-A','receipts',['ath-1',0]);
 rec('W2','concurrent bump between read and commit makes a READ stale and retried',
   st.staleThrown>=1&&st.reads>=2&&st.commits===1,
   `reads=${st.reads} staleThrown=${st.staleThrown} commits=${st.commits}`);}

// W3 — the scoped call reauthorizes the ARGUMENT athlete against the staged snapshot.
{const {st,db}=makeDb();const b=createBridge(cfg(db));
 let code=null; try{ await b.invokeScoped('sub-1','dev-A','receipts',['ath-OTHER',0]); }catch(e){ code=e.code||e.message; }
 rec('W3','mismatched argument athlete is denied at the staged snapshot',
   code==='SCOPE_FORBIDDEN'&&st.commits===0,`code=${code} commits=${st.commits}`);}

// W4 — an unknown subject is denied before any method runs.
{const {st,db}=makeDb();const b=createBridge(cfg(db));
 let code=null; try{ await b.invokeScoped('sub-UNKNOWN','dev-A','receipts',['ath-1',0]); }catch(e){ code=e.code||e.message; }
 rec('W4','unknown subject binding is denied',code==='SCOPE_FORBIDDEN'&&st.commits===0,`code=${code} commits=${st.commits}`);}

for(const r of out)console.log((r.pass?'CONFIRMED     ':'NOT-CONFIRMED ')+r.id.padEnd(3)+' '+r.c+'\n              :: '+r.d);
const bad=out.filter(r=>!r.pass).length;
console.log('\nBRIDGE WITNESS: '+out.length+' claims; '+(out.length-bad)+' confirmed; '+bad+' not confirmed');
process.exitCode=bad?1:0;
})();
