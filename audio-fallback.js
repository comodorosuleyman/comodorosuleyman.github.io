(function () {
  var wrap = document.getElementById('bandcamp-wrap');
  var iframe = document.getElementById('bandcamp-player');
  var fallback = document.getElementById('native-audio-fallback');
  if (!wrap || !iframe || !fallback) return;

  var loaded = false;

  function showFallback() {
    wrap.hidden = true;
    fallback.hidden = false;
  }

  var timer = setTimeout(function () {
    if (!loaded) showFallback();
  }, 4000);

  iframe.addEventListener('load', function () {
    loaded = true;
    clearTimeout(timer);
  });

  iframe.addEventListener('error', function () {
    clearTimeout(timer);
    showFallback();
  });
})();
