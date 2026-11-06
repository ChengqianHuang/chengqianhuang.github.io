// 风屿 - 卡通渲染核心：色阶渐变映射、菲涅尔边缘光、背面外扩描边。
// 所有材质基于 MeshToonMaterial（保留阴影与雾支持），通过 onBeforeCompile 注入边缘光。
import * as THREE from 'three';

export const PALETTE = {
  ink: 0x17272b,          // 描边墨色
  sun: 0xfff1d6,
  grassA: 0x7fa770,
  grassB: 0xa6b67b,
  grassDeco: 0x549e4a,
  cliff: 0x8b9d7a,
  cliffDark: 0x6c8064,
  trunk: 0x8a6a48,
  leafA: 0x4fae6e,
  leafB: 0x7cc565,
  water: 0x4fc3c9,
  rock: 0x93a08b,
  jacket: 0x284c66,       // 玩家深蓝外衣，与草地分离
  jacketLight: 0x447a9c,
  skin: 0xffd9b4,
  hair: 0x27404a,
  scarf: 0xff5a3c,        // 朱红飘带
  steel: 0xe8f3f6,
  rusher: 0xba583c,
  thrower: 0x8560a4,
  charger: 0x8b3643,
  brute: 0x536d89,
  bossCore: 0x1f4e52,
  bossRing: 0xd9a441,
  petal: 0xffd9e2,
};

let gradientMapCache = null;
export function getGradientMap() {
  if (gradientMapCache) return gradientMapCache;
  // 4 阶明暗：硬边赛璐璐
  const data = new Uint8Array([96, 160, 216, 255]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  gradientMapCache = tex;
  return tex;
}

// 带边缘光的卡通材质。rim: { color, strength }
export function toonMaterial(color, { rim = 0xffffff, rimStrength = 0.22, emissive = 0x000000, emissiveIntensity = 1, transparent = false, opacity = 1, side = THREE.FrontSide } = {}) {
  const mat = new THREE.MeshToonMaterial({
    color, gradientMap: getGradientMap(), transparent, opacity, side,
    emissive, emissiveIntensity,
  });
  if (rimStrength > 0) {
    mat.userData.uniforms = { uRimColor: { value: new THREE.Color(rim) }, uRimStrength: { value: rimStrength } };
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, mat.userData.uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uRimColor;\nuniform float uRimStrength;')
        .replace('#include <opaque_fragment>', `
          float isleRim = pow(1.0 - clamp(dot(normalize(vViewPosition), normalize(normal)), 0.0, 1.0), 2.4);
          outgoingLight += uRimColor * isleRim * uRimStrength;
          #include <opaque_fragment>
        `);
    };
  }
  return mat;
}

export function updateRimUniform(material, colorHex, strength) {
  const u = material.userData.uniforms;
  if (!u) return;
  if (colorHex !== undefined) u.uRimColor.value.set(colorHex);
  if (strength !== undefined) u.uRimStrength.value = strength;
}

// 背面外扩描边：沿法线膨胀的纯色背面壳
let outlineShader = null;
export function getOutlineMaterial() {
  if (!outlineShader) {
    outlineShader = new THREE.ShaderMaterial({
      uniforms: { uWidth: { value: 0.03 }, uColor: { value: new THREE.Color(PALETTE.ink) } },
      vertexShader: `
        uniform float uWidth;
        void main() {
          vec3 pos = position + normal * uWidth;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 uColor;
        void main() { gl_FragColor = vec4(uColor, 1.0); }`,
      side: THREE.BackSide,
    });
  }
  return outlineShader;
}

// 给网格加描边子壳（共享几何体，继承变换）
export function addOutline(mesh, width = 0.035) {
  const mat = getOutlineMaterial().clone();
  mat.uniforms.uWidth.value = width;
  const shell = new THREE.Mesh(mesh.geometry, mat);
  shell.renderOrder = -1;
  mesh.add(shell);
  return shell;
}

// 柔和径向贴图（光晕 / 云 / 粒子共用）
export function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 128, stops = null) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  if (stops) for (const [o, c] of stops) g.addColorStop(o, c);
  else { g.addColorStop(0, inner); g.addColorStop(1, outer); }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 云朵贴图：几团圆润椭球叠加
export function cloudTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size / 2;
  const ctx = canvas.getContext('2d');
  const blob = (x, y, r, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.65, `rgba(255,252,245,${a * 0.55})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  blob(size * 0.32, size * 0.3, size * 0.2, 0.85);
  blob(size * 0.5, size * 0.26, size * 0.24, 0.9);
  blob(size * 0.68, size * 0.32, size * 0.18, 0.8);
  blob(size * 0.44, size * 0.4, size * 0.22, 0.7);
  blob(size * 0.6, size * 0.42, size * 0.16, 0.6);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function jitterGeometry(geo, amount, seedFn = Math.random) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i,
      pos.getX(i) + (seedFn() - 0.5) * amount,
      pos.getY(i) + (seedFn() - 0.5) * amount,
      pos.getZ(i) + (seedFn() - 0.5) * amount);
  }
  geo.computeVertexNormals();
  return geo;
}
