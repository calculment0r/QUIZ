# QUIZ MINECRAFT 2026 — DIRECTION DE JEU POUR CLAUDE DESIGN

Document de conception, sans code. Il complète et remplace les parties du handoff qui réduisent encore l’expérience à un QCM.

## 1. Décision de conception

Le livrable ne doit plus être pensé comme **un quiz joliment habillé en Minecraft**.

Il doit devenir **une expédition Minecraft de douze épreuves courtes**, dans laquelle une connaissance est exprimée par un geste de jeu : miner, fabriquer, équiper, trier, viser une altitude, réparer un circuit, nourrir un mob, explorer un coffre, relier deux versions ou survivre à une panne absurde.

Une question peut encore employer quatre possibilités quand le contenu l’exige, mais ces possibilités ne doivent presque jamais apparaître comme quatre cartes blanches contenant du texte. Elles deviennent des objets, des blocs, des outils, des jauges, des créatures ou des destinations manipulables dans la scène.

La promesse à tenir est simple :

> Je ne coche pas une réponse. Je montre que je sais jouer.

### Ce qui est désormais obsolète dans le handoff initial

- « Intégrer les 108 questions telles quelles, ne pas réécrire » est annulé. Les faits et les explications restent la source, mais la formulation et le mode de réponse peuvent évoluer.
- La composition fixe « question puis quatre boutons » est annulée.
- La grande carte blanche centrale n’est plus le composant principal.
- Une animation jouée après un clic ne suffit pas à transformer un QCM en jeu. Le geste de réponse doit lui-même être ludique.
- Les trois cœurs ne sont plus des vies. Aucune erreur de connaissance ne doit rapprocher d’un game over.

## 2. Ce que l’on emprunte à Spaceteam

On ne copie ni son apparence ni son multijoueur. On reprend quatre principes :

1. **Des commandes physiques immédiatement compréhensibles** : boutons, molettes, curseurs, leviers, inventaire, objets à déplacer.
2. **Une urgence comique** : la machine se dérègle, le vocabulaire devient légèrement absurde, les sons racontent que tout va de travers.
3. **Une difficulté qui vient aussi de l’interface** : panneaux qui pendent, boutons déplacés, écran qui fond, contrôles momentanément inversés — uniquement dans des séquences Flash annoncées.
4. **Le chaos reste lisible** : le joueur comprend toujours son objectif, le temps restant et le geste attendu.

Le ton peut produire des ordres comme :

- « CALME CE CREEPER »
- « REMETS LE CHUNK DROIT »
- « LE COCHON A MANGÉ LE BOUTON »
- « PAS DE BRUIT. LE WARDEN ÉCOUTE. »
- « CIRE LE CUIVRE AVANT LE SOLO DE TROMPETTE »
- « LE MENU FOND. RÉPONDS AVANT LA LAVE. »

Ce ne sont pas des blagues écrites trop longues. Le gag vient surtout de ce que fait l’écran.

## 3. Mobile vertical : l’écran devient une petite machine de jeu

Le format de référence est le portrait 390 × 844. Le desktop agrandit le décor, mais ne modifie pas la logique.

### Anatomie constante

| Zone | Hauteur indicative | Fonction |
|---|---:|---|
| HUD supérieur | 10 à 12 % | Retour, épreuve 4/12, combo, son |
| Consigne | 12 à 16 % | Une phrase courte, jamais un paragraphe |
| Aire de jeu | 52 à 62 % | La scène manipulable, différente selon l’épreuve |
| Dock inférieur | 16 à 20 % | Inventaire ou gros bouton `VALIDER` / `SUIVANT` |

Le bouton principal reste gros, large, collé à la zone du pouce et protégé par le safe area. Pour les gestes qui produisent une réponse définitive — taper un mob, choisir un portail, attraper un objet — il peut devenir `CONFIRMER CE CHOIX`. Pour les manipulations réversibles — craft, tri, curseur — il reste `VALIDER`.

### Règles visuelles

- Plus de nappe de cartes blanches. Le fond est un biome, un inventaire, une grotte, un établi, une carte ou un panneau de contrôle.
- Le blanc sert au texte, aux reflets et aux éclats, pas à remplir chaque réponse.
- Chaque famille de questions possède une matière dominante : bois et herbe pour Survie, Deep Dark/Nether/forêt pour Mobs, cuivre/cyan/magenta pour Bedrock & 2026.
- Les réponses visuelles utilisent des icônes pixel originales et reconnaissables : pioche, laine, œil de l’Ender, bloc de cuivre, appareils, mobs. Éviter les pictogrammes génériques de formulaire.
- Les textes de plus de trois mots utilisent la police de lecture, jamais la police pixel.
- Une seule grosse animation vedette à la fois. L’écran peut être exubérant sans devenir une soupe permanente.

## 4. Les écrans hors questions deviennent eux aussi jouables

### Accueil

Conserver le coucher de soleil sur les Sanguinaires et le lever de soleil au START. C’est la signature. Ajouter seulement une réaction tactile : au premier contact, le soleil se comprime comme un bloc poussé avant de monter.

### Choix du quiz

Remplacer les trois cartes par **trois portails vivants** empilés verticalement :

