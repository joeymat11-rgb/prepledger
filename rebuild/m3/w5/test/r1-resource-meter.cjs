"use strict";
// Local test instrumentation only. CPU is measured in the owned workerd child,
// never the Node harness. The inspector observes the named application isolate.
const fs = require("node:fs"), { spawn, execFileSync } = require("node:child_process");
const readline = require("node:readline");
const integer = value => { if (!Number.isSafeInteger(value) || value < 1) throw Error("invalid owned PID"); return value; };

async function ownedProcessMeter() {
  const parent = integer(process.pid);
  if (process.platform === "win32") {
    const pid = integer(JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `$p=@(Get-CimInstance Win32_Process -Filter "Name='workerd.exe'"|Where-Object ParentProcessId -eq ${parent});if($p.Count -ne 1){throw "Expected one owned runtime"};$p[0].ProcessId|ConvertTo-Json`],
      { encoding: "utf8", windowsHide: true })));
    // One persistent, hidden counter reader avoids spawning a shell for each
    // page. No scripts, execution-policy switches, credentials or host settings.
    const helper = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `while($null -ne ($line=[Console]::ReadLine())){if($line -eq 'stop'){break};$p=Get-Process -Id ${pid} -ErrorAction Stop;[pscustomobject]@{cpuTicks=$p.TotalProcessorTime.Ticks;workingSet=$p.WorkingSet64;peakWorkingSet=$p.PeakWorkingSet64;privateBytes=$p.PrivateMemorySize64;peakPagedBytes=$p.PeakPagedMemorySize64}|ConvertTo-Json -Compress}`],
      { windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
    const queue = [], lines = readline.createInterface({ input: helper.stdout });
    lines.on("line", text => { const next = queue.shift(); if (next) { clearTimeout(next.timer); try { next.resolve(JSON.parse(text)); } catch (e) { next.reject(e); } } });
    helper.on("exit", () => { for (const p of queue.splice(0)) p.reject(Error("process meter exited")); });
    helper.stderr.on("data", () => { for (const p of queue.splice(0)) p.reject(Error("process meter unavailable")); });
    return { pid, tickMs: 0.0001, platform: "Windows GetProcess TotalProcessorTime user+kernel; representation100ns, observed accounting quantization reported separately",
      sample: () => new Promise((resolve, reject) => { const item = { resolve, reject };
        item.timer = setTimeout(() => { const i = queue.indexOf(item); if(i>=0) queue.splice(i,1); reject(Error("process meter timeout")); helper.kill(); }, 5000);
        queue.push(item); helper.stdin.write("sample\n"); }),
      close: async () => { helper.stdin.end("stop\n"); lines.close(); } };
  }
  if (process.platform === "linux") {
    const children = fs.readFileSync(`/proc/${parent}/task/${parent}/children`, "utf8").trim().split(/\s+/).filter(Boolean).map(Number);
    const owned = children.filter(pid => /workerd/.test(fs.readFileSync(`/proc/${integer(pid)}/comm`, "utf8")));
    if (owned.length !== 1) throw Error("Expected one owned workerd child");
    const pid = owned[0], tickMs = 1000 / Number(execFileSync("getconf", ["CLK_TCK"], { encoding: "utf8" }).trim());
    if (!Number.isFinite(tickMs) || tickMs <= 0) throw Error("invalid clock tick");
    return { pid, tickMs, platform: "Linux /proc owned workerd user+kernel ticks; process-wide inclusive measurement",
      sample: async () => {
        const raw = fs.readFileSync(`/proc/${pid}/stat`, "utf8"), fields = raw.slice(raw.lastIndexOf(")") + 2).split(/\s+/);
        const status = fs.readFileSync(`/proc/${pid}/status`, "utf8"), metric = name => Number(new RegExp(`^${name}:\\s+(\\d+)`, "m").exec(status)?.[1] || 0) * 1024;
        return { cpuTicks: Number(fields[11]) + Number(fields[12]), workingSet: metric("VmRSS"), peakWorkingSet: metric("VmHWM"), privateBytes: null, peakPagedBytes: null };
      }, close: async () => {} };
  }
  throw Error("Unsupported process meter platform");
}

