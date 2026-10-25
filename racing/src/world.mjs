import * as T from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import {batch,material,sign,labelTexture} from './art.mjs';
import {TRACKS,GATES} from './track.mjs';
import {createScenery} from './scenery.mjs';

function ribbon(sample,offset,width,y) {
  const vertices=[],uv=[],index=[];
  for(let i=0;i<=720;i++)for(const side of [-1,1]){
    const p=sample(i/720,offset+side*width/2);vertices.push(p.x,y,p.z);uv.push(p.x/3,p.z/3);
    if(i<720&&side===-1){const a=i*2;index.push(a,a+2,a+1,a+1,a+2,a+3);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g;
}
let sharedAssets;
async function loadAssets(renderer){
  const loader=new T.TextureLoader();
  const textures=await Promise.all(['diff','normal','rough'].map(t=>loader.loadAsync(`/racing/assets/asphalt_${t}.jpg`)));
  textures.forEach(t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());});textures[0].colorSpace=T.SRGBColorSpace;
  const hdr=await new HDRLoader().loadAsync('/racing/assets/venice_sunset_1k.hdr');
  const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromEquirectangular(hdr).texture;hdr.dispose();pmrem.dispose();
  return {textures,environment};
}
export async function createWorld(scene,renderer,physics,progress,track=TRACKS[0]) {
  const {sample,LENGTH,WIDTH,barriers,nearest}=track;
  const {textures,environment}=await (sharedAssets??=loadAssets(renderer));
  scene.environment=environment;scene.environmentIntensity=.65;
  progress(`正在布置${track.name}…`);
  scene.fog=new T.FogExp2(track.id==='coast'?0xb0c5c4:track.id==='oldtown'?0xb8ae98:0xbeb8a6,.0016);
  const sky=new T.Mesh(new T.SphereGeometry(900,32,20),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{horizon:{value:new T.Vector3(...(track.id==='coast'?[.50,.64,.68]:track.id==='oldtown'?[.69,.51,.35]:[.69,.60,.44]))}},
    vertexShader:'varying vec3 vPos;void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform vec3 horizon;varying vec3 vPos;float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}void main(){vec3 d=normalize(vPos);float h=max(d.y,0.);vec3 col=mix(horizon,vec3(.19,.36,.48),pow(h,.38));float cloud=noise(d.xz/(h+.18)*3.)*.6+noise(d.xz/(h+.18)*8.)*.25;float c=smoothstep(.48,.70,cloud)*smoothstep(.02,.2,h)*(1.-smoothstep(.5,.9,h));col=mix(col,vec3(.72,.70,.62),c*.42);float sun=pow(max(dot(d,normalize(vec3(-.65,.28,-.6))),0.),90.);col+=vec3(.75,.38,.12)*sun*.6;gl_FragColor=vec4(col,1.);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')
  }));scene.add(sky);
  const sunDirection=new T.Vector3(-.65,.28,-.6).normalize();
  const solar=new T.Mesh(new T.SphereGeometry(6.5,24,16),new T.MeshBasicMaterial({color:0xffe3a1,fog:false}));solar.position.copy(sunDirection).multiplyScalar(700);scene.add(solar);
  scene.add(new T.HemisphereLight(0xb6d3de,0x625443,.85));
  const sun=new T.DirectionalLight(0xffcc8d,3.1);sun.position.copy(sunDirection).multiplyScalar(100);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;sun.shadow.camera.near=1;sun.shadow.camera.far=240;sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun,sun.target);
  const concrete=material(0x9b9586,.95),steel=material(0x465456,.5,.65),dark=material(0x283c41,.7,.45),white=material(0xd8d3bb,.85),orange=material(0xd96c37,.65),red=material(0xaf4934,.7);
  const groundCanvas=document.createElement('canvas');groundCanvas.width=groundCanvas.height=512;const gc=groundCanvas.getContext('2d');gc.fillStyle=track.id==='coast'?'#a49b75':track.id==='oldtown'?'#8b887c':'#7a7b70';gc.fillRect(0,0,512,512);
  let gritSeed=311;for(let i=0;i<38000;i++){gritSeed=(gritSeed*1664525+1013904223)>>>0;const x=(gritSeed>>>16)%512;gritSeed=(gritSeed*1664525+1013904223)>>>0;const y=(gritSeed>>>16)%512;gc.fillStyle=i%2?'#ffffff09':'#00000014';gc.fillRect(x,y,1+i%3,1+i%3);}
  gc.strokeStyle='#252d2728';gc.lineWidth=1;for(let i=0;i<8;i++){gc.beginPath();gc.moveTo(i*73,0);gc.lineTo(i*73+20,200);gc.lineTo(i*73-9,512);gc.stroke();}
  const groundTexture=new T.CanvasTexture(groundCanvas);groundTexture.wrapS=groundTexture.wrapT=T.RepeatWrapping;groundTexture.repeat.set(32,22);groundTexture.colorSpace=T.SRGBColorSpace;groundTexture.anisotropy=8;
  const groundMaterial=new T.MeshStandardMaterial({map:groundTexture,roughness:.92,bumpMap:groundTexture,bumpScale:.08});
  const ground=new T.Mesh(new T.BoxGeometry(track.ground[0],3,track.ground[1]),groundMaterial);ground.position.y=-1.5;ground.receiveShadow=true;scene.add(ground);
  const asphalt=new T.MeshStandardMaterial({color:0x878b88,map:textures[0],normalMap:textures[1],roughnessMap:textures[2],roughness:.9,normalScale:new T.Vector2(.55,.55)});
  const shoulder=new T.Mesh(ribbon(sample,0,WIDTH+2.2,.012),material(0xc0b69c,.9));shoulder.receiveShadow=true;scene.add(shoulder);
  const road=new T.Mesh(ribbon(sample,0,WIDTH,.024),asphalt);road.receiveShadow=true;scene.add(road);
  const b=batch(scene);
  for(const side of [-1,1]){
    const line=new T.Mesh(ribbon(sample,side*(WIDTH/2-.3),.13,.035),white);line.receiveShadow=true;scene.add(line);
    for(let i=0;i<240;i++){
      const p=sample(i/240,side*(WIDTH/2+.2));b.box(i%2?white:red,p.x,.06,p.z,.55,.10,LENGTH/240+.04,p.yaw);
    }
  }
  for(let i=0;i<95;i++) {const p=sample(i/95);b.box(white,p.x,.037,p.z,.11,.006,2.2,p.yaw);}
  for(const r of barriers){b.box(concrete,r.x,.22,r.z,.65,.44,r.length,r.yaw);b.box(steel,r.x,.73,r.z,.14,.25,r.length,r.yaw);b.box(steel,r.x,.49,r.z,.13,.66,.13,r.yaw);}
  const [groundWidth,groundDepth]=track.ground;
  const seam=material(0x686b61,.95);for(let x=-groundWidth/2+10;x<groundWidth/2;x+=15)b.box(seam,x,.008,0,.035,.012,groundDepth-8);
  for(const z of [-groundDepth/2+1,groundDepth/2-1]){
    b.box(dark,0,-.5,z,groundWidth,1.5,.7);
    if(track.id==='harbor')for(let x=-180;x<=180;x+=12){b.cylinder(dark,x,.3,z-Math.sign(z)*2,.27,.4,.6);b.cylinder(orange,x,.62,z-Math.sign(z)*2,.42,.42,.12);}
  }
  // The gantry and checker line use the actual start tangent on every circuit.
  const start=sample(0),span=WIDTH+4;
  for(const side of [-1,1]){const p=sample(0,side*span/2);b.box(steel,p.x,3.2,p.z,.5,6.4,.5);}
  b.box(dark,start.x,6.25,start.z,span+.5,1.45,.5,start.yaw);
  for(const side of [-1,1])sign(scene,track.label,start.x+start.tx*.28*side,6.2,start.z+start.tz*.28*side,span-2,1.05,start.yaw+(side===1?0:Math.PI),{bg:'#17343b',fg:'#f2dda5',font:65});
  for(let row=0;row<3;row++)for(let j=0;j<16;j++){
    const p=sample(0,(j-7.5)*WIDTH/16);b.box((row+j)%2?white:dark,p.x+start.tx*(row-1)*.65,.043,p.z+start.tz*(row-1)*.65,WIDTH/16,.015,.65,start.yaw);
  }
  for(let i=0;i<4;i++){const p=track.grid(i);b.box(white,p.x,.045,p.z,2.2,.015,.12,p.yaw);}
  if(track.ramp){const {x,z}=track.ramp;
    b.box(steel,x,.45,z,12,.35,3.7,0,0,.15);
    for(let i=0;i<6;i++)b.box(orange,x-4+i*1.65,.63+(-4+i*1.65)*.15,z,.18,.03,3.65,0,0,.15);
  }
  let updateScenery=()=>{};
  if(track.id==='harbor'){
  // Shipping containers have corrugations, corner castings, door bars and labels.
  const containerMats=[material(0x3f696b,.77,.25),material(0xaf6042,.8,.2),material(0xc3aa68,.8,.2),material(0x546e78,.8,.2)];
  function container(x,z,y=0,color=0,yaw=0){
    const mat=containerMats[color%4],g=new T.Group(),q=batch(g);
    q.box(mat,0,y+1.45,0,12,2.9,2.7,0,0,0,.035);
    for(let i=0;i<38;i++)for(const side of [-1,1])q.box(mat,-5.8+i*.31,y+1.45,side*1.365,.075,2.7,.06);
    for(let i=0;i<9;i++)q.box(mat,0,y+2.93,-1.2+i*.3,11.9,.04,.045);
    for(const side of [-1,1]){q.box(steel,side*6.02,y+1.45,0,.06,2.85,.055);for(const z of [-.9,.9])q.box(steel,side*6.07,y+1.45,z,.07,2.7,.045);}
    for(const side of [-1,1])for(const h of [y+.10,y+2.8]){q.box(steel,side*5.9,h,1.38,.18,.18,.12);q.box(steel,side*5.9,h,-1.38,.18,.18,.12);}
    q.finish();g.position.set(x,0,z);g.rotation.y=yaw;scene.add(g);
    if(y===0)sign(g,'NORTH • FREIGHT',0,y+1.6,1.41,6,.45,0,{bg:'#36535a',fg:'#ede7d1',font:65});
  }
  for(let row=0;row<5;row++)for(let col=0;col<4;col++){
    const x=-10+col*15,z=-4+row*4.1;container(x,z,0,(row+col)%4);
    if((row+col)%3!==0)container(x,z,2.9,(row+col+1)%4);
    if(row===2&&col===2)container(x,z,5.8,0);
  }
  for(let i=0;i<8;i++){container(-110+i*26,-108,0,i%4);if(i%2)container(-110+i*26,-108,2.9,0);}
  function crane(x,z,turn=0){
    const g=new T.Group(),c=batch(g),m=material(0xc2a774,.65,.45);
    for(const s of [-1,1])for(const r of [-1,1]){c.beam(m,[s*8,0,r*5],[s*5,27,r*4],.48);c.box(dark,s*8,.65,r*5,3,1.3,2);}
    for(const h of [8,17,27]){c.beam(m,[-7,h,-4],[7,h,-4],.32);c.beam(m,[-7,h,4],[7,h,4],.32);}
    for(const s of [-1,1]){c.beam(m,[-6,8,s*4],[6,17,s*4],.19);c.beam(m,[6,8,s*4],[-6,17,s*4],.19);c.beam(m,[-6,17,s*4],[6,27,s*4],.19);}
    c.box(m,0,29,8,11,2,45);c.box(m,0,34,0,.6,10,.6);
    c.beam(steel,[0,39,0],[0,30,30],.12);c.beam(steel,[0,39,0],[0,30,-14],.12);
    for(const s of [-1,1]){c.beam(steel,[s*3,29,23],[s*3,10,23],.045);c.box(dark,s*3,10,23,.4,.4,3);}
    c.box(dark,0,26.5,8,3,2.8,4);c.box(material(0x4f737a,.25,.5),0,26.7,10.03,2.6,1.9,.04);
    for(let i=-13;i<30;i+=3)c.beam(m,[-5,30,i],[5,30,i+3],.12);
    c.finish();g.position.set(x,0,z);g.rotation.y=turn;scene.add(g);
  }
  crane(80,107);crane(-80,-105,Math.PI);crane(151,-100,Math.PI/2);
  // Warehouses and recognizable industrial roof profiles.
  for(const [x,z] of [[-79,0],[90,-10]]){
    b.box(material(0x89908b,.8,.2),x,5,z,26,10,20);
    b.box(steel,x-6.5,10.9,z,13.8,.3,22,0,0,.14);b.box(steel,x+6.5,10.9,z,13.8,.3,22,0,0,-.14);
    for(let i=0;i<4;i++){b.box(dark,x-9+i*6,2.5,z+10.04,4.5,4.8,.05);for(let j=0;j<9;j++)b.box(steel,x-9+i*6,j*.5+.4,z+10.08,4.5,.045,.04);}
    sign(scene,'DOCK  04',x,7.8,z+10.06,14,1.8,0,{bg:'#77847c',font:75});
  }
  // Distant skyline stays outside the playable quay.
  let seed=31;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const cityMats=[material(0x777e7a),material(0x848a82),material(0x9c9e8f)];
  for(let i=0;i<90;i++){
    const x=(rand()-.5)*1200,z=-350-rand()*240,h=12+rand()**2*85,w=14+rand()*25;
    b.box(cityMats[i%3],x,h/2-4,z,w,h,14+rand()*20);
    b.box(steel,x,h-3,z,w*.5,1.8,8);
    for(let f=8;f<h;f+=5){b.box(steel,x,f-4,z+18,w*.90,1.1,.05);for(let col=-w/2+2;col<w/2;col+=4)b.box(cityMats[i%3],x+col,f-4,z+18.05,.6,1.2,.05);}
  }
  // Tug and cargo ship alongside the quay.
  const ship=new T.Group(),s=batch(ship);
  s.box(dark,0,-1.6,0,24,5,88,0,0,0,2);s.box(red,0,-3.1,0,23.9,2,87,0,0,0,2);
  s.box(concrete,0,1,0,22,.4,80);s.box(white,0,6,-29,18,10,13);s.box(dark,0,9.4,-22.4,17,2,.1);
  for(let i=0;i<6;i++)for(let j=0;j<3;j++)s.box(containerMats[(i+j)%4],-7+j*7,3.5,-12+i*8,6,5,7.5);
  s.box(steel,0,13,-30,2,5,2);s.finish();ship.position.set(55,-.6,180);ship.rotation.y=Math.PI/2;scene.add(ship);
  // Loading yard markings, pallets, bollards and landscaped islands break up the empty apron.
  const faded=material(0xbcaa72,.9),wood=material(0x8e7250,.95),leaf=material(0x4a5b3a,.95),trunk=material(0x66513b,.95);
  for(let i=0;i<8;i++){const x=-60+i*11;b.box(faded,x,.025,33,.15,.01,13);b.box(faded,x+5,.025,26.5,10,.01,.15);}
  for(let i=0;i<35;i++){const x=-90+rand()*180,z=-22+rand()*43;if(nearest(x,z).distance<14||Math.abs(x)<60&&z> -8)continue;
    for(let layer=0;layer<2+i%3;layer++){for(let slat=0;slat<5;slat++)b.box(wood,x+(slat-2)*.22,.1+layer*.2,z,.17,.08,1.2);b.box(wood,x-.42,.05+layer*.2,z,.12,.1,1.2);b.box(wood,x+.42,.05+layer*.2,z,.12,.1,1.2);}
  }
  for(const [x,z] of [[-107,17],[-96,28],[-46,-12],[-38,4],[63,28],[103,21],[-159,-36],[-155,-12],[156,14]]){
    b.box(concrete,x,.25,z,5,.5,5);b.box(leaf,x,.52,z,4.8,.08,4.8);
    b.cylinder(trunk,x,2.5,z,.17,.27,4);
    for(let j=0;j<4;j++){const crown=new T.IcosahedronGeometry(2.1+j*.18,1);crown.scale(1,1.25,1);b.add(crown,leaf,x+Math.cos(j*2)*1.1,5+j*.4,z+Math.sin(j*2)*1.1);}
  }
  for(let i=0;i<20;i++){const p=sample(i/20,11.3);b.cylinder(orange,p.x,.4,p.z,.12,.16,.8);b.cylinder(white,p.x,.50,p.z,.165,.165,.14);}
  }else updateScenery=createScenery(scene,track);
  // Corner boards, warning chevrons and light masts.
  for(let i=0;i<16;i++){
    const p=sample(i/16,WIDTH/2+3.8);b.cylinder(steel,p.x,4.5,p.z,.1,.18,9);
    b.box(dark,p.x,9,p.z,1.8,.18,.5,p.yaw);
    b.box(new T.MeshStandardMaterial({color:0xffe2a0,emissive:0xffc76d,emissiveIntensity:2}),p.x,8.9,p.z,1.5,.03,.35,p.yaw);
    if(i>3&&i%2===0){const board=sample(i/16,-WIDTH/2-2.2),after=sample(i/16+.02);const turn=Math.atan2(Math.sin(after.yaw-board.yaw),Math.cos(after.yaw-board.yaw));sign(scene,turn<0?'❯  ❯  ❯':'❮  ❮  ❮',board.x,1.55,board.z,6,1.25,board.yaw+Math.PI,{bg:'#233b40',fg:'#f0bc59',font:78});}
  }
  b.finish();
  const water=new T.Mesh(new T.PlaneGeometry(2400,2400,1,1),new T.ShaderMaterial({uniforms:{time:{value:0}},transparent:false,
    vertexShader:'varying vec3 vWorld;void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}',
    fragmentShader:`uniform float time;varying vec3 vWorld;void main(){vec3 v=normalize(cameraPosition-vWorld);float a=sin(vWorld.x*.18+time*.65)+sin(vWorld.z*.27-time*.8);vec3 n=normalize(vec3(cos(vWorld.x*.18+time*.65)*.1,1.,cos(vWorld.z*.27-time*.8)*.12));float fres=pow(1.-max(dot(v,n),0.),3.);float sparkle=pow(max(dot(reflect(-normalize(vec3(-.65,.28,-.6)),n),v),0.),170.);vec3 col=mix(vec3(.035,.15,.18),vec3(.42,.51,.49),fres)+vec3(1.,.65,.28)*sparkle*1.9;col+=a*.008;float fog=1.-exp(-length(cameraPosition-vWorld)*.0018);col=mix(col,vec3(.52,.55,.50),fog);gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
  }));water.rotation.x=-Math.PI/2;water.position.y=-1.8;scene.add(water);
  const props=physics.props.map(()=>{const g=new T.Group(),p=batch(g);p.box(material(0xb39561,.9),0,0,0,.8,1,.8);for(const y of [-.35,.35])p.box(dark,0,y,0,.82,.075,.82);p.finish();scene.add(g);return g;});
  const gate=new T.Group();const gateMat=new T.MeshBasicMaterial({color:0xf7c45a,transparent:true,opacity:.65,depthWrite:false});
  for(const side of [-1,1]){const mesh=new T.Mesh(new T.ConeGeometry(.32,1.4,4),gateMat);mesh.position.set(side*(WIDTH/2-1),1.2,0);mesh.rotation.z=Math.PI;gate.add(mesh);}scene.add(gate);
  return {sun,water,gate,dispose(){
    const geometries=new Set(),materials=new Set(),maps=new Set(),shared=new Set([...textures,environment]);
    scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const value of Object.values(m))if(value?.isTexture&&!shared.has(value))maps.add(value);}o.shadow?.dispose();});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());maps.forEach(t=>t.dispose());scene.clear();
  },update(time,car,next){updateScenery(time);water.material.uniforms.time.value=time;sun.position.set(car.x,0,car.z).addScaledVector(sunDirection,110);sun.target.position.set(car.x,0,car.z);const p=sample(next/GATES);gate.position.set(p.x,.25+Math.sin(time*2)*.13,p.z);gate.rotation.y=p.yaw;
    props.forEach((mesh,i)=>{const p=physics.props[i].body.GetPosition(),q=physics.props[i].body.GetRotation();mesh.position.set(p.GetX(),p.GetY(),p.GetZ());mesh.quaternion.set(q.GetX(),q.GetY(),q.GetZ(),q.GetW());});}};
}
