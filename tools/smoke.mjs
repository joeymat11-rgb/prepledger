import { JSDOM } from "jsdom";
import { readFileSync } from "fs";

const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`,
  { url: "https://localhost/", runScripts: "outside-only", pretendToBeVisual: true });
const code = readFileSync("pwa/app.js", "utf8");
dom.window.eval(code);
await new Promise((r) => setTimeout(r, 400));

const root = dom.window.document.getElementById("root");
const html = root.innerHTML;
console.log("root html bytes:", html.length);
console.log(html.includes("Prep Ledger") ? "OK: header renders" : "FAIL: header missing");
console.log(html.includes("QUEUE") && html.includes("SLEEP") ? "OK: tab rail renders" : "FAIL: tabs missing");
console.log(html.includes("Rows 180 debut") ? "OK: hero teaser renders" : "note: hero text differs");
console.log(dom.window.localStorage.getItem("prep-ledger-v1") ? "OK: state seeded to localStorage" : "FAIL: no seed stored");
