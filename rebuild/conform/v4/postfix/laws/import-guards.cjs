'use strict';
// Required case inventory only. No owner disposition or accepted behavior/delta
// brief exists. These functions cannot return GREEN or act as a repair control.
const definitions=[
  ['D33','V4-guard-record-identities-and-sets','BRIEF-POSTFIX-GATE.md §4 D33',
    ['unchanged','additive','replaced-read-day','unfiled-nested-set-loss','duplicate-read-fold','real-filed-correction','unrelated-correction','malformed-correction','missing-correction','insufficient-correction','derived-feed-exception','permanent-op-exception','missed-day-exception','restore-preimages-both-directions','ghSync-host','repeated-delivery'],
    ['counts-only','missing-correction-coverage','deny-all'],
    'Await explicit D33 disposition and the reviewed real correction-coverage algorithm and host/delta assertions.'],
  ['D34','V4-pristine-compares-record-content','BRIEF-POSTFIX-GATE.md §4 D34',
    ['unmodified-SEED-migrate-null','settled-synthetic-starter','changed-reads','changed-sleep','changed-daily-logs','changed-session-log','key-order-only','added-record','fresh-marker-created','edited-no-marker','write-retains-marker','explicit-clear-OR-eligibility'],
    ['coarse-fingerprint','never-pristine','object-key-order'],
    'Await explicit D34 disposition, compared/derived family boundary and real boot/marker host assertions.'],
  ['D35','V4-unknown-schema-return-untouched','BRIEF-POSTFIX-GATE.md §4 D35',
    ['future-schema-identity-fields-aliases','future-schema-zero-heal-settle-patch-clock-id-draft','supported-v1','supported-v2','every-patch-era','current-schema','fresh-seed','supported-idempotence','restore-composition'],
    ['heal-before-version','identity-return-all-versions'],
    'Await explicit D35 disposition and exact supported-version/composition/delta cases.']
];
const laws=definitions.map(([defect,id,cite,requiredCases,requiredMutants,reason])=>Object.freeze({
  id,defect,cite,expect:'GREEN',implementation:'PENDING',requiredCases,requiredMutants,
  run(){throw Object.assign(new Error(reason),{code:'THEME-CASES-PENDING'});},mutant:[]
}));
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
