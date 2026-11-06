// 时滞行动 CHRONOSTASIS —— 渲染、输入与界面。只读取引擎状态，不修改规则。
import {gameStore} from './game-storage.mjs';
import { ChronoGame, LEVELS, WIDTH, HEIGHT } from './chronostasis-engine.mjs';

const $ = (id) => document.getElementById(id);
const canvas = $('ch-canvas');
const ctx = canvas.getContext('2d');
const stage = $('ch-stage');
const machine = $('ch-machine');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const els = {
  hudLevel: $('ch-hud-level'), hudEnemy: $('ch-hud-enemy'), hudWeapon: $('ch-hud-weapon'),
  hudTime: $('ch-hud-time'), timeState: $('ch-time-state'),
  banner: $('ch-banner'), bannerSmall: $('ch-banner').querySelector('small'),
  bannerStrong: $('ch-banner').querySelector('strong'), bannerSpan: $('ch-banner').querySelector('span'),
  overlay: $('ch-overlay'), menu: $('ch-menu'), death: $('ch-death'), clear: $('ch-clear'),
  complete: $('ch-complete'), pause: $('ch-pause'),
  levels: $('ch-levels'), start: $('ch-start'),
  clearStats: $('ch-clear-stats'), clearNext: $('ch-clear-next'), clearMenu: $('ch-clear-menu'),
  deathRetry: $('ch-death-retry'), deathMenu: $('ch-death-menu'), deathCause: $('ch-death-cause'),
  completeStats: $('ch-complete-stats'), completeRestart: $('ch-complete-restart'), completeMenu: $('ch-complete-menu'),
  pauseResume: $('ch-pause-resume'), pauseMenu: $('ch-pause-menu'),
  sound: $('ch-sound'), pauseBtn: $('ch-pause-button'), fullscreen: $('ch-fullscreen'),
  clearTitle: $('ch-clear-title'), touch: $('ch-touch'),
};

// ---------- 主题调色板 ----------
let pal = {};
const darkPal = {
  floor: '#101217', floorDot: '#1d212b', wall: '#1e222b', wallEdge: '#3a4050',
  player: '#f2f0ea', enemy: '#ff4a3d', enemySoft: '#ff8a80', bulletF: '#f2f0ea', bulletE: '#ff4a3d',
  accent: '#58a7cf', veil: 'rgba(9,10,14,.55)',
};
const lightPal = {
  floor: '#eceae4', floorDot: '#d8d3c8', wall: '#d5cfc4', wallEdge: '#b3ab9c',
  player: '#17181c', enemy: '#cf3527', enemySoft: '#e06a5c', bulletF: '#17181c', bulletE: '#cf3527',
  accent: '#33698f', veil: 'rgba(244,242,238,.4)',
};
const readTheme = () => {
  pal = document.documentElement.dataset.theme === 'dark' ? darkPal : lightPal;
};
readTheme();
document.addEventListener('themechange', readTheme);

// ---------- 视口 ----------
let view = { scale: 1, ox: 0, oy: 0, dpr: 1 };
function fit() {
  const rect = stage.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const scale = Math.min(rect.width / WIDTH, rect.height / HEIGHT);
  view = {
    scale, dpr,
    ox: (rect.width - WIDTH * scale) / 2,
    oy: (rect.height - HEIGHT * scale) / 2,
  };
}
new ResizeObserver(fit).observe(stage);
fit();
const toWorld = (clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - view.ox) / view.scale,
    y: (clientY - rect.top - view.oy) / view.scale,
  };
};

