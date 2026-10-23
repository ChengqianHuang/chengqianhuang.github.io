import { BreakoutGame, W, H, WALL, R, STEP, LEVELS, POWERS } from './breakout-engine.mjs?v=1';

const canvas = document.getElementById('breakout-canvas');
const ctx = canvas.getContext('2d');
const controls = canvas.closest('.arcade-machine');
const ui = {};
for (const name of ['overlay', 'message', 'description', 'start', 'score', 'best', 'lives', 'level', 'pause', 'restart', 'sound', 'status', 'level-name', 'remaining', 'effects']) {
  ui[name] = document.getElementById(`breakout-${name}`);
}
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const keys = new Set();
let best = 0, enabledSound = false, audio = null, lastTone = 0;
let particles = [], labels = [], rings = [], shake = 0;
let frameId = 0, lastTime = 0, accumulator = 0, lastUI = '', activePointer = null;
try {
  const saved = Number(localStorage.getItem('breakout-best-v1'));
  if (Number.isFinite(saved) && saved >= 0) best = Math.min(999999999, Math.floor(saved));
  enabledSound = localStorage.getItem('breakout-sound-v1') === 'on';
} catch { /* Storage is optional. */ }

function unlockAudio() {
  if (!enabledSound) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio ||= new Audio();
    audio.resume().catch(() => {});
  } catch { /* Audio is optional too. */ }
}
function tone(type) {
  if (!enabledSound || !audio || audio.state !== 'running' || audio.currentTime - lastTone < .025) return;
  lastTone = audio.currentTime;
  const frequencies = { brick: 600, armor: 290, paddle: 230, explosion: 110, power: 850, save: 460, clear: 1050, miss: 140 };
  const oscillator = audio.createOscillator(), volume = audio.createGain();
  oscillator.type = type === 'explosion' ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(frequencies[type] || 400, audio.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime((frequencies[type] || 400) * .65, audio.currentTime + .1);
  volume.gain.setValueAtTime(.045, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .12);
  oscillator.connect(volume); volume.connect(audio.destination);
  oscillator.start(); oscillator.stop(audio.currentTime + .13);
  oscillator.onended = () => { oscillator.disconnect(); volume.disconnect(); };
}
function soundButton() {
  ui.sound.textContent = enabledSound ? '音效开' : '音效关';
  ui.sound.setAttribute('aria-label', enabledSound ? '关闭音效' : '开启音效');
  ui.sound.setAttribute('aria-pressed', String(enabledSound));
}
function announce(message) { ui.status.textContent = message; }
function burst(x, y, color, count = 10) {
  if (reduced.matches) return;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2, speed = 35 + Math.random() * 125;
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, color });
  }
  if (particles.length > 200) particles.splice(0, particles.length - 200);
}
function effect(event) {
  tone(event.type);
  if (event.type === 'brick' || event.type === 'armor') {
    burst(event.x, event.y, event.color, event.type === 'brick' ? 10 : 4);
    if (!reduced.matches && event.type === 'brick') labels.push({ x: event.x, y: event.y, age: 0,
      text: event.multiplier > 1 ? `${event.multiplier}× 连击` : `+${event.points}`, color: event.multiplier > 1 ? '#ffd48c' : '#e6edf5' });
  } else if (event.type === 'explosion' || event.type === 'save') {
    burst(event.x, event.y, event.color, 22);
    if (!reduced.matches) { rings.push({ x: event.x, y: event.y, age: 0, color: event.color }); shake = .12; }
  } else if (event.type === 'paddle') burst(event.x, event.y, event.color, 5);
  else if (event.type === 'power') {
    const power = POWERS[event.kind];
    burst(event.x, event.y, power.color, 14);
    labels.push({ x: event.x, y: event.y - 10, age: 0, text: power.label, color: power.color });
    announce(`获得${power.label}。`);
  }
  if (labels.length > 10) labels.shift();
}
const game = new BreakoutGame({ emit: effect });

