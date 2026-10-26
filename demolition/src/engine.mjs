import initJolt from 'jolt-physics/wasm';
import {LEVELS,MATERIALS,AMMO,makeBlueprint,starsFor} from './levels.mjs';

// Low ballistic arc, matching Jolt's default gravity. The cursor marks the impact point.
export function aimDirection(origin,target,speed=55){
  const x=target.x-origin.x,z=target.z-origin.z,h=target.y-origin.y,d=Math.hypot(x,z),v2=speed*speed;
  if(d<.001)return {x:0,y:Math.sign(h)||-1,z:0};
  const disc=v2*v2-9.81*(9.81*d*d+2*h*v2),angle=Math.atan((v2-Math.sqrt(Math.max(0,disc)))/(9.81*d));
  return {x:x/d*Math.cos(angle),y:Math.sin(angle),z:z/d*Math.cos(angle)};
}

export async function createEngine(options={}){
  const J=await initJolt(options),settings=new J.JoltSettings();
  const pairs=new J.ObjectLayerPairFilterTable(2);pairs.EnableCollision(0,1);pairs.EnableCollision(1,1);
  const broad=new J.BroadPhaseLayerInterfaceTable(2,2),a=new J.BroadPhaseLayer(0),b=new J.BroadPhaseLayer(1);
  broad.MapObjectToBroadPhaseLayer(0,a);broad.MapObjectToBroadPhaseLayer(1,b);
  settings.mObjectLayerPairFilter=pairs;settings.mBroadPhaseLayerInterface=broad;settings.mObjectVsBroadPhaseLayerFilter=new J.ObjectVsBroadPhaseLayerFilterTable(broad,2,pairs,2);
  const jolt=new J.JoltInterface(settings);J.destroy(settings);J.destroy(a);J.destroy(b);
  const system=jolt.GetPhysicsSystem(),bi=system.GetBodyInterface(),entities=new Map(),bodies=[],contacts=[],events=[];
  let level=LEVELS[0],blocks=[],balls=[],time=0,shots=0,cooldown=0,lastShot=-100,health=100,progress=0,result=null,settled=0,totalWeight=1,serial=0;
  const id=body=>body.GetID().GetIndexAndSequenceNumber();
  function bodyFor(spec,dynamic=false,sphere=false){
    const half=new J.Vec3(spec.sx/2,spec.sy/2,spec.sz/2),shape=sphere?new J.SphereShape(spec.sx/2):new J.BoxShape(half,.025),pos=new J.RVec3(spec.x,spec.y,spec.z),rot=new J.Quat(0,0,0,1);
    const cfg=new J.BodyCreationSettings(shape,pos,rot,dynamic?J.EMotionType_Dynamic:J.EMotionType_Static,dynamic?1:0);
    cfg.mAllowDynamicOrKinematic=true;cfg.mFriction=.67;cfg.mRestitution=.08;cfg.mLinearDamping=.13;cfg.mAngularDamping=.22;
    cfg.mOverrideMassProperties=J.EOverrideMassProperties_CalculateInertia;cfg.mMassPropertiesOverride.mMass=spec.mass||50;
    if(sphere)cfg.mMotionQuality=J.EMotionQuality_LinearCast;
    const body=bi.CreateBody(cfg);bi.AddBody(body.GetID(),dynamic?J.EActivation_Activate:J.EActivation_DontActivate);bodies.push(body);
    J.destroy(cfg);J.destroy(half);J.destroy(pos);J.destroy(rot);return body;
  }
  const listener=new J.ContactListenerJS();
  listener.OnContactValidate=()=>J.ValidateResult_AcceptAllContactsForThisBodyPair;
  listener.OnContactPersisted=()=>{};listener.OnContactRemoved=()=>{};
  listener.OnContactAdded=(pa,pb,pm)=>{
    const ba=J.wrapPointer(pa,J.Body),bb=J.wrapPointer(pb,J.Body),ea=entities.get(id(ba)),eb=entities.get(id(bb));
    if(!ea&&!eb)return;
    const va=ba.GetLinearVelocity(),vb=bb.GetLinearVelocity(),speed=Math.hypot(va.GetX()-vb.GetX(),va.GetY()-vb.GetY(),va.GetZ()-vb.GetZ());
    if(speed<2&&!ea?.projectile&&!eb?.projectile)return;
    const p=J.wrapPointer(pm,J.ContactManifold).GetWorldSpaceContactPointOn1(0);
    contacts.push({a:ea,b:eb,speed,p:{x:p.GetX(),y:p.GetY(),z:p.GetZ()}});
  };
  system.SetContactListener(listener);
  function read(e){const p=e.body.GetPosition(),q=e.body.GetRotation(),v=e.body.GetLinearVelocity();e.x=p.GetX();e.y=p.GetY();e.z=p.GetZ();e.q=[q.GetX(),q.GetY(),q.GetZ(),q.GetW()];e.speed=Math.hypot(v.GetX(),v.GetY(),v.GetZ());}
  function impulse(e,vector){const v=new J.Vec3(vector.x,vector.y,vector.z);bi.AddImpulse(e.body.GetID(),v);J.destroy(v);}
  function release(e){if(e.loose)return;e.loose=true;bi.SetObjectLayer(e.body.GetID(),1);bi.SetMotionType(e.body.GetID(),J.EMotionType_Dynamic,J.EActivation_Activate);events.push({type:'break',p:{x:e.x,y:e.y,z:e.z},kind:e.kind,size:Math.max(e.sx,e.sy,e.sz)});}
  function supportCascade(){
    let changed=true;while(changed){changed=false;for(const e of blocks)if(!e.loose&&!e.anchor&&e.supports.every(i=>blocks[i].loose)){release(e);changed=true;}}
  }
  function blast(p,ammo='breaker',direction={x:0,y:0,z:-1},multiplier=1){
    const cfg=AMMO[ammo],chain=[];
    events.push({type:'impact',p:{...p},kind:ammo,last:shots>=level.ammo});
    for(const e of blocks){
      const dx=e.x-p.x,dy=e.y-p.y,dz=e.z-p.z,distance=Math.hypot(Math.max(0,Math.abs(dx)-e.sx/2),Math.max(0,Math.abs(dy)-e.sy/2),Math.max(0,Math.abs(dz)-e.sz/2));
      if(distance>cfg.radius*multiplier)continue;
      const falloff=Math.max(0,1-distance/(cfg.radius*multiplier));e.hp-=cfg.damage*falloff*multiplier;
      if(e.hp<=0){if(e.kind==='barrel'&&!e.detonated){e.detonated=true;chain.push({x:e.x,y:e.y,z:e.z});}release(e);}
    }
    supportCascade();
    for(const e of blocks)if(e.loose){
      const dx=e.x-p.x,dy=e.y-p.y,dz=e.z-p.z,d=Math.hypot(dx,dy,dz),strength=Math.max(0,1-d/(cfg.radius*1.6*multiplier))*cfg.force;
      if(strength>0){const inv=1/Math.max(d,.5);impulse(e,{x:e.mass*strength*(dx*inv*.55+direction.x*.45),y:e.mass*strength*(dy*inv*.35+.20),z:e.mass*strength*(dz*inv*.55+direction.z*.45)});}
    }
    if(level.protect){const s=level.protect,d=Math.hypot(Math.max(0,Math.abs(p.x-s.x)-s.w/2),Math.max(0,p.y-3),Math.max(0,Math.abs(p.z-s.z)-s.d/2));health=Math.max(0,health-Math.max(0,1-d/cfg.radius)*38);}
    for(const point of chain)blast(point,'blast',{x:0,y:.1,z:0},1.3);
  }
  function load(next){
    for(const body of bodies){const bodyId=body.GetID();bi.RemoveBody(bodyId);bi.DestroyBody(bodyId);}bodies.length=0;entities.clear();contacts.length=0;events.length=0;
    level=next;blocks=[];balls=[];time=0;shots=0;cooldown=0;lastShot=-100;health=100;progress=0;result=null;settled=0;serial=0;
    bodyFor({x:0,y:-.6,z:0,sx:120,sy:1.2,sz:120});
    blocks=makeBlueprint(level).map(spec=>{
      const mat=MATERIALS[spec.kind],mass=Math.max(spec.kind==='glass'?1:8,spec.sx*spec.sy*spec.sz*mat.density),e={...spec,mass,hp:mat.hp,loose:false,q:[0,0,0,1],speed:0,target:spec.y+spec.sy/2>level.line+.02,body:bodyFor({...spec,mass})};
      entities.set(id(e.body),e);return e;
    });
    if(level.protect){const s=level.protect,e={protected:true,body:bodyFor({x:s.x,y:1.7,z:s.z,sx:s.w,sy:3.4,sz:s.d})};entities.set(id(e.body),e);}
    totalWeight=blocks.filter(e=>e.target).reduce((n,e)=>n+e.mass,0);
  }
  function canFire(){return !result&&cooldown<=0&&shots<level.ammo;}
  function fire(origin,direction,ammo='breaker'){
    const length=Math.hypot(direction.x,direction.y,direction.z);if(!canFire()||!AMMO[ammo]||!Number.isFinite(length)||length<.001||![origin.x,origin.y,origin.z].every(Number.isFinite))return false;
    const d={x:direction.x/length,y:direction.y/length,z:direction.z/length};
    const e={id:serial++,projectile:true,ammo,direction:d,age:0,hit:false,x:origin.x,y:origin.y,z:origin.z,sx:.65,sy:.65,sz:.65,mass:80,q:[0,0,0,1]};e.body=bodyFor(e,true,true);entities.set(id(e.body),e);balls.push(e);
    const v=new J.Vec3(d.x*55,d.y*55,d.z*55);bi.SetLinearVelocity(e.body.GetID(),v);J.destroy(v);shots++;cooldown=1.2;lastShot=time;settled=0;events.push({type:'shot',p:{...origin},ammo});return true;
  }
  function top(e){const [x,y,z,w]=e.q;return e.y+(Math.abs(2*(x*y+z*w))*e.sx+Math.abs(1-2*(x*x+z*z))*e.sy+Math.abs(2*(y*z-x*w))*e.sz)/2;}
  function step(dt){
    if(result)return;time+=dt;cooldown=Math.max(0,cooldown-dt);contacts.length=0;jolt.Step(dt,2);
    blocks.forEach(read);balls.forEach(e=>{read(e);e.age+=dt;});
    for(const c of contacts){
      const shell=c.a?.projectile?c.a:c.b?.projectile?c.b:null;
      if(shell&&!shell.hit){shell.hit=true;blast(c.p,shell.ammo,shell.direction);continue;}
      if(shell)continue;
      for(const [e,other] of [[c.a,c.b],[c.b,c.a]]){
        if(e?.protected&&other?.loose&&c.speed>3)health=Math.max(0,health-Math.min(12,c.speed*other.mass/2500));
        if(e&&!e.loose&&!e.protected&&other?.loose&&c.speed>3.5){e.hp-=Math.min(130,c.speed*other.mass/95);if(e.hp<=0)release(e);}
      }
      if(c.speed>5)events.push({type:'dust',p:c.p,kind:c.a?.kind||c.b?.kind||'concrete',size:Math.min(3,c.speed/5)});
    }
    supportCascade();
    // Keep sandbox physics bounded; spent shells are removed after eight seconds.
    for(let i=balls.length-1;i>=0;i--)if(balls[i].age>8){const e=balls[i];entities.delete(id(e.body));const at=bodies.indexOf(e.body);if(at>=0)bodies.splice(at,1);bi.RemoveBody(e.body.GetID());bi.DestroyBody(e.body.GetID());balls.splice(i,1);}
    progress=blocks.filter(e=>e.target&&top(e)<=level.line+.02).reduce((n,e)=>n+e.mass,0)/totalWeight;
    if(level.sandbox)return;
    const active=blocks.some(e=>e.loose&&e.speed>.8),pending=balls.some(e=>!e.hit&&e.age<4);
    settled=!active&&!pending?settled+dt:0;
    if(level.protect&&health<level.protect.min)result={win:false,reason:'邻居的小屋损伤过大',stars:0};
    else if(progress>=level.goal&&time-lastShot>2&&!pending&&(settled>.65||time-lastShot>10))result={win:true,reason:'拆除验收通过',stars:starsFor(level,shots,health)};
    else if(shots>=level.ammo&&!pending&&time-lastShot>4&&(settled>1.2||time-lastShot>16))result={win:false,reason:'弹药用完了，还有结构高于黄线',stars:0};
  }
  function snapshot(){return {blocks:blocks.map(e=>[e.x,e.y,e.z,...e.q]),balls:balls.filter(e=>!e.hit).map(e=>({id:e.id,ammo:e.ammo,p:[e.x,e.y,e.z]}))};}
  load(level);
  return {J,system,load,fire,canFire,step,snapshot,takeEvents(){return events.splice(0);},get blocks(){return blocks;},get balls(){return balls;},get level(){return level;},get stats(){return {time,shots,left:level.ammo-shots,health,progress,result,cooldown,settled};}};
}
