import { NeonGame, STEP, WIDTH, HEIGHT } from './neon-engine.mjs';
import { NeonRenderer } from './neon-renderer.mjs';
import { NeonAudio } from './neon-audio.mjs';

const $ = id => document.getElementById(id);
const canvas = $('neon-canvas'), machine = $('neon-machine'), overlay = $('neon-overlay');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const audio = new NeonAudio();
const keys = new Set();
const moveTouch = { x: 0, y: 0 }, aimTouch = { x: 0, y: 0 };
let renderer, selectedMode = 'standard', mouseFire = false, pointerX = WIDTH / 2, pointerY = HEIGHT / 2;
let dashQueued = false, pulseQueued = false, previous = performance.now(), accumulator = 0, visualTime = 0;
let lastRender = 0, lastHUD = 0;
let bannerTimer = 0, finishTimer = 0, sound = true, previousOverflow = '';
let best = 0;
try { best = Number(localStorage.getItem('neon-rift-best')) || 0; sound = localStorage.getItem('neon-rift-sound') !== 'off'; } catch {}

function banner(kicker, title, subtitle, duration = 2200) {
  clearTimeout(bannerTimer);
  const el = $('neon-banner');
  el.querySelector('small').textContent = kicker;
  el.querySelector('strong').textContent = title;
  el.querySelector('span').textContent = subtitle;
  el.classList.add('show');
  bannerTimer = setTimeout(() => el.classList.remove('show'), duration);
}

function onGameEvent(event) {
  renderer?.onEvent(event);
  audio.onEvent(event);
  if (event.type === 'wave') {
    const waves = {
      0: ['DIRECT LINK', 'BOSS RUSH', '跳过虫群，直抵裂隙核心'],
      1: ['SECTOR 01', '几何虫群', '保持移动，按住射击'],
      2: ['SECTOR 02', '分裂协议', '连杀 5 / 15 / 35 解锁多重火力'],
      3: ['SECTOR 03', '事件视界', '引力体正在扭曲战场']
    };
    banner(...(waves[event.wave] || waves[1]));
  } else if (event.type === 'bossSpawn') {
    banner('WARNING // ANOMALY DETECTED', '裂隙主宰', '三个阶段。观察预警，不要停在弹道上。', 3200);
  } else if (event.type === 'bossPhase') {
    banner(`CORE PHASE 0${event.phase}`, event.phase === 2 ? '螺旋苏醒' : '终极过载', event.phase === 2 ? '旋转弹幕已展开' : '激光预警后立即离开弹道', 2400);
  }
}

const game = new NeonGame({ emit: onGameEvent });

function formatScore(value) { return Math.floor(value).toString().padStart(8, '0'); }
function formatTime(seconds) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}
function saveBest() {
  if (game.score <= best) return;
  best = Math.floor(game.score);
  try { localStorage.setItem('neon-rift-best', String(best)); } catch {}
}

