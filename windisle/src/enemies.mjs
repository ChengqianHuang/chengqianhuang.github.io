// 风屿 - 敌人装配。每种魔物独立造型，姿态由引擎相位驱动；受击闪白、阶段变色。
import * as THREE from 'three';
import { toonMaterial, addOutline, PALETTE } from './art.mjs';

const smooth = (cur, target, k, dt) => cur + (target - cur) * (1 - Math.exp(-k * dt));

function flashables(group) {
  const list = [];
  group.traverse((o) => {
    if (o.isMesh && o.material && o.material.isMeshToonMaterial) list.push(o.material);
  });
  return list;
}

function makeRusher() {
  const g = new THREE.Group();
  const mat = toonMaterial(PALETTE.rusher, { rim: 0xffd9a8, rimStrength: 0.35 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 14, 12), mat);
  body.position.y = 0.5;
  body.scale.set(1, 0.86, 1);
  body.castShadow = true;
  g.add(body);
  addOutline(body, 0.04);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), toonMaterial(0xd9a86a, { rimStrength: 0.2 }));
  belly.position.set(0, 0.44, 0.24);
  belly.scale.set(0.8, 0.7, 0.55);
  g.add(belly);
  for (const side of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 6), toonMaterial(0xf0e6d2, { rimStrength: 0.3 }));
    horn.position.set(side * 0.22, 0.92, 0);
    horn.rotation.z = -side * 0.5;
    g.add(horn);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), mat);
    foot.position.set(side * 0.24, 0.1, 0.08);
    g.add(foot);
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.055, 8), new THREE.MeshBasicMaterial({ color: 0x2a1a10 }));
    eye.position.set(side * 0.16, 0.6, 0.46);
    g.add(eye);
  }
  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.02), new THREE.MeshBasicMaterial({ color: 0x2a1a10 }));
  browL.position.set(-0.16, 0.7, 0.45); browL.rotation.z = -0.5;
  g.add(browL);
  const browR = browL.clone(); browR.position.x = 0.16; browR.rotation.z = 0.5;
  g.add(browR);
  return { group: g, body, mats: flashables(g) };
}

function makeThrower() {
  const g = new THREE.Group();
  const mat = toonMaterial(PALETTE.thrower, { rim: 0xfff3c4, rimStrength: 0.3 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 12), mat);
  body.position.y = 0.62;
  body.scale.set(0.8, 1.15, 0.8);
  body.castShadow = true;
  g.add(body);
  addOutline(body, 0.04);
  const pouch = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), toonMaterial(0x7a8a44, { rimStrength: 0.3 }));
  pouch.position.set(0.3, 0.7, 0.3);
  g.add(pouch);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfdf6e0 }));
  eye.position.set(0, 0.86, 0.36);
  g.add(eye);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: 0x22303a }));
  pupil.position.set(0, 0.86, 0.44);
  g.add(pupil);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.34, 6), toonMaterial(0x5c6b34, { rimStrength: 0.2 }));
  stem.position.y = 1.4;
  g.add(stem);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), toonMaterial(0x6d7d3e, { rimStrength: 0.25 }));
  leaf.position.set(0.12, 1.56, 0);
  leaf.scale.set(1.4, 0.4, 0.7);
  leaf.rotation.z = -0.5;
  g.add(leaf);
  return { group: g, body, pouch, mats: flashables(g) };
}

