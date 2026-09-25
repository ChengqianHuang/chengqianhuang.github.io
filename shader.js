// WebGL 极光背景：fbm 噪声流动带，鼠标交互，主题感知
// WebGL 不可用时给 <html> 加 .no-webgl，由 particles.js 接管 2D 粒子
(() => {
  const canvas = document.getElementById('shader-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) {
    document.documentElement.classList.add('no-webgl');
    return;
  }

  const VS = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0., 1.); }`;

  const FS = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dark;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * 3.2;
  float t = u_time * .07;
  vec2 m = (u_mouse / u_res - .5) * .8;

  float n  = fbm(p + vec2(t, -t * .6) + m);
  float n2 = fbm(p * 1.7 - vec2(t * 1.3, t) + n);

  vec3 cA = vec3(0.04, 0.42, 0.86);  // 蓝
  vec3 cB = vec3(0.58, 0.21, 0.92);  // 紫
  vec3 cC = vec3(0.10, 0.76, 0.70);  // 青
  vec3 col = mix(cA, cB, smoothstep(.3, .72, n));
  col = mix(col, cC, smoothstep(.55, .9, n2) * .55);

  float band = smoothstep(.42, .88, n2);
  float glow = band * (.22 + .16 * sin(uv.x * 5. + uv.y * 3. + u_time * .4));

  if (u_dark > .5) {
    gl_FragColor = vec4(col * glow, glow * .6);
  } else {
    gl_FragColor = vec4(mix(vec3(1.), col, .3 + .4 * glow), glow * .3);
  }
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VS);
  const fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { document.documentElement.classList.add('no-webgl'); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    document.documentElement.classList.add('no-webgl');
    return;
  }
  gl.useProgram(prog);

  // 全屏三角形
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uDark = gl.getUniformLocation(prog, 'u_dark');

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = innerHeight - e.clientY; });
  // WebGL 坐标系 y 向上，转换鼠标坐标

  let rafId = null;
  const t0 = performance.now();

  function frame() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.floor(innerWidth * dpr), h = Math.floor(innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x * dpr, mouse.y * dpr);
    gl.uniform1f(uDark, dark ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!rafId) frame();
  });
  // 主题切换时 shader 自动读取 data-theme，无需额外处理

  document.documentElement.classList.add('webgl');
  frame();
})();