- Portail de surface, bois, table de craft et four pour Survie & Craft.
- Portail changeant entre forêt, Nether et Deep Dark pour Mobs & Mondes.
- Portail cuivre électrifié, Marketplace et blocs 2026 pour Bedrock & 2026.

Le joueur fait glisser le portail choisi au centre, voit une prévisualisation animée, puis presse le gros bouton `ENTRER`.

### Choix du niveau

Utiliser la verticalité du téléphone : **un ascenseur de mine descend dans le monde**.

- Surface/pierre : Débutant.
- Couche or et lave : Confirmé.
- Diamant, bedrock et Deep Dark : Expert.

Le doigt déplace la cabine entre les trois paliers. Le bouton du bas indique `DESCENDRE ICI`. C’est déjà un mini-jeu d’orientation, pas trois rectangles.

### Progression

Remplacer la barre d’XP abstraite par un petit minecart qui avance dans douze cases en haut de l’écran. Une bonne réponse charge un minerai dans le wagon. Une erreur y met un bloc fissuré, mais le train continue.

### Résultat

Les douze gains construisent un petit monument sur les Sanguinaires au retour du crépuscule : échafaudage simple pour un petit score, tour éclairée puis faisceau de beacon pour un excellent score. Le score reste lisible, mais il a produit quelque chose dans le monde.

## 5. Rythme d’une partie de douze épreuves

Le plaisir vient du contraste. Tout ne doit pas hurler tout le temps.

| Moment | Fonction |
|---|---|
| Épreuves 1–2 | Deux gestes simples. Le joueur comprend que ce n’est pas un QCM. |
| Épreuve 3 ou 4 | Premier événement Flash, court et surprenant. |
| Épreuves 4–6 | Une manipulation plus riche, puis une question rapide. |
| Épreuve 7 | Petite respiration visuelle, explication amusante plus généreuse. |
| Épreuve 8 ou 9 | Deuxième événement Flash, plus chaotique. |
| Épreuves 9–11 | Mélange des familles, difficulté en hausse. |
| Épreuve 12 | Épreuve finale mise en scène, jamais un banal bouton. |

### Le directeur de surprise

Claude doit prévoir une logique de sélection, pas un hasard aveugle :

- Deux Flash maximum par partie, jamais consécutifs, jamais à la première question.
- Une catastrophe d’interface maximum par tranche de quatre questions.
- Pas de répétition du même geste dans deux questions consécutives.
- Une animation de succès ou d’échec ne peut pas se répéter dans la même partie.
- Les réactions contextuelles ont priorité sur les réactions aléatoires. Une question Warden préfère la laine, le sculk ou le sonic boom ; une question de craft préfère l’établi ou l’enclume.
- Un effet de feedback dure généralement 550 à 900 ms. L’explication et `SUIVANT` doivent être disponibles en moins de 1,2 seconde.

## 6. Quinze familles de réponse réutilisables

Claude ne doit pas fabriquer 108 systèmes isolés. Il doit créer une petite grammaire réutilisable, puis donner à chaque question une variante visuelle.

| Famille | Geste | Bon usage |
|---|---|---|
| Miner | Tap répété ou maintien jusqu’à fissuration | Blocs, minerais, bedrock |
| Équiper | Glisser un outil/objet sur une cible | Pioche, armure, enchantement |
| Crafter | Placer des ingrédients dans une grille 2×2 ou 3×3 | Recettes et quantités |
| Inventaire | Prendre, empiler, compter ou jeter | Slots, drops, ressources |
| Curseur de monde | Déplacer Steve dans une coupe verticale avec coordonnées Y | Diamant, plafond, bedrock |
| Jauge | Régler une valeur par glissement | Vie, dégâts, durée, XP |
| Chronologie | Placer un drop ou une version sur une ligne du temps | Nouveautés 2025–2026 |
| Relier | Tirer un câble ou un trait entre deux éléments | Cross-play, éditions, invocateur |
| Trier | Déplacer plusieurs éléments dans les bons coffres/zones | Golem de cuivre, plateformes |
| Transformer | Enchaîner deux ou trois actions | Netherite, soin, hydratation |
| Explorer | Fouiller une scène, un coffre ou une carte | Structures, loot, biomes |
| Viser | Déplacer un réticule ou taper une cible mouvante | Mobs, flèches, yeux |
| Tracer | Dessiner un chemin sans toucher des obstacles | Warden, portail, redstone |
| Mémoire | Observer brièvement puis reconstruire | Coffres, recettes, mobs |
| Rythme/réflexe | Répéter un motif sonore ou agir avant un danger | Note block, Creeper, Flash |

### Quand garder du texte

Certaines distinctions conceptuelles — quasi-connectivité, nom d’un abonnement, nom précis d’un drop — exigent du texte. Dans ce cas, le texte vit sur des objets de jeu : pancartes, livres, étiquettes, caisses, cartouches ou portails. Il ne revient pas sous forme de quatre grandes cartes blanches identiques.

## 7. Vingt événements Flash

Un Flash dure entre quatre et huit secondes. Il donne un bonus de minerai, une particule rare ou un multiplicateur, mais ne retire jamais un point de connaissance. Une maladresse motrice ne doit pas faire croire à l’enfant qu’il ne connaît pas Minecraft.

