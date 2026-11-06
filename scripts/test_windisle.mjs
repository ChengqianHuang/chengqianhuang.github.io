// 风屿规则引擎回归测试。node scripts/test_windisle.mjs
import assert from 'node:assert/strict';
import {telegraphShape,telegraphContains} from '../windisle/src/combat-geometry.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  createState, startWave, update, mulberry32, applyUpgrade, pickUpgrades, UPGRADES,
  TUNING, ARENA_RADIUS, waveComposition,
} from '../windisle/src/engine.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DT = 1 / 60;
let passed = 0;
function ok(name, fn) {
  try { fn(); passed++; console.log(`  ok  ${name}`); }
  catch (err) { console.error(`FAIL  ${name}\n      ${err.message}`); process.exitCode = 1; }
}

// ---------------------------------------------------------------- 机器人
function makeBot() {
  return {
    attackCd: 0, bladeCd: 0, dashCd: 0, heavyT: 0,
    input(state, dt) {
      const p = state.player;
      this.attackCd -= dt; this.bladeCd -= dt; this.dashCd -= dt;
      let nearest = null, nd = Infinity;
      for (const e of state.enemies) {
        if (e.state === 'spawn') continue;
        const dx = e.x - p.x, dz = e.z - p.z, d2 = dx * dx + dz * dz;
        if (d2 < nd) { nd = d2; nearest = e; }
      }
      const input = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
      if (!nearest) return input;
      const d = Math.sqrt(nd);
      const dx = (nearest.x - p.x) / d, dz = (nearest.z - p.z) / d;
      if (d > 2.3) { input.moveX = dx; input.moveZ = dz; }
      else if (d < 1.4) { input.moveX = -dx; input.moveZ = -dz; }
      // 预警区就近躲避
      if (this.dashCd <= 0 && p.dashCharges >= 1) {
        for (const tg of state.telegraphs) {
          const tx = tg.x - p.x, tz = tg.z - p.z;
          if (tx * tx + tz * tz < 16) { input.dashPressed = true; this.dashCd = 1.2; break; }
        }
      }
      if (this.attackCd <= 0 && d < 2.9) { input.attackPressed = true; this.attackCd = 0.28; }
      if (this.bladeCd <= 0 && d < 12 && d > 3) { input.bladePressed = true; this.bladeCd = 2.5; }
      if (p.energy >= 100 && state.enemies.length >= 2) input.burstPressed = true;
      return input;
    },
  };
}

function runBot(seed, { maxTime = 300, maxWave = Infinity } = {}) {
  const state = createState(seed);
  startWave(state, 1);
  const rng = mulberry32(seed ^ 0xBEEF);
  const bot = makeBot();
  let t = 0;
  while (state.phase !== 'over' && state.wave < maxWave && t < maxTime) {
    update(state, DT, bot.input(state, DT), rng);
    state.events.length = 0;
    if (state.phase === 'upgrade') {
      assert.ok(state.offer && state.offer.length === 3, '波次结算应提供 3 个天赋');
      applyUpgrade(state, state.offer[0]);
      startWave(state, state.wave + 1);
    }
    assert.ok(Number.isFinite(state.player.x) && Number.isFinite(state.player.z) && Number.isFinite(state.player.hp), `第 ${t.toFixed(1)} 秒出现 NaN`);
    assert.ok(state.player.hp <= state.player.maxHp && state.player.hp >= 0, '生命越界');
    for (const e of state.enemies) assert.ok(Number.isFinite(e.x) && Number.isFinite(e.z) && Number.isFinite(e.hp), '敌人状态出现 NaN');
    t += DT;
  }
  return { state, time: t };
}

function hashState(state) {
  const parts = [
    state.score, state.wave, state.kills, state.player.hp.toFixed(3), state.player.x.toFixed(3), state.player.z.toFixed(3),
    ...state.enemies.map((e) => `${e.id}:${e.hp.toFixed(2)}:${e.x.toFixed(2)}:${e.z.toFixed(2)}:${e.phase}`),
    ...state.projectiles.map((pr) => `${pr.x.toFixed(2)}:${pr.z.toFixed(2)}`),
  ];
  return parts.join('|');
}

