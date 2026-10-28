import {SCENE_ASSETS} from './breakout-scenes.mjs?v=3';
import { BreakoutGame, W, H, STEP, LEVELS, POWERS } from './breakout-engine.mjs?v=3';
import {createBreakoutArt} from './breakout-art.mjs?v=4';

const canvas = document.getElementById('breakout-canvas');
const ctx = canvas.getContext('2d');
const controls = canvas.closest('.arcade-machine');
const ui = {};
for (const name of ['overlay', 'message', 'description', 'start', 'score', 'best', 'lives', 'level', 'pause', 'restart', 'sound', 'status', 'level-name', 'remaining', 'effects', 'combo', 'progress', 'fullscreen', 'select', 'objective']) {
  ui[name] = document.getElementById(`breakout-${name}`);
}
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const keys = new Set();
let best = 0, enabledSound = true, audio = null, lastTone = 0, voices = 0;
const art = createBreakoutArt(ctx, reduced);
const requestedScenes=new Set();
let hitStop = 0, finishDelay = 0;
let frameId = 0, lastTime = 0, accumulator = 0, lastUI = '', activePointer = null;
try {
  enabledSound = localStorage.getItem('breakout-sound-v1') !== 'off';
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
function tone(type, combo = 0) {
  if (!enabledSound || !audio || audio.state !== 'running' || voices > 28 || (audio.currentTime - lastTone < .018 && !['explosion','power','clear','miss'].includes(type))) return;
  lastTone = audio.currentTime;
  const t = audio.currentTime;
  const base = {brick:470, armor:210, paddle:145, wall:340, explosion:85, power:740, save:380, clear:980, miss:100}[type] || 400;
  const pitch = base * (type === 'brick' ? 2 ** (Math.min(combo, 15) / 24) : 1);
  function note(freq, duration, gain, wave, delay = 0) {
    const o=audio.createOscillator(),g=audio.createGain();
    o.type=wave;o.frequency.setValueAtTime(freq,t+delay);o.frequency.exponentialRampToValueAtTime(freq*.55,t+delay+duration);
    g.gain.setValueAtTime(0,t+delay);g.gain.linearRampToValueAtTime(gain,t+delay+.003);g.gain.exponentialRampToValueAtTime(.001,t+delay+duration);
    o.connect(g);g.connect(audio.destination);voices++;o.start(t+delay);o.stop(t+delay+duration+.01);o.onended=()=>{voices--;o.disconnect();g.disconnect();};
  }
  if (['brick','armor','explosion','paddle'].includes(type)) {
    const duration=type==='explosion'?.22:.045;
    const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate);
    const samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
    const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
    source.buffer=buffer;filter.type='lowpass';filter.frequency.value=type==='explosion'?650:type==='armor'?3400:1800;
    gain.gain.setValueAtTime(type==='explosion'?.13:.035,t);gain.gain.exponentialRampToValueAtTime(.001,t+duration);
    source.connect(filter);filter.connect(gain);gain.connect(audio.destination);voices++;source.start(t);source.onended=()=>{voices--;source.disconnect();filter.disconnect();gain.disconnect();};
  }
  note(pitch, type === 'explosion' ? .22 : .085, .065, type === 'armor' ? 'triangle' : 'sine');
  if (type === 'brick' || type === 'armor') note(pitch*2.7,.035,.018,'triangle');
  if (type === 'power' || type === 'clear') {note(pitch*1.25,.15,.04,'sine',.07);note(pitch*1.5,.18,.035,'sine',.14);}
  if (type === 'explosion' || type === 'miss') note(55,.28,.085,'triangle');
}
function soundButton() {
  ui.sound.textContent = enabledSound ? '音效开' : '音效关';
  ui.sound.setAttribute('aria-label', enabledSound ? '关闭音效' : '开启音效');
  ui.sound.setAttribute('aria-pressed', String(enabledSound));
}
function announce(message) { ui.status.textContent = message; }
function effect(event) {
  art.impact(event); tone(event.type, event.combo);
  if (!reduced.matches) {
    if (event.type === 'brick') hitStop = Math.max(hitStop, .018);
    if (event.type === 'explosion') hitStop = .045;
  }
  if (event.type === 'power') announce(`获得${POWERS[event.kind].label}。`);
  if(event.type==='phase')announce(`核心进入第 ${event.phase} 阶段，先拆除两侧供能器。`);
}
const game = new BreakoutGame({ emit: effect });
game.reset(new URL(location.href).searchParams.get('level') || 1);
function bestKey(){return `breakout-best-v2-start-${game.startLevel}`;}
function loadBest(){
  best=0;try{const value=Number(localStorage.getItem(bestKey()));if(Number.isFinite(value)&&value>=0)best=Math.min(999999999,Math.floor(value));}catch{}
}
loadBest();
for(const [i,level] of LEVELS.entries()){
  const option=document.createElement('option');option.value=String(i+1);option.textContent=`${String(i+1).padStart(2,'0')} / ${level.name}`;ui.select.append(option);
}
ui.select.value=String(game.startLevel);
ui.select.addEventListener('change',()=>{
  game.reset(Number(ui.select.value));art.clear();hitStop=0;finishDelay=0;loadBest();lastUI='';
  const url=new URL(location.href);url.searchParams.set('level',String(game.startLevel));history.replaceState(null,'',url);
  presentOverlay(false,false);
});

