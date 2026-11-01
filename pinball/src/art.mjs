import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {BUMPERS,GEARS,SHOOTER_GATE,TARGETS,WALLS,PIVOTS,FLIPPER_LENGTH,FLIPPER_RADIUS,RADIUS,rampPoint} from './physics.mjs';
const metal=(color,roughness=.29)=>new T.MeshStandardMaterial({color,metalness:.82,roughness});
export class TableView {
  constructor(canvas){
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;
    this.scene=new T.Scene();this.scene.background=new T.Color('#ded9cb');
    this.camera=new T.PerspectiveCamera(34,1,.1,150);this.camera.position.set(0,24,18);this.camera.lookAt(0,0,.15);
    const pm=new T.PMREMGenerator(this.renderer),room=new RoomEnvironment();
    this.env=pm.fromScene(room,.04);this.scene.environment=this.env.texture;room.dispose();pm.dispose();
    this.scene.environmentIntensity=.7;
    this.scene.add(new T.HemisphereLight(0xfff5df,0x567069,1.3));
    const sun=new T.DirectionalLight(0xffe7bd,2.6);sun.position.set(-8,19,-6);sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:14,bottom:-14,near:.5,far:50});sun.shadow.bias=-.0006;sun.shadow.normalBias=.025;
    this.scene.add(sun);const fill=new T.DirectionalLight(0xc7e6ec,1.5);fill.position.set(9,9,9);this.scene.add(fill);
    this.brass=metal('#bb8a44');this.chrome=metal('#c7d0cc',.16);this.ballMaterial=metal('#ffffff',.075);this.ballMaterial.emissive=new T.Color('#bbd1d0');this.ballMaterial.emissiveIntensity=.07;this.darkMetal=metal('#273b35',.4);
    this.rubber=new T.MeshStandardMaterial({color:'#b65532',roughness:.66});
    this.cream=new T.MeshStandardMaterial({color:'#f4dfaf',roughness:.35});
    this.wood=new T.MeshStandardMaterial({map:this.woodTexture(),roughness:.4,metalness:.07});
    this.root=new T.Group();this.scene.add(this.root);
    const floor=this.box(150,.3,150,new T.MeshStandardMaterial({color:'#ded9cb',roughness:1}),0,-1.5,0,this.scene);floor.receiveShadow=true;this.floor=floor;
    this.roundBox(10.7,.85,18.8,this.wood,0,-.52,0);
    const board=new T.MeshStandardMaterial({map:this.boardTexture(),roughness:.62,metalness:.04});
    this.box(9.95,.14,17.95,board,0,-.07,0);
    for(const x of [-5.2,5.2]){this.roundBox(.4,.66,18.65,this.wood,x,.17,0);this.box(.11,.05,18.55,this.brass,x-.1*Math.sign(x),.52,0);}
    for(const z of [-9.2,9.2]){this.roundBox(10.7,.65,.4,this.wood,0,.17,z);this.box(10.4,.06,.09,this.brass,0,.53,z);}
    for(const x of [-5.2,5.2])for(const y of [-8.5,-3,3,8.5])this.screw(x,.53,y);
    for(const w of WALLS){
      this.tube([[w.ax-5,.31,w.ay-9],[w.bx-5,.31,w.by-9]],w.r,this.chrome);
      if(!w.sling){for(const t of [0,1])this.cylinder(.11,.27,this.brass,w.ax-5+(w.bx-w.ax)*t,.16,w.ay-9+(w.by-w.ay)*t);}
    }
    for(const side of [-1,1]){
      const s=new T.Shape();const pts=side<0?[[1.15,11.1],[2.65,13.4],[1.65,13]]:[[8.25,11.1],[7.15,13.4],[8,13]];
      pts.forEach(([x,y],i)=>i?s.lineTo(x-5,-(y-9)):s.moveTo(x-5,-(y-9)));s.closePath();
      const plate=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.2,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.05,bevelThickness:.04}),this.brass);
      plate.rotation.x=-Math.PI/2;plate.position.y=.12;plate.castShadow=true;this.root.add(plate);
      this.label(side<0?'L':'R',side<0?-3:2.7,3.5,.45,.65);
    }
    this.bumperMeshes=BUMPERS.map((p,i)=>{
      const g=new T.Group();g.position.set(p.x-5,0,p.y-9);this.root.add(g);
      this.cylinder(p.r+.12,.14,this.darkMetal,0,.09,0,g);
      this.cylinder(p.r,.27,this.rubber,0,.28,0,g);
      this.cylinder(p.r-.05,.12,this.brass,0,.48,0,g);
      this.torus(p.r-.18,.055,this.chrome,0,.56,0,g);
      const mat=new T.MeshStandardMaterial({color:'#f3e1aa',emissive:'#ffad43',emissiveIntensity:.16,roughness:.3});
      const cap=this.cylinder(p.r-.21,.07,mat,0,.55,0,g);
      this.label('150',0,0,.66,.58,g,.595);
      return {g,cap};
    });
    this.shutter=new T.Group();this.shutter.position.set(SHOOTER_GATE.ax-5,.32,SHOOTER_GATE.ay-9);this.root.add(this.shutter);
    this.tube([[0,0,0],[SHOOTER_GATE.bx-SHOOTER_GATE.ax,0,SHOOTER_GATE.by-SHOOTER_GATE.ay]],SHOOTER_GATE.r,this.brass,this.shutter);
    this.cylinder(.11,.14,this.chrome,0,0,0,this.shutter);
    this.targets=TARGETS.map((p,i)=>{
      this.box(.38,.07,.95,this.darkMetal,p.x-5,.07,p.y-9);
      const m=this.box(.26,.58,.68,this.brass,p.x-5,.34,p.y-9);
      this.label('0'+(i+1),p.x-4.4,p.y-9,.7,.4);
      const led=this.lamp(p.x-4.4,p.y-8.65,.08);return {m,led};
    });
    this.flippers=PIVOTS.map((p,i)=>{
      const g=new T.Group();g.position.set(p.x-5,.25,p.y-9);this.root.add(g);
      // Capsule geometry and pivot match the collision segment exactly.
      const capsule=(radius,mat,h)=>{
        this.box(FLIPPER_LENGTH,h,radius*2,mat,FLIPPER_LENGTH/2,0,0,g);
        this.cylinder(radius,h,mat,0,0,0,g);this.cylinder(radius,h,mat,FLIPPER_LENGTH,0,0,g);
      };
      capsule(FLIPPER_RADIUS,this.rubber,.25);
      this.box(FLIPPER_LENGTH,.06,.2,this.cream,FLIPPER_LENGTH/2,.155,0,g);
      this.cylinder(.11,.07,this.chrome,0,.18,0,g);
      this.tube([[.3,.2,0],[1.65,.2,0]],.019,this.brass,g);
      this.cylinder(.25,.08,this.darkMetal,p.x-5,.05,p.y-9);
      return g;
    });
    this.gears=[];
    for(const p of GEARS)this.gear(p.x-5,p.y-9,p.r,p.h,p.teeth);
    // Elevated return rail, with physical ball positions sampled from this exact curve.
    const samples=Array.from({length:121},(_,i)=>{const p=rampPoint(i/120);return new T.Vector3(p.x-5,p.z+.21,p.y-9);});
    for(const offset of [-.13,.13])this.tube(samples.map(p=>new T.Vector3(p.x+offset,p.y-.19,p.z)),.042,this.chrome);
    for(const offset of [-.29,.29])this.tube(samples.map(p=>new T.Vector3(p.x+offset,p.y+.13,p.z)),.045,this.brass);
    for(let i=0;i<samples.length;i+=4){const p=samples[i];this.tube([[p.x-.29,p.y-.215,p.z],[p.x+.29,p.y-.215,p.z]],.025,this.chrome);}
    for(const t of [.18,.33,.5,.67,.82]){
      const p=rampPoint(t);this.cylinder(.06,p.z+.15,this.darkMetal,p.x-5,(p.z+.15)/2,p.y-9);
      this.cylinder(.18,.06,this.brass,p.x-5,.04,p.y-9);
    }
    this.gate=new T.Group();this.gate.position.set(7.22-5,.25,11.05-9);this.root.add(this.gate);
    this.box(.86,.22,.24,this.brass,.43,0,0,this.gate);this.screw(0,.15,0,this.gate);
    this.rampGuide=[[7.1,12.2],[6.75,13],[6.35,13.8]].map(([x,y])=>this.lamp(x-5,y-9,.1));
    this.rampLamp=this.lamp(7.65-5,11.8-9,.16);
    this.label('MULTIBALL',2.65,2.65,1.8,.34);
    this.label('BRASS  &  GRAVITY',-.15,3.0,3.3,.42);
    this.label('MECHANICAL  PINBALL',-.15,3.55,2.6,.24);
    this.label('EST.  2026',-.15,4.0,1.3,.22);
    this.label('01  /  THE WORKSHOP',-.15,-7.6,3.4,.36);
    this.label('PULL  TO  LAUNCH',4.2,4.2,.55,2.7);
    this.spring=new T.Group();this.root.add(this.spring);
    this.cylinder(.13,.8,this.chrome,4.2,.24,7.3).rotation.x=Math.PI/2;
    const coil=[];for(let i=0;i<=180;i++){const t=i/180;coil.push([4.2+Math.cos(t*Math.PI*24)*.2,.24+Math.sin(t*Math.PI*24)*.2,7.15+t*.75]);}
    this.tube(coil,.028,this.chrome,this.spring);
    this.plunger=this.box(.52,.35,.18,this.brass,4.2,.23,7.55);
    this.lamps=[];for(let i=0;i<5;i++)this.lamps.push(this.lamp(-1.1+i*.46,4.65,.08));
    // Thin edge glass strips suggest a cover without obscuring the steel ball with glare.
    const glass=new T.MeshPhysicalMaterial({color:'#d3ede3',transparent:true,opacity:.1,metalness:.05,roughness:.1,depthWrite:false});
    this.box(.035,.8,16.8,glass,-4.65,.5,0);this.box(.035,.8,16.8,glass,4.65,.5,0);
    this.ballMeshes=new Map();this.trails=new Map();this.pulses=[];this.lastEvent=null;this.lastTime=0;this.effects=new T.Group();this.root.add(this.effects);this.scoreTextures=new Map();
    this.ringGeometry=new T.RingGeometry(.6,.64,48);
    this.contactGeometry=new T.CircleGeometry(.25,24);this.contactMaterial=new T.MeshBasicMaterial({color:'#0d231c',transparent:true,opacity:.3,depthWrite:false});
    this.resize();
  }
  roundBox(w,h,d,mat,x,y,z){const m=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,.09),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;this.root.add(m);return m;}
  burst(e){
    if(!['bumper','target','ramp','sling'].includes(e.type))return;
    const material=new T.MeshBasicMaterial({color:e.type==='sling'?'#d6d7bd':'#e6b75b',transparent:true,opacity:.5,side:T.DoubleSide,depthWrite:false});
    const ring=new T.Mesh(this.ringGeometry,material);ring.rotation.x=-Math.PI/2;ring.position.set(e.x-5,.04,e.y-9);this.effects.add(ring);
    let text=null;
    if(e.type!=='sling'){
      const value='+'+e.value;
      if(!this.scoreTextures.has(value)){
        const c=document.createElement('canvas');c.width=256;c.height=96;const ctx=c.getContext('2d');ctx.font='bold 52px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=7;ctx.strokeStyle='#143329';ctx.strokeText(value,128,48);ctx.fillStyle='#fff0c3';ctx.fillText(value,128,48);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;this.scoreTextures.set(value,t);
      }
      text=new T.Sprite(new T.SpriteMaterial({map:this.scoreTextures.get(value),transparent:true,depthTest:false,depthWrite:false}));text.scale.set(1.35,.51,1);text.position.set(e.x-5,.95,e.y-9);this.effects.add(text);
    }
    this.pulses.push({ring,text,time:e.time});
    if(this.pulses.length>12)this.dropPulse(this.pulses.shift());
  }
  dropPulse(p){this.effects.remove(p.ring);p.ring.material.dispose();if(p.text){this.effects.remove(p.text);p.text.material.dispose();}}
  updateBallMeshes(g,reduced){
    const balls=g.status==='ready'?[{id:'preview',x:9.2,y:16.1,z:0,lane:true}]:g.balls;
    const ids=new Set(balls.map(b=>b.id));
    for(const [id,m] of this.ballMeshes)if(!ids.has(id)){
      this.root.remove(m);this.ballMeshes.delete(id);m.geometry.dispose();
      const t=this.trails.get(id);this.root.remove(t.line,t.shadow);t.line.geometry.dispose();t.line.material.dispose();this.trails.delete(id);
    }
    for(const b of balls){
      let m=this.ballMeshes.get(b.id),track=this.trails.get(b.id);
      if(!m){
        m=new T.Mesh(new T.SphereGeometry(RADIUS,32,24),this.ballMaterial);m.castShadow=true;this.root.add(m);this.ballMeshes.set(b.id,m);
        const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(new Float32Array(36),3));geometry.setAttribute('color',new T.BufferAttribute(new Float32Array(36),3));
        const line=new T.Line(geometry,new T.LineBasicMaterial({color:'#f2dab0',vertexColors:true,transparent:true,opacity:.65,depthWrite:false}));line.frustumCulled=false;this.root.add(line);
        const shadow=new T.Mesh(this.contactGeometry,this.contactMaterial);shadow.rotation.x=-Math.PI/2;this.root.add(shadow);
        track={line,shadow,samples:[]};this.trails.set(b.id,track);
      }
      const p=new T.Vector3(b.x-5,RADIUS+b.z+.025,b.y-9);m.position.copy(p);
      track.shadow.position.set(p.x,.017,p.z);track.shadow.visible=b.z<.1;
      if(reduced||b.lane){track.samples=[];track.line.visible=false;continue;}
      if(!g.paused&&(!track.samples.length||track.samples.at(-1).t!==g.time)){
        if(track.samples.length&&p.distanceTo(track.samples.at(-1).p)>1.3)track.samples=[];
        track.samples.push({p,t:g.time});track.samples=track.samples.filter(s=>g.time-s.t<.09).slice(-12);
      }
      const {position,color}=track.line.geometry.attributes;
      track.samples.forEach((s,i)=>{position.setXYZ(i,s.p.x,s.p.y,s.p.z);const brightness=(i+1)/track.samples.length;color.setXYZ(i,brightness,brightness,brightness);});
      position.needsUpdate=true;color.needsUpdate=true;track.line.geometry.setDrawRange(0,track.samples.length);track.line.visible=track.samples.length>1;
    }
  }
  box(w,h,d,mat,x,y,z,parent=this.root){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  cylinder(r,h,mat,x,y,z,parent=this.root){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,32),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  torus(r,t,mat,x,y,z,parent=this.root){const m=new T.Mesh(new T.TorusGeometry(r,t,8,64),mat);m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
  tube(points,r,mat,parent=this.root){const ps=points.map(p=>p.isVector3?p:new T.Vector3(...p));const curve=new T.CatmullRomCurve3(ps,false,'centripetal');const m=new T.Mesh(new T.TubeGeometry(curve,Math.max(2,ps.length*2),r,8,false),mat);m.castShadow=true;parent.add(m);return m;}
  screw(x,y,z,parent=this.root){this.cylinder(.065,.035,this.chrome,x,y,z,parent);this.box(.07,.006,.015,this.darkMetal,x,y+.02,z,parent);}
  lamp(x,z,r){const mat=new T.MeshStandardMaterial({color:'#b7c9a0',emissive:'#d5ff8a',emissiveIntensity:0,roughness:.3});this.torus(r+.035,.025,this.brass,x,.07,z);return this.cylinder(r,.04,mat,x,.07,z);}
  gear(x,z,r,y,teeth){
    const g=new T.Group();g.position.set(x,y,z);this.root.add(g);
    this.cylinder(r*.8,.18,this.brass,0,0,0,g);this.torus(r*.57,.045,this.chrome,0,.1,0,g);
    for(let i=0;i<teeth;i++){const a=i/teeth*Math.PI*2;const m=this.box(r*.3,.17,r*.2,this.brass,Math.cos(a)*r*.89,0,Math.sin(a)*r*.89,g);m.rotation.y=-a;}
    this.cylinder(r*.18,.28,this.chrome,0,.08,0,g);this.screw(0,.24,0,g);
    for(let i=0;i<4;i++){const a=i*Math.PI/2;this.cylinder(r*.12,.012,this.darkMetal,Math.cos(a)*r*.4,.101,Math.sin(a)*r*.4,g);}
    this.gears.push(g);return g;
  }
  label(text,x,z,w,h,parent=this.root,y=.016){
    const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');
    ctx.fillStyle='#dfcc99';ctx.font='500 52px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,80,990);
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
    const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
    m.rotation.x=-Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;
  }
  woodTexture(){
    const c=document.createElement('canvas');c.width=256;c.height=1024;const ctx=c.getContext('2d');ctx.fillStyle='#704627';ctx.fillRect(0,0,256,1024);
    for(let i=0;i<350;i++){ctx.strokeStyle=`rgba(${i%2?'22,11,4':'216,160,94'},${.03+(i%7)*.012})`;ctx.lineWidth=.5+i%3;ctx.beginPath();
      for(let y=0;y<=1024;y+=8){const x=(i*.797)%256+Math.sin(y*.007+i*.3)*3+Math.sin(y*.021+i)*.5;y?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;return tex;
  }
  boardTexture(){
    const c=document.createElement('canvas');c.width=1024;c.height=1844;const ctx=c.getContext('2d');
    ctx.fillStyle='#154b42';ctx.fillRect(0,0,c.width,c.height);
    let seed=7;for(let i=0;i<50000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;ctx.fillStyle=i%2?'#ffffff06':'#00000009';ctx.fillRect(x,seed%1844,1,3);}
    const scale=102.4;ctx.strokeStyle='#cfb88180';ctx.lineWidth=2;
    for(const inset of [.24,.34]){ctx.beginPath();ctx.roundRect(inset*scale,inset*scale,(10-inset*2)*scale,(18-inset*2)*scale,50);ctx.stroke();}
    for(const b of BUMPERS){for(const r of [b.r+.28,b.r+.38]){ctx.beginPath();ctx.arc(b.x*scale,b.y*scale,r*scale,0,Math.PI*2);ctx.stroke();}}
    ctx.strokeStyle='#d2b77b38';for(let i=0;i<32;i++){const a=i*Math.PI/16;ctx.beginPath();ctx.moveTo(4.65*scale+Math.cos(a)*95,9.65*scale+Math.sin(a)*95);ctx.lineTo(4.65*scale+Math.cos(a)*136,9.65*scale+Math.sin(a)*136);ctx.stroke();}
    for(const x of [3.3,6.3]){ctx.beginPath();ctx.moveTo(x*scale,14.6*scale);ctx.bezierCurveTo(x*scale,12*scale,(x-1)*scale,11*scale,(x-.8)*scale,8*scale);ctx.stroke();}
    // Printed directional chevrons guide the player to the entrance.
    ctx.strokeStyle='#d9c48da0';ctx.lineWidth=4;for(let y=12;y<14;y+=.5){ctx.beginPath();ctx.moveTo(7.4*scale,(y+.2)*scale);ctx.lineTo(7.65*scale,y*scale);ctx.lineTo(7.9*scale,(y+.2)*scale);ctx.stroke();}
    const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;
  }
  resize(){
    const {width,height}=this.renderer.domElement.getBoundingClientRect();
    this.renderer.setSize(width,height,false);
    this.camera.aspect=width/height;
    this.camera.setViewOffset(width,height,0,Math.min(70,height*.1),width,height);
    const direction=new T.Vector3(0,26,14).normalize();
    // Fit every cabinet corner in the usable view, leaving controls below the table.
    for(let d=22;d<90;d+=.3){
      this.camera.position.copy(direction).multiplyScalar(d);this.camera.lookAt(0,0,0);
      this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
      let fits=true;
      for(const x of [-5.5,5.5])for(const z of [-9.5,9.5])for(const y of [-.8,.6]){
        const p=new T.Vector3(x,y,z).project(this.camera);
        if(Math.abs(p.x)>.94||p.y>1-60/height||p.y< -1+205/height)fits=false;
      }
      if(fits)break;
    }
  }
  setTheme(dark){this.scene.background.set(dark?'#172322':'#ded9cb');this.floor.material.color.set(dark?'#172322':'#ded9cb');}
  render(g,dt,reduced=false){
    for(let i=0;i<2;i++)this.flippers[i].rotation.y=-g.flippers[i].angle;
    for(let i=0;i<3;i++){this.targets[i].m.position.y=g.targets[i]?-.23:.34;this.targets[i].led.material.emissiveIntensity=g.targets[i]?1.1:0;}
    this.gate.rotation.z=reduced?(g.armed?Math.PI/2:0):T.MathUtils.damp(this.gate.rotation.z,g.armed?Math.PI/2:0,12,g.paused?0:dt);this.rampLamp.material.emissiveIntensity=g.armed?1.3+.3*Math.sin(g.time*5):0;
    this.gears.forEach((gear,i)=>gear.rotation.y=g.gear*(i%2?-1:1));
    this.plunger.position.z=7.55+g.charge*.45;
    if(g.time<this.lastTime){for(const p of this.pulses)this.dropPulse(p);this.pulses=[];this.lastEvent=null;for(const t of this.trails.values())t.samples=[];}
    this.lastTime=g.time;
    const fresh=this.lastEvent?g.events.slice(g.events.indexOf(this.lastEvent)+1):g.events;
    if(!reduced)for(const e of fresh)this.burst(e);
    this.lastEvent=g.events.at(-1)||null;
    for(const p of [...this.pulses]){
      const age=g.time-p.time;
      if(age>.65||reduced){this.dropPulse(p);this.pulses.splice(this.pulses.indexOf(p),1);continue;}
      p.ring.scale.setScalar(1+age*1.4);p.ring.material.opacity=Math.max(0,.45-age*1.3);
      if(p.text){p.text.position.y=.95+age*.8;p.text.material.opacity=Math.min(1,(.65-age)*3);}
    }
    const nextGate=(g.balls.some(b=>b.x>8.7&&b.y>2.2&&b.y<3.8&&b.vy<0))?-1.25:0;
    this.shutter.rotation.z=reduced?nextGate:T.MathUtils.damp(this.shutter.rotation.z,nextGate,18,g.paused?0:dt);
    this.spring.scale.z=1-g.charge*.5;this.spring.position.z=g.charge*4.0;
    this.rampGuide.forEach((lamp,i)=>lamp.material.emissiveIntensity=g.armed?(reduced?1:((g.time*3+i)%3<1?1.8:.25)):0);
    this.updateBallMeshes(g,reduced);
    for(let i=0;i<5;i++)this.lamps[i].material.emissiveIntensity=g.combo>i&&g.time-g.lastBumper<2?1.1:0;
    for(const {g:group,cap} of this.bumperMeshes){const p=BUMPERS[this.bumperMeshes.findIndex(b=>b.g===group)];const e=[...g.events].reverse().find(e=>e.type==='bumper'&&e.x===p.x);const intensity=e?Math.max(0,1-(g.time-e.time)*5):0;cap.material.emissiveIntensity=.12+intensity*1.5;cap.position.y=.55-(reduced?0:intensity*.08);}
    this.renderer.render(this.scene,this.camera);
  }
}
