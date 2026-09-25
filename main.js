// 首页：终端启动序列 + 文章列表 + 标题解码特效 + 3D 倾斜
(async () => {
  renderPosts();
  terminalBoot();
  scrambleTitle();
})();

// 文章列表
async function renderPosts() {
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
        <li class="tilt reveal">
          <a href="post.html?post=${encodeURIComponent(p.file.endsWith('.md') ? p.file : p.file + '.md')}">${escapeHtml(p.title)}</a>
          <span class="post-meta">${escapeHtml(p.date)}</span>
        </li>`)
      .join('');
    // 重新触发 reveal 观察与倾斜绑定
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      list.querySelectorAll('.reveal').forEach(el => io.observe(el));
    } else {
      list.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      list.querySelectorAll('li.tilt').forEach(item => {
        item.addEventListener('mousemove', e => {
          const r = item.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
          item.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        item.addEventListener('mouseleave', () => { item.style.transform = ''; });
      });
    }
  } catch (err) {
    list.innerHTML = '<li class="loading">文章列表加载失败，请刷新重试</li>';
    console.error(err);
  }
}

// 终端启动序列：逐条敲命令，输出即时打印
async function terminalBoot() {
  const el = document.getElementById('typed');
  if (!el) return;

  // ls ./posts 的输出从 posts.json 动态生成，避免每加一篇文章都要改这里
  let lsOut = '';
  try {
    const res = await fetch('posts.json', { cache: 'no-cache' });
    if (res.ok) {
      lsOut = (await res.json())
        .map(p => (p.file.endsWith('.md') ? p.file : p.file + '.md'))
        .join('  ');
    }
  } catch { /* 取不到就留空，不影响启动序列其余部分 */ }

  const LINES = [
    { cmd: 'whoami', out: 'chengqian — developer · shenzhen' },
    { cmd: 'ls ./posts', out: lsOut },
    { cmd: 'uptime --passion', out: 'shipping since forever, load average: rising' },
  ];

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerHTML = LINES.map(l =>
      `<span class="cmd"><span class="prompt">$ </span>${escapeHtml(l.cmd)}</span><br>` +
      `<span class="out">${escapeHtml(l.out)}</span><br>`).join('');
    return;
  }

  let li = 0, ci = 0, html = '';
  (function type() {
    if (li >= LINES.length) return;
    const line = LINES[li];
    if (ci <= line.cmd.length) {
      el.innerHTML = html +
        `<span class="cmd"><span class="prompt">$ </span>${escapeHtml(line.cmd.slice(0, ci))}</span><span class="cursor-inline"></span>`;
      ci++;
      setTimeout(type, 65);
    } else {
      html += `<span class="cmd"><span class="prompt">$ </span>${escapeHtml(line.cmd)}</span><br>` +
              `<span class="out">${escapeHtml(line.out)}</span><br>`;
      li++; ci = 0;
      setTimeout(type, 350);
    }
  })();
}

// 标题解码特效：乱码逐渐归位
function scrambleTitle() {
  const el = document.getElementById('hero-name');
  if (!el) return;
  const target = el.dataset.text || el.textContent;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target; return; }

  const POOL = '!<>-_\\/[]{}=+*^?#________';
  const queue = target.split('').map((ch, i) => ({
    ch, start: i * 2.2, end: i * 2.2 + 14,
  }));
  let frame = 0;

  (function step() {
    let out = '', done = 0;
    for (const q of queue) {
      if (frame >= q.end) { out += q.ch; done++; }
      else if (frame >= q.start) { out += `<span class="dud">${POOL[Math.floor(Math.random() * POOL.length)]}</span>`; }
      else { out += '&nbsp;'; }
    }
    el.innerHTML = out;
    if (done < queue.length) { frame++; requestAnimationFrame(step); }
    else { el.textContent = target; }
  })();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
