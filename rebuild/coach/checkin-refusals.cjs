"use strict";

const CHECKIN_SOURCE_UNAVAILABLE = Object.freeze({ ok: false, code: 'CHECKIN_SOURCE_UNAVAILABLE', copy: 'The check-in could not be read on this device. Nothing was recorded.' });
const SLEEP_NIGHT_CHANGED = Object.freeze({ ok: false, code: 'SLEEP_NIGHT_CHANGED', copy: 'This night changed while you were editing. Review the saved record before trying again. Nothing was recorded.' });

module.exports = { CHECKIN_SOURCE_UNAVAILABLE, SLEEP_NIGHT_CHANGED };
