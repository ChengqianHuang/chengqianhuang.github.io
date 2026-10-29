import { WIDTH, HEIGHT, TAU } from './neon-engine.mjs';

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
const MAX_PARTICLES = 65536;
const MAX_SHAPES = 16384;
const FULLSCREEN_VS = `#version 300 es
precision highp float;
out vec2 vUV;
void main(){
  vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));
  vUV=p;gl_Position=vec4(p*2.0-1.0,0.0,1.0);
}`;
const WORLD_HEADER = `#version 300 es
precision highp float;
uniform vec2 uWorld;
uniform vec2 uShake;
vec4 clip(vec2 p){p+=uShake;return vec4(p.x/uWorld.x*2.0-1.0,1.0-p.y/uWorld.y*2.0,0.0,1.0);}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || 'Shader compilation failed');
  }
  return shader;
}
function link(gl, vs, fs) {
  const program = gl.createProgram();
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, v); gl.attachShader(program, f); gl.linkProgram(program);
  gl.deleteShader(v); gl.deleteShader(f);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
  return program;
}
function uniformMap(gl, program) {
  const result = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    result[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name);
  }
  return result;
}
const colorCache = new Map();
function color(value = '#ffffff') {
  if (!colorCache.has(value)) {
    const n = parseInt(value.slice(1), 16);
    colorCache.set(value, [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]);
  }
  return colorCache.get(value);
}

export class NeonRenderer {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    const gl = canvas.getContext('webgl2', {
      alpha: false, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    if (!gl) throw new Error('此游戏需要支持 WebGL 2 的浏览器。');
    this.gl = gl;
    this.extFloat = gl.getExtension('EXT_color_buffer_float');
    this.time = 0;
    this.lastTime = 0;
    this.damage = 0;
    this.flash = 0;
    this.shake = 0;
    this.pointer = { x: WIDTH / 2, y: HEIGHT / 2, active: false };
    this.shapes = new Float32Array(MAX_SHAPES * 12);
    this.shapeCount = 0;
    this.shockwaves = [];
    this.trail = [];
    this.lastTrail = 0;
    this.particles = new Float32Array(MAX_PARTICLES * 12);
    for (let i = 0; i < MAX_PARTICLES; i++) this.particles[i * 12 + 2] = -1000;
    this.particleCursor = 0;
    this.particleCount = 0;
    this.particleRanges = [];
    this.dirtyStart = -1;
    this.dirtyEnd = 0;
    this.nextTrailEmission = 0;
    this.initPrograms();
    this.initGeometry();
    this.initGrid();
    this.updateGrid(0);
    this.initTargets();
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
  }

  initPrograms() {
    const gl = this.gl;
    this.backgroundProgram = link(gl, FULLSCREEN_VS, `#version 300 es
precision highp float;
in vec2 vUV;out vec4 outColor;uniform float uTime;uniform vec2 uPlayer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.7;a*=.5;}return v;}
void main(){
 vec2 uv=vUV;vec2 p=(uv-.5)*vec2(1.78,1.0);
 float n=fbm(p*3.2+vec2(uTime*.015,-uTime*.009));
 float n2=fbm(p*5.0-vec2(uTime*.01,uTime*.013));
 vec3 col=vec3(.003,.005,.018);
 col+=vec3(.018,.008,.065)*pow(n,2.2)*1.8;
 col+=vec3(.0,.027,.04)*pow(n2,3.0)*1.4;
 vec2 starUV=uv*vec2(420.0,236.0);vec2 cell=floor(starUV);vec2 q=fract(starUV)-.5;
 float h=hash(cell);float star=(1.0-smoothstep(0.0,.055,length(q)))*step(.978,h);
 float twinkle=.45+.55*sin(uTime*(1.0+h*3.0)+h*90.0);
 col+=star*twinkle*mix(vec3(.2,.5,1.0),vec3(.8,.3,1.0),h)*1.4;
 float playerGlow=exp(-length(uv-uPlayer)*7.0)*.025;
 col+=vec3(.0,.35,.45)*playerGlow;
 outColor=vec4(col,1.0);
}`);
    this.gridProgram = link(gl, `${WORLD_HEADER}
