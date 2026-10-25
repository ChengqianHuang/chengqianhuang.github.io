import initJolt from 'jolt-physics/wasm';
import { barriers } from './track.mjs';

export async function createPhysics(options={}) {
  const J=await initJolt(options);
  const settings=new J.JoltSettings();
  const pair=new J.ObjectLayerPairFilterTable(2);
  pair.EnableCollision(0,1);pair.EnableCollision(1,1);
  const bp=new J.BroadPhaseLayerInterfaceTable(2,2);
  const l0=new J.BroadPhaseLayer(0),l1=new J.BroadPhaseLayer(1);
  bp.MapObjectToBroadPhaseLayer(0,l0);bp.MapObjectToBroadPhaseLayer(1,l1);
  settings.mObjectLayerPairFilter=pair;settings.mBroadPhaseLayerInterface=bp;
  settings.mObjectVsBroadPhaseLayerFilter=new J.ObjectVsBroadPhaseLayerFilterTable(bp,2,pair,2);
  const jolt=new J.JoltInterface(settings);J.destroy(settings);J.destroy(l0);J.destroy(l1);
  const system=jolt.GetPhysicsSystem(), bi=system.GetBodyInterface();
  const up=new J.Vec3(0,1,0),zero=new J.Vec3(0,0,0);
  const cars=[],props=[];
  function box(x,y,z,sx,sy,sz,yaw=0,mass=0) {
    const size=new J.Vec3(sx/2,sy/2,sz/2),shape=new J.BoxShape(size,.04);
    const pos=new J.RVec3(x,y,z),rot=J.Quat.prototype.sRotation(up,yaw);
    const cfg=new J.BodyCreationSettings(shape,pos,rot,mass?J.EMotionType_Dynamic:J.EMotionType_Static,mass?1:0);
    cfg.mFriction=.85;cfg.mRestitution=.08;
    if(mass){cfg.mOverrideMassProperties=J.EOverrideMassProperties_CalculateInertia;cfg.mMassPropertiesOverride.mMass=mass;}
    const body=bi.CreateBody(cfg);bi.AddBody(body.GetID(),J.EActivation_Activate);
    J.destroy(cfg);J.destroy(pos);J.destroy(rot);J.destroy(size);
    return body;
  }
  box(0,-1,0,380,2,260);
  for(const b of barriers)box(b.x,.48,b.z,.6,.96,b.length,b.yaw);
  // A shallow launch ramp on the outside of the opening straight; the racing line stays level.
  const rampPos=new J.RVec3(-20,.45,65.2),rampRot= new J.Quat(0,0,Math.sin(.075),Math.cos(.075));
  // Ramp is aligned along world X. Both drawing and collision use the same rotation.
  const rampBody=box(-20,.48,65.2,12,.35,3.7);
  bi.SetPositionAndRotation(rampBody.GetID(),rampPos,rampRot,J.EActivation_DontActivate);
  J.destroy(rampPos);J.destroy(rampRot);
  for(let i=0;i<12;i++) {
    const p={x:32+i*2.4,y:.5,z:65.8};
    props.push({body:box(p.x,p.y,p.z,.8,1,.8,0,24),start:p});
  }
  function addCar(p) {
    const half=new J.Vec3(.95,.40,2.06),offset=new J.Vec3(0,-.32,0);
    const base=new J.BoxShapeSettings(half),shapeSettings=new J.OffsetCenterOfMassShapeSettings(offset,base);
    const shape=shapeSettings.Create().Get(),pos=new J.RVec3(p.x,1.05,p.z),rot=J.Quat.prototype.sRotation(up,p.yaw);
    const cfg=new J.BodyCreationSettings(shape,pos,rot,J.EMotionType_Dynamic,1);
    cfg.mOverrideMassProperties=J.EOverrideMassProperties_CalculateInertia;cfg.mMassPropertiesOverride.mMass=1200;
    cfg.mFriction=.5;cfg.mRestitution=.05;cfg.mLinearDamping=.05;cfg.mAngularDamping=.25;
    cfg.mMotionQuality=J.EMotionQuality_LinearCast;
    const body=bi.CreateBody(cfg);bi.AddBody(body.GetID(),J.EActivation_Activate);
    J.destroy(cfg);J.destroy(pos);J.destroy(rot);J.destroy(half);J.destroy(offset);
    const v=new J.VehicleConstraintSettings();v.mMaxPitchRollAngle=Math.PI/2.6;v.mWheels.clear();
    for(let i=0;i<4;i++) {
      const w=new J.WheelSettingsWV(),wp=new J.Vec3(i%2===0?1.04:-1.04,-.08,i<2?1.48:-1.48);
      w.mPosition=wp;w.mRadius=.46;w.mWidth=.30;
      w.mSuspensionMinLength=.24;w.mSuspensionMaxLength=.48;
      w.mSuspensionSpring.mFrequency=2.4;w.mSuspensionSpring.mDamping=.6;
      w.mMaxSteerAngle=i<2?.52:0;w.mMaxBrakeTorque=2300;w.mMaxHandBrakeTorque=i<2?0:4200;
      w.mLateralFriction.Clear();w.mLateralFriction.AddPoint(0,0);w.mLateralFriction.AddPoint(5,1.65);w.mLateralFriction.AddPoint(30,1.4);w.mLateralFriction.AddPoint(90,1.25);
      v.mWheels.push_back(w);J.destroy(wp);
    }
    const ctl=new J.WheeledVehicleControllerSettings();ctl.mEngine.mMaxTorque=650;
    ctl.mTransmission.mClutchStrength=14;ctl.mDifferentialLimitedSlipRatio=1.4;
    ctl.mDifferentials.clear();
    for(let i=0;i<2;i++) {
      const d=new J.VehicleDifferentialSettings();d.mLeftWheel=i*2;d.mRightWheel=i*2+1;d.mEngineTorqueRatio=.5;d.mLimitedSlipRatio=1.4;
      ctl.mDifferentials.push_back(d);J.destroy(d);
      const a=new J.VehicleAntiRollBar();a.mLeftWheel=i*2;a.mRightWheel=i*2+1;a.mStiffness=6500;v.mAntiRollBars.push_back(a);J.destroy(a);
    }
    v.mController=ctl;
    const constraint=new J.VehicleConstraint(body,v),tester=new J.VehicleCollisionTesterCastCylinder(1,.05);
    constraint.SetVehicleCollisionTester(tester);system.AddConstraint(constraint);
    const listener=new J.VehicleConstraintStepListener(constraint);system.AddStepListener(listener);
    const controller=J.castObject(constraint.GetController(),J.WheeledVehicleController);
    const car={body,constraint,controller,listener,steer:0,input:{},x:p.x,y:1,z:p.z,yaw:p.yaw,speed:0,velocity:0,wheels:[]};
    cars.push(car);return car;
  }
  function reset(car,p) {
    const pos=new J.RVec3(p.x,1.05,p.z),rot=J.Quat.prototype.sRotation(up,p.yaw);
    bi.SetPositionAndRotation(car.body.GetID(),pos,rot,J.EActivation_Activate);
    bi.SetLinearAndAngularVelocity(car.body.GetID(),zero,zero);
    for(let i=0;i<4;i++)car.constraint.GetWheel(i).SetAngularVelocity(0);
    car.controller.SetDriverInput(0,0,1,1);car.steer=0;
    J.destroy(pos);J.destroy(rot);read(car);
  }
  function read(car) {
    const p=car.body.GetPosition(),q=car.body.GetRotation(),vel=car.body.GetLinearVelocity();
    car.x=p.GetX();car.y=p.GetY();car.z=p.GetZ();
    car.q={x:q.GetX(),y:q.GetY(),z:q.GetZ(),w:q.GetW()};
    const fx=2*(car.q.x*car.q.z+car.q.w*car.q.y),fz=1-2*(car.q.x**2+car.q.y**2);
    car.yaw=Math.atan2(fx,fz);car.speed=vel.GetX()*fx+vel.GetZ()*fz;
    car.vx=vel.GetX();car.vz=vel.GetZ();car.velocity=Math.hypot(car.vx,car.vz);
    car.upright=1-2*(car.q.x**2+car.q.z**2);
    for(let i=0;i<4;i++){const w=car.constraint.GetWheel(i);car.wheels[i]={length:w.GetSuspensionLength(),steer:w.GetSteerAngle(),rotation:w.GetRotationAngle(),contact:w.HasContact()};}
  }
  function step(dt,inputs) {
    cars.forEach((car,i)=>{
      const input=inputs[i]||{brake:1},limit=1/(1+Math.max(0,Math.abs(car.speed)-7)*.045);
      car.input=input;car.steer+=(Math.max(-limit,Math.min(limit,input.steer||0))-car.steer)*Math.min(1,dt*7);
      let throttle=input.throttle||0,brake=input.brake||0;
      if(throttle<0&&car.speed>1){throttle=0;brake=1;}
      if(throttle>0&&car.speed< -1){throttle=0;brake=1;}
      car.controller.SetDriverInput(throttle,car.steer,brake,input.handbrake||0);
      bi.ActivateBody(car.body.GetID());
    });
    jolt.Step(dt,2);cars.forEach(read);
  }
  function resetProps(){for(const p of props){const pos=new J.RVec3(p.start.x,p.start.y,p.start.z),q=new J.Quat(0,0,0,1);bi.SetPositionAndRotation(p.body.GetID(),pos,q,J.EActivation_Activate);bi.SetLinearAndAngularVelocity(p.body.GetID(),zero,zero);J.destroy(pos);J.destroy(q);}}
  return {J,jolt,system,bi,cars,props,addCar,reset,resetProps,step,read,box};
}