1. **Silhouette express** — une forme est montrée pendant une seconde ; casser rapidement les briques en trop pour la reproduire.
2. **Creeper dans le menu** — taper les trois verrous de la mèche avant l’explosion-confettis.
3. **Pas un bruit** — tracer jusqu’à un coffre sans toucher les capteurs sculk qui pulsent.
4. **MLG improvisé** — déplacer un seau sous Steve juste avant sa chute.
5. **Redstone en panne** — remettre deux morceaux de fil dans le bon sens avant que la lampe s’éteigne.
6. **Inventaire qui déborde** — faire tenir cinq objets dans une grille minuscule en les déplaçant.
7. **Gravier** — taper de bas en haut les blocs porteurs avant que toute la colonne ne tombe.
8. **Ghast postal** — renvoyer une boule de feu dans une cible mouvante par un swipe au bon moment.
9. **Onze yeux… non, douze** — insérer les yeux manquants dans un portail qui tourne.
10. **Four capricieux** — maintenir la température dans une zone verte avec un curseur de combustible.
11. **Happy Ghast taxi** — guider une petite monture dans trois anneaux par glissement.
12. **Cube de soufre affamé** — lui donner le matériau demandé parmi des objets qui rebondissent.
13. **Cuivre instable** — cirer les blocs avant que l’oxydation ne change toute la mélodie.
14. **Bébé mob en cavale** — attraper le pissenlit doré et toucher le bon bébé sans taper les adultes.
15. **Coffre mémoire** — mémoriser quatre objets, le coffre se ferme, replacer l’objet manquant.
16. **Raid d’archers** — lever le bouclier du bon côté selon les sifflements de flèches.
17. **Portail minimal** — construire un cadre du Nether avec seulement dix obsidiennes avant la fin du sablier.
18. **Trompette cassée** — répéter trois notes de bloc musical dans l’ordre.
19. **Lumière zéro** — poser rapidement des torches dans les zones noires avant l’apparition des silhouettes.
20. **Le chunk fond** — le décor et les boutons coulent comme de la graisse ; attraper et maintenir `STABILISER` avant qu’il atteigne le bas.

### Cinq catastrophes d’interface supplémentaires

Elles peuvent habiller un Flash existant, pas se cumuler avec lui.

- **Gel** : le doigt doit gratter une fine couche de glace pour libérer le contrôle utile.
- **Enderman** : il vole momentanément un bouton et le repose ailleurs.
- **Gravité latérale** : les éléments glissent vers la droite ; le joueur remet le téléphone fictif droit avec un curseur.
- **Chunk manquant** : quelques cases deviennent transparentes et réapparaissent par vagues.
- **Warden darkness** : la visibilité rétrécit autour du doigt comme une petite torche.

## 8. Vingt réactions de bonne réponse

La bonne réponse reste à l’écran, passe devant les autres et grandit. Les autres éléments tombent, sont aspirés ou s’effacent selon la scène. Toujours révéler ensuite l’explication.

1. La réponse grossit comme un bloc posé ; les autres tombent hors de l’écran avec un bruit de blocs.
2. Des orbes d’XP jaillissent puis sont aspirées vers le compteur.
3. Un petit feu d’artifice pixel éclate derrière l’objet correct.
4. Un coffre s’ouvre et projette un diamant ainsi que la réponse correcte.
5. Un beacon s’allume verticalement derrière la réponse.
6. Un Creeper gonfle, mais explose en confettis carrés verts.
7. Un Allay tourne autour de la réponse et l’emporte vers le score.
8. Un Happy Ghast soulève le bon objet ; les mauvais restent au sol.
9. Un slime rebondit trois fois et tamponne `VALIDÉ`.
10. Un Enderman téléporte la bonne réponse au centre dans un nuage violet.
11. Une pioche diamant casse le cadre autour de la réponse, qui devient un minerai rare.
12. Le circuit de redstone s’allume jusqu’à un panneau `OUI`.
13. Le portail de l’End s’active sous la réponse et avale les autres.
14. Une enclume tombe derrière l’objet et lui applique un reflet enchanté.
15. Un Totem d’immortalité apparaît brièvement et déploie deux ailes pixel.
16. Le minecart du HUD traverse l’écran, ramasse la réponse et repart chargé.
17. Un loup apprivoisé s’assoit à côté de la bonne réponse et le collier passe au vert.
18. Une torche se plante, chasse l’obscurité et révèle `CORRECT` dans la roche.
19. Le cuivre se désoxyde en vague brillante sur toute l’interface.
20. Le décor connaît un mini lever de soleil de 500 ms, écho de l’accueil.

## 9. Vingt réactions de mauvaise réponse

Le choix incorrect reçoit le gag. La bonne réponse est ensuite révélée, reste stable et grandit légèrement ; les deux autres quittent l’écran. On ne punit jamais longtemps le joueur.

