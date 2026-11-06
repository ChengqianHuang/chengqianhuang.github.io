// 风屿 - 场景构建：草甸竞技场、崖壁、瀑布、浅池、树、浮岛、天空与光。
// 全部程序化生成。update(dt) 推进风摆、水流与云。
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ARENA_RADIUS } from './engine.mjs';
import { toonMaterial, addOutline, radialTexture, cloudTexture, jitterGeometry, PALETTE } from './art.mjs';

export const SUN_DIR = new THREE.Vector3(0.78, 0.4, -0.42).normalize();

function grassBladeGeometry() {
  const a = new THREE.PlaneGeometry(0.13, 0.55);
  a.translate(0, 0.27, 0);
  const b = a.clone();
  b.rotateY(Math.PI / 2);
  return mergeGeometries([a, b]);
}

function flowerGeometry() {
  const stem = new THREE.CylinderGeometry(0.02, 0.03, 0.34, 5);
  stem.translate(0, 0.17, 0);
  const head = new THREE.SphereGeometry(0.09, 7, 6);
  head.scale(1, 0.62, 1);
  head.translate(0, 0.36, 0);
  return mergeGeometries([stem, head]);
}

function makeTree(rng) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 1.7, 7), toonMaterial(PALETTE.trunk, { rimStrength: 0.14 }));
  trunk.position.y = 0.85;
  trunk.castShadow = true;
  g.add(trunk);
  addOutline(trunk, 0.04);
  const leafMat = toonMaterial(rng() < 0.5 ? PALETTE.leafA : PALETTE.leafB, { rim: 0xffe9b8, rimStrength: 0.3 });
  for (let i = 0; i < 3; i++) {
    const r = 1.05 - i * 0.18;
    const blob = new THREE.Mesh(jitterGeometry(new THREE.IcosahedronGeometry(r, 1), 0.16, rng), leafMat);
    blob.position.set((rng() - 0.5) * 0.5, 1.9 + i * 0.62, (rng() - 0.5) * 0.5);
    blob.scale.y = 0.82;
    blob.castShadow = true;
    g.add(blob);
    addOutline(blob, 0.045);
  }
  return g;
}

function makeIslet(rng) {
  const g = new THREE.Group();
  const rock = new THREE.Mesh(jitterGeometry(new THREE.ConeGeometry(1.6, 2.6, 7), 0.22, rng), toonMaterial(PALETTE.cliffDark, { rimStrength: 0.2 }));
  rock.rotation.x = Math.PI;
  g.add(rock);
  const cap = new THREE.Mesh(jitterGeometry(new THREE.CylinderGeometry(1.55, 1.35, 0.5, 7), 0.1, rng), toonMaterial(PALETTE.grassA, { rimStrength: 0.24 }));
  cap.position.y = 1.2;
  g.add(cap);
  const tree = makeTree(rng);
  tree.scale.setScalar(0.55);
  tree.position.y = 1.4;
  g.add(tree);
  return g;
}

