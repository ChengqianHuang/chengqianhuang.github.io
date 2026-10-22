// 阅读进度条（文章页）+ 返回顶部 + 滚动进入动画 + 文章列表 3D 倾斜
(() => {
  const bar = document.getElementById('progress-bar');
  const btn = document.getElementById('back-to-top');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The cards above the articles arrive asynchronously. Correct an article
  // jump once their final heights are known, unless the visitor has moved on.
  const articles = document.getElementById('post-list');
  if (articles && document.body.classList.contains('home')) {
    const sections = [...document.querySelectorAll('[data-game-catalog], #pelican-home-grid, #posts')];
    const ready = () => sections.every(section => section.getAttribute('aria-busy') !== 'true');
    let requested = location.hash === '#post-list';
    let frame = 0;

    function cancelJump() {
      requested = false;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function correctJump() {
      if (!ready()) return;
      observer.disconnect();
      if (!requested || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (requested && location.hash === '#post-list') {
          articles.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
        requested = false;
      });
    }

    function articleLink(event) {
      const link = event.target.closest?.('a[href]');
      if (!link) return false;
      const url = new URL(link.href, location.href);
      return url.origin === location.origin && url.pathname === location.pathname
        && url.search === location.search && url.hash === '#post-list';
    }

    const observer = new MutationObserver(correctJump);
    sections.forEach(section => observer.observe(section, {
      attributes: true, attributeFilter: ['aria-busy'],
    }));
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (articleLink(event) && !ready()) requested = true;
    });
    addEventListener('hashchange', () => {
      if (location.hash !== '#post-list') cancelJump();
    });
    addEventListener('wheel', cancelJump, { passive: true });
    addEventListener('touchmove', cancelJump, { passive: true });
    // Also cancel for a scrollbar drag or another control chosen while loading.
    document.addEventListener('pointerdown', event => {
      if (!articleLink(event)) cancelJump();
    });
    document.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelJump();
    });
    correctJump();
  }

  function onScroll() {
    if (bar) {
      const total = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = total > 0 ? `${(scrollY / total) * 100}%` : '0';
    }
    if (btn) btn.classList.toggle('visible', scrollY > 400);
  }

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btn) btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // 滚动进入视口时上浮显现
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // 3D 倾斜：文章列表项跟随鼠标微倾
  if (!reduced) {
    document.querySelectorAll('.post-list li:not(.loading)').forEach(item => {
      item.addEventListener('mousemove', e => {
        const r = item.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        item.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      item.addEventListener('mouseleave', () => { item.style.transform = ''; });
    });
  }
})();