layout(location=0) in vec3 aPos;out float vEnergy;
void main(){vEnergy=aPos.z;gl_Position=clip(aPos.xy);}`, `#version 300 es
precision highp float;in float vEnergy;out vec4 outColor;
void main(){vec3 c=mix(vec3(.015,.11,.19),vec3(.05,.85,1.0),clamp(vEnergy,0.0,1.0));outColor=vec4(c*(.55+vEnergy*1.7),1.0);}`);
    this.shapeProgram = link(gl, `${WORLD_HEADER}
layout(location=0) in vec2 aVertex;
layout(location=1) in vec4 aRect;
layout(location=2) in vec4 aStyle;
layout(location=3) in vec4 aColor;
out vec2 vP;out vec4 vColor;flat out vec2 vStyle;
void main(){
 float c=cos(aStyle.x),s=sin(aStyle.x);vec2 q=aVertex*aRect.zw;
 vec2 world=aRect.xy+mat2(c,-s,s,c)*q;
 vP=aVertex;vColor=aColor;vStyle=aStyle.yz;gl_Position=clip(world);
}`, `#version 300 es
precision highp float;
in vec2 vP;in vec4 vColor;flat in vec2 vStyle;out vec4 outColor;
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float sdTri(vec2 p){const float k=1.73205;p.x=abs(p.x)-.72;p.y=p.y+.42;if(p.x+k*p.y>0.0)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;p.x-=clamp(p.x,-1.44,0.0);return -length(p)*sign(p.y);}
float sdPoly(vec2 p,float n){float a=atan(p.x,p.y);float r=length(p);float sector=6.283185/n;return cos(floor(.5+a/sector)*sector-a)*r-.72;}
void main(){
 float shape=vStyle.x,fill=vStyle.y,d;
 if(shape<.5)d=length(vP)-.78;
 else if(shape<1.5)d=sdTri(vP);
 else if(shape<2.5)d=abs(vP.x)+abs(vP.y)-.86;
 else if(shape<3.5)d=sdBox(vP,vec2(.7));
 else if(shape<4.5)d=abs(length(vP)-.68)-.035;
 else d=sdPoly(vP,shape<5.5?5.0:6.0);
 float fw=max(fwidth(d),.008);float edge=1.0-smoothstep(fw,fw*2.2,abs(d));
 float body=(1.0-smoothstep(-fw,fw,d))*fill*.16;
 float a=max(edge,body)*vColor.a;if(a<.003)discard;
 float core=exp(-length(vP)*4.0)*fill*.22;
 outColor=vec4(vColor.rgb*(a*1.8+core*vColor.a),a);
}`);
    this.particleProgram = link(gl, `${WORLD_HEADER}
layout(location=0) in vec2 aVertex;
layout(location=1) in vec4 aPosLife;
layout(location=2) in vec4 aVelSize;
layout(location=3) in vec4 aColor;
uniform float uTime;out vec2 vP;out vec4 vColor;
void main(){
 float age=uTime-aPosLife.z;float life=aPosLife.w;
 if(age<0.0||age>life||life<=0.0){gl_Position=vec4(2.0,2.0,2.0,1.0);vP=vec2(0);vColor=vec4(0);return;}
 float t=age/life;float drag=max(aVelSize.z,.01);
 vec2 center=aPosLife.xy+aVelSize.xy*((1.0-exp(-drag*age))/drag);
 center.y+=22.0*age*age;center.x+=sin(age*8.0+aColor.a*20.0)*3.0*t;
 float size=aVelSize.w*(1.0-t*.8);float rot=aColor.a*6.283+age*4.0;
 float c=cos(rot),s=sin(rot);vec2 q=aVertex*vec2(size*.42,size*1.65);
 vP=aVertex;vColor=vec4(aColor.rgb,(1.0-t)*(1.0-t));gl_Position=clip(center+mat2(c,-s,s,c)*q);
}`, `#version 300 es
precision highp float;in vec2 vP;in vec4 vColor;out vec4 outColor;
void main(){float d=length(vP);float a=(1.0-smoothstep(.05,1.0,d))*vColor.a;if(a<.003)discard;outColor=vec4(vColor.rgb*a*2.2,a);}`);
    this.brightProgram = link(gl, FULLSCREEN_VS, `#version 300 es
precision highp float;in vec2 vUV;out vec4 outColor;uniform sampler2D uTexture;
void main(){vec3 c=texture(uTexture,vUV).rgb;float b=max(c.r,max(c.g,c.b));float w=smoothstep(.55,1.35,b);outColor=vec4(c*w,1.0);}`);
    this.blurProgram = link(gl, FULLSCREEN_VS, `#version 300 es
