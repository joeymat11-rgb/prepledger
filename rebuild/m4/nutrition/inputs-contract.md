# Personal nutrition inputs — proposed factual wire v1

Status: bounded authoring at base `693b021f01d832a889f6933f2dcad2258431d808`.
This is an explicit proposed semantic contract, not a registered/accepted schema
or a plan transaction. Local construction and commit are tested before use. Hosted adoption remains separate under the brief amendment bab83aa.

The candidate uses one immutable complete assertion, `kind: "fact"`,
`class: "setup-note"`, schema 1 through the same accepted C1 mixed-schema route as weighIn on the schema-2 local-era lease. The
new narrow T2 nutritionInputs command constructs the standard A3 envelope; the
host supplies actual athlete/device/sequence/lease/commitment/effective context.
Payload is closed:

```text
{
  profile: "earned/nutrition-inputs/v1",
  text: ordinary goal statement, clear reason, or "Nutrition goal unknown.",
  change: "assert" | "update" | "correction",
  supersedes: null | prior nutrition assertion op_id,
  inputs: {goal: Goal, existing_plan: ExistingPlan}
}
```

The note text is ordinary human-readable setup prose. Structured fields stay in the typed payload; no JSON is embedded in text. Original effective date/time/offset stays in the envelope. An initial `assert` has no superseded record; an `update` or `correction` names
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

Local-era scope is explicit: hosted schema-1 adoption on a schema-2 lease is not claimed, exactly as with the accepted weighIn path. Generic setup-note shape is checked, but local save means committed on this device only. Setup-note avoids reclassifying a goal as a physiological event. Existing workout/read/reopen paths must remain usable after the assertion.