function setTitle(html) { $('neon-title').innerHTML = html; }
function showOverlay(kind = 'menu') {
  clearTimeout(finishTimer);
  overlay.hidden = false;
  $('neon-touch').hidden = true;
  const menu = kind === 'menu', paused = kind === 'paused', result = kind === 'gameover' || kind === 'victory';
  $('neon-mode-picker').hidden = !menu;
  $('neon-results').hidden = !result;
  $('neon-secondary').hidden = !(paused || result);
  $('neon-menu-return').hidden = !(!menu && (paused || result));
  $('neon-menu-help').hidden = !menu;
  if (menu) {
    $('neon-kicker').textContent = 'A WEBGL2 ARENA EXPERIMENT';
    setTitle('<span>NEON</span><em>//</em>RIFT');
    $('neon-chinese').textContent = '霓 虹 裂 变';
    $('neon-description').textContent = '撕开几何虫群，维持连杀，把整座竞技场变成武器。';
    $('neon-start').innerHTML = '进入裂隙 <span>→</span>';
  } else if (paused) {
    $('neon-kicker').textContent = 'SIMULATION SUSPENDED';
    setTitle('SYSTEM <em>//</em> HOLD');
    $('neon-chinese').textContent = '裂 隙 已 冻 结';
    $('neon-description').textContent = '战场、弹幕与计时均已暂停。准备好再重新接入。';
    $('neon-start').innerHTML = '继续战斗 <span>→</span>';
  } else {
    saveBest();
    const victory = kind === 'victory';
    $('neon-kicker').textContent = victory ? 'RIFT SIGNATURE NEUTRALIZED' : 'PILOT SIGNAL TERMINATED';
    setTitle(victory ? 'RIFT <em>//</em> SEALED' : 'SIGNAL <em>//</em> LOST');
    $('neon-chinese').textContent = victory ? '裂 隙 已 封 闭' : '舰 体 解 体';
    $('neon-description').textContent = victory ? '核心崩解，空间正在复原。下一次，试着让连杀不断。' : '虫群仍在扩张。调整冲刺节奏，再来一次。';
    $('neon-result-score').textContent = formatScore(game.score);
    $('neon-result-time').textContent = formatTime(game.time);
    $('neon-result-kills').textContent = String(game.kills);
    $('neon-start').innerHTML = '再次接入 <span>→</span>';
  }
  $('neon-record').textContent = best > 0 ? `本地最高分 ${formatScore(best)}` : '本地最高分等待刷新';
  $('neon-pause-button').disabled = true;
  updateHUD();
}

function clearInput() {
  keys.clear(); mouseFire = false; dashQueued = false; pulseQueued = false;
  for (const [id, stick] of [['neon-move-stick', moveTouch], ['neon-aim-stick', aimTouch]]) {
    stick.x = stick.y = 0;
    $(id).style.setProperty('--stick-x', '0px'); $(id).style.setProperty('--stick-y', '0px');
  }
}

function begin() {
  clearTimeout(finishTimer);
  clearInput();
  audio.setEnabled(sound);
  if (game.state === 'paused') game.state = 'playing';
  else {
    game.reset({ mode: selectedMode });
    renderer?.resetEffects();
    game.start();
  }
  overlay.hidden = true;
  $('neon-touch').hidden = false;
  $('neon-pause-button').disabled = false;
  accumulator = 0; previous = performance.now();
  canvas.focus({ preventScroll: true });
}
function pause() {
  if (game.state !== 'playing') return;
  game.state = 'paused'; clearInput(); showOverlay('paused');
}
function finish() {
  saveBest();
  clearTimeout(finishTimer);
  finishTimer = setTimeout(() => showOverlay(game.state), 1050);
}
function menu() {
  clearTimeout(finishTimer); clearInput(); saveBest(); game.reset({ mode: selectedMode });
  renderer?.resetEffects(); showOverlay('menu');
}

function updateHUD() {
  const p = game.player;
  $('neon-score').textContent = formatScore(game.score);
  $('neon-best').textContent = formatScore(Math.max(best, game.score));
  $('neon-multiplier').textContent = `×${game.multiplier}`;
  $('neon-combo').textContent = game.combo > 0 ? `${game.combo} 连破 · ${game.comboTimer.toFixed(1)} 秒窗口` : '保持移动 · 按住射击';
  $('neon-health').textContent = String(Math.ceil(p.hp));
  $('neon-health-bar').style.width = `${p.hp}%`;
  $('neon-health-bar').style.background = p.hp < 30 ? '#ff456d' : '#4ff5cb';
  const dash = Math.min(1, 1 - p.dashCooldown / 1.25);
  $('neon-dash-bar').style.width = `${dash * 100}%`;
  $('neon-dash').textContent = dash >= 1 ? 'READY' : `${Math.ceil(dash * 100)}%`;
  $('neon-pulse-bar').style.width = `${p.energy}%`;
  $('neon-pulse').textContent = p.energy >= 100 ? 'READY' : `${Math.floor(p.energy)}%`;
  $('neon-touch-pulse').classList.toggle('ready', p.energy >= 100);
  $('neon-time').textContent = formatTime(game.time);
  const boss = game.enemies.find(e => e.kind === 'boss');
  $('neon-sector').textContent = boss ? 'RIFT CORE' : game.mode === 'boss' ? 'BOSS RUSH' : `SECTOR 0${game.wave}`;
  $('neon-boss-hud').hidden = !boss;
  if (boss) {
    $('neon-boss-phase').textContent = `PHASE 0${boss.phase}`;
    $('neon-boss-bar').style.width = `${Math.max(0, boss.hp / boss.maxHp * 100)}%`;
  }
  $('neon-pause-button').disabled = game.state !== 'playing';
}

