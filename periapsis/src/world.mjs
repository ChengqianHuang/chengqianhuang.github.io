import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createShip,createStation,glowTexture} from './art.mjs';
import {createCosmos} from './cosmos.mjs';
import {rng,pathAt} from './flight.mjs';

export async function createWorld(canvas){
  const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(58,1,.3,20000),clock={value:0};
  const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;scene.environmentIntensity=.5;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight(0x8db9e7,0x101722,.45));const sunlight=new T.DirectionalLight(0xffe1b4,2.8);sunlight.position.set(-60,45,40);scene.add(sunlight);
  const rim=new T.DirectionalLight(0x4dcbff,1.2);rim.position.set(30,-10,-60);scene.add(rim);
  const cosmos=await createCosmos();scene.add(cosmos.root);const ship=createShip();scene.add(ship.root);
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new T.Vector2(800,500),.35,.6,1.4);composer.addPass(bloom);
  const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},time:clock,boost:{value:0},damage:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform float time;uniform float boost;uniform float damage;varying vec2 vUv;void main(){vec2 d=vUv-.5;vec3 c=texture2D(tDiffuse,vUv).rgb;float v=dot(d,d);c*=1.-v*.7;c+=vec3(.3,.012,.002)*damage*v*2.;gl_FragColor=vec4(c,1.);}`});composer.addPass(grade);composer.addPass(new OutputPass());
  const metal=new T.MeshStandardMaterial({color:0x263641,metalness:.85,roughness:.32}),gateGlow=new T.MeshBasicMaterial({color:new T.Color(.15,1.8,2.1)}),goldGlow=new T.MeshBasicMaterial({color:new T.Color(2.1,1.1,.3)});
  const activeMetal=new T.MeshStandardMaterial({color:0xa08352,metalness:.75,roughness:.35});
  const gateBody=new T.TorusGeometry(12.5,.5,8,72),gateInner=new T.TorusGeometry(12,.17,6,72),gateOuter=new T.TorusGeometry(13,.06,6,72),gatePylon=new T.BoxGeometry(1.25,2.4,2.8);
  const gateGroups=[],courseRoot=new T.Group();scene.add(courseRoot);
  const stations=[createStation(135),createStation(170),createStation(145)];stations.forEach(s=>scene.add(s));
  const rockGeo=mergeVertices(new T.IcosahedronGeometry(1,4)),pos=rockGeo.attributes.position;
  for(let i=0;i<pos.count;i++){const v=new T.Vector3().fromBufferAttribute(pos,i);const rough=1+Math.sin(v.x*17+v.y*11)*Math.sin(v.z*13+v.x*5)*.11;v.multiplyScalar(rough);pos.setXYZ(i,v.x,v.y,v.z);}rockGeo.computeVertexNormals();
  const rockCanvas=document.createElement('canvas');rockCanvas.width=rockCanvas.height=256;const rc=rockCanvas.getContext('2d'),noiseImage=rc.createImageData(256,256),rr=rng(55);for(let i=0;i<256*256;i++){const x=i%256,y=Math.floor(i/256),v=85+rr()*70+Math.sin(x*.14)*Math.cos(y*.16)*25;noiseImage.data.set([v,v*.95,v*.91,255],i*4);}rc.putImageData(noiseImage,0,0);const rockTexture=new T.CanvasTexture(rockCanvas);rockTexture.wrapS=rockTexture.wrapT=T.RepeatWrapping;rockTexture.repeat.set(2,2);rockTexture.colorSpace=T.SRGBColorSpace;const rockMat=new T.MeshStandardMaterial({color:0x929aa0,map:rockTexture,bumpMap:rockTexture,bumpScale:.45,roughness:.97,metalness:.07,flatShading:false});let rocks=null,scenery=null,route=null,course=null;
  const dummy=new T.Object3D(),particleCount=360,particleData=Array.from({length:particleCount},()=>({life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0})),particlePos=new Float32Array(particleCount*3),particleColor=new Float32Array(particleCount*3);let particleCursor=0;
  particlePos.fill(1e6);const particlesGeo=new T.BufferGeometry();particlesGeo.setAttribute('position',new T.BufferAttribute(particlePos,3));particlesGeo.setAttribute('color',new T.BufferAttribute(particleColor,3));
  const particles=new T.Points(particlesGeo,new T.PointsMaterial({map:glowTexture(),size:.75,vertexColors:true,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));particles.frustumCulled=false;scene.add(particles);
  const streakCount=100,streakPositions=new Float32Array(streakCount*6),streakGeo=new T.BufferGeometry();streakGeo.setAttribute('position',new T.BufferAttribute(streakPositions,3));const streaks=new T.LineSegments(streakGeo,new T.LineBasicMaterial({color:0x73c9dd,transparent:true,opacity:.2,depthWrite:false,blending:T.AdditiveBlending}));streaks.frustumCulled=false;scene.add(streaks);const random=rng(77),streakSeeds=Array.from({length:streakCount},()=>({x:(random()-.5)*160,y:(random()-.5)*100,z:random()*240}));
  const cameraPos=new T.Vector3(),cameraLook=new T.Vector3(),projected=new T.Vector3(),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;let width=1,height=1,quality='high';
  function setCourse(next){
    course=next;
    gateGroups.forEach(g=>courseRoot.remove(g));gateGroups.length=0;
    if(rocks){courseRoot.remove(rocks);rocks.dispose();}if(scenery){courseRoot.remove(scenery);scenery.dispose();}if(route){courseRoot.remove(route);route.geometry.dispose();route.material.dispose();}
    for(const gate of course.gates){
      const g=new T.Group();g.position.set(gate.x,gate.y,-gate.s);g.scale.setScalar(gate.radius/12);g.add(new T.Mesh(gateBody,metal),new T.Mesh(gateInner,gateGlow),new T.Mesh(gateOuter,goldGlow));
      for(let k=0;k<4;k++){const a=k*Math.PI/2,m=new T.Mesh(gatePylon,metal);m.position.set(Math.cos(a)*12.5,Math.sin(a)*12.5,0);m.rotation.z=a-Math.PI/2;g.add(m);}courseRoot.add(g);gateGroups.push(g);
    }
    rocks=new T.InstancedMesh(rockGeo,rockMat,course.rocks.length);
    course.rocks.forEach((r,i)=>{dummy.position.set(r.x,r.y,-r.s);dummy.rotation.set(r.angle,r.angle*.7,r.angle*2);dummy.scale.set(r.radius,r.radius*.83,r.radius*.9);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);rocks.setColorAt(i,new T.Color().setScalar(.6+(i%7)*.07));});rocks.computeBoundingSphere();courseRoot.add(rocks);
    const farRandom=rng(course.config.seed+200);scenery=new T.InstancedMesh(rockGeo,rockMat,180);for(let i=0;i<180;i++){const a=farRandom()*Math.PI*2,r=130+farRandom()*300,scale=5+farRandom()*16;dummy.position.set(Math.cos(a)*r,Math.sin(a)*r,-farRandom()*course.end);dummy.rotation.set(farRandom()*6,farRandom()*6,farRandom()*6);dummy.scale.set(scale,scale*.8,scale*.7);dummy.updateMatrix();scenery.setMatrixAt(i,dummy.matrix);}scenery.computeBoundingSphere();courseRoot.add(scenery);
    const points=[];for(let s=100;s<course.end;s+=24){const p=pathAt(course.config,s);points.push(new T.Vector3(p.x,p.y,-s));}
    route=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineDashedMaterial({color:0x6ec8d1,transparent:true,opacity:.2,dashSize:3,gapSize:15,depthWrite:false}));route.computeLineDistances();courseRoot.add(route);
    particleData.forEach(p=>p.life=0);cameraPos.set(0,7,20);
  }
  function resize(){width=canvas.clientWidth;height=canvas.clientHeight;const ratio=Math.min(devicePixelRatio,quality==='high'?1.5:1);renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);composer.setPixelRatio(ratio);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
  function setQuality(q){quality=q;bloom.enabled=q!=='low';resize();}
  function burst(event){
    for(let i=0;i<48;i++){const p=particleData[particleCursor++%particleCount],a=Math.random()*Math.PI*2,r=6+Math.random()*7;p.life=1;p.x=event.x+Math.cos(a)*r;p.y=event.y+Math.sin(a)*r;p.z=-event.s;p.vx=Math.cos(a)*7;p.vy=Math.sin(a)*7;p.vz=12+Math.random()*20;}
  }
  function update(f,dt,time,mode='flight'){
    clock.value=time;const menu=mode==='menu';cosmos.root.position.set(0,0,-f.s);cosmos.update(time,f.course.config.planet,f.course.config);
    sunlight.position.set(f.x-60,f.y+45,-f.s+40);sunlight.target.position.set(f.x,f.y,-f.s);sunlight.target.updateMatrixWorld();rim.position.set(f.x+30,f.y-10,-f.s-60);rim.target.position.set(f.x,f.y,-f.s);rim.target.updateMatrixWorld();
    if(menu){ship.root.position.set(width<700?9:14,-1,-30);ship.root.scale.setScalar(3);ship.root.rotation.set(-.08,-.62+(reduceMotion?0:Math.sin(time*.12)*.08),-.18);camera.position.set(0,4,22);camera.lookAt(0,1,-80);camera.fov=49;ship.update(time,.45);}
    else{
      ship.root.position.set(f.x,f.y,-f.s);ship.root.scale.setScalar(1);ship.root.rotation.set(f.vy*.009,-f.vx*.006,-f.vx*.018);ship.update(time,f.boosting?1:.28);
      cameraPos.lerp(new T.Vector3(f.x*.97,f.y+5.5,-f.s+19),1-Math.exp(-dt*9));camera.position.copy(cameraPos);cameraLook.set(f.x+f.vx*.08,f.y+1.8,-f.s-55);camera.lookAt(cameraLook);camera.fov=58+(reduceMotion?0:Math.max(0,f.speed/f.course.config.speed-1)*10);
    }
    camera.updateProjectionMatrix();grade.uniforms.damage.value=f.flash;
    courseRoot.visible=!menu;gateGroups.forEach((g,i)=>{const gate=course.gates[i];g.visible=gate.s>f.s-40&&gate.s<f.s+1700;g.rotation.z=time*.03*(i%2?1:-1);g.children[0].material=i===f.next?activeMetal:metal;g.children[1].material=i===f.next?goldGlow:gateGlow;});
    stations.forEach((s,i)=>{s.visible=i<course.stations.length;if(!s.visible)return;s.position.set(0,0,menu?(-950-i*2200):-course.stations[i]);s.rotation.set(.12,i?.23:-.15,(reduceMotion?0:time*.012)*(i?-1:1));});
    for(let i=0;i<particleCount;i++){const p=particleData[i];p.life-=dt*.7;if(p.life>0){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;particlePos.set([p.x,p.y,p.z],i*3);particleColor.set([.3*p.life,2*p.life,2.3*p.life],i*3);}else particlePos.set([1e6,1e6,1e6],i*3);}
    particlesGeo.attributes.position.needsUpdate=true;particlesGeo.attributes.color.needsUpdate=true;
    streaks.visible=!menu&&!reduceMotion;streaks.material.opacity=f.boosting?.28:.07;
    for(let i=0;i<streakCount;i++){const v=streakSeeds[i],z=-f.s+20-((v.z-time*f.speed*.9)%240+240)%240,x=f.x+v.x,y=f.y+v.y;streakPositions.set([x,y,z,x,y,z+(f.boosting?10:2)],i*6);}streakGeo.attributes.position.needsUpdate=true;
    composer.render();
    const gate=course.gates[f.next];if(!gate)return null;projected.set(gate.x,gate.y,-gate.s);projected.project(camera);return {x:(projected.x*.5+.5)*width,y:(-.5*projected.y+.5)*height,visible:projected.z<1,distance:Math.max(0,Math.round(gate.s-f.s)),index:f.next+1};
  }
  return {renderer,setCourse,resize,setQuality,update,burst};
}
