# Quiz Minecraft 2026

Jeu de quiz Minecraft jouable au telephone : **3 quiz thematiques x 3 niveaux**,
108 questions a jour, lever de soleil sur les iles Sanguinaires, mini-jeux flash,
score partageable. Site statique, sans build, installable comme application.

Adresse une fois GitHub Pages actif : **https://calculment0r.github.io/QUIZ/**

---

## 1. Mettre en ligne (GitHub Pages)

Le depot contient le workflow `.github/workflows/deploy-pages.yml` : chaque push
publie le site. **Une action est necessaire la premiere fois**, parce que le
jeton d'Actions n'a pas le droit de creer le site Pages
(`Resource not accessible by integration`) :

1. Depot > **Settings** > **Pages**
2. *Build and deployment* > **Source** : choisir **GitHub Actions**
3. Onglet **Actions** > `Deploy to GitHub Pages` > **Run workflow**

Ensuite, chaque push publie tout seul.

Le workflow se declenche sur `main` et sur la branche de developpement
`claude/game-responsive-app-install-asybmz`, plus manuellement.

Rien a configurer d'autre : tous les chemins sont relatifs, le jeu fonctionne
donc aussi bien a la racine d'un domaine que dans un sous-dossier `/QUIZ/`.

### Tester en local

```bash
npx http-server -p 8099 -c-1 .     # puis http://127.0.0.1:8099/
```

Un simple `file://` suffit pour jouer, mais le service worker et l'installation
demandent `http://localhost` ou `https://`.

---

## 2. Installer le jeu sur le telephone

Le bouton **INSTALLER L'APPLI** sur l'ecran d'accueil s'occupe de tout quand le
navigateur le permet, et affiche la marche a suivre sinon.

- **Android / Chrome** : Chrome propose l'installation ; sinon menu **⋮** >
  *Installer l'application*. Une icone arrive sur l'ecran d'accueil et le jeu
  s'ouvre en plein ecran, sans barre de navigateur.
- **iPhone / Safari** : bouton **Partager** > *Sur l'ecran d'accueil* > *Ajouter*.
- Une fois installe, le jeu **se lance hors ligne** : tout est mis en cache
  (code, police, icones, questions).

Details techniques de l'installation :

| Element | Valeur |
|---|---|
| `manifest.webmanifest` | `display: standalone`, `orientation: portrait`, `scope`/`start_url` relatifs |
| Icones | 192 et 512 px, en `any` **et** `maskable` (Android decoupe l'icone) |
| Couleurs | `theme_color` et `background_color` = `#140A26` (le violet nuit du jeu) |
| `sw.js` | precache des 14 fichiers du jeu, repli `index.html` pour toute navigation |
| iOS | `apple-touch-icon`, `apple-mobile-web-app-*` pour le plein ecran |

---

## 3. Structure

```
index.html                  ecran unique : decor, 5 ecrans, 3 surcouches
manifest.webmanifest        carte d'identite de l'application installable
sw.js                       service worker (cache hors ligne)
assets/css/app.css          tout le style (palette, animations, responsive)
assets/js/app.js            logique de jeu (etat + rendu DOM)
assets/js/quiz-data.js      les 108 questions (window.QUIZ_DATA)
assets/js/quiz-gameplay.js  couche gameplay : quelle epreuve pour quelle question
assets/js/quiz-flash.js     les mini-jeux d'interlude (registre extensible)
assets/fonts/               Press Start 2P auto-hebergee (+ licence OFL)
assets/icons/               icones pixel de l'application
design/                     maquettes Claude Design d'origine (reference)
docs/                       handoff, direction de jeu, questions source,
                            et APPROCHE_QUESTION_GAMEPLAY_SWAN.md (feuille de
                            route : sortir du QCM, moteurs de jeu reutilisables)
```

---

## 4. Modifier le jeu

- **Les questions** : `assets/js/quiz-data.js`. La structure est
  `quiz[] > niveaux[] > questions[{ q, r[4], ok, explication }]`. `ok` est
  l'index de la bonne reponse dans `r` (les reponses sont remelangees a chaque
  partie). 12 questions sont tirees des 36 du quiz, ponderees vers le niveau
  choisi, en evitant celles de la partie precedente (`localStorage`).
