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

## Pas de scroll dans la frise — RÈGLE ABSOLUE

- La « frise » est le cadre dessiné des pages secondaires (`.frame-page`, avec le contenu dans `.frame-content`).
- **On ne doit jamais pouvoir scroller à l'intérieur de la frise, sur aucune page, ni sur mobile ni sur desktop.** Aucune exception (l'ancienne dérogation de la page audio est supprimée).
- Garde-fou technique : `.frame-content` (et tout bloc scrollable placé dans la frise, ex. `.native-audio-tracklist`) est en `overflow: hidden`. Ne jamais repasser en `auto`/`scroll`. Un contenu trop grand serait rogné : on corrige la taille, la disposition ou on le sort du cadre, jamais en rouvrant le scroll.
- **À appliquer à tout nouvel ajout ou modification** sur une page à frise. Si un changement ne peut pas tenir dans le cadre, arrête-toi et demande-moi avant.
- Après chaque changement, vérifie sur toutes les pages à frise (4 langues + galeries), mobile et desktop, que `.frame-content` ne déborde pas : `scrollHeight` ≤ `clientHeight` et `scrollWidth` ≤ `clientWidth`. Tailles minimales à tester : 320×568, 360×640, 375×667, 390×844, 414×896, 600×900 (en émulation mobile), puis 641×900, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, 2560×1440. Teste le mobile **sans** gouttière de barre de défilement (barres superposées sur téléphone).

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
- `affiche_comodoro.svg` est mon ébauche d'affiche (A2) : aucune page ne l'utilise, mais **ne pas la supprimer** lors d'un nettoyage.

## Mes préférences

<!-- À compléter : ton, style d'écriture, choses à éviter, etc. -->
