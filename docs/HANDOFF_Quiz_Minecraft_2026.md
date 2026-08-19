# HANDOFF — QUIZ MINECRAFT 2026

**Destinataire** : Claude Design
**Livrable attendu** : un artefact HTML autonome, plein écran, responsive mobile, partageable
**Fichier compagnon** : `quiz_minecraft_2026_questions.json` (banque de 108 questions — à intégrer telle quelle, ne pas réécrire les contenus)

---

## 0. En une phrase

Refonte 2026 d'un quiz Minecraft pour enfants (~10-12 ans, joueurs aguerris) : **3 quiz thématiques × 3 niveaux de difficulté**, avec un écran d'accueil au coucher de soleil sur les îles Sanguinaires d'Ajaccio, où le bouton START fait **lever le soleil** et matérialiser le décor de jeu.

---

## 1. Contexte et intention

L'ancienne version (2025) était un quiz unique à 3 difficultés, look Minecraft.net : dégradé ciel→herbe, panneau clair à grosse bordure noire, titres verts, rendu pixel.

Trois choses changent :

1. **Le contenu est périmé.** Minecraft est passé au versionnage calendaire en 2026 et a livré plusieurs drops majeurs. Les questions ont été refaites à jour (voir §9).
2. **Le public a monté en niveau.** Les enfants visés connaissent le jeu à fond. Le niveau 3 doit être réellement difficile, pas décoratif.
3. **L'accueil devient un moment.** Le lever de soleil sur les Sanguinaires est le geste signature de cette version — c'est ce qui donne envie d'appuyer sur START.

**Ton** : cool, direct, complice. Jamais scolaire. Jamais infantilisant.

---

## 2. Architecture des écrans

```
[1] HOME — crépuscule Sanguinaires + START
              ↓ (transition LEVER DE SOLEIL, ~1800ms)
[2] CHOIX DU QUIZ — 3 cartes
              ↓
[3] CHOIX DU NIVEAU — 3 blocs
              ↓
[4] QUESTION — 12 questions successives
              ↓
[5] RÉSULTAT — score, rang, partage, rejouer
```

Navigation retour possible à chaque étape (bouton pixel « ‹ » en haut à gauche).

---

## 3. Design tokens

### 3.1 Palette CRÉPUSCULE (écran d'accueil uniquement)

Référence : coucher de soleil sur les îles Sanguinaires, Ajaccio. Rouge sang, orange brûlé, violet profond. C'est une palette chaude et saturée, pas pastel.

| Token | Valeur | Usage |
|---|---|---|
| `--sg-night` | `#140A26` | Haut de ciel, fond de page |
| `--sg-violet` | `#3D1B4E` | Ciel médian |
| `--sg-magenta` | `#7A2B52` | Ciel bas |
| `--sg-ember` | `#C43B22` | Bande d'horizon |
| `--sg-orange` | `#F2712C` | Halo solaire |
| `--sg-gold` | `#FFC145` | Disque solaire, accent |
| `--sg-halo` | `#FFE9A8` | Cœur du soleil, reflets |
| `--sg-sea` | `#1E1236` | Mer |
| `--sg-sea-glint` | `#F2712C` | Reflets sur l'eau (opacité 0.35) |
| `--sg-island` | `#0C0714` | Silhouettes des îles |

### 3.2 Palette JOUR (tous les autres écrans — héritée de l'ancien quiz)

| Token | Valeur | Usage |
|---|---|---|
| `--mc-sky-hi` | `#87CEEB` | Haut de ciel |
| `--mc-sky-lo` | `#B8E3F0` | Bas de ciel |
| `--mc-grass-hi` | `#98D982` | Herbe claire |
| `--mc-grass-lo` | `#567D46` | Herbe sombre |
| `--mc-dirt` | `#8B5A2B` | Terre |
| `--mc-stone` | `#7A7A7A` | Pierre |

### 3.3 Palette UI (panneaux et boutons)

