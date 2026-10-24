import assert from 'node:assert/strict';
import {BomberGame,STEP,FUSE,FIRE} from '../bomber-engine.mjs';
let seed=27;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const create=()=>new BomberGame({random});
const clear=g=>{for(let y=1;y<10;y++)for(let x=1;x<12;x++)if(g.grid[y][x]===2)g.grid[y][x]=0;};
const tick=(g,s,inputs={})=>{for(let i=0;i<s/STEP;i++)g.step(STEP,inputs);};
const g=create();g.start();clear(g);g.players.forEach(p=>p.human=true);
const p=g.players[0];assert.ok(g.place(p));assert.equal(g.place(p),false);assert.equal(g.pass(1,1,p),true);
tick(g,.6,{0:{dir:[1,0]}});assert.ok(p.x>2);assert.equal(g.pass(1,1,p),false,'Cannot return through a live bomb after leaving it');
const paused=g.time;g.state='paused';tick(g,1);assert.equal(g.time,paused);g.state='playing';
const blast=create();blast.start();clear(blast);blast.players.forEach(p=>p.human=true);blast.grid[1][3]=2;
const b={x:1,y:1,owner:0,range:5,timer:0,pass:new Set(),age:0};blast.bombs.push(b);blast.detonate(b,new Set());
assert.equal(blast.grid[1][3],0);assert.ok(blast.flames.some(f=>f.x===3&&f.y===1));assert.ok(!blast.flames.some(f=>f.x===4&&f.y===1),'Soft walls stop the blast');
assert.ok(!blast.flames.some(f=>f.x===2&&f.y===2),'Steel walls cannot be crossed');
const chain=create();chain.start();clear(chain);chain.bombs.push({x:1,y:1,range:3,owner:0,timer:0,age:0,pass:new Set()},{x:3,y:1,range:3,owner:1,timer:FUSE,age:0,pass:new Set()});
chain.detonate(chain.bombs[0],new Set());assert.equal(chain.bombs.length,0);assert.ok(chain.flames.some(f=>f.x===3&&f.y===3),'Chains also propagate in the second bomb’s other lanes');
const pickup=create();pickup.start();clear(pickup);pickup.players.forEach(p=>p.human=true);pickup.items.push({x:1,y:1,kind:'fire'});pickup.step(STEP);assert.equal(pickup.players[0].range,3);
pickup.items.push({x:1,y:1,kind:'bomb'});pickup.step(STEP);assert.equal(pickup.players[0].capacity,2);
pickup.flames.push({x:1,y:1,ttl:FIRE,owner:1});pickup.step(STEP);assert.equal(pickup.players[0].alive,false);
const finish=create();finish.start();finish.players.slice(1).forEach(p=>p.alive=false);finish.step(STEP);assert.equal(finish.result.winner,0);assert.equal(finish.scores[0],1);finish.next();assert.equal(finish.round,2);assert.equal(finish.scores[0],1);finish.players.slice(1).forEach(p=>p.alive=false);finish.step(STEP);assert.equal(finish.result.match,true);finish.reset({mode:'duo'});assert.equal(finish.players.filter(p=>p.human).length,2);assert.deepEqual(finish.scores,[0,0,0,0]);
const shrink=create();shrink.start();shrink.players.forEach(p=>p.human=true);shrink.time=90;shrink.step(STEP);assert.equal(shrink.tile(1,1),1);assert.equal(shrink.players[0].alive,false);
// Multiple seeded matches exercise navigation, safe bomb placement, chain reactions and termination.
const reports=[];
for(let n=0;n<6;n++){
 const match=create();match.start();match.players.forEach(p=>p.human=false);let placements=0;match.emit=e=>{if(e.type==='place')placements++;};
 for(let frame=0;frame<121/STEP&&match.state==='playing';frame++){
  match.step(STEP);for(const p of match.players)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
  for(const p of match.players)if(p.alive)assert.equal(match.tile(Math.round(p.x),Math.round(p.y)),0);
 }
 assert.equal(match.state,'finished');assert.ok(placements>=3,'Bots must actively contest the arena');reports.push(`${Math.round(match.time)}s/${placements} bombs/${match.result.winner??'draw'}`);
}
console.log('Bomber passed: movement, bomb pass-through, blocked blast, chains, power-ups, pause, elimination, match scoring, sudden death.');console.log(reports.join(' | '));
