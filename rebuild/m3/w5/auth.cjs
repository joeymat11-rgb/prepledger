"use strict";

// The deployed issuer and its verification keys are explicit, pinned bindings.
// Authentication never fetches discovery documents or a caller-selected JWKS URL.
const { createPublicKey, verify } = require("node:crypto");

class AuthenticationError extends Error {
  constructor() { super("Authentication required"); this.code = "UNAUTHENTICATED"; }
}

function createAuthenticator(config) {
  if (!config || typeof config.issuer !== "string" || typeof config.audience !== "string" ||
      !Array.isArray(config.origins) || !config.origins.length || !Array.isArray(config.jwks) || !config.jwks.length)
    throw new TypeError("Pinned issuer, audience, origins and verification keys are required");
  const origins = new Set(config.origins);
  const keys = new Map();
  for (const jwk of config.jwks) {
    if (!jwk || jwk.kty !== "RSA" || jwk.d || typeof jwk.kid !== "string" || !jwk.kid ||
        (jwk.alg && jwk.alg !== "RS256") || (jwk.use && jwk.use !== "sig") || keys.has(jwk.kid))
      throw new TypeError("Only distinct pinned RS256 public verification keys are accepted");
    keys.set(jwk.kid, createPublicKey({ key: jwk, format: "jwk" }));
  }
  return function authenticate(request, nowMs = Date.now()) {
    try {
      const origin = request.headers.get("origin");
      const authorization = request.headers.get("authorization") || "";
      if (!origin || !origins.has(origin) || authorization.length > 16384 || !authorization.startsWith("Bearer ")) throw new AuthenticationError();
      const token = authorization.slice(7), parts = token.split(".");
      if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) throw new AuthenticationError();
      const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      if (!header || header.alg !== "RS256" || typeof header.kid !== "string" || header.crit ||
          !keys.has(header.kid) || !claims || typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 256)
        throw new AuthenticationError();
      if (!verify("RSA-SHA256", Buffer.from(parts[0] + "." + parts[1]), keys.get(header.kid), Buffer.from(parts[2], "base64url")))
        throw new AuthenticationError();
      const now = Math.floor(nowMs / 1000);
      const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
      if (!Number.isFinite(now) || claims.iss !== config.issuer || !audiences.includes(config.audience) ||
          claims.azp !== origin || !Number.isFinite(claims.exp) || claims.exp <= now ||
          !Number.isFinite(claims.iat) || claims.iat > now ||
          (claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf > now)))
        throw new AuthenticationError();
      return { subject: claims.sub, origin };
    } catch (_) { throw new AuthenticationError(); }
  };
}

module.exports = { createAuthenticator, AuthenticationError };
