import sans from './fonts/InstrumentSans-Variable.woff2';
import serif from './fonts/InstrumentSerif-Regular.woff2';
import sansLicense from './fonts/OFL-InstrumentSans.txt';
import serifLicense from './fonts/OFL-InstrumentSerif.txt';

// Static presentation assets only. The browser builder pins these four original
// files and embeds them; no runtime font request or athlete state is involved.
const installed=new WeakSet();
const css=`/* ${sansLicense}\n${serifLicense} */
@font-face{font-family:'Instrument Sans';font-style:normal;font-weight:400 700;font-display:swap;src:url('${sans}') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;font-display:swap;src:url('${serif}') format('woff2')}`;
export function installWorkoutTypography(document){
  if(installed.has(document))return;
  const style=document.createElement('style');style.setAttribute('data-earned-typography','');style.textContent=css;
  document.head.append(style);installed.add(document);
}
