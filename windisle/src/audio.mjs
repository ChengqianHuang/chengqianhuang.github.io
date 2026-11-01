// 风屿 - 合成音效。全部 WebAudio 程序化生成，无音频文件。
export class AudioFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.master = null;
    this.windGain = null;
  }

  ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      this.startWind();
      return true;
    } catch { return false; }
  }

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? 0.5 : 0;
  }

  startWind() {
    // 环境风声：滤波噪声 + 缓慢起伏
    const ctx = this.ctx;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; data[i] = last * 3.5; }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 420; filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.13;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain); lfoGain.connect(gain.gain);
    src.connect(filter); filter.connect(gain); gain.connect(this.master);
    src.start(); lfo.start();
    this.windGain = gain;
  }

  tone({ freq = 440, dur = 0.15, type = 'sine', vol = 0.2, slide = 0, delay = 0 }) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain); gain.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  noise({ dur = 0.12, vol = 0.15, freq = 2000, q = 1, slideTo = 0, delay = 0 }) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t0 = ctx.currentTime + delay;
    const len = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.setValueAtTime(freq, t0); filter.Q.value = q;
    if (slideTo) filter.frequency.exponentialRampToValueAtTime(Math.max(60, slideTo), t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter); filter.connect(gain); gain.connect(this.master);
    src.start(t0);
  }

  // ---- 具体音效
  slash(stage) {
    this.noise({ dur: 0.1, vol: 0.16, freq: 2600 + stage * 700, slideTo: 700, q: 1.4 });
    this.tone({ freq: 620 + stage * 110, dur: 0.09, type: 'triangle', vol: 0.1, slide: -260 });
  }
  heavy() { this.noise({ dur: 0.24, vol: 0.24, freq: 900, slideTo: 200, q: 0.8 }); this.tone({ freq: 130, dur: 0.3, type: 'sine', vol: 0.3, slide: -60 }); }
  hit(blocked) {
    if (blocked) { this.tone({ freq: 1150, dur: 0.06, type: 'square', vol: 0.08 }); this.noise({ dur: 0.05, vol: 0.1, freq: 3200 }); }
    else { this.noise({ dur: 0.06, vol: 0.14, freq: 1800, q: 0.8 }); this.tone({ freq: 220, dur: 0.08, type: 'triangle', vol: 0.16, slide: -80 }); }
  }
  kill(boss) {
    if (boss) { this.tone({ freq: 90, dur: 0.7, type: 'sine', vol: 0.4, slide: -40 }); this.noise({ dur: 0.5, vol: 0.25, freq: 500, slideTo: 80 }); }
    else this.tone({ freq: 330, dur: 0.14, type: 'triangle', vol: 0.16, slide: -180 });
  }
  dash() { this.noise({ dur: 0.18, vol: 0.13, freq: 700, slideTo: 2400, q: 0.8 }); }
  blade() { this.tone({ freq: 880, dur: 0.16, type: 'sine', vol: 0.12, slide: 420 }); this.noise({ dur: 0.12, vol: 0.07, freq: 3600, slideTo: 1600 }); }
  burst() {
    this.tone({ freq: 160, dur: 0.5, type: 'sine', vol: 0.34, slide: 90 });
    this.noise({ dur: 0.5, vol: 0.2, freq: 1200, slideTo: 2600 });
    [523, 659, 784].forEach((f, i) => this.tone({ freq: f, dur: 0.3, type: 'triangle', vol: 0.1, delay: i * 0.06 }));
  }
  hurt() { this.tone({ freq: 150, dur: 0.22, type: 'sawtooth', vol: 0.2, slide: -70 }); this.noise({ dur: 0.12, vol: 0.12, freq: 500 }); }
  wave() { [392, 523, 659, 784].forEach((f, i) => this.tone({ freq: f, dur: 0.35, type: 'triangle', vol: 0.12, delay: i * 0.09 })); }
  bossPhase() { this.tone({ freq: 70, dur: 0.8, type: 'sine', vol: 0.4, slide: 30 }); this.noise({ dur: 0.4, vol: 0.2, freq: 300, slideTo: 90 }); }
  upgrade() { [523, 784, 1047].forEach((f, i) => this.tone({ freq: f, dur: 0.25, type: 'sine', vol: 0.12, delay: i * 0.07 })); }
  gameover() { [440, 349, 262, 196].forEach((f, i) => this.tone({ freq: f, dur: 0.5, type: 'triangle', vol: 0.14, delay: i * 0.22 })); }
  start() { [262, 392, 523].forEach((f, i) => this.tone({ freq: f, dur: 0.3, type: 'triangle', vol: 0.14, delay: i * 0.08 })); }
}