1. Le bouton choisi se fissure puis tombe en deux blocs.
2. Un Creeper fait exploser uniquement le mauvais choix ; la bonne réponse reste sur un socle.
3. Du gravier ensevelit le mauvais objet puis s’écroule au bas de l’écran.
4. Un Enderman vole le mauvais choix et le remplace par la bonne réponse.
5. Un bébé zombie monte sur le mauvais choix et part avec.
6. Une chèvre arrive latéralement et expédie le mauvais bouton hors champ.
7. Une enclume écrase le choix ; son texte ressort aplati, puis la bonne réponse apparaît.
8. Une flèche de squelette plante une pancarte `NON` dans le choix.
9. Un Shulker donne au mauvais choix un effet de lévitation ; il monte et disparaît.
10. Une vague du Nether transforme le mauvais choix en cendres.
11. Des silverfish sortent de la carte et grignotent ses bords.
12. Le circuit redstone du choix fait un court-circuit et toutes ses lampes sautent.
13. Un piston repousse le mauvais bloc dans le vide.
14. Un Phantom saisit la réponse et l’emporte en haut.
15. Le mauvais objet tombe dans une trappe de coffre piégé.
16. Une mare de soufre le fait rebondir de plus en plus vite jusqu’à l’éjection.
17. Le Warden lance un sonic boom ; secousse courte, puis lumière verte sur la bonne réponse.
18. Un effet de poison colore le mauvais choix, qui rétrécit comme une barre de vie.
19. Le chunk du mauvais choix affiche brièvement `MISSING`, puis se reconstruit avec la correction.
20. Le mauvais bouton fond et coule ; la bonne réponse reste sur un bloc de bedrock.

### Règle impérative de lisibilité

Même quand l’animation est spectaculaire, elle ne doit jamais faire disparaître la correction. Après l’effet, l’écran doit laisser visibles : la bonne réponse, le résultat, une explication courte et le gros bouton `SUIVANT`.

## 10. Sound design

Le jeu peut être coloré sans musique permanente. Un paysage sonore léger suffit : vent, eau, grotte, feu, bourdonnement de portail. Le son est surtout une ponctuation comique.

- Chaque famille de geste possède une signature : pierre, bois, inventaire, glissement de jauge, clic redstone.
- Un succès utilise une montée courte en trois notes, jamais une fanfare scolaire.
- Une erreur utilise un son physique lié au gag : bloc cassé, piston raté, enclume, fizz de lave.
- Les Flash ont un compte à rebours sonore reconnaissable sans regarder le texte.
- Le bouton son est toujours disponible. Le jeu reste entièrement jouable muet.
- Pas de voix obligatoire. Si une voix est ajoutée, elle doit donner des ordres très courts et absurdes, jamais lire tout l’énoncé.

## 11. Refonte question par question — 108 épreuves

Les identifiants ci-dessous suivent l’ordre du JSON : `S` = Survie & Craft, `M` = Mobs & Mondes, `B` = Bedrock & 2026. Le premier chiffre est le niveau, le second la question.

### SURVIE & CRAFT — niveau 1

| ID | Transformation en geste de jeu |
|---|---|
| S1.1 | Quatre blocs dans une mini-scène. Maintenir le doigt pour « frapper » le bloc de bois ; lui seul devient le premier élément d’inventaire. |
| S1.2 | Glisser une bûche dans la zone de craft. Quatre piles de sortie bondissent ; attraper la pile de 4 planches. |
| S1.3 | Remplir les quatre cases d’une grille 2×2 avec des planches pour fabriquer la table. Aucun texte de réponse. |
| S1.4 | Faire glisser la pioche, la pelle, la hache ou l’épée sur un bloc de pierre. L’outil correct le casse immédiatement. |
| S1.5 | Une barre de vie vide. Taper les cœurs pour régler la vie initiale à 10, puis valider. |
| S1.6 | Construire réellement la recette du lit avec 3 laines et 3 planches dans la grille 3×3. |
| S1.7 | Taper successivement quatre blocs. Trois se fissurent ; choisir le bloc qui refuse de casser, la bedrock. |
| S1.8 | Aliment et combustibles dans le dock. Glisser nourriture en haut et combustible en bas du four, puis l’allumer. |
| S1.9 | Une petite paroi contient plusieurs filons. Miner le filon présenté comme le plus courant : le charbon. |
| S1.10 | Assembler verticalement un charbon et un bâton ; la sortie affiche quatre torches. |
| S1.11 | Quatre portails de modes. Choisir celui où dégâts et faim sont désactivés : Créatif. Étiquettes courtes sur pancartes. |
| S1.12 | Empiler deux planches verticalement, puis prendre la pile de 4 bâtons produite. |

### SURVIE & CRAFT — niveau 2

| ID | Transformation en geste de jeu |
|---|---|
| S2.1 | Construire un portail minimal avec une réserve de dix obsidiennes ; les coins restent vides et le portail s’allume. |
| S2.2 | Glisser un livre d’enchantement sur un bloc de minerai. Seul Toucher de soie permet de ramasser le bloc intact. |
| S2.3 | Coupe verticale de montagne et de grotte. Déplacer Steve sur quatre paliers Y ; le filon diamant s’intensifie vers Y −59. |
| S2.4 | Remplir la grille de l’enclume avec 3 blocs de fer et 4 lingots. Afficher ensuite « 31 lingots au total ». |
| S2.5 | Régler la jauge d’XP à 30 pendant que quinze bibliothèques s’allument autour de la table. |
| S2.6 | Un Creeper charge. Glisser le bloc le plus résistant devant Steve avant l’explosion : obsidienne. |
| S2.7 | Comptoir de bibliothécaire. Donner une émeraude puis prendre le livre enchanté parmi les marchandises. |
| S2.8 | Tourner une horloge jour/nuit complète et arrêter le compteur à 20 minutes. |
| S2.9 | Nourrir Steve avec quatre aliments ; choisir celui dont la barre de saturation cachée reste pleine le plus longtemps : carotte dorée. |
| S2.10 | Construire une chaîne de transformation : débris antiques → four → ferraille → combinaison avec l’or. |
| S2.11 | Équiper des bottes avec Chute amortie, puis lâcher Steve d’une plateforme. La chute illustre la réduction des dégâts. |
| S2.12 | Fabriquer la boussole dans la grille : redstone au centre, quatre lingots de fer en croix. |

