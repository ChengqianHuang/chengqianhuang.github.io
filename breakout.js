// 首页打砖块：固定时间步长的物理模拟，只有开局后才运行动画。
(() => {
  const canvas = document.getElementById('breakout-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const ui = {};
  for (const name of ['overlay', 'message', 'description', 'start', 'score', 'best', 'lives', 'level', 'pause', 'restart', 'status']) {
    ui[name] = document.getElementById(`breakout-${name}`);
  }
  const W = 720, H = 440, WALL = 24, R = 8, STEP = 1 / 240;
  const COLORS = ['#ff9760', '#f5c964', '#76d7c4', '#7bb8f5', '#b3a0ef'];
  const BEST_KEY = 'breakout-best-v1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const paddle = { x: W / 2, y: 398, w: 116, h: 12 };
  const ball = { x: W / 2, y: paddle.y - R - 3, vx: 0, vy: 0 };
  const keys = new Set();
  let mode = 'ready', level = 1, lives = 3, score = 0, best = 0;
  let bricks = [], particles = [], trail = [], frameId = 0, lastTime = 0, accumulator = 0;
  let activePointer = null;

  try {
    const stored = Number(localStorage.getItem(BEST_KEY));
    if (Number.isFinite(stored) && stored >= 0) best = Math.min(999999999, Math.floor(stored));
  } catch (_) { /* 无法使用存储时仍可正常游戏。 */ }

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function makeBricks() {
    bricks = [];
    const cols = 9, gap = 8, brickW = (W - 2 * (WALL + 12) - gap * (cols - 1)) / cols;
    const rows = level === 1 ? 4 : 5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (level === 2 && (row + col) % 4 === 0) continue;
        if (level === 3 && ((row === 0 && (col < 2 || col > 6)) || (row === 2 && col === 4))) continue;
        bricks.push({
          x: WALL + 12 + col * (brickW + gap), y: 52 + row * 30,
          w: brickW, h: 22, color: COLORS[(row + level - 1) % COLORS.length], alive: true,
        });
      }
    }
  }

  function serve() {
    paddle.x = W / 2;
    ball.x = paddle.x;
    ball.y = paddle.y - R - 3;
    const speed = 270 + (level - 1) * 30;
    ball.vx = speed * 0.36 * ((lives + level) % 2 ? -1 : 1);
    ball.vy = -Math.sqrt(speed * speed - ball.vx * ball.vx);
    particles = [];
    trail = [];
  }

  function updateUI() {
    ui.score.textContent = String(score).padStart(4, '0');
    ui.best.textContent = String(best).padStart(4, '0');
    ui.lives.textContent = String(lives);
    ui.level.textContent = String(level);
    ui.pause.disabled = mode !== 'playing' && mode !== 'paused';
    ui.pause.textContent = mode === 'paused' ? '继续' : '暂停';
    ui.restart.disabled = mode === 'ready';
  }

  function announce(message) {
    ui.status.textContent = message;
  }

  function showOverlay(nextMode, title, description, button) {
    mode = nextMode;
    keys.clear();
    cancelAnimationFrame(frameId);
    frameId = 0;
    ui.message.textContent = title;
    ui.description.textContent = description;
    ui.start.textContent = button;
    ui.overlay.hidden = false;
    updateUI();
    announce(`${title}。${description}`);
    draw();
  }

  function play() {
    mode = 'playing';
    ui.overlay.hidden = true;
    keys.clear();
    lastTime = 0;
    accumulator = 0;
    updateUI();
    announce(`第 ${level} 关，剩余 ${lives} 次机会。`);
    canvas.focus({ preventScroll: true });
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(frame);
  }

  function newGame() {
    score = 0;
    lives = 3;
    level = 1;
    makeBricks();
    serve();
    play();
  }

  function start() {
    if (mode === 'playing') return;
    if (mode === 'ready' || mode === 'lost' || mode === 'won') return newGame();
    if (mode === 'level') {
      level++;
      makeBricks();
      serve();
    }
    play();
  }

  function pause(automatic = false) {
    if (mode !== 'playing') return;
    showOverlay('paused', '休息一下', automatic ? '游戏已自动暂停，回来后接着玩。' : '准备好后，继续刚才这一球。', '继续游戏');
  }

  function burst(x, y, color) {
    if (reduced.matches) return;
    for (let i = 0; i < 9; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 95;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, color });
    }
  }

  function hitBrick(brick, nx, ny, penetration) {
    ball.x += nx * (penetration + 0.05);
    ball.y += ny * (penetration + 0.05);
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) {
      ball.vx -= 2 * dot * nx;
      ball.vy -= 2 * dot * ny;
    }
    // 保持足够的竖直速度，避免小球长时间贴着一排砖水平移动。
    const speed = Math.min(430 + (level - 1) * 35, Math.hypot(ball.vx, ball.vy) + 3);
    const angle = Math.atan2(ball.vy, ball.vx);
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    if (Math.abs(ball.vy) < speed * 0.24) {
      ball.vy = (ball.vy < 0 ? -1 : 1) * speed * 0.24;
      ball.vx = (ball.vx < 0 ? -1 : 1) * Math.sqrt(speed * speed - ball.vy * ball.vy);
    }
    brick.alive = false;
    score += 10 + (level - 1) * 5;
    if (score > best) {
      best = score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) { /* 存储不可用时只保留本次最高分。 */ }
    }
    burst(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color);
    updateUI();
    if (bricks.every(b => !b.alive)) {
      if (level === 3) showOverlay('won', '全部打掉了！', `三关通关，拿下 ${score} 分。再来一局？`, '再玩一次');
      else showOverlay('level', `第 ${level} 关完成`, `现在是 ${score} 分，还剩 ${lives} 次机会。`, '下一关');
    }
  }

  function step(dt) {
    const direction = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
    paddle.x = clamp(paddle.x + direction * 550 * dt, WALL + paddle.w / 2, W - WALL - paddle.w / 2);
    const oldX = ball.x, oldY = ball.y;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x < WALL + R) { ball.x = WALL + R; ball.vx = Math.abs(ball.vx); }
    if (ball.x > W - WALL - R) { ball.x = W - WALL - R; ball.vx = -Math.abs(ball.vx); }
    if (ball.y < WALL + R) { ball.y = WALL + R; ball.vy = Math.abs(ball.vy); }

    // 检查小球跨过挡板上沿的时刻，防止帧率变化导致穿过挡板。
    if (ball.vy > 0 && oldY + R <= paddle.y && ball.y + R >= paddle.y) {
      const t = (paddle.y - R - oldY) / (ball.y - oldY);
      const crossingX = oldX + (ball.x - oldX) * t;
      if (crossingX >= paddle.x - paddle.w / 2 - R && crossingX <= paddle.x + paddle.w / 2 + R) {
        ball.x = crossingX;
        ball.y = paddle.y - R;
        const speed = Math.hypot(ball.vx, ball.vy);
        const offset = clamp((crossingX - paddle.x) / (paddle.w / 2), -1, 1);
        const angle = offset * 1.08;
        const oldSign = ball.vx < 0 ? -1 : 1;
        ball.vx = Math.sin(angle) * speed;
        if (Math.abs(ball.vx) < speed * 0.12) ball.vx = oldSign * speed * 0.12;
        ball.vy = -Math.sqrt(speed * speed - ball.vx * ball.vx);
        burst(crossingX, paddle.y, '#76d7c4');
      }
    }

    for (const brick of bricks) {
      if (!brick.alive) continue;
      const dx = ball.x - clamp(ball.x, brick.x, brick.x + brick.w);
      const dy = ball.y - clamp(ball.y, brick.y, brick.y + brick.h);
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared >= R * R) continue;
      if (distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        hitBrick(brick, dx / distance, dy / distance, R - distance);
      } else {
        const sides = [
          { d: ball.x - brick.x, nx: -1, ny: 0 },
          { d: brick.x + brick.w - ball.x, nx: 1, ny: 0 },
          { d: ball.y - brick.y, nx: 0, ny: -1 },
          { d: brick.y + brick.h - ball.y, nx: 0, ny: 1 },
        ];
        const side = sides.reduce((a, b) => a.d < b.d ? a : b);
        hitBrick(brick, side.nx, side.ny, R + side.d);
      }
      break;
    }
    if (mode !== 'playing') return;
    if (ball.y > H + R) {
      lives--;
      if (lives === 0) showOverlay('lost', '这一局结束', `得分 ${score}。换个接球角度，再试一次。`, '再玩一次');
      else {
        serve();
        showOverlay('life', '再接一球', `还剩 ${lives} 次机会，已经打掉的砖块会保留。`, '继续挑战');
      }
      return;
    }
    for (const particle of particles) {
      particle.age += dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 100 * dt;
    }
    particles = particles.filter(p => p.age < 0.45);
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const background = ctx.createLinearGradient(0, 0, W, H);
    background.addColorStop(0, '#111827');
    background.addColorStop(1, '#101b2c');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(159,186,213,.13)';
    for (let y = 34; y < H - 20; y += 24) {
      for (let x = 36; x < W - 24; x += 24) ctx.fillRect(x, y, 1, 1);
    }
    ctx.strokeStyle = 'rgba(159,186,213,.17)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(WALL, H - 20); ctx.lineTo(WALL, WALL + 10);
    ctx.quadraticCurveTo(WALL, WALL, WALL + 10, WALL);
    ctx.lineTo(W - WALL - 10, WALL);
    ctx.quadraticCurveTo(W - WALL, WALL, W - WALL, WALL + 10);
    ctx.lineTo(W - WALL, H - 20);
    ctx.stroke();

    for (const brick of bricks) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      roundedRect(brick.x, brick.y, brick.w, brick.h, 5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      roundedRect(brick.x + 4, brick.y + 3, brick.w - 8, 2, 1);
      ctx.fill();
      ctx.fillStyle = 'rgba(15,23,42,.17)';
      roundedRect(brick.x + 4, brick.y + brick.h - 4, brick.w - 8, 2, 1);
      ctx.fill();
    }

    if (!reduced.matches) {
      trail.forEach((point, i) => {
        ctx.globalAlpha = (i + 1) / trail.length * 0.22;
        ctx.fillStyle = '#ffe0a6';
        ctx.beginPath(); ctx.arc(point.x, point.y, R * (i + 1) / trail.length, 0, Math.PI * 2); ctx.fill();
      });
      for (const particle of particles) {
        ctx.globalAlpha = 1 - particle.age / 0.45;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      }
      ctx.globalAlpha = 1;
      ctx.shadowColor = '#f5c964';
      ctx.shadowBlur = 15;
    }
    ctx.fillStyle = '#fff5da';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#76d7c4';
    roundedRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h, paddle.h / 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.65)';
    roundedRect(paddle.x - paddle.w / 2 + 6, paddle.y + 2, paddle.w - 12, 2, 1);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 1;
    for (const offset of [-4, 0, 4]) {
      ctx.beginPath(); ctx.moveTo(paddle.x + offset, paddle.y + 5); ctx.lineTo(paddle.x + offset, paddle.y + 8); ctx.stroke();
    }
  }

  function frame(now) {
    frameId = 0;
    if (mode !== 'playing') return;
    const elapsed = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    accumulator += elapsed;
    while (accumulator >= STEP && mode === 'playing') {
      step(STEP);
      accumulator -= STEP;
    }
    if (!reduced.matches && mode === 'playing') {
      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > 7) trail.shift();
    }
    draw();
    if (mode === 'playing') frameId = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    draw();
  }

  function movePointer(event) {
    if (mode !== 'playing') return;
    if (event.pointerType !== 'mouse' && event.pointerId !== activePointer) return;
    const rect = canvas.getBoundingClientRect();
    paddle.x = clamp((event.clientX - rect.left) / rect.width * W, WALL + paddle.w / 2, W - WALL - paddle.w / 2);
  }

  canvas.addEventListener('pointerdown', event => {
    if (mode !== 'playing' || (event.pointerType === 'mouse' && event.button !== 0)) return;
    activePointer = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    canvas.focus({ preventScroll: true });
    movePointer(event);
  });
  canvas.addEventListener('pointermove', movePointer);
  const releasePointer = event => {
    if (event.pointerId === activePointer) activePointer = null;
  };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);
  canvas.addEventListener('lostpointercapture', releasePointer);
  canvas.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') keys.add(event.key);
    else if (!event.repeat && event.key === 'Escape') pause();
    else if (!event.repeat && event.key === ' ') {
      if (mode === 'playing') pause();
      else start();
    }
  });
  canvas.addEventListener('keyup', event => {
    if (!['ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    keys.delete(event.key);
  });
  canvas.addEventListener('blur', () => keys.clear());
  ui.start.addEventListener('click', start);
  ui.restart.addEventListener('click', newGame);
  ui.pause.addEventListener('click', () => mode === 'paused' ? play() : pause());
  addEventListener('blur', () => pause(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
  new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio < 0.1) pause(true);
  }, { threshold: [0, 0.1] }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  reduced.addEventListener('change', () => { trail = []; particles = []; draw(); });
  makeBricks();
  serve();
  updateUI();
  resize();
})();
