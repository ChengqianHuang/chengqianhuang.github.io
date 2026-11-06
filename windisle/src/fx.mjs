// 风屿 - 特效系统：预警区贴花、刀光、粒子、花瓣、伤害数字、镜头震动。
// 每帧同步引擎状态中的预警与弹幕；事件只消费不回写。
import * as THREE from 'three';
import { telegraphShape } from './combat-geometry.mjs';
import { toonMaterial, radialTexture, addOutline, PALETTE } from './art.mjs';

const TAU = Math.PI * 2;

class Pool {
  constructor(n, make) {
    this.items = [];
    for (let i = 0; i < n; i++) { const it = make(); it.userData.active = false; this.items.push(it); }
  }
  get() { return this.items.find((it) => !it.userData.active) || null; }
}

export class FX {
  constructor(scene, camera, damageLayer, { reducedMotion = false } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.damageLayer = damageLayer;
    this.reduced = reducedMotion;
    this.time = 0;
    this.shake = 0;
    this.hitstop = 0;
    this.tmpV = new THREE.Vector3();

    // ---- 刀光弧（深玉色，明亮场景下可读）
    this.arcs = new Pool(8, () => {
      const mat = new THREE.MeshBasicMaterial({ color: 0x1d6b58, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.RingGeometry(0.5, 2.2, 26, 1, 0, 2.2), mat);
      mesh.visible = false;
      scene.add(mesh);
      return mesh;
    });
    // ---- 冲击环
    this.rings = new Pool(10, () => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.RingGeometry(0.82, 1, 40), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.visible = false;
      scene.add(mesh);
      return mesh;
    });
    // ---- 火花
    const sparkGeo = new THREE.SphereGeometry(0.05, 6, 4);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
    this.sparks = new THREE.InstancedMesh(sparkGeo, sparkMat, 90);
    this.sparks.frustumCulled = false;
    this.sparkData = new Array(90).fill(null).map(() => ({ x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1 }));
    scene.add(this.sparks);
    this.sparkCursor = 0;
    // ---- 尘土 / 光点 sprite
    const dustTex = radialTexture('rgba(235,245,225,0.85)', 'rgba(235,245,225,0)', 64);
    this.dusts = new Pool(20, () => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, transparent: true, opacity: 0, depthWrite: false }));
      s.visible = false;
      scene.add(s);
      return s;
    });
    // ---- 花瓣
    this.petalMax = reducedMotion ? 0 : 90;
    if (this.petalMax > 0) {
      const petalGeo = new THREE.PlaneGeometry(0.13, 0.1);
      const petalMat = new THREE.MeshBasicMaterial({ color: PALETTE.petal, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false });
      this.petals = new THREE.InstancedMesh(petalGeo, petalMat, this.petalMax);
      this.petals.frustumCulled = false;
      scene.add(this.petals);
      this.petalData = new Array(this.petalMax).fill(null).map((_, i) => this.spawnAmbientPetal({}, true, i));
      this.dummy = new THREE.Object3D();
    }
    // ---- 预警贴花
    this.decals = new Map(); // tg 对象 -> {group, fill, edge, bomb}
    // ---- 弹幕
    this.blades = new Map();
    this.bullets = new Map();
    // ---- 伤害数字 DOM 池
    this.dmgPool = [];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('span');
      el.className = 'dmg-num';
      el.style.display = 'none';
      damageLayer.appendChild(el);
      this.dmgPool.push({ el, life: 0, x: 0, y: 0, vy: 0, world: new THREE.Vector3() });
    }
    this.flashSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture('rgba(255,255,240,1)', 'rgba(255,255,240,0)', 64), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.flashSprite.scale.setScalar(3.2);
    scene.add(this.flashSprite);
    this.flashT = 1;
  }

  makeBladeMesh() {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: 0x9ff0e0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.075, 6, 14, Math.PI * 1.25), mat);
    g.add(arc);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat);
    g.add(core);
    return g;
  }

  makeBulletMesh() {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff7a55 }));
    g.add(core);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture('rgba(255,150,90,0.9)', 'rgba(255,150,90,0)', 64), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.setScalar(1.15);
    g.add(glow);
    return g;
  }

  // ---------------- 事件消费
  drain(events) {
    for (const ev of events) {
      switch (ev.type) {
        case 'slash': this.spawnArc(ev); break;
        case 'heavy': this.spawnRing(ev.x, ev.z, 4.6, 0xfff0c0, 0.32); this.addShake(0.32); this.flash(ev.x, ev.z, 0.5); break;
        case 'burst': this.spawnRing(ev.x, ev.z, 7, 0xbaffe4, 0.5); this.addShake(0.5); this.flash(ev.x, ev.z, 1); this.petalBurst(ev.x, ev.z, 26); break;
        case 'hit': {
          const heavy=ev.attack==='heavy'||ev.attack==='burst', finisher=ev.stage===3;
          this.spawnSparks(ev.x, 1, ev.z, ev.blocked?3:heavy?12:finisher?9:4, ev.blocked?0xb8d4dc:heavy?0xffc25c:0xffefd0);
          if(!ev.blocked){this.addShake(heavy?.2:finisher?.13:.045);if(heavy||finisher)this.spawnRing(ev.x,ev.z,heavy?2.2:1.4,0xe3b063,.18);}
          this.spawnDmg(ev.dmg,ev.x,1.5,ev.z,ev.blocked?'blocked':heavy||finisher?'crit':'');
          if(!this.reduced)this.hitstop=Math.max(this.hitstop,ev.blocked?.012:heavy?.075:finisher?.055:.025);
          break;
        }
        case 'kill': {
          const boss=ev.enemyType==='boss';
          this.spawnRing(ev.x,ev.z,boss?9:1.8,boss?0xffd080:0xf2d5a8,boss?.6:.25);
          this.spawnSparks(ev.x,1,ev.z,boss?26:7,0xffd08c);this.spawnDust(ev.x,ev.z,boss?5:2);
          this.addShake(boss?.5:.1);if(!this.reduced)this.hitstop=Math.max(this.hitstop,boss?.12:.045);break;
        }
        case 'playerHurt': this.addShake(0.38); this.spawnDmg('受伤', ev.x, 2, ev.z, 'player'); break;
        case 'dash': if (!this.reduced) this.spawnDust(ev.x, ev.z, 5); break;
        case 'blade': break;
        case 'bossPhase': this.spawnRing(ev.x, ev.z, 10, 0xffb090, 0.7); this.addShake(0.5); this.flash(ev.x, ev.z, 1); break;
        case 'bossStun': this.spawnRing(ev.x, ev.z, 6, 0xffe9a8, 0.5); this.addShake(0.3); break;
        case 'bossRing': this.spawnRing(ev.x, ev.z, 5, 0xff9a70, 0.45); break;
        case 'spawnPoof': this.spawnRing(ev.x, ev.z, 2, 0xbdf0e0, 0.4); this.spawnDust(ev.x, ev.z, 3); break;
        case 'lobDone': this.spawnRing(ev.x, ev.z, 2.6, 0xffb090, 0.4); this.spawnSparks(ev.x, 0.6, ev.z, 6, 0xffb090); break;
        case 'telegraphDone': this.flash(ev.x, ev.z, 0.8); break;
      }
    }
  }

  spawnArc(ev) {
    const arc = this.arcs.get();
    if (!arc) return;
    const big = ev.stage === 3;
    arc.userData.active = true;
    arc.visible = true;
    arc.userData.t = 0;
    arc.userData.dur = 0.2;
    arc.userData.scale = big ? 1.5 : 1;
    arc.position.set(ev.x, 0.08, ev.z);
    arc.rotation.order = 'YXZ';
    arc.rotation.set(-Math.PI / 2, ev.face, 0);
    arc.material.color.setHex(big ? 0x9a5b28 : 0x1d6b58);
    arc.material.opacity = 0.85;
    // 弧心朝向面朝方向：thetaStart 相应偏移
    if(!arc.userData.swapped){arc.geometry.dispose();arc.userData.swapped=true;}
    arc.geometry = big ? this.arcGeoBig ?? (this.arcGeoBig = new THREE.RingGeometry(0.55, 2.6, 26, 1, -Math.PI / 2 - 1.15, 2.3))
      : this.arcGeo ?? (this.arcGeo = new THREE.RingGeometry(0.5, 2.2, 26, 1, -Math.PI / 2 - 1.0, 2.0));
  }

  spawnRing(x, z, radius, color, dur) {
    const ring = this.rings.get();
    if (!ring) return;
    ring.userData.active = true;
    ring.visible = true;
    ring.userData.t = 0;
    ring.userData.dur = dur;
    ring.userData.radius = radius;
    ring.position.set(x, 0.06, z);
    ring.material.color.setHex(color);
    ring.material.opacity = 0.9;
    ring.scale.setScalar(0.3);
  }

  spawnSparks(x, y, z, n, color) {
    if (this.reduced) n = Math.ceil(n / 2);
    for (let i = 0; i < n; i++) {
      const s = this.sparkData[this.sparkCursor];
      this.sparkCursor = (this.sparkCursor + 1) % this.sparkData.length;
      const a = Math.random() * TAU, up = 1.5 + Math.random() * 3;
      const sp = 2.5 + Math.random() * 3.5;
      s.x = x; s.y = y; s.z = z;
      s.vx = Math.cos(a) * sp; s.vy = up; s.vz = Math.sin(a) * sp;
      s.max = s.life = 0.3 + Math.random() * 0.25;
    }
    this.sparks.material.color.setHex(color);
  }

  spawnDust(x, z, n) {
    for (let i = 0; i < n; i++) {
      const d = this.dusts.get();
      if (!d) break;
      d.userData.active = true;
      d.visible = true;
      d.userData.t = 0;
      d.userData.dur = 0.5 + Math.random() * 0.3;
      d.userData.rise = 0.8 + Math.random() * 0.8;
      const a = Math.random() * TAU;
      d.position.set(x + Math.cos(a) * 0.4, 0.25, z + Math.sin(a) * 0.4);
      d.scale.setScalar(0.4 + Math.random() * 0.4);
      d.material.opacity = 0.5;
    }
  }

  flash(x, z, strength) {
    if(this.reduced)return;
    this.flashT = 0;
    this.flashSprite.position.set(x, 1.4, z);
    this.flashSprite.material.opacity = 0.5 * strength;
  }

  spawnAmbientPetal(p, init, idx) {
    const a = Math.random() * TAU;
    const r = Math.sqrt(Math.random()) * 20;
    p.x = Math.cos(a) * r;
    p.z = Math.sin(a) * r;
    p.y = init ? Math.random() * 9 : 8.5 + Math.random() * 2;
    p.vx = (Math.random() - 0.5) * 0.4;
    p.vy = -(0.55 + Math.random() * 0.5);
    p.vz = (Math.random() - 0.5) * 0.4;
    p.rx = Math.random() * TAU; p.ry = Math.random() * TAU;
    p.phase = Math.random() * TAU;
    p.ambient = true;
    p.life = 1;
    return p;
  }

  petalBurst(x, z, n) {
    if (this.reduced || !this.petalData) return;
    let placed = 0;
    for (const p of this.petalData) {
      if (placed >= n) break;
      if (!p.ambient) continue;
      p.ambient = false;
      const a = Math.random() * TAU;
      const sp = 2 + Math.random() * 3;
      p.x = x; p.y = 1 + Math.random(); p.z = z;
      p.vx = Math.cos(a) * sp; p.vy = 2 + Math.random() * 2.5; p.vz = Math.sin(a) * sp;
      p.life = 1.4;
      placed++;
    }
  }

  spawnDmg(text, x, y, z, cls = '') {
    const d = this.dmgPool.find((p) => p.life <= 0) || this.dmgPool[0];
    d.life = 0.8;
    d.world.set(x, y, z);
    d.vy = 0;
    d.el.textContent = typeof text === 'number' ? (cls === 'crit' ? `${text}!` : `${text}`) : text;
    d.el.className = `dmg-num ${cls}`;
    d.el.style.display = 'block';
  }

  addShake(amount) { if (!this.reduced) this.shake = Math.min(0.9, this.shake + amount); }
  requestHitstop() { return this.hitstop; }
  getShakeOffset(out) {
    if (this.shake <= 0.001) return out.set(0, 0, 0);
    const s = this.shake * 0.16;
    return out.set((Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
  }

  // ---------------- 逐帧推进
  update(dt, state) {
    this.time += dt;
    this.shake = Math.max(0, this.shake - dt * 2.2);
    this.hitstop = Math.max(0, this.hitstop - dt);

    // 刀光
    for (const arc of this.arcs.items) {
      if (!arc.userData.active) continue;
      arc.userData.t += dt;
      const k = arc.userData.t / arc.userData.dur;
      if (k >= 1) { arc.userData.active = false; arc.visible = false; continue; }
      const s = (0.55 + k * 0.75) * arc.userData.scale;
      arc.scale.setScalar(s);
      arc.material.opacity = 0.85 * (1 - k * k);
    }
    // 冲击环
    for (const ring of this.rings.items) {
      if (!ring.userData.active) continue;
      ring.userData.t += dt;
      const k = ring.userData.t / ring.userData.dur;
      if (k >= 1) { ring.userData.active = false; ring.visible = false; continue; }
      ring.scale.setScalar(0.3 + k * ring.userData.radius);
      ring.material.opacity = 0.9 * (1 - k);
    }
    // 火花
    const M = new THREE.Matrix4();
    const Q = new THREE.Quaternion();
    const S = new THREE.Vector3();
    const P = new THREE.Vector3();
    for (let i = 0; i < this.sparkData.length; i++) {
      const s = this.sparkData[i];
      if (s.life <= 0) { M.makeScale(0, 0, 0); this.sparks.setMatrixAt(i, M); continue; }
      s.life -= dt;
      s.vy -= 9 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
      if (s.y < 0.05) { s.y = 0.05; s.vy *= -0.4; }
      const k = Math.max(0, s.life / s.max);
      P.set(s.x, s.y, s.z);
      S.setScalar(0.4 + k * 0.9);
      M.compose(P, Q, S);
      this.sparks.setMatrixAt(i, M);
    }
    this.sparks.instanceMatrix.needsUpdate = true;
    // 尘土
    for (const d of this.dusts.items) {
      if (!d.userData.active) continue;
      d.userData.t += dt;
      const k = d.userData.t / d.userData.dur;
      if (k >= 1) { d.userData.active = false; d.visible = false; continue; }
      d.position.y += d.userData.rise * dt;
      d.scale.setScalar(d.scale.x + dt * 1.4);
      d.material.opacity = 0.5 * (1 - k);
    }
    // 花瓣
    if (this.petalData) {
      for (let i = 0; i < this.petalData.length; i++) {
        const p = this.petalData[i];
        if (!p.ambient) {
          p.life -= dt;
          p.vy -= 4 * dt;
          if (p.life <= 0) { this.spawnAmbientPetal(p, false); continue; }
        }
        p.phase += dt * 2;
        p.x += (p.vx + Math.sin(p.phase) * 0.5) * dt;
        p.y += p.vy * dt;
        p.z += (p.vz + Math.cos(p.phase * 0.8) * 0.4) * dt;
        if (p.ambient && (p.y < 0.05 || Math.hypot(p.x, p.z) > 21)) this.spawnAmbientPetal(p, false);
        this.dummy.position.set(p.x, p.y, p.z);
        this.dummy.rotation.set(p.rx + p.phase, p.ry, p.phase * 0.7);
        const fade = p.ambient ? 1 : Math.min(1, p.life * 2);
        this.dummy.scale.setScalar(fade);
        this.dummy.updateMatrix();
        this.petals.setMatrixAt(i, this.dummy.matrix);
      }
      this.petals.instanceMatrix.needsUpdate = true;
    }
    // 全屏闪光衰减
    this.flashT += dt;
    this.flashSprite.material.opacity *= Math.pow(0.001, dt);

    if (state) {
      this.syncDecals(state, dt);
      this.syncProjectiles(state);
      this.updateDamageNumbers(dt);
    }
  }

  // Keep the full danger boundary fixed; only the inner timer changes.
  syncDecals(state, dt) {
    const seen=new Set();
    for(const tg of state.telegraphs){
      seen.add(tg);let d=this.decals.get(tg);const shape=telegraphShape(tg);
      if(!d){
        const group=new THREE.Group();
        const material=(color,opacity)=>new THREE.MeshBasicMaterial({color,opacity,transparent:true,depthWrite:false,depthTest:false,side:THREE.DoubleSide});
        const make=(geo,mat,y)=>{const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;m.position.y=y;m.renderOrder=4;group.add(m);return m;};
        let fill,edge,timer;
        if(shape.kind==='line'){
          fill=make(new THREE.PlaneGeometry(shape.width,shape.length),material(0xa12d21,.24),.045);
          // Edge is a rectangular frame with its outer extent exactly on the damage bounds.
          const frame=new THREE.Shape();const w=shape.width/2,l=shape.length/2;
          frame.moveTo(-w,-l);frame.lineTo(w,-l);frame.lineTo(w,l);frame.lineTo(-w,l);frame.closePath();
          const hole=new THREE.Path();hole.moveTo(-w+.08,-l+.08);hole.lineTo(-w+.08,l-.08);hole.lineTo(w-.08,l-.08);hole.lineTo(w-.08,-l+.08);hole.closePath();frame.holes.push(hole);
          edge=make(new THREE.ShapeGeometry(frame),material(0xffd09a,.95),.055);
          fill.position.z=edge.position.z=shape.center;
          timer=make(new THREE.PlaneGeometry(shape.width,.12),material(0xffe9be,.95),.06);
        }else{
          fill=make(new THREE.CircleGeometry(shape.radius,48),material(0xa12d21,.24),.045);
          edge=make(new THREE.RingGeometry(Math.max(0,shape.radius-.09),shape.radius,48),material(0xffd09a,.95),.055);
          timer=make(new THREE.RingGeometry(.94,1,48),material(0xffe9be,.85),.06);
        }
        let bomb=null;if(tg.kind==='lob'){bomb=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),material(0x71362c,1));group.add(bomb);}
        d={group,fill,edge,timer,bomb};this.scene.add(group);this.decals.set(tg,d);
      }
      const k=Math.max(0,Math.min(1,tg.t/tg.dur));
      d.group.position.set(tg.x,0,tg.z);d.group.rotation.y=shape.angle||0;
      d.fill.material.opacity=.2+k*.18;
      if(shape.kind==='line')d.timer.position.z=-.5+shape.length*k;
      else d.timer.scale.setScalar(Math.max(.02,shape.radius*k));
      if(d.bomb){
        const src=state.enemies.find(e=>e.id===tg.owner)||{x:tg.x,z:tg.z+8};
        d.bomb.position.set((src.x-tg.x)*(1-k),1.2+Math.sin(k*Math.PI)*2.6,(src.z-tg.z)*(1-k));
      }
    }
    for(const [tg,d]of this.decals)if(!seen.has(tg)){this.disposeObject(d.group);this.decals.delete(tg);}
  }

  disposeObject(group){
    this.scene.remove(group);const geometries=new Set(),materials=new Set();
    group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [].concat(o.material))materials.add(m);});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});
  }

  reset(){
    for(const d of this.decals.values())this.disposeObject(d.group);this.decals.clear();
    for(const pool of [this.blades,this.bullets]){for(const m of pool.values())this.disposeObject(m);pool.clear();}
    for(const pool of [this.arcs,this.rings,this.dusts])for(const m of pool.items){m.visible=false;m.userData.active=false;}
    for(const s of this.sparkData)s.life=0;
    for(const d of this.dmgPool){d.life=0;d.el.style.display='none';}
    this.shake=this.hitstop=0;this.flashSprite.material.opacity=0;
    if(this.petalData)for(const p of this.petalData)this.spawnAmbientPetal(p,true);
  }

  syncProjectiles(state) {
    const seenBlade = new Set(), seenBullet = new Set();
    for (const pr of state.projectiles) {
      if (pr.kind === 'blade') {
        seenBlade.add(pr);
        let m = this.blades.get(pr);
        if (!m) { m = this.makeBladeMesh(); this.scene.add(m); this.blades.set(pr, m); }
        m.position.set(pr.x, 0.95, pr.z);
        m.rotation.y = Math.atan2(pr.vx, pr.vz) + Math.PI / 2;
        m.rotation.z += 0.4;
      } else {
        seenBullet.add(pr);
        let m = this.bullets.get(pr);
        if (!m) { m = this.makeBulletMesh(); this.scene.add(m); this.bullets.set(pr, m); }
        m.position.set(pr.x, 0.55, pr.z);
      }
    }
    for (const [pr, m] of this.blades) if (!seenBlade.has(pr)) { this.disposeObject(m); this.blades.delete(pr); }
    for (const [pr, m] of this.bullets) if (!seenBullet.has(pr)) { this.disposeObject(m); this.bullets.delete(pr); }
  }

  updateDamageNumbers(dt) {
    const w = window.innerWidth, h = window.innerHeight;
    for (const d of this.dmgPool) {
      if (d.life <= 0) { d.el.style.display = 'none'; continue; }
      d.life -= dt;
      d.vy += dt * 1.4;
      this.tmpV.copy(d.world);
      this.tmpV.y += d.vy * 0.9;
      this.tmpV.project(this.camera);
      if (this.tmpV.z > 1) { d.el.style.display = 'none'; continue; }
      const sx = (this.tmpV.x * 0.5 + 0.5) * w;
      const sy = (-this.tmpV.y * 0.5 + 0.5) * h;
      d.el.style.left = `${sx}px`;
      d.el.style.top = `${sy}px`;
      d.el.style.opacity = Math.min(1, d.life * 2.5);
    }
  }
}
