import assert from 'node:assert/strict';
import { NeonGame, STEP, WIDTH, HEIGHT, laserFrame, laserHitsCircle } from '../neon-engine.mjs';

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
  g.time = 20; g.step(STEP); assert.equal(g.wave, 2);
  g.time = 40; g.step(STEP); assert.equal(g.wave, 3);
  g.time = 60; g.step(STEP);
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

// Play both modes from the default 100 HP using only ordinary input. The pilot
// aims at the nearest target and steers away from nearby enemies, bullets and beams.
function pilot(g) {
  const p = g.player;
  const target = g.enemies.toSorted((a, b) => Math.hypot(a.x-p.x, a.y-p.y) - Math.hypot(b.x-p.x, b.y-p.y))[0];
  let mx = Math.cos(g.time*.7) + (WIDTH/2-p.x)/500;
  let my = Math.sin(g.time*.9) + (HEIGHT/2-p.y)/500, threat = false;
  for (const e of [...g.enemies, ...g.enemyBullets]) {
    const bullet = e.friendly === false;
    const dx = p.x-e.x-(bullet ? e.vx*.18 : 0), dy = p.y-e.y-(bullet ? e.vy*.18 : 0), d = Math.hypot(dx,dy);
    const safe = bullet ? 85 : e.r+95;
    if (d < safe && d > 0) {
      const force = (safe-d)/safe*(bullet ? 3 : 4);
      mx += dx/d*force; my += dy/d*force;
      if (d < e.r+p.r+30) threat = true;
    }
  }
  for (const h of g.hazards) if (laserHitsCircle(h, {...p, r:p.r+65})) {
    const nx = -Math.sin(h.angle), ny = Math.cos(h.angle);
    const side = (p.x-h.x)*nx+(p.y-h.y)*ny < 0 ? -1 : 1;
    mx += nx*side*5; my += ny*side*5; threat = true;
  }
  if (p.x < 100) mx += 2; if (p.x > WIDTH-100) mx -= 2;
  if (p.y < 100) my += 2; if (p.y > HEIGHT-100) my -= 2;
  return {moveX:mx, moveY:my, aimX:target ? target.x-p.x : 1, aimY:target ? target.y-p.y : 0,
    fire:true, dash:threat, pulse:p.energy >= 100};
}
for (const mode of ['standard', 'boss']) for (const initialSeed of [1, 2, 3]) {
  let state = initialSeed, hits = 0;
  const phases = new Set();
  const g = new NeonGame({mode,
    random:() => ((state = (Math.imul(state,1664525)+1013904223) >>> 0) / 2**32),
    emit:event => {
      if (event.type === 'playerHit') hits++;
      if (event.type === 'bossSpawn') phases.add(1);
      if (event.type === 'bossPhase') phases.add(event.phase);
    }});
  g.start();
  for (let frame=0; g.state==='playing' && frame<180/STEP; frame++) {
    g.step(STEP, pilot(g));
    assert.equal(g.player.maxHp,100);
    assert.ok(g.player.hp>=0 && g.player.hp<=100);
    assert.ok(Number.isFinite(g.player.x) && Number.isFinite(g.player.y));
    assert.ok(g.enemies.length<=75);
  }
  assert.equal(g.state,'victory',`${mode}, seed ${initialSeed}: normal-health run must finish`);
  assert.deepEqual([...phases],[1,2,3]);
  assert.ok(hits>0,'exercise real damage, not invincibility');
  assert.ok(g.player.hp>0);
  assert.ok(g.time >= (mode==='standard' ? 60 : 2));
  console.log(`100 HP run: ${mode}, seed ${initialSeed}, ${g.time.toFixed(1)}s, ${g.player.hp} HP left, ${hits} hits`);
}

// Verify the exact instance data sent to the renderer: the visible full-width
// beam must share its endpoints, angle and boundaries with the collision box.
const {NeonRenderer} = await import('../neon-renderer.mjs');
const renderer = Object.assign(Object.create(NeonRenderer.prototype), {
  time:0, lastTrail:0, nextTrailEmission:Infinity, trail:[], shockwaves:[], pointer:{active:false},
  shapes:new Float32Array(16384*12), shapeCount:0
});
for (const angle of [0, Math.PI/4, Math.PI/2, Math.PI*3/4, Math.PI, -Math.PI/4, -Math.PI/2, -Math.PI*3/4]) {
  const h={x:500,y:400,angle,length:500,width:28,telegraph:0,active:1};
  const beam=laserFrame(h), c=Math.cos(angle), s=Math.sin(angle);
  const point=(along,across,r=15)=>({x:h.x+c*along-s*across,y:h.y+s*along+c*across,r});
  const g=isolated();g.hazards=[h];g.state='paused';g.player.angle=angle;
  const snapshot=JSON.stringify(g);renderer.buildScene(g);assert.equal(JSON.stringify(g),snapshot);
  const data=renderer.shapes;
  assert.equal(data[5],7,'lasers use the full-size box rather than the inset decorative shape');
  for(const sign of [-1,1]){
    const along=(sign+1)*h.length/2, expected=point(along,0);
    assert.ok(Math.abs(data[0]+sign*data[2]*data[4]-expected.x)<.001);
    assert.ok(Math.abs(data[1]+sign*data[2]*data[7]-expected.y)<.001);
  }
  assert.equal(data[3],beam.halfWidth);
  assert.ok(laserHitsCircle(h,point(120,0)));
  assert.ok(laserHitsCircle(h,point(120,42.9)),'edge contact counts');
  assert.equal(laserHitsCircle(h,point(120,43.1)),false,'clear space beside a beam is safe');
  assert.equal(laserHitsCircle(h,point(-16,0)),false,'clear space behind the emitter is safe');
  assert.equal(laserHitsCircle(h,point(516,0)),false,'clear space past the endpoint is safe');
  assert.ok(laserHitsCircle(h,point(-10,0)),'circle touching a beam end counts');
  // The forward tip of the ship (+Y in its local triangle) points along its aim.
  assert.ok(Math.abs(-data[19]-c)<1e-6);
  assert.ok(Math.abs(data[16]-s)<1e-6);
}
{
  const g=isolated();g.player.x=600;g.player.y=450;
  g.hazards=[{x:400,y:250,angle:Math.PI/4,length:1900,width:28,telegraph:0,active:1}];
  g.step(STEP);assert.equal(g.player.hp,76,'the original diagonal laser reproduction');
}
console.log('Neon passed: normal-health runs, eight laser directions, shared render/collision bounds, ship headings and existing combat regressions.');
