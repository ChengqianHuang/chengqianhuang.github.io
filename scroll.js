// 阅读进度条（文章页）+ 返回顶部 + 滚动进入动画 + 文章列表 3D 倾斜
(() => {
  const bar = document.getElementById('progress-bar');
  const btn = document.getElementById('back-to-top');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
