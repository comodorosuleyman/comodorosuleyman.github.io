# Site de Comodoro Süleyman

Site vitrine de Comodoro Süleyman, bassiste, compositeur et dessinateur (album *Burnin' Chamber Music (!)*).
En ligne sur https://comodorosuleyman.com, hébergé par GitHub Pages depuis la branche `master`.

Je parle français : réponds-moi en français.

## Technique

- Site **statique** en HTML, CSS et JS pur, sans framework, sans build et sans dépendances. Les fichiers sont servis tels quels.
- Tout le style est dans `styles.css`. Les commentaires du CSS sont en français.
- Scripts : `new-player.js` (lecteur audio), `lightbox.js`, `comodoro-gallery.js`, `hand-player.js`, `audio-quality.js`.
- Pour prévisualiser en local : `python3 -m http.server` à la racine, puis ouvrir http://localhost:8000.

## Pages et langues

- Chaque page existe en **4 langues** : anglais (sans suffixe), français (`-fr`), espagnol (`-es`) et roumain (`-ro`).
  Exemple : `audio.html`, `audio-fr.html`, `audio-es.html`, `audio-ro.html`.
- Pages : `index` (accueil illustré cliquable), `audio`, `video`, `codex`, `argumentum`, `agenda`, `contact`, `comodoro`, `mentions-legales`.
- `index.html` est la page d'entrée (canonique `/`). `galerie.html` et `galerie-2.html` (« Imagines ») n'existent qu'en anglais.
- **Règle : toute modification de contenu, de structure ou de lien doit être reportée dans les 4 versions**, sauf si je dis le contraire. Adapte la traduction, sans recopier mot à mot.
- Chaque page contient ses balises SEO (title, description, canonical, Open Graph, parfois JSON-LD). Mets-les à jour en même temps que le contenu. Ajoute toute nouvelle page à `sitemap.xml`.

## Cache-busting

- Les ressources sont versionnées par paramètre : `styles.css?v=341`, `titre-audio.png?v=2`, `new-player.js?v=6`…
- Quand tu modifies `styles.css`, un script ou une image existante, **incrémente le `?v=`** dans les pages concernées. Pour `styles.css`, prends le numéro le plus haut utilisé sur le site + 1.

## Images

- L'univers visuel repose sur des dessins à l'encre scannés. Les titres et les boutons sont des images de lettrage à la main (`titre-*.png`, `glow-*.png`). Ne les remplace pas par du texte.
- Il existe des variantes allégées : `-full.jpg` pour l'agrandissement, une miniature pour la grille, `-mobile.jpg` pour le mobile. Garde les images lourdes optimisées.
- Mets un texte `alt` fidèle au dessin.
- Couleurs principales : fond `#f0d5c2`, rouge `--rouge: #7a1414`, fond de l'accueil `#160404`. Police : Georgia.
- Vérifie chaque changement visuel **sur desktop et sur mobile** (point de rupture principal à 640px).

## Git et publication

- Messages de commit **en anglais**, à l'impératif, courts et descriptifs (ex. « Enlarge the contact page drawing on desktop »).
- On travaille directement sur `master`.
- **Ne jamais faire de `git push` sans mon accord explicite** : un push met le site en ligne immédiatement.
- Ne pas toucher à `CNAME`, `.nojekyll`, `robots.txt` ni au fichier de vérification Google (`google*.html`) sans raison.

## Mes préférences

<!-- À compléter : ton, style d'écriture, choses à éviter, etc. -->
