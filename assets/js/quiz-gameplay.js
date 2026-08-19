/* =============================================================================
   COUCHE GAMEPLAY — quelle epreuve pour quelle question
   -----------------------------------------------------------------------------
   quiz-data.js reste la source factuelle : on n'y touche pas. Ce fichier dit
   seulement COMMENT une question se joue, et il est verifie au chargement
   contre le texte de la bonne reponse (voir checkGameplay dans app.js) :
   si une reponse est modifiee dans la banque sans mettre a jour ce fichier,
   la question retombe automatiquement en mode BLOCS au lieu de mentir.

   Regles retenues (issues du test anti-faux-gameplay de la note SWAN) :
   - ATELIER seulement si la recette compte au moins 2 ingredients a poser ;
     un seul objet a choisir resterait un QCM deguise.
   - la grille fait toujours 3x3 : jamais le nombre de cases ne doit trahir
     la quantite attendue.
   - FORGE seulement si les quatre reponses d'origine sont des nombres de
     meme nature ; sinon composer une valeur n'aurait pas de sens.
   ============================================================================= */
(function () {
  'use strict';

  /* --- 1. ATELIER : la reponse est l'objet construit ------------------------ */
  /* `need` = ce qu'il faut poser (verifie contre la bonne reponse au chargement)
     `dock` = ce qu'on lui propose, intrus compris (tires des mauvaises reponses)
     `result` = l'objet qui sort de la grille                                   */
  var CRAFT = {
    'Que faut-il pour fabriquer une table de craft ?': {
      need: [{ id: 'planche', n: 4 }],
      dock: ['planche', 'buche'],
      result: { name: 'TABLE DE CRAFT', art: 'table' }
    },
    'Que faut-il pour fabriquer un lit ?': {
      need: [{ id: 'laine', n: 3 }, { id: 'planche', n: 3 }],
      dock: ['laine', 'planche'],
      result: { name: 'LIT', art: 'lit' }
    },
    'Que faut-il pour fabriquer une torche ?': {
      need: [{ id: 'baton', n: 1 }, { id: 'charbon', n: 1 }],
      dock: ['baton', 'charbon', 'planche'],
      result: { name: 'TORCHE', art: 'torche' }
    },
    'Que faut-il pour fabriquer une enclume ?': {
      need: [{ id: 'bloc-fer', n: 3 }, { id: 'lingot-fer', n: 4 }],
      dock: ['bloc-fer', 'lingot-fer'],
      result: { name: 'ENCLUME', art: 'enclume' }
    },
    'Que faut-il pour fabriquer une boussole ?': {
      need: [{ id: 'lingot-fer', n: 4 }, { id: 'redstone', n: 1 }],
      dock: ['lingot-fer', 'lingot-or', 'diamant', 'redstone'],
      result: { name: 'BOUSSOLE', art: 'boussole' }
    },
    'Comment fabrique-t-on un pissenlit doré ?': {
      need: [{ id: 'pepite-or', n: 8 }, { id: 'pissenlit', n: 1 }],
      dock: ['pepite-or', 'lingot-or', 'bloc-or', 'pissenlit'],
      result: { name: 'PISSENLIT DORÉ', art: 'pissenlit-dore' }
    },
    'Comment fabrique-t-on une lance ?': {
      need: [{ id: 'baton', n: 2 }, { id: 'lingot-fer', n: 1 }],
      dock: ['baton', 'lingot-fer', 'lingot-or'],
      result: { name: 'LANCE', art: 'lance' }
    },
    'Avec quoi peut-on désormais fabriquer une étiquette de nom ?': {
      need: [{ id: 'papier', n: 1 }, { id: 'pepite-or', n: 1 }],
      dock: ['papier', 'encre', 'cuir', 'pepite-or'],
      result: { name: 'ÉTIQUETTE', art: 'etiquette' }
    }
  };

  /* --- 2. FORGE : la reponse est une valeur composee ------------------------ */
  /* `unit` s'affiche a cote du total ; `chips` limite les briques proposees
     pour que la composition reste un vrai calcul et pas un empilement de 1.  */
  /* la banque n'utilise que l'apostrophe droite : les cles la reprennent telle quelle */
  var FORGE = {
    'Combien de planches obtient-on avec une bûche ?': { unit: '', chips: [10, 5, 1] },
    'Combien de cœurs a-t-on au début du jeu ?': { unit: 'cœurs', chips: [10, 5, 1] },
    'Combien de bâtons obtient-on avec 2 planches ?': { unit: '', chips: [10, 5, 1] },
    "Combien d'obsidienne faut-il au minimum pour un portail du Nether ?": { unit: 'blocs', chips: [10, 5, 1] },
    "Combien de niveaux d'expérience faut-il pour l'enchantement le plus fort d'une table ?": { unit: 'niveaux', chips: [20, 10, 5, 1] },
    "Sur combien de blocs un signal de redstone se propage-t-il avant de s'éteindre ?": { unit: 'blocs', chips: [10, 5, 1] },
    "Combien de pépites d'or faut-il pour un lingot ?": { unit: 'pépites', chips: [10, 5, 1] },
    "Combien d'emplacements contient une boîte de Shulker ?": { unit: 'slots', chips: [20, 10, 5, 1] },
    "Combien d'yeux de l'Ender faut-il au maximum pour activer le portail de l'End ?": { unit: 'yeux', chips: [10, 5, 1] },
    'Combien de points de dégâts inflige une épée en netherite sans enchantement ?': { unit: 'dégâts', chips: [10, 5, 1] },
    'Combien de points de vie a le Warden ?': { unit: 'PV', chips: [100, 50, 20, 10] },
    "Combien de points de vie a le Dragon de l'End ?": { unit: 'PV', chips: [100, 50, 20, 10] },
    'Combien de points de vie a un Ravageur ?': { unit: 'PV', chips: [100, 50, 20, 10] },
    "Combien de couleurs d'escaliers de béton ont été ajoutées ?": { unit: 'couleurs', chips: [10, 5, 1] },
    'Combien de temps dure un jour complet dans Minecraft ?': { unit: 'minutes', chips: [10, 5, 1] },
    'Combien de temps un objet posé au sol reste-t-il avant de disparaître ?': { unit: 'minutes', chips: [10, 5, 1] }
  };

  /* --- 3. Objets : un gabarit pixel par famille de matiere ----------------- */
  /* [gabarit, couleur principale, reflet, ombre, nom affiche] */
  var ITEMS = {
    /* --- nourriture, butin et objets de villageois : ils servent au moteur
       scene, qui demande de reconnaitre l'objet au lieu de lire son nom --- */
    'pomme':          ['pomme',   '#C4362B', '#E06A5F', '#8E2419', 'POMME'],
    'pomme-doree':    ['pomme',   '#C9962F', '#F2CE7B', '#A87C22', 'POMME DORÉE'],
    'carotte':        ['carotte', '#F2712C', '#FF9A5F', '#B4491A', 'CAROTTE'],
    'carotte-doree':  ['carotte', '#C9962F', '#F2CE7B', '#A87C22', 'CAROTTE DORÉE'],
    'ble':            ['ble',     '#B8973A', '#D6BC6E', '#8A7024', 'BLÉ'],
    'ble-dore':       ['ble',     '#C9962F', '#FFF0B8', '#A87C22', 'BLÉ DORÉ'],
    'graines':        ['graines', '#9AA84A', '#C4D07A', '#6E7A2A', 'GRAINES'],
    'pain':           ['pain',    '#C08A4A', '#E0B073', '#8E6224', 'PAIN'],
    'steak':          ['steak',   '#A8442A', '#C9705A', '#7A2A18', 'STEAK CUIT'],
    'os':             ['os',      '#E8E8E8', '#FFFFFF', '#BFBFBF', 'OS'],
    'livre':          ['livre',   '#8B5A2B', '#B37C46', '#5C3A1B', 'LIVRE'],
    'livre-enchante': ['livre',   '#6B3FA0', '#8F63C4', '#4A2A72', 'LIVRE ENCHANTÉ'],
    'potion':         ['potion',  '#C4362B', '#E06A5F', '#8E2419', 'POTION'],
    'carte':          ['carte',   '#D9C79A', '#F2E6C4', '#A8956A', 'CARTE'],
    'fleche':         ['fleche',  '#C4C4C4', '#E8E8E8', '#8F8F8F', 'FLÈCHE'],
    'totem':          ['totem',   '#C9962F', '#F2CE7B', '#4CD137', 'TOTEM D’IMMORTALITÉ'],
    'disque':         ['disque',  '#4CD137', '#8BE07C', '#2E8B26', 'DISQUE DE MUSIQUE'],
    'selle':          ['selle',   '#8B5A2B', '#B37C46', '#5C3A1B', 'SELLE'],
    'planche':     ['cube',   '#B0813F', '#D3A25C', '#8A6127', 'PLANCHE'],
    'buche':       ['log',    '#8B5A2B', '#B37C46', '#5C3A1B', 'BÛCHE'],
    'laine':       ['cube',   '#E8E8E8', '#FFFFFF', '#BFBFBF', 'LAINE'],
    'baton':       ['stick',  '#A9762F', '#C9974A', '#7A521C', 'BÂTON'],
    'charbon':     ['lump',   '#2A2A33', '#4A4A5A', '#151519', 'CHARBON'],
    'bloc-fer':    ['cube',   '#C4C4C4', '#E8E8E8', '#8F8F8F', 'BLOC DE FER'],
    'lingot-fer':  ['ingot',  '#C4C4C4', '#E8E8E8', '#8F8F8F', 'LINGOT DE FER'],
    'lingot-or':   ['ingot',  '#C9962F', '#F2CE7B', '#A87C22', "LINGOT D'OR"],
    'bloc-or':     ['cube',   '#C9962F', '#F2CE7B', '#A87C22', "BLOC D'OR"],
    'pepite-or':   ['nugget', '#E0A62E', '#FFE9A8', '#A87C22', 'PÉPITE'],
    'diamant':     ['gem',    '#3EC4BC', '#ADF5F0', '#2E9E97', 'DIAMANT'],
    'redstone':    ['lump',   '#C4362B', '#E06A5F', '#8E2419', 'REDSTONE'],
    'pissenlit':   ['flower', '#FFC145', '#FFE9A8', '#3B8526', 'PISSENLIT'],
    'papier':      ['sheet',  '#EDEDE3', '#FFFFFF', '#C4C4B8', 'PAPIER'],
    'encre':       ['lump',   '#1A1A28', '#3A3A50', '#0C0C14', 'ENCRE'],
    'cuir':        ['sheet',  '#9B6B3F', '#C08E5C', '#6E4522', 'CUIR'],
    /* objets fabriques */
    'table':          ['cube',   '#B0813F', '#D3A25C', '#6E4522', 'TABLE'],
    'lit':            ['bed',    '#C4362B', '#E06A5F', '#B0813F', 'LIT'],
    'torche':         ['torch',  '#A9762F', '#FFC145', '#FFE9A8', 'TORCHE'],
    'enclume':        ['anvil',  '#4A4A5A', '#6E6E7E', '#2A2A33', 'ENCLUME'],
    'boussole':       ['compass', '#C4C4C4', '#E8E8E8', '#C4362B', 'BOUSSOLE'],
    'pissenlit-dore': ['flower', '#FFE9A8', '#FFFFFF', '#C9962F', 'PISSENLIT DORÉ'],
    'lance':          ['spear',  '#A9762F', '#E8E8E8', '#7A521C', 'LANCE'],
    'etiquette':      ['sheet',  '#EDEDE3', '#FFFFFF', '#C9962F', 'ÉTIQUETTE'],
    /* outils et blocs, pour les scenes ou il faut reconnaitre un objet */
    'pioche':      ['pioche',   '#C4C4C4', '#E8E8E8', '#8F8F8F', 'PIOCHE'],
    'hache':       ['hache',    '#C4C4C4', '#E8E8E8', '#8F8F8F', 'HACHE'],
    'pelle':       ['pelle',    '#C4C4C4', '#E8E8E8', '#8F8F8F', 'PELLE'],
    'epee':        ['epee',     '#C4C4C4', '#E8E8E8', '#8F8F8F', 'ÉPÉE'],
    'four':        ['four',     '#8B8B8B', '#ABABAB', '#6A6A6A', 'FOUR'],
    'chaudron':    ['chaudron', '#4A4A5A', '#6E6E7E', '#2A2A33', 'CHAUDRON'],
    'pierre':      ['cube',     '#8B8B8B', '#ABABAB', '#6A6A6A', 'PIERRE'],
    'sable':       ['cube',     '#E8DCB0', '#F5EDD2', '#C4B88A', 'SABLE'],
    'terre':       ['cube',     '#7A5230', '#96683F', '#5C3A1B', 'TERRE'],
    'obsidienne':  ['cube',     '#2A1B3A', '#453058', '#160C22', 'OBSIDIENNE'],
    'bedrock':     ['cube',     '#4A4A50', '#6E6E7E', '#2A2A33', 'BEDROCK'],
    'netherite':   ['ingot',    '#4A3A3A', '#6E5A5A', '#2A2020', 'NETHERITE'],
    'emeraude':    ['gem',      '#3B8526', '#8BE07C', '#26591A', 'ÉMERAUDE'],
    'lapis':       ['gem',      '#2A5C90', '#6BA3DB', '#1E456C', 'LAPIS'],
    'cuivre':      ['cube',     '#C6613A', '#E08850', '#9E4A2A', 'CUIVRE'],
    'verre':       ['cube',     '#BFE8F0', '#EAF9FC', '#8FBCC8', 'VERRE'],
    'beton':       ['cube',     '#4FD9D0', '#ADF5F0', '#2E9E97', 'BÉTON'],
    'terrecuite':  ['cube',     '#A05A3A', '#C07A56', '#7A3F26', 'TERRE CUITE']
  };

  window.QUIZ_GAMEPLAY = { craft: CRAFT, forge: FORGE, items: ITEMS };
})();
