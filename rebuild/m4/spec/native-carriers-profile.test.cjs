'use strict';
// The profile must REFUSE, not warn. Each case proves one refusal on the real
// artifact bytes and restores them exactly.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const Profile=require('./native-carriers-profile.cjs'),S=require('./native-carriers-source.cjs');
const ART=path.join(root,Profile.ARTIFACT),AUTH=path.join(root,'rebuild/m4/spec/native-carriers-authorizations.json');
const CHANGES=path.join(root,S.CHANGES_FILE);
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
 assert.equal(context.accepted,false,'No receipt is claimed');
 assert.equal(context.themePending,true,'THEME_PENDING stands until the PM binds the line');
});
test('a THEME_PENDING profile can never be ACCEPTED', () => {
 const a=require(ART);
 assert.equal(a.authorizations.theme.pending,'THEME_PENDING');
 assert.throws(()=>Profile.checkAuthorizations(a.authorizations,Profile.parent()),/THEME-AUTHORIZATION-UNAVAILABLE/);
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