| Token | Valeur | Usage |
|---|---|---|
| `--ui-panel` | `#F5F5F5` | Fond des panneaux |
| `--ui-panel-2` | `#E4E4E4` | Fond alterné, zones creuses |
| `--ui-ink` | `#2B2B2B` | Texte principal |
| `--ui-ink-2` | `#6A6A6A` | Texte secondaire |
| `--ui-border` | `#333333` | Bordure principale (8px) |
| `--ui-border-2` | `#555555` | Halo de bordure 1 |
| `--ui-border-3` | `#777777` | Halo de bordure 2 |
| `--ui-green` | `#3B8526` | Titres, accent principal |
| `--ui-green-hi` | `#4CAF3E` | Survol, barre d'XP |
| `--ui-gold` | `#FFC145` | Score, étoiles, rang |
| `--ui-red` | `#C4362B` | Erreur, cœurs perdus |
| `--ui-blue` | `#3A7BBF` | Info, bouton secondaire |

### 3.4 Feedback

| Token | Valeur | Usage |
|---|---|---|
| `--ok` | `#4CAF3E` | Bonne réponse |
| `--ok-deep` | `#2E7D22` | Bevel bas de bouton correct |
| `--ko` | `#C4362B` | Mauvaise réponse |
| `--ko-deep` | `#8E2419` | Bevel bas de bouton faux |

### 3.5 Typographie

| Token | Valeur | Usage |
|---|---|---|
| `--font-display` | `'Press Start 2P', monospace` | Titres, labels, boutons courts, score, chiffres |
| `--font-body` | `-apple-system, 'Segoe UI', Roboto, sans-serif` | Énoncés des questions, libellés de réponses, textes longs |

**Règle non négociable** : `Press Start 2P` est illisible au-delà de ~5 mots. Il est réservé aux titres, aux étiquettes courtes et aux chiffres. Tout ce qui est phrase complète passe en `--font-body`.

| Échelle | Taille | Interlignage | Usage |
|---|---|---|---|
| Display XL | `clamp(22px, 6vw, 42px)` | 1.4 | Titre HOME |
| Display L | `clamp(15px, 3.6vw, 22px)` | 1.5 | Titres d'écran |
| Display M | `clamp(11px, 2.6vw, 14px)` | 1.6 | Labels de boutons, nom de quiz |
| Display S | `clamp(8px, 2vw, 10px)` | 1.8 | Compteurs, tags, mention 2026 |
| Body L | `clamp(16px, 4.2vw, 22px)` | 1.45 | Énoncé de question |
| Body M | `clamp(14px, 3.6vw, 17px)` | 1.4 | Libellé de réponse |
| Body S | `clamp(12px, 3vw, 14px)` | 1.5 | Explication après réponse |

### 3.6 Espacement et forme

| Token | Valeur |
|---|---|
| `--sp-1` | `4px` |
| `--sp-2` | `8px` |
| `--sp-3` | `12px` |
| `--sp-4` | `16px` |
| `--sp-5` | `24px` |
| `--sp-6` | `32px` |
| `--sp-7` | `48px` |
| `--radius` | `0` — **zéro arrondi partout**, c'est du pixel |
| `--px` | `4px` — unité de bevel (bordure 3D des boutons) |

---

## 4. Recettes de matière

### 4.1 Panneau principal (héritage de l'ancien quiz, à conserver)

```css
background: var(--ui-panel);
border: 8px solid var(--ui-border);
border-radius: 0;
box-shadow:
  0 0 0 4px var(--ui-border-2),
  0 0 0 8px var(--ui-border-3),
  0 10px 30px rgba(0,0,0,.5);
image-rendering: pixelated;
```

### 4.2 Bouton bloc (le composant central)

Un bouton doit **ressembler à un bloc Minecraft posé** : lumière en haut/gauche, ombre en bas/droite.

