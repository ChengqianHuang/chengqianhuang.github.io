import {telegraphContains} from './combat-geometry.mjs';
// 风屿 - 纯规则引擎。无 DOM、无渲染依赖，给定种子完全可复现，供测试直接导入。
// 调用方（main.mjs / 测试）以固定步长调用 update()，渲染层只读取状态与事件。

export const ARENA_RADIUS = 21;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const dist2 = (ax, az, bx, bz) => { const dx = ax - bx, dz = az - bz; return dx * dx + dz * dz; };
const angleDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };

// ---------------------------------------------------------------- 调参表
export const TUNING = {
  player: {
    hp: 100, speed: 7.6,
    dashSpeed: 17, dashTime: 0.18, dashIframes: 0.3, dashCooldown: 1.5,
    comboDamage: [12, 14, 22], comboDuration: [0.3, 0.34, 0.5],
    comboRange: [2.8, 2.8, 3.3], comboArc: [1.92, 1.92, 2.44], // 弧度
    comboHitAt: 0.42, comboBufferAfter: 0.35,
    heavyCharge: 0.55, heavyDamage: 34, heavyRadius: 4.2,
    bladeCooldown: 2.2, bladeDamage: 16, bladeSpeed: 26, bladeLife: 1.1,
    energyPerHit: 4, energyPerKill: 8, burstDamage: 40, burstRadius: 6.5,
    hurtIframes: 0.7,
  },
  rusher: { hp: 20, speed: 6.4, radius: 0.55, score: 10, touch: 8, windup: 0.45, lungeSpeed: 13, lungeTime: 0.3, lungeRange: 4.6, recover: 0.8, cooldown: 2.2 },
  thrower: { hp: 28, speed: 3.6, radius: 0.6, score: 20, keepNear: 8, keepFar: 14, lobCd: 2.6, lobTelegraph: 0.7, lobRadius: 2.2, lobDamage: 12, lobLead: 0.35 },
  charger: { hp: 45, speed: 3.4, radius: 0.75, score: 25, touch: 10, chargeSpeed: 14.5, chargeTime: 0.55, chargeDamage: 16, telegraph: 0.8, lineLen: 11, lineHalfWidth: 1.5, dizzy: 1.3, dizzyMult: 1.5, cooldown: 3.5, rangeMin: 5, rangeMax: 14 },
  brute: { hp: 90, speed: 2.3, radius: 0.95, score: 40, touch: 10, blockAngle: 1.05, blockMult: 0.2, slamRange: 3.8, slamTelegraph: 0.9, slamRadius: 3.5, slamDamage: 18, recover: 1.2, cooldown: 4, kbMult: 0.15 },
  boss: { hp: 550, hpPerWave: 130, radius: 1.7, score: 200, speed: 2.6, touch: 12, slamDamage: 20, slamRadius: 4.6, slamTelegraph: 1.0, ringCount: 12, ringCountLate: 16, ringSpeed: 8, ringDamage: 10, ringCd: 4, stunAfterSlam: 1.6, stunMult: 2, phase2: 0.66, phase3: 0.33, contactRange: 3.4 },
};

// ---------------------------------------------------------------- 天赋池
export const UPGRADES = [
  { id: 'atkSpeed', name: '疾风连斩', desc: '普攻速度 +12%', max: 5, apply: (s) => { s.player.stats.atkSpeed += 0.12; } },
  { id: 'comboDmg', name: '连击精通', desc: '普攻伤害 +15%', max: 5, apply: (s) => { s.player.stats.comboDmg += 0.15; } },
  { id: 'dashCharge', name: '双影冲刺', desc: '冲刺充能 +1', max: 2, apply: (s) => { s.player.stats.dashMax += 1; s.player.dashCharges += 1; } },
  { id: 'lifesteal', name: '掠夺之风', desc: '每次击杀回复 3 生命', max: 3, apply: (s) => { s.player.stats.lifesteal += 3; } },
  { id: 'pierce', name: '穿云刃', desc: '风刃可多穿透 1 名敌人', max: 2, apply: (s) => { s.player.stats.bladePierce += 1; } },
  { id: 'energyGain', name: '灵息', desc: '能量获取 +30%', max: 3, apply: (s) => { s.player.stats.energyGain += 0.3; } },
  { id: 'moveSpeed', name: '轻羽', desc: '移动速度 +10%', max: 3, apply: (s) => { s.player.stats.moveSpeed += 0.1; } },
  { id: 'maxHp', name: '药师祝福', desc: '生命上限 +25 并回满 25', max: 4, apply: (s) => { s.player.maxHp += 25; s.player.hp = clamp(s.player.hp + 25, 0, s.player.maxHp); } },
  { id: 'knock', name: '重势', desc: '击退力度 +40%', max: 3, apply: (s) => { s.player.stats.knockMult += 0.4; } },
  { id: 'dashCd', name: '回息', desc: '冲刺充能时间 -15%', max: 3, apply: (s) => { s.player.stats.dashRecharge *= 0.85; } },
];

