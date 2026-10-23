import assert from 'node:assert/strict';
import { BreakoutGame, LEVELS, W, H, R, WALL, STEP } from '../breakout-engine.mjs';
let seed = 81;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const create = () => new BreakoutGame({ random });

const layouts = new Set();
for (let level = 1; level <= LEVELS.length; level++) {
  const game = create(); game.level = level; game.makeBricks();
  assert.ok(game.bricks.length >= 20);
  assert.equal(new Set(game.bricks.filter(b => b.power).map(b => b.power)).size, 3);
  assert.ok(game.bricks.every(b => b.x >= WALL && b.x + b.w <= W - WALL && b.y + b.h < game.paddle.y - 100));
  layouts.add(JSON.stringify(game.bricks.map(b => [b.x, b.y, b.hp])));
}
assert.equal(layouts.size, 8, 'Each level has a distinct layout');

const armor = create(); armor.level = 2; armor.makeBricks();
const tough = armor.bricks.find(b => b.type === 'armor');
armor.damageBrick(tough); assert.equal(tough.hp, 1);
armor.damageBrick(tough); assert.equal(tough.hp, 0);
const score = armor.score; armor.damageBrick(tough); assert.equal(armor.score, score);
const bomb = armor.bricks.find(b => b.type === 'bomb');
const neighbors = armor.bricks.filter(b => b !== bomb && b.hp > 0 &&
  ((Math.abs(b.x - bomb.x) < bomb.w + 10 && Math.abs(b.y - bomb.y) < 3) ||
   (Math.abs(b.y - bomb.y) < bomb.h + 10 && Math.abs(b.x - bomb.x) < 3)));
armor.damageBrick(bomb);
assert.ok(neighbors.length > 0 && neighbors.every(b => b.hp === 0), 'Explosions damage adjacent bricks');

const powers = create(); powers.start(); powers.activatePower('multi'); powers.activatePower('multi');
assert.equal(powers.balls.length, 3);
assert.ok(powers.balls.every(b => Math.abs(b.vx) > 0 && Math.abs(b.vy) > 0));
powers.activatePower('wide'); assert.equal(powers.paddle.w, 180);
powers.mode = 'paused';
const paused = JSON.stringify(powers); powers.step(2); assert.equal(JSON.stringify(powers), paused);
powers.mode = 'playing'; powers.wideTime = STEP / 2; powers.step(STEP);
assert.equal(powers.paddle.w, 128);

const paddle = create(); paddle.start();
paddle.balls = [{ x: paddle.paddle.x, y: paddle.paddle.y - R - 1, vx: 40, vy: 500, trail: [] }];
paddle.step(STEP); assert.ok(paddle.balls[0].vy < 0, 'A fast crossing cannot tunnel through the paddle');
const brick = paddle.bricks.at(-1);
paddle.balls = [{ x: brick.x + brick.w / 2, y: brick.y + brick.h + R + 1, vx: 0, vy: -500, trail: [] }];
paddle.step(STEP); assert.equal(brick.hp, 0); assert.ok(paddle.balls[0].vy > 0);

const shield = create(); shield.start(); shield.activatePower('shield');
shield.balls = [{ x: 100, y: H - 15 - R - .5, vx: 30, vy: 300, trail: [] }];
shield.step(STEP); assert.equal(shield.shield, 0); assert.ok(shield.balls[0].vy < 0); assert.equal(shield.lives, 3);
shield.drops = [{ x: shield.paddle.x, y: shield.paddle.y - 11, kind: 'wide' }];
shield.step(STEP); assert.equal(shield.drops.length, 0); assert.equal(shield.paddle.w, 180);

const misses = create(); misses.start(); misses.activatePower('multi');
for (const ball of misses.balls) { ball.y = H + R + 1; ball.vy = 300; }
misses.step(STEP); assert.equal(misses.lives, 2); assert.equal(misses.mode, 'life');
misses.step(STEP); assert.equal(misses.lives, 2, 'One lost volley costs exactly one life');
misses.start(); assert.equal(misses.mode, 'playing');
misses.lives = 1; for (const ball of misses.balls) { ball.y = H + R + 1; ball.vy = 300; }
misses.step(STEP); assert.equal(misses.mode, 'lost');
misses.start(); assert.equal(misses.lives, 3); assert.equal(misses.level, 1);

const complete = create(); complete.start();
for (const brick of complete.bricks) brick.hp = 0;
complete.step(STEP); assert.equal(complete.mode, 'level'); assert.equal(complete.lives, 4);
complete.start(); assert.equal(complete.level, 2); assert.ok(complete.remaining > 0);
complete.level = 8; for (const brick of complete.bricks) brick.hp = 0;
complete.step(STEP); assert.equal(complete.mode, 'won');

// Exercise the actual physics across all layouts, using a simple predictive paddle.
const results = [];
for (let level = 1; level <= LEVELS.length; level++) {
  const game = create(); game.level = level; game.makeBricks(); game.serve(); game.mode = 'playing'; game.lives = 50;
  let steps = 0, lost = 0;
  while (game.mode !== 'level' && game.mode !== 'won' && steps < 240 * 600) {
    if (game.mode === 'life') { lost++; game.start(); }
    const candidates = game.balls.filter(b => b.vy > 0 && b.y < game.paddle.y - R)
      .sort((a, b) => (game.paddle.y - R - a.y) / a.vy - (game.paddle.y - R - b.y) / b.vy);
    const ball = candidates[0] || game.balls[0];
    let target = ball.x;
    if (ball.vy > 0) {
      const left = WALL + R, span = W - 2 * left;
      let unfolded = (ball.x + ball.vx * (game.paddle.y - R - ball.y) / ball.vy - left) % (span * 2);
      if (unfolded < 0) unfolded += span * 2;
      target = left + (unfolded > span ? span * 2 - unfolded : unfolded);
    }
    if (game.remaining <= 4 && ball.vy > 0) {
      const brick = game.bricks.filter(b => b.hp > 0).sort((a,b) => Math.abs(a.x + a.w/2 - target) - Math.abs(b.x + b.w/2 - target))[0];
      const angle = Math.max(-1, Math.min(1, Math.atan2(brick.x + brick.w / 2 - target, game.paddle.y - R - brick.y - brick.h / 2)));
      game.paddle.target = target - angle / 1.08 * game.paddle.w / 2;
    } else game.paddle.target = target + Math.sin(game.time * .8) * 25;
    game.step(STEP); steps++;
    assert.ok(game.balls.every(b => [b.x, b.y, b.vx, b.vy].every(Number.isFinite)));
    assert.ok(game.lives > 0, 'The predictive paddle should be able to complete the level');
  }
  assert.ok(['level', 'won'].includes(game.mode), `Level ${level} did not clear: ${JSON.stringify({ mode: game.mode, remaining: game.remaining, balls: game.balls.map(b => ({x:b.x,y:b.y,vx:b.vx,vy:b.vy})), bricks: game.bricks.filter(b=>b.hp>0).map(b=>({x:b.x,y:b.y,hp:b.hp})) })}`);
  results.push(`${level}: ${Math.round(steps / 240)}s/${lost} misses`);
}
console.log('Breakout passed: armor, explosions, power-ups, frozen pause, collisions, lives, all 8 levels.');
console.log(results.join(' | '));
