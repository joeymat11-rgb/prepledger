import { runExtensionDom, runExtensionDurable } from './panel-extension.mjs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const w6 = resolve(here, '..'), source = resolve(w6, '../../..');
const require = createRequire(join(w6, 'package.json'));
const { chromium } = require('playwright-core');
const binary = process.env.W6_BROWSER_BIN;
if (!binary || !existsSync(binary)) { console.log('PANEL BROWSER BLOCKED: W6_BROWSER_BIN required'); process.exit(2); }
const { buildBrowser } = await import(pathToFileURL(join(w6, 'build-browser.mjs')));
const { O, initial, config } = await import(pathToFileURL(join(here, 'support.mjs')));
const Sign = require('../w5/crypto.cjs');
const artifacts = join(w6, '.tmp/panel'); mkdirSync(artifacts, { recursive: true });
const built = await buildBrowser({ outfile: join(artifacts, 'retained-w6.js'), entryPoints: [join(w6, 'browser-entry.mjs')] });
// Keys are generated for this isolated run only. No static signing key or secret is written.
const signing = Sign.generateSigningKey('panel-synthetic'), key = Sign.publicKeyOf(signing);
const lease = Sign.signLease({ ...O.lease('dev-A'), schema_version: 2 }, signing);
const server = createServer((req, res) => {
  const file = { '/retained-w6.js': built.outfile }[req.url];
  if (file) { res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' }); res.end(readFileSync(file)); }
  else if (req.url === '/') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic panel proof</title><main id="root"></main></html>'); }
  else { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
let context;
try {
  // Nonpersistent browser context: no signing/encryption key profile written to disk.
  const browser = await chromium.launch({ executablePath: binary, headless: true });
  context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = []; page.on('pageerror', () => errors.push('pageerror'));
  await page.goto(origin);
  const dom = await page.evaluate(async () => {
    const { mountWorkoutCommandPanel: mount } = await import('/retained-w6.js');
    const root = document.querySelector('#root');
    const selection = { planned_split_slot_id: 'AD_HOC', plan_basis: 'NO_ACCEPTED_PLAN', lift_lineage_id: 'lift-A', logical_set_slot: 'slot-A', label: '<img src=x onerror="window.injected=true">' };
    const checks = [];
    const ok = (value, name) => { if (!value) throw Error('DOM check failed: ' + name); checks.push(name); };
    const settle = () => new Promise(r => setTimeout(r, 0));
    const status = () => root.querySelector('[role=status]').textContent;
    const forms = () => root.querySelectorAll('form');
    const send = index => forms()[index].dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const value = (name, text) => { root.querySelector(`[name=${name}]`).value = text; };
    const calls = [];
    let resolve;
    const client = { execute(...args) { calls.push(args); return new Promise(r => { resolve = r; }); } };
    for (const field of Object.keys(selection)) {
      const missing = { ...selection }; delete missing[field]; mount(root, { client, selection: missing }); send(0);
      ok(calls.length === 0 && root.querySelector('button').disabled, 'missing ' + field + ' refuses');
    }
    let handle = mount(root, { client, selection });
    ok(root.querySelector('img') === null && root.querySelector('h2').textContent === selection.label, 'untrusted label is text');
    ok(getComputedStyle(root.querySelector('input')).fontSize === '16px', '16px inputs');
    ok([...root.querySelectorAll('input,select')].every(x => x.closest('label')), 'explicit input labels');
    ok(root.querySelector('[role=status]').getAttribute('aria-live') === 'polite', 'accessible status');
    send(1); ok(calls.length === 0, 'cannot set before start');
    send(0); send(0);
    ok(calls.length === 1 && status() === 'Saving…', 'start pending and duplicate suppressed');
    ok(JSON.stringify(calls[0]) === JSON.stringify(['workout', { action: 'start', input: { planned_split_slot_id: 'AD_HOC', plan_basis: 'NO_ACCEPTED_PLAN' } }]), 'exact start API');
    selection.logical_set_slot = 'host-mutated';
    resolve({ acknowledged: true, op_id: 'actual-returned-start' }); await settle();
    ok(status().startsWith('Saved') && document.activeElement.name === 'load', 'delayed start acknowledged and focused');
    for (const [load, reps] of [['',''],['0','8'],['-1','8'],['no','8'],['1e309','8'],['40',''],['40','1.5'],['40','-0'],['40','-1'],['40','9007199254740992'],['40','3+']]) {
      value('load', load); value('reps', reps); send(1);
      ok(calls.length === 1 && root.querySelector('[name=load]').value === load && root.querySelector('[name=reps]').value === reps, `invalid ${load || 'blank'}/${reps || 'blank'} preserved`);
    }
    value('load','40.5'); value('reps','0'); value('reserve','3+'); send(1); send(1);
    ok(calls.length === 2 && status() === 'Saving…', 'set pending and duplicate suppressed');
    const input = calls[1][1].input;
    ok(input.session_start_op_id === 'actual-returned-start' && input.logical_set_slot === 'slot-A', 'returned start and snapshotted host slot');
    ok(input.load.value === 40.5 && input.reps.value === 0 && input.reserve.tag === 'at_least' && input.reserve.value === 3, 'decimal pounds explicit zero and 3+ exact mapping');
    resolve({ acknowledged: true, op_id: 'set-result' }); await settle(); send(1);
    ok(calls.length === 2 && status().startsWith('Saved — set logged'), 'one set complete without repeat or sync claim');
    for (const state of [3,17,18,20]) {
      let requests = 0;
      mount(root, { selection, client: { async execute(_command, {action}) { requests++; return action === 'start' ? { acknowledged:true, op_id:'s' } : { acknowledged:false, state, reason:'unsafe-details', code:'technical-id' }; } } });
      send(0); await settle(); value('load','35.5'); value('reps','8'); value('reserve','2'); send(1); await settle();
      ok(!status().includes('Saved') && !root.textContent.includes('unsafe-details') && !root.textContent.includes('technical-id') && root.querySelector('[name=load]').value === '35.5' && root.querySelector('[name=reserve]').value === '2', 'safe refusal ' + state + ' retains input');
      send(1); await settle(); ok(requests === (state === 3 ? 3 : 2), 'refusal ' + state + ' retry policy');
    }
    for (const outcome of ['throw','committed','missing','bad-start']) {
      let requests = 0;
      mount(root, { selection, client: { async execute() { requests++; if(outcome === 'throw') throw Error('unsafe-exception'); if(outcome === 'committed') return {acknowledged:false,committed:true,state:18}; if(outcome === 'bad-start') return {acknowledged:true}; } } });
      send(0); await settle(); send(0); await settle();
      ok(requests === 1 && !status().startsWith('Saved') && !root.textContent.includes('unsafe-exception'), 'uncertain ' + outcome + ' cannot be retried blindly');
    }
    // Coordinator 21:43Z: exact W6 completedOutcome shape, for both commands and
    // both possible late context states. These are controller outcomes, not a
    // simulated durable proof or an assertion that the operation was unwritten.
    for (const action of ['start','set']) for (const state of [17,18]) {
      let requests=0;
      mount(root,{selection,client:{async execute(_command,args){
        requests++;
        if(args.action !== action)return {acknowledged:true,op_id:'returned-start'};
        return {stored:true,durable:true,confirmed:false,acknowledged:false,committed:true,committedRevision:'retained-revision',state,code:'INTERNAL_CONTEXT',reason:'unsafe-context-detail'};
      }}});
      if(action==='set'){send(0);await settle();}
      value('load','45.5');value('reps','0');value('reserve','3+');send(action==='start'?0:1);await settle();
      send(0);send(1);await settle();
      ok(requests===(action==='start'?1:2) && status()==='Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.' &&
        root.querySelector('[name=load]').value==='45.5' && root.querySelector('[name=reps]').value==='0' && root.querySelector('[name=reserve]').value==='3+' &&
        [...root.querySelectorAll('button')].every(x=>x.disabled) && !root.textContent.includes('retained-revision') && !root.textContent.includes('unsafe-context-detail'),
        `exact late-context ${action}/${state}: retained input, recovery, no noncommit claim or retry`);
    }
    for(const outcome of ['throw','unknown']) {
      let requests=0;
      mount(root,{selection,client:{async execute(_command,args){requests++;if(args.action==='start')return {acknowledged:true,op_id:'returned-start'};
        if(outcome==='throw')throw Error('unsafe-set-error');return undefined;
      }}});
      send(0);await settle();value('load','35.5');value('reps','8');send(1);await settle();send(1);await settle();
      ok(requests===2 && status()==='Save not confirmed. Your entries remain here. Return to the host for recovery before retrying.' &&
        root.querySelector('[name=load]').value==='35.5' && root.querySelector('[name=reps]').value==='8' && root.querySelector('form:last-of-type button').disabled,
        `set ${outcome}: retained input, no proven noncommit claim or blind retry`);
    }
    {
      const requests=[];
      const slotClient={async execute(command,args){requests.push({command,...args});return {acknowledged:true,op_id:'ack-'+requests.length};}};
      mount(root,{selection:{...selection,logical_set_slot:'completed-slot'},client:slotClient});
      send(0);await settle();value('load','40');value('reps','8');send(1);await settle();
      value('reps','9');send(1);send(0);await settle();
      ok(requests.length===2 && root.querySelector('form:last-of-type button').disabled && requests[1].input.logical_set_slot==='completed-slot',
        'acknowledged Set exhausts this slot despite later edit and resubmit');
      mount(root,{selection:{...selection,logical_set_slot:'new-explicit-slot'},client:slotClient});send(1);await settle();
      const noImplicitSet=requests.length===2;send(0);await settle();value('load','35');value('reps','9');send(1);await settle();
      ok(noImplicitSet && requests.length===4 && requests[3].input.logical_set_slot==='new-explicit-slot' && requests[3].input.session_start_op_id==='ack-3',
        'new explicit host selection and mount has a separate Start then Set');
    }
    for (const effort of ['', '0','1','2','3+','unknown','skipped']) {
      let request;
      mount(root, {selection,client:{ async execute(_command, args) {request=args;return {acknowledged:true,op_id:'s'};} }});
      send(0);await settle();value('load','40');value('reps','8');value('reserve',effort);send(1);await settle();
      const r=request.input.reserve;
      ok(effort === '' ? !Object.hasOwn(request.input,'reserve') : effort === '3+' ? r.tag === 'at_least' && r.value === 3 : ['unknown','skipped'].includes(effort) ? JSON.stringify(r) === JSON.stringify({tag:effort}) : r.tag === 'exact' && r.value === Number(effort), 'reserve ' + (effort || 'absent'));
    }
    handle = mount(root,{client,selection}); send(0);
    const old = root.querySelector('section'), oldForm = forms()[0], previousCalls = calls.length;
    handle.dispose(); mount(root,{client,selection}); const newText=root.textContent;
    resolve({acknowledged:true,op_id:'late'}); await settle(); oldForm.dispatchEvent(new Event('submit',{cancelable:true}));
    ok(!old.isConnected && root.textContent === newText && old.querySelector('[role=status]').textContent === 'Saving…' && calls.length === previousCalls, 'dispose detaches listener and prevents late painting');
    mount(root,{client,selection});send(0);mount(root,{client,selection});const fresh=root.textContent;resolve({acknowledged:true,op_id:'late'});await settle();
    ok(root.querySelectorAll('section').length === 1 && root.textContent === fresh,'remount retires old pending panel');
    return checks;
  });
  console.log(`PANEL DOM PASS — ${dom.length} focused checks (controlled outcomes; not durable evidence)`);
  const extensionDom=await runExtensionDom(page);
  console.log(`PANEL EXTENSION DOM PASS — ${extensionDom.length} focused checks`);
  const cfg = config(); delete cfg.clock; delete cfg.authorityKey; cfg.identityKey = randomBytes(32).toString('hex');
  await page.evaluate(async ({ seed, cfg, key, lease }) => {
    const W = await import('/retained-w6.js'), { mountWorkoutCommandPanel } = await import('/retained-w6.js');
    const cryptoKey = await crypto.subtle.generateKey({ name:'AES-GCM', length:256 }, false, ['encrypt','decrypt']);
    const setup = { databaseName:'panel-synthetic', namespace:'synthetic/A', keyProvider:()=>cryptoKey, authorizeEnrollment:()=>true };
    const repo = await W.openRepository(setup); seed.metadata.authorityLease=lease; seed.collections.drafts={active:{unknown:'preserve'}};
    await repo.initialize(seed,'synthetic-only');
    const stage=W.Stage.createT2Stage(()=>({...cfg,clock:{now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'+00:00',monotonicMs:()=>0}}),{allowInbound:true});
    const args={repository:repo,stage,namespace:setup.namespace,athleteId:'ath-1',deviceId:'dev-A',schemaVersion:2,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
      observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[key]}; // Synthetic guard; no K1/CLOCK/capture qualification.
    const client=W.createDurablePublicClient(args);
    window.proof={repo,setup,W,args,client,mount:mountWorkoutCommandPanel};
    window.panel=mountWorkoutCommandPanel(document.querySelector('#root'),{client,selection:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',lift_lineage_id:'lift-A',logical_set_slot:'slot-A',label:'Synthetic press'}});
  }, {seed:initial(),cfg,key,lease});
  await page.getByRole('button',{name:'Start',exact:true}).focus(); await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — start'));
  await page.getByLabel('Weight (lb)',{exact:true}).fill('40.5'); await page.getByLabel('Completed repetitions').fill('8'); await page.getByLabel('Clean reps left (optional)').selectOption('3+');
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    window.gate = { entered:false, release:false };
    IDBDatabase.prototype.transaction = function(...args) {
      const tx=original.apply(this,args);
      if(args[1]==='readwrite' && tx.objectStoreNames.contains('generations')) {
        const store=tx.objectStore('generations'), put=store.put.bind(store);
        store.put=function(value,key){if(key==='active')gate.entered=true;return put(value,key);};
        const objectStore=tx.objectStore.bind(tx);tx.objectStore=name=>name==='generations'?store:objectStore(name);
        const hold=()=>{if(!gate.release){try{store.get('active').onsuccess=hold;}catch{}}};hold();
      }
      return tx;
    };
    window.restoreTransaction=()=>{IDBDatabase.prototype.transaction=original;};
  });
  await page.getByLabel('Completed repetitions').focus(); await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.gate.entered);
  assert.equal(await page.getByRole('status').textContent(),'Saving…');
  assert.equal(await page.getByRole('button',{name:'Log set'}).isDisabled(),true);
  await page.screenshot({path:join(artifacts,'pending.png'),fullPage:true});
  await page.evaluate(()=>{gate.release=true;restoreTransaction();});
  await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — set logged'));
  const durable = await page.evaluate(async()=>{
    const before=await proof.repo.load();const reopened=await proof.W.openRepository(proof.setup);const after=await reopened.load();reopened.close();
    const ops=Object.values(after.generation.collections.ops),start=ops.find(x=>x.kind==='session-start'),set=ops.find(x=>x.kind==='session-set');
    return {same:JSON.stringify(before)===JSON.stringify(after),count:ops.length,outbox:Object.keys(after.generation.collections.outbox).length,
      schema:ops.every(x=>x.schema_version===2),reference:set.session_start_op_id===start.op_id,load:set.payload.load,reps:set.payload.reps,reserve:set.payload.reserve,
      emptyStart:Object.keys(start.payload).length===0,draft:after.generation.collections.drafts};
  });
  assert.deepEqual(durable,{same:true,count:2,outbox:2,schema:true,reference:true,load:{value:40.5,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'},emptyStart:true,draft:{active:{unknown:'preserve'}}});
  await page.screenshot({path:join(artifacts,'saved.png'),fullPage:true});
  await page.evaluate(async()=>{
    proof.mount(document.querySelector('#root'),{client:proof.client,selection:{planned_split_slot_id:'AD_HOC',plan_basis:'NO_ACCEPTED_PLAN',lift_lineage_id:'lift-B',logical_set_slot:'slot-B',label:'Synthetic quota check'}});
  });
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Saved — start'));
  await page.getByLabel('Weight (lb)',{exact:true}).fill('35.5');await page.getByLabel('Completed repetitions').fill('0');
  await page.evaluate(async()=>{
    proof.beforeFault=JSON.stringify(await proof.repo.load());const original=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(value,key){if(this.name==='generations'&&key==='active')throw new DOMException('Synthetic quota','QuotaExceededError');return original.call(this,value,key);};
    proof.restorePut=()=>{IDBObjectStore.prototype.put=original;};
  });
  await page.getByRole('button',{name:'Log set'}).click();
  await page.waitForFunction(()=>document.querySelector('[role=status]').textContent.startsWith('Could not save'));
  assert.equal(await page.getByLabel('Weight (lb)',{exact:true}).inputValue(),'35.5');
  assert.equal(await page.getByLabel('Completed repetitions').inputValue(),'0');
  assert.equal(await page.evaluate(async()=>{proof.restorePut();return proof.beforeFault===JSON.stringify(await proof.repo.load());}),true);
  await page.screenshot({path:join(artifacts,'refused.png'),fullPage:true});
  await page.evaluate(()=>proof.repo.close());
  const extensionDurable=await runExtensionDurable(page,{seed:initial(),cfg,key,lease},join(artifacts,'multiple-closed.png'));
  console.log('PANEL EXTENSION DURABLE PASS — one Start, mixed-load Sets, explicit Skip, early Close; native delayed/quota Set/Skip/Close; preserved originals/drafts/unlogged slot after encrypted reopen');
  const layouts=[];
  for(const [width,fontSize]of [[390,16],[320,16],[320,32]]){
    await page.setViewportSize({width,height:844});
    const layout=await page.evaluate(size=>{
      const panel=document.querySelector('.workout-command-panel');panel.style.fontSize=size+'px';
      const controls=[...panel.querySelectorAll('input,select,button')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden');
      return {overflow:document.documentElement.scrollWidth>innerWidth,
        controlsFit:controls.every(x=>{const r=x.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44;}),
        inputFont:parseFloat(getComputedStyle(panel.querySelector('input')).fontSize),statusRole:panel.querySelector('.wcp-status').getAttribute('role')};
    },fontSize);
    assert.equal(layout.overflow,false);assert.equal(layout.controlsFit,true);assert(layout.inputFont>=fontSize);assert.equal(layout.statusRole,'status');
    layouts.push({width,fontSize,...layout});await page.screenshot({path:join(artifacts,`layout-${width}-${fontSize}.png`),fullPage:true});
  }
  console.log('PANEL PRESENTATION PASS — actual compiled durable panel at390/320px and200% text; no horizontal overflow, >=44px controls, scaled inputs and status preserved');
  assert.deepEqual(errors,[]);
  for (const input of built.inventory) assert.equal(createHash('sha256').update(readFileSync(join(source,input.path))).digest('hex'),input.sha256,'Source changed during panel proof');
  const result={source:source,bundleInputs:built.inventory,browser:await browser.version(),domChecks:dom,durableChecks:['actual retained bundle','runtime P256 lease verification','native AES-GCM and IndexedDB','keyboard Start and Log set','native transaction held: Saving only','commit completion then Saved','two persisted ops and outbox entries','exact returned start reference and schema2','40.5lb/8reps/at_least3','unrelated draft preserved','encrypted repository reopen identical','native quota refusal: previous generation identical and typed 35.5/0 retained'],limits:['synthetic unissued schema2 lease','synthetic observation guard and fixed clock','same-runtime controller only','repository reopen is not UI refresh/resume or custody proof','no host adoption or independent acceptance']};
  result.extensionDom=extensionDom; result.extensionDurable=extensionDurable;
  result.layouts=layouts;
  writeFileSync(join(artifacts,'evidence.json'),JSON.stringify(result,null,2)+'\n');
  console.log('PANEL DURABLE BROWSER PASS — actual retained W6/T2/P256/AES-GCM/native IndexedDB, pending atomic commit, keyboard start/set, exact payload/reference, preserved draft and encrypted reopen; synthetic guard/unissued2, not lifecycle acceptance');
  await context.close();context=null;await browser.close();
} finally { if(context)await context.browser().close();await new Promise(r=>server.close(r)); }
