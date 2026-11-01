import assert from 'node:assert/strict';
import { ChronoGame, LEVELS, STEP, WIDTH, HEIGHT } from '../chronostasis-engine.mjs';

let seed = 20261101;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const create = (levelIndex = 0) => {
  const game = new ChronoGame({ random });
  game.start(levelIndex);
  return game;
};
const tick = (game, seconds, input = {}, frame = 1 / 60) => {
  let t = 0;
  while (t < seconds) {
    const dt = Math.min(frame, seconds - t);
    game.step(dt, input);
    t += dt;
    if (game.state !== 'playing') break;
  }
};
const snapshot = (g) => JSON.stringify({
  enemies: g.enemies, bullets: g.bullets, projectiles: g.projectiles,
  pickups: g.pickups, simTime: g.simTime,
});

// ---------- 时间法则：静止即冻结 ----------
{
  const g = create(0);
  const before = snapshot(g);
  tick(g, 1);
  assert.equal(snapshot(g), before, '玩家静止时整个世界必须完全冻结');
  assert.equal(g.timeScale, 0);
  assert.equal(g.enemiesLeft, 1, '敌人不应消失');
  assert.equal(g.enemies[0].react, LEVELS[0] ? 0.4 : 0.4, '敌人反应计时也不走');
}

// 移动推进世界，且推进量按移动比例缩放
{
  const g = create(0);
  tick(g, 0.1); // 等待加速平滑
  const t0 = g.simTime;
  tick(g, 0.5, { moveX: 1 });
  const moved = g.simTime - t0;
  assert.ok(moved > 0.4 && moved <= 0.501, `全速移动时世界时间应接近真实时间（实际 ${moved.toFixed(3)}）`);
}

// 开火与瞄准不推进时间：子弹悬停在空中
{
  const g = create(0);
  g.player.weapon = { kind: 'pistol', ammo: 8 };
  const aimAt = () => {
    const e = g.enemies[0];
    return { aimX: e.x - g.player.x, aimY: e.y - g.player.y };
  };
  tick(g, 0.1, { ...aimAt(), fire: false });
  tick(g, 0.05, { ...aimAt(), fire: true });
  tick(g, 0.05, { ...aimAt(), fire: false });
  assert.equal(g.bullets.length, 1, '开火生成了子弹');
  assert.equal(g.stats.shots, 1);
  assert.equal(g.timeScale, 0, '开火不应推进时间');
  assert.ok(Math.abs(g.bullets[0].x - (g.player.x + 20)) < 6, '静止时子弹应停在枪口');
  tick(g, 0.4, { ...aimAt(), fire: false });
  assert.equal(g.bullets.length, 1, '继续静止，子弹仍然悬停');
  assert.equal(g.enemiesLeft, 1);
}

// ---------- 击杀、通关、进度 ----------
{
  const g = create(0);
  g.player.weapon = { kind: 'pistol', ammo: 8 };
  const e = g.enemies[0];
  // 绕行射击：保持移动（世界流动），按放扳机，瞄准当前敌人位置
  const input = { moveX: 0, moveY: 0, fire: false };
  let cleared = false;
  for (let i = 0; i < 900 && !cleared; i++) {
    input.moveX = Math.cos(i / 26);
    input.moveY = Math.sin(i / 26) * 0.8;
    input.aimX = e.x - g.player.x; input.aimY = e.y - g.player.y;
    input.fire = i % 8 < 2;
    g.step(1 / 60, input);
    if (g.state === 'clear') cleared = true;
  }
  assert.ok(cleared, '移动射击应能击杀敌人并通关');
  assert.equal(g.stats.kills, 1);
  assert.ok(g.session.kills === 1);
  assert.equal(g.nextLevel(), true, '通关后应进入下一关');
  assert.equal(g.levelIndex, 1);
  // 最后一关清空后应进入 complete
  g.loadLevel(LEVELS.length - 1);
  for (const e of g.enemies) e.alive = false;
  g.step(STEP, {});
  assert.equal(g.state, 'clear');
  assert.equal(g.nextLevel(), false, '已是最后一关时进入 complete');
  assert.equal(g.state, 'complete');
}

