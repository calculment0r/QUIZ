# Quiz Minecraft 2026

Jeu de quiz Minecraft jouable au telephone : **3 quiz thematiques x 3 niveaux**,
108 questions a jour, lever de soleil sur les iles Sanguinaires, mini-jeux flash,
score partageable. Site statique, sans build, installable comme application.

Adresse une fois GitHub Pages actif : **https://calculment0r.github.io/QUIZ/**

---

## 1. Mettre en ligne (GitHub Pages)

Le depot contient le workflow `.github/workflows/deploy-pages.yml` : chaque push
publie le site. Il reste **une chose a faire une seule fois**, cote GitHub :

1. Depot > **Settings** > **Pages**
2. *Build and deployment* > **Source** : choisir **GitHub Actions**
3. Onglet **Actions** : relancer `Deploy to GitHub Pages` si besoin (bouton *Run workflow*)

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
assets/fonts/               Press Start 2P auto-hebergee (+ licence OFL)
assets/icons/               icones pixel de l'application
design/                     maquettes Claude Design d'origine (reference)
docs/                       handoff, direction de jeu, questions source
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
- **Apres une mise en ligne** : incrementer `CACHE` dans `sw.js`
  (`mcq2026-v1` → `mcq2026-v2`) pour que les telephones deja installes
  recuperent la nouvelle version.

Deux modes de reponse, choisis automatiquement selon la question :

- **blocs** : 4 blocs a toucher (1 colonne, 2 si les reponses sont courtes) ;
- **profondeur** : quand la question parle de hauteur, de niveau de lumiere ou
  de creuser, les reponses deviennent des paliers dans une coupe verticale du
  monde, et il faut valider avec le gros bouton.

---

## 5. Verifie au telephone

Parcours complet joue automatiquement (Chromium) sur quatre formats :
390x844 (iPhone), 320x568 (petit ecran), 844x390 (paysage), 1440x900 (bureau).

- aucun scroll de page, `100dvh`, encoches gerees (`env(safe-area-inset-*)`) ;
- zones tactiles >= 44 px partout, >= 56 px pour les reponses ;
- pas de debordement horizontal, panneaux qui defilent en interne ;
- 30 parties simulees : la bonne reponse marquee correspond toujours aux
  donnees source, score coherent avec la ligne de recapitulatif ;
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
