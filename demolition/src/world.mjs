import * as T from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {batch,material,sign} from './art.mjs';
import {MATERIALS,AMMO} from './levels.mjs';

const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function surface(kind){
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),rand=rng(132);
  ctx.fillStyle=kind==='brick'?'#ba795b':kind==='wood'?'#bc9669':kind==='ground'?'#8e958b':'#b6b8ae';ctx.fillRect(0,0,256,256);
  for(let i=0;i<7000;i++){ctx.fillStyle=i%2?'#ffffff12':'#00000013';ctx.fillRect(rand()*256,rand()*256,rand()*3+1,rand()*3+1);}
  if(kind==='brick')for(let row=0;row<8;row++){ctx.fillStyle='#665e4c';ctx.fillRect(0,row*32,256,2);for(let col=-1;col<5;col++)ctx.fillRect(col*64+(row%2)*32,row*32,2,32);}
  if(kind==='wood')for(let i=0;i<80;i++){ctx.strokeStyle=i%2?'#70573c33':'#f0ca9844';ctx.beginPath();ctx.moveTo(0,i*3.2);ctx.bezierCurveTo(90,i*3.2+Math.sin(i)*2,160,i*3.2-2,256,i*3.2);ctx.stroke();}
  if(kind==='ground'){ctx.strokeStyle='#d8d7bf45';ctx.lineWidth=2;ctx.strokeRect(1,1,254,254);}
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;return texture;
}
export async function createWorld(renderer){
  const scene=new T.Scene();scene.background=new T.Color(0xaab8b3);scene.fog=new T.Fog(0xaab8b3,70,180);
  const hdr=await new HDRLoader().loadAsync('/racing/assets/venice_sunset_1k.hdr'),pmrem=new T.PMREMGenerator(renderer);
  scene.environment=pmrem.fromEquirectangular(hdr).texture;scene.environmentIntensity=.6;hdr.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight(0xe5f0e6,0x78654f,2));
  const sun=new T.DirectionalLight(0xffe0b0,3.5);sun.position.set(-20,36,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-26,right:26,top:27,bottom:-25,near:1,far:100});sun.shadow.normalBias=.04;sun.shadow.bias=-.0001;scene.add(sun);
  const textures={wood:surface('wood'),brick:surface('brick'),concrete:surface('concrete')};
  const mats={};for(const [kind,cfg]of Object.entries(MATERIALS)){
    mats[kind]=new T.MeshStandardMaterial({color:cfg.color,roughness:kind==='steel'?.4:.86,metalness:kind==='steel'?.65:0,map:textures[kind]||null});
    if(textures[kind])mats[kind].color.set(0xffffff);
  }
  mats.glass=new T.MeshStandardMaterial({color:0x81b5b6,roughness:.12,metalness:.3,transparent:true,opacity:.74,side:T.DoubleSide});
  const groundTexture=surface('ground');groundTexture.repeat.set(32,32);groundTexture.anisotropy=8;
  const ground=new T.Mesh(new T.PlaneGeometry(160,160),new T.MeshStandardMaterial({map:groundTexture,roughness:.94}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.position.y=-.02;scene.add(ground);
  const b=batch(scene),dark=material(0x30474a,.65,.3),yellow=material(0xe2b954,.6,.3),white=material(0xe5dfc5),rust=material(0xab6b4b),steel=material(0x6c7d78,.5,.6);
  // Work perimeter and the painted safety zone.
  for(const x of [-14,14])b.box(yellow,x,.008,0,.12,.015,23);
  for(const z of [-11.5,11.5])b.box(yellow,0,.008,z,28,.015,.12);
  for(let i=0;i<25;i++)for(const z of [-12.5,12.5])b.box(yellow,-14+i*1.15,.01,z,.6,.015,1,Math.PI/5);
  for(let i=0;i<18;i++){const x=-28+i*3.2;for(const z of [-19,19]){b.box(white,x,.7,z,2.7,1.4,.6);b.box(yellow,x,1,z+.31,2.65,.45,.03);b.box(dark,x,1,z+.33,.25,.46,.035,-.45);}}
  for(const x of [-29,29])for(let z=-17;z<18;z+=3.5){b.cylinder(rust,x,.45,z,.1,.38,.9);b.cylinder(white,x,.58,z,.19,.22,.17);}
  sign(scene,'DEMOLITION  CO.',0,.025,14.5,10,1.1,-Math.PI/2,{bg:'#8e958b',fg:'#e8dfb8',font:68}).rotation.set(-Math.PI/2,0,0);
  // Crane lattice, cables and a suspended hook.
  const cx=-20,cz=-12;
  for(const x of [-1,1])for(const z of [-1,1])b.box(yellow,cx+x,11,cz+z,.22,22,.22);
  for(let y=0;y<22;y+=2.5){for(const side of [-1,1]){b.beam(yellow,[cx-1,y,cz+side],[cx+1,y+2.5,cz+side],.09);b.beam(yellow,[cx+side,y,cz-1],[cx+side,y+2.5,cz+1],.09);}}
  b.box(yellow,cx+6,22,cz,24,.35,1.8);b.box(yellow,cx+6,24,cz,24,.25,.5);
  for(let x=-6;x<18;x+=2){b.beam(yellow,[cx+x,22,cz-.8],[cx+x+2,24,cz],.09);b.beam(yellow,[cx+x,22,cz+.8],[cx+x+2,24,cz],.09);}
  b.box(dark,cx-5,22.7,cz,3,2,3);b.box(mats.glass,cx+1,21.3,cz+1.2,2.2,1.7,1.5);
  b.beam(dark,[cx+13,22,cz],[cx+13,9,cz],.045);b.box(dark,cx+13,8.7,cz,.8,.5,.55);
  // Site office and stacked materials outside the demolition perimeter.
  for(let k=0;k<2;k++){const x=18+k*6,z=-18;b.box(k?rust:steel,x,1.5,z,5,3,3.6);b.box(dark,x,3.05,z,5.2,.15,3.8);for(let i=0;i<12;i++)b.box(steel,x-2.3+i*.42,1.5,z+1.82,.045,2.8,.06);}
  sign(scene,'SITE OFFICE',18,2.2,-16.14,4,.65,0,{bg:'#3f5c5a',font:68});
  for(let i=0;i<9;i++)b.box(mats.wood,21+(i%3)*1.4,.25+Math.floor(i/3)*.55,9,1.3,.5,3);
  for(const x of [-25,25]){b.cylinder(steel,x,6,13,.09,.18,12);b.box(dark,x,12,13,2,.25,1);}
  const rand=rng(847),city=[material(0x8b9992),material(0x9ea49a),material(0x8d958b)];
  for(let i=0;i<44;i++){const x=(i-22)*7,z=-60-rand()*35,h=6+rand()*22;b.box(city[i%3],x,h/2,z,5+rand()*4,h,6);for(let y=3;y<h;y+=3)b.box(steel,x,y,z+3.1,4,.7,.03);}
  b.finish();
  const levelGroup=new T.Group();scene.add(levelGroup);let meshes=[],shells=new Map(),line,protectedMesh,level;
  const boxGeometry=new T.BoxGeometry(1,1,1),sphereGeometry=new T.SphereGeometry(.325,16,12),shellMats=Object.fromEntries(Object.entries(AMMO).map(([key,cfg])=>[key,new T.MeshStandardMaterial({color:cfg.color,metalness:.7,roughness:.3})]));
  const target=new T.Group(),ring=new T.Mesh(new T.RingGeometry(.28,.33,32),new T.MeshBasicMaterial({color:0xffdb7c,depthTest:false,transparent:true,opacity:.9,side:T.DoubleSide}));target.add(ring);target.renderOrder=10;scene.add(target);target.visible=false;
  const pulseMaterial=new T.MeshBasicMaterial({color:0xffc669,transparent:true,opacity:0,depthWrite:false}),pulse=new T.Mesh(new T.SphereGeometry(1,24,16),pulseMaterial);scene.add(pulse);let pulseAge=2,shake=0;
  const count=420,pos=new Float32Array(count*3),alpha=new Float32Array(count),sizes=new Float32Array(count),life=new Float32Array(count),vel=new Float32Array(count*3);pos.fill(-1000);let cursor=0;
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));pg.setAttribute('alpha',new T.BufferAttribute(alpha,1));pg.setAttribute('size',new T.BufferAttribute(sizes,1));
  const dust=new T.Points(pg,new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{ratio:{value:Math.min(devicePixelRatio,1.5)}},vertexShader:'attribute float alpha;attribute float size;varying float vAlpha;uniform float ratio;void main(){vAlpha=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=min(130.,size*240.*ratio/max(1.,-p.z));}',fragmentShader:'varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;float a=exp(-r*r*3.)*smoothstep(1.,.6,r)*vAlpha*.22;gl_FragColor=vec4(.66,.63,.55,a);}'}));dust.frustumCulled=false;scene.add(dust);
  const sharedMaterials=new Set([...Object.values(mats),...Object.values(shellMats),dark,yellow,white,steel,rust]);
  function reset(engine){
    level=engine.level;
    levelGroup.traverse(o=>{if(o.userData.disposable){o.geometry?.dispose();if(o.material&&!sharedMaterials.has(o.material)){o.material.map?.dispose();o.material.dispose();}}});levelGroup.clear();meshes=[];shells.clear();life.fill(0);alpha.fill(0);shake=0;
    for(const e of engine.blocks){const mesh=new T.Mesh(boxGeometry,mats[e.kind]);mesh.scale.set(e.sx,e.sy,e.sz);mesh.position.set(e.x,e.y,e.z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.block=e;levelGroup.add(mesh);meshes.push(mesh);
      if(e.role==='column'){const band=new T.Mesh(boxGeometry,yellow);band.scale.set(1.06,.055,1.06);band.position.y=.31;mesh.add(band);}
      if(e.role==='window'){const frame=new T.Mesh(boxGeometry,steel);frame.scale.set(.035,1.02,1.8);mesh.add(frame);}
      if(e.role==='barrel'){const stripe=new T.Mesh(boxGeometry,dark);stripe.scale.set(1.02,.18,1.02);mesh.add(stripe);}
    }
    const geometry=new T.BufferGeometry().setFromPoints([[-13,level.line,-10],[13,level.line,-10],[13,level.line,10],[-13,level.line,10],[-13,level.line,-10]].map(p=>new T.Vector3(...p)));
    line=new T.Line(geometry,new T.LineDashedMaterial({color:0xffd36e,dashSize:.65,gapSize:.3,transparent:true,opacity:.7}));line.computeLineDistances();line.userData.disposable=true;levelGroup.add(line);
    protectedMesh=null;
    if(level.protect){const p=level.protect,g=new T.Group();g.position.set(p.x,0,p.z);levelGroup.add(g);const s=batch(g);s.box(material(0x569c9b),0,1.65,0,p.w,3.3,p.d);s.box(dark,0,3.45,0,p.w+.5,.3,p.d+.5);s.box(mats.glass,0,1.7,p.d/2+.04,1.9,1.1,.05);s.box(white,0,.015,0,p.w+1.5,.03,p.d+1.5);s.finish();g.traverse(o=>{if(o.geometry)o.userData.disposable=true;});sign(g,'KEEP / 保留',0,2.75,p.d/2+.08,p.w-.2,.5,0,{bg:'#315e5f',fg:'#e7eedc',font:50}).userData.disposable=true;protectedMesh=g;
      const hit=new T.Mesh(boxGeometry,dark);hit.visible=false;hit.scale.set(p.w,3.4,p.d);hit.position.set(p.x,1.7,p.z);hit.userData.protected=true;levelGroup.add(hit);protectedMesh=hit;
    }
  }
  const replayRotation=new T.Quaternion();
  function sync(snapshot,next=null,mix=0){
    snapshot.blocks.forEach((v,i)=>{const n=next?.blocks[i]||v;meshes[i].position.set(v[0]+(n[0]-v[0])*mix,v[1]+(n[1]-v[1])*mix,v[2]+(n[2]-v[2])*mix);meshes[i].quaternion.set(v[3],v[4],v[5],v[6]);if(next)meshes[i].quaternion.slerp(replayRotation.set(n[3],n[4],n[5],n[6]),mix);});
    const present=new Set();for(const e of snapshot.balls){present.add(e.id);let mesh=shells.get(e.id);if(!mesh){mesh=new T.Mesh(sphereGeometry,shellMats[e.ammo]);mesh.castShadow=true;levelGroup.add(mesh);shells.set(e.id,mesh);}mesh.visible=true;const n=next?.balls.find(b=>b.id===e.id)?.p||e.p;mesh.position.set(e.p[0]+(n[0]-e.p[0])*mix,e.p[1]+(n[1]-e.p[1])*mix,e.p[2]+(n[2]-e.p[2])*mix);}
    for(const [id,mesh]of shells)if(!present.has(id)){levelGroup.remove(mesh);shells.delete(id);}
  }
  function emit(event){
    const amount=event.type==='impact'?45:event.type==='break'?Math.min(12,4+event.size*2):7;
    if(event.type==='impact'){pulse.position.copy(event.p);pulseAge=0;shake=.28;}
    if(event.type==='shot')return;
    for(let n=0;n<amount;n++){const i=cursor++%count;life[i]=1.4+Math.random()*1.8;alpha[i]=.9;sizes[i]=.3+Math.random()*.7;pos[i*3]=event.p.x+(Math.random()-.5)*.6;pos[i*3+1]=Math.max(.2,event.p.y);pos[i*3+2]=event.p.z+(Math.random()-.5)*.6;vel[i*3]=(Math.random()-.5)*3;vel[i*3+1]=.8+Math.random()*1.5;vel[i*3+2]=(Math.random()-.5)*3;}
  }
  function update(dt){
    shake=Math.max(0,shake-dt);pulseAge+=dt;pulse.visible=pulseAge<.3;pulse.scale.setScalar(.5+pulseAge*10);pulseMaterial.opacity=Math.max(0,.17-pulseAge*.6);
    for(let i=0;i<count;i++)if(life[i]>0){life[i]-=dt;alpha[i]=Math.max(0,life[i]/3);sizes[i]+=dt*.4;pos[i*3]+=vel[i*3]*dt;pos[i*3+1]+=vel[i*3+1]*dt;pos[i*3+2]+=vel[i*3+2]*dt;}
    for(const key of ['position','alpha','size'])pg.attributes[key].needsUpdate=true;
  }
  function aim(hit,camera){target.visible=!!hit;if(!hit)return;target.position.copy(hit.point);target.quaternion.copy(camera.quaternion);ring.material.color.set(hit.object.userData.protected?0xf18c72:0xffdb7c);}
  return {scene,sun,reset,sync,emit,update,aim,get pickables(){return protectedMesh?[...meshes,protectedMesh]:meshes;},get shake(){return shake;},showEffects(value){dust.visible=value;pulse.visible=false;target.visible=false;}};
}
