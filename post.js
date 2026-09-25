// 文章页：?post=<file> 加载 posts/<file>.md，marked 渲染
(async () => {
  const el = document.getElementById('content');
  const params = new URLSearchParams(location.search);
  const file = params.get('post') || '';

  // 只允许字母数字、连字符、下划线、点，防路径穿越
  if (!/^[A-Za-z0-9_-]+\.md$/.test(file)) {
    el.innerHTML = '<p>无效的文章地址。</p><p><a href="/">← 返回首页</a></p>';
    return;
  }

  try {
    const res = await fetch(`posts/${file}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    const { meta, body } = parseFrontMatter(md);
    const html = marked.parse(body);
    el.innerHTML = `
      ${meta.title ? `<h1>${escapeHtml(meta.title)}</h1>` : ''}
      ${meta.date ? `<p class="post-meta-top">${escapeHtml(meta.date)}</p>` : ''}
      ${html}
      <p style="margin-top:48px"><a href="/">← 返回首页</a></p>`;
    document.title = (meta.title ? meta.title + ' - ' : '') + 'Chengqian Huang';
  } catch (err) {
    el.innerHTML = '<p>文章加载失败。</p><p><a href="/">← 返回首页</a></p>';
    console.error(err);
  }
})();

// 解析 YAML front matter（仅 key: value 简单格式）
function parseFrontMatter(md) {
  const meta = {};
  let body = md;
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (m) {
    for (const line of m[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    body = md.slice(m[0].length);
  }
  return { meta, body };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