// 全部 10 关都能被加载且状态合法
{
  assert.equal(LEVELS.length, 10);
  for (let i = 0; i < LEVELS.length; i++) {
    const g = create(i);
    assert.equal(g.state, 'playing');
    assert.ok(g.enemies.length > 0, `第 ${i + 1} 关应有敌人`);
    for (const e of g.enemies) {
      assert.ok(e.x > 20 && e.x < WIDTH - 20 && e.y > 20 && e.y < HEIGHT - 20);
    }
    assert.ok(g.player.x > 20 && g.player.x < WIDTH - 20 && g.player.y > 20 && g.player.y < HEIGHT - 20);
  }
}

// ---------- 死亡与重开 ----------
{
  const g = create(0);
  // 手动放置一颗敌方子弹到玩家脸上
  g.bullets.push({ x: g.player.x + 30, y: g.player.y, vx: -240, vy: 0, friendly: false, life: 3 });
  tick(g, 0.2, { moveX: 0.4 });
  assert.equal(g.state, 'dead', '被击中即死');
  assert.equal(g.session.deaths, 1);
  g.restart();
  assert.equal(g.state, 'playing');
  assert.equal(g.enemiesLeft, 1);
  assert.equal(g.player.alive, true);
  assert.equal(g.bullets.length, 0);
}

// 敌方子弹也可以击杀其他敌人（友军误伤是合法战术），且命中后子弹消耗
{
  const g = create(0);
  const a = g.enemies[0];
  g.enemies.push({ ...structuredClone(g.enemies[0]) });
  g.enemies.push({ ...structuredClone(g.enemies[0]) });
  const b = g.enemies[1];
  a.x = 900; a.y = 360; a.react = 999;
  b.x = 1000; b.y = 360; b.react = 999;
  g.enemies[2].x = 1100; g.enemies[2].y = 360; g.enemies[2].react = 999;
  g.bullets.push({ x: 860, y: 360, vx: 240, vy: 0, friendly: false, life: 3 });
  tick(g, 1, { moveY: 1 }); // 世界流动即可，玩家离开弹道
  assert.equal(a.alive, false, '敌方子弹应击杀第一个敌人');
  assert.equal(b.alive, true, '子弹命中即消耗，不穿透');
  assert.equal(g.enemies[2].alive, true);
}

// ---------- 掩体与视线 ----------
{
  const g = create(4); // 霰弹走廊：中间有掩体
  const g2 = create(1); // 交叉火力：竖墙
  assert.equal(g2.losClear(200, 360, 940, 160), false, '竖墙应挡住视线');
  assert.equal(g2.losClear(200, 360, 940, 360), true, '中间通道应可见');
  // 敌人在无视线时不应开火
  const g3 = create(1);
  g3.enemies[0].x = 940; g3.enemies[0].y = 160;
  g3.enemies[0].react = 0; g3.enemies[0].cooldown = 0;
  g3.enemies[0].aim = Math.atan2(360 - 160, 200 - 940);
  const bullets0 = g3.bullets.length;
  tick(g3, 1, {}); // 玩家静止 → 世界不动 → 不会开火
  assert.equal(g3.bullets.length, bullets0);
  // 移动中（世界流动）但视线被墙挡住：仍不开火
  tick(g3, 2, { moveY: 0.3, moveX: 0.1 });
  assert.equal(g3.bullets.filter((b) => !b.friendly).length, 0, '无视线敌人不应开火');
}

// 子弹被墙挡下（对准上段墙体）
{
  const g = create(1);
  g.bullets.push({ x: 560, y: 100, vx: 480, vy: 0, friendly: true, life: 3 });
  tick(g, 0.5, { moveX: 1 });
  assert.equal(g.bullets.length, 0, '子弹应撞墙消失');
}

// ---------- 武器与拾取 ----------
{
  const g = create(2); // 空手关，场上有手枪
  assert.equal(g.player.weapon, null, '本关赤手空拳');
  tick(g, 0.3, { moveX: 1, moveY: -0.5 });
  // 直接把玩家挪到枪上验证拾取
  const pk = g.pickups[0];
  g.player.x = pk.x; g.player.y = pk.y;
  g.step(STEP, {});
  assert.equal(g.player.weapon.kind, 'pistol', '空手时自动拾取');
  assert.equal(g.pickups.length, 0);
  // 有武器时不拾取
  g.pickups.push({ kind: 'smg', x: g.player.x + 10, y: g.player.y, ammo: 16, t: 0 });
  g.step(STEP, {});
  assert.equal(g.player.weapon.kind, 'pistol', '有武器时不自动更换');
  g.pickups.pop();
  // 弹药打空：枪保留（可投掷缴械），无法开火
  g.player.weapon.ammo = 1;
  g.player.fireCooldown = 0;
  tick(g, 0.3, { fire: true, aimX: 1 });
  assert.equal(g.player.weapon.ammo, 0, '打空后枪应保留');
  const shotsAtEmpty = g.stats.shots;
  tick(g, 0.3, { fire: true, aimX: 1 });
  assert.equal(g.stats.shots, shotsAtEmpty, '空枪不应能开火');
  // 空枪状态下走到新枪上应自动换枪
  g.pickups.push({ kind: 'smg', x: g.player.x + 10, y: g.player.y, ammo: 16, t: 0 });
  g.step(STEP, {});
  assert.equal(g.player.weapon.kind, 'smg', '空枪时应自动换新枪');
}

