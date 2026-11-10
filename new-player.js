(function () {
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function formatTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  document.querySelectorAll('.new-player').forEach(function (player) {
    var bgImg = player.querySelector('.new-player-bg');
    var playBtns = [
      player.querySelector('.new-player-playhit1'),
      player.querySelector('.new-player-playhit2')
    ];
    var audios = [
      player.querySelector('.new-player-audio1'),
      player.querySelector('.new-player-audio2')
    ];
    var seeks = [
      player.querySelector('.new-player-seek1'),
      player.querySelector('.new-player-seek2')
    ];
    var knobs = [
      player.querySelector('.new-player-seek1-knob'),
      player.querySelector('.new-player-seek2-knob')
    ];
    var counters = [
      player.querySelector('.new-player-counter1'),
      player.querySelector('.new-player-counter2')
    ];
    var volTrack = player.querySelector('.new-player-volume');
    var volKnob = player.querySelector('.new-player-volume-knob');
    var mp3Btn = player.querySelector('.new-player-mp3');
    var wavBtn = player.querySelector('.new-player-wav');
    var mp3Dot = player.querySelector('.new-player-mp3-dot');
    var wavDot = player.querySelector('.new-player-wav-dot');

    var active = 0; // index of currently active track

    function setKnobX(knob, track, ratio) {
      var prect = player.getBoundingClientRect();
      var trect = track.getBoundingClientRect();
      var left = ((trect.left - prect.left) / prect.width) * 100;
      var width = (trect.width / prect.width) * 100;
      knob.style.left = (left + ratio * width) + '%';
    }
    function setKnobY(knob, track, ratio) {
      var prect = player.getBoundingClientRect();
      var trect = track.getBoundingClientRect();
      var top = ((trect.top - prect.top) / prect.height) * 100;
      var height = (trect.height / prect.height) * 100;
      // ratio 1 = full volume = top of track; ratio 0 = bottom
      knob.style.top = (top + (1 - ratio) * height) + '%';
      knob.style.left = ((trect.left - prect.left + trect.width / 2) / prect.width * 100) + '%';
    }

    function updateCounter(i) {
      var a = audios[i];
      if (!a || !counters[i]) return;
      counters[i].textContent = formatTime(a.currentTime) + ' / ' + formatTime(a.duration);
    }

    function setActive(i) {
      active = i;
    }

    function playTrack(i) {
      audios.forEach(function (a, j) { if (j !== i && a) a.pause(); });
      if (audios[i]) audios[i].play();
    }

    playBtns.forEach(function (btn, i) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        var a = audios[i];
        if (!a) return;
        if (a.paused) playTrack(i); else a.pause();
      });
    });

    audios.forEach(function (a, i) {
      if (!a) return;
      a.addEventListener('play', function () {
        setActive(i);
        player.classList.add('is-playing' + (i + 1));
      });
      a.addEventListener('pause', function () {
        player.classList.remove('is-playing' + (i + 1));
      });
      a.addEventListener('timeupdate', function () {
        if (a.duration) setKnobX(knobs[i], seeks[i], a.currentTime / a.duration);
        updateCounter(i);
      });
      a.addEventListener('loadedmetadata', updateCounter.bind(null, i));
      updateCounter(i);

      function seekTo(e) {
        if (!a.duration) { a.load(); return; }
        var rect = seeks[i].getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        var ratio = clamp(x / rect.width, 0, 1);
        a.currentTime = ratio * a.duration;
        setKnobX(knobs[i], seeks[i], ratio);
        setActive(i);
      }
      seeks[i].addEventListener('pointerdown', function (e) {
        seekTo(e);
        function onMove(ev) { seekTo(ev); }
        function onUp() {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        }
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
      });
      seeks[i].setAttribute('tabindex', '0');
      seeks[i].addEventListener('keydown', function (e) {
        if (!a.duration) return;
        var step = a.duration * 0.02;
        if (e.key === 'ArrowLeft') { a.currentTime = clamp(a.currentTime - step, 0, a.duration); setActive(i); }
        else if (e.key === 'ArrowRight') { a.currentTime = clamp(a.currentTime + step, 0, a.duration); setActive(i); }
        setKnobX(knobs[i], seeks[i], a.currentTime / a.duration);
      });
    });

    function setVolume(ratio) {
      audios.forEach(function (a) { if (a) a.volume = ratio; });
      setKnobY(volKnob, volTrack, ratio);
    }
    // np-panel.png (the sole normal-flow child) is what gives .new-player
    // its height - positioning the knobs off its getBoundingClientRect()
    // before it has loaded divides by a near-zero height, sending them
    // miles off (reported: volume knob landing near the bottom of the
    // page). Run the initial layout only once it's actually sized.
    function layoutInit() {
      knobs.forEach(function (knob, i) { setKnobX(knob, seeks[i], 0); });
      setVolume(1);
    }
    if (bgImg.complete && bgImg.naturalWidth) layoutInit();
    else bgImg.addEventListener('load', layoutInit);
    function volFromEvent(e) {
      var rect = volTrack.getBoundingClientRect();
      var y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      var ratio = clamp(1 - y / rect.height, 0, 1);
      setVolume(ratio);
    }
    volTrack.addEventListener('pointerdown', function (e) {
      volFromEvent(e);
      function onMove(ev) { volFromEvent(ev); }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
    volTrack.setAttribute('tabindex', '0');
    volTrack.addEventListener('keydown', function (e) {
      var cur = audios[0] ? audios[0].volume : 1;
      if (e.key === 'ArrowLeft') setVolume(clamp(cur - 0.05, 0, 1));
      else if (e.key === 'ArrowRight') setVolume(clamp(cur + 0.05, 0, 1));
    });

    function selectQuality(which) {
      var wasPlaying = audios[active] && !audios[active].paused;
      audios.forEach(function (a) {
        if (!a) return;
        var src = which === 'wav' ? a.dataset.wav : a.dataset.mp3;
        if (src && a.src.indexOf(src) === -1) {
          a.src = src;
          a.load();
        }
      });
      mp3Dot.classList.toggle('selected', which === 'mp3');
      wavDot.classList.toggle('selected', which === 'wav');
      if (wasPlaying) playTrack(active);
    }
    if (mp3Btn) mp3Btn.addEventListener('click', function () { selectQuality('mp3'); });
    if (wavBtn) wavBtn.addEventListener('click', function () { selectQuality('wav'); });
  });
})();
