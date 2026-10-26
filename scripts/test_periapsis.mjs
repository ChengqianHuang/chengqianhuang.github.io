import assert from 'node:assert/strict';
import {COURSES,createFlight,makeCourse,pathAt,pilotInput,stepFlight,stars,readRecords,saveRecord} from '../periapsis/src/flight.mjs';

function run(f,controller=pilotInput,dt=1/60){let frames=0;while(f.status==='flying'&&frames++<30000)stepFlight(f,controller(f),dt);assert.notEqual(f.status,'flying','simulation must terminate');return f;}
function advance(f,seconds,input){for(let t=0;t<seconds;t+=1/60)stepFlight(f,typeof input==='function'?input(f):input,1/60);}

for(const c of COURSES){
  assert.deepEqual(makeCourse(c),makeCourse(c),'seeded contracts are reproducible');
  const generated=makeCourse(c);assert.equal(generated.gates.length,c.gates);
  for(const r of generated.rocks){const p=pathAt(c,r.s);assert.ok(Math.hypot(r.x-p.x,r.y-p.y)>r.radius+17,'flight corridor is clear');}
  for(const dt of [1/30,1/60,1/120]){
    const f=run(createFlight(c),pilotInput,dt);
    assert.equal(f.status,'finished');assert.equal(f.passed,c.gates);assert.equal(f.missed,0);assert.equal(f.shield,100);assert.equal(stars(f),3);assert.ok(f.score>c.gates*250);
    const before=JSON.stringify(f);stepFlight(f,{x:1,boost:true},.05);assert.equal(JSON.stringify(f),before,'completed result is frozen');
    console.log(`${c.id} @ ${1/dt} Hz: ${f.passed}/${c.gates} gates, ${f.time.toFixed(2)} s, shield ${f.shield}, score ${f.score}`);
  }
  const cruise=run(createFlight(c),f=>({...pilotInput(f),boost:false}));assert.equal(cruise.status,'finished','boost must not be necessary to finish');
}

// Continuous intersection catches a small rock even when the ship crosses it in one step.
{
  const f=createFlight();f.course.rocks=[{id:0,x:0,y:4,s:5,radius:1}];f.speed=400;stepFlight(f,{},.05);assert.equal(f.shield,72);assert.equal(f.collided.size,1);assert.ok(f.events.some(e=>e.type==='hit'));advance(f,.5,{});assert.equal(f.shield,72,'one rock cannot inflict repeated damage');
}
{
  const f=createFlight();f.course.rocks=[{id:0,x:4.7,y:4,s:5,radius:1}];f.speed=400;stepFlight(f,{},.05);assert.equal(f.shield,100);assert.equal(f.nearMisses,1);assert.equal(f.score,80);advance(f,.5,{});assert.equal(f.nearMisses,1);
}
// Gate judgment uses position at the plane crossing, not the endpoint of the time step.
{
  const f=createFlight();f.course.rocks=[];f.course.gates=[{i:0,s:5,x:0,y:4,radius:12}];f.speed=400;stepFlight(f,{},.05);assert.equal(f.passed,1);assert.equal(f.combo,1);assert.ok(f.events[0].perfect);
  f.course.gates.push({i:1,s:f.s+1,x:50,y:4,radius:12});stepFlight(f,{},.05);assert.equal(f.missed,1);assert.equal(f.combo,0);assert.equal(f.penalty,2);
}
{
  const f=createFlight();f.course.rocks=[];f.course.gates=[{i:0,s:5,x:12,y:4,radius:12}];f.speed=400;stepFlight(f,{},.05);assert.equal(f.passed,0);assert.equal(f.shield,85,'ring edge impact damages shield');
}
{
  const f=createFlight();f.course.rocks=[];advance(f,4.5,{boost:true});assert.equal(f.locked,true);assert.equal(f.boosting,false);assert.ok(f.heat>.8);advance(f,5.5,{});assert.equal(f.locked,false);stepFlight(f,{boost:true});assert.equal(f.boosting,true);assert.ok(f.heat>=0&&f.heat<=1);
}
{
  const f=createFlight();advance(f,12,{x:1,y:-1});assert.ok(f.x<=58&&f.y>=-36);assert.ok(Number.isFinite(f.x+f.y+f.speed));const before=f.time;stepFlight(f,{},-1);assert.equal(f.time,before,'negative time cannot advance flight');
}
{
  const f=run(createFlight(),()=>({targetX:58,targetY:36}));assert.equal(f.status,'failed');assert.equal(f.passed,0);assert.equal(stars(f),0);
  const slow=createFlight();slow.course.rocks=[];run(slow,()=>({brake:true}));assert.equal(slow.status,'failed');assert.equal(slow.reason,'航行时间用尽');
  const damaged=createFlight();damaged.shield=20;damaged.course.rocks=[{id:0,x:0,y:4,s:2,radius:2}];stepFlight(damaged,{},.05);assert.equal(damaged.status,'failed');assert.equal(damaged.shield,0);const snapshot=JSON.stringify(damaged);stepFlight(damaged,{boost:true});assert.equal(JSON.stringify(damaged),snapshot);
}
{
  const records=readRecords('{bad json');assert.deepEqual(records,{});const f=run(createFlight());assert.equal(saveRecord(records,f),true);assert.equal(saveRecord(records,f),false);assert.deepEqual(readRecords(JSON.stringify(records)),records);
  assert.deepEqual(readRecords('{"daybreak":{"score":-1,"stars":99,"time":3},"bogus":{}}'),{});
  const failed=createFlight();failed.status='failed';assert.equal(saveRecord(records,failed),false);
}
console.log('Periapsis flight checks passed: full routes, collision sweep, near misses, rings, heat, failures, bounds and records.');