// 半自动与自动武器的手感差异
{
  const g = create(0);
  g.player.weapon = { kind: 'pistol', ammo: 8 };
  let shots = 0;
  for (let i = 0; i < 30; i++) { g.step(1 / 60, { fire: true, aimX: 1 }); shots = g.stats.shots; }
  assert.equal(shots, 1, '手枪按住只应射出一发（半自动）');
  const g2 = create(0);
  g2.player.weapon = { kind: 'smg', ammo: 16 };
  for (let i = 0; i < 30; i++) g2.step(1 / 60, { fire: true, aimX: 1 });
  assert.ok(g2.stats.shots >= 4, '冲锋枪按住应连发');
}

// ---------- 投掷 ----------
{
  const g = create(5); // 投掷课：持手枪 3 发
  assert.equal(g.player.weapon.kind, 'pistol');
  const e = g.enemies[0];
  // 受控场景：敌人不动（react 冻结），玩家与其隔走廊直线可见
  e.x = 640; e.y = 380; e.react = 999;
  g.enemies[1].x = 1180; g.enemies[1].y = 660; g.enemies[1].react = 999;
  assert.ok(g.losClear(g.player.x, g.player.y, e.x, e.y), '测试布置应有直线视线');
  // 先移动让世界流动，再投掷
  const input = { moveX: 0.5, throw: false, aimX: 0, aimY: 0 };
  let hit = false;
  for (let i = 0; i < 900 && !hit; i++) {
    input.aimX = e.x - g.player.x; input.aimY = e.y - g.player.y;
    input.throw = i === 40 && g.player.weapon !== null;
    g.step(1 / 60, input);
    for (const ev of g.events) if (ev.type === 'disarm') hit = true;
    g.events.length = 0;
    if (g.state !== 'playing') break;
  }
  assert.ok(hit, '投掷武器应击中并眩晕敌人');
  assert.equal(g.player.weapon, null, '投出后应空手');
  assert.equal(g.stats.throws, 1);
  assert.ok(e.stun > 0, '被缴械的敌人应处于眩晕');
  assert.ok(g.pickups.some((p) => p.kind === 'pistol'), '敌人被缴械后掉落武器');
  // 捡回武器
  const pk = g.pickups.find((p) => p.kind === 'pistol');
  g.player.x = pk.x; g.player.y = pk.y;
  g.step(STEP, {});
  assert.ok(g.player.weapon, '掉落的枪可以捡回');
}

// 眩晕的冲锋者不伤人
{
  const g = create(3);
  const rusher = g.enemies[1];
  rusher.stun = 5;
  rusher.x = g.player.x + 30; rusher.y = g.player.y;
  tick(g, 0.5, {});
  assert.equal(g.state, 'playing', '被眩晕的冲锋者贴身也不应击杀玩家');
}

// 冲锋者贴身击杀
{
  const g = create(3);
  const rusher = g.enemies[1];
  rusher.react = 0;
  rusher.x = g.player.x + 34; rusher.y = g.player.y;
  tick(g, 0.3, { moveX: 0.2 });
  assert.equal(g.state, 'dead', '清醒的冲锋者贴身应击杀玩家');
}

// ---------- 暂停与确定性 ----------
{
  const g = create(0);
  g.paused = true;
  const before = snapshot(g);
  tick(g, 0.5, { moveX: 1 });
  assert.equal(snapshot(g), before, '暂停时不应有任何推进');
  g.paused = false;
  tick(g, 0.2, { moveX: 1 });
  assert.ok(g.simTime > 0, '取消暂停后恢复推进');
}

