// 首页实验台：一个真正可交互的粒子场，以及无需依赖的迷你终端。
(() => {
  const canvas = document.getElementById('orbit-canvas');
  const form = document.getElementById('console-form');
  if (!canvas || !form) return;

  const ctx = canvas.getContext('2d');
  const output = document.getElementById('console-output');
  const input = document.getElementById('console-input');
  const status = document.getElementById('orbit-status');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: -1000, y: -1000, active: false };
  let width = 0, height = 0, particles = [], ripples = [], frameId = 0;
  let visible = true, lastTime = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.max(35, Math.floor(width * height / 2300)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      r: i % 9 === 0 ? 2.1 : 1.2,
      hue: i % 4 === 0 ? 165 : 230 + (i % 3) * 15,
    }));
    paint();
  }

  function pulse(x = width / 2, y = height / 2) {
    ripples.push({ x, y, radius: 8, alpha: .9 });
    for (const p of particles) {
      const dx = p.x - x, dy = p.y - y;
      const distance = Math.max(18, Math.hypot(dx, dy));
      const force = Math.max(0, 1 - distance / 310) * 5;
      p.vx += dx / distance * force;
      p.vy += dy / distance * force;
    }
    if (reducedMotion.matches) paint();
  }

  function paint() {
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .5, height * .5, 4, width * .5, height * .5, Math.max(width, height) * .7);
    glow.addColorStop(0, '#1c2855');
    glow.addColorStop(1, '#101529');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = .7;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 90) {
          ctx.strokeStyle = `rgba(148,171,255,${(1 - distance / 90) * .25})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `hsl(${a.hue} 92% 76%)`;
      ctx.shadowBlur = a.r > 2 ? 16 : 7;
      ctx.shadowColor = `hsl(${a.hue} 92% 67%)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (const ripple of ripples) {
      ctx.strokeStyle = `rgba(105,231,204,${ripple.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2); ctx.stroke();
    }
    if (pointer.active) {
      ctx.strokeStyle = 'rgba(112,235,208,.45)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 15, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#8ef4d9';
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  function animate(now) {
    frameId = requestAnimationFrame(animate);
    if (now - lastTime < 25) return; // 控制在约 40fps
    lastTime = now;
    for (const p of particles) {
      if (pointer.active) {
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        const distance = Math.max(20, Math.hypot(dx, dy));
        if (distance < 170) {
          const force = (1 - distance / 170) * .1;
          p.vx += dx / distance * force;
          p.vy += dy / distance * force;
        }
      }
      p.vx = Math.max(-3, Math.min(3, p.vx * .985));
      p.vy = Math.max(-3, Math.min(3, p.vy * .985));
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }
    ripples = ripples.filter(r => r.alpha > .02);
    for (const r of ripples) { r.radius += 5; r.alpha *= .95; }
    paint();
  }

  function syncMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    status.textContent = reducedMotion.matches ? 'STILL' : visible && !document.hidden ? 'LIVE' : 'PAUSED';
    if (!reducedMotion.matches && visible && !document.hidden) frameId = requestAnimationFrame(animate);
    else paint();
  }

  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
    if (reducedMotion.matches) paint();
  });
  canvas.addEventListener('pointerleave', () => { pointer.active = false; if (reducedMotion.matches) paint(); });
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    pulse(e.clientX - rect.left, e.clientY - rect.top);
  });
  document.getElementById('pulse-button').addEventListener('click', () => pulse());
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }).observe(canvas);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);

  function print(message, className = 'console-line-answer') {
    const line = document.createElement('p');
    line.className = className;
    line.textContent = message;
    output.append(line);
    while (output.children.length > 18) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }

  const commands = {
    help: () => '可用命令：help · about · posts · theme · donut · surprise · clear',
    about: () => 'Chengqian / developer in Shenzhen. 喜欢把网页当成可以玩的画布。',
    posts: () => { document.getElementById('post-list').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }); return '正在打开文章列表 ↗'; },
    theme: () => { document.getElementById('theme-toggle').click(); return '主题已切换。'; },
    donut: () => { document.querySelector('.donut-window').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }); return '那个甜甜圈不是 GIF，是数学。'; },
    surprise: () => { pulse(); setTimeout(() => pulse(width * .25, height * .55), 180); setTimeout(() => pulse(width * .75, height * .45), 360); return '✦ 宇宙收到你的信号了。'; },
    clear: () => { output.replaceChildren(); return ''; },
  };

  function run(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    print(`❯ ${command}`, 'console-line-command');
    const answer = commands[command];
    const message = answer ? answer() : `找不到命令：${command}。输入 help 查看可用命令。`;
    if (message) print(message, answer ? 'console-line-answer' : 'console-line-error');
  }

  form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; input.focus(); });
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => run(button.dataset.command)));
})();
