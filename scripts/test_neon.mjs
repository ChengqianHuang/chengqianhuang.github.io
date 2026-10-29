import assert from 'node:assert/strict';
import { NeonGame, STEP, WIDTH, HEIGHT } from '../neon-engine.mjs';

let seed = 918273;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const create = (mode = 'standard') => new NeonGame({ random, mode });
const isolated = () => {
  const game = create(); game.start(); game.nextSpawn = Infinity; game.bossSpawned = true;
  return game;
};
const tick = (game, seconds, input = {}) => {
  const count = Math.ceil(seconds / STEP);
  for (let i = 0; i < count && game.state === 'playing'; i++) game.step(STEP, input);
};

// Movement, aiming and dash invulnerability.
{
  const g = isolated(), startX = g.player.x;
  tick(g, 0.45, { moveX: 1 });
  assert.ok(g.player.x > startX + 80, 'Player must accelerate and move');
  g.step(STEP, { moveX: 1, dash: true });
  assert.ok(g.player.dashTime > 0, 'Dash starts');
  assert.ok(g.player.dashCooldown > 1, 'Dash has a cooldown');
  assert.equal(g.damagePlayer(20), false, 'Dash grants invulnerability');
  tick(g, 0.35);
  assert.equal(g.damagePlayer(20), true);
  assert.equal(g.player.hp, 80);
  const x = g.player.x, y = g.player.y;
  assert.ok(Number.isFinite(x) && Number.isFinite(y));
}

// Player bullets collide, award score, and fire upgrades follow chain multiplier.
{
  const g = isolated();
  g.spawnEnemy('chaser', g.player.x + 120, g.player.y, { vx: 0, vy: 0 });
  tick(g, 0.5, { aimX: 1, fire: true });
  assert.equal(g.kills, 1, 'Two hits destroy a chaser');
  assert.ok(g.score >= 100);
  for (let i = 0; i < 14; i++) { g.spawnEnemy('chaser', 50 + i * 30, 50); g.killEnemy(g.enemies.length - 1); }
  assert.equal(g.multiplier, 4);
  g.bullets.length = 0; g.player.fireCooldown = 0;
  g.step(STEP, { aimX: 1, fire: true });
  assert.equal(g.bullets.length, 2, 'Chain level unlocks twin shot');
}

// Splitter shards and the full-arena pulse.
{
  const g = isolated();
  g.spawnEnemy('splitter', 400, 300);
  g.killEnemy(0);
  assert.equal(g.enemies.filter(e => e.kind === 'shard').length, 3);
  g.player.energy = 100;
  g.enemyBullets.push({ x: 0, y: 0 });
  const kills = g.kills;
  assert.equal(g.pulse(), true);
  assert.equal(g.player.energy, 0);
  assert.equal(g.enemyBullets.length, 0);
  assert.equal(g.enemies.length, 0, 'Pulse destroys low-health enemies');
  assert.ok(g.kills >= kills + 3);
  assert.equal(g.pulse(), false, 'Pulse cannot be reused without energy');
}

// Pause, hazard telegraph timing and player termination.
{
  const g = isolated();
  g.state = 'paused'; const time = g.time;
  tick(g, 1); assert.equal(g.time, time, 'Paused simulation cannot advance');
  g.state = 'playing';
  const p = g.player;
  g.hazards.push({ x: p.x - 100, y: p.y, angle: 0, length: 500, width: 20, telegraph: 0.2, active: 0.5 });
  g.step(STEP);
  assert.equal(p.hp, 100, 'Telegraphed laser is not yet dangerous');
  tick(g, 0.25);
  assert.ok(p.hp < 100, 'Active laser damages the player');
  p.hp = 5; p.invulnerable = 0; p.dashTime = 0;
  assert.equal(g.damagePlayer(10), true);
  assert.equal(g.state, 'gameover');
  assert.equal(g.result.score, g.score);
}