precision highp float;in vec2 vUV;out vec4 outColor;uniform sampler2D uTexture;uniform vec2 uDirection;
void main(){
 vec3 c=texture(uTexture,vUV).rgb*.227027;
 c+=texture(uTexture,vUV+uDirection*1.384615).rgb*.316216;
 c+=texture(uTexture,vUV-uDirection*1.384615).rgb*.316216;
 c+=texture(uTexture,vUV+uDirection*3.230769).rgb*.070270;
 c+=texture(uTexture,vUV-uDirection*3.230769).rgb*.070270;
 outColor=vec4(c,1.0);
}`);
    this.finalProgram = link(gl, FULLSCREEN_VS, `#version 300 es
precision highp float;in vec2 vUV;out vec4 outColor;
uniform sampler2D uScene;uniform sampler2D uBloom;uniform float uTime;uniform float uDamage;uniform float uFlash;uniform float uPulse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec2 uv=vUV;vec2 fromCenter=uv-.5;float aberration=.0012+uDamage*.012+uPulse*.004;
 vec2 shift=fromCenter*aberration;
 vec3 c=vec3(texture(uScene,uv+shift).r,texture(uScene,uv).g,texture(uScene,uv-shift).b);
 vec3 bloom=texture(uBloom,uv).rgb;c+=bloom*(1.25+uPulse*.8);
 float vignette=1.0-smoothstep(.25,.82,length(fromCenter*vec2(1.0,1.35)))*.72;
 c*=vignette;c+=vec3(.35,.8,1.0)*uFlash*.18;
 float damageEdge=smoothstep(.12,.72,length(fromCenter*vec2(1.0,1.25)));
 c+=vec3(.65,.008,.035)*uDamage*.14*damageEdge;
 float scan=.975+.025*sin(uv.y*1800.0+uTime*8.0);c*=scan;
 c+=(hash(uv*913.7+uTime)-.5)*.018;
 outColor=vec4(pow(aces(c),vec3(.4545)),1.0);
}`);
    for (const name of ['background', 'grid', 'shape', 'particle', 'bright', 'blur', 'final']) {
      const key = `${name}Program`;
      this[`${name}U`] = uniformMap(gl, this[key]);
    }
  }

  makeVAO() { const vao = this.gl.createVertexArray(); this.gl.bindVertexArray(vao); return vao; }
  buffer(data, usage = this.gl.STATIC_DRAW) {
    const gl = this.gl, buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return buffer;
  }
  attrib(location, size, stride, offset, divisor = 0) {
    const gl = this.gl;
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
    if (divisor) gl.vertexAttribDivisor(location, divisor);
  }

  initGeometry() {
    const gl = this.gl;
    this.quadBuffer = this.buffer(QUAD);
    this.shapeVAO = this.makeVAO();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer); this.attrib(0, 2, 8, 0);
    this.shapeBuffer = this.buffer(this.shapes.byteLength, gl.DYNAMIC_DRAW);
    this.attrib(1, 4, 48, 0, 1); this.attrib(2, 4, 48, 16, 1); this.attrib(3, 4, 48, 32, 1);
    this.particleVAO = this.makeVAO();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer); this.attrib(0, 2, 8, 0);
    this.particleBuffer = this.buffer(this.particles, gl.DYNAMIC_DRAW);
    this.attrib(1, 4, 48, 0, 1); this.attrib(2, 4, 48, 16, 1); this.attrib(3, 4, 48, 32, 1);
    this.screenVAO = this.makeVAO();
    gl.bindVertexArray(null);
  }

  initGrid() {
    const gl = this.gl;
    this.gridCols = 49; this.gridRows = 29;
    const count = this.gridCols * this.gridRows;
    this.gridBase = new Float32Array(count * 2);
    this.gridOffset = new Float32Array(count * 2);
    this.gridVelocity = new Float32Array(count * 2);
    this.gridData = new Float32Array(count * 3);
    for (let y = 0; y < this.gridRows; y++) for (let x = 0; x < this.gridCols; x++) {
      const i = y * this.gridCols + x;
      this.gridBase[i * 2] = x * WIDTH / (this.gridCols - 1);
      this.gridBase[i * 2 + 1] = y * HEIGHT / (this.gridRows - 1);
    }
    const indices = [];
    for (let y = 0; y < this.gridRows; y++) for (let x = 0; x < this.gridCols; x++) {
      const i = y * this.gridCols + x;
      if (x < this.gridCols - 1) indices.push(i, i + 1);
      if (y < this.gridRows - 1) indices.push(i, i + this.gridCols);
    }
    this.gridVAO = this.makeVAO();
    this.gridBuffer = this.buffer(this.gridData, gl.DYNAMIC_DRAW); this.attrib(0, 3, 12, 0);
    this.gridIndexBuffer = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gridIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
    this.gridIndexCount = indices.length;
    gl.bindVertexArray(null);
  }

  makeTarget(width, height) {
    const gl = this.gl;
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const internal = this.extFloat ? gl.RGBA16F : gl.RGBA8;
    const type = this.extFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, gl.RGBA, type, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('无法创建 HDR 渲染目标。');
    return { texture, fbo, width, height };
  }
  initTargets() {
    if (this.sceneTarget) for (const t of [this.sceneTarget, this.bloomA, this.bloomB]) {
      this.gl.deleteTexture(t.texture); this.gl.deleteFramebuffer(t.fbo);
    }
    const w = Math.max(2, this.canvas.width), h = Math.max(2, this.canvas.height);
    this.sceneTarget = this.makeTarget(w, h);
    this.bloomA = this.makeTarget(Math.max(2, w >> 1), Math.max(2, h >> 1));
    this.bloomB = this.makeTarget(Math.max(2, w >> 1), Math.max(2, h >> 1));
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rawW = rect.width * dpr, rawH = rect.height * dpr;
    const budgetScale = Math.min(1, Math.sqrt(2600000 / Math.max(1, rawW * rawH)));
    const w = Math.max(2, Math.round(rawW * budgetScale)), h = Math.max(2, Math.round(rawH * budgetScale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h; this.initTargets();
    }
  }

  setPointer(x, y, active) { this.pointer = { x, y, active }; }

  resetEffects() {
    this.shockwaves.length = 0;
    this.trail.length = 0;
    this.particleCursor = 0;
    this.particleCount = 0;
    this.particleRanges.length = 0;
    this.dirtyStart = -1;
    this.dirtyEnd = 0;
    this.damage = 0;
    this.flash = 0;
    this.shake = 0;
    this.nextTrailEmission = 0;
  }

  particle(x, y, vx, vy, life, rgb, size, drag = 2.5) {
    const index = this.particleCursor;
    if (this.dirtyStart < 0) { this.dirtyStart = index; this.dirtyEnd = index + 1; }
    else if (index === this.dirtyEnd) this.dirtyEnd++;
    else {
      this.particleRanges.push([this.dirtyStart, this.dirtyEnd]);
      this.dirtyStart = index; this.dirtyEnd = index + 1;
    }
    const i = index * 12, p = this.particles;
    p[i] = x; p[i + 1] = y; p[i + 2] = this.time; p[i + 3] = life;
    p[i + 4] = vx; p[i + 5] = vy; p[i + 6] = drag; p[i + 7] = size;
    p[i + 8] = rgb[0]; p[i + 9] = rgb[1]; p[i + 10] = rgb[2]; p[i + 11] = Math.random();
    this.particleCursor = (index + 1) % MAX_PARTICLES;
    this.particleCount = Math.max(this.particleCount, index + 1);
  }

  burst(x, y, rgb, count, speed = 300, size = 7, life = 0.8) {
    const actual = this.reducedMotion ? Math.ceil(count * 0.3) : count;
    for (let i = 0; i < actual; i++) {
      const a = Math.random() * TAU, s = speed * (0.15 + Math.random() * 0.85);
      this.particle(x, y, Math.cos(a) * s, Math.sin(a) * s, life * (0.45 + Math.random() * 0.8), rgb, size * (0.35 + Math.random()), 1.4 + Math.random() * 3);
    }
  }

  shockwave(x, y, rgb, maxR = 260, life = 0.65) {
    this.shockwaves.push({ x, y, rgb, maxR, life, birth: this.time });
  }

  gridImpulse(x, y, power = 300, radius = 260) {
    for (let i = 0; i < this.gridBase.length / 2; i++) {
      const dx = this.gridBase[i * 2] - x, dy = this.gridBase[i * 2 + 1] - y;
      const d = Math.hypot(dx, dy);
      if (d < radius && d > 1) {
        const f = (1 - d / radius) * power;
        this.gridVelocity[i * 2] += dx / d * f;
        this.gridVelocity[i * 2 + 1] += dy / d * f;
      }
    }
  }

  onEvent(e) {
    const rgb = color(e.color || (e.type === 'playerHit' ? '#ff315f' : '#62f6ff'));
    if (e.type === 'shot') {
      this.burst(e.x, e.y, color('#75faff'), 3, 100, 4, 0.22);
    } else if (e.type === 'hit') {
      this.burst(e.x, e.y, rgb, 7, 190, 5, 0.35);
      this.gridImpulse(e.x, e.y, 25, 70);
    } else if (e.type === 'explosion') {
      const s = e.size || 1;
      this.burst(e.x, e.y, rgb, Math.floor(42 * s), 360 * Math.sqrt(s), 8 * Math.sqrt(s), 0.9);
      this.shockwave(e.x, e.y, rgb, 170 * Math.sqrt(s), 0.55);
      this.gridImpulse(e.x, e.y, 260 * s, 230 * Math.sqrt(s));
      this.shake = Math.max(this.shake, 3.5 * s); this.flash = Math.max(this.flash, 0.12 * s);
    } else if (e.type === 'dash') {
      this.burst(e.x, e.y, color('#4ffaff'), 60, 430, 7, 0.55);
      this.gridImpulse(e.x, e.y, -240, 210); this.shake = Math.max(this.shake, 4);
    } else if (e.type === 'pulse') {
      this.burst(e.x, e.y, color('#9d7bff'), 420, 760, 10, 1.3);
      this.shockwave(e.x, e.y, color('#66faff'), 1050, 1.05);
      this.shockwave(e.x, e.y, color('#d361ff'), 760, 0.8);
      this.gridImpulse(e.x, e.y, 1400, 900); this.flash = 1; this.shake = 18;
    } else if (e.type === 'playerHit') {
      this.burst(e.x, e.y, rgb, 120, 540, 9, 0.85);
      this.gridImpulse(e.x, e.y, 600, 380); this.damage = 1; this.shake = 16;
    } else if (e.type === 'pickup') {
      this.burst(e.x, e.y, color(e.kind === 'health' ? '#74ff9a' : '#b378ff'), 16, 170, 5, 0.45);
    } else if (e.type === 'spawn') {
      this.shockwave(e.x, e.y, rgb, 90, 0.45);
    } else if (e.type === 'bossSpawn') {
      this.burst(e.x, Math.max(80, e.y), rgb, 260, 700, 12, 1.5);
      this.shockwave(e.x, Math.max(80, e.y), rgb, 850, 1.4); this.flash = 1; this.shake = 22;
    } else if (e.type === 'bossPhase') {
      this.burst(e.x, e.y, color(e.phase === 2 ? '#ff4bd8' : '#ff553d'), 300, 650, 11, 1.2);
      this.shockwave(e.x, e.y, rgb, 700, 1); this.gridImpulse(e.x, e.y, 1100, 800); this.flash = 1; this.shake = 20;
    } else if (e.type === 'laser') {
      this.shake = Math.max(this.shake, 6);
    } else if (e.type === 'victory') {
      this.flash = 1; this.shake = 24;
    }
  }

  addShape(x, y, rx, ry, rotation, rgb, shape = 0, fill = 0, alpha = 1) {
    if (this.shapeCount >= MAX_SHAPES) return;
    const i = this.shapeCount++ * 12, a = this.shapes;
    a[i] = x; a[i + 1] = y; a[i + 2] = rx; a[i + 3] = ry;
    a[i + 4] = rotation; a[i + 5] = shape; a[i + 6] = fill; a[i + 7] = 0;
    a[i + 8] = rgb[0]; a[i + 9] = rgb[1]; a[i + 10] = rgb[2]; a[i + 11] = alpha;
  }

  updateGrid(dt) {
    const n = this.gridBase.length / 2;
    for (let i = 0; i < n; i++) {
      for (let axis = 0; axis < 2; axis++) {
        const j = i * 2 + axis;
        this.gridVelocity[j] += (-this.gridOffset[j] * 38 - this.gridVelocity[j] * 5.8) * dt;
        this.gridOffset[j] += this.gridVelocity[j] * dt;
      }
      const energy = Math.min(1, Math.hypot(this.gridVelocity[i * 2], this.gridVelocity[i * 2 + 1]) / 210);
      this.gridData[i * 3] = this.gridBase[i * 2] + this.gridOffset[i * 2];
      this.gridData[i * 3 + 1] = this.gridBase[i * 2 + 1] + this.gridOffset[i * 2 + 1];
      this.gridData[i * 3 + 2] = energy;
    }
  }

  buildScene(game) {
    this.shapeCount = 0;
    const p = game.player, cyan = color('#65f7ff');
    const emitTrail = game.state === 'playing' && this.time >= this.nextTrailEmission;
    if (emitTrail) this.nextTrailEmission = this.time + 1 / 45;
    if (game.state === 'playing' && this.time - this.lastTrail > 0.018) {
      this.trail.push({ x: p.x, y: p.y, angle: p.angle, birth: this.time });
      this.lastTrail = this.time;
      if (this.trail.length > 28) this.trail.shift();
    }
    this.trail = this.trail.filter(t => this.time - t.birth < 0.48);
    for (const t of this.trail) {
      const a = (1 - (this.time - t.birth) / 0.48) * 0.2;
      this.addShape(t.x, t.y, 23, 23, t.angle + Math.PI / 2, cyan, 1, 0, a);
    }
    for (const wave of this.shockwaves) {
      const t = (this.time - wave.birth) / wave.life;
      if (t >= 0 && t < 1) this.addShape(wave.x, wave.y, wave.maxR * t, wave.maxR * t, 0, wave.rgb, 4, 0, (1 - t) * 1.2);
    }
    this.shockwaves = this.shockwaves.filter(w => this.time - w.birth < w.life);
    for (const h of game.hazards) {
      const active = h.telegraph <= 0;
      const length = h.length, x = h.x + Math.cos(h.angle) * length / 2, y = h.y + Math.sin(h.angle) * length / 2;
      this.addShape(x, y, length / 2, active ? h.width : 2, h.angle, color(active ? '#ff245f' : '#ff9e45'), 3, active ? 1 : 0, active ? 1.5 : 0.7 + Math.sin(this.time * 30) * 0.3);
    }
    for (const item of game.pickups) {
      const rgb = color(item.kind === 'health' ? '#6dff9a' : '#b679ff');
      const pulse = 1 + Math.sin(this.time * 8 + item.angle) * 0.18;
      this.addShape(item.x, item.y, 13 * pulse, 13 * pulse, item.angle, rgb, item.kind === 'health' ? 0 : 2, 1, Math.min(1, item.life));
      this.addShape(item.x, item.y, 22 * pulse, 22 * pulse, -item.angle, rgb, 4, 0, 0.35);
    }
    for (const b of game.bullets) {
      const a = Math.atan2(b.vy, b.vx), rgb = color(b.color);
      this.addShape(b.x - b.vx * 0.014, b.y - b.vy * 0.014, 22, 2.5, a, rgb, 3, 1, 0.5);
      this.addShape(b.x, b.y, 7, 7, 0, rgb, 0, 1, 1.0);
    }
    for (const b of game.enemyBullets) {
      const a = Math.atan2(b.vy, b.vx), rgb = color(b.color);
      this.addShape(b.x - b.vx * 0.018, b.y - b.vy * 0.018, 17, 3, a, rgb, 0, 1, 1.2);
      this.addShape(b.x, b.y, 11, 11, this.time * 3, rgb, 4, 0, 0.5);
    }
    for (const e of game.enemies) {
      const rgb = e.hit > 0 ? color('#ffffff') : color(e.color);
      const pulse = 1 + Math.sin(this.time * 5 + e.id) * 0.055;
      if (e.kind === 'chaser' || e.kind === 'shard') this.addShape(e.x, e.y, e.r * 1.35, e.r * 1.35, Math.atan2(e.vy, e.vx) + Math.PI / 2, rgb, 1, 1, 1);
      else if (e.kind === 'drifter') this.addShape(e.x, e.y, e.r * pulse, e.r * pulse, e.angle, rgb, 2, 1, 1);
      else if (e.kind === 'splitter') {
        this.addShape(e.x, e.y, e.r * pulse, e.r * pulse, e.angle, rgb, 3, 1, 1);
        this.addShape(e.x, e.y, e.r * .55, e.r * .55, -e.angle * 1.7, rgb, 3, 0, .7);
      } else if (e.kind === 'orbiter') {
        this.addShape(e.x, e.y, e.r * pulse, e.r * pulse, e.angle, rgb, 5, 1, 1);
        this.addShape(e.x, e.y, e.r * 1.55, e.r * 1.55, -e.angle, rgb, 4, 0, .25);
      } else if (e.kind === 'sniper') {
        this.addShape(e.x, e.y, e.r * 1.25, e.r * .85, e.angle, rgb, 1, 1, e.windup > 0 ? 1.8 : 1);
        if (e.windup > 0) this.addShape(e.x, e.y, e.r * 1.8, e.r * 1.8, 0, rgb, 4, 0, .7);
      } else if (e.kind === 'gravity') {
        this.addShape(e.x, e.y, e.r * 1.6 * pulse, e.r * 1.6 * pulse, e.angle, rgb, 4, 0, .9);
        this.addShape(e.x, e.y, e.r, e.r, -e.angle * 1.4, rgb, 6, 1, .9);
        this.addShape(e.x, e.y, e.r * .38, e.r * .38, 0, rgb, 0, 1, 1.5);
      } else if (e.kind === 'boss') {
        const bossColor = e.phase === 1 ? color('#ff436e') : e.phase === 2 ? color('#ff42dd') : color('#ff6b35');
        for (let ring = 0; ring < 3; ring++) {
          const r = e.r * (1.05 + ring * .38) * (1 + Math.sin(this.time * 3 + ring) * .05);
          this.addShape(e.x, e.y, r, r, e.angle * (ring % 2 ? -2 : 1) + ring, bossColor, ring === 1 ? 6 : 5, 0, .85 - ring * .14);
        }
        this.addShape(e.x, e.y, e.r * .67, e.r * .67, -e.angle * 2, rgb, 2, 1, 1.2);
        this.addShape(e.x, e.y, e.r * .28 * pulse, e.r * .28 * pulse, 0, color('#ffffff'), 0, 1, 1.5);
        for (let n = 0; n < e.phase + 1; n++) {
          const a = this.time * (1 + e.phase * .4) + n * TAU / (e.phase + 1);
          this.addShape(e.x + Math.cos(a) * e.r * 1.6, e.y + Math.sin(a) * e.r * 1.6, 9, 9, a, bossColor, 0, 1, 1.3);
        }
      }
      if (emitTrail && Math.hypot(e.vx, e.vy) > 80 && e.kind !== 'boss') this.particle(e.x, e.y, -e.vx * .15, -e.vy * .15, .28, rgb, e.r * .25, 3);
    }
    if (game.state !== 'gameover') {
      const alpha = p.invulnerable > 0 && Math.floor(this.time * 24) % 2 ? .25 : 1;
      this.addShape(p.x, p.y, 25, 25, p.angle + Math.PI / 2, p.hit > 0 ? color('#ff4b68') : cyan, 1, 1, alpha * 1.25);
      this.addShape(p.x, p.y, 13, 13, -this.time * 2, cyan, 4, 0, alpha * .75);
      if (p.dashCooldown <= 0) this.addShape(p.x, p.y, 33 + Math.sin(this.time * 6) * 3, 33 + Math.sin(this.time * 6) * 3, 0, cyan, 4, 0, .24);
      if (emitTrail && Math.hypot(p.vx, p.vy) > 45) this.particle(p.x - Math.cos(p.angle) * 13, p.y - Math.sin(p.angle) * 13, -p.vx * .3, -p.vy * .3, .35, cyan, 7, 3);
    }
    if (this.pointer.active && game.state === 'playing') {
      const r = 12 + Math.sin(this.time * 5) * 2;
      this.addShape(this.pointer.x, this.pointer.y, r, r, this.time, cyan, 4, 0, .65);
      this.addShape(this.pointer.x, this.pointer.y, 2.5, 2.5, 0, cyan, 0, 1, 1);
    }
    const border = color('#276bff');
    this.addShape(WIDTH / 2, 3, WIDTH / 2, 2, 0, border, 3, 1, .35);
    this.addShape(WIDTH / 2, HEIGHT - 3, WIDTH / 2, 2, 0, border, 3, 1, .35);
    this.addShape(3, HEIGHT / 2, 2, HEIGHT / 2, 0, border, 3, 1, .35);
    this.addShape(WIDTH - 3, HEIGHT / 2, 2, HEIGHT / 2, 0, border, 3, 1, .35);
  }

  bindTexture(texture, unit = 0) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, texture);
  }
  worldUniforms(program, uniforms, shakeX, shakeY) {
    const gl = this.gl;
    gl.useProgram(program); gl.uniform2f(uniforms.uWorld, WIDTH, HEIGHT); gl.uniform2f(uniforms.uShake, shakeX, shakeY);
  }

  render(game, visualTime = game.time) {
    const gl = this.gl;
    this.time = visualTime;
    const dt = Math.min(.033, Math.max(0, this.time - this.lastTime));
    this.lastTime = this.time;
    if (dt > 0) this.updateGrid(dt);
    this.damage *= Math.exp(-dt * 4.5); this.flash *= Math.exp(-dt * 5.5); this.shake *= Math.exp(-dt * 9);
    this.buildScene(game);
    const shakeAmount = this.reducedMotion || game.state === 'paused' ? 0 : this.shake;
    const sx = (Math.random() - .5) * shakeAmount, sy = (Math.random() - .5) * shakeAmount;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneTarget.fbo);
    gl.viewport(0, 0, this.sceneTarget.width, this.sceneTarget.height);
    gl.disable(gl.BLEND);
    gl.useProgram(this.backgroundProgram);
    gl.uniform1f(this.backgroundU.uTime, this.time);
    gl.uniform2f(this.backgroundU.uPlayer, game.player.x / WIDTH, 1 - game.player.y / HEIGHT);
    gl.bindVertexArray(this.screenVAO); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    this.worldUniforms(this.gridProgram, this.gridU, sx, sy);
    gl.bindVertexArray(this.gridVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gridData);
    gl.drawElements(gl.LINES, this.gridIndexCount, gl.UNSIGNED_INT, 0);
    this.worldUniforms(this.shapeProgram, this.shapeU, sx, sy);
    gl.bindVertexArray(this.shapeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shapeBuffer); gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.shapes.subarray(0, this.shapeCount * 12));
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.shapeCount);
    if (this.particleCount > 0) {
      this.worldUniforms(this.particleProgram, this.particleU, sx, sy);
      gl.uniform1f(this.particleU.uTime, this.time);
      gl.bindVertexArray(this.particleVAO);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
      if (this.dirtyStart >= 0) this.particleRanges.push([this.dirtyStart, this.dirtyEnd]);
      for (const [start, end] of this.particleRanges) {
        gl.bufferSubData(gl.ARRAY_BUFFER, start * 48, this.particles.subarray(start * 12, end * 12));
      }
      this.particleRanges.length = 0;
      this.dirtyStart = -1;
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.particleCount);
    }
    gl.disable(gl.BLEND);
    gl.bindVertexArray(this.screenVAO);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomA.fbo); gl.viewport(0, 0, this.bloomA.width, this.bloomA.height);
    gl.useProgram(this.brightProgram); this.bindTexture(this.sceneTarget.texture); gl.uniform1i(this.brightU.uTexture, 0); gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(this.blurProgram); gl.uniform1i(this.blurU.uTexture, 0);
    for (let i = 0; i < 4; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomB.fbo); this.bindTexture(this.bloomA.texture);
      gl.uniform2f(this.blurU.uDirection, (1.4 + i * .5) / this.bloomA.width, 0); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomA.fbo); this.bindTexture(this.bloomB.texture);
      gl.uniform2f(this.blurU.uDirection, 0, (1.4 + i * .5) / this.bloomA.height); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.finalProgram);
    this.bindTexture(this.sceneTarget.texture, 0); this.bindTexture(this.bloomA.texture, 1);
    gl.uniform1i(this.finalU.uScene, 0); gl.uniform1i(this.finalU.uBloom, 1);
    gl.uniform1f(this.finalU.uTime, this.time); gl.uniform1f(this.finalU.uDamage, this.damage);
    gl.uniform1f(this.finalU.uFlash, this.flash); gl.uniform1f(this.finalU.uPulse, Math.min(1, game.player.energy / 100) * .12 + (game.state === 'victory' ? .5 : 0));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }
}
