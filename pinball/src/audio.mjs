export class MechanicalAudio {
  constructor(){this.enabled=true;this.ctx=null;this.last=0;}
  wake(){try{this.ctx??=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}catch{}}
  tone(f,d=.1,type='sine',volume=.08,slide=1){
    const c=this.ctx;if(!this.enabled||!c||c.state!=='running')return;
    const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,c.currentTime);o.frequency.exponentialRampToValueAtTime(f*slide,c.currentTime+d);g.gain.setValueAtTime(volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.01);
  }
  play(e){
    if(e.type==='rail'){if(e.time-this.last<.05)return;this.last=e.time;this.tone(880,.035,'triangle',.025,.7);}
    if(e.type==='flipper'||e.type==='sling')this.tone(150,.07,'triangle',.12,.35);
    if(e.type==='bumper'){this.tone(440+e.value*.55,.19,'sine',.11,.96);this.tone(120,.05,'triangle',.07,.4);}
    if(e.type==='target'){this.tone(920,.3,'sine',.1,.98);this.tone(1380,.12,'sine',.035);}
    if(e.type==='gear')this.tone(310,.13,'triangle',.05,.6);
    if(e.type==='launch')this.tone(95,.16,'sawtooth',.025,5);
    if(e.type==='armed'||e.type==='multiball'||e.type==='ramp'){for(const f of [523,659,784])this.tone(f,.6,'sine',.045);}
    if(e.type==='drain')this.tone(170,.3,'triangle',.07,.3);
    if(e.type==='tilt')this.tone(90,.5,'sawtooth',.035,.6);
  }
}
