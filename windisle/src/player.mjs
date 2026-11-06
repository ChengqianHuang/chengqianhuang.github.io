// 风屿 - 主角装配与程序化动画。
// 骨架由组层级构成，姿态通道平滑过渡；朱红飘带用 verlet 链做次级运动。
// 只读取引擎状态（只读渲染层），不修改任何规则数据。
import * as THREE from 'three';
import { toonMaterial, addOutline, PALETTE } from './art.mjs';

const smooth = (cur, target, k, dt) => cur + (target - cur) * (1 - Math.exp(-k * dt));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const clamp01 = (t) => Math.max(0, Math.min(1, t));

function capsule(r, len, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat);
  m.castShadow = true;
  return m;
}

function buildSword() {
  const g = new THREE.Group();
  const steel = toonMaterial(PALETTE.steel, { rim: 0xbfeaf4, rimStrength: 0.5, emissive: 0x2a5a66, emissiveIntensity: 0.35 });
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.78, 0.015), steel);
  blade.position.y = 0.52;
  blade.castShadow = true;
  g.add(blade);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.14, 4), steel);
  tip.position.y = 0.97;
  tip.rotation.y = Math.PI / 4;
  g.add(tip);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.035, 0.05), toonMaterial(PALETTE.bossRing, { rimStrength: 0.3 }));
  guard.position.y = 0.12;
  g.add(guard);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.16, 8), toonMaterial(0x35494f, { rimStrength: 0.2 }));
  grip.position.y = 0.02;
  g.add(grip);
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), toonMaterial(PALETTE.scarf, { rimStrength: 0.4 }));
  knot.position.set(0, -0.07, 0);
  g.add(knot);
  addOutline(blade, 0.012);
  return g;
}

