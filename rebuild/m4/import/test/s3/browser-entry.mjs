// TEST ONLY. The browser uses actual WebCrypto/IndexedDB and invented public inputs.
import {createLocalSourceFixture,appendCompletedWorkout,fixtureEffective} from './fixtures.mjs';
import {commitLocalSource} from '../../../../m3/w6/local/source-commit.mjs';
import {createSourceReplayEngine} from '../../browser-replay.mjs';
let fixture;
const check=(value,name)=>{if(!value)throw Error('S3_BROWSER_ASSERTION '+name);};
async function ready(f,answers={identityConfirmed:true}){
  const h=await f.controller.prepareSource(await f.review(),answers);
  check(h.ready!==false,'qualified core '+JSON.stringify(h.issues||[]));return h;
}
function summary(f,loaded,view){
  const originals=loaded.generation.collections.ops;
  return {revision:loaded.revision,selection:loaded.generation.metadata.localSources.active,
    originals:Object.fromEntries(Object.entries(originals).map(([id,op])=>[id,f.platform.hash(JSON.stringify(op))])),
    counts:{ops:Object.keys(originals).length,reads:view.state.reads.length,workouts:view.workout_facts?.sessions.length||0},
    sourceDigest:view.basis.source_digest,materialDigest:view.basis.material_digest,ready:view.ready,
    pending:view.integration_pending,complete:loaded.generation.metadata.localSourceApplication.s3_complete};
}
globalThis.S3=Object.freeze({
  async first(){
    check(globalThis.isSecureContext&&crypto.subtle&&indexedDB,'real secure browser APIs');
    fixture=await createLocalSourceFixture({indexedDB,crypto,databaseName:'s3-browser-core'});
    await appendCompletedWorkout(fixture);
    const before=await fixture.repository.load(),rawBefore=fixture.platform.hash(JSON.stringify(before.generation.collections.ops));
    let refused=false;try{await fixture.controller.prepareSource(await fixture.review(),{});}catch(e){refused=e.code==='LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED';}
    check(refused,'identity remains required');
    const inactive=await ready(fixture),preview=await fixture.controller.view(inactive);
    check(preview.state.reads.some(r=>r.d==='2026-09-04'&&r.w===173.25),'native reading actually applied');
    check(preview.state.dailyLogs['2026-09-04'].cal===2300&&preview.state.dailyLogs['2026-09-04'].pro===175,'native food actually applied');
    check(preview.workout_facts.sessions.length===1,'actual native workout projected');
    check(['F1','F2','F3','F4','F5','F6'].every(f=>preview.families.some(x=>x.family===f)),'six family witnesses');
    check(fixture.platform.hash(JSON.stringify((await fixture.repository.load()).generation.collections.ops))===rawBefore,'preview retains exact originals');
    const handle=await commitLocalSource(inactive),view=await fixture.controller.view(handle),loaded=await fixture.repository.load();
    check(fixture.platform.hash(JSON.stringify(loaded.generation.collections.ops))===rawBefore,'commit retains exact originals');
    check(loaded.generation.metadata.localSourceApplication.core_complete===true&&loaded.generation.metadata.localSourceApplication.s3_complete===false,'integration remains pending');
    return {cells:8,evidence:summary(fixture,loaded,view)};
  },
  async reopen(expected){
    fixture=await createLocalSourceFixture({indexedDB,crypto,databaseName:'s3-browser-core',reopen:true});
    const handle=await fixture.controller.reopen(fixture.name),view=await fixture.controller.view(handle),loaded=await fixture.repository.load(),actual=summary(fixture,loaded,view);
    check(actual.selection===expected.selection&&actual.sourceDigest===expected.sourceDigest&&actual.materialDigest===expected.materialDigest,'kill reopen same selection/material');
    check(JSON.stringify(actual.originals)===JSON.stringify(expected.originals)&&JSON.stringify(actual.counts)===JSON.stringify(expected.counts),'kill reopen exact once');
    const oldHandle=handle;
    await fixture.append('TEST-ONLY-later-reading',{class:'reading',kind:'fact',payload:{lb:{value:173,unit:'lb'}},effective:fixtureEffective('2026-09-05')},1);
    fixture.setAsOf('2026-09-05');
    let stale=false;try{await fixture.controller.view(oldHandle);}catch(e){stale=e.code==='LOCAL_SOURCE_STALE';}check(stale,'old basis stale after descendant');
    await appendCompletedWorkout(fixture);
    const next=await commitLocalSource(await ready(fixture)),nextView=await fixture.controller.view(next),nextLoaded=await fixture.repository.load(),after=summary(fixture,nextLoaded,nextView);
    check(Object.entries(expected.originals).every(([id,hash])=>after.originals[id]===hash),'descendant never rewrites prior originals');
    check(after.counts.workouts===2&&after.counts.reads===expected.counts.reads+1,'descendants replay exactly once');
    const rollback=await fixture.controller.rollback(expected.selection),rolled=await commitLocalSource(rollback),rolledView=await fixture.controller.view(rolled),rolledLoaded=await fixture.repository.load();
    check(Object.keys(rolledLoaded.generation.metadata.localSources.selections).length>=3,'rollback is append only');
    check(JSON.stringify(summary(fixture,rolledLoaded,rolledView).originals)===JSON.stringify(after.originals),'rollback preserves all descendants');
    return {cells:7,evidence:summary(fixture,rolledLoaded,rolledView)};
  },
  async wrongContext(){
    let refused=false;try{createSourceReplayEngine({engineContext:{verified:true}});}catch(e){refused=e.code==='SOURCE_ENGINE_CONTEXT_UNPROVEN';}
    check(refused,'proof-shaped provider cannot execute');return {cells:1};
  },
  close(){fixture?.close();}
});
