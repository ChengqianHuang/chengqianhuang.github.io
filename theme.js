// 主题切换：默认跟随系统，手动切换后持久化到 localStorage
(() => {
  const KEY = 'theme';

  // 系统变化时，若用户未手动选过，自动跟随
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(KEY)) setTheme(e.matches ? 'dark' : 'light', false);
  });

  function setTheme(t, persist = true) {
    document.documentElement.setAttribute('data-theme', t);
    if (persist) localStorage.setItem(KEY, t);
    updateButton();
    updateHljs(t);
    document.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }

  function updateButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = dark ? '☀️' : '🌙';
    btn.title = dark ? '切换到亮色' : '切换到暗色';
    btn.setAttribute('aria-label', btn.title);
  }

  // 同步 highlight.js 的亮/暗样式表
  function updateHljs(t) {
    const light = document.getElementById('hl-light');
    const dark = document.getElementById('hl-dark');
    if (light) light.disabled = t === 'dark';
    if (dark) dark.disabled = t !== 'dark';
  }

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(dark ? 'light' : 'dark');
    });
  }

  updateButton();
  updateHljs(document.documentElement.getAttribute('data-theme') || 'light');
})();
