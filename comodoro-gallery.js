(function () {
  var items = document.querySelectorAll('.comodoro-gallery-item');
  var slider = document.getElementById('comodoro-slider');
  if (!items.length || !slider) return;

  // galerie.html / galerie-2.html : continuer vers la page suivante/
  // précédente au lieu de boucler sur place, pour parcourir TOUTES les
  // images d'affilée en agrandi, pas seulement celles de la page en cours.
  var gallerySection = document.querySelector('.comodoro-gallery');
  var nextPage = gallerySection && gallerySection.dataset.nextPage;
  var prevPage = gallerySection && gallerySection.dataset.prevPage;

  var viewport = slider.querySelector('.comodoro-slider-viewport');
  var sliderImg = document.getElementById('comodoro-slider-img');
  var caption = document.getElementById('comodoro-slider-caption');
  var btnClose = slider.querySelector('.comodoro-slider-close');
  var btnPrev = slider.querySelector('.comodoro-slider-prev');
  var btnNext = slider.querySelector('.comodoro-slider-next');

  // mobile : version 1400px (data-md) plutôt que la 2400px - un écran de
  // téléphone n'affiche pas plus de ~1300 pixels réels de large, même
  // loupe activée (pleine largeur) : aussi net à l'écran, 2 fois plus léger.
  var mobile = window.matchMedia('(max-width: 640px)').matches;
  var sources = [];
  var alts = [];
  var captions = [];
  var thumbs = [];
  items.forEach(function (btn) {
    var img = btn.querySelector('img');
    sources.push((mobile && btn.dataset.md) || btn.dataset.full || img.currentSrc || img.src);
    alts.push(img.alt);
    // technique et dimensions (data-caption), en bas de l'agrandi
    captions.push(btn.dataset.caption || '');
    thumbs.push(img);
  });

  // grandes images déjà demandées (préchargement) : gardées en mémoire
  // pour que le navigateur ne les abandonne pas en cours de route.
  var loaders = {};
  function load(index) {
    if (!loaders[index]) {
      loaders[index] = new Image();
      loaders[index].src = sources[index];
    }
    return loaders[index];
  }

  var current = 0;
  var lastFocused = null;

  function show(index) {
    if (index >= sources.length && nextPage) {
      window.location.href = nextPage + '#slide=0';
      return;
    }
    if (index < 0 && prevPage) {
      window.location.href = prevPage + '#slide=last';
      return;
    }
    current = (index + sources.length) % sources.length;
    var shown = current;
    sliderImg.alt = alts[current];
    sliderImg.classList.remove('is-zoomed');
    caption.textContent = captions[current];
    caption.hidden = !captions[current];

    var full = load(current);
    if (full.complete && full.naturalWidth) {
      setFull();
    } else {
      // en attendant la grande image : jamais l'image précédente (bug :
      // l'agrandi précédent restait affiché le temps du chargement). On
      // montre tout de suite la vignette déjà chargée de la page, étirée
      // à la taille finale, puis on la remplace dès que la grande arrive.
      var thumb = thumbs[current];
      if (thumb.complete && thumb.naturalWidth) {
        var ratio = thumb.naturalWidth / thumb.naturalHeight;
        var w = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.85 * ratio);
        sliderImg.style.width = w + 'px';
        sliderImg.style.height = (w / ratio) + 'px';
        sliderImg.style.visibility = '';
        sliderImg.src = thumb.currentSrc || thumb.src;
      } else {
        sliderImg.style.visibility = 'hidden';
        sliderImg.removeAttribute('src');
      }
      full.onload = full.onerror = function () { if (current === shown) setFull(); };
    }

    function setFull() {
      sliderImg.src = full.src;
      sliderImg.style.width = '';
      sliderImg.style.height = '';
      sliderImg.style.visibility = '';
      // précharge les voisines pour une navigation sans attente
      if (current + 1 < sources.length) load(current + 1);
      if (current > 0) load(current - 1);
    }
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    slider.hidden = false;
    document.body.classList.add('lightbox-locked');
    btnClose.focus();
  }

  function close() {
    slider.hidden = true;
    document.body.classList.remove('lightbox-locked');
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i); });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });

  sliderImg.addEventListener('click', function (e) {
    e.stopPropagation();
    sliderImg.style.width = '';
    sliderImg.style.height = '';
    sliderImg.classList.toggle('is-zoomed');
  });

  slider.addEventListener('click', function (e) {
    if (e.target === slider || e.target === viewport) close();
  });

  document.addEventListener('keydown', function (e) {
    if (slider.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  var touchStartX = null;
  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) show(current + 1); else show(current - 1);
    }
    touchStartX = null;
  }, { passive: true });

  // arrivée depuis la page précédente/suivante (voir show() ci-dessus) :
  // rouvrir directement sur la bonne image plutôt que sur la galerie.
  var hashMatch = /^#slide=(\d+|last)$/.exec(window.location.hash);
  if (hashMatch) {
    var startIndex = hashMatch[1] === 'last' ? sources.length - 1 : parseInt(hashMatch[1], 10);
    if (startIndex >= 0 && startIndex < sources.length) open(startIndex);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
})();