// ---------- 音效（合成，无外部资源） ----------
let audio = null;
let soundOn = gameStore.get('chronostasis-sound') !== 'off';
function ensureAudio() {
  if (!audio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = { ctx: new AC(), out: null };
    audio.out = audio.ctx.createGain();
    audio.out.gain.value = 0.5;
    audio.out.connect(audio.ctx.destination);
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  return audio;
}
function tone(freq, dur, { type = 'square', vol = 0.16, slide = 0, delay = 0 } = {}) {
  if (!soundOn || !ensureAudio()) return;
  const t0 = audio.ctx.currentTime + delay;
  const osc = audio.ctx.createOscillator();
  const g = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(audio.out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}
function noise(dur, { vol = 0.14, cut = 2400, delay = 0 } = {}) {
  if (!soundOn || !ensureAudio()) return;
  const t0 = audio.ctx.currentTime + delay;
  const len = Math.max(1, Math.floor(audio.ctx.sampleRate * dur));
  const buf = audio.ctx.createBuffer(1, len, audio.ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = audio.ctx.createBufferSource();
  src.buffer = buf;
  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = cut;
  const g = audio.ctx.createGain();
  g.gain.value = vol;
  src.connect(filter).connect(g).connect(audio.out);
  src.start(t0);
}
const sfx = {
  shot: () => { noise(0.05, { vol: 0.1, cut: 5200 }); tone(760, 0.07, { slide: -520, vol: 0.1 }); },
  'enemy-shot': () => { noise(0.06, { vol: 0.08, cut: 2600 }); tone(320, 0.09, { slide: -180, vol: 0.09, type: 'sawtooth' }); },
  empty: () => tone(1500, 0.03, { vol: 0.07 }),
  throw: () => noise(0.14, { vol: 0.1, cut: 1400 }),
  clatter: () => { tone(900, 0.02, { vol: 0.06 }); tone(640, 0.03, { vol: 0.05, delay: 0.05 }); },
  pickup: () => { tone(520, 0.06, { vol: 0.1, type: 'triangle' }); tone(780, 0.08, { vol: 0.1, type: 'triangle', delay: 0.06 }); },
  disarm: () => { tone(140, 0.12, { vol: 0.16, type: 'sine' }); noise(0.08, { vol: 0.1, cut: 900 }); },
  kill: () => { noise(0.1, { vol: 0.13, cut: 1800 }); tone(95, 0.14, { vol: 0.14, type: 'sawtooth', slide: -40 }); },
  death: () => { tone(58, 0.5, { vol: 0.24, type: 'sine' }); noise(0.3, { vol: 0.16, cut: 700 }); },
  clear: () => { [440, 554, 659, 880].forEach((f, i) => tone(f, 0.16, { vol: 0.1, type: 'triangle', delay: i * 0.09 })); },
  start: () => tone(660, 0.1, { vol: 0.08, type: 'triangle' }),
};

// ---------- 特效粒子（纯渲染层） ----------
const shards = [];
const flashes = [];
const floaters = [];
let shake = 0;
function burst(x, y, color, n = 12, speed = 190) {
  if (reduced.matches) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = speed * (0.35 + Math.random() * 0.8);
    shards.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.3, size: 2 + Math.random() * 4, rot: Math.random() * 7, vr: (Math.random() - 0.5) * 9, color });
  }
}
function pop(x, y, text, color) {
  if (reduced.matches) return;
  floaters.push({ x, y, text, color, life: 0.9 });
}
function drainEvents() {
  for (const ev of game.events) {
    switch (ev.type) {
      case 'shot': sfx.shot(); flashes.push({ x: ev.x, y: ev.y, life: 0.07 }); break;
      case 'enemy-shot': sfx['enemy-shot'](); flashes.push({ x: ev.x, y: ev.y, life: 0.07 }); break;
      case 'empty': sfx.empty(); pop(ev.x, ev.y - 26, '空', pal.enemy); break;
      case 'throw': sfx.throw(); break;
      case 'clatter': sfx.clatter(); break;
      case 'pickup': sfx.pickup(); pop(ev.x, ev.y - 26, '拾取', pal.accent); break;
      case 'disarm': sfx.disarm(); pop(ev.x, ev.y - 30, '缴械', pal.accent); break;
      case 'kill': sfx.kill(); burst(ev.x, ev.y, pal.enemy, 16, 240); break;
      case 'spark': burst(ev.x, ev.y, pal.wallEdge || '#999', 4, 120); break;
      case 'death':
        sfx.death();
        burst(ev.x, ev.y, pal.player, 22, 260);
        shake = reduced.matches ? 0 : 7;
        break;
      case 'clear': sfx.clear(); break;
      case 'level-start': break;
    }
  }
  game.events.length = 0;
}

