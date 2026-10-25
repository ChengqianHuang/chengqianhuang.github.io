import * as T from 'three';
import {batch,material,sign} from './art.mjs';

export function createScenery(scene,track){
  const b=batch(scene),white=material(0xe0ded0,.65,.15),steel=material(0x465456,.5,.6),dark=material(0x263e43,.65),red=material(0xb8573a,.75),stone=material(0xaea28a,.92);
  const clear=(x,z,r=5)=>track.nearest(x,z).distance>track.WIDTH/2+r+2;
  const animated=[];
  if(track.id==='coast'){
    const grass=material(0x7b8251,.95),leaf=material(0x4d6749,.9),bark=material(0x8d7857,.95);leaf.side=T.DoubleSide;
    // A wind farm and a working lighthouse make this circuit recognizable from the grid.
    for(const [x,z] of [[-150,-133],[-78,-137],[0,-138],[80,-137],[152,-129]]){
      b.cylinder(white,x,15,z,.45,.9,30,0,0,16);b.box(white,x,30,z,1.7,1.6,4,0,0,0,.3);
      const rotor=new T.Group(),r=batch(rotor),shape=new T.Shape();
      shape.moveTo(0,.3);shape.lineTo(.7,2);shape.quadraticCurveTo(.8,7,.1,12);shape.lineTo(-.25,11.9);shape.lineTo(-.5,3);shape.closePath();
      for(let j=0;j<3;j++)r.add(new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),white,0,0,0,0,0,j*Math.PI*2/3);
      r.cylinder(steel,0,0,0,.75,.75,.65,0,Math.PI/2);r.finish();rotor.position.set(x,30,z+2.1);scene.add(rotor);animated.push(rotor);
    }
    const lx=210,lz=55;
    b.cylinder(stone,lx,.5,lz,6,7,1,0,0,20);b.cylinder(white,lx,9,lz,2.5,3.8,17,0,0,24);
    b.cylinder(red,lx,7,lz,3.2,3.45,3,0,0,24);b.cylinder(red,lx,14,lz,2.64,2.83,2,0,0,24);
    b.cylinder(dark,lx,18.4,lz,3.1,3.1,1.2,0,0,24);b.cylinder(white,lx,17.8,lz,3.8,3.8,.35,0,0,24);
    b.cylinder(red,lx,20,lz,0,3.8,2.3,0,0,24);
    const glow=material(0xf7dfaa,.2);glow.emissive=new T.Color(0xffcc77);glow.emissiveIntensity=2;
    b.cylinder(glow,lx,18.5,lz,2.2,2.2,.7,0,0,20);
    for(let j=0;j<16;j++){const a=j*Math.PI/8;b.cylinder(steel,lx+Math.cos(a)*3.6,18.2,lz+Math.sin(a)*3.6,.035,.035,.9);}
    // Seawall, rocks and a timber boardwalk on the long coastal straight.
    for(let x=-195;x<=195;x+=9){b.box(stone,x,.25,135,8.8,.5,1.5);b.cylinder(white,x,1,135,.08,.09,1.5);b.beam(white,[x,1.7,135],[x+9,1.7,135],.045);}
    for(let i=0;i<55;i++){const x=-225+(i*43)%450,z=(i%2?1:-1)*(151+i%7);const g=new T.DodecahedronGeometry(2.2+i%4,0);g.scale(1,.65,.8);b.add(g,stone,x,-.4,z,0,i*.7);}
    for(let i=0;i<80;i++)b.box(bark,-100+i*2.5,.10,118,2.4,.18,7);
    for(let i=0;i<11;i++){const x=-150+i*30,z=i%2?13:-42;if(!clear(x,z,7))continue;
      b.cylinder(grass,x,.05,z,7,7,.1,0,0,20);
      b.beam(bark,[x,0,z],[x+1,6,z],.25);
      for(let j=0;j<7;j++){
        const a=j*Math.PI*2/7,vertices=[],uv=[],indices=[];
        for(let k=0;k<=5;k++){const width=Math.sin(k/5*Math.PI)*.65;for(const side of [-1,1]){vertices.push(x+1+Math.cos(a)*k*.9-Math.sin(a)*width*side,6+Math.sin(k/5*Math.PI)*1.15-k*.32,z+Math.sin(a)*k*.9+Math.cos(a)*width*side);uv.push((side+1)/2,k/5);}if(k<5){const q=k*2;indices.push(q,q+2,q+1,q+1,q+2,q+3);}}
        const frond=new T.BufferGeometry();frond.setAttribute('position',new T.Float32BufferAttribute(vertices,3));frond.setAttribute('uv',new T.Float32BufferAttribute(uv,2));frond.setIndex(indices);frond.computeVertexNormals();b.add(frond,leaf);
      }
    }
    for(const [x,z] of [[-200,65],[35,15],[110,15]])if(clear(x,z,9)){
      b.box(white,x,2.3,z,12,4.6,7);b.box(dark,x,4.8,z,13,.3,8);b.box(dark,x,2,z+3.52,8,2.4,.04);
      sign(scene,'COAST CLUB',x,3.8,z+3.55,9,.65,0,{bg:'#d3d4bd',fg:'#335c61',font:65});
    }
    // Low islands on the horizon, beyond the physical course.
    for(let i=0;i<9;i++){const g=new T.ConeGeometry(55+i%3*20,24+i%4*8,7);g.scale(1,.8,1.6);b.add(g,grass,-550+i*130,-8,380+(i%2)*90);}
  }else{
    const walls=[material(0xc3aa84,.85),material(0xc9bd9e,.85),material(0x9faaa0,.85),material(0xb48c6f,.85)],roof=material(0x8e5945,.9),glass=material(0x35535a,.25,.45),shutter=material(0x56746b,.75,.2);
    let n=0;const buildings=[];
    for(let x=-166;x<=166;x+=24)for(let z=-132;z<=124;z+=24){
      if(!clear(x,z,9)||Math.hypot(x-26,z-31)<20)continue;
      buildings.push({x,z});
      const h=7+(n%4)*3,wall=walls[n%4];n++;
      b.box(wall,x,h/2,z,14,h,14);b.box(stone,x,h+.2,z,14.7,.4,14.7);
      b.box(roof,x-3.6,h+1.1,z,7.6,.35,15.4,0,0,.23);b.box(roof,x+3.6,h+1.1,z,7.6,.35,15.4,0,0,-.23);
      for(const side of [-1,1]){
        for(let y=3.5;y<h;y+=3)for(let c=-1;c<=1;c++){
          b.box(stone,x+c*4,y,z+side*7.07,2.3,2.1,.15);b.box(glass,x+c*4,y,z+side*7.17,1.8,1.65,.05);
          b.box(wall,x+c*4,y,z+side*7.23,.09,1.75,.04);b.box(shutter,x+c*4-1.28,y,z+side*7.13,.52,1.8,.08);b.box(shutter,x+c*4+1.28,y,z+side*7.13,.52,1.8,.08);
          b.box(stone,x+c*4,y-1.1,z+side*7.4,2.7,.15,.75);
        }
        b.box(dark,x,1.2,z+side*7.1,2,2.4,.12);
      }
      for(const side of [-1,1])for(let y=3.5;y<h;y+=3)for(let c=-1;c<=1;c++)b.box(glass,x+side*7.06,y,z+c*4,.05,1.65,1.8);
      if(n%3===0){b.box(shutter,x,2.7,z+8.5,10,.15,3,0,.1);sign(scene,['CAFE','MARKET','GARAGE'][n%7%3],x,3.1,z+7.2,8,.65,0,{bg:'#56746b',fg:'#eee3bd',font:70});}
      b.box(stone,x,.1,z,16,.2,16);
    }
    // Clock tower in a clear courtyard beside the southern straight.
    const x=26,z=31;
    if(clear(x,z,6)){
      b.box(stone,x,1,z,10,2,10);b.box(walls[1],x,10,z,6,18,6);b.box(white,x,18.8,z,7,.4,7);b.cylinder(roof,x,21,z,0,5,4,Math.PI/4,0,4);
      for(const side of [-1,1]){
        const face=new T.Mesh(new T.CircleGeometry(1.65,32),white);face.position.set(x,16,z+side*3.04);face.rotation.y=side===1?0:Math.PI;scene.add(face);
        b.box(dark,x,16.45,z+side*3.08,.09,1,.04);b.box(dark,x+.4,16,z+side*3.09,.9,.09,.04);
      }
    }
    const leaf=material(0x5f6e49,.95),wood=material(0x776148,.9);
    for(let i=0;i<28;i++){const x=-165+(i*37)%330,z=-120+(i*61)%240;if(!clear(x,z,5)||buildings.some(p=>Math.abs(p.x-x)<11&&Math.abs(p.z-z)<11)||Math.hypot(x-26,z-31)<9)continue;
      b.cylinder(wood,x,2,z,.16,.28,4);const crown=new T.IcosahedronGeometry(2.7,2);crown.scale(.8,1.3,.8);b.add(crown,leaf,x,5,z);
      b.box(stone,x,.2,z,4,.4,4);
    }
  }
  b.finish();
  return time=>animated.forEach((rotor,i)=>{rotor.rotation.z=time*.3+i;});
}