function readInput() {
  const p = game.player;
  const mx = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0) + moveTouch.x;
  const my = (keys.has('KeyS') ? 1 : 0) - (keys.has('KeyW') ? 1 : 0) + moveTouch.y;
  const keyboardAimX = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
  const keyboardAimY = (keys.has('ArrowDown') ? 1 : 0) - (keys.has('ArrowUp') ? 1 : 0);
  let aimX = pointerX - p.x, aimY = pointerY - p.y, fire = mouseFire;
  if (keyboardAimX || keyboardAimY) { aimX = keyboardAimX; aimY = keyboardAimY; fire = true; }
  if (Math.hypot(aimTouch.x, aimTouch.y) > 0.12) { aimX = aimTouch.x; aimY = aimTouch.y; fire = true; }
  const input = { moveX: mx, moveY: my, aimX, aimY, fire, dash: dashQueued, pulse: pulseQueued };
  dashQueued = false; pulseQueued = false;
  return input;
}

function frame(now) {
  const dt = Math.min(0.25, Math.max(0, (now - previous) / 1000));
  previous = now;
  if (game.state !== 'paused') visualTime += dt;
  if (game.state === 'playing') {
    accumulator += dt;
    let steps = 0;
    while (accumulator >= STEP && steps++ < 30 && game.state === 'playing') {
      game.step(STEP, readInput()); accumulator -= STEP;
    }
    if (accumulator > STEP * 2) accumulator = STEP * 2;
    if (game.state === 'gameover' || game.state === 'victory') finish();
  } else accumulator = 0;
  audio.update(game);
  const renderInterval = game.state === 'paused' ? 100 : game.state === 'ready' ? 33 : 0;
  if (now - lastRender >= renderInterval) {
    renderer.render(game, visualTime); lastRender = now;
  }
  if (now - lastHUD >= 50) { updateHUD(); lastHUD = now; }
  requestAnimationFrame(frame);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  pointerX = (event.clientX - rect.left) / rect.width * WIDTH;
  pointerY = (event.clientY - rect.top) / rect.height * HEIGHT;
  renderer?.setPointer(pointerX, pointerY, true);
}
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0 || game.state !== 'playing') return;
  event.preventDefault(); pointerPosition(event); mouseFire = true;
  canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true });
});
canvas.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') pointerPosition(event); });
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, () => { mouseFire = false; });
canvas.addEventListener('pointerleave', () => renderer?.setPointer(pointerX, pointerY, false));
canvas.addEventListener('contextmenu', event => event.preventDefault());

addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.code === 'Escape') { event.preventDefault(); if (!event.repeat) game.state === 'paused' ? begin() : pause(); return; }
  if (event.code === 'KeyF') { event.preventDefault(); if (!event.repeat) toggleFullscreen(); return; }
  if (event.target.closest('button,input,select') && ['Space', 'Enter'].includes(event.code)) return;
  if (game.state !== 'playing') return;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  keys.add(event.code);
  if (!event.repeat && event.code === 'Space') dashQueued = true;
  if (!event.repeat && event.code === 'KeyE') pulseQueued = true;
  if (event.code.startsWith('Arrow')) renderer?.setPointer(pointerX, pointerY, false);
});
addEventListener('keyup', event => keys.delete(event.code));
addEventListener('pagehide', saveBest);
addEventListener('blur', () => { clearInput(); pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

function setupStick(id, state) {
  const element = $(id); let activePointer = null;
  const update = event => {
    const rect = element.getBoundingClientRect(), radius = rect.width * 0.34;
    let dx = event.clientX - (rect.left + rect.width / 2), dy = event.clientY - (rect.top + rect.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > radius) { dx *= radius / d; dy *= radius / d; }
    state.x = dx / radius; state.y = dy / radius;
    element.style.setProperty('--stick-x', `${dx}px`); element.style.setProperty('--stick-y', `${dy}px`);
  };
  const release = event => {
    if (activePointer !== event.pointerId) return;
    activePointer = null; state.x = state.y = 0;
    element.style.setProperty('--stick-x', '0px'); element.style.setProperty('--stick-y', '0px');
  };
  element.addEventListener('pointerdown', event => {
    if (game.state !== 'playing' || activePointer !== null) return;
    event.preventDefault(); activePointer = event.pointerId; element.setPointerCapture(event.pointerId); update(event);
  });
  element.addEventListener('pointermove', event => { if (activePointer === event.pointerId) update(event); });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) element.addEventListener(type, release);
}
setupStick('neon-move-stick', moveTouch); setupStick('neon-aim-stick', aimTouch);
for (const [id, action] of [['neon-touch-dash', () => { dashQueued = true; }], ['neon-touch-pulse', () => { pulseQueued = true; }]]) {
  $(id).addEventListener('pointerdown', event => { if (game.state === 'playing') { event.preventDefault(); action(); } });
  $(id).addEventListener('click', event => { if (event.detail === 0 && game.state === 'playing') action(); });
}

for (const button of document.querySelectorAll('[data-neon-mode]')) button.addEventListener('click', () => {
  selectedMode = button.dataset.neonMode;
  for (const b of document.querySelectorAll('[data-neon-mode]')) b.setAttribute('aria-pressed', String(b === button));
});
$('neon-start').addEventListener('click', begin);
$('neon-secondary').addEventListener('click', () => { game.reset({ mode: selectedMode }); begin(); });
$('neon-menu-return').addEventListener('click', menu);
$('neon-pause-button').addEventListener('click', pause);
$('neon-sound').addEventListener('click', () => {
  sound = !sound; audio.setEnabled(sound);
  $('neon-sound').textContent = `声音：${sound ? '开' : '关'}`;
  $('neon-sound').setAttribute('aria-pressed', String(sound));
  try { localStorage.setItem('neon-rift-sound', sound ? 'on' : 'off'); } catch {}
});
$('neon-sound').textContent = `声音：${sound ? '开' : '关'}`;
$('neon-sound').setAttribute('aria-pressed', String(sound));

function toggleFullscreen() {
  const expanded = !machine.classList.contains('is-expanded');
  machine.classList.toggle('is-expanded', expanded);
  if (expanded) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  else document.body.style.overflow = previousOverflow;
  $('neon-fullscreen').textContent = expanded ? '退出全屏' : '全屏';
  clearInput(); requestAnimationFrame(() => renderer?.resize());
}
$('neon-fullscreen').addEventListener('click', toggleFullscreen);

try {
  renderer = new NeonRenderer(canvas, { reducedMotion: reduced.matches });
  $('neon-renderer-info').textContent = `WEBGL2 · ${renderer.extFloat ? 'HDR16F' : 'LDR'} · 65K GPU PARTICLES`;
  new ResizeObserver(() => renderer.resize()).observe(canvas);
  reduced.addEventListener('change', () => { renderer.reducedMotion = reduced.matches; });
  showOverlay('menu'); renderer.resize(); requestAnimationFrame(frame);
} catch (error) {
  console.error(error);
  $('neon-kicker').textContent = 'RENDERER INITIALIZATION FAILED';
  setTitle('WEBGL <em>//</em> ERROR');
  $('neon-chinese').textContent = '无 法 启 动 裂 隙';
  $('neon-description').textContent = error.message;
  $('neon-start').disabled = true;
  $('neon-mode-picker').hidden = true;
  $('neon-menu-help').hidden = true;
  $('neon-renderer-info').textContent = 'WEBGL2 UNAVAILABLE';
}