export function createState(seed) {
  const p = TUNING.player;
  return {
    seed, time: 0, phase: 'menu', wave: 0, score: 0,
    waveDamageTaken: 0, kills: 0,
    player: {
      x: 0, z: 0, vx: 0, vz: 0, face: 0,
      hp: p.hp, maxHp: p.hp, energy: 0,
      comboStage: 0, comboT: 0, comboBuffered: false, comboHitDone: false, comboHits: null,
      heavyT: -1, // <0 未蓄力；>=0 蓄力中
      dashT: 0, dashDirX: 0, dashDirZ: 0, dashCharges: 1, dashRechargeT: 0, dashIframes: 0,
      bladeCd: 0, hurtIframes: 0, hurtT: 0, touchCd: 0, moving: 0, runT: 0,
      stats: {
        atkSpeed: 1, comboDmg: 0, dashMax: 1, lifesteal: 0, bladePierce: 1,
        energyGain: 1, moveSpeed: 1, knockMult: 1, dashRecharge: p.dashCooldown,
      },
    },
    enemies: [], projectiles: [], telegraphs: [], pickups: [], effects: [],
    spawnQueue: [], spawnTimer: 0,
    offer: null,
    events: [],
    nextId: 1,
  };
}

function emit(state, type, data) { state.events.push({ type, ...data }); }

// ---------------------------------------------------------------- 波次
const WAVE_COSTS = { rusher: 1, thrower: 2, charger: 3, brute: 4 };

export function waveComposition(n, rng) {
  const list = [];
  if (n % 3 === 0) {
    list.push({ type: 'boss', delay: 0.4 });
    const escortBudget = Math.floor((4 + n) / 3);
    let budget = escortBudget, delay = 3;
    while (budget > 0) {
      const type = budget >= 3 && rng() < 0.5 ? 'charger' : 'rusher';
      const cost = WAVE_COSTS[type];
      if (cost > budget) { budget -= 1; continue; }
      list.push({ type, delay });
      budget -= cost; delay += 1.6 + rng() * 1.4;
    }
    return list;
  }
  let budget = 4 + 2 * n;
  let delay = 0.4;
  while (budget > 0) {
    const pool = ['rusher'];
    if (n >= 2) pool.push('thrower', 'rusher');
    if (n >= 3) pool.push('charger');
    if (n >= 4) pool.push('brute');
    const type = pool[Math.floor(rng() * pool.length)];
    const cost = WAVE_COSTS[type] || 1;
    if (cost > budget) { budget -= 1; continue; }
    list.push({ type, delay });
    budget -= cost;
    delay += (rng() < 0.45 ? 0.1 : 1.1 + rng() * 1.3); // 有时成对出现
  }
  return list;
}

function maxConcurrent(n) { return Math.min(6 + n, 13); }

export function startWave(state, n) {
  const rng = mulberry32(state.seed + n * 7919);
  state.wave = n;
  state.spawnQueue = waveComposition(n, rng);
  state.spawnTimer = 0;
  state.waveDamageTaken = 0;
  state.phase = 'playing';
  emit(state, 'wave', { n });
}

function spawnEnemy(state, type, rng) {
  const r = ARENA_RADIUS - 3.5;
  // 与玩家保持距离，多次尝试保证可行
  let x = 0, z = 0;
  for (let i = 0; i < 24; i++) {
    const a = rng() * TAU;
    const rad = r * (0.45 + 0.55 * rng());
    x = Math.cos(a) * rad; z = Math.sin(a) * rad;
    if (dist2(x, z, state.player.x, state.player.z) > 64) break; // >=8
  }
  const base = { id: state.nextId++, type, x, z, vx: 0, vz: 0, face: 0, state: 'spawn', t: 0.6, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: rng() * 10 };
  let enemy;
  if (type === 'rusher') enemy = { ...base, hp: TUNING.rusher.hp, maxHp: TUNING.rusher.hp, phase: 'chase', cd: 1 + rng() };
  else if (type === 'thrower') enemy = { ...base, hp: TUNING.thrower.hp, maxHp: TUNING.thrower.hp, phase: 'keep', cd: 1.5 + rng() };
  else if (type === 'charger') enemy = { ...base, hp: TUNING.charger.hp, maxHp: TUNING.charger.hp, phase: 'chase', cd: 1.5 + rng() };
  else if (type === 'brute') enemy = { ...base, hp: TUNING.brute.hp, maxHp: TUNING.brute.hp, phase: 'chase', cd: 1.5 + rng() };
  else if (type === 'boss') {
    const hp = TUNING.boss.hp + TUNING.boss.hpPerWave * Math.floor((state.wave - 1) / 3);
    enemy = { ...base, hp, maxHp: hp, phase: 'chase', cd: 2.5, bossPhase: 1, volleys: 0, pattern: null, x: 0, z: -(ARENA_RADIUS - 5), stunMult: 1 };
    delete enemy.cd;
    enemy.cd = 2.2;
  }
  state.enemies.push(enemy);
  emit(state, 'spawnPoof', { x: enemy.x, z: enemy.z, enemyType:type });
}