function updateUI() {
  if (game.score > best) {
    best = game.score;
    try { localStorage.setItem('breakout-best-v1', String(best)); } catch { /* Keep playing. */ }
  }
  const powers = [];
  if (game.wideTime > 0) powers.push(`加长 ${Math.ceil(game.wideTime)}s`);
  if (game.balls.length > 1) powers.push(`${game.balls.length} 球`);
  if (game.shield) powers.push('护底 ×1');
  const effects = powers.join(' · ') || '接住掉落的道具';
  const signature = `${game.score}/${best}/${game.lives}/${game.level}/${game.mode}/${game.remaining}/${effects}`;
  if (signature === lastUI) return;
  lastUI = signature;
  ui.score.textContent = String(game.score).padStart(4, '0');
  ui.best.textContent = String(best).padStart(4, '0');
  ui.lives.textContent = game.lives;
  ui.level.textContent = game.level;
  ui['level-name'].textContent = `${String(game.level).padStart(2, '0')} / ${LEVELS[game.level - 1].name}`;
  ui.remaining.textContent = `${game.remaining} 块`;
  ui.effects.textContent = effects;
  ui.pause.disabled = !['playing', 'paused'].includes(game.mode);
  ui.pause.textContent = game.mode === 'paused' ? '继续' : '暂停';
  ui.restart.disabled = game.mode === 'ready';
}
function presentOverlay(automatic = false) {
  const messages = {
    ready: ['经典打砖块', '八关不同布局。接住道具，清空砖块。', '开始游戏'],
    paused: ['休息一下', automatic ? '游戏已自动暂停，回来后接着玩。' : '小球和道具都停住了，准备好再继续。', '继续游戏'],
    life: ['再接一球', `还剩 ${game.lives} 次机会，打掉的砖块会保留。`, '继续挑战'],
    level: [`第 ${game.level} 关完成`, `过关奖励 ${game.level * 100} 分。当前 ${game.score} 分，还剩 ${game.lives} 次机会。`, '下一关'],
    lost: ['这一局结束', `拿下 ${game.score} 分。试试用挡板边缘改变球的方向。`, '再玩一次'],
    won: ['八关，全部打掉了！', `拿下 ${game.score} 分。再挑战一次最高分？`, '再玩一次'],
  };
  const message = messages[game.mode];
  if (!message) return;
  keys.clear(); activePointer = null;
  cancelAnimationFrame(frameId); frameId = 0;
  [ui.message.textContent, ui.description.textContent, ui.start.textContent] = message;
  ui.overlay.hidden = false;
  updateUI(); announce(`${message[0]}。${message[1]}`); draw();
}
function begin() {
  unlockAudio();
  if (game.mode !== 'paused') { particles = []; labels = []; rings = []; shake = 0; }
  game.start();
  ui.overlay.hidden = true;
  keys.clear(); activePointer = null;
  lastTime = 0; accumulator = 0;
  updateUI();
  announce(`第 ${game.level} 关，${LEVELS[game.level - 1].name}。剩余 ${game.lives} 次机会。`);
  canvas.focus({ preventScroll: true });
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(frame);
}
function pause(automatic = false) {
  if (game.mode !== 'playing') return;
  game.mode = 'paused'; presentOverlay(automatic);
}
function roundedRect(x, y, w, h, radius = 5) { ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); }
function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#101b2b'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (shake > 0 && !reduced.matches) ctx.translate((Math.random() - .5) * 3, (Math.random() - .5) * 3);
  ctx.fillStyle = '#9fbad51c';
  for (let y = 34; y < H - 20; y += 24) for (let x = 36; x < W - 24; x += 24) ctx.fillRect(x, y, 1, 1);
  ctx.strokeStyle = '#9fbad52b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(WALL, H - 20); ctx.lineTo(WALL, WALL + 8);
  ctx.quadraticCurveTo(WALL, WALL, WALL + 8, WALL); ctx.lineTo(W - WALL - 8, WALL);
  ctx.quadraticCurveTo(W - WALL, WALL, W - WALL, WALL + 8); ctx.lineTo(W - WALL, H - 20); ctx.stroke();
  for (const brick of game.bricks) {
    if (!brick.hp) continue;
    ctx.fillStyle = brick.type === 'bomb' ? '#cb7255' : brick.color;
    roundedRect(brick.x, brick.y, brick.w, brick.h, 4); ctx.fill();
    ctx.fillStyle = '#ffffff38'; roundedRect(brick.x + 4, brick.y + 3, brick.w - 8, 2, 1); ctx.fill();
    if (brick.type === 'armor') {
      ctx.strokeStyle = '#fff8ddbf'; ctx.lineWidth = 1.4;
      roundedRect(brick.x + 2, brick.y + 2, brick.w - 4, brick.h - 4, 3); ctx.stroke();
      ctx.fillStyle = '#263440b3';
      for (let dot = 0; dot < brick.hp; dot++) { ctx.beginPath(); ctx.arc(brick.x + brick.w / 2 + (dot - (brick.hp - 1) / 2) * 7, brick.y + 12, 1.8, 0, Math.PI * 2); ctx.fill(); }
    } else if (brick.type === 'bomb') {
      ctx.fillStyle = '#fff3d9'; ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText('✦', brick.x + brick.w / 2, brick.y + 16);
    }
    if (brick.flash > 0) { ctx.globalAlpha = brick.flash / .09 * .7; ctx.fillStyle = '#fff'; roundedRect(brick.x, brick.y, brick.w, brick.h, 4); ctx.fill(); ctx.globalAlpha = 1; }
  }
  if (game.shield) {
    ctx.strokeStyle = '#8ec9ed'; ctx.lineWidth = 3; ctx.setLineDash([12, 6]);
    ctx.beginPath(); ctx.moveTo(WALL + 4, H - 15); ctx.lineTo(W - WALL - 4, H - 15); ctx.stroke(); ctx.setLineDash([]);
  }
  for (const drop of game.drops) {
    const power = POWERS[drop.kind];
    ctx.fillStyle = '#132a35'; roundedRect(drop.x - 21, drop.y - 12, 42, 24, 12); ctx.fill();
    ctx.strokeStyle = power.color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = power.color; ctx.font = 'bold 19px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(power.icon, drop.x, drop.y); ctx.textBaseline = 'alphabetic';
  }
  if (!reduced.matches) {
    for (const ring of rings) {
      ctx.globalAlpha = 1 - ring.age / .4; ctx.strokeStyle = ring.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, 8 + ring.age * 180, 0, Math.PI * 2); ctx.stroke();
    }
    for (const particle of particles) {
      ctx.globalAlpha = 1 - particle.age / .45; ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    }
  }
  ctx.globalAlpha = 1;
  for (const ball of game.balls) {
    if (!reduced.matches) {
      ball.trail.forEach((point, index) => {
        ctx.globalAlpha = (index + 1) / ball.trail.length * .22;
        ctx.fillStyle = '#ffe0a6'; ctx.beginPath(); ctx.arc(point.x, point.y, R * (index + 1) / ball.trail.length, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowColor = '#f5c964'; ctx.shadowBlur = 12;
    }
    ctx.fillStyle = '#fff5da'; ctx.beginPath(); ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  }
  const p = game.paddle;
  ctx.fillStyle = game.wideTime > 0 ? '#a5ead2' : '#7ccbbb'; roundedRect(p.x - p.w / 2, p.y, p.w, p.h, 6); ctx.fill();
  ctx.fillStyle = '#ffffffa0'; roundedRect(p.x - p.w / 2 + 6, p.y + 2, p.w - 12, 2, 1); ctx.fill();
  for (const label of labels) {
    ctx.globalAlpha = Math.max(0, 1 - label.age / .7); ctx.fillStyle = label.color;
    ctx.font = '600 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText(label.text, label.x, label.y - label.age * 36);
  }
  ctx.globalAlpha = 1; ctx.restore();
}
function frame(now) {
  frameId = 0;
  if (game.mode !== 'playing') return;
  const elapsed = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
  lastTime = now; accumulator += elapsed;
  while (accumulator >= STEP && game.mode === 'playing') {
    game.step(STEP, Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft')));
    accumulator -= STEP;
  }
  for (const particle of particles) { particle.age += elapsed; particle.x += particle.vx * elapsed; particle.y += particle.vy * elapsed; particle.vy += 100 * elapsed; }
  for (const label of labels) label.age += elapsed;
  for (const ring of rings) ring.age += elapsed;
  particles = particles.filter(p => p.age < .45); labels = labels.filter(p => p.age < .7); rings = rings.filter(p => p.age < .4);
  shake = Math.max(0, shake - elapsed);
  if (!reduced.matches) for (const ball of game.balls) { ball.trail.push({ x: ball.x, y: ball.y }); if (ball.trail.length > 8) ball.trail.shift(); }
  updateUI(); draw();
  if (game.mode === 'playing') frameId = requestAnimationFrame(frame);
  else presentOverlay();
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0); draw();
}
function movePointer(event) {
  if (game.mode !== 'playing') return;
  const rect = canvas.getBoundingClientRect();
  if (event.pointerType === 'mouse') game.paddle.target = (event.clientX - rect.left) / rect.width * W;
  else if (activePointer?.id === event.pointerId) game.paddle.target = activePointer.paddleX + (event.clientX - activePointer.x) / rect.width * W * 1.25;
}
canvas.addEventListener('pointerdown', event => {
  if (game.mode !== 'playing' || activePointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
  activePointer = { id: event.pointerId, x: event.clientX, paddleX: game.paddle.x };
  canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true }); movePointer(event);
});
canvas.addEventListener('pointermove', movePointer);
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, event => { if (activePointer?.id === event.pointerId) activePointer = null; });
controls.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(event.key)) return;
  if (event.key === ' ' && event.target.closest('button')) return;
  event.preventDefault(); event.stopPropagation();
  if (event.key.startsWith('Arrow')) keys.add(event.key);
  else if (!event.repeat && event.key === 'Escape') pause();
  else if (!event.repeat) game.mode === 'playing' ? pause() : begin();
});
controls.addEventListener('keyup', event => {
  if (!['ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(event.key)) return;
  if (event.key === ' ' && event.target.closest('button')) return;
  event.preventDefault(); event.stopPropagation(); keys.delete(event.key);
});
controls.addEventListener('focusout', event => {
  keys.clear();
  if (event.relatedTarget && controls.contains(event.relatedTarget)) return;
  queueMicrotask(() => { if (!controls.contains(document.activeElement)) pause(true); });
});
ui.start.addEventListener('click', begin);
ui.restart.addEventListener('click', () => { game.mode = 'ready'; begin(); });
ui.pause.addEventListener('click', () => game.mode === 'paused' ? begin() : pause());
ui.sound.addEventListener('click', () => {
  enabledSound = !enabledSound; unlockAudio(); soundButton();
  try { localStorage.setItem('breakout-sound-v1', enabledSound ? 'on' : 'off'); } catch { /* Optional preference. */ }
  if (enabledSound) tone('power');
});
addEventListener('blur', () => pause(true));
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
new IntersectionObserver(entries => { if (entries[0].intersectionRatio < .1) pause(true); }, { threshold: [0, .1] }).observe(canvas);
new ResizeObserver(resize).observe(canvas);
reduced.addEventListener('change', () => { particles = []; labels = []; rings = []; for (const ball of game.balls) ball.trail = []; draw(); });
soundButton(); updateUI(); resize();
