/* =============================================================================
   LES FLASH — mini-jeux d'interlude
   -----------------------------------------------------------------------------
   Ils tombent entre deux questions, durent quelques secondes et ne touchent
   jamais au score de connaissance : etre savant et etre rapide, ce n'est pas la
   meme chose.

   Chaque jeu est autonome et recoit une petite API :
     api.win() / api.lose()   terminent la manche
     api.snd(kind)            un bruitage ('sel','ok','ko','crack','win','alarm')
     api.rm                   true si le telephone demande moins d'animations
     api.item(id, taille)     un objet pixel du jeu (meme banque que l'atelier)
     api.mob(id, taille)      une creature pixel
     api.lance()              demarre le chronometre (jeux "differe" seulement)

   Un jeu se declare ainsi :
     { id, titre, sub, duree, build(zone, api), tick(zone, api, t), timeout(api),
       differe: true,          le chrono attend api.lance() — indispensable aux
                               capteurs, qu'iOS n'ouvre que sur un geste
       stop(zone) }            debranche ce qui doit l'etre a la fin

   Attention : la zone recoit la classe "jeu-<id>". Ne jamais donner ce nom a un
   element interne, sinon la mise en page du jeu ecrase celle de la zone.

   Regles de fabrication, toutes pensees pour le pouce :
     - on touche, on ne glisse jamais ;
     - toute cible fait au moins 44 px ;
     - la zone de jeu tient dans 260 px de haut, sans defilement.
   ============================================================================= */