function updateUI() {
  if (game.score > best) {
    best = game.score;
    try { localStorage.setItem(bestKey(), String(best)); } catch { /* Keep playing. */ }
  }
  const powers = [];
  if (game.wideTime > 0) powers.push(`加长 ${Math.ceil(game.wideTime)}s`);
  if (game.balls.length > 1) powers.push(`${game.balls.length} 球`);
  if (game.shield) powers.push('护底 ×1');
  const effects = powers.join(' · ') || '接住带符号的补给胶囊';
  const signature = `${game.score}/${best}/${game.lives}/${game.level}/${game.mode}/${game.remaining}/${effects}/${game.combo}/${game.objective}`;
  if (signature === lastUI) return;
  lastUI = signature;
  ui.score.textContent = String(game.score).padStart(4, '0');
  ui.best.textContent = String(best).padStart(4, '0');
  ui.lives.textContent = game.lives;
  ui.level.textContent = game.level;
  ui['level-name'].textContent = `${String(game.level).padStart(2, '0')} / ${LEVELS[game.level - 1].name}`;
  ui.remaining.textContent = game.level===8?'核心战':`${game.remaining} 个目标`;
  ui.effects.textContent = effects;
  ui.combo.textContent = game.combo ? `${game.combo} 连击 · ×${Math.min(5, 1+Math.floor((game.combo-1)/3))}` : '连续击破可叠加分数';
  const progress=game.level===8?1-(game.bricks.find(b=>b.type==='core')?.hp||0)/9:1-game.remaining/game.initialTargets;
  ui.progress.style.width = `${progress*100}%`;
  ui.objective.textContent=game.objective;
  controls.dataset.mode = game.mode;
  ui.pause.disabled = !['playing', 'paused'].includes(game.mode);
  ui.pause.textContent = game.mode === 'paused' ? '继续' : '暂停';
  ui.restart.disabled = game.mode === 'ready';
}
function presentOverlay(automatic = false, focus = true) {
  const messages = {
    ready: [`${String(game.level).padStart(2,'0')} / ${LEVELS[game.level-1].name}`, LEVELS[game.level-1].hint, '开始游戏 ↗'],
    paused: ['休息一下', automatic ? '游戏已自动暂停，回来后接着玩。' : '小球和道具都停住了，准备好再继续。', '继续游戏'],
    life: ['再接一球', `还剩 ${game.lives} 次机会，打掉的砖块会保留。`, '继续挑战'],
    level: [`第 ${game.level} 关完成`, `过关奖励 ${game.level * 100} 分。当前 ${game.score} 分，还剩 ${game.lives} 次机会。`, '下一关'],
    lost: ['这一局结束', `拿下 ${game.score} 分。试试用挡板边缘改变球的方向。`, '再玩一次'],
    won: [game.startLevel===1?'八关全部完成！':'核心已击破！', `拿下 ${game.score} 分。再挑战一次最高分？`, '再玩一次'],
  };
  const message = messages[game.mode];
  if (!message) return;
  keys.clear(); activePointer = null;
  cancelAnimationFrame(frameId); frameId = 0;
  [ui.message.textContent, ui.description.textContent, ui.start.textContent] = message;
  ui.overlay.hidden = false;
  updateUI(); announce(`${message[0]}。${message[1]}`); draw();
  if(focus)ui.start.focus({preventScroll:true});
}
function begin() {
  unlockAudio();
  if (game.mode !== 'paused') { art.clear(); hitStop = 0; finishDelay = 0; }
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
function draw(dt = 0) { loadSceneScenery();art.draw(game, dt); }
function frame(now) {
  frameId = 0;
  const elapsed = lastTime ? Math.min((now-lastTime)/1000,.05) : 0;
  lastTime=now;
  if (game.mode !== 'playing') {
    if (['level','won','life','lost'].includes(game.mode) && finishDelay < .32) {
      finishDelay += elapsed;draw(elapsed);frameId=requestAnimationFrame(frame);return;
    }
    presentOverlay();return;
  }
  if (hitStop > 0) hitStop = Math.max(0, hitStop-elapsed);
  else {
    accumulator += elapsed;
    while(accumulator >= STEP && game.mode === 'playing') {
      game.step(STEP,Number(keys.has('ArrowRight') || keys.has('d'))-Number(keys.has('ArrowLeft') || keys.has('a')));
      accumulator -= STEP;
      // Impact pauses discard time instead of catching up with a jump next frame.
      if(hitStop>0){accumulator=0;break;}
    }
  }
  updateUI();draw(elapsed);frameId=requestAnimationFrame(frame);
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
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!['ArrowLeft', 'ArrowRight', 'a', 'd', ' ', 'Escape'].includes(key)) return;
  if (key === ' ' && event.target.closest('button')) return;
  event.preventDefault(); event.stopPropagation();
  if (['ArrowLeft','ArrowRight','a','d'].includes(key)) keys.add(key);
  else if (!event.repeat && key === 'Escape') pause();
  else if (!event.repeat) game.mode === 'playing' ? pause() : begin();
});
controls.addEventListener('keyup', event => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!['ArrowLeft', 'ArrowRight', 'a', 'd', ' ', 'Escape'].includes(key)) return;
  if (key === ' ' && event.target.closest('button')) return;
  event.preventDefault(); event.stopPropagation(); keys.delete(key);
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
reduced.addEventListener('change', () => { art.clear(); hitStop=0; draw(); });
ui.fullscreen.hidden = !controls.requestFullscreen;
ui.fullscreen.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await controls.requestFullscreen(); }
  catch { announce('当前浏览器无法进入全屏。'); }
});
document.addEventListener('fullscreenchange', () => {
  ui.fullscreen.textContent = document.fullscreenElement ? '退出全屏' : '全屏'; resize();
});
soundButton(); presentOverlay(false,false); resize();

// Load each scene only on entry. A failed request leaves the procedural fallback playable.
function loadSceneScenery(){
  const level=game.level;if(requestedScenes.has(level))return;
  requestedScenes.add(level);
  const image=new Image();image.decoding='async';
  image.onload=()=>{art.setSceneImage(level,image);if(game.level===level)draw();};
  image.src=new URL(SCENE_ASSETS[level-1],import.meta.url).href;
}
loadSceneScenery();