export function createWorld(scene, { reducedMotion = false } = {}) {
  const rng = (() => { let s = 20261101; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
  const group = new THREE.Group();
  scene.add(group);
  const animated = { grass: [], water: [], clouds: [], islets: [], rays: [] };

  // ---- 地面
  const ground = new THREE.Mesh(new THREE.CircleGeometry(ARENA_RADIUS + 2.4, 72), toonMaterial(PALETTE.grassA, { rimStrength: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);
  // 草色斑块，打破均质
  for (let i = 0; i < 7; i++) {
    const patch = new THREE.Mesh(new THREE.CircleGeometry(2.2 + rng() * 3.4, 20), toonMaterial(i % 2 ? 0x82ca66 : 0x6ab558, { rimStrength: 0 }));
    patch.rotation.x = -Math.PI / 2;
    const a = rng() * Math.PI * 2, r = rng() * (ARENA_RADIUS - 3);
    patch.position.set(Math.cos(a) * r, 0.012 + i * 0.001, Math.sin(a) * r);
    group.add(patch);
  }
  // 中央石环（竞技场标记）
  const mark = new THREE.Mesh(new THREE.RingGeometry(6.3, 6.58, 64), new THREE.MeshBasicMaterial({ color: 0xf3ead2, transparent: true, opacity: 0.32 }));
  mark.rotation.x = -Math.PI / 2;
  mark.position.y = 0.045;
  group.add(mark);

  // ---- 崖壁（留出瀑布缺口）
  const GAP = Math.PI * 0.78;
  const rockGeos = [0, 1, 2, 3].map(() => jitterGeometry(new THREE.IcosahedronGeometry(1, 1), 0.12, rng));
  for (let i = 0; i < 17; i++) {
    const a = (i / 17) * Math.PI * 2;
    let da = Math.abs(((a - GAP + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (da < 0.4) continue; // 缺口
    const geo = rockGeos[i % 4];
    const rock = new THREE.Mesh(geo, toonMaterial(i % 3 ? 0x9caf8a : 0x849678, { rim: 0xffe2b0, rimStrength: 0.22 }));
    const r = ARENA_RADIUS + 2.6 + rng() * 2.2;
    rock.position.set(Math.cos(a) * r, 0.4 + rng() * 0.6, Math.sin(a) * r);
    rock.scale.set(2.4 + rng() * 2, 3 + rng() * 3.2, 2.4 + rng() * 2);
    rock.rotation.y = rng() * Math.PI;
    rock.castShadow = true;
    group.add(rock);
  }

  // ---- 瀑布与水潭
  const wfGroup = new THREE.Group();
  const wfUniforms = { uTime: { value: 0 } };
  const wfMat = new THREE.ShaderMaterial({
    uniforms: wfUniforms,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; varying vec2 vUv;
      void main() {
        float flow = fract(vUv.y * 2.4 - uTime * 1.5);
        float bands = smoothstep(0.25, 0.0, abs(flow - 0.5) - 0.18) * 0.55 + 0.35;
        float edge = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
        float alpha = edge * (0.55 + bands * 0.4);
        vec3 col = mix(vec3(0.62, 0.86, 0.92), vec3(1.0), bands * 0.7);
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  const wf = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 6.4, 1, 1), wfMat);
  wf.position.set(Math.cos(GAP) * (ARENA_RADIUS + 3.4), 3.2, Math.sin(GAP) * (ARENA_RADIUS + 3.4));
  wf.lookAt(0, 3.2, 0);
  wfGroup.add(wf);
  const foam = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), toonMaterial(0xf2fbfb, { rimStrength: 0 }, { transparent: true, opacity: 0.75 }));
  foam.rotation.x = -Math.PI / 2;
  foam.position.set(Math.cos(GAP) * (ARENA_RADIUS + 1.2), 0.03, Math.sin(GAP) * (ARENA_RADIUS + 1.2));
  wfGroup.add(foam);
  group.add(wfGroup);
  animated.water.push({ uniforms: wfUniforms, rate: 1 });

  // ---- 场内浅池（纯装饰）
  const pondUniforms = { uTime: { value: 0 } };
  const pond = new THREE.Mesh(new THREE.CircleGeometry(2.9, 36), new THREE.ShaderMaterial({
    uniforms: pondUniforms, transparent: true,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; varying vec2 vUv;
      void main() {
        vec2 c = vUv - 0.5; float d = length(c) * 2.0;
        float bands = sin((c.x + c.y) * 22.0 - uTime * 2.1) * 0.5 + 0.5;
        vec3 col = mix(vec3(0.23, 0.66, 0.70), vec3(0.62, 0.92, 0.94), bands * 0.45);
        float foam = smoothstep(0.78, 0.9, d) * (0.5 + 0.5 * sin(uTime * 3.0 + d * 40.0));
        col = mix(col, vec3(0.95, 0.99, 1.0), foam * 0.8);
        float alpha = smoothstep(1.0, 0.86, d);
        gl_FragColor = vec4(col, alpha);
      }`,
  }));
  pond.rotation.x = -Math.PI / 2;
  const pondA = GAP + Math.PI * 0.9;
  pond.position.set(Math.cos(pondA) * (ARENA_RADIUS - 3.4), 0.02, Math.sin(pondA) * (ARENA_RADIUS - 3.4));
  group.add(pond);
  animated.water.push({ uniforms: pondUniforms, rate: 1 });

  // ---- 外围树
  for (let i = 0; i < 11; i++) {
    const a = rng() * Math.PI * 2;
    const r = ARENA_RADIUS + 6.5 + rng() * 7;
    const tree = makeTree(rng);
    tree.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    const s = 1 + rng() * 0.7;
    tree.scale.setScalar(s);
    tree.rotation.y = rng() * Math.PI * 2;
    group.add(tree);
  }

  // ---- 浮空岛
  for (let i = 0; i < 4; i++) {
    const islet = makeIslet(rng);
    const a = GAP + (i + 0.7) * (Math.PI * 2 / 4.6);
    const r = ARENA_RADIUS + 6 + rng() * 5;
    islet.position.set(Math.cos(a) * r, 6.5 + rng() * 4.5, Math.sin(a) * r);
    islet.scale.setScalar(0.9 + rng() * 0.7);
    islet.userData.baseY = islet.position.y;
    islet.userData.phase = rng() * 10;
    group.add(islet);
    animated.islets.push(islet);
  }

  // ---- 草（实例化 + 顶点风摆）
  const grassCount = reducedMotion ? 400 : 1000;
  const grassGeo = grassBladeGeometry();
  const grassMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: null, side: THREE.DoubleSide });
  // 简单渐变映射复用：直接给草用普通 toon
  grassMat.gradientMap = (() => { const d = new Uint8Array([120, 210]); const t = new THREE.DataTexture(d, 2, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  grassMat.userData.uniforms = { uTime: { value: 0 } };
  grassMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = grassMat.userData.uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          float phase = instanceMatrix[3][0] * 0.37 + instanceMatrix[3][2] * 0.43;
          float amp = smoothstep(0.0, 0.55, position.y);
          transformed.x += sin(uTime * 1.9 + phase) * 0.12 * amp;
          transformed.z += cos(uTime * 1.47 + phase * 1.31) * 0.09 * amp;
        #endif
      `);
  };
  const grass = new THREE.InstancedMesh(grassGeo, grassMat, grassCount);
  const dummy = new THREE.Object3D();
  const cA = new THREE.Color(PALETTE.grassA), cB = new THREE.Color(PALETTE.grassB), tmpC = new THREE.Color();
  for (let i = 0; i < grassCount; i++) {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * (ARENA_RADIUS - 1.2);
    dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    dummy.rotation.y = rng() * Math.PI;
    const s = 0.7 + rng() * 0.8;
    dummy.scale.set(s, s * (0.4 + rng() * 0.35), s);
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
    tmpC.lerpColors(cA, cB, rng());
    grass.setColorAt(i, tmpC);
  }
  grass.instanceMatrix.needsUpdate = true;
  group.add(grass);
  animated.grass.push(grassMat);

  // ---- 花
  const flowerCount = reducedMotion ? 40 : 130;
  const flowers = new THREE.InstancedMesh(flowerGeometry(), toonMaterial(0xffffff, { rimStrength: 0.2 }), flowerCount);
  const fColors = [0xfff3f3, 0xffd9e2, 0xfff0b8, 0xe8d5ff].map((c) => new THREE.Color(c));
  for (let i = 0; i < flowerCount; i++) {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * (ARENA_RADIUS - 2);
    dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    dummy.rotation.set(0, rng() * Math.PI, 0);
    dummy.scale.setScalar(0.8 + rng() * 0.7);
    dummy.updateMatrix();
    flowers.setMatrixAt(i, dummy.matrix);
    flowers.setColorAt(i, fColors[i % fColors.length]);
  }
  group.add(flowers);

  // ---- 天空穹顶
  const skyUniforms = { uSunDir: { value: SUN_DIR.clone() } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 18), new THREE.ShaderMaterial({
    uniforms: skyUniforms, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 uSunDir; varying vec3 vDir;
      void main() {
        float h = clamp(vDir.y, -0.1, 1.0);
        vec3 zenith = vec3(0.16, 0.40, 0.66);
        vec3 mid = vec3(0.50, 0.72, 0.85);
        vec3 horizon = vec3(0.93, 0.76, 0.55);
        vec3 col = mix(horizon, mid, smoothstep(0.0, 0.22, h));
        col = mix(col, zenith, smoothstep(0.2, 0.75, h));
        float sunAmt = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 5.0);
        col += vec3(1.0, 0.72, 0.38) * sunAmt * 0.28;
        gl_FragColor = vec4(col, 1.0);
      }`,
  }));
  group.add(sky);

  // ---- 太阳光晕
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture('rgba(255,244,214,0.95)', 'rgba(255,214,140,0)', 128), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0.55 }));
  sunGlow.position.copy(SUN_DIR).multiplyScalar(240);
  sunGlow.scale.setScalar(52);
  group.add(sunGlow);

  // ---- 云
  const cloudTex = cloudTexture();
  for (let i = 0; i < 12; i++) {
    const cloud = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0.5 + rng() * 0.35, depthWrite: false, fog: false }));
    const a = rng() * Math.PI * 2;
    const r = 70 + rng() * 120;
    cloud.position.set(Math.cos(a) * r, 34 + rng() * 40, Math.sin(a) * r);
    cloud.scale.set(30 + rng() * 34, 12 + rng() * 12, 1);
    cloud.userData.speed = 0.6 + rng() * 1.2;
    group.add(cloud);
    animated.clouds.push(cloud);
  }

  // ---- 斜射光片
  if (!reducedMotion) {
    for (let i = 0; i < 3; i++) {
      const ray = new THREE.Mesh(new THREE.PlaneGeometry(46, 9), new THREE.MeshBasicMaterial({ color: 0xfff3d0, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      ray.position.copy(SUN_DIR).multiplyScalar(26).add(new THREE.Vector3((i - 1) * 10, 0, (i - 1) * 6));
      ray.lookAt(ray.position.clone().add(new THREE.Vector3(-SUN_DIR.x, 0.4, -SUN_DIR.z)));
      ray.userData.phase = i * 2.1;
      group.add(ray);
      animated.rays.push(ray);
    }
  }

  // ---- 光照与雾
  const sun = new THREE.DirectionalLight(PALETTE.sun, 2.1);
  sun.position.copy(SUN_DIR).multiplyScalar(60);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -28; sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 28; sun.shadow.camera.bottom = -28;
  sun.shadow.camera.near = 20; sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xcfe9ff, 0x73975a, 1.1));
  scene.fog = new THREE.Fog(0xffdcae, 95, 260);

  let t = 0;
  function update(dt) {
    t += dt;
    for (const m of animated.grass) m.userData.uniforms.uTime.value = t;
    for (const w of animated.water) w.uniforms.uTime.value = t * w.rate;
    for (const cloud of animated.clouds) {
      cloud.position.x += cloud.userData.speed * dt;
      if (cloud.position.x > 200) cloud.position.x = -200;
    }
    for (const islet of animated.islets) {
      if (reducedMotion) continue;
      islet.position.y = islet.userData.baseY + Math.sin(t * 0.6 + islet.userData.phase) * 0.4;
    }
    for (const ray of animated.rays) {
      ray.material.opacity = 0.045 + Math.sin(t * 0.7 + ray.userData.phase) * 0.02;
    }
  }

  return { group, update, sunDir: SUN_DIR };
}
