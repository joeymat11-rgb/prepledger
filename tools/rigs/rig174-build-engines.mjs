import esbuild from "/home/claude/prepledger/node_modules/esbuild/lib/main.js";
const ENGINES = { fix4b: "/home/claude/prepledger", fix4: "/home/claude/wt-fix4", main: "/home/claude/wt-main" };
for (const [name, root] of Object.entries(ENGINES)) {
  const entry = `/tmp/rig174/entry-${name}.mjs`;
  const fs = await import("node:fs");
  fs.writeFileSync(entry, `import "${root}/tools/_fixed-now.mjs";\nimport { __test } from "${root}/src/app.jsx";\nexport { __test };\n`);
  await esbuild.build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", jsx: "automatic", loader: { ".jsx": "jsx" },
    outfile: `/tmp/rig174/engine-${name}.cjs`, absWorkingDir: root, nodePaths: ["/home/claude/prepledger/node_modules"], logLevel: "error" });
  console.log("built", name);
}
