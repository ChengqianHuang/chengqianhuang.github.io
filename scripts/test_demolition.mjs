import assert from 'node:assert/strict';
import {createEngine,aimDirection} from '../demolition/src/engine.mjs';
import {LEVELS,makeBlueprint,readSave} from '../demolition/src/levels.mjs';
const e=await createEngine(),dt=1/60;
const advance=seconds=>{for(let f=0;f<seconds*60;f++)e.step(dt);};
const shootAt=(target,ammo='blast')=>{const origin={x:target.x,y:target.y+1,z:target.z+(target.z>=0?22:-22)};return e.fire(origin,aimDirection(origin,target),ammo);};

for(const level of LEVELS){
  const plan=makeBlueprint(level);assert(plan.length>30&&plan.length<400,'bounded building complexity');
  for(const block of plan){assert(block.anchor||block.supports.length,'every piece has a foundation or support');assert(block.supports.every(i=>i<block.id),'support dependencies point down to existing structure');}
  e.load(level);const before=e.snapshot();advance(2);
  assert.equal(e.stats.progress,0,`${level.id}: intact buildings earn no demolition progress`);
  assert(!e.blocks.some(b=>b.loose),'an untouched building stays supported');
  assert(e.snapshot().blocks.every((p,i)=>Math.hypot(p[0]-before.blocks[i][0],p[1]-before.blocks[i][1],p[2]-before.blocks[i][2])<.001),'structures do not fall before the first shot');
}

// Fire a real swept sphere. Contact callbacks trigger damage only after impact.
e.load(LEVELS[0]);const target=e.blocks.find(b=>b.role==='column'&&b.anchor&&b.x===0&&b.z>0);
assert(shootAt(target));assert.equal(e.stats.shots,1);assert.equal(e.blocks.filter(b=>b.loose).length,0);
assert(!shootAt(target),'reload cooldown rejects a second click');
advance(1);const impacts=e.takeEvents().filter(event=>event.type==='impact');
assert(impacts.length>0,'a real collision produces an impact');
assert(Math.hypot(impacts[0].p.x-target.x,impacts[0].p.y-target.y,impacts[0].p.z-target.z)<1,'ballistic aiming compensates for gravity');
assert(e.blocks.some(b=>b.loose&&b.y>3),'destroying a low support releases upper structure');
advance(6);assert(e.stats.progress>.2,'falling material reaches the ground and counts toward the goal');
assert(e.blocks.every(b=>Number.isFinite(b.x+b.y+b.z)),'debris has finite transforms');
const stats=JSON.stringify(e.stats);e.snapshot();e.snapshot();assert.equal(JSON.stringify(e.stats),stats,'reading replay poses never changes physics, ammo or score');
assert(!e.fire({x:NaN,y:0,z:0},{x:1,y:0,z:0}));

// A repeatable solution to every contract using ordinary projectiles and no direct damage calls.
const reports=[];
for(const level of LEVELS.slice(0,6)){
  e.load(level);
  for(let shot=0;shot<level.ammo&&!e.stats.result;shot++){
    const columns=e.blocks.filter(b=>b.role==='column'&&!b.loose).sort((a,b)=>a.y-b.y||Math.abs(a.x)-Math.abs(b.x));
    const target=columns[0]||e.blocks.find(b=>b.target&&!b.loose);if(!target)break;
    assert(shootAt(target));advance(7);
  }
  advance(20);
  assert(e.stats.result?.win,`${level.id} must be completable within its ammunition budget: ${JSON.stringify(e.stats)}`);
  assert(e.stats.progress>=level.goal);assert(e.stats.shots<=level.ammo);
  if(level.protect)assert(e.stats.health>=level.protect.min);
  const final=JSON.stringify(e.stats);advance(3);assert.equal(JSON.stringify(e.stats),final,'completed contracts freeze their result');
  assert(!shootAt({x:0,y:0,z:0}),'finished contracts cannot spend extra ammunition');
  reports.push({level:level.id,shots:e.stats.shots,progress:Math.round(e.stats.progress*100),health:Math.round(e.stats.health),stars:e.stats.result.stars});
}

// Protection and ammunition limits fail honestly, including missed shots.
e.load(LEVELS[4]);shootAt({x:8.5,y:1.7,z:3.1});advance(3);assert.equal(e.stats.result?.win,false,'shooting the protected house fails the contract');
e.load(LEVELS[0]);for(let i=0;i<4;i++){assert(shootAt({x:25,y:0,z:0}));advance(5);}advance(20);
assert.equal(e.stats.result?.win,false,'missing every shot cannot win');assert.equal(e.stats.left,0);assert(!shootAt({x:0,y:1,z:0}),'no negative ammunition');

// Free play is unlimited, but physics bodies are not: expired shells are reclaimed.
e.load(LEVELS[6]);const baseline=e.system.GetNumBodies();
for(let i=0;i<20;i++){assert(shootAt({x:25,y:0,z:0}));advance(1.4);}
advance(10);assert.equal(e.stats.shots,20);assert.equal(e.stats.result,null);assert.equal(e.system.GetNumBodies(),baseline,'spent projectiles are removed in free play');
for(const level of [...LEVELS,...LEVELS]){e.load(level);advance(.2);assert.equal(e.system.GetNumBodies(),1+e.blocks.length+(level.protect?1:0),'level switches remove all old collision bodies');assert.equal(e.stats.shots,0);assert.equal(e.stats.health,100);}
assert.deepEqual(readSave('{"first-job":3,"brickworks":2,"twins":4,"steel-yard":"3"}'),{'first-job':3,brickworks:2});
assert.deepEqual(readSave('{broken'),{});assert.deepEqual(readSave('null'),{});
console.log(JSON.stringify(reports,null,2));
console.log('Demolition checks passed: stable structures, ballistic impacts, support cascades, six complete contracts, failure rules, replay snapshots, free-play cleanup and save validation.');
