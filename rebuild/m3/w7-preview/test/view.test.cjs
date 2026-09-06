"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { JSDOM } = require("jsdom");
const { mountPreview } = require("../app.cjs");
const { createPreviewModel } = require("../model.cjs");
const root = path.resolve(__dirname,"../../../..");
function setup() {
  const mock = new JSDOM(fs.readFileSync(path.join(root,"rebuild/m1/earned-mock.public.html"),"utf8"));
  const templates = ["T01","T02","T08"].map(id=>mock.window.document.getElementById("s-"+id).outerHTML).join("\n");
  const html = fs.readFileSync(path.join(__dirname,"../index.shell.html"),"utf8").replace("<!-- MOCK_TEMPLATES -->",templates);
  const dom = new JSDOM(html,{url:"http://127.0.0.1:4177/"}), doc = dom.window.document;
  const model = createPreviewModel(), api = mountPreview(doc,model);
  return {dom,doc,model,api};
}
const key = (dom,el,k,extra={})=>el.dispatchEvent(new dom.window.KeyboardEvent("keydown",{key:k,bubbles:true,cancelable:true,...extra}));

test("morning shows yesterday's engine plan; logged example rebinds all facts",()=>{
  const {doc,model}=setup(); let view=model.read();
  assert.equal(doc.querySelector('[data-slot="trend"]').textContent,view.yesterdayPlan.nowModel.headed.weight.toFixed(1)+" lb");
  assert.match(doc.querySelector('[data-slot="calories"]').textContent.replaceAll(",",""),new RegExp(String(view.yesterdayPlan.calorieTarget.lo)));
  doc.getElementById("logged-example").click(); view=model.read();
  assert.equal(doc.querySelector('[data-slot="weight"]').textContent,view.latestRead.w.toFixed(1));
  assert.equal(doc.querySelector('[data-slot="reason"]').textContent,view.nowModel.move.body);
  assert.match(doc.querySelector('[data-slot="calories"]').textContent,new RegExp(String(view.proteinTarget.g)));
  assert.doesNotMatch(doc.getElementById("phone").textContent,/181\.3|2,252|2,344|160 g protein|within your target range/);
});
test("keyboard weigh-in updates only the preview and all engine-derived values",()=>{
  const {dom,doc,model}=setup();
  const before=model.getSnapshot();
  key(dom,doc.querySelector('[aria-label="LOG THIS MORNING’S WEIGHT"]'),"Enter");
  const form=doc.querySelector("form"), input=form.querySelector("input");
  assert.equal(doc.activeElement,input); assert.equal(doc.querySelector(".screen").inert,true);
  key(dom,input,"Tab",{shiftKey:true}); assert.equal(doc.activeElement,form.querySelector("#not-now"));
  key(dom,doc.activeElement,"Tab"); assert.equal(doc.activeElement,input);
  input.value="179.5"; form.dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true}));
  assert.equal(model.read().latestRead.w,179.5); assert.equal(model.getSnapshot().reads.length,before.reads.length+1);
  assert.equal(doc.querySelector('[data-slot="trend"]').textContent,model.read().nowModel.headed.weight.toFixed(1)+" lb");
  assert.match(doc.getElementById("preview-message").textContent,/Preview updated.*resets on reload/);
  assert.equal(doc.querySelector("form"),null);
  assert.equal(dom.window.localStorage.length,0); assert.equal(dom.window.sessionStorage.length,0); assert.equal(doc.cookie,"");
});
test("cancel, invalid input and reload never keep an entry",()=>{
  const {dom,doc,model}=setup(); const before=model.getSnapshot();
  const opener=doc.querySelector('[aria-label="LOG THIS MORNING’S WEIGHT"]'); opener.focus(); opener.click();
  const form=doc.querySelector("form"), input=form.querySelector("input"); input.value="500";
  form.dispatchEvent(new dom.window.Event("submit",{bubbles:true,cancelable:true}));
  assert.deepEqual(model.getSnapshot(),before); assert.match(doc.querySelector(".preview-error").textContent,/60 to 400/);
  key(dom,input,"Escape"); assert.equal(doc.querySelector("form"),null); assert.equal(doc.activeElement,opener);
  assert.deepEqual(model.getSnapshot(),before);
  model.previewWeighIn(181.2); assert.deepEqual(setup().model.getSnapshot(),before);
});
test("Why replaces every sample explanation; Back and unbuilt workout are honest",()=>{
  const {dom,doc,model}=setup(); doc.getElementById("logged-example").click();
  key(dom,doc.querySelector('[aria-label="Why this plan?"]')," "); const view=model.read();
  assert.equal(doc.querySelector('[data-slot="why-0"]').textContent,view.calorieTarget.why);
  assert.equal(doc.querySelector('[data-slot="why-1"]').textContent,view.proteinTarget.why);
  assert.doesNotMatch(doc.getElementById("phone").textContent,/DEXA scan, already queued|37 logged days|63\.4 kg|2,876/);
  doc.querySelector('[aria-label="Back to Today"]').click();
  doc.querySelector('[data-slot="workout"]').click();
  assert.match(doc.getElementById("phone").textContent,/No workout has been started/);
  doc.querySelector(".why button").click(); assert.ok(doc.querySelector('[data-slot="weight"]'));
});
test("exact numerical mock claims cannot silently survive a template drift",()=>{
  const {doc}=setup(); const template=doc.getElementById("s-T01");
  template.innerHTML=template.innerHTML.replace("181.3","unrecognized fixture");
  const fresh=()=>mountPreview(doc,createPreviewModel({scenario:"logged"}));
  assert.throws(fresh,/Preview template binding mismatch: weight/);
});
