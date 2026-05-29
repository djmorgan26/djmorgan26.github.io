/* Site enhancements:
   - Reading progress bar on post pages
   - Marginalia popover footnotes
   - Theme toggle with View Transitions API
*/
(function () {
  // ---- Reading progress bar ----
  var bar = document.querySelector('.read-progress > span');
  if (bar) {
    var article = document.querySelector('.post .post-body');
    if (article) {
      var rafId = null;
      var update = function () {
        rafId = null;
        var rect = article.getBoundingClientRect();
        var total = rect.height - window.innerHeight;
        if (total <= 0) { bar.style.width = '100%'; return; }
        var scrolled = -rect.top;
        var pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
        bar.style.width = pct + '%';
      };
      var onScroll = function () {
        if (rafId == null) rafId = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    }
  }

  // ---- Marginalia footnotes ----
  var footRefs = document.querySelectorAll('sup[id^="fnref:"]');
  if (footRefs.length) {
    var postBody = document.querySelector('.post-body');
    var closeAll = function (except) {
      document.querySelectorAll('.marginnote.is-open').forEach(function (n) {
        if (n !== except) n.classList.remove('is-open');
      });
    };
    footRefs.forEach(function (sup) {
      var link = sup.querySelector('a.footnote, a[rel="footnote"]');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      var id = href.replace(/^#/, '');
      var target = id && document.getElementById(id);
      if (!target) return;

      var clone = target.cloneNode(true);
      clone.querySelectorAll('a.reversefootnote, a[rel="footnote"]').forEach(function (a) { a.remove(); });
      var html = clone.innerHTML.trim();
      var num = link.textContent.trim();

      sup.classList.add('fn-trigger');
      var note = document.createElement('span');
      note.className = 'marginnote';
      note.setAttribute('role', 'note');
      note.innerHTML = '<span class="marginnote-num">' + num + '.</span> ' + html;
      sup.insertAdjacentElement('afterend', note);

      var positionNote = function () {
        if (window.matchMedia('(max-width: 1080px)').matches) {
          note.style.top = '';
          return;
        }
        if (!postBody) return;
        var supRect = sup.getBoundingClientRect();
        var bodyRect = postBody.getBoundingClientRect();
        note.style.top = Math.max(0, supRect.top - bodyRect.top - 4) + 'px';
      };
      positionNote();
      window.addEventListener('resize', positionNote, { passive: true });

      link.addEventListener('click', function (e) {
        positionNote();
        e.preventDefault();
        var open = note.classList.contains('is-open');
        closeAll(note);
        if (open) {
          note.classList.remove('is-open');
        } else {
          note.classList.add('is-open');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.fn-trigger') || e.target.closest('.marginnote')) return;
      closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });

    var fn = document.querySelector('.footnotes');
    if (fn) fn.setAttribute('hidden', '');
  }

  // ---- Theme toggle with sweep ----
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    var current = function () {
      return document.documentElement.getAttribute('data-theme')
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };
    btn.addEventListener('click', function () {
      var rect = btn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      document.documentElement.style.setProperty('--theme-x', x + 'px');
      document.documentElement.style.setProperty('--theme-y', y + 'px');

      var next = current() === 'dark' ? 'light' : 'dark';
      var apply = function () {
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      };
      if (document.startViewTransition) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    });
  }
})();
