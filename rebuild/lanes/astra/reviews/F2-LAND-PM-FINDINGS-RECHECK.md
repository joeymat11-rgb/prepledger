# F2-LAND PM findings: independent re-check
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412
Reviewed HEAD: 765a0f45873d96aedc2de94f568ff526fd8f46fb
Module SHA256: d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d

Measured with `git rev-parse HEAD` and `certutil -hashfile rebuild/m4/workout/setup-tags.cjs SHA256`.
Branch: rebuild/r-astra-f2-pm-findings. Hash measured before and after execution; identical.
`git diff --exit-code -- rebuild/m4/workout/setup-tags.cjs` exited 0 with no output.
Runtime: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
`--version` output: v24.19.0. No module mutation, receipt, commit or push.

## Exact synthetic fixtures and output notation

The two independently written scratch scripts required the original CJS module and dynamically
imported ENGINE_MG and REGION_MG from rebuild/m3/w7-preview/today/exercise-catalogue.mjs.
Table conclusions below are computed from those exports, not inferred from source text.
These definitions specify the inputs; copy means structuredClone, and each case starts fresh:

```js
const p = createSetupTagProjector({taxonomy:{muscles:ENGINE_MG,regions:REGION_MG}});
const E = {id:'row',n:'Row',mg:'back',day:'U',sets:3,hi:12,inc:5,steps:[5,10]};
const S = {athlete_label:'a',split:{from:'2026-09-19',map:{
  0:'REST',1:'U',2:'L',3:'REST',4:'U',5:'L',6:'REST'}},
  exercises:[E],priority_muscles:[]};
const T = {row:{head:'lats',secondary:[]}};
const C = {setup:S,tags:T,op_id:'probe',date:'2026-09-19'};
const A = ['reads','queue','feed','weekly','events','proposals',
  'agentProposals','adjustments','forecasts','accepted'];
const B = ['dailyLogs','sessionLog','retirements'];
const U = {athlete_label:'a',exercises:[{...E,w:null,forks:[]}],split:[S.split],
  priority_muscles:[],exOrder:{U:['row'],L:[]},sleep:{nights:[]},
  ...Object.fromEntries(A.map(k=>[k,[]])),...Object.fromEntries(B.map(k=>[k,{}]))};
const V = p.projectSetupTags(U,C);
```

Baseline validateSetupTags(S,T) returned true; projectSetupTags(U,C) and (V,C) returned states.
Below, INVALID is exactly name="Error", message="SETUP_TAGS_INVALID", code="SETUP_TAGS_INVALID".
RAW errors had code undefined (the probe serialized that as null). RETURN means no exception;
where only selected returned fields were printed, they are explicitly identified.

## P-F2-1: CONFIRMED, with additional exception paths

Most consequential added witnesses are plain-data inputs, not just hostile JavaScript objects:

| Exact change/input | Executed calls | Exact result |
| --- | --- | --- |
| s=copy(S); s.exercises[0].id={toString:null} | validateSetupTags(s,T); projectSetupTags(U,{...C,setup:s}) | RAW TypeError: Cannot convert object to primitive value |
| Same, id=Object.create(null) | Both calls above | Same RAW TypeError |
| Same, id={toString:{},valueOf:{}} | Both calls above | Same RAW TypeError |
| s={...S,extra:deep()} | validateSetupTags(s,T); projectSetupTags(U,{...C,setup:s}) | RAW RangeError: Maximum call stack size exceeded |
| state={...V,extra:deep()} | projectSetupTags(state,C) | Same RAW RangeError |
| s={...S,exercises:[null]} | validateSetupTags(s,T); projectSetupTags(U,{...C,setup:s}) | RAW TypeError: Cannot read properties of null (reading 'id') |
| s={...S,exercises:[42]} | Both calls above | INVALID |

