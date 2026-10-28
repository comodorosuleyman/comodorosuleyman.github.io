(function () {
  function initLightbox() {
    var imgs = document.querySelectorAll('img.manuscript-face, img.flyingx');
    if (!imgs.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    var img = document.createElement('img');
    img.className = 'lightbox-img';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    function open(src) {
      img.src = src;
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
        open(el.currentSrc || el.src);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