ok('八方向预警显示边界与真实命中区域一致',()=>{
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,tg={kind:'line',x:2,z:-3,dirX:Math.sin(a),dirZ:Math.cos(a),len:10,halfWidth:.9};
    const shape=telegraphShape(tg);assert.equal(shape.center-shape.length/2,-.5);assert.equal(shape.center+shape.length/2,10);
    for(const [along,side,hit]of [[-.51,0,false],[-.49,0,true],[9.99,.89,true],[10.01,0,false],[5,.91,false]]){
      const p={x:tg.x+tg.dirX*along+tg.dirZ*side,z:tg.z+tg.dirZ*along-tg.dirX*side};
      assert.equal(telegraphContains(tg,p),hit);
      const state=createState(10);startWave(state,1);state.enemies=[];state.spawnQueue=[];Object.assign(state.player,p);state.telegraphs=[{...tg,t:0,dur:DT,damage:7}];
      update(state,DT,{},mulberry32(1));assert.equal(state.player.hp<TUNING.player.hp,hit,'engine uses the same boundary');
    }
  }
  for(const kind of ['slam','lob']){const tg={kind,x:0,z:0,radius:3};assert.equal(telegraphShape(tg).radius,3);assert(telegraphContains(tg,{x:2.99,z:0}));assert(!telegraphContains(tg,{x:3.01,z:0}));}
});
ok('出怪与击杀保留事件名称，命中包含攻击分级',()=>{
  const state=createState(6),rng=mulberry32(6);startWave(state,1);let spawned=false;
  for(let f=0;f<120;f++){update(state,DT,{},rng);spawned ||=state.events.some(e=>e.type==='spawnPoof'&&e.enemyType);state.events=[];}
  assert(spawned,'enemy metadata must not overwrite spawnPoof');
  state.enemies=[{id:99,type:'rusher',x:0,z:1.5,face:0,state:'act',phase:'recover',t:999,flash:0,kbx:0,kbz:0,touchCd:99,animT:0,hp:1,maxHp:1,cd:99}];state.player.energy=100;
  update(state,DT,{burstPressed:true},rng);
  assert(state.events.some(e=>e.type==='kill'&&e.enemyType==='rusher'));
  assert(state.events.some(e=>e.type==='hit'&&e.enemyId===99&&e.attack==='burst'));
});

