/* =============================================================================
   MUSIQUE 8 BITS — une boucle jouee a la volee, aucun fichier audio
   -----------------------------------------------------------------------------
   Quatre mesures en la mineur (Am - F - C - G), 112 pulsations par minute :
   une basse carree, un arpege, une petite melodie et deux percussions. Tout est
   synthetise par le navigateur, donc rien a telecharger et rien a mettre en
   cache : la musique marche hors ligne comme le reste.

   L'ecriture suit la methode classique du planificateur a l'avance : un
   battement toutes les 60 ms programme les notes des 250 ms suivantes. Sans
   cela, le moindre a-coup du telephone s'entendrait.

   API : QUIZ_MUSIC.demarre(contexte, sortie) / .arrete() / .joue()
   ============================================================================= */
(function () {
  'use strict';

  var BPM = 112;
  var PAS = 60 / BPM / 4;          /* duree d'une double-croche */
  var MESURES = 4;
  var PAS_TOTAL = MESURES * 16;    /* 64 pas dans la boucle */

  /* les hauteurs utiles, en hertz */
  var N = {
    F2: 87.31, G2: 98.00, A2: 110.00, C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00,
    A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00,
    A4: 440.00, C5: 523.25, D5: 587.33, E5: 659.25
  };

  /* une mesure par accord : basse, arpege de quatre notes, couleur */
  var GRILLE = [
    { basse: N.A2, arpege: [N.A3, N.C4, N.E4, N.C4] },   /* Am */
    { basse: N.F2, arpege: [N.F3, N.A3, N.C4, N.A3] },   /* F  */
    { basse: N.C3, arpege: [N.C4, N.E4, N.G4, N.E4] },   /* C  */
    { basse: N.G2, arpege: [N.G3, N.B3, N.D4, N.B3] }    /* G  */
  ];

  /* la melodie ne joue que sur la premiere et la troisieme mesure : elle
     respire, sinon elle fatigue au bout de trois parties */
  var MELODIE = {};
  MELODIE[0] = N.E5; MELODIE[4] = N.D5; MELODIE[8] = N.C5; MELODIE[12] = N.A4;
  MELODIE[32] = N.G4; MELODIE[36] = N.A4; MELODIE[40] = N.C5; MELODIE[44] = N.E5;

  var ac = null, sortie = null, gain = null, bruit = null;
  var minuteur = null, pas = 0, prochain = 0, enMarche = false;

  function bufferDeBruit() {
    if (bruit) return bruit;
    var n = Math.floor(ac.sampleRate * 0.12);
    bruit = ac.createBuffer(1, n, ac.sampleRate);
    var d = bruit.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    return bruit;
  }

  function note(type, freq, t, duree, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g); g.connect(gain);
    o.start(t); o.stop(t + duree + 0.02);
  }

  function percussion(t, aigu) {
    var s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    s.buffer = bufferDeBruit();
    f.type = aigu ? 'highpass' : 'lowpass';
    f.frequency.value = aigu ? 6000 : 220;
    g.gain.setValueAtTime(aigu ? 0.16 : 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (aigu ? 0.04 : 0.14));
    s.connect(f); f.connect(g); g.connect(gain);
    s.start(t); s.stop(t + 0.2);
  }

  function programme(p, t) {
    var mesure = Math.floor(p / 16) % MESURES;
    var dans = p % 16;
    var accord = GRILLE[mesure];

    /* percussions : grosse caisse sur les temps 1 et 3, charleston aux croches */
    if (dans === 0 || dans === 8) percussion(t, false);
    if (dans % 4 === 2) percussion(t, true);

    /* basse : la fondamentale, puis une relance a la fin de la mesure */
    if (dans === 0) note('square', accord.basse, t, 0.30, 0.16);
    if (dans === 6) note('square', accord.basse, t, 0.16, 0.11);
    if (dans === 10) note('square', accord.basse * 2, t, 0.14, 0.08);

    /* arpege : une double-croche sur deux, ca suffit a porter la boucle */
    if (dans % 2 === 0) note('square', accord.arpege[(dans / 2) % 4], t, 0.12, 0.045);

    /* melodie : triangle, plus doux que le carre */
    if (MELODIE[p]) note('triangle', MELODIE[p], t, 0.42, 0.10);
  }

  function battement() {
    if (!enMarche || !ac) return;
    /* on programme tout ce qui tombe dans les 250 ms a venir */
    while (prochain < ac.currentTime + 0.25) {
      programme(pas, prochain);
      pas = (pas + 1) % PAS_TOTAL;
      prochain += PAS;
    }
  }

  var API = {
    /* contexte : l'AudioContext du jeu ; dest : la sortie (souvent ac.destination) */
    demarre: function (contexte, dest) {
      if (enMarche) return;
      ac = contexte;
      sortie = dest || ac.destination;
      if (!gain || gain.context !== ac) {
        gain = ac.createGain();
        gain.gain.value = 0;
        gain.connect(sortie);
      }
      enMarche = true;
      pas = 0;
      prochain = ac.currentTime + 0.08;
      /* fondu d'entree : la musique ne doit jamais surgir d'un coup */
      gain.gain.cancelScheduledValues(ac.currentTime);
      gain.gain.setValueAtTime(0.0001, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.055, ac.currentTime + 1.2);
      battement();
      minuteur = setInterval(battement, 60);
    },

    arrete: function () {
      if (!enMarche) return;
      enMarche = false;
      clearInterval(minuteur);
      minuteur = null;
      if (gain && ac) {
        gain.gain.cancelScheduledValues(ac.currentTime);
        gain.gain.setValueAtTime(gain.gain.value || 0.055, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);
      }
    },

    joue: function () { return enMarche; }
  };

  window.QUIZ_MUSIC = API;
})();
