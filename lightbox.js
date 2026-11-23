(function () {
  function initLightbox() {
    var imgs = document.querySelectorAll('img[alt^="Drawing:"]:not(.no-lightbox), img[alt^="Painting:"]:not(.no-lightbox), .manuscript-face-hit:not(.no-lightbox)');
    if (!imgs.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    var img = document.createElement('img');
    img.className = 'lightbox-img';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // native : dessin dispo seulement en basse résolution - on plafonne
    // l'agrandi à sa taille réelle plutôt que de l'étirer (flou).
    function open(src, native) {
      img.src = src;
      img.classList.toggle('is-native', !!native);
      overlay.classList.add('is-open');
      document.body.classList.add('lightbox-locked');
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('lightbox-locked');
    }

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    imgs.forEach(function (el) {
      el.classList.add('lightbox-trigger');
      el.addEventListener('click', function () {
        var target = el.tagName === 'IMG' ? el : el.querySelector('img');
        // data-full : version haute résolution pour l'agrandissement plein écran
        open(target.dataset.full || target.currentSrc || target.src, target.hasAttribute('data-lightbox-native'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
