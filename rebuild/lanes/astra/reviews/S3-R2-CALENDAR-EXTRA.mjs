// Independent reviewer-only public evidence. No source mutation or real-C2 claim.
// Root runs this only after inspecting it, in its verified owned copied tree.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const CANDIDATE = '0df6ad3f3ec8d69a6e10ba68c279b7b77d061596';
const SOURCE = '946c36059a7ce6b949933da3904db3db8e6b8bd3';
const MANIFEST_SHA = '5e5266c253a36304543757a360b74bd0567134dd64da03aae09bf4fe38e6fbee';
assert.equal(process.versions.node, '22.23.2', 'Exact reviewer Node22 tool');
assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York');
assert.ok(process.env.S3_SCRATCH && process.env.S3_RUN_ROOT, 'Explicit owned tree and run required');
assert.equal(process.env.S3_MUTATION, undefined, 'Original candidate only');
const root = path.resolve(process.env.S3_SCRATCH), run = path.resolve(process.env.S3_RUN_ROOT);
const same = (a,b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
assert.ok(same(fs.realpathSync.native(root), root) && same(fs.realpathSync.native(run), run), 'No redirected root');
assert.equal(path.basename(root), 'tree');
assert.ok(same(path.dirname(root), run), 'Tree belongs to the explicitly named run');
const sha = value => createHash('sha256').update(value).digest('hex');
const manifestFile = path.join(root, 'rebuild/m4/spec/s3-portable-sources.json');
assert.ok(same(fs.realpathSync.native(manifestFile), manifestFile));
const manifestBytes = fs.readFileSync(manifestFile);
assert.equal(sha(manifestBytes), MANIFEST_SHA, 'Fixed exact successor manifest');
const manifest = JSON.parse(manifestBytes), pins = new Map(manifest.sources.map(row => [row.path,row.sha256]));
assert.equal(manifest.profile, 'earned/s3-provisional-public-sources/v1');
assert.equal(manifest.implementationParent, '06c5b4a5d76c9973849d0f4cde51b379bc35be43');
assert.equal(manifest.sourceM, '100820aa47a4f8729642033499eaec0f0ee282e1');
assert.equal(manifest.sources.length, 111); assert.equal(pins.size, 111);
function sourcePath(name) {
  assert.ok(pins.has(name), 'Only a fixed listed public source: ' + name);
  const file = path.resolve(root,name), relative = path.relative(root,file);
  assert.ok(relative && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
  assert.ok(same(fs.realpathSync.native(file),file), 'No redirected public source: ' + name);
  return file;
}
function verifySources() {
  assert.equal(sha(fs.readFileSync(manifestFile)), MANIFEST_SHA, 'Manifest remains exact');
  const actual = [];
  for (const [name,expected] of pins) {
    const hash = sha(fs.readFileSync(sourcePath(name)));
    assert.equal(hash,expected,'Exact original public bytes: ' + name);
    actual.push(name + ' ' + hash + '\n');
  }
  return {count:actual.length,sha256:sha(actual.join(''))};
}
const sourceBefore = verifySources(); // All 111 bytes checked BEFORE product imports.
const require = createRequire(pathToFileURL(sourcePath('package.json')));
const Profile = require(sourcePath('rebuild/m4/import/local-source-profile.cjs'));
const Provider = require(sourcePath('rebuild/m4/import/engine-provider.cjs'));

// Same registry/calendar construction as the original independent provider annex,
// with fixed successor custody. This is invented compatibility, never provenance.
function calendar(narrow) {
  const days = narrow ? ['2026-09-03','2026-09-04'] : ['2026-03-07','2026-03-08','2026-03-09','2026-09-03','2026-09-04'];
  return {profile:'earned/native-date-compatibility/v1',compatibility_id:'REVIEW-ONLY-invented-calendar-extra',
    zone:'America/New_York',range:{from:narrow ? '2026-09-01' : '2026-01-01',to:narrow ? '2026-09-30' : '2026-12-31'},
    dates:days.map(day=>{const [y,m,d]=day.split('-').map(Number),noon=new Date(y,m-1,d,12);
      return {day,noonISO:noon.toISOString(),offsetMinutes:noon.getTimezoneOffset()};})};
}
function context(narrow, input) {
  const materialDigest=sha(JSON.stringify(input));
  const engine={sha256:Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'],treeSha256:'b'.repeat(64),schemaV:60,path:'rebuild/engine/oracle-shim.cjs'};
  const gate={clock:'2026-09-03',tz:'America/New_York'};
  const mapping={profile:'earned/source-producer-mapping/v1',id:'REVIEW-ONLY-synthetic-extra-mapping',construction:'oracle-shim-default/v1',
    engine,gate,public_factory_digest:Profile.PUBLIC_FACTORY_DIGEST,source_pins:Profile.SOURCE_PINS,dependencies:{drafts:'default-empty'},
    executions:[{id:'REVIEW-ONLY-no-C2-extra',material_digest:materialDigest,calendar:calendar(narrow)}]};
  return Profile.createProducerRegistry([mapping],{hash:sha}).qualify({context:{engine,oracle:{gate}},materialDigest});
}
const SESSION_DAY='2026-03-07';
function inputs() {
  const base={v:60,reads:[],weekly:[],sleep:{nights:[]},dailyLogs:{},sessionLog:{},exercises:[],feed:[],suggestionLog:[],adjustments:[],queue:[]};
  const corrected=structuredClone(base),earlier=structuredClone(base),later=structuredClone(base);
  corrected.sessionLog[SESSION_DAY]={entries:[{id:'REVIEW-ONLY-lift',reps:[8]}],corr:{at:'2026-03-08T01:30:00',rev:1},note:'REVIEW-ONLY-corrected'};
  // Absolute UTC instants are authored fixture inputs. No calendar algorithm or
  // engine reference is copied: the production merge owns every choice below.
  earlier.sessionLog[SESSION_DAY]={entries:[{id:'REVIEW-ONLY-lift',reps:[9]}],at:Date.parse('2026-03-08T06:15:00Z'),note:'REVIEW-ONLY-earlier'};
  later.sessionLog[SESSION_DAY]={entries:[{id:'REVIEW-ONLY-lift',reps:[10]}],at:Date.parse('2026-03-08T06:45:00Z'),note:'REVIEW-ONLY-later'};
  return {corrected,earlier,later};
}
function identity(value){return sha(JSON.stringify(value));}
function selected(value) {
  const session=value?.sessionLog?.[SESSION_DAY];
  return {state_sha256:identity(value),session_count:Object.keys(value?.sessionLog||{}).length,
    note:session?.note ?? null,reps:session?.entries?.[0]?.reps ?? null,has_corr:!!session?.corr};
}
function observation(fn) {
  try {const value=fn();return {returned:true,value};}
  catch(error){return {returned:false,code:error.code||error.name};}
}
function finish(t, label, inputBefore, input, detail) {
  const inputAfter=identity(input),sourceAfter=verifySources();
  assert.equal(inputAfter,inputBefore,'Exact invented originals remain unchanged');
  assert.deepEqual(sourceAfter,sourceBefore,'All 111 public sources remain unchanged');
  t.diagnostic(JSON.stringify({label,candidate:CANDIDATE,source:SOURCE,manifest_sha256:MANIFEST_SHA,
    sources_before:sourceBefore,sources_after:sourceAfter,input_before_sha256:inputBefore,input_after_sha256:inputAfter,...detail}));
}

test('REVIEW-R2-CALENDAR-MERGE-COVERED: real native timestamp comparison selects both temporal branches with covering evidence', t=>{
  const input=inputs(),inputBefore=identity(input),engine=Provider.createSourceReplayEngine({engineContext:context(false,input)});
  const before=engine.mergeState(input.corrected,input.earlier),after=engine.mergeState(input.corrected,input.later);
  finish(t,'covered',inputBefore,input,{before:selected(before),after:selected(after)});
  assert.equal(before.sessionLog[SESSION_DAY].note,'REVIEW-ONLY-corrected','Earlier plain record loses to the actual correction instant');
  assert.deepEqual(before.sessionLog[SESSION_DAY].entries[0].reps,[8]);
  assert.equal(after.sessionLog[SESSION_DAY].note,'REVIEW-ONLY-later','Later plain record wins through the actual native Date.parse comparison');
  assert.deepEqual(after.sessionLog[SESSION_DAY].entries[0].reps,[10]);
});

test('REVIEW-R2-CALENDAR-MERGE-OUTSIDE: uncovered reached correction timestamp refuses and poisons the provider', t=>{
  const input=inputs(),inputBefore=identity(input),engine=Provider.createSourceReplayEngine({engineContext:context(true,input)});
  const result=observation(()=>engine.mergeState(input.corrected,input.later));
  const sticky=observation(()=>engine.dataLossGuard(null,null));
  finish(t,'outside',inputBefore,input,{merge:result.returned?{returned:true,...selected(result.value)}:result,
    next_guard:sticky.returned?{returned:true,safe:sticky.value?.safe}:sticky});
  assert.equal(result.returned,false,'September-only compatibility cannot qualify a March native timestamp comparison');
  assert.equal(result.code,'SOURCE_ENGINE_CONTEXT_UNPROVEN','Refusal belongs to the reached calendar boundary');
  assert.equal(sticky.returned,false,'A later otherwise-safe facade call must retain the first calendar refusal');
  assert.equal(sticky.code,'SOURCE_ENGINE_CONTEXT_UNPROVEN');
});
