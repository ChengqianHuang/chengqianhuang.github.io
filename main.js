// 首页：加载 posts.json 渲染列表 + intro 打字机
(async () => {
  const list = document.getElementById('posts');
  try {
    const res = await fetch('posts.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    if (posts.length === 0) {
      list.innerHTML = '<li class="loading">暂无文章</li>';
      return;
    }
    list.innerHTML = posts
      .map(p => `
        <li>
          <a href="post.html?post=${encodeURIComponent(p.file)}">${escapeHtml(p.title)}</a>
          <span class="post-meta">${escapeHtml(p.date)}</span>
        </li>`)
      .join('');
  } catch (err) {
    list.innerHTML = '<li class="loading">文章列表加载失败，请刷新重试</li>';
    console.error(err);
  }
})();

// 打字机效果：逐字打出 intro 文案
(() => {
  const el = document.getElementById('typed');
  if (!el) return;
  const text = '开发者。这里记录技术笔记与项目进展。';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text;
    return;
  }
  let i = 0;
  (function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(type, 90);
    }
  })();
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
