# Earned science audit — E author report

Owner356 • Astra Lane E • 2026-09-13 • for PM and independent D2 review

The review found planning and implementation gaps that deserve focused repairs through the existing lanes. I do not recommend adding another development lane for this work.

All twelve training and nutrition questions are covered. This is a review of public research and pinned source code, not a test of the live app or a personal assessment of Joe or Dad.

The most important findings are:

- Some advice treats stable strength and falling weight as proof of fat loss or muscle preservation. Those observations do not establish what tissue changed or why progress stalled.
- The training-volume rule turns a research detection threshold into a precise number of sets to add. The cited paper does not establish that as an individual prescription.
- Different parts of the prepared code read different calorie recommendation functions. They need one agreed rule and a check that the user receives consistent advice.
- Energy-availability estimates and recovery scores still carry some overly certain safety or muscle-loss language. The newer symptom-check approach is already present and should be preserved.
- The workout effort default also disagrees with its nearby stated policy about how often to reach failure. That needs a reviewed decision.
- Protein, sleep and diet-break explanations need narrower wording. Several useful defaults are presented as stronger personal findings than the evidence supports.
- The code needs to check the facts relevant to each person and use the configured schedule. Neither person's current circumstances can be inferred from old notes or family relationship.

Several fixes are already in place: monthly gain-rate units, removal of assumed lean-mass gain, removal of the old body-fat protein switch, corrected record-noise arithmetic, current-week volume counting, and more honest handling of missing sleep. The report separates those improvements from remaining gaps.

The review also found that older defect tests intentionally reproduce past faults. Their existence, or agreement with a reference implementation, is not proof that the advice is scientifically sound.

The PM should prioritize confirmed recommendation paths, reuse the existing repair queue, and send any new coaching choice for a concrete yes/no decision. This audit creates no blanket new release hold and approves no new dose, threshold or automatic action.

D2 must finish its independent first assessment before receiving these author findings. The PM can then reconcile the full package and decide which changes to authorize.

Details:

- [All twelve claims and eight unresolved review items](science-audit/CLAIMS.md)
- [Sources, publication updates and access limits](science-audit/SOURCES.md)
- [Exact input identities and actual inspection coverage](science-audit/INPUT-CUSTODY.json)

No product code, tests, policy, athlete records or accepted artifacts were changed. No product module, test, native gate or private history was executed. Some original supplements and corrected diagrams could not be verified; the source register identifies them.