// ---------------------------------------------------------------- 连击
ok('连击三段依次造成递增伤害并循环', () => {
  const state = createState(42);
  startWave(state, 1);
  const rng = mulberry32(1);
  // 固定一个木桩敌人：长恢复期静止不动
  state.enemies.length = 0;
  state.enemies.push({ id: 99, type: 'rusher', x: 0, z: 2.2, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 999, maxHp: 999, cd: 99 });
  const press = { moveX: 0, moveZ: 0, attackPressed: true, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  const idle = { ...press, attackPressed: false };
  // 每 0.23s 按一次维持连段缓冲，逐帧消费命中事件；每帧把木桩钉回原位（击退会把目标推出范围）
  const dmgSeq = [];
  for (let f = 0; f < 110; f++) {
    update(state, DT, f % 14 === 0 ? press : idle, rng);
    for (const ev of state.events) if (ev.type === 'hit') dmgSeq.push(ev.dmg);
    state.events.length = 0;
    state.enemies[0].x = 0; state.enemies[0].z = 2.2; state.enemies[0].kbx = 0; state.enemies[0].kbz = 0;
  }
  assert.deepEqual(dmgSeq.slice(0, 4), [12, 14, 22, 12], `伤害序列应为 12/14/22/12 循环，实际 ${dmgSeq.slice(0, 6)}`);
});

ok('第三段击退敌人', () => {
  const state = createState(7);
  startWave(state, 1);
  const rng = mulberry32(2);
  state.enemies.length = 0;
  state.enemies.push({ id: 98, type: 'rusher', x: 0, z: 2.2, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 9999, maxHp: 9999, cd: 99 });
  const press = { moveX: 0, moveZ: 0, attackPressed: true, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  const idle = { ...press, attackPressed: false };
  let stage3 = false;
  for (let i = 0; i < 3; i++) {
    update(state, DT, press, rng);
    for (let f = 0; f < 13; f++) update(state, DT, idle, rng);
    if (state.player.comboStage === 3) stage3 = true;
  }
  assert.ok(stage3, '应到达第三段');
  const z = state.enemies[0].z;
  assert.ok(z > 2.4, `第三段应把敌人向外推（z=${z.toFixed(2)}）`);
});

ok('冲刺无敌帧内不受伤害', () => {
  const state = createState(11);
  startWave(state, 1);
  const rng = mulberry32(3);
  state.enemies.length = 0;
  // 敌人放在冲刺落点：从原点向 +z 冲刺约 3.06 单位
  state.enemies.push({ id: 97, type: 'rusher', x: 0, z: 3.1, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 100, maxHp: 100, cd: 99 });
  const dash = { moveX: 0, moveZ: 1, attackPressed: false, heavyDown: false, dashPressed: true, bladePressed: false, burstPressed: false };
  const hold = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  update(state, DT, dash, rng);
  assert.ok(state.player.dashIframes > 0, '冲刺后应有无敌帧');
  for (let f = 0; f < 10; f++) update(state, DT, hold, rng); // 落在敌人身边
  assert.equal(state.player.hp, TUNING.player.hp, '无敌帧期间不应掉血');
  for (let f = 0; f < 60; f++) update(state, DT, hold, rng);
  assert.ok(state.player.hp < TUNING.player.hp, '无敌帧结束后接触应造成伤害');
});

ok('受击后有短暂无敌，不会连续掉血', () => {
  const state = createState(13);
  startWave(state, 1);
  const rng = mulberry32(4);
  state.enemies.length = 0;
  state.enemies.push({ id: 96, type: 'rusher', x: 0, z: 0.6, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 100, maxHp: 100, cd: 99 });
  const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  update(state, DT, idle, rng);
  const afterFirst = state.player.hp;
  assert.ok(afterFirst < TUNING.player.hp, '接触应造成伤害');
  for (let f = 0; f < 12; f++) update(state, DT, idle, rng);
  assert.equal(state.player.hp, afterFirst, '受击无敌帧内不应再次掉血');
});

ok('冲出竞技场会被边界拦住', () => {
  const state = createState(17);
  startWave(state, 1);
  const rng = mulberry32(5);
  state.enemies.length = 0;
  const run = { moveX: 0, moveZ: 1, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  for (let f = 0; f < 60 * 8; f++) update(state, DT, run, rng);
  assert.ok(Math.hypot(state.player.x, state.player.z) <= ARENA_RADIUS - 1 + 0.01, '玩家应被限制在场地内');
});

// ---------------------------------------------------------------- 预警区
ok('冲撞兽直线预警只在玩家处于弹道内时命中', () => {
  const state = createState(23);
  startWave(state, 1);
  const rng = mulberry32(6);
  state.enemies.length = 0;
  // 玩家在原点，弹道从 z=-10 沿 +z 穿过原点
  state.telegraphs.push({ kind: 'line', x: 0, z: -10, dirX: 0, dirZ: 1, len: 11, halfWidth: 1.5, damage: 16, t: 0, dur: 0.2, owner: -1 });
  const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  for (let f = 0; f < 20; f++) update(state, DT, idle, rng);
  assert.ok(state.player.hp < TUNING.player.hp, '站在弹道内应受伤害');
  // 横向移出弹道
  const state2 = createState(23);
  startWave(state2, 1);
  state2.enemies.length = 0;
  state2.player.x = 6;
  state2.telegraphs.push({ kind: 'line', x: 0, z: -10, dirX: 0, dirZ: 1, len: 11, halfWidth: 1.5, damage: 16, t: 0, dur: 0.2, owner: -1 });
  for (let f = 0; f < 20; f++) update(state2, DT, idle, rng);
  assert.equal(state2.player.hp, TUNING.player.hp, '弹道外不应受伤害');
});

ok('Boss 震地后进入易伤眩晕', () => {
  const state = createState(29);
  startWave(state, 3); // Boss 波
  const rng = mulberry32(7);
  const idle0 = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  for (let f = 0; f < 70; f++) { update(state, DT, idle0, rng); state.events.length = 0; } // Boss 延迟 0.4s 生成 + 0.6s 落地
  const boss = state.enemies.find((e) => e.type === 'boss');
  assert.ok(boss, '第 3 波应有 Boss');
  state.telegraphs.push({ kind: 'slam', x: boss.x, z: boss.z, radius: 3, damage: 20, t: 0, dur: 0.1, owner: boss.id });
  state.player.x = 15; state.player.z = 15; // 躲开伤害
  const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  for (let f = 0; f < 20; f++) { update(state, DT, idle, rng); state.events.length = 0; }
  assert.equal(boss.phase, 'stun', '震地结算后 Boss 应眩晕');
  // 眩晕期间伤害翻倍；站位在接触范围(2.2)外、普攻距离(4.5)内
  const hpBefore = boss.hp;
  state.player.x = boss.x; state.player.z = boss.z - 3;
  update(state, DT, { moveX: 0, moveZ: 0, attackPressed: true, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false }, rng);
  state.events.length = 0;
  for (let f = 0; f < 14; f++) { update(state, DT, idle, rng); state.events.length = 0; }
  const dmg = hpBefore - boss.hp;
  assert.ok(Math.abs(dmg - TUNING.player.comboDamage[0] * TUNING.boss.stunMult) < 0.02, `眩晕期伤害应翻倍，实际 ${dmg}`);
});

ok('Boss 血量阈值切换阶段', () => {
  const state = createState(31);
  startWave(state, 3);
  const rng = mulberry32(8);
  const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  for (let f = 0; f < 70; f++) { update(state, DT, idle, rng); state.events.length = 0; } // Boss 延迟入场
  const boss = state.enemies.find((e) => e.type === 'boss');
  assert.ok(boss, '第 3 波应有 Boss');
  boss.hp = boss.maxHp * 0.5;
  for (let f = 0; f < 6; f++) { update(state, DT, idle, rng); state.events.length = 0; }
  assert.equal(boss.bossPhase, 2, '血量 50% 应进入二阶段');
  boss.hp = boss.maxHp * 0.2;
  for (let f = 0; f < 6; f++) { update(state, DT, idle, rng); state.events.length = 0; }
  assert.equal(boss.bossPhase, 3, '血量 20% 应进入三阶段');
});

// ---------------------------------------------------------------- 波次与出怪
ok('波次编成遵守预算且每三波出 Boss', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const rng = mulberry32(seed * 131);
    for (const n of [1, 2, 3, 4, 5, 6, 9]) {
      const list = waveComposition(n, rng);
      assert.ok(list.length > 0, `第 ${n} 波编成不应为空`);
      if (n % 3 === 0) assert.ok(list.some((x) => x.type === 'boss'), `第 ${n} 波应有 Boss`);
      else assert.ok(!list.some((x) => x.type === 'boss'), `第 ${n} 波不应有 Boss`);
      let cost = 0;
      for (const x of list) cost += x.type === 'boss' ? 0 : { rusher: 1, thrower: 2, charger: 3, brute: 4 }[x.type];
      const budget = n % 3 === 0 ? Math.floor((4 + n) / 3) : 4 + 2 * n;
      assert.ok(cost <= budget, `第 ${n} 波成本 ${cost} 超出预算 ${budget}`);
    }
  }
});

ok('出怪位置与玩家保持安全距离', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const state = createState(seed * 97);
    startWave(state, 1);
    const rng = mulberry32(seed);
    const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
    for (let f = 0; f < 60 * 12; f++) {
      update(state, DT, idle, rng);
      if (state.phase !== 'playing') break;
      for (const e of state.enemies) {
        if (e.state !== 'spawn') continue; // 只检查入场瞬间；之后敌人正常接近
        const d = Math.hypot(e.x - state.player.x, e.z - state.player.z);
        assert.ok(d > 7.5, `种子 ${seed} 的出怪距离过近：${d.toFixed(2)}`);
      }
    }
  }
});

