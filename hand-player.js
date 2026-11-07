(function () {
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function ratioFromPointer(e, track) {
    var rect = track.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return clamp(x / rect.width, 0, 1);
  }

  function setupDraggable(track, knob, onChange) {
    // écoute sur document pendant le glissé (pas juste sur la piste) :
    // la piste est fine, un pointeur qui bouge vite peut sortir de sa
    // zone entre deux évènements - setPointerCapture seul n'y suffit pas
    // partout de façon fiable.
    function update(e) { onChange(ratioFromPointer(e, track)); }
    function onMove(e) { update(e); }
    function onUp() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }
    track.addEventListener('pointerdown', function (e) {
      update(e);
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  }

  // position d'une piste (left/width en %) relative au lecteur entier,
  // pas à elle-même - ses propres % CSS (left/width) sont déjà exprimés
  // par rapport à .hand-player, donc mesurés une fois ici (pas besoin de
  // les dupliquer en JS, ni de les remesurer à chaque frame).
  function trackPercents(track, player) {
    var prect = player.getBoundingClientRect();
    var trect = track.getBoundingClientRect();
    return {
      left: ((trect.left - prect.left) / prect.width) * 100,
      width: (trect.width / prect.width) * 100
    };
  }

  document.querySelectorAll('.hand-player').forEach(function (player) {
    var audio = player.querySelector('audio');
    var playBtn = player.querySelector('.hand-player-playhit');
    var seekTrack = player.querySelector('.hand-player-seek');
    var seekKnob = player.querySelector('.hand-player-seek-knob');
    var volTrack = player.querySelector('.hand-player-volume');
    var volKnob = player.querySelector('.hand-player-volume-knob');
    var seekPct = trackPercents(seekTrack, player);
    var volPct = trackPercents(volTrack, player);

    function setSeekKnob(ratio) {
      seekKnob.style.left = (seekPct.left + ratio * seekPct.width) + '%';
      seekTrack.setAttribute('aria-valuenow', Math.round(ratio * 100));
    }
    function setVolKnob(ratio) {
      volKnob.style.left = (volPct.left + ratio * volPct.width) + '%';
      volTrack.setAttribute('aria-valuenow', Math.round(ratio * 100));
    }

    setVolKnob(audio.volume);

    playBtn.addEventListener('click', function () {
      if (audio.paused) audio.play(); else audio.pause();
    });
    audio.addEventListener('play', function () { player.classList.add('is-playing'); });
    audio.addEventListener('pause', function () { player.classList.remove('is-playing'); });

    audio.addEventListener('timeupdate', function () {
      if (audio.duration) setSeekKnob(audio.currentTime / audio.duration);
    });
    audio.addEventListener('ended', function () { setSeekKnob(0); });

    setupDraggable(seekTrack, seekKnob, function (ratio) {
      // preload="metadata" fait déjà connaître la durée dès le chargement
      // de la page, mais au cas où (connexion lente) : forcer le
      // chargement plutôt qu'ignorer le geste en silence si elle manque
      // encore.
      if (!audio.duration) { audio.load(); return; }
      audio.currentTime = ratio * audio.duration;
      setSeekKnob(ratio);
    });
    setupDraggable(volTrack, volKnob, function (ratio) {
      audio.volume = ratio;
      setVolKnob(ratio);
    });

    seekTrack.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      var step = audio.duration * 0.02;
      if (e.key === 'ArrowLeft') { audio.currentTime = clamp(audio.currentTime - step, 0, audio.duration); setSeekKnob(audio.currentTime / audio.duration); }
      else if (e.key === 'ArrowRight') { audio.currentTime = clamp(audio.currentTime + step, 0, audio.duration); setSeekKnob(audio.currentTime / audio.duration); }
    });
    volTrack.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { audio.volume = clamp(audio.volume - 0.05, 0, 1); setVolKnob(audio.volume); }
      else if (e.key === 'ArrowRight') { audio.volume = clamp(audio.volume + 0.05, 0, 1); setVolKnob(audio.volume); }
    });
  });
})();