// ---------- 输入 ----------
const keys = new Set();
const input = { moveX: 0, moveY: 0, aimX: 1, aimY: 0, fire: false, throw: false };
let mouse = { x: WIDTH * 0.7, y: HEIGHT * 0.5, inside: false };
let keyFireHeld = false;
let touchStick = { active: false, id: -1, dx: 0, dy: 0 };
let aimStick = { active: false, id: -1, dx: 0, dy: 0 };
let throwBtnHeld = false;
let pulseClock = 0;

addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === 'escape' || k === 'p') { togglePause(); e.preventDefault(); return; }
  if (k === ' ') keyFireHeld = true;
  if (k === 'q') input.throw = true;
  if (k === 'r' && game.state === 'dead') restart();
  if (k === 'enter') {
    if (game.state === 'clear') nextLevel();
    else if (!els.overlay.hidden && game.state === 'menu') startGame();
  }
  if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  if (k === 'f') toggleFullscreen();
});
addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  keys.delete(k);
  if (k === ' ') keyFireHeld = false;
  if (k === 'q') input.throw = false;
});
canvas.addEventListener('pointermove', (e) => {
  const w = toWorld(e.clientX, e.clientY);
  mouse.x = w.x; mouse.y = w.y;
  if (e.pointerType === 'mouse') mouse.inside = true;
});
canvas.addEventListener('pointerdown', (e) => {
  ensureAudio();
  if (e.pointerType === 'mouse') {
    const w = toWorld(e.clientX, e.clientY);
    mouse.x = w.x; mouse.y = w.y;
    if (e.button === 2) { input.throw = true; setTimeout(() => { input.throw = false; }, 60); }
    else input.fire = true;
  }
});
addEventListener('pointerup', (e) => {
  if (e.pointerType === 'mouse') input.fire = false;
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state === 'playing' && !game.paused) setPaused(true);
});

