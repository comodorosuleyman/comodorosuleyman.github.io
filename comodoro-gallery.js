(function () {
  var items = document.querySelectorAll('.comodoro-gallery-item');
  var slider = document.getElementById('comodoro-slider');
  if (!items.length || !slider) return;

  var viewport = slider.querySelector('.comodoro-slider-viewport');
  var sliderImg = document.getElementById('comodoro-slider-img');
  var count = document.getElementById('comodoro-slider-count');
  var btnClose = slider.querySelector('.comodoro-slider-close');
  var btnPrev = slider.querySelector('.comodoro-slider-prev');
  var btnNext = slider.querySelector('.comodoro-slider-next');

  var sources = [];
  var alts = [];
  items.forEach(function (btn) {
    var img = btn.querySelector('img');
    sources.push(btn.dataset.full || img.currentSrc || img.src);
    alts.push(img.alt);
  });

  var current = 0;
  var lastFocused = null;

  function show(index) {
    current = (index + sources.length) % sources.length;
    sliderImg.src = sources[current];
    sliderImg.alt = alts[current];
    sliderImg.classList.remove('is-zoomed');
    count.textContent = (current + 1) + ' / ' + sources.length;
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
})();
