import { digest } from '../admission.mjs';
import { COMPANION_POLICY } from '../provider.mjs';
export const START = Date.parse('2030-02-04T13:00:00.000Z');
export const tokens = { joe: 'j'.repeat(43), dad: 'd'.repeat(43) }; // Synthetic only.
export const nonce = n => `00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
export const policySha = await digest(JSON.stringify(COMPANION_POLICY));
export async function environment(now = START) {
  return {
    APP_ORIGIN: 'https://phone.example', OPENAI_PROJECT_ID: 'synthetic-project', OPENAI_API_KEY: 'synthetic-provider-key',
    PHONE_CREDENTIALS_JSON: JSON.stringify(await Promise.all(['joe','dad'].map(async user => ({ user, digest: await digest(tokens[user]) })))),
    CAP_VERIFICATION_JSON: JSON.stringify({ project_id: 'synthetic-project', month_limit_usd: 50,
      verified_at: new Date(now).toISOString(), verified_by: 'owner', model: 'gpt-live-1', minute_price_usd: 0.05, enabled: true }),
    CONSENT_SCREENS_JSON: JSON.stringify({ synthetic: 'Synthetic transfer disclosure, no real consent.' }),
    COMPANION_REVIEW_JSON: JSON.stringify({ artifact_sha: 'a'.repeat(40), policy_sha: policySha, reviewed: true }),
  };
}
export function body(user = 'joe', n = 1) {
  return { user, nonce: nonce(n), opt_in: { user, accepted: true, accepted_at: new Date(START - 60000).toISOString(),
    screen_version: 'synthetic', wording: 'Synthetic transfer disclosure, no real consent.' }, sdp_offer: 'v=0\r\ns=SYNTHETIC\r\n' };
}
export function request(input = body(), extras = {}) {
  const { headers = {}, ...other } = extras;
  return new Request('https://relay.example/session', { method: 'POST', body: JSON.stringify(input),
    headers: { Origin: 'https://phone.example', Authorization: 'Bearer ' + tokens[input.user || 'joe'], 'Content-Type': 'application/json', ...headers }, ...other });
}
export class MemoryStorage {
  constructor() { this.rows = new Map(); this.alarm = null; this.tail = Promise.resolve(); this.failCommit = false; this.failPut = false; }
  async get(k) { return structuredClone(this.rows.get(k)); }
  async put(k, v) { if (this.failPut) throw Error('synthetic storage fault'); this.rows.set(k, structuredClone(v)); }
  async delete(k) { this.rows.delete(k); }
  async list({ prefix = '' } = {}) { return new Map([...this.rows].filter(([k]) => k.startsWith(prefix)).map(([k,v]) => [k,structuredClone(v)])); }
  async getAlarm() { return this.alarm; }
  async setAlarm(n) { this.alarm = n; }
  async deleteAlarm() { this.alarm = null; }
  transaction(fn) {
    const execute = async () => {
      const tx = new MemoryStorage(); tx.rows = structuredClone(this.rows); tx.alarm = this.alarm;
      const result = await fn(tx);
      if (this.failCommit) throw Error('synthetic commit failure');
      this.rows = tx.rows; this.alarm = tx.alarm; return result;
    };
    const result = this.tail.then(execute); this.tail = result.catch(() => {}); return result;
  }
}
