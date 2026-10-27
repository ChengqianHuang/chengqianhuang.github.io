import * as T from 'three';
import {rng} from './flight.mjs';
import {glowTexture} from './art.mjs';
const noise=`
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*noise3(p);p=p*2.03+vec3(7.1,1.7,9.2);a*=.5;}return f;}
`;
const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPos;varying vec3 vWorld;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vPos=position;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
export async function createCosmos(){
  const loader=new T.TextureLoader(),[day,night,cloud]=await Promise.all(['/periapsis/assets/earth-day.jpg','/periapsis/assets/earth-night.png','/periapsis/assets/earth-clouds.png'].map(url=>loader.loadAsync(url)));day.colorSpace=night.colorSpace=T.SRGBColorSpace;day.anisotropy=8;cloud.wrapS=T.RepeatWrapping;
  const root=new T.Group(),uniforms={sun:{value:new T.Vector3(-.6,.35,.8).normalize()},style:{value:0},time:{value:0},dayMap:{value:day},nightMap:{value:night},cloudMap:{value:cloud}};
  const planetMat=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:`${noise}
varying vec2 vUv;varying vec3 vNormal;varying vec3 vPos;varying vec3 vWorld;uniform vec3 sun;uniform float style;uniform float time;uniform sampler2D dayMap;uniform sampler2D nightMap;uniform sampler2D cloudMap;
void main(){vec3 n=normalize(vNormal),p=normalize(vPos),view=normalize(cameraPosition-vWorld);float daylight=dot(n,sun);vec3 base=texture2D(dayMap,vUv).rgb;float ocean=smoothstep(.015,.055,base.b-base.r);
float clouds=texture2D(cloudMap,vec2(fract(vUv.x+time*.00015),vUv.y)).a;clouds*=.72;
if(style>.5&&style<1.5){base*=vec3(1.1,.92,.78);}
base=mix(base,vec3(.6,.68,.75),clouds);float shade=smoothstep(-.12,.6,daylight);vec3 color=base*(.018+shade*1.15);float spec=pow(max(dot(reflect(-sun,n),view),0.),65.);color+=vec3(.4,.6,.8)*spec*ocean*(1.-clouds)*shade*.35;
vec3 city=texture2D(nightMap,vUv).rgb;color+=city*vec3(1.5,.95,.5)*(1.-shade)*(1.-clouds);
float rim=pow(1.-max(dot(n,view),0.),4.);color+=vec3(.015,.12,.3)*rim*sqrt(shade);gl_FragColor=vec4(color,1.);}`});
  const planet=new T.Mesh(new T.SphereGeometry(2700,128,96),planetMat);planet.position.set(-2450,-1550,-6200);planet.rotation.z=-.24;root.add(planet);
  const atmosphere=new T.Mesh(new T.SphereGeometry(2790,96,64),new T.ShaderMaterial({uniforms,vertexShader:vertex,transparent:true,depthWrite:false,side:T.BackSide,blending:T.AdditiveBlending,fragmentShader:`varying vec3 vNormal;varying vec3 vWorld;uniform vec3 sun;void main(){vec3 n=normalize(vNormal),v=normalize(cameraPosition-vWorld);float rim=pow(1.-abs(dot(n,v)),5.);float lit=smoothstep(-.4,.7,dot(n,sun));gl_FragColor=vec4(mix(vec3(.015,.09,.22),vec3(.08,.4,.9),lit),rim*.72);}`}));atmosphere.position.copy(planet.position);root.add(atmosphere);
  const sky=new T.Mesh(new T.SphereGeometry(14000,32,20),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,vertexShader:`varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`${noise}varying vec3 vDir;void main(){vec3 p=normalize(vDir);float band=exp(-pow((p.y+p.x*.22-.06)*8.,2.));float n=fbm(p*5.);vec3 col=vec3(.0006,.0014,.0035)+vec3(.007,.012,.019)*band*n;col+=vec3(.009,.004,.001)*pow(n,4.);gl_FragColor=vec4(col,1.);}`}));root.add(sky);
  const random=rng(918),positions=[],colors=[],sizes=[];
  for(let i=0;i<3000;i++){const z=random()*2-1,a=random()*Math.PI*2,r=11000,s=Math.sqrt(1-z*z);positions.push(Math.cos(a)*s*r,z*r,Math.sin(a)*s*r);const hot=random(),v=.35+Math.pow(random(),6)*2;colors.push(v*(hot>.8?1:.7),v*(hot>.8?.8:.85),v);sizes.push(.6+random()*1.5);}
  const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));starGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));starGeo.setAttribute('size',new T.Float32BufferAttribute(sizes,1));
  root.add(new T.Points(starGeo,new T.ShaderMaterial({vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending,vertexShader:`attribute float size;varying vec3 vColor;void main(){vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size;}`,fragmentShader:`varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vColor,smoothstep(.5,.05,d));}`})));
  const sun=new T.Sprite(new T.SpriteMaterial({map:glowTexture(),color:new T.Color(.7,.45,.2),depthWrite:false,blending:T.AdditiveBlending}));sun.position.set(3800,1900,-9000);sun.scale.set(1350,1350,1);root.add(sun);
  const core=new T.Sprite(new T.SpriteMaterial({map:glowTexture(),color:new T.Color(5,4,2.5),depthWrite:false,blending:T.AdditiveBlending}));core.position.copy(sun.position);core.scale.set(95,95,1);root.add(core);
  const moon=new T.Mesh(new T.SphereGeometry(145,48,32),new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:`${noise}varying vec3 vNormal;varying vec3 vPos;uniform vec3 sun;void main(){vec3 p=normalize(vPos);float shade=smoothstep(-.1,.8,dot(normalize(vNormal),sun));float detail=fbm(p*20.);gl_FragColor=vec4(vec3(.14,.15,.16)*(.5+detail)*(.04+shade),1.);}`}));moon.position.set(2200,750,-7000);root.add(moon);
  return {root,update(time,style,config={}){uniforms.time.value=time;uniforms.style.value=style;uniforms.sun.value.set(.95,.2,style===2?-.6:.22).normalize();planet.rotation.y=(config.planetRotation??(style===2?4.:style===1?2.6:1.15))+time*.0005;planet.rotation.z=config.planetTilt??-.24;}};
}
