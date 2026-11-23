# Site de Comodoro Süleyman

Site vitrine de Comodoro Süleyman, bassiste, compositeur et dessinateur (album *Burnin' Chamber Music (!)*).
En ligne sur https://comodorosuleyman.com, hébergé par GitHub Pages depuis la branche `master`.

Je parle français : réponds-moi en français.

## Technique

- Site **statique** en HTML, CSS et JS pur, sans framework, sans build et sans dépendances. Les fichiers sont servis tels quels.
- Tout le style est dans `styles.css`. Les commentaires du CSS sont en français.
- Scripts : `new-player.js` (lecteur audio), `lightbox.js`, `comodoro-gallery.js`.
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

## Pas de scroll dans la frise sur mobile

- La « frise » est le cadre dessiné des pages secondaires (`.frame-page`, avec le contenu dans `.frame-content`).
- **En version mobile, on ne doit jamais pouvoir scroller à l'intérieur de la frise.** Le contenu doit tenir dans le cadre : réduis, réorganise ou déplace-le hors du cadre plutôt que de le laisser déborder.
- Une exception (une page où un scroll interne serait accepté) demande **mon accord explicite**, au cas par cas. Si une modification risque de créer ce scroll, arrête-toi et demande-moi avant.
- Exception déjà accordée : la page **audio** (lecteur en pleine largeur sur mobile, voir le commentaire dans `styles.css`).
- Après chaque changement sur une page à frise, vérifie sur mobile que `.frame-content` ne déborde pas (`scrollHeight` ≤ `clientHeight`, ni en largeur). Teste **sans** gouttière de barre de défilement : les téléphones ont des barres superposées, le contenu y est donc plus large que dans un navigateur desktop rétréci.

## Loupe (agrandissement des dessins)

- Quand on agrandit un dessin avec la loupe, il doit s'afficher **au maximum en largeur, bord à bord**, sur desktop comme sur mobile, sans scroll horizontal (scroll vertical permis si le dessin est plus haut que l'écran).
- Deux systèmes : `lightbox.js` (pages contact, comodoro, codex…) et le diaporama de `comodoro-gallery.js` (galeries, la loupe s'active au clic sur l'image).
- Pour l'agrandissement, utilise une version haute résolution quand elle existe (attribut `data-full`), pour que le dessin ne soit pas flou en pleine largeur. Elle doit avoir **le même effet jauni** que l'image affichée dans la page.
- Si aucune version haute résolution n'existe, l'attribut `data-lightbox-native` plafonne l'agrandi à la taille réelle de l'image, pour qu'elle ne soit pas floue (cas de `comodoro-art-bottom.jpg`).

## Effet jauni (patine)

- La plupart des dessins scannés du site ont une patine chaude et jaunie : une courbe de tons par canal R/V/B, appliquée au fichier image (pas en CSS).
- **Exception : les dessins de la galerie Imagines** (`comodoro-dessin-*`, `contact-crow-gallery*`) restent **sans** patine, au plus près des originaux (ils sont à vendre).
- La courbe n'est pas stockée telle quelle. Pour la retrouver, on compare un fichier avant/après patine : `comodoro-dessin-6-full.jpg` (sans patine) et sa version au commit `d2ae4f7` (avec patine). Applique-la toujours à l'**original sans patine**, jamais à une image déjà jaunie.

## Git et publication

- Messages de commit **en anglais**, à l'impératif, courts et descriptifs (ex. « Enlarge the contact page drawing on desktop »).
- On travaille directement sur `master`.
- **Ne jamais faire de `git push` sans mon accord explicite** : un push met le site en ligne immédiatement.
- Ne pas toucher à `CNAME`, `.nojekyll`, `robots.txt` ni au fichier de vérification Google (`google*.html`) sans raison.

## Mes préférences

<!-- À compléter : ton, style d'écriture, choses à éviter, etc. -->