// ---------------------------------------------------------------- 天赋
ok('天赋三选一互不重复且可叠加、有上限', () => {
  const state = createState(41);
  const rng = mulberry32(9);
  for (let round = 0; round < 40; round++) {
    const offer = pickUpgrades(state, rng);
    assert.equal(new Set(offer).size, offer.length, '同一轮天赋不应重复');
    for (const id of offer) assert.ok(UPGRADES.some((u) => u.id === id), `未知天赋 ${id}`);
    applyUpgrade(state, offer[0]);
  }
  const taken = state.upgradesTaken;
  for (const u of UPGRADES) assert.ok(taken[u.id] <= u.max, `${u.id} 超出上限`);
  assert.equal(state.player.stats.dashMax, 3, '双影冲刺应叠加到 3 段充能');
  assert.ok(state.player.stats.atkSpeed > 1, '攻速应已提升');
});

ok('吸血天赋按击杀回血', () => {
  const state = createState(43);
  startWave(state, 1);
  applyUpgrade(state, 'lifesteal');
  const rng = mulberry32(10);
  state.enemies.length = 0;
  state.enemies.push({ id: 95, type: 'rusher', x: 0, z: 2.2, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 1, maxHp: 20, cd: 99 });
  state.player.hp = 50;
  update(state, DT, { moveX: 0, moveZ: 0, attackPressed: true, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false }, rng);
  for (let f = 0; f < 14; f++) update(state, DT, { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false }, rng);
  assert.equal(state.enemies.length, 0, '残血敌人应被击杀');
  assert.ok(state.player.hp > 50, '击杀应触发吸血回血');
});