```css
/* état repos */
background: var(--c-face);
border: 0;
border-radius: 0;
box-shadow:
  inset  4px  4px 0 0 var(--c-light),   /* biseau clair haut-gauche */
  inset -4px -4px 0 0 var(--c-dark),    /* biseau sombre bas-droite */
  0 4px 0 0 var(--c-deep),              /* épaisseur du bloc */
  0 6px 10px rgba(0,0,0,.25);
transform: translateY(0);
transition: transform 90ms steps(2), box-shadow 90ms steps(2), filter 120ms linear;
```

- **Survol** : `transform: translateY(-3px)` + `filter: brightness(1.08)` + ombre portée renforcée
- **Pressé** : `transform: translateY(4px)`, l'épaisseur `0 4px 0` passe à `0 0 0`, les biseaux s'inversent (clair en bas-droite). Le bloc s'enfonce.
- **Désactivé** : `filter: grayscale(.6) opacity(.45)`, pas de transform

**Utiliser `steps(2)` sur les transitions de transform**, pas de easing continu : le mouvement doit être saccadé, pixel, pas fluide et « web ».

### 4.3 Grille pixel de fond (héritée, à conserver)

```css
background-image:
  repeating-linear-gradient(0deg, transparent 0 20px, rgba(255,255,255,.03) 20px 40px),
  repeating-linear-gradient(90deg, transparent 0 20px, rgba(255,255,255,.03) 20px 40px);
```

---

## 5. Écran [1] — HOME : crépuscule sur les Sanguinaires

### 5.1 Composition

Empilement de bas en haut de l'écran :

```
┌─────────────────────────────────────┐
│  ciel dégradé (night→violet→        │  ← 0 à 62% de la hauteur
│  magenta→ember vers l'horizon)      │
│                                     │
│         ○  soleil (couchant)        │  ← posé à ~58%, moitié immergé
│  ▂▄█▄▂    silhouettes des îles      │  ← bande à 58-64%
│ ≈≈≈≈≈≈≈≈  mer + reflets             │  ← 64 à 100%
│                                     │
│      QUIZ MINECRAFT                 │  ← titre, superposé, centré
│      ┌──────────────┐               │
│      │   ▶ START    │               │  ← bouton bloc, or sur bordure noire
│      └──────────────┘               │
│  éd. 2026 · à jour 26.3             │  ← bas-gauche, Display S, opacité .55
└─────────────────────────────────────┘
```

### 5.2 Le décor, en pixel art CSS/SVG

**Ne pas utiliser d'image bitmap.** Tout est construit en CSS/SVG pour rester net à toutes les tailles et léger.

