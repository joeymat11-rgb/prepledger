'use strict';
// U-1 PROPOSAL ONLY. A new v2 control records a point of declared intent.
// Call after descriptor-safe common-envelope/source-kind validation; this is
// not an admission, source binding, clock attestation or historical-v1 decoder.
const V=require('../workout/edit-values.cjs');
function intervalFor(effective){
 V.need(V.effective(effective),'SOURCE_CONTROL_EFFECTIVE');
 const point=effective.local_date+'T'+effective.local_time+effective.utc_offset;
 return {start:point,end:point};
}
function assertV2(op){
 V.need(op?.schema_version===2,'SOURCE_CONTROL_TIME_VERSION');
 V.need(op.class==='event'&&op.kind==='fact'&&['source-import-intent','source-rollback-intent'].includes(op.payload?.type),'SOURCE_CONTROL_TIME_KIND');
 const expected=intervalFor(op.effective),actual=op.payload.interval;
 V.need(V.exact(actual,['start','end'])&&actual.start===expected.start&&actual.end===expected.end,'SOURCE_CONTROL_DECLARED_POINT');
 return expected;
}
module.exports={intervalFor,assertV2};
