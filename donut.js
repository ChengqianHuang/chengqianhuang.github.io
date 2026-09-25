// ASCII 旋转甜甜圈（致敬 donut.c）——渲染到 <pre>，约 20fps
(() => {
  const pre = document.getElementById('donut');
  if (!pre) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CHARS = '.,-~:;=!*#$@';
  const COLS = 42, ROWS = 18;
  const R1 = 1, R2 = 2, K2 = 5;
  const K1 = COLS * K2 * 3 / (8 * (R1 + R2));

  let A = 0, B = 0;
  let rafId = null, last = 0;

  function frame(now) {
    if (now - last > 50) { // ~20fps
      last = now;
      const output = new Array(ROWS * COLS).fill(' ');
      const zbuf = new Array(ROWS * COLS).fill(0);

      for (let theta = 0; theta < 6.28; theta += 0.07) {
        const ct = Math.cos(theta), st = Math.sin(theta);
        for (let phi = 0; phi < 6.28; phi += 0.02) {
          const cp = Math.cos(phi), sp = Math.sin(phi);
          const circX = R2 + R1 * ct;
          const circY = R1 * st;

          const x = circX * (cp * Math.cos(A) + sp * Math.sin(B)) - circY * sp * Math.sin(A);
          const y = circX * (sp * Math.cos(A) - cp * Math.sin(B)) + circY * cp * Math.sin(A);
          const z = K2 + cp * circX * Math.sin(A) + circY * Math.cos(A);
          const ooz = 1 / z;

          const xp = Math.floor(COLS / 2 + K1 * ooz * x);
          const yp = Math.floor(ROWS / 2 - K1 * ooz * y * 0.55); // 压扁适配字符宽高比

          // Lambert 光照：法线 = (ct*cp, st*cp, sp) 与固定光源点积
          const L = cp * ct * Math.sin(B) - st * Math.cos(A)
                  - st * Math.sin(A) * 0.5 + ct * cp * Math.cos(A) * 0.5;
          if (L > 0 && xp >= 0 && xp < COLS && yp >= 0 && yp < ROWS) {
            const idx = yp * COLS + xp;
            if (ooz > zbuf[idx]) {
              zbuf[idx] = ooz;
              output[idx] = CHARS[Math.floor(L * 8)];
            }
          }
        }
      }
      pre.textContent = output
        .map((c, i) => (i % COLS === COLS - 1 ? c + '\n' : c))
        .join('');
      A += 0.04;
      B += 0.02;
    }
    rafId = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!rafId) { last = 0; rafId = requestAnimationFrame(frame); }
  });

  rafId = requestAnimationFrame(frame);
})();