(function () {
  'use strict';

  var C = document.createElement.bind(document);

  /* fabrique un element : el('div', 'classe', 'texte') */
  function el(tag, cls, txt) {
    var n = C(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  }

  /* un gros bouton d'action, toujours en bas de la zone */
  function bouton(txt, onTap) {
    var b = el('button', 'fz-btn', txt);
    b.type = 'button';
    b.addEventListener('click', function (e) { e.stopPropagation(); onTap(b); });
    return b;
  }

  /* --------------------------------------------------------------------------
     1. LE CREEPER QUI GONFLE — reculer pendant la fenetre blanche
     -------------------------------------------------------------------------- */
  var creeper = {
    id: 'creeper',
    titre: 'IL VA EXPLOSER !',
    sub: 'Recule quand il devient blanc. Pas avant.',
    duree: 4200,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-nether');
      var mob = el('div', 'fz-mob');
      mob.innerHTML = api.mob('creeper', 84);
      scene.appendChild(mob);
      zone.appendChild(scene);
      zone.appendChild(bouton('RECULER !', function () {
        if (zone.dataset.window === '1') { api.snd('win'); api.win(); }
        else { api.snd('ko'); api.lose('Trop tôt — il t’a suivi.'); }
      }));
      zone._mob = mob;
    },
    tick: function (zone, api, t) {
      var ouvert = t > 2100 && t < 3200;
      zone.dataset.window = ouvert ? '1' : '0';
      zone._mob.classList.toggle('is-armed', ouvert);
      var k = 1 + Math.min(0.5, t / 6000);
      /* le centrage vient du CSS : on le repete, sinon le scale l'ecrase */
      if (!api.rm) zone._mob.style.transform = 'translate(-50%, -50%) scale(' + k.toFixed(2) + ')';
    },
    timeout: function (api) { api.lose('Boum. Il fallait reculer.'); }
  };

  /* --------------------------------------------------------------------------
     2. NE REGARDE PAS L'ENDERMAN — ne rien toucher pendant 3 secondes
     -------------------------------------------------------------------------- */
  var enderman = {
    id: 'enderman',
    titre: 'NE LE REGARDE PAS',
    sub: 'Ne touche à rien pendant 3 secondes. À rien du tout.',
    duree: 3400,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-end fz-trap');
      var mob = el('div', 'fz-mob');
      mob.innerHTML = api.mob('enderman', 92);
      scene.appendChild(mob);
      /* un piege : un bouton qui gigote pour donner envie */
      var leurre = el('button', 'fz-lure', 'REGARDER');
      leurre.type = 'button';
      scene.appendChild(leurre);
      scene.addEventListener('click', function () {
        api.snd('ko');
        api.lose('Tu l’as regardé. Il n’a pas aimé.');
      });
      zone.appendChild(scene);
      zone.appendChild(el('p', 'fz-hint', 'Garde le doigt en l’air.'));
    },
    tick: function (zone, api, t) {},
    timeout: function (api) { api.snd('win'); api.win(); }
  };

  /* --------------------------------------------------------------------------
     3. LA PECHE — ferrer au moment ou le bouchon plonge
     -------------------------------------------------------------------------- */
  var peche = {
    id: 'peche',
    titre: 'ÇA MORD !',
    sub: 'Ferre pile quand le bouchon plonge.',
    duree: 7000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-eau');
      var bouchon = el('span', 'fz-bouchon');
      scene.appendChild(bouchon);
      scene.appendChild(el('span', 'fz-onde'));
      zone.appendChild(scene);
      zone.appendChild(bouton('FERRER', function () {
        if (zone.dataset.window === '1') { api.snd('win'); api.win(); }
        else { api.snd('ko'); api.lose('Raté — le poisson est parti.'); }
      }));
      zone._bouchon = bouchon;
      zone._t0 = 2200 + Math.floor(Math.random() * 2600);
    },
    tick: function (zone, api, t) {
      var plonge = t > zone._t0 && t < zone._t0 + 850;
      zone.dataset.window = plonge ? '1' : '0';
      zone._bouchon.classList.toggle('is-down', plonge);
      if (plonge && !zone._bip) { zone._bip = 1; api.snd('crack'); }
    },
    timeout: function (api) { api.lose('Il est reparti sans toi.'); }
  };

  /* --------------------------------------------------------------------------
     4. LA LAVE QUI MONTE — empiler des blocs plus vite qu'elle
     -------------------------------------------------------------------------- */
  /* Reglage : la lave monte jusqu'a 84 % en huit secondes, chaque bloc porte le
     joueur de 12 %. Le premier bloc doit donc tomber avant 1,5 s et les autres
     toutes les 1,1 s : un enfant qui tape normalement gagne, un enfant qui
     regarde ailleurs perd. La version precedente demarrait le joueur a 6 % et
     le noyait en moins d'une seconde, avant meme qu'il ait lu la consigne. */
  var LAVE_MAX = 84, LAVE_PAS = 12, LAVE_PIED = 16, LAVE_GRACE = 1400;

  var lave = {
    id: 'lave',
    titre: 'LA LAVE MONTE',
    sub: 'Empile des blocs sous tes pieds pour rester au-dessus.',
    duree: 8000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-lave');
      var lav = el('span', 'fz-coulee');
      var perso = el('span', 'fz-perso');
      var tour = el('span', 'fz-tour');
      scene.appendChild(lav);
      scene.appendChild(tour);
      scene.appendChild(perso);
      zone.appendChild(scene);
      var compteur = el('p', 'fz-hint', 'BLOCS POSÉS : 0 / 7');
      zone.appendChild(compteur);
      var b = bouton('POSER UN BLOC', function () {
        if (zone._n >= 7) return;
        zone._n++;
        compteur.textContent = 'BLOCS POSÉS : ' + zone._n + ' / 7';
        api.snd('crack');
        if (zone._n >= 7) { b.textContent = 'TOUT EN HAUT !'; b.classList.add('is-armed'); }
      });
      zone.appendChild(b);
      zone._lave = lav; zone._perso = perso; zone._tour = tour; zone._n = 0;
      zone._scene = scene;
    },
    tick: function (zone, api, t) {
      var mont = Math.min(LAVE_MAX, (t / 8000) * LAVE_MAX);   /* en % de la scene */
      var moi = LAVE_PIED + zone._n * LAVE_PAS;
      zone._lave.style.height = mont + '%';
      zone._perso.style.bottom = moi + '%';
      zone._tour.style.height = moi + '%';
      /* le rouge s'allume quand il reste moins d'un bloc de marge */
      zone._scene.classList.toggle('is-chaud', mont > moi - LAVE_PAS * 0.6);
      if (t > LAVE_GRACE && mont >= moi) { api.snd('ko'); api.lose('La lave t’a rattrapé.'); }
    },
    timeout: function (api) { api.snd('win'); api.win(); }
  };

  /* --------------------------------------------------------------------------
     5. LE COFFRE MEMOIRE — retrouver l'objet disparu
     -------------------------------------------------------------------------- */
  var POOL = ['diamant', 'lingot-or', 'pepite-or', 'redstone', 'charbon', 'baton',
              'planche', 'laine', 'papier', 'bloc-fer', 'pissenlit', 'cuir'];

  var memoire = {
    id: 'memoire',
    titre: 'LE COFFRE MÉMOIRE',
    sub: 'Regarde bien. Le coffre va se refermer.',
    duree: 9000,
    build: function (zone, api) {
      var choix = POOL.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 4);
      var manquant = choix[Math.floor(Math.random() * 4)];
      var coffre = el('div', 'fz-coffre');
      choix.forEach(function (id) {
        var s = el('span', 'fz-slot');
        s.innerHTML = api.item(id, 34);
        s.dataset.id = id;
        coffre.appendChild(s);
      });
      zone.appendChild(coffre);
      var dock = el('div', 'fz-dock');
      dock.hidden = true;
      choix.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (id) {
        var b = el('button', 'fz-pick');
        b.type = 'button';
        b.setAttribute('aria-label', id);
        b.innerHTML = api.item(id, 30);
        b.addEventListener('click', function () {
          if (id === manquant) { api.snd('win'); api.win(); }
          else { api.snd('ko'); api.lose('Non, c’était l’autre.'); }
        });
        dock.appendChild(b);
      });
      zone.appendChild(el('p', 'fz-hint fz-consigne', 'MÉMORISE…'));
      zone.appendChild(dock);
      zone._coffre = coffre; zone._dock = dock; zone._manquant = manquant;
      zone._consigne = zone.querySelector('.fz-consigne');
    },
    tick: function (zone, api, t) {
      if (t > 2200 && !zone._ferme) {
        zone._ferme = 1;
        api.snd('crack');
        var s = zone._coffre.querySelector('[data-id="' + zone._manquant + '"]');
        if (s) s.classList.add('is-gone');
        zone._coffre.classList.add('is-shut');
        zone._dock.hidden = false;
        zone._consigne.textContent = 'QUEL OBJET A DISPARU ?';
      }
    },
    timeout: function (api) { api.lose('Trop long — le coffre est parti.'); }
  };

  /* --------------------------------------------------------------------------
     6. LA RUEE DU MINAGE — casser douze blocs avant la fin
     -------------------------------------------------------------------------- */
  var minage = {
    id: 'minage',
    titre: 'CASSE TOUT !',
    sub: 'Douze blocs, six secondes. Vas-y.',
    duree: 6000,
    build: function (zone, api) {
      var mur = el('div', 'fz-mur');
      for (var i = 0; i < 12; i++) {
        var b = el('button', 'fz-pierre');
        b.type = 'button';
        b.setAttribute('aria-label', 'bloc de pierre');
        b.addEventListener('click', function (ev) {
          var c = ev.currentTarget;
          if (c.classList.contains('is-broken')) return;
          c.classList.add('is-broken');
          zone._n++;
          zone._compte.textContent = zone._n + ' / 12';
          api.snd('crack');
          if (zone._n >= 12) { api.snd('win'); api.win(); }
        });
        mur.appendChild(b);
      }
      zone.appendChild(mur);
      var compte = el('p', 'fz-hint', '0 / 12');
      zone.appendChild(compte);
      zone._n = 0; zone._compte = compte;
    },
    tick: function () {},
    timeout: function (api) { api.lose('Il en restait. La pioche a cassé.'); }
  };

  /* --------------------------------------------------------------------------
     7. L'ESQUIVE DU SQUELETTE — se decaler du bon cote, trois fois
     -------------------------------------------------------------------------- */
  var squelette = {
    id: 'squelette',
    titre: 'ESQUIVE !',
    sub: 'La flèche part du côté marqué. Va de l’autre côté.',
    duree: 7000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-duel');
      var mob = el('div', 'fz-mob fz-mob-sm');
      mob.innerHTML = api.mob('squelette', 62);
      scene.appendChild(mob);
      var gauche = el('span', 'fz-viseur fz-g');
      var droite = el('span', 'fz-viseur fz-d');
      scene.appendChild(gauche); scene.appendChild(droite);
      zone.appendChild(scene);

      var rangee = el('div', 'fz-duo');
      var bg = bouton('◀ GAUCHE', function () { rep(0); });
      var bd = bouton('DROITE ▶', function () { rep(1); });
      rangee.appendChild(bg); rangee.appendChild(bd);
      zone.appendChild(rangee);
      var score = el('p', 'fz-hint', 'MANCHE 1 / 3');
      zone.appendChild(score);

      zone._g = gauche; zone._d = droite; zone._score = score;
      zone._manche = 0; zone._cible = Math.random() < 0.5 ? 0 : 1; zone._ouvert = false;

      function rep(cote) {
        if (!zone._ouvert) return;
        zone._ouvert = false;
        if (cote !== zone._cible) {          /* il faut fuir le cote marque */
          zone._manche++;
          api.snd('crack');
          if (zone._manche >= 3) { api.snd('win'); api.win(); return; }
          zone._score.textContent = 'MANCHE ' + (zone._manche + 1) + ' / 3';
          zone._cible = Math.random() < 0.5 ? 0 : 1;
          zone._next = null;
        } else {
          api.snd('ko');
          api.lose('Touché. Il fallait aller de l’autre côté.');
        }
      }
    },
    tick: function (zone, api, t) {
      if (zone._next === null || zone._next === undefined) zone._next = t + 500;
      var actif = t > zone._next;
      zone._ouvert = actif;
      zone._g.classList.toggle('is-on', actif && zone._cible === 0);
      zone._d.classList.toggle('is-on', actif && zone._cible === 1);
    },
    timeout: function (api) { api.lose('Trop lent, les flèches sont passées.'); }
  };

  /* --------------------------------------------------------------------------
     8. GHAST PONG — renvoyer la boule quand elle entre dans la zone
     -------------------------------------------------------------------------- */
  var ghast = {
    id: 'ghast',
    titre: 'RENVOIE LA BOULE',
    sub: 'Frappe quand la boule de feu entre dans la zone claire.',
    duree: 6000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-nether');
      var mob = el('div', 'fz-mob fz-mob-haut');
      mob.innerHTML = api.mob('ghast', 66);
      scene.appendChild(mob);
      scene.appendChild(el('span', 'fz-bande'));
      var boule = el('span', 'fz-boule');
      scene.appendChild(boule);
      zone.appendChild(scene);
      zone.appendChild(bouton('FRAPPER', function () {
        if (zone.dataset.window === '1') { api.snd('win'); api.win(); }
        else { api.snd('ko'); api.lose('Dans le vide. La boule est passée.'); }
      }));
      zone._boule = boule;
    },
    tick: function (zone, api, t) {
      var cycle = 1900;
      var p = (t % cycle) / cycle;                   /* 0 en haut, 1 en bas */
      zone._boule.style.top = (8 + p * 78) + '%';
      var dedans = p > 0.62 && p < 0.82;             /* la bande claire */
      zone.dataset.window = dedans ? '1' : '0';
      zone._boule.classList.toggle('is-hot', dedans);
    },
    timeout: function (api) { api.lose('Trois passages, aucun renvoi.'); }
  };

  /* --------------------------------------------------------------------------
     9. LE MLG AU SEAU — poser l'eau sous le point de chute
     -------------------------------------------------------------------------- */
  var mlg = {
    id: 'mlg',
    titre: 'MLG AU SEAU',
    sub: 'Mets l’eau sous l’ombre avant qu’il touche le sol.',
    duree: 6000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-ciel');
      var steve = el('span', 'fz-steve');
      var ombre = el('span', 'fz-ombre');
      var eau = el('span', 'fz-eau');
      eau.hidden = true;
      scene.appendChild(ombre); scene.appendChild(eau); scene.appendChild(steve);
      zone.appendChild(scene);

      var rangee = el('div', 'fz-trio');
      [0, 1, 2].forEach(function (i) {
        var b = bouton(['GAUCHE', 'MILIEU', 'DROITE'][i], function () {
          zone._seau = i;
          eau.hidden = false;
          eau.style.left = (10 + i * 30) + '%';
          api.snd('sel');
          [].forEach.call(rangee.children, function (c, k) {
            c.classList.toggle('is-armed', k === i);
          });
        });
        rangee.appendChild(b);
      });
      zone.appendChild(rangee);
      zone.appendChild(el('p', 'fz-hint', 'L’ombre bouge encore…'));

      zone._steve = steve; zone._ombre = ombre; zone._seau = -1;
      zone._lane = Math.floor(Math.random() * 3);
      zone._fige = false;
    },
    tick: function (zone, api, t) {
      if (!zone._fige) {
        if (t > 3200) { zone._fige = true; }
        else if (t % 700 < 60) { zone._lane = Math.floor(Math.random() * 3); }
      }
      zone._ombre.style.left = (10 + zone._lane * 30) + '%';
      zone._ombre.classList.toggle('is-fixed', zone._fige);
      zone._steve.style.left = (10 + zone._lane * 30) + '%';
      zone._steve.style.top = Math.min(72, (t / 6000) * 78) + '%';
    },
    timeout: function (api) {
      var zone = api.zone;
      if (zone._seau === zone._lane) { api.snd('win'); api.win(); }
      else { api.snd('ko'); api.lose('Plouf de laine. Le seau était à côté.'); }
    }
  };


  /* ==========================================================================
     LES JEUX A CAPTEURS
     --------------------------------------------------------------------------
     Trois jeux se servent de l'inclinaison et des secousses du telephone. Trois
     precautions, dans cet ordre :

     1. iOS 13 et suivants exigent que la permission soit demandee DEPUIS un
        geste de l'utilisateur. Un flash s'ouvre tout seul entre deux questions :
        il n'y a donc pas de geste au moment de l'ouverture. Chaque jeu affiche
        d'abord une porte — un gros bouton — et c'est ce bouton qui demande la
        permission puis lance le chronometre (api.lance()).
     2. Un ordinateur, un telephone sans capteur ou un refus de permission
        doivent rester jouables : chaque jeu a un jeu de boutons de secours, et
        bascule tout seul dessus si aucune mesure n'arrive dans la seconde.
     3. Le zero n'est jamais le zero du telephone mais celui de l'enfant : on
        capte sa position de depart et on mesure les ecarts par rapport a elle.
        Il peut donc jouer couche, assis, dans la voiture.
     ========================================================================== */

  var capteursOk = null;   /* null : pas encore demande ; true / false : reponse */

  function demandeCapteurs(fin) {
    if (capteursOk !== null) { fin(capteursOk); return; }
    var DO = window.DeviceOrientationEvent, DM = window.DeviceMotionEvent;
    var pO = DO && typeof DO.requestPermission === 'function';
    var pM = DM && typeof DM.requestPermission === 'function';
    if (!pO && !pM) { capteursOk = !!(DO || DM); fin(capteursOk); return; }

    var attendus = (pO ? 1 : 0) + (pM ? 1 : 0), recus = 0, ok = false;
    function bilan(r) {
      if (r === 'granted') ok = true;
      if (++recus >= attendus) { capteursOk = ok; fin(ok); }
    }
    if (pO) DO.requestPermission().then(bilan, function () { bilan('denied'); });
    if (pM) DM.requestPermission().then(bilan, function () { bilan('denied'); });
  }

  /* la porte d'entree : un bouton, donc un geste, donc une permission possible */
  function porte(zone, api, consigne, geste, demarre) {
    var p = el('div', 'fz-porte');
    p.appendChild(el('p', 'fz-porte-titre', consigne));
    p.appendChild(el('p', 'fz-porte-txt', geste));
    p.appendChild(bouton('JE SUIS PRÊT !', function () {
      demandeCapteurs(function (ok) {
        zone.textContent = '';
        demarre(ok);
        api.lance();
      });
    }));
    zone.appendChild(p);
  }

  /* branche un ecouteur et retient de quoi le debrancher */
  function ecoute(zone, nom, fn) {
    window.addEventListener(nom, fn, true);
    (zone._ecoutes = zone._ecoutes || []).push([nom, fn]);
  }

  /* appele par le jeu quand la manche se termine, quoi qu'il arrive */
  function debranche(zone) {
    if (!zone || zone._debranche) return;
    zone._debranche = true;
    (zone._ecoutes || []).forEach(function (e) {
      window.removeEventListener(e[0], e[1], true);
    });
    zone._ecoutes = [];
  }

  function toque() { if (navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} } }

  /* --------------------------------------------------------------------------
     10. LE LABYRINTHE — poser le telephone a plat et faire rouler la bille
     -------------------------------------------------------------------------- */
  /* 9 colonnes sur 6 rangees. Le chemin gagnant est un simple L — longer le
     haut puis descendre a droite — mais deux impasses le font ressembler a un
     vrai labyrinthe. */
  var LABY = [
    '#########',
    '#S......#',
    '#.#####.#',
    '#.#...#.#',
    '#...#.#H#',
    '#########'
  ];
  var LAB_C = 9, LAB_R = 6, LAB_RAYON = 0.3;

  function murLa(x, y) {
    var c = Math.floor(x), r = Math.floor(y);
    if (r < 0 || r >= LAB_R || c < 0 || c >= LAB_C) return true;
    return LABY[r].charAt(c) === '#';
  }
  /* la bille est une boite : on teste ses quatre coins, sinon elle coupe les
     angles et traverse les murs en diagonale */
  function librePour(x, y) {
    return !murLa(x - LAB_RAYON, y - LAB_RAYON) && !murLa(x + LAB_RAYON, y - LAB_RAYON) &&
           !murLa(x - LAB_RAYON, y + LAB_RAYON) && !murLa(x + LAB_RAYON, y + LAB_RAYON);
  }

  var laby = {
    id: 'laby',
    titre: 'LA BILLE D’ÉQUILIBRE',
    sub: 'Pose le téléphone à plat et penche-le pour guider la bille.',
    duree: 14000,
    differe: true,
    build: function (zone, api) {
      porte(zone, api,
        'POSE LE TÉLÉPHONE À PLAT',
        'Penche-le doucement : la bille roule vers le trou.',
        function (ok) { laby.demarre(zone, api, ok); });
    },

    demarre: function (zone, api, ok) {
      var scene = el('div', 'fz-scene fz-scene-laby');
      var plan = el('div', 'fz-laby-plan');
      for (var r = 0; r < LAB_R; r++) {
        for (var c = 0; c < LAB_C; c++) {
          var ch = LABY[r].charAt(c);
          if (ch !== '#') continue;
          var m = el('span', 'fz-mur');
          m.style.left = (c / LAB_C * 100) + '%';
          m.style.top = (r / LAB_R * 100) + '%';
          m.style.width = (100 / LAB_C) + '%';
          m.style.height = (100 / LAB_R) + '%';
          plan.appendChild(m);
        }
      }
      var trou = el('span', 'fz-trou');
      trou.style.left = (7.5 / LAB_C * 100) + '%';
      trou.style.top = (4.5 / LAB_R * 100) + '%';
      plan.appendChild(trou);

      var bille = el('span', 'fz-bille');
      plan.appendChild(bille);
      scene.appendChild(plan);
      zone.appendChild(scene);

      var aide = el('p', 'fz-hint', ok ? 'PENCHE LE TÉLÉPHONE' : '');
      zone.appendChild(aide);

      zone._bille = bille; zone._aide = aide;
      zone._x = 1.5; zone._y = 1.5; zone._vx = 0; zone._vy = 0;
      zone._b = 0; zone._g = 0; zone._zero = null; zone._vu = false; zone._manuel = false;
      zone._pose = function () {
        bille.style.left = (zone._x / LAB_C * 100) + '%';
        bille.style.top = (zone._y / LAB_R * 100) + '%';
      };
      zone._pose();

      if (ok) {
        ecoute(zone, 'deviceorientation', function (e) {
          if (e.beta === null && e.gamma === null) return;
          zone._vu = true;
          if (!zone._zero) zone._zero = { b: e.beta || 0, g: e.gamma || 0 };
          zone._b = (e.beta || 0) - zone._zero.b;
          zone._g = (e.gamma || 0) - zone._zero.g;
        });
      } else {
        laby.manuel(zone, api);
      }
    },

    /* secours : quatre fleches qui poussent la bille d'une case */
    manuel: function (zone, api) {
      if (zone._manuel) return;
      zone._manuel = true;
      zone._aide.textContent = 'PAS DE CAPTEUR — UTILISE LES FLÈCHES';
      var r = el('div', 'fz-quad');
      [['◀', -1, 0], ['▲', 0, -1], ['▼', 0, 1], ['▶', 1, 0]].forEach(function (f) {
        r.appendChild(bouton(f[0], function () {
          var nx = zone._x + f[1], ny = zone._y + f[2];
          if (!librePour(nx, ny)) { api.snd('ko'); return; }
          zone._x = nx; zone._y = ny; zone._vx = 0; zone._vy = 0;
          api.snd('sel');
          zone._pose();
        }));
      });
      zone.appendChild(r);
    },

    tick: function (zone, api, t) {
      if (!zone._bille) return;
      /* pas de mesure au bout d'une seconde : le capteur n'existe pas ici */
      if (!zone._manuel && !zone._vu && t > 1000) laby.manuel(zone, api);

      if (!zone._manuel) {
        var g = Math.max(-35, Math.min(35, zone._g));
        var b = Math.max(-35, Math.min(35, zone._b));
        zone._vx = (zone._vx + g / 35 * 0.032) * 0.85;
        zone._vy = (zone._vy + b / 35 * 0.032) * 0.85;
        var v = Math.sqrt(zone._vx * zone._vx + zone._vy * zone._vy);
        if (v > 0.34) { zone._vx *= 0.34 / v; zone._vy *= 0.34 / v; }
        /* deux demi-pas : une bille rapide ne doit pas traverser un mur */
        for (var k = 0; k < 2; k++) {
          var nx = zone._x + zone._vx / 2;
          if (librePour(nx, zone._y)) zone._x = nx; else zone._vx = 0;
          var ny = zone._y + zone._vy / 2;
          if (librePour(zone._x, ny)) zone._y = ny; else zone._vy = 0;
        }
        zone._pose();
      }

      var dx = zone._x - 7.5, dy = zone._y - 4.5;
      if (Math.sqrt(dx * dx + dy * dy) < 0.42) {
        toque(); api.snd('win'); api.win();
      }
    },
    timeout: function (api) { api.snd('ko'); api.lose('La bille n’est jamais tombée dans le trou.'); },
    stop: function (zone) { debranche(zone); }
  };

  /* --------------------------------------------------------------------------
     11. SECOUE L'ARBRE — dix secousses pour faire tomber les pommes
     -------------------------------------------------------------------------- */
  var SEC_BUT = 10;

  var secoue = {
    id: 'secoue',
    titre: 'SECOUE L’ARBRE !',
    sub: 'Secoue le téléphone pour faire tomber les pommes.',
    duree: 7000,
    differe: true,
    build: function (zone, api) {
      porte(zone, api,
        'TIENS BIEN LE TÉLÉPHONE',
        'Secoue-le fort, dix fois, sans le lâcher.',
        function (ok) { secoue.demarre(zone, api, ok); });
    },

    demarre: function (zone, api, ok) {
      var scene = el('div', 'fz-scene fz-scene-arbre');
      var arbre = el('div', 'fz-arbre');
      arbre.appendChild(el('span', 'fz-feuillage'));
      arbre.appendChild(el('span', 'fz-tronc'));
      var pommes = el('div', 'fz-pommes');
      for (var i = 0; i < SEC_BUT; i++) {
        var pom = el('span', 'fz-pomme');
        pom.style.left = (8 + (i % 5) * 20) + '%';
        pom.style.top = (14 + Math.floor(i / 5) * 22) + '%';
        pommes.appendChild(pom);
      }
      arbre.appendChild(pommes);
      scene.appendChild(arbre);
      zone.appendChild(scene);

      var compte = el('p', 'fz-hint', '0 / ' + SEC_BUT + ' POMMES');
      zone.appendChild(compte);

      zone._scene = scene; zone._pommes = pommes; zone._compte = compte;
      zone._n = 0; zone._arme = true; zone._vu = false; zone._manuel = false;

      zone._secousse = function () {
        if (zone._n >= SEC_BUT) return;
        var p = zone._pommes.children[zone._n];
        if (p) p.classList.add('is-tombe');
        zone._n++;
        zone._compte.textContent = zone._n + ' / ' + SEC_BUT + ' POMMES';
        zone._scene.classList.remove('is-shake');
        void zone._scene.offsetWidth;             /* relance l'animation */
        zone._scene.classList.add('is-shake');
        toque();
        api.snd('crack');
        if (zone._n >= SEC_BUT) { api.snd('win'); api.win(); }
      };

      if (ok) {
        ecoute(zone, 'devicemotion', function (e) {
          var a = e.accelerationIncludingGravity || e.acceleration;
          if (!a || a.x === null) return;
          zone._vu = true;
          var m = Math.sqrt((a.x || 0) * (a.x || 0) + (a.y || 0) * (a.y || 0) + (a.z || 0) * (a.z || 0));
          /* hysteresis : il faut redescendre au calme avant de recompter */
          if (m > 17 && zone._arme) { zone._arme = false; zone._secousse(); }
          else if (m < 12) { zone._arme = true; }
        });
      } else {
        secoue.manuel(zone);
      }
    },

    manuel: function (zone) {
      if (zone._manuel) return;
      zone._manuel = true;
      zone._compte.textContent = 'PAS DE CAPTEUR — TAPE VITE : 0 / ' + SEC_BUT;
      zone.appendChild(bouton('TAPE TRÈS VITE !', function () {
        zone._secousse();
        if (zone._n < SEC_BUT) zone._compte.textContent = 'TAPE VITE : ' + zone._n + ' / ' + SEC_BUT;
      }));
    },

    tick: function (zone, api, t) {
      if (!zone._pommes) return;
      if (!zone._manuel && !zone._vu && t > 1000) secoue.manuel(zone);
    },
    timeout: function (api) { api.snd('ko'); api.lose('L’arbre a tenu bon. Il fallait secouer plus fort !'); },
    stop: function (zone) { debranche(zone); }
  };

  /* --------------------------------------------------------------------------
     12. NE BOUGE PLUS — tenir le telephone exactement comme au depart
     -------------------------------------------------------------------------- */
  var IMM_TOL = 11;        /* degres d'ecart tolere */
  var IMM_BLOCS = 4;       /* la tour perd un bloc par ecart */

  var immobile = {
    id: 'immobile',
    titre: 'NE BOUGE PLUS !',
    sub: 'La tour tient tant que le téléphone ne bouge pas.',
    duree: 7000,
    differe: true,
    build: function (zone, api) {
      porte(zone, api,
        'TIENS LE TÉLÉPHONE COMME TU VEUX',
        'Sa position au moment du départ devient l’étalon. Ensuite : plus un geste.',
        function (ok) { immobile.demarre(zone, api, ok); });
    },

    demarre: function (zone, api, ok) {
      var scene = el('div', 'fz-scene fz-scene-tour');
      var tour = el('div', 'fz-tour-pile');
      for (var i = 0; i < IMM_BLOCS; i++) tour.appendChild(el('span', 'fz-bloc'));
      scene.appendChild(tour);
      zone.appendChild(scene);

      var jauge = el('div', 'fz-jauge');
      var fill = el('span', 'fz-jauge-fill');
      jauge.appendChild(fill);
      zone.appendChild(jauge);
      var aide = el('p', 'fz-hint', 'ÉTALON EN COURS…');
      zone.appendChild(aide);

      zone._tour = tour; zone._fill = fill; zone._aide = aide;
      zone._reste = IMM_BLOCS; zone._zero = null; zone._ecart = 0;
      zone._vu = false; zone._manuel = false; zone._froid = 0;

      if (ok) {
        ecoute(zone, 'deviceorientation', function (e) {
          if (e.beta === null && e.gamma === null) return;
          zone._vu = true;
          if (!zone._zero) {
            zone._zero = { b: e.beta || 0, g: e.gamma || 0 };
            zone._aide.textContent = 'ÉTALON PRIS — NE BOUGE PLUS';
            return;
          }
          zone._ecart = Math.max(Math.abs((e.beta || 0) - zone._zero.b),
                                 Math.abs((e.gamma || 0) - zone._zero.g));
        });
      } else {
        immobile.manuel(zone, api);
      }
    },

    /* secours : garder le doigt pose sans le bouger d'un pixel */
    manuel: function (zone, api) {
      if (zone._manuel) return;
      zone._manuel = true;
      zone._aide.textContent = 'PAS DE CAPTEUR — GARDE LE DOIGT POSÉ';
      var b = bouton('APPUIE ET NE LÂCHE PAS', function () {});
      b.classList.add('fz-tenir');
      var pose = null;
      function bouge(x, y) {
        if (pose === null) return;
        zone._ecart = Math.max(Math.abs(x - pose.x), Math.abs(y - pose.y)) / 3;
      }
      b.addEventListener('pointerdown', function (e) {
        pose = { x: e.clientX, y: e.clientY };
        zone._ecart = 0;
        b.classList.add('is-armed');
        zone._aide.textContent = 'NE BOUGE PLUS LE DOIGT';
      });
      b.addEventListener('pointermove', function (e) { bouge(e.clientX, e.clientY); });
      b.addEventListener('pointerup', function () { zone._ecart = 99; });
      b.addEventListener('pointercancel', function () { zone._ecart = 99; });
      zone.appendChild(b);
      zone._boutonTenir = b;
      zone._ecart = 99;                 /* tant qu'il n'appuie pas, ca s'effondre */
      zone._grace = true;
    },

    tick: function (zone, api, t) {
      if (!zone._tour) return;
      if (!zone._manuel && !zone._vu && t > 1000) immobile.manuel(zone, api);
      /* en mode secours on laisse une seconde pour poser le doigt */
      if (zone._manuel && t < 1800 && zone._ecart > IMM_TOL) return;
      if (!zone._manuel && !zone._zero) return;

      var e = zone._ecart;
      zone._fill.style.width = Math.max(0, 100 - Math.min(100, e / IMM_TOL * 100)) + '%';
      zone._tour.style.transform = 'rotate(' + Math.max(-6, Math.min(6, e * 0.45)).toFixed(1) + 'deg)';
      zone._tour.classList.toggle('is-chaud', e > IMM_TOL * 0.6);

      if (e > IMM_TOL && t > zone._froid) {
        zone._froid = t + 400;
        zone._reste--;
        var bl = zone._tour.children[zone._reste];
        if (bl) bl.classList.add('is-tombe');
        api.snd('ko');
        if (zone._reste <= 0) { api.lose('La tour s’est effondrée. Il fallait rester immobile.'); }
        else { zone._aide.textContent = 'ATTENTION ! ' + zone._reste + ' BLOC' + (zone._reste > 1 ? 'S' : '') + ' RESTANT' + (zone._reste > 1 ? 'S' : ''); }
      }
    },
    timeout: function (api) { api.snd('win'); api.win(); },
    stop: function (zone) { debranche(zone); }
  };

  window.QUIZ_FLASH = [creeper, enderman, peche, lave, memoire, minage, squelette,
                       ghast, mlg, laby, secoue, immobile];
})();