- **Ciel** : `linear-gradient(180deg, var(--sg-night) 0%, var(--sg-violet) 30%, var(--sg-magenta) 48%, var(--sg-ember) 57%, var(--sg-orange) 61%)`
- **Soleil** : un carré (pas un cercle — c'est Minecraft) de `clamp(48px, 12vw, 96px)`, `background: var(--sg-gold)`, avec un halo `box-shadow: 0 0 60px 30px rgba(242,113,44,.45), 0 0 140px 70px rgba(196,59,34,.25)`. Positionné à 58% de hauteur, moitié masqué par la ligne d'horizon.
- **Îles Sanguinaires** : 3 silhouettes en `--sg-island`, profils **en escalier de blocs** (pas de courbes). L'île principale (Mezzu Mare) au centre-gauche, plus haute, avec une petite tour carrée au sommet — clin d'œil à la tour de la Parata. Les deux autres plus basses, à droite. Construction : `clip-path: polygon()` avec des angles droits uniquement, ou une série de `<rect>` SVG.
- **Mer** : `linear-gradient(180deg, var(--sg-sea) 0%, #0E0820 100%)` + une colonne de reflets sous le soleil : 7 à 9 rectangles horizontaux de largeurs décroissantes en `--sg-sea-glint`, opacités échelonnées de .5 à .12.
- **Nuages** : 3 barres pixel horizontales en `--sg-magenta` à 45% d'opacité, dans le tiers haut.

### 5.3 Animations d'attente (idle)

| Élément | Animation | Durée | Easing |
|---|---|---|---|
| Halo solaire | pulsation d'opacité .85 ↔ 1 | 4000ms | `ease-in-out`, infinite alternate |
| Reflets sur la mer | chaque barre décale sa largeur ±8%, en décalage de phase | 3000ms | `steps(4)`, infinite |
| Nuages | translation horizontale lente, −6% → +6% | 40000ms | `linear`, infinite alternate |
| Bouton START | respiration `scale(1)` → `scale(1.03)` | 2200ms | `ease-in-out`, infinite alternate |
| Titre | aucune. Il reste stable. | — | — |

### 5.4 Le bouton START

- Taille : `min-width: 220px`, hauteur `64px`, `--font-display` à Display M
- Couleurs : face `--sg-gold`, biseau clair `--sg-halo`, biseau sombre `#C99416`, épaisseur `#8F6A0E`
- Libellé : `▶ START`
- Zone tactile : au moins 64px de haut, marge de 12px tout autour

---

## 6. La transition signature — LEVER DE SOLEIL

C'est le morceau de bravoure. Séquence déclenchée au clic sur START, durée totale **1800ms**, non interruptible, non skippable (elle est courte).

| # | t (ms) | Élément | Ce qui se passe | Easing |
|---|---|---|---|---|
| 1 | 0 → 120 | Bouton START | S'enfonce (`translateY(4px)`), biseaux inversés, puis disparaît en `steps(3)` | `steps(3)` |
| 2 | 100 → 1400 | Soleil | Monte de 58% à 14% de hauteur. Le carré grandit de ×1 à ×1.35. Le halo s'intensifie et vire de `--sg-orange` à `--sg-halo`. | `cubic-bezier(.16,.84,.44,1)` |
| 3 | 200 → 1300 | Ciel | Crossfade du dégradé crépuscule vers le dégradé jour (`--mc-sky-hi` → `--mc-sky-lo`). Passer par une étape intermédiaire rosée à t=700ms (`#FF9E7A`). | `ease-in-out` |
| 4 | 400 → 1200 | Îles | Les silhouettes s'éclaircissent de `--sg-island` vers `--mc-grass-lo`, puis descendent hors champ (`translateY(120%)`) | `ease-in` |
| 5 | 500 → 1500 | Mer → herbe | La mer est remplacée par une bande d'herbe. **Matérialisation par blocs** : une grille de carrés de 24px apparaît de bas en haut, stagger de 22ms par rangée, chaque bloc en `scale(0)` → `scale(1)` sur 180ms. | `steps(3)` par bloc |
| 6 | 900 → 1500 | Nuages | Passent de `--sg-magenta` à blanc, opacité .45 → .85 | `linear` |
| 7 | 1300 → 1800 | Panneau de choix | Entre par le bas : `translateY(40px) + opacity 0` → `translateY(0) + opacity 1`, avec un léger dépassement (overshoot de 6px) | `cubic-bezier(.34,1.4,.64,1)` |
| 8 | 1500 → 1800 | Particules | 12 à 16 petits carrés dorés (4-8px) montent depuis la ligne d'herbe et s'effacent | `ease-out` |

**Retour arrière** : si l'enfant revient à l'accueil, rejouer la séquence à l'envers sur 900ms (deux fois plus rapide).

**`prefers-reduced-motion`** : remplacer toute la séquence par un simple crossfade de 300ms entre les deux états. Le soleil se repositionne sans trajectoire.

---

## 7. Écran [2] — Choix du quiz

3 cartes empilées (mobile) ou en ligne (desktop). Chaque carte est un bloc au sens du §4.2, avec :

- Un **pictogramme pixel** en SVG (24×24 upscalé, `image-rendering: pixelated`)
- Le **nom du quiz** en Display M
- Une **ligne de description** en Body S
- Une **bande de couleur** de 8px en haut de la carte

| # | Quiz | Bande | Picto | Description |
|---|---|---|---|---|
| 1 | SURVIE & CRAFT | `--mc-dirt` `#8B5A2B` | Pioche | Blocs, outils, recettes, les bases qui sauvent la vie |
| 2 | MOBS & MONDES | `--ui-green` `#3B8526` | Creeper | Créatures, biomes, dimensions, structures |
| 3 | BEDROCK & 2026 | `--sg-orange` `#F2712C` | Bloc de cuivre | Bedrock, Marketplace et tout ce qui est sorti récemment |

**Micro-animation au survol** : la carte se soulève de 4px, la bande de couleur s'épaissit de 8px à 12px en `steps(2)`, le picto fait un petit saut (`translateY(-3px)` puis retour, 200ms).

---

## 8. Écran [3] — Choix du niveau

3 blocs horizontaux pleine largeur. Métaphore : **les minerais**.

| Niveau | Nom | Couleur de face | Picto | Sous-titre |
|---|---|---|---|---|
| 1 | DÉBUTANT | `#8B8B8B` (pierre) | Bloc de pierre | Tu connais les bases |
| 2 | CONFIRMÉ | `#C4362B` → non, `#D9A441` (or) | Bloc d'or | Tu joues sérieusement |
| 3 | EXPERT | `#4FD9D0` (diamant) | Bloc de diamant | Tu connais les chiffres exacts |

**Micro-animation** : au survol, le picto de minerai « scintille » — un carré blanc à 60% d'opacité traverse le bloc en diagonale sur 600ms, comme un reflet. Effet `steps(6)` pour rester pixel.

Chaque bloc affiche en Display S : `12 QUESTIONS`.

---

## 9. Écran [4] — Question

### 9.1 Composition

```
┌───────────────────────────────────────┐
│ ‹    MOBS & MONDES · EXPERT      ♥♥♥  │  ← barre haute
│ ███████████░░░░░░░░░░░  7/12          │  ← barre d'XP
├───────────────────────────────────────┤
│                                       │
│   Combien de points de vie            │  ← énoncé, Body L
│   a le Warden ?                       │
│                                       │
│   ┌─────────────┐ ┌─────────────┐     │
│   │     200     │ │     300     │     │  ← 4 boutons blocs
│   └─────────────┘ └─────────────┘     │
│   ┌─────────────┐ ┌─────────────┐     │
│   │     500     │ │    1000     │     │
│   └─────────────┘ └─────────────┘     │
│                                       │
└───────────────────────────────────────┘
```

- **Desktop** : réponses en grille 2×2
- **Mobile** : réponses empilées en 1 colonne, hauteur min 56px chacune

### 9.2 Barre d'XP

Reprendre l'esthétique de la barre d'expérience de Minecraft : fond `#3A3A3A` creusé (`inset 0 2px 0 rgba(0,0,0,.5)`), remplissage `--ui-green-hi` avec un liseré clair de 2px en haut. Hauteur 14px. Zéro arrondi.

L'incrément se fait en `steps(8)` sur 400ms — la barre monte par crans, pas en glissant.

### 9.3 Cœurs

3 cœurs pixel en `--ui-red`. À chaque mauvaise réponse, un cœur se vide : passage à un contour vide `#5A2621`, avec un flash blanc de 80ms et une secousse de 4px. À 0 cœur, on ne coupe pas la partie — on continue jusqu'au bout mais le rang final est plafonné. **Ne jamais interrompre un enfant en cours de quiz.**

### 9.4 Cycle de réponse — micro-animations

C'est le point que tu voulais travailler. Séquence en 4 temps :

**Temps 1 — pression (0-90ms)**
Le bouton s'enfonce (§4.2). Rien d'autre ne bouge. Tous les autres boutons deviennent `pointer-events: none` immédiatement.

**Temps 2 — révélation (90-260ms)**

*Si correct :*
- Le bouton passe en `--ok` avec biseaux `--ok-deep`
- Il « pope » : `scale(1)` → `scale(1.06)` → `scale(1)` en 220ms, `steps(3)`
- **8 à 12 particules carrées** (4px, `--ui-gold` et `--ok`) jaillissent vers le haut en éventail, trajectoire parabolique, disparition en 450ms
- Un halo vert se diffuse depuis le bouton et se dissipe (`box-shadow` de 0 à 40px, opacité 1 → 0)

*Si faux :*
- Le bouton passe en `--ko` avec biseaux `--ko-deep`
- **Secousse** : `translateX` −5px / +5px / −3px / +3px / 0, sur 280ms en `steps(1)` par palier
- Le bouton se fissure : superposer un SVG de craquelure pixel (3 traits blancs à 30% d'opacité) qui apparaît en `steps(3)`
- **Simultanément**, le bon bouton s'illumine en `--ok` avec une pulsation lente (2 battements sur 700ms)

**Temps 3 — atténuation (260-400ms)**
Les 2 (ou 3) boutons non concernés passent à `opacity: .35` et `filter: grayscale(.7)` en 140ms.

**Temps 4 — explication (400ms →)**
Un bandeau apparaît sous les réponses : fond `--ui-panel-2`, liseré gauche de 4px en `--ok` ou `--ko`, texte en Body S. Il contient le champ `explication` du JSON. Entrée : `translateY(8px)` + fade sur 180ms.

Le bouton `SUIVANT ›` apparaît 200ms après, en bas à droite.

**Avance automatique** : non. L'enfant clique pour continuer — il doit avoir le temps de lire l'explication.

### 9.5 Transition entre questions

Sortie de l'ancienne question : `translateX(-24px)` + fade, 180ms.
Entrée de la nouvelle : `translateX(24px)` → 0 + fade, 220ms, décalée de 80ms.
Les boutons de réponse entrent en **stagger de 45ms** chacun, avec un léger overshoot.

---

## 10. Écran [5] — Résultat

### 10.1 Composition

- **Score** en Display XL, `--ui-gold` : `9/12`
- **Rang** en Display L, dépend du score :

| Score | Rang | Couleur |
|---|---|---|
| 12/12 | ARCHITECTE DU NETHER | `#4FD9D0` |
| 10-11 | MAÎTRE BÂTISSEUR | `--ui-gold` |
| 7-9 | AVENTURIER CONFIRMÉ | `--ui-green` |
| 4-6 | EXPLORATEUR | `--mc-dirt` |
| 0-3 | NOUVEAU NÉ | `--ui-ink-2` |

- Une **ligne de commentaire** en Body M, ton complice, jamais culpabilisant. Exemple pour 4/12 : « Tu as encore des grottes à explorer. Retente ! »
- **Récapitulatif** : liste compacte des 12 questions avec une pastille verte/rouge, cliquable pour revoir la bonne réponse.

### 10.2 Animation d'arrivée

1. Le panneau entre (300ms)
2. Le score **compte** de 0 au score final, en `steps`, sur 800ms
3. À l'arrêt du compteur : burst de particules dorées (20-30 carrés), 700ms
4. Le rang apparaît avec un léger zoom (`scale(.9)` → `scale(1)`, overshoot), 350ms
5. Le récapitulatif entre en stagger de 40ms par ligne

Si score parfait : ajouter une pluie de particules dorées pendant 2s et faire vibrer légèrement le titre.

### 10.3 Partage

Deux boutons :
- `PARTAGER` — `navigator.share()` si dispo, sinon copie dans le presse-papier avec confirmation « Copié ! » pendant 1.5s
- `REJOUER` — retour au choix du niveau (pas à l'accueil)

**Texte partagé** :
```
Quiz Minecraft 2026 — Mobs & Mondes · Expert
Score : 9/12 — AVENTURIER CONFIRMÉ
🟩🟩🟥🟩🟩🟩🟥🟩🟩🟩🟥🟩
```
La ligne de carrés reprend l'idée Wordle : vert = juste, rouge = faux, dans l'ordre des questions. C'est ce qui donne envie de comparer entre copains.

---

## 11. Responsive

| Breakpoint | Comportement |
|---|---|
| **< 480px** (mobile portrait) | Réponses en 1 colonne. Panneau à `width: 100%` avec `padding: var(--sp-4)`, bordure réduite à 6px. Titre HOME en Display XL bas de fourchette. Soleil à `48px`. |
| **480-768px** | Réponses en 1 colonne mais plus larges. Cartes de quiz empilées. |
| **768-1024px** | Réponses en grille 2×2. Cartes de quiz en 3 colonnes. |
| **> 1024px** | Panneau `max-width: 860px` centré. Décor visible tout autour. |

### Contraintes mobiles impératives

- **Plein écran réel** : `height: 100dvh` (pas `100vh` — la barre d'URL iOS casse `vh`)
- **Aucun scroll de page.** `overflow: hidden` sur `body`. Si le contenu déborde, c'est le panneau qui scrolle en interne (`overflow-y: auto`).
- Zone tactile minimum **56px** de hauteur pour toute réponse, **44px** pour les boutons secondaires
- `user-select: none` sur les boutons (évite la sélection accidentelle au tap long)
- `-webkit-tap-highlight-color: transparent` (le halo bleu iOS casse l'esthétique pixel)
- Prévoir `padding-bottom: env(safe-area-inset-bottom)` sur la barre du bas

---

## 12. Contraintes techniques d'affichage — À NE PAS OMETTRE

Problème constaté et reproduit : dans la visionneuse de fichiers de l'app iOS, le fond de `html`/`body` est repeint **après** le CSS du livrable. Tout élément qui n'a pas de `background-color` explicite hérite d'un fond imprévu, et on se retrouve avec du texte sombre sur fond sombre.

**Recette obligatoire :**

```css
:root { color-scheme: only light; }

html, body {
  background-color: #140A26 !important;   /* couleur de l'écran courant */
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-color: #140A26;
  z-index: -1;
}
```

Plus, impérativement :

1. **Un `background-color` explicite sur chaque conteneur structurel** — `.shell`, `main`, `header`, `section`, `footer`, `.panel`, `.wrap`. Aucune surface ne doit dépendre du fond de `body`.
2. Réaffirmer tous ces fonds dans `@media (prefers-color-scheme: dark)`.
3. Conserver :
```css
@media (forced-colors: active) { * { forced-color-adjust: none; } }
@media (inverted-colors: inverted) {
  html { filter: invert(1) hue-rotate(180deg); }
  img, canvas, video, svg { filter: invert(1) hue-rotate(180deg); }
}
```
4. Comme un filtre sur `html` casse `position: fixed`, toute barre fixe doit être en `position: sticky`.
5. **Jamais de couleurs système** (`Canvas`, `CanvasText`, `ButtonFace`).
6. Ajouter `<meta name="color-scheme" content="only light">` dans le `<head>`.

Note : le fond de `html`/`body` change entre l'accueil (`#140A26`) et le reste (`#87CEEB`). Le piloter par une variable CSS mise à jour en JS sur le `<html>`, pas par une classe qui laisserait une surface non couverte pendant la transition.

---

## 13. Structure de données

Le fichier `quiz_minecraft_2026_questions.json` a cette forme :

```json
{
  "version": "2026.1",
  "aJour": "26.3",
  "quiz": [
    {
      "id": "survie",
      "titre": "SURVIE & CRAFT",
      "description": "Blocs, outils, recettes...",
      "couleur": "#8B5A2B",
      "niveaux": [
        {
          "id": 1,
          "nom": "DÉBUTANT",
          "questions": [
            {
              "q": "Combien de planches obtient-on avec une bûche ?",
              "r": ["2", "3", "4", "6"],
              "ok": 2,
              "explication": "Une bûche donne toujours 4 planches."
            }
          ]
        }
      ]
    }
  ]
}
```

- `ok` est l'**index** de la bonne réponse (0-3)
- `explication` est obligatoire sur chaque question, max 140 caractères
- **Mélanger l'ordre des réponses à l'exécution** (Fisher-Yates) et recalculer l'index — sinon les enfants repèrent que la bonne réponse est souvent en 3e position

---

## 14. Accessibilité

- **Ordre de focus** : titre → questions → réponses dans l'ordre visuel → bouton suivant
- Chaque bouton de réponse : `role="button"`, `aria-label` reprenant le texte complet
- Après une réponse, annoncer via `aria-live="polite"` : « Correct » ou « Incorrect, la bonne réponse était X »
- **Navigation clavier complète** : `1`-`4` pour répondre, `Entrée` pour continuer, `Échap` pour revenir
- Contraste : vérifier que `--ui-ink` sur `--ui-panel` passe AA (il passe : 12.6:1). Attention au texte blanc sur `--ui-gold` — utiliser `--ui-ink` à la place.
- Ne jamais coder une information **uniquement** par la couleur : le bon/faux est aussi signalé par le picto (✓ / ✗) et par la fissure sur le bouton faux.
- `prefers-reduced-motion` : supprimer secousses, particules, pop et la séquence de lever de soleil. Garder les fades.

---

## 15. Cas limites

- **Énoncé long** : l'énoncé peut aller jusqu'à 3 lignes. Au-delà, réduire la taille d'un cran plutôt que tronquer. Jamais d'ellipse sur une question.
- **Libellé de réponse long** : passer à 2 lignes, le bouton grandit. Ne jamais tronquer une réponse.
- **Retour en arrière en cours de quiz** : demander confirmation (« Tu vas perdre ta progression. Continuer ? »)
- **Rechargement de page** : la progression est perdue, c'est acceptable. Ne pas persister.
- **Partage indisponible** : `navigator.share` absent → bascule silencieuse sur la copie presse-papier.
- **Double-tap rapide** : verrouiller les réponses dès le premier tap (§9.4 Temps 1).

---

## 16. Ce qu'il ne faut surtout pas faire

- Pas d'arrondi. Nulle part. Zéro `border-radius`.
- Pas de dégradé doux sur les boutons — ce sont des blocs, ils sont plats avec des biseaux nets.
- Pas de `ease-in-out` sur les mouvements de bouton — `steps()` obligatoire, le rendu doit être saccadé.
- Pas de `Press Start 2P` sur les phrases.
- Pas de bascule thème sombre/clair. Le livrable a ses deux ambiances (crépuscule / jour) pilotées par la narration, pas par un toggle.
- Pas d'avance automatique après une réponse.
- Pas d'écran de game over qui coupe la partie.
- Pas d'emoji dans l'interface. Les seuls carrés colorés autorisés sont ceux du texte de partage.

---

## 17. Checklist de livraison

- [ ] Fichier HTML unique, CSS et JS inline
- [ ] `quiz_minecraft_2026_questions.json` intégré (inline dans le JS, pas de fetch externe)
- [ ] `100dvh`, aucun scroll de page
- [ ] Testé en portrait 390×844 (iPhone) et 1440×900
- [ ] Recette anti-repeint iOS du §12 appliquée intégralement
- [ ] Mention `éd. 2026 · à jour 26.3` présente en bas-gauche de l'accueil, Display S, opacité .55
- [ ] Séquence de lever de soleil complète et fluide sur mobile
- [ ] `prefers-reduced-motion` géré
- [ ] Partage fonctionnel avec fallback presse-papier
- [ ] Réponses mélangées à chaque partie
