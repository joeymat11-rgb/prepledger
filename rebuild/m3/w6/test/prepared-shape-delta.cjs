'use strict';
// Two disclosed literal edits to the commit-verified basic shape. Every other
// byte must still equal the accepted source. This is not a generic drift waiver.
module.exports=function acceptedPreparedShapeDelta(baseline,candidate){
 let expected=baseline.toString('utf8');
 const edits=[
  ['function validateWorkoutShape(input) {','function validateWorkoutShape(input, {prescriptionCapture} = {}) {'],
  ["  if (!keys(op, [...COMMON, ...fields]) || !fields.every(key => text(op[key]))) return invalid('INVALID_FIELDS');",`  const captured = op.kind === 'session-start' && prescriptionCapture !== undefined;
  if (!keys(op, [...COMMON, ...fields, ...(captured ? ['prescription_capture'] : [])]) || !fields.every(key => text(op[key]))) return invalid('INVALID_FIELDS');
  if (captured) {
    try {
      const value = op.prescription_capture;
      prescriptionCapture.prepare(value, {producer: value.producer, basis: value.basis});
      if (value.basis.plan_basis !== op.plan_basis) return invalid('CAPTURE_BASIS_MISMATCH');
    } catch { return invalid('INVALID_PRESCRIPTION_CAPTURE'); }
  }`]
 ];
 for(const [before,after]of edits){if(expected.split(before).length!==2)return false;expected=expected.replace(before,after);}
 return Buffer.from(expected).equals(candidate);
};
