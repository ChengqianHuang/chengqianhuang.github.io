import assert from 'node:assert/strict';
import { AssaultGame, STEP, FLOOR, GAPS, segmentHit } from '../assault-engine.mjs';
let seed = 97;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const create = () => new AssaultGame({ random });
assert.equal(segmentHit(0, 10, 100, 10, { x: 40, y: 0, w: 10, h: 20 }), .4);
assert.equal(segmentHit(0, 30, 100, 30, { x: 40, y: 0, w: 10, h: 20 }), null);

const jump = create(); jump.start();
jump.step(STEP, { jumpPressed: true, jump: true });
assert.ok(jump.player.vy < 0);
for (let i = 0; i < 120; i++) jump.step(STEP, { jump: true });
assert.equal(jump.player.grounded, true); assert.equal(jump.player.y + jump.player.h, FLOOR);
const still = JSON.stringify(jump); jump.mode = 'paused';
const paused = JSON.stringify(jump); jump.step(1, { fire: true, move: 1 });
assert.equal(JSON.stringify(jump), paused); assert.notEqual(still, paused);

const damage = create(); damage.start(); damage.damagePlayer(); damage.damagePlayer();
assert.equal(damage.player.hp, 4, 'Invulnerability prevents repeated damage from one burst');
damage.checkpoint = 2200; damage.player.hp = 1; damage.player.invincible = 0; damage.damagePlayer();
assert.equal(damage.mode, 'life'); assert.equal(damage.lives, 2);
damage.start(); assert.equal(damage.player.x, 2200); assert.equal(damage.player.hp, 5);
damage.lives = 1; damage.loseLife(); assert.equal(damage.mode, 'lost'); damage.start(); assert.equal(damage.lives, 3);

const weapons = create(); weapons.start(); weapons.collectSupply({ x:0, y:0, kind:'spread' }); weapons.fire(false);
assert.equal(weapons.bullets.length, 3); assert.equal(weapons.player.grenades, 4);
weapons.player.weaponTime = STEP / 2; weapons.step(STEP); assert.equal(weapons.player.weapon, 'rifle');
weapons.player.grenades = 1; weapons.throwGrenade(); weapons.throwGrenade();
assert.equal(weapons.grenades.length, 1); assert.equal(weapons.player.grenades, 0);

const combat = create(); combat.start();
const enemy = combat.enemies[0]; combat.hitEnemy(enemy, 100);
const earned = combat.score; combat.hitEnemy(enemy, 100); assert.equal(combat.score, earned);
combat.checkpoint = 90; combat.respawn(); combat.hitEnemy(enemy, 100);
assert.equal(combat.score, earned, 'Respawning cannot farm the same enemy for points');
const crate = combat.crates[0]; combat.openCrate(crate); combat.openCrate(crate); assert.equal(combat.supplies.length, 1);
combat.boss.active = true; const hp = combat.boss.hp;
combat.explode({ x:combat.boss.x+30,y:combat.boss.y+50 }); assert.equal(combat.boss.hp, hp - 18);
combat.hitEnemy(combat.boss, 1000); assert.equal(combat.mode, 'won'); assert.ok(combat.score > 3000);

// Play the entire level through the actual physics and enemy logic.
const run = create(); run.start();
let holdJump = 0, respawns = 0;
for (let frame = 0; frame < 120 * 180 && !['won','lost'].includes(run.mode); frame++) {
  if (run.mode === 'life') { respawns++; run.start(); holdJump = 0; }
  const p = run.player;
  const pit = GAPS.some(([start,end]) => p.x + p.w > start - 60 && p.x < end);
  const wave = run.bullets.some(b => b.wave && b.x > p.x && b.x - p.x < 130);
  const jumpPressed = p.grounded && (pit || wave);
  if (jumpPressed) holdJump = .6;
  holdJump = Math.max(0, holdJump - STEP);
  run.step(STEP, { move: p.x < 4520 ? 1 : 0, fire: true, jump: holdJump > 0, jumpPressed,
    grenadePressed: run.boss.active && p.grenades > 0 && p.throwTime === 0 });
  assert.ok([p.x,p.y,p.vx,p.vy,run.camera].every(Number.isFinite));
  assert.ok(run.player.grenades >= 0);
}
assert.equal(run.mode, 'won', `Full run failed: ${JSON.stringify({mode:run.mode,x:run.player.x,hp:run.player.hp,lives:run.lives,time:run.time,boss:run.boss.hp,respawns})}`);
console.log(`Assault passed: swept shots, jump/landing, pause, damage immunity, checkpoints, weapons, grenades, boss; full mission ${run.time.toFixed(1)}s, ${respawns} respawns, rank ${run.grade}.`);
