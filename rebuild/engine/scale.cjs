'use strict';
// Shared legacy scale arithmetic. Native callers do not expose the unmeasured prior.
function scaleRate(s, { weeksBetween, timeOf, DAY }) {
  const w = s.weekly || [];
  const rates = [];
  for (let i = 1; i < w.length; i++) rates.push((w[i - 1].trend - w[i].trend) / Math.max(0.5, weeksBetween(w[i - 1].wk, w[i].wk)));
  const reads = (s.reads || []).filter((r) => !r.sealed && !r.offWindow && r.w != null).slice(-28);
  if (reads.length >= 10) {
    const t0 = timeOf(reads[0]);
    const xs = reads.map((r) => (timeOf(r) - t0) / DAY), ys = reads.map((r) => r.w);
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
    if (sxx > 0) {
      const slope = sxy / sxx;
      let sse = 0;
      const resid = [];
      for (let i = 0; i < n; i++) { const fit = my + slope * (xs[i] - mx); const e = ys[i] - fit; resid.push(e); sse += e * e; }
      const seOls = n > 2 && sxx > 0 ? Math.sqrt(sse / (n - 2) / sxx) : 0;
      /* ---------- AUTOCORRELATION_NOTE ----------
         Daily scale readings are strongly autocorrelated: water, glycogen and gut
         content persist across days, so today's residual carries yesterday's. OLS
         standard errors assume independent residuals, and under positive
         autocorrelation that assumption makes the printed interval TOO NARROW —
         overconfident in exactly the number the whole calorie prescription hangs
         off, which then propagates into observedTDEE, the forecast and the
         adaptation meter. One overconfident number, three dependent claims.

         Newey-West HAC with a Bartlett kernel fixes the variance without touching
         the slope: the point estimate is unchanged, only its honesty about spread
         moves. Bandwidth from the standard plug-in rule L = 4(n/100)^(2/9), which
         is 3 lags at n=28 — long enough to capture a multi-day water swing, short
         enough not to eat the sample.

         Both intervals are kept. `ci` is the HAC one, because that is the one worth
         believing; `ciOls` stays so the difference is visible rather than asserted,
         and rho1 is reported because it is the reason the correction is needed. */
      const L = Math.max(1, Math.floor(4 * Math.pow(n / 100, 2 / 9)));
      const u = resid.map((e, i) => e * (xs[i] - mx));
      let hac = u.reduce((a, b) => a + b * b, 0);
      for (let k = 1; k <= Math.min(L, n - 1); k++) {
        const wk = 1 - k / (L + 1);
        let cross = 0;
        for (let i = k; i < n; i++) cross += u[i] * u[i - k];
        hac += 2 * wk * cross;
      }
      /* A Bartlett-weighted sum can go negative in tiny samples; fall back to OLS
         rather than print an imaginary interval. */
      const seHac = hac > 0 ? Math.sqrt((hac / (sxx * sxx)) * (n / Math.max(1, n - 2))) : seOls;
      const se = Math.max(seHac, seOls);
      /* lag-1 residual autocorrelation — the diagnostic that justifies all of this */
      const rho1 = (() => {
        if (n < 4) return null;
        const m0 = resid.reduce((a, b) => a + b, 0) / n;
        let num = 0, den = 0;
        for (let i = 1; i < n; i++) num += (resid[i] - m0) * (resid[i - 1] - m0);
        for (let i = 0; i < n; i++) den += (resid[i] - m0) ** 2;
        return den > 0 ? +(num / den).toFixed(2) : null;
      })();
      const scale = +(-slope * 7).toFixed(2);
      const ci = +(1.96 * se * 7).toFixed(2);
      return {
        scale, measured: true, rates,
        method: "regression", n, ci, lo: +(scale - ci).toFixed(2), hi: +(scale + ci).toFixed(2),
        /* the residual SD around the fitted trend, in lb — this is the RIGHT quantity
           for banding a single morning against the trend (see the noise floor card) */
        sigma: n > 2 ? +Math.sqrt(sse / (n - 2)).toFixed(2) : null,
        ciOls: +(1.96 * seOls * 7).toFixed(2), hacL: L, rho1, hacInflation: seOls > 0 ? +(se / seOls).toFixed(2) : null,
        /* the endpoints, not just the printable span — observedTDEE has to
           average intake over exactly this period or the arithmetic is wrong */
        from: reads[0].d, to: reads[n - 1].d,
        span: `${reads[0].d} → ${reads[n - 1].d}`,
      };
    }
  }
  if (rates.length >= 2) {
    const recent = rates.slice(-2);
    const scale = +(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(2);
    return { scale, measured: true, rates, method: "snapshots", n: recent.length, ci: null };
  }
  return { scale: 1.0, measured: false, rates, method: "prior", n: 0, ci: null };
}

function scaleUpdate(previous, weight) {
  const rawDelta = weight - previous, clampedDelta = Math.max(-1.5, Math.min(1.5, rawDelta));
  return { rawDelta, clampedDelta, next: +(previous + 0.3 * clampedDelta).toFixed(1) };
}
module.exports = { scaleRate, scaleUpdate };
