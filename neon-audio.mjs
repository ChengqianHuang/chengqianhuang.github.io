export class NeonAudio {
  constructor() {
    this.enabled = false;
    this.context = null;
    this.master = null;
    this.noiseBuffer = null;
    this.nextBeat = 0;
    this.beat = 0;
    this.lastShot = 0;
    this.lastHit = 0;
  }

  ensure() {
    if (this.context) return true;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return false;
    this.context = new Context();
    this.master = this.context.createGain();
    this.master.gain.value = 0.22;
    this.master.connect(this.context.destination);
    const length = this.context.sampleRate * 2;
    this.noiseBuffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    this.nextBeat = this.context.currentTime;
    return true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled && this.ensure()) {
      this.context.resume().catch(() => {});
      this.nextBeat = this.context.currentTime;
    }
    if (this.master && this.context) this.master.gain.setTargetAtTime(enabled ? 0.22 : 0, this.context.currentTime, 0.025);
  }

  tone(freq, duration, { type = 'sine', gain = 0.1, end = freq, when = 0, pan = 0 } = {}) {
    if (!this.enabled || !this.ensure()) return;
    const c = this.context, t = c.currentTime + when;
    const osc = c.createOscillator(), amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + duration);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.012, duration * 0.2));
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp);
    if (c.createStereoPanner) {
      const panner = c.createStereoPanner(); panner.pan.value = Math.max(-1, Math.min(1, pan));
      amp.connect(panner); panner.connect(this.master);
      osc.onended = () => { osc.disconnect(); amp.disconnect(); panner.disconnect(); };
    } else {
      amp.connect(this.master); osc.onended = () => { osc.disconnect(); amp.disconnect(); };
    }
    osc.start(t); osc.stop(t + duration + 0.02);
  }

  noise(duration, { gain = 0.1, frequency = 900, when = 0, pan = 0 } = {}) {
    if (!this.enabled || !this.ensure()) return;
    const c = this.context, t = c.currentTime + when;
    const source = c.createBufferSource(), filter = c.createBiquadFilter(), amp = c.createGain();
    source.buffer = this.noiseBuffer; filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = 0.7;
    amp.gain.setValueAtTime(gain, t); amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter); filter.connect(amp);
    if (c.createStereoPanner) {
      const panner = c.createStereoPanner(); panner.pan.value = Math.max(-1, Math.min(1, pan));
      amp.connect(panner); panner.connect(this.master);
      source.onended = () => { source.disconnect(); filter.disconnect(); amp.disconnect(); panner.disconnect(); };
    } else {
      amp.connect(this.master); source.onended = () => { source.disconnect(); filter.disconnect(); amp.disconnect(); };
    }
    source.start(t); source.stop(t + duration + 0.02);
  }

  onEvent(event) {
    if (!this.enabled) return;
    const pan = event.x == null ? 0 : event.x / 800 - 1;
    const now = this.context?.currentTime || 0;
    if (event.type === 'shot') {
      if (now - this.lastShot < 0.045) return;
      this.lastShot = now;
      this.tone(520, 0.055, { type: 'square', gain: 0.025, end: 170, pan });
    } else if (event.type === 'hit') {
      if (now - this.lastHit < 0.035) return;
      this.lastHit = now;
      this.tone(180, 0.045, { type: 'triangle', gain: 0.025, end: 80, pan });
    } else if (event.type === 'explosion') {
      const size = Math.min(4, event.size || 1);
      this.noise(0.22 + size * 0.09, { gain: 0.07 + size * 0.025, frequency: 500 / Math.sqrt(size), pan });
      this.tone(110, 0.2 + size * 0.08, { type: 'sawtooth', gain: 0.04, end: 35, pan });
    } else if (event.type === 'dash') {
      this.noise(0.18, { gain: 0.08, frequency: 1700 });
      this.tone(170, 0.18, { type: 'sine', gain: 0.09, end: 780 });
    } else if (event.type === 'pickup') {
      this.tone(event.kind === 'health' ? 620 : 880, 0.11, { gain: 0.06, end: 1320, pan });
    } else if (event.type === 'pulse') {
      [110, 165, 220, 330].forEach((f, i) => this.tone(f, 0.85, { type: 'sawtooth', gain: 0.055, end: f * 3, when: i * 0.025 }));
      this.noise(0.75, { gain: 0.14, frequency: 700 });
    } else if (event.type === 'playerHit') {
      this.noise(0.32, { gain: 0.16, frequency: 240 });
      this.tone(150, 0.38, { type: 'sawtooth', gain: 0.11, end: 38 });
    } else if (event.type === 'wave') {
      [220, 330, 440].forEach((f, i) => this.tone(f, 0.28, { type: 'triangle', gain: 0.07, when: i * 0.09 }));
    } else if (event.type === 'bossSpawn' || event.type === 'bossPhase') {
      [82, 82, 123].forEach((f, i) => this.tone(f, 0.38, { type: 'sawtooth', gain: 0.12, end: f * 0.75, when: i * 0.22 }));
    } else if (event.type === 'laser') {
      this.tone(90, 1.0, { type: 'sawtooth', gain: 0.07, end: 740 });
    } else if (event.type === 'victory') {
      [261.6, 329.6, 392, 523.2].forEach((f, i) => this.tone(f, 0.7, { type: 'triangle', gain: 0.09, when: i * 0.13 }));
    } else if (event.type === 'gameover') {
      [220, 174, 130, 82].forEach((f, i) => this.tone(f, 0.5, { type: 'sawtooth', gain: 0.07, when: i * 0.15 }));
    }
  }

  update(game) {
    if (!this.enabled || !this.context || game.state !== 'playing') {
      if (this.context) this.nextBeat = this.context.currentTime;
      return;
    }
    const boss = game.enemies.some(e => e.kind === 'boss');
    const bpm = boss ? 152 : 126 + game.wave * 6;
    const interval = 60 / bpm / 4;
    const roots = boss ? [55, 55, 65.4, 49] : [55, 65.4, 73.4, 49];
    if (this.nextBeat < this.context.currentTime - 0.15) {
      const missed = Math.max(0, Math.floor((this.context.currentTime - this.nextBeat) / interval));
      this.beat += missed;
      this.nextBeat = this.context.currentTime;
    }
    let scheduled = 0;
    while (this.nextBeat < this.context.currentTime + 0.12 && scheduled++ < 8) {
      const step = this.beat % 16;
      const root = roots[Math.floor(this.beat / 16) % roots.length];
      const when = Math.max(0, this.nextBeat - this.context.currentTime);
      if (step % 4 === 0) this.tone(125, 0.16, { type: 'sine', gain: 0.1, end: 38, when });
      if (step % 4 === 2) this.noise(0.055, { gain: 0.035, frequency: 4800, when });
      if (step % 2 === 0) {
        const note = root * [1, 1, 1.5, 1, 2, 1.5, 1, 1.25][(step / 2) % 8];
        this.tone(note, interval * 1.7, { type: 'sawtooth', gain: boss ? 0.045 : 0.03, end: note * 0.98, when });
      }
      if (boss && step % 2 === 1) this.tone(root * 4 * [1, 1.2, 1.5, 1.8][step % 4], interval * 0.8, { type: 'square', gain: 0.014, when });
      this.nextBeat += interval;
      this.beat++;
    }
  }
}