// 触屏摇杆
function bindStick(el, state) {
  const knob = el.querySelector('b');
  const set = (dx, dy) => {
    knob.style.setProperty('--stick-x', `${dx}px`);
    knob.style.setProperty('--stick-y', `${dy}px`);
  };
  const rectOf = () => el.getBoundingClientRect();
  el.addEventListener('pointerdown', (e) => {
    ensureAudio();
    state.active = true; state.id = e.pointerId;
    state.cx = rectOf().left + rectOf().width / 2;
    state.cy = rectOf().top + rectOf().height / 2;
    el.setPointerCapture(e.pointerId);
    move(e);
    e.preventDefault();
  });
  const move = (e) => {
    if (!state.active || e.pointerId !== state.id) return;
    const dx = e.clientX - state.cx, dy = e.clientY - state.cy;
    const len = Math.hypot(dx, dy);
    const max = 40;
    const cl = Math.min(len, max);
    state.dx = len > 6 ? (dx / (len || 1)) * (cl / max) : 0;
    state.dy = len > 6 ? (dy / (len || 1)) * (cl / max) : 0;
    set(len ? (dx / (len || 1)) * cl : 0, len ? (dy / (len || 1)) * cl : 0);
  };
  el.addEventListener('pointermove', move);
  const end = (e) => {
    if (e.pointerId !== state.id) return;
    state.active = false; state.dx = 0; state.dy = 0;
    set(0, 0);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}
bindStick($('ch-stick-move'), touchStick);
bindStick($('ch-stick-aim'), aimStick);
$('ch-touch-throw').addEventListener('pointerdown', (e) => { ensureAudio(); throwBtnHeld = true; input.throw = true; e.preventDefault(); });
addEventListener('pointerup', () => { if (throwBtnHeld) { throwBtnHeld = false; input.throw = false; } });

function gatherInput(dt) {
  pulseClock += dt;
  let mx = 0, my = 0;
  if (keys.has('w') || keys.has('arrowup')) my -= 1;
  if (keys.has('s') || keys.has('arrowdown')) my += 1;
  if (keys.has('a') || keys.has('arrowleft')) mx -= 1;
  if (keys.has('d') || keys.has('arrowright')) mx += 1;
  if (touchStick.active) { mx = touchStick.dx; my = touchStick.dy; }
  const ml = Math.hypot(mx, my);
  if (ml > 1) { mx /= ml; my /= ml; }

  let ax = 0, ay = 0;
  if (aimStick.active && Math.hypot(aimStick.dx, aimStick.dy) > 0.12) {
    ax = aimStick.dx; ay = aimStick.dy;
  } else if (!aimStick.active) {
    ax = mouse.x - game.player.x;
    ay = mouse.y - game.player.y;
    if (Math.hypot(ax, ay) < 2) { ax = Math.cos(game.player.aim); ay = Math.sin(game.player.aim); }
  } else { ax = Math.cos(game.player.aim); ay = Math.sin(game.player.aim); }

  // 持续按住的射击（空格 / 摇杆）对半自动武器做脉冲松放，保证可连点
  const kind = game.player.weapon?.kind;
  const semi = kind === 'pistol' || kind === 'shotgun';
  const holding = keyFireHeld || (aimStick.active && Math.hypot(aimStick.dx, aimStick.dy) > 0.3);
  let fire = false;
  if (input.fire || holding) fire = semi ? (pulseClock % 0.16) < 0.08 : true;

  return { moveX: mx, moveY: my, aimX: ax, aimY: ay, fire, throw: input.throw };
}

// ---------- 游戏与流程 ----------
const game = new ChronoGame();
let selLevel = 0;
let unlocked = Math.max(1,Math.min(LEVELS.length,parseInt(gameStore.get('chronostasis-unlocked') || '1',10)||1));
const params = new URLSearchParams(location.search);
const levelParam = parseInt(params.get('level'), 10);
const hasLevelParam = levelParam >= 1 && levelParam <= LEVELS.length;
if (hasLevelParam) selLevel = levelParam - 1; // 深链自由指定起点
else selLevel = Math.min(selLevel, Math.max(0, unlocked - 1));

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}.${Math.floor((s % 1) * 10)}`;
const bestKey = (i) => `chronostasis-best-${i}`;
const bestOf = (i) => {
  const v = parseFloat(gameStore.get(bestKey(i)));
  return Number.isFinite(v) && v >= 0 ? v : null;
};

function renderLevelGrid() {
  els.levels.innerHTML = '';
  LEVELS.forEach((lv, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const locked = i >= unlocked && !hasLevelParam;
    btn.disabled = locked;
    const best = bestOf(i);
    btn.dataset.state = best != null ? 'cleared' : '';
    btn.setAttribute('aria-pressed', i === selLevel ? 'true' : 'false');
    btn.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span><strong>${lv.name}</strong><small>${best != null ? fmt(best) : (locked ? '未解锁' : '　')}</small>`;
    btn.addEventListener('click', () => {
      selLevel = i;
      renderLevelGrid();
    });
    els.levels.appendChild(btn);
  });
}
renderLevelGrid();

function showOverlay(which) {
  for (const key of ['menu', 'death', 'clear', 'complete', 'pause']) els[key].hidden = key !== which;
  els.overlay.hidden = !which;
  // 触屏摇杆只在无弹窗时显示（CSS 再按 pointer:coarse 过滤桌面端）
  els.touch.hidden = !!which;
}
function startGame() {
  unlocked = Math.max(unlocked, selLevel + 1);
  gameStore.set('chronostasis-unlocked', String(unlocked));
  game.start(selLevel);
  showOverlay(null);
  hideBanner();
  sfx.start();
  announceLevel();
  canvas.focus({ preventScroll: true });
}
function restart() {
  game.restart();
  showOverlay(null);
  hideBanner();
  announceLevel();
  canvas.focus({ preventScroll: true });
}
function nextLevel() {
  if (!game.nextLevel()) {
    $('ch-complete-line').textContent = `十关全部清空 · 击杀 ${game.session.kills} · 阵亡 ${game.session.deaths}`;
    showOverlay('complete');
    return;
  }
  showOverlay(null);
  hideBanner();
  announceLevel();
  canvas.focus({ preventScroll: true });
}
function toMenu() {
  game.state = 'menu';
  renderLevelGrid();
  showOverlay('menu');
}
function setPaused(v) {
  if (game.state !== 'playing') return;
  game.paused = v;
  showOverlay(v ? 'pause' : null);
  els.pauseBtn.setAttribute('aria-pressed', v ? 'true' : 'false');
}
function togglePause() {
  if (game.state === 'playing') setPaused(!game.paused);
}
function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else machine.requestFullscreen?.();
}

