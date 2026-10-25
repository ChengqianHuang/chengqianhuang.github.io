import assert from 'node:assert/strict';
import {createPhysics} from '../racing/src/physics.mjs';
import {TRACKS,getTrack,sample,grid,formatTime} from '../racing/src/track.mjs';
import {readRecords,saveBest} from '../racing/src/records.mjs';

const dt=1/60,physics=await createPhysics(),car=physics.addCar(grid());
const advance=(seconds,input)=>{for(let i=0;i<seconds*60;i++)physics.step(dt,[input]);};
advance(1,{brake:1});
assert(car.wheels.every(w=>w.contact),'all four tires settle on the road');
assert(car.y>.8&&car.y<1.1,'suspension supports the chassis');
advance(2,{throttle:1});const speed=car.speed;
assert(speed>12&&speed<30,`car accelerates using the engine: ${speed}`);
advance(2,{brake:1});assert(Math.abs(car.speed)<1,'service brakes stop the vehicle');
advance(1.5,{throttle:-1});assert(car.speed< -2,'reverse gear works after stopping');
physics.reset(car,grid());advance(1,{brake:1});assert(Math.abs(car.speed)<.1,'recovery clears velocity');

// An actual rigid-body collision: drive straight into the outer guardrail.
const start=sample(.08);physics.reset(car,{...start,yaw:Math.PI});
advance(3,{throttle:1});
assert(car.z<69.1&&car.z>48,'guardrail contains a frontal impact');
assert(Number.isFinite(car.y)&&car.upright>0,'impact remains stable');

// The launch ramp is a matching physical slab, not only a visual incline.
physics.reset(car,{x:-39,z:65.2,yaw:Math.PI/2});let maxHeight=0,airborne=false;
for(let f=0;f<330;f++){physics.step(dt,[{throttle:1}]);maxHeight=Math.max(maxHeight,car.y);if(car.x> -14&&car.x<0&&!car.wheels.some(w=>w.contact))airborne=true;}
assert(maxHeight>1.7&&airborne,'suspension unloads and the car jumps off the ramp');

// Every route uses ordered checkpoints and fits its full route in the preview.
assert.equal(new Set(TRACKS.map(t=>t.id)).size,TRACKS.length,'unique circuit IDs');
assert.equal(getTrack('unknown'),TRACKS[0],'old / unknown links have a usable default');
for(const track of TRACKS){
  const {sample,grid,createProgress,updateProgress}=track;
  for(const p of track.samples){const [x,y]=track.project(p);assert(x>=16.9&&x<=203.1&&y>=16.9&&y<=123.1,'route is not clipped by the map');}
  let state=createProgress(grid());
  for(let i=0;i<300;i++)updateProgress(state,sample(-.012-i/300),i);
  assert.equal(state.lap,0,`${track.id}: reverse lap does not count`);
  state=createProgress(sample(.01));for(let i=0;i<60;i++)updateProgress(state,sample(.01+i*.004),i);
  assert.equal(state.passed,0,`${track.id}: skipping the start cannot count later checkpoints`);
  state=createProgress(grid());updateProgress(state,sample(.4),1);assert.equal(state.passed,0,'teleport cannot pass gates');
  state=createProgress(grid());for(let i=0;i<1250;i++)updateProgress(state,sample(-.012+i*.001),i/60,1);
  assert(state.finished&&state.lapTimes.length===1,`${track.id}: one forward lap finishes time trial`);
  const total=state.total;updateProgress(state,sample(.5),999,1);assert.equal(state.total,total,'finished time cannot change');
  const p=track.recoverPoint({...state,next:11});assert(track.nearest(p.x,p.z).distance<1,'recovery uses the selected track');
}
assert.equal(formatTime(65.237),'1:05.23');

