import assert from 'node:assert/strict';
import {createGame,startGame,advance,launch,STEP,BUMPERS,TARGETS,PIVOTS,flipperSegment,rampPoint,RADIUS} from '../pinball/src/physics.mjs';
const fresh=()=>{const g=createGame();startGame(g);return g;};
const run=(g,seconds,input={})=>{for(let i=0;i<Math.round(seconds/STEP);i++)advance(g,input,STEP);};
const place=(g,values)=>Object.assign(g.balls[0],{lane:false,ramp:null,x:5,y:12,vx:0,vy:0,...values});
// Launch uses press/release and a finite charge. No scoring before the player starts.
{
 const g=createGame();advance(g,{launch:true},1);assert.equal(g.time,0);
 startGame(g);run(g,.5,{launch:true});assert(g.charge>.4);assert(g.balls[0].lane);
 advance(g,{},STEP);assert(!g.balls[0].lane);assert(g.balls[0].vy< -25);assert.equal(g.charge,0);
 run(g,2);assert(g.balls[0].x<8.85,'launch must enter the playfield');
}
// Both moving flippers supply upward energy, and mirrored shots behave symmetrically.
{
 const shots=[];
 for(const [x,key] of [[4,'left'],[5.8,'right']]){const g=fresh();place(g,{x,y:15.2,vy:2});run(g,.125,{[key]:true});shots.push(g.balls[0]);assert(g.balls[0].vy< -20);}
 assert(Math.abs(shots[0].vy-shots[1].vy)<1e-9);assert(Math.abs(shots[0].vx+shots[1].vx)<1e-9);
 const g=fresh();run(g,1,{left:true,right:true});for(let i=0;i<2;i++){assert.equal(g.flippers[i].angle,PIVOTS[i].up);assert.equal(g.flippers[i].omega,0);const f=flipperSegment(g.flippers[i],i);assert.equal(f.ax,PIVOTS[i].x);}
}
// Bumper surface bounce scores once, then exits instead of accumulating overlap points.
{
 const g=fresh(),p=BUMPERS[0];place(g,{x:p.x,y:p.y+p.r+RADIUS+.01,vy:-8});run(g,.05);assert.equal(g.hits,1);assert(g.score>=150);assert(g.balls[0].vy>0);
}
// Drop targets unlock a physical ramp entrance. Rail motion and multiball use normal rules.
{
 const g=fresh();
 for(const p of TARGETS){place(g,{x:p.x+.34,y:p.y,vx:-10});run(g,.05);}
 assert(g.targets.every(Boolean));assert(g.armed);assert.equal(g.score,2500);
 place(g,{x:7.65,y:11.6,vy:-10});run(g,.08);assert.equal(g.ramps,1);assert.equal(g.balls.length,3);assert(g.multiball);assert(!g.armed);assert(g.targets.every(t=>!t));
 const b=g.balls.find(b=>b.ramp!==null);assert(b);const p=rampPoint(b.ramp);assert.deepEqual([b.x,b.y,b.z],[p.x,p.y,p.z]);
 run(g,2.3);assert.equal(b.ramp,null);assert.equal(b.z,0);assert(Number.isFinite(b.vx));
}
// The closed entrance reflects the ball; it cannot silently trigger a multiball.
{
 const g=fresh();place(g,{x:7.65,y:11.6,vy:-10});run(g,.1);assert.equal(g.ramps,0);assert.equal(g.balls.length,1);assert(g.balls[0].vy>0);
}
// Save does not spend a life. A three-ball game really terminates after the third loss.
{
 const g=fresh();g.saveUntil=10;place(g,{y:17.7});advance(g,{},STEP);assert.equal(g.ballNumber,1);assert.equal(g.balls.length,1);assert(g.events.some(e=>e.type==='save'));
 g.saveUntil=0;for(let i=1;i<=3;i++){place(g,{y:17.7});advance(g,{},STEP);assert.equal(g.status,i===3?'over':'playing');assert.equal(g.ballNumber,Math.min(3,i+1));}
 const snap=JSON.stringify(g);advance(g,{launch:true},.1);assert.equal(JSON.stringify(g),snap);
 startGame(g);assert.equal(g.score,0);assert.equal(g.ballNumber,1);assert.equal(g.balls.length,1);assert.equal(g.status,'playing');
}
// Pausing freezes physics, timers, charge, and pending effects.
{
 const g=fresh();launch(g,.8);run(g,1);g.paused=true;const state=JSON.stringify(g);run(g,5,{left:true,launch:true,nudge:true});assert.equal(JSON.stringify(g),state);g.paused=false;run(g,.1);assert(g.time>1);
}
// Three nudges in six seconds disable flippers and protection, then recover.
{
 const g=fresh();launch(g);for(let i=0;i<3;i++){advance(g,{nudge:true},STEP);advance(g,{},STEP);}assert(g.tilt>2.9);assert.equal(g.saveUntil,0);run(g,.1,{left:true});assert.equal(g.flippers[0].angle,PIVOTS[0].rest);run(g,3.1,{left:true});assert.equal(g.tilt,0);assert.equal(g.flippers[0].angle,PIVOTS[0].up);
}
// Fixed-step accumulator gives identical outcomes across display refresh rates.
{
 const states=[];for(const hz of [30,60,120]){const g=fresh();launch(g,.7);for(let i=0;i<hz*4;i++)advance(g,{},1/hz);states.push(g);}
 for(const g of states.slice(1)){assert.equal(g.score,states[0].score);assert(Math.abs(g.balls[0].x-states[0].balls[0].x)<1e-8);assert(Math.abs(g.time-states[0].time)<1e-8);}
}
// Seeded ordinary-input games: no health/life/score manipulation, no immortal test ball.
for(let seed=1;seed<=6;seed++){
 const g=fresh();let minY=99,maxSpeed=0,steps=0;
 while(g.status!=='over'&&steps<240*180){
   const t=steps*STEP,b=g.balls.find(b=>!b.lane&&b.ramp===null);
   const input={left:!!b&&b.x<5&&b.y>14.9&&b.vy>0,right:!!b&&b.x>=5&&b.y>14.9&&b.vy>0};
   if(g.balls.some(b=>b.lane))launch(g,.3+seed*.1);
   advance(g,input,STEP);steps++;
   assert(g.balls.length<=3);for(const b of g.balls){assert([b.x,b.y,b.vx,b.vy].every(Number.isFinite));minY=Math.min(minY,b.y);maxSpeed=Math.max(maxSpeed,Math.hypot(b.vx,b.vy));assert(b.x>0&&b.x<10,'ball escaped side rails');}
 }
 assert(minY<2,'serve never reached top of table');assert(g.score>0);assert(maxSpeed<=36.00001);
 console.log(`seed ${seed}: ${g.time.toFixed(1)}s, ${g.score} points, ${g.hits} bumpers, ${g.ramps} ramps, ${g.status}`);
}
// Hands-off runs must drain rather than remaining trapped on a static collision indefinitely.
{
 const g=fresh();for(let i=0;i<240*180&&g.status!=='over';i++){if(g.balls.some(b=>b.lane))launch(g,.7);advance(g,{},STEP);}assert.equal(g.status,'over');
}
console.log('Pinball: launch, mirrored flippers, targets, ramp, multiball, saves, tilt, pause, restart and frame-rate checks passed.');
