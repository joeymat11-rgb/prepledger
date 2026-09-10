'use strict';

// Read-only presentation over a trusted composed projection. The application
// must construct that projection with its authenticated reader, not user input.
function createHistoryPanel({document: doc, root, projection}) {
  if (!doc || root?.ownerDocument !== doc || typeof projection?.read !== 'function')
    throw TypeError('Document, owned root and trusted projection are required');
  let generation = 0, disposed = false;
  const node = (tag, text, className) => {
    const el = doc.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  const message = text => {
    const p = node('p', text, 'history-message');
    p.setAttribute('role', 'status'); root.replaceChildren(p);
  };
  const quantity = (q, unit) => q && typeof q === 'object' &&
    Number.isFinite(q.value) && q.unit === unit ? `${q.value} ${unit}` : 'Not recorded';
  const values = observations => `${quantity(observations?.load, 'lb')} · ${quantity(observations?.reps, 'rep')}`;
  const details = (title, text) => {
    const el = node('details'); el.append(node('summary', title), node('p', text)); return el;
  };
  function render(result) {
    if (!result?.verified) return node('p', 'History could not be verified. No records are shown.', 'history-message');
    const p = result.projection;
    if (!p || p.mode !== 'SUPPORTED_LEGACY_OBSERVATIONS_AT_CAPTURED_PREFIX' ||
        p.currency !== 'CAPTURED_PREFIX_ONLY' || result.decisionReady !== false || !Array.isArray(p.sets))
      return node('p', 'This history could not be interpreted. Your records have not been changed.', 'history-message');
    const section = node('section', undefined, 'history-panel');
    section.setAttribute('aria-label', 'Recorded sets');
    section.append(node('h2', 'Recorded sets'), node('p',
      'This is a recorded snapshot. It may not include newer entries. It does not determine your next workout.', 'history-context'));
    if (!p.sets.length) section.append(node('p', 'No set entries in this snapshot.'));
    for (const set of p.sets) {
      if (!set || !['INCLUDED', 'REMOVED', 'UNRESOLVED'].includes(set.state))
        throw TypeError('Unsupported set presentation');
      const card = node('article', undefined, 'history-set');
      const name = typeof set.lift === 'string' && set.lift.trim() ? set.lift : 'Exercise not identified';
      card.append(node('h3', name));
      const status = set.state === 'UNRESOLVED' ? 'Needs review' : set.state === 'REMOVED' ? 'Removed entry' :
        set.effects.length ? 'Corrected entry' : 'Recorded entry';
      card.append(node('p', status, 'history-state'));
      if (set.state === 'INCLUDED') card.append(node('p', values(set.observations), 'history-values'));
      else card.append(node('p', set.state === 'REMOVED' ?
        'The original entry remains in history. No set value is shown as active.' :
        'The recorded changes do not establish one set value. No corrected value is shown.'));
      card.append(node('p', 'Effort: not recorded. Plan basis: not recorded.', 'history-context'));
      if(set.issues?.length){
        const context=node('details');context.append(node('summary','Record context'));
        const descriptions={
          UNSUPPORTED_SESSION_CLASS:'This entry uses an unsupported record format.',
          MISSING_OR_UNSUPPORTED_START_REFERENCE:'The workout linked to this entry could not be confirmed.',
          UNINTERPRETED_SET_FIELDS:'This entry includes details that are not interpreted.',
          UNSUPPORTED_SET_OBSERVATIONS:'The original load or repetitions could not be interpreted.',
          UNSUPPORTED_OPERATION_SHAPE:'Some entry fields cannot be interpreted.',
          UNSUPPORTED_SCHEMA_VERSION:'This entry uses an unsupported record version.'
        };
        const messages=new Set(set.issues.map(i=>descriptions[i.code]||'Some recorded context is missing or not interpreted.'));
        for(const text of messages)context.append(node('p',text));
        card.append(context);
      }
      card.append(details('Original entry', values(set.original)));
      if (set.effects.length) {
        const changes = node('details'); changes.append(node('summary', 'Recorded changes'));
        const list = node('ol');
        for (const effect of set.effects) {
          const o = effect.operation;
          const li = node('li');
          // Original operation text remains text; never HTML or active links.
          li.append(node('p', o.kind === 'tombstone' ? 'Removal recorded' : 'Change recorded'));
          if (o.kind === 'tombstone' && typeof o.payload?.reason === 'string')
            li.append(node('p', o.payload.reason));
          else {
            const fields = o.payload?.replacement_fields;
            if (fields && typeof fields === 'object') {
              if (Object.hasOwn(fields, 'load')) li.append(node('p', `Load: ${quantity(fields.load, 'lb')}`));
              if (Object.hasOwn(fields, 'reps')) li.append(node('p', `Reps: ${quantity(fields.reps, 'rep')}`));
              if (Object.keys(fields).some(k => !['load', 'reps'].includes(k)))
                li.append(node('p', 'Additional change needs review.'));
            } else li.append(node('p', 'This change needs review.'));
          }
          list.append(li);
        }
        changes.append(list); card.append(changes);
      }
      section.append(card);
    }
    const issues = [...(result.recorded?.issues || []),
      ...(result.recorded?.events || []).flatMap(e => e.readerIssues || [])];
    if (issues.length) section.append(node('p',
      'Some recorded context is missing or unsupported. These entries are not a complete or qualified workout summary.', 'history-context'));
    return section;
  }
  return Object.freeze({
    async open(input) {
      if (disposed) return {painted: false, reason: 'DISPOSED'};
      const mine = ++generation;
      // Clear former account/snapshot truth before starting any async read.
      root.setAttribute('aria-busy', 'true'); message('Checking recorded history…');
      try {
        const result = await projection.read(structuredClone(input));
        if (disposed || mine !== generation) return {painted: false, reason: 'SUPERSEDED'};
        const content = render(result);
        root.replaceChildren(content);
        return {painted: true, verified: result?.verified === true};
      } catch {
        if (disposed || mine !== generation) return {painted: false, reason: 'SUPERSEDED'};
        message('History is unavailable. No records are shown.');
        return {painted: true, verified: false};
      } finally {
        if (!disposed && mine === generation) root.removeAttribute('aria-busy');
      }
    },
    clear() {
      generation++; root.removeAttribute('aria-busy'); root.replaceChildren();
    },
    dispose() {
      disposed = true; generation++; root.removeAttribute('aria-busy'); root.replaceChildren();
    }
  });
}
module.exports = {createHistoryPanel};