### SURVIE & CRAFT — niveau 3

| ID | Transformation en geste de jeu |
|---|---|
| S3.1 | Tirer un fil de redstone bloc par bloc. Le signal s’affaiblit ; placer le répéteur après le quinzième bloc. |
| S3.2 | Remplir les neuf cases de la grille avec des pépites d’or pour faire apparaître un lingot. |
| S3.3 | Grotte sombre avec curseur de lumière. Monter de 0 à 1 pour faire disparaître les silhouettes de monstres, puis valider. |
| S3.4 | Un objet tombe au sol. Régler un cadran de despawn à 5 minutes. Préciser « dans un chunk chargé ». |
| S3.5 | Ascenseur vertical. Monter jusqu’au plafond de construction Y 320 sans le dépasser. |
| S3.6 | Foreuse verticale. Descendre jusqu’au plancher Y −64 et la stopper avant la bedrock. |
| S3.7 | Ouvrir une boîte de Shulker et faire glisser le doigt sur ses trois rangées de neuf slots ; le compteur atteint 27. |
| S3.8 | Une pioche possède Toucher de soie. Essayer quatre livres ; Fortune est repoussé par l’enclume comme incompatible. |
| S3.9 | Insérer douze yeux dans les cadres d’un portail complet. Certains peuvent être préremplis dans une variante ultérieure. |
| S3.10 | Faire glisser des orbes d’XP vers un outil abîmé équipé de Réparation ; sa durabilité remonte. |
| S3.11 | Agrandir une zone de téléportation sur une grille jusqu’à 32 blocs sur chaque axe. Corriger le libellé, trop vague sur la « distance ». |
| S3.12 | Frapper un mannequin avec l’épée en netherite et régler la jauge de dégâts. La question doit préciser l’édition avant d’être publiée. |

### MOBS & MONDES — niveau 1

| ID | Transformation en geste de jeu |
|---|---|
| M1.1 | Une nuit en vue subjective. Taper le mob vert dont la mèche se déclenche, puis reculer avant l’explosion. Corriger l’explication à environ 1,5 seconde. |
| M1.2 | Consigne « Provoque l’Enderman sans le frapper ». Déplacer le réticule jusqu’à ses yeux ; il tremble et devient agressif. |
| M1.3 | Faire glisser un os vers le loup parmi quatre animaux ; son collier apparaît. |
| M1.4 | Construire le loot du mouton tué en plaçant laine et mouton cru dans deux slots. Ajouter que le tondre est souvent préférable. |
| M1.5 | Trois portails dimensionnels et un paysage de départ. Entrer dans l’Overworld. |
| M1.6 | Des flèches arrivent depuis l’obscurité ; viser le squelette qui les tire. |
| M1.7 | Prendre la carotte dans la hotbar et attirer le cochon jusqu’à l’enclos. |
| M1.8 | Un Ghast lance une boule de feu ; le reconnaître puis renvoyer le projectile par swipe. |
| M1.9 | Ascenseur de grotte. Descendre vers le Deep Dark en évitant les capteurs sculk. |
| M1.10 | Poser un objet au sol devant quatre animaux ; sélectionner le renard qui le prend dans sa gueule. |
| M1.11 | Dans l’End, casser les cristaux posés sur les piliers d’obsidienne puis viser le Dragon. Ne plus écrire « cristaux d’obsidienne ». |
| M1.12 | Poser un harnais sur le Happy Ghast et le guider dans un anneau aérien. |

### MOBS & MONDES — niveau 2

| ID | Transformation en geste de jeu |
|---|---|
| M2.1 | Placer le ghast séché dans l’eau, attendre la transformation en ghastling, puis lui donner des boules de neige. |
| M2.2 | Mini-tri : le golem de cuivre prend les objets du coffre en cuivre et il faut lui ouvrir les coffres de destination. |
| M2.3 | Une carte de coupe géologique. Relier « cité ancienne » au biome Deep Dark. |
| M2.4 | Faire glisser un seau d’eau autour de l’axolotl pour le capturer, comme un geste de scoop. |
| M2.5 | Quatre silhouettes sous un orage. Sélectionner le villageois ; la foudre le transforme en sorcière. |
| M2.6 | Passer le portail du Nether, puis positionner le mineur entre Y 8 et Y 22 pour chercher les débris antiques. |
| M2.7 | Explorer une grotte de soufre et taper le cube de soufre caché parmi les blocs colorés. |
| M2.8 | Nourrir le cube de soufre avec de la glace, puis le faire glisser comme un palet jusqu’à une cible. |
| M2.9 | Une écurie Créatif/Survie. Déplacer le cheval zombie vers Survie sur la chronologie de décembre 2025. |
| M2.10 | Sous l’eau, monter quatre créatures proposées ; le nautile donne le contrôle et préserve l’air. |
| M2.11 | Prendre une armure de nautile sur le râtelier et l’équiper sur le nautile apprivoisé. |
| M2.12 | Explorer le manoir, trouver l’Évocateur et récupérer son Totem. Expliquer que les Évocateurs de raid peuvent aussi en lâcher. |

