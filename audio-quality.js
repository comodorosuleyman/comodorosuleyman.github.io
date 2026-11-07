(function () {
  document.querySelectorAll('.native-audio-wav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var track = btn.closest('.native-audio-track');
      var audio = track && track.querySelector('audio');
      if (!audio) return;
      var wasPlaying = !audio.paused;
      audio.src = btn.dataset.wav;
      audio.load();
      btn.remove();
      if (wasPlaying) audio.play();
    });
  });
})();
