/* P2 S3 IMPORT JOIN, lane C consumer (GATE-AUDIT-SPEC-P2 finding 1).
   THE ADMITTED IMPORT IS THE ATHLETE'S OWN BASIS.

   rebuild/m3/w6/local/source-admission.mjs commits an admitted import as
   metadata.localSourceApplication plus collections.derived.localSource, and
   writes no new ops. P0-B's adoption path (today-app.cjs adoptAthleteState ->
   today-model.cjs adoptBasis) replaces the basis operations are replayed onto.
   This module is the one join between them: it reads the committed import out
   of the SAME generation the setup host already authenticated, proves it is an
   admitted one belonging to this installation and to this athlete, and returns
   its replayed state so today-app can adopt it exactly the way it adopts
   setup.athleteState(). It writes nothing, mints nothing, and on any doubt at
   all returns null, which leaves the existing clean-init path untouched.

   rebuild/m3/w6/local/today-bindings.mjs is pinned and is not edited: this
   module reads through `setup.host.repository`, the member that binding
   already exposes. */
/* A replayed engine state, not a view model: what the admitted import actually
   replayed, cloned so no caller can reach the durable record through it. */
const clone=value=>JSON.parse(JSON.stringify(value));
/* Key-order-independent identity, so that three copies of one committed record
   are compared as records. It is deliberately not the import lane's own encode:
   nothing from rebuild/m4/import belongs in the page this module ships in. A
   value this cannot express refuses, which only ever withholds an adoption. */
function identity(value){
 if(value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number')return JSON.stringify(value)??'null';
 if(Array.isArray(value))return '['+value.map(identity).join(',')+']';
 if(!value||typeof value!=='object')return 'null';
 return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+identity(value[k])).join(',')+'}';
}

export function admittedLocalSourceBasis(generation,{athleteLabel=null,namespace=null}={}){
 const metadata=generation&&generation.metadata,collections=generation&&generation.collections;
 const marker=metadata&&metadata.localSourceApplication,sources=metadata&&metadata.localSources;
 const derived=collections&&collections.derived&&collections.derived.localSource;
 if(!marker||!sources||!derived||!derived.view||!derived.basis)return null;
 /* ADMITTED, not merely reviewed or pending: the commit marker names the active
    selection, the view is ready, and the replay raised no unresolved issue. */
 if(marker.core_complete!==true||!marker.selection_id||sources.active!==marker.selection_id)return null;
 const view=derived.view;
 if(view.ready!==true||view.pending===true||(Array.isArray(view.issues)&&view.issues.length))return null;
 /* The committed basis, the marker's basis and the view's own basis are one
    record. A generation whose three copies disagree is not an admitted import. */
 if(identity(derived.basis)!==identity(marker.basis)||identity(view.basis)!==identity(derived.basis))return null;
 if(namespace&&derived.basis.installation_id!==namespace)return null;
 const state=view.state;
 if(!state||typeof state!=='object'||Array.isArray(state)||!Array.isArray(state.exercises))return null;
 /* WHOSE NUMBERS. today-app.cjs's SETUP_NOT_HIS_NUMBERS predicate compares the
    basis label with the label this installation's first run recorded. An import
    that does not carry the same label is NOT adopted here: painting it would
    either show a stranger's numbers as his, or show his own imported numbers
    under the sentence that says they are a sample. Either way the screen would
    be lying, so this returns null and the clean-init path stands. */
 /* P3-REAL-SHAPE (DECISIONS:520 option A, accepted :521). THIS IS NOW THE LAST
    GUARD, NOT THE FIRST, and the line itself is unchanged. An admitted import
    always carries a label: a file that named someone else was refused BY THAT
    NAME at source-admission.mjs P-LABEL, and a file that named nobody - which
    is every old-app file, the population this ticket exists for - took this
    installation's own first-run label when it was admitted
    (source-admission.mjs replay(), spec 2.4). Reaching the return below
    therefore means a generation was assembled by something other than the
    admission path, and withholding the adoption is still the right answer.
    BEFORE THAT CHANGE this line was the reason a fully admitted real-shape
    import was SILENTLY not adopted: the owner saw a successful import and the
    setup document's numbers the next morning, with nothing on screen to read. */
 if(athleteLabel&&state.athlete_label!==athleteLabel)return null;
 return clone(state);
}

/* The read half, for a caller holding the setup entry today-entry.mjs returns.
   Any refusal, absence or unreadable record is null: this never throws into the
   adoption chain and never becomes a reason Today fails to paint. */
export async function admittedLocalSourceState(setup){
 try{
  const host=setup&&setup.host;
  const repository=host&&host.repository;
  if(!repository||typeof repository.load!=='function')return null;
  const loaded=await repository.load();
  const label=setup&&typeof setup.athleteLabel==='function'?setup.athleteLabel():null;
  return admittedLocalSourceBasis(loaded&&loaded.generation,{athleteLabel:label,namespace:host.namespace||null});
 }catch(_){return null;}
}