// ---------------------------------------------------------------- 天赋
export function pickUpgrades(state, rng) {
  const owned = state.upgradesTaken || (state.upgradesTaken = {});
  const available = UPGRADES.filter((u) => (owned[u.id] || 0) < u.max);
  const picks = [];
  const bag = available.slice();
  while (picks.length < 3 && bag.length > 0) {
    const i = Math.floor(rng() * bag.length);
    picks.push(bag.splice(i, 1)[0].id);
  }
  return picks;
}

export function applyUpgrade(state, id) {
  const u = UPGRADES.find((x) => x.id === id);
  if (!u) return false;
  const owned = state.upgradesTaken || (state.upgradesTaken = {});
  if ((owned[id] || 0) >= u.max) return false;
  owned[id] = (owned[id] || 0) + 1;
  u.apply(state);
  emit(state, 'upgrade', { id });
  return true;
}

// ---------------------------------------------------------------- 玩家行为
function autoAim(state, maxDist = 7) {
  let best = null, bestD = maxDist * maxDist;
  for (const e of state.enemies) {
    if (e.state === 'spawn') continue;
    const d = dist2(state.player.x, state.player.z, e.x, e.z);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function faceTarget(state) {
  const target = autoAim(state);
  if (target) state.player.face = Math.atan2(target.x - state.player.x, target.z - state.player.z);
}

function startCombo(state, stage) {
  const p = state.player;
  p.comboStage = stage;
  p.comboT = 0;
  p.comboBuffered = false;
  p.comboHitDone = false;
  p.comboHits = new Set();
  faceTarget(state);
  emit(state, 'slash', { stage, x: p.x, z: p.z, face: p.face });
}

function damageEnemy(state, e, amount, knock, dirX, dirZ, opts = {}) {
  const bruteshield = e.type === 'brute' && !opts.ignoreBlock &&
    Math.abs(angleDiff(e.face, Math.atan2(dirX, dirZ))) < TUNING.brute.blockAngle;
  let dmg = amount * (1 + state.player.stats.comboDmg * (opts.combo ? 1 : 0));
  if (e.type === 'charger' && e.phase === 'dizzy') dmg *= TUNING.charger.dizzyMult;
  if (e.type === 'boss' && e.phase === 'stun') dmg *= TUNING.boss.stunMult;
  if (bruteshield) {
    dmg *= TUNING.brute.blockMult;
    emit(state, 'block', { x: e.x, z: e.z });
  }
  e.hp -= dmg;
  e.flash = 0.18;
  const kb = knock * (e.type === 'brute' ? TUNING.brute.kbMult : 1) * state.player.stats.knockMult;
  if (!e.still) { e.kbx += dirX * kb; e.kbz += dirZ * kb; }
  gainEnergy(state, TUNING.player.energyPerHit);
  emit(state, 'hit', { x: e.x, z: e.z, dmg: Math.round(dmg), blocked: bruteshield, boss:e.type==='boss',enemyId:e.id,attack:opts.attack||(opts.combo?'combo':'blade'),stage:opts.combo?state.player.comboStage:0 });
  if (e.hp <= 0) killEnemy(state, e);
}

function killEnemy(state, e) {
  const i = state.enemies.indexOf(e);
  if (i >= 0) state.enemies.splice(i, 1);
  state.kills += 1;
  state.score += TUNING[e.type].score || 10;
  gainEnergy(state, TUNING.player.energyPerKill);
  if (state.player.stats.lifesteal > 0) {
    state.player.hp = clamp(state.player.hp + state.player.stats.lifesteal, 0, state.player.maxHp);
  }
  if (e.type === 'boss') {
    // Boss 死亡清除其弹幕与预警
    state.projectiles = state.projectiles.filter((pr) => pr.kind !== 'ebullet');
    state.telegraphs = state.telegraphs.filter((tg) => tg.owner !== e.id);
  }
  emit(state, 'kill', { x:e.x,z:e.z,enemyType:e.type });
}

function gainEnergy(state, amount) {
  const p = state.player;
  p.energy = clamp(p.energy + amount * p.stats.energyGain, 0, 100);
}

function doHeavy(state) {
  const p = state.player;
  const chargeRatio = clamp(p.heavyT / TUNING.player.heavyCharge, 0, 1.5);
  p.heavyT = -1;
  faceTarget(state);
  const cx = p.x + Math.sin(p.face) * 1.6, cz = p.z + Math.cos(p.face) * 1.6;
  const dmg = TUNING.player.heavyDamage * (0.8 + 0.2 * clamp(chargeRatio, 0, 1));
  for (const e of [...state.enemies]) {
    const d2 = dist2(cx, cz, e.x, e.z);
    if (d2 < TUNING.player.heavyRadius * TUNING.player.heavyRadius) {
      const dx = e.x - p.x, dz = e.z - p.z, len = Math.hypot(dx, dz) || 1;
      damageEnemy(state, e, dmg, 9, dx / len, dz / len, { ignoreBlock:true,attack:'heavy' });
    }
  }
  emit(state, 'heavy', { x: cx, z: cz, face: p.face });
}

function doBlade(state) {
  const p = state.player;
  if (p.bladeCd > 0) return;
  p.bladeCd = TUNING.player.bladeCooldown;
  faceTarget(state);
  state.projectiles.push({
    kind: 'blade', x: p.x + Math.sin(p.face) * 0.8, z: p.z + Math.cos(p.face) * 0.8,
    vx: Math.sin(p.face) * TUNING.player.bladeSpeed, vz: Math.cos(p.face) * TUNING.player.bladeSpeed,
    t: TUNING.player.bladeLife, dmg: TUNING.player.bladeDamage, pierce: p.stats.bladePierce, hits: new Set(),
  });
  emit(state, 'blade', { x: p.x, z: p.z, face: p.face });
}

function doBurst(state) {
  const p = state.player;
  if (p.energy < 100) return;
  p.energy = 0;
  for (const e of [...state.enemies]) {
    const d2 = dist2(p.x, p.z, e.x, e.z);
    if (d2 < TUNING.player.burstRadius * TUNING.player.burstRadius) {
      const dx = e.x - p.x, dz = e.z - p.z, len = Math.hypot(dx, dz) || 1;
      damageEnemy(state, e, TUNING.player.burstDamage, 11, dx / len, dz / len, {ignoreBlock:true,attack:'burst'});
    }
  }
  emit(state, 'burst', { x: p.x, z: p.z });
}

function doDash(state, input) {
  const p = state.player;
  if (p.dashCharges < 1 || p.dashT > 0) return;
  let dx = input.moveX, dz = input.moveZ;
  if (Math.hypot(dx, dz) < 0.2) { dx = Math.sin(p.face); dz = Math.cos(p.face); }
  const len = Math.hypot(dx, dz) || 1;
  p.dashDirX = dx / len; p.dashDirZ = dz / len;
  p.dashT = TUNING.player.dashTime;
  p.dashCharges -= 1;
  p.dashIframes = Math.max(p.dashIframes, TUNING.player.dashIframes);
  p.comboStage = 0; p.comboT = 0; p.comboBuffered = false; p.heavyT = -1; // 冲刺取消攻击
  emit(state, 'dash', { x: p.x, z: p.z, dirX: p.dashDirX, dirZ: p.dashDirZ });
}

function hurtPlayer(state, amount, fromX, fromZ) {
  const p = state.player;
  if (p.hurtIframes > 0 || p.dashIframes > 0 || state.phase !== 'playing') return;
  p.hp -= amount;
  state.waveDamageTaken += amount;
  p.hurtIframes = TUNING.player.hurtIframes;
  p.hurtT = 0.35;
  p.comboStage = 0; p.comboT = 0; p.heavyT = -1;
  const dx = p.x - fromX, dz = p.z - fromZ, len = Math.hypot(dx, dz) || 1;
  p.vx += dx / len * 5; p.vz += dz / len * 5;
  emit(state, 'playerHurt', { hp: Math.max(0, p.hp), x: p.x, z: p.z });
  if (p.hp <= 0) {
    p.hp = 0;
    state.phase = 'over';
    emit(state, 'gameover', { score: state.score, wave: state.wave, kills: state.kills });
  }
}

// ---------------------------------------------------------------- 预警区
function updateTelegraphs(state, dt) {
  for (const tg of state.telegraphs) {
    tg.t += dt;
    if (tg.t >= tg.dur && !tg.resolved) {
      tg.resolved = true;
      const p = state.player;
      if (tg.kind === 'line') {
        // 有向矩形：从起点后 0.5 到前方 len，半宽与显示共用。
        if(telegraphContains(tg,p)) hurtPlayer(state, tg.damage, tg.x, tg.z);
        if (tg.owner !== undefined) {
          const e = state.enemies.find((en) => en.id === tg.owner);
          if (e) { e.phase = 'charge'; e.t = tg.kind === 'line' ? (e.type === 'charger' ? TUNING.charger.chargeTime : 0.5) : 0; e.chargeX = tg.dirX; e.chargeZ = tg.dirZ; }
        }
      } else if (tg.kind === 'slam') {
        if(telegraphContains(tg,p)) hurtPlayer(state, tg.damage, tg.x, tg.z);
        if (tg.owner !== undefined) {
          const e = state.enemies.find((en) => en.id === tg.owner);
          if (e && e.type === 'boss') { e.phase = 'stun'; e.t = TUNING.boss.stunAfterSlam; emit(state, 'bossStun', { x: e.x, z: e.z }); }
          else if (e) { e.phase = 'recover'; e.t = TUNING.brute.recover; }
        }
      } else if (tg.kind === 'lob') {
        if(telegraphContains(tg,p)) hurtPlayer(state, tg.damage, tg.x, tg.z);
        emit(state, 'lobDone', { x: tg.x, z: tg.z });
      }
      emit(state, 'telegraphDone', { kind: tg.kind, x: tg.x, z: tg.z });
    }
  }
  state.telegraphs = state.telegraphs.filter((tg) => tg.t < tg.dur + 0.05);
}

// ---------------------------------------------------------------- 敌人 AI
function moveEnemy(state, e, tx, tz, speed, dt) {
  const dx = tx - e.x, dz = tz - e.z;
  const len = Math.hypot(dx, dz);
  if (len > 0.01) {
    e.vx = (dx / len) * speed; e.vz = (dz / len) * speed;
  } else { e.vx = 0; e.vz = 0; }
}

function separation(state, e, dt) {
  // 轻量推挤避免完全重叠
  for (const o of state.enemies) {
    if (o === e || o.state === 'spawn') continue;
    const r = (TUNING[e.type].radius + TUNING[o.type].radius) * 0.9;
    const d2 = dist2(e.x, e.z, o.x, o.z);
    if (d2 < r * r && d2 > 0.0001) {
      const d = Math.sqrt(d2);
      const push = (r - d) * 2.2;
      e.kbx += ((e.x - o.x) / d) * push * dt * 60 * 0.02;
      e.kbz += ((e.z - o.z) / d) * push * dt * 60 * 0.02;
    }
  }
}

function contactDamage(state, e, dt, amount) {
  e.touchCd -= dt;
  const p = state.player;
  const r = TUNING[e.type].radius + 0.5;
  if (e.touchCd <= 0 && dist2(p.x, p.z, e.x, e.z) < r * r) {
    e.touchCd = 0.8;
    hurtPlayer(state, amount, e.x, e.z);
  }
}

function updateEnemy(state, e, dt, rng) {
  const p = state.player;
  const T = TUNING[e.type];
  e.animT += dt;
  e.flash = Math.max(0, e.flash - dt);
  if (e.state === 'spawn') {
    e.t -= dt;
    if (e.t <= 0) e.state = 'act';
    return;
  }
  const toP = Math.atan2(p.x - e.x, p.z - e.z);
  switch (e.type) {
    case 'rusher': {
      if (e.phase === 'chase') {
        e.face = toP;
        const sway = Math.sin(e.animT * 3 + e.id) * 0.5;
        moveEnemy(state, e, p.x + Math.cos(toP) * sway * 2, p.z - Math.sin(toP) * sway * 2, T.speed, dt);
        e.cd -= dt;
        if (e.cd <= 0 && dist2(e.x, e.z, p.x, p.z) < T.lungeRange * T.lungeRange) { e.phase = 'windup'; e.t = T.windup; e.lungeX = Math.sin(toP); e.lungeZ = Math.cos(toP); }
      } else if (e.phase === 'windup') {
        e.t -= dt; e.vx = 0; e.vz = 0;
        if (e.t <= 0) { e.phase = 'lunge'; e.t = T.lungeTime; }
      } else if (e.phase === 'lunge') {
        e.t -= dt;
        e.vx = e.lungeX * T.lungeSpeed; e.vz = e.lungeZ * T.lungeSpeed;
        contactDamage(state, e, dt, T.touch + 4);
        if (e.t <= 0) { e.phase = 'recover'; e.t = T.recover; e.cd = T.cooldown; }
      } else if (e.phase === 'recover') {
        e.t -= dt; e.vx = 0; e.vz = 0;
        if (e.t <= 0) e.phase = 'chase';
      }
      contactDamage(state, e, dt, T.touch);
      break;
    }
    case 'thrower': {
      e.face = toP;
      const d = Math.hypot(p.x - e.x, p.z - e.z);
      if (d < T.keepNear) moveEnemy(state, e, e.x - (p.x - e.x), e.z - (p.z - e.z), T.speed, dt);
      else if (d > T.keepFar) moveEnemy(state, e, p.x, p.z, T.speed, dt);
      else { e.vx = Math.cos(e.animT * 1.7) * T.speed * 0.5; e.vz = Math.sin(e.animT * 1.3) * T.speed * 0.5; }
      e.cd -= dt;
      if (e.cd <= 0 && d < 18) {
        e.cd = T.lobCd;
        const lead = T.lobLead;
        state.telegraphs.push({ kind: 'lob', x: p.x + p.vx * lead, z: p.z + p.vz * lead, radius: T.lobRadius, damage: T.lobDamage, t: 0, dur: T.lobTelegraph, owner: e.id });
        emit(state, 'lobAim', { x: p.x + p.vx * lead, z: p.z + p.vz * lead });
      }
      break;
    }
    case 'charger': {
      if (e.phase === 'chase') {
        e.face = toP;
        moveEnemy(state, e, p.x, p.z, T.speed, dt);
        e.cd -= dt;
        const d = Math.hypot(p.x - e.x, p.z - e.z);
        if (e.cd <= 0 && d > T.rangeMin && d < T.rangeMax) {
          e.phase = 'aim'; e.t = T.telegraph;
          const dirX = Math.sin(toP), dirZ = Math.cos(toP);
          e.chargeX = dirX; e.chargeZ = dirZ; e.face = toP;
          state.telegraphs.push({ kind: 'line', x: e.x, z: e.z, dirX, dirZ, len: T.lineLen, halfWidth: T.lineHalfWidth, damage: T.chargeDamage, t: 0, dur: T.telegraph, owner: e.id });
          emit(state, 'chargeAim', { x: e.x, z: e.z, dirX, dirZ });
        }
      } else if (e.phase === 'aim') {
        e.t -= dt; e.vx = 0; e.vz = 0;
      } else if (e.phase === 'charge') {
        e.t -= dt;
        e.vx = e.chargeX * T.chargeSpeed; e.vz = e.chargeZ * T.chargeSpeed;
        contactDamage(state, e, dt, T.chargeDamage);
        if (e.t <= 0) { e.phase = 'dizzy'; e.t = T.dizzy; e.cd = T.cooldown; emit(state, 'dizzy', { x: e.x, z: e.z }); }
      } else if (e.phase === 'dizzy') {
        e.t -= dt; e.vx = 0; e.vz = 0;
        if (e.t <= 0) e.phase = 'chase';
      }
      if (e.phase !== 'charge' && e.phase !== 'aim') contactDamage(state, e, dt, T.touch);
      break;
    }
    case 'brute': {
      e.face = angleDiff(e.face, toP) !== 0 ? e.face + clamp(angleDiff(e.face, toP), -1.8 * dt, 1.8 * dt) : toP;
      if (e.phase === 'chase') {
        moveEnemy(state, e, p.x, p.z, T.speed, dt);
        e.cd -= dt;
        if (e.cd <= 0 && dist2(e.x, e.z, p.x, p.z) < T.slamRange * T.slamRange) {
          e.phase = 'slam'; e.t = T.slamTelegraph;
          state.telegraphs.push({ kind: 'slam', x: e.x, z: e.z, radius: T.slamRadius, damage: T.slamDamage, t: 0, dur: T.slamTelegraph, owner: e.id });
        }
      } else if (e.phase === 'slam') {
        e.t -= dt; e.vx = 0; e.vz = 0;
      } else if (e.phase === 'recover') {
        e.t -= dt;
        if (e.t <= 0) { e.phase = 'chase'; e.cd = T.cooldown; }
      }
      contactDamage(state, e, dt, T.touch);
      break;
    }
    case 'boss': {
      updateBoss(state, e, dt, rng, toP);
      contactDamage(state, e, dt, T.touch);
      break;
    }
  }
  separation(state, e, dt);
}

function bossPattern(state, e, name) {
  const T = TUNING.boss;
  if (name === 'ring') {
    const count = e.bossPhase >= 3 ? T.ringCountLate : T.ringCount;
    const base = e.animT;
    for (let i = 0; i < count; i++) {
      const a = base + (i / count) * TAU;
      state.projectiles.push({ kind: 'ebullet', x: e.x, z: e.z, vx: Math.sin(a) * T.ringSpeed, vz: Math.cos(a) * T.ringSpeed, t: 5, dmg: T.ringDamage, r: 0.35 });
    }
    emit(state, 'bossRing', { x: e.x, z: e.z });
  } else if (name === 'slam') {
    state.telegraphs.push({ kind: 'slam', x: e.x, z: e.z, radius: T.slamRadius, damage: T.slamDamage, t: 0, dur: T.slamTelegraph, owner: e.id });
  } else if (name === 'charge') {
    const toP = Math.atan2(state.player.x - e.x, state.player.z - e.z);
    const dirX = Math.sin(toP), dirZ = Math.cos(toP);
    state.telegraphs.push({ kind: 'line', x: e.x, z: e.z, dirX, dirZ, len: TUNING.charger.lineLen + 4, halfWidth: 2.2, damage: T.slamDamage, t: 0, dur: 0.85, owner: e.id, boss: true });
  } else if (name === 'summon') {
    const rng = mulberry32(state.seed + state.time * 1000 | 0);
    const cap = maxConcurrent(state.wave);
    let n = 0;
    for (let i = 0; i < 4 && state.enemies.length < cap; i++) { spawnEnemy(state, 'rusher', rng); n++; }
    emit(state, 'bossSummon', { n });
  }
}

function updateBoss(state, e, dt, rng, toP) {
  const T = TUNING.boss;
  const frac = e.hp / e.maxHp;
  const newPhase = frac <= T.phase3 ? 3 : frac <= T.phase2 ? 2 : 1;
  if (newPhase !== e.bossPhase && e.phase !== 'stun') {
    e.bossPhase = newPhase;
    e.cd = 1.2;
    emit(state, 'bossPhase', { phase: newPhase, x: e.x, z: e.z });
  }
  if (e.phase === 'stun') {
    e.t -= dt; e.vx = 0; e.vz = 0;
    if (e.t <= 0) { e.phase = 'chase'; e.cd = 0.8; }
    return;
  }
  if (e.phase === 'chase') {
    const d = Math.hypot(state.player.x - e.x, state.player.z - e.z);
    const want = e.bossPhase === 1 ? 7 : 9;
    if (d > want) moveEnemy(state, e, state.player.x, state.player.z, T.speed * (e.bossPhase === 3 ? 1.35 : 1), dt);
    else { e.vx *= 0.9; e.vz *= 0.9; }
    e.cd -= dt;
    if (e.cd <= 0) {
      const pick = rng();
      if (e.bossPhase === 1) {
        if (pick < 0.55 && d < 8) { bossPattern(state, e, 'slam'); e.phase = 'slam'; e.t = T.slamTelegraph; e.cd = 3.4; }
        else { bossPattern(state, e, 'ring'); e.cd = T.ringCd * 0.8; }
      } else if (e.bossPhase === 2) {
        if (pick < 0.5) { bossPattern(state, e, 'charge'); e.cd = 2.6; }
        else if (pick < 0.8) { bossPattern(state, e, 'ring'); e.cd = T.ringCd * 0.65; }
        else { bossPattern(state, e, 'slam'); e.phase = 'slam'; e.t = T.slamTelegraph; e.cd = 3.2; }
      } else {
        if (pick < 0.3) { bossPattern(state, e, 'summon'); e.cd = 4.5; }
        else if (pick < 0.6) { bossPattern(state, e, 'charge'); e.cd = 2.2; }
        else { bossPattern(state, e, 'ring'); e.cd = T.ringCd * 0.5; }
      }
    }
  } else if (e.phase === 'slam') {
    e.t -= dt; e.vx = 0; e.vz = 0;
  } else if (e.phase === 'charge') {
    e.t -= dt;
    e.vx = e.chargeX * 16; e.vz = e.chargeZ * 16;
    if (e.t <= 0) { e.phase = 'chase'; e.cd = 2; e.vx = 0; e.vz = 0; }
  }
  e.face = toP;
}

// ---------------------------------------------------------------- 弹幕
function updateProjectiles(state, dt) {
  for (const pr of state.projectiles) {
    pr.t -= dt;
    pr.x += pr.vx * dt; pr.z += pr.vz * dt;
    if (pr.kind === 'blade') {
      for (const e of state.enemies) {
        if (pr.hits.has(e.id) || e.state === 'spawn') continue;
        const r = TUNING[e.type].radius + 0.4;
        if (dist2(pr.x, pr.z, e.x, e.z) < r * r) {
          pr.hits.add(e.id);
          const len = Math.hypot(pr.vx, pr.vz) || 1;
          damageEnemy(state, e, pr.dmg, 3, pr.vx / len, pr.vz / len);
          pr.pierce -= 1;
          if (pr.pierce <= 0) { pr.t = 0; break; }
        }
      }
    } else if (pr.kind === 'ebullet') {
      if (dist2(pr.x, pr.z, state.player.x, state.player.z) < 0.36) {
        hurtPlayer(state, pr.dmg, pr.x, pr.z);
        pr.t = 0;
      }
    }
    const r2 = (ARENA_RADIUS - 0.5) * (ARENA_RADIUS - 0.5);
    if (dist2(pr.x, pr.z, 0, 0) > r2) pr.t = 0;
  }
  state.projectiles = state.projectiles.filter((pr) => pr.t > 0);
}

// ---------------------------------------------------------------- 主更新
export function update(state, dt, input, rng) {
  if (state.phase === 'paused' || state.phase === 'menu' || state.phase === 'upgrade' || state.phase === 'over') {
    state.events.length = 0;
    return;
  }
  state.time += dt;
  const p = state.player;
  const P = TUNING.player;

  // --- 计时器
  p.bladeCd = Math.max(0, p.bladeCd - dt);
  p.hurtIframes = Math.max(0, p.hurtIframes - dt);
  p.hurtT = Math.max(0, p.hurtT - dt);
  p.dashIframes = Math.max(0, p.dashIframes - dt);
  if (p.dashCharges < p.stats.dashMax) {
    p.dashRechargeT += dt;
    if (p.dashRechargeT >= p.stats.dashRecharge) { p.dashRechargeT = 0; p.dashCharges += 1; emit(state, 'dashRecharge', { charges: p.dashCharges }); }
  } else p.dashRechargeT = 0;

  // --- 移动 / 冲刺
  if (p.dashT > 0) {
    p.dashT -= dt;
    p.vx = p.dashDirX * P.dashSpeed; p.vz = p.dashDirZ * P.dashSpeed;
    if (p.dashT <= 0) p.vx = p.vz = 0;
  } else {
    const mx = input.moveX || 0, mz = input.moveZ || 0;
    const mlen = Math.hypot(mx, mz);
    const attacking = p.comboStage > 0 || p.heavyT >= 0;
    if (mlen > 0.15) {
      const sp = P.speed * p.stats.moveSpeed * (attacking ? 0.35 : 1);
      p.vx = (mx / mlen) * sp; p.vz = (mz / mlen) * sp;
      p.moving = Math.min(1, p.moving + dt * 8);
      if (!attacking && p.comboStage === 0) p.face = Math.atan2(mx, mz);
      p.runT += dt * (1 + sp * 0.12);
    } else {
      p.vx *= Math.pow(0.0001, dt); p.vz *= Math.pow(0.0001, dt);
      p.moving = Math.max(0, p.moving - dt * 8);
    }
  }

  // --- 重击蓄力
  if (input.heavyDown && p.heavyT >= 0) {
    p.heavyT += dt;
    if (p.heavyT >= 1.2) doHeavy(state); // 蓄满自动释放
  } else if (!input.heavyDown && p.heavyT >= 0) {
    if (p.heavyT >= P.heavyCharge) doHeavy(state);
    else p.heavyT = -1;
  }

  // --- 输入边沿
  if (input.attackPressed && p.heavyT < 0) {
    if (p.comboStage === 0) startCombo(state, 1);
    else if (!p.comboBuffered && p.comboT > P.comboDuration[p.comboStage - 1] * (1 / p.stats.atkSpeed) * P.comboBufferAfter) p.comboBuffered = true;
  }
  if (input.heavyPressed && p.heavyT < 0 && p.comboStage === 0) p.heavyT = 0;
  if (input.dashPressed) doDash(state, input);
  if (input.bladePressed) doBlade(state);
  if (input.burstPressed) doBurst(state);

  // --- 连击推进
  if (p.comboStage > 0) {
    const stage = p.comboStage;
    const dur = P.comboDuration[stage - 1] / p.stats.atkSpeed;
    p.comboT += dt;
    if (!p.comboHitDone && p.comboT >= dur * P.comboHitAt) {
      p.comboHitDone = true;
      const range = P.comboRange[stage - 1], arc = P.comboArc[stage - 1];
      const dmg = P.comboDamage[stage - 1];
      const knock = stage === 3 ? 8 : 3.5;
      for (const e of [...state.enemies]) {
        if (e.state === 'spawn') continue;
        const d2 = dist2(p.x, p.z, e.x, e.z);
        const rr = range + TUNING[e.type].radius;
        if (d2 > rr * rr) continue;
        const ang = Math.atan2(e.x - p.x, e.z - p.z);
        if (Math.abs(angleDiff(p.face, ang)) > arc / 2) continue;
        const dx = e.x - p.x, dz = e.z - p.z, len = Math.hypot(dx, dz) || 1;
        damageEnemy(state, e, dmg, knock, dx / len, dz / len, { combo: true });
      }
    }
    if (p.comboT >= dur) {
      if (p.comboBuffered && stage < 3) startCombo(state, stage + 1);
      else if (p.comboBuffered && stage === 3) startCombo(state, 1); // 三段后循环
      else { p.comboStage = 0; p.comboT = 0; }
    }
  }

  // --- 位移积分
  p.x += p.vx * dt; p.z += p.vz * dt;
  const pr = Math.hypot(p.x, p.z);
  const maxR = ARENA_RADIUS - 1;
  if (pr > maxR) { p.x = p.x / pr * maxR; p.z = p.z / pr * maxR; p.vx *= 0.2; p.vz *= 0.2; }

  // --- 敌人
  for (const e of [...state.enemies]) {
    e.kbx *= Math.pow(0.002, dt); e.kbz *= Math.pow(0.002, dt);
    e.x += (e.vx + e.kbx) * dt; e.z += (e.vz + e.kbz) * dt;
    const er = Math.hypot(e.x, e.z);
    if (er > ARENA_RADIUS - 1) { e.x = e.x / er * (ARENA_RADIUS - 1); e.z = e.z / er * (ARENA_RADIUS - 1); }
    updateEnemy(state, e, dt, rng);
  }

  updateTelegraphs(state, dt);
  updateProjectiles(state, dt);

  // --- 补血拾取（Boss 波掉落由事件驱动，这里仅计时）
  for (const pk of state.pickups) pk.t += dt;

  // --- 出怪
  if (state.spawnQueue.length > 0) {
    state.spawnTimer += dt;
    const cap = maxConcurrent(state.wave);
    while (state.spawnQueue.length > 0 && state.enemies.length < cap && state.spawnQueue[0].delay <= state.spawnTimer) {
      const entry = state.spawnQueue.shift();
      spawnEnemy(state, entry.type, rng);
    }
  } else if (state.enemies.length === 0 && state.phase === 'playing') {
    const flawless = state.waveDamageTaken === 0;
    state.score += 50 + 10 * state.wave + (flawless ? 25 : 0);
    state.offer = pickUpgrades(state, rng);
    state.phase = 'upgrade';
    emit(state, 'waveClear', { n: state.wave, flawless, offer: state.offer });
  }
}

export { clamp, dist2, angleDiff };
