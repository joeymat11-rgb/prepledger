# CROSSINGS - the machine census over the codemod's output

Measured by scope analysis (acorn 8 + eslint-scope 8) over the six files `cut.cjs`
writes. A row is a reference that resolves to no declaration in the file it sits in:
the cut stranded it, so it is a crossing and the interface has to carry it.

Worktree: `/home/claude/farm/scratch/wt/split-tip`

| crossings | distinct names | unresolved and not declared in the source file either |
|---|---|---|
| 282 | 100 | 0 |

## By class

| class | rows |
|---|---|
| released reads a sealed binding | 119 |
| released calls a sealed function | 42 |
| sealed calls a released function | 34 |
| module-constant (a require or a copy constant: the sealed module re-requires it) | 33 |
| sealed reads a released binding | 29 |
| RELEASED ASSIGNS A SEALED BINDING | 25 |

## RELEASED -> SEALED

| name | kind | source | sits in | declared in | declared at |
|---|---|---|---|---|---|
| `ALREADY_RECORDED` | read | `today-model.cjs:455` | RELEASED-body | TM-S01 | `:365` |
| `FORM_MAX` | read | `today-model.cjs:455` | RELEASED-body | TM-S01 | `:372` |
| `FORM_MIN` | read | `today-model.cjs:455` | RELEASED-body | TM-S01 | `:372` |
| `OUT_OF_RANGE` | read | `today-model.cjs:455` | RELEASED-body | TM-S01 | `:373` |
| `adoptAthleteState` | call | `today-app.cjs:2333` | TA-M11 | TA-S37 | `:2490` |
| `adoptionSettled` | read | `today-app.cjs:770` | RELEASED-body | TA-S21 | `:767` |
| `armAdoptionGate` | call | `today-app.cjs:2323` | TA-M11 | TA-S35 | `:2434` |
| `canAdoptAthleteState` | call | `today-app.cjs:2322` | TA-M11 | TA-S35 | `:2430` |
| `checkInKit` | read | `today-app.cjs:1438` | RELEASED-body | TA-S14 | `:551` |
| `checkInKit` | read | `today-app.cjs:1439` | RELEASED-body | TA-S14 | `:551` |
| `checkInKitLoading` | read | `today-app.cjs:2562` | TA-M14 | TA-S14 | `:552` |
| `checkInLive` | read | `today-app.cjs:1406` | TA-M06 | TA-S14 | `:555` |
| `checkin` | read | `today-app.cjs:1406` | TA-M06 | TA-S02 | `:370` |
| `checkin` | read | `today-app.cjs:2182` | RELEASED-body | TA-S02 | `:370` |
| `checkin` | read | `today-app.cjs:2347` | RELEASED-body | TA-S02 | `:370` |
| `checkin` | read | `today-app.cjs:2351` | TA-M12 | TA-S02 | `:370` |
| `checkin` | read | `today-app.cjs:2365` | TA-M13 | TA-S02 | `:370` |
| `checkinSummary` | call | `today-app.cjs:2251` | RELEASED-body | TA-S02 | `:371` |
| `firstRun` | call | `today-app.cjs:678` | RELEASED-body | TA-S02 | `:384` |
| `firstRun` | call | `today-app.cjs:991` | RELEASED-body | TA-S02 | `:384` |
| `firstRun` | call | `today-app.cjs:2114` | RELEASED-body | TA-S02 | `:384` |
| `firstRun` | call | `today-app.cjs:2135` | RELEASED-body | TA-S02 | `:384` |
| `firstRun` | call | `today-app.cjs:2288` | RELEASED-body | TA-S02 | `:384` |
| `firstRun` | call | `today-app.cjs:2451` | RELEASED-body | TA-S02 | `:384` |
| `foodLane` | read | `today-app.cjs:1165` | RELEASED-body | TA-S04 | `:410` |
| `foodLane` | read | `today-app.cjs:1220` | RELEASED-body | TA-S04 | `:410` |
| `foodLane` | read | `today-app.cjs:2245` | RELEASED-body | TA-S04 | `:410` |
| `foodLaneFailure` | read | `today-app.cjs:1181` | RELEASED-body | TA-S04 | `:415` |
| `foodLaneFailure` | read | `today-app.cjs:1182` | RELEASED-body | TA-S04 | `:415` |
| `foodOpening` | read | `today-app.cjs:2557` | TA-M14 | TA-S04 | `:411` |
| `foodReadBack` | read | `today-app.cjs:1252` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1253` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1254` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1256` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1258` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1261` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1262` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1263` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1267` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1268` | RELEASED-body | TA-S04 | `:421` |
| `foodReadBack` | read | `today-app.cjs:1269` | RELEASED-body | TA-S04 | `:421` |
| `foodSaving` | write | `today-app.cjs:1269` | RELEASED-body | TA-S04 | `:412` |
| `foodSaving` | write | `today-app.cjs:1272` | RELEASED-body | TA-S04 | `:412` |
| `foodSaving` | read | `today-app.cjs:2557` | TA-M14 | TA-S04 | `:412` |
| `importAdmitted` | read | `today-app.cjs:737` | RELEASED-body | TA-S20 | `:689` |
| `importAdmitted` | read | `today-app.cjs:2556` | TA-M14 | TA-S20 | `:689` |
| `importDeps` | call | `today-app.cjs:711` | TA-M02 | TA-S20 | `:691` |
| `importScreen` | read | `today-app.cjs:711` | TA-M02 | TA-S20 | `:688` |
| `importScreen` | write | `today-app.cjs:711` | TA-M02 | TA-S20 | `:688` |
| `importScreen` | read | `today-app.cjs:718` | TA-M03 | TA-S20 | `:688` |
| `importScreen` | read | `today-app.cjs:719` | TA-M03 | TA-S20 | `:688` |
| `importScreen` | read | `today-app.cjs:2556` | TA-M14 | TA-S20 | `:688` |
| `loadCheckInKit` | call | `today-app.cjs:1435` | TA-M07 | TA-S15 | `:556` |
| `measureDeps` | call | `today-app.cjs:652` | TA-M01 | TA-S19 | `:631` |
| `measureScreen` | read | `today-app.cjs:652` | TA-M01 | TA-S19 | `:628` |
| `measureScreen` | write | `today-app.cjs:652` | TA-M01 | TA-S19 | `:628` |
| `measureScreen` | read | `today-app.cjs:653` | RELEASED-body | TA-S19 | `:628` |
| `openFoodLane` | call | `today-app.cjs:1180` | RELEASED-body | TA-S18 | `:593` |
| `openFoodLane` | call | `today-app.cjs:2245` | RELEASED-body | TA-S18 | `:593` |
| `openSettingsLane` | call | `gym-app.mjs:246` | RELEASED-body | GA-S04 | `:158` |
| `openSleepLane` | call | `today-app.cjs:1492` | RELEASED-body | TA-S13 | `:510` |
| `openSleepLane` | call | `today-app.cjs:1951` | RELEASED-body | TA-S13 | `:510` |
| `readSleepCheckIn` | call | `today-app.cjs:1435` | TA-M07 | TA-S27 | `:1410` |
| `readSleepCheckIn` | call | `today-app.cjs:1489` | RELEASED-body | TA-S27 | `:1410` |
| `ready` | read | `today-app.cjs:668` | RELEASED-body | TA-S38 | `:2550` |
| `ready` | write | `today-app.cjs:2333` | TA-M11 | TA-S38 | `:2550` |
| `ready` | read | `today-app.cjs:2335` | TA-M11 | TA-S38 | `:2550` |
| `ready` | read | `today-app.cjs:2576` | TA-M14 | TA-S38 | `:2550` |
| `reboundCheckIn` | call | `today-app.cjs:2349` | TA-M12 | TA-S32 | `:1964` |
| `recordIntake` | call | `today-app.cjs:1272` | RELEASED-body | TA-S23 | `:1278` |
| `recordSleep` | call | `today-app.cjs:1721` | RELEASED-body | TA-S30 | `:1807` |
| `reopen` | read | `today-model.cjs:426` | RELEASED-body | TM-S03 | `:401` |
| `retryFoodRead` | call | `today-app.cjs:1269` | RELEASED-body | TA-S24 | `:1324` |
| `retrySleepRead` | call | `today-app.cjs:1667` | RELEASED-body | TA-S29 | `:1727` |
| `session` | call | `today-app.cjs:887` | RELEASED-body | TA-S01 | `:365` |
| `settingsLane` | read | `gym-app.mjs:246` | RELEASED-body | GA-S01 | `:123` |
| `settingsLane` | read | `gym-app.mjs:305` | GA-M01 | GA-S01 | `:123` |
| `settingsLane` | read | `gym-app.mjs:572` | RELEASED-body | GA-S01 | `:123` |
| `settingsOpening` | read | `gym-app.mjs:571` | RELEASED-body | GA-S01 | `:124` |
| `settingsRead` | read | `gym-app.mjs:251` | RELEASED-body | GA-S02 | `:138` |
| `settingsRead` | read | `gym-app.mjs:252` | RELEASED-body | GA-S02 | `:138` |
| `settingsRead` | read | `gym-app.mjs:316` | GA-M01 | GA-S02 | `:138` |
| `settingsRead` | read | `gym-app.mjs:576` | RELEASED-body | GA-S02 | `:138` |
| `settingsReading` | read | `gym-app.mjs:575` | RELEASED-body | GA-S02 | `:140` |
| `settingsSaving` | write | `gym-app.mjs:279` | RELEASED-body | GA-S01 | `:125` |
| `settingsSaving` | read | `gym-app.mjs:570` | RELEASED-body | GA-S01 | `:125` |
| `settleAdoption` | call | `today-app.cjs:2333` | TA-M11 | TA-S22 | `:775` |
| `setup` | read | `today-app.cjs:2151` | RELEASED-body | TA-S02 | `:376` |
| `setup` | read | `today-app.cjs:2152` | RELEASED-body | TA-S02 | `:376` |
| `setup` | read | `today-app.cjs:2182` | RELEASED-body | TA-S02 | `:376` |
| `setup` | read | `today-app.cjs:2184` | RELEASED-body | TA-S02 | `:376` |
| `setup` | read | `today-app.cjs:2199` | RELEASED-body | TA-S02 | `:376` |
| `setup` | read | `today-app.cjs:2301` | TA-M11 | TA-S02 | `:376` |
| `setupFirst` | read | `today-app.cjs:2451` | RELEASED-body | TA-S03 | `:392` |
| `sleepAck` | read | `today-app.cjs:1517` | RELEASED-body | TA-S06 | `:441` |
| `sleepAck` | write | `today-app.cjs:1542` | TA-M08 | TA-S06 | `:441` |
| `sleepAck` | read | `today-app.cjs:2566` | TA-M14 | TA-S06 | `:441` |
| `sleepBusy` | read | `today-app.cjs:1535` | RELEASED-body | TA-S07 | `:454` |
| `sleepBusy` | read | `today-app.cjs:1574` | RELEASED-body | TA-S07 | `:454` |
| `sleepBusy` | read | `today-app.cjs:1599` | RELEASED-body | TA-S07 | `:454` |
| `sleepBusy` | read | `today-app.cjs:1706` | RELEASED-body | TA-S07 | `:454` |
| `sleepBusy` | read | `today-app.cjs:1715` | RELEASED-body | TA-S07 | `:454` |
| `sleepBusy` | read | `today-app.cjs:1720` | RELEASED-body | TA-S07 | `:454` |
| `sleepCheckInDay` | read | `today-app.cjs:1404` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInDay` | read | `today-app.cjs:1405` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInDay` | write | `today-app.cjs:2297` | TA-M10 | TA-S09 | `:472` |
| `sleepCheckInFailed` | read | `today-app.cjs:1404` | RELEASED-body | TA-S09 | `:473` |
| `sleepCheckInFailed` | read | `today-app.cjs:1438` | RELEASED-body | TA-S09 | `:473` |
| `sleepCheckInFailed` | read | `today-app.cjs:1638` | RELEASED-body | TA-S09 | `:473` |
| `sleepCheckInFailed` | read | `today-app.cjs:1663` | RELEASED-body | TA-S09 | `:473` |
| `sleepCheckInPending` | read | `today-app.cjs:1404` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInPending` | read | `today-app.cjs:1638` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInPending` | read | `today-app.cjs:1647` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInPending` | write | `today-app.cjs:2297` | TA-M10 | TA-S09 | `:472` |
| `sleepCheckInPending` | read | `today-app.cjs:2561` | TA-M14 | TA-S09 | `:472` |
| `sleepCheckInRow` | read | `today-app.cjs:1405` | RELEASED-body | TA-S09 | `:472` |
| `sleepCheckInViewPending` | write | `today-app.cjs:1435` | TA-M07 | TA-S09 | `:474` |
| `sleepCheckInViewPending` | read | `today-app.cjs:1445` | RELEASED-body | TA-S09 | `:474` |
| `sleepCheckInViewPending` | read | `today-app.cjs:2561` | TA-M14 | TA-S09 | `:474` |
| `sleepClockCheck` | call | `today-app.cjs:1549` | RELEASED-body | TA-S26 | `:1384` |
| `sleepCorrecting` | write | `today-app.cjs:1542` | TA-M08 | TA-S08 | `:461` |
| `sleepCorrecting` | read | `today-app.cjs:1695` | RELEASED-body | TA-S08 | `:461` |
| `sleepCorrecting` | read | `today-app.cjs:1701` | RELEASED-body | TA-S08 | `:461` |
| `sleepCorrecting` | write | `today-app.cjs:1703` | RELEASED-body | TA-S08 | `:461` |
| `sleepCorrecting` | read | `today-app.cjs:1707` | RELEASED-body | TA-S08 | `:461` |
| `sleepCorrecting` | read | `today-app.cjs:1708` | RELEASED-body | TA-S08 | `:461` |
| `sleepCorrecting` | write | `today-app.cjs:1710` | RELEASED-body | TA-S08 | `:461` |
| `sleepErrorText` | write | `today-app.cjs:1542` | TA-M08 | TA-S08 | `:464` |
| `sleepErrorText` | read | `today-app.cjs:1657` | RELEASED-body | TA-S08 | `:464` |
| `sleepErrorText` | read | `today-app.cjs:1658` | RELEASED-body | TA-S08 | `:464` |
| `sleepLane` | read | `today-app.cjs:1492` | RELEASED-body | TA-S06 | `:432` |
| `sleepLane` | read | `today-app.cjs:1493` | RELEASED-body | TA-S06 | `:432` |
| `sleepLane` | read | `today-app.cjs:1951` | RELEASED-body | TA-S06 | `:432` |
| `sleepLane` | read | `today-app.cjs:2562` | TA-M14 | TA-S06 | `:432` |
| `sleepLaneFailure` | read | `today-app.cjs:1496` | RELEASED-body | TA-S06 | `:435` |
| `sleepLaneFailure` | read | `today-app.cjs:1497` | RELEASED-body | TA-S06 | `:435` |
| `sleepNightChoice` | write | `today-app.cjs:1539` | TA-M08 | TA-S08 | `:459` |
| `sleepNightChoice` | write | `today-app.cjs:1560` | TA-M09 | TA-S08 | `:459` |
| `sleepNightDate` | call | `today-app.cjs:1429` | RELEASED-body | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1474` | RELEASED-body | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1476` | RELEASED-body | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1488` | RELEASED-body | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1541` | TA-M08 | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1560` | TA-M09 | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1562` | TA-M09 | TA-S25 | `:1375` |
| `sleepNightDate` | call | `today-app.cjs:1764` | RELEASED-body | TA-S25 | `:1375` |
| `sleepOpenedDay` | write | `today-app.cjs:1541` | TA-M08 | TA-S08 | `:463` |
| `sleepOpenedDay` | write | `today-app.cjs:1562` | TA-M09 | TA-S08 | `:463` |
| `sleepOpenedNight` | write | `today-app.cjs:1541` | TA-M08 | TA-S08 | `:462` |
| `sleepOpenedNight` | write | `today-app.cjs:1562` | TA-M09 | TA-S08 | `:462` |
| `sleepOpening` | read | `today-app.cjs:2560` | TA-M14 | TA-S06 | `:433` |
| `sleepOpsFor` | call | `today-app.cjs:1678` | RELEASED-body | TA-S28 | `:1450` |
| `sleepReadBack` | read | `today-app.cjs:1535` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | write | `today-app.cjs:1542` | TA-M08 | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1574` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1599` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1659` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1663` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1706` | RELEASED-body | TA-S06 | `:436` |
| `sleepReadBack` | read | `today-app.cjs:1720` | RELEASED-body | TA-S06 | `:436` |
| `sleepRollover` | write | `today-app.cjs:1540` | TA-M08 | TA-S08 | `:460` |
| `sleepRollover` | read | `today-app.cjs:1560` | TA-M09 | TA-S08 | `:460` |
| `sleepRollover` | write | `today-app.cjs:1561` | TA-M09 | TA-S08 | `:460` |
| `sleepSaving` | write | `today-app.cjs:1667` | RELEASED-body | TA-S06 | `:434` |
| `sleepSaving` | write | `today-app.cjs:1721` | RELEASED-body | TA-S06 | `:434` |
| `sleepSaving` | read | `today-app.cjs:2560` | TA-M14 | TA-S06 | `:434` |
| `sleepToday` | call | `today-app.cjs:1536` | RELEASED-body | TA-S25 | `:1373` |
| `sleepToday` | call | `today-app.cjs:1541` | TA-M08 | TA-S25 | `:1373` |
| `sleepToday` | call | `today-app.cjs:1562` | TA-M09 | TA-S25 | `:1373` |
| `sleepUnknown` | read | `today-app.cjs:1535` | RELEASED-body | TA-S09 | `:471` |
| `sleepUnknown` | read | `today-app.cjs:1574` | RELEASED-body | TA-S09 | `:471` |
| `sleepUnknown` | read | `today-app.cjs:1599` | RELEASED-body | TA-S09 | `:471` |
| `sleepUnknown` | read | `today-app.cjs:1663` | RELEASED-body | TA-S09 | `:471` |
| `sleepUnknown` | read | `today-app.cjs:1706` | RELEASED-body | TA-S09 | `:471` |
| `sleepUnknown` | read | `today-app.cjs:1720` | RELEASED-body | TA-S09 | `:471` |
| `startSettingsRead` | call | `gym-app.mjs:251` | RELEASED-body | GA-S03 | `:142` |
| `startSettingsRead` | call | `gym-app.mjs:317` | GA-M01 | GA-S03 | `:142` |
| `weighIn` | read | `today-model.cjs:426` | RELEASED-body | TM-S02 | `:378` |
| `workout` | read | `today-app.cjs:954` | TA-M04 | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2182` | RELEASED-body | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2184` | RELEASED-body | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2344` | RELEASED-body | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2360` | RELEASED-body | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2364` | TA-M13 | TA-S01 | `:362` |
| `workout` | read | `today-app.cjs:2568` | TA-M14 | TA-S01 | `:362` |
| `workoutRebinding` | read | `today-app.cjs:2569` | TA-M14 | TA-S01 | `:363` |