function makeCharger() {
  const g = new THREE.Group();
  const mat = toonMaterial(PALETTE.charger, { rim: 0xffd9a8, rimStrength: 0.32 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 12), mat);
  body.position.y = 0.58;
  body.scale.set(0.95, 0.8, 1.25);
  body.castShadow = true;
  g.add(body);
  addOutline(body, 0.045);
  const mane = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), toonMaterial(0x7a4530, { rimStrength: 0.3 }));
  mane.position.set(0, 0.78, -0.3);
  mane.scale.set(1, 0.6, 0.9);
  g.add(mane);
  for (const side of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 6), toonMaterial(0xefe4cc, { rimStrength: 0.35 }));
    horn.position.set(side * 0.26, 0.62, 0.68);
    horn.rotation.x = Math.PI / 2.3;
    g.add(horn);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.36, 8), mat);
    leg.position.set(side * 0.3, 0.18, 0.3);
    g.add(leg);
    const leg2 = leg.clone(); leg2.position.z = -0.3;
    g.add(leg2);
  }
  const eyeL = new THREE.Mesh(new THREE.CircleGeometry(0.05, 8), new THREE.MeshBasicMaterial({ color: 0x2a1408 }));
  eyeL.position.set(-0.2, 0.72, 0.56);
  g.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.2;
  g.add(eyeR);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), toonMaterial(0xc08058, { rimStrength: 0.2 }));
  snout.position.set(0, 0.5, 0.7);
  snout.scale.set(1, 0.7, 0.8);
  g.add(snout);
  return { group: g, body, mats: flashables(g) };
}

function makeBrute() {
  const g = new THREE.Group();
  const mat = toonMaterial(PALETTE.brute, { rim: 0xd8e8dc, rimStrength: 0.28 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 0.8), mat);
  body.position.y = 0.78;
  body.castShadow = true;
  g.add(body);
  addOutline(body, 0.05);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.45), toonMaterial(0x59685f, { rimStrength: 0.3 }));
  head.position.set(0, 1.5, 0.05);
  g.add(head);
  addOutline(head, 0.04);
  const helm = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.52), toonMaterial(0x43524b, { rimStrength: 0.3 }));
  helm.position.set(0, 1.72, 0.02);
  g.add(helm);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.03), new THREE.MeshBasicMaterial({ color: 0x9fe8d0 }));
  visor.position.set(0, 1.5, 0.27);
  g.add(visor);
  const shield = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.14), toonMaterial(0x4a5a50, { rim: 0xffe2b0, rimStrength: 0.4 }));
  shield.position.set(0, 0.8, 0.55);
  shield.castShadow = true;
  g.add(shield);
  const emblem = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 6, 18), toonMaterial(PALETTE.bossRing, { rimStrength: 0.3 }));
  emblem.position.set(0, 0.85, 0.65);
  g.add(emblem);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.24), mat);
    arm.position.set(side * 0.75, 0.85, 0.15);
    g.add(arm);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), toonMaterial(0x525f57, { rimStrength: 0.2 }));
    leg.position.set(side * 0.28, 0.15, 0);
    g.add(leg);
  }
  return { group: g, body, head, shield, mats: flashables(g) };
}

function makeBoss() {
  const g = new THREE.Group();
  const coreMat = toonMaterial(PALETTE.bossCore, { rim: 0x7fe8d8, rimStrength: 0.5, emissive: 0x0d3a3e, emissiveIntensity: 1 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), coreMat);
  core.position.y = 2.1;
  core.castShadow = true;
  g.add(core);
  addOutline(core, 0.06);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), new THREE.MeshBasicMaterial({ color: 0x5fe8cf, transparent: true, opacity: 0.85 }));
  inner.position.y = 2.1;
  g.add(inner);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
  eye.position.set(0, 2.25, 1.05);
  g.add(eye);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0x4a1a10 }));
  pupil.position.set(0, 2.25, 1.2);
  g.add(pupil);
  const ringMat = toonMaterial(PALETTE.bossRing, { rim: 0xfff0c0, rimStrength: 0.4 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.09, 8, 40), ringMat);
  ring1.position.y = 2.1;
  ring1.rotation.x = Math.PI / 2.4;
  g.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.07, 8, 44), ringMat);
  ring2.position.y = 2.1;
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.5;
  g.add(ring2);
  const shards = [];
  for (let i = 0; i < 6; i++) {
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), toonMaterial(0x3a7a78, { rim: 0x9fe8d8, rimStrength: 0.5 }));
    g.add(shard);
    shards.push(shard);
  }
  const base = new THREE.Mesh(new THREE.CircleGeometry(2.1, 24), toonMaterial(0x3a6a62, { rimStrength: 0 }));
  base.rotation.x = -Math.PI / 2;
  base.position.y = 0.02;
  base.material.transparent = true;
  base.material.opacity = 0.5;
  g.add(base);
  return { group: g, core, inner, eye, ring1, ring2, shards, mats: flashables(g), coreMat };
}

