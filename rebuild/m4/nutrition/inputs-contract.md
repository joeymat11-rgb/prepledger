# Personal nutrition inputs — proposed factual wire v1

Status: bounded authoring at base `693b021f01d832a889f6933f2dcad2258431d808`.
This is an explicit proposed semantic contract, not a registered/accepted schema
or a plan transaction. Admission is tested before any product save is enabled.

The candidate uses one immutable complete assertion, `kind: "fact"`,
`class: "event"`, schema 2 to match the actual shared local-era lease. The
existing T2 producer-injected command constructs the standard A3 envelope; the
host supplies actual athlete/device/sequence/lease/commitment/effective context.
Payload is closed:

```text
{
  profile: "earned/nutrition-inputs/v1",
  type: "nutrition-input-assertion",
  interval: {start: YYYY-MM-DD, end: same YYYY-MM-DD},
  change: "assert" | "update" | "correction",
  supersedes: null | prior nutrition assertion op_id,
  inputs: {goal: Goal, existing_plan: ExistingPlan}
}
```

The interval dates the assertion event; it is not a claim that a physiological
policy lasts one day. Original effective date/time/offset stays in the envelope.
An initial `assert` has no superseded record; an `update` or `correction` names
one prior assertion in both `supersedes` and causal parents. Every assertion
contains both complete inputs. No generic scalar plan member carries this JSON.

`Goal` is exactly `{kind:"declared", statement:Text, phase:Text}`,
`{kind:"unknown"}`, or `{kind:"cleared", reason:Text}`. Phase is the athlete's
explicit words, not an inferred engine mode. Unmapped words cannot select recomp
or any other policy. Text is nonempty ordinary prose, never serialized records.

`ExistingPlan` is exactly `{kind:"unknown"}`, `{kind:"none"}` (the person says
they have no existing plan), `{kind:"cleared", reason:Text}`, or:

```text
{kind:"recorded", source:Text, agreed_date:YYYY-MM-DD,
 fields:{calories:Value, protein:Value, carbohydrate:Value, fat:Value}}
```

All four fields are required. A `Value` is exactly one of:

* `{kind:"target", amount:{value:Number, unit:Unit}}`
* `{kind:"minimum", amount:{value:Number, unit:Unit}}`
* `{kind:"range", lower:{value:Number,unit:Unit}, upper:{value:Number,unit:Unit}, lower_inclusive:Boolean, upper_inclusive:Boolean}`
* `{kind:"not_prescribed"}`
* `{kind:"unavailable", reason:Text}`

Number is finite and nonnegative; the unit is `kcal/day` for calories and `g/day`
for the three macros. A range is ordered and cannot be an empty open interval.
Unknown, cleared, no existing plan, unavailable field and not-prescribed field
are distinct. None means numeric zero. No target/minimum/range is derived from
another. There is no calorie allowance, ratio, body model or default phase.

Future save/read semantics: review binds one complete copied assertion and exact
repository revision/token. Supersession must remain within the same authenticated
athlete and nutrition profile. Concurrent unrelated heads are unresolved, never
combined field by field or selected by array order. An update retains the prior
record; a clear is another explicit complete assertion. A goal change must retain
the recorded plan's actual fields, source and agreed date unless the person also
explicitly changes that plan. Reads resolve authenticated original operations,
not derived cache, and must expose accepted and pending-local standing separately.

U1/U2 remain open: these factual assertions cannot become effective complete
intake plan groups by relabeling them. The later actual plan producer still needs
the complete leased intake-domain manifest, coupled fields/phase/policy selectors,
target/range/absence encoding, version normalization, actual accepted selection
and fallback, qualified policy applicability and the trusted W6 projection join.
Recorded agreement alone qualifies no advice. U3–U5 and the approved nutrition UI
remain subsequent connected work, not an indefinite factual-only release.

The current admission question is concrete: generic authority event shape requires
`type` and `interval`, but every schema-2 operation is additionally dispatched
through the installed closed profile. A passing generic shape or durable local
write is insufficient to assert registered nutrition-input admission. Any needed
authority/profile dispatch amendment is outside this brief's licensed files.
