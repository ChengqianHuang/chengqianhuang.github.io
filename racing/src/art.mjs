import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function material(color,roughness=.6,metalness=0){return new T.MeshStandardMaterial({color,roughness,metalness});}
export function batch(parent) {
  const buckets=new Map(),dummy=new T.Object3D();
  function add(geometry,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0) {
    dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(1,1,1);dummy.updateMatrix();
    const g=geometry.index?geometry.toNonIndexed():geometry.clone();
    g.applyMatrix4(dummy.matrix);geometry.dispose();
    if(!buckets.has(mat))buckets.set(mat,[]);buckets.get(mat).push(g);
  }
  return {
    add,
    box(mat,x,y,z,sx,sy,sz,ry=0,rx=0,rz=0,round=0) {add(round?new RoundedBoxGeometry(sx,sy,sz,2,round):new T.BoxGeometry(sx,sy,sz),mat,x,y,z,rx,ry,rz);},
    cylinder(mat,x,y,z,rt,rb,h,ry=0,rz=0,n=12){add(new T.CylinderGeometry(rt,rb,h,n),mat,x,y,z,0,ry,rz);},
    beam(mat,a,b,r=.04){const dir=new T.Vector3().subVectors(new T.Vector3(...b),new T.Vector3(...a));const g=new T.CylinderGeometry(r,r,dir.length(),8);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize()));add(g,mat,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);},
    finish(shadows=true){for(const [mat,gs] of buckets){const mesh=new T.Mesh(mergeGeometries(gs),mat);mesh.castShadow=shadows;mesh.receiveShadow=true;parent.add(mesh);for(const g of gs)g.dispose();}buckets.clear();return parent;}
  };
}
export function labelTexture(text,{bg='#172e36',fg='#f6f1dc',width=512,height=128,font=70}={}) {
  const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${font}px Arial`;ctx.fillText(text,width/2,height/2,width*.92);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;
}
export function sign(parent,text,x,y,z,w,h,yaw=0,options={}){
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:labelTexture(text,options),roughness:.7,side:T.DoubleSide}));
  mesh.position.set(x,y,z);mesh.rotation.y=yaw;parent.add(mesh);return mesh;
}
