'use strict';
// The profile must REFUSE, not warn. Each case proves one refusal on the real
// artifact bytes and restores them exactly.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const Profile=require('./native-carriers-profile.cjs'),S=require('./native-carriers-source.cjs');
const ART=path.join(root,Profile.ARTIFACT),AUTH=path.join(root,'rebuild/m4/spec/native-carriers-authorizations.json');
const CHANGES=path.join(root,S.CHANGES_FILE),REVIEW=path.join(root,Profile.REVIEW);
// The grandparent the profile resolves the historical-audit baseline through.
const GRANDPARENT=path.join(root,'rebuild/conform/v4/postfix/acceptance-step-efficacy.json');
const PARENT_ART=path.join(root,Profile.PARENT.artifact);
function withEdit(file,mutate,body){
 const original=fs.readFileSync(file);
 try{fs.writeFileSync(file,mutate(original.toString('utf8')));body();}
 finally{fs.writeFileSync(file,original);assert.equal(S.sha(fs.readFileSync(file)),S.sha(original));}
}
const refuses=()=>assert.throws(()=>Profile.verify());

test('the sealed artifact verifies as it stands', () => {
 const context=Profile.verify();
 assert.equal(context.manifest.packageId,Profile.ID);
 assert.equal(context.manifest.sourceBase,S.BASE);
 // F-PM-4: track the review file's actual status instead of hardcoding PENDING.
 // Hardcoding `false` made this child fail the moment an independent receipt was
 // written, so PACKAGE PASS was unreachable. The parent's load-write-profile.test.cjs
 // asserts the same equality against its own review file.
 assert.equal(context.accepted,JSON.parse(fs.readFileSync(REVIEW)).status==='ACCEPTED',
  'accepted reports exactly the review file status');
 assert.equal(context.themePending,false,'The theme ledger line is bound');
});
test('the owner and theme ledger lines are bound by exact text and sha256', () => {
 const a=require(ART);
 assert.equal(a.authorizations.owner.role,'owner');
 assert.equal(a.authorizations.owner.ledgerLine,92);
 assert.equal(a.authorizations.owner.lineSha256,Profile.OWNER_SHA);
 assert(a.authorizations.owner.line.includes('SLICE RATIFICATION'));
 assert.equal(a.authorizations.theme.role,'cowork');
 assert.equal(a.authorizations.theme.ledgerLine,93);
 assert.equal(a.authorizations.theme.lineSha256,Profile.THEME_SHA);
 assert(a.authorizations.theme.line.includes('M2-NATIVE-CARRIERS'));
 assert(a.authorizations.theme.line.endsWith(' · ACCEPTED'));
 assert.throws(()=>Profile.citation({...a.authorizations.theme,line:a.authorizations.theme.line+' x'},{role:'cowork',mustInclude:[]}));
});
test('an altered artifact byte is refused', () => {
 withEdit(ART,text=>text.replace('"version": 1','"version": 2'),refuses);
});
test('an altered product hash is refused', () => {
 withEdit(ART,text=>text.replace(/("rebuild\/engine\/performed\.cjs": ")[a-f0-9]{64}/,'$1'+'0'.repeat(64)),refuses);
});
test('a changed engine byte is refused', () => {
 withEdit(path.join(root,'rebuild/engine/plan.cjs'),text=>text+'\n// drift\n',refuses);
});
test('an altered owner citation is refused', () => {
 withEdit(AUTH,text=>text.replace('"role": "owner"','"role": "cowork"'),refuses);
});
test('an altered literal carrier list is refused', () => {
 withEdit(CHANGES,text=>text.replace('"id"','"ID"'),refuses);
});
// Review F1: the theme document the owner/theme authorization binds is evidence,
// so a ONE-CHARACTER edit to it must refuse — not merely be noticed by a reader.
test('a one-character edit to the theme document is refused', () => {
 const theme=path.join(root,'rebuild/m4/spec/NATIVE-CARRIERS-THEME.md');
 withEdit(theme,text=>{
  const at=text.indexOf('# NATIVE-CARRIERS THEME');
  assert(at>=0,'theme heading');
  return text.slice(0,at+1)+' '+text.slice(at+1);
 },refuses);
});
test('a one-character edit to the build report is refused', () => {
 const report=path.join(root,'rebuild/m4/spec/NATIVE-CARRIERS-BUILD-REPORT.md');
 withEdit(report,text=>text+' ',refuses);
});
// Review F-E1: the two mechanisms shipped in the last deltas — the covered/run
// coverage record (F-PM-2) and the resolved grandparent baseline (F-PM-3) — carry
// their own refusals, so neither can be weakened by editing a manifest or a pin.
const rewrite=fn=>text=>{const value=JSON.parse(text);fn(value);return JSON.stringify(value,null,2)+'\n';};
test('a covered original gate moved to run is refused', () => {
 withEdit(ART,rewrite(m=>{
  const gate=m.coverage.covered[0];
  assert(gate,'a covered gate to move');
  m.coverage.covered=m.coverage.covered.filter(g=>g!==gate);
  m.coverage.run=[...m.coverage.run,gate].sort();
 }),refuses);
});
test('a coverage remap to an unpinned child is refused', () => {
 withEdit(ART,rewrite(m=>{
  const gate=Object.keys(m.coverage.byChild)[0];
  assert(gate,'a covered gate to remap');
  assert(!m.executionPins['rebuild/m4/spec/native-carriers-not-a-pinned-child.cjs'],'the remap target is genuinely unpinned');
  m.coverage.byChild[gate]='not-a-pinned-child';
 }),refuses);
});
test('a flipped byte in the grandparent acceptance is refused', () => {
 withEdit(GRANDPARENT,text=>{
  assert(text.startsWith('{\n  "version": 2,'),'grandparent version preamble');
  return text.replace('"version": 2','"version": 3');
 },refuses);
});
test('a changed grandparent pointer in the parent artifact is refused', () => {
 withEdit(PARENT_ART,rewrite(a=>{
  assert.equal(a.parent.artifact,'rebuild/conform/v4/postfix/acceptance-step-efficacy.json','the parent names the grandparent');
  a.parent.sha256='0'.repeat(64);
 }),refuses);
});