### MOBS & MONDES — niveau 3

| ID | Transformation en geste de jeu |
|---|---|
| M3.1 | Régler la barre de vie du Warden à 500 points ; la conversion affiche 250 cœurs. |
| M3.2 | Régler la barre du Dragon à 200 pendant que les cristaux tentent de la remplir à nouveau. |
| M3.3 | Construire un écran de laine entre un projectile/vibration et le capteur sculk ; le signal s’arrête. |
| M3.4 | Avancer près d’une mare de soufre. L’écran tourne ; stabiliser le réticule puis nommer l’effet « vertige » sur une molette d’états. |
| M3.5 | Faire passer une ligne de mobs sous le soleil et choisir celui qui reste intact. Remplacer le noyé par une option sans condition ambiguë. |
| M3.6 | Relier l’Évocateur à ses Vex, puis esquiver les crocs qu’il invoque. |
| M3.7 | Régler la jauge du Ravageur à 100 points avant qu’il ne traverse le village. |
| M3.8 | Appliquer faiblesse puis pomme dorée au villageois zombie ; placer l’aiguille dans la zone 3–5 minutes. |
| M3.9 | Déplacer une boussole entre Overworld, Nether et End. Elle pointe correctement dans l’Overworld et tourne dans les deux autres. Transformer en réponse multiple. |
| M3.10 | Carte avec avant-poste, manoir, cité et temple. Libérer les Allays dans les deux bons lieux : avant-poste et manoir. |
| M3.11 | Empiler des blocs à côté du Warden pour mesurer ses trois blocs de haut, puis se réfugier dans un tunnel de deux blocs. |
| M3.12 | Réécrire : « Quel mob traverse les murs pour atteindre le joueur ? » Guider le Vex dans un mini-labyrinthe à travers les blocs. Il ne se téléporte pas. |

### BEDROCK & 2026 — niveau 1

| ID | Transformation en geste de jeu |
|---|---|
| B1.1 | Relier à un monde Bedrock les icônes console, mobile et PC Windows ; les mauvaises plateformes rebondissent. |
| B1.2 | Une rue de village contient plusieurs enseignes. Ouvrir la boutique `Marketplace`. |
| B1.3 | Insérer la pièce Minecoin dans le distributeur du Marketplace. Les émeraudes sont refusées avec un gag de villageois. |
| B1.4 | Tirer des câbles entre Xbox, PlayStation, Switch, mobile et PC pour former un réseau cross-play. |
| B1.5 | Glisser une boîte `ADD-ON` sur un monde Bedrock ; les cartouches Forge/Fabric ne rentrent pas dans la prise. |
| B1.6 | Sur la chronologie 2026, poser Tiny Takeover dans le premier emplacement. |
| B1.7 | Faire correspondre trois anciens bébés réduits avec leurs nouveaux modèles propres ; conclure « nouveau look ». |
| B1.8 | Taper un bloc de note et choisir l’icône de trompette correspondant au son entendu. Prévoir une alternative visuelle si le son est coupé. |
| B1.9 | Placer un bloc de cuivre sous le bloc de note puis le frapper pour produire la trompette. |
| B1.10 | Choisir le panneau `REALMS` pour héberger un monde persistant accessible aux amis. |
| B1.11 | Peindre des escaliers et dalles avec les seize couleurs de béton. Marquer cette épreuve comme preview 26.3 tant que le drop n’est pas sorti. |
| B1.12 | Poursuite courte : attraper le pissenlit doré et le donner au bébé avant sa croissance. |

### BEDROCK & 2026 — niveau 2

| ID | Transformation en geste de jeu |
|---|---|
| B2.1 | Machine à numéroter : entrer l’année 2026 et faire sortir 26.1, 26.2, 26.3 sur une bande. |
| B2.2 | Fabriquer le pissenlit doré : fleur au centre, huit pépites autour. |
| B2.3 | Placer papier et une pépite de métal dans la grille pour fabriquer une étiquette. |
| B2.4 | Observer le cuivre s’oxyder et modifier le son ; appliquer la cire au moment choisi pour figer la note. |
| B2.5 | Poser Chaos Cubed dans le deuxième emplacement de la chronologie 2026. |
| B2.6 | Explorer trois coupes de grotte et ouvrir celle qui contient soufre, geysers et mares toxiques. |
| B2.7 | Trier les blocs rouges cinabre et jaunes soufre dans deux palettes de construction. |
| B2.8 | Deux mini-circuits identiques Java/Bedrock. Activer le piston par quasi-connectivité : seul Java répond. |
| B2.9 | Brancher les cartouches Forge et Fabric sur l’édition Java ; la prise Bedrock accepte les add-ons. |
| B2.10 | Minecraft Live sous forme de scène. Ouvrir le rideau du nouveau jeu et révéler Dungeons II. |
| B2.11 | Rayon Marketplace : prendre le Pass qui ouvre une sélection de packs, et non le serveur Realms Plus. |
| B2.12 | Chronologie 2025. Déposer outils, armure, coffre et golem de cuivre sur The Copper Age. |

