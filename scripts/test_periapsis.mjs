import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {COURSES,createFlight,makeCourse,pathAt,pilotInput,stepFlight,stars,readRecords,saveRecord} from '../periapsis/src/flight.mjs';

function run(f,controller=pilotInput,dt=1/60){let frames=0;while(f.status==='flying'&&frames++<30000)stepFlight(f,controller(f),dt);assert.notEqual(f.status,'flying','simulation must terminate');return f;}
function advance(f,seconds,input){for(let t=0;t<seconds;t+=1/60)stepFlight(f,typeof input==='function'?input(f):input,1/60);}

// Published routes and their existing records must not change when adding contracts.
const originalBlueprints={daybreak:'acfad61edd177c94b660267da3619580aee9340827deeea761e3bbb81859ecb4',belt:'661a11c78d4be7e91e8aa2c6449638e6a451def64514f5198095ca16082723ed',nightfall:'79c7aa11791929857dd6b1cff310af0d0230c99cbcb32dd31f9db5e09852ac4c'};
assert.equal(new Set(COURSES.map(c=>c.id)).size,COURSES.length);
for(const c of COURSES.filter(c=>originalBlueprints[c.id])){
  const {gates,rocks}=makeCourse(c);
  assert.equal(createHash('sha256').update(JSON.stringify({gates,rocks})).digest('hex'),originalBlueprints[c.id]);
}

for(const c of COURSES){
  assert.deepEqual(makeCourse(c),makeCourse(c),'seeded contracts are reproducible');
  const generated=makeCourse(c);assert.equal(generated.gates.length,c.gates);
  assert.ok(c.required>0&&c.required<=c.gates);
  assert.ok(generated.stations.length<=3);
  generated.stations.forEach((s,i)=>assert.ok(s>0&&s<generated.end&&(!i||s>generated.stations[i-1])));
  generated.gates.forEach((g,i)=>assert.ok(Math.abs(g.x)+g.radius<58&&Math.abs(g.y)+g.radius<36&&(!i||g.s>generated.gates[i-1].s),'gate aperture is reachable inside flight bounds'));
  for(const r of generated.rocks){const p=pathAt(c,r.s);assert.ok(Math.hypot(r.x-p.x,r.y-p.y)>r.radius+17,'flight corridor is clear');}
  for(const dt of [1/30,1/60,1/120]){
    const f=run(createFlight(c),pilotInput,dt);
    assert.equal(f.status,'finished');assert.equal(f.passed,c.gates);assert.equal(f.missed,0);assert.equal(f.shield,100);assert.equal(stars(f),3);assert.ok(f.score>c.gates*250);
    const before=JSON.stringify(f);stepFlight(f,{x:1,boost:true},.05);assert.equal(JSON.stringify(f),before,'completed result is frozen');
    console.log(`${c.id} @ ${1/dt} Hz: ${f.passed}/${c.gates} gates, ${f.time.toFixed(2)} s, shield ${f.shield}, score ${f.score}`);
  }
  const cruise=run(createFlight(c),f=>({...pilotInput(f),boost:false}));assert.equal(cruise.status,'finished','boost must not be necessary to finish');
}

{
  const sprint=makeCourse(COURSES.find(c=>c.id==='dawn-sprint'));
  assert.ok(new Set(sprint.gates.slice(1).map((g,i)=>g.s-sprint.gates[i].s)).size>=4,'sprint alternates short groups and long acceleration gaps');
  const records={};for(const c of COURSES)assert.equal(saveRecord(records,run(createFlight(c))),true);
  assert.equal(Object.keys(readRecords(JSON.stringify(records))).length,COURSES.length,'every route keeps an independent record');
  const old={daybreak:{score:11098,stars:3,time:41.23},nightfall:{score:16122,stars:3,time:47.77}};
  assert.deepEqual(readRecords(JSON.stringify(old)),old,'existing records survive the expansion');
}

{
  for(const id of ['daybreak','dawn-sprint']){
    const f=createFlight(COURSES.find(c=>c.id===id));f.course.rocks=[];
    f.course.gates=[{...f.course.gates[0],s:5,x:0,y:4}];f.x=10;f.speed=400;
    stepFlight(f,{},.05);
    assert.equal(f.passed,id==='daybreak'?1:0,'the same offset passes a wide ring but misses the precision ring');
  }
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