- **Le rendu** : `assets/css/app.css`. Regles de la maison : aucun
  `border-radius`, biseaux nets en `box-shadow`, mouvements en `steps()`,
  `Press Start 2P` reserve aux titres et aux boutons.
- **Apres une mise en ligne** : incrementer `CACHE` dans `sw.js` et le numero
  `BUILD` dans `app.js` (affiche en bas de l'accueil : c'est lui qui dit quelle
  version tourne vraiment sur un telephone).

### Mises a jour : pourquoi le code passe par le reseau d'abord

Le service worker servait **tout** depuis son cache. La navigation, elle, allait
au reseau : on se retrouvait donc avec le nouveau `index.html` et l'ancien
`app.js`, c'est-a-dire des boutons presents mais morts. Depuis, `js`, `css` et
le manifeste passent **par le reseau d'abord**, avec trois secondes de patience
avant de retomber sur le cache — le hors ligne marche toujours, mais une version
melangee n'est plus possible. Polices et icones restent en cache d'abord :
elles ne changent jamais et ce sont les plus lourdes.

En prime, quand une nouvelle version prend la main, la page se recharge toute
seule une fois — sauf en pleine partie, ou elle attend le retour a l'accueil.

### Les quatre facons de repondre

Le mode est choisi automatiquement, question par question, dans
`assets/js/quiz-gameplay.js` :

| Mode | Ce que fait le joueur | Questions concernees |
|---|---|---|
| **scene** | quatre creatures dans le noir ou quatre objets dans un coffre, sans etiquette : il faut reconnaitre | 16 |
| **forge** | il compose une valeur avec des briques (+100, +10, +1...) sans voir la cible | 16 |
| **atelier** | il pose les ingredients dans une grille 3x3 : la reponse est l'objet fabrique | 8 |
| **profondeur** | il descend a la bonne couche dans une coupe verticale du monde | 4 |
| **blocs** | QCM a 4 blocs a toucher | 64 |

**44 questions sur 108 (41 %)** se jouent autrement qu'en QCM.
Par quiz : Survie 27/36, Mobs 11/36, Bedrock 6/36.

Trois regles de loyaute, verifiees par les tests :

- la scene n'est utilisee que si les quatre reponses se dessinent **de facon
  differente** : si deux d'entre elles donneraient la meme image (cheval
  squelette / cheval zombie / mule), la question reste un QCM, sinon on
  demanderait de distinguer deux dessins identiques ;
- l'atelier n'est utilise que si la recette compte **au moins deux ingredients**
  a poser : un seul objet a choisir resterait un QCM deguise ;
- la grille fait **toujours 3x3**, pour que le nombre de cases ne trahisse
  jamais la quantite attendue ;
- la forge n'est utilisee que si les quatre reponses d'origine sont des nombres
  de meme nature, et la cible n'apparait qu'apres validation.

La couche gameplay est **verifiee au chargement** contre le texte de la bonne
reponse : si une reponse change dans `quiz-data.js` sans que la fiche suive, la
question retombe en mode blocs au lieu de proposer une epreuve fausse.

### Les Flash

Onze mini-jeux d'interlude, **trois par partie**, jamais deux fois le meme dans
la meme partie. Ils ne touchent jamais au score de connaissance : etre savant et
etre rapide, ce n'est pas la meme chose.

Casse la forme · le chunk qui fond · le creeper qui gonfle · ne regarde pas
l'Enderman · la peche · la lave qui monte · le coffre memoire · la ruee du
minage · l'esquive du squelette · ghast pong · le MLG au seau.

