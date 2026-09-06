const whitespace = code => code === 0x20 || code === 0x09 || code === 0x0a || code === 0x0d;
const digit = code => code >= 0x30 && code <= 0x39;
const hex = code => digit(code) || (code >= 0x41 && code <= 0x46) || (code >= 0x61 && code <= 0x66);

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

/** Check JSON without normalizing its bytes or member order; schemas enforce safe-integer fields separately. */
export function parseStrictJson(bytesOrString) {
  let source;
  if (typeof bytesOrString === "string") source = bytesOrString;
  else if (bytesOrString instanceof Uint8Array) {
    try {
      // Keep a leading BOM visible: it is not JSON whitespace and must not be silently removed.
      source = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytesOrString);
    } catch { fail("STRICT_JSON_UTF8"); }
  } else fail("STRICT_JSON_INPUT");

  let at = 0;
  const skipWhitespace = () => { while (whitespace(source.charCodeAt(at))) at++; };
  const syntax = () => fail("STRICT_JSON_SYNTAX");

  function readString(decode) {
    const start = at++;
    while (at < source.length) {
      const code = source.charCodeAt(at++);
      if (code === 0x22) {
        if (!decode) return;
        try { return JSON.parse(source.slice(start, at)); }
        catch { syntax(); }
      }
      if (code < 0x20) syntax();
      if (code !== 0x5c) continue;
      const escaped = source[at++];
      if (escaped === "u") {
        for (let n = 0; n < 4; n++) if (!hex(source.charCodeAt(at++))) syntax();
      } else if (escaped !== '"' && escaped !== "\\" && escaped !== "/" &&
        escaped !== "b" && escaped !== "f" && escaped !== "n" && escaped !== "r" && escaped !== "t") syntax();
    }
    syntax();
  }

  function readNumber() {
    const start = at;
    if (source[at] === "-") at++;
    if (source[at] === "0") at++;
    else {
      const first = source.charCodeAt(at);
      if (first < 0x31 || first > 0x39 || !Number.isFinite(first)) syntax();
      do { at++; } while (digit(source.charCodeAt(at)));
    }
    if (source[at] === ".") {
      at++;
      if (!digit(source.charCodeAt(at))) syntax();
      do { at++; } while (digit(source.charCodeAt(at)));
    }
    if (source[at] === "e" || source[at] === "E") {
      at++;
      if (source[at] === "+" || source[at] === "-") at++;
      if (!digit(source.charCodeAt(at))) syntax();
      do { at++; } while (digit(source.charCodeAt(at)));
    }
    if (!Number.isFinite(Number(source.slice(start, at)))) fail("STRICT_JSON_NONFINITE");
  }

  // Explicit frames avoid adding a recursive-call depth limit to otherwise valid stored JSON.
  const stack = [{ kind: "root", state: "value" }];
  function readValue(parent) {
    parent.state = parent.kind === "root" ? "end" : "commaOrEnd";
    const next = source[at];
    if (next === "{") {
      at++; stack.push({ kind: "object", state: "keyOrEnd", names: new Set() });
    } else if (next === "[") {
      at++; stack.push({ kind: "array", state: "valueOrEnd" });
    } else if (next === '"') readString(false);
    else if (next === "-" || digit(source.charCodeAt(at))) readNumber();
    else {
      const literal = next === "t" ? "true" : next === "f" ? "false" : next === "n" ? "null" : null;
      if (!literal || source.slice(at, at + literal.length) !== literal) syntax();
      at += literal.length;
    }
  }

  while (stack.length) {
    skipWhitespace();
    const frame = stack[stack.length - 1];
    if (frame.kind === "root" && frame.state === "end") {
      if (at !== source.length) syntax();
      stack.pop();
    } else if (frame.kind === "object" && (frame.state === "keyOrEnd" || frame.state === "key")) {
      if (frame.state === "keyOrEnd" && source[at] === "}") { at++; stack.pop(); continue; }
      if (source[at] !== '"') syntax();
      const name = readString(true);
      if (frame.names.has(name)) fail("STRICT_JSON_DUPLICATE_KEY");
      frame.names.add(name);
      frame.state = "colon";
    } else if (frame.kind === "object" && frame.state === "colon") {
      if (source[at++] !== ":") syntax();
      frame.state = "value";
    } else if (frame.state === "commaOrEnd") {
      const end = frame.kind === "object" ? "}" : "]";
      if (source[at] === end) { at++; stack.pop(); }
      else if (source[at] === ",") {
        at++; frame.state = frame.kind === "object" ? "key" : "value";
      } else syntax();
    } else if (frame.kind === "array" && frame.state === "valueOrEnd" && source[at] === "]") {
      at++; stack.pop();
    } else readValue(frame);
  }

  // JSON.parse supplies normal own-property semantics, including an ordinary __proto__ data member.
  try { return JSON.parse(source); }
  catch { syntax(); }
}
