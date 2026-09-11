// Explicit synthetic routine, entered only through the actual first-use controls.
// Catalogue press replaces the old synthetic-press fixture; workout quantities stay identical.
export async function completeVisibleOwnerSetup(page) {
  await page.getByRole('heading',{name:'Make it yours.',exact:true}).waitFor();
  await page.getByLabel('Your name',{exact:true}).fill('Synthetic browser owner');
  await page.getByLabel('Routine starts',{exact:true}).fill('2026-01-01');
  for(let i=0;i<7;i++) await page.locator('[name="day-'+i+'"]').selectOption('U');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByRole('button',{name:'Add an exercise',exact:true}).click();
  await page.getByLabel('Exercise',{exact:true}).selectOption('press');
  await page.getByLabel('Sets per session',{exact:true}).fill('2');
  await page.getByLabel('Rep ceiling',{exact:true}).fill('10');
  await page.getByLabel('Load increase (lb)',{exact:true}).fill('2.5');
  await page.getByLabel('Available loads (lb)',{exact:true}).fill('20, 22.5, 25, 30, 40');
  await page.getByLabel('This is my bilateral exercise.',{exact:false}).check();
  await page.getByRole('button',{name:'Add exercise',exact:true}).click();
  await page.getByLabel('These entries include my complete current routine',{exact:false}).check();
  await page.getByRole('button',{name:'Review routine',exact:true}).click();
  await page.getByRole('heading',{name:'Ready to save?',exact:true}).waitFor();
  await page.getByRole('button',{name:'Save my routine',exact:true}).click();
  await page.locator('[data-slot="instruction"]').waitFor();
  await page.locator('#today-status').filter({hasText:'routine is saved'}).waitFor();
}