els.start.addEventListener('click', startGame);
els.clearNext.addEventListener('click', nextLevel);
els.clearMenu.addEventListener('click', toMenu);
els.deathRetry.addEventListener('click', restart);
els.deathMenu.addEventListener('click', toMenu);
els.completeRestart.addEventListener('click', () => { selLevel = 0; startGame(); });
els.completeMenu.addEventListener('click', toMenu);
els.pauseResume.addEventListener('click', () => setPaused(false));
els.pauseMenu.addEventListener('click', () => { game.paused = false; toMenu(); });
els.pauseBtn.addEventListener('click', togglePause);
els.fullscreen.addEventListener('click', toggleFullscreen);
els.sound.addEventListener('click', () => {
  soundOn = !soundOn;
  gameStore.set('chronostasis-sound', soundOn ? 'on' : 'off');
  els.sound.textContent = soundOn ? '声音：开' : '声音：关';
});
els.sound.textContent = soundOn ? '声音：开' : '声音：关';

let bannerTimer = 0;
function announceLevel() {
  els.bannerSmall.textContent = `LEVEL ${String(game.levelIndex + 1).padStart(2, '0')} / ${String(LEVELS.length).padStart(2, '0')}`;
  els.bannerStrong.textContent = game.levelName;
  els.bannerSpan.textContent = game.level.hint || '';
  els.banner.classList.add('show');
  bannerTimer = 3.4;
}
function hideBanner() {
  bannerTimer = 0;
  els.banner.classList.remove('show');
}

// ---------- 绘制 ----------
function drawArena() {
  const { scale, ox, oy, dpr } = view;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  // 舞台外围留白用页面底色
  ctx.fillStyle = pal.floor;
  ctx.fillRect(ox, oy, WIDTH * scale, HEIGHT * scale);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  if (shake > 0.2) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }
  // 点阵地板
  ctx.fillStyle = pal.floorDot;
  for (let x = 64; x < WIDTH; x += 64) {
    for (let y = 64; y < HEIGHT; y += 64) {
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
  }
  // 边界
  ctx.strokeStyle = pal.wallEdge;
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, WIDTH - 16, HEIGHT - 16);
}

function drawWalls() {
  for (const w of game.walls) {
    ctx.fillStyle = pal.wall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = pal.wallEdge;
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
    // 顶边高光
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.fillRect(w.x, w.y, w.w, 4);
  }
}

function drawGunGlyph(x, y, angle, color, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(-7, -3, 10, 6);          // 握把/机身
  ctx.rect(3, -2, 12, 3.4);         // 枪管
  ctx.rect(-9, 2, 4, 7);            // 握把
  ctx.fill();
  ctx.restore();
}