### BEDROCK & 2026 — niveau 3

| ID | Transformation en geste de jeu |
|---|---|
| B3.1 | Traducteur de versions : relier Java 26.3 à Bedrock 26.50. Afficher clairement `SNAPSHOT / PREVIEW` tant que ces versions ne sont pas finales. |
| B3.2 | Glisser Mounts of Mayhem sur la cartouche Java 1.21.11 de la chronologie 2025. |
| B3.3 | Fabriquer la lance sur la grille : deux bâtons et un lingot en diagonale. |
| B3.4 | Exécuter successivement les deux gestes de lance : estoc immobile puis charge avec déplacement. |
| B3.5 | Accélérer une monture avec un curseur ; la jauge de dégâts de charge augmente avec la vitesse. |
| B3.6 | Fouiller les coffres de structures océaniques pour trouver l’armure de nautile au lieu d’essayer de la crafter. |
| B3.7 | À la table de forge, améliorer une armure de cheval diamant avec modèle netherite et lingot. |
| B3.8 | Frise janvier 2026 du Marketplace. Déposer l’étiquette `Dungeon Descent` sur l’add-on Mounts of Mayhem. |
| B3.9 | Donner du bois au cube de soufre puis le faire rebondir sur trois cibles comme une balle. |
| B3.10 | Construire une palette d’escaliers de béton et faire glisser sur les seize couleurs ; compteur final 16. Preview à signaler. |
| B3.11 | Fouiller un coffre de camp abandonné et déplier une nouvelle carte d’explorateur. Preview à signaler. |
| B3.12 | Chronologie des drops 2025. Faire atterrir le Happy Ghast sur Chase the Skies. |

## 12. Audit éditorial avant intégration

Le JSON ne doit pas être copié aveuglément. Corrections prioritaires :

1. **Statut de 26.3** — au 18 août 2026, Java 26.3 est encore en snapshots et Bedrock 26.50 en Preview. Utiliser `INCLUT LES PREVIEWS 26.3`, ou publier le quiz stable comme `à jour 26.2` jusqu’à la sortie finale.
2. **M1.1 Creeper** — remplacer « siffle trois secondes » par « sa mèche standard dure environ 1,5 seconde ».
3. **M1.11 Dragon** — écrire « cristaux de l’End posés sur les piliers d’obsidienne », pas « cristaux d’obsidienne ».
4. **M3.9 Boussole** — la boussole normale tourne de façon erratique dans le Nether **et** dans l’End. La question actuelle possède donc deux bonnes réponses.
5. **M3.12 Vex** — le Vex vole et traverse les blocs ; il ne se téléporte pas vers le joueur. La question actuelle est fausse.
6. **S3.4 Despawn** — cinq minutes seulement pendant que le chunk est chargé ; ajouter cette précision au niveau Expert.
7. **S3.11 Enderman** — « 32 blocs » décrit la sélection sur chaque axe, pas forcément une distance euclidienne maximale simple. Réécrire le libellé.
8. **S3.12 Épée netherite** — préciser Java ou Bedrock et revérifier les dégâts de l’édition choisie avant publication.
9. **M2.12 Totem** — le manoir est une bonne réponse parmi les structures proposées, mais le Totem est lâché par les Évocateurs, que l’on rencontre aussi pendant les raids.
10. **M3.5 Soleil** — remplacer toute option dont le comportement dépend de l’eau, de l’équipement ou d’un état particulier. L’épreuve doit être incontestable.
11. **B1.11, B3.1, B3.10, B3.11** — ajouter un badge `PREVIEW 26.3` tant que le troisième drop 2026 n’est pas final.

### Principe d’écriture des consignes

Chaque consigne commence par un verbe et tient idéalement en une ligne :

- « FABRIQUE LE LIT »
- « DESCENDS À LA BONNE HAUTEUR »
- « ÉQUIPE LE NAUTILE »
- « BLOQUE LA VIBRATION »
- « RELIE LES PLATEFORMES BEDROCK »

La question complète peut rester accessible dans un petit bouton `?`, mais le premier écran demande une action, pas une dissertation.

## 13. Score, erreurs et motivation

### Remplacer les vies par une jauge de chaos

Les trois cœurs du handoff donnent l’impression qu’une mauvaise réponse rapproche d’une défaite. Employer plutôt une **jauge de stabilité du monde** :

- Bonne réponse : le monde gagne un bloc propre et le combo monte.
- Mauvaise réponse : un bloc se fissure et déclenche un gag.
- Une petite épreuve Flash peut réparer un bloc fissuré, sans modifier le score de connaissance.
- La partie va toujours au bout.

### Trois scores séparés

- **Connaissance** : nombre de réponses justes sur 12.
- **Combo** : bonnes réponses consécutives, utilisé uniquement pour les effets et les bonus visuels.
- **Chaos maîtrisé** : Flash réussis, présenté comme une médaille annexe.

Ainsi, un enfant très savant mais moins rapide n’est pas pénalisé par les mini-jeux.

## 14. Accessibilité et garde-fous