export function createPlayerRig(scene) {
  const root = new THREE.Group();
  scene.add(root);

  const matJacket = toonMaterial(PALETTE.jacket, { rim: 0xffe9b8, rimStrength: 0.32 });
  const matJacketLight = toonMaterial(PALETTE.jacketLight, { rim: 0xffe9b8, rimStrength: 0.3 });
  const matSkin = toonMaterial(PALETTE.skin, { rim: 0xffe0c0, rimStrength: 0.18 });
  const matHair = toonMaterial(PALETTE.hair, { rim: 0x9fd8e8, rimStrength: 0.4 });
  const matDark = toonMaterial(0x24343a, { rimStrength: 0.15 });

  // 姿态通道初值（静止姿势）
  const ch = {
    hipsY: 0, leanX: 0, twistY: 0, headX: 0, headY: 0,
    shRx: 0.22, shRy: 0, shRz: -0.12, elR: 0.4,
    shLx: 0.2, shLy: 0, shLz: 0.12, elL: 0.35,
    hipR: 0, hipL: 0, kneeR: 0.05, kneeL: 0.05,
    swordX: 0.5, swordZ: -0.3,
  };

  const body = new THREE.Group(); root.add(body);
  const hips = new THREE.Group(); hips.position.y = 0.92; body.add(hips);

  // 躯干
  const torso = capsule(0.21, 0.34, matJacket);
  torso.position.y = 0.3;
  torso.scale.set(1, 1, 0.82);
  hips.add(torso);
  addOutline(torso, 0.03);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.215, 12, 10), matJacketLight);
  chest.position.set(0, 0.4, 0.06);
  chest.scale.set(0.92, 0.8, 0.72);
  hips.add(chest);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.035, 6, 16), toonMaterial(0x2b3f45, { rimStrength: 0.2 }));
  belt.position.y = 0.08;
  belt.rotation.x = Math.PI / 2;
  belt.scale.set(1, 1, 0.82);
  hips.add(belt);
  const sash = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.02), toonMaterial(PALETTE.scarf, { rimStrength: 0.3 }));
  sash.position.set(-0.12, 0.28, 0.15);
  sash.rotation.z = 0.35;
  hips.add(sash);

  // 头
  const neck = new THREE.Group(); neck.position.y = 0.62; hips.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), matSkin);
  head.position.y = 0.24;
  head.scale.set(1, 1.04, 0.96);
  head.castShadow = true;
  neck.add(head);
  addOutline(head, 0.028);
  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 12), matHair);
  hairBack.position.set(0, 0.27, -0.05);
  hairBack.scale.set(1.02, 1.02, 1);
  neck.add(hairBack);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), matHair);
  fringe.position.set(0, 0.26, 0.015);
  fringe.rotation.x = 0.22;
  neck.add(fringe);
  const ponytail = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 4, 8), matHair);
  ponytail.position.set(0, 0.1, -0.3);
  ponytail.rotation.x = 0.5;
  neck.add(ponytail);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.035, 10), new THREE.MeshBasicMaterial({ color: 0x223238 }));
    eye.position.set(side * 0.1, 0.22, 0.262);
    neck.add(eye);
    const speck = new THREE.Mesh(new THREE.CircleGeometry(0.011, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    speck.position.set(side * 0.1 + side * 0.012, 0.232, 0.268);
    neck.add(speck);
  }

  // 手臂（肩 pivot 在躯干上部）
  function makeArm(side) {
    const sh = new THREE.Group();
    sh.position.set(side * 0.27, 0.5, 0);
    hips.add(sh);
    const upper = capsule(0.07, 0.2, matJacket);
    upper.position.y = -0.16;
    sh.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -0.33;
    sh.add(elbow);
    const fore = capsule(0.06, 0.18, matSkin);
    fore.position.y = -0.14;
    elbow.add(fore);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.09, 10), matJacketLight);
    cuff.position.y = -0.05;
    elbow.add(cuff);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 7), matSkin);
    hand.position.y = -0.3;
    elbow.add(hand);
    return { sh, elbow };
  }
  const armR = makeArm(1);
  const armL = makeArm(-1);
  // 剑挂在右手
  const sword = buildSword();
  sword.position.set(0, -0.34, 0.02);
  armR.elbow.add(sword);

  // 腿
  function makeLeg(side) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.12, -0.04, 0);
    hips.add(hip);
    const thigh = capsule(0.085, 0.24, matDark);
    thigh.position.y = -0.2;
    hip.add(thigh);
    const knee = new THREE.Group();
    knee.position.y = -0.42;
    hip.add(knee);
    const shin = capsule(0.07, 0.22, matDark);
    shin.position.y = -0.18;
    knee.add(shin);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), toonMaterial(0x87613e, { rimStrength: 0.2 }));
    boot.position.set(0, -0.36, 0.05);
    knee.add(boot);
    return { hip, knee };
  }
  const legR = makeLeg(1);
  const legL = makeLeg(-1);

  // 飘带 verlet 链（世界空间模拟）
  const SCARF_N = 8, SCARF_SEG = 0.15;
  const scarfPts = [], scarfPrev = [];
  for (let i = 0; i < SCARF_N; i++) { scarfPts.push(new THREE.Vector3(0, 1.5, -i * SCARF_SEG)); scarfPrev.push(scarfPts[i].clone()); }
  const scarfGeo = new THREE.BufferGeometry();
  const scarfPos = new Float32Array(SCARF_N * 2 * 3);
  const scarfCol = new Float32Array(SCARF_N * 2 * 3);
  const scarfIdx = [];
  for (let i = 0; i < SCARF_N - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
    scarfIdx.push(a, b, c, b, d, c);
  }
  scarfGeo.setIndex(scarfIdx);
  scarfGeo.setAttribute('position', new THREE.BufferAttribute(scarfPos, 3));
  scarfGeo.setAttribute('color', new THREE.BufferAttribute(scarfCol, 3));
  const scarf = new THREE.Mesh(scarfGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  scarf.frustumCulled = false;
  scene.add(scarf);
  const anchorWorld = new THREE.Vector3();
  const segDir = new THREE.Vector3(), sideVec = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);

  function updateScarf(dt, time, velocity, anchorLocal, reduced) {
    neck.updateWorldMatrix(true, false);
    anchorWorld.set(anchorLocal.x, anchorLocal.y, anchorLocal.z).applyMatrix4(neck.matrixWorld);
    scarfPts[0].copy(anchorWorld);
    scarfPrev[0].copy(anchorWorld);
    const windX = Math.sin(time * 2.1) * 0.3 + 0.22;
    const windZ = Math.cos(time * 1.6) * 0.25 + 0.38;
    const speed = Math.hypot(velocity.x, velocity.z);
    for (let i = 1; i < SCARF_N; i++) {
      const p = scarfPts[i], prev = scarfPrev[i];
      const vx = (p.x - prev.x) * 0.94, vy = (p.y - prev.y) * 0.94, vz = (p.z - prev.z) * 0.94;
      prev.copy(p);
      p.x += vx; p.y += vy; p.z += vz;
      p.y -= 2.6 * dt * dt * 60 * (1 / 60);
      const windK = (i / SCARF_N) * (0.9 + speed * 0.35);
      p.x += (windX * 1.4 - velocity.x * 0.32) * windK * dt;
      p.z += (windZ * 1.4 - velocity.z * 0.32) * windK * dt;
      p.y += Math.sin(time * 3.1 + i) * 0.006;
    }
    for (let iter = 0; iter < 3; iter++) {
      for (let i = 1; i < SCARF_N; i++) {
        const a = scarfPts[i - 1], b = scarfPts[i];
        segDir.subVectors(b, a);
        const len = segDir.length() || 0.0001;
        segDir.multiplyScalar((len - SCARF_SEG) / len);
        if (i === 1) b.sub(segDir);
        else { a.add(segDir.multiplyScalar(0.5)); b.sub(segDir); }
      }
    }
    // 构建飘带网格（水平横带，沿段方向展开，尾端收窄）
    const camRight = new THREE.Vector3();
    for (let i = 0; i < SCARF_N; i++) {
      const p = scarfPts[i];
      const next = scarfPts[Math.min(i + 1, SCARF_N - 1)];
      const prev = scarfPts[Math.max(i - 1, 0)];
      segDir.subVectors(next, prev).normalize();
      sideVec.crossVectors(segDir, UP).normalize();
      const w = 0.13 * (1 - i / SCARF_N * 0.72);
      const shade = 1 - (i / SCARF_N) * 0.42;
      scarfPos[i * 6 + 0] = p.x - sideVec.x * w; scarfPos[i * 6 + 1] = p.y; scarfPos[i * 6 + 2] = p.z - sideVec.z * w;
      scarfPos[i * 6 + 3] = p.x + sideVec.x * w; scarfPos[i * 6 + 4] = p.y; scarfPos[i * 6 + 5] = p.z + sideVec.z * w;
      scarfCol[i * 6 + 0] = 1 * shade; scarfCol[i * 6 + 1] = 0.353 * shade; scarfCol[i * 6 + 2] = 0.235 * shade;
      scarfCol[i * 6 + 3] = scarfCol[i * 6 + 0] * 0.82; scarfCol[i * 6 + 4] = scarfCol[i * 6 + 1] * 0.82; scarfCol[i * 6 + 5] = scarfCol[i * 6 + 2] * 0.82;
    }
    scarfGeo.attributes.position.needsUpdate = true;
    scarfGeo.attributes.color.needsUpdate = true;
  }

  // ---- 姿态目标集
  function restPose() {
    return { hipsY: 0, leanX: 0, twistY: 0, headX: 0, headY: 0,
      shRx: 0.22, shRy: 0, shRz: -0.12, elR: 0.4,
      shLx: 0.2, shLy: 0, shLz: 0.12, elL: 0.35,
      hipR: 0, hipL: 0, kneeR: 0.06, kneeL: 0.06,
      swordX: 0.5, swordZ: -0.3 };
  }

  // 三段斩关键帧
  function attackPose(stage, t01) {
    const p = restPose();
    const WIND = 0.34, STRIKE = 0.62;
    let k;
    if (t01 < WIND) { k = easeInCubic(t01 / WIND); return blendPose(restPose(), windupPose(stage), k); }
    if (t01 < STRIKE) {
      k = easeOutCubic((t01 - WIND) / (STRIKE - WIND));
      return blendPose(windupPose(stage), strikePose(stage), k);
    }
    k = smoothstep((t01 - STRIKE) / (1 - STRIKE));
    return blendPose(strikePose(stage), restPose(), k);
  }
  function windupPose(stage) {
    const p = restPose();
    if (stage === 1) { p.shRy = 1.15; p.shRx = 0.35; p.elR = 1.5; p.twistY = 0.4; p.headY = -0.15; p.shLz = 0.5; p.swordX = 0.1; p.swordZ = 0.2; }
    else if (stage === 2) { p.shRy = -1.6; p.shRx = 0.3; p.elR = 1.6; p.twistY = -0.45; p.headY = 0.18; p.shLz = -0.4; p.swordX = 0.1; p.swordZ = 0.2; }
    else { p.shRx = -2.5; p.shRy = 0.25; p.elR = 0.7; p.leanX = -0.18; p.twistY = 0.25; p.hipsY = 0.04; p.shLx = -1.2; p.shLz = 0.55; p.swordX = 0.35; p.swordZ = 0; }
    return p;
  }
  function strikePose(stage) {
    const p = restPose();
    if (stage === 1) { p.shRy = -1.45; p.shRx = 0.5; p.elR = 0.25; p.twistY = -0.42; p.leanX = 0.12; p.headY = 0.14; p.shLz = -0.55; p.swordX = 1.35; p.swordZ = -0.5; }
    else if (stage === 2) { p.shRy = 1.3; p.shRx = 0.45; p.elR = 0.3; p.twistY = 0.4; p.leanX = 0.12; p.headY = -0.12; p.shLz = 0.5; p.swordX = 1.35; p.swordZ = -0.5; }
    else { p.shRx = 1.05; p.shRy = -0.1; p.elR = 0.15; p.leanX = 0.34; p.twistY = -0.2; p.hipsY = -0.06; p.shLx = 0.7; p.shLz = 0.4; p.kneeR = 0.35; p.kneeL = 0.35; p.swordX = 0.9; p.swordZ = -0.15; }
    return p;
  }
  function blendPose(a, b, k) {
    const out = {};
    for (const key in a) out[key] = a[key] + (b[key] - a[key]) * k;
    return out;
  }
  function smoothstep(t) { t = clamp01(t); return t * t * (3 - 2 * t); }

  let wasHeavy = false;
  let heavyReleaseT = 1;

  const locator=new THREE.Mesh(new THREE.RingGeometry(.54,.6,40),new THREE.MeshBasicMaterial({color:0xffe5a1,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide}));
  locator.rotation.x=-Math.PI/2;locator.position.y=.045;root.add(locator);

  function update(state, dt, time, reduced) {
    const p = state.player;
    root.position.set(p.x, 0, p.z);
    // 朝向平滑
    let targetFace = p.face;
    const dFace = ((targetFace - root.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    root.rotation.y += dFace * (1 - Math.exp(-16 * dt));

    const target = restPose();
    const moving = p.moving > 0.05 && p.dashT <= 0;

    if (p.dashT > 0) {
      target.leanX = 0.42; target.headX = -0.15;
      target.shRx = 0.95; target.shLx = 0.85; target.shRz = -0.5; target.shLz = 0.5;
      target.hipR = -0.7; target.hipL = 0.5; target.kneeR = 0.8; target.kneeL = 0.4;
      target.swordX = 1.8; target.swordZ = -0.8;
      body.scale.set(1, 1.05, 1);
    } else {
      body.scale.set(1, 1, 1);
      if (p.comboStage > 0) {
        const dur = [0.3, 0.34, 0.5][p.comboStage - 1] / p.stats.atkSpeed;
        Object.assign(target, attackPose(p.comboStage, clamp01(p.comboT / dur)));
      } else if (p.heavyT >= 0) {
        const k = clamp01(p.heavyT / 0.55);
        target.shRx = -2.4; target.shRy = 0.1; target.elR = 0.6;
        target.shLx = -2.0; target.shLz = 0.5;
        target.leanX = -0.12 - k * 0.08; target.hipsY = 0.03;
        target.headX = -0.25; target.swordX = 0.3; target.swordZ = 0;
        body.scale.setScalar(1 + Math.sin(time * 20) * 0.012 * k);
      } else if (heavyReleaseT < 0.28) {
        heavyReleaseT += dt;
        const k = heavyReleaseT / 0.28;
        target.shRx = -2.4 + smoothstep(k) * 3.3; target.elR = 0.2;
        target.leanX = -0.12 + smoothstep(k) * 0.45;
        target.swordX = 0.3 + smoothstep(k) * 0.6;
      } else if (p.hurtT > 0) {
        const k = p.hurtT / 0.35;
        target.leanX = -0.3 * k; target.headX = -0.3 * k;
        target.shRx = -0.8 * k; target.shLx = -0.7 * k;
      } else if (moving) {
        const s = Math.sin(p.runT * 8.5), c = Math.sin(p.runT * 8.5 + Math.PI);
        const amp = 0.15 + p.moving * 0.62;
        target.hipR = s * amp; target.hipL = c * amp;
        target.kneeR = Math.max(0.06, -c * amp * 1.1 + 0.15); target.kneeL = Math.max(0.06, -s * amp * 1.1 + 0.15);
        target.shRx = c * amp * 0.55 + 0.1; target.shLx = s * amp * 0.55 + 0.1;
        target.shRz = -0.2; target.shLz = 0.2;
        target.leanX = 0.14 * p.moving;
        target.hipsY = Math.abs(Math.sin(p.runT * 8.5)) * 0.045 * p.moving;
        target.swordX = 0.9; target.swordZ = -0.55;
        target.headX = -0.06;
      } else {
        // 呼吸待机
        target.hipsY = Math.sin(time * 2.1) * 0.014;
        target.shRx = 0.22 + Math.sin(time * 2.1) * 0.02;
        target.shLx = 0.2 + Math.sin(time * 2.1 + 1) * 0.02;
        target.headY = Math.sin(time * 0.7) * 0.08;
        target.swordX = 0.5 + Math.sin(time * 1.3) * 0.04;
      }
    }

    // 蓄力释放检测（供短暂跟随姿态）
    if (wasHeavy && p.heavyT < 0) heavyReleaseT = 0;
    wasHeavy = p.heavyT >= 0;

    // 平滑应用
    for (const key in ch) ch[key] = smooth(ch[key], target[key], key === 'hipsY' ? 18 : 14, dt);
    hips.position.y = 0.92 + ch.hipsY;
    body.rotation.x = ch.leanX;
    body.rotation.y = ch.twistY;
    neck.rotation.x = ch.headX; neck.rotation.y = ch.headY;
    armR.sh.rotation.set(ch.shRx, ch.shRy, ch.shRz);
    armR.elbow.rotation.x = -ch.elR;
    armL.sh.rotation.set(ch.shLx, 0, ch.shLz);
    armL.elbow.rotation.x = -ch.elL;
    legR.hip.rotation.x = ch.hipR; legR.knee.rotation.x = ch.kneeR;
    legL.hip.rotation.x = ch.hipL; legL.knee.rotation.x = ch.kneeL;
    sword.rotation.x = ch.swordX; sword.rotation.z = ch.swordZ;

    updateScarf(dt, time, { x: p.vx, z: p.vz }, { x: 0, y: 0.55, z: -0.2 }, reduced);
  }

  return { root, update };
}