## SEALED -> RELEASED

| name | kind | source | sits in | declared in | declared at |
|---|---|---|---|---|---|
| `clearSleepDraft` | call | `today-app.cjs:1743` | TA-S29 | RELEASED body | `:478` |
| `clearSleepDraft` | call | `today-app.cjs:1752` | TA-S29 | RELEASED body | `:478` |
| `clearSleepDraft` | call | `today-app.cjs:1870` | TA-S30 | RELEASED body | `:478` |
| `clearSleepDraft` | call | `today-app.cjs:1919` | TA-S30 | RELEASED body | `:478` |
| `mountToken` | read | `today-app.cjs:1415` | TA-S27 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1423` | TA-S27 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1731` | TA-S29 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1733` | TA-S29 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1745` | TA-S29 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1754` | TA-S29 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1839` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1852` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1872` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1880` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1886` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1896` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1928` | TA-S30 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1982` | TA-S32 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:1985` | TA-S32 | RELEASED body | `:445` |
| `mountToken` | read | `today-app.cjs:2003` | TA-S32 | RELEASED body | `:445` |
| `paint` | call | `gym-app.mjs:154` | GA-S03 | RELEASED body | `:535` |
| `paint` | call | `gym-app.mjs:167` | GA-S04 | RELEASED body | `:535` |
| `paintTodayEntry` | call | `today-app.cjs:785` | TA-S22 | RELEASED body | `:769` |
| `phone` | read | `today-app.cjs:1986` | TA-S32 | RELEASED body | `:353` |
| `phone` | read | `today-app.cjs:2004` | TA-S32 | RELEASED body | `:353` |
| `reasonOf` | call | `today-app.cjs:1307` | TA-S23 | RELEASED body | `:1339` |
| `reasonOf` | call | `today-app.cjs:1903` | TA-S30 | RELEASED body | `:1339` |
| `render` | call | `today-app.cjs:531` | TA-S13 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:537` | TA-S13 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:606` | TA-S18 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:614` | TA-S18 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:640` | TA-S19 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:641` | TA-S19 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:696` | TA-S20 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:697` | TA-S20 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1298` | TA-S23 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1317` | TA-S23 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1333` | TA-S24 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1423` | TA-S27 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1733` | TA-S29 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1745` | TA-S29 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1755` | TA-S29 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1812` | TA-S30 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1841` | TA-S30 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1852` | TA-S30 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1929` | TA-S30 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:1987` | TA-S32 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:2006` | TA-S32 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:2080` | TA-S34 | RELEASED body | `:2272` |
| `render` | call | `today-app.cjs:2083` | TA-S34 | RELEASED body | `:2272` |
| `screen` | read | `today-app.cjs:531` | TA-S13 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:537` | TA-S13 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:606` | TA-S18 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:614` | TA-S18 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:640` | TA-S19 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:696` | TA-S20 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:1423` | TA-S27 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:2080` | TA-S34 | RELEASED body | `:792` |
| `screen` | read | `today-app.cjs:2083` | TA-S34 | RELEASED body | `:792` |
| `sleepDraft` | read | `today-app.cjs:1822` | TA-S30 | RELEASED body | `:476` |
| `sleepTyped` | call | `today-app.cjs:1386` | TA-S26 | RELEASED body | `:1378` |
| `status` | read | `today-app.cjs:2528` | TA-S37 | RELEASED body | `:354` |
| `tell` | call | `today-app.cjs:2528` | TA-S37 | RELEASED body | `:836` |

### module-level names the sealed half must re-require (33 references, 16 names)

`FOOD_REASON`, `FOOD_REFUSAL_COPY`, `FOOD_REFUSED`, `FOOD_REFUSED_ACTION`, `FoodModel`, `SLEEP_CHECKIN_CHANGED`, `SLEEP_KEPT`, `SLEEP_NIGHT_CHANGED`, `SLEEP_NOTHING_RECORDED`, `SLEEP_NOT_SAVED`, `SLEEP_REFUSAL_COPY`, `SLEEP_ROLLOVER`, `SLEEP_UNCERTAIN`, `SleepModel`, `athleteStateFailureCopy`, `plainOrDrop`

