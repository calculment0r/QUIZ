/* =============================================================================
   QUIZ MINECRAFT 2026 — logique de jeu
   Portage du prototype Claude Design (classe DCLogic) en JS natif, sans build.
   Tout est pilote par un objet d'etat unique + un render() qui repeint le DOM.
   ============================================================================= */
(function () {
  'use strict';

  var BUILD = '9';

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

/* ===================== FEEDBACK CONTEXTUEL =====================
     Un effet tire au hasard felicitait "DIAMANT !" sur une question de laine.
     On choisit d'abord un effet en rapport avec ce qui vient d'etre joue, et on
     ne retombe sur le tirage aleatoire que si rien ne correspond. */
  var FX_THEME_OK = [
    [/diamant|glace|nautile/i, 'DIAMANT !'],
    [/[ée]meraude|villageois/i, 'ÉMERAUDE !'],
    [/p[ée]pite|lingot|\bor\b|dor[ée]/i, 'EN OR !'],
    [/enchant|table d.enchantement/i, 'ENCHANTÉ !'],
    [/fabriqu|recette|craft|table de craft/i, 'CRAFT OK'],
    [/exp[ée]rience|niveau/i, 'NIVEAU + 1'],
    [/pioche|outil|hache|pelle/i, 'PIOCHE OK'],
    [/lave|nether|feu|blaze|magma/i, 'ÇA CHAUFFE'],
    [/bloc|casse|pierre|obsidienne/i, 'BLOC CASSÉ']
  ];
  var FX_THEME_KO = [
    [/creeper/i, 'CREEPER !'],
    [/lave|nether|feu|blaze|magma/i, 'LAVE !'],
    [/eau|oc[ée]an|dauphin|axolotl|noy/i, 'PLOUF'],
    [/bedrock/i, 'BEDROCK...'],
    [/explos|tnt/i, 'BOUM...']
  ];

  /* ===================== OBJETS PIXEL =====================
     Un gabarit par famille de matiere, colore par l'objet : de quoi dessiner
     tout l'atelier sans embarquer une planche de sprites. */
  function itemSvg(id, size) {
    var it = (window.QUIZ_GAMEPLAY && window.QUIZ_GAMEPLAY.items[id]) || ['cube', '#8B8B8B', '#ABABAB', '#6A6A6A', id];
    var kind = it[0], c = it[1], hi = it[2], lo = it[3];
    var WOOD = '#A9762F', WOODL = '#7A521C';       /* le manche des outils */
    var r = function (x, y, w, h, f) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"></rect>';
    };
    var body = '';
    switch (kind) {
      case 'cube':
        body = r(2, 4, 12, 9, c) + r(2, 4, 12, 3, hi) + r(2, 11, 12, 2, lo) + r(5, 8, 2, 2, lo) + r(9, 9, 2, 2, lo);
        break;
      case 'log':
        body = r(3, 3, 10, 11, c) + r(3, 3, 10, 2, hi) + r(6, 6, 4, 5, lo) + r(7, 7, 2, 3, hi);
        break;
      case 'ingot':
        body = r(2, 5, 12, 7, c) + r(3, 4, 10, 1, hi) + r(2, 5, 12, 2, hi) + r(2, 11, 12, 2, lo) +
               r(4, 7, 5, 2, hi);
        break;
      case 'nugget':
        body = r(5, 4, 5, 5, c) + r(5, 4, 3, 3, hi) + r(9, 8, 4, 4, c) + r(9, 8, 2, 2, hi) +
               r(3, 9, 4, 4, c) + r(3, 9, 2, 2, lo);
        break;
      case 'stick':
        body = r(11, 2, 3, 3, hi) + r(9, 4, 3, 3, c) + r(7, 6, 3, 3, hi) + r(5, 8, 3, 3, c) +
               r(3, 10, 3, 4, c) + r(3, 13, 3, 1, lo);
        break;
      case 'lump':
        body = r(4, 4, 5, 5, c) + r(4, 4, 2, 2, hi) + r(8, 6, 5, 5, hi) + r(3, 9, 5, 4, c) +
               r(9, 11, 3, 2, lo) + r(6, 2, 3, 2, lo);
        break;
      case 'gem':
        body = r(5, 2, 6, 2, hi) + r(3, 4, 10, 5, c) + r(4, 9, 8, 2, c) + r(6, 11, 4, 2, lo) +
               r(5, 4, 3, 3, hi);
        break;
      case 'sheet':
        body = r(3, 3, 10, 11, c) + r(3, 3, 10, 1, hi) + r(3, 13, 10, 1, lo) + r(5, 6, 6, 1, lo) + r(5, 9, 4, 1, lo);
        break;
      case 'flower':
        body = r(7, 8, 2, 6, lo) + r(4, 3, 8, 5, c) + r(5, 2, 6, 1, hi) + r(5, 4, 6, 2, hi) +
               r(3, 10, 4, 2, lo) + r(9, 11, 4, 2, lo);
        break;
      case 'bed':
        body = r(2, 7, 12, 5, c) + r(2, 7, 12, 2, hi) + r(2, 11, 12, 2, lo) + r(2, 5, 4, 2, '#FFFFFF');
        break;
      case 'torch':
        body = r(7, 7, 2, 7, c) + r(6, 3, 4, 4, hi) + r(7, 2, 2, 1, lo) + r(7, 4, 2, 2, lo);
        break;
      case 'anvil':
        body = r(2, 3, 12, 3, hi) + r(4, 6, 8, 3, c) + r(5, 9, 6, 2, lo) + r(3, 11, 10, 2, c);
        break;
      case 'compass':
        body = r(3, 4, 10, 9, c) + r(3, 4, 10, 2, hi) + r(6, 7, 4, 3, '#2A1B4A') + r(7, 8, 2, 1, lo);
        break;
      case 'spear':
        body = r(10, 2, 3, 3, hi) + r(9, 5, 2, 2, hi) + r(7, 6, 2, 3, c) + r(4, 9, 3, 4, c) + r(3, 12, 2, 2, lo);
        break;
      /* --- outils : le manche est toujours en bois, la tete prend la matiere --- */
      case 'pioche':
        body = r(2, 4, 4, 2, c) + r(6, 3, 4, 2, c) + r(10, 4, 4, 2, c) +
               r(2, 4, 4, 1, hi) + r(10, 4, 4, 1, hi) + r(7, 5, 2, 2, c) +
               r(8, 6, 2, 2, WOOD) + r(7, 8, 2, 2, WOOD) + r(6, 10, 2, 2, WOOD) + r(5, 12, 2, 2, WOODL);
        break;
      case 'hache':
        body = r(8, 1, 6, 6, c) + r(8, 1, 6, 1, hi) + r(7, 2, 1, 4, hi) + r(8, 6, 4, 1, lo) +
               r(6, 6, 2, 2, WOOD) + r(5, 8, 2, 2, WOOD) + r(4, 10, 2, 2, WOOD) + r(3, 12, 2, 2, WOODL);
        break;
      case 'pelle':
        body = r(9, 2, 4, 4, c) + r(9, 2, 4, 1, hi) + r(9, 5, 4, 1, lo) +
               r(7, 6, 2, 2, WOOD) + r(6, 8, 2, 2, WOOD) + r(5, 10, 2, 2, WOOD) + r(4, 12, 2, 2, WOODL);
        break;
      case 'epee':
        body = r(9, 2, 3, 7, c) + r(9, 2, 1, 7, hi) + r(9, 8, 3, 1, lo) +
               r(6, 9, 7, 2, lo) + r(5, 11, 3, 2, WOOD) + r(4, 13, 2, 2, WOODL);
        break;
      case 'four':
        body = r(2, 3, 12, 11, c) + r(2, 3, 12, 2, hi) + r(2, 12, 12, 2, lo) +
               r(4, 6, 8, 5, '#1A1A22') + r(5, 9, 6, 2, '#F2712C') + r(6, 10, 4, 1, '#FFC145');
        break;
      case 'chaudron':
        body = r(2, 4, 12, 9, c) + r(2, 4, 12, 2, hi) + r(4, 6, 8, 3, '#3A7BBF') +
               r(2, 11, 12, 2, lo) + r(3, 13, 2, 2, lo) + r(11, 13, 2, 2, lo);
        break;
      /* --- nourriture, butin, objets de villageois --- */
      case 'pomme':
        body = r(5, 4, 6, 1, c) + r(4, 5, 8, 7, c) + r(5, 12, 6, 1, lo) +
               r(4, 5, 3, 3, hi) + r(8, 2, 1, 3, '#5C3A1B') + r(9, 2, 3, 2, '#4CD137');
        break;
      case 'carotte':
        body = r(4, 2, 2, 3, '#4CD137') + r(7, 1, 2, 4, '#4CD137') + r(10, 2, 2, 3, '#4CD137') +
               r(5, 5, 6, 3, c) + r(5, 5, 6, 1, hi) + r(6, 8, 4, 3, c) + r(7, 11, 2, 3, lo);
        break;
      case 'ble':
        body = r(7, 2, 2, 12, lo) + r(4, 3, 3, 2, c) + r(9, 3, 3, 2, c) +
               r(4, 6, 3, 2, hi) + r(9, 6, 3, 2, hi) + r(4, 9, 3, 2, c) + r(9, 9, 3, 2, c);
        break;
      case 'graines':
        body = r(3, 5, 2, 2, c) + r(7, 3, 2, 2, hi) + r(11, 6, 2, 2, c) +
               r(5, 9, 2, 2, hi) + r(9, 10, 2, 2, c) + r(7, 7, 2, 2, lo) + r(3, 12, 2, 2, hi);
        break;
      case 'pain':
        body = r(3, 5, 10, 1, hi) + r(2, 6, 12, 6, c) + r(2, 6, 12, 2, hi) + r(2, 11, 12, 2, lo) +
               r(5, 8, 2, 1, lo) + r(9, 9, 2, 1, lo);
        break;
      case 'steak':
        body = r(3, 4, 10, 8, c) + r(3, 4, 10, 2, hi) + r(3, 11, 10, 2, lo) +
               r(6, 7, 4, 3, lo) + r(4, 6, 3, 2, hi);
        break;
      case 'os':
        body = r(3, 7, 10, 3, c) + r(2, 4, 3, 3, hi) + r(2, 10, 3, 3, hi) +
               r(11, 4, 3, 3, hi) + r(11, 10, 3, 3, hi) + r(5, 8, 6, 1, lo);
        break;
      case 'livre':
        body = r(2, 3, 12, 11, c) + r(2, 3, 2, 11, lo) + r(5, 4, 8, 9, '#FFF3D0') +
               r(6, 6, 5, 1, lo) + r(6, 9, 5, 1, lo) + r(2, 3, 12, 1, hi);
        break;
      case 'potion':
        body = r(7, 1, 2, 3, lo) + r(6, 4, 4, 2, hi) + r(4, 6, 8, 8, c) +
               r(4, 6, 8, 2, hi) + r(4, 12, 8, 2, lo) + r(5, 8, 2, 2, hi);
        break;
      case 'carte':
        body = r(2, 3, 12, 11, c) + r(2, 3, 12, 1, hi) + r(2, 13, 12, 1, lo) +
               r(6, 6, 2, 2, '#C4362B') + r(9, 6, 2, 2, '#C4362B') +
               r(7, 8, 2, 2, '#C4362B') + r(6, 10, 2, 2, '#C4362B') + r(9, 10, 2, 2, '#C4362B');
        break;
      case 'fleche':
        body = r(11, 1, 3, 3, hi) + r(10, 3, 2, 2, c) + r(8, 5, 2, 2, WOOD) +
               r(6, 7, 2, 2, WOOD) + r(4, 9, 2, 2, WOOD) + r(1, 11, 4, 4, '#E8E8E8') + r(2, 12, 2, 2, '#BFBFBF');
        break;
      case 'totem':
        body = r(5, 1, 6, 4, c) + r(6, 2, 1, 1, lo) + r(9, 2, 1, 1, lo) + r(7, 4, 2, 1, lo) +
               r(4, 5, 8, 5, c) + r(1, 6, 3, 3, hi) + r(12, 6, 3, 3, hi) +
               r(5, 10, 6, 4, lo) + r(6, 6, 4, 2, hi);
        break;
      case 'disque':
        body = r(3, 3, 10, 10, '#1A1A22') + r(4, 4, 8, 8, c) + r(5, 5, 2, 2, hi) +
               r(7, 7, 2, 2, '#E8E8E8') + r(9, 9, 2, 2, lo);
        break;
      case 'selle':
        body = r(6, 3, 4, 3, c) + r(3, 6, 10, 5, c) + r(3, 6, 10, 2, hi) +
               r(1, 8, 2, 4, lo) + r(13, 8, 2, 4, lo) + r(3, 10, 10, 2, lo);
        break;
      default:
        body = r(4, 4, 8, 8, c);
    }
    return '<svg viewBox="0 0 16 16" width="' + size + '" height="' + size +
      '" shape-rendering="crispEdges" aria-hidden="true">' + body + '</svg>';
  }

  function itemName(id) {
    var it = window.QUIZ_GAMEPLAY && window.QUIZ_GAMEPLAY.items[id];
    return it ? it[4] : id;
  }


  /* ===================== MOBS EN PIXELS =====================
     Une tete de 8x8 par creature : c'est la silhouette et les couleurs qui la
     rendent reconnaissable, pas le detail. '.' = rien du tout. */
  var MOB_ART = {
    /* --- animaux et illageois ajoutes pour la scene : chacun doit se
       distinguer d'un coup d'oeil des autres reponses possibles, sinon la
       question serait injouable (le chat est noir, le renard orange ; les
       trois illageois se reconnaissent a leur arme) --- */
    chat:      { p: ['k......k', 'kk....kk', '.kkkkkk.', '.kxkkxk.', '.kkwwkk.', '.wwwwww.', '.wwwwww.', '.k....k.'],
                 c: { k: '#2A2A33', w: '#F2F2F2', x: '#4CD137', '.': null } },
    perroquet: { p: ['..rr....', '.rrrr...', '.rxrbb..', '.rrrbbb.', '..bbbbb.', '..bbyy..', '...yy...', '...y.y..'],
                 c: { r: '#FF4B4B', b: '#3A7BBF', y: '#FFC145', x: '#2A2A33', '.': null } },
    renard:    { p: ['o......o', 'oo....oo', '.oooooo.', '.oxooxo.', '.oooooo.', '..wwww..', '..wwww..', '.o....o.'],
                 c: { o: '#E07A2A', x: '#2A2A33', w: '#FFFFFF', '.': null } },
    lapin:     { p: ['.w....w.', '.w....w.', '.wwwwww.', '.wxwwxw.', '.wwnnww.', '.wwwwww.', '.wwwwww.', '.w....w.'],
                 c: { w: '#D9C7A8', x: '#2A2A33', n: '#F0A0A0', '.': null } },
    mouton:    { p: ['..wwww..', '.wWwwWw.', 'wWwwwwWw', 'wwwwwwkk', 'wWwwwWkx', '.wwwwkkk', '..w..w..', '..w..w..'],
                 c: { w: '#F2F2F2', W: '#D8D8D8', k: '#3A2A22', x: '#FFFFFF', '.': null } },
    tortue:    { p: ['...gg...', '..gggg..', '.GGGGGG.', 'GGssssGG', 'GGssssGG', '.GGGGGG.', '..g..g..', '........'],
                 c: { g: '#8BE07C', G: '#2E8B26', s: '#4CD137', '.': null } },
    dauphin:   { p: ['....bb..', '...bbb..', 'b.bbbbbb', 'bbbbbbbx', 'bbwwwwbb', '.bwwww..', '........', '........'],
                 c: { b: '#6BA3DB', w: '#E8F0FF', x: '#1A1A22', '.': null } },
    nautile:   { p: ['..CCCC..', '.CccccC.', 'CccOOccC', 'CcOOOOcC', 'CccOOccC', '.CccccC.', '..CCCC..', '..t..t..'],
                 c: { C: '#3EC4BC', c: '#ADF5F0', O: '#2E9E97', t: '#F5A9C8', '.': null } },
    raie:      { p: ['..m..m..', '.mmmmmm.', 'mmmmmmmm', 'mmmxxmmm', 'mmmmmmmm', '.mmmmmm.', '..mmmm..', '...mm...'],
                 c: { m: '#4A5A7A', x: '#E8E8E8', '.': null } },
    sorciere:  { p: ['..kkkk..', '.kkkkkk.', 'kkkkkkkk', '.ssssss.', '.sxssxs.', '.ssnnss.', '.pppppp.', '.pp..pp.'],
                 c: { k: '#4A2A72', s: '#C8A882', x: '#2A2A33', n: '#8B5A2B', p: '#6B3FA0', '.': null } },
    pillard:   { p: ['.ssssss.', 'ssssssss', 'sxssssxs', 'ssnnnnss', 'bbbbbbbb', '.gggggg.', '.gggggg.', '.gg..gg.'],
                 c: { s: '#9AA8A0', x: '#2A2A33', n: '#7A8880', b: '#8B5A2B', g: '#3A4A6A', '.': null } },
    vindicateur: { p: ['.ssssss.', 'ssssssss', 'sxssssxs', 'ssnnnnss', 'aaggggaa', '.gggggg.', '.gggggg.', '.gg..gg.'],
                 c: { s: '#9AA8A0', x: '#2A2A33', n: '#7A8880', a: '#C4C4C4', g: '#3A5A2A', '.': null } },
    evocateur: { p: ['.ssssss.', 'ssssssss', 'sxssssxs', 'ssnnnnss', 'yyyyyyyy', '.kkkkkk.', '.kkkkkk.', '.kk..kk.'],
                 c: { s: '#9AA8A0', x: '#2A2A33', n: '#7A8880', y: '#C9962F', k: '#2A2A33', '.': null } },
    slime:     { p: ['.gggggg.', 'gGGGGGGg', 'gGxGGxGg', 'gGGGGGGg', 'gGGmmGGg', 'gGGGGGGg', 'gGGGGGGg', '.gggggg.'],
                 c: { g: '#4CD137', G: '#7CE85F', x: '#2A2A33', m: '#2E8B26', '.': null } },
    cubesoufre:{ p: ['.yyyyyy.', 'yYYYYYYy', 'yYxYYxYy', 'yYYYYYYy', 'yYYooYYy', 'yYYYYYYy', 'yYYYYYYy', '.yyyyyy.'],
                 c: { y: '#D9B34A', Y: '#F2D98A', x: '#4A3A10', o: '#A8842A', '.': null } },
    creeper:   { p: ['..o...o.', '.xx..xx.', '.xx..xx.', '...xx...', '..xxxx..', '..xxxx..', '..x..x..', '.o....o.'],
                 c: { '.': '#4CD137', o: '#2E8B26', x: '#0C2B08' } },
    enderman:  { p: ['xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'xPPxxPPx', 'xPPxxPPx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx'],
                 c: { x: '#16151E', P: '#E0A6FF' } },
    squelette: { p: ['.wwwwww.', 'wwwwwwww', 'wxxwwxxw', 'wxxwwxxw', 'wwwwwwww', 'wxwxwxww', 'wwwwwwww', '.wwwwww.'],
                 c: { w: '#E8E8E8', x: '#2A2A33', '.': null } },
    ghast:     { p: ['wwwwwwww', 'wxxwwxxw', 'wxxwwxxw', 'wwwwwwww', 'wwxxxxww', 'wwwwwwww', 'w.w.w.w.', '.w...w..'],
                 c: { w: '#E8E8E8', x: '#1A1A22', '.': null } },
    zombie:    { p: ['.gggggg.', 'gggggggg', 'gxxggxxg', 'gxxggxxg', 'gggggggg', 'gxxxxxxg', 'gggggggg', '.gggggg.'],
                 c: { g: '#4A7A3A', x: '#1B2A18', '.': null } },
    araignee:  { p: ['x......x', '.x....x.', 'xxxxxxxx', 'xrrxxrrx', 'xxxxxxxx', '.x.xx.x.', 'x......x', '........'],
                 c: { x: '#2A2028', r: '#FF4B4B', '.': null } },
    blaze:     { p: ['.y.y.y.y', 'yyyyyyyy', 'yxxyyxxy', 'yyyyyyyy', 'yyyyyyyy', '.y.y.y.y', 'o.o.o.o.', '........'],
                 c: { y: '#FFC145', x: '#6E4522', o: '#F2712C', '.': null } },
    warden:    { p: ['.tttttt.', 'tttttttt', 'ttccttcc', 'tttttttt', 'ttcccctt', 'tttttttt', 't.tttt.t', '.t.tt.t.'],
                 c: { t: '#1B3A3A', c: '#4FD9D0', '.': null } },
    allay:     { p: ['..bb....', '.bbbb...', '.bwwb...', '.bbbb...', 'w.bb.w..', '..bb....', '...b....', '........'],
                 c: { b: '#4FA9E8', w: '#CFE8FF', '.': null } },
    axolotl:   { p: ['.pp..pp.', 'pppppppp', 'pxppppxp', 'pppppppp', '.pppppp.', '..pppp..', '...pp...', '........'],
                 c: { p: '#F5A9C8', x: '#2A1B2A', '.': null } },
    loup:      { p: ['w..ww..w', 'ww.ww.ww', 'wwwwwwww', 'wxwwwwxw', 'wwwwwwww', 'wwgggwww', 'wwwwwwww', '.wwwwww.'],
                 c: { w: '#E0E0E0', x: '#2A2A33', g: '#9A9A9A', '.': null } },
    cochon:    { p: ['.pppppp.', 'pppppppp', 'pxppppxp', 'pppppppp', 'ppnnnnpp', 'ppnnnnpp', 'pppppppp', '.pppppp.'],
                 c: { p: '#F0A0A0', x: '#2A1B2A', n: '#D07070', '.': null } },
    villageois:{ p: ['.ssssss.', 'ssssssss', 'sxssssxs', 'ssnnnnss', 'ssnnnnss', 'ssssssss', 'sbbbbbbs', '.ssssss.'],
                 c: { s: '#C8A882', x: '#2A2A33', n: '#A88060', b: '#6B4A2A', '.': null } },
    piglin:    { p: ['.pppppp.', 'pppppppp', 'pxppppxp', 'ppnnnnpp', 'ppnnnnpp', 'pppppppp', 'gggggggg', '.gg..gg.'],
                 c: { p: '#E8A0A0', x: '#2A1B2A', n: '#C87878', g: '#C9962F', '.': null } },
    wither:    { p: ['.kkkkkk.', 'kkkkkkkk', 'kbbkkbbk', 'kbbkkbbk', 'kkkkkkkk', 'kwkwkwkk', 'kkkkkkkk', '.k.kk.k.'],
                 c: { k: '#2A2A2A', b: '#8FD8FF', w: '#4A4A4A', '.': null } },
    dragon:    { p: ['..dddd..', '.dddddd.', 'ddmmddmm', 'dddddddd', 'dddddddd', '.dddddd.', '..dd.dd.', '.d....d.'],
                 c: { d: '#1A1024', m: '#C86AE0', '.': null } },
    golem:     { p: ['.gggggg.', 'gggggggg', 'gxggggxg', 'ggnnnngg', 'ggnnnngg', 'gggggggg', 'gvvvvvvg', '.gggggg.'],
                 c: { g: '#C4C4C4', x: '#2A2A33', n: '#9A7A5A', v: '#3B8526', '.': null } },
    cheval:    { p: ['..hh....', '.hhhh...', '.hhhh...', 'whhhh...', '.hhhhh..', '..hhhhh.', '..mmhhh.', '...mm...'],
                 c: { h: '#8B5A2B', m: '#5C3A1B', w: '#E8E8E8', '.': null } },
    lama:      { p: ['.ll.....', 'lllx....', 'llll....', '.lll....', '.lll....', '.llll...', '.lllll..', '..ll.ll.'],
                 c: { l: '#E0D0B0', x: '#2A2A33', '.': null } },
    happyghast:{ p: ['wwwwwwww', 'wxwwwwxw', 'wwwwwwww', 'wxwwwwxw', 'wwyyyyww', 'wwwwwwww', 'w.w.w.w.', '.w...w..'],
                 c: { w: '#FFFFFF', x: '#1A1A22', y: '#FFC145', '.': null } },
    noye:      { p: ['.nnnnnn.', 'nnnnnnnn', 'neennnee', 'neennnee', 'nnnnnnnn', 'nxxxxxxn', 'nnnnnnnn', '.nnnnnn.'],
                 c: { n: '#3A7A7A', e: '#8FD8FF', x: '#16302E', '.': null } },
    vex:       { p: ['..vvvv..', '.vvvvvv.', '.vrvvrv.', '.vvvvvv.', 'w.vvvv.w', 'w.vvvv.w', '..v..v..', '........'],
                 c: { v: '#8FA8C8', r: '#FF4B4B', w: '#DCE8F5', '.': null } },
    shulker:   { p: ['..ssss..', '.ssssss.', 'ssssssss', 'slllllls', 'slllllls', 'ssssssss', '.ssssss.', '..ssss..'],
                 c: { s: '#6B3FA0', l: '#8F63C4', '.': null } },
    phantom:   { p: ['........', '.f....f.', 'ff.ff.ff', 'ffffffff', 'feffffef', 'ffffffff', '.f.ff.f.', '..f..f..'],
                 c: { f: '#1E4A5A', e: '#8FD8FF', '.': null } }
  };

  function mobSvg(id, size) {
    var art = MOB_ART[id] || MOB_ART.creeper;
    var out = '';
    for (var y = 0; y < art.p.length; y++) {
      var row = art.p[y];
      for (var x = 0; x < row.length; x++) {
        var col = art.c[row[x]];
        if (!col) continue;
        out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + col + '"></rect>';
      }
    }
    return '<svg viewBox="0 0 8 8" width="' + size + '" height="' + size +
      '" shape-rendering="crispEdges" aria-hidden="true">' + out + '</svg>';
  }

  /* les deux banques de dessins, exposees : les mini-jeux du registre s'en
     servent via leur API, et les tests peuvent les appeler directement */
  window.QUIZ_ART = {
    item: itemSvg, mob: mobSvg,
    /* trouve(texte) -> { id, kind } : le lexique complet des creatures et des
       objets, ouvert aux moteurs du registre pour qu'ils sachent dessiner le
       sujet d'une question sans reecrire une table a eux */
    trouve: function (txt) { return sceneArt(txt); },
    nom: function (id) { return itemName(id); }
  };

  /* ===================== ROUTAGE DES EPREUVES =====================
     La couche gameplay est verifiee contre le texte de la bonne reponse : si la
     banque change sans que la fiche suive, la question repasse en mode BLOCS
     plutot que de proposer une epreuve fausse. */
  var MOTS = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10 };

  /* "3 laines et 3 planches" -> [3,3] ; "Du papier et une pepite" -> [1,1] */
  function countsIn(txt) {
    var parts = String(txt).split(/\s+(?:et|\+)\s+/i);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var m = parts[i].trim().match(/^(?:du |de la |des |d')?\s*(\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\b/i);
      if (m) {
        var raw = m[1].toLowerCase();
        out.push(/^\d+$/.test(raw) ? parseInt(raw, 10) : MOTS[raw]);
      } else {
        out.push(1);           /* "Du papier" : un exemplaire implicite */
      }
    }
    return out;
  }

  function sortedNums(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function sameNums(a, b) {
    if (a.length !== b.length) return false;
    var p = sortedNums(a), q = sortedNums(b);
    for (var i = 0; i < p.length; i++) if (p[i] !== q[i]) return false;
    return true;
  }

  function craftSpec(q) {
    var G = window.QUIZ_GAMEPLAY;
    var spec = G && G.craft[q.q];
    if (!spec) return null;
    var total = spec.need.reduce(function (s, x) { return s + x.n; }, 0);
    if (total < 2 || total > 9) return null;              /* un seul objet = QCM deguise */
    /* garde-fou : les quantites de la fiche doivent correspondre a la reponse */
    if (!sameNums(countsIn(q.r[q.ok]), spec.need.map(function (x) { return x.n; }))) return null;
    return spec;
  }

  /* "20 minutes" -> 20 ; "9" -> 9 ; refuse les intervalles et les decimales */
  function numberIn(txt) {
    var m = String(txt).trim().match(/^(\d{1,4})(?:\s+[A-Za-zÀ-ÿ']+)?$/);
    if (!m) return null;
    var v = parseInt(m[1], 10);
    return (v >= 1 && v <= 1000) ? v : null;
  }

  function forgeSpec(q) {
    var G = window.QUIZ_GAMEPLAY;
    var spec = G && G.forge[q.q];
    if (!spec) return null;
    /* les quatre reponses d'origine doivent etre des nombres distincts, sinon
       composer une valeur n'aurait pas de sens pour cette question */
    var nums = q.r.map(numberIn);
    for (var i = 0; i < nums.length; i++) if (nums[i] === null) return null;
    var uniq = {};
    for (var j = 0; j < nums.length; j++) { if (uniq[nums[j]]) return null; uniq[nums[j]] = 1; }
    var target = nums[q.ok];
    return { target: target, unit: spec.unit || '', chips: spec.chips };
  }

  /* ===================== LA GROTTE A FOUILLER =====================
     Si les quatre reponses sont des creatures que l'on sait dessiner, la
     question devient une scene : plus de liste de textes, il faut reconnaitre
     la bete. L'ordre du lexique compte : les variantes qui se dessineraient
     pareil (cheval squelette, cheval zombie, mule) tombent sur le meme dessin,
     donc la question est ecartee automatiquement — on ne peut pas demander de
     distinguer deux images identiques. */
  var SCENE_LEX = [
    [/happy ?ghast/i, 'happyghast'],
    [/cube de soufre/i, 'cubesoufre'],
    [/perroquet/i, 'perroquet'],
    [/\bchat\b/i, 'chat'],
    [/renard/i, 'renard'],
    [/lapin/i, 'lapin'],
    [/mouton/i, 'mouton'],
    [/tortue/i, 'tortue'],
    [/dauphin/i, 'dauphin'],
    [/nautile/i, 'nautile'],
    [/\braies?\b/i, 'raie'],
    [/sorci[èe]re/i, 'sorciere'],
    [/[ée]vocateur/i, 'evocateur'],
    [/vindicateur/i, 'vindicateur'],
    [/pillard/i, 'pillard'],
    [/slime/i, 'slime'],
    [/cheval|mule|poney/i, 'cheval'],
    [/creeper/i, 'creeper'],
    [/noy[ée]/i, 'noye'],
    [/zombie/i, 'zombie'],
    [/squelette/i, 'squelette'],
    [/enderman/i, 'enderman'],
    [/araign/i, 'araignee'],
    [/blaze/i, 'blaze'],
    [/ghast/i, 'ghast'],
    [/warden/i, 'warden'],
    [/allay/i, 'allay'],
    [/axolotl/i, 'axolotl'],
    [/loup/i, 'loup'],
    [/cochon/i, 'cochon'],
    [/villageois/i, 'villageois'],
    [/piglin/i, 'piglin'],
    [/wither/i, 'wither'],
    [/dragon/i, 'dragon'],
    [/golem/i, 'golem'],
    [/lama/i, 'lama'],
    [/vex/i, 'vex'],
    [/shulker/i, 'shulker'],
    [/phantom/i, 'phantom']
  ];

  /* meme principe pour les objets : outils, blocs et minerais se reconnaissent
     aussi bien qu'une creature, et cela couvre les questions de Survie */
  var SCENE_OBJ = [
    /* les variantes dorees d'abord : sinon "carotte doree" tomberait sur la
       carotte ordinaire et deux reponses se dessineraient pareil */
    [/pomme dor[ée]e/i, 'pomme-doree'], [/carotte dor[ée]e/i, 'carotte-doree'],
    [/bl[ée] dor[ée]/i, 'ble-dore'], [/pissenlit dor[ée]/i, 'pissenlit-dore'],
    [/pomme/i, 'pomme'], [/carotte/i, 'carotte'], [/\bbl[ée]\b/i, 'ble'],
    [/graine/i, 'graines'], [/\bpain\b/i, 'pain'], [/steak|viande|b[œe]uf/i, 'steak'],
    [/\bos\b/i, 'os'], [/livre/i, 'livre-enchante'], [/potion/i, 'potion'],
    [/cartes? d.explorateur|\bcartes?\b/i, 'carte'], [/fl[èe]che/i, 'fleche'],
    [/totem/i, 'totem'], [/disque/i, 'disque'], [/selle/i, 'selle'],
    [/pissenlit/i, 'pissenlit'],
    [/table de craft/i, 'table'], [/terre cuite/i, 'terrecuite'],
    [/pioche/i, 'pioche'], [/hache/i, 'hache'], [/pelle/i, 'pelle'], [/[ée]p[ée]e/i, 'epee'],
    [/four\b/i, 'four'], [/chaudron/i, 'chaudron'], [/enclume/i, 'enclume'],
    [/bedrock/i, 'bedrock'], [/obsidienne/i, 'obsidienne'], [/netherite/i, 'netherite'],
    [/charbon/i, 'charbon'], [/diamant/i, 'diamant'], [/[ée]meraude/i, 'emeraude'],
    [/lapis/i, 'lapis'], [/cuivre/i, 'cuivre'], [/redstone/i, 'redstone'],
    [/planche/i, 'planche'], [/b[ûu]che|bois/i, 'buche'], [/laine/i, 'laine'],
    [/b[âa]ton/i, 'baton'], [/verre/i, 'verre'], [/b[ée]ton/i, 'beton'],
    [/pierre/i, 'pierre'], [/sable/i, 'sable'], [/terre/i, 'terre'],
    [/\bor\b|d.or\b/i, 'lingot-or'], [/\bfer\b/i, 'lingot-fer'],
    [/torche/i, 'torche'], [/boussole/i, 'boussole'], [/papier/i, 'papier'],
    [/cuir/i, 'cuir'], [/lit\b/i, 'lit']
  ];

  function sceneArt(txt) {
    var i;
    for (i = 0; i < SCENE_LEX.length; i++) if (SCENE_LEX[i][0].test(txt)) return { id: SCENE_LEX[i][1], kind: 'mob' };
    for (i = 0; i < SCENE_OBJ.length; i++) if (SCENE_OBJ[i][0].test(txt)) return { id: SCENE_OBJ[i][1], kind: 'item' };
    return null;
  }

  function sceneSpec(q) {
    var arts = q.r.map(sceneArt);
    var vus = {}, mobs = 0;
    for (var i = 0; i < arts.length; i++) {
      if (!arts[i]) return null;
      if (vus[arts[i].id]) return null;       /* deux dessins identiques : refuse */
      vus[arts[i].id] = 1;
      if (arts[i].kind === 'mob') mobs++;
    }
    var low = q.q.toLowerCase();
    var creatures = mobs >= 3;
    var lieu = !creatures ? 'coffre'
             : /nether|blaze|ghast|piglin/.test(low) ? 'nether'
             : /\bend\b|dragon|shulker|ender/.test(low) ? 'end'
             : 'grotte';
    return { arts: arts, lieu: lieu, creatures: creatures };
  }

  /* ===================== LE REGISTRE DES MOTEURS =====================
     Les epreuves qui ne sont pas cablees dans ce fichier vivent dans
     quiz-moteurs.js. On leur demande, question par question, si l'une sait la
     jouer. Le registre passe en DERNIER : il ne prend que ce qui, sans lui,
     resterait un QCM — aucune epreuve existante ne peut lui etre volee. */
  function moteurSpec(q) {
    var reg = window.QUIZ_MOTEURS || [];
    for (var i = 0; i < reg.length; i++) {
      var sp = null;
      try { sp = reg[i].detecte(q); } catch (e) { sp = null; }
      if (sp) return { def: reg[i], spec: sp };
    }
    return null;
  }

  function routeOf(q) {
    var low = q.q.toLowerCase();
    if (/hauteur|jusqu.o[ùu]|niveau de lumi|creuser|profondeur/.test(low)) return 'slider';
    if (craftSpec(q)) return 'craft';
    if (forgeSpec(q)) return 'forge';
    if (sceneSpec(q)) return 'scene';
    if (moteurSpec(q)) return 'moteur';
    return 'blocks';
  }

  /* ===================== DIRECTEUR DE PARTIE =====================
     Sans lui, "Mobs" et "Bedrock" tiraient douze QCM d'affilee : les seules
     epreuves jouables de la banque vivent dans "Survie". Il garantit au moins
     une epreuve jouable quand le vivier le permet, et espace les moteurs. */
  function ensureVariety(picked, pool, lv) {
    var hasEngine = picked.some(function (p) { return p.route !== 'blocks'; });
    if (hasEngine) return picked;
    var used = {};
    picked.forEach(function (p) { used[p.q.q] = 1; });
    var cand = pool.filter(function (p) { return !used[p.q.q] && routeOf(p.q) !== 'blocks'; });
    if (!cand.length) return picked;                       /* le vivier n'a rien : on l'accepte */
    /* on prefere rester proche du niveau choisi pour ne pas casser la difficulte */
    var near = cand.filter(function (p) { return Math.abs(p.li - lv) <= 1; });
    var chosen = (near.length ? near : cand)[Math.floor(Math.random() * (near.length ? near.length : cand.length))];
    var slot = Math.min(picked.length - 1, 2 + Math.floor(Math.random() * 3));
    picked[slot] = { q: chosen.q, li: chosen.li, route: routeOf(chosen.q) };
    return picked;
  }

  /* jamais deux fois le meme moteur a la suite (les blocs restent majoritaires
     dans la banque, on ne peut pas les espacer) */
  function spreadEngines(list) {
    for (var i = 1; i < list.length; i++) {
      if (list[i].route === 'blocks' || list[i].route !== list[i - 1].route) continue;
      for (var j = i + 1; j < list.length; j++) {
        if (list[j].route !== list[i].route &&
            (j + 1 >= list.length || list[j + 1].route !== list[i].route)) {
          var t = list[i]; list[i] = list[j]; list[j] = t;
          break;
        }
      }
    }
    return list;
  }

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
    sound: true, musique: true,
    craft: null, forge: null, moteur: null,   /* etat des moteurs jouables */
    echo: null, inEcho: false, echoQ: null   /* epreuve de rattrapage */
  };

  var rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var ac = null, miniTimer = null, flashTick = null;

  /* ------------------------------- DOM ------------------------------- */
  function $(id) { return document.getElementById(id); }
  var app = $('app');
  var el = {
    sun: $('sun'), moon: $('moon'), night: $('skyNight'),
    edition: $('edition'), btnPlay: $('btnPlay'), btnSound: $('btnSound'),
    btnInstall: $('btnInstall'),
    levelsTitle: $('levelsTitle'),
    briefIco: $('briefIco'), briefMonde: $('briefMonde'), briefQuiz: $('briefQuiz'),
    briefNiveau: $('briefNiveau'), briefNb: $('briefNb'), briefFlash: $('briefFlash'),
    briefBest: $('briefBest'), briefMot: $('briefMot'), btnGo: $('btnGo'),
    hudLabel: $('hudLabel'), combo: $('combo'), track: $('track'), counter: $('counter'),
    playfield: $('playfield'), consigne: $('consigne'), qText: $('qText'),
    depth: $('depth'), answers: $('answers'), expl: $('expl'),
    scene: $('scene'), moteur: $('moteur'),
    craft: $('craft'), craftOut: $('craftOut'), craftOutSlot: $('craftOutSlot'),
    craftOutName: $('craftOutName'), craftGrid: $('craftGrid'), craftHint: $('craftHint'),
    craftDock: $('craftDock'),
    forge: $('forge'), forgeTotal: $('forgeTotal'), forgeUnit: $('forgeUnit'),
    forgeFill: $('forgeFill'), forgeVerdict: $('forgeVerdict'), forgeChips: $('forgeChips'),
    forgeReset: $('forgeReset'), echoBadge: $('echoBadge'),
    btnCta: $('btnCta'), qStage: $('qStage'),
    fx: $('fx'), fxParts: $('fxParts'), fxLabel: $('fxLabel'),
    resultSub: $('resultSub'), resultScore: $('resultScore'), resultRank: $('resultRank'),
    statScore: $('statScore'), statCombo: $('statCombo'), statChaos: $('statChaos'),
    resultMsg: $('resultMsg'), recap: $('recap'),
    btnShare: $('btnShare'), btnReplay: $('btnReplay'),
    overlayMini: $('overlayMini'), miniPanel: $('miniPanel'), miniBadge: $('miniBadge'),
    miniTime: $('miniTime'), miniTitle: $('miniTitle'), miniSub: $('miniSub'),
    miniZone: $('miniZone'),
    miniBricks: $('miniBricks'), miniTarget: $('miniTarget'), miniStat: $('miniStat'),
    miniGrid: $('miniGrid'), miniMelt: $('miniMelt'), meltPips: $('meltPips'),
    btnStab: $('btnStab'), btnMiniNext: $('btnMiniNext'),
    btnMusique: $('btnMusique'),
    btnCollection: $('btnCollection'), collCount: $('collCount'),
    overlayVitrine: $('overlayVitrine'), vitrineCorps: $('vitrineCorps'),
    vitrineCompte: $('vitrineCompte'), neuf: $('neuf'), neufListe: $('neufListe'),
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

  /* ===================== LE SON =====================
     Trois pieges de telephone, tous corriges ici :

     1. resume() est asynchrone. L'ancienne version programmait les notes a
        ac.currentTime juste apres l'appel : sur iPhone le contexte etait encore
        endormi et les notes tombaient dans le passe. On attend maintenant le
        reveil avant de jouer.
     2. Le contexte doit naitre pendant un vrai geste. Il est desormais cree au
        tout premier appui sur l'ecran, pas au premier bruitage : certains
        bruitages partent d'un minuteur (l'alerte des Flash), ce qui ne compte
        pas comme un geste et laissait le contexte endormi pour toujours.
     3. Sur iPhone, le petit interrupteur silencieux coupe l'audio web. Tant
        qu'un element <audio> joue, le systeme bascule en categorie lecture et
        le son passe malgre l'interrupteur : on garde donc un silence en boucle. */
  var audioPret = false, silence = null;

  function contexteAudio() {
    if (ac) return ac;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ac = new AC(); } catch (e) { ac = null; }
    return ac;
  }

  /* un fichier WAV silencieux fabrique a la volee : pas de donnees embarquees */
  function urlSilence(secondes) {
    var taux = 8000, n = Math.floor(taux * secondes);
    var buf = new ArrayBuffer(44 + n), v = new DataView(buf), i;
    function txt(pos, str) { for (i = 0; i < str.length; i++) v.setUint8(pos + i, str.charCodeAt(i)); }
    txt(0, 'RIFF'); v.setUint32(4, 36 + n, true); txt(8, 'WAVEfmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, taux, true); v.setUint32(28, taux, true);
    v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    txt(36, 'data'); v.setUint32(40, n, true);
    for (i = 0; i < n; i++) v.setUint8(44 + i, 128);      /* 128 = silence en 8 bits */
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }

  function garderSessionAudio() {
    if (silence || !isIOS()) return;
    try {
      silence = document.createElement('audio');
      silence.src = urlSilence(0.5);
      silence.loop = true;
      silence.setAttribute('playsinline', '');
      silence.volume = 0.001;
      var p = silence.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /* appele au tout premier appui : c'est le seul moment ou un telephone
     accepte de reveiller l'audio */
  function reveilAudio() {
    var c = contexteAudio();
    if (!c) return;
    garderSessionAudio();
    if (c.state === 'suspended' && c.resume) { try { c.resume(); } catch (e) {} }
    try {
      var b = c.createBuffer(1, 1, 22050), s0 = c.createBufferSource();
      s0.buffer = b; s0.connect(c.destination); s0.start(0);
    } catch (e) {}
    audioPret = true;
    if (S.musique) demarreMusique();
  }

  function joueNotes(notes) {
    var t = ac.currentTime + 0.02;          /* jamais dans le passe */
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
  }

  function snd(kind) {
    if (!S.sound) return;
    var notes = NOTES[kind];
    if (!notes) return;
    var c = contexteAudio();
    if (!c) return;
    try {
      if (c.state === 'running') { joueNotes(notes); return; }
      /* endormi : on le reveille, et on ne joue qu'une fois reveille */
      if (c.resume) {
        var p = c.resume();
        if (p && p.then) p.then(function () { try { joueNotes(notes); } catch (e) {} }).catch(function () {});
        else joueNotes(notes);
      }
    } catch (e) { /* audio indisponible : le jeu continue sans */ }
  }

  /* ------------------------------ musique ------------------------------ */
  function demarreMusique() {
    if (!S.musique || !window.QUIZ_MUSIC) return;
    var c = contexteAudio();
    if (!c) return;
    if (c.state !== 'running' && c.resume) {
      var p = c.resume();
      if (p && p.then) { p.then(function () { window.QUIZ_MUSIC.demarre(c); }).catch(function () {}); return; }
    }
    window.QUIZ_MUSIC.demarre(c);
  }

  function arreteMusique() {
    if (window.QUIZ_MUSIC) window.QUIZ_MUSIC.arrete();
  }

  function mat(txt) {
    var t = (txt || '').toLowerCase();
    for (var i = 0; i < MATS.length; i++) if (MATS[i][0].test(t)) return MATS[i];
    var pool = [MATS[8], MATS[11], MATS[7], MATS[3]];
    return pool[(t.length + (t.charCodeAt(0) || 0) || 0) % pool.length];
  }

  function consigneFor(q, mode) {
    if (S.inEcho) return 'TU TE SOUVIENS ?';
    if (mode === 'scene') {
      var sp = sceneSpec(q);
      return (sp && sp.creatures) ? 'TROUVE LA BONNE CRÉATURE' : 'TOUCHE LE BON OBJET';
    }
    if (mode === 'moteur') {
      var mo = S.moteur || moteurSpec(q);
      try { return mo.def.consigne(mo.spec); } catch (e) { return 'À TOI DE JOUER'; }
    }
    if (mode === 'craft') return 'CONSTRUIS LA RECETTE';
    if (mode === 'forge') return 'COMPOSE LA BONNE VALEUR';
    if (mode === 'slider') return /lumi/.test(q.q.toLowerCase()) ? 'RÈGLE LE BON NIVEAU' : 'DESCENDS À LA BONNE HAUTEUR';
    return 'TOUCHE LE BON BLOC';
  }

  /* la question en cours : celle de la partie, ou celle du rattrapage */
  function curQ() { return S.inEcho ? S.echoQ : S.questions[S.qi]; }

  /* prepare l'etat du moteur correspondant a la question affichee */
  function setupEngines(q) {
    S.craft = null;
    S.forge = null;
    S.moteur = null;
    if (!q) return;
    if (q.m === 'moteur') {
      var ms = moteurSpec(q);
      if (ms) S.moteur = { def: ms.def, spec: ms.spec };
      else q.m = 'blocks';
      return;
    }
    if (q.m === 'craft') {
      var cs = craftSpec(q);
      if (cs) {
        S.craft = {
          need: cs.need, dock: cs.dock, result: cs.result,
          placed: new Array(9), armed: cs.dock[0]
        };
      } else { q.m = 'blocks'; }
    } else if (q.m === 'forge') {
      var fs = forgeSpec(q);
      if (fs) S.forge = { target: fs.target, unit: fs.unit, chips: fs.chips, total: 0, stack: [] };
      else q.m = 'blocks';
    }
  }

  function craftPlacedCounts() {
    var c = {};
    (S.craft ? S.craft.placed : []).forEach(function (id) { if (id) c[id] = (c[id] || 0) + 1; });
    return c;
  }

  function craftIsOk() {
    if (!S.craft) return false;
    var got = craftPlacedCounts(), want = {};
    S.craft.need.forEach(function (x) { want[x.id] = x.n; });
    var kg = Object.keys(got), kw = Object.keys(want);
    if (kg.length !== kw.length) return false;
    for (var i = 0; i < kw.length; i++) if (got[kw[i]] !== want[kw[i]]) return false;
    return true;
  }

  function craftCount() {
    var n = 0;
    (S.craft ? S.craft.placed : []).forEach(function (id) { if (id) n++; });
    return n;
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

  /* ------------------------------ les mondes ------------------------------
     Chaque quiz a son decor. Le changement passe par un rideau : le terrain
     monte, le paysage change derriere, le terrain redescend. C'est la meme
     grammaire que l'intro — des blocs, jamais un fondu. */
  var MONDES = [
    { id: 'plaine', nom: 'LES PLAINES', ciel: '#4E2AA8',
      mot: 'Le soleil se lève sur ton terrain. Douze épreuves t’attendent.' },
    { id: 'nether', nom: 'LE NETHER', ciel: '#5E1410',
      mot: 'Il fait chaud ici. Les créatures ne pardonnent pas l’à-peu-près.' },
    { id: 'end', nom: 'L’END', ciel: '#100C1F',
      mot: 'Le vide, les îles blanches, et tout ce qui vient de sortir.' }
  ];
  function mondeDe(qz) { return MONDES[qz] || MONDES[0]; }

  var transitTimer = null;
  function transitionMonde(id, apres) {
    var actuel = app.dataset.monde || 'plaine';
    if (actuel === id || rm) {
      app.dataset.monde = id;
      if (apres) apres();
      return;
    }
    clearTimeout(transitTimer);
    app.dataset.transit = '1';
    snd('crack');
    /* a 380 ms le rideau couvre tout l'ecran : c'est la que le monde change */
    setTimeout(function () {
      app.dataset.monde = id;
      if (apres) apres();
    }, 380);
    transitTimer = setTimeout(function () { app.dataset.transit = '0'; }, 1200);
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
    /* une nouvelle version attendait la fin de la partie */
    if (S.rechargeEnAttente) { location.reload(); return; }
    paint('#140A26');
    app.dataset.monde = 'plaine';
    app.dataset.transit = '0';
    S.screen = 'home'; S.phase = 'dusk';
    S.sel = null; S.locked = false; S.fx = null; S.questions = []; S.confirmBack = false;
    clearMini();
    render();
  }

  function toQuizzes() {
    snd('sel');
    S.confirmBack = false;
    clearMini();
    paint('#4E2AA8');            /* la barre du navigateur revient au ciel des plaines */
    transitionMonde('plaine', function () { S.screen = 'quizzes'; render(); });
    if (rm) render();
  }

  function toLevels() {
    snd('sel');
    S.screen = 'levels'; S.confirmBack = false;
    clearMini(); render();
  }

  function pickQuiz(i) {
    snd('sel');
    S.qz = i;
    paint(mondeDe(i).ciel);
    transitionMonde(mondeDe(i).id, function () { S.screen = 'levels'; render(); });
    if (rm) render();
  }

  /* le meilleur score par quiz et par niveau : l'annonce du defi le rappelle */
  function cleBest() {
    return 'mcq2026-best-' + (S.data ? S.data.quiz[S.qz].id : S.qz) + '-' + S.lv;
  }
  function lisBest() {
    try { return parseInt(localStorage.getItem(cleBest()) || '-1', 10); } catch (e) { return -1; }
  }
  function ecrisBest(score) {
    if (score > lisBest()) { try { localStorage.setItem(cleBest(), String(score)); } catch (e) {} }
  }

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
    var order = shuf(bag), taken = {}, seenText = {}, picked = [];
    for (var i = 0; i < order.length && picked.length < n; i++) {
      var cand = pool[order[i]];
      /* jamais deux fois la meme question dans une partie, meme si elle existe
         a deux niveaux differents */
      if (taken[order[i]] || seenText[cand.q.q]) continue;
      taken[order[i]] = 1;
      seenText[cand.q.q] = 1;
      picked.push(cand);
    }

    /* directeur de partie : au moins une epreuve jouable si le vivier le permet,
       et jamais deux fois le meme moteur a la suite */
    picked.forEach(function (p) { p.route = routeOf(p.q); });
    picked = spreadEngines(ensureVariety(picked, pool, lv));

    var qs = picked.map(function (p) {
      var q = p.q, r = q.r, ok = q.ok;
      var idx = shuf(q.r.map(function (_, k) { return k; }));
      r = idx.map(function (k) { return q.r[k]; });
      ok = idx.indexOf(q.ok);
      return { q: q.q, r: r, ok: ok, explication: q.explication, m: p.route, li: p.li };
    });
    try { localStorage.setItem(key, JSON.stringify(qs.map(function (x) { return x.q; }))); } catch (e) {}

    /* on ne demarre plus dans le dos du joueur : l'annonce du defi s'affiche
       d'abord, la partie ne part qu'au bouton */
    S.lv = lv; S.screen = 'brief'; S.questions = qs; S.qi = 0;
    S.sel = null; S.locked = false; S.wasOk = null; S.results = []; S.fx = null;
    S.openRecap = null; S.combo = 0; S.bestCombo = 0; S.chaos = 0; S.bonus = 0;
    S.usedOk = []; S.usedKo = []; S.copied = false;
    S.echo = null; S.inEcho = false; S.echoQ = null;
    S.gains = [];
    /* trois interludes par partie, repartis et jamais colles */
    S.flashAt = [2 + Math.floor(Math.random() * 2),
                 5 + Math.floor(Math.random() * 2),
                 8 + Math.floor(Math.random() * 2)];
    S.flashVus = [];
    clearMini();
    setupEngines(qs[0]);
    render();
  }

  /* le bouton de l'annonce : c'est lui qui ouvre vraiment la partie */
  function lancePartie() {
    if (S.screen !== 'brief') return;
    snd('win');
    S.screen = 'q';
    render();
  }

  function select(i) {
    if (S.locked) return;
    var q = curQ();
    snd('sel');
    S.sel = i;
    if (q && q.m === 'slider') { render(); return; }
    if (q && q.m === 'moteur' && S.moteur && S.moteur.def.confirme) { render(); return; }
    validate(false, i);
  }

  /* label prefere pour la question en cours : d'abord le moteur, puis le sujet */
  function fxPreferred(ok, q) {
    if (!q) return null;
    if (ok && q.m === 'craft') return 'CRAFT OK';
    if (ok && q.m === 'forge') return 'IMPECCABLE';
    var hay = q.q + ' ' + (q.r ? q.r[q.ok] : '');
    var table = ok ? FX_THEME_OK : FX_THEME_KO;
    for (var i = 0; i < table.length; i++) if (table[i][0].test(hay)) return table[i][1];
    return null;
  }

  function makeFx(ok, q) {
    var F = ok ? FXOK : FXKO;
    var key = ok ? 'usedOk' : 'usedKo';
    var used = S[key] || [];
    if (used.length >= F.length) used = [];
    var k = -1;
    var want = fxPreferred(ok, q);
    if (want) {
      for (var w = 0; w < F.length; w++) if (F[w][4] === want && used.indexOf(w) < 0) { k = w; break; }
    }
    if (k < 0) {
      k = Math.floor(Math.random() * F.length);
      var guard = 0;
      while (used.indexOf(k) >= 0 && guard < 80) { k = Math.floor(Math.random() * F.length); guard++; }
    }
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
    var q = curQ();
    if (!q) return;

    var ok;
    if (q.m === 'craft') {
      if (!S.craft || craftCount() === 0) return;         /* rien pose : on ne valide pas */
      ok = craftIsOk();
    } else if (q.m === 'forge') {
      if (!S.forge || S.forge.total === 0) return;
      ok = S.forge.total === S.forge.target;
    } else if (q.m === 'moteur') {
      if (S.sel === null && !timeout) return;
      ok = !timeout && S.sel === q.ok;
      q.pick = S.sel;
    } else {
      var pick = (forced === undefined || forced === null) ? S.sel : forced;
      if (pick === null && !timeout) return;
      ok = !timeout && pick === q.ok;
      S.sel = pick;
      q.pick = pick;             /* garde en memoire pour le duel du rattrapage */
    }

    snd(ok ? 'ok' : 'ko');
    S.locked = true;
    S.wasOk = ok;
    S.fx = makeFx(ok, q);

    if (S.inEcho) {
      /* le rattrapage ne touche pas au score des douze epreuves */
      if (q.m === 'blocks' && !rm) startFallWindow();
      S.echo.ok = ok;
      S.live = ok ? 'Rattrapage réussi' : 'Toujours incorrect';
      render();
      return;
    }

    if (q.m === 'blocks' && !rm) startFallWindow();

    if (ok) vitrineAjoute(q);

    S.results = S.results.concat([ok]);
    S.combo = ok ? S.combo + 1 : 0;
    S.bestCombo = Math.max(S.bestCombo || 0, S.combo);
    S.live = ok ? 'Correct' : 'Incorrect, la bonne réponse était ' + q.r[q.ok];

    /* ECHO : une seule question ratee revient plus tard, autrement posee */
    if (!ok && !S.echo) {
      var at = S.qi + 4;
      S.echo = { qIndex: S.qi, q: q, at: Math.min(at, S.questions.length), phase: 'pending', ok: null };
    }
    render();
  }

  /* ===================== ECHO =====================
     La question ratee revient une fois, ~4 epreuves plus tard. Si elle etait un
     QCM, elle revient en duel entre sa reponse et la bonne : c'est un autre
     geste, pas la meme question reposee a l'identique. */
  function startEcho(resumeIndex) {
    stopFallWindow();
    var src = S.echo.q;
    var eq;
    if (src.m === 'blocks') {
      var mine = (typeof src.pick === 'number' && src.pick !== src.ok) ? src.pick : null;
      var wrong = mine !== null ? mine : (src.ok === 0 ? 1 : 0);
      var pair = shuf([src.ok, wrong]);
      eq = {
        q: src.q,
        r: pair.map(function (i) { return src.r[i]; }),
        ok: pair.indexOf(src.ok),
        explication: src.explication,
        m: 'blocks'
      };
    } else {
      eq = { q: src.q, r: src.r, ok: src.ok, explication: src.explication, m: src.m };
    }
    S.echoQ = eq;
    S.inEcho = true;
    S.echo.phase = 'active';
    S.echo.resume = resumeIndex;
    S.sel = null; S.locked = false; S.wasOk = null; S.fx = null; S.live = '';
    setupEngines(eq);
    snd('alarm');
    render();
  }

  function finishEcho() {
    var resume = S.echo.resume;
    S.echo.phase = 'done';
    S.inEcho = false;
    S.echoQ = null;
    if (resume >= S.questions.length) {
      S.screen = 'result'; S.copied = false; S.openRecap = null;
      S.locked = false; S.fx = null;
      ecrisBest(S.results.filter(Boolean).length);
      snd('win'); render();
      return;
    }
    gotoQuestion(resume);
  }

  /* reprend la partie sur l'epreuve demandee (sortie de rattrapage) */
  function gotoQuestion(nq) {
    stopFallWindow();
    S.qi = nq; S.sel = null; S.locked = false; S.wasOk = null; S.fx = null; S.live = '';
    clearMini();
    setupEngines(S.questions[nq]);
    render();
    if (!rm && (S.flashAt || []).indexOf(nq) >= 0) openFlash();
  }

  function next() {
    if (!S.locked) return;
    if (S.inEcho) { finishEcho(); return; }

    var nq = S.qi + 1;

    if (S.echo && S.echo.phase === 'pending' && nq >= S.echo.at) {
      startEcho(nq);
      return;
    }
    if (nq >= S.questions.length) {
      stopFallWindow();
      S.screen = 'result'; S.copied = false; S.openRecap = null;
      ecrisBest(S.results.filter(Boolean).length);
      snd('win'); render();
      return;
    }
    stopFallWindow();
    S.qi = nq; S.sel = null; S.locked = false; S.wasOk = null; S.fx = null; S.live = '';
    clearMini();
    setupEngines(S.questions[nq]);
    render();
    if (!rm && (S.flashAt || []).indexOf(nq) >= 0) openFlash();
  }

  /* ------------------------------ mini-jeux ------------------------------ */
  function clearMini() {
    arreteFlash();
    if (miniTimer) { clearTimeout(miniTimer); miniTimer = null; }
    if (flashTick) { clearInterval(flashTick); flashTick = null; }
    S.mini = null;
  }

  /* la liste complete : les deux jeux d'origine plus le registre externe */
  function flashCatalogue() {
    var out = [{ id: 'bricks' }, { id: 'melt' }];
    (window.QUIZ_FLASH || []).forEach(function (f) { out.push(f); });
    return out;
  }

  function openFlash() {
    var cat = flashCatalogue();
    var vus = S.flashVus || [];
    var libres = cat.filter(function (f) { return vus.indexOf(f.id) < 0; });
    if (!libres.length) libres = cat;
    var def = libres[Math.floor(Math.random() * libres.length)];
    S.flashVus = vus.concat([def.id]);

    var id = Date.now();
    snd('alarm');

    if (def.id === 'bricks' || def.id === 'melt') {
      var sh = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      S.mini = { id: id, kind: def.id, shape: sh, hit: [], bad: 0, taps: 0, need: 6, done: false, won: false };
      render();
      miniTimer = setTimeout(function () {
        var m = S.mini;
        if (m && m.id === id && !m.done) { snd('ko'); m.done = true; m.won = false; render(); }
      }, def.id === 'bricks' ? 11000 : 7000);
      return;
    }

    /* jeu du registre : la zone generique se construit une fois, puis un
       battement de 60 ms anime la scene sans repeindre tout l'ecran.
       Les jeux a capteurs se declarent "differe" : ils affichent d'abord un
       bouton (le seul moment ou iOS accepte de donner l'acces aux capteurs) et
       ne demarrent le chronometre qu'en appelant api.lance(). */
    S.mini = { id: id, kind: 'zone', def: def, done: false, won: false, msg: '',
               built: false, lance: !def.differe };
    render();
    var t0 = def.differe ? 0 : Date.now();
    flashTick = setInterval(function () {
      var m = S.mini;
      if (!m || m.id !== id || m.done || !t0) return;
      var t = Date.now() - t0;
      try { def.tick(el.miniZone, flashApi(m), t); } catch (e) {}
      if (t >= def.duree) {
        var api = flashApi(m);
        if (def.timeout) def.timeout(api); else api.lose('Trop tard !');
      }
    }, 60);
    S.mini.demarrer = function () {
      if (t0) return;
      t0 = Date.now();
      S.mini.lance = true;
      render();
    };
  }

  /* un jeu qui a branche des ecouteurs (capteurs) doit pouvoir les debrancher */
  function arreteFlash() {
    var m = S.mini;
    if (m && m.kind === 'zone' && m.built && m.def && m.def.stop) {
      try { m.def.stop(el.miniZone); } catch (e) {}
    }
  }

  /* la petite API remise a chaque jeu : il ne connait rien d'autre du jeu */
  function flashApi(m) {
    return {
      zone: el.miniZone,
      rm: rm,
      snd: snd,
      item: itemSvg,
      mob: mobSvg,
      lance: function () { if (m.demarrer) m.demarrer(); },
      win: function () { finFlash(m, true, ''); },
      lose: function (msg) { finFlash(m, false, msg || ''); }
    };
  }

  function finFlash(m, won, msg) {
    if (!m || m.done) return;
    arreteFlash();
    m.done = true; m.won = won; m.msg = msg;
    clearInterval(flashTick); flashTick = null;
    render();
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
  var lastLocked = false;
  var fallTimer = null;

  /* la chute des mauvaises reponses dure au plus 900ms + 330ms de decalage */
  function startFallWindow() {
    clearTimeout(fallTimer);
    S.falling = true;
    fallTimer = setTimeout(function () {
      S.falling = false;
      render();
      revealExplanation();
    }, 1300);
  }

  function stopFallWindow() {
    clearTimeout(fallTimer);
    fallTimer = null;
    S.falling = false;
  }

  /* sur un petit ecran l'explication tombe sous la ligne de flottaison :
     on l'amene a l'ecran au moment ou elle apparait */
  function revealExplanation() {
    if (!el.expl || el.expl.hidden) return;
    try {
      el.expl.scrollIntoView({ block: 'nearest', behavior: rm ? 'auto' : 'smooth' });
    } catch (e) {
      el.expl.scrollIntoView(false);
    }
  }

  function render() {
    app.dataset.screen = S.screen;
    app.dataset.phase = S.phase;

    var day = S.phase !== 'dusk';
    var total = S.questions.length;
    var totalQ = total || NB_QUESTIONS;
    var score = S.results.filter(Boolean).length;
    var q = curQ();
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
    majCompteur();
    el.btnMusique.setAttribute('aria-pressed', S.musique ? 'true' : 'false');
    el.btnMusique.setAttribute('aria-label', S.musique ? 'Couper la musique' : 'Remettre la musique');
    el.btnSound.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
    el.btnSound.setAttribute('aria-label', S.sound ? 'Couper le son' : 'Remettre le son');

    /* --- niveaux --- */
    el.levelsTitle.textContent = quizName();
    var pools = document.querySelectorAll('[data-pool]');
    for (var pi = 0; pi < pools.length; pi++) pools[pi].textContent = NB_QUESTIONS + ' ÉPREUVES TIRÉES DE 36';

    /* --- annonce du defi --- */
    if (S.screen === 'brief') {
      var mo = mondeDe(S.qz);
      if (el.briefIco.dataset.qz !== String(S.qz)) {
        el.briefIco.dataset.qz = String(S.qz);
        var ico = document.querySelector('[data-quiz="' + S.qz + '"] .card-ico');
        el.briefIco.innerHTML = ico ? ico.innerHTML : '';
      }
      el.briefMonde.textContent = 'MONDE · ' + mo.nom;
      el.briefQuiz.textContent = quizName();
      el.briefNiveau.textContent = 'NIVEAU ' + levelName().toUpperCase();
      el.briefNb.textContent = String(S.questions.length);
      el.briefFlash.textContent = rm ? 'AUCUNE' : String((S.flashAt || []).length);
      var best = lisBest();
      el.briefBest.textContent = best >= 0 ? best + ' / ' + S.questions.length : 'AUCUN';
      el.briefMot.textContent = mo.mot;
    }

    /* --- question --- */
    if (S.screen === 'q') {
      el.hudLabel.textContent = quizName() + ' · ' + levelName();
      el.echoBadge.hidden = !S.inEcho;
      el.combo.hidden = S.inEcho || (S.combo || 0) < 2;
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
        } else if (t === S.qi && !S.inEcho) {
          cell.style.cssText = 'background-color:rgba(255,193,69,.45);box-shadow:inset 0 0 0 3px #FFC145';
        }
        /* une epreuve rattrapee garde sa marque d'echec, avec le liseré du rattrapage */
        cell.classList.toggle('is-repaired',
          !!(S.echo && S.echo.phase === 'done' && S.echo.ok && t === S.echo.qIndex));
      }

      var answered = S.qi + (S.locked ? 1 : 0);
      el.counter.textContent = S.inEcho
        ? 'ÉCHO'
        : Math.min(answered + (S.locked ? 0 : 1), total || 1) + '/' + totalQ;
      el.consigne.textContent = q ? consigneFor(q, mode) : '';
      el.qText.textContent = q ? q.q : '';

      el.playfield.classList.toggle('is-falling', !!S.falling);

      /* une seule aire de jeu visible a la fois */
      el.depth.hidden = mode !== 'slider';
      el.craft.hidden = mode !== 'craft';
      el.forge.hidden = mode !== 'forge';
      el.scene.hidden = mode !== 'scene';
      el.moteur.hidden = mode !== 'moteur';
      el.answers.hidden = mode !== 'blocks';

      if (mode === 'craft') { buildCraft(q); lastQSig = ''; }
      else if (mode === 'forge') { buildForge(q); lastQSig = ''; }
      else {
        var sig = [S.qi, S.inEcho ? 'E' : '', S.locked ? 1 : 0, S.sel, mode].join('|');
        if (sig !== lastQSig) {
          lastQSig = sig;
          if (mode === 'slider') { buildBands(q); el.answers.textContent = ''; }
          else if (mode === 'scene') { buildScene(q); el.answers.textContent = ''; }
          else if (mode === 'moteur') { buildMoteur(q); el.answers.textContent = ''; }
          else { buildAnswers(q); el.depth.textContent = ''; }
        }
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
        var last = S.qi + 1 >= total && !(S.echo && S.echo.phase === 'pending');
        el.btnCta.textContent = S.inEcho ? 'ON REPART ›' : (last ? 'VOIR LE SCORE' : 'SUIVANT ›');
        el.btnCta.classList.add('is-next');
      } else if (mode === 'craft') {
        if (craftCount() === 0) el.btnCta.textContent = 'POSE LES INGRÉDIENTS';
        else { el.btnCta.textContent = 'VALIDER LA RECETTE'; el.btnCta.classList.add('is-ready'); }
      } else if (mode === 'forge') {
        if (!S.forge || S.forge.total === 0) el.btnCta.textContent = 'COMPOSE LA VALEUR';
        else { el.btnCta.textContent = 'VALIDER LA VALEUR'; el.btnCta.classList.add('is-ready'); }
      } else if (mode === 'moteur' && S.moteur) {
        var lbl = 'VALIDER';
        try { lbl = S.moteur.def.cta(S.moteur.spec, { sel: S.sel, locked: S.locked }); } catch (e) {}
        el.btnCta.textContent = lbl;
        if (S.sel !== null) el.btnCta.classList.add('is-ready');
      } else if (mode === 'scene') {
        var sps = sceneSpec(q);
        el.btnCta.textContent = (sps && sps.creatures) ? 'TOUCHE LA CRÉATURE' : "TOUCHE L'OBJET";
      } else if (mode === 'slider') {
        if (S.sel === null) el.btnCta.textContent = 'PLACE LE CURSEUR';
        else { el.btnCta.textContent = 'VALIDER'; el.btnCta.classList.add('is-ready'); }
      } else if (S.inEcho) {
        el.btnCta.textContent = 'CHOISIS TA RÉPONSE';
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
      var gains = S.gains || [];
      el.neuf.hidden = !gains.length;
      if (gains.length) {
        el.neufListe.textContent = '';
        gains.forEach(function (cle, i) {
          var sp = document.createElement('span');
          sp.title = nomDe(cle);
          sp.style.animationDelay = Math.min(600, i * 70) + 'ms';
          sp.innerHTML = dessinDe(cle);
          el.neufListe.appendChild(sp);
        });
      }
      buildRecap();
    }

    renderMini();
    el.overlayConfirm.hidden = !S.confirmBack;
    el.live.textContent = S.live || '';

    if (S.screen === 'q' && S.locked && !lastLocked && !S.falling) setTimeout(revealExplanation, 340);
    lastLocked = S.screen === 'q' && S.locked;
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
        if (rm) {
          b.style.opacity = '.25';
        } else {
          b.style.animation = 'fallOut 900ms cubic-bezier(.4,0,.8,1) ' + (i * 70 + 120) + 'ms both';
          b.addEventListener('animationend', function () {
            b.style.animation = 'none';
            b.style.transform = 'none';
            b.style.opacity = '0';
          }, { once: true });
        }
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

  /* --- ATELIER : grille 3x3 + dock d'ingredients (tap-tap, pas de glisser) --- */
  function buildCraft(q) {
    var C = S.craft;
    if (!C) return;
    el.craft.classList.toggle('is-locked', S.locked);

    var ok = S.locked && S.wasOk;
    el.craftOut.classList.toggle('is-done', !!ok);
    el.craftOutSlot.innerHTML = ok ? itemSvg(C.result.art, 34) : '';
    el.craftOutName.textContent = ok ? C.result.name + ' — CRAFTÉ' : 'RÉSULTAT';

    /* la grille : ses ingredients, ou la recette exacte apres un echec */
    var showFix = S.locked && !S.wasOk;
    var fix = [];
    if (showFix) C.need.forEach(function (x) { for (var i = 0; i < x.n; i++) fix.push(x.id); });

    el.craftGrid.textContent = '';
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      var id = showFix ? (fix[i] || null) : C.placed[i];
      if (id) {
        cell.classList.add('is-filled');
        cell.innerHTML = itemSvg(id, 30);
        cell.setAttribute('aria-label', itemName(id));
      } else {
        cell.setAttribute('aria-label', 'case vide');
      }
      if (showFix && id) cell.classList.add('is-ghost');
      if (S.locked && !showFix && ok) cell.classList.add('is-ghost');
      (function (k) {
        cell.addEventListener('click', function () { tapCell(k); });
      })(i);
      el.craftGrid.appendChild(cell);
    }

    el.craftHint.textContent = showFix
      ? 'LA BONNE RECETTE'
      : (S.locked ? 'RECETTE VALIDÉE' : 'TOUCHE UN INGRÉDIENT PUIS UNE CASE');

    el.craftDock.textContent = '';
    C.dock.forEach(function (id) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ing' + (C.armed === id ? ' is-armed' : '');
      b.setAttribute('aria-label', itemName(id));
      b.setAttribute('aria-pressed', C.armed === id ? 'true' : 'false');
      b.innerHTML = itemSvg(id, 28) + '<span class="ing-name">' + itemName(id) + '</span>';
      b.addEventListener('click', function () {
        if (S.locked) return;
        C.armed = id;
        snd('sel');
        render();
      });
      el.craftDock.appendChild(b);
    });
  }

  function tapCell(i) {
    var C = S.craft;
    if (!C || S.locked) return;
    if (C.placed[i]) { C.placed[i] = null; snd('crack'); }
    else if (C.armed) { C.placed[i] = C.armed; snd('sel'); }
    render();
  }

  /* --- FORGE : composer la valeur, aucune cible affichee avant validation --- */
  function buildForge(q) {
    var F = S.forge;
    if (!F) return;
    el.forge.classList.toggle('is-locked', S.locked);

    el.forgeTotal.textContent = String(F.total);
    el.forgeUnit.textContent = F.unit;
    var head = el.forgeTotal.parentNode;
    head.classList.toggle('is-ok', !!(S.locked && S.wasOk));
    head.classList.toggle('is-ko', !!(S.locked && !S.wasOk));

    var pct = F.target ? Math.min(100, Math.round(F.total / F.target * 100)) : 0;
    el.forgeFill.style.width = (S.locked && !S.wasOk ? 100 : pct) + '%';

    el.forgeVerdict.hidden = !S.locked;
    if (S.locked) {
      el.forgeVerdict.textContent = S.wasOk
        ? 'Exactement ' + F.target + (F.unit ? ' ' + F.unit : '') + '.'
        : 'Tu as posé ' + F.total + ' — il en fallait ' + F.target + '.';
    }

    el.forgeChips.textContent = '';
    F.chips.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = '+' + v;
      b.setAttribute('aria-label', 'ajouter ' + v);
      b.addEventListener('click', function () {
        if (S.locked) return;
        if (F.total + v > 1000) return;
        F.total += v; F.stack.push(v);
        snd('sel');
        render();
      });
      el.forgeChips.appendChild(b);
    });
    el.forgeReset.textContent = F.stack.length ? 'TOUT ENLEVER' : 'RIEN À ENLEVER';
  }

  /* --- LA SCENE : quatre creatures dans le noir, aucune etiquette ---
     Les noms n'apparaissent qu'apres la reponse : sinon ce serait un QCM avec
     des images, et l'enfant n'aurait rien reconnu du tout. */
  /* le moteur est un simple dessin de (question, choix, verrouillage) : on le
     reconstruit a chaque changement, comme la scene, et il n'a aucun etat */
  function buildMoteur(q) {
    var m = S.moteur;
    el.moteur.textContent = '';
    if (!m) { q.m = 'blocks'; buildAnswers(q); return; }
    el.moteur.className = 'moteur mot-' + m.def.id;
    el.moteur.classList.toggle('is-locked', S.locked);
    var api = {
      item: itemSvg, mob: mobSvg, rm: rm, snd: snd,
      choisir: function (i) { select(i); }
    };
    try { m.def.build(el.moteur, q, m.spec, { sel: S.sel, locked: S.locked, ok: S.wasOk }, api); }
    catch (e) { q.m = 'blocks'; buildAnswers(q); }
  }

  function buildScene(q) {
    el.scene.textContent = '';
    if (!q) return;
    var spec = sceneSpec(q);
    if (!spec) { q.m = 'blocks'; buildAnswers(q); return; }
    el.scene.dataset.lieu = spec.lieu;
    el.scene.classList.toggle('is-locked', S.locked);

    q.r.forEach(function (txt, i) {
      var isOk = i === q.ok;
      var mine = S.sel === i;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'crea';
      b.setAttribute('aria-label', S.locked ? txt : 'créature ' + (i + 1));
      if (S.locked) {
        if (isOk) b.classList.add('is-ok');
        else if (mine) b.classList.add('is-ko');
        else b.classList.add('is-dim');
      }
      if (!rm) b.style.animation = 'floatIn 260ms ease-out ' + (i * 70) + 'ms both';
      var a = spec.arts[i];
      var dessin = a.kind === 'mob' ? mobSvg(a.id, 72) : itemSvg(a.id, 66);
      b.innerHTML = '<span class="crea-art">' + dessin + '</span>' +
        '<span class="crea-nom">' + (S.locked ? txt : '?') + '</span>' +
        '<span class="crea-mark">' + (S.locked ? (isOk ? '✓' : (mine ? '✗' : '')) : '') + '</span>';
      b.addEventListener('click', function () { select(i); });
      el.scene.appendChild(b);
    });
  }

  function buildRecap() {
    el.recap.textContent = '';
    S.results.forEach(function (ok, i) {
      var qq = S.questions[i];
      var open = S.openRecap === i;
      var fixed = !!(S.echo && S.echo.phase === 'done' && S.echo.ok && S.echo.qIndex === i);
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'recap-row' + (open ? ' is-open' : '');
      if (!rm) row.style.animation = 'floatIn 220ms ease-out ' + Math.min(560, 40 * i) + 'ms both';
      row.innerHTML =
        '<span class="recap-line">' +
        '<span class="recap-chip" style="background-color:' + (ok ? '#4CD137' : '#FF4B4B') + '"></span>' +
        '<span class="recap-num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="recap-q"></span>' +
        (fixed ? '<span class="recap-fixed">RATTRAPÉ</span>' : '') +
        '</span>' +
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
    if (!m) {
      el.miniPanel.dataset.melting = '0';
      if (el.miniZone) { el.miniZone.hidden = true; el.miniZone.textContent = ''; }
      return;
    }

    /* --- jeux du registre --- */
    if (m.kind === 'zone') {
      var d = m.def;
      el.miniBricks.hidden = true;
      el.miniMelt.hidden = true;
      el.miniPanel.dataset.melting = '0';
      el.miniZone.hidden = false;
      el.miniBadge.textContent = m.done ? 'FINI' : Math.round(d.duree / 1000) + ' SEC';
      el.miniTitle.textContent = m.done ? (m.won ? 'BIEN JOUÉ !' : 'RATÉ !') : d.titre;
      el.miniSub.textContent = m.done
        ? (m.won ? 'Bonus empoché. La question t’attend.' : (m.msg || 'Pas grave, ça ne coûte aucun point.'))
        : d.sub;
      if (m.done) { el.miniTime.style.animation = ''; el.miniTime.style.width = '0%'; }
      else if (!m.lance) { el.miniTime.style.animation = ''; el.miniTime.style.width = '100%'; }
      else if (el.miniTime.dataset.id !== String(m.id)) {
        el.miniTime.dataset.id = String(m.id);
        el.miniTime.style.width = '100%';
        el.miniTime.style.animation = 'timeBar ' + d.duree + 'ms linear both';
      }
      if (!m.built) {
        m.built = true;
        el.miniZone.textContent = '';
        /* prefixe distinct de fz- : un identifiant de jeu ne doit jamais
           tomber sur une classe d'element (fz-lave, la coulee, ecrasait la
           zone entiere du jeu de la lave et la reduisait a zero pixel) */
        el.miniZone.className = 'mini-zone jeu-' + d.id;
        try { d.build(el.miniZone, flashApi(m)); } catch (e) {}
      }
      el.miniZone.classList.toggle('is-done', !!m.done);
      el.btnMiniNext.hidden = !m.done;
      el.btnMiniNext.textContent = m.won ? 'BONUS ENCAISSÉ ›' : 'ON CONTINUE ›';
      return;
    }

    if (el.miniZone) { el.miniZone.hidden = true; el.miniZone.textContent = ''; }
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

  /* ===================== LA VITRINE =====================
     Une bonne reponse debloque l'objet ou la creature dont il vient d'etre
     question. La collection reste sur le telephone : ce sont les cases encore
     noires qui donnent envie de relancer une partie. */
  var VIT_KEY = 'mcq2026-vitrine';

  function vitrineLue() {
    try { return JSON.parse(localStorage.getItem(VIT_KEY) || '[]'); } catch (e) { return []; }
  }

  function vitrineEcrite(liste) {
    try { localStorage.setItem(VIT_KEY, JSON.stringify(liste)); } catch (e) {}
  }

  /* ce que la question fait gagner : le resultat d'un craft, la creature ou
     l'objet reconnu, sinon l'objet cite par la bonne reponse */
  function gainDe(q) {
    if (!q) return null;
    if (q.m === 'craft') {
      var cs = craftSpec(q);
      if (cs && cs.result && cs.result.art) return 'item:' + cs.result.art;
    }
    var sp = sceneSpec(q);
    if (sp) { var a = sp.arts[q.ok]; return a.kind + ':' + a.id; }
    var trouve = sceneArt(q.r[q.ok]);
    return trouve ? trouve.kind + ':' + trouve.id : null;
  }

  function vitrineAjoute(q) {
    var g = gainDe(q);
    if (!g) return;
    var liste = vitrineLue();
    if (liste.indexOf(g) >= 0) return;
    liste.push(g);
    vitrineEcrite(liste);
    S.gains = (S.gains || []).concat([g]);
  }

  function dessinDe(cle) {
    var parts = cle.split(':');
    return parts[0] === 'mob' ? mobSvg(parts[1], 40) : itemSvg(parts[1], 40);
  }

  function nomDe(cle) {
    var parts = cle.split(':');
    if (parts[0] === 'mob') return parts[1];
    return itemName(parts[1]);
  }

  function ouvrirVitrine() {
    var possede = vitrineLue();
    var lots = [
      ['CRÉATURES', Object.keys(MOB_ART).map(function (k) { return 'mob:' + k; })],
      ['OBJETS ET BLOCS', Object.keys((window.QUIZ_GAMEPLAY && window.QUIZ_GAMEPLAY.items) || {})
        .map(function (k) { return 'item:' + k; })]
    ];
    el.vitrineCorps.textContent = '';
    var total = 0, eus = 0;
    lots.forEach(function (lot) {
      var t = document.createElement('p');
      t.className = 'vitrine-lot-titre';
      var grille = document.createElement('div');
      grille.className = 'vitrine-grille';
      lot[1].forEach(function (cle) {
        total++;
        var ok = possede.indexOf(cle) >= 0;
        if (ok) eus++;
        var c = document.createElement('span');
        c.className = 'vit' + (ok ? '' : ' is-locked') + ((S.gains || []).indexOf(cle) >= 0 ? ' is-new' : '');
        c.title = ok ? nomDe(cle) : '?';
        c.setAttribute('aria-label', ok ? nomDe(cle) : 'pas encore trouvé');
        c.innerHTML = dessinDe(cle);
        grille.appendChild(c);
      });
      t.textContent = lot[0] + ' — ' + lot[1].filter(function (c) { return possede.indexOf(c) >= 0; }).length +
        ' / ' + lot[1].length;
      el.vitrineCorps.appendChild(t);
      el.vitrineCorps.appendChild(grille);
    });
    el.vitrineCompte.textContent = eus + ' / ' + total;
    el.overlayVitrine.hidden = false;
  }

  function majCompteur() {
    var n = vitrineLue().length;
    el.collCount.textContent = String(n);
    el.btnCollection.setAttribute('aria-label', 'Ma collection, ' + n + ' trouvés');
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
      if (to === 'home') toHome();
      else if (to === 'levels') toLevels();
      else toQuizzes();
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
  el.btnGo.addEventListener('click', lancePartie);
  el.btnCta.addEventListener('click', function () { if (S.locked) next(); else validate(false); });
  el.btnShare.addEventListener('click', share);
  el.btnReplay.addEventListener('click', function () {
    S.screen = 'levels'; S.fx = null; S.locked = false; S.sel = null; render();
  });
  el.forgeReset.addEventListener('click', function () {
    if (!S.forge || S.locked) return;
    S.forge.total = 0; S.forge.stack = [];
    snd('crack');
    render();
  });
  el.btnMusique.addEventListener('click', function () {
    S.musique = !S.musique;
    try { localStorage.setItem('mcq2026-musique', S.musique ? '1' : '0'); } catch (e) {}
    if (S.musique) { reveilAudio(); demarreMusique(); } else { arreteMusique(); }
    snd('sel');
    render();
  });
  el.btnCollection.addEventListener('click', function () { snd('sel'); ouvrirVitrine(); });
  $('btnVitrineClose').addEventListener('click', function () { el.overlayVitrine.hidden = true; });
  el.btnStab.addEventListener('click', tapStab);
  el.btnMiniNext.addEventListener('click', miniOut);

  window.addEventListener('keydown', function (e) {
    if (S.screen === 'home' && (e.key === 'Enter' || e.key === ' ')) { start(); return; }
    if (S.screen === 'brief' && (e.key === 'Enter' || e.key === ' ')) { lancePartie(); return; }
    if (S.screen === 'q') {
      if (S.mini) return;
      var cm = curQ() ? curQ().m : 'blocks';
      if (!S.locked && (cm === 'blocks' || cm === 'slider') && e.key >= '1' && e.key <= '4') {
        select(parseInt(e.key, 10) - 1); return;
      }
      if (e.key === 'Enter') { if (S.locked) next(); else validate(false); return; }
      if (e.key === 'Escape') { S.confirmBack = true; render(); return; }
    }
    if (e.key === 'Escape') {
      if (S.screen === 'brief') toLevels();
      else if (S.screen === 'levels') toQuizzes();
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
    var prefM = localStorage.getItem('mcq2026-musique');
    if (prefM !== null) S.musique = prefM === '1';
  } catch (e) {}

  /* le reveil de l'audio se fait au tout premier appui, ou qu'il tombe */
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      ['pointerdown', 'touchstart', 'keydown'].forEach(function (e2) {
        window.removeEventListener(e2, once);
      });
      reveilAudio();
    }, { passive: true });
  });

  /* on met la musique en veille quand le jeu passe en arriere-plan */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) arreteMusique();
    else if (S.musique && audioPret) demarreMusique();
  });

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

  /* service worker : le jeu reste jouable hors ligne une fois installe.
     Quand une nouvelle version prend la main, on recharge une fois tout seul :
     sans cela l'ecran garde l'ancien code jusqu'au chargement suivant, et on
     se retrouve avec des boutons qui ne repondent plus. */
  if ('serviceWorker' in navigator) {
    var avaitControleur = !!navigator.serviceWorker.controller;
    var dejaRecharge = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!avaitControleur || dejaRecharge) return;
      dejaRecharge = true;
      /* jamais en pleine partie : on attend le retour a l'accueil */
      if (S.screen === 'home') location.reload();
      else S.rechargeEnAttente = true;
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        if (reg && reg.update) { try { reg.update(); } catch (e) {} }
      }).catch(function () {});
    });
  }

  /* ------------------------------ demarrage ------------------------------ */
  paint('#140A26');
  render();
})();