`deep()` was exactly `let x=null; for(let i=0;i<20000;i++) x={x}; return x;`.
The first and third ID cases are representable by JSON. Object.hasOwn performs key coercion
at line 124 before checkExerciseTag validates id as text. The null witness's stack points to
check at setup-tags.cjs:124:21. Deep inputs overflow cloneData at 26:19 before shape refusal.
The invalid extra setup key should be refused; recursion instead escapes the named error channel.
These are additional exception-contract failures. None of these witnesses returned a state or true.
As a control, validateExerciseTags(null,T.row) and validateExerciseTags({...E,id:{toString:null}},T.row)
both produced INVALID: the single-exercise entry point does not have the early ID lookup.

### Required member matrix

For every v in [null,42,'x',true], I separately made each change below.
For setup/tag changes, both validateSetupTags(s,t) and projectSetupTags(U,{...C,setup:s,tags:t}) ran.
For state changes, projectSetupTags(u,C) ran with u=copy(V), so the nonempty-history shortcut
could not mask the member checks. There were 68 calls in this matrix.

| Change to a fresh copy | Result for all four v, except noted |
| --- | --- |
| s.exercises=[v] | INVALID, except null gives the RAW TypeError above in both calls |
| t.row.secondary=[v] | INVALID |
| s.exercises[0].steps=[v] | INVALID, except v=42 validates true |
| s.split.map[0]=v | INVALID |
| s.priority_muscles=[v] | INVALID, except v='x' validates true |
| u.exercises=[v] | INVALID |
| u.reads=[v] | INVALID |
| u.sleep.nights=[v] | INVALID |
| u.sessionLog={'2026-09-19':v} | INVALID |
| u.sessionLog={'2026-09-19':{entries:[v]}} | INVALID |
| u.workoutFacts={profile:'earned/workout-facts/v1',sessions:[v]} | INVALID |
| u.workoutFacts={profile:'earned/workout-facts/v1',sessions:[{effective:v}]} | INVALID |

The two validation returns are not null/type-guard bypasses: 42 is a positive step and 'x'
is nonempty text. Projection initially refused both because U still had the original values.
Follow-up with matching setup AND U steps=[42] returned a state whose steps printed `[42]`.
Matching setup AND U priority_muscles=['x'] returned a state whose priorities printed `["x"]`.
Thus this boundary does not enforce priority membership in ENGINE_MG. I have not established
that this is an F2 contract violation; do not claim it validates the entire setup domain.

### Long arrays and other JavaScript boundary cases

| Exact input/call | Exact result |
| --- | --- |
| validateSetupTags({...S,exercises:[{...E,steps:Array.from({length:100000},(_,i)=>i+1)}]},T) | true |
| Setup exercises: 99999 copies of E with id='r'+i (i=0..99998), then null; tags=Object.fromEntries of those IDs paired with T.row; validateSetupTags | RAW TypeError: Cannot read properties of null (reading 'id') |
| projectSetupTags({...V,reads:[...Array.from({length:99999},()=>({d:'2026-09-19'})),null]},C) | INVALID |
| validateSetupTags(new Proxy(S,{getPrototypeOf(){throw new Error('PROBE_TRAP')}}),T) | RAW Error: PROBE_TRAP |
| r=Proxy.revocable(S,{}); r.revoke(); validateSetupTags(r.proxy,T) | RAW TypeError: Cannot perform 'IsArray' on a proxy that has been revoked |
| validateSetupTags({exercises:[null]},null) | true |
| projectSetupTags(null,{tags:null})===null | true |

The last two are the explicit absent-tag identity path, not a present-tag acceptance bypass.
The long valid step list meets this module's rules; no size limit is asserted here.
Proxy exceptions are real additional non-named throws, but require executable/non-JSON callers.
Within these probes I found no malformed member ACCEPT where an F2 refusal was established as due.
I disagree with any broader inference that the null row is the only raw-error route.

## P-F2-2: CONFIRMED for the twin and the narrow unreachability claim

