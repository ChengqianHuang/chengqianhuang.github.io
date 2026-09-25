// 阅读进度条（文章页）+ 返回顶部按钮（全站）
(() => {
  const bar = document.getElementById('progress-bar');
  const btn = document.getElementById('back-to-top');

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
})();