function drawPickups() {
  for (const pk of game.pickups) {
    const bob = Math.sin(pk.t * 3) * 2;
    const empty = pk.ammo <= 0;
    ctx.globalAlpha = empty ? 0.55 : 1;
    drawGunGlyph(pk.x, pk.y + bob, -0.5, empty ? pal.wallEdge : pal.player, 1.15);
    if (!empty) {
      ctx.fillStyle = pal.accent;
      for (let i = 0; i < Math.min(pk.ammo, 10); i++) {
        ctx.fillRect(pk.x - 9 + i * 2, pk.y + bob + 12, 1.4, 4);
      }
    } else {
      ctx.strokeStyle = pal.wallEdge;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(pk.x, pk.y + bob, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }
}

function drawProjectile(pr) {
  ctx.save();
  ctx.translate(pr.x, pr.y);
  ctx.rotate(pr.spin);
  ctx.fillStyle = pal.player;
  ctx.fillRect(-8, -3.4, 16, 6.8);
  ctx.restore();
}

function drawEnemy(e) {
  const stunned = e.stun > 0;
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.rotate(e.aim);
  const body = stunned ? pal.enemySoft : pal.enemy;
  if (e.kind === 'rusher') {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(17, 0);
    ctx.lineTo(-11, -10);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-11, 10);
    ctx.closePath();
    ctx.fill();
  } else if (e.kind === 'shotgunner') {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(2, -12);
    ctx.lineTo(-13, -8);
    ctx.lineTo(-13, 8);
    ctx.lineTo(2, 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.floor;
    ctx.fillRect(6, -4.4, 12, 2.2);
    ctx.fillRect(6, 2.2, 12, 2.2);
  } else {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(0, -11);
    ctx.lineTo(-13, 0);
    ctx.lineTo(0, 11);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.floor;
    ctx.fillRect(4, -1.6, 13, 3.2);
  }
  ctx.restore();
  if (stunned) {
    ctx.save();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(e.x, e.y, 21, e.stun * 2, e.stun * 2 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

function drawPlayer(p) {
  // 瞄准虚线
  const aimLen = 230;
  ctx.save();
  ctx.strokeStyle = pal.accent;
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = 1.6;
  ctx.setLineDash([4, 9]);
  ctx.beginPath();
  ctx.moveTo(p.x + Math.cos(p.aim) * 22, p.y + Math.sin(p.aim) * 22);
  ctx.lineTo(p.x + Math.cos(p.aim) * aimLen, p.y + Math.sin(p.aim) * aimLen);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(p.x, p.y);
  // 时间环
  ctx.strokeStyle = pal.accent;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, 22, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(game.timeScale, 0.001));
  ctx.stroke();
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  // 身体
  ctx.rotate(p.aim);
  ctx.fillStyle = pal.player;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  // 朝向楔
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(6, -7.5);
  ctx.lineTo(6, 7.5);
  ctx.closePath();
  ctx.fill();
  // 武器
  if (p.weapon) {
    ctx.fillStyle = pal.player;
    ctx.fillRect(10, -2.2, 13, 4.4);
  }
  ctx.restore();
}

function drawBullets() {
  for (const b of game.bullets) {
    const color = b.friendly ? pal.bulletF : pal.bulletE;
    const sp = Math.hypot(b.vx, b.vy);
    const nx = b.vx / (sp || 1), ny = b.vy / (sp || 1);
    const trail = game.timeScale > 0.02 ? 14 : 9;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x - nx * trail, b.y - ny * trail);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
    if (game.timeScale < 0.02) {
      // 冻结的子弹外圈提示“悬停”
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function drawEffects(dt) {
  // 枪口闪光
  for (let i = flashes.length - 1; i >= 0; i--) {
    const f = flashes[i];
    f.life -= dt;
    if (f.life <= 0) { flashes.splice(i, 1); continue; }
    ctx.fillStyle = pal.bulletF;
    ctx.globalAlpha = f.life / 0.07;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 碎片
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i];
    s.life -= dt;
    if (s.life <= 0) { shards.splice(i, 1); continue; }
    s.x += s.vx * dt; s.y += s.vy * dt;
    s.vx *= 0.92; s.vy *= 0.92;
    s.rot += s.vr * dt;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.globalAlpha = Math.min(1, s.life * 2.4);
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.moveTo(s.size, 0);
    ctx.lineTo(-s.size * 0.6, -s.size * 0.7);
    ctx.lineTo(-s.size * 0.6, s.size * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // 浮字
  ctx.font = '700 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i];
    f.life -= dt;
    if (f.life <= 0) { floaters.splice(i, 1); continue; }
    f.y -= 24 * dt;
    ctx.globalAlpha = Math.min(1, f.life * 1.6);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'start';
}

function draw(dt) {
  drawArena();
  drawWalls();
  drawPickups();
  for (const e of game.enemies) if (e.alive) drawEnemy(e);
  for (const pr of game.projectiles) drawProjectile(pr);
  if (game.state !== 'menu' && game.player.alive) drawPlayer(game.player);
  drawBullets();
  drawEffects(dt);
  if (game.state === 'menu') {
    // 菜单底下摆一个静态构图
    ctx.fillStyle = pal.enemy;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(WIDTH - 220, 200, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------- HUD ----------
function updateHud() {
  if (game.state === 'menu') return;
  els.hudLevel.textContent = `${String(game.levelIndex + 1).padStart(2, '0')} · ${game.levelName}`;
  els.hudEnemy.textContent = `${game.enemiesLeft} / ${game.enemies.length}`;
  const w = game.player.weapon;
  let weaponText;
  if (!w) weaponText = '赤手空拳';
  else if (w.ammo <= 0) weaponText = `${w.kind === 'pistol' ? '手枪' : w.kind === 'smg' ? '冲锋枪' : '霰弹枪'} · 空膛（可投掷）`;
  else weaponText = `${w.kind === 'pistol' ? '手枪' : w.kind === 'smg' ? '冲锋枪' : '霰弹枪'} <b>${'▮'.repeat(Math.min(w.ammo, 12))}</b>`;
  els.hudWeapon.innerHTML = weaponText;
  els.hudTime.textContent = fmt(game.levelTime);
  const frozen = game.timeScale < 0.03;
  els.timeState.textContent = frozen ? '■ 时间冻结' : '▶ 时间流动';
  els.timeState.classList.toggle('frozen', frozen);
}

// ---------- 主循环 ----------
let last = performance.now();
let lastFrameAt = performance.now();
let deadTimer = 0;
let clearTimer = 0;
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  lastFrameAt = now;
  shake = Math.max(0, shake - dt * 26);

  if (game.state === 'playing' && !game.paused) {
    game.step(dt, gatherInput(dt));
    drainEvents();
    if (bannerTimer > 0) {
      bannerTimer -= dt;
      if (bannerTimer <= 0) els.banner.classList.remove('show');
    }
    if (game.state === 'dead') deadTimer = 0.45;
    if (game.state === 'clear') {
      clearTimer = 0.7;
      // 解锁与最佳时间
      unlocked = Math.max(unlocked, Math.min(game.levelIndex + 2, LEVELS.length));
      gameStore.set('chronostasis-unlocked', String(unlocked));
      const best = bestOf(game.levelIndex);
      if (best == null || game.levelTime < best) {
        gameStore.set(bestKey(game.levelIndex), String(game.levelTime));
      }
    }
  } else if (game.state === 'dead') {
    deadTimer -= dt;
    if (deadTimer <= 0 && els.overlay.hidden) {
      els.deathCause.textContent = '时间只为你一个人停止。';
      showOverlay('death');
    }
  } else if (game.state === 'clear') {
    clearTimer -= dt;
    if (clearTimer <= 0 && els.overlay.hidden) {
      els.clearTitle.textContent = game.levelIndex + 1 >= LEVELS.length ? '最终关清空' : '关卡清空';
      els.clearStats.innerHTML = `
        <div><small>用时</small><strong>${fmt(game.levelTime)}</strong></div>
        <div><small>射击</small><strong>${game.stats.shots}</strong></div>
        <div><small>投掷</small><strong>${game.stats.throws}</strong></div>
        <div><small>阵亡</small><strong>${game.session.deaths}</strong></div>`;
      els.clearNext.textContent = game.levelIndex + 1 >= LEVELS.length ? '查看战报 ⏎' : '下一关 ⏎';
      showOverlay('clear');
    }
  }

  draw(dt);
  updateHud();
  requestAnimationFrame(frame);
}
showOverlay('menu');
requestAnimationFrame(frame);
// 兜底：个别嵌入环境（如预渲染窗口）里 requestAnimationFrame 会被停摆，
// 游戏进行中若长时间没有帧，用定时器维持模拟推进。
setInterval(() => {
  if (game.state === 'playing' && !game.paused && performance.now() - lastFrameAt > 120) {
    frame(performance.now());
  }
}, 50);
