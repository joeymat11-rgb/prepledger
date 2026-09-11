// Authoritative local enrollment input, not a derived cache or an accepted
// plan transaction. Values are explicitly supplied; this module recommends none.
// Copy/restore consumers must retain BOTH this collection and its metadata marker.
import Athlete from "../../../m4/workout/athlete-state.cjs";

export const INITIAL_SETUP_COLLECTION = "initialSetup";
export const INITIAL_SETUP_PROFILE = "earned/local-initial-setup/v1";
const keys = ["profile", "constructor_profile", "athlete_id", "device_id", "created_at", "setup"];
const plain = value => value && typeof value === "object" && !Array.isArray(value)
  && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const fail = code => { const error = new Error(code); error.code = code; error.state = 18; throw error; };
const exact = (value, names) => plain(value) && Reflect.ownKeys(value).length === names.length
  && names.every(name => Object.hasOwn(value, name));

// repository.mjs seals JSON. Reject inputs JSON would silently change (sparse
// arrays, array properties, getters, hidden members), before acknowledging them.
function jsonDocument(value, ancestors = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value) && !Object.is(value, -0);
  if ((!plain(value) && !Array.isArray(value)) || ancestors.has(value)) return false;
  const names = Reflect.ownKeys(value);
  if (Array.isArray(value) && (names.length !== value.length + 1
    || !Array.from({ length: value.length }, (_, i) => Object.hasOwn(value, i)).every(Boolean))) return false;
  const next = new Set(ancestors).add(value);
  return names.every(name => {
    if (Array.isArray(value) && name === "length") return true;
    const field = Object.getOwnPropertyDescriptor(value, name);
    return typeof name === "string" && field.enumerable && Object.hasOwn(field, "value")
      && jsonDocument(field.value, next);
  });
}

export function createInitialSetup({ setup, athleteId, deviceId, createdAt }) {
  // Validate BEFORE cloning so extra/symbol members cannot disappear unnoticed.
  if (!jsonDocument(setup)) fail("LOCAL_INITIAL_SETUP_INPUT_INVALID");
  Athlete.createCleanInitState({ setup });
  return { profile: INITIAL_SETUP_PROFILE, constructor_profile: Athlete.PROFILE,
    athlete_id: athleteId, device_id: deviceId, created_at: createdAt,
    setup: structuredClone(setup) };
}

export function readInitialSetup(generation, { athleteId, deviceId }) {
  const collections = generation?.collections, metadata = generation?.metadata;
  const marker = metadata?.initialSetup;
  const present = collections && Object.hasOwn(collections, INITIAL_SETUP_COLLECTION);
  // Old no-setup callers remain usable, but are never promoted from their cache.
  if (!present && marker === undefined)
    return { configured: false, code: "LOCAL_INITIAL_SETUP_REQUIRED", setup: null, basisState: null };
  if (!present || marker === undefined) fail("LOCAL_INITIAL_SETUP_AUTHORITY_MISSING");
  if (!exact(marker, ["profile"]) || marker.profile !== INITIAL_SETUP_PROFILE)
    fail("LOCAL_INITIAL_SETUP_PROFILE_INVALID");
  const collection = collections[INITIAL_SETUP_COLLECTION];
  if (!exact(collection, ["initial"]) || !exact(collection.initial, keys))
    fail("LOCAL_INITIAL_SETUP_INVALID");
  const record = collection.initial;
  if (record.profile !== INITIAL_SETUP_PROFILE || record.constructor_profile !== Athlete.PROFILE)
    fail("LOCAL_INITIAL_SETUP_PROFILE_INVALID");
  if (record.athlete_id !== athleteId || record.device_id !== deviceId
    || collections.meta?.device?.athlete_id !== athleteId || collections.meta?.device?.device_id !== deviceId)
    fail("LOCAL_INITIAL_SETUP_IDENTITY_MISMATCH");
  if (record.created_at !== metadata.enrolledAt || typeof record.created_at !== "string"
    || !Number.isFinite(Date.parse(record.created_at))) fail("LOCAL_INITIAL_SETUP_INVALID");
  let basisState;
  try { basisState = Athlete.createCleanInitState({ setup: record.setup }); }
  catch { fail("LOCAL_INITIAL_SETUP_INVALID"); }
  return { configured: true, code: null, profile: record.profile,
    constructorProfile: record.constructor_profile, athleteId: record.athlete_id,
    deviceId: record.device_id, createdAt: record.created_at,
    setup: structuredClone(record.setup), basisState };
}
