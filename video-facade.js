// Façade des lecteurs YouTube : chaque lecteur est remplacé par une image
// choisie (video-facade.jpg, la même pour les deux vidéos) + la flèche
// rouge de YouTube, sans titre ni logo. Le vrai lecteur n'est chargé (et
// lancé) qu'au clic.
// - desktop : le curseur "patte" du site ne peut pas s'afficher au-dessus
//   d'un lecteur YouTube (iframe d'un autre domaine) - au clic, le lecteur
//   prend la place de l'image, dans le dessin.
// - mobile : les écrans du dessin ne font que ~40-70px de large, or YouTube
//   refuse de lire un lecteur plus petit que 200x200px (il renvoyait vers
//   youtube.com) - au toucher, la vidéo s'ouvre en grand, pleine largeur,
//   par-dessus la page, avec une croix pour fermer.
// Chargé sans defer, juste après les lecteurs : la façade est en place
// avant le premier affichage, sans que le lecteur ait eu le temps de se
// charger.
(function () {
  var mobile = !window.matchMedia('(min-width: 641px)').matches;
  var frames = document.querySelectorAll('.video-embed-frame iframe');

  function embedUrl(id) {
    // domaine youtube.com (pas youtube-nocookie, source connue d'"erreur
    // 153 / vidéo non disponible") + site déclaré explicitement.
    return 'https://www.youtube.com/embed/' + id + '?autoplay=1&playsinline=1&origin=' +
      encodeURIComponent(location.origin) + '&widget_referrer=' + encodeURIComponent(location.href);
  }

  // fenêtre plein écran (mobile), créée une seule fois
  var overlay, overlayBox, closeBtn, lastFocused;
  function openOverlay(frame, id) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'video-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML = '<button type="button" class="video-overlay-close" aria-label="Close">&times;</button><div class="video-overlay-box"></div>';
      document.body.appendChild(overlay);
      overlayBox = overlay.querySelector('.video-overlay-box');
      closeBtn = overlay.querySelector('.video-overlay-close');
      closeBtn.addEventListener('click', closeOverlay);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) closeOverlay(); });
    }
    var player = frame.cloneNode(false);
    player.removeAttribute('loading');
    player.src = embedUrl(id);
    overlayBox.innerHTML = '';
    overlayBox.appendChild(player);
    overlay.setAttribute('aria-label', frame.title);
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('lightbox-locked');
    closeBtn.focus();
  }
  function closeOverlay() {
    overlayBox.innerHTML = '';   // retire le lecteur : la vidéo s'arrête
    overlay.hidden = true;
    document.body.classList.remove('lightbox-locked');
    if (lastFocused) lastFocused.focus();
  }

  Array.prototype.forEach.call(frames, function (frame) {
    var m = /\/embed\/([\w-]+)/.exec(frame.getAttribute('src'));
    if (!m) return;
    var id = m[1];
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-facade';
    btn.setAttribute('aria-label', frame.title);
    btn.innerHTML =
      '<img class="no-lightbox" src="video-facade.jpg?v=1" alt="">' +
      '<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#f00" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/><path fill="#fff" d="M45 24 27 14v20"/></svg>';
    frame.parentNode.replaceChild(btn, frame);
    btn.addEventListener('click', function () {
      if (mobile) { openOverlay(frame, id); return; }
      frame.removeAttribute('loading');
      frame.src = embedUrl(id);
      btn.parentNode.replaceChild(frame, btn);
    });
  });
})();
