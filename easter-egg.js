// 彩蛋：Konami 秘籍（↑↑↓↓←→←→BA）→ 全屏 Matrix 数字雨 8 秒
(() => {
  const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
               'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;

  addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (key === SEQ[pos]) ? pos + 1 : (key === SEQ[0] ? 1 : 0);
    if (pos === SEQ.length) { pos = 0; matrixRain(); }
  });

  function matrixRain() {
    if (document.getElementById('matrix-overlay')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-overlay';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const FS = 14;
    const cols = Math.ceil(canvas.width / FS);
    const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF<>/{};$#';

    canvas.style.opacity = '1';
    let rafId;
    const start = performance.now();

    (function draw(now) {
      if (now - start > 8000) {
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 600);
        return;
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = FS + 'px monospace';
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = Math.random() < 0.05 ? '#d4ffdf' : '#00ff41';
        ctx.fillText(ch, i * FS, drops[i] * FS);
        if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      rafId = requestAnimationFrame(draw);
    })(start);

    console.log('%c黑客帝国模式已激活 ⚒️', 'color:#00ff41;font-size:16px;font-weight:bold');
  }
})();
