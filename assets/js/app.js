/* =============================================================================
   QUIZ MINECRAFT 2026 — logique de jeu
   Portage du prototype Claude Design (classe DCLogic) en JS natif, sans build.
   Tout est pilote par un objet d'etat unique + un render() qui repeint le DOM.
   ============================================================================= */
(function () {
  'use strict';

  var BUILD = '1.0.0';

  /* ------------------------- tables d'effets (verbatim) ------------------------- */
  var FXOK = [
    ['fxUp', 20, ['#FFC145', '#4CD137'], 'zoomPunch 420ms steps(3) both', 'BOOM !', '#FFC145'],
    ['fxPop', 10, ['#FFFFFF', '#FFC145'], 'flashOk 380ms linear both', 'CRITIQUE !', '#FFE9A8'],
    ['fxSpin', 14, ['#4FD9D0', '#FFFFFF'], 'popStage 460ms ease-out both', 'PARFAIT !', '#4FD9D0'],
    ['fxUp', 24, ['#4CD137', '#8BE07C'], 'wobble 420ms ease-in-out both', 'XP + 10', '#8BE07C'],
    ['fxDown', 18, ['#4FD9D0', '#FFFFFF'], 'zoomPunch 420ms steps(3) both', 'DIAMANT !', '#4FD9D0'],
    ['fxSide', 16, ['#FFC145', '#FFE9A8'], 'flashOk 380ms linear both', 'EN OR !', '#FFC145'],
    ['fxPop', 8, ['#4CD137'], 'popStage 460ms ease-out both', 'GG !', '#4CD137'],
    ['fxUp', 18, ['#F2712C', '#FFC145'], 'wobble 420ms ease-in-out both', 'CRAFT OK', '#F2712C'],
    ['fxSpin', 12, ['#FFC145', '#4CD137'], 'zoomPunch 420ms steps(3) both', 'TU GÈRES', '#FFC145'],
    ['fxUp', 26, ['#FF4B4B', '#FFC145', '#4CD137', '#4FD9D0', '#FFFFFF'], 'flashOk 380ms linear both', 'MEGA !', '#FFFFFF'],
    ['fxDown', 20, ['#3A7BBF', '#FFFFFF'], 'popStage 460ms ease-out both', 'ENCHANTÉ !', '#6BA3DB'],
    ['fxUp', 22, ['#4CD137', '#FFC145'], 'wobble 420ms ease-in-out both', 'NIVEAU + 1', '#8BE07C'],
    ['fxSide', 14, ['#D8D8D8', '#FFC145'], 'zoomPunch 420ms steps(3) both', 'PIOCHE OK', '#D8D8D8'],
    ['fxUp', 20, ['#F2712C', '#FF4B4B'], 'flashOk 380ms linear both', 'ÇA CHAUFFE', '#F2712C'],
    ['fxPop', 10, ['#4CD137', '#8BE07C'], 'popStage 460ms ease-out both', 'ÉMERAUDE !', '#4CD137'],
    ['fxSpin', 16, ['#FFFFFF', '#FFC145'], 'wobble 420ms ease-in-out both', 'PRO !', '#FFFFFF'],
    ['fxDown', 22, ['#8B5A2B', '#FFC145'], 'zoomPunch 420ms steps(3) both', 'BLOC CASSÉ', '#FFC145'],
    ['fxUp', 24, ['#FFFFFF', '#4CD137'], 'flashOk 380ms linear both', 'IMPECCABLE', '#FFFFFF'],
    ['fxPop', 12, ['#FFC145', '#4FD9D0'], 'popStage 460ms ease-out both', 'LÉGENDAIRE', '#FFC145'],
    ['fxUp', 18, ['#4CD137', '#FFC145'], 'wobble 420ms ease-in-out both', 'BIEN VU !', '#4CD137']
  ];
  var FXKO = [
    ['fxDown', 16, ['#FF4B4B', '#8B8B8B'], 'shakeHard 380ms steps(1) both', 'OUPS', '#FF4B4B'],
    ['fxDown', 12, ['#6A6A7A'], 'tiltKo 460ms ease-in-out both', 'AÏE', '#FF8A8A'],
    ['fxDown', 18, ['#FF4B4B'], 'rollKo 520ms ease-in-out both', 'PRESQUE...', '#FFC145'],
    ['fxDown', 14, ['#8B8B8B', '#4A4A5A'], 'flashKo 380ms linear both', 'RATÉ', '#FF4B4B'],
    ['fxPop', 8, ['#4CD137', '#1F4A12'], 'shakeHard 380ms steps(1) both', 'CREEPER !', '#4CD137'],
    ['fxDown', 20, ['#8B5A2B', '#6A6A7A'], 'blurKo 420ms linear both', 'BOUM...', '#F2712C'],
    ['fxDown', 10, ['#FF4B4B'], 'tiltKo 460ms ease-in-out both', 'PERDU', '#FF4B4B'],
    ['fxDown', 16, ['#6A6A7A', '#FFFFFF'], 'rollKo 520ms ease-in-out both', 'PAS TOUT À FAIT', '#FFFFFF'],
    ['fxDown', 14, ['#FF4B4B', '#8B8B8B'], 'flashKo 380ms linear both', 'ZUT', '#FF8A8A'],
    ['fxSide', 12, ['#6A6A7A'], 'shakeHard 380ms steps(1) both', 'HORS SUJET', '#B8A6D9'],
    ['fxDown', 18, ['#4A4A5A', '#FF4B4B'], 'blurKo 420ms linear both', 'NON...', '#FF4B4B'],
    ['fxDown', 12, ['#8B8B8B'], 'tiltKo 460ms ease-in-out both', 'DOMMAGE', '#FFFFFF'],
    ['fxDown', 20, ['#1A1A22', '#6A6A7A'], 'rollKo 520ms ease-in-out both', 'TROP DUR ?', '#B8A6D9'],
    ['fxPop', 6, ['#FF4B4B'], 'flashKo 380ms linear both', 'REESSAIE', '#FF4B4B'],
    ['fxDown', 16, ['#8B5A2B'], 'shakeHard 380ms steps(1) both', 'ÇA ARRIVE', '#F2712C'],
    ['fxDown', 10, ['#6A6A7A', '#8B8B8B'], 'blurKo 420ms linear both', 'MOUAIS', '#B8A6D9'],
    ['fxDown', 14, ['#3A7BBF', '#FFFFFF'], 'rollKo 520ms ease-in-out both', 'PLOUF', '#6BA3DB'],
    ['fxDown', 18, ['#F2712C', '#FF4B4B'], 'flashKo 380ms linear both', 'LAVE !', '#F2712C'],
    ['fxDown', 12, ['#1A1A22'], 'tiltKo 460ms ease-in-out both', 'BEDROCK...', '#8B8B8B'],
    ['fxDown', 16, ['#FF4B4B', '#4A4A5A'], 'shakeHard 380ms steps(1) both', 'GLOUPS', '#FF4B4B']
  ];
  var SHAPES = [
    { n: 'UNE CROIX', c: [2, 7, 10, 11, 12, 13, 14, 17, 22] },
    { n: 'UNE ÉPÉE', c: [2, 7, 12, 16, 17, 18, 22] },
    { n: 'UN T', c: [0, 1, 2, 3, 4, 7, 12, 17, 22] },
    { n: 'UN ÉCLAIR', c: [3, 7, 10, 11, 12, 16, 21] },
    { n: 'UN CŒUR', c: [1, 3, 5, 6, 7, 8, 9, 11, 12, 13, 17] }
  ];
  var MATS = [
    [/bois|planche|b[ûu]che|arbre/, '#8B5A2B', '#B37C46', '#5C3A1B', '#6E4522'],
    [/pierre|stone|pav|roche/, '#8B8B8B', '#ABABAB', '#6A6A6A', '#6E6E6E'],
    [/diamant|glace|nautile/, '#3EC4BC', '#ADF5F0', '#2E9E97', '#FFFFFF'],
    [/or\b|dor[ée]|gold|lingot/, '#C9962F', '#F2CE7B', '#A87C22', '#FFF0B8'],
    [/fer|acier|enclume|boussole/, '#C4C4C4', '#E8E8E8', '#8F8F8F', '#FFFFFF'],
    [/charbon|nether|obsidienne|bedrock|deep dark|sculk/, '#2A2A33', '#4A4A5A', '#151519', '#7A2B52'],
    [/cuivre|copper/, '#C6613A', '#E08850', '#9E4A2A', '#5FBFA8'],
    [/[ée]meraude|villageois|creeper|zombie|herbe|jungle/, '#3B8526', '#5FB33F', '#26591A', '#8BE07C'],
    [/eau|oc[ée]an|mer|dauphin|axolotl|lapis|bleu/, '#3A7BBF', '#6BA3DB', '#2A5C90', '#ADF5F0'],
    [/feu|lave|blaze|ghast|magma|explos/, '#F2712C', '#FF9A5F', '#B4491A', '#FFC145'],
    [/redstone|rouge|sang|tnt/, '#C4362B', '#E06A5F', '#8E2419', '#FF8A8A'],
    [/end|shulker|violet|ender/, '#6B3FA0', '#8F63C4', '#4A2A72', '#E0C8FF']
  ];

  /* ------------------------------- etat ------------------------------- */
  var NB_QUESTIONS = 12;
  var S = {
    data: window.QUIZ_DATA || null,
    screen: 'home', phase: 'dusk',
    qz: 0, lv: 0,
    questions: [], qi: 0, flashAt: [],
    sel: null, locked: false, wasOk: null,
    results: [], fx: null,
    mini: null, bonus: 0, combo: 0, bestCombo: 0, chaos: 0,
    usedOk: [], usedKo: [],
    confirmBack: false, openRecap: null, copied: false,
    sound: true
  };

  var rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var ac = null, miniTimer = null;

  /* ------------------------------- DOM ------------------------------- */
  function $(id) { return document.getElementById(id); }
  var app = $('app');
  var el = {
    sun: $('sun'), moon: $('moon'), night: $('skyNight'),
    edition: $('edition'), btnPlay: $('btnPlay'), btnSound: $('btnSound'),
    btnInstall: $('btnInstall'),
    levelsTitle: $('levelsTitle'),
    hudLabel: $('hudLabel'), combo: $('combo'), track: $('track'), counter: $('counter'),
    playfield: $('playfield'), consigne: $('consigne'), qText: $('qText'),
    depth: $('depth'), answers: $('answers'), expl: $('expl'),
    btnCta: $('btnCta'), qStage: $('qStage'),
    fx: $('fx'), fxParts: $('fxParts'), fxLabel: $('fxLabel'),
    resultSub: $('resultSub'), resultScore: $('resultScore'), resultRank: $('resultRank'),
    statScore: $('statScore'), statCombo: $('statCombo'), statChaos: $('statChaos'),
    resultMsg: $('resultMsg'), recap: $('recap'),
    btnShare: $('btnShare'), btnReplay: $('btnReplay'),
    overlayMini: $('overlayMini'), miniPanel: $('miniPanel'), miniBadge: $('miniBadge'),
    miniTime: $('miniTime'), miniTitle: $('miniTitle'), miniSub: $('miniSub'),
    miniBricks: $('miniBricks'), miniTarget: $('miniTarget'), miniStat: $('miniStat'),
    miniGrid: $('miniGrid'), miniMelt: $('miniMelt'), meltPips: $('meltPips'),
    btnStab: $('btnStab'), btnMiniNext: $('btnMiniNext'),
    overlayConfirm: $('overlayConfirm'), overlayInstall: $('overlayInstall'),
    installSteps: $('installSteps'),
    live: $('live')
  };

  /* ------------------------------ utilitaires ------------------------------ */
  function paint(c) {
    document.documentElement.style.setProperty('--page-bg', c);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', c);
  }

  function shuf(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = b[i];
      b[i] = b[j]; b[j] = t;
    }
    return b;
  }

  var NOTES = {
    sel: [[520, 0.05, 'square', 0.08]],
    ok: [[523, 0.09, 'square', 0.09], [659, 0.09, 'square', 0.09], [784, 0.16, 'square', 0.1]],
    ko: [[196, 0.14, 'sawtooth', 0.09], [147, 0.22, 'sawtooth', 0.08]],
    crack: [[140, 0.06, 'square', 0.09], [90, 0.08, 'sawtooth', 0.07]],
    alarm: [[1180, 0.07, 'square', 0.07], [880, 0.07, 'square', 0.07]],
    win: [[659, 0.08, 'square', 0.09], [880, 0.08, 'square', 0.09], [1046, 0.2, 'square', 0.1]]
  };

  function snd(kind) {
    if (!S.sound) return;
    var notes = NOTES[kind];
    if (!notes) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ac) ac = new AC();
      if (ac.state === 'suspended') ac.resume();
      var t = ac.currentTime;
      notes.forEach(function (n) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = n[2];
        o.frequency.value = n[0];
        g.gain.setValueAtTime(n[3], t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + n[1]);
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + n[1] + 0.02);
        t += n[1] * 0.85;
      });
    } catch (e) { /* audio indisponible : le jeu continue */ }
  }

  function mat(txt) {
    var t = (txt || '').toLowerCase();
    for (var i = 0; i < MATS.length; i++) if (MATS[i][0].test(t)) return MATS[i];
    var pool = [MATS[8], MATS[11], MATS[7], MATS[3]];
    return pool[(t.length + (t.charCodeAt(0) || 0) || 0) % pool.length];
  }

  function modeOf(q) {
    var t = q.q.toLowerCase();
    if (/hauteur|jusqu.o[ùu]|niveau de lumi|creuser|profondeur|quelle est la hauteur/.test(t)) return 'slider';
    return 'blocks';
  }

  function consigneFor(q, mode) {
    if (mode === 'slider') return /lumi/.test(q.q.toLowerCase()) ? 'RÈGLE LE BON NIVEAU' : 'DESCENDS À LA BONNE HAUTEUR';
    return 'TOUCHE LE BON BLOC';
  }

  function quizName() { return S.data ? S.data.quiz[S.qz].titre : ''; }
  function levelName() { return S.data ? S.data.quiz[S.qz].niveaux[S.lv].nom : ''; }

  function rankFor(score, total) {
    var p = total ? score / total : 0;
    if (total && score === total) return { n: 'ARCHITECTE DU NETHER', c: '#4FD9D0', m: "Sans faute. Tu as tout dans la tête, même les chiffres." };
    if (p >= 0.83) return { n: 'MAÎTRE BÂTISSEUR', c: '#FFC145', m: 'Presque parfait. Il te manque deux détails de rien.' };
    if (p >= 0.58) return { n: 'AVENTURIER CONFIRMÉ', c: '#4CD137', m: "Solide. Tu joues bien, mais l'expert t'attend." };
    if (p >= 0.33) return { n: 'EXPLORATEUR', c: '#F2712C', m: 'Tu as encore des grottes à explorer. Retente !' };
    return { n: 'NOUVEAU NÉ', c: '#B8A6D9', m: 'Début de partie. Va casser du bois et reviens.' };
  }

  function svgBlock(m, size) {
    return '<svg viewBox="0 0 16 16" width="' + size + '" height="' + size + '" shape-rendering="crispEdges" aria-hidden="true">' +
      '<rect x="2" y="5" width="12" height="9" fill="' + m[1] + '"></rect>' +
      '<rect x="2" y="2" width="12" height="3" fill="' + m[2] + '"></rect>' +
      '<rect x="2" y="12" width="12" height="2" fill="' + m[3] + '"></rect>' +
      '<rect x="4" y="7" width="3" height="2" fill="' + m[4] + '"></rect>' +
      '<rect x="9" y="9" width="2" height="3" fill="' + m[4] + '"></rect></svg>';
  }

  /* ------------------------------ navigation ------------------------------ */
  function start() {
    if (S.phase !== 'dusk') return;
    snd('sel');
    S.phase = 'rising';
    paint('#4E2AA8');
    render();
    setTimeout(function () { S.screen = 'quizzes'; render(); }, rm ? 300 : 1300);
    setTimeout(function () { S.phase = 'day'; render(); }, rm ? 320 : 1800);
  }

  function toHome() {
    paint('#140A26');
    S.screen = 'home'; S.phase = 'dusk';
    S.sel = null; S.locked = false; S.fx = null; S.questions = []; S.confirmBack = false;
    clearMini();
    render();
  }

  function toQuizzes() { snd('sel'); S.screen = 'quizzes'; S.confirmBack = false; clearMini(); render(); }
  function pickQuiz(i) { snd('sel'); S.qz = i; S.screen = 'levels'; render(); }

  function begin(lv) {
    var d = S.data;
    if (!d) return;
    snd('sel');
    var quiz = d.quiz[S.qz];
    var pool = [];
    quiz.niveaux.forEach(function (nv, li) {
      nv.questions.forEach(function (qq) { pool.push({ q: qq, li: li }); });
    });
    var n = Math.min(NB_QUESTIONS, pool.length);
    var key = 'mcq2026-seen-' + quiz.id + '-' + lv;
    var seen = [];
    try { seen = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { seen = []; }

    var bag = [];
    pool.forEach(function (p, idx) {
      var dist = Math.abs(p.li - lv);
      var k = dist === 0 ? 6 : dist === 1 ? 2 : 1;
      if (seen.indexOf(p.q.q) >= 0) k = 1;
      for (var j = 0; j < k; j++) bag.push(idx);
    });
    var order = shuf(bag), taken = {}, picked = [];
    for (var i = 0; i < order.length && picked.length < n; i++) {
      if (!taken[order[i]]) { taken[order[i]] = 1; picked.push(pool[order[i]]); }
    }

    var qs = picked.map(function (p) {
      var q = p.q, r = q.r, ok = q.ok;
      var idx = shuf(q.r.map(function (_, k) { return k; }));
      r = idx.map(function (k) { return q.r[k]; });
      ok = idx.indexOf(q.ok);
      return { q: q.q, r: r, ok: ok, explication: q.explication, m: modeOf(q), li: p.li };
    });
    try { localStorage.setItem(key, JSON.stringify(qs.map(function (x) { return x.q; }))); } catch (e) {}

    S.lv = lv; S.screen = 'q'; S.questions = qs; S.qi = 0;
    S.sel = null; S.locked = false; S.wasOk = null; S.results = []; S.fx = null;
    S.openRecap = null; S.combo = 0; S.bestCombo = 0; S.chaos = 0; S.bonus = 0;
    S.usedOk = []; S.usedKo = []; S.copied = false;
    S.flashAt = [2 + Math.floor(Math.random() * 2), 7 + Math.floor(Math.random() * 2)];
    clearMini();
    render();
  }

  function select(i) {
    if (S.locked) return;
    var q = S.questions[S.qi];
    snd('sel');
    S.sel = i;
    if (q && q.m === 'slider') { render(); return; }
    validate(false, i);
  }

  function makeFx(ok) {
    var F = ok ? FXOK : FXKO;
    var key = ok ? 'usedOk' : 'usedKo';
    var used = S[key] || [];
    if (used.length >= F.length) used = [];
    var k = Math.floor(Math.random() * F.length), guard = 0;
    while (used.indexOf(k) >= 0 && guard < 80) { k = Math.floor(Math.random() * F.length); guard++; }
    var f = F[k], parts = [];
    if (!rm) {
      for (var i = 0; i < f[1]; i++) {
        var c = f[2][i % f[2].length];
        var sz = 6 + Math.floor(Math.random() * 12);
        var top = f[0] === 'fxDown' ? -6 - Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 45);
        parts.push('left:' + Math.floor(Math.random() * 94) + '%;top:' + top + '%;width:' + sz + 'px;height:' + sz +
          'px;background:' + c + ';animation:' + f[0] + ' ' + (700 + Math.floor(Math.random() * 600)) + 'ms ease-out ' +
          Math.floor(Math.random() * 240) + 'ms both');
      }
    }
    S[key] = used.concat([k]);
    return { parts: parts, stage: rm ? '' : f[3], label: f[4], color: f[5] };
  }

  function validate(timeout, forced) {
    if (S.locked) return;
    var q = S.questions[S.qi];
    if (!q) return;
    var pick = (forced === undefined || forced === null) ? S.sel : forced;
    if (pick === null && !timeout) return;
    var ok = !timeout && pick === q.ok;
    snd(ok ? 'ok' : 'ko');
    S.locked = true; S.wasOk = ok; S.sel = pick;
    S.results = S.results.concat([ok]);
    S.combo = ok ? S.combo + 1 : 0;
    S.bestCombo = Math.max(S.bestCombo || 0, S.combo);
    S.fx = makeFx(ok);
    S.live = ok ? 'Correct' : 'Incorrect, la bonne réponse était ' + q.r[q.ok];
    render();
  }

  function next() {
    if (!S.locked) return;
    if (S.qi + 1 >= S.questions.length) {
      S.screen = 'result'; S.copied = false; S.openRecap = null;
      snd('win'); render();
      return;
    }
    var nq = S.qi + 1;
    S.qi = nq; S.sel = null; S.locked = false; S.wasOk = null; S.fx = null; S.live = '';
    clearMini();
    render();
    if (!rm && (S.flashAt || []).indexOf(nq) >= 0) openFlash();
  }

  /* ------------------------------ mini-jeux ------------------------------ */
  function clearMini() {
    if (miniTimer) { clearTimeout(miniTimer); miniTimer = null; }
    S.mini = null;
  }

  function openFlash() {
    var kind = Math.random() < 0.5 ? 'bricks' : 'melt';
    var sh = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    var id = Date.now();
    snd('alarm');
    S.mini = { id: id, kind: kind, shape: sh, hit: [], bad: 0, taps: 0, need: 6, done: false, won: false };
    render();
    miniTimer = setTimeout(function () {
      var m = S.mini;
      if (m && m.id === id && !m.done) {
        snd('ko');
        m.done = true; m.won = false;
        render();
      }
    }, kind === 'bricks' ? 11000 : 7000);
  }

  function hitBrick(i) {
    var m = S.mini;
    if (!m || m.done || m.kind !== 'bricks') return;
    if (m.hit.indexOf(i) >= 0) return;
    var good = m.shape.c.indexOf(i) >= 0;
    m.hit = m.hit.concat([i]);
    m.bad = m.bad + (good ? 0 : 1);
    snd(good ? 'crack' : 'ko');
    var need = m.shape.c.filter(function (c) { return m.hit.indexOf(c) < 0; }).length;
    if (need === 0) { m.done = true; m.won = m.bad <= 1; snd(m.won ? 'win' : 'ko'); }
    else if (m.bad >= 3) { m.done = true; m.won = false; }
    render();
  }

  function tapStab() {
    var m = S.mini;
    if (!m || m.done || m.kind !== 'melt') return;
    m.taps = m.taps + 1;
    m.done = m.taps >= m.need;
    m.won = m.done;
    snd(m.done ? 'win' : 'crack');
    render();
  }

  function miniOut() {
    var m = S.mini;
    if (m && m.won) { S.bonus = (S.bonus || 0) + 1; S.chaos = (S.chaos || 0) + 1; }
    clearMini();
    render();
  }

  /* ------------------------------ partage ------------------------------ */
  function share() {
    var total = S.questions.length;
    var score = S.results.filter(Boolean).length;
    var r = rankFor(score, total);
    var sq = S.results.map(function (x) { return x ? '🟩' : '🟥'; }).join('');
    var txt = 'Quiz Minecraft 2026 — ' + quizName() + ' · ' + levelName() +
      '\nScore : ' + score + '/' + total + ' — ' + r.n + '\n' + sq +
      '\n' + location.href;
    var copy = function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () {
          S.copied = true; render();
          setTimeout(function () { S.copied = false; render(); }, 1500);
        }).catch(function () {});
      }
    };
    if (navigator.share) navigator.share({ text: txt }).catch(copy); else copy();
  }

  /* ------------------------------ rendu ------------------------------ */
  var lastQSig = '';

  function render() {
    app.dataset.screen = S.screen;
    app.dataset.phase = S.phase;

    var day = S.phase !== 'dusk';
    var total = S.questions.length;
    var totalQ = total || NB_QUESTIONS;
    var score = S.results.filter(Boolean).length;
    var q = S.questions[S.qi];
    var mode = q ? q.m : 'blocks';

    /* --- cycle jour / nuit pilote par l'avancee dans la partie --- */
    var prog = totalQ > 1 ? Math.min(1, S.qi / (totalQ - 1)) : 0;
    var cyc = (day && (S.screen === 'q' || S.screen === 'result')) ? prog : 0;
    var nightAmt = Math.max(0, Math.min(1, (cyc - 0.35) / 0.5));
    app.dataset.night = nightAmt > 0.5 ? '1' : '0';

    if (day) {
      el.sun.style.top = (12 + cyc * 52).toFixed(1) + '%';
      el.sun.style.transform = 'translateX(-50%) scale(' + (1.35 - cyc * 0.3).toFixed(2) + ')';
      el.sun.style.opacity = (1 - nightAmt * 0.8).toFixed(2);
    } else {
      el.sun.style.top = ''; el.sun.style.transform = ''; el.sun.style.opacity = '';
    }
    if (cyc > 0.42) {
      el.moon.style.opacity = '1';
      el.moon.style.top = (78 - ((cyc - 0.42) / 0.58) * 64).toFixed(1) + '%';
    } else {
      el.moon.style.opacity = '0'; el.moon.style.top = '';
    }
    el.night.style.opacity = nightAmt.toFixed(2);

    /* --- accueil --- */
    el.edition.textContent = 'éd. 2026 · à jour ' + (S.data ? S.data.aJour : '26.3') + ' · BUILD ' + BUILD;
    el.btnSound.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
    el.btnSound.setAttribute('aria-label', S.sound ? 'Couper le son' : 'Remettre le son');

    /* --- niveaux --- */
    el.levelsTitle.textContent = quizName();
    var pools = document.querySelectorAll('[data-pool]');
    for (var pi = 0; pi < pools.length; pi++) pools[pi].textContent = NB_QUESTIONS + ' ÉPREUVES TIRÉES DE 36';

    /* --- question --- */
    if (S.screen === 'q') {
      el.hudLabel.textContent = quizName() + ' · ' + levelName();
      el.combo.hidden = (S.combo || 0) < 2;
      el.combo.textContent = 'COMBO x' + (S.combo || 0);

      if (el.track.childElementCount !== totalQ) {
        el.track.textContent = '';
        for (var i = 0; i < totalQ; i++) el.track.appendChild(document.createElement('span'));
      }
      for (var t = 0; t < totalQ; t++) {
        var cell = el.track.children[t];
        cell.style.cssText = '';
        if (t < S.results.length) {
          cell.style.cssText = S.results[t]
            ? 'background-color:#4CD137;box-shadow:inset 0 3px 0 rgba(255,255,255,.55)'
            : 'background-color:#8B5A2B;background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.5) 0 2px,transparent 2px 5px)';
        } else if (t === S.qi) {
          cell.style.cssText = 'background-color:rgba(255,193,69,.45);box-shadow:inset 0 0 0 3px #FFC145';
        }
      }

      var answered = S.qi + (S.locked ? 1 : 0);
      el.counter.textContent = Math.min(answered + (S.locked ? 0 : 1), total || 1) + '/' + totalQ;
      el.consigne.textContent = q ? consigneFor(q, mode) : '';
      el.qText.textContent = q ? q.q : '';

      var sig = [S.qi, S.locked ? 1 : 0, S.sel, mode].join('|');
      if (sig !== lastQSig) {
        lastQSig = sig;
        if (mode === 'slider') { buildBands(q); el.depth.hidden = false; el.answers.hidden = true; el.answers.textContent = ''; }
        else { buildAnswers(q); el.answers.hidden = false; el.depth.hidden = true; el.depth.textContent = ''; }
      }

      if (S.locked && q) {
        el.expl.hidden = false;
        el.expl.textContent = q.explication;
        el.expl.classList.toggle('is-ko', !S.wasOk);
      } else {
        el.expl.hidden = true;
      }

      /* bouton d'action bas d'ecran */
      el.btnCta.className = 'btn-cta';
      if (S.locked) {
        el.btnCta.textContent = S.qi + 1 >= total ? 'VOIR LE SCORE' : 'SUIVANT ›';
        el.btnCta.classList.add('is-next');
      } else if (mode === 'slider') {
        if (S.sel === null) el.btnCta.textContent = 'PLACE LE CURSEUR';
        else { el.btnCta.textContent = 'VALIDER'; el.btnCta.classList.add('is-ready'); }
      } else {
        el.btnCta.textContent = 'ÉPREUVE ' + (S.qi + 1) + ' / ' + totalQ;
      }

      /* effets */
      if (S.fx) {
        el.fx.hidden = false;
        el.fxParts.textContent = '';
        S.fx.parts.forEach(function (css) {
          var sp = document.createElement('span');
          sp.style.cssText = css;
          el.fxParts.appendChild(sp);
        });
        el.fxLabel.textContent = S.fx.label;
        el.fxLabel.style.color = S.fx.color;
        el.qStage.style.animation = S.fx.stage || '';
      } else {
        el.fx.hidden = true;
        el.fxParts.textContent = '';
        el.qStage.style.animation = '';
      }
      el.qStage.dataset.dim = S.mini ? '1' : '0';
      el.qStage.dataset.mode = mode;
    }

    /* --- resultat --- */
    if (S.screen === 'result') {
      var rank = rankFor(score, total);
      el.resultSub.textContent = quizName() + ' · ' + levelName();
      el.resultScore.textContent = score + '/' + totalQ;
      el.resultRank.textContent = rank.n;
      el.resultRank.style.color = rank.c;
      el.statScore.textContent = score + '/' + totalQ;
      el.statCombo.textContent = 'x' + (S.bestCombo || 0);
      el.statChaos.textContent = (S.chaos || 0) + '/2';
      el.resultMsg.textContent = rank.m;
      el.btnShare.textContent = S.copied ? 'COPIÉ !' : 'PARTAGER';
      buildRecap();
    }

    renderMini();
    el.overlayConfirm.hidden = !S.confirmBack;
    el.live.textContent = S.live || '';
  }

  function buildAnswers(q) {
    el.answers.textContent = '';
    if (!q) return;
    var short = q.r.every(function (r) { return r.length <= 13; });
    el.answers.classList.toggle('two-col', short);

    q.r.forEach(function (txt, i) {
      var m = mat(txt);
      var isOk = i === q.ok;
      var mine = S.sel === i;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ans';
      b.setAttribute('aria-label', txt);

      if (!S.locked) {
        if (mine) b.classList.add('is-sel');
        if (!rm) b.style.animation = 'floatIn 240ms cubic-bezier(.34,1.5,.64,1) ' + (i * 55) + 'ms both';
      } else if (isOk) {
        b.classList.add('is-ok');
      } else {
        b.classList.add('is-gone');
        if (mine) b.classList.add('is-ko');
        if (rm) b.style.opacity = '.25';
        else b.style.animation = 'fallOut 900ms cubic-bezier(.4,0,.8,1) ' + (i * 70 + 120) + 'ms both';
      }

      var mark = '';
      if (S.locked) mark = isOk ? '✓' : (mine ? '✗' : '');
      b.innerHTML = '<span class="ans-ico">' + svgBlock(m, 42) + '</span>' +
        '<span class="ans-txt"></span><span class="ans-mark">' + mark + '</span>';
      b.querySelector('.ans-txt').textContent = txt;
      b.addEventListener('click', function () { select(i); });
      el.answers.appendChild(b);
    });
  }

  function buildBands(q) {
    el.depth.textContent = '';
    if (!q) return;
    q.r.forEach(function (txt, i) {
      var isOk = i === q.ok;
      var mine = S.sel === i;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'band';
      b.setAttribute('aria-label', txt);
      var mark = '';
      if (!S.locked) { if (mine) b.classList.add('is-sel'); }
      else if (isOk) { b.classList.add('is-ok'); mark = '✓'; }
      else if (mine) { b.classList.add('is-ko'); mark = '✗'; }
      else { b.classList.add('is-dim'); }

      b.innerHTML = '<span class="band-dot"></span><span class="band-txt"></span><span class="band-mark">' + mark + '</span>';
      b.querySelector('.band-txt').textContent = txt;
      b.addEventListener('click', function () { select(i); });
      el.depth.appendChild(b);
    });
  }

  function buildRecap() {
    el.recap.textContent = '';
    S.results.forEach(function (ok, i) {
      var qq = S.questions[i];
      var open = S.openRecap === i;
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'recap-row' + (open ? ' is-open' : '');
      if (!rm) row.style.animation = 'floatIn 220ms ease-out ' + Math.min(560, 40 * i) + 'ms both';
      row.innerHTML =
        '<span class="recap-line">' +
        '<span class="recap-chip" style="background-color:' + (ok ? '#4CD137' : '#FF4B4B') + '"></span>' +
        '<span class="recap-num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="recap-q"></span></span>' +
        (open ? '<span class="recap-ans"></span>' : '');
      row.querySelector('.recap-q').textContent = qq ? qq.q : '';
      if (open) row.querySelector('.recap-ans').textContent = qq ? 'Réponse : ' + qq.r[qq.ok] : '';
      row.addEventListener('click', function () { S.openRecap = open ? null : i; render(); });
      el.recap.appendChild(row);
    });
  }

  function renderMini() {
    var m = S.mini;
    el.overlayMini.hidden = !m;
    if (!m) { el.miniPanel.dataset.melting = '0'; return; }

    el.miniBadge.textContent = m.done ? 'FINI' : (m.kind === 'bricks' ? '11 SEC' : '7 SEC');
    el.miniTitle.textContent = m.done
      ? (m.won ? 'BIEN JOUÉ !' : 'TROP TARD !')
      : (m.kind === 'bricks' ? 'CASSE LA FORME !' : 'LE CHUNK FOND !');
    el.miniSub.textContent = m.done
      ? (m.won ? "Bonus empoché. La question t'attend." : 'Pas grave, ça ne coûte aucun point.')
      : (m.kind === 'bricks'
        ? 'Casse les briques pour dessiner ' + m.shape.n + '. Max 2 erreurs.'
        : 'Tape STABILISER six fois avant que tout coule.');

    if (m.done) { el.miniTime.style.animation = ''; el.miniTime.style.width = '0%'; }
    else if (el.miniTime.dataset.id !== String(m.id)) {
      el.miniTime.dataset.id = String(m.id);
      el.miniTime.style.width = '100%';
      el.miniTime.style.animation = 'timeBar ' + (m.kind === 'bricks' ? 11000 : 7000) + 'ms linear both';
    }
    el.miniPanel.dataset.melting = (m.kind === 'melt' && !m.done && !rm) ? '1' : '0';

    el.miniBricks.hidden = m.kind !== 'bricks';
    el.miniMelt.hidden = m.kind !== 'melt';

    if (m.kind === 'bricks') {
      if (el.miniTarget.childElementCount !== 25) {
        el.miniTarget.textContent = ''; el.miniGrid.textContent = '';
        for (var i = 0; i < 25; i++) {
          el.miniTarget.appendChild(document.createElement('span'));
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'brick';
          b.setAttribute('aria-label', 'brique');
          (function (k) { b.addEventListener('click', function () { hitBrick(k); }); })(i);
          el.miniGrid.appendChild(b);
        }
      }
      for (var j = 0; j < 25; j++) {
        var inShape = m.shape.c.indexOf(j) >= 0;
        el.miniTarget.children[j].style.backgroundColor = inShape ? '#FFC145' : '';
        var brick = el.miniGrid.children[j];
        brick.className = 'brick' + (m.hit.indexOf(j) >= 0 ? (inShape ? ' hit-ok' : ' hit-ko') : '');
      }
      el.miniGrid.classList.toggle('is-done', !!m.done);
      el.miniStat.textContent = 'MODÈLE\nERREURS ' + m.bad + '/3';
    }

    if (m.kind === 'melt') {
      if (el.meltPips.childElementCount !== m.need) {
        el.meltPips.textContent = '';
        for (var p = 0; p < m.need; p++) el.meltPips.appendChild(document.createElement('span'));
      }
      for (var pp = 0; pp < m.need; pp++) el.meltPips.children[pp].classList.toggle('on', pp < m.taps);
      el.btnStab.textContent = m.done ? (m.won ? 'STABILISÉ !' : 'TROP TARD') : 'STABILISER';
      el.btnStab.disabled = !!m.done;
    }

    el.btnMiniNext.hidden = !m.done;
    el.btnMiniNext.textContent = m.won ? 'BONUS ENCAISSÉ ›' : 'ON CONTINUE ›';
  }

  /* ------------------------------ evenements ------------------------------ */
  el.btnPlay.addEventListener('click', start);
  el.btnSound.addEventListener('click', function () {
    S.sound = !S.sound;
    try { localStorage.setItem('mcq2026-sound', S.sound ? '1' : '0'); } catch (e) {}
    if (S.sound) snd('sel');
    render();
  });

  var navBtns = document.querySelectorAll('[data-nav]');
  for (var nb = 0; nb < navBtns.length; nb++) {
    navBtns[nb].addEventListener('click', function (ev) {
      var to = ev.currentTarget.getAttribute('data-nav');
      if (to === 'home') toHome(); else toQuizzes();
    });
  }
  var quizBtns = document.querySelectorAll('[data-quiz]');
  for (var qb = 0; qb < quizBtns.length; qb++) {
    quizBtns[qb].addEventListener('click', function (ev) {
      pickQuiz(parseInt(ev.currentTarget.getAttribute('data-quiz'), 10));
    });
  }
  var lvBtns = document.querySelectorAll('[data-level]');
  for (var lb = 0; lb < lvBtns.length; lb++) {
    lvBtns[lb].addEventListener('click', function (ev) {
      begin(parseInt(ev.currentTarget.getAttribute('data-level'), 10));
    });
  }

  $('btnQuit').addEventListener('click', function () { S.confirmBack = true; render(); });
  $('btnCancelBack').addEventListener('click', function () { S.confirmBack = false; render(); });
  $('btnDoBack').addEventListener('click', function () {
    S.screen = 'levels'; S.confirmBack = false; S.locked = false; S.sel = null; S.fx = null;
    clearMini(); render();
  });
  el.btnCta.addEventListener('click', function () { if (S.locked) next(); else validate(false); });
  el.btnShare.addEventListener('click', share);
  el.btnReplay.addEventListener('click', function () {
    S.screen = 'levels'; S.fx = null; S.locked = false; S.sel = null; render();
  });
  el.btnStab.addEventListener('click', tapStab);
  el.btnMiniNext.addEventListener('click', miniOut);

  window.addEventListener('keydown', function (e) {
    if (S.screen === 'home' && (e.key === 'Enter' || e.key === ' ')) { start(); return; }
    if (S.screen === 'q') {
      if (S.mini) return;
      if (!S.locked && e.key >= '1' && e.key <= '4') { select(parseInt(e.key, 10) - 1); return; }
      if (e.key === 'Enter') { if (S.locked) next(); else validate(false); return; }
      if (e.key === 'Escape') { S.confirmBack = true; render(); return; }
    }
    if (e.key === 'Escape') {
      if (S.screen === 'levels') toQuizzes();
      else if (S.screen === 'quizzes') toHome();
    }
  });

  /* la banque de questions peut arriver apres le script : on attend gentiment */
  if (!S.data) {
    var poll = setInterval(function () {
      if (window.QUIZ_DATA) { clearInterval(poll); S.data = window.QUIZ_DATA; render(); }
    }, 60);
    setTimeout(function () { clearInterval(poll); }, 8000);
  }

  try {
    var pref = localStorage.getItem('mcq2026-sound');
    if (pref !== null) S.sound = pref === '1';
  } catch (e) {}

  /* ======================= INSTALLATION (PWA) ======================= */
  /* Objectif : « JOUER depuis l'icone du telephone ». Chrome/Android propose une
     vraie invite d'installation via beforeinstallprompt ; iOS ne l'implemente pas,
     et Chrome ne declenche pas toujours l'evenement. Le bouton reste donc toujours
     disponible hors mode application, avec la marche a suivre en repli. */
  var deferredPrompt = null;
  var installed = false;
  try { installed = localStorage.getItem('mcq2026-installed') === '1'; } catch (e) {}

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches) ||
      window.navigator.standalone === true;
  }

  function isIOS() {
    var ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function updateInstallBtn() {
    el.btnInstall.hidden = isStandalone() || installed;
  }

  function markInstalled() {
    installed = true;
    deferredPrompt = null;
    try { localStorage.setItem('mcq2026-installed', '1'); } catch (e) {}
    updateInstallBtn();
  }

  function installSteps() {
    if (isIOS()) {
      return [
        "Touche le bouton <b>Partager</b> en bas de l'écran.",
        "Fais défiler et choisis <b>Sur l'écran d'accueil</b>.",
        'Valide avec <b>Ajouter</b> : le jeu apparaît comme une appli.'
      ];
    }
    return [
      'Ouvre le menu <b>⋮</b> de Chrome, en haut à droite.',
      "Choisis <b>Installer l'application</b> ou <b>Ajouter à l'écran d'accueil</b>.",
      'Valide : le jeu se lance ensuite en plein écran, sans barre de navigateur.'
    ];
  }

  function openInstallHelp() {
    el.installSteps.innerHTML = installSteps().map(function (t) { return '<li>' + t + '</li>'; }).join('');
    el.overlayInstall.hidden = false;
  }

  $('btnInstallClose').addEventListener('click', function () { el.overlayInstall.hidden = true; });

  el.btnInstall.addEventListener('click', function () {
    snd('sel');
    if (!deferredPrompt) { openInstallHelp(); return; }
    deferredPrompt.prompt();
    var choice = deferredPrompt.userChoice;
    deferredPrompt = null;
    if (choice && choice.then) {
      choice.then(function (res) {
        if (res && res.outcome === 'accepted') markInstalled();
      }).catch(function () {});
    }
  });

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    installed = false;
    try { localStorage.removeItem('mcq2026-installed'); } catch (er) {}
    updateInstallBtn();
  });

  window.addEventListener('appinstalled', markInstalled);

  if (window.matchMedia) {
    var mq = window.matchMedia('(display-mode: standalone)');
    if (mq.addEventListener) mq.addEventListener('change', updateInstallBtn);
  }
  updateInstallBtn();

  /* service worker : le jeu reste jouable hors ligne une fois installe */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }

  /* ------------------------------ demarrage ------------------------------ */
  paint('#140A26');
  render();
})();
