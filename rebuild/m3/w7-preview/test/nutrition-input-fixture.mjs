import { openTodayInstallation } from '../../w6/local/today-bindings.mjs';
import { createLocalCalendar } from '../../w6/local/calendar.mjs';
import { createNutritionInputModel } from '../today/nutrition-input-model.mjs';
export const day = '2026-09-12';
export const setup = { athlete_label: 'Synthetic form athlete', split: { from: day, map: { 0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'U',6:'REST' } }, exercises: [{ id:'form-press',n:'Synthetic press',mg:'chest',day:'U',sets:1,hi:10,inc:5,steps:[20,25,30,35,40] }],priority_muscles:[] };
export async function createFormFixture({ indexedDB, crypto } = {}) {
  let now = `${day}T10:15:00Z`, offset = 0;
  const calendar = createLocalCalendar({ now: () => new Date(now), offsetMinutes: () => offset });
  let installation;
  try { installation = await openTodayInstallation({ indexedDB, crypto, calendar, day, enroll:false }); }
  catch (error) { if (error.code !== 'LOCAL_FIRST_RUN') throw error; installation = await openTodayInstallation({ indexedDB, crypto, calendar, day, initialSetup:setup }); }
  let model = createNutritionInputModel({ installation, calendar }); await model.load();
  return { calendar, get installation(){return installation;},get model(){return model;},setNow(value, zone = offset){now=value;offset=zone;},
    async reopen(){model.close();installation.close();installation=await openTodayInstallation({indexedDB,crypto,calendar,day:calendar.sample().day});model=createNutritionInputModel({installation,calendar});await model.load();},
    async read(){return installation.readNutritionInputs();},async generation(){return installation.generation();},
    async weigh(){const host=await installation.createReadingHost({day:calendar.sample().day});try{return await host.weighIn({date:calendar.sample().day,lb:172});}finally{host.close();}},
    close(){model.close();installation.close();} };
}
export function fillRecorded(model) {
  const fields = { 'goal.kind':'declared','goal.statement':'Build strength steadily.','goal.phase':'My maintenance phase','existing_plan.kind':'recorded','existing_plan.source':'My written agreement','existing_plan.agreed_date':day,
    'existing_plan.fields.calories.kind':'target','existing_plan.fields.calories.amount':'2175',
    'existing_plan.fields.protein.kind':'minimum','existing_plan.fields.protein.amount':'135',
    'existing_plan.fields.carbohydrate.kind':'range','existing_plan.fields.carbohydrate.lower':'190','existing_plan.fields.carbohydrate.upper':'245','existing_plan.fields.carbohydrate.lower_inclusive':'true','existing_plan.fields.carbohydrate.upper_inclusive':'false',
    'existing_plan.fields.fat.kind':'not_prescribed' };
  for(const [path,value] of Object.entries(fields))model.update(path,value);
}