async function createResourceMeter(mf, workerName) {
  const processMeter = await ownedProcessMeter();
  const inspector = await mf.getInspectorURL(); inspector.protocol = "http:";
  const targets = await (await fetch(new URL("/json", inspector))).json();
  const target = targets.find(t => t.title.includes(workerName));
  if (!target) { await processMeter.close(); throw Error("application isolate inspector missing"); }
  const socket = new WebSocket(target.webSocketDebuggerUrl), pending = new Map(); let id = 0;
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  socket.addEventListener("message", e => { const data = JSON.parse(e.data); const callback = pending.get(data.id); if (callback) {
    pending.delete(data.id); data.error ? callback.reject(Error(data.error.message)) : callback.resolve(data.result || {});
  } });
  const command = (method, params = {}, timeoutMs = 5000) => new Promise((resolve, reject) => {
    const requestId = ++id, timer = setTimeout(() => { pending.delete(requestId); reject(Error("inspector metric timeout")); }, timeoutMs);
    pending.set(requestId, { resolve: x => { clearTimeout(timer); resolve(x); }, reject: e => { clearTimeout(timer); reject(e); } });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  await command("Runtime.enable");
  let observing = false, observations = [], observationFailure = null;
  async function observe(label) {
    const h = await command("Runtime.getHeapUsage");
    const names = ["usedSize", "totalSize", "embedderHeapUsedSize", "backingStorageSize"];
    if (!names.every(n => Number.isFinite(h[n]) && h[n] >= 0)) throw Error("incomplete isolate allocation vector");
    // usedSize is contained within totalSize. Use committed heap + the other
    // separately reported categories, with limits disclosed in the report.
    observations.push({ label, ...h, observedAllocation: h.totalSize + h.embedderHeapUsedSize + h.backingStorageSize });
    return h;
  }
  let observer, diagnosticCollectionRequested = false;
  return {
    method: { platform: processMeter.platform, counterTickMs: processMeter.tickMs,
      cpu: "owned workerd process user+kernel delta covering full response; includes competing D1/isolate/inspector work; conservative accounting guard required, never wall-time CPU substitution",
      memory: "maximum observed simultaneous totalSize + embedderHeapUsedSize + backingStorageSize; no usedSize double count; native allocations outside these reported categories unmeasured",
      overlap: "per-request windows include competing work; whole-attempt delta is reported separately, never sum overlapping windows" },
    sampleProcess: processMeter.sample,
    async begin() {
      observations = []; observationFailure = null; observing = true;
      await observe("start");
      observer = (async () => { while (observing) { try { await observe("periodic"); } catch (error) { observationFailure = error.message; observing = false; }
        if (observing) await new Promise(r => setTimeout(r, 5)); } })();
    },
    observe,
    async measure(action) {
      const before = await processMeter.sample();
      const value = await action(); // must consume the entire response
      const after = await processMeter.sample();
      return { value, cpuMs: (after.cpuTicks - before.cpuTicks) * processMeter.tickMs, before, after };
    },
    async end() {
      observing = false; if (observer) await observer;
      await observe("end");
      if (observationFailure) throw Error(observationFailure);
      return { observedPeakBytes: observations.reduce((m,x)=>Math.max(m,x.observedAllocation),0), samples: observations };
    },
    // Diagnostic-only, explicitly called after a completed measurement by the
    // separate diagnostic runner. The acceptance runner never calls this method.
    // Reuse the existing inspector session: a second connection can replace it.
    async collectOnceAfterMeasurement() {
      if (observing || observations.at(-1)?.label !== 'end' || pending.size || diagnosticCollectionRequested)
        throw Error('diagnostic requires one finished measurement and no pending inspector command');
      if (target.title !== 'workerd: worker core:user:' + workerName) throw Error('exact diagnostic application isolate required');
      diagnosticCollectionRequested = true;
      const run = async method => { try { return await command(method, {}, 30000); }
        catch (error) { throw Error('diagnostic ' + method + ': ' + error.message); } };
      const before = await run('Runtime.getHeapUsage');
      await run('HeapProfiler.collectGarbage');
      const after = await run('Runtime.getHeapUsage');
      return { label:'DIAGNOSTIC — NOT ACCEPTANCE',isolate:target.title,collections:1,before,after,
        applicationRequestsAfterCollection:0,flagsChanged:false,resourceAcceptance:false };
    },
    async close() { observing = false; if (observer) await observer; socket.close(); await processMeter.close(); },
  };
}
module.exports = { ownedProcessMeter, createResourceMeter };
