# C: memory consent and programme admission under PM204

Source-inspection note at 9a4fe2148f0ae526fa5f0875ce4f9d201765551a; read MEMORY-DESIGN-JUDGMENT.md first. Paths below are under rebuild/.
No product/test mutation, test/gate execution or private/history/soak read. This note does not block launch, phone trial or N2 and grants no implementation custody.

Smallest existing positive candidate: one active exercise's inferred machine-weight ladder, using recorded loads rather than a new adaptation rule.
engine/progression.cjs:310 proposeLadder requires the existing sample/gap rules and returns {exId,n,rungs,gaps,n_obs,inc,uneven:true}; :346/:360 loadRungs/nextLoad use the ladder.
engine/writers.cjs:129 sweepLadders issues the actual proposal, including its engine why and apply:{kind:"ladder",exId,rungs}; :2120/:2203 applyProposal clones state, applies steps/stepsAt, snaps working weight, stamps wAt and resolves the proposal. It does not persist.
Public source witness only: engine/test/writers-differential.cjs:50 has real sweep/application assertions for recorded synthetic loads [70,82,95,100] with inc5. I read it; I did not execute it.
coach/tools.cjs:788-791 currently takes bare proposeLadder output; its l.why||l.t||null yields no reason from that return shape. Bind the actual sweep-issued body/identity/reason rather than inventing one.

Current coach acceptance is not a durable positive application path.
coach/tools.cjs:406-408 holds issued/accepted Maps and consentLedger in memory; :799 freezes the engine result, :831 requires {proposal_id,confirmed:true} and a known issued id/provider.
At :847 it calls consent.respond(id,"accept") synchronously, without await; :853 separately calls recordIssuance({id,accepted:true,instance:null}). Durable commit completion and immutable body/reason storage are absent.
coach/local-world.mjs:192-195/:263 defaults to a synthetic local installation and consent=null; it does not join today's real phone consent to authority application. TOOL-CONTRACT.md:336-360 names this staging gap.

The real staged seam is narrower than the coach's assumed provider.
m3/w6/t2-stage.cjs:9 and local/local-client.mjs:49/:347 accept only weighIn,logSet,logSession,finishSession,workout; respond is LOCAL_COMMAND_UNSUPPORTED.
local/local-client.mjs:395 and local/host-bindings.mjs:229/:251/:261 can select workoutCommands; client/index.cjs:206-228 requires schemaVersion:2 plus synchronous prepare/validate, protects the op envelope and refuses Promise producers.
client/index.cjs:248 commits op(s), outbox and device sequence in one transaction. public-client.mjs:256-265 checks staged schema against the lease before sealing; a second arbitrary issuance/plan write is not supplied by that producer interface.
local/host-bindings.mjs:66/:298 admits only its three observation kinds and refuses inbound authority records with LOCAL_ERA_NO_INBOUND; allowInbound in the stage does not bypass that guard.
authority/admit.cjs:99-113 also requires the matching workoutProfile shape/reference/relation validation for schema2. A client-side producer is not authority admission; m4/workout/authority-profile.cjs is not proved for a new decision profile.

Existing payloads and actual application must be joined deliberately.
client/index.cjs:265/:271 writes class:"plan",kind:"proposal-response",payload:{proposal_id,answer:"accept"}. authority/validate.cjs:57 instead requires payload:{issuance_id,chosen_outcome_id,consent_digest}, with outcome exactly APPLY|KEEP|NO.
authority/validate.cjs:8-15/:45 rejects raw numeric leaves: quantities need {value,unit}. A full engine snapshot/rung array needs an accepted typed representation or proved lossless canonical encoding, not blind attachment of its JSON.
authority/issue.cjs:20 records trusted issuance_id, proposal_family_id, evidence_generation, offer_digest, computed_through_watermark, apply_members and conflict-domain identities. The coach's transient issuance is not mapped to it.
authority/admit.cjs:125 records an accepted response; issue.cjs:90 apply({apply_request_id,response_op_id}) separately checks basis/frontier/conflicts and :135 calls Plan.appendConsented with issuance.apply_members||[]. An effective outcome with zero members does not prove a changed programme.
authority/plan.cjs:177 persists that plan transaction. authority/README.md:89-99 explicitly leaves policy/full consent validation to trusted callers; reduce.cjs:10-22 exports receipt entries/W, not issuance/instance/effect collections.

Old and new readers currently diverge.
client/index.cjs:75 restores model.issuances from its separate collection; :338 recordIssuance writes separately; :339 issuedInstance and face.cjs:103 consume that model. Response-history reconstruction alone will not feed them.
index.cjs:161 answers reads proposal_id/answer; :148/:155 acceptedPlan/livePlan use snapshot/applied/accepted plan records, while :192 onFold folds plan-mutation, not generic proposal-response. t2-stage.cjs:67-70 feeds snapshot entries, not derived plan restoration.
Actual workout state must reach m3/w6/local/today-bindings.mjs:308-369, host/workout-host.mjs:198-199 and m4/workout/source-projection.cjs:37-55 with its valid source basis after reopening.
coach/wave1-tools.cjs:113-115 calls reasons.forTopic without await and requires {why,source}; the proposed asynchronous memory reader and joined old/new issuance consumer are not implemented.

Minimum positive witness owed: real eligible ladder issuance -> explicit yes bound to immutable body/revision -> one coordinated durable decision/application outcome -> close/reopen the actual hosts -> identical accepted reason/status across legacy/new views and the changed exercise.steps, working weight and applicable nextLoad/gym prescription.
Missing: typed issuance/body encoding and digest binding, staged async consent completion, authoritative apply-members/programme mapping, durable restart projection and coherent legacy/new consumers. Storage alone and a planted consent provider cannot close M10/J6.
E must name the exact released paths and B's pin/CI route for that join; client/P6 custody remains PM's, live coach/Today remains C's, and engine effects retain their existing package rules. This is a source-supported candidate, not an admitted or delivered positive path.
