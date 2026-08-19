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
  var lave = {
    id: 'lave',
    titre: 'LA LAVE MONTE',
    sub: 'Empile des blocs sous tes pieds pour rester au-dessus.',
    duree: 8000,
    build: function (zone, api) {
      var scene = el('div', 'fz-scene fz-scene-lave');
      var lav = el('span', 'fz-lave');
      var perso = el('span', 'fz-perso');
      var tour = el('span', 'fz-tour');
      scene.appendChild(lav);
      scene.appendChild(tour);
      scene.appendChild(perso);
      zone.appendChild(scene);
      var compteur = el('p', 'fz-hint', 'BLOCS POSÉS : 0');
      zone.appendChild(compteur);
      zone.appendChild(bouton('POSER UN BLOC', function () {
        if (zone._n >= 7) return;
        zone._n++;
        compteur.textContent = 'BLOCS POSÉS : ' + zone._n;
        api.snd('crack');
      }));
      zone._lave = lav; zone._perso = perso; zone._tour = tour; zone._n = 0;
    },
    tick: function (zone, api, t) {
      var mont = Math.min(96, (t / 8000) * 96);            /* en % de la scene */
      var moi = 6 + zone._n * 13;
      zone._lave.style.height = mont + '%';
      zone._perso.style.bottom = moi + '%';
      zone._tour.style.height = moi + '%';
      if (mont >= moi + 4) { api.snd('ko'); api.lose('La lave t’a rattrapé.'); }
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

  window.QUIZ_FLASH = [creeper, enderman, peche, lave, memoire, minage, squelette, ghast, mlg];
})();
