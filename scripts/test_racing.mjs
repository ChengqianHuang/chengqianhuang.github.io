import assert from 'node:assert/strict';
import {createPhysics} from '../racing/src/physics.mjs';
import {sample,grid,nearest,aiInput,createProgress,updateProgress,recoverPoint,LENGTH,formatTime} from '../racing/src/track.mjs';

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

// Ordered checkpoints reject driving backwards, skipping a gate and teleporting.
let state=createProgress(grid());
for(let i=0;i<300;i++)updateProgress(state,sample(-.012-i/300),i);
assert.equal(state.lap,0,'reverse lap does not count');
state=createProgress(sample(.01));for(let i=0;i<60;i++)updateProgress(state,sample(.01+i*.004),i);
assert.equal(state.passed,0,'skipping the start cannot count later checkpoints');
state=createProgress(grid());updateProgress(state,sample(.4),1);assert.equal(state.passed,0,'teleport cannot pass gates');
state=createProgress(grid());for(let i=0;i<1250;i++)updateProgress(state,sample(-.012+i*.001),i/60,1);
assert(state.finished&&state.lapTimes.length===1,'one full forward lap finishes time trial');
const total=state.total;updateProgress(state,sample(.5),999,1);assert.equal(state.total,total,'finished time cannot change');
assert.equal(formatTime(65.237),'1:05.23');

// Four real Jolt vehicles race concurrently. The player surrogate uses the same
// controller as demo mode; opponents follow their own lanes and collide normally.
for(let i=1;i<4;i++)physics.addCar(grid(i));
const racers=physics.cars.map((c,i)=>{physics.reset(c,grid(i));return createProgress(grid(i));});
const stuck=[0,0,0,0],recoveries=[0,0,0,0];
for(let f=0;f<60*190;f++){
  physics.step(dt,physics.cars.map((c,i)=>aiInput(c,i===0?1:i-1)));
  physics.cars.forEach((c,i)=>{
    updateProgress(racers[i],c,f/60,3);
    stuck[i]=c.velocity<2?stuck[i]+dt:0;
    if(stuck[i]>4||c.upright<.2||c.y< -4){const p=recoverPoint(racers[i]);physics.reset(c,p);racers[i].last=p.u;stuck[i]=0;recoveries[i]++;}
    assert(Number.isFinite(c.x+c.y+c.z),'finite physics state');
  });
  if(racers.every(s=>s.finished))break;
}
assert(racers.every(s=>s.finished),'all four vehicles finish three ordered laps');
assert(racers.every(s=>s.lapTimes.length===3),'all lap splits recorded');
assert(recoveries.every(n=>n<8),'AI recovers from collisions without a reset loop');
console.log(JSON.stringify({trackMetres:Math.round(LENGTH),engineAccelerationKmh:Math.round(speed*3.6),rampPeakMetres:+maxHeight.toFixed(2),threeLapTimes:racers.map(s=>+s.total.toFixed(2)),recoveries},null,2));
console.log('Racing checks passed: engine, brakes, reverse, suspension, collisions, ramp, gates and complete four-car races.');
