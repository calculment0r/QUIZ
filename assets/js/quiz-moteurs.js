/* =============================================================================
   LES MOTEURS DE REPONSE — registre extensible
   -----------------------------------------------------------------------------
   Meme principe que quiz-flash.js, mais pour les epreuves qui remplacent une
   question a quatre cases. Le jeu demande au registre, question par question,
   si l'un des moteurs sait la jouer ; si aucun ne repond, la question reste un
   QCM. Ajouter un moteur ne demande donc jamais de toucher a app.js.

   Une fiche de moteur :
     id           identifiant, sert aussi de classe CSS (mot-<id>)
     detecte(q)   rend une "spec" si le moteur sait jouer cette question, sinon
                  null. C'est ici que vivent les regles de loyaute : un moteur
                  qui ne peut pas etre honnete doit rendre null.
     build(zone, q, spec, etat, api)   remplit la zone. Appele a chaque
                  changement d'etat (choix, validation) : le moteur est un
                  simple dessin de (question, choix, verrouillage), il ne garde
                  aucun etat a lui.
     consigne(spec)      la petite ligne au-dessus de la question
     cta(spec, etat)     le texte du gros bouton du bas
     confirme            true = il faut confirmer au bouton (deux gestes)

   etat : { sel: index choisi ou null, locked: bool, ok: bool }
   api  : { item(id, taille), mob(id, taille), choisir(i), snd(kind), rm }

   Regle de la maison, valable pour tous : si l'epreuve marcherait aussi bien
   avec quatre boutons, elle n'est pas encore une epreuve.
   ============================================================================= */
