import assert from 'node:assert/strict';
import { BreakoutGame, LEVELS, W, H, R, WALL, STEP, POWERS, brickPolygon, shapeContact, coreRadius } from '../breakout-engine.mjs';
let seed = 81;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const create = () => new BreakoutGame({ random });

const layouts = new Set();
for (let level = 1; level <= LEVELS.length; level++) {
  const game = create(); game.level = level; game.makeBricks();
  assert.ok(game.remaining >= (level === 8 ? 3 : 20));
  assert.equal(new Set(game.bricks.filter(b => b.power).map(b => b.power)).size, level === 8 ? 2 : 3);
  assert.ok(game.bricks.every(b => b.x >= WALL && b.x + b.w <= W - WALL && b.y + b.h < game.paddle.y - 100));
  layouts.add(JSON.stringify(game.bricks.map(b => [b.x, b.y, b.hp])));
}
assert.equal(layouts.size, 8, 'Each level has a distinct layout');

const armor = create(); armor.level = 2; armor.makeBricks();
const tough = armor.bricks.find(b => b.type === 'armor');
armor.damageBrick(tough); assert.equal(tough.hp, 1);
armor.damageBrick(tough); assert.equal(tough.hp, 0);
const score = armor.score; armor.damageBrick(tough); assert.equal(armor.score, score);
const mine=create();mine.reset(6);
const bomb=mine.bricks.find(b=>b.type==='bomb');
const neighbors=mine.bricks.filter(b=>b!==bomb&&Math.hypot(b.x-bomb.x,b.y-bomb.y)<88);
const hpBefore=neighbors.map(b=>b.hp);mine.damageBrick(bomb);
assert.ok(neighbors.length>0&&neighbors.every((b,i)=>b.hp<hpBefore[i]),'Explosions damage a cluster of neighboring ore');
assert.ok(mine.bricks.filter(b=>b.type==='bomb'&&b.hp===0).length>1,'A mine blast chains through a vein');

// Silhouettes are physical: clipped corners are empty, exposed facets reflect balls.
{
  const g=create();g.reset(6);
  const crystal=g.bricks.find(b=>b.shape==='crystal'),barrel=g.bricks.find(b=>b.shape==='barrel');
  assert.equal(shapeContact({x:crystal.x-1,y:crystal.y-1},crystal),null,'no rectangular ghost corner');
  const tip=brickPolygon(crystal)[0];
  assert.ok(shapeContact({x:tip.x,y:tip.y-2},crystal),'intact tip can be hit');
  g.damageBrick(crystal,2);
  assert.equal(shapeContact({x:tip.x,y:tip.y-2},crystal),null,'broken tip is no longer solid');
  assert.ok(shapeContact({x:crystal.x+crystal.w/2,y:crystal.y+crystal.h*.6},crystal));
  for(const b of g.bricks){
    for(let hp=1;hp<=b.maxHp;hp++){
      const points=brickPolygon({...b,hp});
      for(let i=0;i<points.length;i++){
        const a=points[i],z=points[(i+1)%points.length],n=points[(i+2)%points.length];
        assert.ok((z.x-a.x)*(n.y-z.y)-(z.y-a.y)*(n.x-z.x)>=-1e-6,'convex clockwise collision contour');
      }
    }
  }
  const distant=g.bricks.filter(b=>b.vein!==barrel.vein).map(b=>[b,b.hp]);
  g.damageBrick(barrel);assert.ok(distant.every(([b,hp])=>b.hp===hp),'a chain stays in its own separated vein');
  const bounce=create();bounce.reset(6);bounce.mode='playing';
  const target=bounce.bricks.find(b=>b.shape==='crystal');bounce.bricks=[target];
  const bottom=brickPolygon(target)[3];
  bounce.balls=[{x:bottom.x,y:bottom.y+R+.5,vx:0,vy:-500,trail:[]}];bounce.step(STEP);
  assert.equal(target.hp,2);assert.ok(bounce.balls[0].vy>0,'fast ball bounces off real crystal facet');
}
{
  const g=create();g.reset(8);const core=g.bricks[0];
  assert.equal(shapeContact({x:core.x,y:core.y},core),null,'core corners are empty');
  const x=core.x+core.w/2,y=core.y+core.h/2,edge={x:x+coreRadius(core)+R-1,y};
  assert.ok(shapeContact(edge,core));
  for(const b of g.bricks.filter(b=>b.generator))g.damageBrick(b,2);
  g.damageBrick(core,3);
  assert.equal(coreRadius(core),45);assert.equal(shapeContact(edge,core),null,'removed armor reduces physical radius');
  assert.ok(shapeContact({x,y},core),'contact at exact center has a finite fallback normal');
}

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