const FACTORIES = { rusher: makeRusher, thrower: makeThrower, charger: makeCharger, brute: makeBrute, boss: makeBoss };

export class EnemyRigs {
  constructor(scene) {
    this.scene = scene;
    this.map = new Map();
    this.dead = [];
  }

  sync(state, dt, time, reduced) {
    const alive=new Set(state.enemies.map(e=>e.id));
    for(const[id,rig]of this.map)if(!alive.has(id)){
      this.dead.push({rig,t:0,start:rig.built.group.position.clone(),face:rig.built.group.rotation.y});this.map.delete(id);
    }
    for(let i=this.dead.length-1;i>=0;i--){
      const d=this.dead[i];d.t+=dt;const k=d.t/(reduced?.16:.38),g=d.rig.built.group;
      if(k>=1||this.dead.length>24){this.dispose(g);this.dead.splice(i,1);continue;}
      const size=1-k*k;g.scale.set(size,Math.max(.03,size*(1-k*.65)),size);
      if(!reduced){g.rotation.z=k*1.1;g.position.y=d.start.y+Math.sin(k*Math.PI)*.18;g.position.x=d.start.x+Math.sin(d.face)*k*.35;g.position.z=d.start.z+Math.cos(d.face)*k*.35;}
      for(const m of d.rig.built.mats)m.emissive.setRGB(.25*(1-k),.12*(1-k),0);
    }
    for (const e of state.enemies) {
      let rig = this.map.get(e.id);
      if (!rig) {
        const built = FACTORIES[e.type]();
        this.scene.add(built.group);
        rig = { built, spawnT: 0 };
        this.map.set(e.id, rig);
      }
      rig.spawnT = Math.min(1, rig.spawnT + dt * 2.2);
      this.updateRig(rig, e, dt, time, reduced);
    }
  }

