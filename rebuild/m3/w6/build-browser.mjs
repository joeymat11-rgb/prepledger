import { build } from "esbuild";
import { builtinModules } from "node:module";
import { fileURLToPath } from "node:url";
import { resolve, relative, dirname } from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const normalize = path => resolve(path).replaceAll("\\", "/");
const approved = new Set(["ops.cjs", "plan.cjs"].map(name => normalize(resolve(root, "rebuild/client", name))));
const builtins = new Set(builtinModules.flatMap(name => [name, `node:${name.replace(/^node:/, "")}`]));
export async function buildBrowser({ outfile = resolve(here, ".tmp/browser/w6.js"), entryPoints = [resolve(here, "browser-entry.mjs")] } = {}) {
  const cipherPins = JSON.parse(await readFile(resolve(here, "cipher-imports.json"), "utf8"));
  const fontDirectory=resolve(root,'rebuild/m4/workout/fonts'),fontManifestPath=resolve(fontDirectory,'SOURCES.json');
  const fontManifest=await readFile(fontManifestPath),fontSources=JSON.parse(fontManifest.toString('utf8'));
  const fontNames=['InstrumentSans-Variable.woff2','InstrumentSerif-Regular.woff2','OFL-InstrumentSans.txt','OFL-InstrumentSerif.txt'];
  if(fontSources.schema!=='earned/local-typography/v1'||fontSources.files?.length!==fontNames.length||
      fontNames.some(name=>fontSources.files.filter(f=>f.name===name).length!==1))throw new Error('Invalid typography source manifest');
  const fontPins=new Map(fontSources.files.map(f=>[normalize(resolve(fontDirectory,f.name)),f]));
  let typographyUsed=false;
  await mkdir(dirname(outfile), { recursive: true });
  const result = await build({ absWorkingDir: root, entryPoints, outfile, bundle: true, platform: "browser", format: "esm", target: "es2022", metafile: true,
    plugins: [{ name: "earned-w6-exact-crypto-boundary", setup(builder) {
      builder.onLoad({filter:/\.(?:woff2|txt)$/},async args=>{
        const pin=fontPins.get(normalize(args.path));
        if(!pin)return {errors:[{text:'Unapproved browser typography asset'}]};
        const bytes=await readFile(args.path);
        if(bytes.length!==pin.size||createHash('sha256').update(bytes).digest('hex')!==pin.sha256)
          return {errors:[{text:'Changed pinned typography asset'}]};
        const font=args.path.endsWith('.woff2');
        if(font?bytes.subarray(0,4).toString()!=='wOF2':bytes.toString().includes('*/'))
          return {errors:[{text:'Invalid pinned typography asset'}]};
        typographyUsed=true;return {contents:bytes,loader:font?'dataurl':'text'};
      });
      builder.onResolve({ filter: /^(?:node:|crypto$)/ }, args => {
        if (args.path === "node:crypto" && approved.has(normalize(args.importer))) return { path: resolve(here, "node-sha256-browser.mjs") };
        return { errors: [{ text: `Unapproved browser Node import ${args.path}` }] };
      });
      builder.onResolve({ filter: /.*/ }, args => {
        if (builtins.has(args.path)) return { errors: [{ text: `Unapproved browser Node import ${args.path}` }] };
        if (/(?:^|\/)w5[\\/]crypto\.cjs$|(?:^|[\\/])authority[\\/](?!canonical\.cjs$)/.test(args.path)) return { errors: [{ text: "Authority private implementation cannot enter the phone bundle" }] };
        return undefined;
      });
    } }], logLevel: "silent" });
  const inventory = [];
  if(typographyUsed)inventory.push({path:relative(root,fontManifestPath).replaceAll('\\','/'),sha256:createHash('sha256').update(fontManifest).digest('hex')});
  for (const path of Object.keys(result.metafile.inputs)) {
    const absolute = resolve(root, path), name = relative(root, absolute).replaceAll("\\", "/");
    if (/^rebuild\/authority\//.test(name) && name !== "rebuild/authority/canonical.cjs" || name === "rebuild/m3/w5/crypto.cjs") throw new Error("Unapproved authority code in browser graph");
    const hash = createHash("sha256").update(await readFile(absolute)).digest("hex"), cipherInput = name.match(/\/@noble\/ciphers\/(.+)$/)?.[1];
    if (cipherInput && cipherPins.inputs[cipherInput] !== hash) throw new Error("Unapproved or changed cipher input in browser graph");
    inventory.push({ path: name, sha256: hash });
  }
  await writeFile(`${outfile}.meta.json`, JSON.stringify({ inputs: inventory, metafile: result.metafile }, null, 2));
  return { outfile, inventory };
}
if (process.argv[1] && normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url))) {
  const result = await buildBrowser();
  console.log(`W6 BROWSER BUILD PASS — ${result.inventory.length} pinned local inputs; exact client crypto importers only`);
}
