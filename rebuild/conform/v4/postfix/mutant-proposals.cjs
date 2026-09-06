'use strict';
// Reviewed fault definitions, not replacement product methods. Preparation
// emits bounded file pre/postimages; faultRun executes disposable real modules.
const fs=require('node:fs'),path=require('node:path');
const {sha,fail}=require('./target.cjs');
const {declarationRanges}=require('./source-proof.cjs');
function buildMutants(root){
  const source=fs.readFileSync(path.join(root,'rebuild/engine/migrate.cjs'),'utf8'),ranges=declarationRanges(source),rows={D33:[],D34:[],D35:[]};
  function add(defect,id,declaration,preimage,postimage,caseId,failures){
    const r=ranges[declaration],at=source.indexOf(preimage);
    if(!r||!preimage||source.split(preimage).length!==2||at<r.start||at+preimage.length>r.end||preimage===postimage)fail('MUTANT-PROPOSAL-SOURCE');
    rows[defect].push({id,file:'migrate.cjs',declaration,preimageHash:sha(source),preimage,postimage,postimageHash:sha(source.replace(preimage,postimage)),expectedFailures:failures.map(f=>caseId+':'+f),caseId,scope:{start:r.start,end:r.end,sha256:sha(r.bytes)}});
  }
  const normal='  const normalId = (id) => typeof id === "string" && id.length > 0;';
  add('D33','counts-only','dataLossGuard',normal,'  return { safe: lost.length === 0, lost };\n'+normal,'IG33-READ-REPLACE',['guard']);
  add('D33','missing-entry-slot','dataLossGuard','for (const [id, entry] of pe.normal) {','for (const [id, entry] of []) {','IG33-ENTRY-LOST',['guard']);
  add('D33','accept-any-correction','dataLossGuard','const covers = correctionCoverage(prior, proposed);','const covers = () => !!(proposed && proposed.corrLog && proposed.corrLog.length);','IG33-UNRELATED-REAL-STRIKE',['guard']);
  // One contiguous correction-validation span, explicitly dropping the receipt
  // AND exact replayed-field checks; the negative receipt case must detect it.
  const from=source.indexOf('            const complete = valid && c.kind === "strike"'),to=source.indexOf('      return (id, kind) => {',from);
  const correction=source.slice(from,to),weakened=correction.replace('&& nextOps9.has(c.op)','&& true').replace('return replay && next && fields.every(k => sameBody(ownValue(replay, k), ownValue(next, k)));','return !!(replay && next);');
  if(from<0||to<from||correction===weakened)fail('MUTANT-PROPOSAL-SOURCE');
  add('D33','ignore-strike-receipt-payload','dataLossGuard',correction,weakened,'IG33-CORRECTION-NO-RECEIPT',['guard']);
  add('D33','deny-all','dataLossGuard','function dataLossGuard(prev, next) {','function dataLossGuard(prev, next) {\n  return { safe: false, lost: ["synthetic fault refuses everything"] };','IG33-UNCHANGED',['guard']);
  add('D34','coarse-fingerprint','isPristineSeed','      && current === authored;','      && true;','IG34-READ-PT',['pristine']);
  add('D34','never-pristine','isPristineSeed','function isPristineSeed(s) {','function isPristineSeed(s) {\n  return false;','IG34-REAL-SEED',['raw','settled','repeat']);
  add('D34','raw-key-order','isPristineSeed','else result = "{" + keys.sort().map(k => JSON.stringify(k) + ":" + visit(own(v, k))).join(",") + "}";','else result = "{" + keys.map(k => JSON.stringify(k) + ":" + visit(own(v, k))).join(",") + "}";','IG34-OBJECT-KEY-ORDER',['pristine']);
  add('D34','whole-state-comparison','isPristineSeed','const projection = (state) => [own(state, "reads"), own(own(state, "sleep"), "nights"), own(state, "dailyLogs"), own(state, "sessionLog")];','const projection = (state) => state;','IG34-EXCLUDED-FAMILIES',['pristine']);
  const start=ranges.migrate.start,end=source.indexOf('  if (old && old.v === SCHEMA_V)',start),prefix=source.slice(start,end),guard='  if (old && old.v > SCHEMA_V) return old;\n';
  if(!prefix.includes(guard))fail('MUTANT-PROPOSAL-SOURCE');
  add('D35','heal-before-return','migrate',prefix,prefix.replace(guard,'')+guard,'IG35-FUTURE-NULL',['descriptors']);
  add('D35','return-all-unchanged','migrate','function migrate(old) {','function migrate(old) {\n  return old;','IG35-SUPPORTED-1',['version','first-alias','repeat-call']);
  return rows;
}
module.exports={buildMutants};
