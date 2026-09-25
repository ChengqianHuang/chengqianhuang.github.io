// 首页：加载 posts.json 并渲染文章列表
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

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
