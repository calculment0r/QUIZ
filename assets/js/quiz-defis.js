/* =============================================================================
   LES DEFIS A PLUSIEURS FAITS
   -----------------------------------------------------------------------------
   Deux epreuves du catalogue demandaient ce que la banque ne savait pas donner :
   plusieurs faits sur un meme ecran. La banque est ecrite un fait par question ;
   ce fichier les rassemble, sans toucher aux questions elles-memes.

   Chaque fiche est accrochee au TEXTE EXACT d'une question qui existe deja. La
   question reste affichee telle quelle — c'est le titre du defi — et la fiche
   apporte les faits voisins. Si la question change dans quiz-data.js sans que la
   fiche suive, le moteur ne la reconnait plus et l'epreuve redevient un QCM :
   jamais une epreuve fausse.

   TRI    : ranger des faits dans des colonnes (l'entrepot du golem)
   CHAINE : remettre des etapes dans l'ordre (la ligne de transformation)
   ============================================================================= */
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     L'ENTREPOT DU GOLEM — cinq faits, trois coffres
     Le golem ne bouge qu'une fois tout le plan pose : on peut se raviser
     autant qu'on veut, rien n'est valide avant le bouton.
     -------------------------------------------------------------------------- */
  var TRI = {
    'Quelle grande différence de redstone existe entre Java et Bedrock ?': {
      titre: 'RANGE CHAQUE MÉCANIQUE DANS SON ÉDITION',
      coffres: [
        { id: 'java', nom: 'JAVA', couleur: '#C6613A' },
        { id: 'bedrock', nom: 'BEDROCK', couleur: '#5FBFA8' },
        { id: 'deux', nom: 'LES DEUX', couleur: '#C9962F' }
      ],
      faits: [
        { txt: 'La quasi-connectivité', ou: 'java' },
        { txt: 'Les mods Forge et Fabric', ou: 'java' },
        { txt: 'Les add-ons', ou: 'bedrock' },
        { txt: 'Le Marketplace et les Minecoins', ou: 'bedrock' },
        { txt: 'Les serveurs Realms', ou: 'deux' }
      ]
    },
    'Sur quelle édition peut-on installer des mods Forge ou Fabric ?': {
      titre: 'RANGE CHAQUE CHOSE DANS SON ÉDITION',
      coffres: [
        { id: 'java', nom: 'JAVA', couleur: '#C6613A' },
        { id: 'bedrock', nom: 'BEDROCK', couleur: '#5FBFA8' },
        { id: 'deux', nom: 'LES DEUX', couleur: '#C9962F' }
      ],
      faits: [
        { txt: 'PC Windows, Mac et Linux', ou: 'java' },
        { txt: 'Console, mobile et Windows', ou: 'bedrock' },
        { txt: 'Le Marketplace Pass', ou: 'bedrock' },
        { txt: 'Le cross-play entre plateformes', ou: 'bedrock' },
        { txt: 'Le mode Créatif', ou: 'deux' }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     LA LIGNE DE TRANSFORMATION — quatre etapes a remettre dans l'ordre
     La chaine s'arrete pile a la premiere etape impossible : on voit ou ca
     coince, on ne se contente pas d'un rouge.
     -------------------------------------------------------------------------- */
  var CHAINE = {
    'Comment obtient-on un happy ghast ?': {
      titre: 'REMETS LA CHAÎNE DANS L’ORDRE',
      etapes: [
        { txt: 'Poser le ghast séché dans l’eau', art: ['item', 'chaudron'] },
        { txt: 'Nourrir le ghastling de boules de neige', art: ['item', 'laine'] },
        { txt: 'Attendre qu’il devienne un happy ghast', art: ['mob', 'happyghast'] },
        { txt: 'Lui poser un harnais pour le monter', art: ['item', 'selle'] }
      ]
    },
    'Comment obtient-on du netherite ?': {
      titre: 'REMETS LA CHAÎNE DANS L’ORDRE',
      etapes: [
        { txt: 'Miner des débris antiques dans le Nether', art: ['item', 'pioche'] },
        { txt: 'Les fondre en fragments de netherite', art: ['item', 'four'] },
        { txt: 'Assembler 4 fragments et 4 lingots d’or', art: ['item', 'lingot-or'] },
        { txt: 'Améliorer l’objet en diamant à la forge', art: ['item', 'netherite'] }
      ]
    },
    'Combien de temps met un villageois zombie à être soigné ?': {
      titre: 'REMETS LE SOIN DANS L’ORDRE',
      etapes: [
        { txt: 'L’enfermer pour qu’il ne brûle pas au soleil', art: ['item', 'planche'] },
        { txt: 'Lui lancer une potion de Faiblesse', art: ['item', 'potion'] },
        { txt: 'Lui donner une pomme dorée', art: ['item', 'pomme-doree'] },
        { txt: 'Attendre qu’il tremble en rouge', art: ['mob', 'villageois'] }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     L'ENSEIGNE — ecrire le nom au lieu de le reconnaitre
     Six questions de Bedrock demandent un nom propre : trois des quatre
     reponses proposees sont des noms qui n'existent pas. On ne peut pas
     demander de les reconnaitre en image sans les inventer. On demande donc
     l'inverse : composer le vrai nom, lettre par lettre. Rien n'est invente,
     et il faut savoir l'ecrire, pas le retrouver dans une liste.
     -------------------------------------------------------------------------- */
  var ENSEIGNE = {
    'Comment s’appelle la boutique intégrée à Bedrock ?': { mot: 'MARKETPLACE' },
    "Comment s'appelle la boutique intégrée à Bedrock ?": { mot: 'MARKETPLACE' },
    'Quelle monnaie utilise-t-on sur le Marketplace ?': { mot: 'MINECOINS' },
    'Comment s’appellent les modifications sur Bedrock ?': { mot: 'ADDONS' },
    "Comment s'appellent les modifications sur Bedrock ?": { mot: 'ADDONS' },
    'Comment s’appellent les serveurs officiels payants de Minecraft ?': { mot: 'REALMS' },
    "Comment s'appellent les serveurs officiels payants de Minecraft ?": { mot: 'REALMS' },
    'Quel nouveau jeu a été annoncé au Minecraft Live de mars 2026 ?': { mot: 'DUNGEONS' }
  };

  /* --------------------------------------------------------------------------
     LES MACHINES — allumer celles qui font tourner l'edition
     -------------------------------------------------------------------------- */
  var MACHINES = {
    'Sur quelles machines joue-t-on à Minecraft Bedrock ?': {
      titre: 'ALLUME LES MACHINES QUI FONT TOURNER BEDROCK',
      appareils: [
        { id: 'console', nom: 'CONSOLE', bon: true },
        { id: 'tel', nom: 'TÉLÉPHONE', bon: true },
        { id: 'windows', nom: 'PC WINDOWS', bon: true },
        { id: 'linux', nom: 'MAC ET LINUX', bon: false }
      ]
    },
    'Peut-on jouer avec un ami sur une autre plateforme en Bedrock ?': {
      titre: 'ALLUME CE QUI PEUT JOUER AVEC TOI',
      appareils: [
        { id: 'console', nom: 'UNE CONSOLE', bon: true },
        { id: 'tel', nom: 'UN TÉLÉPHONE', bon: true },
        { id: 'windows', nom: 'UN PC WINDOWS', bon: true },
        { id: 'java', nom: 'UN PC EN ÉDITION JAVA', bon: false }
      ]
    }
  };

  window.QUIZ_DEFIS = { tri: TRI, chaine: CHAINE, enseigne: ENSEIGNE, machines: MACHINES };
})();