Invented projector q used exactly `{taxonomy:{muscles:['biceps'],
regions:{biceps:'biceps',biceps_long:'biceps'}}}`.
Set s=copy(S), s.exercises[0].mg='biceps', and tags={row:{head,secondary:[{mg:'biceps_long',lend:0.5}]}}.
q.validateSetupTags(s,tags): head=null produced INVALID; head='biceps' returned true.
For projection, also changed copy(U).exercises[0].mg='biceps' and used {...C,setup:s,tags}.
head=null produced INVALID. head='biceps' returned a state; selected row fields printed exactly:
`{"head":"biceps","secondary":[{"mg":"biceps_long","lend":0.5}]}`.

Computed shipped-table output:
`{"muscles":11,"regions":15,"identities":["abs","biceps","calves","forearms","glutes","hams","quads","triceps"],"identityWithSubregion":[]}`
Identities were ENGINE_MG.filter(m=>REGION_MG[m]===m); overlap filtered those identities for
Object.entries(REGION_MG).some(([r,g])=>g===m && r!==m). The claimed overlap is indeed absent.

### Same-muscle sibling credit IS reachable; exact self-bucket credit was refused

I enumerated every shipped muscle mg, each compatible head plus null, and every helper:
(1) `{mg:k,lend:0.5}` for k in the union of ENGINE_MG and REGION_MG keys;
(2) `{mg:m,lend:0.5,head:r}` for every [r,m] in REGION_MG.
Each used {...E,mg} and {head,secondary:[helper]} in validateExerciseTags.
Exact summary: tried=858, accepted=788, ownBucketAccepted=[], unexpected=[].
Here ownBucket meant effective target===head-or-mg OR effective target===mg.
36 accepts had REGION_MG[target]===mg: all ordered distinct sibling pairs among
back's [lats,upper_back,traps,lower_back] and delts' [delts_front,delts_side,delts_rear],
in both direct-region and explicit-head forms. No coarse or identity-headed same-muscle accepts.
The complete sweep also ran through matching setup/state validation and projection, printing:
`FULL_SWEEP {"cases":858,"setupTrue":788,"projectReturn":788,"namedRefusal":70,"mismatch":0}`.

Concrete shipped witnesses, using S/U and T.row.head='lats', with secondary=[helper]:

| helper | validateSetupTags and projectSetupTags |
| --- | --- |
| {mg:'upper_back',lend:0.5} | true and state; selected row: {"head":"lats","secondary":[{"mg":"upper_back","lend":0.5}]} |
| {mg:'back',lend:0.5,head:'upper_back'} | true and state; selected row: {"head":"lats","secondary":[{"mg":"back","lend":0.5,"head":"upper_back"}]} |
| {mg:'lats',lend:0.5} | INVALID |
| {mg:'back',lend:0.5,head:'lats'} | INVALID |
| {mg:'back',lend:0.5} | INVALID |

The PM's identity-head twin is unreachable with the shipped tables. A broader "no helper
can target any region of its own muscle" claim would be false: resolved sibling targets pass.
They are different buckets, explicitly permitted by the present conditional, not evidence that
the invented identity-head case is secretly shipped. I did not find an exact self-bucket bypass.

## What I did not verify

- No full conformance/CI, engine, downstream numerical credit, UI, persistence or caller reachability test.
- The enumeration covers compatible heads and both helper representations at lend=0.5, not every
  possible JS object, multiple-helper combination, allocation limit or recursion depth/runtime.
- No general theorem that every other malformed input receives the named refusal; the witnesses
  above already refute that property. Unknown priority text is reported without a domain-law verdict.
- No protected data, auth file, protected soak, receipt-writing tool or other worktree was accessed.
- Prior reviews were consulted only in selected excerpts; their wider coverage/verdicts were not re-certified.
- Both scratch scripts and their synthetic result files were removed from the OS temp directory.