"use strict";

const { createPreviewModel } = require("./model.cjs");
const NUMBER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const amount = (v) => Number.isFinite(v) ? NUMBER.format(v) : "Not available";
const weight = (v) => Number.isFinite(v) ? v.toFixed(1) : "—";
const localDate = (day) => { const [y,m,d] = day.split("-").map(Number); return new Date(y,m-1,d,12); };
const dayLabel = (day) => new Intl.DateTimeFormat("en-US", { weekday:"long", month:"long", day:"numeric" }).format(localDate(day));
const shortDate = (day) => new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(localDate(day));
const rateLabel = (rate) => rate.measured && Number.isFinite(rate.scale)
  ? (rate.scale > 0 ? "−" : rate.scale < 0 ? "+" : "") + Math.abs(rate.scale).toFixed(1) + " lb"
  : "Not yet";

// Bind a complete leaf, not a numerical substring: stale mock claims must not survive.
function bind(root, original, replacement, slot) {
  const leaves = [...root.querySelectorAll("*")].filter((el) => el.children.length === 0 && el.textContent.trim() === original);
  if (leaves.length !== 1) throw new Error("Preview template binding mismatch: " + slot);
  leaves[0].textContent = replacement;
  leaves[0].dataset.slot = slot;
  if (slot === "main-title") { leaves[0].setAttribute("role","heading"); leaves[0].setAttribute("aria-level","1"); }
  return leaves[0];
}
function control(root, name, action) {
  const el = root.querySelector(`[aria-label="${name}"]`);
  if (!el) throw new Error("Missing preview control");
  el.addEventListener("click", action);
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); action(); }
  });
  return el;
}

