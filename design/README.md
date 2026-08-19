# Maquettes d'origine (Claude Design)

Ces deux fichiers `.dc.html` sont les prototypes exportes depuis Claude Design
(claude.ai/design). `Quiz Minecraft Arcade.dc.html` est la maquette de reference :
c'est elle qui a ete portee dans le jeu livre a la racine du depot.

Ils sont conserves comme source de verite visuelle (palette, animations, textes),
**pas** comme code executable : ils s'appuient sur le moteur `support.js` de
Claude Design, qui a besoin de React et n'est pas embarque ici. Ils ne
s'affichent donc pas dans un navigateur en l'etat.

Pour retoucher le rendu du jeu, modifier `assets/css/app.css` et
`assets/js/app.js`, en gardant ces maquettes comme reference.
