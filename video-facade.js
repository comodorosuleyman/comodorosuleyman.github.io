// desktop uniquement (mobile inchangé : lecteurs YouTube d'origine) :
// le curseur "patte" du site ne peut pas s'afficher au-dessus d'un
// lecteur YouTube (iframe d'un autre domaine, le navigateur interdit de
// changer son curseur). On remplace donc chaque lecteur par une façade -
// l'image de la vidéo + la flèche rouge de YouTube, sans titre ni logo -
// et le vrai lecteur n'est chargé (et lancé) qu'au clic. Chargé sans
// defer, juste après les lecteurs : la façade est en place avant le
// premier affichage, sans que le lecteur ait eu le temps de se charger.
(function () {
  if (!window.matchMedia('(min-width: 641px)').matches) return;
  var frames = document.querySelectorAll('.video-embed-frame iframe');
  Array.prototype.forEach.call(frames, function (frame) {
    var m = /\/embed\/([\w-]+)/.exec(frame.getAttribute('src'));
    if (!m) return;
    var id = m[1];
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-facade';
    btn.setAttribute('aria-label', frame.title);
    btn.innerHTML =
      '<img class="no-lightbox" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="">' +
      '<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#f00" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/><path fill="#fff" d="M45 24 27 14v20"/></svg>';
    frame.parentNode.replaceChild(btn, frame);
    btn.addEventListener('click', function () {
      frame.removeAttribute('loading');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
      btn.parentNode.replaceChild(frame, btn);
    });
  });
})();
