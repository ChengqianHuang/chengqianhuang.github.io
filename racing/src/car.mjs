import * as T from 'three';
import {batch,material,sign} from './art.mjs';

export function createCar(color=0xeda931,number='07') {
  const root=new T.Group(),body=new T.Group();root.add(body);
  const paint=new T.MeshPhysicalMaterial({color,metalness:.48,roughness:.28,clearcoat:1,clearcoatRoughness:.16});
  const dark=material(0x172126,.5,.4),rubber=material(0x15191b,.9),chrome=material(0x9aa9ad,.23,.9),black=material(0x080e13,.65),glass=new T.MeshPhysicalMaterial({color:0x213d48,metalness:.6,roughness:.12,clearcoat:1});
  const white=material(0xd9d8ce,.4,.25),hot=new T.MeshStandardMaterial({color:0xffe5ae,emissive:0xffd695,emissiveIntensity:2.2});
  const tail=new T.MeshStandardMaterial({color:0xac160c,emissive:0xff250a,emissiveIntensity:.7});
  const b=batch(body);
  b.box(dark,0,-.14,0,1.92,.47,4.18,0,0,0,.12);
  b.box(paint,0,.17,0,1.93,.48,4.05,0,0,0,.13);
  b.box(paint,0,.46,1.05,1.86,.32,1.75,0,.05,0,.1);
  b.box(dark,0,.636,1.12,1.25,.025,1.5,0,.05);
  for(let i=0;i<6;i++)b.box(black,0,.68,1.25-i*.12,.84,.02,.045,0,.05);
  // Sloping greenhouse: four window panels under a separate roof and roll cage.
  b.box(glass,0,.94,.22,1.55,.78,.05,0,-.42);
  b.box(glass,0,.95,-1.12,1.6,.7,.045,0,.28);
  for(const s of [-1,1]){
    b.box(glass,s*.835,.91,-.42,.04,.66,1.25);
    b.box(paint,s*.9,.44,-.4,.10,.27,1.6,0,0,0,.035);
    b.beam(dark,[s*.9,.43,.5],[s*.75,1.32,.05],.06);
    b.beam(dark,[s*.75,1.32,.05],[s*.77,1.32,-.95],.06);
    b.beam(dark,[s*.77,1.32,-.95],[s*.9,.5,-1.4],.06);
    b.beam(dark,[s*.87,.47,-.65],[s*.79,1.29,-.65],.045);
    b.box(chrome,s*.945,.57,-.70,.06,.045,.2);
    b.box(dark,s*1.03,.84,.27,.25,.15,.25,0,0,0,.03);
    b.box(chrome,s*1.17,.84,.26,.015,.10,.17);
    b.box(dark,s*1.0,-.25,-.05,.14,.14,2.8,0,0,0,.04);
    // Flared wheel arches, shock reservoirs and bright tow points.
    for(const z of [-1.48,1.48]){
      const arc=new T.TorusGeometry(.58,.095,6,20,Math.PI);arc.rotateY(Math.PI/2);
      b.add(arc,dark,s*1.0,-.24,z,0,0,-s*.03);
      b.cylinder(chrome,s*.78,-.35,z,.045,.045,.50);
      b.cylinder(paint,s*.78,-.30,z,.073,.073,.21);
    }
  }
  b.box(paint,0,1.32,-.46,1.68,.13,1.17,0,0,0,.08);
  b.box(dark,0,1.4,-.48,1.18,.035,.84,0,0,0,.02);
  b.box(dark,0,.38,-1.63,1.8,.08,.65);
  for(let i=0;i<7;i++)b.box(chrome,-.72+i*.24,.435,-1.65,.025,.015,.54);
  b.box(dark,0,.1,2.1,2.04,.25,.22,0,0,0,.07);
  b.box(chrome,0,-.20,2.15,1.0,.25,.05,0,-.25);
  b.box(dark,0,.31,2.04,1.3,.23,.045);
  for(let i=0;i<8;i++)b.box(chrome,-.55+i*.16,.32,2.07,.025,.16,.02);
  for(const s of [-1,1]){
    b.box(hot,s*.75,.4,2.045,.32,.17,.055,0,0,0,.025);
    b.box(hot,s*.70,1.45,.045,.27,.08,.10,0,0,0,.025);
    b.box(tail,s*.78,.33,-2.055,.26,.16,.04,0,0,0,.018);
    b.box(paint,s*.55,-.22,2.2,.1,.16,.08);
    b.cylinder(chrome,s*.72,-.28,-2.12,.085,.085,.22,0,Math.PI/2);
  }
  b.box(dark,0,.04,-2.12,2,.18,.17,0,0,0,.04);
  b.box(dark,0,.65,-1.94,1.92,.08,.3,0,-.09);
  b.beam(chrome,[-.65,.4,-1.95],[-.65,.64,-1.95],.025);b.beam(chrome,[.65,.4,-1.95],[.65,.64,-1.95],.025);
  b.finish();
  for(const s of [-1,1])sign(body,number,s*.958,.48,-.35,.45,.31,s*Math.PI/2,{bg:'#e7ded0',fg:'#18262a',font:90});
  sign(body,'HARBOR',0,.06,-2.22,.65,.16,Math.PI,{bg:'#18262a',fg:'#f9e3a9',font:70});
  const wheels=[];
  for(let i=0;i<4;i++){
    const steering=new T.Group(),wheel=new T.Group();steering.add(wheel);root.add(steering);
    const w=batch(wheel),s=i%2===0?1:-1;
    w.cylinder(rubber,0,0,0,.46,.46,.30,0,Math.PI/2,28);
    for(const side of [-1,1]){
      const torus=new T.TorusGeometry(.36,.093,8,28);torus.rotateY(Math.PI/2);w.add(torus,rubber,side*.12,0,0);
      w.cylinder(dark,side*.16,0,0,.29,.29,.04,0,Math.PI/2,24);
      w.cylinder(chrome,side*.19,0,0,.11,.11,.04,0,Math.PI/2,12);
      for(let a=0;a<8;a++){
        const ang=a*Math.PI/4;w.box(chrome,side*.19,Math.sin(ang)*.19,Math.cos(ang)*.19,.035,.045,.20,0,-ang);
        w.cylinder(white,side*.213,Math.sin(ang)*.075,Math.cos(ang)*.075,.014,.014,.02,0,Math.PI/2,6);
      }
    }
    for(let j=0;j<32;j++) {const a=j*Math.PI/16;w.box(rubber,0,Math.sin(a)*.45,Math.cos(a)*.45,.28,.04,.09,0,-a);}
    w.finish();wheels.push({steering,wheel});
  }
  function update(car){root.position.set(car.x,car.y,car.z);root.quaternion.set(car.q.x,car.q.y,car.q.z,car.q.w);
    wheels.forEach(({steering,wheel},i)=>{const w=car.wheels[i];if(!w)return;steering.position.set(i%2===0?1.04:-1.04,-.08-w.length,i<2?1.48:-1.48);steering.rotation.y=w.steer;wheel.rotation.x=w.rotation;});
    tail.emissiveIntensity=car.input.brake||car.input.throttle<0?4:.65;
  }
  return {root,update};
}