// ---------------------------------------------------------------- 重击 / 风刃 / 大招
ok('蓄力重击造成范围伤害', () => {
  const state = createState(47);
  startWave(state, 1);
  const rng = mulberry32(11);
  state.enemies.length = 0;
  state.enemies.push({ id: 94, type: 'rusher', x: 0, z: 2, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 100, maxHp: 100, cd: 99 });
  const start = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: true, heavyPressed: true, dashPressed: false, bladePressed: false, burstPressed: false };
  update(state, DT, start, rng);
  assert.equal(state.player.heavyT, 0, '应开始蓄力'); // 第一帧后递增前为 0
  for (let f = 0; f < 45; f++) update(state, DT, { ...start, heavyPressed: false }, rng); // 0.75s
  const release = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  update(state, DT, release, rng);
  assert.ok(state.enemies[0].hp < 100, '蓄力重击应命中范围内敌人');
  assert.ok(state.enemies[0].hp > 60, `伤害应约 34，实际 ${100 - state.enemies[0].hp}`);
});

ok('风刃有冷却且可命中远处敌人', () => {
  const state = createState(53);
  startWave(state, 1);
  const rng = mulberry32(12);
  state.enemies.length = 0;
  state.enemies.push({ id: 93, type: 'brute', x: 0, z: 8, vx: 0, vz: 0, face: Math.PI, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 100, maxHp: 100, cd: 99 });
  const fire = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: true, burstPressed: false };
  const idle = { ...fire, bladePressed: false };
  update(state, DT, fire, rng);
  assert.equal(state.projectiles.length, 1, '应生成风刃');
  for (let f = 0; f < 40; f++) update(state, DT, idle, rng);
  assert.ok(state.enemies[0].hp < 100, '风刃应命中远处敌人');
  update(state, DT, fire, rng);
  assert.equal(state.projectiles.length, 0, '冷却中不应再次发射');
});

