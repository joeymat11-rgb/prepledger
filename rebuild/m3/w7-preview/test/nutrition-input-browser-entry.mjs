// Owned synthetic browser harness. Real IndexedDB, crypto, calendar and command
// path; no fake success callbacks or product entry changes.
import { createFormFixture } from './nutrition-input-fixture.mjs';
import { mountNutritionInput } from '../today/nutrition-input-view.mjs';
const fixture = await createFormFixture({ indexedDB: globalThis.indexedDB, crypto: globalThis.crypto });
const root = document.getElementById('form'); let view;
function mount() { view = mountNutritionInput(document, root, { model:fixture.model, onBack() {
  view.destroy(); root.replaceChildren(); const button=document.createElement('button'); button.textContent='Return to Your nutrition'; button.className='link';button.addEventListener('click',mount);root.append(button);
} }); }
mount();
globalThis.nutritionHarness = {
  read:()=>fixture.read(), generation:async()=>{const s=await fixture.generation();return {revision:s.revision,ops:Object.values(s.generation.collections.ops),device:s.generation.collections.meta.device};},
  weigh:()=>fixture.weigh(),setNow:(value,offset)=>fixture.setNow(value,offset),
  snapshot:()=>fixture.model.snapshot(),async reopen(){view.destroy();await fixture.reopen();mount();},
};
