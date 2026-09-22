/* Earned prototype: the visible controls, wired honestly. No engine here: every number is an example. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var qs = new URLSearchParams(location.search);
  var root = document.documentElement;

  /* ---------- theme ---------- */
  function setTheme(t) {
    root.setAttribute('data-theme', t === 'dawn' ? 'dawn' : 'ink');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dawn' ? '#f7f2e7' : '#0c0b0a');
    try { localStorage.setItem('earned.theme', t); } catch (e) {}
    loadPlate(); drawAllEmbers(true);
  }
  var theme = qs.get('theme');
  if (!theme) { try { theme = localStorage.getItem('earned.theme'); } catch (e) {} }
  if (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'dawn';
  root.setAttribute('data-theme', theme === 'dawn' ? 'dawn' : 'ink');
  window.earnedSetTheme = setTheme;
  var plateImg = null, plateReady = false, occl = {}, plateTall = false;   /* declared before the first load; a later declaration used to reset it after the tall plate had loaded */
  loadPlate();

  /* ---------- fade strength (soft is the default; ?fade=strong or a saved choice) ---------- */
  var top = qs.get('top'); if (top === 'solid') root.setAttribute('data-top', 'solid');
  var mtn = qs.get('mountain'); if (mtn === 'more') root.setAttribute('data-mountain', 'more');
  var fade = qs.get('fade'); if (!fade) { try { fade = localStorage.getItem('earned.fade'); } catch (e) {} }
  if (!fade) fade = 'strong';
  /* 'strong' and 'full' share the scene machinery (data-fade=full); they differ in geometry (data-scene). 'soft' is the legacy flat treatment. */
  if (fade === 'strong' || fade === 'full') { root.setAttribute('data-fade', 'full'); root.setAttribute('data-scene', fade === 'strong' ? 'strong' : 'open'); } else { root.removeAttribute('data-fade'); root.removeAttribute('data-scene'); }
  loadPlate();   /* the fade decides which plate the occlusion mask reads */
  window.earnedSetFade = function (f) { if (f === 'strong' || f === 'full') { root.setAttribute('data-fade', 'full'); root.setAttribute('data-scene', f === 'strong' ? 'strong' : 'open'); } else { root.removeAttribute('data-fade'); root.removeAttribute('data-scene'); } loadPlate(); try { localStorage.setItem('earned.fade', f); } catch (e) {} };

  /* ---------- mist (optional second layer of motion; off unless ?mist=1 or a saved choice) ---------- */
  var mistOn = qs.get('mist'); if (mistOn === null) { try { mistOn = localStorage.getItem('earned.mist'); } catch (e) {} }
  mistOn = (mistOn === null || mistOn === undefined) ? true : (mistOn === '1' || mistOn === 'on');
  window.earnedSetMist = function (on) { mistOn = !!on; try { localStorage.setItem('earned.mist', on ? '1' : '0'); } catch (e) {} };
  var mistImg = new Image(); var mistReady = false; mistImg.onload = function () { mistReady = true; }; mistImg.src = 'assets/mist.png';
  function loadPlate() { plateReady = false; occl = {}; plateTall = root.getAttribute('data-fade') === 'full'; plateImg = new Image(); plateImg.onload = function () { plateReady = true; }; plateImg.src = 'assets/plate-' + (root.getAttribute('data-theme') === 'dawn' ? 'dawn' : 'ink') + (plateTall ? '-tall' : '') + '.jpg'; }

  /* ---------- review chrome (presentation only) ---------- */
  if (qs.get('chrome') === '1') document.body.classList.add('with-chrome');

  /* ---------- screens ---------- */
  var screens = ['today', 'workout', 'coach'];
  function show(name) {
    if (screens.indexOf(name) < 0) name = 'today';
    screens.forEach(function (s) { $('screen-' + s).classList.toggle('is-active', s === name); });
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    drawAllEmbers(true);
  }
  function goFromHash() { show((location.hash || '#today').slice(1)); }
  window.addEventListener('hashchange', goFromHash);
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-go]');
    if (el) { e.preventDefault(); location.hash = '#' + el.getAttribute('data-go'); }
  });
  var initial = qs.get('screen');
  if (initial) location.hash = '#' + initial; else goFromHash();

  /* ---------- date ---------- */
  var d = new Date();
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (qs.get('date') !== 'board') $('today-date').textContent = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
  if (qs.get('date') === 'board') $('today-date').textContent = 'Wed, Sep 16';
  var h = d.getHours();
  var greet = h < 12 ? 'Morning' : (h < 17 ? 'Afternoon' : 'Evening');
  if (qs.get('date') !== 'board') $('greeting').textContent = greet + ', Joe.';

  /* ---------- notes (plain, no motion) ---------- */
  function note(el, text, cls) { el.textContent = text; el.className = 'weigh-note' + (cls ? ' ' + cls : ''); el.hidden = !text; }

  /* ---------- Today: weigh in ---------- */
  var savedWeight = null;
  try { savedWeight = JSON.parse(localStorage.getItem('earned.weight') || 'null'); } catch (e) {}
  if (savedWeight && savedWeight.day === d.toDateString()) {
    $('weight').value = savedWeight.lb;
    $('save-weight').textContent = 'Saved';
    $('save-weight').disabled = true;
  }
  $('weigh-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = $('weight').value.trim().replace(',', '.');
    if (!raw) { note($('weigh-note'), 'Enter your weight first. Nothing was recorded.', 'refusal'); return; }
    var v = Number(raw);
    if (!isFinite(v) || v < 60 || v > 400) { note($('weigh-note'), 'Earned records 60 to 400 lb. Nothing was recorded.', 'refusal'); return; }
    v = Math.round(v * 10) / 10;
    var ok = false;
    try { localStorage.setItem('earned.weight', JSON.stringify({ lb: v, day: d.toDateString() })); ok = localStorage.getItem('earned.weight') !== null; } catch (err) {}
    if (!ok) { note($('weigh-note'), 'This phone could not store the reading. Nothing was recorded.', 'refusal'); return; }
    $('weight').value = String(v);
    $('save-weight').textContent = 'Saved';
    $('save-weight').disabled = true;
    note($('weigh-note'), '');
  });
  $('weight').addEventListener('input', function () {
    $('save-weight').textContent = 'Save'; $('save-weight').disabled = false; note($('weigh-note'), '');
  });

  /* ---------- Today: the proposal ---------- */
  var reasonShown = false;
  var reasonShort = 'Down from 115 after two short sets. Nothing changes until you say yes.';
  var reasonLong = 'Two sets came up short at 115 last session, so the engine lowered bench to 105 for 8. Clean reps at 105 bring it back up. Nothing changes until you say yes.';
  $('why-105').addEventListener('click', function () {
    reasonShown = !reasonShown;
    $('proposal-reason').textContent = reasonShown ? reasonLong : reasonShort;
  });
  /* the proposal card's three honest states (ruling 2026-09-17): open, recorded (this device has the answer), applied (only once the engine stores it, which is not wired) */
  function decide(yes) {
    $('proposal-open').hidden = true; $('proposal-done').hidden = false;
    $('recorded-text').innerHTML = '<span class="state-word">' + (yes ? 'You said yes.' : 'You said no.') + '</span> ' + (yes ? 'It applies when your plan is next built.' : 'Nothing changes.');
    $('card-proposal').classList.add('decided'); $('card-proposal').classList.add('is-recorded'); $('proposal-kind').textContent = 'Your call'; $('status-line').textContent = 'Upper body today. Nothing to decide.';
  }
  $('use-105').addEventListener('click', function () { decide(true); });
  $('keep-115').addEventListener('click', function () { decide(false); });
  $('undo-proposal').addEventListener('click', function () {
    $('proposal-open').hidden = false; $('proposal-done').hidden = true; $('card-proposal').classList.remove('decided'); $('card-proposal').classList.remove('is-recorded'); $('proposal-kind').textContent = 'One call needs you'; $('status-line').textContent = 'Upper body today. One change to review.';
  });
  $('card-eat').addEventListener('click', function () { note($('weigh-note'), 'Nutrition detail is not in this delivery yet.'); });
  $('recovery').addEventListener('click', function () { note($('weigh-note'), 'The recovery check in is not in this delivery yet.'); });
  $('plans-changed').addEventListener('click', function () { note($('weigh-note'), 'Adjusting today is not wired yet.'); });
  $('plans-label').addEventListener('click', function () { $('plans-changed').click(); });

  /* the timeline rail ends at the last dot's centre, not at the container's bottom */
  function railEnd() {
    var tl = document.querySelector('.timeline'); if (!tl) return;
    var dots = tl.querySelectorAll('.tcard:not([hidden]) .tdot'); if (!dots.length) return;
    var last = dots[dots.length - 1].getBoundingClientRect(), box = tl.getBoundingClientRect();
    tl.style.setProperty('--rail-end', (box.bottom - (last.top + last.height / 2)) + 'px');
  }
  railEnd(); window.addEventListener('resize', railEnd); document.fonts && document.fonts.ready.then(railEnd);
  /* Every scrolling region (a screen's body, a panel's body) softens at the edge it slides under, only while there is more that way */
  function scrollFades(el) {
    if (!el || el.earnedFades) return;
    function upd() {
      var can = el.scrollHeight > el.clientHeight + 1, end = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      el.classList.toggle('can-scroll', can); el.classList.toggle('at-end', !can || end); el.classList.toggle('at-start', !can || el.scrollTop <= 1);
    }
    el.earnedFades = upd;
    el.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); document.fonts && document.fonts.ready.then(upd);
    new MutationObserver(upd).observe(el, { attributes: true, subtree: true, childList: true, characterData: true }); upd();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.screen .ui > .body'), scrollFades);
  new MutationObserver(railEnd).observe(document.querySelector('.timeline'), { attributes: true, subtree: true, childList: true });

  /* ---------- Workout ---------- */
  var set = { n: 1, of: 4, lb: 50, reps: 8, logged: false, rir: null };
  function renderSet() {
    $('set-count').textContent = 'Set ' + set.n + ' of ' + set.of;
    Array.prototype.forEach.call(document.querySelectorAll('#set-dots i'), function (d, i) {
      d.className = (i + 1 < set.n || (i + 1 === set.n && set.logged)) ? 'done' : (i + 1 === set.n ? 'now' : '');
    });
    if ($('w-value')) { $('w-value').textContent = set.lb; $('r-value').textContent = set.reps; }   /* while editing, the numerals are inputs */
    $('set-state').classList.toggle('logged', set.logged);
    $('set-state-text').textContent = set.logged ? 'Logged' : 'Unlogged';
    $('log-label').textContent = set.logged ? (set.n < set.of ? 'Next set' : 'Finish upper body') : ('Log ' + set.lb + ' \u00d7 ' + set.reps);
    Array.prototype.forEach.call(document.querySelectorAll('#rir .chip'), function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-rir') === set.rir));
    });
  }
  $('rir').addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    var v = c.getAttribute('data-rir');
    set.rir = (set.rir === v) ? null : v;   /* tap again clears: blank is unknown */
    if (set.rir !== null) rirRefusal(false);
    renderSet();
  });
  function rirRefusal(on) {
    var old = document.querySelector('.log-row').previousElementSibling; if (old && old.classList.contains('rir-refusal')) old.remove();
    if (!on) return;
    var d = document.createElement('div'); d.className = 'refusal note-block w-refusal rir-refusal'; d.textContent = 'Choose clean reps left, or Unsure.';
    var lr = document.querySelector('.log-row'); lr.parentNode.insertBefore(d, lr);
  }
  $('log').addEventListener('click', function () {
    if (!set.logged && set.rir === null) { rirRefusal(true); return; }   /* the record needs an effort answer; Unsure is one (W-20) */
    if (!set.logged) { set.logged = true; note($('workout-note'), ''); }
    else if (set.n < set.of) { set.n += 1; set.logged = false; set.rir = null; }
    else { /* finished: Today reflects it */ $('status-line').textContent = 'Upper body logged. Nothing to decide.'; $('card-train').querySelector('.title').textContent = 'Trained today.'; $('card-train').querySelector('.sub').textContent = 'Upper body, 4 exercises, 4 sets logged.'; $('start').querySelector('span').textContent = 'Upper body logged'; $('start').disabled = true; $('start').style.opacity = '0.7'; location.hash = '#today'; }
    renderSet();
  });
  var editing = false;
  $('edit').addEventListener('click', function () {
    if (set.logged) { note($('workout-note'), 'This set is logged. Undo is not wired yet.'); return; }
    editing = !editing;
    var wrap = $('numerals');
    if (editing) {
      wrap.innerHTML = '<div class="num"><input class="value" id="w-in" inputmode="decimal" value="' + set.lb + '" style="width:120px;text-align:center;background:transparent;border:0;border-bottom:1px solid var(--line);color:var(--text)"><div class="unit">lb</div></div><div class="times" aria-hidden="true">×</div><div class="num"><input class="value" id="r-in" inputmode="numeric" value="' + set.reps + '" style="width:80px;text-align:center;background:transparent;border:0;border-bottom:1px solid var(--line);color:var(--text)"><div class="unit">reps</div></div>';
      $('edit').textContent = 'Done'; $('w-in').focus();
    } else {
      var lb = Number($('w-in').value), reps = Number($('r-in').value);
      if (isFinite(lb) && lb > 0) set.lb = Math.round(lb * 2) / 2;
      if (isFinite(reps) && reps > 0 && reps < 100) set.reps = Math.round(reps);
      wrap.innerHTML = '<div class="num"><div class="value" id="w-value">' + set.lb + '</div><div class="unit">lb</div></div><div class="times" aria-hidden="true">×</div><div class="num"><div class="value" id="r-value">' + set.reps + '</div><div class="unit">reps</div></div>';
      $('edit').textContent = 'Edit';
    }
    renderSet();
  });
  $('plans-workout').addEventListener('click', function () { note($('workout-note'), 'Adjusting the plan mid session is not wired yet.'); });
  $('last-time').addEventListener('click', function () { note($('workout-note'), 'History is not in this delivery yet.'); });
  $('machine').addEventListener('click', function () { note($('workout-note'), 'Changing a machine setting is not in this delivery yet.'); });
  $('workout-text-mode').addEventListener('click', function () {
    var t = $('workout-text'); t.hidden = !t.hidden; $('workout-text-mode').textContent = t.hidden ? 'Use text mode' : 'Use voice';
    if (!t.hidden) t.querySelector('input').focus();
  });
  $('workout-tap').addEventListener('click', function () {
    $('workout-voice').hidden = true; note($('workout-note'), 'Voice is off for this session. Log by tapping.');
  });
  $('talk-workout').addEventListener('click', function () {
    var on = $('talk-workout-label').textContent === 'Listening';
    $('talk-workout-label').textContent = on ? 'Earned is here' : 'Listening';
    $('talk-workout').setAttribute('data-state', on ? 'idle' : 'listening');
  });
  renderSet();

  /* ---------- Coach ---------- */
  var answers = {
    hitting: 'Upper body today: chest press, row, shoulder press, curl. Four exercises, about 35 minutes. Bench is 105 for 8 because last session came up short twice.',
    seat: 'Seat 4 on the chest press. You told Earned on Sep 9.',
    lighter: 'Two sets came up short last week, so the engine lowered bench from 115 to 105 for 8. It goes back up when the reps are clean.'
  };
  $('prompts').addEventListener('click', function (e) {
    var p = e.target.closest('.prompt'); if (!p) return;
    var k = p.getAttribute('data-answer');
    $('coach-answer-text').textContent = answers[k]; $('coach-answer').hidden = false;
    /* the orb answers: warm while the answer is fresh, then settles */
    if (answerTimer) clearTimeout(answerTimer);
    setCoachState('answering');
    answerTimer = setTimeout(function () { if (coachSec.getAttribute('data-state') === 'answering') setCoachState('idle'); }, 4000);
  });
  $('coach-text-mode').addEventListener('click', function () {
    var t = $('coach-text'); t.hidden = !t.hidden; $('coach-text-mode').textContent = t.hidden ? 'Use text mode' : 'Use voice';
    if (!t.hidden) t.querySelector('input').focus();
  });
  var coachSec = $('screen-coach'), answerTimer = null;
  function setCoachState(s) {
    coachSec.setAttribute('data-state', s);
    $('coach-state-text').textContent = s === 'listening' ? 'Listening' : (s === 'answering' ? 'Answering' : 'Idle');
    $('coach-state').hidden = (s === 'idle');   /* quiet is quiet: the pill appears only while something is happening */
    $('mic').setAttribute('aria-pressed', String(s === 'listening'));
    $('mic-label').textContent = s === 'listening' ? 'Tap to stop' : 'Tap to speak';
  }
  /* Level ring: while listening, a thin ring around the orb follows the real microphone level. The audio stays on the phone;
     nothing is recorded or sent. Without permission (or in a review frame) the ring stays still at its listening weight. */
  var audio = { ctx: null, stream: null, analyser: null, raf: null, data: null };
  function levelLoop() {
    if (!audio.analyser) return;
    audio.analyser.getByteTimeDomainData(audio.data);
    var sum = 0; for (var i = 0; i < audio.data.length; i++) { var v = (audio.data[i] - 128) / 128; sum += v * v; }
    var rms = Math.sqrt(sum / audio.data.length);
    var level = Math.min(1, Math.max(0, (rms - 0.015) * 6));
    var cur = parseFloat(coachSec.style.getPropertyValue('--level') || '0');
    var next = cur + (level - cur) * (level > cur ? 0.5 : 0.12);   /* quick up, slow down */
    coachSec.style.setProperty('--level', next.toFixed(3));
    audio.raf = requestAnimationFrame(levelLoop);
  }
  function startLevel() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) return;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
      if (coachSec.getAttribute('data-state') !== 'listening') { stream.getTracks().forEach(function (tr) { tr.stop(); }); return; }
      var AC = window.AudioContext || window.webkitAudioContext;
      audio.ctx = new AC(); audio.stream = stream;
      var src = audio.ctx.createMediaStreamSource(stream);
      audio.analyser = audio.ctx.createAnalyser(); audio.analyser.fftSize = 512; audio.analyser.smoothingTimeConstant = 0.6;
      src.connect(audio.analyser);   /* analyser only: no output, no recording */
      audio.data = new Uint8Array(audio.analyser.fftSize);
      coachSec.setAttribute('data-level', 'live');
      levelLoop();
    }).catch(function () { coachSec.setAttribute('data-level', 'unavailable'); });
  }
  function stopLevel() {
    if (audio.raf) cancelAnimationFrame(audio.raf); audio.raf = null;
    if (audio.stream) audio.stream.getTracks().forEach(function (tr) { tr.stop(); });
    if (audio.ctx) { try { audio.ctx.close(); } catch (e) {} }
    audio = { ctx: null, stream: null, analyser: null, raf: null, data: null };
    coachSec.style.setProperty('--level', '0'); coachSec.removeAttribute('data-level');
  }
  $('mic').addEventListener('click', function () {
    var on = coachSec.getAttribute('data-state') === 'listening';
    if (answerTimer) { clearTimeout(answerTimer); answerTimer = null; }
    setCoachState(on ? 'idle' : 'listening');
    if (on) stopLevel(); else startLevel();
  });

  /* ---------- Embers: the only animation. Two depths of warm motes rise slowly out of the lit ridges, sway a little,
     breathe in brightness, and thin out as they climb. Reduced motion draws one still frame of the same picture. ---------- */
  /* hooks for the state driver (states.js): read-only access to the prototype's own pieces */
  window.earned = { $: $, show: show, note: note, set: set, renderSet: renderSet, setCoachState: setCoachState, railEnd: railEnd, scrollFades: scrollFades };

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var emberSets = {};
  var seed = 11;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  function emberZone(name, W, H) {
    /* where embers live: the exposed scenic band. They are born low, near the lit ridges, and die as they rise. */
    if (name === 'coach') return { x0: 0, x1: W, y0: H * 0.3, y1: H, n: 40 };
    if (name === 'workout') return { x0: 0, x1: W, y0: H * 0.6, y1: H, n: 16 };
    return { x0: 0, x1: W, y0: H * 0.42, y1: H, n: 36 };
  }
  function spawn(p, z, fresh) {
    var kind = rnd();
    var near = kind < 0.42, bokeh = kind > 0.88;   /* three depths: far sparks, near embers, a few out-of-focus motes */
    p.near = near; p.bokeh = bokeh;
    p.x = z.x0 + rnd() * (z.x1 - z.x0);
    /* dispersed: seven in ten are born in the lower half of the band (the lit ridges), three in ten higher up, out of the smoke */
    var u = rnd(), high = rnd() < 0.3;
    p.y = high ? z.y0 + (z.y1 - z.y0) * (0.05 + 0.45 * u) : z.y0 + (z.y1 - z.y0) * (0.5 + 0.5 * u);
    p.high = high;
    var q = rnd() * rnd();   /* skewed: most lives short, a few long */
    p.life = bokeh ? 2.5 + q * 5 : (near ? 0.9 + q * 3.6 : 1.1 + q * 4);
    p.age = fresh ? rnd() * p.life : 0;
    p.r = bokeh ? 4 + rnd() * 3.5 : (near ? 1.5 + rnd() * 1.4 : 0.7 + rnd() * 0.7);
    p.a = bokeh ? 0.14 + rnd() * 0.1 : (near ? 0.7 + rnd() * 0.3 : 0.38 + rnd() * 0.3);
    if (high) { p.a *= 0.7; p.r *= 0.85; p.drift *= 2.2; p.sway *= 1.4; }   /* the high ones are further away: fainter, smaller, more wind */
    p.v = bokeh ? 0.12 + rnd() * 0.1 : (near ? 0.5 + rnd() * 0.45 : 0.3 + rnd() * 0.3);
    p.sway = near ? 0.18 + rnd() * 0.22 : 0.08 + rnd() * 0.12;
    p.ph = rnd() * 6.283; p.tw = 0.6 + rnd() * 1.2; p.tph = rnd() * 6.283;
    p.drift = (rnd() - 0.5) * 0.06;
    return p;
  }
  function makeEmbers(name, W, H) {
    var z = emberZone(name, W, H), list = [];
    for (var i = 0; i < z.n; i++) list.push(spawn({}, z, true));
    return list;
  }
  function envelope(p, z) {
    /* a short life: quick in over the first 15%, hold, then wink out over the last 45% */
    var f = p.age / p.life;
    var e = f < 0.15 ? f / 0.15 : (f > 0.55 ? Math.max(0, (1 - f) / 0.45) : 1);
    /* and never above the band's top */
    var up = (z.y1 - p.y) / (z.y1 - z.y0); if (up > 0.85) e *= Math.max(0, (1 - up) / 0.15);
    return e;
  }
  function drawEmbers(name, force) {
    var sec = $('screen-' + name); if (!sec) return;
    var c = sec.querySelector('canvas.embers'); if (!c) return;
    var W = sec.clientWidth, H = sec.clientHeight; if (!W || !H) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr) || force) {
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = W + 'px'; c.style.height = H + 'px';
      emberSets[name] = makeEmbers(name, W, H);
    }
    var ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var rgb = getComputedStyle(root).getPropertyValue('--ember').trim() || '255,204,140';
    var z = emberZone(name, W, H), now = performance.now() / 1000;
    if (mistOn && mistReady) drawMist(ctx, name, W, H, z, now);
    (z.fixed || []).forEach(function (f) {
      var tw = 0.85 + 0.15 * Math.sin(now * 0.7 + f[0]);
      var g0 = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], f[2] * 5);
      g0.addColorStop(0, 'rgba(' + rgb + ',' + (f[3] * tw) + ')'); g0.addColorStop(0.4, 'rgba(' + rgb + ',' + (f[3] * tw * 0.35) + ')'); g0.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(f[0], f[1], f[2] * 5, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(255,246,228,' + (0.9 * tw) + ')'; ctx.beginPath(); ctx.arc(f[0], f[1], f[2] * 0.55, 0, 6.283); ctx.fill();
    });
    emberSets[name].forEach(function (p) {
      var tw = reduce ? 1 : (0.82 + 0.18 * Math.sin(now * p.tw + p.tph));
      var a = p.a * envelope(p, z) * tw;
      if (a > 0.005) {
        var R = p.r * (p.bokeh ? 2.2 : (p.near ? 7 : 5));
        var col = p.near ? rgb : (p.high ? '235,215,190' : '250,225,180');   /* far and high: cooler, greyer */
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        g.addColorStop(0, 'rgba(' + col + ',' + a + ')');
        g.addColorStop(p.bokeh ? 0.6 : 0.3, 'rgba(' + col + ',' + (a * (p.bokeh ? 0.7 : 0.45)) + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 6.283); ctx.fill();
        if (p.near) { ctx.fillStyle = 'rgba(255,246,226,' + Math.min(1, a + 0.3) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.55, 0, 6.283); ctx.fill(); }
      }
      if (!reduce) {
        p.age += 0.04; p.y -= p.v; p.ph += 0.02; p.x += Math.sin(p.ph) * p.sway * 0.5 + p.drift;
        if (p.age >= p.life || p.y < z.y0 - 6 || p.x < -8 || p.x > W + 8) spawn(p, z, false);
      }
    });
  }
  /* ---------- depth helpers ----------
     Two tinted copies of the wisp texture: far mist is cooler and greyer (air between you and it), near mist is warm (lit
     by the same light as the embers). And an occlusion mask cut from the mountain image itself: where the plate is dark
     rock the far mist is hidden, where it is sky or lit haze the far mist shows, so distant veils pass behind the peaks. */
  var tinted = { dark: null, light: null };
  function tintMist(rgb) {
    var c = document.createElement('canvas'); c.width = mistImg.width; c.height = mistImg.height;
    var g = c.getContext('2d'); g.drawImage(mistImg, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = rgb; g.fillRect(0, 0, c.width, c.height);
    return c;
  }
  function mistSheets(dark) {
    if (!tinted.dark) tinted.dark = { far: tintMist('rgb(196,204,214)'), mid: tintMist('rgb(232,226,214)'), near: tintMist('rgb(255,232,200)') };
    if (!tinted.light) tinted.light = { far: tintMist('rgb(236,240,246)'), mid: tintMist('rgb(255,248,236)'), near: tintMist('rgb(255,238,212)') };
    return dark ? tinted.dark : tinted.light;
  }
  function plateGeometry(name, dark, W, H) {
    /* mirrors the CSS of the "full" treatment: image height as a share of the screen, x as a share of the overflow, y anchored past the bottom */
    var iw = 1491, ih = plateTall ? 1755 : 1055, hs, px, oy;
    if (root.getAttribute('data-scene') === 'strong') {
      if (name === 'today') { hs = 0.797; px = 0.476; oy = 207; }
      else if (name === 'coach') { hs = dark ? 0.747 : 0.797; px = dark ? 0.789 : 0.635; oy = dark ? 35 : 27; }
      else { hs = 0.747; px = 0.592; oy = 215; }
    } else if (name === 'today') { hs = 0.94; px = 0.5; oy = 120; }
    else if (name === 'coach') { hs = 0.96; px = dark ? 0.54 : 0.6; oy = 60; }
    else { hs = 0.9; px = 0.5; oy = 96; }
    if (plateTall) hs *= 1755 / 1055;   /* tall plates: same scale, sky above the top edge */
    var h = H * hs, w = h * iw / ih;
    return { x: (W - w) * px, y: H - h + oy, w: w, h: h };
  }
  function occlusionMask(name, dark, W, H) {
    var key = name + (dark ? 'd' : 'l') + W + 'x' + H;
    if (occl[key] === false) return null;
    if (occl[key]) return occl[key];
    if (!plateReady) return null;
    var g4 = plateGeometry(name, dark, W, H), sc = 0.25;
    var c = document.createElement('canvas'); c.width = Math.ceil(W * sc); c.height = Math.ceil(H * sc);
    var g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);              /* above the image: open sky */
    g.drawImage(plateImg, g4.x * sc, g4.y * sc, g4.w * sc, g4.h * sc);
    var d; try { d = g.getImageData(0, 0, c.width, c.height); } catch (e) { occl[key] = false; return null; }   /* a file:// page cannot read pixels; then far mist simply goes unmasked */
    var p = d.data;
    var lo = dark ? 0.1 : 0.5, hi = dark ? 0.42 : 0.82;
    for (var i = 0; i < p.length; i += 4) {
      var lum = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
      var v = Math.min(1, Math.max(0, (lum - lo) / (hi - lo))); v = v * v * (3 - 2 * v);
      p[i] = p[i + 1] = p[i + 2] = 255; p[i + 3] = Math.round(255 * (0.1 + 0.9 * v));   /* never fully hidden: thin air still reads */
    }
    if (plateTall) {
      /* Above the photo the plate is synthesized sky. The mask must not change at the join: every column continues its value from just inside the photo,
         easing toward open sky over the top third of the screen. */
      var W4 = c.width, H4 = c.height, joinRow = Math.round(g4.y * sc + 700 * (g4.h / 1755) * sc), refRow = Math.min(H4 - 1, joinRow + 8), ramp = Math.max(1, 0.3 * H * sc);
      if (refRow > 0) {
        /* one value for the whole row (its mean), never per column: continuing columns upward paints light pillars above bright peaks */
        var refSum = 0; for (var xx = 0; xx < W4; xx++) refSum += p[(refRow * W4 + xx) * 4 + 3]; var refMean = refSum / W4;
        for (var y = 0; y < refRow; y++) {
          var t = Math.min(1, (refRow - y) / ramp); t = t * t * (3 - 2 * t); var v = Math.round(refMean * (1 - t) + 255 * t);
          for (var x = 0; x < W4; x++) p[(y * W4 + x) * 4 + 3] = v;
        }
        /* and blend the first rows inside the photo toward that mean so the hand-over is soft */
        for (var y2 = refRow; y2 < Math.min(H4, refRow + 10); y2++) { var u = (y2 - refRow) / 10; for (var x2 = 0; x2 < W4; x2++) { var i2 = (y2 * W4 + x2) * 4 + 3; p[i2] = Math.round(p[i2] * u + refMean * (1 - u)); } }
      }
    }
    g.putImageData(d, 0, 0);
    occl[key] = c; return c;
  }
  function drawMist(ctx, name, W, H, z, now) {
    /* Depth, not decoration. Five sheets at five distances. Far: high among the peaks, large, slow, faint, cool, and hidden
       behind the dark rock. Near: low, smaller, quicker, denser, warm, in front of everything. Each drifts at its own pace,
       rises and settles over a long cycle, and thickens and thins over a longer one, all out of phase. */
    var dark = root.getAttribute('data-theme') !== 'dawn';
    var still = reduce ? 0 : now;
    var tex = mistSheets(dark);
    var tw = mistImg.width, th = mistImg.height, base = (W * 1.6) / tw;
    var lowTop = z.y0;
    var skyTop = name === 'coach' ? H * 0.2 : (name === 'workout' ? H * 0.3 : H * 0.26);
    var far = [
      { y: skyTop + (lowTop - skyTop) * 0.05, s: 2.3, v: 2.2, a: dark ? 0.2 : 0.22, ph: 0.3, pb: 2.2, bob: 4, t: tex.far },
      { y: skyTop + (lowTop - skyTop) * 0.55, s: 1.9, v: -3.2, a: dark ? 0.24 : 0.26, ph: 1.9, pb: 0.7, bob: 5, t: tex.far },
      { y: lowTop + (H - lowTop) * 0.05, s: 1.4, v: 6, a: dark ? 0.34 : 0.4, ph: 3.4, pb: 1.5, bob: 6, t: tex.mid }
    ];
    var near = [
      { y: lowTop + (H - lowTop) * 0.42, s: 1.0, v: -9, a: dark ? 0.42 : 0.46, ph: 5.0, pb: 3.3, bob: 7, t: tex.near },
      { y: lowTop + (H - lowTop) * 0.75, s: 0.7, v: 15, a: dark ? 0.24 : 0.26, ph: 0.9, pb: 4.4, bob: 8, t: tex.near }
    ];
    function sheet(s) {
      var w = tw * base * s.s, h = th * base * s.s, off = ((still * s.v) % w + w) % w;
      var bob = reduce ? 0 : Math.sin(still * 0.045 + s.ph) * s.bob;
      var swell = reduce ? 1 : 0.78 + 0.22 * Math.sin(still * 0.028 + s.pb);
      ctx.globalAlpha = s.a * swell;
      for (var x = -off; x < W; x += w) ctx.drawImage(s.t, x, s.y + bob - h * 0.5, w, h);
    }
    ctx.save();
    ctx.globalCompositeOperation = dark ? 'screen' : 'source-over';
    far.forEach(sheet);
    var mask = occlusionMask(name, dark, W, H);
    if (mask) { ctx.globalCompositeOperation = 'destination-in'; ctx.globalAlpha = 1; ctx.drawImage(mask, 0, 0, W, H); }
    ctx.globalCompositeOperation = dark ? 'screen' : 'source-over';
    near.forEach(sheet);
    /* keep the header block clear */
    ctx.globalCompositeOperation = 'destination-in'; ctx.globalAlpha = 1;
    /* a long eased ramp from just under the header, so the mist has no starting line */
    var m = ctx.createLinearGradient(0, H * 0.13, 0, skyTop + H * 0.14);
    for (var k = 0; k <= 8; k++) { var u = k / 8, e = u * u * (3 - 2 * u); m.addColorStop(u, 'rgba(0,0,0,' + e.toFixed(3) + ')'); }
    ctx.fillStyle = m; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  function drawAllEmbers(force) { screens.forEach(function (s) { if ($('screen-' + s).classList.contains('is-active')) drawEmbers(s, force); }); }
  drawAllEmbers(true);
  window.addEventListener('resize', function () { drawAllEmbers(true); });
  if (!reduce) {
    var last = 0;
    (function tick(t) { if (t - last > 40) { last = t; drawAllEmbers(false); } requestAnimationFrame(tick); })(0);
  }
})();