// The old single-course records migrate to harbor only. Tracks and modes stay independent.
const records=readRecords(null,JSON.stringify({race:102,trial:34}));
assert.deepEqual(records,{harbor:{race:102,trial:34},coast:{},oldtown:{}});
assert(saveBest(records,'coast','trial',30));assert(saveBest(records,'oldtown','race',150));
assert(!saveBest(records,'coast','trial',31));assert(saveBest(records,'coast','trial',29));
assert(!saveBest(records,'unknown','trial',20));assert(!saveBest(records,'__proto__','trial',20));
assert(!saveBest(records,'coast','invalid',20));assert(!saveBest(records,'coast','trial',Infinity));
assert.deepEqual(records,{harbor:{race:102,trial:34},coast:{trial:29},oldtown:{race:150}});
assert.deepEqual(readRecords(JSON.stringify(records),JSON.stringify({race:99})),records,'v2 takes precedence over legacy data');
assert.deepEqual(readRecords('{broken','null'),{harbor:{},coast:{},oldtown:{}});
assert.deepEqual(readRecords('{"coast":{"trial":-2,"race":"50"},"oldtown":{"trial":0}}'),{harbor:{},coast:{},oldtown:{}});

// Four real Jolt vehicles race concurrently. The player surrogate uses the same
// controller as demo mode; opponents follow their own lanes and collide normally.
for(let i=1;i<4;i++)physics.addCar(grid(i));
const reports=[];
for(const track of TRACKS){
  physics.setTrack(track);
  const bodyCount=physics.system.GetNumBodies();
  assert.equal(bodyCount,1+track.barriers.length+(track.ramp?1:0)+track.props.length+4,'switching removes every previous course body');
  const racers=physics.cars.map((c,i)=>track.createProgress(track.grid(i)));
  const stuck=[0,0,0,0],recoveries=[0,0,0,0];
  for(let f=0;f<60*240;f++){
    physics.step(dt,physics.cars.map((c,i)=>track.aiInput(c,i===0?1:i-1)));
    physics.cars.forEach((c,i)=>{
      track.updateProgress(racers[i],c,f/60,3);
      stuck[i]=c.velocity<2?stuck[i]+dt:0;
      if(stuck[i]>4||c.upright<.2||c.y< -4){const p=track.recoverPoint(racers[i]);physics.reset(c,p);racers[i].last=p.u;stuck[i]=0;recoveries[i]++;}
      assert(Number.isFinite(c.x+c.y+c.z),'finite physics state');
    });
    if(racers.every(s=>s.finished))break;
  }
  assert(racers.every(s=>s.finished),`${track.id}: all four vehicles finish three ordered laps`);
  assert(racers.every(s=>s.lapTimes.length===3),'all lap splits recorded');
  assert(recoveries.every(n=>n<8),'AI recovers from collisions without a reset loop');
  // A solo demonstration has to finish without any automatic recovery help.
  physics.reset(car,track.grid());
  physics.cars.slice(1).forEach((c,i)=>physics.reset(c,{x:track.ground[0]/2-15-i*5,z:track.ground[1]/2-12,yaw:0}));
  advance(1.5,{brake:1});const solo=track.createProgress(track.grid());
  for(let f=0;f<60*90&&!solo.finished;f++){
    physics.step(dt,[track.aiInput(car,1)]);track.updateProgress(solo,car,f/60,1);
  }
  assert(solo.finished,`${track.id}: demo completes a full lap without recovery`);
  reports.push({track:track.id,metres:Math.round(track.LENGTH),threeLapTimes:racers.map(s=>+s.total.toFixed(2)),recoveries,demoTime:+solo.total.toFixed(2)});
}
for(const track of [...TRACKS,...TRACKS]){
  physics.setTrack(track);advance(.2,{brake:1});
  assert.equal(physics.system.GetNumBodies(),1+track.barriers.length+(track.ramp?1:0)+track.props.length+4,'repeated switching does not accumulate collision bodies');
}
console.log(JSON.stringify({engineAccelerationKmh:Math.round(speed*3.6),rampPeakMetres:+maxHeight.toFixed(2),circuits:reports},null,2));
console.log('Racing checks passed: vehicle physics, three circuits, complete four-car races, solo demos, course switching and record migration.');
