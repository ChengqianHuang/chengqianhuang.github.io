// 粒子网络背景：canvas 固定在底层，鼠标附近粒子被轻微吸引并连线
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // WebGL shader 可用时让位
  if (document.documentElement.classList.contains('webgl')) return;

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], rafId = null;
  const mouse = { x: -9999, y: -9999 };
  const LINK_DIST = 130;
  const MOUSE_DIST = 180;

  function themeColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark
      ? { dot: '230, 237, 243', line: '88, 166, 255' }
      : { dot: '26, 26, 26', line: '9, 105, 218' };
  }

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    const n = Math.min(90, Math.floor((W * H) / 18000));
    while (particles.length < n) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.8,
      });
    }
    particles.length = n;
  }

  function step() {
    const c = themeColors();
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // 鼠标吸引（限距）
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
        const d = Math.sqrt(d2);
        p.vx += (dx / d) * 0.015;
        p.vy += (dy / d) * 0.015;
      }
      p.vx *= 0.995; p.vy *= 0.995; // 阻尼，防加速失控
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.dot}, 0.35)`;
      ctx.fill();
    }

    // 距离内连线，透明度随距离衰减
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = 1 - Math.sqrt(d2) / LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${c.line}, ${alpha * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(step);
  }

  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  // 页面不可见时停帧，省电
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!rafId) step();
  });

  resize();
  step();
})();
