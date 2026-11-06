// 风屿 - 启动与主循环：渲染器、后期、相机、输入（键鼠/触屏）、阶段管理。
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createState, startWave, update, applyUpgrade, mulberry32 } from './engine.mjs';
import { createWorld } from './world.mjs';
import { createPlayerRig } from './player.mjs';
import { EnemyRigs } from './enemies.mjs';
import { FX } from './fx.mjs';
import { UI } from './ui.mjs';
import { AudioFX } from './audio.mjs';

const STEP = 1 / 60;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function boot() {
  const canvas = document.getElementById('windisle-canvas');
  const damageLayer = document.createElement('div');
  damageLayer.id = 'damage-layer';
  const hudEl = document.getElementById('hud');
  if (hudEl) hudEl.after(damageLayer);
  else document.getElementById('game-stage').appendChild(damageLayer);

  const ui = new UI();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    ui.fail('当前浏览器不支持 WebGL，无法进入风屿。');
    return;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.26, 0.5, 1.05);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const world = createWorld(scene, { reducedMotion: reducedMotion.matches });
  const audio = new AudioFX();
  const fx = new FX(scene, camera, damageLayer, { reducedMotion: reducedMotion.matches });
  const playerRig = createPlayerRig(scene);
  const enemyRigs = new EnemyRigs(scene);

  // ---------------- 状态
  let state = createState(1);
  let rng = mulberry32(1);
  let mode = 'menu'; // menu | run
  let pausedFrom = null;

  // ---------------- 输入
  const keys = new Set();
  const edges = { attack: false, heavy: false, dash: false, blade: false, burst: false };
  let heavyHeld = false;
  const touchMove = { x: 0, z: 0, active: false };

  function keyMove() {
    let x = 0, z = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) z -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) z += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
    return { x, z };
  }

  window.addEventListener('keydown', (e) => {
    if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.code==='KeyP'||e.code==='Escape'){if(mode==='run'){e.preventDefault();togglePause();}return;}
    if(mode!=='run')return;
    if(state.phase==='upgrade'&&['Digit1','Digit2','Digit3'].includes(e.code)){
      const offer=state.offer[Number(e.code.slice(-1))-1];if(offer)pickUpgrade(offer);return;
    }
    if(state.phase!=='playing'||e.target.closest?.('button,select,input,a'))return;
    const controls=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','KeyJ','KeyU','KeyK','KeyL'];
    if(!controls.includes(e.code))return;e.preventDefault();keys.add(e.code);
    if(e.code==='Space'||e.code.startsWith('Shift'))edges.dash=true;
    if(e.code==='KeyJ')edges.attack=true;
    if(e.code==='KeyU'){heavyHeld=true;edges.heavy=true;}
    if(e.code==='KeyK')edges.blade=true;
    if(e.code==='KeyL')edges.burst=true;
  });
  window.addEventListener('keyup', (e) => {
    keys.delete(e.code);
    if (e.code === 'KeyU') heavyHeld = false;
  });
  canvas.addEventListener('pointerdown', (e) => {
    if(mode!=='run'||state.phase!=='playing')return;
    if (e.pointerType === 'mouse' && e.button === 0) edges.attack = true;
    audio.ensure(); audio.resume();
  });

  // 触屏摇杆
  const stick = document.getElementById('touch-stick');
  const stickKnob = stick?.querySelector('i');
  let stickId=null;
  if (stick) {
    const stickStart = (e) => {
      if(mode!=='run'||state.phase!=='playing')return;
      stickId = e.pointerId;
      stick.setPointerCapture(stickId);
      stickMove(e);
    };
    const stickMove = (e) => {
      if (e.pointerId !== stickId) return;
      const r = stick.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let dx = (e.clientX - cx) / (r.width / 2), dz = (e.clientY - cy) / (r.height / 2);
      const len = Math.hypot(dx, dz);
      if (len > 1) { dx /= len; dz /= len; }
      touchMove.x = dx; touchMove.z = dz; touchMove.active = true;
      if (stickKnob) stickKnob.style.transform = `translate(${dx * 30}px, ${dz * 30}px)`;
    };
    const stickEnd = (e) => {
      if (e.pointerId !== stickId) return;
      stickId = null;
      touchMove.x = touchMove.z = 0; touchMove.active = false;
      if (stickKnob) stickKnob.style.transform = '';
    };
    stick.addEventListener('pointerdown', stickStart);
    stick.addEventListener('pointermove', stickMove);
    stick.addEventListener('pointerup', stickEnd);
    stick.addEventListener('pointercancel', stickEnd);
    stick.addEventListener('lostpointercapture',stickEnd);
  }
  const bindTouch = (id, fn) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); if(mode!=='run'||state.phase!=='playing')return;fn(); audio.ensure(); audio.resume(); });
  };
  bindTouch('touch-attack', () => { edges.attack = true; });
  bindTouch('touch-dash', () => { edges.dash = true; });
  bindTouch('touch-blade', () => { edges.blade = true; });
  bindTouch('touch-burst', () => { edges.burst = true; });

  function clearInput(){
    keys.clear();heavyHeld=false;for(const k of Object.keys(edges))edges[k]=false;
    const pointer=stickId;stickId=null;touchMove.x=touchMove.z=0;touchMove.active=false;
    if(stickKnob)stickKnob.style.transform='';
    if(pointer!==null&&stick?.hasPointerCapture(pointer))stick.releasePointerCapture(pointer);
  }
  // ---------------- UI 接线
  ui.on.start = () => startRun();
  ui.on.restart = () => startRun();
  ui.on.resume = () => togglePause();
  ui.on.menu = () => { clearInput();fx.reset();enemyRigs.reset();mode = 'menu'; state = createState(1); rng = mulberry32(1); ui.showMenu(); };
  ui.on.pause = () => togglePause();
  ui.on.sound = () => { audio.ensure(); audio.setEnabled(!audio.enabled); ui.setSound(audio.enabled); };
  ui.on.fullscreen = () => {
    const stage = document.getElementById('game-stage');
    if (document.fullscreenElement) document.exitFullscreen?.();
    else stage.requestFullscreen?.();
  };
  ui.onUpgradePick = (id) => pickUpgrade(id);
  ui.setSound(true);
  ui.showMenu();

  function startRun() {
    clearInput();fx.reset();enemyRigs.reset();acc=0;canvas.focus({preventScroll:true});
    audio.ensure(); audio.resume(); audio.start();
    state = createState((Math.random() * 1e9) | 0);
    rng = mulberry32(state.seed ^ 0xA5F152);
    mode = 'run';
    startWave(state, 1);
    ui.startRun();
    ui.banner('第 1 波');
  }

  function pickUpgrade(id) {
    clearInput();canvas.focus({preventScroll:true});
    applyUpgrade(state, id);
    ui.hideUpgrade();
    audio.upgrade();
    startWave(state, state.wave + 1);
    ui.banner(state.wave % 3 === 0 ? '风暴将至' : `第 ${state.wave} 波`);
  }

  function togglePause() {
    if (mode !== 'run') return;
    clearInput();acc=0;
    if (state.phase === 'playing') { state.phase = 'paused'; ui.showPause();document.getElementById('resume').focus(); }
    else if (state.phase === 'paused') { state.phase = 'playing'; ui.hidePause();canvas.focus({preventScroll:true}); }
  }
  function suspend(){clearInput();if(mode==='run'&&state.phase==='playing')togglePause();}
  window.addEventListener('blur',suspend);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});

  // ---------------- 事件 → 音效/界面
  function consumeEvents(events) {
    fx.drain(events);
    for (const ev of events) {
      switch (ev.type) {
        case 'slash': audio.slash(ev.stage); break;
        case 'heavy': audio.heavy(); break;
        case 'hit': audio.hit(ev.blocked,ev.attack==='heavy'||ev.stage===3); break;
        case 'kill': audio.kill(ev.enemyType==='boss'); break;
        case 'dash': audio.dash(); break;
        case 'blade': audio.blade(); break;
        case 'burst': audio.burst(); break;
        case 'playerHurt': audio.hurt(); break;
        case 'waveClear': audio.wave(); break;
        case 'bossPhase': audio.bossPhase(); ui.banner(`风暴之心 · ${['一', '二', '三'][ev.phase - 1]}阶段`); break;
        case 'wave': if (ev.n % 3 === 0) ui.banner('风暴之心 苏醒'); break;
        case 'gameover': {
          const prevBest = ui.best;
          const isBest = state.score > prevBest.score;
          if (isBest) ui.saveBest({ score: state.score, wave: state.wave });
          audio.gameover();
          ui.showResult(state, isBest);
          break;
        }
      }
    }
  }

  // ---------------- 相机
  const camTarget = new THREE.Vector3();
  const camPos = new THREE.Vector3(0, 14, 26);
  const shakeOff = new THREE.Vector3();
  function updateCamera(dt, time) {
    if (mode === 'menu') {
      const a = time * 0.1;
      camPos.lerp(new THREE.Vector3(Math.cos(a) * 26, 11 + Math.sin(time * 0.3) * 1.5, Math.sin(a) * 26), 1 - Math.exp(-2 * dt));
      camera.position.copy(camPos);
      camera.lookAt(0, 1.6, 0);
      return;
    }
    const p = state.player;
    const lookAhead = 0.12;
    camTarget.set(p.x + p.vx * lookAhead, 0, p.z + p.vz * lookAhead);
    const boss=state.enemies.some(e=>e.type==='boss');
    const distance=boss?new THREE.Vector3(0,11.7,14):new THREE.Vector3(0,8.8,10.4);
    const desired=camTarget.clone().add(distance);
    camPos.lerp(desired, 1 - Math.exp(-4.2 * dt));
    fx.getShakeOffset(shakeOff);
    camera.position.copy(camPos).add(shakeOff);
    camera.lookAt(camTarget.x, camTarget.y + 1.1, camTarget.z - 1.4);
  }

  // ---------------- 尺寸与画质
  const dprCap = Math.min(window.devicePixelRatio || 1, 2);
  let renderScale = 1;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(dprCap * renderScale);
    composer.setSize(w, h);
    composer.setPixelRatio(dprCap * renderScale);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------------- 帧率统计与自适应
  let fps = 60, fpsAcc = 0, fpsFrames = 0, lowTime = 0;
  const perfOut = document.getElementById('performance');
  function trackPerf(dt) {
    fpsAcc += dt; fpsFrames++;
    if (fpsAcc >= 0.5) {
      fps = fpsFrames / fpsAcc;
      if (perfOut) perfOut.textContent = `帧率 ${fps.toFixed(0)} FPS`;
      fpsAcc = 0; fpsFrames = 0;
      if (fps < 42 && renderScale > 0.62) {
        lowTime += 0.5;
        if (lowTime >= 2) { renderScale = Math.max(0.62, renderScale - 0.22); resize(); lowTime = 0; }
      } else lowTime = 0;
    }
  }

  // ---------------- 主循环
  let last = performance.now();
  let simTime = 0;
  let acc = 0;
  let frameCount = 0;
  let lastDt = 0;
  const input = { moveX: 0, moveZ: 0, attackPressed: false, heavyPressed:false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };

  function frame(now = performance.now()) {
    if(document.hidden){last=now;return;}
    frameCount++;
    const dtReal = Math.max(0,Math.min(0.05, (now - last) / 1000));
    lastDt = dtReal;
    last = now;
    const visualDt=state.phase==='paused'?0:dtReal;
    simTime += visualDt;
    trackPerf(dtReal);
    world.update(visualDt);

    if (mode === 'run') {
      // 组装输入（边沿只在第一个模拟步生效）
      const km = keyMove();
      input.moveX = touchMove.active ? touchMove.x : km.x;
      input.moveZ = touchMove.active ? touchMove.z : km.z;
      input.attackPressed = edges.attack;
      input.dashPressed = edges.dash;
      input.bladePressed = edges.blade;
      input.burstPressed = edges.burst;
      input.heavyDown = heavyHeld;
      input.heavyPressed = edges.heavy;

      // 命中停顿：冻结模拟但保持渲染
      if (fx.hitstop <= 0 && state.phase==='playing') {
        acc += dtReal;
        let steps = 0;
        while (acc >= STEP && steps < 4) {
          try {
            update(state, STEP, input, rng);
            consumeEvents(state.events);
          } catch (err) {
            window.__simError = String(err && err.stack || err);
            break;
          }
          state.events.length = 0;
          edges.attack = edges.heavy = edges.dash = edges.blade = edges.burst = false;
          input.attackPressed = input.heavyPressed = input.dashPressed = input.bladePressed = input.burstPressed = false;
          acc -= STEP;
          steps++;
          if (state.phase === 'upgrade') {
            ui.showUpgrade(state.wave, state.offer, state.upgradesTaken || {});
            acc = 0;
            break;
          }
          if (state.phase !== 'playing'||fx.hitstop>0) { acc = 0; break; }
        }
      }
      if (acc > STEP * 4) acc = 0;

      if(state.phase!=='paused'){
        if(fx.hitstop<=0){playerRig.update(state,visualDt,simTime,reducedMotion.matches);enemyRigs.sync(state,visualDt,simTime,reducedMotion.matches);}
        fx.update(visualDt,state);
      }
      ui.updateHUD(state);
    } else {
      // 菜单：主角在场地中央待机
      playerRig.update({ player: { ...state.player, x: 0, z: 0, vx: 0, vz: 0, moving: 0, dashT: 0, comboStage: 0, heavyT: -1, hurtT: 0, runT: 0, stats: state.player.stats }, enemies: [] }, dtReal, simTime, reducedMotion.matches);
      fx.update(dtReal, null);
    }

    if(state.phase!=='paused')updateCamera(dtReal,simTime);
    composer.render();
  }
  // 主循环驱动：rAF 优先；看门狗定时器兜底。
  // 某些嵌入式浏览器（如应用内预览）rAF 完全停摆而定时器照常，看门狗在
  // rAF 停滞超过一帧半时接管驱动；正常浏览器中它始终是零开销的空转检查。
  // ?slow=N 仅供自动化抓拍：将看门狗间隔放慢 N 倍（模拟 dt 仍被钳制）。
  const pumpParams = new URLSearchParams(location.search);
  const watchdogMs = 16 * Math.max(1, Number(pumpParams.get('slow')) || 1);
  let lastLoopAt = performance.now();
  const loopFrame = (now) => { lastLoopAt = performance.now(); frame(now); };
  const pumpOnly=pumpParams.get('pump')==='1';
  const rafLoop=now=>{requestAnimationFrame(rafLoop);if(performance.now()-lastLoopAt>2)loopFrame(now);};
  if(!pumpOnly)requestAnimationFrame(rafLoop);
  setInterval(() => {
    if (!document.hidden && (pumpOnly||performance.now()-lastLoopAt>watchdogMs+24))loopFrame(performance.now());
  },watchdogMs);

  // 调试句柄（供自动化测试读取内部状态）
  window.__windisle = {
    get state() { return state; },
    get mode() { return mode; },
    get acc() { return acc; },
    get hitstop() { return fx.hitstop; },
    get simError() { return window.__simError || null; },
    get frames() { return frameCount; },
    get lastDt() { return lastDt; },
  };

  ui.hideLoading();
}

boot();
