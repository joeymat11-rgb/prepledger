'use strict';
// LANE B successor for the accepted parent carrier inherited-carriers (DECISIONS:113 (1)).
// It LOADS rebuild/m4/spec/native-carriers-inherited-carriers.cjs — the parent's own original
// body, sha-verified against the parent execution pin and against the Git blob at the
// parent acceptance commit — and executes it against this child's bytes in a private
// module. No original is copied here and none is skipped; the only text substitutions
// are the ones b-ntc-successors.cjs enumerates and packages/B-NTC.json repeats verbatim.
require('./b-ntc-successors.cjs').run('inherited-carriers');