{
  const mkRng = (s) => () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  const a = new ChronoGame({ random: mkRng(424242) }); a.start(7);
  const b = new ChronoGame({ random: mkRng(424242) }); b.start(7);
  for (let i = 0; i < 120; i++) {
    const input = { moveX: Math.sin(i / 20), moveY: Math.cos(i / 17), fire: i % 7 < 2, aimX: 1, aimY: 0 };
    a.step(1 / 60, input);
    b.step(1 / 60, input);
  }
  assert.equal(snapshot(a), snapshot(b), '相同随机种子与输入必须产生完全一致的状态');
}

// ---------- Bot 全 10 关通关回归 ----------
// Bot 遵守真实玩家可用的规则：移动 / 瞄准 / 开火 / 拾取。
// 核心战术与真人一致：站定瞄准（世界冻结、子弹在枪口排队），
// 短促横移放行子弹，再站定。脉冲式推进。
function botInput(g, mem) {
  const p = g.player;
  const enemies = g.enemies.filter((e) => e.alive);
  if (enemies.length === 0) return { moveX: 0, moveY: 0 };
  mem.t = (mem.t || 0) + 1;

  let moveX = 0, moveY = 0, fire = false, aimX = 0, aimY = 0;
  let wantMove = false; // 本帧是否打算移动（移动才会让世界流动）
  let commit = false; // 冲向拾取物时无视闪避，避免原地抖动

  const pickTarget = () => {
    let best = null, bestScore = Infinity;
    for (const e of enemies) {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      let score = d;
      if (e.kind === 'rusher' && d < 420) score -= 600; // 冲锋者优先
      if (score < bestScore) { bestScore = score; best = e; }
    }
    return best;
  };

  // 带提前量瞄准：按子弹飞行时间修正目标位移
  const aimLead = (e, bulletSpeed = 460) => {
    const dx = e.x - p.x, dy = e.y - p.y;
    const d = Math.hypot(dx, dy) || 1;
    const t = d / bulletSpeed;
    aimX = e.x + (e.vx || 0) * t - p.x;
    aimY = e.y + (e.vy || 0) * t - p.y;
  };

  if (!p.weapon) {
    // 空手：先捡最近的枪（有弹药的优先，别捡自己扔出去的空枪）
    let best = null, bd = Infinity, bTrue = 0;
    for (const pk of g.pickups) {
      const td = Math.hypot(pk.x - p.x, pk.y - p.y);
      const d = td + (pk.ammo > 0 ? 0 : 400);
      if (d < bd) { bd = d; best = pk; bTrue = td; }
    }
    if (best) {
      wantMove = true;
      moveX = (best.x - p.x) / (bTrue || 1); moveY = (best.y - p.y) / (bTrue || 1);
      aimX = moveX; aimY = moveY;
      if (bTrue < 150) commit = true; // 近了就冲，别抖
    } else {
      // 没有枪可捡：朝最近敌人移动（带闪避），尽量靠近掉落物
      const target = pickTarget();
      aimX = target.x - p.x; aimY = target.y - p.y;
      const d = Math.hypot(aimX, aimY) || 1;
      wantMove = true;
      moveX = aimX / d; moveY = aimY / d;
    }
  } else if (p.weapon.ammo <= 0) {
    // 空枪：附近若有实弹枪先去捡，否则站定瞄准后扔出去缴械
    const loadedNear = g.pickups.find((pk) => pk.ammo > 0 && Math.hypot(pk.x - p.x, pk.y - p.y) < 90);
    const rushersAll = enemies.filter((e) => e.kind === 'rusher');
    const nearRusherAll = rushersAll.find((e) => Math.hypot(e.x - p.x, e.y - p.y) < 260);
    if (mem.flee > 0 && nearRusherAll) {
      // 投掷后的逃离窗口：拉开与冲锋者的距离，冲向最近的持枪者
      mem.flee--;
      const holdersAll = enemies.filter((e) => e.kind !== 'rusher');
      const holder = holdersAll.reduce((acc, e) => {
        const dd = Math.hypot(e.x - p.x, e.y - p.y);
        return !acc || dd < Math.hypot(acc.x - p.x, acc.y - p.y) ? e : acc;
      }, null);
      const ax = p.x - nearRusherAll.x, ay = p.y - nearRusherAll.y;
      const al = Math.hypot(ax, ay) || 1;
      let vx2 = ax / al, vy2 = ay / al;
      if (holder) {
        const bx = holder.x - p.x, by = holder.y - p.y;
        const bl = Math.hypot(bx, by) || 1;
        vx2 += (bx / bl) * 0.9; vy2 += (by / bl) * 0.9;
      }
      const vl = Math.hypot(vx2, vy2) || 1;
      wantMove = true;
      moveX = vx2 / vl; moveY = vy2 / vl;
      aimX = moveX; aimY = moveY;
    } else if (loadedNear) {
      wantMove = true;
      const dxl = loadedNear.x - p.x, dyl = loadedNear.y - p.y;
      const dll = Math.hypot(dxl, dyl) || 1;
      moveX = dxl / dll; moveY = dyl / dll;
      aimX = moveX; aimY = moveY;
      commit = true;
    } else {
      // 空枪要扔给有枪的敌人（缴械才有掉落）；对冲锋者只做保命眩晕
      const holders = enemies.filter((e) => e.kind !== 'rusher');
      const nearRusher = rushersAll.find((e) => Math.hypot(e.x - p.x, e.y - p.y) < 160);
      const target = nearRusher ||
        holders.reduce((acc, e) => {
          const dd = Math.hypot(e.x - p.x, e.y - p.y);
          return !acc || dd < Math.hypot(acc.x - p.x, acc.y - p.y) ? e : acc;
        }, null) || pickTarget();
      aimLead(target, 640);
      const d = Math.hypot(target.x - p.x, target.y - p.y) || 1;
      const canSee = g.losClear(p.x, p.y, target.x, target.y);
      const inRange = target === nearRusher ? d < 160 : (canSee && d < 300);
      if (inRange) {
        if (mem.toss !== 'release') {
          mem.toss = 'release'; mem.tossT = 0;
          return { moveX: 0, moveY: 0, aimX, aimY, fire: false, throw: true };
        }
        // 放行投掷物：对冲锋者直接后撤，对持枪者横移
        if (target === nearRusher) {
          moveX = (p.x - target.x) / d; moveY = (p.y - target.y) / d;
        } else {
          const nx = aimX / d, ny = aimY / d;
          moveX = -ny * (mem.relSign || 1); moveY = nx * (mem.relSign || 1);
        }
        wantMove = true;
        if (p.x < 90 && moveX < 0) moveX *= -1;
        if (p.x > WIDTH - 90 && moveX > 0) moveX *= -1;
        if (p.y < 90 && moveY < 0) moveY *= -1;
        if (p.y > HEIGHT - 90 && moveY > 0) moveY *= -1;
        mem.tossT++;
        if (mem.tossT > 14) { mem.toss = null; mem.flee = 100; } // 已脱手：趁机拉开距离去找真枪
      } else {
        wantMove = true;
        moveX = aimX / d; moveY = aimY / d;
      }
    }
  } else {
    const target = pickTarget();
    aimLead(target);
    const d = Math.hypot(target.x - p.x, target.y - p.y);
    const canSee = g.losClear(p.x, p.y, target.x, target.y);
    // 冲锋者压迫：直接后撤连射（迎头弹几乎必中），别让它贴脸
    const chaser = enemies.find((e) => e.kind === 'rusher' && Math.hypot(e.x - p.x, e.y - p.y) < 500);
    if (chaser) {
      const ax = p.x - chaser.x, ay = p.y - chaser.y;
      const ad = Math.hypot(ax, ay) || 1;
      moveX = ax / ad; moveY = ay / ad;
      // 退到边界就沿切线滑走
      if ((p.x < 110 && moveX < 0) || (p.x > WIDTH - 110 && moveX > 0)) {
        const s = ay > 0 ? 1 : -1;
        moveX = -moveY * s * -1; moveY = s;
        const l = Math.hypot(moveX, moveY) || 1; moveX /= l; moveY /= l;
      }
      if ((p.y < 110 && moveY < 0) || (p.y > HEIGHT - 110 && moveY > 0)) {
        const s = ax > 0 ? 1 : -1;
        moveY = -moveX * s * -1; moveX = s;
        const l = Math.hypot(moveX, moveY) || 1; moveX /= l; moveY /= l;
      }
      aimLead(chaser);
      fire = p.weapon.ammo > 0 && (p.weapon.kind === 'smg' ? true : (mem.click = !mem.click));
      wantMove = true;
    } else if (canSee && d < 560) {
      // 脉冲战术：站定瞄准 → 横移放行子弹
      mem.phase = mem.phase || 'aim';
      mem.phaseT = mem.phaseT || 0;
      if (mem.phase === 'aim') {
        mem.phaseT++;
        if (mem.phaseT > (p.weapon.kind === 'smg' ? 6 : 14)) {
          mem.phase = 'release'; mem.phaseT = 0;
          mem.relSign = (mem.relSign || 1) * -1;
        }
      } else {
        const nx = aimX / d, ny = aimY / d;
        moveX = -ny * mem.relSign; moveY = nx * mem.relSign;
        fire = p.weapon.ammo > 0 && (p.weapon.kind === 'smg' ? true : (mem.click = !mem.click));
        wantMove = true;
        if (p.x < 90 && moveX < 0) moveX *= -1;
        if (p.x > WIDTH - 90 && moveX > 0) moveX *= -1;
        if (p.y < 90 && moveY < 0) moveY *= -1;
        if (p.y > HEIGHT - 90 && moveY > 0) moveY *= -1;
        mem.phaseT++;
        if (mem.phaseT > 11) { mem.phase = 'aim'; mem.phaseT = 0; }
      }
    } else {
      wantMove = true;
      moveX = aimX / d; moveY = aimY / d;
    }
  }

  // 危险规避：逼近的敌方子弹横向闪避（只在打算移动且未提交拾取时有意义）
  if (wantMove && !commit) {
    let dodgeX = 0, dodgeY = 0, danger = 0;
    for (const b of g.bullets) {
      if (b.friendly) continue;
      const dx = p.x - b.x, dy = p.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d > 240) continue;
      const bs = Math.hypot(b.vx, b.vy);
      if (bs < 1) continue;
      const nx = b.vx / bs, ny = b.vy / bs;
      const closing = nx * (dx / (d || 1)) + ny * (dy / (d || 1));
      if (closing < 0.5) continue;
      const side = nx * -dy + ny * dx > 0 ? -1 : 1;
      dodgeX += -ny * side; dodgeY += nx * side;
      danger++;
    }
    if (danger > 0) {
      const l = Math.hypot(dodgeX, dodgeY) || 1;
      moveX = dodgeX / l; moveY = dodgeY / l;
    }
  }

  // 卡墙解困：一段时间没接近目标就换方向横移
  const tgt = !p.weapon
    ? (g.pickups[0] ? { x: g.pickups[0].x, y: g.pickups[0].y } : null)
    : pickTarget();
  if (tgt) {
    const dist = Math.hypot(tgt.x - p.x, tgt.y - p.y);
    if (mem.lastDist !== undefined && Math.abs(mem.lastDist - dist) < 0.5) {
      mem.stuck = (mem.stuck || 0) + 1 / 60;
      if (mem.stuck > 0.4) {
        const a = Math.atan2(tgt.y - p.y, tgt.x - p.x) + (Math.PI / 2) * (mem.unstick || (mem.unstick = 1));
        moveX = Math.cos(a); moveY = Math.sin(a);
        if (mem.stuck > 1.1) { mem.unstick *= -1; mem.stuck = 0; }
      }
    } else { mem.stuck = 0; }
    mem.lastDist = dist;
  }

  return { moveX, moveY, aimX, aimY, fire };
}

{
  let totalDeaths = 0;
  const mkRng = (s) => () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  for (let li = 0; li < LEVELS.length; li++) {
    const g = new ChronoGame({ random: mkRng(77000 + li * 13) });
    g.start(li);
    const mem = {};
    let frames = 0;
    const maxFrames = 60 * 180; // 每关最多模拟 3 分钟
    while (g.state === 'playing' && frames < maxFrames) {
      g.step(1 / 60, botInput(g, mem));
      frames++;
    }
    assert.equal(g.state, 'clear', `Bot 必须用真实规则通关第 ${li + 1} 关（${LEVELS[li].name}，模拟 ${frames} 帧）`);
    assert.equal(g.session.deaths, 0, `Bot 在第 ${li + 1} 关不应死亡——若死亡说明关卡或 Bot 有问题`);
    totalDeaths += g.session.deaths;
    if (li < LEVELS.length - 1) {
      assert.equal(g.nextLevel(), true);
      assert.equal(g.levelIndex, li + 1);
    }
  }
  assert.equal(totalDeaths, 0);
}

console.log(`chronostasis: all ${LEVELS.length} levels clear, engine rules verified.`);
