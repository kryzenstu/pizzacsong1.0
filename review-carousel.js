(function () {
  function init() {
    var viewport = document.getElementById('review-carousel');
    if (!viewport || viewport.dataset.reviewReady === 'true') return false;
    var section = viewport.closest('#velemenyek');
    var cards = Array.prototype.slice.call(viewport.querySelectorAll('.review-card'));
    var buttons = section ? section.querySelectorAll('.review-arrow') : [];
    var index = 0;
    var timer;
    var scrollTimer;
    viewport.dataset.reviewReady = 'true';

    function visibleCards() { return window.innerWidth <= 680 ? 1 : 2; }
    function maxIndex() { return Math.max(0, cards.length - visibleCards()); }
    function cardLeft(i) { return cards[i].offsetLeft - cards[0].offsetLeft; }
    function go(next, smooth) {
      var max = maxIndex();
      index = next > max ? 0 : next < 0 ? max : next;
      viewport.scrollTo({ left: cardLeft(index), behavior: smooth === false ? 'auto' : 'smooth' });
    }
    function stop() { window.clearInterval(timer); }
    function start() {
      stop();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = window.setInterval(function () { go(index + 1); }, 4800);
      }
    }
    function syncIndex() {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        var nearest = 0;
        var distance = Infinity;
        for (var i = 0; i < cards.length; i++) {
          var current = Math.abs(cardLeft(i) - viewport.scrollLeft);
          if (current < distance) { distance = current; nearest = i; }
        }
        index = Math.min(nearest, maxIndex());
      }, 120);
    }

    if (buttons[0]) buttons[0].addEventListener('click', function () { go(index - 1); start(); });
    if (buttons[1]) buttons[1].addEventListener('click', function () { go(index + 1); start(); });
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); start(); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); start(); }
    });
    viewport.addEventListener('scroll', syncIndex, { passive: true });
    viewport.addEventListener('pointerdown', stop);
    viewport.addEventListener('pointerup', start);
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    window.addEventListener('resize', function () { go(Math.min(index, maxIndex()), false); });
    start();
    return true;
  }

  function watch() {
    init();
    var observer = new MutationObserver(function () {
      init();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
  else watch();
})();