(function () {
  'use strict';

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = txt;
    return n;
  }

  /* ===========================================================================
     LA CARTE AU TRESOR
     ---------------------------------------------------------------------------
     Quatre territoires dessines, sans etiquette. L'enfant reconnait le lieu a
     son paysage, pose son epingle, puis confirme. Les noms n'apparaissent
     qu'apres validation : avant, il n'y a rien a lire, seulement a reconnaitre.

     Loyaute : si deux reponses se dessinent pareil (deux grottes de la meme
     couleur, par exemple), la question est refusee et redevient un QCM — on ne
     peut pas demander de distinguer deux images identiques.
     =========================================================================== */

  /* Chaque lieu : deux bandes de ciel, une bande de sol, puis ce qui le rend
     reconnaissable. Coordonnees sur une grille de 16 par 12. */
  var LIEUX = {
    'overworld': { nom: 'L’OVERWORLD', ciel: ['#5B8FD9', '#9CC4F0'], sol: '#4CD137', bas: '#6E4522',
      d: [[2, 4, 2, 4, '#5C3A1B'], [1, 1, 4, 4, '#2E8B26'], [11, 5, 2, 3, '#5C3A1B'], [10, 2, 4, 4, '#2E8B26'], [6, 8, 3, 1, '#2E8B26']] },
    'nether':    { nom: 'LE NETHER', ciel: ['#5E1410', '#9E2A18'], sol: '#7A2418', bas: '#4A130F',
      d: [[1, 8, 5, 3, '#F2712C'], [1, 8, 5, 1, '#FFC145'], [10, 3, 2, 5, '#4A130F'], [12, 5, 3, 3, '#8B2A22'], [7, 2, 1, 2, '#FFC145']] },
    'end':       { nom: 'L’END', ciel: ['#07060F', '#1A1030'], sol: '#E8E2AE', bas: '#9A9366',
      d: [[3, 2, 2, 6, '#241640'], [3, 1, 2, 1, '#E0C8FF'], [11, 3, 2, 5, '#241640'], [11, 2, 2, 1, '#E0C8FF'], [7, 5, 2, 2, '#8F63C4']] },
    'void':      { nom: 'LE VOID', ciel: ['#000000', '#050510'], sol: '#000000', bas: '#000000',
      d: [[3, 2, 1, 1, '#FFFFFF'], [9, 1, 1, 1, '#DDE4FF'], [13, 4, 1, 1, '#FFFFFF'], [6, 6, 1, 1, '#DDE4FF'], [11, 8, 1, 1, '#FFFFFF']] },
    'deepdark':  { nom: 'LE DEEP DARK', ciel: ['#06090C', '#0C1418'], sol: '#123038', bas: '#0A1A1E',
      d: [[2, 6, 4, 2, '#1B3A3A'], [3, 5, 2, 1, '#4FD9D0'], [10, 7, 4, 2, '#1B3A3A'], [11, 6, 2, 1, '#4FD9D0'], [7, 3, 2, 2, '#4FD9D0']] },
    'ocean':     { nom: 'L’OCÉAN', ciel: ['#1E4E80', '#3A7BBF'], sol: '#D9C79A', bas: '#A8956A',
      d: [[3, 5, 1, 4, '#2E8B26'], [4, 4, 1, 5, '#4CD137'], [11, 6, 1, 3, '#2E8B26'], [7, 2, 1, 1, '#ADF5F0'], [9, 4, 1, 1, '#ADF5F0'], [5, 1, 1, 1, '#ADF5F0']] },
    'grotte-luxuriante': { nom: 'LES GROTTES LUXURIANTES', ciel: ['#1B2A18', '#26401F'], sol: '#2E8B26', bas: '#5C3A1B',
      d: [[2, 0, 3, 4, '#4CD137'], [6, 0, 2, 3, '#8BE07C'], [11, 0, 3, 5, '#4CD137'], [4, 6, 3, 2, '#F5A9C8'], [10, 7, 2, 2, '#8BE07C']] },
    'grotte-gemme': { nom: 'LES GROTTES DE GEMMES', ciel: ['#1A1226', '#2A1B4A'], sol: '#45306E', bas: '#241640',
      d: [[2, 5, 2, 4, '#8F63C4'], [3, 4, 2, 1, '#E0C8FF'], [7, 3, 2, 5, '#8F63C4'], [8, 2, 1, 1, '#E0C8FF'], [12, 6, 2, 3, '#8F63C4'], [12, 5, 1, 1, '#E0C8FF']] },
    'grotte-soufre': { nom: 'LES GROTTES DE SOUFRE', ciel: ['#2A2410', '#4A3E14'], sol: '#8A7024', bas: '#4A3E14',
      d: [[2, 5, 2, 4, '#F2D98A'], [3, 4, 1, 1, '#FFF0B8'], [7, 4, 2, 5, '#D9B34A'], [12, 6, 2, 3, '#F2D98A'], [5, 8, 4, 1, '#C9962F']] },
    'grotte-cristal': { nom: 'LES GROTTES DE CRISTAL', ciel: ['#0C2028', '#14384A'], sol: '#2E9E97', bas: '#123038',
      d: [[2, 4, 2, 5, '#ADF5F0'], [6, 2, 2, 7, '#3EC4BC'], [7, 1, 1, 1, '#FFFFFF'], [11, 5, 2, 4, '#ADF5F0'], [13, 3, 1, 6, '#3EC4BC']] },
    'grotte-gelee': { nom: 'LES GROTTES GELÉES', ciel: ['#16263A', '#2A4A6E'], sol: '#A8D4F0', bas: '#6BA3DB',
      d: [[2, 0, 2, 4, '#E8F4FF'], [6, 0, 1, 5, '#E8F4FF'], [10, 0, 2, 3, '#E8F4FF'], [4, 6, 3, 2, '#FFFFFF'], [11, 7, 3, 2, '#FFFFFF']] },
    'grotte-sel': { nom: 'LES GROTTES DE SEL', ciel: ['#2A2620', '#4A4438'], sol: '#E8E4D4', bas: '#B0AC9C',
      d: [[2, 5, 3, 4, '#FFFFFF'], [7, 6, 2, 3, '#F2EEE0'], [11, 4, 3, 5, '#FFFFFF'], [5, 8, 2, 1, '#D8D4C4'], [9, 3, 1, 2, '#F2EEE0']] },
    'ravin':     { nom: 'UN RAVIN', ciel: ['#3A2A1E', '#6E5A44'], sol: '#8B8B8B', bas: '#4A4A4A',
      d: [[0, 0, 5, 12, '#6A6A6A'], [11, 0, 5, 12, '#6A6A6A'], [0, 0, 5, 2, '#4CD137'], [11, 0, 5, 2, '#4CD137'], [6, 9, 4, 3, '#F2712C'], [6, 9, 4, 1, '#FFC145']] },
    'village':   { nom: 'UN VILLAGE', ciel: ['#5B8FD9', '#9CC4F0'], sol: '#4CD137', bas: '#6E4522',
      d: [[1, 4, 5, 4, '#D9C79A'], [0, 2, 7, 2, '#8B5A2B'], [9, 5, 5, 3, '#D9C79A'], [8, 3, 7, 2, '#8B5A2B'], [3, 6, 1, 2, '#5C3A1B']] },
    'manoir':    { nom: 'UN MANOIR', ciel: ['#2A1B3A', '#4A3A5A'], sol: '#2E5A26', bas: '#4A3A2A',
      d: [[2, 3, 12, 6, '#8B5A2B'], [1, 1, 14, 2, '#5C3A1B'], [4, 5, 2, 2, '#FFC145'], [10, 5, 2, 2, '#FFC145'], [7, 6, 2, 3, '#3A2A1E']] },
    'cite-ancienne': { nom: 'UNE CITÉ ANCIENNE', ciel: ['#06090C', '#0C1418'], sol: '#123038', bas: '#0A1A1E',
      d: [[2, 2, 3, 7, '#1B3A3A'], [11, 2, 3, 7, '#1B3A3A'], [5, 4, 6, 5, '#16262A'], [7, 6, 2, 3, '#4FD9D0'], [6, 1, 4, 1, '#1B3A3A']] },
    'temple-desert': { nom: 'UN TEMPLE DU DÉSERT', ciel: ['#7A9FD9', '#C4D8F0'], sol: '#E8D9A0', bas: '#C4B478',
      d: [[5, 5, 6, 4, '#E0CE90'], [6, 3, 4, 2, '#E0CE90'], [7, 1, 2, 2, '#E0CE90'], [7, 6, 2, 3, '#F2712C'], [4, 8, 8, 1, '#C4B478']] },
    'temple-jungle': { nom: 'UN TEMPLE DE LA JUNGLE', ciel: ['#1B3A18', '#2E6B24'], sol: '#3B8526', bas: '#26591A',
      d: [[3, 3, 10, 6, '#7A8A6A'], [3, 3, 10, 1, '#4CD137'], [6, 5, 4, 4, '#3A4A38'], [1, 0, 4, 3, '#2E8B26'], [11, 0, 4, 3, '#2E8B26']] },
    'avant-poste': { nom: 'UN AVANT-POSTE DE PILLARDS', ciel: ['#4A5A7A', '#8AA0C0'], sol: '#4CD137', bas: '#6E4522',
      d: [[6, 1, 4, 8, '#5C3A1B'], [5, 0, 6, 2, '#3A2A1E'], [10, 2, 3, 3, '#3A4A6A'], [2, 6, 2, 3, '#8B5A2B'], [7, 5, 2, 2, '#2A1B14']] },
    'structure-oceanique': { nom: 'UNE STRUCTURE OCÉANIQUE', ciel: ['#1E4E80', '#3A7BBF'], sol: '#2E9E97', bas: '#1E6E68',
      d: [[3, 3, 10, 6, '#5FBFA8'], [3, 3, 10, 1, '#ADF5F0'], [6, 5, 4, 4, '#2E9E97'], [7, 6, 2, 2, '#FFC145'], [1, 7, 2, 2, '#5FBFA8']] },
    'camp-abandonne': { nom: 'UN CAMP ABANDONNÉ', ciel: ['#4A5A7A', '#9AA8C0'], sol: '#9AA84A', bas: '#6E7A2A',
      d: [[2, 4, 5, 5, '#C08A4A'], [3, 3, 3, 2, '#8B5A2B'], [10, 5, 4, 4, '#C08A4A'], [8, 8, 2, 1, '#3A2A1E'], [12, 2, 1, 3, '#8B5A2B']] }
  };

  /* l'ordre compte : le plus precis d'abord, sinon "temple de la jungle"
     tomberait sur la jungle et deux reponses se dessineraient pareil */
  var LIEU_LEX = [
    [/cit[ée]s? ancienne/i, 'cite-ancienne'],
    [/manoir/i, 'manoir'],
    [/avant-?postes?/i, 'avant-poste'],
    [/temples? de la jungle/i, 'temple-jungle'],
    [/temples? du d[ée]sert/i, 'temple-desert'],
    [/camps? abandonn/i, 'camp-abandonne'],
    [/structures? oc[ée]anique|monument/i, 'structure-oceanique'],
    [/villages?\b/i, 'village'],
    [/deep ?dark/i, 'deepdark'],
    [/grottes? luxuriante/i, 'grotte-luxuriante'],
    [/grottes? de gemme|am[ée]thyste/i, 'grotte-gemme'],
    [/grottes? de soufre/i, 'grotte-soufre'],
    [/grottes? de cristal/i, 'grotte-cristal'],
    [/grottes? gel[ée]e/i, 'grotte-gelee'],
    [/grottes? de sel/i, 'grotte-sel'],
    [/ravins?\b/i, 'ravin'],
    [/nether/i, 'nether'],
    [/\bend\b/i, 'end'],
    [/overworld/i, 'overworld'],
    [/\bvoid\b/i, 'void'],
    [/oc[ée]ans?\b|fond des eaux|sous l.eau/i, 'ocean']
  ];

  function lieuDe(txt) {
    for (var i = 0; i < LIEU_LEX.length; i++) if (LIEU_LEX[i][0].test(txt)) return LIEU_LEX[i][1];
    return null;
  }

  function vignette(id) {
    var L = LIEUX[id];
    if (!L) return '';
    var r = function (x, y, w, h, f) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"></rect>';
    };
    var body = r(0, 0, 16, 5, L.ciel[0]) + r(0, 3, 16, 3, L.ciel[1]);
    for (var i = 0; i < L.d.length; i++) {
      var d = L.d[i];
      body += r(d[0], d[1], d[2], d[3], d[4]);
    }
    body += r(0, 9, 16, 1, L.sol) + r(0, 10, 16, 2, L.bas);
    return '<svg viewBox="0 0 16 12" width="100%" height="100%" preserveAspectRatio="none" ' +
      'shape-rendering="crispEdges" aria-hidden="true">' + body + '</svg>';
  }

  var carte = {
    id: 'carte',
    confirme: true,

    detecte: function (q) {
      if (!/\bo[ùu]\b|dimension|biome|structure|abrite|dans quel|\bvit\b|trouve-t-on/i.test(q.q)) return null;
      var ids = q.r.map(lieuDe), vus = {};
      for (var i = 0; i < ids.length; i++) {
        if (!ids[i] || !LIEUX[ids[i]]) return null;      /* une reponse n'est pas un lieu */
        if (vus[ids[i]]) return null;                    /* deux lieux identiques : refuse */
        vus[ids[i]] = 1;
      }
      return { ids: ids };
    },

    consigne: function () { return 'RECONNAIS LE LIEU, PLANTE TON ÉPINGLE'; },

    cta: function (spec, etat) {
      return etat.sel === null ? 'CHOISIS UN TERRITOIRE' : 'PLANTER ICI';
    },

    build: function (zone, q, spec, etat, api) {
      var plan = el('div', 'carte-monde');
      plan.classList.toggle('is-locked', etat.locked);

      spec.ids.forEach(function (id, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'terr';
        b.setAttribute('aria-label', etat.locked ? q.r[i] : 'territoire ' + (i + 1));
        if (etat.sel === i) b.classList.add('is-pique');
        if (etat.locked) {
          if (i === q.ok) b.classList.add('is-ok');
          else if (etat.sel === i) b.classList.add('is-ko');
          else b.classList.add('is-dim');
        }
        var vue = el('span', 'terr-vue');
        vue.innerHTML = vignette(id);
        b.appendChild(vue);
        b.appendChild(el('span', 'terr-pin'));   /* l'epingle, dessinee en CSS */
        var nom = el('span', 'terr-nom', etat.locked ? (LIEUX[id] ? LIEUX[id].nom : q.r[i]) : '?');
        b.appendChild(nom);
        if (!etat.locked) b.addEventListener('click', function () { api.choisir(i); });
        plan.appendChild(b);
      });

      zone.appendChild(plan);
      zone.appendChild(el('p', 'moteur-aide', etat.locked
        ? 'Les noms n’apparaissent qu’une fois l’épingle plantée.'
        : 'Quatre territoires, aucun nom. Reconnais le paysage.'));
    }
  };

  window.QUIZ_MOTEURS = [carte];
  window.QUIZ_LIEUX = { art: vignette, table: LIEUX };
})();
