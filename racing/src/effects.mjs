import * as T from 'three';

export function createTireSmoke(scene){
  const count=160,positions=new Float32Array(count*3),life=new Float32Array(count),velocity=new Float32Array(count*3),opacity=new Float32Array(count);
  positions.fill(-1000);const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('alpha',new T.BufferAttribute(opacity,1));
  const cloud=new T.Points(geometry,new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{pixelRatio:{value:Math.min(devicePixelRatio,1.5)}},
    vertexShader:'attribute float alpha;uniform float pixelRatio;varying float vAlpha;void main(){vAlpha=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=min(95.,(70.+(1.-alpha)*55.)*pixelRatio/max(1.,-p.z));}',
    fragmentShader:'varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;float a=exp(-r*r*4.)*smoothstep(1.,.6,r)*vAlpha*.22;gl_FragColor=vec4(.74,.74,.68,a);}'
  }));cloud.frustumCulled=false;scene.add(cloud);let cursor=0,emit=0;
  return (dt,car,active)=>{
    for(let i=0;i<count;i++)if(life[i]>0){life[i]-=dt;opacity[i]=Math.max(0,life[i]/1.5);positions[i*3]+=velocity[i*3]*dt;positions[i*3+1]+=dt*.7;positions[i*3+2]+=velocity[i*3+2]*dt;}
    emit+=dt;const slip=Math.abs(car.vx*Math.cos(car.yaw)-car.vz*Math.sin(car.yaw));
    if(active&&car.velocity>8&&car.y<1.3&&(car.input.handbrake||slip>3)&&emit>.035){emit=0;for(const side of [-1,1]){
      const i=cursor++%count;life[i]=1.5;positions[i*3]=car.x-Math.sin(car.yaw)*1.48+Math.cos(car.yaw)*side;positions[i*3+1]=.25;positions[i*3+2]=car.z-Math.cos(car.yaw)*1.48-Math.sin(car.yaw)*side;velocity[i*3]=-car.vx*.08+(Math.random()-.5);velocity[i*3+2]=-car.vz*.08+(Math.random()-.5);
    }}
    geometry.attributes.position.needsUpdate=true;geometry.attributes.alpha.needsUpdate=true;
  };
}
