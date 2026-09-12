import { AdmissionService, digest, unavailableResponse } from './admission.mjs';
import { createLiveSession, COMPANION_POLICY } from './provider.mjs';

export class CoachAdmission {
  constructor(ctx, env) {
    this.ctx = ctx; this.env = env;
    this.policySha = digest(JSON.stringify(COMPANION_POLICY));
  }
  async service() {
    return new AdmissionService({ storage: this.ctx.storage, env: this.env,
      createSession: createLiveSession, companionPolicySha: await this.policySha });
  }
  async fetch(request) { return (await this.service()).handle(request); }
  async alarm() { await (await this.service()).cleanup(); }
}

export default {
  async fetch(request, env) {
    try {
      // One global admission authority for BOTH users, never a client-selected id.
      const id = env.COACH_ADMISSION.idFromName('earned-coach-admission-v1');
      return await env.COACH_ADMISSION.get(id).fetch(request);
    } catch { return unavailableResponse(request, env); }
  },
};