ok('能量满后可释放大招清场', () => {
  const state = createState(59);
  startWave(state, 1);
  const rng = mulberry32(13);
  state.enemies.length = 0;
  for (let i = 0; i < 4; i++) {
    state.enemies.push({ id: 90 + i, type: 'rusher', x: Math.cos(i * 1.6) * 3, z: Math.sin(i * 1.6) * 3, vx: 0, vz: 0, face: 0, state: 'act', phase: 'recover', t: 999, flash: 0, kbx: 0, kbz: 0, touchCd: 0, animT: 0, hp: 15, maxHp: 20, cd: 99 });
  }
  state.player.energy = 100;
  const before = state.enemies.length;
  update(state, DT, { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: true }, rng);
  assert.ok(state.events.some((ev) => ev.type === 'burst'), '应触发大招事件');
  assert.ok(state.player.energy < 100, '大招应先清空能量（击杀回能不计）');
  assert.ok(state.enemies.length < before, `大招应清除近身敌人，剩余 ${state.enemies.length}`);
});

// ---------------------------------------------------------------- 完整模拟
ok('机器人完整对局：推进波次、无 NaN、结算正确', () => {
  const { state, time } = runBot(2024, { maxTime: 240, maxWave: 4 });
  assert.ok(state.wave >= 2, `机器人应能通过第 1 波（当前第 ${state.wave} 波，用时 ${time.toFixed(1)}s）`);
  assert.ok(state.score > 0, '应积累分数');
  assert.ok(state.kills > 0, '应有击杀');
});

ok('机器人挂机会被击败并触发结算', () => {
  const state = createState(777);
  startWave(state, 1);
  const rng = mulberry32(14);
  const idle = { moveX: 0, moveZ: 0, attackPressed: false, heavyDown: false, dashPressed: false, bladePressed: false, burstPressed: false };
  let t = 0;
  while (state.phase !== 'over' && t < 180) { update(state, DT, idle, rng); t += DT; }
  assert.equal(state.phase, 'over', '原地不动应被击败');
  assert.equal(state.player.hp, 0, '死亡时生命应为 0');
  assert.ok(t < 120, `站立不应存活超过 120 秒，实际 ${t.toFixed(1)}s`);
});

ok('同种子完整对局完全可复现', () => {
  const a = runBot(31415, { maxTime: 90, maxWave: 3 });
  const b = runBot(31415, { maxTime: 90, maxWave: 3 });
  assert.equal(hashState(a.state), hashState(b.state), '同种子两次对局状态应一致');
});

ok('暂停期间状态完全冻结', () => {
  const state = createState(88);
  startWave(state, 1);
  const rng = mulberry32(15);
  const bot = makeBot();
  for (let f = 0; f < 60; f++) update(state, DT, bot.input(state, DT), rng);
  state.phase = 'paused';
  const snap = hashState(state);
  for (let f = 0; f < 60; f++) update(state, DT, bot.input(state, DT), rng);
  assert.equal(hashState(state), snap, '暂停不应改变任何状态');
});

// ---------------------------------------------------------------- 集成检查
ok('games.json 已注册风屿且封面存在', () => {
  const catalog = JSON.parse(readFileSync(join(root, 'games.json'), 'utf8'));
  const entry = catalog.find((g) => g.id === 'windisle');
  assert.ok(entry, 'games.json 应包含 windisle');
  assert.ok(entry.url === '/games/windisle.html', 'url 应指向独立页面');
  assert.ok(entry.title && entry.description && entry.controls, '标题/描述/操作说明应完整');
  assert.ok(existsSync(join(root, 'games', 'windisle.html')), '游戏页面应存在');
  const cover = entry.cover.split('?')[0];
  assert.ok(existsSync(join(root, cover)), `封面 ${cover} 应存在`);
});

console.log(`\n风屿引擎测试：${passed} 项通过${process.exitCode ? '（存在失败）' : ''}`);
