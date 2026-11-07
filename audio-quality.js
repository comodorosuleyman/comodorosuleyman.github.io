(function () {
  document.querySelectorAll('.native-audio-wav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var audio = btn.previousElementSibling;
      if (!audio || audio.tagName !== 'AUDIO') return;
      var wasPlaying = !audio.paused;
      audio.src = btn.dataset.wav;
      audio.load();
      btn.remove();
      if (wasPlaying) audio.play();
    });
  });
})();