// Director waves, all three boss phases, laser creation and victory.
{
  const g = create(); g.start(); g.nextSpawn = Infinity;
  g.time = 25; g.step(STEP); assert.equal(g.wave, 2);
  g.time = 50; g.step(STEP); assert.equal(g.wave, 3);
  g.time = 75; g.step(STEP);
  const boss = g.enemies.find(e => e.kind === 'boss');
  assert.ok(boss, 'Boss arrives after the third sector');
  g.player.invulnerable = 999;
  boss.hp = boss.maxHp * 0.6; g.step(STEP); assert.equal(boss.phase, 2);
  boss.hp = boss.maxHp * 0.3; g.step(STEP); assert.equal(boss.phase, 3);
  boss.laser = 0; g.step(STEP);
  assert.ok(g.hazards.length > 0, 'Phase three creates telegraphed lasers');
  g.killEnemy(g.enemies.indexOf(boss));
  assert.equal(g.state, 'victory');
  assert.ok(g.score >= 12000);
}

// Gravity pulls toward the source on both sides.
{
  for (const side of [-1, 1]) {
    const g = isolated(), p = g.player;
    g.spawnEnemy('gravity', p.x + side * 220, p.y, { vx: 0, vy: 0, cooldown: 999 });
    tick(g, 0.12);
    assert.ok(Math.sign(p.vx) === side, 'Gravity must pull toward the enemy');
  }
}

// A same-step player death cannot be overwritten by a boss kill.
{
  const g = isolated(), p = g.player;
  p.hp = 1; p.invulnerable = 0; p.dashTime = 0;
  const boss = g.spawnEnemy('boss', p.x, p.y, { vx: 0, vy: 0, hp: 1 });
  g.bullets.push({ x: p.x, y: p.y, px: p.x, py: p.y, vx: 0, vy: 0, r: 5, damage: 20, color: '#fff', life: 1, friendly: true });
  const score = g.score;
  g.step(STEP);
  assert.equal(g.state, 'gameover');
  assert.equal(g.player.hp, 0);
  assert.equal(boss.hp, 1, 'Terminal death stops later combat phases');
  assert.equal(g.score, score);
  g.killEnemy(g.enemies.indexOf(boss));
  assert.equal(g.state, 'gameover', 'Terminal state is final');
}

// Boss rush is immediately accessible and never spawns an early wave.
{
  const g = create('boss'); g.start();
  tick(g, 1.9);
  assert.equal(g.enemies.length, 0, 'Boss rush skips regular enemies');
  tick(g, 0.25);
  assert.ok(g.enemies.some(e => e.kind === 'boss'));
}

// Long boss fights cannot grow summoned enemies without bound.
{
  const g = create('boss'); g.start();
  tick(g, 2.1);
  const boss = g.enemies.find(e => e.kind === 'boss');
  boss.hp = boss.maxHp * 0.3;
  g.player.invulnerable = 999;
  tick(g, 65);
  assert.equal(boss.phase, 3);
  assert.ok(g.enemies.length <= 60, `Summon cap exceeded: ${g.enemies.length}`);
}

// A seeded full run exercises spawning, collisions, upgrades, boss AI and cleanup.
{
  const g = create(); g.start();
  g.player.maxHp = g.player.hp = 1e9;
  let frames = 0;
  while (g.state === 'playing' && frames < 135 / STEP) {
    const p = g.player;
    let target = null, best = Infinity;
    for (const e of g.enemies) {
      const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
      if (d < best) { best = d; target = e; }
    }
    const aimX = target ? target.x - p.x : 1, aimY = target ? target.y - p.y : 0;
    const moveX = Math.cos(g.time * 0.7) + (WIDTH / 2 - p.x) / 500;
    const moveY = Math.sin(g.time * 0.9) + (HEIGHT / 2 - p.y) / 500;
    g.step(STEP, { moveX, moveY, aimX, aimY, fire: true, dash: frames % 240 === 0, pulse: p.energy >= 100 });
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'Simulation must stay finite');
    assert.ok(g.enemies.length <= 75, 'Director cannot grow enemies without bound');
    frames++;
  }
  assert.equal(g.state, 'victory', 'Autonomous full run must reach and defeat the boss');
  assert.ok(g.kills > 40);
  assert.ok(g.time >= 75 && g.time < 135);
  console.log(`Full run: ${g.time.toFixed(1)}s, ${g.kills} kills, ${g.score} score`);
}

console.log('Neon passed: movement, dash, collision, chain weapons, splitter, pulse, pause, lasers, boss phases, boss rush, full-run simulation.');
