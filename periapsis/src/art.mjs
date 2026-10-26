import * as T from 'three';
import {rng} from './flight.mjs';

export function surfaceTexture(kind='metal'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d'),r=rng(701);
  ctx.fillStyle=kind==='solar'?'#162c46':'#bac5cb';ctx.fillRect(0,0,512,512);
  for(let i=0;i<2400;i++){const value=120+r()*110;ctx.fillStyle=`rgba(${value},${value},${value},.06)`;ctx.fillRect(r()*512,r()*512,1+r()*12,1);}
  if(kind==='solar'){
    for(let x=0;x<512;x+=32)for(let y=0;y<512;y+=64){ctx.fillStyle=`hsl(${210+r()*12},35%,${12+r()*10}%)`;ctx.fillRect(x+2,y+2,28,60);ctx.fillStyle='#7294a66b';ctx.fillRect(x+16,y+3,1,58);}
  }else{
    ctx.strokeStyle='#39444e';ctx.lineWidth=1;
    for(let y=0;y<512;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let x=(y%128?64:0);x<512;x+=128){ctx.strokeRect(x,y,128,64);ctx.fillStyle='#555f65';ctx.fillRect(x+5,y+5,3,3);ctx.fillRect(x+118,y+54,3,3);}}
    ctx.fillStyle='#e3ae54';ctx.fillRect(0,240,512,17);ctx.fillStyle='#8d9ba3';ctx.fillRect(0,259,512,5);
  }
  const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
}
export function glowTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.08,'rgba(255,255,255,.8)');g.addColorStop(.3,'rgba(255,255,255,.15)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c);
}
function box(parent,material,w,h,d,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m;}
function cylinder(parent,material,r1,r2,length,x,y,z){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,length,32),material);m.rotation.x=Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;}
function wing(parent,material,points,height=.15){
  const shape=new T.Shape();points.forEach((p,i)=>i?shape.lineTo(...p):shape.moveTo(...p));shape.closePath();
  const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSize:.07,bevelThickness:.04,bevelSegments:2,steps:1}),material);m.rotation.x=Math.PI/2;parent.add(m);return m;
}
export function createShip(){
  const root=new T.Group(),paint=new T.MeshPhysicalMaterial({color:0xd4dde0,metalness:.72,roughness:.26,clearcoat:1,clearcoatRoughness:.2,map:surfaceTexture()}),dark=new T.MeshStandardMaterial({color:0x111f2a,metalness:.9,roughness:.3}),gold=new T.MeshStandardMaterial({color:0xe8ad55,metalness:.75,roughness:.24}),chrome=new T.MeshStandardMaterial({color:0x8299aa,metalness:1,roughness:.2});
  const light=new T.MeshBasicMaterial({color:new T.Color(.1,1.4,2)}),orange=new T.MeshBasicMaterial({color:new T.Color(3,.75,.15)});
  const profile=[new T.Vector2(.05,-5.1),new T.Vector2(.42,-4.3),new T.Vector2(.82,-2),new T.Vector2(1.04,.3),new T.Vector2(.8,2.4),new T.Vector2(.55,2.7)];
  const body=new T.Mesh(new T.LatheGeometry(profile,48),paint);body.rotation.x=Math.PI/2;body.scale.y=.72;root.add(body);
  const belly=new T.Mesh(new T.SphereGeometry(1,32,20),dark);belly.scale.set(.9,.42,2.6);belly.position.set(0,-.38,-.1);root.add(belly);
  const cockpit=new T.Mesh(new T.SphereGeometry(1,40,28),new T.MeshPhysicalMaterial({color:0x163f55,metalness:.55,roughness:.13,clearcoat:1,clearcoatRoughness:.05}));cockpit.scale.set(.68,.5,1.45);cockpit.position.set(0,.56,-1.65);root.add(cockpit);
  for(const side of [-1,1]){
    const w=wing(root,paint,[[side*.7,-2],[side*3.9,.8],[side*3.7,2.25],[side*.7,1.4]]);w.position.y=-.05;
    const inlay=wing(root,dark,[[side*1.05,-.7],[side*3.5,1.1],[side*3.45,1.7],[side*1.1,.9]],.035);inlay.position.y=.1;
    const stripe=wing(root,gold,[[side*1.15,-.85],[side*3.4,1],[side*3.5,1.3],[side*1.2,-.4]],.025);stripe.position.y=.15;
    cylinder(root,dark,.57,.65,2.9,side*1.55,-.1,1.1);cylinder(root,chrome,.65,.65,.16,side*1.55,-.1,2.45);
    cylinder(root,dark,.45,.57,.5,side*1.55,-.1,2.7);cylinder(root,dark,.35,.4,.08,side*1.55,-.1,2.98);cylinder(root,light,.16,.16,.04,side*1.55,-.1,3.05);const lip=new T.Mesh(new T.TorusGeometry(.38,.035,8,32),light);lip.position.set(side*1.55,-.1,3.04);root.add(lip);for(let j=0;j<8;j++){const a=j*Math.PI/4;box(root,chrome,.07,.07,.1,side*1.55+Math.cos(a)*.5,-.1+Math.sin(a)*.5,3.01);}
    for(let k=0;k<5;k++)cylinder(root,chrome,.58,.58,.055,side*1.55,-.1,.25+k*.35);
    const fin=wing(root,paint,[[side*2.8,1],[side*3.8,1.4],[side*3.8,3],[side*2.8,2.2]],.12);fin.rotation.z=side*-.62;fin.position.y=.15;
    const nav=box(root,side<0?orange:light,.08,.06,1.2,side*3.55,.1,1.35);
    box(root,dark,.14,.14,2.5,side*2.7,-.17,-.7);cylinder(root,chrome,.08,.12,.35,side*2.7,-.17,-2.1);
    for(let k=0;k<6;k++)box(root,dark,.32,.04,.1,side*.7,.52,.4+k*.24);
    const rail=box(root,gold,.06,.05,2.3,side*.6,.72,-1.4);rail.rotation.z=side*.12;
  }
  box(root,paint,.15,1,1.35,0,.85,1.3);box(root,gold,.17,.17,1.4,0,1.3,1.3);
  const decalCanvas=document.createElement('canvas');decalCanvas.width=256;decalCanvas.height=128;const dc=decalCanvas.getContext('2d');dc.fillStyle='#d1d9dc';dc.fillRect(0,0,256,128);dc.fillStyle='#263b47';dc.font='bold 65px monospace';dc.fillText('07',25,72);dc.font='18px monospace';dc.fillText('PERIAPSIS',26,104);
  const decalTexture=new T.CanvasTexture(decalCanvas);decalTexture.colorSpace=T.SRGBColorSpace;const decal=new T.Mesh(new T.PlaneGeometry(.7,.4),new T.MeshStandardMaterial({map:decalTexture,metalness:.5,roughness:.4}));decal.rotation.x=-Math.PI/2;decal.position.set(0,.76,.3);root.add(decal);
  const flameMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,uniforms:{time:{value:0},power:{value:.3}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform float time;uniform float power;void main(){float edge=pow(max(0.,1.-abs(vUv.x-.5)*2.),1.5);float tail=pow(1.-vUv.y,1.3);float diamonds=.68+.32*sin(vUv.y*45.-time*25.);vec3 c=mix(vec3(.08,.5,1.),vec3(.12,.8,1.4),tail);gl_FragColor=vec4(c*diamonds,edge*tail*(.6+power*.4));}`});
  const flames=[];
  for(const side of [-1,1]){
    const g=new T.Group();g.position.set(side*1.55,-.1,2.95);root.add(g);
    const plume=new T.Mesh(new T.CylinderGeometry(.015,.38,5.5,24,1,true),flameMaterial);plume.rotation.x=Math.PI/2;plume.position.z=2.75;g.add(plume);flames.push(g);
    const sprite=new T.Sprite(new T.SpriteMaterial({map:glowTexture(),color:new T.Color(.04,.3,.6),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));sprite.position.set(side*1.55,-.1,3.05);sprite.scale.set(1.6,1.6,1);root.add(sprite);
  }
  return {root,update(time,power){flameMaterial.uniforms.time.value=time;flameMaterial.uniforms.power.value=power;flames.forEach(f=>f.scale.set(1+power*.2,1+power*.2,.35+power*.85));}};
}

export function createStation(radius=135){
  const root=new T.Group(),metal=new T.MeshStandardMaterial({color:0x8f9ca5,metalness:.82,roughness:.4,map:surfaceTexture()}),dark=new T.MeshStandardMaterial({color:0x172430,metalness:.78,roughness:.5}),gold=new T.MeshStandardMaterial({color:0x9c7748,metalness:.85,roughness:.35});
  const glow=new T.MeshBasicMaterial({color:new T.Color(.3,1.3,1.5)});
  for(const [r,t,z,mat] of [[radius,5,0,metal],[radius+13,2,0,dark],[radius-7,.35,-1,glow],[radius+5,1.4,9,gold],[radius+5,1.4,-9,gold]]){const m=new T.Mesh(new T.TorusGeometry(r,t,10,160),mat);m.position.z=z;root.add(m);}
  const dummy=new T.Object3D(),modules=new T.InstancedMesh(new T.BoxGeometry(11,14,23),metal,56),struts=new T.InstancedMesh(new T.BoxGeometry(3,39,4),gold,28),lights=new T.InstancedMesh(new T.BoxGeometry(7,.35,.35),glow,112);
  for(let i=0;i<56;i++){const a=i/56*Math.PI*2;dummy.position.set(Math.cos(a)*(radius+2),Math.sin(a)*(radius+2),0);dummy.rotation.set(0,0,a-Math.PI/2);dummy.updateMatrix();modules.setMatrixAt(i,dummy.matrix);for(let k=0;k<2;k++){dummy.position.z=k?12:-12;dummy.updateMatrix();lights.setMatrixAt(i*2+k,dummy.matrix);}}
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2;dummy.position.set(Math.cos(a)*(radius+15),Math.sin(a)*(radius+15),0);dummy.rotation.set(0,0,a-Math.PI/2);dummy.updateMatrix();struts.setMatrixAt(i,dummy.matrix);}
  root.add(modules,struts,lights);
  const solar=new T.MeshStandardMaterial({map:surfaceTexture('solar'),color:0xa5bdcf,metalness:.72,roughness:.3,side:T.DoubleSide});
  for(let i=0;i<8;i++){const a=i*Math.PI/4,arm=new T.Group();arm.position.set(Math.cos(a)*(radius+35),Math.sin(a)*(radius+35),0);arm.rotation.z=a-Math.PI/2;root.add(arm);box(arm,dark,2,70,3,0,20,0);for(const side of [-1,1]){box(arm,gold,26,63,1.1,side*15,25,0);box(arm,solar,25,61,.3,side*15,25,2);}}
  return root;
}