Ils vivent dans `assets/js/quiz-flash.js`, chacun autonome : pour en ajouter un,
il suffit d'une fiche avec `build`, `tick` et une duree. L'API recue donne
`win()`, `lose()`, les bruitages et les dessins.

### Le son et la musique

Trois pieges de telephone, tous traites dans `snd()` et `reveilAudio()` :

1. `resume()` est **asynchrone** — on attend le reveil du contexte avant de
   programmer les notes, sinon elles tombent dans le passe et on n'entend rien ;
2. le contexte audio doit naitre **pendant un vrai geste** : il est cree au
   tout premier appui sur l'ecran, pas au premier bruitage (certains partent
   d'un minuteur, ce qui ne compte pas comme un geste) ;
3. sur iPhone, le **petit interrupteur silencieux** coupe l'audio web : tant
   qu'un element `<audio>` joue, le systeme bascule en categorie lecture et le
   son passe quand meme. On garde donc un WAV silencieux en boucle, fabrique a
   la volee (aucun fichier a telecharger).

La musique (`assets/js/quiz-music.js`) est une boucle 8 bits de quatre mesures
en la mineur, 112 pulsations par minute, entierement synthetisee : basse,
arpege, melodie et deux percussions, programmes 250 ms a l'avance pour ne pas
hoqueter. Volume discret, fondu d'entree, coupee quand le jeu passe en
arriere-plan. Bouton dedie a cote de celui du son, preference gardee.

### La vitrine

Chaque bonne reponse debloque la creature ou l'objet dont il vient d'etre
question. La collection (66 cases) se garde sur le telephone d'une partie a
l'autre, et l'ecran de score annonce les nouveautes. Bouton en haut a droite de
l'accueil.

### Directeur de partie et rattrapage

- **Variete garantie** : sans lui, « Mobs » et « Bedrock » tiraient douze QCM
  d'affilee, car les seules epreuves jouables de la banque vivent dans
  « Survie ». Il en glisse une quand le vivier le permet, en restant proche du
  niveau choisi, et evite deux fois le meme moteur a la suite.
- **ECHO** : la premiere question ratee revient une fois, environ quatre
  epreuves plus tard. Si c'etait un QCM, elle revient **en duel** entre la
  reponse donnee et la bonne : un autre geste, pas la meme question reposee.
  Le rattrapage **ne change pas le score** — il marque la case de la piste et
  ajoute « RATTRAPÉ » au bilan.

---

## 5. Verifie au telephone

Parcours complet joue automatiquement (Chromium) sur quatre formats :
390x844 (iPhone), 320x568 (petit ecran), 844x390 (paysage), 1440x900 (bureau).

- aucun scroll de page, `100dvh`, encoches gerees (`env(safe-area-inset-*)`) ;
- zones tactiles >= 44 px partout, >= 56 px pour les reponses ;
- pas de debordement horizontal, panneaux qui defilent en interne ;
- 30 parties simulees : la bonne reponse marquee correspond toujours aux
  donnees source, score coherent avec la ligne de recapitulatif ;
- 2000 parties simulees par quiz et par niveau : **100 % contiennent au moins
  une epreuve jouable** (c'etait 0 % pour Mobs et Bedrock avant le directeur) ;
  6 a 8 sur 12 dans Survie, 1 a 2 ailleurs — la banque elle-meme est la limite ;
- aucune recette de l'atelier n'est gagnable sans la connaitre (ni en
  remplissant la grille, ni en posant un de chaque ingredient) ;
- `prefers-reduced-motion`, `forced-colors` et couleurs inversees prises en
  compte ;
- rechargement hors ligne apres installation : partie jouable.

---

## 6. Credits

- Design et contenu : maquettes Claude Design (`design/`), handoff (`docs/`).
- Police [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P),
  auto-hebergee sous licence SIL Open Font License 1.1
  (`assets/fonts/OFL.txt`).
- Projet de fan, sans lien avec Mojang ni Microsoft. Minecraft est une marque
  de Mojang Synergies AB.