  dispose(group){
    this.scene.remove(group);const geometries=new Set(),materials=new Set();
    group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [].concat(o.material))materials.add(m);});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
  }
  reset(){for(const r of this.map.values())this.dispose(r.built.group);for(const d of this.dead)this.dispose(d.rig.built.group);this.map.clear();this.dead.length=0;}

  updateRig(rig, e, dt, time, reduced) {
    const { group, body, mats } = rig.built;
    const T = e.type === 'boss' ? null : e.type;
    const spawnK = rig.spawnT < 1 ? Math.sin(rig.spawnT * Math.PI / 2) : 1;
    const scale = spawnK * (rig.spawnT < 1 ? 0.6 + rig.spawnT * 0.4 : 1);
    group.position.set(e.x, 0, e.z);

    // 受击闪白
    const flash = e.flash > 0 ? e.flash / 0.18 : 0;
    for (const m of mats) {
      m.emissiveIntensity = flash > 0 ? 1 : (m.userData.baseEI ?? 1);
      m.emissive.setRGB(flash, flash, flash);
    }

    let y = 0, sx = 1, sy = 1, sz = 1, tiltX = 0, tiltZ = 0;
    const at = e.animT;

    if (e.type === 'rusher') {
      y = Math.abs(Math.sin(at * 7)) * 0.16;
      sy = 1 - Math.abs(Math.sin(at * 7 + 0.5)) * 0.06;
      if (e.phase === 'windup') { const k = 1 - e.t / 0.45; sx = sy = 1 + k * 0.22; tiltX = -0.15 * k; }
      else if (e.phase === 'lunge') { sz = 1.35; sy = 0.8; tiltX = 0.35; y = 0.1; }
      else if (e.phase === 'recover') { tiltZ = Math.sin(at * 14) * 0.08; }
    } else if (e.type === 'thrower') {
      y = Math.abs(Math.sin(at * 3.2)) * 0.08;
      tiltZ = Math.sin(at * 2.4) * 0.06;
      if (rig.built.pouch) {
        const k = e.cd < 0.6 ? 1 - e.cd / 0.6 : 0;
        rig.built.pouch.scale.setScalar(1 + k * 1.4);
        rig.built.pouch.position.y = 0.7 + k * 0.15;
      }
    } else if (e.type === 'charger') {
      if (e.phase === 'aim') { const k = 1 - e.t / 0.8; tiltX = -0.22 * k; y = -0.05 * k; if (!reduced) group.position.x += Math.sin(time * 40) * 0.02 * k; }
      else if (e.phase === 'charge') { tiltX = 0.28; sz = 1.25; y = 0.05; }
      else if (e.phase === 'dizzy') { tiltZ = Math.sin(time * 6) * 0.16; y = -0.08; }
      else { y = Math.abs(Math.sin(at * 5)) * 0.06; }
    } else if (e.type === 'brute') {
      if (e.phase === 'slam') {
        const k = 1 - e.t / 0.9;
        if (k < 0.5) { tiltX = -0.18 * (k * 2); y = -0.12 * (k * 2); }
        else { tiltX = 0.25 * ((k - 0.5) * 2); y = 0.05; sy = 1.06; }
      } else if (e.phase === 'recover') { tiltX = 0.2; y = -0.08; }
      else { tiltX = Math.sin(at * 2.2) * 0.04; }
    } else if (e.type === 'boss') {
      const b = rig.built;
      const hover = Math.sin(time * 1.4) * 0.16 + 0.25;
      b.core.position.y = b.inner.position.y = b.eye.position.y = 2.1 + hover;
      b.pupil && (b.eye.children.length);
      b.ring1.position.y = b.ring2.position.y = 2.1 + hover;
      const spin = time * (0.6 + e.bossPhase * 0.5);
      b.ring1.rotation.z = spin;
      b.ring2.rotation.z = -spin * 0.8;
      for (let i = 0; i < b.shards.length; i++) {
        const a = spin * 1.4 + (i / 6) * Math.PI * 2;
        const r = 2.6;
        b.shards[i].position.set(Math.cos(a) * r, 2.1 + hover + Math.sin(time * 2 + i) * 0.3, Math.sin(a) * r);
        b.shards[i].rotation.set(time + i, time * 0.7 + i, 0);
      }
      // 阶段色调
      const tint = e.bossPhase === 3 ? [1, 0.3, 0.25] : e.bossPhase === 2 ? [1, 0.72, 0.3] : [0.35, 0.9, 0.8];
      b.inner.material.color.setRGB(...tint);
      if (e.phase === 'stun') {
        tiltZ = Math.sin(time * 9) * 0.1;
        b.ring1.rotation.x = Math.PI / 2 + 0.5;
        b.ring2.rotation.x = Math.PI / 1.7 + 0.4;
        b.eye.material.color.setRGB(0.6, 0.6, 0.6);
      } else {
        b.ring1.rotation.x = smooth(b.ring1.rotation.x, Math.PI / 2.4, 4, dt);
        b.ring2.rotation.x = smooth(b.ring2.rotation.x, Math.PI / 1.7, 4, dt);
        b.eye.material.color.setRGB(1, 0.91, 0.66);
      }
      b.core.rotation.y = time * 0.5;
      b.core.rotation.x = Math.sin(time * 0.7) * 0.2;
      const pulse = 1 + Math.sin(time * 3.4) * 0.03;
      b.inner.scale.setScalar(pulse);
      group.position.y = 0;
    }

    // Visual recoil follows the existing physical knockback, without moving hitboxes.
    if(flash>0&&e.type!=='boss'){
      sx*=1+flash*.12;sy*=1-flash*.19;sz*=1+flash*.08;
      if(!reduced){tiltX-=Math.cos(e.face-Math.atan2(e.kbx||0,e.kbz||0))*flash*.22;tiltZ+=Math.sin(e.face-Math.atan2(e.kbx||0,e.kbz||0))*flash*.2;}
    }
    group.scale.set(scale * sx, scale * sy, scale * sz);
    if (e.type !== 'boss') {
      group.rotation.x = tiltX;
      group.rotation.z = tiltZ;
      group.position.y = y;
      group.rotation.y = e.face;
    }
  }
}