function mountPreview(doc = document, model = createPreviewModel()) {
  const phone = doc.getElementById("phone"), message = doc.getElementById("preview-message");
  let currentScreen = null;
  function tell(text) { message.textContent = text; }
  function cloneTemplate(id) {
    const template = doc.getElementById("s-" + id);
    if (!template) throw new Error("Missing ratified template " + id);
    return template.content.firstElementChild.cloneNode(true);
  }
  function replaceScreen(root, focus = false) {
    phone.replaceChildren();
    const screen = doc.createElement("section"); screen.className = "screen";
    screen.setAttribute("aria-label", "Sample Today"); screen.append(root); phone.append(screen); currentScreen = screen;
    if (focus) { const target = root.querySelector('[role="heading"],h2') || root; target.tabIndex = -1; target.focus(); }
  }
  function calorieLine(plan, prefix = "") {
    const c = plan.calorieTarget, p = plan.proteinTarget;
    return c.gated ? "A calorie range is not available yet."
      : `${prefix}${amount(c.lo)}–${amount(c.hi)} kcal · ${amount(p.g)} g protein`;
  }
  function why() {
    const view = model.read(), root = cloneTemplate("T08"), sections = [...root.children].slice(2);
    if (sections.length !== 5) throw new Error("Why template shape changed");
    root.children[1].setAttribute("role","heading"); root.children[1].setAttribute("aria-level","1");
    const c = view.calorieTarget, r = view.currentRate;
    const values = [
      c.why || view.energyBalanceTarget.why || view.nowModel.eat.sub,
      view.proteinTarget.why,
      [view.statusFace.cause, view.nowModel.move.body].filter(Boolean).join(" "),
      `Newest sample reading: ${shortDate(view.latestRead.d)}. ${r.measured ? `${r.n} readings support the rate, ${shortDate(r.from)} to ${shortDate(r.to)}.` : "The rate is not measured yet."}`,
      r.measured && Number.isFinite(r.lo) && Number.isFinite(r.hi)
        ? `The estimated loss rate is ${r.scale.toFixed(2)} lb/week; its range is ${r.lo.toFixed(2)}–${r.hi.toFixed(2)} lb/week. These are calculations from the sample history.`
        : "The sample history does not establish a measured weekly rate yet.",
    ];
    sections.forEach((section,i) => { section.children[0].setAttribute("role","heading"); section.children[0].setAttribute("aria-level","2"); section.children[1].textContent = values[i] || "No supporting estimate is available."; section.children[1].dataset.slot = "why-"+i; });
    sections[2].children[0].textContent = `What supports “${view.statusFace.word.toLowerCase()}”`;
    control(root,"Back to Today", () => render(true));
    replaceScreen(root,true);
  }
  function placeholder() {
    const root = doc.createElement("div"); root.className = "why";
    root.innerHTML = '<h2>Workout logging comes later.</h2><p class="preview-placeholder-copy">This preview shows the Today screen only. No workout has been started.</p><button type="button" class="btn quiet">BACK TO TODAY</button>';
    root.querySelector("button").addEventListener("click", () => render(true));
    replaceScreen(root,true);
  }
  function weigh() {
    if (phone.querySelector('[role="dialog"]')) return;
    const returnFocus = doc.activeElement;
    const sheet = doc.createElement("form"); sheet.className = "sheet";
    sheet.setAttribute("role","dialog"); sheet.setAttribute("aria-modal","true"); sheet.setAttribute("aria-label","Preview a morning weight");
    sheet.innerHTML = '<div class="eyebrow">This morning</div><input class="big" type="number" inputmode="decimal" step="0.1" min="60" max="400" placeholder="180.7" required aria-label="Weight in pounds" aria-describedby="weight-help weight-error"><div class="unit">lb, first thing, before eating</div><div class="help" id="weight-help">Try a sample weight. This preview changes only until you reload.</div><p class="preview-error" id="weight-error" role="alert"></p><div class="grow"></div><button type="submit" class="btn"><span>TRY THIS WEIGHT</span><span aria-hidden="true">→</span></button><button type="button" class="btn quiet" id="not-now">NOT NOW</button>';
    const input = sheet.querySelector("input"), error = sheet.querySelector(".preview-error");
    currentScreen.inert = true;
    phone.append(sheet); input.focus();
    function cancel() { sheet.remove(); currentScreen.inert = false; if (returnFocus && returnFocus.isConnected) returnFocus.focus(); }
    sheet.querySelector("#not-now").addEventListener("click", cancel);
    sheet.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
      if (event.key === "Tab") {
        const items = [input, ...sheet.querySelectorAll("button")], first = items[0], last = items.at(-1);
        if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    sheet.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input.checkValidity()) { error.textContent = "Try a sample weight from 60 to 400 lb, to one decimal place."; input.focus(); return; }
      const result = model.previewWeighIn(input.valueAsNumber);
      if (!result.ok) { error.textContent = result.message; input.focus(); return; }
      render(true); tell(result.message);
    });
  }
  function render(focus = false) {
    const view = model.read(), logged = view.hasReadToday, root = cloneTemplate(logged ? "T01" : "T02");
    bind(root,"Monday, August 10",dayLabel(view.today),"date");
    const shown = logged ? view : view.yesterdayPlan;
    bind(root, logged ? "180.9 lb" : "180.2 lb", weight(shown.nowModel.headed.weight)+" lb", "trend");
    bind(root, logged ? "−1.1 lb" : "−0.3 lb", rateLabel(shown.currentRate), "rate");
    if (logged) {
      bind(root,"181.3",weight(view.latestRead.w),"weight");
      const c = view.calorieTarget;
      bind(root,"Eat about 2,300 kcal.", c.gated ? "A few more readings first." : `Eat about ${amount(Math.round(c.mid/100)*100)} kcal.`,"main-title");
      bind(root,"2,252–2,344 kcal · 160 g protein",calorieLine(view),"calories");
      bind(root,"Your weight trend is down 1.1 lb/week, within your target range. Keep the plan.",view.nowModel.move.body,"reason");
      control(root,"Why this plan?",why);
      const gym = control(root,"OPEN UPPER BODY · 9 LIFTS",placeholder);
      gym.dataset.slot = "workout";
      const label = view.nowModel.workout.title === "REST DAY" ? "REST DAY" : "OPEN "+view.nowModel.workout.title;
      gym.querySelector("span").textContent = label; gym.setAttribute("aria-label",label);
    } else {
      const c = shown.calorieTarget;
      bind(root,"Weigh in first.","Weigh in first.","main-title");
      bind(root,"About 1,900 kcal (1,883–1,970) · 160 g protein",c.gated ? "No previous range is available." : `About ${amount(Math.round(c.mid/100)*100)} kcal (${amount(c.lo)}–${amount(c.hi)}) · ${amount(shown.proteinTarget.g)} g protein`,"calories");
      bind(root,"Rest day — no session scheduled.",view.nowModel.workout.title,"workout-description");
      control(root,"LOG THIS MORNING’S WEIGHT",weigh).dataset.slot = "workout";
    }
    doc.getElementById("morning-example").setAttribute("aria-pressed",String(!logged));
    doc.getElementById("logged-example").setAttribute("aria-pressed",String(logged));
    replaceScreen(root,focus);
  }
  function reset(scenario) { model.reset(scenario); render(); tell("Temporary preview reset. Nothing is saved or sent."); }
  doc.getElementById("morning-example").addEventListener("click", () => reset("morning"));
  doc.getElementById("logged-example").addEventListener("click", () => reset("logged"));
  doc.getElementById("reset-preview").addEventListener("click", () => reset("morning"));
  phone.addEventListener("keydown",(event) => { if(event.key === "Escape" && !phone.querySelector('[role="dialog"]')) render(true); });
  render();
  return { read:() => model.read(), render };
}

if (typeof document !== "undefined") {
  try { mountPreview(); }
  catch { document.getElementById("phone").textContent = "The preview could not load. Reload to try again; nothing was saved."; }
}
module.exports = { mountPreview, bind, rateLabel, dayLabel };