// Mechanisms must change real collision/health rules, not only presentation.
{
  const g=create();g.reset(2);const steel=g.bricks.find(b=>b.type==='steel');
  const remaining=g.remaining;g.damageBrick(steel,99);assert.equal(steel.hp,1);assert.equal(g.score,0);assert.equal(g.remaining,remaining);
  g.mode='playing';g.balls=[{x:steel.x+steel.w/2,y:steel.y+steel.h+R+.5,vx:0,vy:-500,trail:[]}];g.step(STEP);assert.ok(g.balls[0].vy>0,'steel actually reflects the ball');
  for(const b of g.bricks)if(b.target!==false)b.hp=0;g.step(STEP);assert.equal(g.mode,'level','steel is not a clear objective');
}
{
  const g=create();g.reset(4);const target=g.bricks.find(b=>b.protected);g.damageBrick(target,99);assert.equal(target.hp,2);assert.equal(g.score,0);
  const switches=g.bricks.filter(b=>b.type==='switch');g.damageBrick(switches[0],2);g.damageBrick(target,2);assert.equal(target.hp,2,'one live switch keeps the shield');
  g.damageBrick(switches[1],2);assert.equal(g.isProtected(target),false);g.damageBrick(target,2);assert.equal(target.hp,0);
}
{
  const g=create();g.reset(5);const gate=g.bricks.find(b=>b.type==='gate');
  g.mode='playing';g.stageTime=1;g.updateMechanisms(0);assert.equal(gate.open,true);
  g.balls=[{x:gate.x+gate.w/2,y:gate.y+gate.h+R+.5,vx:0,vy:-500,trail:[]}];g.step(STEP);assert.ok(g.balls[0].vy<0,'open shutters allow passage');
  g.stageTime=4;g.balls=[];g.updateMechanisms(0);assert.equal(gate.open,false);
  g.balls=[{x:gate.x+gate.w/2,y:gate.y+gate.h+R+.5,vx:0,vy:-500,trail:[]}];g.step(STEP);assert.ok(g.balls[0].vy>0,'closed shutters reflect balls');
  g.stageTime=4;g.balls=[{x:gate.x+gate.w/2,y:gate.y+8,vx:0,vy:100,trail:[]}];g.updateMechanisms(0);assert.equal(gate.open,true,'closing gate waits for a ball inside');
  g.balls[0].y=300;g.updateMechanisms(0);assert.equal(gate.open,false);
}
{
  const g=create();g.reset(3);const original=g.bricks[0].x;
  for(let i=0;i<200;i++){g.updateMechanisms(.13);assert.ok(g.bricks.every(b=>b.x>=WALL&&b.x+b.w<=W-WALL));}
  assert.notEqual(g.bricks[0].x,original);g.mode='paused';const paused=JSON.stringify(g);g.step(1);assert.equal(JSON.stringify(g),paused);
  g.reset(7);g.updateMechanisms(17.9);assert.equal(g.bricks[0].y,g.bricks[0].baseY);g.updateMechanisms(.2);assert.equal(g.bricks[0].y,g.bricks[0].baseY+18);
  g.updateMechanisms(200);assert.equal(g.bricks[0].y,g.bricks[0].baseY+108);assert.ok(g.bricks.every(b=>b.y+b.h<g.paddle.y-100));
  const time=g.stageTime;g.serve();assert.equal(g.stageTime,time,'losing a life cannot reset the pressure timer');
}
{
  const g=create();g.reset(8);const core=g.bricks.find(b=>b.type==='core');
  for(let phase=1;phase<=3;phase++){
    const hp=core.hp;g.damageBrick(core,99);assert.equal(core.hp,hp,'generators shield the core');
    for(const b of g.bricks.filter(b=>b.type==='switch'&&b.hp>0))g.damageBrick(b,2);
    g.damageBrick(core,99);assert.equal(core.hp,9-phase*3,'a hit cannot skip multiple armor phases');
    if(phase<3){assert.equal(g.bossPhase,phase+1);assert.equal(g.switchesLeft,2);}
  }
  g.mode='playing';g.step(STEP);assert.equal(g.mode,'won');
  g.start();assert.equal(g.level,8);assert.equal(g.startLevel,8);assert.equal(g.score,0);assert.equal(g.bossPhase,1);assert.equal(g.switchesLeft,2);
}
{
  const g=create();g.reset(3);g.start();assert.equal(g.level,3);g.stageTime=20;
  for(const b of g.bricks)b.hp=0;g.step(STEP);g.start();assert.equal(g.level,4);assert.equal(g.stageTime,0);assert.equal(g.switchesLeft,2);
  const snap=JSON.stringify(g);g.step(-1);g.step(NaN);assert.equal(JSON.stringify(g),snap);
  const fine=create(),coarse=create();fine.reset(5);coarse.reset(5);coarse.balls=structuredClone(fine.balls);fine.mode=coarse.mode='playing';
  for(let i=0;i<240;i++)fine.step(STEP);for(let i=0;i<30;i++)coarse.step(1/30);
  assert.ok(Math.abs(fine.balls[0].x-coarse.balls[0].x)<1e-6);assert.ok(Math.abs(fine.balls[0].y-coarse.balls[0].y)<1e-6);
}

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
    if ((game.remaining <= 4 || game.switchesLeft>0) && ball.vy > 0) {
      const brick = game.bricks.filter(b => b.hp > 0&&b.target!==false&&!game.isProtected(b)).sort((a,b) => Math.abs(a.x + a.w/2 - target) - Math.abs(b.x + b.w/2 - target))[0];
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

// Rendering must remain a read-only observer, even with impacts and reduced motion.
const { createBreakoutArt, STAGES } = await import('../breakout-art.mjs');
const gradient = {addColorStop(){}};
const drawnImages=[];
const context = new Proxy({}, {get:(_,key)=>key==='drawImage'?(image)=>drawnImages.push(image):key==='createLinearGradient'||key==='createRadialGradient'?()=>gradient:()=>{},set:()=>true});
globalThis.document={createElement:()=>({getContext:()=>context})};
const preference={matches:false}, art=createBreakoutArt(context,preference);
assert.equal(STAGES.length,LEVELS.length);
for(let level=1;level<=LEVELS.length;level++){
  const game=create();game.level=level;game.makeBricks();game.serve();game.mode='playing';
  game.activatePower('multi');game.activatePower('shield');game.activatePower('wide');
  game.drops=Object.keys(POWERS).map((kind,i)=>({kind,x:150+i*100,y:300}));
  const damaged=game.bricks.find(b=>b.type==='armor');if(damaged)damaged.hp=1;
  if(level===8){for(const b of game.bricks.filter(b=>b.generator))game.damageBrick(b,2);game.damageBrick(game.bricks[0],1);}
  const before=JSON.stringify(game);
  for(const type of ['brick','armor','explosion','save','paddle','wall','power','phase'])art.impact({type,x:100,y:120,color:'#ffcc99',kind:'wide',points:40,multiplier:2});
  art.draw(game,1/60);art.draw(game,1);preference.matches=true;art.clear();art.draw(game,1/60);preference.matches=false;
  assert.equal(JSON.stringify(game),before,'rendering must not mutate physics or records');
}
// Loading a raster scene must invalidate the old cached background exactly once.
const water=create();water.reset(5);const waterSnapshot=JSON.stringify(water);
art.draw(water);const bitmap={width:1696,height:928};art.setSceneImage(5,bitmap);
art.draw(water);art.draw(water);
assert.equal(drawnImages.filter(image=>image===bitmap).length,1,'cache the image instead of repainting it each frame');
assert.equal(JSON.stringify(water),waterSnapshot);
const {SCENE_ASSETS}=await import('../breakout-scenes.mjs');
const {stat}=await import('node:fs/promises');
for(let level=1;level<=8;level++){
  const g=create();g.reset(level);g.mode='playing';
  const before=JSON.stringify(g),image={level};art.setSceneImage(level,image);
  art.draw(g,1/60);art.draw(g,1/60);preference.matches=true;art.draw(g,0);preference.matches=false;
  assert.equal(drawnImages.filter(value=>value===image).length,1);
  assert.equal(JSON.stringify(g),before);
  assert.ok((await stat(new URL('../'+SCENE_ASSETS[level-1],import.meta.url))).size<600000);
}
// A delayed image from another level must not rebuild the current scene.
const active=create();active.reset(8);art.draw(active);const renders=drawnImages.length;
art.setSceneImage(1,{late:true});art.draw(active);
assert.equal(drawnImages.length,renders+1);

assert.ok((await stat(new URL('../game-assets/breakout/tidal-observatory.jpg',import.meta.url))).size<600000,'keep background delivery lightweight');
delete globalThis.document;
console.log('Mechanisms passed: steel, moving targets, power switches, timed shutters, ore chains, descending rows, core phases and selected starts.');
console.log('Presentation passed: eight themes, damaged armor, effects, all capsules, multi-ball and read-only rendering.');