- Toutes les manipulations glisser-déposer ont une alternative tap-tap : toucher l’objet puis sa destination.
- Aucun Flash indispensable à la validation des connaissances.
- Le temps peut être désactivé dans les options ; le Flash devient alors une courte énigme sans chrono.
- `prefers-reduced-motion` conserve l’idée du gag mais remplace chute, secousse, zoom et fonte par des changements d’état simples.
- Jamais plus de trois flashs lumineux par seconde.
- Les sons ne portent aucune information exclusive.
- Les objets corrects sont identifiés par forme, mouvement et libellé, jamais uniquement par couleur.
- Une animation qui déplace les contrôles n’a lieu que dans un Flash annoncé, jamais pendant une question normale.
- Les zones tactiles restent au minimum à 56 px.
- Le bouton `SUIVANT` est toujours au même endroit. Le chaos ne doit jamais toucher cette règle.

## 15. Priorités réalistes de production

### Version 1 indispensable

- Nouveau layout mobile vertical sans cartes blanches.
- Quinze familles d’interaction réutilisables.
- Les 108 questions assignées à une famille comme dans ce document.
- Deux Flash par partie parmi un premier lot de huit.
- Huit succès et huit erreurs, contextuels et sans répétition.
- Gros bouton inférieur constant.
- Corrections éditoriales de la section 12.

### Version 1.5

- Vingt Flash.
- Vingt succès et vingt erreurs.
- Directeur de surprise complet.
- Résultat qui construit le monument aux Sanguinaires.
- Sound design plus riche.

### Plus tard

- Mode à plusieurs téléphones réellement inspiré de Spaceteam : un joueur reçoit la consigne, un autre possède l’objet ou le contrôle. Ce serait excellent, mais ce n’est pas nécessaire pour réussir la première version solo.

## 16. Prompt maître prêt à transmettre à Claude Design

> Reprends le projet à partir du handoff existant et du JSON, mais considère le présent document comme prioritaire en cas de contradiction. Ne code pas immédiatement. Commence par reformuler l’architecture de jeu et dresser la liste des quinze moteurs d’interaction réutilisables.
>
> Le problème à résoudre n’est pas cosmétique. Le prototype actuel est encore un QCM composé de cartes blanches. Je veux une expédition Minecraft mobile verticale de douze épreuves, dans laquelle répondre consiste à miner, crafter, équiper, viser une altitude, trier un inventaire, explorer, relier ou réparer. Les options textuelles ne sont acceptables que pour quelques questions conceptuelles et doivent alors vivre sur des objets de jeu, jamais sur quatre cartes blanches génériques.
>
> Le téléphone est toujours vertical. Le HUD est en haut, l’aire de jeu occupe le centre, et un très gros bouton `VALIDER`, `CONFIRMER` ou `SUIVANT` reste dans la zone basse, toujours au même endroit. Il n’y a aucun scroll de page.
>
> Utilise la table de transformation des 108 questions. Ne te contente pas de changer leur apparence : adapte leur formulation à l’action demandée. Corrige aussi les problèmes factuels recensés, notamment Creeper, Vex, boussole, dégâts selon l’édition et statut Preview de 26.3.
>
> Introduis un rythme de jeu : deux premières épreuves simples, deux événements Flash maximum par partie, alternance entre manipulations, réflexes et respirations. Emprunte à Spaceteam ses contrôles physiques, ses pannes absurdes et son urgence comique, pas son habillage. Le chaos doit rester lisible.
>
> Prévois vingt réactions de succès et vingt d’erreur, mais sélectionnées avec contexte, sans répétition dans une partie. Après une bonne réponse, elle reste, grossit et passe au premier plan pendant que les autres tombent ou sont chassées. Après une erreur, le choix reçoit un gag, puis la bonne réponse reste clairement visible avec l’explication. `SUIVANT` doit apparaître en moins de 1,2 seconde.
>
> Les Flash sont des bonus moteurs de quatre à huit secondes et ne modifient jamais le score de connaissance. Le mini-jeu de silhouette à casser et l’interface qui fond sont obligatoires dans le premier lot.
>
> Avant de coder, rends-moi d’abord : 1) le storyboard des douze temps d’une partie ; 2) l’inventaire des composants d’interaction ; 3) six écrans mobiles décrits précisément ; 4) la matrice question → interaction ; 5) la liste des huit Flash, huit succès et huit erreurs retenus pour la V1 ; 6) les corrections éditoriales appliquées. Attends ma validation de cette conception avant de produire le HTML.

## 17. Sources de vérification à conserver

- Versionnage officiel 2026 : https://www.minecraft.net/en-us/article/minecraft-new-version-numbering-system
- Tiny Takeover : https://www.minecraft.net/en-us/updates/tiny-takeover-drop
- Chaos Cubed : https://www.minecraft.net/en-us/updates/chaos-cubed-drop
- Java 26.3 Snapshot 7 : https://www.minecraft.net/en-us/article/minecraft-26-3-snapshot-7
- Java 26.3 Snapshot 9 : https://www.minecraft.net/en-us/article/minecraft-26-3-snapshot-9
- Bedrock Preview 26.50.24 : https://www.minecraft.net/en-us/article/minecraft-preview-26-50-24
- Présentation officielle du Vex : https://www.minecraft.net/en-us/article/meet-vex
- Spaceteam officiel : https://spaceteam.ca/

